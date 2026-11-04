import type React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, ShieldCheck } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  moduleGroup: string;
  description?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  moduleGroup,
  description = 'This administrative module is staged in the HRSJM governance workflow and scheduled for development in the next phase.',
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.badgeWrap}>
          <Clock size={14} color="#C9971A" />
          <span style={styles.badgeText}>{moduleGroup} • Phase Scheduled</span>
        </div>

        <h2 style={styles.title}>{title}</h2>
        <p style={styles.description}>{description}</p>

        <div style={styles.metaBox}>
          <div style={styles.metaRow}>
            <ShieldCheck size={16} color="#047857" />
            <span style={styles.metaText}>
              Backend API contract verified: Reuses endpoints from <code>HRSJM-back-api</code>
            </span>
          </div>
          <div style={styles.metaRow}>
            <span style={styles.dot} />
            <span style={styles.metaText}>
              Strict APK Protection: Zero changes to mobile React Native codebase
            </span>
          </div>
        </div>

        <div style={styles.actionRow}>
          <Link to="/admin/dashboard" style={styles.backButton}>
            <ArrowLeft size={16} />
            <span>Return to Dashboard</span>
          </Link>
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
    padding: '40px 16px',
    minHeight: '60vh',
  },
  card: {
    maxWidth: '580px',
    width: '100%',
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '12px',
    padding: '36px',
    textAlign: 'center',
    boxShadow: '0 4px 20px -2px rgba(1, 31, 57, 0.06)',
  },
  badgeWrap: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#FFF9E6',
    border: '1px solid #FAD465',
    padding: '4px 12px',
    borderRadius: '999px',
    marginBottom: '16px',
  },
  badgeText: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#0B2F52',
  },
  title: {
    fontSize: '26px',
    fontWeight: 700,
    color: '#0B2F52',
    margin: '0 0 12px 0',
  },
  description: {
    fontSize: '14.5px',
    color: '#34516D',
    lineHeight: 1.6,
    margin: '0 0 24px 0',
  },
  metaBox: {
    backgroundColor: '#FAF7F0',
    border: '1px solid #DBE5EE',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '24px',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  metaText: {
    fontSize: '13px',
    color: '#34516D',
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#C9971A',
    marginLeft: '5px',
    marginRight: '5px',
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'center',
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: '#06294D',
    color: '#FFFFFF',
    borderRadius: '6px',
    fontSize: '13.5px',
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'background-color 0.15s',
  },
};

