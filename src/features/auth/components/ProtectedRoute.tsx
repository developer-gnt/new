import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, resolveUserDestination } from '../store/authStore';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'SEEKER' | 'ADMIN' | 'MEMBER' | 'ANY';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRole = 'ANY',
}) => {
  const { isAuthenticated, isSeeker, isAdmin, isMember, user } = useAuth();
  const hasToken = Boolean(authService.getAuthToken());
  const location = useLocation();

  if (!isAuthenticated && !hasToken) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  const currentUser = user || authService.getCurrentUser();

  if (allowedRole === 'SEEKER' && !isSeeker && !isAdmin) {
    return <Navigate to={resolveUserDestination(currentUser)} replace />;
  }

  if (allowedRole === 'ADMIN' && !isAdmin) {
    return <Navigate to={resolveUserDestination(currentUser)} replace />;
  }

  if (allowedRole === 'MEMBER' && !isMember && !isAdmin) {
    return <Navigate to={resolveUserDestination(currentUser)} replace />;
  }

  return <>{children}</>;
};
