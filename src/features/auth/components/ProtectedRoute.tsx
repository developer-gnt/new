import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'SEEKER' | 'ADMIN' | 'ANY';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRole = 'ANY',
}) => {
  const { isAuthenticated, isSeeker, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (allowedRole === 'SEEKER' && !isSeeker && !isAdmin) {
    // Non-seeker and non-admin
    return <Navigate to="/seeker/home" replace />;
  }

  if (allowedRole === 'ADMIN' && !isAdmin) {
    // Seeker trying to access admin
    return <Navigate to="/seeker/home" replace />;
  }

  return <>{children}</>;
};

