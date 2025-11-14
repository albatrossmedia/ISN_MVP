# Utils

**Purpose:** shared helpers for services/workers.

- **manifestBuilder.js** — Merge `job_segments` into final SRT/VTT/JSON. Include per-segment confidence, provider breakdown, timing tolerance.
- **segmenter.js** — VAD-aware chunking (defaults: 25s segments, 0.7s overlap). Adapt for noisy audio.
- **transcode.js** — ffmpeg helpers (normalize, 16kHz mono). Use `ffmpeg-static` for portability.
- **idempotency.js** — Generate and verify idempotency keys; store short-lived tokens in Redis.
- **rateLimiter.js** — Token-bucket per tenant. Inputs: `RPM`, `burst`, `concurrent_jobs`.
- **validators.js** — AJV schemas for `/models/run`, `/datasets/register`, etc.
- **security.js** — JWT verify, RBAC scope check, HMAC webhook sign/verify, presigned URL helpers.
- **logger.js** — Pino logger + request correlation (trace_id header).
- **metrics.js** — prom-client counters/gauges/timers. Provide helpers like `timeAsync`.
- **storage.js** — S3/GCS client, multipart upload, lifecycle helpers.
