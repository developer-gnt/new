import React, { useState, useEffect } from 'react';
import { Calendar, Users, FileText, MessageSquare, Info, SlidersHorizontal } from 'lucide-react';
import { apiClient } from '@/services/apiClient';
import { DashboardStatCard } from '../components/DashboardStatCard';
import { MembershipGrowthChart } from '../components/MembershipGrowthChart';
import { StatusDonutChart } from '../components/StatusDonutChart';
import { RecentMembersTable } from '../components/RecentMembersTable';
import { RecentApplicationsTable } from '../components/RecentApplicationsTable';
import { UpcomingEventsCard } from '../components/UpcomingEventsCard';
import { FinancialSummaryCard } from '../components/FinancialSummaryCard';
import { RecentActivitiesCard } from '../components/RecentActivitiesCard';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { AppEmptyState } from '@/components/common/AppEmptyState';
import { AppErrorState } from '@/components/common/AppErrorState';
import {
  DEMO_APPLICATION_STATUS,
  DEMO_COMPLAINTS_STATUS,
} from '../data/dashboardDemoData';

type DashboardViewState = 'normal' | 'loading' | 'empty' | 'error';

interface LiveDashboardData {
  users?: { total: number; thisMonth: number; prevMonth: number };
  memberships?: { total: number; active: number; pending: number; thisMonth: number; prevMonth: number };
  renewals?: { total: number; pending: number; collectedAmount: number };
  assistance?: { total: number; pending: number; thisMonth: number; prevMonth: number };
  applications?: { total: number; memberships: number; assistance: number; thisMonth: number; prevMonth: number };
  tickets?: { total: number; open: number; thisMonth: number; prevMonth: number };
  events?: { total: number; upcoming: number; thisMonth: number; prevMonth: number };
  donations?: { total: number; receivedAmount: number; thisMonth: number; prevMonth: number };
  revenue?: { membershipIncome: number; donationIncome: number; total: number };
  applicationsByStatus?: Record<string, number>;
  ticketsByStatus?: Record<string, number>;
  memberGrowth?: { month: string; total: number }[];
  recentActivity?: any[];
}

export const AdminDashboardPage: React.FC = () => {
  const [viewState, setViewState] = useState<DashboardViewState>('normal');
  const [dashboardData, setDashboardData] = useState<LiveDashboardData | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAdminDashboard = async () => {
      try {
        const res = await apiClient.get<any>('/admin/dashboard');
        const data = (res as any)?.data || res;
        if (isMounted && data) {
          setDashboardData(data);
        }
      } catch (err) {
        console.warn('Could not fetch live admin dashboard metrics:', err);
      }
    };
    fetchAdminDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div style={styles.dashboardContainer}>
      {/* State Switcher & Demonstration Mode Notice */}
      <div style={styles.topControlBanner}>
        <div style={styles.demoNoticeText}>
          <Info size={16} color="#174A78" style={{ flexShrink: 0 }} />
          <span>
            <strong>HRSJM Web Dashboard:</strong> Connected to live HRSJM backend API with graceful offline fallback.
          </span>
        </div>

        {/* View State Controls for Testing */}
        <div style={styles.stateControlsWrapper}>
          <SlidersHorizontal size={14} color="#64748B" />
          <span style={styles.stateLabel}>Preview State:</span>
          <div style={styles.buttonGroup}>
            {(['normal', 'loading', 'empty', 'error'] as const).map((state) => (
              <button
                key={state}
                onClick={() => setViewState(state)}
                style={{
                  ...styles.stateBtn,
                  ...(viewState === state ? styles.activeStateBtn : {}),
                }}
              >
                {state.charAt(0).toUpperCase() + state.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Page Header */}
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.headingTitle}>Welcome, Administrator</h1>
          <p style={styles.headingSubtitle}>
            Human Rights Sarv Janhit Manch — National Digital Governance &amp; Membership Overview
          </p>
        </div>
        <div style={styles.dateBadge}>
          <Calendar size={15} color="#1E3A8A" />
          <span>November 2026 (Live FY 26-27)</span>
        </div>
      </div>

      {/* View State Logic Renderings */}
      {viewState === 'loading' && (
        <div style={styles.contentGrid}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SkeletonCard height={120} />
            <SkeletonCard height={120} />
            <SkeletonCard height={120} />
            <SkeletonCard height={120} />
          </div>
          <div style={styles.twoColumnGrid}>
            <SkeletonCard height={320} />
            <SkeletonCard height={320} />
          </div>
          <div style={styles.twoColumnGrid}>
            <SkeletonCard height={360} />
            <SkeletonCard height={360} />
          </div>
        </div>
      )}

      {viewState === 'empty' && (
        <div style={styles.emptyContainer}>
          <AppEmptyState
            title="No Activity Found for this Cycle"
            description="The administrative database has not recorded recent transactions or application events for this active fiscal term."
            actionLabel="Refresh Indicators"
            onAction={() => setViewState('normal')}
          />
        </div>
      )}

      {viewState === 'error' && (
        <div style={styles.errorContainer}>
          <AppErrorState
            title="Unable to Synchronize Governance Metrics"
            message="Encountered a gateway communication timeout while aggregating state and national figures."
            onRetry={() => setViewState('normal')}
          />
        </div>
      )}

      {viewState === 'normal' && (
        <div style={styles.normalViewWrapper}>
          {/* 4 Primary Top Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardStatCard
              title="Total Members"
              value={dashboardData?.memberships ? dashboardData.memberships.total.toLocaleString('en-IN') : '33'}
              subtitle={dashboardData?.memberships ? `+${dashboardData.memberships.thisMonth} this month` : '+9 this month'}
              tone="navy"
              linkTo="/admin/members"
              icon={Users}
            />
            <DashboardStatCard
              title="Total Applications"
              value={dashboardData?.applications ? dashboardData.applications.total.toLocaleString('en-IN') : '61'}
              subtitle={dashboardData?.memberships ? `${dashboardData.memberships.pending || 0} pending review` : '7 pending review'}
              tone="gold"
              linkTo="/admin/applications"
              icon={FileText}
            />
            <DashboardStatCard
              title="Total Complaints"
              value={dashboardData?.tickets ? dashboardData.tickets.total.toLocaleString('en-IN') : '38'}
              subtitle={dashboardData?.tickets ? `${dashboardData.tickets.open} open tickets` : '28 open tickets'}
              tone="success"
              linkTo="/admin/support"
              icon={MessageSquare}
            />
            <DashboardStatCard
              title="Total Events"
              value={dashboardData?.events ? dashboardData.events.total.toLocaleString('en-IN') : '5'}
              subtitle={dashboardData?.events ? `${dashboardData.events.upcoming} upcoming this month` : '2 upcoming this month'}
              tone="warning"
              linkTo="/admin/events"
              icon={Calendar}
            />
          </div>

          {/* Interactive Trends & Breakdowns */}
          <div style={styles.twoColumnGrid}>
            <MembershipGrowthChart />
            <StatusDonutChart
              title="Application Status Distribution"
              segments={
                dashboardData?.applicationsByStatus
                  ? [
                      { label: 'Pending Verification', count: dashboardData.applicationsByStatus.PENDING || 0, color: '#D97706' },
                      { label: 'Under Review', count: dashboardData.applicationsByStatus.UNDER_REVIEW || 0, color: '#174A78' },
                      { label: 'Accredited / Approved', count: dashboardData.applicationsByStatus.APPROVED || 0, color: '#16A34A' },
                      { label: 'Rejected', count: dashboardData.applicationsByStatus.REJECTED || 0, color: '#DC2626' },
                    ]
                  : DEMO_APPLICATION_STATUS
              }
            />
          </div>

          {/* Data Tables: Members & Applications */}
          <div style={styles.twoColumnGrid}>
            <RecentMembersTable />
            <RecentApplicationsTable />
          </div>

          {/* Secondary Row: Complaints breakdown, Financial Summary, Upcoming events */}
          <div style={styles.threeColumnGrid}>
            <UpcomingEventsCard />
            <FinancialSummaryCard
              totalCollections={dashboardData?.revenue?.total}
              receiptsCount={dashboardData?.donations?.total}
            />
            <StatusDonutChart
              title="Complaints Resolution"
              segments={
                dashboardData?.ticketsByStatus
                  ? [
                      { label: 'Submitted', count: dashboardData.ticketsByStatus.SUBMITTED || 0, color: '#D97706' },
                      { label: 'Under Investigation', count: dashboardData.ticketsByStatus.UNDER_REVIEW || 0, color: '#174A78' },
                      { label: 'Resolved', count: dashboardData.ticketsByStatus.RESOLVED || 0, color: '#16A34A' },
                      { label: 'Closed', count: dashboardData.ticketsByStatus.CLOSED || 0, color: '#64748B' },
                    ]
                  : DEMO_COMPLAINTS_STATUS
              }
            />
          </div>

          {/* Real-time Activity Feed */}
          <div style={styles.fullWidthSection}>
            <RecentActivitiesCard />
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  topControlBanner: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#F0F7FF',
    border: '1px solid #BFDBFE',
    borderRadius: '10px',
    padding: '10px 16px',
    fontSize: '13px',
  },
  demoNoticeText: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#1E3A8A',
  },
  stateControlsWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  stateLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#475569',
  },
  buttonGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#FFFFFF',
    padding: '2px',
    borderRadius: '6px',
    border: '1px solid #CBD5E1',
  },
  stateBtn: {
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#64748B',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  activeStateBtn: {
    backgroundColor: '#0F2942',
    color: '#FFFFFF',
  },
  headerRow: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
  },
  headingTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  headingSubtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    margin: '4px 0 0 0',
  },
  dateBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#1E293B',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
  },
  statCardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    gap: '20px',
  },
  threeColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px',
  },
  fullWidthSection: {
    width: '100%',
  },
  contentGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  normalViewWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    padding: '48px 24px',
  },
  errorContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    padding: '48px 24px',
  },
};

export default AdminDashboardPage;
