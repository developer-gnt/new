/**
 * Support & Complaints Module - Type Definitions
 * Exact parity with APK: hrsjm-application-ui/src/features/admin/support/types/support.types.ts
 * and Backend Entity: HRSJM-back-api/src/modules/support/entities/support-ticket.entity.ts
 */

export type TicketStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED';

export type TicketTabKey = 'ALL' | 'SUBMITTED' | 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED';

export type TicketPriority = 'NORMAL' | 'HIGH' | 'URGENT';

export type TicketSourceType = 'website' | 'web' | 'app';

export interface RelatedUser {
  id: string;
  full_name?: string;
  email?: string;
  mobile_number?: string;
  avatar?: string;
  roles?: string[];
}

export interface TicketAttachment {
  id: string;
  name: string;
  url?: string;
  storage_path?: string;
  size?: number;
  formattedSize?: string;
  type?: string;
  uploadedAt?: string;
}

export interface SupportTicketMessage {
  id: string;
  ticket_id: string;
  author_id: string;
  author?: RelatedUser;
  body: string;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  user?: RelatedUser;
  subject: string;
  description: string;
  status: TicketStatus;
  category?: string;
  priority?: TicketPriority;
  resolved_by?: string | null;
  resolved_by_user?: RelatedUser | null;
  resolved_at?: string | null;
  created_at: string;
  updated_at: string;
  source?: TicketSourceType;
  resolution_note?: string;
  documents?: TicketAttachment[];
  messages?: SupportTicketMessage[];
}

export interface SupportTicketListData {
  items: SupportTicket[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface TicketStatsData {
  total: number;
  open: number; // SUBMITTED
  inProgress: number; // UNDER_REVIEW
  resolved: number; // RESOLVED
  closed: number; // CLOSED
}

export interface CreateTicketBody {
  subject: string;
  description: string;
  category?: string;
  priority?: TicketPriority;
  source?: TicketSourceType;
  attachments?: TicketAttachment[];
}

export interface UpdateTicketStatusBody {
  status: TicketStatus;
  note?: string;
}

export interface AddTicketMessageBody {
  body: string;
}

export interface SupportFilterState {
  status: string; // 'ALL' | TicketStatus
  category: string; // 'ALL' | category name
  priority: string; // 'ALL' | TicketPriority
  dateRange: string; // 'ALL' | 'TODAY' | '7_DAYS' | 'THIS_MONTH' | '90_DAYS'
  source: string; // 'ALL' | TicketSourceType
  fromDate?: string;
  toDate?: string;
}

export interface SupportTicketQuery {
  status?: TicketStatus;
  category?: string;
  priority?: string;
  source?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface StatusMeta {
  label: string;
  tone: 'gold' | 'info' | 'success' | 'neutral';
  badgeBg: string;
  badgeText: string;
  border: string;
}

export const STATUS_META: Record<TicketStatus, StatusMeta> = {
  SUBMITTED: {
    label: 'Open',
    tone: 'gold',
    badgeBg: '#FFF9E6',
    badgeText: '#B45309',
    border: '#FDE68A',
  },
  UNDER_REVIEW: {
    label: 'In Progress',
    tone: 'info',
    badgeBg: '#EFF6FF',
    badgeText: '#0284C7',
    border: '#BAE6FD',
  },
  RESOLVED: {
    label: 'Resolved',
    tone: 'success',
    badgeBg: '#F0FDF4',
    badgeText: '#15803D',
    border: '#BBF7D0',
  },
  CLOSED: {
    label: 'Closed',
    tone: 'neutral',
    badgeBg: '#F1F5F9',
    badgeText: '#475569',
    border: '#CBD5E1',
  },
};

export const TICKET_TABS: Array<{ key: TicketTabKey; label: string }> = [
  { key: 'ALL', label: 'All Tickets' },
  { key: 'SUBMITTED', label: 'Open' },
  { key: 'UNDER_REVIEW', label: 'In Progress' },
  { key: 'RESOLVED', label: 'Resolved' },
  { key: 'CLOSED', label: 'Closed' },
];

export const TICKET_CATEGORIES = [
  { id: 'Membership', label: 'Membership Issue', icon: '🏛️' },
  { id: 'Donation', label: 'Donation & Payment', icon: '💳' },
  { id: 'Assistance', label: 'Assistance / Scheme', icon: '🤝' },
  { id: 'Technical', label: 'App / Technical', icon: '📱' },
  { id: 'KYC', label: 'KYC & Verification', icon: '🪪' },
  { id: 'Human Rights', label: 'Human Rights Grievance', icon: '⚖️' },
  { id: 'General', label: 'General / Other', icon: '💬' },
];

export const PRIORITIES: Array<{
  id: TicketPriority;
  label: string;
  tone: string;
  badgeBg: string;
  border: string;
}> = [
  { id: 'NORMAL', label: 'Normal', tone: '#06294D', badgeBg: '#EFF6FF', border: '#BFDBFE' },
  { id: 'HIGH', label: 'High Priority', tone: '#D97706', badgeBg: '#FEF3C7', border: '#FDE68A' },
  { id: 'URGENT', label: 'Urgent Action', tone: '#DC2626', badgeBg: '#FEE2E2', border: '#FECACA' },
];

export interface SourceMeta {
  label: string;
  shortLabel: string;
  bg: string;
  text: string;
  border: string;
}

export const SOURCE_CONFIG: Record<TicketSourceType, SourceMeta> = {
  website: {
    label: 'Website',
    shortLabel: 'Website',
    bg: '#EFF6FF',
    text: '#1D4ED8',
    border: '#BFDBFE',
  },
  app: {
    label: 'Mobile App',
    shortLabel: 'App',
    bg: '#F0FDF4',
    text: '#15803D',
    border: '#BBF7D0',
  },
  web: {
    label: 'Web App',
    shortLabel: 'Web',
    bg: '#FAF5FF',
    text: '#7E22CE',
    border: '#E9D5FF',
  },
};

// Backend ALLOWED_TRANSITIONS:
//   SUBMITTED    -> UNDER_REVIEW | RESOLVED | CLOSED
//   UNDER_REVIEW -> RESOLVED | CLOSED
//   RESOLVED     -> CLOSED
//   CLOSED       -> (terminal)
export const TICKET_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  SUBMITTED: ['UNDER_REVIEW', 'RESOLVED', 'CLOSED'],
  UNDER_REVIEW: ['RESOLVED', 'CLOSED'],
  RESOLVED: ['CLOSED'],
  CLOSED: [],
};

export function canTransition(from: TicketStatus, to: TicketStatus): boolean {
  return (TICKET_TRANSITIONS[from] || []).includes(to);
}

export function isClosed(status: TicketStatus): boolean {
  return status === 'CLOSED';
}

export function shortTicketId(id: string): string {
  if (!id) return '';
  if (id.startsWith('HRSJM-CMP-')) return id;
  return `HRSJM-CMP-${id.replace(/-/g, '').slice(0, 8).toUpperCase()}`;
}

export function resolveTicketSource(ticket: {
  source?: string;
  description?: string;
  subject?: string;
}): TicketSourceType {
  if (ticket.source) {
    const s = ticket.source.toLowerCase().trim();
    if (s.includes('site') || s === 'website') return 'website';
    if (s === 'web' || s.includes('web app')) return 'web';
    if (s === 'app' || s.includes('mobile')) return 'app';
  }
  const desc = ticket.description || '';
  if (
    desc.includes('Source: Website') ||
    desc.includes('[Source: Website]') ||
    desc.includes('Complainant Information:\n- Full Name:')
  ) {
    return 'website';
  }
  if (
    desc.includes('Source: Web App') ||
    desc.includes('Source: Web') ||
    desc.includes('[Source: Web]')
  ) {
    return 'web';
  }
  return 'app';
}
