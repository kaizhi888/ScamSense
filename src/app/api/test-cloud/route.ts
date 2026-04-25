import { NextResponse } from "next/server";
import OSS from "ali-oss";
import type { RiskCloudPayload } from "@/data/cloudPayload";
import type { CloudResult, DualCloudResponse } from "@/lib/cloudClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * /api/test-cloud
 *
 * Server-side proxy that fans out to:
 *   1. AWS API Gateway → Lambda (real)
 *   2. Alibaba OSS upload (real, preferred for restricted RAM roles)
 *      OR Alibaba Function Compute HTTP trigger if ALIBABA_FRAUD_API_URL is set
 *
 * Returns a uniform DualCloudResponse the UI can render directly.
 *
 * Only forwards anonymized risk metadata. Audio and transcript never reach
 * this server route — the client never sends them.
 */

export async function POST(req: Request) {
  let payload: RiskCloudPayload;
  try {
    payload = (await req.json()) as RiskCloudPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Reject any payload that mistakenly contains audio/transcript fields.
  const banned = ["audio", "audioBase64", "transcript", "fullTranscript", "rawTranscript"];
  for (const key of banned) {
    if (key in payload) {
      return NextResponse.json(
        { error: `Forbidden field in payload: ${key}. Audio/transcript must stay on-device.` },
        { status: 400 }
      );
    }
  }

  const [aws, alibaba] = await Promise.all([callAws(payload), callAlibaba(payload)]);

  const response: DualCloudResponse = { aws, alibaba };
  return NextResponse.json(response, {
    status: 200,
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

async function callAws(payload: RiskCloudPayload): Promise<CloudResult> {
  const url = process.env.AWS_RISK_API_URL;
  if (!url) {
    return {
      ok: false,
      error: "AWS_RISK_API_URL not configured. See cloud/aws/README-AWS.md.",
      latencyMs: 0
    };
  }

  const start = Date.now();
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store"
    });
    const latencyMs = Date.now() - start;
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        error: `AWS HTTP ${res.status}: ${text.slice(0, 200) || res.statusText}`,
        latencyMs
      };
    }
    const data = await res.json();
    return { ok: true, data, latencyMs };
  } catch (err) {
    const latencyMs = Date.now() - start;
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown AWS error",
      latencyMs
    };
  }
}

async function callAlibaba(payload: RiskCloudPayload): Promise<CloudResult> {
  // Prefer Function Compute if URL is configured
  const fcUrl = process.env.ALIBABA_FRAUD_API_URL;
  if (fcUrl) {
    return callAlibabaFunctionCompute(fcUrl, payload);
  }

  // Otherwise use OSS upload path (works with restricted RAM roles)
  return callAlibabaOss(payload);
}

async function callAlibabaFunctionCompute(
  url: string,
  payload: RiskCloudPayload
): Promise<CloudResult> {
  const start = Date.now();
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store"
    });
    const latencyMs = Date.now() - start;
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        error: `Alibaba FC HTTP ${res.status}: ${text.slice(0, 200) || res.statusText}`,
        latencyMs
      };
    }
    const data = await res.json();
    return { ok: true, data, latencyMs };
  } catch (err) {
    const latencyMs = Date.now() - start;
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown Alibaba FC error",
      latencyMs
    };
  }
}

async function callAlibabaOss(payload: RiskCloudPayload): Promise<CloudResult> {
  const region = process.env.ALIBABA_OSS_REGION;
  const bucket = process.env.ALIBABA_OSS_BUCKET;
  const accessKeyId = process.env.ALIBABA_OSS_ACCESS_KEY_ID;
  const accessKeySecret = process.env.ALIBABA_OSS_ACCESS_KEY_SECRET;

  if (!region || !bucket || !accessKeyId || !accessKeySecret) {
    return {
      ok: false,
      error:
        "Alibaba OSS not configured (need ALIBABA_OSS_REGION, BUCKET, ACCESS_KEY_ID, ACCESS_KEY_SECRET). See cloud/alibaba/README-ALIBABA.md.",
      latencyMs: 0
    };
  }

  const start = Date.now();
  try {
    const client = new OSS({
      region,
      bucket,
      accessKeyId,
      accessKeySecret,
      secure: true
    });

    const objectKey = `risk-events/${payload.eventId}.json`;
    const body = Buffer.from(JSON.stringify(payload, null, 2), "utf-8");

    const result = await client.put(objectKey, body, {
      mime: "application/json",
      headers: {
        "Cache-Control": "no-store",
        "x-oss-meta-event-id": payload.eventId,
        "x-oss-meta-risk-level": payload.riskLevel,
        "x-oss-meta-risk-score": String(payload.riskScore)
      }
    });

    const latencyMs = Date.now() - start;
    return {
      ok: true,
      latencyMs,
      data: {
        provider: "Alibaba Cloud",
        region,
        service: "OSS → Anonymized Risk Event Storage",
        status: "stored",
        message: "Anonymized risk event stored in Alibaba OSS.",
        eventId: payload.eventId,
        bucket,
        objectKey,
        url: result.url,
        // ETag returned by OSS acts as proof / requestId
        requestId:
          (result.res?.headers as Record<string, string> | undefined)?.["x-oss-request-id"] ||
          result.name,
        processedAt: new Date().toISOString()
      }
    };
  } catch (err) {
    const latencyMs = Date.now() - start;
    const msg = err instanceof Error ? err.message : "Unknown OSS error";
    return { ok: false, error: `OSS upload failed: ${msg}`, latencyMs };
  }
}
