import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../store/authStore';

export const AdminGuard: React.FC = () => {
  const { isAuthenticated, isAdmin, isSeeker } = useAuth();

  // If user is authenticated as a Donation Seeker and not Admin, prevent access to admin area
  if (isAuthenticated && isSeeker && !isAdmin) {
    return <Navigate to="/seeker/home" replace />;
  }

  return <Outlet />;
};

