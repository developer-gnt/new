import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  Bell,
  ChevronDown,
  User,
  IdCard,
  Award,
  RefreshCw,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Heart,
} from 'lucide-react';
import { MEMBER_NAV_GROUPS } from './memberNavItems';
import { useCurrentMember } from '../../features/member/store/memberStore';
import { HrsjmLogo } from '../common/HrsjmLogo';

interface MemberHeaderProps {
  onToggleMobileSidebar: () => void;
  onToggleDesktopCollapse: () => void;
  collapsed: boolean;
}

export const MemberHeader: React.FC<MemberHeaderProps> = ({
  onToggleMobileSidebar,
  onToggleDesktopCollapse,
  collapsed,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { member, setDevMemberState } = useCurrentMember();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute current page title from route
  const currentTitle = React.useMemo(() => {
    for (const group of MEMBER_NAV_GROUPS) {
      for (const item of group.items) {
        if (location.pathname.startsWith(item.path)) {
          return item.title;
        }
      }
    }
    return 'Member Dashboard';
  }, [location.pathname]);

  // Compute status pill
  const getStatusBadge = () => {
    if (member.isExpired) {
      return {
        label: 'EXPIRED',
        color: '#DC2626',
        bg: '#FDEEEF',
        border: '#F87171',
        icon: AlertTriangle,
      };
    }
    if (member.isExpiringSoon) {
      return {
        label: `${member.daysRemaining}d LEFT`,
        color: '#D97706',
        bg: '#FEF6E7',
        border: '#FBBF24',
        icon: Clock,
      };
    }
    return {
      label: 'ACTIVE',
      color: '#16A34A',
      bg: '#EAF7EE',
      border: '#86EFAC',
      icon: CheckCircle2,
    };
  };

  const statusBadge = getStatusBadge();
  const StatusIcon = statusBadge.icon;

  const handleSignOut = () => {
    setProfileDropdownOpen(false);
    navigate('/');
  };

  return (
    <header style={styles.header}>
      {/* Left Section: Single Menu Toggle, Brand Logo & Title */}
      <div style={styles.leftSection}>
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined' && window.innerWidth < 1024) {
              onToggleMobileSidebar();
            } else {
              onToggleDesktopCollapse();
            }
          }}
          style={styles.menuToggleBtn}
          aria-label="Toggle Sidebar Menu"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu size={20} color="#06294D" />
        </button>

        {/* Brand logo in header matching Image 5 */}
        <div style={styles.headerLogo}>
          <HrsjmLogo size="sm" variant="dark" showWordmark={true} subtitle="" />
        </div>

        <div style={styles.titleWrap}>
          <div style={styles.breadcrumb}>
            <span style={styles.breadcrumbRoot}>HRSJM Member</span>
            <span style={styles.breadcrumbSep}>/</span>
            <span style={styles.breadcrumbCurrent}>{currentTitle}</span>
          </div>
          <h1 style={styles.pageHeading}>{currentTitle}</h1>
        </div>
      </div>

      {/* Right Section: Dev Switcher, Donate Now, Status, Bell & Profile */}
      <div style={styles.rightSection}>
        {/* Interactive Dev State Switcher (Useful for testing Active/Expiring/Expired) */}
        <div style={styles.devSwitcherWrap}>
          <span style={styles.devLabel}>State:</span>
          <button
            type="button"
            onClick={() => setDevMemberState('active')}
            style={{
              ...styles.devBtn,
              ...(member.status === 'ACTIVE' ? styles.devBtnActive : {}),
            }}
            title="Simulate Active Member"
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => setDevMemberState('expiring')}
            style={{
              ...styles.devBtn,
              ...(member.status === 'EXPIRING_SOON' ? styles.devBtnExpiring : {}),
            }}
            title="Simulate Expiring Soon"
          >
            Expiring
          </button>
          <button
            type="button"
            onClick={() => setDevMemberState('expired')}
            style={{
              ...styles.devBtn,
              ...(member.status === 'EXPIRED' ? styles.devBtnExpired : {}),
            }}
            title="Simulate Expired Member"
          >
            Expired
          </button>
        </div>

        {/* Member Status Pill */}
        <div
          style={{
            ...styles.statusPill,
            backgroundColor: statusBadge.bg,
            color: statusBadge.color,
            borderColor: statusBadge.border,
          }}
          title={`Valid until ${member.validUpto}`}
        >
          <StatusIcon size={12} color={statusBadge.color} />
          <span>{statusBadge.label}</span>
        </div>

        {/* Exact "Donate Now" Button from Image 5 */}
        <button
          type="button"
          style={styles.donateBtn}
          onClick={() => navigate('/member/causes')}
          aria-label="Donate Now to Social Causes"
        >
          <Heart size={14} color="#0B2F52" fill="#0B2F52" />
          <span>Donate Now</span>
        </button>

        {/* Notifications Bell with '7' Unread Badge (as shown in Image 5) */}
        <button
          type="button"
          style={styles.bellBtn}
          onClick={() => navigate('/member/notifications')}
          aria-label="Member Notifications"
          title="Notifications & Bulletins"
        >
          <Bell size={18} color="#0B2F52" />
          <span style={styles.bellBadge}>7</span>
        </button>

        {/* Member Profile Menu */}
        <div style={styles.profileWrapper} ref={dropdownRef}>
          <button
            type="button"
            style={styles.profileTrigger}
            onClick={() => setProfileDropdownOpen((prev) => !prev)}
            aria-expanded={profileDropdownOpen}
            aria-haspopup="true"
          >
            {/* Avatar */}
            <div style={styles.avatarRing}>
              <div style={styles.avatarCore}>
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt={member.fullName}
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={styles.avatarInitials}>
                    {(member.fullName || 'MB').slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            <div style={styles.profileInfo}>
              <span style={styles.profileName}>{member.fullName}</span>
              <span style={styles.profileRole}>{member.categoryTitle}</span>
            </div>

            <ChevronDown size={14} color="#718096" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div style={styles.dropdownMenu}>
              <div style={styles.dropdownHeader}>
                <p style={styles.dropdownMemberName}>{member.fullName}</p>
                <p style={styles.dropdownMemberNumber}>{member.membershipNumber}</p>
                <div style={styles.chapterBadge}>
                  <span>{member.chapter}</span>
                </div>
              </div>

              <div style={styles.dropdownDivider} />

              <button
                type="button"
                style={styles.dropdownItem}
                onClick={() => {
                  setProfileDropdownOpen(false);
                  navigate('/member/id-card');
                }}
              >
                <IdCard size={16} color="#06294D" />
                <span>Digital ID Card</span>
              </button>

              <button
                type="button"
                style={styles.dropdownItem}
                onClick={() => {
                  setProfileDropdownOpen(false);
                  navigate('/member/certificate');
                }}
              >
                <Award size={16} color="#06294D" />
                <span>Membership Certificate</span>
              </button>

              <button
                type="button"
                style={styles.dropdownItem}
                onClick={() => {
                  setProfileDropdownOpen(false);
                  navigate('/member/renew');
                }}
              >
                <RefreshCw size={16} color="#06294D" />
                <span>Renewal Center</span>
              </button>

              <button
                type="button"
                style={styles.dropdownItem}
                onClick={() => {
                  setProfileDropdownOpen(false);
                  navigate('/member/profile');
                }}
              >
                <User size={16} color="#06294D" />
                <span>My Profile & KYC Vault</span>
              </button>

              <div style={styles.dropdownDivider} />

              <button
                type="button"
                style={styles.dropdownItem}
                onClick={() => {
                  setProfileDropdownOpen(false);
                  navigate('/admin/dashboard');
                }}
              >
                <ExternalLink size={16} color="#06294D" />
                <span>Switch to Admin Portal</span>
              </button>

              <div style={styles.dropdownDivider} />

              <button
                type="button"
                style={{ ...styles.dropdownItem, color: '#DC2626' }}
                onClick={handleSignOut}
              >
                <LogOut size={16} color="#DC2626" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    height: '68px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #DCE4EC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    position: 'sticky',
    top: 0,
    zIndex: 30,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  menuToggleBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38px',
    height: '38px',
    borderRadius: '8px',
    border: '1px solid #DCE4EC',
    backgroundColor: '#FAF7F0',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  headerLogo: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '6px',
  },
  titleWrap: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    lineHeight: 1.2,
    color: '#718096',
    fontWeight: 500,
  },
  breadcrumbRoot: {
    color: '#4A5568',
  },
  breadcrumbSep: {
    color: '#CBD5E0',
  },
  breadcrumbCurrent: {
    color: '#06294D',
    fontWeight: 600,
  },
  pageHeading: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 700,
    color: '#06294D',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  devSwitcherWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '3px 6px',
    fontSize: '11px',
  },
  devLabel: {
    color: '#64748B',
    fontWeight: 600,
    marginRight: '2px',
    fontSize: '10px',
    textTransform: 'uppercase',
  },
  devBtn: {
    padding: '2px 6px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#475569',
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  devBtnActive: {
    backgroundColor: '#16A34A',
    color: '#FFFFFF',
  },
  devBtnExpiring: {
    backgroundColor: '#D97706',
    color: '#FFFFFF',
  },
  devBtnExpired: {
    backgroundColor: '#DC2626',
    color: '#FFFFFF',
  },
  statusPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 700,
    border: '1px solid transparent',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  donateBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#F59E0B',
    color: '#0B2F52',
    fontWeight: 700,
    fontSize: '12.5px',
    padding: '7px 16px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(245, 158, 11, 0.25)',
    transition: 'transform 0.12s ease, background-color 0.12s ease',
  },
  bellBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38px',
    height: '38px',
    borderRadius: '9px',
    border: '1px solid #DCE4EC',
    backgroundColor: '#FAF7F0',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.15s ease',
  },
  bellBadge: {
    position: 'absolute',
    top: '-3px',
    right: '-3px',
    minWidth: '18px',
    height: '18px',
    borderRadius: '9px',
    backgroundColor: '#DC2626',
    color: '#FFFFFF',
    fontSize: '10px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #FFFFFF',
    padding: '0 4px',
  },
  profileWrapper: {
    position: 'relative',
  },
  profileTrigger: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '4px 10px 4px 6px',
    borderRadius: '24px',
    border: '1px solid #DCE4EC',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  avatarRing: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    padding: '1.5px',
    backgroundColor: '#06294D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCore: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: '#E2E8F0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarInitials: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#06294D',
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  profileName: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#06294D',
    lineHeight: 1.2,
    maxWidth: '130px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  profileRole: {
    fontSize: '11px',
    color: '#718096',
    lineHeight: 1.2,
    maxWidth: '130px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  dropdownMenu: {
    position: 'absolute',
    right: 0,
    top: 'calc(100% + 8px)',
    width: '260px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #DCE4EC',
    boxShadow: '0 10px 25px rgba(6, 41, 77, 0.12)',
    padding: '8px 0',
    zIndex: 50,
  },
  dropdownHeader: {
    padding: '10px 16px',
  },
  dropdownMemberName: {
    margin: 0,
    fontSize: '13px',
    fontWeight: 700,
    color: '#06294D',
  },
  dropdownMemberNumber: {
    margin: '2px 0 0',
    fontSize: '11px',
    fontFamily: 'monospace',
    color: '#475569',
  },
  chapterBadge: {
    marginTop: '6px',
    fontSize: '10px',
    color: '#06294D',
    backgroundColor: '#FEF6E7',
    border: '1px solid #FAD465',
    padding: '2px 6px',
    borderRadius: '4px',
    display: 'inline-block',
  },
  dropdownDivider: {
    height: '1px',
    backgroundColor: '#EDF2F7',
    margin: '6px 0',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '8px 16px',
    background: 'none',
    border: 'none',
    fontSize: '13px',
    color: '#2D3748',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background-color 0.12s ease',
  },
};
