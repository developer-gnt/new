import type {
  AboutVideoData,
  HeroSlide,
  HomeBlogItem,
  HomeEvent,
  HomeNewsItem,
  HomeQuickAction,
  HomeTab,
  ImpactStats,
  RightsCategory,
  WhatWeDoItem,
} from '../types/userHome.types';

export const GUEST_QUICK_ACTIONS: HomeQuickAction[] = [
  { id: 'join', label: 'Join HRSJM', icon: 'users', emphasized: true },
  { id: 'complaint', label: 'File a Complaint', icon: 'file-text' },
  { id: 'donate', label: 'Donate Now', icon: 'heart' },
  { id: 'renew', label: 'Become a Member', icon: 'id-card' },
];

export const RIGHTS_CATEGORIES: RightsCategory[] = [
  { id: 'human-rights', title: 'Human Rights', icon: 'scale' },
  { id: 'womens-rights', title: "Women's Rights", icon: 'users' },
  { id: 'right-to-education', title: 'Right to Education', icon: 'graduation-cap' },
  { id: 'childrens-rights', title: "Children's Rights", icon: 'baby' },
];

export const WHAT_WE_DO_ITEMS: WhatWeDoItem[] = [
  { id: 'awareness-campaigns', title: 'Awareness Campaigns', icon: 'megaphone' },
  { id: 'workshops-training', title: 'Workshops and Training', icon: 'users' },
  { id: 'research-rights-education', title: 'Research and Education', icon: 'book-open' },
  { id: 'community-activities', title: 'Community Activities', icon: 'handshake' },
];

export const DEFAULT_IMPACT_STATS: ImpactStats = {
  members: 100079,
  complaintsHandled: 200000,
  casesResolved: 199800,
};

export const UPCOMING_EVENTS: HomeEvent[] = [
  {
    id: 'event-1',
    title: 'Human Rights Awareness Workshop',
    day: '25',
    month: 'OCT',
    location: 'Mumbai, Maharashtra',
    imageAssetName: 'home/events/rights-workshop.png',
    imageUrl: '/assets/images/about-hero-community.png',
  },
  {
    id: 'event-2',
    title: 'Community Legal Awareness Camp',
    day: '12',
    month: 'NOV',
    location: 'Pune, Maharashtra',
    imageAssetName: 'home/events/legal-camp.png',
    imageUrl: '/assets/images/event-legal-awareness.jpg',
  },
  {
    id: 'event-3',
    title: 'Youth Rights Convention',
    day: '18',
    month: 'DEC',
    location: 'Nagpur, Maharashtra',
    imageAssetName: 'home/events/youth-convention.png',
    imageUrl: '/assets/images/hero-home.webp',
  },
];

export const LATEST_NEWS: HomeNewsItem[] = [
  {
    id: 'news-1',
    category: 'LEGAL RIGHTS',
    title: 'HRSJM Raises Awareness on Citizen Rights and Legal Support',
    date: '20 Sep 2026',
    imageAssetName: 'home/news/legal-awareness.png',
    imageUrl: '/assets/images/contact-hero-building.jpg',
  },
  {
    id: 'news-2',
    category: 'COMMUNITY',
    title: 'HRSJM Launches Grassroots Legal Aid Clinics across Maharashtra',
    date: '15 Sep 2026',
    imageAssetName: 'home/news/legal-camp.png',
    imageUrl: '/assets/images/about-hero-rally.jpg',
  },
];

export const DEFAULT_HOME_BLOGS: HomeBlogItem[] = [
  {
    id: 'default-blog-1',
    title: 'Understanding Your Legal Rights as a Citizen',
    excerpt: 'A simple guide to fundamental rights every citizen should know to participate actively in a democratic society.',
    category: 'KNOW YOUR RIGHTS',
    date: '28 Sep 2026',
    author: 'HRSJM Admin',
    thumbnailUrl: '/assets/images/article-rights-book.jpg',
  },
  {
    id: 'default-blog-2',
    title: 'Advocating Social Justice Through Community Action',
    excerpt: 'How grassroots initiatives and collective organizing bring transformative change to marginalized groups.',
    category: 'COMMUNITY IMPACT',
    date: '22 Sep 2026',
    author: 'Legal Cell HRSJM',
    thumbnailUrl: '/assets/images/about-hero-community.png',
  },
  {
    id: 'default-blog-3',
    title: 'Empowering Women Through Constitutional Literacy',
    excerpt: 'Insights from our recent regional workshops on equal rights, workplace dignity, and legal protections.',
    category: "WOMEN'S RIGHTS",
    date: '14 Sep 2026',
    author: 'Adv. S. Sharma',
    thumbnailUrl: '/assets/images/event-legal-awareness.jpg',
  },
];

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'mission-human-rights',
    headlineLines: ['For Human Rights,', 'Dignity and a'],
    goldLine: 'More Just Society.',
    supporting: 'We work for equal rights, social justice and stronger communities across India.',
    ctaLabel: 'Join the Movement',
    ctaAction: 'join',
    scriptLines: ['People.', 'Rights.', 'Justice.', 'Change.'],
    image: '/assets/images/hero-home.webp',
  },
  {
    id: 'stand-for-dignity',
    headlineLines: ['Stand for Rights.', 'Stand for'],
    goldLine: 'Human Dignity.',
    supporting: 'Together we can build stronger, fairer and more inclusive communities across every state.',
    ctaLabel: 'Join the Movement',
    ctaAction: 'join',
    scriptLines: ['Empower.', 'Unite.', 'Protect.', 'Lead.'],
    image: '/assets/images/member-hero-rally.jpg',
  },
  {
    id: 'grassroots-aid',
    headlineLines: ['Awareness.', 'Action.'],
    goldLine: 'Real Impact.',
    supporting: 'Protecting fundamental human rights and delivering immediate relief to families in need.',
    ctaLabel: 'Join the Movement',
    ctaAction: 'join',
    scriptLines: ['Hope.', 'Action.', 'Relief.', 'Care.'],
    image: '/assets/images/contact-cta-hands.jpg',
  },
  {
    id: 'legal-awareness',
    headlineLines: ['Know Your Law.', 'Claim Your'],
    goldLine: 'Fundamental Rights.',
    supporting: 'Providing free legal consultations, constitutional awareness camps, and citizen support.',
    ctaLabel: 'Join the Movement',
    ctaAction: 'join',
    scriptLines: ['Justice.', 'Equality.', 'Truth.', 'Voice.'],
    image: '/assets/images/event-legal-awareness.jpg',
  },
  {
    id: 'community-workshops',
    headlineLines: ['United for Peace.', 'Driven by'],
    goldLine: 'Social Justice.',
    supporting: 'Join nationwide human rights workshops, citizen conventions, and community seminars.',
    ctaLabel: 'Join the Movement',
    ctaAction: 'join',
    scriptLines: ['Engage.', 'Inspire.', 'Transform.', 'Serve.'],
    image: '/assets/images/about-hero-community.png',
  },
];

export const DEFAULT_ABOUT_VIDEO: AboutVideoData = {
  id: 'hrsjm-intro-video-2026',
  title: 'Human Rights & Social Justice Mission',
  subtitle: 'Official Mission Overview & Community Impact',
  summaryText:
    'Human Rights and Social Justice Mission (HRSJM) works for human rights, dignity, equality and social justice through awareness, advocacy, education and community support.',
  videoUrl: 'https://www.youtube.com/watch?v=nDgIVseTkuE',
  embedUrl: 'https://www.youtube.com/embed/nDgIVseTkuE?autoplay=1&rel=0&modestbranding=1',
  fallbackVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  duration: '3:45',
  viewsCount: '18.5K views',
  releaseYear: '2026',
  badgeLabel: 'Official Video',
  description:
    'Human Rights and Social Justice Mission (HRSJM) is dedicated to advancing human dignity, ensuring constitutional rights, and providing grassroots assistance to underprivileged and vulnerable communities across India.\n\nThrough our national network of volunteers and legal professionals, we provide free legal aid clinics, organize human rights workshops, protect child and women welfare, and deliver emergency assistance.',
  highlights: [
    'Constitutional & Fundamental Rights Awareness',
    'Free Legal Consultation & Grievance Redressal',
    'Women & Child Protection Initiatives',
    'Community Assistance & Grassroots Action Across India',
  ],
  tags: ['Human Rights', 'Social Justice', 'Community Aid', 'Legal Awareness'],
  thumbnailUrl: '/assets/images/about-hero-rally.jpg',
};

export const DONATION_CONTENT = {
  headline: "Let's Build a Fairer,\nMore Inclusive Society.",
  description: 'Your support helps us protect rights, create awareness and bring real change.',
  ctaLabel: 'Make a Donation',
};

export const USER_BOTTOM_TABS: HomeTab[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'about', label: 'About', icon: 'file-text' },
  { id: 'rights', label: 'Rights', icon: 'scale' },
  { id: 'events', label: 'Events', icon: 'calendar' },
  { id: 'news', label: 'News', icon: 'message-square' },
  { id: 'history', label: 'History', icon: 'clock' },
];

export const SECONDARY_NAV_ITEMS = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'about', label: 'About Us', path: '/about' },
  { id: 'what-we-do', label: 'What We Do', path: '/what-we-do' },
  { id: 'rights', label: 'Know Your Rights', path: '/rights' },
  { id: 'events', label: 'Events', path: '/events' },
  { id: 'news', label: 'News and Media', path: '/news' },
  { id: 'contact', label: 'Contact Us', path: '/contact' },
  { id: 'join', label: 'Join Us', path: '/membership' },
];

