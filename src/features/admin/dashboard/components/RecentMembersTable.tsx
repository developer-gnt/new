import React, { useEffect, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import { UsersRound, ArrowRight } from 'lucide-react';
import { membersStore } from '@/features/admin/members/store/membersStore';
import type { Member } from '@/features/admin/members/types/members.types';
import { DEMO_RECENT_MEMBERS } from '../data/dashboardDemoData';

function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export const RecentMembersTable: React.FC = () => {
  useSyncExternalStore(membersStore.subscribe, membersStore.getSnapshot);

  useEffect(() => {
    membersStore.fetchMembers();
  }, []);

  const storeMembers = membersStore.getAllMembers();
  // Filter exclusively for approved / enrolled members (status ACTIVE or EXPIRING_SOON)
  const approvedMembers = storeMembers.filter(
    (m) => (m.status || '').toUpperCase() === 'ACTIVE' || (m.status || '').toUpperCase() === 'EXPIRING_SOON'
  );
  const hasLiveMembers = approvedMembers.length > 0;

  // Use live approved members if available, sorted newest first; fallback to demo data
  const displayMembers: (Member | (typeof DEMO_RECENT_MEMBERS)[number])[] = hasLiveMembers
    ? [...approvedMembers]
        .sort((a, b) => new Date(b.joinedDate || 0).getTime() - new Date(a.joinedDate || 0).getTime())
        .slice(0, 5)
    : DEMO_RECENT_MEMBERS;

  const getMemberStatusBadge = (status?: string) => {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'ACTIVE':
        return { bg: '#EAF7EE', color: '#16A34A', label: 'Active' };
      case 'EXPIRING_SOON':
        return { bg: '#FFF9E6', color: '#D97706', label: 'Expiring Soon' };
      case 'INACTIVE':
        return { bg: '#FEF2F2', color: '#DC2626', label: 'Inactive' };
      case 'PENDING':
      default:
        return { bg: '#EDF2F7', color: '#174A78', label: 'Pending' };
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.titleWrap}>
          <div style={styles.iconWrap}>
            <UsersRound size={18} color="#06294D" />
          </div>
          <div>
            <h4 style={styles.title}>Recently Enrolled Members</h4>
            <p style={styles.subtitle}>Verified &amp; approved active members</p>
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
            {displayMembers.map((item: any) => {
              const name = item.name || 'Member';
              const memberCode = item.membershipId || item.memberId || 'HRSJM-MEM';
              const category = item.categoryName || item.category || 'General Member';
              const joined = item.joinedDate ? formatDisplayDate(item.joinedDate) : 'Recently';
              const status = item.status || 'ACTIVE';
              const badge = getMemberStatusBadge(status);

              const initials = name
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((n: string) => n[0].toUpperCase())
                .join('');

              return (
                <tr key={item.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.memberCell}>
                      <div style={styles.avatar}>
                        {initials || 'M'}
                      </div>
                      <span style={styles.memberName}>{name}</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.codeBadge}>{memberCode}</span>
                  </td>
                  <td style={styles.td}>{category}</td>
                  <td style={styles.td}>{joined}</td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>
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
    flexShrink: 0,
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
  statusPill: {
    padding: '3px 9px',
    borderRadius: '999px',
    fontSize: '11.5px',
    fontWeight: 600,
  },
};
