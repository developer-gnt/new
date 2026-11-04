import type React from 'react';
import { Outlet, Link } from 'react-router-dom';

const CURRENT_YEAR = new Date().getFullYear();

export const AppLayout: React.FC = () => {
  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link to="/" style={styles.brand}>
            HRSJM Web
          </Link>
          <nav style={styles.nav}>
            <Link to="/" style={styles.navLink}>
              Home
            </Link>
          </nav>
        </div>
      </header>
      <main style={styles.main}>
        <Outlet />
      </main>
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          &copy; {CURRENT_YEAR} HRSJM Digital Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    padding: '0 24px',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#1e3a8a',
    textDecoration: 'none',
  },
  nav: {
    display: 'flex',
    gap: '16px',
  },
  navLink: {
    fontSize: '14px',
    color: '#4b5563',
    textDecoration: 'none',
    fontWeight: 500,
  },
  main: {
    flex: 1,
  },
  footer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e5e7eb',
    padding: '16px 24px',
    textAlign: 'center',
  },
  footerText: {
    margin: 0,
    fontSize: '13px',
    color: '#6b7280',
  },
};
