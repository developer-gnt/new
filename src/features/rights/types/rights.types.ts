export type RightsStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';

export type RightsStatusFilter = 'ALL' | RightsStatus;

export type RightsDateFilter = 'ANY' | 'TODAY' | 'WEEK' | 'MONTH';

export interface RightsHighlight {
  title: string;
  description: string;
}

export interface RightsListItem {
  id: string;
  title: string;
  description: string;
  category: string;
  lastUpdatedDate: string;
  lastUpdatedTime: string;
  status: RightsStatus;
  views: number;
  thumbnailUrl?: string | null;
}

export interface RightsArticle extends RightsListItem {
  author: string;
  authorRole: string;
  organization: string;
  content: string[];
  highlights: RightsHighlight[];
  tags?: string[];
  featured?: boolean;
  allowComments?: boolean;
}

export interface RightsStatsSummary {
  total: number;
  drafts: number;
  published: number;
  archived: number;
}

export interface RightsFilterTab {
  key: RightsStatusFilter;
  label: string;
  count: number;
}

export interface RightsFilterState {
  status: RightsStatusFilter;
  category: string | null;
  dateRange: RightsDateFilter;
}

export interface RightsArticleFormState {
  coverImageUri: string | null;
  title: string;
  category: string | null;
  shortDescription: string;
  content: string;
  author: string | null;
  status: 'DRAFT' | 'PUBLISHED';
  allowComments: boolean;
  featured: boolean;
  tags: string[];
}

export type RightsArticleFieldErrors = Partial<Record<keyof RightsArticleFormState, string>>;

export const RIGHTS_STATUS_TONES: Record<
  RightsStatus,
  { bg: string; text: string; dot: string; label: string; border: string }
> = {
  PUBLISHED: {
    bg: '#E8F8F0',
    text: '#16A34A',
    dot: '#16A34A',
    label: 'Published',
    border: '#A7F3D0',
  },
  DRAFT: {
    bg: '#FEF3C7',
    text: '#D97706',
    dot: '#D97706',
    label: 'Draft',
    border: '#FDE68A',
  },
  ARCHIVED: {
    bg: '#FEE2E2',
    text: '#DC2626',
    dot: '#DC2626',
    label: 'Archived',
    border: '#FECACA',
  },
};

export const RIGHTS_STATUS_LABELS: Record<RightsStatus, string> = {
  PUBLISHED: 'Published',
  DRAFT: 'Draft',
  ARCHIVED: 'Archived',
};

export const DEFAULT_RIGHTS_CATEGORIES: string[] = [
  'Constitution',
  "Women's Rights",
  'Child Rights',
  'Senior Citizens',
  'Labour Rights',
  'Minority Rights',
  'Property',
  'Environment',
  'Human Rights',
  'Consumer Rights',
  'Cyber Rights',
];

export const DEFAULT_RIGHTS_AUTHORS: Array<{ name: string; role: string; organization: string }> = [
  { name: 'Priya Sharma', role: 'Content Writer', organization: 'HRSJM' },
  { name: 'Adv. Rajesh Verma', role: 'Chief Legal Counsel', organization: 'HRSJM Legal Cell' },
  { name: 'HRSJM Legal Research Cell', role: 'Statutory Research Desk', organization: 'HRSJM' },
  { name: 'National Human Rights Directorate', role: 'Policy Advisor', organization: 'HRSJM Central Unit' },
];

export const formatRightsViews = (views: number): string => {
  if (views < 1000) {
    return String(views);
  }
  const thousands = views / 1000;
  const text = thousands >= 10 ? String(Math.round(thousands)) : thousands.toFixed(1);
  return `${text}K`;
};

