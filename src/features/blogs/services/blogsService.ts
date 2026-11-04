/**
 * HRSJM Admin Web Application — Articles & Blogs Service
 * Connects to NestJS backend (/api/v1/blogs) with offline fallback.
 */
import type {
  BlogListItem,
  BlogStatsSummary,
  CreateBlogFormState,
  BlogStatus,
} from '../types/blog.types';

const API_BASE = '/api/v1/blogs';

export interface BackendBlogItem {
  id: string;
  title: string;
  slug?: string | null;
  excerpt: string;
  content?: string | null;
  category: string;
  status: BlogStatus;
  published_at: string;
  views: number;
  thumbnail_url?: string | null;
  author: string;
  tags?: string[] | null;
  featured: boolean;
  allow_comments: boolean;
  created_at: string;
  updated_at: string;
}

export interface BackendBlogsListResponse {
  items: BackendBlogItem[];
  stats: BlogStatsSummary;
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

export function mapBackendBlogToUi(item: BackendBlogItem): BlogListItem {
  const { date, time } = formatDateTimeDisplay(item.published_at);
  const contentArray =
    typeof item.content === 'string'
      ? item.content.split('\n\n').filter((p) => p.trim().length > 0)
      : undefined;

  return {
    id: item.id,
    title: item.title,
    slug: item.slug || undefined,
    excerpt: item.excerpt,
    category: item.category,
    date,
    time,
    status: item.status,
    views: item.views || 0,
    thumbnailUrl: item.thumbnail_url,
    author: item.author,
    content: contentArray,
    tags: item.tags || undefined,
    featured: item.featured ?? false,
    allowComments: item.allow_comments ?? true,
  };
}

export const blogsService = {
  async list(params?: {
    status?: string;
    category?: string;
    search?: string;
  }): Promise<{ blogs: BlogListItem[]; stats: BlogStatsSummary }> {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'ALL') query.append('status', params.status);
    if (params?.category) query.append('category', params.category);
    if (params?.search?.trim()) query.append('search', params.search.trim());

    const url = `${API_BASE}${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch blogs (HTTP ${res.status})`);
    }
    const data: BackendBlogsListResponse = await res.json();
    return {
      blogs: (data.items || []).map(mapBackendBlogToUi),
      stats: data.stats || {
        total: (data.items || []).length,
        published: (data.items || []).filter((i) => i.status === 'PUBLISHED').length,
        drafts: (data.items || []).filter((i) => i.status === 'DRAFT').length,
        archived: (data.items || []).filter((i) => i.status === 'ARCHIVED').length,
      },
    };
  },

  async getById(id: string): Promise<BlogListItem> {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch blog article ${id}`);
    }
    const data: BackendBlogItem = await res.json();
    return mapBackendBlogToUi(data);
  },

  async create(form: CreateBlogFormState): Promise<BlogListItem> {
    const parsedTags = form.tagsText
      ? form.tagsText.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      title: form.title.trim(),
      slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      excerpt: form.shortDescription.trim(),
      content: form.content.trim(),
      category: form.category || 'General',
      status: form.status,
      thumbnail_url: form.coverImageUri || 'https://picsum.photos/seed/hrsjm-blog-new/400/250',
      author: form.author?.trim() || 'HRSJM Admin',
      tags: parsedTags,
      featured: form.featured,
      allow_comments: form.allowComments,
    };

    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Failed to create blog article (HTTP ${res.status})`);
    }

    const data: BackendBlogItem = await res.json();
    return mapBackendBlogToUi(data);
  },

  async update(
    id: string,
    form: Partial<CreateBlogFormState> & { status?: BlogStatus }
  ): Promise<BlogListItem> {
    const payload: Record<string, any> = {};
    if (form.title !== undefined) payload.title = form.title.trim();
    if (form.shortDescription !== undefined) payload.excerpt = form.shortDescription.trim();
    if (form.content !== undefined) payload.content = form.content.trim();
    if (form.category !== undefined) payload.category = form.category;
    if (form.status !== undefined) payload.status = form.status;
    if (form.coverImageUri !== undefined) payload.thumbnail_url = form.coverImageUri;
    if (form.author !== undefined) payload.author = form.author?.trim();
    if (form.tagsText !== undefined) {
      payload.tags = form.tagsText.split(',').map((t) => t.trim()).filter(Boolean);
    }
    if (form.featured !== undefined) payload.featured = form.featured;
    if (form.allowComments !== undefined) payload.allow_comments = form.allowComments;

    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Failed to update blog article ${id}`);
    }

    const data: BackendBlogItem = await res.json();
    return mapBackendBlogToUi(data);
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
