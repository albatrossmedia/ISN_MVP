# Services (Business Logic)

This folder contains the core domain logic. Controllers call services; services call models/queues/providers.

## Files to create (by Copilot/Cursor)

- **orchestratorService.js**
  - Decide `latency_class` (`realtime|standard|bulk`) using `media_duration_s`, `qos_tier`, and queue depth.
  - Enqueue to BullMQ; create `jobs` row + manifest skeleton.
  - Idempotency check by `idempotency_key`.
- **bullmqService.js**
  - Create queues: `realtime`, `standard`, `bulk`, `webhooks`, `training`, `compliance`.
  - Common backoff: exponential (e.g., 2s, 5s, 10s).
  - Pub helpers: `publishASRSegment`, `publishWebhook`.
- **isnASRService.js / isnMTService.js / isnContextService.js / isnAlignService.js / isnQAService.js**
  - Thin HTTP/gRPC adapters to internal models. Include timeout + circuit-breaker.
- **openaiService.js (Whisper)** / **googleSpeechService.js (Vertex/GCloud)**
  - Provider adapters. Record `latency_ms`, `success`, `cost_estimate`. Map outputs → unified format.
- **webhookService.js**
  - Sign payloads using HMAC; enqueue to `webhooks` queue; handle DLQ + replay.
- **billingService.js**
  - Update `billing_usage` per tenant by provider split (ISN/Whisper/Google).
- **complianceService.js**
  - Score datasets using license matrix; verify consent artifacts; update `risk_level`.
- **observabilityService.js**
  - Prometheus counters/gauges/timers. Wrap critical paths with OTEL spans.

## Cross-cutting concerns
- Use `logger` (pino) for structured logs.
- Increment metrics for provider latency & success rate.
- Never block the request: enqueue long work to queues.
