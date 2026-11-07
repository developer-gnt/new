export type AssistanceStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'CLOSED';

export interface AssistanceDocumentItem {
  id: string;
  document_name: string;
  file_name?: string;
  fileName?: string;
  file_size?: string;
  fileSize?: string;
  mime_type?: string;
  file_url?: string;
  url?: string;
  verification_status?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  created_at?: string;
}

export interface AssistanceRequest {
  id: string;
  user_id?: string;
  full_name: string;
  mobile: string;
  email?: string | null;
  requested_amount: number | string;
  reason: string;
  description?: string | null;
  status: AssistanceStatus;
  admin_remark?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  updated_at?: string;
  documents?: AssistanceDocumentItem[];
}

export interface CreateAssistancePayload {
  full_name: string;
  mobile: string;
  email?: string;
  requested_amount: number;
  reason: string;
  description?: string;
  status?: AssistanceStatus;
  documents?: Array<{
    document_name: string;
    file_name: string;
    file_size?: string;
    file?: File | Blob;
    uri?: string;
  }>;
}

export interface AssistanceStats {
  total: number;
  underReview: number;
  approved: number;
  rejected: number;
  closed: number;
  totalAmount: number;
}

export interface SupportTicketMessage {
  id: string;
  ticket_id: string;
  sender_user_id: string;
  sender_name?: string;
  is_admin: boolean;
  message: string;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  ticket_number?: string;
  user_id: string;
  user_name?: string;
  category: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  created_at: string;
  updated_at?: string;
  messages?: SupportTicketMessage[];
}

export interface CreateSupportTicketPayload {
  category: string;
  subject: string;
  description: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface RightsArticle {
  id: string;
  title: string;
  category: 'CONSTITUTIONAL' | 'WOMEN_CHILD' | 'CIVIL_JUSTICE' | 'LABOUR_WELFARE';
  categoryLabel: string;
  legalReference: string;
  summary: string;
  fullContent?: string;
  highlights: string[];
  helpline?: string;
}

export interface SeekerEventItem {
  id: string;
  title: string;
  category: string;
  date: string;
  day: string;
  month: string;
  year?: string;
  location: string;
  description: string;
  contact?: string;
  isUpcoming: boolean;
}

export interface SeekerNewsItem {
  id: string;
  category: string;
  title: string;
  date: string;
  summary: string;
  content?: string;
}

export interface SeekerNotification {
  id: string;
  title: string;
  message: string;
  type: 'STATUS_CHANGE' | 'DOCUMENT_REQUIRED' | 'DISBURSEMENT' | 'GENERAL';
  read: boolean;
  created_at: string;
  action_url?: string;
}

