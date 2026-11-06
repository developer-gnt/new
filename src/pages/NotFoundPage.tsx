import type React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.code}>404</h1>
      <h2 style={styles.title}>Page Not Found</h2>
      <p style={styles.text}>The page you are looking for does not exist or has been relocated.</p>
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
    fontFamily: 'var(--font-body)',
    backgroundColor: 'var(--color-ivory-50)',
    padding: '24px',
  },
  code: {
    fontFamily: 'var(--font-display)',
    fontSize: '72px',
    fontWeight: 700,
    color: 'var(--color-navy-950)',
    margin: 0,
    lineHeight: 1.1,
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    margin: '12px 0 8px 0',
  },
  text: {
    fontFamily: 'var(--font-body)',
    fontSize: '15px',
    color: 'var(--color-text-body)',
    marginBottom: '24px',
    maxWidth: '440px',
  },
  link: {
    padding: '12px 24px',
    backgroundColor: 'var(--color-gold-500)',
    color: 'var(--color-navy-950)',
    textDecoration: 'none',
    borderRadius: 'var(--radius-button)',
    fontWeight: 700,
    fontSize: '14px',
    boxShadow: '0 2px 4px rgba(1, 31, 57, 0.08)',
    transition: 'background-color 0.15s ease',
  },
};
