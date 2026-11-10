import type React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ADMIN_NAV_GROUPS } from './adminNavItems';
import { useUnreadCount } from '@/features/admin/notifications/store/notificationsStore';
import { useUnviewedSupportCount } from '@/features/admin/support/store/supportStore';
import { useUnviewedApplicationsCount } from '@/features/admin/applications/store/applicationsStore';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const unreadCount = useUnreadCount();
  const unviewedSupportCount = useUnviewedSupportCount();
  const unviewedAppsCount = useUnviewedApplicationsCount();
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          style={styles.mobileBackdrop}
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        style={{
          ...styles.sidebar,
          width: collapsed ? '74px' : '268px',
          transform: mobileOpen ? 'translateX(0)' : undefined,
        }}
        className={mobileOpen ? 'sidebar-mobile-open' : ''}
      >
        {/* Brand / Logo Section */}
        <div style={styles.header}>
          <div style={styles.logoWrap}>
            {!collapsed ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '15px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.04em', fontFamily: 'serif', lineHeight: 1.2 }}>
                  HRSJM
                </span>
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#FAD465', textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1.2 }}>
                  ADMIN PORTAL
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <span style={{ fontSize: '13px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.05em' }}>
                  HRSJM
                </span>
                <span style={{ fontSize: '7.5px', fontWeight: 700, color: '#FAD465', textTransform: 'uppercase' }}>
                  Admin
                </span>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            type="button"
            style={styles.mobileCloseBtn}
            onClick={onCloseMobile}
            aria-label="Close Sidebar"
          >
            <X size={20} color="#FFFFFF" />
          </button>
        </div>

        {/* Navigation Groups List */}
        <div style={styles.navScrollArea}>
          {ADMIN_NAV_GROUPS.map((group) => (
            <div key={group.groupTitle} style={styles.groupContainer}>
              {!collapsed && (
                <div style={styles.groupHeader}>{group.groupTitle}</div>
              )}
              {collapsed && <div style={styles.collapsedDivider} />}

              <div style={styles.groupItems}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  let effectiveBadge: string | undefined = undefined;
                  if (item.id === 'notifications') {
                    effectiveBadge = unreadCount > 0 ? (unreadCount > 99 ? '99+' : String(unreadCount)) : undefined;
                  } else if (item.id === 'complaints') {
                    effectiveBadge =
                      unviewedSupportCount > 0
                        ? unviewedSupportCount > 99
                          ? '99+'
                          : String(unviewedSupportCount)
                        : undefined;
                  } else if (item.id === 'membership_applications' || item.id === 'applications') {
                    effectiveBadge =
                      unviewedAppsCount > 0
                        ? unviewedAppsCount > 99
                          ? '99+'
                          : String(unviewedAppsCount)
                        : undefined;
                  } else if (item.badge) {
                    effectiveBadge = item.badge;
                  }
                  return (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      onClick={() => {
                        if (mobileOpen) onCloseMobile();
                      }}
                      style={({ isActive }) => ({
                        ...styles.navLink,
                        ...(isActive ? styles.navLinkActive : {}),
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        padding: collapsed ? '10px 0' : '10px 14px',
                      })}
                      title={collapsed ? item.title : undefined}
                    >
                      {({ isActive }) => (
                        <>
                          {/* Active Indicator Strip */}
                          {isActive && <div style={styles.activeStrip} />}

                          <Icon
                            size={18}
                            color={isActive ? '#FAD465' : '#DBE5EE'}
                            strokeWidth={isActive ? 2.2 : 1.8}
                            style={{ flexShrink: 0 }}
                          />

                          {!collapsed && (
                            <span
                              style={{
                                ...styles.linkText,
                                color: isActive ? '#FFFFFF' : '#DBE5EE',
                                fontWeight: isActive ? 600 : 400,
                              }}
                            >
                              {item.title}
                            </span>
                          )}

                          {!collapsed && effectiveBadge && (
                            <span
                              style={{
                                ...styles.badge,
                                backgroundColor: isActive ? '#FAD465' : 'rgba(250, 212, 101, 0.2)',
                                color: isActive ? '#011F39' : '#FAD465',
                              }}
                            >
                              {effectiveBadge}
                            </span>
                          )}

                          {collapsed && effectiveBadge && (
                            <span
                              style={{
                                position: 'absolute',
                                top: '8px',
                                right: '12px',
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: '#FAD465',
                              }}
                              title={`${item.title}: ${effectiveBadge}`}
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Collapse Toggle Footer */}
        <div style={styles.footer}>
          <button
            type="button"
            onClick={onToggleCollapse}
            style={styles.collapseBtn}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight size={18} color="#FAD465" />
            ) : (
              <>
                <ChevronLeft size={18} color="#FAD465" />
                <span style={styles.collapseBtnText}>Collapse menu</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    backgroundColor: '#06294D',
    color: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
    zIndex: 40,
    borderRight: '1px solid #123F68',
    transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
    flexShrink: 0,
  },
  mobileBackdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(1, 31, 57, 0.65)',
    backdropFilter: 'blur(3px)',
    zIndex: 45,
  },
  header: {
    height: '68px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    borderBottom: '1px solid #123F68',
    backgroundColor: '#011F39',
  },
  logoWrap: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  mobileCloseBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '6px',
  },
  navScrollArea: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '12px 10px',
  },
  groupContainer: {
    marginBottom: '16px',
  },
  groupHeader: {
    fontSize: '10.5px',
    fontWeight: 700,
    color: '#E9B82E',
    letterSpacing: '0.08em',
    padding: '6px 12px',
    textTransform: 'uppercase',
    userSelect: 'none',
  },
  collapsedDivider: {
    height: '1px',
    backgroundColor: '#123F68',
    margin: '8px 6px',
  },
  groupItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  navLink: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderRadius: '8px',
    textDecoration: 'none',
    transition: 'background-color 0.16s, color 0.16s',
    userSelect: 'none',
  },
  navLinkActive: {
    backgroundColor: '#123F68',
  },
  activeStrip: {
    position: 'absolute',
    left: 0,
    top: '6px',
    bottom: '6px',
    width: '3.5px',
    backgroundColor: '#FAD465',
    borderRadius: '0 4px 4px 0',
  },
  linkText: {
    fontSize: '13.5px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flex: 1,
  },
  badge: {
    fontSize: '11px',
    fontWeight: 700,
    padding: '1px 7px',
    borderRadius: '999px',
    lineHeight: 1.4,
  },
  footer: {
    padding: '12px 14px',
    borderTop: '1px solid #123F68',
    backgroundColor: '#011F39',
  },
  collapseBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '8px',
    backgroundColor: 'transparent',
    border: '1px solid #123F68',
    borderRadius: '6px',
    color: '#DBE5EE',
    cursor: 'pointer',
    fontSize: '12.5px',
    fontWeight: 500,
    transition: 'background-color 0.15s, border-color 0.15s',
  },
  collapseBtnText: {
    whiteSpace: 'nowrap',
  },
};

