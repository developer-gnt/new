export interface HelpTopic {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  iconName: string;
  badgeBg: string;
  badgeColor: string;
}

export const HELP_TOPICS: HelpTopic[] = [
  {
    id: 'womens-rights',
    title: "Women's Rights",
    description: "Support related to women's rights, protection, and anti-harassment",
    keywords: ['women', "women's rights", 'gender', 'equality', 'protection', 'discrimination'],
    iconName: 'UserCheck',
    badgeBg: '#FCE4EC',
    badgeColor: '#D75486',
  },
  {
    id: 'childrens-rights',
    title: "Children's Rights",
    description: "Support related to children's rights, welfare, and protection against abuse",
    keywords: ['children', 'child', 'minor', 'welfare', 'protection', 'education', 'pocso'],
    iconName: 'Baby',
    badgeBg: '#FDF1CD',
    badgeColor: '#B67D00',
  },
  {
    id: 'human-rights-violation',
    title: 'Human Rights Violation',
    description: 'Report custodial torture, illegal detention, and fundamental rights violations',
    keywords: ['human rights', 'violation', 'abuse', 'harassment', 'justice', 'support', 'police'],
    iconName: 'Scale',
    badgeBg: '#E8EEFF',
    badgeColor: '#3558B0',
  },
  {
    id: 'civil-rights',
    title: 'Civil Rights',
    description: 'Support for civil liberties, equal treatment, and anti-discrimination',
    keywords: ['civil rights', 'equality', 'justice', 'non-discrimination', 'rights'],
    iconName: 'FileSearch',
    badgeBg: '#F1EBFF',
    badgeColor: '#6B4EB3',
  },
  {
    id: 'right-to-education',
    title: 'Right to Education',
    description: 'Support related to education denial, RTE quota, and student rights',
    keywords: ['education', 'school', 'college', 'learning', 'rights', 'students', 'rte'],
    iconName: 'GraduationCap',
    badgeBg: '#E7F8EE',
    badgeColor: '#2F9B71',
  },
  {
    id: 'labour-rights',
    title: 'Labour Rights',
    description: "Protection of workers' rights, wage recovery, and safe working conditions",
    keywords: ['labour', 'labor', 'work', 'workers', 'employment', 'fair wages', 'factory'],
    iconName: 'Briefcase',
    badgeBg: '#FDEBEA',
    badgeColor: '#D45B6A',
  },
  {
    id: 'senior-citizen-rights',
    title: 'Senior Citizen Rights',
    description: "Legal protection and welfare assistance for elderly and senior citizens",
    keywords: ['senior', 'elderly', 'old age', 'care', 'welfare', 'support', 'pension'],
    iconName: 'Clock',
    badgeBg: '#FDF5D8',
    badgeColor: '#B17B00',
  },
  {
    id: 'womens-safety',
    title: "Women's Safety",
    description: 'Emergency safety assistance, stalking, cyber harassment, and physical safety',
    keywords: ['women safety', 'safety', 'harassment', 'violence', 'abuse', 'support'],
    iconName: 'ShieldAlert',
    badgeBg: '#FCE4EC',
    badgeColor: '#D75486',
  },
  {
    id: 'workplace-rights',
    title: 'Workplace Rights',
    description: 'Unlawful termination, sexual harassment at workplace (POSH), and PF disputes',
    keywords: ['workplace', 'employment', 'office', 'equality', 'fair treatment', 'harassment', 'posh'],
    iconName: 'Building2',
    badgeBg: '#FDEBED',
    badgeColor: '#C2466A',
  },
  {
    id: 'domestic-violence-support',
    title: 'Domestic Violence Support',
    description: 'Legal recourse, protection orders, and emergency shelter guidance',
    keywords: ['domestic violence', 'violence', 'abuse', 'support', 'safety', 'home', 'dowry'],
    iconName: 'HeartHandshake',
    badgeBg: '#FFEFF3',
    badgeColor: '#DB5F74',
  },
  {
    id: 'minority-rights',
    title: 'Minority & Community Rights',
    description: 'Protection of minority community rights and constitutional safeguards',
    keywords: ['minority', 'community', 'rights', 'equality', 'protection', 'inclusion'],
    iconName: 'Users',
    badgeBg: '#EAF1FF',
    badgeColor: '#3C7BFF',
  },
  {
    id: 'right-to-information',
    title: 'Right to Information (RTI)',
    description: 'Drafting RTI applications and appeals for administrative transparency',
    keywords: ['rti', 'information', 'transparency', 'access', 'records', 'public rights'],
    iconName: 'FileText',
    badgeBg: '#E7F8F4',
    badgeColor: '#2A7F73',
  },
];

