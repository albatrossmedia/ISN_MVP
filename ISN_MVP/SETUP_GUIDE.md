# 🚀 ISN MVP Complete Setup Guide

**Generated:** November 14, 2025
**Status:** Ready for deployment once network access is configured

---

## 📋 Current Status

### ✅ Completed
- [x] Project structure extracted and organized
- [x] Configuration files reviewed (.env files ready)
- [x] System requirements verified (Node.js v22.21.1, npm v10.9.4)
- [x] Docker Compose configuration ready
- [x] Database schemas prepared
- [x] Documentation reviewed

### ⚠️ Blocked
- [ ] npm registry access (403 Forbidden errors)
- [ ] Dependency installation (backend: 546 packages, frontend: 361 packages)
- [ ] Docker not available in current environment
- [ ] MySQL and Redis services need setup

---

## 🔧 Network Issue Resolution

### Problem
```
npm error 403 403 Forbidden - GET https://registry.npmjs.org/
```

### Solutions

#### Solution 1: Configure Proxy (If Behind Corporate Firewall)
```bash
# Set npm proxy
npm config set proxy http://your-proxy:port
npm config set https-proxy http://your-proxy:port

# Verify configuration
npm config list
```

#### Solution 2: Use npm Mirror Registry
```bash
# Use npmmirror (Alibaba Cloud mirror)
npm config set registry https://registry.npmmirror.com/

# Or use other mirrors
# npm config set registry https://registry.npm.taobao.org/
# npm config set registry https://mirrors.huaweicloud.com/repository/npm/
```

#### Solution 3: Reset to Default Registry
```bash
npm config set registry https://registry.npmjs.org/
npm cache clean --force
```

---

## 📦 Installation Steps (Once Network is Fixed)

### Step 1: Install Backend Dependencies
```bash
cd /home/user/ISN_MVP/ISN_MVP/backend

# Try npm first
npm install --legacy-peer-deps

# If npm fails, try yarn
yarn install

# Expected packages: 546
```

### Step 2: Install Frontend Dependencies
```bash
cd /home/user/ISN_MVP/ISN_MVP/frontend

# Install dependencies
npm install

# Expected packages: 361
```

---

## 🐳 Docker Setup (Recommended)

If Docker is available, this is the easiest option:

```bash
cd /home/user/ISN_MVP/ISN_MVP

# Start all services (MySQL, Redis, Backend, Frontend, Monitoring)
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps

# Stop services
docker-compose down
```

### Services Started by Docker Compose
- **MySQL 8.0** - Port 3306
  - Database: `isn_db`
  - User: `isn_user`
  - Password: `isn_password_change_me`
- **Redis 7** - Port 6379
- **Backend API** - Port 3000
- **Frontend Dashboard** - Port 5173
- **Grafana** - Port 3001 (admin/admin_change_me)
- **Prometheus** - Port 9091
- **Adminer** (MySQL UI) - Port 8080
- **Redis Commander** - Port 8081

---

## 🖥️ Local Development Setup (Without Docker)

### Prerequisites Installation

#### Install MySQL 8.0
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install mysql-server

# macOS
brew install mysql

# Start MySQL
sudo systemctl start mysql  # Linux
brew services start mysql    # macOS
```

#### Install Redis
```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# macOS
brew install redis

# Start Redis
sudo systemctl start redis  # Linux
brew services start redis   # macOS

# Test Redis
redis-cli ping
# Should return: PONG
```

### Database Setup

```bash
cd /home/user/ISN_MVP/ISN_MVP

# Create database and user
mysql -u root -p

# In MySQL shell:
CREATE DATABASE isn_db;
CREATE USER 'isn_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON isn_db.* TO 'isn_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import schema
mysql -u isn_user -p isn_db < sql/create_core_schema.sql
```

### Environment Configuration

#### Backend Configuration
Edit `/home/user/ISN_MVP/ISN_MVP/backend/.env`:

```env
# Update these critical variables:
DB_PASSWORD=your_secure_password_here
JWT_SECRET=generate_a_long_random_secret_key_here
GOOGLE_CLOUD_PROJECT_ID=your-gcp-project-id
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key  # Optional
```

#### Frontend Configuration
The frontend `.env` is already configured for local development:
```env
VITE_API_BASE_URL=http://localhost:3000/v1
VITE_SOCKET_URL=ws://localhost:3000
VITE_GRAFANA_URL=http://localhost:3001
```

### Start Services

#### Terminal 1 - Redis
```bash
redis-server
# Or if installed as service: sudo systemctl start redis
```

#### Terminal 2 - Backend
```bash
cd /home/user/ISN_MVP/ISN_MVP/backend
npm run dev

# Backend will start on http://localhost:3000
```

#### Terminal 3 - Frontend
```bash
cd /home/user/ISN_MVP/ISN_MVP/frontend
npm run dev

# Frontend will start on http://localhost:5173
```

---

## 🔑 API Keys Setup

### Google Cloud Platform
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable APIs:
   - Cloud Speech-to-Text API
   - Cloud Translation API
   - Vertex AI API
4. Create service account and download JSON key
5. Place key at: `backend/credentials/gcp-service-account.json`
6. Set in `.env`: `GOOGLE_CLOUD_PROJECT_ID=your-project-id`

### Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Set in `.env`: `GEMINI_API_KEY=your_key_here`

### OpenAI API (Optional)
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create API key
3. Set in `.env`: `OPENAI_API_KEY=your_key_here`

---

## 🧪 Testing the Setup

### 1. Check Backend Health
```bash
curl http://localhost:3000/health

# Expected response:
# {"status":"ok","timestamp":"..."}
```

### 2. Check API Version
```bash
curl http://localhost:3000/v1

# Expected response with API info
```

### 3. Test Database Connection
```bash
mysql -u isn_user -p isn_db -e "SHOW TABLES;"
```

### 4. Test Redis Connection
```bash
redis-cli ping
# Should return: PONG
```

### 5. Access Frontend
Open browser to: http://localhost:5173

---

## 📝 First Time Setup Checklist

After services are running:

- [ ] Create admin user account
- [ ] Test login functionality
- [ ] Upload a test video (if storage configured)
- [ ] Create a test subtitle job
- [ ] Monitor job in dashboard
- [ ] Check Grafana dashboards (if using Docker)
- [ ] Review logs for any errors

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :3000   # Backend
lsof -i :5173   # Frontend
lsof -i :3306   # MySQL
lsof -i :6379   # Redis

# Kill process
kill -9 <PID>
```

### MySQL Connection Refused
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL
sudo systemctl start mysql

# Check MySQL is listening
netstat -tlnp | grep 3306
```

### Redis Connection Refused
```bash
# Check if Redis is running
sudo systemctl status redis

# Start Redis
sudo systemctl start redis

# Or start manually
redis-server
```

### Backend Won't Start
```bash
# Check logs
cd backend
npm run dev

# Common issues:
# 1. Database not accessible - check DB_HOST, DB_PASSWORD in .env
# 2. Redis not running - start redis-server
# 3. Port 3000 in use - kill process or change PORT in .env
```

### Frontend Won't Start
```bash
# Check logs
cd frontend
npm run dev

# Common issues:
# 1. Port 5173 in use - Vite will offer alternative port
# 2. API URL wrong - check VITE_API_BASE_URL in .env
```

### npm/yarn Install Fails
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json

# Retry with legacy peer deps
npm install --legacy-peer-deps

# Or use yarn
yarn install
```

---

## 📁 Project Structure

```
/home/user/ISN_MVP/ISN_MVP/
├── backend/                          # Node.js Express API
│   ├── src/
│   │   ├── controllers/             # API controllers
│   │   ├── services/                # Business logic
│   │   │   ├── googleCloudService.js
│   │   │   ├── geminiService.js
│   │   │   ├── openaiService.js
│   │   │   └── jobQueueService.js
│   │   ├── routes/                  # API routes
│   │   ├── jobs/                    # BullMQ workers
│   │   ├── middleware/              # Express middleware
│   │   ├── models/                  # Data models
│   │   ├── utils/                   # Utilities
│   │   └── server.js                # Entry point
│   ├── package.json                 # Dependencies (546 packages)
│   ├── .env                         # Configuration
│   └── Dockerfile
│
├── frontend/                         # React TypeScript App
│   ├── src/
│   │   ├── pages/                   # Page components (15 pages)
│   │   ├── components/              # Reusable components
│   │   ├── lib/                     # API clients
│   │   ├── contexts/                # React contexts
│   │   └── App.tsx                  # Main app
│   ├── package.json                 # Dependencies (361 packages)
│   ├── .env                         # Configuration
│   ├── vite.config.ts              # Vite config
│   └── Dockerfile
│
├── sql/
│   ├── create_core_schema.sql       # Core database schema
│   └── create_full_schema_v8.6.sql  # Full schema with all tables
│
├── docs/                             # Documentation
├── monitoring/                       # Grafana/Prometheus configs
├── docker-compose.yml               # Docker orchestration
├── setup.sh                         # Automated setup script
├── README.md                        # Main documentation
├── QUICKSTART.md                    # Quick start guide
└── SETUP_STATUS.md                  # Setup status tracking
```

---

## 🚀 Available NPM Scripts

### Backend (`/backend`)
```bash
npm run dev      # Start development server with hot reload (nodemon)
npm start        # Start production server
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
npm test         # Run tests
```

### Frontend (`/frontend`)
```bash
npm run dev        # Start Vite dev server with hot reload
npm run build      # Build for production
npm run preview    # Preview production build
npm run typecheck  # Run TypeScript type checking
npm run lint       # Run ESLint
```

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change all default passwords in `.env` files
- [ ] Generate strong JWT_SECRET (use: `openssl rand -base64 32`)
- [ ] Update database passwords
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Review API key permissions
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategy

---

## 📊 System Monitoring

### Prometheus Metrics
Once backend is running, metrics available at:
```
http://localhost:3000/metrics
```

### Grafana Dashboards (Docker only)
Access Grafana at:
```
http://localhost:3001
Username: admin
Password: admin_change_me
```

### Logs Location
```
Backend logs: backend/logs/app.log
Frontend: Browser console and Vite output
```

---

## 📞 Support & Resources

### Documentation
- **Main README**: [README.md](README.md)
- **Quick Start**: [QUICKSTART.md](QUICKSTART.md)
- **Setup Status**: [SETUP_STATUS.md](SETUP_STATUS.md)
- **API Docs**: [docs/api-specs/](docs/api-specs/)
- **Deployment**: [docs/DEPLOYMENT_HOSTINGER.md](docs/DEPLOYMENT_HOSTINGER.md)

### Contact
- Email: support@indicsubtitlenet.com
- GitHub: https://github.com/albatrossmedia/ISN_MVP

---

## ✅ Quick Command Reference

```bash
# Check system requirements
node --version    # Should be >= 20.0.0
npm --version     # Should be >= 10.0.0

# Navigate to project
cd /home/user/ISN_MVP/ISN_MVP

# Install dependencies (after fixing network)
cd backend && npm install --legacy-peer-deps
cd ../frontend && npm install

# Start services (local development)
redis-server &
cd backend && npm run dev &
cd frontend && npm run dev

# Or use Docker
docker-compose up -d

# Check running services
docker-compose ps          # Docker
lsof -i :3000 :5173       # Local

# View logs
docker-compose logs -f backend    # Docker
tail -f backend/logs/app.log      # Local

# Stop services
docker-compose down               # Docker
pkill -f "npm run dev"           # Local
```

---

**Good luck with your ISN MVP setup!** 🎬🚀

*Made with ❤️ for Indian language content creators*
