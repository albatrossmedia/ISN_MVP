# Middleware

- **auth.middleware.js** — Parse Bearer JWT or `X-API-Key`. Set `req.tenant`, `req.scopes`.
- **rateLimit.middleware.js** — Use Redis token bucket. Return `429` with `Retry-After`.
- **validate.middleware.js** — Validate using AJV; map errors to `400` with field details.
- **error.middleware.js** — Always return `{code, message, trace_id, details}`.
- **security.middleware.js** — HSTS, refined CORS; optional webhook signature pre-check for test route.
