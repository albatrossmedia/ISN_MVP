# Security Hardening

- **Transport:** TLS everywhere. Use mTLS between internal services.
- **Auth:** OAuth2 client credentials or scoped API keys.
- **Scopes:** `jobs.read`, `jobs.write`, `datasets.write`, `billing.read`, `admin.*`.
- **Rate Limits:** token-bucket per tenant (RPM, burst, concurrency). Short-job bias to protect realtime.
- **Webhooks:** HMAC-SHA256 signatures; replay protection with `id` + `timestamp`.
- **Object Access:** presigned URLs only. No public buckets.
- **PII & License:** block non-compliant datasets. Consent evidence required for voice with biometric risk.
- **Secrets:** environment variables managed in Vault/Secret Manager or K8s Secrets.
- **Audit:** write all admin actions and dataset changes to `audits` table.
