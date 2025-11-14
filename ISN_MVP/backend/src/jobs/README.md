# Jobs (BullMQ Workers)

Queues:
- **realtime** — ≤2 min audio, hot GPU pool, strict SLO
- **standard** — 2–15 min audio, balanced throughput
- **bulk** — 15–60+ min audio, relaxed SLO, wider fan-out
- **webhooks** — outbound delivery with backoff
- **training** — offline fine-tuning/evals
- **compliance** — dataset audits, PII checks

Worker contract input:
```json
{ "job_id": "JOB-123", "segment_idx": 0, "payload": { "url": "..." } }
```

Output:
- Write `job_segments`, `model_outputs`
- Emit socket progress events (`/progress`)
- When last segment done → call `manifestBuilder` and enqueue webhook
