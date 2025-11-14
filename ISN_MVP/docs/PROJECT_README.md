# Project Overview & URLs

## Domains
- `www.indicsubtitlenet.com` — public site & docs
- `client.indicsubtitlenet.com` — **public** Client API (limited)
- `api.indicsubtitlenet.com` — **private** Developer API (full)
- `datasets.indicsubtitlenet.com` — dataset catalog (signed)
- `models.indicsubtitlenet.com` — MDMS registry
- `panel.indicsubtitlenet.com` — admin/QA/billing/compliance
- `monitor.indicsubtitlenet.com` — Grafana/Prometheus

## Roles
- **Clients** (MySubtitle.in) use Client API.  
- **ISN Ops** use Admin Panel.  
- **Developers** use Developer API and internal endpoints.

## Storage Providers
- S3 / Wasabi / GCS supported. Pick per environment.
- Lifecycle rules to delete raw video after transcode.
