import type { EventListItem, CreateEventFormState } from '../types/events.types';

const API_BASE = '/api/v1/events';

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

export const eventsService = {
  async list(params: { status?: string; category?: string; search?: string } = {}): Promise<EventListItem[]> {
    const searchParams = new URLSearchParams();
    if (params.status && params.status !== 'ALL') searchParams.append('status', params.status);
    if (params.category && params.category !== 'ALL') searchParams.append('category', params.category);
    if (params.search) searchParams.append('search', params.search);

    const qs = searchParams.toString();
    const url = qs ? `${API_BASE}?${qs}` : API_BASE;
    const res = await fetchWithAuth<any>(url);
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.items)) return res.items;
    return [];
  },

  async getById(id: string): Promise<EventListItem> {
    return fetchWithAuth<EventListItem>(`${API_BASE}/${id}`);
  },

  async create(form: CreateEventFormState): Promise<EventListItem> {
    // Construct ISO timestamps
    const startAt = form.eventDate && form.startTime
      ? new Date(`${form.eventDate}T${form.startTime}:00`).toISOString()
      : new Date().toISOString();

    const endDateStr = form.endDate || form.eventDate;
    const endAt = endDateStr && form.endTime
      ? new Date(`${endDateStr}T${form.endTime}:00`).toISOString()
      : undefined;

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      short_information: form.shortInformation.trim() || undefined,
      category: form.category || 'Seminar',
      event_type: form.eventType || 'IN_PERSON',
      cover_image_url: form.coverImageUri || undefined,
      start_at: startAt,
      end_at: endAt,
      all_day: form.allDay || false,
      location: form.location.trim(),
      address: form.address.trim() || undefined,
      organized_by: form.organizedBy.trim() || undefined,
      registration_required: form.registrationRequired,
      capacity: form.totalSeats ? parseInt(form.totalSeats, 10) : 100,
      per_person_limit: form.perPersonLimit ? parseInt(form.perPersonLimit, 10) : 1,
      target_audience: form.targetAudience || undefined,
      language: form.language || undefined,
      tags: form.tags,
      status: form.status === 'DRAFT' ? 'DRAFT' : 'UPCOMING',
    };

    return fetchWithAuth<EventListItem>(API_BASE, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async update(id: string, payload: Partial<EventListItem>): Promise<EventListItem> {
    return fetchWithAuth<EventListItem>(`${API_BASE}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return fetchWithAuth<{ success: boolean }>(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
  },
};

