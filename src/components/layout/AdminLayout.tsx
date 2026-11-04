import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AppErrorBoundary } from '../common/AppErrorBoundary';

export const AdminLayout: React.FC = () => {
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
    width: '100%',
    backgroundColor: '#FAF7F0',
  },
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
    minHeight: '100vh',
    overflowX: 'hidden',
  },
  contentArea: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto',
  },
  contentInner: {
    maxWidth: '1440px',
    margin: '0 auto',
    width: '100%',
  },
};

