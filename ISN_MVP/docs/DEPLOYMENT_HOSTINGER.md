# Deployment — Hostinger (Testing)

Server: **8 vCPU / 32 GB RAM / 400 GB NVMe / 32 TB bandwidth**

## Prereqs
- Ubuntu 22.04+
- Docker, Docker Compose
- Node.js 20 (if running directly)
- Nginx (TLS, HTTP/2), Certbot or custom certs
- ffmpeg (optional if not using ffmpeg-static)

## Steps (Docker Compose)
1. Clone repo, edit `backend/.env` from `.env.example`.
2. Set storage provider (AWS/Wasabi/GCS) in env.
3. `docker compose -f infra/docker/docker-compose.yml up -d`
4. Configure Nginx reverse proxy to route:
   - `api.indicsubtitlenet.com` → `api:8080`
   - `panel.indicsubtitlenet.com` → panel app (future)
   - `monitor.indicsubtitlenet.com` → Grafana (future)

## System Tuning
- Increase file descriptors & ulimits for Node and MySQL.
- Redis: set `maxmemory` and eviction policy (volatile-lru).
- MySQL: tune `innodb_buffer_pool_size` (~8–12 GB for this host).
- Enable swapfile if needed, but prefer RAM.

## Backups & Logs
- MySQL dumps nightly.
- Object storage lifecycle rules (auto-delete raw input after transcode).
- Centralize logs (optional: Loki/ELK).
