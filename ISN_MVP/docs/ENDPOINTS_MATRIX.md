# ISN Endpoint Matrix (v8.3)

## Client Edition (Public)
- POST `/auth/token` — OAuth2 client credentials. Returns JWT.
- POST `/models/run` — Submit audio job (supports `input.url` or presigned upload).
- GET  `/jobs/status?job_id=...` — Current status + partial progress.
- POST `/feedback/submit` — Rating, comments, emotion alignment score.
- GET  `/billing/usage?tenant_id=...` — Minutes & cost split (ISN/Whisper/Google).
- Webhooks: We POST to client’s endpoint when job completes.

## Developer / Internal (Private)
- **Scheduler/Jobs:** `/scheduler/route`, `/jobs/segments`, `/jobs/segments/merge`, `/jobs/dlq`, `/jobs/replay_dlq`
- **Models/MDMS:** `/models/register`, `/models/metrics`, `/mdms/datasets/register`, `/mdms/datasets/score`
- **Compliance:** `/compliance/license-matrix/sync`, `/compliance/consent-artifacts`
- **Observability:** `/observability/metrics`, `/observability/queue_depth`, `/observability/realtime`
- **Security/QoS:** `/security/api-keys/rotate`, `/security/scopes`, `/qos/rate`, `/qos/rate/current`
- **Identity:** `/auth/whoami`
