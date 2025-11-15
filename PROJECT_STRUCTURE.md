# IndicSubtitleNet MVP - Project Structure

## Overview
This is a modern React TypeScript application built with Vite, featuring a comprehensive AI-powered subtitle generation platform.

## 📁 Project Structure

```
indicsubtitlenet-mvp/
├── src/                          # Source code
│   ├── components/               # React components
│   │   ├── layout/              # Layout components
│   │   │   ├── MainLayout.tsx   # Main dashboard layout
│   │   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   │   └── TopBar.tsx       # Top navigation bar
│   │   ├── ui/                  # Reusable UI components
│   │   │   ├── Badge.tsx        # Status badge component
│   │   │   ├── Button.tsx       # Button component
│   │   │   ├── Card.tsx         # Card container
│   │   │   ├── Input.tsx        # Form input
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── Modal.tsx        # Modal dialog
│   │   │   ├── Select.tsx       # Dropdown select
│   │   │   ├── Table.tsx        # Data table
│   │   │   └── Tabs.tsx         # Tab navigation
│   │   └── IFFIRegistrationPopup.tsx
│   │
│   ├── pages/                   # Page components (routes)
│   │   ├── Landing.tsx          # Landing page
│   │   ├── Login.tsx            # Login page
│   │   ├── SignUp.tsx           # Registration page
│   │   ├── ForgotPassword.tsx   # Password reset
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   ├── Models.tsx           # AI Models management
│   │   ├── Datasets.tsx         # Datasets management
│   │   ├── Jobs.tsx             # Job monitoring
│   │   ├── ModelPerformance.tsx # Model analytics
│   │   ├── DatasetPerformance.tsx # Dataset analytics
│   │   ├── SystemHealth.tsx     # System monitoring
│   │   ├── Users.tsx            # User management
│   │   └── AuditLogs.tsx        # Audit trail
│   │
│   ├── lib/                     # Utilities and helpers
│   │   ├── api.ts               # API client (Axios)
│   │   ├── supabase.ts          # Supabase client
│   │   ├── socket.ts            # WebSocket client
│   │   ├── performanceApi.ts    # Model performance API
│   │   └── datasetPerformanceApi.ts # Dataset performance API
│   │
│   ├── contexts/                # React contexts
│   │   └── ThemeContext.tsx     # Theme provider
│   │
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # App entry point
│   ├── index.css                # Global styles (Tailwind)
│   └── vite-env.d.ts           # TypeScript definitions
│
├── public/                      # Static assets
├── supabase/                    # Supabase configuration
│   └── migrations/              # Database migrations
│       ├── 20251115052621_create_explore_datasets_and_models.sql
│       ├── 20251115052731_create_model_performance_metrics.sql
│       └── 20251115052739_create_dataset_performance_metrics.sql
│
├── ISN_MVP/                     # Original backend and documentation
│   ├── backend/                 # Node.js Express backend
│   ├── docs/                    # Documentation
│   └── sql/                     # SQL schemas
│
├── index.html                   # HTML entry point
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript config
├── tailwind.config.js          # Tailwind CSS config
├── postcss.config.js           # PostCSS config
├── package.json                # Dependencies
├── .env                        # Environment variables
└── .gitignore                  # Git ignore rules
```

## 🎯 Key Features

### Frontend Architecture
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: TailwindCSS 3
- **Routing**: React Router v7
- **State Management**: React Context API
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **WebSockets**: Socket.io Client
- **Notifications**: React Hot Toast

### Backend Integration
- **Database**: Supabase (PostgreSQL)
- **API**: RESTful API on port 8080
- **Real-time**: WebSocket connections
- **Authentication**: Supabase Auth

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Environment Setup
Create a `.env` file with:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:8080/api
VITE_SOCKET_URL=ws://localhost:8080
```

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Database Schema

### Core Tables
1. **datasets** - Training datasets information
2. **models** - AI model registry
3. **model_dataset_relations** - Model-dataset linkage
4. **model_performance_metrics** - Model performance data
5. **model_language_performance** - Language-specific metrics
6. **model_version_history** - Model versioning
7. **dataset_performance_metrics** - Dataset performance data
8. **dataset_language_coverage** - Language coverage stats
9. **dataset_usage_history** - Usage tracking

All tables have Row Level Security (RLS) enabled.

## 🎨 UI/UX Design

### Design System
- **Color Scheme**: Dark theme with blue/cyan accents
- **Typography**: System fonts with clear hierarchy
- **Layout**: Glassmorphism with backdrop blur
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design approach

### Pages Overview
1. **Landing** - Hero section, model showcase, dataset preview
2. **Dashboard** - Analytics, charts, recent activity
3. **Models** - Model registry with search/filter
4. **Datasets** - Dataset catalog with metadata
5. **Jobs** - Job queue and monitoring
6. **Performance** - Detailed analytics and metrics
7. **System Health** - Infrastructure monitoring

## 🔒 Security
- Environment variables for sensitive data
- Row Level Security on all database tables
- API proxy through Vite dev server
- CORS configuration
- Authentication required for admin routes

## 📝 Development Guidelines

### Code Organization
- Components are modular and reusable
- Each page is self-contained
- API calls centralized in lib/
- Consistent naming conventions
- TypeScript for type safety

### Styling
- TailwindCSS utility classes
- Consistent spacing (8px grid)
- Dark theme by default
- Responsive breakpoints: sm, md, lg, xl

### Testing
```bash
# Type checking
npm run typecheck

# Linting
npm run lint
```

## 🌐 Deployment

### Production Build
```bash
npm run build
```

Output directory: `dist/`

### Preview Build
```bash
npm run preview
```

## 📦 Dependencies

### Core
- React 18.3
- TypeScript 5.5
- Vite 5.4

### UI Libraries
- TailwindCSS 3.4
- Lucide React 0.344
- Recharts 3.2

### Data & API
- Supabase JS 2.57
- Axios 1.12
- Socket.io Client 4.8

## 🤝 Contributing
This is an MVP project for IFFI 2025 demonstration.

## 📄 License
Proprietary - IndicSubtitleNet Platform

---

**Built with ❤️ for IFFI 2025 - International Film Festival of India**
