/**
 * HRSJM Admin Dashboard Demonstration Data
 *
 * NOTE: This is clearly separated local demonstration data for the UI build phase.
 * It is NOT live backend data. Real backend APIs from `HRSJM-back-api` (/admin/dashboard,
 * /memberships, etc.) will be connected in subsequent phases without modifying mobile code.
 */

export interface DashboardMetric {
  title: string;
  value: string | number;
  subtitle: string;
  tone: 'navy' | 'gold' | 'success' | 'warning';
  linkTo: string;
}

export const DEMO_DASHBOARD_METRICS: DashboardMetric[] = [
  {
    title: 'Total Members',
    value: 1248,
    subtitle: '+42 this month',
    tone: 'navy',
    linkTo: '/admin/members',
  },
  {
    title: 'Total Applications',
    value: 186,
    subtitle: '+28 pending review',
    tone: 'warning',
    linkTo: '/admin/membership-applications',
  },
  {
    title: 'Total Complaints',
    value: 34,
    subtitle: '85% resolution rate',
    tone: 'success',
    linkTo: '/admin/support',
  },
  {
    title: 'Total Events',
    value: 18,
    subtitle: '3 upcoming this month',
    tone: 'gold',
    linkTo: '/admin/events',
  },
];

export interface GrowthPoint {
  label: string;
  members: number;
}

export const DEMO_GROWTH_DATA: Record<string, GrowthPoint[]> = {
  '7d': [
    { label: 'Mon', members: 1236 },
    { label: 'Tue', members: 1239 },
    { label: 'Wed', members: 1241 },
    { label: 'Thu', members: 1243 },
    { label: 'Fri', members: 1245 },
    { label: 'Sat', members: 1246 },
    { label: 'Sun', members: 1248 },
  ],
  '30d': [
    { label: 'Week 1', members: 1210 },
    { label: 'Week 2', members: 1222 },
    { label: 'Week 3', members: 1235 },
    { label: 'Week 4', members: 1248 },
  ],
  '6m': [
    { label: 'Jun', members: 1040 },
    { label: 'Jul', members: 1095 },
    { label: 'Aug', members: 1140 },
    { label: 'Sep', members: 1185 },
    { label: 'Oct', members: 1220 },
    { label: 'Nov', members: 1248 },
  ],
  '1y': [
    { label: 'Q1', members: 890 },
    { label: 'Q2', members: 1020 },
    { label: 'Q3', members: 1150 },
    { label: 'Q4', members: 1248 },
  ],
};

export interface DonutSegment {
  label: string;
  count: number;
  color: string;
}

export const DEMO_APPLICATION_STATUS: DonutSegment[] = [
  { label: 'Approved', count: 142, color: '#16A34A' },
  { label: 'Under Review', count: 28, color: '#FAD465' },
  { label: 'Pending', count: 12, color: '#174A78' },
  { label: 'Rejected', count: 4, color: '#DC2626' },
];

export const DEMO_COMPLAINTS_STATUS: DonutSegment[] = [
  { label: 'Resolved', count: 26, color: '#16A34A' },
  { label: 'In Progress', count: 6, color: '#E9B82E' },
  { label: 'Open', count: 2, color: '#06294D' },
];

export interface RecentMember {
  id: string;
  name: string;
  memberId: string;
  category: string;
  joinedDate: string;
  status: 'ACTIVE' | 'PENDING' | 'EXPIRING';
}

export const DEMO_RECENT_MEMBERS: RecentMember[] = [
  {
    id: '1',
    name: 'Rajesh Kumar Sharma',
    memberId: 'HRSJM-MEM-0891',
    category: 'State Delegate',
    joinedDate: '02 Nov 2026',
    status: 'ACTIVE',
  },
  {
    id: '2',
    name: 'Dr. Sunita Verma',
    memberId: 'HRSJM-MEM-0890',
    category: 'Executive Member',
    joinedDate: '31 Oct 2026',
    status: 'ACTIVE',
  },
  {
    id: '3',
    name: 'Mohammad Tariq Khan',
    memberId: 'HRSJM-MEM-0889',
    category: 'General Member',
    joinedDate: '29 Oct 2026',
    status: 'ACTIVE',
  },
  {
    id: '4',
    name: 'Pooja Anand',
    memberId: 'HRSJM-MEM-0888',
    category: 'Legal Aid Counsel',
    joinedDate: '27 Oct 2026',
    status: 'ACTIVE',
  },
  {
    id: '5',
    name: 'Vikramaditya Rathore',
    memberId: 'HRSJM-MEM-0887',
    category: 'District Coordinator',
    joinedDate: '25 Oct 2026',
    status: 'ACTIVE',
  },
];

export interface RecentApplication {
  id: string;
  applicantName: string;
  applicationId: string;
  type: string;
  submittedDate: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED';
}

export const DEMO_RECENT_APPLICATIONS: RecentApplication[] = [
  {
    id: 'app-1',
    applicantName: 'Amitabh Sengupta',
    applicationId: 'HRSJM-APP-9210',
    type: 'State Delegate',
    submittedDate: '03 Nov 2026',
    status: 'SUBMITTED',
  },
  {
    id: 'app-2',
    applicantName: 'Kavita Deshmukh',
    applicationId: 'HRSJM-APP-9208',
    type: 'Legal Counselor',
    submittedDate: '02 Nov 2026',
    status: 'UNDER_REVIEW',
  },
  {
    id: 'app-3',
    applicantName: 'Harpreet Singh Gill',
    applicationId: 'HRSJM-APP-9205',
    type: 'General Member',
    submittedDate: '01 Nov 2026',
    status: 'SUBMITTED',
  },
  {
    id: 'app-4',
    applicantName: 'Farhan Zaidi',
    applicationId: 'HRSJM-APP-9199',
    type: 'Donation Seeker Aid',
    submittedDate: '30 Oct 2026',
    status: 'UNDER_REVIEW',
  },
  {
    id: 'app-5',
    applicantName: 'Deepika Nair',
    applicationId: 'HRSJM-APP-9195',
    type: 'Executive Member',
    submittedDate: '28 Oct 2026',
    status: 'APPROVED',
  },
];

export interface RecentActivity {
  id: string;
  type: 'member' | 'application' | 'donation' | 'complaint';
  description: string;
  timestamp: string;
  actor: string;
}

export const DEMO_RECENT_ACTIVITIES: RecentActivity[] = [
  {
    id: 'act-1',
    type: 'application',
    description: 'Membership application HRSJM-APP-9210 marked Under Review',
    timestamp: '10 mins ago',
    actor: 'Admin Officer',
  },
  {
    id: 'act-2',
    type: 'donation',
    description: 'Contribution of ₹5,000 received with 80G digital receipt issued',
    timestamp: '42 mins ago',
    actor: 'Payment Gateway',
  },
  {
    id: 'act-3',
    type: 'member',
    description: 'Rajesh Kumar Sharma approved and ID Card HRSJM-MEM-0891 dispatched',
    timestamp: '2 hours ago',
    actor: 'Super Admin',
  },
  {
    id: 'act-4',
    type: 'complaint',
    description: 'Public grievance ticket #34 resolved by Lucknow legal chapter',
    timestamp: '4 hours ago',
    actor: 'Legal Counsel',
  },
];

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  registeredCount: number;
  category: 'Human Rights' | 'Legal Aid' | 'National Meet';
}

export const DEMO_UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    id: 'ev-1',
    title: 'National Human Rights & Legal Aid Conclave 2026',
    date: '15 Nov 2026',
    location: 'Vigyan Bhawan, New Delhi',
    registeredCount: 340,
    category: 'National Meet',
  },
  {
    id: 'ev-2',
    title: 'Grassroots Human Rights Awareness Workshop',
    date: '22 Nov 2026',
    location: 'Lucknow Chapter Office',
    registeredCount: 95,
    category: 'Legal Aid',
  },
  {
    id: 'ev-3',
    title: 'Women & Child Protection Seminar',
    date: '29 Nov 2026',
    location: 'Jaipur Conference Center',
    registeredCount: 160,
    category: 'Human Rights',
  },
];
