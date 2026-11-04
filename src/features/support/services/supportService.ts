import type {
  CreateTicketBody,
  SupportTicket,
  SupportTicketListData,
  SupportTicketMessage,
  SupportTicketQuery,
  TicketStatsData,
  UpdateTicketStatusBody,
  AddTicketMessageBody,
} from '../types/support.types';

const API_BASE = '/api/v1/support-tickets';

async function fetchWithAuth<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${res.status}`);
  }
  const envelope = await res.json();
  return (envelope.data !== undefined ? envelope.data : envelope) as T;
}

export const supportService = {
  async list(query: SupportTicketQuery = {}): Promise<SupportTicketListData> {
    const params = new URLSearchParams();
    if (query.page) params.append('page', String(query.page));
    if (query.limit) params.append('limit', String(query.limit));
    if (query.status && (query.status as string) !== 'ALL') params.append('status', query.status);
    if (query.category && query.category !== 'ALL') params.append('category', query.category);
    if (query.source && query.source !== 'ALL') params.append('source', query.source);
    if (query.from_date) params.append('from_date', query.from_date);
    if (query.to_date) params.append('to_date', query.to_date);
    if (query.search) params.append('search', query.search);

    const qs = params.toString();
    const url = qs ? `${API_BASE}?${qs}` : API_BASE;
    return fetchWithAuth<SupportTicketListData>(url);
  },

  async getStatsSummary(query: SupportTicketQuery = {}): Promise<TicketStatsData> {
    const params = new URLSearchParams();
    if (query.status && (query.status as string) !== 'ALL') params.append('status', query.status);
    if (query.category && query.category !== 'ALL') params.append('category', query.category);
    if (query.source && query.source !== 'ALL') params.append('source', query.source);
    if (query.from_date) params.append('from_date', query.from_date);
    if (query.to_date) params.append('to_date', query.to_date);
    if (query.search) params.append('search', query.search);

    const qs = params.toString();
    const url = qs ? `${API_BASE}/stats/summary?${qs}` : `${API_BASE}/stats/summary`;
    return fetchWithAuth<TicketStatsData>(url);
  },

  async getById(id: string): Promise<SupportTicket> {
    return fetchWithAuth<SupportTicket>(`${API_BASE}/${id}`);
  },

  async create(body: CreateTicketBody): Promise<SupportTicket> {
    const sourceTag = body.source
      ? `[Source: ${body.source === 'website' ? 'Website' : body.source === 'web' ? 'Web App' : 'App'}]\n`
      : '';
    const payload = {
      subject:
        body.category && body.category !== 'ALL' && !body.subject.includes(`[${body.category}]`)
          ? `[${body.category}] ${body.subject.trim()}`
          : body.subject.trim(),
      description: `${sourceTag}${
        body.priority && body.priority !== 'NORMAL'
          ? `[Priority: ${body.priority}]\n\n${body.description.trim()}`
          : body.description.trim()
      }`,
      source: body.source,
      attachments: body.attachments,
    };
    return fetchWithAuth<SupportTicket>(API_BASE, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateStatus(id: string, body: UpdateTicketStatusBody): Promise<SupportTicket> {
    return fetchWithAuth<SupportTicket>(`${API_BASE}/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async listMessages(id: string): Promise<SupportTicketMessage[]> {
    return fetchWithAuth<SupportTicketMessage[]>(`${API_BASE}/${id}/messages`);
  },

  async addMessage(id: string, body: AddTicketMessageBody): Promise<SupportTicketMessage> {
    return fetchWithAuth<SupportTicketMessage>(`${API_BASE}/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
};
