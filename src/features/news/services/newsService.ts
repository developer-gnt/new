/**
 * HRSJM Admin Web Application — News & Press Service
 * Communicates with backend endpoints (/api/v1/news)
 * and provides offline fallback capabilities.
 */
import type {
  NewsListItem,
  NewsStatsSummary,
  CreateNewsFormState,
  NewsStatus,
} from '../types/news.types';

const API_BASE = '/api/v1/news';

export interface BackendNewsItem {
  id: string;
  title: string;
  slug?: string | null;
  summary: string;
  summary_detailed?: string | null;
  content?: string | null;
  category: string;
  status: NewsStatus;
  published_at: string;
  views: number;
  thumbnail_url?: string | null;
  author: string;
  tags?: string[] | null;
  highlights?: string[] | null;
  gallery?: string[] | null;
  allow_comments: boolean;
  created_at: string;
  updated_at: string;
}

export interface BackendNewsListResponse {
  items: BackendNewsItem[];
  stats: NewsStatsSummary;
  totalCount: number;
  page: number;
  limit: number;
}

export function formatDateTimeDisplay(dateIso: string): { date: string; time: string } {
  try {
    const d = new Date(dateIso);
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
}

export function mapBackendNewsToUi(item: BackendNewsItem): NewsListItem {
  const { date, time } = formatDateTimeDisplay(item.published_at);
  const contentArray =
    typeof item.content === 'string'
      ? item.content.split('\n\n').filter((p) => p.trim().length > 0)
      : undefined;

  return {
    id: item.id,
    title: item.title,
    slug: item.slug || undefined,
    summary: item.summary,
    summaryDetailed: item.summary_detailed || item.summary,
    category: item.category,
    date,
    time,
    status: item.status,
    views: item.views || 0,
    thumbnailUrl: item.thumbnail_url,
    author: item.author,
    content: contentArray,
    highlights: item.highlights || undefined,
    gallery: item.gallery || undefined,
    tags: item.tags || undefined,
    allowComments: item.allow_comments ?? true,
  };
}

export const newsService = {
  async list(params?: {
    status?: string;
    category?: string;
    search?: string;
  }): Promise<{ news: NewsListItem[]; stats: NewsStatsSummary }> {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'ALL') query.append('status', params.status);
    if (params?.category) query.append('category', params.category);
    if (params?.search?.trim()) query.append('search', params.search.trim());

    const url = `${API_BASE}${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch news (HTTP ${res.status})`);
    }
    const data: BackendNewsListResponse = await res.json();
    return {
      news: (data.items || []).map(mapBackendNewsToUi),
      stats: data.stats || {
        total: (data.items || []).length,
        published: (data.items || []).filter((i) => i.status === 'PUBLISHED').length,
        drafts: (data.items || []).filter((i) => i.status === 'DRAFT').length,
        archived: (data.items || []).filter((i) => i.status === 'ARCHIVED').length,
      },
    };
  },

  async getById(id: string): Promise<NewsListItem> {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch news article ${id}`);
    }
    const data: BackendNewsItem = await res.json();
    return mapBackendNewsToUi(data);
  },

  async create(form: CreateNewsFormState): Promise<NewsListItem> {
    let publishedAt: string;
    try {
      if (form.publishDate) {
        const timePart = form.publishTime || '09:00';
        const parsed = new Date(`${form.publishDate}T${timePart}:00`);
        publishedAt = isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
      } else {
        publishedAt = new Date().toISOString();
      }
    } catch {
      publishedAt = new Date().toISOString();
    }

    const cleanSlug = form.slug?.trim()
      ? form.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
      : undefined;

    const payload = {
      title: form.headline.trim(),
      slug: cleanSlug,
      summary: form.summary.trim(),
      summary_detailed: form.summary.trim(),
      content: form.content.trim(),
      category: form.category || 'General',
      status: form.status,
      published_at: publishedAt,
      thumbnail_url: form.featuredImageUri || 'https://picsum.photos/seed/hrsjm-news-new/400/250',
      author: form.author?.trim() || 'HRSJM Team',
      tags: Array.isArray(form.tags) && form.tags.length > 0 ? form.tags : undefined,
      allow_comments: form.allowComments ?? true,
    };

    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Failed to create news article (HTTP ${res.status})`);
    }

    const data: BackendNewsItem = await res.json();
    return mapBackendNewsToUi(data);
  },

  async update(
    id: string,
    form: Partial<CreateNewsFormState> & { status?: NewsStatus }
  ): Promise<NewsListItem> {
    const payload: Record<string, any> = {};
    if (form.headline !== undefined) payload.title = form.headline.trim();
    if (form.slug !== undefined) {
      payload.slug = form.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    }
    if (form.summary !== undefined) {
      payload.summary = form.summary.trim();
      payload.summary_detailed = form.summary.trim();
    }
    if (form.content !== undefined) payload.content = form.content.trim();
    if (form.category !== undefined) payload.category = form.category;
    if (form.status !== undefined) payload.status = form.status;
    if (form.featuredImageUri !== undefined) payload.thumbnail_url = form.featuredImageUri;
    if (form.author !== undefined) payload.author = form.author?.trim();
    if (form.tags !== undefined) {
      payload.tags = Array.isArray(form.tags) && form.tags.length > 0 ? form.tags : null;
    }
    if (form.allowComments !== undefined) payload.allow_comments = form.allowComments;
    if (form.publishDate) {
      try {
        const timePart = form.publishTime || '09:00';
        const parsed = new Date(`${form.publishDate}T${timePart}:00`);
        payload.published_at = isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
      } catch {
        payload.published_at = new Date().toISOString();
      }
    }

    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Failed to update news article ${id}`);
    }

    const data: BackendNewsItem = await res.json();
    return mapBackendNewsToUi(data);
  },

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  async incrementViews(id: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/${id}/views`, { method: 'POST' });
    } catch {
      // Ignore background view increment errors
    }
  },
};

