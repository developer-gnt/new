export type ApplicationStatus = 'submitted' | 'under_review' | 'approved' | 'rejected';
export type ApplicationAccountType = 'membership' | 'seeker';
export type ApplicationTypeFilter = 'all' | 'membership' | 'seeker';

export interface ApplicationDocument {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  uri?: string;
  fileUri?: string;
  isUploaded?: boolean;
  verified?: boolean;
}

export interface ApplicationActivityLog {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: ApplicationStatus | 'submitted';
}

export interface MembershipApplicationItem {
  id: string;
  applicationId: string;
  applicantName: string;
  accountType?: ApplicationAccountType;
  membershipType: string;
  avatarUrl?: string;
  status: ApplicationStatus;
  submittedAt: string;
  submittedDate: string;
  phone?: string;
  email?: string;
  gender?: string;
  dob?: string;
  fatherName?: string;
  address?: string;
  policeStation?: string;
  occupation?: string;
  amount?: number | string;
  paymentStatus?: 'PAID' | 'UNPAID' | 'EXEMPT' | string;
  rejectionReason?: string;
  documents?: ApplicationDocument[];
  activityLog?: ApplicationActivityLog[];
}

export interface ApplicationStatsData {
  total: number;
  underReview: number;
  approved: number;
  rejected: number;
}

export interface ApplicationFilterOptions {
  status: 'all' | ApplicationStatus;
  type: ApplicationTypeFilter;
  sortBy: 'newest' | 'oldest' | 'name_asc';
  accountType?: ApplicationTypeFilter;
  memberType?: string;
  membershipType?: string;
  searchQuery?: string;
}

export function getApplicationAccountType(app?: {
  accountType?: string;
  membershipType?: string;
  applicationId?: string;
}): ApplicationAccountType {
  if (!app) return 'membership';
  if (app.accountType === 'seeker') return 'seeker';
  if (app.accountType === 'membership') return 'membership';
  const type = (app.membershipType || '').toLowerCase();
  const id = (app.applicationId || '').toUpperCase();
  if (type.includes('seeker') || id.startsWith('HRSJM-SEK')) {
    return 'seeker';
  }
  return 'membership';
}

export function formatApplicationAmount(amount?: number | string): string {
  if (amount === undefined || amount === null || amount === '') return '';
  if (typeof amount === 'number') {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  const cleanStr = String(amount).trim();
  if (cleanStr.startsWith('₹')) {
    return cleanStr;
  }
  const num = Number(cleanStr.replace(/[^0-9.]/g, ''));
  if (!isNaN(num) && num > 0) {
    return `₹${num.toLocaleString('en-IN')}`;
  }
  return cleanStr;
}

export function getApplicationFeeAmount(application: Partial<MembershipApplicationItem>): string {
  if (application.amount !== undefined && application.amount !== null && application.amount !== '') {
    const formatted = formatApplicationAmount(application.amount);
    if (formatted) return formatted;
  }

  const isSeeker = getApplicationAccountType(application as any) === 'seeker';
  if (isSeeker) {
    return 'Free / Aid Request';
  }

  const typeStr = (application.membershipType || '').toLowerCase().replace(/’/g, "'").trim();
  if (typeStr.includes('director') || (typeStr.includes('national') && typeStr.includes('council'))) {
    return '₹10,000';
  }
  if (typeStr.includes('lion') || typeStr.includes('counselor') || typeStr.includes('ambassador')) {
    return '₹5,000';
  }
  if (typeStr.includes('state unit')) {
    return '₹2,300';
  }
  if (typeStr.includes('district unit')) {
    return '₹1,300';
  }
  return '₹800';
}

export function getApplicationPaymentStatus(
  application: Partial<MembershipApplicationItem>
): 'PAID' | 'UNPAID' | 'EXEMPT' {
  const isSeeker = getApplicationAccountType(application as any) === 'seeker';
  if (isSeeker) {
    return 'EXEMPT';
  }

  if (application.status === 'approved') {
    return 'PAID';
  }

  const statusStr = String(application.paymentStatus || '').toUpperCase().trim();
  if (
    statusStr === 'PAID' ||
    statusStr === 'COMPLETED' ||
    statusStr === 'SUCCESS' ||
    statusStr === 'SUCCESSFUL' ||
    statusStr === 'VERIFIED'
  ) {
    return 'PAID';
  }

  if (
    statusStr === 'FAILED' ||
    statusStr === 'CANCELLED' ||
    statusStr === 'DECLINED' ||
    statusStr === 'UNPAID'
  ) {
    return 'UNPAID';
  }

  return 'PAID';
}

