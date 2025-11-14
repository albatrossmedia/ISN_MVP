# Sockets (Socket.IO)

Namespaces:
- `/progress` — Emits `{ job_id, pct, segment_idx }` for admin panel.
- `/monitor` — Optional metrics stream (queue depth, p95 latencies).

**Do not** expose PII or raw transcripts over sockets to public clients.
Prefer **webhooks** for automation.
