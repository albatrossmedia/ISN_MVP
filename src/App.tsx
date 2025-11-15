import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import { MainLayout } from './components/layout/MainLayout';
import { ClientLayout } from './components/layout/ClientLayout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { Models } from './pages/Models';
import { Datasets } from './pages/Datasets';
import { Jobs } from './pages/Jobs';
import { AuditLogs } from './pages/AuditLogs';
import { Users } from './pages/Users';
import { SystemHealth } from './pages/SystemHealth';
import { ModelPerformance } from './pages/ModelPerformance';
import { DatasetPerformance } from './pages/DatasetPerformance';
import { WorkflowRunner } from './pages/WorkflowRunner';
import { JobMonitor } from './pages/JobMonitor';
import { FAQ } from './pages/FAQ';
import { PublicModels } from './pages/PublicModels';
import { PublicDatasets } from './pages/PublicDatasets';
import { About } from './pages/About';
import { Pricing } from './pages/Pricing';
import { Contact } from './pages/Contact';
import { News } from './pages/News';
import { NewsPost } from './pages/NewsPost';
import { BlogManagement } from './pages/BlogManagement';
import { Organizations } from './pages/Organizations';
import { ApiKeyManagement } from './pages/ApiKeyManagement';
import { ClientDashboard } from './pages/ClientDashboard';
import { DemoWorkflows } from './pages/DemoWorkflows';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <OnboardingProvider>
          <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/models" element={<PublicModels />} />
          <Route path="/datasets" element={<PublicDatasets />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsPost />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="models" element={<Models />} />
            <Route path="datasets" element={<Datasets />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="workflows/new" element={<WorkflowRunner />} />
            <Route path="workflows/:jobId" element={<JobMonitor />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="users" element={<Users />} />
            <Route path="system-health" element={<SystemHealth />} />
            <Route path="model-performance" element={<ModelPerformance />} />
            <Route path="dataset-performance" element={<DatasetPerformance />} />
            <Route path="blog" element={<BlogManagement />} />
            <Route path="organizations" element={<Organizations />} />
            <Route path="api-keys" element={<ApiKeyManagement />} />
          </Route>
          <Route path="/client" element={<ClientLayout />}>
            <Route index element={<ClientDashboard />} />
            <Route path="workflows/new" element={<WorkflowRunner />} />
            <Route path="demo" element={<DemoWorkflows />} />
            <Route path="history" element={<Jobs />} />
            <Route path="api-keys" element={<ApiKeyManagement />} />
            <Route path="billing" element={<Dashboard />} />
          </Route>
        </Routes>
          </Router>
          <Toaster position="top-right" />
        </OnboardingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
