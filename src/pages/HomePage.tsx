import type React from 'react';

export const HomePage: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.badge}>Status: Ready</div>
        <h1 style={styles.title}>HRSJM Web Application</h1>
        <p style={styles.subtitle}>
          Dedicated React.js + TypeScript + Vite project initialized successfully.
        </p>
        <div style={styles.infoBox}>
          <p><strong>Environment:</strong> React 19 + TypeScript + Vite</p>
          <p><strong>Routing:</strong> React Router configured</p>
          <p><strong>Directory:</strong> hrsjm-web-application</p>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    padding: '24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    maxWidth: '560px',
    width: '100%',
    padding: '36px',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#ecfdf5',
    color: '#047857',
    borderRadius: '9999px',
    fontSize: '13px',
    fontWeight: 600,
    marginBottom: '16px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 12px 0',
  },
  subtitle: {
    fontSize: '15px',
    color: '#4b5563',
    margin: '0 0 24px 0',
    lineHeight: 1.5,
  },
  infoBox: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'left',
    fontSize: '14px',
    color: '#374151',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
};
