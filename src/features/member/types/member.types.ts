/**
 * HRSJM Member Portal Types & Contracts
 * Based on BRD_Member.md & Backend API Handoff Contract
 */

export type MembershipCategoryKey =
  | 'annual_regular'
  | 'life_member'
  | 'patron_member'
  | 'student_youth';

export type MemberStatus =
  | 'ACTIVE'
  | 'EXPIRING_SOON'
  | 'EXPIRED'
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'REJECTED'
  | 'SUSPENDED';

export interface MemberAddress {
  line: string;
  city: string;
  state: string;
  pincode: string;
}

export interface MemberDocumentItem {
  id: string;
  type: 'photo' | 'id_proof' | 'address_proof' | 'signature' | 'other';
  title: string;
  fileUrl: string;
  fileName: string;
  fileSize?: string;
  uploadedAt: string;
  status: 'VERIFIED' | 'PENDING' | 'REJECTED';
  rejectionReason?: string;
}

export interface MemberStats {
  totalDonated: number;
  donationCount: number;
  eventsAttended: number;
  ticketsCount: number;
  activeTicketsCount: number;
}

export interface MemberProfile {
  id: string;
  userId: string;
  membershipNumber: string; // e.g. HRSJM-MEM-2026-0842
  applicationNumber?: string;
  fullName: string;
  fatherOrSpouseName?: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  dob?: string;
  gender?: string;
  bloodGroup: string; // e.g. O+, B+, etc.
  occupation?: string;
  address: MemberAddress;
  chapter: string; // e.g. 'National Capital Chapter, New Delhi'
  designation: string; // e.g. 'General Member' | 'Executive Member'
  category: MembershipCategoryKey;
  categoryTitle: string; // e.g. 'Annual Regular Member'
  status: MemberStatus;
  validFrom: string; // ISO date
  validUpto: string; // ISO date
  daysRemaining: number;
  isExpiringSoon: boolean; // true if daysRemaining <= 30
  isExpired: boolean;
  joiningDate: string;
  stats: MemberStats;
  qrVerificationUrl: string;
  documents: MemberDocumentItem[];
}

export interface MemberAnnouncement {
  id: string;
  title: string;
  summary: string;
  category: 'general' | 'agm' | 'renewal' | 'rally' | 'legal_camp';
  date: string;
  priority?: 'high' | 'normal';
  link?: string;
}

export type TransactionType =
  | 'MEMBERSHIP_FEE'
  | 'MEMBERSHIP_RENEWAL'
  | 'DONATION'
  | 'EVENT_FEE';

export type PaymentStatus = 'SUCCESS' | 'PENDING' | 'FAILED';

export interface MemberPassbookEntry {
  id: string;
  receiptNumber: string; // e.g. HRSJM/REC/2026/0182
  date: string; // ISO date
  type: TransactionType;
  title: string;
  description: string;
  amount: number;
  paymentMethod: 'UPI' | 'NET_BANKING' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH' | 'CASHFREE';
  transactionId: string; // Gateway reference
  status: PaymentStatus;
  has80GReceipt: boolean;
  donorPan?: string;
  section80GRef?: string;
  pdfDownloadUrl?: string;
}

export interface RenewalPackageOption {
  id: 'standard_1yr' | 'extended_3yr' | 'upgrade_state' | 'upgrade_life';
  name: string;
  durationYears: number;
  fee: number;
  originalFee?: number;
  discountBadge?: string;
  description: string;
  features: string[];
  recommended?: boolean;
}
