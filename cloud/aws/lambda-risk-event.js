/**
 * ScamSense — AWS Lambda function: risk-event ingestion
 *
 * Runtime: Node.js 20.x (or 18.x)
 * Region:  ap-southeast-5 (Asia Pacific, Malaysia)
 *
 * Triggered by: Amazon API Gateway HTTP API, route POST /risk-event
 *
 * Receives anonymized risk metadata from a ScamSense client, validates it,
 * logs it to CloudWatch Logs, and returns an enriched response.
 *
 * Audio and full transcript are NEVER sent to this function — the client
 * only forwards risk metadata.
 */

export const handler = async (event, context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST",
    "Content-Type": "application/json"
  };

  // Handle CORS preflight
  const method = event.requestContext?.http?.method || event.httpMethod;
  if (method === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  try {
    const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;

    if (!body || typeof body.riskScore !== "number") {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          provider: "AWS",
          status: "error",
          message: "Invalid payload. riskScore is required."
        })
      };
    }

    // Reject any payload that mistakenly contains audio/transcript
    const banned = ["audio", "audioBase64", "transcript", "fullTranscript"];
    for (const k of banned) {
      if (k in body) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            provider: "AWS",
            status: "error",
            message: `Forbidden field: ${k}. Audio/transcript must stay on-device.`
          })
        };
      }
    }

    const response = {
      provider: "AWS",
      region: process.env.AWS_REGION || "ap-southeast-5",
      service: "API Gateway → Lambda → CloudWatch",
      status: "processed",
      message: "Risk event received and logged in AWS CloudWatch.",
      eventId: body.eventId || "unknown-event",
      riskScore: body.riskScore,
      riskLevel: body.riskLevel,
      reasonCodes: body.reasonCodes || [],
      audioShared: body.audioShared === true,
      transcriptShared: body.transcriptShared === true,
      awsRequestId: context.awsRequestId,
      processedAt: new Date().toISOString()
    };

    // CloudWatch log line — searchable proof for judges
    console.log(
      "ScamSense risk event:",
      JSON.stringify({
        ...body,
        processedBy: "AWS Lambda",
        awsRequestId: context.awsRequestId,
        processedAt: response.processedAt
      })
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.error("ScamSense AWS Lambda error:", error);

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        provider: "AWS",
        status: "error",
        message: "Failed to process risk event.",
        error: error.message
      })
    };
  }
};
