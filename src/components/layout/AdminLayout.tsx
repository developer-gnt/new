import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/store/authStore';
import { authService } from '@/features/auth/services/authService';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AppErrorBoundary } from '../common/AppErrorBoundary';

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, isSeeker, isAdmin } = useAuth();
  const hasToken = Boolean(authService.getAuthToken());
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-collapse sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isAuthenticated && !hasToken) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (isAuthenticated && isSeeker && !isAdmin) {
    return <Navigate to="/seeker/home" replace />;
  }

  return (
    <div style={styles.layoutWrapper}>
      {/* Slide-in / Collapsible Sidebar */}
      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main App Container */}
      <div style={styles.mainContainer}>
        {/* Top Header */}
        <AdminHeader
          onToggleMobileSidebar={() => setMobileOpen((o) => !o)}
          onToggleDesktopCollapse={() => setCollapsed((c) => !c)}
          collapsed={collapsed}
        />

        {/* Dynamic Page Outlet with Responsive Container */}
        <main style={styles.contentArea}>
          <div style={styles.contentInner}>
            <AppErrorBoundary>
              <Outlet />
            </AppErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  layoutWrapper: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#FAF7F0',
  },
  mainContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    backgroundColor: '#FAF7F0',
  },
  contentArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 64px)',
  },
  contentInner: {
    flex: 1,
    maxWidth: '1600px',
    width: '100%',
    margin: '0 auto',
    padding: '24px 32px',
    display: 'flex',
    flexDirection: 'column',
  },
};

export default AdminLayout;
