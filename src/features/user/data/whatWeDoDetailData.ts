export interface ActivityItem {
  title: string;
  description: string;
  icon: string;
}

export interface WhatWeDoDetailContent {
  id: string;
  title: string;
  heroDescription: string;
  heroImage: string;
  overview: string;
  activities: ActivityItem[];
  whyItMatters: string;
  whyIcon: string;
  participationItems: { text: string; icon: string }[];
  ctaTitle: string;
  ctaButtonLabel: string;
}

export const WHAT_WE_DO_DETAIL_MAP: Record<string, WhatWeDoDetailContent> = {
  'awareness-campaigns': {
    id: 'awareness-campaigns',
    title: 'Awareness Campaigns',
    heroDescription:
      'Building awareness of human rights, equality and social justice through community education and public engagement.',
    heroImage: '/assets/images/event-legal-awareness.jpg',
    overview:
      'We conduct awareness initiatives to help people understand their rights, available support and ways to participate in social change.',
    activities: [
      {
        title: 'Rights Awareness Drives',
        description: 'Community sessions and public outreach on key constitutional rights issues.',
        icon: 'megaphone',
      },
      {
        title: 'Community Outreach',
        description: 'Engage with local communities and identify priority protection needs.',
        icon: 'users',
      },
      {
        title: 'Public Education',
        description: 'Educational materials and multilingual handbooks for wider civic understanding.',
        icon: 'file-text',
      },
      {
        title: 'Digital Awareness',
        description: 'Use online channels and social campaigns to share trusted rights resources.',
        icon: 'globe',
      },
    ],
    whyItMatters:
      'Awareness helps people recognise rights concerns, find relevant information and make informed decisions about statutory support and action.',
    whyIcon: 'shield-check',
    participationItems: [
      { text: 'Attend awareness sessions in your area or state chapter.', icon: 'users' },
      { text: 'Share verified educational resources and rights handbooks with others.', icon: 'globe' },
      { text: 'Volunteer for approved outreach and door-to-door legal literacy drives.', icon: 'handshake' },
    ],
    ctaTitle: 'Help Spread Awareness',
    ctaButtonLabel: 'Join the Movement',
  },

  'workshops-training': {
    id: 'workshops-training',
    title: 'Workshops and Training',
    heroDescription:
      'Creating opportunities to learn, develop practical skills and strengthen community participation.',
    heroImage: '/assets/images/about-hero-community.png',
    overview:
      'Our workshops and training sessions provide opportunities for rights education, paralegal skill-building and constructive community engagement across India.',
    activities: [
      {
        title: 'Human Rights Workshops',
        description: 'Structured masterclasses on statutory protections, civil liberties, and constitutional remedies.',
        icon: 'users',
      },
      {
        title: 'Community Training',
        description: 'Skill-building for stronger, better-informed local community paralegals.',
        icon: 'graduation-cap',
      },
      {
        title: 'Youth Leadership',
        description: 'Develop young people as community leaders, mentors, and ethical civic advocates.',
        icon: 'medal',
      },
      {
        title: 'Awareness Sessions',
        description: 'Interactive learning, case simulations, and practical discussion for legal action.',
        icon: 'book-open',
      },
    ],
    whyItMatters:
      'Learning can help people understand rights, build confidence and participate more effectively in their communities to combat injustice.',
    whyIcon: 'bulb',
    participationItems: [
      { text: 'Join relevant learning sessions and community training webinars.', icon: 'book-open' },
      { text: 'Participate in certified paralegal training programmes.', icon: 'graduation-cap' },
      { text: 'Share learning opportunities with youth in your community.', icon: 'users' },
    ],
    ctaTitle: 'Learn and Participate',
    ctaButtonLabel: 'Get Involved',
  },

  'research-rights-education': {
    id: 'research-rights-education',
    title: 'Research and Education',
    heroDescription:
      'Supporting informed action through research, documentation and accessible human-rights education resources.',
    heroImage: '/assets/images/contact-hero-building.jpg',
    overview:
      'We produce knowledge resources that help people understand rights, learn from evidence and better respond to social, custodial, and legal challenges.',
    activities: [
      {
        title: 'Rights Education',
        description: 'Simplify rights concepts and help communities understand their statutory protections.',
        icon: 'book-open',
      },
      {
        title: 'Research and Documentation',
        description: 'Collect and analyse evidence on rights issues, prison conditions, and community trends.',
        icon: 'doc-search',
      },
      {
        title: 'Learning Resources',
        description: 'Create guides, whitepapers, and educational toolkits for public and academic use.',
        icon: 'file-text',
      },
      {
        title: 'Reports and Publications',
        description: 'Publish findings that inform Public Interest Litigations (PILs), policy, and awareness.',
        icon: 'briefcase',
      },
    ],
    whyItMatters:
      'Reliable evidence helps people better understand social issues, access statutory remedies, and advocate with confidence, clarity, and authority.',
    whyIcon: 'doc-search',
    participationItems: [
      { text: 'Read and share our verified research reports and human-rights surveys.', icon: 'book-open' },
      { text: 'Collaborate with HRSJM academic researchers and legal clinics.', icon: 'briefcase' },
      { text: 'Provide ground observations to our ongoing policy documentation teams.', icon: 'file-text' },
    ],
    ctaTitle: 'Support Legal Research',
    ctaButtonLabel: 'Explore Publications',
  },

  'community-activities': {
    id: 'community-activities',
    title: 'Community Activities',
    heroDescription:
      'Encouraging local participation, community engagement and initiatives that respond to people’s needs.',
    heroImage: '/assets/images/contact-cta-hands.jpg',
    overview:
      'We support community engagement that encourages local participation, helps people connect and creates opportunities to address urgent grassroots needs.',
    activities: [
      {
        title: 'Community Outreach',
        description: 'Engage with local settlements, slums, and rural clusters to identify practical needs.',
        icon: 'users',
      },
      {
        title: 'Local Initiatives',
        description: 'Support neighbourhood participation, free legal clinics, and clean water drives.',
        icon: 'map-pin',
      },
      {
        title: 'Volunteer Participation',
        description: 'Create accessible, meaningful opportunities for citizens to contribute to social good.',
        icon: 'heart-hands',
      },
      {
        title: 'Community Support',
        description: 'Collaborate on disaster aid, health camps, and educational kit distribution.',
        icon: 'handshake',
      },
    ],
    whyItMatters:
      'Community participation helps people connect, share concerns and work together on local priorities that directly improve daily life and safeguard human dignity.',
    whyIcon: 'users',
    participationItems: [
      { text: 'Participate in approved community and relief activities in your district.', icon: 'users' },
      { text: 'Explore existing volunteer and caseworker opportunities.', icon: 'heart-hands' },
      { text: 'Contact HRSJM through trusted channels to request local community support.', icon: 'message' },
    ],
    ctaTitle: 'Join the Community',
    ctaButtonLabel: 'Get Involved',
  },

  'human-rights-monitoring': {
    id: 'human-rights-monitoring',
    title: 'Human Rights Monitoring',
    heroDescription:
      'Tracking violations, documenting concerns and helping communities access accountability and support.',
    heroImage: '/assets/images/about-hero-rally.jpg',
    overview:
      'We monitor rights conditions, document incidents and help communities understand where statutory protections are being denied or overlooked.',
    activities: [
      {
        title: 'Field Monitoring',
        description: 'Observe conditions and gather evidence in affected communities and police jurisdictions.',
        icon: 'eye',
      },
      {
        title: 'Case Documentation',
        description: 'Record incidents, witness statements, timelines and human-rights abuse patterns.',
        icon: 'file-text',
      },
      {
        title: 'Fact-Finding Missions',
        description: 'Identify protection risks, vulnerable gaps, and prepare formal inquiry reports.',
        icon: 'doc-search',
      },
      {
        title: 'Community Reporting',
        description: 'Support local reporting and response pathways for affected victims.',
        icon: 'megaphone',
      },
    ],
    whyItMatters:
      'Monitoring helps expose rights abuses early, strengthens police accountability, and informs the legal support communities deserve.',
    whyIcon: 'shield-check',
    participationItems: [
      { text: 'Share verified concerns through our secure complaint reporting channels.', icon: 'message' },
      { text: 'Report incidents to trusted district and chapter volunteer networks.', icon: 'users' },
      { text: 'Support evidence-based advocacy and legal response efforts.', icon: 'scale' },
    ],
    ctaTitle: 'Explore Monitoring',
    ctaButtonLabel: 'Report a Concern',
  },

  'leadership-development': {
    id: 'leadership-development',
    title: 'Leadership Development',
    heroDescription:
      'Empowering youth and community leaders with the confidence, skills and knowledge to act for positive change.',
    heroImage: '/assets/images/member-hero-rally.jpg',
    overview:
      'We build leadership capacities through mentoring, training and practical opportunities that help people guide and support their communities.',
    activities: [
      {
        title: 'Youth Leadership',
        description: 'Grow confidence, ethics, and advocacy skills among young college and school leaders.',
        icon: 'medal',
      },
      {
        title: 'Skill Development',
        description: 'Strengthen public speaking, community organizing, conciliation, and civic action.',
        icon: 'briefcase',
      },
      {
        title: 'Peer Learning',
        description: 'Create inclusive spaces for shared experiences, mutual support, and civic innovation.',
        icon: 'users',
      },
      {
        title: 'Community Representation',
        description: 'Support emerging youth leaders to voice local concerns before municipal councils.',
        icon: 'megaphone',
      },
    ],
    whyItMatters:
      'Strong community leadership creates more resilient, informed and active societies able to address shared challenges together.',
    whyIcon: 'graduation-cap',
    participationItems: [
      { text: 'Join youth leadership initiatives and regional fellowship spaces.', icon: 'users' },
      { text: 'Take part in mentoring and peer-learning bootcamps.', icon: 'graduation-cap' },
      { text: 'Support the leadership development of underprivileged youth.', icon: 'heart-hands' },
    ],
    ctaTitle: 'Explore Leadership',
    ctaButtonLabel: 'Join as Youth Leader',
  },

  'advocacy-awareness': {
    id: 'advocacy-awareness',
    title: 'Advocacy and Awareness',
    heroDescription:
      'Promoting informed dialogue, public awareness and constructive engagement with institutions and community stakeholders.',
    heroImage: '/assets/images/contact-cta-hands.jpg',
    overview:
      'Our advocacy and awareness work helps bring human-rights concerns into public conversation and informs decision-makers about issues affecting communities.',
    activities: [
      {
        title: 'Rights Awareness',
        description: 'Share reliable information and practical statutory guidance with communities.',
        icon: 'megaphone',
      },
      {
        title: 'Institutional Engagement',
        description: 'Build constructive dialogue with relevant government commissions and ministries.',
        icon: 'briefcase',
      },
      {
        title: 'Public Advocacy',
        description: 'Lead campaigns, media briefings, and public appeals that strengthen democratic accountability.',
        icon: 'scale',
      },
      {
        title: 'Community Information',
        description: 'Provide real-time updates on statutory rights, social welfare schemes, and legal aid.',
        icon: 'file-text',
      },
    ],
    whyItMatters:
      'Advocacy transforms awareness into action, helping communities inform institutions and strengthen rights protection.',
    whyIcon: 'megaphone',
    participationItems: [
      { text: 'Learn about relevant rights issues and grassroots community campaigns.', icon: 'book-open' },
      { text: 'Speak up through trusted community and advocacy channels.', icon: 'users' },
      { text: 'Support constructive dialogue with institutions and decision-makers.', icon: 'scale' },
    ],
    ctaTitle: 'Explore Advocacy',
    ctaButtonLabel: 'Get Involved',
  },
};

export const getWhatWeDoDetail = (id: string): WhatWeDoDetailContent => {
  return WHAT_WE_DO_DETAIL_MAP[id] || WHAT_WE_DO_DETAIL_MAP['awareness-campaigns'];
};

