import type React from 'react';
import { Activity, UserCheck, FileText, Gift, MessageSquare } from 'lucide-react';
import type { RecentActivity } from '../data/dashboardDemoData';
import { DEMO_RECENT_ACTIVITIES } from '../data/dashboardDemoData';

export const RecentActivitiesCard: React.FC = () => {
  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'member':
        return <UserCheck size={14} color="#16A34A" />;
      case 'application':
        return <FileText size={14} color="#174A78" />;
      case 'donation':
        return <Gift size={14} color="#D97706" />;
      case 'complaint':
        return <MessageSquare size={14} color="#06294D" />;
      default:
        return <Activity size={14} color="#718096" />;
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.titleWrap}>
          <div style={styles.iconWrap}>
            <Activity size={18} color="#06294D" />
          </div>
          <div>
            <h4 style={styles.title}>Recent Administrative Activities</h4>
            <p style={styles.subtitle}>Audit trail of recent platform actions</p>
          </div>
        </div>
      </div>

      <div style={styles.timeline}>
        {DEMO_RECENT_ACTIVITIES.map((act, index) => (
          <div key={act.id} style={styles.timelineItem}>
            <div style={styles.iconNode}>{getActivityIcon(act.type)}</div>
            {index < DEMO_RECENT_ACTIVITIES.length - 1 && <div style={styles.timelineLine} />}
            <div style={styles.timelineContent}>
              <p style={styles.activityDesc}>{act.description}</p>
              <div style={styles.metaRow}>
                <span style={styles.actorText}>By {act.actor}</span>
                <span style={styles.dot}>•</span>
                <span style={styles.timestamp}>{act.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '12px',
    padding: '22px',
    boxShadow: '0 2px 8px -2px rgba(1, 31, 57, 0.05)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  titleWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  iconWrap: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: '#EDF2F7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#0B2F52',
    margin: 0,
  },
  subtitle: {
    fontSize: '12px',
    color: '#718096',
    margin: '2px 0 0 0',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    paddingLeft: '4px',
  },
  timelineItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    position: 'relative',
    paddingBottom: '18px',
  },
  iconNode: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#FAF7F0',
    border: '1.5px solid #DCE4EC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    flexShrink: 0,
  },
  timelineLine: {
    position: 'absolute',
    left: '13px',
    top: '28px',
    bottom: 0,
    width: '2px',
    backgroundColor: '#E2E8F0',
    zIndex: 1,
  },
  timelineContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    flex: 1,
  },
  activityDesc: {
    margin: 0,
    fontSize: '13px',
    color: '#0B2F52',
    fontWeight: 500,
    lineHeight: 1.4,
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11.5px',
    color: '#718096',
  },
  actorText: {
    fontWeight: 600,
    color: '#174A78',
  },
  dot: {
    color: '#CBD5E1',
  },
  timestamp: {
    color: '#94A3B8',
  },
};
