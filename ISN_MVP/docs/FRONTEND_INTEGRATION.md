# Frontend Integration Guide (ISN Client Edition)

Generated: 2025-10-17T07:47:39.476915Z

## Auth
- POST `/auth/token` with `client_id` + `client_secret`.
- Store `access_token` and attach `Authorization: Bearer <token>` to requests.

## models.run
- POST `/models/run` with payload schema in OpenAPI (`docs/api-specs/openapi_client.yaml`).
- Use `input.url` presigned uploads or `drive_file_id` for Drive imports.
- Expect 202 with `job_id`.

## Job polling / webhooks
- Poll `/jobs/status?job_id=` or register webhook.
- Webhook payload contains `manifest_url` when job completes.

## Error handling
- All errors conform to `('code', 'message', 'trace_id', 'details')`.
- Show user-friendly text from `message` and log trace_id for support.

## Example Polling Strategy
- Poll every 2s for first 20s, then every 5s for next 40s, then every 15s until completed.

## WebSocket
- Optional: connect to `wss://client.indicsubtitlenet.com/progress` for live progress updates.

## CORS
- Frontend served from `client.indicsubtitlenet.com` should be allowed by server CORS.
