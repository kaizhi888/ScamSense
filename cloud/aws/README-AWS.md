# AWS Real Cloud Setup (ap-southeast-5, Malaysia)

This folder contains the AWS Lambda code and a sample test event for the
ScamSense risk-event ingestion endpoint.

## What gets built on AWS

```
ScamSense client
      │
      ▼
Amazon API Gateway (HTTP API)   POST /risk-event
      │
      ▼
AWS Lambda (scamsense-risk-event)   Node.js 20.x
      │
      ▼
Amazon CloudWatch Logs              proof for judges
```

## Step-by-step

### 1. Create the Lambda function

1. Go to AWS Console → **Lambda** (region: **Asia Pacific (Malaysia) · ap-southeast-5**).
2. Click **Create function**.
3. Choose **Author from scratch**.
4. Name: `scamsense-risk-event`
5. Runtime: **Node.js 20.x**
6. Architecture: x86_64 (default).
7. Click **Create function**.

### 2. Paste the handler code

1. Open the function, go to the **Code** tab.
2. Replace the contents of `index.mjs` with the contents of [`lambda-risk-event.js`](./lambda-risk-event.js)
   (rename to `index.mjs` to keep ESM `export`s).
3. Click **Deploy**.

### 3. Test the Lambda directly (optional but useful)

1. **Test** tab → **Create new event** → name `scamsense-test`.
2. Paste contents of [`sample-event.json`](./sample-event.json) wrapped in an API Gateway v2 envelope:
   ```json
   {
     "requestContext": { "http": { "method": "POST" } },
     "body": "<paste sample-event.json as a string>"
   }
   ```
3. Click **Test**. You should see status `200` and the response JSON.
4. Open **CloudWatch Logs** → log group `/aws/lambda/scamsense-risk-event` → confirm a line
   starting with `ScamSense risk event:` exists.

### 4. Create the API Gateway HTTP API

1. AWS Console → **API Gateway** → **Create API** → **HTTP API** → **Build**.
2. Add integration: **Lambda** → select `scamsense-risk-event`.
3. API name: `scamsense-api`.
4. **Configure routes**:
   - Method: `POST`
   - Resource path: `/risk-event`
   - Integration target: `scamsense-risk-event`
5. **Configure stages**: keep `$default` (auto-deploy).
6. **CORS** (under API → CORS):
   - Access-Control-Allow-Origin: `*`
   - Access-Control-Allow-Headers: `Content-Type`
   - Access-Control-Allow-Methods: `POST`, `OPTIONS`
7. Click **Create**.
8. Copy the **Invoke URL** — looks like:
   `https://abc123xyz.execute-api.ap-southeast-5.amazonaws.com`
9. Your endpoint is `https://...amazonaws.com/risk-event`.

### 5. Wire it into ScamSense

In `.env.local` at the project root:

```bash
AWS_RISK_API_URL=https://abc123xyz.execute-api.ap-southeast-5.amazonaws.com/risk-event
AWS_REGION=ap-southeast-5
```

Restart `npm run dev`. Open the app → click **Test Cloud** → AWS card should turn
**Connected** with a real `awsRequestId`.

### 6. Demo proof for judges

- ✅ API Gateway route `/risk-event` exists in `scamsense-api`
- ✅ Lambda function `scamsense-risk-event` exists, runtime Node.js 20.x
- ✅ CloudWatch log group `/aws/lambda/scamsense-risk-event` shows `ScamSense risk event:` lines
  with the actual `awsRequestId` returned to the frontend
- ✅ Frontend cloud verification screen displays the same `awsRequestId` and `processedAt` timestamp

### Production notes

- For production, restrict `Access-Control-Allow-Origin` to your domain.
- Add API key or IAM auth instead of public access.
- Add reserved concurrency to prevent cost runaway.
- Forward CloudWatch logs to an S3 bucket or OpenSearch for long-term retention.
