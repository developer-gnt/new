export interface RightsCard {
  id: string;
  title: string;
  description?: string;
  icon: string;
  color?: string;
  iconColor?: string;
}

export interface RightDetailsContent {
  id: string;
  badge: string;
  title: string;
  description: string;
  heroImage: string;
  overview: {
    title: string;
    description: string;
    quote?: string;
  };
  keyTopics?: RightsCard[];
  keyAreas?: RightsCard[];
  legalFramework?: {
    title: string;
    description: string;
  };
  supportAreas?: RightsCard[];
  resources?: RightsCard[];
  legalProtections?: RightsCard[];
  relatedRights?: string[];
}

export const RIGHTS_DETAIL_MAP: Record<string, RightDetailsContent> = {
  'human-rights': {
    id: 'human-rights',
    badge: 'HUMAN RIGHTS',
    title: 'Human Rights',
    description: 'Basic rights and freedoms every human being has across the globe.',
    heroImage: '/assets/images/hero-home.webp',
    overview: {
      title: 'What are Human Rights?',
      description:
        'Human rights are the fundamental, inalienable entitlements that belong to every human being from birth. They protect life, liberty, equality and human dignity without distinction of caste, religion, gender or nationality.',
      quote:
        'Human rights protect your dignity, ensure equal opportunities and build the foundation of a free, fair and just society.',
    },
    keyTopics: [
      { id: 'universal-freedoms', title: 'Universal Freedoms', description: 'Life, liberty and dignity', icon: 'users' },
      { id: 'udhr-principles', title: 'UDHR Principles', description: 'Global human dignity standards', icon: 'file-text' },
      { id: 'right-to-equality', title: 'Right to Equality', description: 'Equal protection before the law', icon: 'scale' },
    ],
    keyAreas: [
      {
        id: 'life-dignity',
        title: 'Life with Dignity',
        description: 'Inherent right to live free from violence, torture and inhumane treatment.',
        icon: 'shield-check',
        color: '#FFF9E6',
        iconColor: '#FAD465',
      },
      {
        id: 'equal-protection',
        title: 'Equal Protection of Law',
        description: 'Universal equality before the courts with zero unlawful discrimination.',
        icon: 'scale',
        color: '#EDF2F7',
        iconColor: '#DBE5EE',
      },
      {
        id: 'personal-liberty',
        title: 'Personal Liberty',
        description: 'Freedom of movement, thought, conscience and lawful expression.',
        icon: 'file-text',
        color: '#FAF7F0',
        iconColor: '#DCE4EC',
      },
      {
        id: 'social-justice',
        title: 'Social & Economic Justice',
        description: 'Access to food, shelter, healthcare and fair livelihood opportunities.',
        icon: 'heart-hands',
        color: '#FFF9E6',
        iconColor: '#FAD465',
      },
      {
        id: 'fair-hearing',
        title: 'Right to Fair Hearing',
        description: 'Speedy trial, legal representation and impartial judicial oversight.',
        icon: 'doc-search',
        color: '#EDF2F7',
        iconColor: '#DBE5EE',
      },
      {
        id: 'civic-empowerment',
        title: 'Civic Participation',
        description: 'Right to organize peacefully and engage in democratic governance.',
        icon: 'megaphone',
        color: '#FAF7F0',
        iconColor: '#DCE4EC',
      },
    ],
    legalFramework: {
      title: 'Constitutional Guarantees',
      description:
        'The Constitution of India enshrines Fundamental Rights in Part III (Articles 12 to 35). Protection of Human Rights Act 1993 empowers the National Human Rights Commission (NHRC) and State Commissions to investigate violations independently.',
    },
    supportAreas: [
      { id: 'nhrc-complaints', title: 'NHRC & SHRC Complaint Guidance', icon: 'scale' },
      { id: 'free-legal-aid', title: 'Free Legal Defense Counsel', icon: 'users' },
      { id: 'emergency-intervention', title: 'Emergency Detention Redressal', icon: 'shield-check' },
      { id: 'fact-finding-teams', title: 'Independent Fact-Finding Inquiries', icon: 'doc-search' },
    ],
    resources: [
      { id: 'universal-declaration', title: 'Universal Declaration of Human Rights (UDHR)', icon: 'file-text' },
      { id: 'human-rights-act', title: 'Protection of Human Rights Act 1993 Full Text', icon: 'link' },
      { id: 'nhrc-portal', title: 'National Human Rights Commission (NHRC) Portal', icon: 'download' },
    ],
    relatedRights: ['civil-rights', 'fundamental-rights', 'womens-rights'],
  },

  'womens-rights': {
    id: 'womens-rights',
    badge: "WOMEN'S RIGHTS",
    title: "Women's Rights",
    description: 'Rights, protection and support for women to ensure equality, safety and opportunities in all areas of life.',
    heroImage: '/assets/images/about-hero-community.png',
    overview: {
      title: "What are Women's Rights?",
      description:
        "Women's rights are the fundamental human rights that ensure equality, safety, dignity and equal opportunities for women in all areas of life, at home, in society, at the workplace and in public spaces.",
      quote:
        'Women’s rights strengthen families, communities and create a more equal and progressive society.',
    },
    keyTopics: [
      { id: 'right-to-equality', title: 'Right to Equality', description: 'Equal opportunities in all areas', icon: 'scale' },
      { id: 'protection-violence', title: 'Protection from Violence', description: 'Legal safeguards and support systems', icon: 'shield-check' },
      { id: 'workplace-rights', title: 'Workplace Rights', description: 'Safe and fair working environment', icon: 'file-text' },
    ],
    keyAreas: [
      {
        id: 'safety-protection',
        title: 'Safety and Protection',
        description: 'Freedom from domestic violence, harassment, dowry abuse and exploitation.',
        icon: 'shield-check',
        color: '#FFF9E6',
        iconColor: '#FAD465',
      },
      {
        id: 'education-literacy',
        title: 'Education & Literacy',
        description: 'Equal access to secondary and higher education without discrimination.',
        icon: 'book-open',
        color: '#EDF2F7',
        iconColor: '#DBE5EE',
      },
      {
        id: 'employment-equal-pay',
        title: 'Employment and Equal Pay',
        description: 'Equal remuneration for equal work and safe working conditions under POSH.',
        icon: 'file-text',
        color: '#FAF7F0',
        iconColor: '#DCE4EC',
      },
      {
        id: 'healthcare-maternity',
        title: 'Healthcare & Maternity',
        description: 'Statutory maternity leave, reproductive health, and nutritional entitlements.',
        icon: 'heart-pulse',
        color: '#FFF9E6',
        iconColor: '#FAD465',
      },
      {
        id: 'property-inheritance',
        title: 'Property & Inheritance',
        description: 'Equal coparcenary rights in ancestral property under Hindu Succession Act.',
        icon: 'scale',
        color: '#EDF2F7',
        iconColor: '#DBE5EE',
      },
      {
        id: 'zero-fir',
        title: 'Zero FIR & Police Protocols',
        description: 'Right to register FIR at any police station; no night arrests without magistrate order.',
        icon: 'shield-check',
        color: '#FAF7F0',
        iconColor: '#DCE4EC',
      },
    ],
    legalFramework: {
      title: 'Constitutional Guarantees & Special Laws',
      description:
        'Articles 14, 15(1), and 15(3) mandate non-discrimination and affirmative action for women. Key statutes include the Protection of Women from Domestic Violence Act 2005, POSH Act 2013, and Maternity Benefit Act.',
    },
    supportAreas: [
      { id: 'domestic-abuse-hotline', title: 'Domestic Violence Legal Relief Desk', icon: 'shield-check' },
      { id: 'posh-counsel', title: 'Workplace Sexual Harassment Advice', icon: 'file-text' },
      { id: 'maintenance-remedies', title: 'Maintenance & Child Custody Support', icon: 'scale' },
      { id: 'shelter-rehab', title: 'Emergency Shelter & Trauma Counseling', icon: 'heart-hands' },
    ],
    resources: [
      { id: 'ncw-helpline', title: 'National Commission for Women (NCW) Helpline 7827170170', icon: 'link' },
      { id: 'posh-rules', title: 'Handbook on POSH Act & ICC Compliance', icon: 'download' },
      { id: 'domestic-violence-act', title: 'Protection of Women from Domestic Violence Act 2005 Text', icon: 'file-text' },
    ],
    relatedRights: ['human-rights', 'childrens-rights', 'fundamental-rights'],
  },

  'right-to-education': {
    id: 'right-to-education',
    badge: 'RIGHT TO EDUCATION',
    title: 'Right to Education',
    description: 'Constitutional guarantee to free, compulsory and quality education for all children.',
    heroImage: '/assets/images/about-hero-rally.jpg',
    overview: {
      title: 'What is the Right to Education?',
      description:
        'The Right of Children to Free and Compulsory Education (RTE) Act guarantees that every child aged 6 to 14 years has the fundamental right to free, accessible and quality elementary education in their neighbourhood.',
      quote:
        'Education is the most powerful weapon which you can use to change the world and build an equitable future.',
    },
    keyTopics: [
      { id: 'free-compulsory-education', title: 'Free & Compulsory (6-14)', description: 'Universal school access', icon: 'graduation-cap' },
      { id: 'quality-education', title: '25% EWS Reservation', description: 'Private school seats for underprivileged', icon: 'book-open' },
      { id: 'schools-communities', title: 'Zero Rejection Policy', description: 'Admission without screening or fees', icon: 'users' },
    ],
    keyAreas: [
      {
        id: 'free-elementary-schooling',
        title: 'Free Elementary Schooling',
        description: 'Zero tuition fees, free uniforms, textbooks and mid-day meal entitlements.',
        icon: 'graduation-cap',
        color: '#FFF9E6',
        iconColor: '#FAD465',
      },
      {
        id: 'ews-quota',
        title: '25% Private School Quota',
        description: 'Mandatory reservation for economically weaker and disadvantaged sections.',
        icon: 'book-open',
        color: '#EDF2F7',
        iconColor: '#DBE5EE',
      },
      {
        id: 'no-capitation-screening',
        title: 'No Capitation or Screening',
        description: 'Strict prohibition of admission test or donation fees for parents and kids.',
        icon: 'shield-check',
        color: '#FAF7F0',
        iconColor: '#DCE4EC',
      },
      {
        id: 'infrastructure-standards',
        title: 'School Infrastructure Standards',
        description: 'Clean drinking water, separate toilets for girls, library and sports facilities.',
        icon: 'file-text',
        color: '#FFF9E6',
        iconColor: '#FAD465',
      },
      {
        id: 'special-needs-inclusive',
        title: 'Inclusive Special Needs Education',
        description: 'Barrier-free access and trained educators for differently-abled students.',
        icon: 'heart-hands',
        color: '#EDF2F7',
        iconColor: '#DBE5EE',
      },
      {
        id: 'protection-harassment',
        title: 'Prohibition of Corporal Punishment',
        description: 'Physical punishment and mental harassment are completely banned by law.',
        icon: 'shield-check',
        color: '#FAF7F0',
        iconColor: '#DCE4EC',
      },
    ],
    legalFramework: {
      title: 'Article 21A & The RTE Act 2009',
      description:
        'The 86th Constitutional Amendment introduced Article 21A making free elementary education a Fundamental Right. The RTE Act 2009 mandates pupil-teacher ratios, curriculum standards, and school management committee participation.',
    },
    supportAreas: [
      { id: 'rte-admission-help', title: 'RTE 25% Seat Online Admission Desk', icon: 'graduation-cap' },
      { id: 'fee-harassment', title: 'Illegal Capitation Fee Grievances', icon: 'scale' },
      { id: 'dropout-prevention', title: 'Slum & Migrant Child Re-enrollment', icon: 'users' },
      { id: 'special-needs-support', title: 'Disabled Student Barrier Audits', icon: 'shield-check' },
    ],
    resources: [
      { id: 'rte-act-pdf', title: 'RTE Act 2009 Statutory Gazette Copy', icon: 'download' },
      { id: 'state-portal', title: 'State RTE 25% Online Application Portal', icon: 'link' },
      { id: 'ncpcr-guidelines', title: 'NCPCR Guidelines on Corporal Punishment', icon: 'file-text' },
    ],
    relatedRights: ['childrens-rights', 'human-rights', 'fundamental-rights'],
  },

  'childrens-rights': {
    id: 'childrens-rights',
    badge: "CHILDREN'S RIGHTS",
    title: "Children's Rights",
    description: 'Special legal protections guaranteeing survival, safety, development and happiness.',
    heroImage: '/assets/images/hero-home.webp',
    overview: {
      title: "What are Children's Rights?",
      description:
        "Children's rights are special human rights designed to safeguard every person under 18. Every child is entitled to a safe childhood, proper nutrition, education, protection from physical and sexual abuse, and freedom from labour.",
      quote:
        'Children are the living messages we send to a time we will not see. Their safety and growth must be unconditional.',
    },
    keyTopics: [
      { id: 'right-to-education', title: 'Right to Education', description: 'Access to learning & growth', icon: 'graduation-cap' },
      { id: 'right-to-protection', title: 'POCSO & Child Safety', description: 'Zero tolerance for child abuse', icon: 'shield-check' },
      { id: 'health-nutrition', title: 'Health & Nutrition', description: 'Healthy physical development', icon: 'heart-pulse' },
    ],
    keyAreas: [
      {
        id: 'pocso-safety',
        title: 'Protection from Abuse (POCSO)',
        description: 'Zero tolerance legal safeguards against physical, mental, and sexual exploitation.',
        icon: 'shield-check',
        color: '#FFF9E6',
        iconColor: '#FAD465',
      },
      {
        id: 'child-labour-ban',
        title: 'Elimination of Child Labour',
        description: 'Absolute ban on commercial employment of children under 14 in any workplace.',
        icon: 'file-text',
        color: '#EDF2F7',
        iconColor: '#DBE5EE',
      },
      {
        id: 'child-nutrition-health',
        title: 'Nutrition & Immunization',
        description: 'Universal access to supplementary nutrition, vaccinations and Anganwadi care.',
        icon: 'heart-pulse',
        color: '#FAF7F0',
        iconColor: '#DCE4EC',
      },
      {
        id: 'trafficking-protection',
        title: 'Anti-Trafficking Safeguards',
        description: 'Stringent rescue, rehabilitation and repatriation protocols for runaway & abducted kids.',
        icon: 'shield-check',
        color: '#FFF9E6',
        iconColor: '#FAD465',
      },
      {
        id: 'child-marriage-prevention',
        title: 'Prohibition of Child Marriage',
        description: 'Strict legal prohibition of underage marriage with immediate police injunction.',
        icon: 'scale',
        color: '#EDF2F7',
        iconColor: '#DBE5EE',
      },
      {
        id: 'juvenile-care',
        title: 'Juvenile Justice & Care',
        description: 'Child-friendly justice proceedings with priority foster care and institutional shelter.',
        icon: 'heart-hands',
        color: '#FAF7F0',
        iconColor: '#DCE4EC',
      },
    ],
    legalFramework: {
      title: 'POCSO, Juvenile Justice & Child Labour Acts',
      description:
        'The Protection of Children from Sexual Offences (POCSO) Act 2012, Juvenile Justice Act 2015, and Child Labour (Prohibition) Act guarantee comprehensive care, rehabilitation, and identity privacy for all children.',
    },
    supportAreas: [
      { id: 'pocso-legal-desk', title: 'Emergency Child Safety Legal Support', icon: 'shield-check' },
      { id: 'childline-escalation', title: 'Childline 1098 Immediate Escalation', icon: 'users' },
      { id: 'child-labour-rescue', title: 'Child Labour Inspection & Rescue', icon: 'scale' },
      { id: 'orphan-shelter-support', title: 'Foster Care & Legal Adoption Guidance', icon: 'heart-hands' },
    ],
    resources: [
      { id: 'pocso-act-summary', title: 'POCSO Act 2012 Complete Handbook', icon: 'download' },
      { id: 'ncpcr-portal', title: 'National Commission for Protection of Child Rights (NCPCR)', icon: 'link' },
      { id: 'childline-guide', title: 'Emergency Standard Operating Procedures (SOPs)', icon: 'file-text' },
    ],
    relatedRights: ['right-to-education', 'human-rights', 'womens-rights'],
  },

  'fundamental-rights': {
    id: 'fundamental-rights',
    badge: 'FUNDAMENTAL RIGHTS',
    title: 'Fundamental Rights',
    description: 'Constitutional rights guaranteed to every citizen of India under Part III of the Constitution.',
    heroImage: '/assets/images/contact-hero-building.jpg',
    overview: {
      title: 'What are Fundamental Rights?',
      description:
        'Fundamental Rights are the supreme constitutional protections guaranteed to every citizen of India against state overreach. They guarantee equality, personal freedom, religious liberty, and judicial remedies.',
      quote:
        'Fundamental rights are the conscience of the Constitution. They guarantee that the state exists for the citizen, not the citizen for the state.',
    },
    keyTopics: [
      { id: 'article-14-18', title: 'Right to Equality (14-18)', description: 'Equal status and abolition of untouchability', icon: 'scale' },
      { id: 'article-19-22', title: 'Right to Freedom (19-22)', description: 'Speech, movement, assembly and life liberty', icon: 'file-text' },
      { id: 'article-32', title: 'Constitutional Remedies (32)', description: 'Direct writ petitions in Supreme Court', icon: 'shield-check' },
    ],
    keyAreas: [
      { id: 'equality-before-law', title: 'Equality Before Law (Art 14)', description: 'Rule of law without arbitrary executive discretion.', icon: 'scale', color: '#FFF9E6', iconColor: '#FAD465' },
      { id: 'freedom-speech', title: 'Freedom of Speech (Art 19)', description: 'Right to express views, assemble peacefully, and form associations.', icon: 'megaphone', color: '#EDF2F7', iconColor: '#DBE5EE' },
      { id: 'protection-life', title: 'Protection of Life (Art 21)', description: 'Comprehensive canopy covering privacy, health, and legal aid.', icon: 'shield-check', color: '#FAF7F0', iconColor: '#DCE4EC' },
      { id: 'religious-freedom', title: 'Religious Liberty (Art 25)', description: 'Freedom of conscience and the right to practice and profess religion.', icon: 'heart-hands', color: '#FFF9E6', iconColor: '#FAD465' },
      { id: 'cultural-educational', title: 'Minority Safeguards (Art 29-30)', description: 'Right to preserve distinct script, language, and run institutions.', icon: 'book-open', color: '#EDF2F7', iconColor: '#DBE5EE' },
      { id: 'constitutional-remedies', title: 'Writ Remedies (Art 32 & 226)', description: 'Habeas Corpus, Mandamus, Quo Warranto, and Certiorari.', icon: 'scale', color: '#FAF7F0', iconColor: '#DCE4EC' },
    ],
    legalFramework: {
      title: 'Basic Structure of the Indian Constitution',
      description:
        'Dr. B.R. Ambedkar called Article 32 the "Heart and Soul" of the Constitution. These rights are enforceable directly through High Courts (Art 226) and the Supreme Court (Art 32).',
    },
    supportAreas: [
      { id: 'pil-drafting', title: 'Public Interest Litigation (PIL) Drafting', icon: 'scale' },
      { id: 'writ-remedies', title: 'Emergency Habeas Corpus Petitions', icon: 'shield-check' },
      { id: 'constitutional-counsel', title: 'High Court Senior Counsel Briefings', icon: 'file-text' },
    ],
    resources: [
      { id: 'constitution-part-3', title: 'Part III of the Constitution of India Full Text', icon: 'download' },
      { id: 'supreme-court-portal', title: 'Supreme Court of India Case Status', icon: 'link' },
    ],
    relatedRights: ['human-rights', 'civil-rights', 'freedom-of-speech'],
  },

  'civil-rights': {
    id: 'civil-rights',
    badge: 'CIVIL RIGHTS',
    title: 'Civil Rights',
    description: 'Rights related to equal treatment and protection under law without social discrimination.',
    heroImage: '/assets/images/contact-cta-hands.jpg',
    overview: {
      title: 'What are Civil Rights?',
      description:
        'Civil rights ensure an individual’s ability to participate in the civil and political life of society without discrimination or repression. They safeguard freedom of contract, access to public places, and fair judicial treatment.',
      quote:
        'Civil rights ensure that every citizen can walk with their head held high, regardless of their background or birth.',
    },
    keyTopics: [
      { id: 'anti-discrimination', title: 'Anti-Discrimination', description: 'Equal access to public spaces', icon: 'scale' },
      { id: 'sc-st-safeguards', title: 'Atrocities Act Safeguards', description: 'Stringent protection against caste abuse', icon: 'shield-check' },
      { id: 'voting-civil-status', title: 'Civic Equality', description: 'Universal adult suffrage & civic dignity', icon: 'users' },
    ],
    keyAreas: [
      { id: 'access-public-amenities', title: 'Access to Public Amenities', description: 'Zero restrictions on shops, restaurants, water sources, and roads.', icon: 'scale', color: '#FFF9E6', iconColor: '#FAD465' },
      { id: 'prevention-atrocities', title: 'Prevention of Atrocities', description: 'Statutory penalties under SC/ST Act for caste-based harassment.', icon: 'shield-check', color: '#EDF2F7', iconColor: '#DBE5EE' },
      { id: 'civil-contracts', title: 'Fair Contracts & Tenancy', description: 'Protection against unlawful residential eviction and discriminatory leases.', icon: 'file-text', color: '#FAF7F0', iconColor: '#DCE4EC' },
      { id: 'freedom-assembly', title: 'Peaceful Civic Assembly', description: 'Right to hold peaceful demonstrations and raise collective civic voices.', icon: 'megaphone', color: '#FFF9E6', iconColor: '#FAD465' },
    ],
    legalFramework: {
      title: 'Protection of Civil Rights Act 1955',
      description:
        'The Protection of Civil Rights Act 1955 prescribes punishment for the practice of untouchability and discrimination in hospitals, educational institutions, or places of public worship.',
    },
    supportAreas: [
      { id: 'civil-complaints', title: 'Civil Rights Violation Redressal', icon: 'scale' },
      { id: 'atrocity-interventions', title: 'Immediate Police Escalation on Caste Abuse', icon: 'shield-check' },
    ],
    resources: [
      { id: 'civil-rights-act', title: 'Protection of Civil Rights Act 1955 Text', icon: 'download' },
    ],
    relatedRights: ['human-rights', 'fundamental-rights'],
  },

  'senior-citizen-rights': {
    id: 'senior-citizen-rights',
    badge: 'SENIOR CITIZENS',
    title: 'Senior Citizen Rights',
    description: 'Statutory rights, maintenance safeguards and welfare schemes for elderly citizens.',
    heroImage: '/assets/images/about-hero-community.png',
    overview: {
      title: 'What are Senior Citizen Rights?',
      description:
        'Senior citizen rights guarantee respect, financial security, shelter, and medical care for parents and senior citizens. The Maintenance and Welfare of Parents and Senior Citizens Act guarantees monthly allowances and protection against abandonment.',
      quote:
        'A society is judged by how it cares for its elderly. Respect and dignified care are statutory guarantees.',
    },
    keyTopics: [
      { id: 'maintenance-tribunals', title: 'Maintenance Tribunals', description: 'Fast-track maintenance orders', icon: 'scale' },
      { id: 'property-protection', title: 'Property Revocation', description: 'Canceling transfers in cases of neglect', icon: 'shield-check' },
      { id: 'geriatric-care', title: 'Healthcare Entitlements', description: 'Priority hospital beds & pension', icon: 'heart-pulse' },
    ],
    keyAreas: [
      { id: 'maintenance-order', title: 'Monthly Maintenance Entitlements', description: 'Statutory maintenance up to ₹10,000/month from children or relatives.', icon: 'scale', color: '#FFF9E6', iconColor: '#FAD465' },
      { id: 'property-return', title: 'Property Transfer Revocation (Sec 23)', description: 'Gift deeds can be declared void if children fail to provide basic amenities.', icon: 'file-text', color: '#EDF2F7', iconColor: '#DBE5EE' },
      { id: 'abandonment-penalty', title: 'Penalties for Abandonment', description: 'Imprisonment up to 3 months for abandoning elderly parents.', icon: 'shield-check', color: '#FAF7F0', iconColor: '#DCE4EC' },
      { id: 'hospital-priority', title: 'Geriatric Hospital Priority', description: 'Separate queues, specialized clinics, and concession schemes.', icon: 'heart-pulse', color: '#FFF9E6', iconColor: '#FAD465' },
    ],
    legalFramework: {
      title: 'Senior Citizens Act 2007 & Article 41',
      description:
        'The Maintenance and Welfare of Parents and Senior Citizens Act 2007 sets up dedicated Sub-Divisional Tribunals that resolve maintenance and property recovery disputes within 90 days.',
    },
    supportAreas: [
      { id: 'elder-helpline', title: 'Elder Helpline 14567 Escalation Desk', icon: 'scale' },
      { id: 'property-recovery-help', title: 'Property Eviction & Recovery Filing', icon: 'shield-check' },
    ],
    resources: [
      { id: 'senior-citizens-act', title: 'Senior Citizens Act 2007 Gazette Copy', icon: 'download' },
    ],
    relatedRights: ['human-rights', 'civil-rights'],
  },

  'labour-rights': {
    id: 'labour-rights',
    badge: 'LABOUR RIGHTS',
    title: 'Labour & Worker Rights',
    description: 'Protection of wages, workplace safety, social security and fair working conditions.',
    heroImage: '/assets/images/about-hero-rally.jpg',
    overview: {
      title: 'What are Labour Rights?',
      description:
        'Labour rights are the body of statutory entitlements that protect workers from exploitation. They guarantee minimum wages, 8-hour workdays, overtime compensation, gratuity, provident fund, and safe workplace standards.',
      quote:
        'Labour is not a commodity. Every worker is entitled to fair remuneration and a safe, dignified working environment.',
    },
    keyTopics: [
      { id: 'minimum-wages', title: 'Statutory Minimum Wages', description: 'Guaranteed floor wage standards', icon: 'scale' },
      { id: 'overtime-hours', title: '8-Hour Workday & Overtime', description: 'Double wage rate for extra hours', icon: 'file-text' },
      { id: 'pf-esi-benefits', title: 'PF & ESI Social Security', description: 'Retirement fund and healthcare coverage', icon: 'shield-check' },
    ],
    keyAreas: [
      { id: 'wage-recovery', title: 'Timely Wage Payment & Recovery', description: 'Strict statutory remedies against arbitrary wage deductions or delays.', icon: 'scale', color: '#FFF9E6', iconColor: '#FAD465' },
      { id: 'overtime-compensations', title: 'Overtime & Weekly Rest Day', description: 'Overtime compensation at double the ordinary wage rate.', icon: 'file-text', color: '#EDF2F7', iconColor: '#DBE5EE' },
      { id: 'occupational-safety', title: 'Workplace Safety & Protective Gear', description: 'Mandatory PPE and safety protocols in industrial setups.', icon: 'shield-check', color: '#FAF7F0', iconColor: '#DCE4EC' },
      { id: 'unlawful-termination', title: 'Protection Against Arbitrary Layoffs', description: 'Mandatory notice pay, retrenchment compensation and conciliation.', icon: 'scale', color: '#FFF9E6', iconColor: '#FAD465' },
    ],
    legalFramework: {
      title: 'Code on Wages 2019 & Industrial Relations Laws',
      description:
        'Articles 39, 42, and 43 mandate living wages and humane working conditions. The Code on Wages guarantees non-discriminatory statutory wages across organized and unorganized sectors.',
    },
    supportAreas: [
      { id: 'wage-dispute-cell', title: 'Unpaid Wages Recovery Assistance', icon: 'scale' },
      { id: 'pf-gratuity-recovery', title: 'PF, ESI & Gratuity Claim Dispute Support', icon: 'file-text' },
    ],
    resources: [
      { id: 'code-on-wages', title: 'Code on Wages 2019 Official Act Text', icon: 'download' },
    ],
    relatedRights: ['human-rights', 'civil-rights'],
  },

  'right-to-information': {
    id: 'right-to-information',
    badge: 'RTI',
    title: 'Right to Information',
    description: 'Right to inspect public records, ask questions and enforce administrative transparency.',
    heroImage: '/assets/images/contact-hero-building.jpg',
    overview: {
      title: 'What is the Right to Information?',
      description:
        'The RTI Act 2005 empowers every citizen to inspect government works, obtain certified copies of records, and ask public authorities for timely information within 30 days.',
      quote:
        'Information is the currency of democracy. Sunlight is the best disinfectant against corruption.',
    },
    keyTopics: [
      { id: '30-day-response', title: '30-Day Mandatory Response', description: 'Statutory deadline for public officials', icon: 'file-text' },
      { id: 'life-liberty-rti', title: '48-Hour Urgent Response', description: 'Information concerning life or liberty', icon: 'shield-check' },
      { id: 'first-appeal', title: 'Appellate Hierarchy', description: 'First Appeal and Central/State Information Commissions', icon: 'scale' },
    ],
    keyAreas: [
      { id: 'inspection-documents', title: 'Inspection of Official Works & Files', description: 'Right to inspect roads, tenders, files, and obtain certified samples.', icon: 'file-text', color: '#FFF9E6', iconColor: '#FAD465' },
      { id: 'low-statutory-fees', title: 'Nominal Fees (Zero for BPL)', description: 'Application fee of ₹10 only; zero fees for below poverty line citizens.', icon: 'scale', color: '#EDF2F7', iconColor: '#DBE5EE' },
      { id: 'penalty-on-officers', title: 'Per-Day Penalties on Errant PIOs', description: '₹250/day penalty up to ₹25,000 on officials who delay or deny data.', icon: 'shield-check', color: '#FAF7F0', iconColor: '#DCE4EC' },
    ],
    legalFramework: {
      title: 'RTI Act 2005 (Derived from Article 19)',
      description:
        'The Supreme Court in landmark verdicts held that the Right to Know is an integral part of Freedom of Speech under Article 19(1)(a). The RTI Act operationalizes this constitutional freedom.',
    },
    supportAreas: [
      { id: 'rti-drafting-help', title: 'Free RTI Application & Appeal Drafting Clinic', icon: 'file-text' },
    ],
    resources: [
      { id: 'rti-guide', title: 'How to File RTI Guidebook (English & Hindi)', icon: 'download' },
    ],
    relatedRights: ['fundamental-rights', 'human-rights'],
  },

  'freedom-of-speech': {
    id: 'freedom-of-speech',
    badge: 'CIVIC FREEDOMS',
    title: 'Freedom of Speech & Expression',
    description: 'Fundamental right to voice opinions, publish news, and critique public policies peacefully.',
    heroImage: '/assets/images/about-hero-rally.jpg',
    overview: {
      title: 'What is Freedom of Speech?',
      description:
        'Article 19(1)(a) guarantees all citizens the right to freedom of speech and expression. This includes artistic expression, investigative journalism, digital publishing, and peaceful protest without arbitrary pre-censorship.',
      quote:
        'Freedom of speech is the bulwark of all other democratic liberties. Without it, justice cannot be defended.',
    },
    keyTopics: [
      { id: 'peaceful-dissent', title: 'Right to Dissent', description: 'Peaceful disagreement with public policies', icon: 'megaphone' },
      { id: 'press-freedom', title: 'Journalistic Freedom', description: 'Reporting without intimidation or illegal restraint', icon: 'file-text' },
      { id: 'digital-expression', title: 'Digital Speech', description: 'Right to share ideas online free from arbitrary blocks', icon: 'scale' },
    ],
    keyAreas: [
      { id: 'press-rights', title: 'Press and Publishing Freedoms', description: 'Protection against unjustified seizure of journalistic equipment.', icon: 'file-text', color: '#FFF9E6', iconColor: '#FAD465' },
      { id: 'protest-rights', title: 'Peaceful Demonstration Rights', description: 'Holding peaceful meetings and marches without weapons.', icon: 'megaphone', color: '#EDF2F7', iconColor: '#DBE5EE' },
      { id: 'reasonable-restrictions', title: 'Reasonable Restrictions Test (19(2))', description: 'State restrictions must be narrow, proportionate and justifiable.', icon: 'shield-check', color: '#FAF7F0', iconColor: '#DCE4EC' },
    ],
    legalFramework: {
      title: 'Article 19(1)(a) & Supreme Court Precedents',
      description:
        'Landmark judgments such as Romesh Thappar and Shreya Singhal strike down arbitrary speech curbs and affirm that the right to express includes the right to hear, read, and receive diverse viewpoints.',
    },
    supportAreas: [
      { id: 'speech-defense-cell', title: 'Legal Counsel for Journalists and Activists', icon: 'scale' },
    ],
    resources: [
      { id: 'shreya-singhal-ruling', title: 'Shreya Singhal (Section 66A IT Act) Judgment Summary', icon: 'download' },
    ],
    relatedRights: ['fundamental-rights', 'human-rights'],
  },

  'minority-rights': {
    id: 'minority-rights',
    badge: 'MINORITY RIGHTS',
    title: 'Minority & Cultural Rights',
    description: 'Constitutional safeguards protecting distinct languages, religious institutions, and educational autonomy.',
    heroImage: '/assets/images/contact-cta-hands.jpg',
    overview: {
      title: 'What are Minority Rights?',
      description:
        'Articles 29 and 30 safeguard religious and linguistic minorities, guaranteeing their right to preserve their language, script, and culture, and establish and administer educational institutions of their choice.',
      quote:
        'Pluralism and secular harmony are the bedrock of the Republic. Every culture and creed deserves equal protection.',
    },
    keyTopics: [
      { id: 'article-29', title: 'Cultural Preservation (Art 29)', description: 'Protection of distinct language and script', icon: 'book-open' },
      { id: 'article-30', title: 'Educational Autonomy (Art 30)', description: 'Right to run institutions without state interference', icon: 'scale' },
      { id: 'ncm-safeguards', title: 'Minority Commission Remedies', description: 'Statutory redressal of community grievances', icon: 'shield-check' },
    ],
    keyAreas: [
      { id: 'institutional-autonomy', title: 'Institutional Autonomy', description: 'Administering minority colleges and schools with non-discriminatory grant-in-aid.', icon: 'book-open', color: '#FFF9E6', iconColor: '#FAD465' },
      { id: 'cultural-heritages', title: 'Cultural Heritage Safeguards', description: 'Government funding to preserve minority dialects, art, and sacred monuments.', icon: 'heart-hands', color: '#EDF2F7', iconColor: '#DBE5EE' },
      { id: 'equal-citizenship', title: 'Equal Citizenship & Welfare Schemes', description: 'Affirmative pre-matric and post-matric scholarship programs.', icon: 'scale', color: '#FAF7F0', iconColor: '#DCE4EC' },
    ],
    legalFramework: {
      title: 'Articles 29 & 30 • National Commission for Minorities Act',
      description:
        'The Constitution provides robust minority guarantees. The NCM Act 1992 empowers the Commission to evaluate developmental progress and inspect rights complaints.',
    },
    supportAreas: [
      { id: 'minority-scholarship-desk', title: 'Minority Scholarship & Grant Assistance', icon: 'book-open' },
      { id: 'ncm-complaint-cell', title: 'NCM Formal Representation Desk', icon: 'scale' },
    ],
    resources: [
      { id: 'ncm-guidelines', title: 'National Commission for Minorities Guidelines', icon: 'download' },
    ],
    relatedRights: ['fundamental-rights', 'human-rights'],
  },

  'civil-liberties': {
    id: 'civil-liberties',
    badge: 'CIVIL LIBERTIES',
    title: 'Civil Liberties & Custodial Safeguards',
    description: 'Strict legal limits on arrest, search, seizure, police detention and custodial interrogation.',
    heroImage: '/assets/images/contact-hero-building.jpg',
    overview: {
      title: 'What are Civil Liberties & Custodial Safeguards?',
      description:
        'Civil liberties protect citizens against arbitrary arrest and unlawful state force. Under Article 22 and the landmark D.K. Basu guidelines, every arrested citizen has mandatory rights to inform family, consult a lawyer, and be produced before a magistrate within 24 hours.',
      quote:
        'No person is above the law, and no person is beneath its protection. Custodial torture is an affront to civilization.',
    },
    keyTopics: [
      { id: '24-hour-magistrate', title: '24-Hour Production Mandate', description: 'Mandatory judicial remand hearing', icon: 'scale' },
      { id: 'dk-basu-guidelines', title: 'D.K. Basu Arrest Protocols', description: 'Arrest memo, family notice, medical exam', icon: 'shield-check' },
      { id: 'right-to-counsel', title: 'Right to Consult Advocate', description: 'Presence of legal counsel during interrogation', icon: 'file-text' },
    ],
    keyAreas: [
      { id: 'arrest-memo', title: 'Mandatory Arrest Memo & Family Intimation', description: 'Police must record time/date and immediately inform family within 8 hours.', icon: 'file-text', color: '#FFF9E6', iconColor: '#FAD465' },
      { id: 'medical-examination', title: 'Mandatory 48-Hour Medical Examination', description: 'Registered medical officer must document injuries to prevent custodial abuse.', icon: 'shield-check', color: '#EDF2F7', iconColor: '#DBE5EE' },
      { id: 'free-bail-representation', title: 'Free Legal Representation at Remand', description: 'Magistrate must ensure legal aid advocate is present before ordering remand.', icon: 'scale', color: '#FAF7F0', iconColor: '#DCE4EC' },
    ],
    legalFramework: {
      title: 'Article 22 • CrPC / BNSS • D.K. Basu vs State of W.B.',
      description:
        'The Supreme Court held that custodial torture violates Article 21. Any non-compliance with arrest guidelines invites departmental action and contempt of court proceedings against errant officers.',
    },
    supportAreas: [
      { id: 'emergency-bail-desk', title: '24/7 Custodial Arrest Emergency Helpline', icon: 'shield-check' },
      { id: 'illegal-custody-habeas', title: 'Immediate Habeas Corpus Legal Intervention', icon: 'scale' },
    ],
    resources: [
      { id: 'dk-basu-guidelines-doc', title: 'Supreme Court D.K. Basu 11 Mandatory Arrest Guidelines', icon: 'download' },
    ],
    relatedRights: ['fundamental-rights', 'human-rights'],
  },
};

export const getRightDetail = (id: string): RightDetailsContent => {
  return RIGHTS_DETAIL_MAP[id] || RIGHTS_DETAIL_MAP['human-rights'];
};

