export type AssistanceStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'CLOSED';

export type AssistanceTabKey =
  | 'ALL'
  | 'ACTIVE'
  | 'URGENT'
  | 'COMPLETED'
  | 'APPROVED'
  | 'UNDER_REVIEW'
  | 'REJECTED';

export type UrgencyLevel = 'NORMAL' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AssistanceDocumentItem {
  id: string;
  document_name: string;
  document_type: string;
  original_file_name: string;
  mime_type: string;
  file_size: number | string;
  description: string | null;
  is_archived?: boolean;
  created_at: string;
  url?: string;
  verified?: boolean;
}

export interface AssistanceRequest {
  id: string;
  user_id: string;
  full_name: string;
  mobile: string;
  email: string | null;
  requested_amount: number;
  reason: string;
  description: string | null;
  status: AssistanceStatus;
  admin_remark: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    full_name?: string;
    mobile_number?: string;
    email?: string;
    avatar?: string;
  };
  age?: number;
  city?: string;
  state?: string;
  urgency?: UrgencyLevel;
  raised_amount?: number;
  donor_count?: number;
  documents?: AssistanceDocumentItem[];
}

export interface AssistanceSummaryStats {
  total: number;
  active?: number;
  urgent?: number;
  completed?: number;
  underReview?: number;
  approved?: number;
  rejected?: number;
  closed?: number;
  totalAmount: number;
  totalTarget?: number;
}

export interface AssistanceQuery {
  status?: AssistanceStatus;
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  urgency?: string;
  min_amount?: number;
  max_amount?: number;
  from_date?: string;
  to_date?: string;
}

export interface AssistanceFilterState {
  status?: AssistanceStatus;
  category?: string;
  urgency?: UrgencyLevel;
  minAmount?: number;
  maxAmount?: number;
  fromDate?: string;
  toDate?: string;
}

export interface AttachedDocumentPayload {
  document_name: string;
  file_name: string;
  file_size?: string | number;
  mime_type?: string;
  uri?: string;
  url?: string;
}

export interface CreateAssistanceRequestPayload {
  full_name: string;
  mobile: string;
  email?: string;
  requested_amount: number;
  reason: string;
  description?: string;
  user_id?: string;
  admin_remark?: string;
  status?: AssistanceStatus;
  age?: number;
  city?: string;
  state?: string;
  urgency?: UrgencyLevel;
  documents?: AttachedDocumentPayload[];
}

export interface UpdateAssistanceStatusBody {
  status: AssistanceStatus;
  admin_remark?: string;
}

export const TERMINAL_STATUSES: AssistanceStatus[] = ['APPROVED', 'REJECTED', 'CLOSED'];

export function isTerminalStatus(status: AssistanceStatus): boolean {
  return TERMINAL_STATUSES.includes(status);
}

export function shortRequestId(id: string): string {
  return `#DS${id.replace(/-/g, '').slice(0, 8).toUpperCase()}`;
}

