# Alibaba OSS Fallback — How the ScamSense API route uses it

The Next.js `/api/test-cloud` route automatically uses the **OSS upload path**
when `ALIBABA_FRAUD_API_URL` is empty. This is the recommended path because:

1. Your RAM role (`AliyunReservedSSO-Developers/finhackuser71`) has OSS access
   in **Recently visited**, but Function Compute may be locked.
2. OSS upload produces an auditable **bucket + object key** that judges can
   open in the Alibaba console.
3. The OSS SDK (`ali-oss`) runs server-side in the Next.js API route, so
   credentials never leave the server.

## What the API route does

For every test:

```ts
const objectKey = `risk-events/${payload.eventId}.json`;
await client.put(objectKey, Buffer.from(JSON.stringify(payload)), {
  mime: "application/json",
  headers: {
    "x-oss-meta-event-id": payload.eventId,
    "x-oss-meta-risk-level": payload.riskLevel,
    "x-oss-meta-risk-score": String(payload.riskScore)
  }
});
```

The frontend receives an object like:

```json
{
  "provider": "Alibaba Cloud",
  "region": "oss-ap-southeast-3",
  "service": "OSS → Anonymized Risk Event Storage",
  "status": "stored",
  "message": "Anonymized risk event stored in Alibaba OSS.",
  "eventId": "scamsense-1q2w3e",
  "bucket": "scamsense-demo-risk-events",
  "objectKey": "risk-events/scamsense-1q2w3e.json",
  "url": "https://scamsense-demo-risk-events.oss-ap-southeast-3.aliyuncs.com/risk-events/...",
  "requestId": "5F1B...",
  "processedAt": "2026-04-25T10:30:00.000Z"
}
```

## Demo proof for judges

1. In the ScamSense UI, click **Test Cloud** → Alibaba card shows **Connected**.
2. Open Alibaba Console → **Object Storage Service** → bucket `scamsense-demo-risk-events`
   → folder `risk-events/` → click any object → **Object details** shows the
   exact `eventId`, `risk-score`, `risk-level` in user metadata.
3. Compare the `objectKey` shown in the ScamSense UI with the file in OSS — they match.

## Privacy

- Only anonymized risk metadata is uploaded.
- The API route rejects any payload that contains `audio`, `audioBase64`,
  `transcript`, or `fullTranscript` fields before reaching OSS.
- Bucket should be set to **private** ACL — no public reads.
