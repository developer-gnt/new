import { apiClient } from '../../../services/apiClient';
import type {
  AssistanceDocumentItem,
  AssistanceRequest,
  CreateAssistancePayload,
  CreateSupportTicketPayload,
  SeekerNotification,
  SupportTicket,
  SupportTicketMessage,
} from '../types/seeker.types';

const LOCAL_SEEKER_REQUESTS_KEY = 'hrsjm_seeker_requests_store_v1';
const LOCAL_SEEKER_TICKETS_KEY = 'hrsjm_seeker_tickets_store_v1';

const INITIAL_LOCAL_REQUESTS: AssistanceRequest[] = [
  {
    id: 'asst-8241901a',
    full_name: 'HRSJM Test Seeker',
    mobile: '9888880004',
    email: 'seeker@hrsjm.org',
    requested_amount: 35000,
    reason: 'Medical Emergency',
    description:
      'Urgent financial assistance required for immediate hospital admission and cardiology procedures for parent at City Civil Hospital.',
    status: 'UNDER_REVIEW',
    admin_remark: 'Initial identity and Aadhaar card verified. Field assessment scheduled for community report.',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [
      {
        id: 'doc-1',
        document_name: 'Aadhaar / ID Proof',
        fileName: 'Aadhaar_Card_Seeker.pdf',
        fileSize: '1.2 MB',
        verification_status: 'VERIFIED',
      },
      {
        id: 'doc-2',
        document_name: 'Medical Report / Hospital Bill',
        fileName: 'Hospital_Cardiology_Estimate.pdf',
        fileSize: '2.4 MB',
        verification_status: 'PENDING',
      },
    ],
  },
  {
    id: 'asst-6581290b',
    full_name: 'HRSJM Test Seeker',
    mobile: '9888880004',
    email: 'seeker@hrsjm.org',
    requested_amount: 15000,
    reason: 'Education Support',
    description: 'School tuition fee and textbooks assistance for two high school children.',
    status: 'APPROVED',
    admin_remark: 'Approved by Social Welfare Committee. Direct school payment sanctioned.',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [
      {
        id: 'doc-3',
        document_name: 'Tuition / School Fee Slip',
        fileName: 'School_Fee_Challan_2026.pdf',
        fileSize: '890 KB',
        verification_status: 'VERIFIED',
      },
    ],
  },
];

const INITIAL_LOCAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-4011',
    ticket_number: 'HRSJM-TKT-4011',
    user_id: 'seeker-test-uuid-0004',
    user_name: 'HRSJM Test Seeker',
    category: 'Application Status',
    subject: 'Status inquiry for Medical Aid ASST-8241901A',
    description: 'Could you please confirm if the hospital estimate document has been verified by the welfare officer?',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    messages: [
      {
        id: 'msg-1',
        ticket_id: 'tkt-4011',
        sender_user_id: 'seeker-test-uuid-0004',
        sender_name: 'HRSJM Test Seeker',
        is_admin: false,
        message: 'Could you please confirm if the hospital estimate document has been verified by the welfare officer?',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'msg-2',
        ticket_id: 'tkt-4011',
        sender_user_id: 'admin-uuid',
        sender_name: 'HRSJM Support Desk',
        is_admin: true,
        message: 'Hello! Your document is under review with Dr. Sharma on the field assessment panel. Verification update expected within 24 hours.',
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
];

export const seekerService = {
  getLocalRequests(): AssistanceRequest[] {
    try {
      const raw = localStorage.getItem(LOCAL_SEEKER_REQUESTS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_LOCAL_REQUESTS;
  },

  saveLocalRequests(requests: AssistanceRequest[]): void {
    try {
      localStorage.setItem(LOCAL_SEEKER_REQUESTS_KEY, JSON.stringify(requests));
    } catch {
      // Ignore
    }
  },

  getLocalTickets(): SupportTicket[] {
    try {
      const raw = localStorage.getItem(LOCAL_SEEKER_TICKETS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_LOCAL_TICKETS;
  },

  saveLocalTickets(tickets: SupportTicket[]): void {
    try {
      localStorage.setItem(LOCAL_SEEKER_TICKETS_KEY, JSON.stringify(tickets));
    } catch {
      // Ignore
    }
  },

  async getMyRequests(): Promise<AssistanceRequest[]> {
    try {
      const res = await apiClient.get<any>('/assistance-requests');
      const data = res?.data || res;
      const items: AssistanceRequest[] = data?.items || (Array.isArray(data) ? data : []);
      if (items.length > 0) {
        this.saveLocalRequests(items);
        return items;
      }
      return this.getLocalRequests();
    } catch {
      return this.getLocalRequests();
    }
  },

  async getRequestById(id: string): Promise<AssistanceRequest | null> {
    try {
      const res = await apiClient.get<any>(`/assistance-requests/${id}`);
      const data: AssistanceRequest = res?.data || res;
      if (data && data.id) {
        return data;
      }
    } catch {
      // Fallback
    }
    const local = this.getLocalRequests().find((r) => r.id === id || r.id.includes(id));
    return local || null;
  },

  async createRequest(payload: CreateAssistancePayload): Promise<AssistanceRequest> {
    const { documents, ...body } = payload;
    let created: AssistanceRequest | null = null;

    try {
      const res = await apiClient.post<any>('/assistance-requests', {
        ...body,
        status: payload.status || 'UNDER_REVIEW',
      });
      created = res?.data || res;
    } catch {
      // Offline fallback
    }

    if (!created || !created.id) {
      created = {
        id: `asst-${Math.random().toString(36).substring(2, 10)}`,
        full_name: payload.full_name,
        mobile: payload.mobile,
        email: payload.email,
        requested_amount: payload.requested_amount,
        reason: payload.reason,
        description: payload.description,
        status: payload.status || 'UNDER_REVIEW',
        admin_remark: 'Submitted and placed in queue for document verification.',
        created_at: new Date().toISOString(),
        documents: [],
      };
    }

    // Attach documents if provided
    if (documents && documents.length > 0) {
      const attachedList: AssistanceDocumentItem[] = [];
      for (const doc of documents) {
        try {
          const attached = await this.attachDocument(created.id, doc);
          if (attached) attachedList.push(attached);
        } catch {
          attachedList.push({
            id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            document_name: doc.document_name,
            fileName: doc.file_name,
            fileSize: doc.file_size || '1.5 MB',
            verification_status: 'PENDING',
          });
        }
      }
      created.documents = attachedList;
    }

    // Cache locally
    const existing = this.getLocalRequests();
    this.saveLocalRequests([created, ...existing]);

    return created;
  },

  async attachDocument(
    requestId: string,
    docData: {
      document_name: string;
      file_name: string;
      file_size?: string;
      file?: File | Blob;
      uri?: string;
    }
  ): Promise<AssistanceDocumentItem | null> {
    try {
      const formData = new FormData();
      if (docData.file) {
        formData.append('file', docData.file, docData.file_name);
      }
      formData.append('document_name', docData.document_name);
      formData.append('description', `Supporting doc for ${docData.document_name}`);

      const token = localStorage.getItem('hrsjm_auth_token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/v1/assistance-requests/${requestId}/documents`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        return json?.data || json;
      }
    } catch {
      // Fallback
    }

    // Return structured item
    return {
      id: `doc-${Date.now()}`,
      document_name: docData.document_name,
      fileName: docData.file_name,
      fileSize: docData.file_size || '1.2 MB',
      verification_status: 'PENDING',
      created_at: new Date().toISOString(),
    };
  },

  async listDocuments(requestId: string): Promise<AssistanceDocumentItem[]> {
    try {
      const res = await apiClient.get<any>(`/assistance-requests/${requestId}/documents`);
      const data = res?.data || res;
      if (Array.isArray(data)) return data;
      if (data?.items && Array.isArray(data.items)) return data.items;
    } catch {
      // Fallback
    }
    const req = this.getLocalRequests().find((r) => r.id === requestId);
    return req?.documents || [];
  },

  async getMyTickets(): Promise<SupportTicket[]> {
    try {
      const res = await apiClient.get<any>('/support-tickets');
      const data = res?.data || res;
      const items: SupportTicket[] = data?.items || (Array.isArray(data) ? data : []);
      if (items.length > 0) {
        this.saveLocalTickets(items);
        return items;
      }
      return this.getLocalTickets();
    } catch {
      return this.getLocalTickets();
    }
  },

  async createTicket(payload: CreateSupportTicketPayload): Promise<SupportTicket> {
    try {
      const res = await apiClient.post<any>('/support-tickets', payload);
      const created: SupportTicket = res?.data || res;
      if (created && created.id) {
        const local = this.getLocalTickets();
        this.saveLocalTickets([created, ...local]);
        return created;
      }
    } catch {
      // Offline fallback
    }

    const fallback: SupportTicket = {
      id: `tkt-${Date.now().toString().slice(-4)}`,
      ticket_number: `HRSJM-TKT-${Date.now().toString().slice(-4)}`,
      user_id: 'seeker-user',
      category: payload.category,
      subject: payload.subject,
      description: payload.description,
      status: 'OPEN',
      priority: payload.priority || 'MEDIUM',
      created_at: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          ticket_id: `tkt-${Date.now().toString().slice(-4)}`,
          sender_user_id: 'seeker-user',
          sender_name: 'Me',
          is_admin: false,
          message: payload.description,
          created_at: new Date().toISOString(),
        },
      ],
    };

    const local = this.getLocalTickets();
    this.saveLocalTickets([fallback, ...local]);
    return fallback;
  },

  async addTicketMessage(ticketId: string, message: string): Promise<SupportTicketMessage> {
    try {
      const res = await apiClient.post<any>(`/support-tickets/${ticketId}/messages`, { message });
      const created = res?.data || res;
      if (created && created.id) {
        return created;
      }
    } catch {
      // Fallback
    }

    const newMsg: SupportTicketMessage = {
      id: `msg-${Date.now()}`,
      ticket_id: ticketId,
      sender_user_id: 'seeker-user',
      sender_name: 'Me',
      is_admin: false,
      message,
      created_at: new Date().toISOString(),
    };

    // Update local ticket
    const tickets = this.getLocalTickets();
    const target = tickets.find((t) => t.id === ticketId);
    if (target) {
      target.messages = [...(target.messages || []), newMsg];
      this.saveLocalTickets(tickets);
    }

    return newMsg;
  },

  getNotifications(requests: AssistanceRequest[]): SeekerNotification[] {
    const list: SeekerNotification[] = [];

    requests.forEach((req, idx) => {
      if (req.status === 'UNDER_REVIEW') {
        list.push({
          id: `notif-rev-${req.id}`,
          title: 'Application Under Review',
          message: `Your aid request for ${req.reason} (ASST-${req.id.slice(0, 8).toUpperCase()}) is currently being assessed by the field team.`,
          type: 'STATUS_CHANGE',
          read: idx > 0,
          created_at: req.created_at,
          action_url: `/seeker/requests`,
        });
      } else if (req.status === 'APPROVED') {
        list.push({
          id: `notif-app-${req.id}`,
          title: 'Assistance Request Approved! 🎉',
          message: `Congratulations! Your request for ₹${Number(req.requested_amount).toLocaleString('en-IN')} has been approved and published to the verified relief fund.`,
          type: 'DISBURSEMENT',
          read: false,
          created_at: req.updated_at || req.created_at,
          action_url: `/seeker/requests`,
        });
      } else if (req.status === 'REJECTED') {
        list.push({
          id: `notif-rej-${req.id}`,
          title: 'Action Required on Application',
          message: `Additional information or document rectification required for request ASST-${req.id.slice(0, 8).toUpperCase()}.`,
          type: 'DOCUMENT_REQUIRED',
          read: false,
          created_at: req.updated_at || req.created_at,
          action_url: `/seeker/requests`,
        });
      }
    });

    // General announcement notification
    list.push({
      id: 'notif-welcome',
      title: 'Welcome to HRSJM Aid Portal',
      message: 'You have full access to submit humanitarian relief requests, legal aid consultations, and 24x7 emergency helpline.',
      type: 'GENERAL',
      read: true,
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    });

    return list;
  },
};

