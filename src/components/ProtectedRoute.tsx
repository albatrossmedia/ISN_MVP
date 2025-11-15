import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './ui/LoadingSpinner';
import type { UserRole } from '../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: UserRole | UserRole[];
  requirePermission?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireRole,
  requirePermission,
}) => {
  const { user, loading, isRole, hasPermission } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole) {
    const roles = Array.isArray(requireRole) ? requireRole : [requireRole];
    const hasRequiredRole = roles.some(role => isRole(role));

    if (!hasRequiredRole) {
      return <Navigate to="/client" replace />;
    }
  }

  if (requirePermission) {
    const [resource, action] = requirePermission.split(':');
    if (!hasPermission(resource, action)) {
      return <Navigate to="/client" replace />;
    }
  }

  return <>{children}</>;
};
