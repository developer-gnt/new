import type React from 'react';
import { Inbox } from 'lucide-react';

interface AppEmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
  actionLabel?: string;
  onAction?: () => void;
}

export const AppEmptyState: React.FC<AppEmptyStateProps> = ({
  title = 'No Records Found',
  description = 'There are no items matching the selected criteria or period.',
  icon: Icon = Inbox,
  actionLabel,
  onAction,
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.iconWrap}>
        <Icon size={28} color="#718096" />
      </div>
      <h4 style={styles.title}>{title}</h4>
      <p style={styles.description}>{description}</p>
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} style={styles.actionBtn}>
          {actionLabel}
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
    border: '1px dashed #DCE4EC',
  },
  iconWrap: {
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    backgroundColor: '#FAF7F0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '14px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#0B2F52',
    margin: '0 0 6px 0',
  },
  description: {
    fontSize: '13px',
    color: '#718096',
    margin: 0,
    maxWidth: '360px',
  },
  actionBtn: {
    marginTop: '16px',
    padding: '8px 18px',
    backgroundColor: '#06294D',
    color: '#FAD465',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12.5px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

