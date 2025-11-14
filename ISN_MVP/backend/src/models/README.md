# DB Models Layer

Use `mysql2/promise` with a shared pool. Provide **small functions** per table:
- `insertJob(dto)`, `getJobById(id)`, `updateJobStatus(id, status)`
- `insertSegment(dto)`, `listSegments(job_id)`
- `insertModelOutput(dto)`, `listModelOutputs(job_id)`
- `upsertProviderMetrics(dto)`
- `recordBilling(tenant_id, period, minutes_isn, minutes_google, minutes_whisper)`

Tables: see `/sql/*.sql`.
