import type { RiskCloudPayload } from "@/data/cloudPayload";

export type CloudResult<T = Record<string, unknown>> =
  | { ok: true; data: T; latencyMs: number }
  | { ok: false; error: string; latencyMs: number };

export type DualCloudResponse = {
  aws: CloudResult;
  alibaba: CloudResult;
};

/**
 * Calls the Next.js /api/test-cloud route which proxies to the real
 * AWS API Gateway and Alibaba Function Compute / OSS endpoints.
 *
 * The proxy is used so we can:
 *  - keep cloud secrets server-side (no exposure to browser)
 *  - centralise CORS handling
 *  - return a clean DualCloudResponse to the UI
 */
export async function sendRiskEventToCloud(
  payload: RiskCloudPayload
): Promise<DualCloudResponse> {
  try {
    const res = await fetch("/api/test-cloud", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      return {
        aws: { ok: false, error: `Proxy error: ${res.status} ${text}`, latencyMs: 0 },
        alibaba: { ok: false, error: `Proxy error: ${res.status} ${text}`, latencyMs: 0 }
      };
    }

    const data = (await res.json()) as DualCloudResponse;
    return data;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown network error";
    return {
      aws: { ok: false, error: msg, latencyMs: 0 },
      alibaba: { ok: false, error: msg, latencyMs: 0 }
    };
  }
}

/**
 * Direct callers (used inside the API route on the server side).
 * Each handles errors gracefully and times the round-trip.
 */
export async function callAwsDirect(
  url: string,
  payload: RiskCloudPayload
): Promise<CloudResult> {
  const start = Date.now();
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cache: "no-store" as any
    });
    const latencyMs = Date.now() - start;
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `AWS HTTP ${res.status}: ${text.slice(0, 200)}`, latencyMs };
    }
    const data = await res.json();
    return { ok: true, data, latencyMs };
  } catch (err) {
    const latencyMs = Date.now() - start;
    const msg = err instanceof Error ? err.message : "Unknown AWS error";
    return { ok: false, error: msg, latencyMs };
  }
}

export async function callAlibabaDirect(
  url: string,
  payload: RiskCloudPayload
): Promise<CloudResult> {
  const start = Date.now();
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cache: "no-store" as any
    });
    const latencyMs = Date.now() - start;
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Alibaba HTTP ${res.status}: ${text.slice(0, 200)}`, latencyMs };
    }
    const data = await res.json();
    return { ok: true, data, latencyMs };
  } catch (err) {
    const latencyMs = Date.now() - start;
    const msg = err instanceof Error ? err.message : "Unknown Alibaba error";
    return { ok: false, error: msg, latencyMs };
  }
}
