import type React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import { DEMO_RECENT_APPLICATIONS } from '../data/dashboardDemoData';

export const RecentApplicationsTable: React.FC = () => {
  const getStatusBadge = (status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED') => {
    switch (status) {
      case 'APPROVED':
        return { bg: '#EAF7EE', color: '#16A34A', label: 'Approved' };
      case 'UNDER_REVIEW':
        return { bg: '#FFF9E6', color: '#D97706', label: 'Under Review' };
      case 'SUBMITTED':
      default:
        return { bg: '#EDF2F7', color: '#174A78', label: 'Submitted' };
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.titleWrap}>
          <div style={styles.iconWrap}>
            <FileText size={18} color="#06294D" />
          </div>
          <div>
            <h4 style={styles.title}>Pending Membership Applications</h4>
            <p style={styles.subtitle}>Awaiting identity and governance verification</p>
          </div>
        </div>

        <Link to="/admin/membership-applications" style={styles.viewAllLink}>
          <span>View All Inbox</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>Applicant</th>
              <th style={styles.th}>Application ID</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Review Status</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_RECENT_APPLICATIONS.map((app) => {
              const badge = getStatusBadge(app.status);
              return (
                <tr key={app.id} style={styles.tr}>
                  <td style={styles.td}>
                    <span style={styles.applicantName}>{app.applicantName}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.codeBadge}>{app.applicationId}</span>
                  </td>
                  <td style={styles.td}>{app.type}</td>
                  <td style={styles.td}>{app.submittedDate}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.statusPill,
                        backgroundColor: badge.bg,
                        color: badge.color,
                      }}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    <Link
                      to="/admin/membership-applications"
                      style={styles.actionBtn}
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              );
            })}
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
  },
  td: {
    padding: '12px',
    color: '#34516D',
    whiteSpace: 'nowrap',
  },
  applicantName: {
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
  statusPill: {
    padding: '3px 9px',
    borderRadius: '999px',
    fontSize: '11.5px',
    fontWeight: 600,
  },
  actionBtn: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#06294D',
    color: '#FAD465',
    borderRadius: '5px',
    fontSize: '12px',
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'background-color 0.15s',
  },
};

