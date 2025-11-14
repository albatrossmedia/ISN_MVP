import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { MainLayout } from './components/layout/MainLayout';
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

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="models" element={<Models />} />
            <Route path="datasets" element={<Datasets />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="users" element={<Users />} />
            <Route path="system-health" element={<SystemHealth />} />
            <Route path="model-performance" element={<ModelPerformance />} />
            <Route path="dataset-performance" element={<DatasetPerformance />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
