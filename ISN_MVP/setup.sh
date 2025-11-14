#!/bin/bash

# ISN MVP Setup Script
# This script sets up the complete ISN Full Stack application

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ISN MVP Full Stack Setup${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 20 or higher.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${RED}Node.js version must be 20 or higher. Current version: $(node -v)${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v) found${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v) found${NC}"

# Check MySQL (optional)
if command -v mysql &> /dev/null; then
    echo -e "${GREEN}✓ MySQL found${NC}"
else
    echo -e "${YELLOW}! MySQL not found (will use Docker)${NC}"
fi

# Check Redis (optional)
if command -v redis-cli &> /dev/null; then
    echo -e "${GREEN}✓ Redis found${NC}"
else
    echo -e "${YELLOW}! Redis not found (will use Docker)${NC}"
fi

# Check Docker (optional)
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Docker found${NC}"
    DOCKER_AVAILABLE=true
else
    echo -e "${YELLOW}! Docker not found (manual setup required)${NC}"
    DOCKER_AVAILABLE=false
fi

echo ""

# Ask user for setup method
echo -e "${YELLOW}Choose setup method:${NC}"
echo "1) Docker Compose (Recommended - includes MySQL, Redis, Grafana)"
echo "2) Local Development (requires MySQL and Redis installed)"
echo "3) Backend Only"
echo "4) Frontend Only"
read -p "Enter choice [1-4]: " SETUP_CHOICE

echo ""

case $SETUP_CHOICE in
    1)
        if [ "$DOCKER_AVAILABLE" = false ]; then
            echo -e "${RED}Docker is not available. Please install Docker first.${NC}"
            exit 1
        fi
        
        echo -e "${GREEN}Setting up with Docker Compose...${NC}"
        
        # Create necessary directories
        mkdir -p backend/logs
        mkdir -p credentials
        
        # Start services
        echo -e "${YELLOW}Starting Docker containers...${NC}"
        docker-compose up -d
        
        echo ""
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}Setup Complete!${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo ""
        echo -e "${YELLOW}Services:${NC}"
        echo "• Backend API: http://localhost:3000"
        echo "• Frontend Dashboard: http://localhost:5173"
        echo "• Grafana: http://localhost:3001 (admin/admin)"
        echo "• Prometheus: http://localhost:9091"
        echo "• Redis Commander: http://localhost:8081"
        echo "• Adminer (MySQL): http://localhost:8080"
        echo ""
        echo -e "${YELLOW}View logs:${NC} docker-compose logs -f"
        echo -e "${YELLOW}Stop services:${NC} docker-compose down"
        ;;
        
    2)
        echo -e "${GREEN}Setting up for local development...${NC}"
        
        # Backend setup
        echo -e "${YELLOW}Setting up backend...${NC}"
        cd backend
        
        if [ ! -f ".env" ]; then
            echo -e "${YELLOW}Creating .env file...${NC}"
            echo "Please configure backend/.env with your database and API credentials"
        fi
        
        echo "Installing backend dependencies..."
        npm install --legacy-peer-deps
        
        echo -e "${GREEN}✓ Backend setup complete${NC}"
        cd ..
        
        # Frontend setup
        echo -e "${YELLOW}Setting up frontend...${NC}"
        cd frontend
        
        if [ ! -f ".env" ]; then
            echo -e "${YELLOW}Creating .env file...${NC}"
            echo "Please configure frontend/.env"
        fi
        
        echo "Installing frontend dependencies..."
        npm install --legacy-peer-deps
        
        echo -e "${GREEN}✓ Frontend setup complete${NC}"
        cd ..
        
        echo ""
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}Setup Complete!${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo ""
        echo -e "${YELLOW}Next steps:${NC}"
        echo "1. Configure backend/.env with your credentials"
        echo "2. Set up MySQL database:"
        echo "   mysql -u root -p < sql/create_core_schema.sql"
        echo "3. Start Redis: redis-server"
        echo "4. Start backend: cd backend && npm run dev"
        echo "5. Start frontend: cd frontend && npm run dev"
        echo ""
        echo -e "${YELLOW}Access:${NC}"
        echo "• Backend: http://localhost:3000"
        echo "• Frontend: http://localhost:5173"
        ;;
        
    3)
        echo -e "${GREEN}Setting up backend only...${NC}"
        cd backend
        
        if [ ! -f ".env" ]; then
            echo -e "${YELLOW}Please configure .env file${NC}"
        fi
        
        npm install --legacy-peer-deps
        
        echo ""
        echo -e "${GREEN}Backend setup complete!${NC}"
        echo -e "${YELLOW}Start with:${NC} npm run dev"
        echo -e "${YELLOW}API will be available at:${NC} http://localhost:3000"
        ;;
        
    4)
        echo -e "${GREEN}Setting up frontend only...${NC}"
        cd frontend
        
        if [ ! -f ".env" ]; then
            echo -e "${YELLOW}Please configure .env file${NC}"
        fi
        
        npm install --legacy-peer-deps
        
        echo ""
        echo -e "${GREEN}Frontend setup complete!${NC}"
        echo -e "${YELLOW}Start with:${NC} npm run dev"
        echo -e "${YELLOW}Dashboard will be available at:${NC} http://localhost:5173"
        ;;
        
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
