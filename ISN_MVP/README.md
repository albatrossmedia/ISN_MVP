# 🎬 IndicSubtitleNet MVP - Full Stack Application

> **AI-Powered Multilingual Subtitle Generation Platform for Indian Languages**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 Overview

**IndicSubtitleNet (ISN)** is an enterprise-grade, AI-powered subtitle generation platform specifically designed for Indian languages. The system uses a hybrid approach combining multiple AI providers (Google Cloud Speech, Gemini, OpenAI Whisper) to deliver high-quality, accurate subtitles for video content.

### Key Capabilities

- 🎙️ **Multi-Provider Speech-to-Text**: Google Chirp, Vertex AI, OpenAI Whisper
- 🧠 **Gemini Multimodal Integration**: Advanced transcription with visual context
- 📊 **Subtitle Quality Index (SQI)**: Real-time quality tracking
- 🌐 **Multi-Language Support**: Optimized for Hindi, Tamil, Telugu, and other Indian languages
- ⚡ **Job Queue System**: BullMQ-based asynchronous processing
- 📈 **Comprehensive Monitoring**: Grafana, Prometheus, OpenTelemetry

---

## ✨ Features

### Core Features
- ✅ Multi-provider AI orchestration
- ✅ Real-time job monitoring via WebSocket
- ✅ Dataset and model management (MDMS)
- ✅ Hybrid training pipeline with Vertex AI
- ✅ Compliance and audit logging
- ✅ Billing and usage tracking
- ✅ Provider performance comparison

### Admin Dashboard
- 📊 Real-time SQI monitoring
- 🎛️ Job management interface
- 📦 Dataset catalog and versioning
- 🤖 Model registry
- 💳 Billing and invoicing
- 🛡️ Compliance reports
- 📈 Provider metrics comparison

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js
- **Database**: MySQL 8
- **Cache/Queue**: Redis 7 + BullMQ
- **AI Services**: 
  - Google Cloud Speech-to-Text
  - Google Gemini API
  - OpenAI Whisper
  - Vertex AI
- **Storage**: S3/GCS/Wasabi compatible
- **Real-time**: Socket.IO
- **Monitoring**: Prometheus, Grafana, OpenTelemetry

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Context + Hooks
- **Charts**: Recharts
- **UI Components**: Lucide React
- **Auth**: Supabase (optional)

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes ready
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions ready
- **Video Processing**: FFmpeg

---

## 📁 Project Structure

```
ISN_MVP/
├── backend/                    # Node.js Express API
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API routes
│   │   ├── jobs/              # BullMQ workers
│   │   ├── middleware/        # Express middleware
│   │   ├── models/            # Data models
│   │   └── utils/             # Utility functions
│   ├── package.json
│   ├── .env                   # Backend configuration
│   └── README.md
│
├── frontend/                   # React TypeScript Dashboard
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── lib/               # API clients & utilities
│   │   ├── contexts/          # React contexts
│   │   └── hooks/             # Custom hooks
│   ├── package.json
│   ├── .env                   # Frontend configuration
│   └── vite.config.ts
│
├── docs/                       # Documentation
│   ├── api-specs/             # API specifications
│   ├── DEPLOYMENT_HOSTINGER.md
│   ├── CLOUD_PROVIDERS.md
│   └── ENDPOINTS_MATRIX.md
│
├── sql/                        # Database schemas
│   ├── create_core_schema.sql
│   └── create_full_schema_v8.6.sql
│
├── monitoring/                 # Observability configs
│   ├── grafana/               # Grafana dashboards
│   ├── prometheus/            # Prometheus config
│   └── otel/                  # OpenTelemetry collector
│
├── docker-compose.yml         # Local development setup
├── .gitignore
└── README.md                  # This file
```

---

## 📋 Prerequisites

### Required
- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **MySQL** >= 8.0
- **Redis** >= 6.0
- **FFmpeg** (for video processing)

### For Full Functionality
- Google Cloud Platform account (Speech, Gemini, Vertex AI)
- OpenAI API key (optional, for Whisper)
- S3-compatible storage (AWS S3, GCS, or Wasabi)
- SMTP server (for email notifications)

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/albatrossmedia/ISN_MVP.git
cd ISN_MVP
```

### 2. Set Up Backend

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your credentials

# Set up database
mysql -u root -p < ../sql/create_core_schema.sql

# Start Redis (if not running)
redis-server

# Start the backend server
npm run dev
```

Backend will run on `http://localhost:3000`

### 3. Set Up Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env to point to your backend

# Start the development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Access the Application

- **Frontend Dashboard**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs (if configured)

---

## ⚙️ Configuration

### Backend Configuration (.env)

Key configuration variables:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_NAME=isn_db
DB_USER=isn_user
DB_PASSWORD=your_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Google Cloud
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=./credentials/gcp.json
GEMINI_API_KEY=your_gemini_key

# OpenAI (Optional)
OPENAI_API_KEY=your_openai_key

# Storage
STORAGE_PROVIDER=gcs
GCP_BUCKET_NAME=your-bucket-name
```

### Frontend Configuration (.env)

```env
VITE_API_BASE_URL=http://localhost:3000/v1
VITE_SOCKET_URL=ws://localhost:3000
VITE_GRAFANA_URL=http://localhost:3001
```

---

## 📚 API Documentation

### Base URL
```
Development: http://localhost:3000/v1
Production: https://api.indicsubtitlenet.com/v1
```

### Key Endpoints

#### Authentication
```
POST /auth/login      - User login
POST /auth/register   - User registration
POST /auth/refresh    - Refresh token
```

#### Jobs
```
GET  /jobs            - List all jobs
POST /jobs            - Create new job
GET  /jobs/:id        - Get job details
PUT  /jobs/:id        - Update job
DELETE /jobs/:id      - Delete job
```

#### Hybrid Processing
```
POST /hybrid/run      - Start hybrid STT + Gemini job
POST /hybrid/merge    - Merge results
GET  /hybrid/:id      - Get hybrid job status
```

#### Datasets
```
GET  /datasets        - List datasets
POST /datasets        - Create dataset
GET  /datasets/:id    - Get dataset details
```

#### Models
```
GET  /models          - List models
POST /models          - Register model
GET  /models/:id      - Get model details
```

For complete API documentation, see [docs/api-specs/](./docs/api-specs/)

---

## 🐳 Docker Setup (Optional)

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services included:
- Backend API
- Frontend (Nginx)
- MySQL
- Redis
- Grafana
- Prometheus

---

## 📊 Monitoring

### Grafana Dashboards

Access Grafana at `http://localhost:3001` (default credentials: admin/admin)

Available dashboards:
- System Health
- Provider Performance Comparison
- SLO Metrics
- Job Queue Status

### Prometheus Metrics

Metrics exposed at `http://localhost:3000/metrics`

Key metrics:
- `isn_jobs_total` - Total jobs processed
- `isn_job_duration_seconds` - Job processing time
- `isn_sqi_score` - Subtitle Quality Index
- `isn_provider_errors_total` - Provider-specific errors

---

## 🚢 Deployment

### Hostinger VPS
See [docs/DEPLOYMENT_HOSTINGER.md](./docs/DEPLOYMENT_HOSTINGER.md)

### Google Cloud Platform
See [docs/CLOUD_PROVIDERS.md](./docs/CLOUD_PROVIDERS.md)

### Kubernetes
K8s manifests available in `/infra/k8s/`

---

## 🔧 Development

### Backend Development

```bash
cd backend

# Run in development mode with hot reload
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Frontend Development

```bash
cd frontend

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run typecheck

# Lint
npm run lint
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### API Testing
Use Postman collections in `docs/api-specs/postman/`

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

---

## 👥 Team

**Albatross Media / IndicSubtitleNet Engineering**  
📍 Mumbai, India  
📧 engineering@indicsubtitlenet.com

---

## 🙏 Acknowledgments

- Google Cloud Platform for AI services
- OpenAI for Whisper API
- The open-source community

---

## 📞 Support

For issues and questions:
- 🐛 [GitHub Issues](https://github.com/albatrossmedia/ISN_MVP/issues)
- 📧 Email: support@indicsubtitlenet.com
- 📚 [Documentation](./docs/)

---

**Made with ❤️ for Indian language content creators**

> _"Data speaks through subtitles — ISN makes every language heard."_
