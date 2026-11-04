/**
 * HRSJM Admin Web Application — Articles & Blogs Types
 * Exact parity with React Native APK (hrsjm-application-ui/src/features/admin/content/blogs/types/blog.types.ts)
 * and NestJS backend (HRSJM-back-api/src/modules/blogs/)
 */

export type BlogStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';

export type BlogStatusFilter = 'ALL' | BlogStatus;

export type BlogDateFilter = 'ANY' | 'TODAY' | 'WEEK' | 'MONTH';

export interface BlogListItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  /** Display date (e.g. "28 Sep 2026"). */
  date: string;
  /** Display time (e.g. "04:30 PM"). */
  time: string;
  status: BlogStatus;
  /** Raw view count; formatted in UI (e.g. 2100 -> "2.1K"). */
  views: number;
  /** Cover image or thumbnail URL. */
  thumbnailUrl?: string | null;
  /** Author name (e.g. "HRSJM Admin"). */
  author?: string;
  /** Article body paragraphs. */
  content?: string[];
  /** Topic tags for categorization. */
  tags?: string[];
  /** URL slug */
  slug?: string;
  /** Highlighted featured blog flag */
  featured?: boolean;
  /** Allow public comments */
  allowComments?: boolean;
}

export interface BlogStatsSummary {
  total: number;
  published: number;
  drafts: number;
  archived: number;
}

export interface BlogFilterTab {
  key: BlogStatusFilter;
  label: string;
  count: number;
}

export interface BlogFilterState {
  status: BlogStatusFilter;
  category: string | null;
  dateRange: BlogDateFilter;
}

export interface CreateBlogFormState {
  coverImageUri: string | null;
  title: string;
  category: string | null;
  shortDescription: string;
  content: string;
  author: string;
  status: BlogStatus;
  allowComments: boolean;
  featured: boolean;
  tagsText: string;
}

export type CreateBlogFieldErrors = Partial<Record<keyof CreateBlogFormState, string>>;

export const STATUS_META: Record<
  BlogStatus,
  { label: string; badgeBg: string; badgeColor: string; dotColor: string }
> = {
  PUBLISHED: {
    label: 'Published',
    badgeBg: '#DCFCE7',
    badgeColor: '#166534',
    dotColor: '#22C55E',
  },
  DRAFT: {
    label: 'Draft',
    badgeBg: '#FEF3C7',
    badgeColor: '#92400E',
    dotColor: '#F59E0B',
  },
  ARCHIVED: {
    label: 'Archived',
    badgeBg: '#F1F5F9',
    badgeColor: '#475569',
    dotColor: '#64748B',
  },
};

export const DEFAULT_BLOG_CATEGORIES: string[] = [
  'Know Your Rights',
  'Social Justice',
  'Relief Work',
  'Education',
  'Environment',
  'Women Rights',
  'Guides',
  'Events',
  'Legal Awareness',
  'Human Rights',
  'General',
];

export const DEFAULT_BLOG_AUTHORS: string[] = [
  'HRSJM Admin',
  'HRSJM Editorial Board',
  'Legal Research Cell',
  'National Executive Committee',
  'Human Rights Advocate',
];

export const formatViews = (views: number): string => {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return String(views);
};
