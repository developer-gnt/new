import type { AssistanceCause, DocumentTypeOption, UrgencyLevel } from '../types/seekerRegistration.types';

export interface DocumentConfig {
  id: DocumentTypeOption;
  title: string;
  shortCode: string;
  description: string;
  acceptedFormats: string;
}

export const SEEKER_DOCUMENT_OPTIONS: DocumentConfig[] = [
  {
    id: 'aadhaar',
    title: 'Aadhaar Card',
    shortCode: 'AADHAAR',
    description: 'Clear photo or scan of front and back of Aadhaar Card',
    acceptedFormats: 'JPG, PNG, PDF (Max 5MB)',
  },
  {
    id: 'pan',
    title: 'PAN Card',
    shortCode: 'PAN',
    description: 'Clear photo or scan of applicant PAN Card',
    acceptedFormats: 'JPG, PNG, PDF (Max 5MB)',
  },
  {
    id: 'passport',
    title: 'Passport',
    shortCode: 'PASSPORT',
    description: 'Photo page & address page of valid Indian Passport',
    acceptedFormats: 'JPG, PNG, PDF (Max 5MB)',
  },
  {
    id: 'driving',
    title: 'Driving Licence',
    shortCode: 'DL',
    description: 'Front and back scan of valid Driving Licence',
    acceptedFormats: 'JPG, PNG, PDF (Max 5MB)',
  },
  {
    id: 'voter',
    title: 'Voter ID',
    shortCode: 'EPIC',
    description: 'Election commission photo voter identity card',
    acceptedFormats: 'JPG, PNG, PDF (Max 5MB)',
  },
  {
    id: 'other',
    title: 'Other Government / Valid ID',
    shortCode: 'OTHER',
    description: 'Ration card, BPL card, disability cert or employment ID',
    acceptedFormats: 'JPG, PNG, PDF (Max 5MB)',
  },
];

export interface CauseOption {
  key: AssistanceCause;
  label: string;
  description: string;
  suggestedDocs: string;
}

export const CAUSE_OPTIONS: CauseOption[] = [
  {
    key: 'Medical Emergency',
    label: 'Medical Emergency & Treatment',
    description: 'Hospitalization bills, urgent surgeries, medicines or critical healthcare aid',
    suggestedDocs: 'Hospital estimate, discharge summary or doctor diagnosis sheet',
  },
  {
    key: 'Education Support',
    label: 'Education & Tuition Support',
    description: 'School/college fees, examination fees, textbooks or uniforms for underprivileged students',
    suggestedDocs: 'School fee voucher, college demand note or marksheet',
  },
  {
    key: 'Disaster Relief',
    label: 'Disaster & Calamity Relief',
    description: 'Flood, fire, earthquake damage, accidental house collapse or extreme weather loss',
    suggestedDocs: 'Panchayat/Municipal disaster certificate or damage photographs',
  },
  {
    key: 'Livelihood & Food',
    label: 'Livelihood, Ration & Food Aid',
    description: 'Subsistence ration, small vendor tool grant, dry ration kit or job loss relief',
    suggestedDocs: 'BPL / Antyodaya ration card or local representative letter',
  },
  {
    key: 'Disability Support',
    label: 'Disability & Mobility Assistance',
    description: 'Wheelchair, hearing aid, prosthetic limb, special therapy or caregiver aid',
    suggestedDocs: 'UDID card or government disability certificate',
  },
  {
    key: 'Housing / Shelter',
    label: 'Emergency Housing & Shelter Aid',
    description: 'Rental distress, eviction prevention, temporary shelter or roof repairs',
    suggestedDocs: 'Rent agreement, landlord notice or shelter authority letter',
  },
  {
    key: 'Other',
    label: 'Other Humanitarian Aid',
    description: 'Any genuine emergency humanitarian need evaluated on case-by-case merits',
    suggestedDocs: 'Relevant supporting proof, bills or self-attested affidavit',
  },
];

export const PRESET_AMOUNTS = [5000, 10000, 25000, 50000, 100000];

export const URGENCY_LEVELS: Array<{
  key: UrgencyLevel;
  label: string;
  desc: string;
  badgeBg: string;
  badgeText: string;
  borderActive: string;
}> = [
  {
    key: 'NORMAL',
    label: 'Normal',
    desc: 'Expected within 10-15 business days',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    borderActive: 'border-emerald-500',
  },
  {
    key: 'MEDIUM',
    label: 'Medium',
    desc: 'Need resolved within 5-7 days',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    borderActive: 'border-amber-500',
  },
  {
    key: 'HIGH',
    label: 'High',
    desc: 'Critical requirement within 48-72 hours',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-700',
    borderActive: 'border-orange-500',
  },
  {
    key: 'CRITICAL',
    label: 'Critical / Life Threatening',
    desc: 'Immediate emergency intervention within 24 hours',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-700',
    borderActive: 'border-red-500',
  },
];
