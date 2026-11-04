import type React from 'react';
import { Link } from 'react-router-dom';
import { UsersRound, ArrowRight } from 'lucide-react';
import { DEMO_RECENT_MEMBERS } from '../data/dashboardDemoData';

export const RecentMembersTable: React.FC = () => {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.titleWrap}>
          <div style={styles.iconWrap}>
            <UsersRound size={18} color="#06294D" />
          </div>
          <div>
            <h4 style={styles.title}>Recently Enrolled Members</h4>
            <p style={styles.subtitle}>Verified & approved active members</p>
          </div>
        </div>

        <Link to="/admin/members" style={styles.viewAllLink}>
          <span>View Directory</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>Member Name</th>
              <th style={styles.th}>Member ID</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Joined Date</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_RECENT_MEMBERS.map((member) => (
              <tr key={member.id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={styles.memberCell}>
                    <div style={styles.avatar}>
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <span style={styles.memberName}>{member.name}</span>
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={styles.codeBadge}>{member.memberId}</span>
                </td>
                <td style={styles.td}>{member.category}</td>
                <td style={styles.td}>{member.joinedDate}</td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  <span style={styles.activePill}>Active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    marginBottom: '18px',
    flexWrap: 'wrap',
    gap: '12px',
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
  viewAllLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12.5px',
    fontWeight: 600,
    color: '#174A78',
    textDecoration: 'none',
  },
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '13px',
  },
  theadRow: {
    borderBottom: '1.5px solid #E2E8F0',
  },
  th: {
    padding: '10px 12px',
    fontSize: '11.5px',
    fontWeight: 700,
    color: '#718096',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  tr: {
    borderBottom: '1px solid #F1F5F9',
    transition: 'background-color 0.12s',
  },
  td: {
    padding: '12px',
    color: '#34516D',
    whiteSpace: 'nowrap',
  },
  memberCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: '#06294D',
    color: '#FAD465',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 700,
  },
  memberName: {
    fontWeight: 600,
    color: '#0B2F52',
  },
  codeBadge: {
    fontFamily: 'monospace',
    fontSize: '12px',
    backgroundColor: '#FAF7F0',
    border: '1px solid #DCE4EC',
    padding: '2px 6px',
    borderRadius: '4px',
    color: '#06294D',
    fontWeight: 600,
  },
  activePill: {
    backgroundColor: '#EAF7EE',
    color: '#16A34A',
    padding: '3px 9px',
    borderRadius: '999px',
    fontSize: '11.5px',
    fontWeight: 600,
  },
};

