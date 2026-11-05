export type ApplicationStatus =
  | 'APPLIED'
  | 'UNDER_REVIEW'
  | 'REUPLOAD_REQUIRED'
  | 'APPROVED'
  | 'REJECTED';

export interface MembershipCategoryOption {
  id: string;
  postName: string;
  level: 'district' | 'state' | 'executive' | 'national';
  qualification: string;
  fee: string;
  feeAmount: number;
  validity: string;
  checklistItems: string[];
  kitItems: string[];
  badgeColor?: string;
}

export interface PersonalInfoForm {
  fullName: string;
  fatherOrSpouseName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  mobileNumber: string;
  email: string;
  bloodGroup: string;
  occupation: string;
  policeStation?: string;
  photoUrl?: string;
  photoFileName?: string;
}

export interface AddressInfoForm {
  addressLine: string;
  state: string;
  district: string;
  pinCode: string;
  proposedChapter: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface DocumentsInfoForm {
  idProofType: 'aadhaar' | 'voter_id' | 'passport' | 'pan';
  idProofNumber: string;
  idProofFileName?: string;
  idProofFileUrl?: string;
  signatureFileName?: string;
  signatureFileUrl?: string;
  agreedToCharter: boolean;
}

export interface MembershipApplicationFormData {
  selectedPost: MembershipCategoryOption;
  personal: PersonalInfoForm;
  address: AddressInfoForm;
  documents: DocumentsInfoForm;
}

export interface SubmittedApplicationRecord {
  applicationId: string;
  postName: string;
  categoryFee: number;
  validity: string;
  fullName: string;
  phone: string;
  email: string;
  submittedAt: string;
  status: ApplicationStatus;
  currentStage: number; // 1 to 4
  reviewerRemarks?: string;
  assignedChapter: string;
  documents: {
    photo: { name: string; status: 'VERIFIED' | 'PENDING' | 'REJECTED'; url?: string };
    idProof: { name: string; type: string; status: 'VERIFIED' | 'PENDING' | 'REJECTED'; url?: string };
    signature: { name: string; status: 'VERIFIED' | 'PENDING' | 'REJECTED'; url?: string };
  };
  generatedMemberId?: string;
}

