/**
 * Authentication Module - Types
 * Counterpart of APK: hrsjm-application-ui/src/features/auth/types/auth.types.ts
 * and Backend: HRSJM-back-api/src/modules/auth
 */

export interface UserRoleInfo {
  id?: string;
  name: string;
  description?: string;
}

export type UserRole = UserRoleInfo;

export interface UserProfile {
  id: string;
  full_name: string;
  mobile_number: string;
  email: string | null;
  avatar?: string | null;
  avatar_url?: string | null;
  status?: string;
  roles: (UserRoleInfo | string)[];
  created_at?: string;
  updated_at?: string;
  membership_status?: string | null;
  assistance_status?: string | null;
  assistance_application_number?: string | null;
  account_type?: 'general' | 'member' | 'seeker' | 'admin';
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  date_of_birth?: string | null;
  blood_group?: string | null;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface AuthSession {
  user: UserProfile;
  access_token: string;
  refresh_token: string;
}

export interface LoginRequestPayload {
  identifier: string; // email or mobile
  password: string;
  rememberMe?: boolean;
}

export type LoginPayload = LoginRequestPayload;

export interface ForgotPasswordResult {
  delivered_mechanism: string;
  reset_token?: string;
}

export interface LoginValidationErrors {
  identifier?: string;
  password?: string;
}

export interface RegisterRequestPayload {
  full_name: string;
  mobile_number: string;
  email?: string;
  dob?: string;
  date_of_birth?: string;
  password: string;
  confirm_password?: string;
  role_name?: 'DONATION_SEEKER' | 'MEMBER' | 'USER' | string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export type RegisterPayload = RegisterRequestPayload;

export interface ChangePasswordPayload {
  current_password?: string;
  old_password?: string;
  new_password: string;
  confirm_password: string;
}

export interface CheckDuplicatesPayload {
  mobile_number?: string;
  email?: string;
  exclude_user_id?: string;
}

export interface CheckDuplicatesResult {
  available: boolean;
  mobile_taken: boolean;
  email_taken: boolean;
  mobile_message?: string;
  email_message?: string;
}

export interface RegisterFormData {
  fullName: string;
  phone: string;
  countryCode: string;
  email: string;
  dob: string;
  gender: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

export interface RegisterValidationErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  dob?: string;
  gender?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}
