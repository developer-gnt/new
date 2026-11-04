/**
 * Admin Profile & ID Card Domain Models for HRSJM Web Application.
 * Parity with mobile APK src/features/admin/profile/types/profile.types.ts
 */

export type AccountStatus = 'Active' | 'Inactive' | 'Suspended';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';

/** Editable personal information values */
export interface PersonalInfoInput {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

/** Editable administrative / governance details */
export interface AdminDetailsInput {
  role: string;
  accountStatus: AccountStatus;
  designation?: string;
  department?: string;
}

/** Password change form payload */
export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/** Full administrator profile matching HRSJM Central System */
export interface AdminProfile extends PersonalInfoInput, AdminDetailsInput {
  /** Signed-in administrator account display name */
  accountName: string;
  /** Administrator identifier badge (e.g. ADMIN001) */
  adminId: string;
  /** Official Membership ID (e.g. HRSJM-00001) */
  memberId: string;
  /** Profile avatar image URL or data URI */
  avatar?: string | null;
  /** Membership category / rank */
  membershipType: string;
  /** Date when the admin joined the trust */
  memberSince: string;
  /** Date of card issuance */
  issueDate: string;
  /** Card expiration / validity threshold */
  validTill: string;
  /** Emergency contact phone number */
  emergencyContact: string;
  /** Current status of membership application if applicable */
  hasAppliedMembership?: boolean;
  membershipStatus?: 'Active' | 'Approved' | 'Applied Successfully' | 'Under Review' | 'Rejected' | string;
  applicationId?: string;
  appliedMembershipType?: string;
  rejectionReason?: string;
}

export interface ValidationErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  role?: string;
  accountStatus?: string;
}

