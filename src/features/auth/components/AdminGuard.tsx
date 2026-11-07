import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, resolveUserDestination } from '../store/authStore';
import { authService } from '../services/authService';

export const AdminGuard: React.FC = () => {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const hasToken = Boolean(authService.getAuthToken());
  const location = useLocation();

  if (!isAuthenticated && !hasToken) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Non-admin authenticated users are prevented from entering admin areas
  if (!isAdmin) {
    const currentUser = user || authService.getCurrentUser();
    const destination = resolveUserDestination(currentUser);
    const safeDestination = destination.startsWith('/admin') ? '/user/dashboard' : destination;
    return <Navigate to={safeDestination} replace />;
  }

  return <Outlet />;
};
