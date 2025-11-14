# Controllers

Thin request handlers → services.

Create:
- `auth.controller.js` — `/auth/token`, `/auth/whoami`
- `jobs.controller.js` — `/models/run`, `/jobs/status`, `/scheduler/route`, `/jobs/segments*`
- `models.controller.js` — `/models/register`, `/models/metrics`
- `datasets.controller.js` — `/mdms/datasets/*`
- `billing.controller.js` — `/billing/usage`, `/billing/forecast`
- `feedback.controller.js` — `/feedback/submit`

Rules:
- No DB logic here.
- Map query/body → DTO; call single service function.
- Throw typed errors with `status` + `code`.
