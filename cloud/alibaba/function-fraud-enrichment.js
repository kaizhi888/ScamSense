/**
 * ScamSense — Alibaba Cloud Function Compute: fraud rule enrichment
 *
 * Runtime: Node.js 18 (or 16)
 * Trigger: HTTP trigger (POST /), public/anonymous OK for demo
 *
 * Receives anonymized risk metadata, classifies the fraud category from
 * reason codes, returns an enriched response. Audio + transcript never
 * reach this function.
 *
 * NOTE: If your Alibaba RAM role doesn't include Function Compute access,
 * use the OSS fallback path documented in oss-fallback-notes.md and
 * README-ALIBABA.md. The Next.js /api/test-cloud route already supports
 * the OSS path automatically when ALIBABA_FRAUD_API_URL is empty.
 */

exports.handler = async function (event, context, callback) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST",
    "Content-Type": "application/json"
  };

  try {
    // Function Compute HTTP trigger may pass a Buffer or a stringified event
    let raw = event;
    if (Buffer.isBuffer(event)) raw = event.toString();

    let method = "POST";
    let body = {};

    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.body !== undefined) {
          body = typeof parsed.body === "string" ? JSON.parse(parsed.body) : parsed.body;
          method = parsed.httpMethod || parsed.method || "POST";
        } else {
          body = parsed;
        }
      } catch {
        body = {};
      }
    } else if (raw && typeof raw === "object") {
      body = raw.body
        ? typeof raw.body === "string"
          ? JSON.parse(raw.body)
          : raw.body
        : raw;
      method = raw.httpMethod || raw.method || method;
    }

    if (method === "OPTIONS") {
      callback(null, { statusCode: 204, headers: corsHeaders, body: "" });
      return;
    }

    if (!body || typeof body.riskScore !== "number") {
      callback(null, {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          provider: "Alibaba Cloud",
          status: "error",
          message: "Invalid payload. riskScore is required."
        })
      });
      return;
    }

    // Forbidden audio/transcript fields
    const banned = ["audio", "audioBase64", "transcript", "fullTranscript"];
    for (const k of banned) {
      if (k in body) {
        callback(null, {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            provider: "Alibaba Cloud",
            status: "error",
            message: `Forbidden field: ${k}. Audio/transcript must stay on-device.`
          })
        });
        return;
      }
    }

    const reasonCodes = body.reasonCodes || [];
    let fraudCategory = "General Suspicious Transfer";

    if (reasonCodes.includes("AUTHORITY_IMPERSONATION")) {
      fraudCategory = "Authority Impersonation Scam";
    }
    if (reasonCodes.includes("ACCOUNT_FREEZE_THREAT")) {
      fraudCategory = "Account Freeze Threat Scam";
    }
    if (reasonCodes.includes("MONEY_LAUNDERING_CLAIM")) {
      fraudCategory = "Fake Money Laundering Investigation Scam";
    }

    const response = {
      provider: "Alibaba Cloud",
      region: process.env.ALIBABA_REGION || "ap-southeast-3",
      service: "Function Compute → Fraud Rule Enrichment",
      status: "enriched",
      message: "Risk event enriched with fraud-pattern rules.",
      eventId: body.eventId || "unknown-event",
      riskScore: body.riskScore,
      riskLevel: body.riskLevel,
      fraudCategory,
      recommendedAction: "Block transfer and warn user.",
      audioShared: body.audioShared === true,
      transcriptShared: body.transcriptShared === true,
      requestId: context.requestId || "fc-request",
      processedAt: new Date().toISOString()
    };

    console.log(
      "ScamSense Alibaba fraud enrichment:",
      JSON.stringify({
        ...body,
        processedBy: "Alibaba Function Compute",
        requestId: response.requestId,
        fraudCategory,
        processedAt: response.processedAt
      })
    );

    callback(null, {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(response)
    });
  } catch (error) {
    console.error("ScamSense Alibaba Function error:", error);
    callback(null, {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        provider: "Alibaba Cloud",
        status: "error",
        message: "Failed to enrich risk event.",
        error: error.message
      })
    });
  }
};
