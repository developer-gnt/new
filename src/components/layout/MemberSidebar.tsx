import type React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, LogOut, ChevronRight as ChevronIcon } from 'lucide-react';
import { MEMBER_NAV_GROUPS } from './memberNavItems';
import { HrsjmLogo } from '../common/HrsjmLogo';

interface MemberSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const MemberSidebar: React.FC<MemberSidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    if (mobileOpen) onCloseMobile();
    navigate('/');
  };

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
            <HrsjmLogo
              size="md"
              variant="light"
              showWordmark={!collapsed}
              subtitle="MEMBER PORTAL"
            />
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
          {MEMBER_NAV_GROUPS.map((group) => (
            <div key={group.groupTitle} style={styles.groupContainer}>
              {!collapsed && (
                <div style={styles.groupHeader}>{group.groupTitle}</div>
              )}
              {collapsed && <div style={styles.collapsedDivider} />}

              <div style={styles.groupItems}>
                {group.items.map((item) => {
                  const Icon = item.icon;

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
                        padding: collapsed ? '10px 0' : '9px 12px',
                      })}
                      title={collapsed ? item.title : undefined}
                    >
                      {({ isActive }) => (
                        <>
                          {/* Active Indicator Strip */}
                          {isActive && <div style={styles.activeStrip} />}

                          {/* Icon Container with subtle background badge */}
                          <div
                            style={{
                              ...styles.iconBadge,
                              backgroundColor: isActive
                                ? '#FAD465'
                                : 'rgba(255, 255, 255, 0.08)',
                            }}
                          >
                            <Icon
                              size={16}
                              color={isActive ? '#011F39' : '#DBE5EE'}
                              strokeWidth={isActive ? 2.3 : 1.9}
                            />
                          </div>

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

                          {!collapsed && item.badge && (
                            <span
                              style={{
                                ...styles.badge,
                                backgroundColor: isActive ? '#FAD465' : '#EF4444',
                                color: isActive ? '#011F39' : '#FFFFFF',
                              }}
                            >
                              {item.badge}
                            </span>
                          )}

                          {!collapsed && (
                            <ChevronIcon
                              size={13}
                              color={isActive ? '#FAD465' : 'rgba(219, 229, 238, 0.4)'}
                              style={{ marginLeft: 'auto', flexShrink: 0 }}
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

          {/* Bottom Action Area: Sign Out & Version */}
          {!collapsed && (
            <div style={styles.bottomSignOutWrap}>
              <button
                type="button"
                onClick={handleSignOut}
                style={styles.signOutBtn}
                aria-label="Sign Out"
              >
                <LogOut size={16} color="#EF4444" />
                <span style={styles.signOutText}>Sign Out</span>
              </button>
              <div style={styles.versionText}>HRSJM Member Mobile v1.0.0</div>
            </div>
          )}
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
    padding: '16px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  groupContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  groupHeader: {
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: '#FAD465',
    textTransform: 'uppercase',
    padding: '4px 10px 6px',
    opacity: 0.95,
  },
  collapsedDivider: {
    height: '1px',
    backgroundColor: '#123F68',
    margin: '8px 6px',
  },
  groupItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '13px',
    transition: 'all 0.16s ease',
    position: 'relative',
    cursor: 'pointer',
  },
  navLinkActive: {
    backgroundColor: '#083258',
    boxShadow: 'inset 0 0 0 1px rgba(250, 212, 101, 0.25)',
  },
  activeStrip: {
    position: 'absolute',
    left: '0px',
    top: '4px',
    bottom: '4px',
    width: '3.5px',
    backgroundColor: '#FAD465',
    borderRadius: '0 4px 4px 0',
  },
  iconBadge: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background-color 0.15s ease',
  },
  linkText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flex: 1,
    fontSize: '13px',
  },
  badge: {
    fontSize: '10px',
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: '10px',
    lineHeight: 1,
    flexShrink: 0,
  },
  bottomSignOutWrap: {
    marginTop: 'auto',
    paddingTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  signOutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '10px 14px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '10px',
    color: '#EF4444',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease, transform 0.1s ease',
  },
  signOutText: {
    color: '#EF4444',
  },
  versionText: {
    textAlign: 'center',
    fontSize: '11px',
    color: '#8CA5BE',
    paddingBottom: '4px',
  },
  footer: {
    padding: '12px',
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
    background: 'none',
    border: '1px solid #123F68',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#DBE5EE',
    transition: 'all 0.16s ease',
  },
  collapseBtnText: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#DBE5EE',
  },
};
