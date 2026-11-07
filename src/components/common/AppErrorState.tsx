import type React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface AppErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const AppErrorState: React.FC<AppErrorStateProps> = ({
  title = 'Failed to Load Information',
  message = 'An unexpected connection error occurred while querying dashboard data. Please try again.',
  onRetry,
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.iconWrap}>
        <AlertTriangle size={28} color="#DC2626" />
      </div>
      <h4 style={styles.title}>{title}</h4>
      <p style={styles.message}>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} style={styles.retryBtn}>
          <RefreshCw size={14} color="#FFFFFF" />
          <span>Retry Operation</span>
        </button>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #FDEEEF',
  },
  iconWrap: {
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    backgroundColor: '#FDEEEF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '14px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#991B1B',
    margin: '0 0 6px 0',
  },
  message: {
    fontSize: '13px',
    color: '#718096',
    margin: 0,
    maxWidth: '400px',
    lineHeight: 1.5,
  },
  retryBtn: {
    marginTop: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '9px 18px',
    backgroundColor: '#06294D',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
};

