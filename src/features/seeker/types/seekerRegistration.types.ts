/**
 * Donation Seeker Registration & Assistance Application Types
 * Modeled after the HRSJM React Native mobile APK source of truth
 */

export type DocumentTypeOption =
  | 'aadhaar'
  | 'pan'
  | 'passport'
  | 'driving'
  | 'voter'
  | 'other'
  | string;

export interface UploadedDocFile {
  id?: string;
  name: string;
  sizeBytes: number;
  type: string;
  formattedSize: string;
  uri?: string;
  uploadDate?: string;
  previewUrl?: string;
  docTitle?: string;
  file?: File;
}

export interface SeekerPersonalDetails {
  fullName: string;
  phone: string;
  countryCode: string;
  email: string;
  dob: string;
  gender: string;
  password: string;
  confirmPassword: string;
}

export type AssistanceCause =
  | 'Medical Emergency'
  | 'Education Support'
  | 'Disaster Relief'
  | 'Livelihood & Food'
  | 'Disability Support'
  | 'Housing / Shelter'
  | 'Other';

export type UrgencyLevel = 'NORMAL' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AssistanceNeedDetails {
  cause: AssistanceCause;
  otherCauseDetails?: string;
  requestedAmount: number;
  urgency: UrgencyLevel;
  description: string;
  additionalDocuments: UploadedDocFile[];
  termsAccepted: boolean;
  privacyAccepted: boolean;
  pledgeAccepted: boolean;
}

export interface SeekerApplicationRecord {
  id: string;
  applicationNumber: string;
  fullName: string;
  phone: string;
  email?: string;
  dob?: string;
  gender?: string;
  selectedDocType: DocumentTypeOption;
  selectedDocTitle: string;
  identityDocuments: UploadedDocFile[];
  cause: AssistanceCause;
  requestedAmount: number;
  urgency: UrgencyLevel;
  description: string;
  additionalDocuments: UploadedDocFile[];
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: string;
  submittedDate: string;
  sanctionedAmount?: number;
  adminRemark?: string;
  timeline: Array<{
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
  }>;
}

export interface SeekerValidationErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  dob?: string;
  gender?: string;
  password?: string;
  confirmPassword?: string;
  docFile?: string;
  otherDocName?: string;
  cause?: string;
  requestedAmount?: string;
  description?: string;
  terms?: string;
  privacy?: string;
  pledge?: string;
}
