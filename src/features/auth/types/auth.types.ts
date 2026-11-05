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
