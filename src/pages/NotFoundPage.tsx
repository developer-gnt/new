import type React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.code}>404</h1>
      <h2 style={styles.title}>Page Not Found</h2>
      <p style={styles.text}>The page you are looking for does not exist.</p>
      <Link to="/" style={styles.link}>
        Back to Home
      </Link>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '70vh',
    textAlign: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  code: {
    fontSize: '64px',
    fontWeight: 800,
    color: '#ef4444',
    margin: 0,
  },
  title: {
    fontSize: '24px',
    color: '#1f2937',
    margin: '12px 0',
  },
  text: {
    fontSize: '15px',
    color: '#6b7280',
    marginBottom: '20px',
  },
  link: {
    padding: '10px 20px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '14px',
  },
};
