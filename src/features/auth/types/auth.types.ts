/**
 * Authentication Module - Types
 * Exact counterpart of APK: hrsjm-application-ui/src/features/auth/types/auth.types.ts
 * and Backend: HRSJM-back-api/src/modules/auth
 */

export interface UserRoleInfo {
  id: string;
  name: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  mobile_number: string;
  email: string | null;
  avatar?: string | null;
  status: string;
  roles: (UserRoleInfo | string)[];
  created_at?: string;
  updated_at?: string;
  membership_status?: string | null;
  assistance_status?: string | null;
  assistance_application_number?: string | null;
  account_type?: 'general' | 'member' | 'seeker' | 'admin';
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface AuthSession extends AuthTokens {
  user: UserProfile;
}

export interface LoginRequestPayload {
  identifier: string;
  password: string;
}

export interface ForgotPasswordResult {
  delivered_mechanism: string;
  reset_token?: string;
}

export interface LoginValidationErrors {
  identifier?: string;
  password?: string;
}

/**
 * General User Registration Request Payload
 * Matches Backend RegisterDto: HRSJM-back-api/src/modules/auth/dto/register.dto.ts
 */
export interface RegisterRequestPayload {
  full_name: string;
  mobile_number: string;
  email?: string;
  dob?: string;
  date_of_birth?: string;
  password: string;
  confirm_password: string;
  role_name?: string;
}

/**
 * Duplicate Check Request & Response
 * Matches Backend CheckDuplicatesDto: HRSJM-back-api/src/modules/auth/dto/check-duplicates.dto.ts
 */
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

/**
 * Form state for General User Registration
 */
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
