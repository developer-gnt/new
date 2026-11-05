/**
 * HRSJM Admin Web Application — News & Press Initial Fixtures
 * Exact parity with APK sample data (hrsjm-application-ui/src/features/admin/content/news/data/sample-news.ts)
 */
import type { NewsListItem } from '../types/news.types';

const demoThumbnail = (seed: string): string =>
  `https://picsum.photos/seed/${seed}/400/250`;

export const INITIAL_NEWS_FIXTURES: NewsListItem[] = [
  {
    id: 'n-01',
    title: 'HRSJM Organizes Legal Aid Camp in Kurla',
    slug: 'hrsjm-organizes-legal-aid-camp-in-kurla',
    summary: 'Free legal consultation camp held for community members.',
    category: 'Legal',
    date: '28 Sep 2026',
    time: '04:30 PM',
    status: 'PUBLISHED',
    views: 1200,
    thumbnailUrl: demoThumbnail('hrsjm-news-01'),
    author: 'HRSJM Team',
    summaryDetailed:
      'HRSJM organized a legal aid camp in Kurla to provide free legal consultation and support to community members. The initiative aimed to create awareness about legal rights and assist individuals in getting proper guidance.',
    content: [
      'The Human Rights & Social Justice Mission (HRSJM) organized a legal aid camp in Kurla, Mumbai, to provide free legal consultation and support to community members.',
      'The camp witnessed a large turnout, with people from different sections of society seeking guidance on issues related to property disputes, labour rights, domestic violence, and other legal matters.',
      'HRSJM volunteers and legal professionals provided information about available legal remedies, government schemes, and fundamental rights.',
      'The initiative focused on improving legal awareness and helping community members understand the appropriate channels for seeking assistance.',
    ],
    highlights: [
      'Free legal consultation by experienced lawyers',
      'Awareness on fundamental rights',
      'Support for women, workers and marginalized communities',
      'Guidance on government schemes and legal processes',
    ],
    gallery: [
      demoThumbnail('hrsjm-news-01-g1'),
      demoThumbnail('hrsjm-news-01-g2'),
      demoThumbnail('hrsjm-news-01-g3'),
      demoThumbnail('hrsjm-news-01-g4'),
    ],
    tags: ['Legal Aid', 'Community Support', 'Kurla', 'Human Rights'],
    allowComments: true,
  },
  {
    id: 'n-02',
    title: 'Supreme Court Highlights Importance of Human Rights',
    slug: 'supreme-court-highlights-importance-of-human-rights',
    summary: 'Key observations on protection of fundamental rights.',
    category: 'Legal Update',
    date: '24 Sep 2026',
    time: '11:15 AM',
    status: 'PUBLISHED',
    views: 980,
    thumbnailUrl: demoThumbnail('hrsjm-news-02'),
    author: 'HRSJM Team',
    summaryDetailed:
      'In a recent judgment, the Supreme Court of India reiterated that the preservation of fundamental human rights is paramount in a constitutional democracy.',
    content: [
      'The Apex Court emphasized the accountability of statutory enforcement agencies and affirmed citizen protection mechanisms.',
      'HRSJM welcomes this progressive observation and has committed to disseminating plain-language summaries of the judgment to citizens nationwide.',
    ],
    highlights: [
      'Constitutional benchmark judgment',
      'Reinforced protections for detainees',
      'Affirmed fundamental liberties in police interactions',
    ],
    tags: ['Supreme Court', 'Legal Update', 'Constitutional Law'],
    allowComments: true,
  },
  {
    id: 'n-03',
    title: 'Relief Support Provided to Flood-Affected Families',
    slug: 'relief-support-provided-to-flood-affected-families',
    summary: 'HRSJM distributes essential supplies to affected families.',
    category: 'Relief Work',
    date: '20 Sep 2026',
    time: '02:20 PM',
    status: 'PUBLISHED',
    views: 1500,
    thumbnailUrl: demoThumbnail('hrsjm-news-03'),
    author: 'HRSJM Team',
    summaryDetailed:
      'Emergency humanitarian relief teams deployed to flood-ravaged zones, distributing food rations, drinking water kits, dry clothing, and primary medicines.',
    content: [
      'Over 350 families received direct relief kits packed by HRSJM youth wing volunteers over the past 72 hours.',
      'Field coordinators coordinated with district disaster management cells to establish secure shelter shelters and mobile health desks.',
    ],
    highlights: [
      '350+ relief hampers distributed',
      'Sanitation and purified water kits provided',
      'On-ground medical checkup desk deployed',
    ],
    gallery: [
      demoThumbnail('hrsjm-news-03-g1'),
      demoThumbnail('hrsjm-news-03-g2'),
    ],
    tags: ['Disaster Relief', 'Community', 'Emergency Aid'],
    allowComments: true,
  },
  {
    id: 'n-04',
    title: 'Know Your Rights: Arrest and Bail Process',
    slug: 'know-your-rights-arrest-and-bail-process',
    summary: 'Important information on your rights during arrest.',
    category: 'Know Your Rights',
    date: '18 Sep 2026',
    time: '10:00 AM',
    status: 'PUBLISHED',
    views: 2100,
    thumbnailUrl: demoThumbnail('hrsjm-news-04'),
    author: 'HRSJM Team',
    summaryDetailed:
      'Every citizen must understand statutory protections under the Criminal Procedure Code when questioned or detained by statutory law enforcement officers.',
    content: [
      'Under Article 22 of the Constitution, every arrested individual possesses an absolute right to be informed of the grounds of arrest immediately.',
      'The right to consult and be defended by a legal practitioner of choice is guaranteed. Police must produce the arrested person before a Magistrate within 24 hours.',
    ],
    highlights: [
      'Right to know grounds of arrest immediately',
      'Mandatory production before magistrate within 24 hours',
      'Free legal aid entitlements for economically challenged citizens',
    ],
    tags: ['Know Your Rights', 'Legal Handbook', 'Bail Procedure'],
    allowComments: false,
  },
  {
    id: 'n-05',
    title: 'HRSJM Conducts Awareness Session at Local School',
    slug: 'hrsjm-conducts-awareness-session-at-local-school',
    summary: 'Interactive session on child rights and safety.',
    category: 'Awareness',
    date: '15 Sep 2026',
    time: '03:05 PM',
    status: 'DRAFT',
    views: 0,
    thumbnailUrl: demoThumbnail('hrsjm-news-05'),
    author: 'Admin',
    summaryDetailed:
      'An interactive awareness session on child rights and safety conducted for students and teachers at a local school. The session is being prepared for publication after review.',
    content: [
      'HRSJM volunteers conducted an interactive awareness session at a local school covering child rights, personal safety and available support systems.',
      'The draft is being reviewed by the communications team before publication. Content, highlights and images will be finalized after approval.',
    ],
    highlights: [
      'Interactive session with students and teachers',
      'Child rights and personal safety awareness',
      'Guidance on reporting and support systems',
    ],
    gallery: [demoThumbnail('hrsjm-news-05-g1'), demoThumbnail('hrsjm-news-05-g2')],
    tags: ['Awareness', 'Child Rights', 'School', 'Safety'],
    allowComments: true,
  },
  {
    id: 'n-06',
    title: 'Environmental Justice Initiative Launched',
    slug: 'environmental-justice-initiative-launched',
    summary: 'Campaign to address environmental issues in urban communities.',
    category: 'Environment',
    date: '12 Sep 2026',
    time: '01:20 PM',
    status: 'PUBLISHED',
    views: 890,
    thumbnailUrl: demoThumbnail('hrsjm-news-06'),
    author: 'HRSJM Team',
    summaryDetailed:
      'Launch of urban tree planting drives and clean river advocacy chapters across key metropolitan corridors.',
    content: [
      'Urban industrial pollution directly impacts underprivileged settlements situated along drainage canals and transit hubs.',
      'HRSJM environmental lawyers have filed public petitions seeking installation of industrial emission filters in industrial estates.',
    ],
    highlights: [
      'Urban green cover campaign launched',
      'Air and water quality testing drives',
      'Advocacy petitions filed before statutory tribunals',
    ],
    tags: ['Environment', 'Green City', 'Public Health'],
    allowComments: true,
  },
  {
    id: 'n-07',
    title: 'Blood Donation Drive a Huge Success',
    slug: 'blood-donation-drive-a-huge-success',
    summary: 'More than 150 people donated blood at HRSJM camp.',
    category: 'Health',
    date: '08 Sep 2026',
    time: '12:20 PM',
    status: 'ARCHIVED',
    views: 720,
    thumbnailUrl: demoThumbnail('hrsjm-news-07'),
    author: 'Admin',
    summaryDetailed:
      'More than 150 people donated blood at the HRSJM blood donation camp. The drive was conducted with volunteer medical professionals and community volunteers.',
    content: [
      'The HRSJM blood donation drive saw an overwhelming response, with more than 150 community members donating blood at the camp.',
      'The drive was conducted with volunteer medical professionals. The news is archived now and can be restored to the published list when needed.',
    ],
    highlights: [
      'More than 150 donors participated',
      'Conducted with volunteer medical professionals',
      'Free health check-up for every donor',
    ],
    gallery: [
      demoThumbnail('hrsjm-news-07-g1'),
      demoThumbnail('hrsjm-news-07-g2'),
      demoThumbnail('hrsjm-news-07-g3'),
    ],
    tags: ['Blood Donation', 'Health Camp', 'Volunteers'],
    allowComments: false,
  },
  {
    id: 'n-08',
    title: 'HRSJM Raises Concern on Recent Policy Changes',
    slug: 'hrsjm-raises-concern-on-recent-policy-changes',
    summary: 'Press conference highlights changing policies affecting communities.',
    category: 'Advocacy',
    date: '04 Sep 2026',
    time: '06:00 PM',
    status: 'PUBLISHED',
    views: 1100,
    thumbnailUrl: demoThumbnail('hrsjm-news-08'),
    author: 'HRSJM Team',
    summaryDetailed:
      'National leadership held a press briefing addressing proposed regulatory amendments concerning human rights protections in informal employment sectors.',
    content: [
      'A delegation will present a comprehensive memorandum to the legislative committee outlining key amendments needed to protect vulnerable workers.',
      'The organization urged wider public consultations before legislative enactments.',
    ],
    highlights: [
      'National press conference held',
      'Memorandum drafted for legislative review',
      'Focus on labor protections for unorganized workforce',
    ],
    tags: ['Advocacy', 'Labor Rights', 'Policy Reform'],
    allowComments: true,
  },
];

