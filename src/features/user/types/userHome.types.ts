export type HomeVariant = 'guest' | 'member';

export interface UserRoleInfo {
  id: string;
  name: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  mobile_number: string;
  email: string | null;
  avatar?: string | null;
  status: string;
  roles: UserRoleInfo[];
  created_at: string;
  updated_at: string;
  membership_status?: string | null;
  assistance_status?: string | null;
  assistance_application_number?: string | null;
  account_type?: 'general' | 'member' | 'seeker' | 'admin';
}

export interface HomeQuickAction {
  id: string;
  label: string;
  icon: string;
  emphasized?: boolean;
}

export interface RightsCategory {
  id: string;
  title: string;
  icon: string;
}

export type WhatWeDoItem = RightsCategory;

export interface ImpactStats {
  members: number;
  complaintsHandled: number;
  casesResolved: number;
}

export interface HomeEvent {
  id: string;
  title: string;
  day: string;
  month: string;
  location: string;
  imageAssetName: string;
  imageUrl?: string;
}

export interface HomeNewsItem {
  id: string;
  category: string;
  title: string;
  date: string;
  imageAssetName: string;
  imageUrl?: string;
  article?: any;
}

export interface HomeBlogItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  thumbnailUrl?: string;
  content?: string[];
  article?: any;
}

export type HomeTabId =
  | 'home'
  | 'about'
  | 'rights'
  | 'events'
  | 'news'
  | 'contact'
  | 'complaints'
  | 'donate'
  | 'profile'
  | 'history';

export interface HomeTab {
  id: HomeTabId;
  label: string;
  icon: string;
}

export interface HeroSlide {
  id: string;
  headlineLines: string[];
  goldLine: string;
  supporting: string;
  ctaLabel?: string;
  ctaAction?: 'join' | 'donate' | 'membership' | 'rights' | 'events' | 'about' | 'help' | string;
  image: string;
  scriptLines?: string[];
  eyebrow?: string;
}

export interface AboutVideoData {
  id: string;
  title: string;
  subtitle: string;
  summaryText: string;
  videoUrl: string;
  embedUrl: string;
  fallbackVideoUrl: string;
  duration: string;
  viewsCount: string;
  releaseYear: string;
  badgeLabel: string;
  description: string;
  highlights: string[];
  tags: string[];
  thumbnailUrl?: string;
}

