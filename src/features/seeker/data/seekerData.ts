import type { RightsArticle, SeekerEventItem, SeekerNewsItem } from '../types/seeker.types';

export const CAUSE_OPTIONS = [
  { key: 'Medical Emergency', label: 'Medical Emergency' },
  { key: 'Education Support', label: 'Education & Tuition' },
  { key: 'Disaster Relief', label: 'Disaster Relief' },
  { key: 'Livelihood & Food', label: 'Livelihood & Food' },
  { key: 'Disability Support', label: 'Disability Support' },
  { key: 'Housing / Shelter', label: 'Housing / Shelter' },
  { key: 'Other', label: 'Other' },
] as const;

export const PRESET_AMOUNTS = [5000, 10000, 25000, 50000, 100000] as const;

export const URGENCY_LEVELS = [
  { key: 'NORMAL', label: 'Normal', color: '#10B981', bg: '#ECFDF5' },
  { key: 'MEDIUM', label: 'Medium', color: '#F59E0B', bg: '#FFFBEB' },
  { key: 'HIGH', label: 'High', color: '#F97316', bg: '#FFF7ED' },
  { key: 'CRITICAL', label: 'Critical', color: '#EF4444', bg: '#FEF2F2' },
] as const;

export const SEEKER_DOC_CATEGORIES = [
  'Aadhaar / ID Proof',
  'Medical Report / Hospital Bill',
  'Income / Ration Card',
  'Tuition / School Fee Slip',
  'Other Document',
] as const;

export const TICKET_CATEGORIES = [
  'Application Status',
  'Document Issue',
  'Field Verification Query',
  'Disbursement Inquiry',
  'Legal Grievance',
  'General Support',
] as const;

export const IMPACT_STATS = {
  members: 100079,
  complaintsHandled: 200000,
  casesResolved: 199800,
  aidDisbursed: '₹4.8 Cr+',
};

export const RIGHTS_ARTICLES: RightsArticle[] = [
  {
    id: 'fundamental-rights',
    title: 'Fundamental Rights & Constitutional Protections',
    category: 'CONSTITUTIONAL',
    categoryLabel: 'Constitutional',
    legalReference: 'Part III of Constitution • Articles 12–35',
    summary:
      'Guarantees civil liberties such that all Indians can lead their lives in peace and harmony as citizen of India, including equality, freedom from discrimination, and constitutional remedies.',
    fullContent: `The Constitution of India guarantees Fundamental Rights to all citizens without discrimination:
1. Right to Equality (Articles 14–18): Equality before the law, prohibition of discrimination on grounds of religion, race, caste, sex or place of birth, and equal opportunity in public employment.
2. Right to Freedom (Articles 19–22): Freedom of speech and expression, peaceful assembly, association, movement throughout India, and protection against arbitrary arrest and detention.
3. Right against Exploitation (Articles 23–24): Prohibition of human trafficking, forced labour, and employment of children in hazardous industries.
4. Right to Freedom of Religion (Articles 25–28): Freedom of conscience and free profession, practice and propagation of religion.
5. Cultural and Educational Rights (Articles 29–30): Protection of interests of minorities to conserve their culture and establish educational institutions.
6. Right to Constitutional Remedies (Article 32): The cornerstone right to petition the Supreme Court and High Courts (Article 226) for the enforcement of fundamental rights through writs.`,
    highlights: ['Article 14: Equality before law', 'Article 21: Right to Life and Personal Liberty', 'Article 32: Constitutional Writs'],
    helpline: '1800-HRSJM-AID (Ext 1)',
  },
  {
    id: 'womens-rights',
    title: 'Women’s Rights, Safety & Domestic Violence Relief',
    category: 'WOMEN_CHILD',
    categoryLabel: 'Women & Child',
    legalReference: 'DV Act 2005 • Article 15(3) • POSH Act 2013',
    summary:
      'Legal safeguards safeguarding women against domestic violence, marital harassment, dowry extortion, workplace harassment, and right to emergency maintenance.',
    fullContent: `Comprehensive protection mechanisms for women under Indian law:
1. Protection of Women from Domestic Violence Act, 2005 (PWDVA): Protection against physical, sexual, verbal, emotional, and economic abuse. Ensures right to reside in shared household, protection orders, and monetary relief.
2. Section 498A IPC / Section 85 BNS: Safeguard against cruelty and dowry harassment by husband or relatives.
3. POSH Act, 2013: Protection of women from sexual harassment at work places, mandatory Internal Complaints Committee (ICC).
4. Maintenance Rights (Section 125 CrPC / BNSS): Right of destitute wives, mothers, and daughters to claim maintenance for survival and dignity.`,
    highlights: ['Protection Orders & Residence Rights', 'Interim Maintenance Allowance', 'Zero FIR Registration'],
    helpline: '1800-HRSJM-AID (Ext 2) / 1091 Women Helpline',
  },
  {
    id: 'right-to-education',
    title: 'Right to Education & Child Protection',
    category: 'WOMEN_CHILD',
    categoryLabel: 'Women & Child',
    legalReference: 'RTE Act 2009 • Article 21A • POCSO Act 2012',
    summary:
      'Free and compulsory education for every child aged 6 to 14, 25% quota in private schools for economically weaker sections (EWS), and strict child protection.',
    fullContent: `Child welfare legal framework:
1. Right to Education Act, 2009: Ensures free and compulsory elementary education in a neighborhood school for children aged 6 to 14 years.
2. 25% EWS Reservation: Mandatory free seats in private unaided schools for economically weaker sections and disadvantaged groups.
3. Prohibition of Child Labour: Child and Adolescent Labour (Prohibition and Regulation) Act forbids employment of children below 14 in any occupation.
4. POCSO Act, 2012: Comprehensive protection of children against sexual offences, mandatory child-friendly reporting and support.`,
    highlights: ['Free Elementary Education (6-14 yrs)', '25% EWS School Admission Quota', 'No Fee Coercion or Corporal Punishment'],
    helpline: '1098 Childline / 1800-HRSJM-AID',
  },
  {
    id: 'civil-rights',
    title: 'Civil Rights, Arrest Protections & Legal Aid',
    category: 'CIVIL_JUSTICE',
    categoryLabel: 'Civil & Justice',
    legalReference: 'NALSA Act 1987 • Article 39A • D.K. Basu Guidelines',
    summary:
      'Mandatory free legal aid for underprivileged citizens, strict police arrest guidelines, bail rights, and protection against police brutality.',
    fullContent: `Guaranteed civil liberties and legal defense:
1. Free Legal Services (Article 39A & NALSA Act): Free legal aid, court representation, and document preparation for persons with low income, women, children, and custody detainees.
2. D.K. Basu Arrest Guidelines: Police must prepare memo of arrest, inform relatives within 8 hours, provide medical checkup every 48 hours, and produce before Magistrate within 24 hours.
3. Zero FIR: A victim can register an FIR at any police station regardless of jurisdiction.
4. Compensation for Victims of Crime: State compensation schemes for bodily harm, loss of livelihood, and rehabilitation.`,
    highlights: ['Free Legal Aid via NALSA / DLSA', 'Strict 24-Hour Magistrate Production', 'Right to Consult Advocate of Choice'],
    helpline: '15100 NALSA / 1800-HRSJM-AID',
  },
  {
    id: 'labour-welfare',
    title: 'Labour Welfare, Minimum Wage & Social Security',
    category: 'LABOUR_WELFARE',
    categoryLabel: 'Labour & Welfare',
    legalReference: 'Code on Social Security • Unorganised Workers Act 2008',
    summary:
      'Statutory minimum wages, registration of unorganised workers on e-Shram, healthcare coverage, and accident relief for daily wage earners.',
    fullContent: `Social security for workers and disadvantaged families:
1. Minimum Wages Act & Occupational Safety: Mandates payment of notified minimum wages without unlawful deductions.
2. e-Shram Portal Benefits: Accidental insurance coverage of ₹2 Lakhs, emergency welfare transfer linkages for unorganized workers.
3. Gratuity & Provident Fund: Statutory retirement and severance benefits for eligible employees.
4. National Food Security Act (NFSA): Subsidized food grains through priority ration cards for eligible households.`,
    highlights: ['Statutory Minimum Wage Guarantee', '₹2 Lakh Accidental Insurance on e-Shram', 'Ration & Food Security Subsidies'],
    helpline: '14434 e-Shram / 1800-HRSJM-AID',
  },
];

export const SEEKER_EVENTS: SeekerEventItem[] = [
  {
    id: 'event-1',
    title: 'Human Rights & Legal Awareness Workshop',
    category: 'Workshop',
    date: '25 Nov 2026',
    day: '25',
    month: 'NOV',
    year: '2026',
    location: 'HRSJM Community Hall, Bandra West, Mumbai',
    description:
      'Interactive guidance session on constitutional rights, domestic violence protection, free legal aid clinics, and state welfare schemes with senior advocates.',
    contact: '+91 98888 80004',
    isUpcoming: true,
  },
  {
    id: 'event-2',
    title: 'Free Health & Medical Assessment Camp',
    category: 'Relief Activity',
    date: '10 Dec 2026',
    day: '10',
    month: 'DEC',
    year: '2026',
    location: 'Civil Lines Welfare Center, Pune, Maharashtra',
    description:
      'Free general health checkup, diagnostic tests, eye screening, and prescription medicine distribution for verified low-income families and donation seekers.',
    contact: '+91 98888 80004',
    isUpcoming: true,
  },
  {
    id: 'event-3',
    title: 'Citizen Grievance Redressal & Helpdesk Drive',
    category: 'Awareness',
    date: '20 Dec 2026',
    day: '20',
    month: 'DEC',
    year: '2026',
    location: 'Dr. Ambedkar Bhavan, Nagpur, Maharashtra',
    description:
      'On-the-spot assistance for filing social welfare complaints, Aadhaar/Ration card rectification, and humanitarian aid request review.',
    contact: '+91 98888 80004',
    isUpcoming: true,
  },
];

export const SEEKER_NEWS: SeekerNewsItem[] = [
  {
    id: 'news-1',
    category: 'HUMANITARIAN RELIEF',
    title: 'HRSJM Expands Rapid Medical Assistance for Critical Surgeries',
    date: '02 Nov 2026',
    summary:
      'Through its humanitarian aid program, HRSJM has streamlined emergency medical fund approvals to under 48 hours for verified seekers across Maharashtra and neighboring states.',
  },
  {
    id: 'news-2',
    category: 'LEGAL EMPOWERMENT',
    title: 'Over 1,200 Families Supported Through Free Legal Clinics in Q3',
    date: '28 Oct 2026',
    summary:
      'HRSJM legal aid volunteers and panel advocates provided free representation and advice to vulnerable citizens fighting property eviction, domestic violence, and wage disputes.',
  },
  {
    id: 'news-3',
    category: 'EDUCATION WELFARE',
    title: 'Educational Sponsorship Drive Launched for 500 Deserving Students',
    date: '15 Oct 2026',
    summary:
      'Direct school fee assistance and textbook distribution began for children of low-income families to ensure zero school dropouts.',
  },
];

