# 🚀 ISN MVP - Quick Start Guide

Get up and running with IndicSubtitleNet in 5 minutes!

---

## 📦 What You Need

- **Node.js 20+** - [Download](https://nodejs.org/)
- **MySQL 8+** - [Download](https://dev.mysql.com/downloads/)
- **Redis 6+** - [Download](https://redis.io/download)
- **Git** - [Download](https://git-scm.com/)

**OR**

- **Docker & Docker Compose** - [Download](https://www.docker.com/products/docker-desktop)

---

## ⚡ Option 1: Docker Setup (Easiest)

### Step 1: Clone Repository
```bash
git clone https://github.com/albatrossmedia/ISN_MVP.git
cd ISN_MVP
```

### Step 2: Start Everything
```bash
docker-compose up -d
```

### Step 3: Access Applications
- 🎯 **Frontend**: http://localhost:5173
- 🔧 **Backend API**: http://localhost:3000
- 📊 **Grafana**: http://localhost:3001 (admin/admin)
- 🗄️ **MySQL Admin**: http://localhost:8080
- 📈 **Redis Commander**: http://localhost:8081

**That's it!** All services are running.

---

## 🛠️ Option 2: Local Development Setup

### Step 1: Clone Repository
```bash
git clone https://github.com/albatrossmedia/ISN_MVP.git
cd ISN_MVP
```

### Step 2: Run Setup Script
```bash
chmod +x setup.sh
./setup.sh
```

Choose option 2 (Local Development) and follow the prompts.

### Step 3: Configure Environment

#### Backend Configuration
```bash
cd backend
nano .env
```

Minimal configuration:
```env
# Database
DB_HOST=localhost
DB_NAME=isn_db
DB_USER=isn_user
DB_PASSWORD=your_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_secret_key_here
```

#### Frontend Configuration
```bash
cd frontend
nano .env
```

```env
VITE_API_BASE_URL=http://localhost:3000/v1
VITE_SOCKET_URL=ws://localhost:3000
```

### Step 4: Setup Database
```bash
mysql -u root -p < sql/create_core_schema.sql
```

### Step 5: Start Services

**Terminal 1 - Redis:**
```bash
redis-server
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 6: Access Applications
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

---

## 📝 First Steps After Setup

### 1. Create Admin User
```bash
curl -X POST http://localhost:3000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123!",
    "name": "Admin User"
  }'
```

### 2. Login to Dashboard
1. Go to http://localhost:5173
2. Login with credentials created above
3. Explore the dashboard!

### 3. Test API
```bash
# Get health status
curl http://localhost:3000/health

# Get API version
curl http://localhost:3000/v1
```

---

## 🧪 Test the System

### Create a Test Job
```bash
curl -X POST http://localhost:3000/v1/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "videoUrl": "https://example.com/video.mp4",
    "language": "hi",
    "provider": "google"
  }'
```

### Monitor Job Status
Go to Dashboard → Jobs → View active jobs

---

## 🔧 Common Issues & Solutions

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### MySQL Connection Error
- Verify MySQL is running: `mysql -u root -p`
- Check credentials in backend/.env
- Ensure database exists: `CREATE DATABASE isn_db;`

### Redis Connection Error
- Verify Redis is running: `redis-cli ping`
- Should return: `PONG`

### NPM Install Errors
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## 📚 Next Steps

1. **Configure AI Providers**
   - Set up Google Cloud credentials
   - Add Gemini API key
   - Configure OpenAI (optional)

2. **Import Sample Data**
   - Use Postman collections in `docs/api-specs/postman/`
   - Import test datasets

3. **Customize Dashboard**
   - Modify `frontend/src/pages/` components
   - Update branding in `frontend/src/`

4. **Set Up Monitoring**
   - Configure Grafana dashboards
   - Set up alerts
   - View metrics at http://localhost:3000/metrics

---

## 🆘 Need Help?

- 📖 Read the [Full Documentation](./README.md)
- 🐛 [Report Issues](https://github.com/albatrossmedia/ISN_MVP/issues)
- 💬 Contact: support@indicsubtitlenet.com

---

## 📹 Video Tutorials

Coming soon! Subscribe to our YouTube channel.

---

**Ready to build amazing subtitle solutions?** 🎬

Happy coding! 🚀
