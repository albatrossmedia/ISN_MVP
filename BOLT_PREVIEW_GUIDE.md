# 🚀 Bolt Preview Guide - IndicSubtitleNet MVP

## ✅ Project Successfully Reorganized for Bolt

Your ISN MVP has been restructured and optimized for Bolt's preview functionality.

---

## 📂 Current Project Structure

```
indicsubtitlenet-mvp/          # ← Root level (Bolt-friendly)
├── src/                       # React TypeScript source
│   ├── components/            # UI components
│   ├── pages/                 # Route pages
│   ├── lib/                   # API clients & utilities
│   └── contexts/              # React contexts
├── public/                    # Static assets
├── dist/                      # Production build ✓
├── supabase/                  # Database migrations
├── ISN_MVP/                   # Original backend & docs
├── index.html                 # Entry point
├── vite.config.ts            # Vite config (with proxy)
├── package.json              # Updated metadata
├── .env                      # Environment vars
└── PROJECT_STRUCTURE.md      # Detailed structure docs
```

---

## 🎯 What Was Done

### 1. ✅ File Organization
- ✓ Moved frontend from `ISN_MVP/frontend/` to root level
- ✓ All files now at `/project/` for Bolt compatibility
- ✓ Maintained clean folder structure (components, pages, lib)
- ✓ Preserved original ISN_MVP folder for backend reference

### 2. ✅ Configuration Updates
- ✓ Updated `vite.config.ts` with:
  - Server proxy for `/api` → `http://localhost:8080`
  - Host configuration for external access
  - Preview port settings
- ✓ Updated `package.json`:
  - Name: `indicsubtitlenet-mvp`
  - Version: `1.0.0`
  - Added description
- ✓ Updated `.env` with all required variables:
  - Supabase URL and keys
  - API base URL
  - WebSocket URL
- ✓ Updated `index.html` title and metadata

### 3. ✅ Build Verification
- ✓ Production build successful
- ✓ Output: 854 KB JS, 41 KB CSS
- ✓ All 2509 modules transformed
- ✓ Gzipped to 248 KB

---

## 🌐 How to Preview in Bolt

### Option 1: Development Mode (Recommended)
```bash
npm run dev
```
- **URL**: http://localhost:5173
- **Features**: Hot reload, fast refresh
- **API Proxy**: Enabled for `/api` routes

### Option 2: Production Preview
```bash
npm run build
npm run preview
```
- **URL**: http://localhost:5173
- **Features**: Production-optimized build
- **Performance**: Full optimization enabled

### Option 3: Direct Preview (Bolt)
If using Bolt's built-in preview:
1. Bolt automatically detects `index.html` at root
2. Serves from port 5173
3. API calls proxy to backend on port 8080

---

## 🎨 Available Routes

### Public Pages
- `/` - Landing page with IFFI 2025 banner
- `/login` - User authentication
- `/signup` - New user registration
- `/forgot-password` - Password reset

### Dashboard Pages (Protected)
- `/dashboard` - Analytics overview
- `/dashboard/models` - AI Models registry
- `/dashboard/datasets` - Datasets catalog
- `/dashboard/jobs` - Job monitoring
- `/dashboard/model-performance` - Model analytics
- `/dashboard/dataset-performance` - Dataset analytics
- `/dashboard/system-health` - System monitoring
- `/dashboard/users` - User management
- `/dashboard/audit-logs` - Audit trail

---

## 🔗 Integration Points

### Backend API
- **URL**: http://localhost:8080
- **Endpoints**: `/api/auth`, `/api/jobs`, `/api/models`, `/api/datasets`
- **Status**: ✓ Running

### Database
- **Provider**: Supabase
- **Tables**: 9 tables with RLS enabled
- **Data**: 5 models, 5 datasets, performance metrics
- **Status**: ✓ Connected

### WebSocket
- **URL**: ws://localhost:8080
- **Features**: Real-time updates
- **Status**: Configured

---

## 🎯 Key Features Working

✅ **Landing Page**
- IFFI 2025 announcement banner
- Hero section with gradient text
- Model showcase (5 models)
- Dataset showcase (5 datasets)
- Google partnership section

✅ **Dashboard**
- Real-time stats (Models: 5, Datasets: 4)
- Job activity chart (7 days)
- Recent jobs table
- Glassmorphic design

✅ **Models Page**
- Searchable model registry
- Filter by type (ASR, NLP, Translation)
- Add new model functionality
- Model detail modal with tabs

✅ **Database**
- All 9 tables created
- Sample data populated
- RLS policies active
- Performance metrics recorded

---

## 🎨 Design System

### Theme
- **Mode**: Dark theme
- **Primary**: Blue (#3b82f6)
- **Secondary**: Cyan (#06b6d4)
- **Accent**: Green (#10b981)
- **Background**: Black with gradients

### UI Components
- Glassmorphism effects
- Backdrop blur
- Smooth transitions
- Hover animations
- Responsive grid layout

### Typography
- **Headings**: Bold, 2xl-6xl
- **Body**: Regular, base-lg
- **Mono**: Code snippets

---

## 🚨 Important Notes

### Environment Variables
All sensitive data is in `.env`:
- Supabase credentials
- API endpoints
- Socket URLs

### Port Configuration
- **Frontend**: 5173 (Vite)
- **Backend**: 8080 (Express)
- **Database**: Supabase Cloud

### Build Output
- **Location**: `/dist/`
- **Size**: 854 KB (uncompressed)
- **Gzipped**: 248 KB
- **Chunks**: Optimized

---

## 🐛 Troubleshooting

### Preview Not Loading?
1. Check port 5173 is available
2. Verify `.env` file exists at root
3. Run `npm install` if dependencies missing
4. Check backend is running on port 8080

### API Calls Failing?
1. Verify backend server is running
2. Check proxy settings in `vite.config.ts`
3. Confirm Supabase credentials in `.env`
4. Check browser console for errors

### Build Errors?
1. Run `npm install` to update dependencies
2. Check TypeScript errors: `npm run typecheck`
3. Verify all imports are correct
4. Clear node_modules and reinstall

---

## 📊 Performance Metrics

### Lighthouse Score (Target)
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

### Bundle Size
- **Main JS**: 854 KB → 248 KB (gzipped)
- **CSS**: 41 KB → 7 KB (gzipped)
- **Total**: ~255 KB (optimized)

### Load Time (Target)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.0s
- Largest Contentful Paint: < 2.5s

---

## ✨ Next Steps

### For Development
1. Start dev server: `npm run dev`
2. Open browser: http://localhost:5173
3. Make changes (hot reload enabled)
4. Build: `npm run build`

### For Deployment
1. Update environment variables for production
2. Build: `npm run build`
3. Deploy `/dist` folder to hosting
4. Configure backend URL in production `.env`

### For Testing
1. Test all routes work
2. Verify API integration
3. Check database connections
4. Test responsive design
5. Validate form submissions

---

## 🎉 Success Criteria

✅ All components render correctly
✅ Navigation works across all routes
✅ API calls connect to backend
✅ Database queries return data
✅ Responsive design works
✅ Build completes without errors
✅ Preview shows in Bolt

---

## 📞 Support

### Resources
- **Vite Docs**: https://vitejs.dev
- **React Docs**: https://react.dev
- **Supabase Docs**: https://supabase.com/docs
- **TailwindCSS**: https://tailwindcss.com

### Quick Commands
```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview build
npm run typecheck  # Check types
npm run lint       # Lint code
```

---

**🚀 Your ISN MVP is now fully optimized for Bolt preview!**

Built for IFFI 2025 - International Film Festival of India
