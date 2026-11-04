import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  FileText,
  MessageSquare,
  Info,
  SlidersHorizontal,
  UserCheck,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  FolderOpen,
} from 'lucide-react';
import { DashboardStatCard } from '../features/dashboard/components/DashboardStatCard';
import { MembershipGrowthChart } from '../features/dashboard/components/MembershipGrowthChart';
import { StatusDonutChart } from '../features/dashboard/components/StatusDonutChart';
import { RecentMembersTable } from '../features/dashboard/components/RecentMembersTable';
import { RecentApplicationsTable } from '../features/dashboard/components/RecentApplicationsTable';
import { UpcomingEventsCard } from '../features/dashboard/components/UpcomingEventsCard';
import { FinancialSummaryCard } from '../features/dashboard/components/FinancialSummaryCard';
import { RecentActivitiesCard } from '../features/dashboard/components/RecentActivitiesCard';
import { SkeletonCard } from '../components/common/SkeletonCard';
import { AppEmptyState } from '../components/common/AppEmptyState';
import { AppErrorState } from '../components/common/AppErrorState';
import {
  DEMO_APPLICATION_STATUS,
  DEMO_COMPLAINTS_STATUS,
} from '../features/dashboard/data/dashboardDemoData';

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
            <strong>HRSJM Web Dashboard:</strong> Local demonstration data mode. Ready for future backend API integration with zero impact on mobile APK.
          </span>
        </div>

        {/* View State Controls for Testing */}
        <div style={styles.stateControls}>
          <div style={styles.stateLabel}>
            <SlidersHorizontal size={13} color="#718096" />
            <span>Preview State:</span>
          </div>
          {(['normal', 'loading', 'empty', 'error'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setViewState(s)}
              style={{
                ...styles.stateBtn,
                ...(viewState === s ? styles.stateBtnActive : {}),
              }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Welcome Banner */}
      <div style={styles.welcomeSection}>
        <div style={styles.welcomeText}>
          <h2 style={styles.welcomeTitle}>Welcome, Administrator</h2>
          <p style={styles.welcomeSubtitle}>
            Human Rights Sarv Janhit Manch — National Digital Governance & Membership Overview
          </p>
        </div>

        {/* Current Period Filter Chip */}
        <div style={styles.periodChip}>
          <Calendar size={15} color="#06294D" />
          <span style={styles.periodText}>November 2026 (Live FY 26-27)</span>
        </div>
      </div>

      {/* RENDER VIEW STATES */}
      {viewState === 'loading' && (
        <div style={styles.loadingWrapper}>
          <div style={styles.statsGrid}>
            <SkeletonCard height={120} borderRadius={10} />
            <SkeletonCard height={120} borderRadius={10} />
            <SkeletonCard height={120} borderRadius={10} />
            <SkeletonCard height={120} borderRadius={10} />
          </div>
          <SkeletonCard height={320} borderRadius={12} />
          <div style={styles.twoColumnGrid}>
            <SkeletonCard height={240} borderRadius={12} />
            <SkeletonCard height={240} borderRadius={12} />
          </div>
          <div style={styles.twoColumnGrid}>
            <SkeletonCard height={300} borderRadius={12} />
            <SkeletonCard height={300} borderRadius={12} />
          </div>
        </div>
      )}

      {viewState === 'error' && (
        <AppErrorState
          title="Unable to Retrieve Live Dashboard Statistics"
          message="A simulated communication timeout occurred. In production, this reconnects with HRSJM-back-api (/admin/dashboard)."
          onRetry={() => setViewState('normal')}
        />
      )}

      {viewState === 'empty' && (
        <AppEmptyState
          title="No Administrative Activity Found"
          description="There are no registered members, applications, or donations recorded for the selected period."
          actionLabel="Switch to Active Overview"
          onAction={() => setViewState('normal')}
        />
      )}

      {viewState === 'normal' && (
        <>
          {/* Core Operational Modules Hub — Quick Direct Navigation */}
          <section style={styles.hubSection}>
            <div style={styles.hubHeader}>
              <div style={styles.hubTitleWrap}>
                <FolderOpen size={18} color="#06294D" />
                <h3 style={styles.hubTitle}>Core Administrative Modules</h3>
              </div>
              <span style={styles.hubSubtitle}>Primary registries, approvals inbox & humanitarian relief</span>
            </div>

            <div style={styles.hubGrid}>
              {/* Module 1: Members Directory */}
              <Link to="/admin/members" style={styles.hubCard}>
                <div style={styles.hubCardTop}>
                  <div style={{ ...styles.hubIconWrap, backgroundColor: '#011F39', color: '#FAD465' }}>
                    <UserCheck size={22} />
                  </div>
                  <span style={{ ...styles.hubBadge, backgroundColor: '#EAF7EE', color: '#16A34A' }}>
                    1,248 Members
                  </span>
                </div>
                <h4 style={styles.hubCardTitle}>Members Directory</h4>
                <p style={styles.hubCardDesc}>
                  Verified member registry, digital ID cards, renewal tracking and profile approvals.
                </p>
                <div style={styles.hubCardAction}>
                  <span>Open Members Directory</span>
                  <ArrowRight size={15} />
                </div>
              </Link>

              {/* Module 2: All Applications */}
              <Link to="/admin/membership-applications" style={styles.hubCard}>
                <div style={styles.hubCardTop}>
                  <div style={{ ...styles.hubIconWrap, backgroundColor: '#06294D', color: '#FAD465' }}>
                    <FileText size={22} />
                  </div>
                  <span style={{ ...styles.hubBadge, backgroundColor: '#FEF6E7', color: '#D97706' }}>
                    28 Pending Review
                  </span>
                </div>
                <h4 style={styles.hubCardTitle}>All Applications</h4>
                <p style={styles.hubCardDesc}>
                  Membership registration applications, KYC document verification and review decisions.
                </p>
                <div style={styles.hubCardAction}>
                  <span>Review Applications</span>
                  <ArrowRight size={15} />
                </div>
              </Link>

              {/* Module 3: Donation Seekers & Aid */}
              <Link to="/admin/assistance" style={styles.hubCard}>
                <div style={styles.hubCardTop}>
                  <div style={{ ...styles.hubIconWrap, backgroundColor: '#123F68', color: '#FAD465' }}>
                    <HeartHandshake size={22} />
                  </div>
                  <span style={{ ...styles.hubBadge, backgroundColor: '#FFF9E6', color: '#B45309' }}>
                    12 Active Cases
                  </span>
                </div>
                <h4 style={styles.hubCardTitle}>Donation Seekers & Aid</h4>
                <p style={styles.hubCardDesc}>
                  Humanitarian relief, legal aid & medical assistance requests, case assessments and aid distribution.
                </p>
                <div style={styles.hubCardAction}>
                  <span>Open Donation & Aid</span>
                  <ArrowRight size={15} />
                </div>
              </Link>

              {/* Module 4: User Management */}
              <Link to="/admin/users" style={styles.hubCard}>
                <div style={styles.hubCardTop}>
                  <div style={{ ...styles.hubIconWrap, backgroundColor: '#174A78', color: '#FAD465' }}>
                    <ShieldCheck size={22} />
                  </div>
                  <span style={{ ...styles.hubBadge, backgroundColor: '#EDF2F7', color: '#174A78' }}>
                    System Users
                  </span>
                </div>
                <h4 style={styles.hubCardTitle}>User Management</h4>
                <p style={styles.hubCardDesc}>
                  User directory, administrative credentials, role-based permissions and verification audits.
                </p>
                <div style={styles.hubCardAction}>
                  <span>Manage Users</span>
                  <ArrowRight size={15} />
                </div>
              </Link>
            </div>
          </section>

          {/* 4 Primary KPI Summary Cards */}
          <section style={styles.statsGrid}>
            <DashboardStatCard
              title="Total Members"
              value="1,248"
              subtitle="+42 this month"
              tone="navy"
              linkTo="/admin/members"
              icon={UserCheck}
            />
            <DashboardStatCard
              title="Total Applications"
              value="186"
              subtitle="+28 pending review"
              tone="warning"
              linkTo="/admin/membership-applications"
              icon={FileText}
            />
            <DashboardStatCard
              title="Donation & Aid Seekers"
              value="12"
              subtitle="Active welfare cases"
              tone="gold"
              linkTo="/admin/assistance"
              icon={HeartHandshake}
            />
            <DashboardStatCard
              title="Total Complaints"
              value="34"
              subtitle="85% resolution rate"
              tone="success"
              linkTo="/admin/support"
              icon={MessageSquare}
            />
          </section>

          {/* Growth Line Chart */}
          <section style={styles.section}>
            <MembershipGrowthChart />
          </section>

          {/* 2-Column Donut Charts */}
          <section style={styles.twoColumnGrid}>
            <StatusDonutChart
              title="Application Status Overview"
              subtitle="Review status across member and aid requests"
              segments={DEMO_APPLICATION_STATUS}
              centerLabel="Applications"
            />
            <StatusDonutChart
              title="Grievance & Support Tracking"
              subtitle="Public human rights complaints resolution"
              segments={DEMO_COMPLAINTS_STATUS}
              centerLabel="Complaints"
            />
          </section>

          {/* 2-Column Tables */}
          <section style={styles.twoColumnGrid}>
            <RecentMembersTable />
            <RecentApplicationsTable />
          </section>

          {/* Bottom Row: Upcoming Events, Financial Summary & Audit Activities */}
          <section style={styles.twoColumnGrid}>
            <UpcomingEventsCard />
            <FinancialSummaryCard />
          </section>

          {/* Audit Timeline / Recent Activities */}
          <section style={styles.section}>
            <RecentActivitiesCard />
          </section>
        </>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    paddingBottom: '40px',
  },
  topControlBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
    backgroundColor: '#EDF2F7',
    border: '1px solid #DBE5EE',
    borderRadius: '10px',
    padding: '10px 16px',
  },
  demoNoticeText: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12.5px',
    color: '#174A78',
    lineHeight: 1.4,
    flex: 1,
  },
  stateControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#FFFFFF',
    padding: '3px 6px',
    borderRadius: '6px',
    border: '1px solid #DCE4EC',
  },
  stateLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#718096',
    marginRight: '4px',
  },
  stateBtn: {
    padding: '3px 8px',
    fontSize: '11px',
    fontWeight: 600,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '4px',
    color: '#718096',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  stateBtnActive: {
    backgroundColor: '#06294D',
    color: '#FAD465',
  },
  welcomeSection: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
  },
  welcomeText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  welcomeTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#0B2F52',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  welcomeSubtitle: {
    fontSize: '13.5px',
    color: '#34516D',
    margin: 0,
  },
  periodChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '8px',
    padding: '7px 14px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
  },
  periodText: {
    fontSize: '12.5px',
    fontWeight: 600,
    color: '#06294D',
  },
  hubSection: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #DBE5EE',
    borderRadius: '14px',
    padding: '20px 24px',
    boxShadow: '0 2px 6px rgba(1, 31, 57, 0.04)',
  },
  hubHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #EDF2F7',
  },
  hubTitleWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  hubTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#011F39',
    margin: 0,
  },
  hubSubtitle: {
    fontSize: '13px',
    color: '#718096',
  },
  hubGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '16px',
  },
  hubCard: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FAF7F0',
    border: '1px solid #DCE4EC',
    borderRadius: '12px',
    padding: '16px',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  hubCardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  hubIconWrap: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubBadge: {
    fontSize: '11.5px',
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: '6px',
  },
  hubCardTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#011F39',
    margin: '0 0 6px 0',
  },
  hubCardDesc: {
    fontSize: '12.5px',
    color: '#475569',
    margin: '0 0 14px 0',
    lineHeight: 1.45,
    flex: 1,
  },
  hubCardAction: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: 700,
    color: '#174A78',
    marginTop: 'auto',
  },
  loadingWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '18px',
  },
  section: {
    width: '100%',
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
    gap: '20px',
  },
};
