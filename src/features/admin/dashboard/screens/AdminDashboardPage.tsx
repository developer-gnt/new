import React, { useState } from 'react';
import { Calendar, Users, FileText, MessageSquare, Info, SlidersHorizontal } from 'lucide-react';
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

export const AdminDashboardPage: React.FC = () => {
  const [viewState, setViewState] = useState<DashboardViewState>('normal');

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
          <div style={styles.statCardsGrid}>
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
          <div style={styles.statCardsGrid}>
            <DashboardStatCard
              title="Total Members"
              value="1,248"
              subtitle="+42 this month"
              tone="navy"
              linkTo="/admin/members"
              icon={Users}
            />
            <DashboardStatCard
              title="Total Applications"
              value="186"
              subtitle="+28 pending review"
              tone="gold"
              linkTo="/admin/applications"
              icon={FileText}
            />
            <DashboardStatCard
              title="Total Complaints"
              value="34"
              subtitle="85% resolution rate"
              tone="success"
              linkTo="/admin/support"
              icon={MessageSquare}
            />
            <DashboardStatCard
              title="Total Events"
              value="18"
              subtitle="3 upcoming this month"
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
              segments={DEMO_APPLICATION_STATUS}
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
            <FinancialSummaryCard />
            <StatusDonutChart
              title="Complaints Resolution"
              segments={DEMO_COMPLAINTS_STATUS}
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
    fontFamily: 'serif',
    fontSize: '28px',
    fontWeight: 700,
    color: '#0F2942',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  headingSubtitle: {
    fontSize: '14px',
    color: '#64748B',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '18px',
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
