import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';

interface MemberPlaceholderPageProps {
  title: string;
  subtitle: string;
  phase: string;
}

export const MemberPlaceholderPage: React.FC<MemberPlaceholderPageProps> = ({
  title,
  subtitle,
  phase,
}) => {
  const navigate = useNavigate();

  return (
    <div style={styles.card}>
      <div style={styles.phaseBadge}>
        <Clock size={13} color="#C9971A" />
        <span>{phase}</span>
      </div>
      <h1 style={styles.title}>{title}</h1>
      <p style={styles.subtitle}>{subtitle}</p>
      <div style={styles.infoBox}>
        <p>
          This screen is scheduled for development in <strong>{phase}</strong>. The navigation route, layout shell, and state synchronization are active.
        </p>
      </div>
      <button
        type="button"
        style={styles.backBtn}
        onClick={() => navigate('/member/dashboard')}
      >
        <ArrowLeft size={16} />
        <span>Back to Member Dashboard</span>
      </button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '14px',
    padding: '48px 32px',
    border: '1px solid #DCE4EC',
    maxWidth: '680px',
    margin: '32px auto',
    textAlign: 'center',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
  },
  phaseBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#FFF9E6',
    color: '#06294D',
    border: '1px solid #FAD465',
    fontSize: '12px',
    fontWeight: 700,
    padding: '4px 12px',
    borderRadius: '999px',
    marginBottom: '16px',
  },
  title: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '28px',
    fontWeight: 700,
    color: '#0B2F52',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '15px',
    color: '#4B5563',
    lineHeight: 1.5,
    margin: '0 0 24px 0',
  },
  infoBox: {
    backgroundColor: '#FAF7F0',
    border: '1px solid #EDF2F7',
    borderRadius: '10px',
    padding: '16px 20px',
    fontSize: '13.5px',
    color: '#34516D',
    lineHeight: 1.6,
    marginBottom: '28px',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#06294D',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '13.5px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

