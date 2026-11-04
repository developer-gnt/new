import type React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  tone?: 'navy' | 'gold' | 'success' | 'warning';
  linkTo: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
}

export const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  subtitle,
  tone = 'navy',
  linkTo,
  icon: Icon,
}) => {
  const toneStyles = {
    navy: {
      borderTop: '3.5px solid #06294D',
      iconBg: '#EDF2F7',
      iconColor: '#06294D',
      subtitleColor: '#174A78',
    },
    gold: {
      borderTop: '3.5px solid #E9B82E',
      iconBg: '#FFF9E6',
      iconColor: '#C9971A',
      subtitleColor: '#C9971A',
    },
    success: {
      borderTop: '3.5px solid #16A34A',
      iconBg: '#EAF7EE',
      iconColor: '#16A34A',
      subtitleColor: '#16A34A',
    },
    warning: {
      borderTop: '3.5px solid #D97706',
      iconBg: '#FEF6E7',
      iconColor: '#D97706',
      subtitleColor: '#D97706',
    },
  }[tone];

  return (
    <Link
      to={linkTo}
      style={{
        ...styles.card,
        borderTop: toneStyles.borderTop,
      }}
      className="stat-card"
    >
      <div style={styles.topRow}>
        <div style={{ ...styles.iconWrap, backgroundColor: toneStyles.iconBg }}>
          <Icon size={22} color={toneStyles.iconColor} strokeWidth={2.2} />
        </div>
        <div style={styles.chevronWrap}>
          <ChevronRight size={16} color="#94A3B8" />
        </div>
      </div>

      <div style={styles.valueRow}>
        <span style={styles.value}>{value}</span>
      </div>

      <div style={styles.bottomRow}>
        <span style={styles.title}>{title}</span>
        <span style={{ ...styles.subtitle, color: toneStyles.subtitleColor }}>
          {subtitle}
        </span>
      </div>
    </Link>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '10px',
    padding: '20px 22px',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 2px 8px -2px rgba(1, 31, 57, 0.05)',
    transition: 'transform 0.16s ease, box-shadow 0.16s ease',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '14px',
  },
  iconWrap: {
    width: '42px',
    height: '42px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueRow: {
    marginBottom: '4px',
  },
  value: {
    fontSize: '28px',
    fontWeight: 700,
    fontFamily: 'var(--font-sans)',
    color: '#0B2F52',
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
  },
  bottomRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  title: {
    fontSize: '13.5px',
    fontWeight: 600,
    color: '#34516D',
  },
  subtitle: {
    fontSize: '12px',
    fontWeight: 600,
  },
};

