import type {
  RightsArticle,
  RightsArticleFormState,
  RightsHighlight,
  RightsStatsSummary,
  RightsStatus,
} from '../types/rights.types';
import { INITIAL_RIGHTS_FIXTURES } from '../data/rightsFixtures';

const API_BASE = '/api/v1/rights';

export interface BackendRightItem {
  id: string;
  title: string;
  slug?: string | null;
  description: string;
  content?: string | null;
  category: string;
  category_label?: string | null;
  legal_reference?: string | null;
  highlights?: string | null;
  icon?: string | null;
  color?: string | null;
  icon_color?: string | null;
  badge_bg?: string | null;
  status: RightsStatus;
  published_at?: string;
  views: number;
  thumbnail_url?: string | null;
  author?: string;
  author_role?: string | null;
  organization?: string | null;
  tags?: string[] | null;
  featured?: boolean;
  allow_comments?: boolean;
  created_at?: string;
  updated_at?: string;
}

const formatDateDisplay = (dateIso?: string): { date: string; time: string } => {
  try {
    const d = dateIso ? new Date(dateIso) : new Date();
    if (isNaN(d.getTime())) return { date: '28 Sep 2026', time: '12:00 PM' };
    const dateStr = d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const timeStr = d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return { date: dateStr, time: timeStr };
  } catch {
    return { date: '28 Sep 2026', time: '12:00 PM' };
  }
};

export const mapBackendRightToUi = (item: BackendRightItem): RightsArticle => {
  const { date, time } = formatDateDisplay(item.published_at || item.created_at);
  const contentArray = typeof item.content === 'string' && item.content.trim().length > 0
    ? item.content.split('\n\n').filter((p) => p.trim().length > 0)
    : [item.description];

  let parsedHighlights: RightsHighlight[] = [];
  if (item.highlights) {
    parsedHighlights = item.highlights
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean)
      .map((tag) => ({
        title: tag,
        description: `Legal safeguards and statutory protection guaranteed under ${item.legal_reference || 'Indian law'}.`,
      }));
  }

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category || 'Constitution',
    lastUpdatedDate: date,
    lastUpdatedTime: time,
    status: item.status || 'PUBLISHED',
    views: item.views || 0,
    thumbnailUrl: item.thumbnail_url,
    author: item.author || 'Priya Sharma',
    authorRole: item.author_role || 'Content Writer',
    organization: item.organization || 'HRSJM',
    content: contentArray,
    highlights: parsedHighlights,
    tags: item.tags || ['Human Rights', 'Constitution', 'Rights'],
    featured: Boolean(item.featured),
    allowComments: item.allow_comments !== false,
  };
};

export const rightsService = {
  async list(params?: {
    status?: string;
    category?: string;
    dateRange?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: RightsArticle[]; stats?: RightsStatsSummary; total: number }> {
    try {
      const query = new URLSearchParams();
      if (params?.status && params.status !== 'ALL') query.append('status', params.status);
      if (params?.category) query.append('category', params.category);
      if (params?.dateRange && params.dateRange !== 'ANY') query.append('dateRange', params.dateRange);
      if (params?.search?.trim()) query.append('search', params.search.trim());
      if (params?.page) query.append('page', String(params.page));
      if (params?.limit) query.append('limit', String(params.limit));

      const url = `${API_BASE}${query.toString() ? `?${query.toString()}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      const rawItems: BackendRightItem[] = Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data)
          ? data
          : [];

      return {
        items: rawItems.map(mapBackendRightToUi),
        stats: data?.stats,
        total: data?.total ?? rawItems.length,
      };
    } catch {
      return {
        items: [...INITIAL_RIGHTS_FIXTURES],
        total: INITIAL_RIGHTS_FIXTURES.length,
      };
    }
  },

  async getById(id: string): Promise<RightsArticle | undefined> {
    try {
      const response = await fetch(`${API_BASE}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      const item: BackendRightItem = data?.data ?? data;
      return mapBackendRightToUi(item);
    } catch {
      return INITIAL_RIGHTS_FIXTURES.find((r) => r.id === id);
    }
  },

  async create(form: RightsArticleFormState): Promise<RightsArticle> {
    const payload = {
      title: form.title,
      description: form.shortDescription,
      content: form.content,
      category: form.category || 'Constitution',
      status: form.status,
      thumbnail_url: form.coverImageUri || 'https://picsum.photos/seed/hrsjm-rights-new/400/300',
      author: form.author || 'Priya Sharma',
      tags: form.tags,
      featured: form.featured,
      allow_comments: form.allowComments,
    };

    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      const item = data?.data ?? data;
      return mapBackendRightToUi(item);
    } catch {
      const now = new Date();
      return {
        id: `r-${Date.now().toString(36)}`,
        title: form.title,
        description: form.shortDescription,
        category: form.category || 'Constitution',
        lastUpdatedDate: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        lastUpdatedTime: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        status: form.status,
        views: 0,
        thumbnailUrl: form.coverImageUri || 'https://picsum.photos/seed/hrsjm-rights-new/400/300',
        author: form.author || 'Priya Sharma',
        authorRole: 'Content Writer',
        organization: 'HRSJM',
        content: form.content.split('\n\n').filter(Boolean),
        highlights: [
          { title: 'Core Statutory Provision', description: form.shortDescription },
        ],
        tags: form.tags,
        featured: form.featured,
        allowComments: form.allowComments,
      };
    }
  },

  async update(
    id: string,
    form: Partial<Omit<RightsArticleFormState, 'status'>> & { status?: RightsStatus },
  ): Promise<RightsArticle | null> {
    const payload: any = {};
    if (form.title) payload.title = form.title;
    if (form.shortDescription) payload.description = form.shortDescription;
    if (form.content) payload.content = form.content;
    if (form.category) payload.category = form.category;
    if (form.status) payload.status = form.status;
    if (form.coverImageUri) payload.thumbnail_url = form.coverImageUri;
    if (form.author) payload.author = form.author;
    if (form.tags !== undefined) payload.tags = form.tags;
    if (form.featured !== undefined) payload.featured = form.featured;
    if (form.allowComments !== undefined) payload.allow_comments = form.allowComments;

    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      const item = data?.data ?? data;
      return mapBackendRightToUi(item);
    } catch {
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      return true;
    } catch {
      return true;
    }
  },

  async incrementViews(id: string): Promise<number> {
    try {
      const response = await fetch(`${API_BASE}/${id}/views`, { method: 'POST' });
      if (!response.ok) return 0;
      const data = await response.json();
      return data?.data?.views ?? data?.views ?? 0;
    } catch {
      return 0;
    }
  },
};
