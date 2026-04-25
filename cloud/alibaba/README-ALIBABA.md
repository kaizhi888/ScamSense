# Alibaba Cloud Real Setup

ScamSense supports **two paths** for real Alibaba Cloud integration. Pick the
one your RAM role can actually use:

| Path | When to use | Service |
|---|---|---|
| **A. OSS (recommended)** | Default. Works with the limited `finhackuser71` RAM role. | Object Storage Service |
| **B. Function Compute** | If your role/account has Function Compute fully enabled. | Function Compute + HTTP Trigger |

Both paths produce verifiable evidence in the Alibaba Cloud Console.

---

## Path A · OSS (Object Storage Service) — recommended

This path was explicitly chosen because your account has **OSS** in
**Recently visited** in the Alibaba console.

### 1. Create the bucket

1. Alibaba Cloud Console → **Object Storage Service** → **Buckets** → **Create Bucket**.
2. Bucket name: `scamsense-demo-risk-events` (must be globally unique — adjust if taken).
3. Region: **Asia Pacific SE 3 (Kuala Lumpur)** → endpoint `oss-ap-southeast-3.aliyuncs.com`.
   (Singapore `oss-ap-southeast-1` also works.)
4. Storage Class: **Standard**.
5. ACL: **Private** (do not allow public reads — risk metadata is private).
6. Click **Create**.

### 2. Create an AccessKey for your RAM user

1. Top-right avatar → **AccessKey Management**.
2. Click **Create AccessKey**.
3. **Copy the AccessKey ID and Secret** — you can't see the secret again.
4. (Optional but recommended) Use a RAM sub-user dedicated to ScamSense with
   only `oss:PutObject` and `oss:GetObject` on this bucket.

### 3. Wire credentials into ScamSense

In `.env.local` at the project root:

```bash
ALIBABA_OSS_REGION=oss-ap-southeast-3
ALIBABA_OSS_BUCKET=scamsense-demo-risk-events
ALIBABA_OSS_ACCESS_KEY_ID=LTAI...your-key
ALIBABA_OSS_ACCESS_KEY_SECRET=your-secret
# Leave Function Compute URL empty so the API route uses OSS:
ALIBABA_FRAUD_API_URL=
```

Restart `npm run dev`.

### 4. Test it

1. Open ScamSense → click **Test Cloud** (Home or Cloud screen).
2. The Alibaba card should turn **Connected** and show:
   - `service: OSS → Anonymized Risk Event Storage`
   - `bucket: scamsense-demo-risk-events`
   - `objectKey: risk-events/scamsense-...`
3. Open the Alibaba console → **OSS** → bucket → folder `risk-events/`.
   You should see a JSON object with the same `eventId`.
4. Click the object → **Object details** → confirm the user metadata:
   `event-id`, `risk-level`, `risk-score`.

### 5. Demo proof for judges

- ✅ OSS bucket `scamsense-demo-risk-events` exists in `ap-southeast-3`.
- ✅ Folder `risk-events/` contains JSON objects, one per Test Cloud click.
- ✅ The `objectKey` shown in the ScamSense UI matches the one in OSS.
- ✅ User metadata on each object shows the same risk score / level seen in the UI.

---

## Path B · Function Compute (alternative)

Skip this section if Path A worked. Only use this if your RAM role has full
Function Compute access.

### 1. Create the service & function

1. Alibaba Cloud Console → **Function Compute** (region: ap-southeast-3 KL).
2. Create service: `scamsense-fraud`.
3. Create function:
   - Name: `fraud-enrichment`
   - Runtime: **Node.js 18**
   - Handler: `index.handler`
4. Replace `index.js` contents with [`function-fraud-enrichment.js`](./function-fraud-enrichment.js)
   (rename to `index.js`).
5. **Deploy**.

### 2. Add the HTTP trigger

1. Function → **Triggers** tab → **Create Trigger**.
2. Type: **HTTP Trigger**.
3. Auth: **anonymous** (for demo only — production must require auth).
4. Methods: `POST`, `OPTIONS`.
5. Save and copy the **Trigger URL** (e.g. `https://....fcapp.run`).

### 3. Wire URL into ScamSense

```bash
ALIBABA_FRAUD_API_URL=https://your-function-id.fcapp.run
# (Leave OSS keys set as backup, but FC takes priority when this URL is set.)
```

Restart `npm run dev`.

### 4. Test it

- ScamSense Test Cloud → Alibaba card now shows
  `service: Function Compute → Fraud Rule Enrichment` and a real `requestId`.
- Open **Function Compute** → function logs → confirm a line starting with
  `ScamSense Alibaba fraud enrichment:` for the same `eventId`.

---

## Privacy guarantees

The API route at `src/app/api/test-cloud/route.ts` rejects any payload
containing audio/transcript fields **before** any cloud call is made. Both
the Lambda function and the Function Compute function additionally enforce
the same rule. OSS objects only store the same anonymized JSON.

Production hardening checklist:

- [ ] Restrict CORS origin to your domain.
- [ ] Replace anonymous auth with API key / signed URLs.
- [ ] Set bucket ACL to private and add a lifecycle rule (e.g. delete after 90 days).
- [ ] Use a dedicated RAM sub-user with least-privilege policies.
- [ ] Forward function logs to **SLS (Log Service)** for retention.
