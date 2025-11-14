# Routes

**Public (Client Edition)** — exposed on `client.indicsubtitlenet.com`:
- `POST /auth/token`
- `POST /models/run`
- `GET  /jobs/status`
- `POST /feedback/submit`
- `GET  /billing/usage`

**Private (Developer/Internal)** — exposed on `api.indicsubtitlenet.com`:
- Scheduler/Jobs: `/scheduler/route`, `/jobs/segments`, `/jobs/segments/merge`, `/jobs/dlq`, `/jobs/replay_dlq`
- Models/MDMS: `/models/*`, `/mdms/datasets/*`
- Compliance: `/compliance/*`
- Observability: `/observability/*`
- Security/QoS: `/security/*`, `/qos/*`, `/auth/whoami`
