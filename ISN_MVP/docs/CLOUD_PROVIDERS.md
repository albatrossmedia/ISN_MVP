# Cloud Providers & Object Storage

## Object Storage (S3-compatible)
- **AWS S3** or **Wasabi** (cost-effective) or **GCS**.
- Buckets:
  - `isn-input/<job_id>/input.ext` — TTL 24–48h
  - `isn-audio/<job_id>/input.wav`
  - `isn-segments/<job_id>/seg_<idx>.wav`
  - `isn-outputs/<job_id>/final.(srt|vtt|json)`
  - `isn-manifests/<job_id>/manifest.json` (signed, immutable)

### Example IAM (S3 JSON policy)
- Allow `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject` on `isn-*` buckets for the API role.
- Deny `ListBucket` publicly; all reads via presigned URLs.

## Google Cloud
Services used:
- **Speech-to-Text** (recognize long audio, diarization optional)
- **Translate / Vertex AI** for MT
- **Cloud Storage** (optional alternative to S3)

### Service Account Scopes
- `cloud-platform`
- `storage.objectAdmin`
- `translate.admin` (or fine-scoped to usage)

## OpenAI Whisper
- Use API key per environment.
- Timeouts & retries enforced in adapter.
- Log `latency_ms`, `cost_estimate`, and provider choice per job.
