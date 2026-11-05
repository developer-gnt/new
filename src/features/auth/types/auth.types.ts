export interface UserRole {
  id?: string;
  name: string;
  description?: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string | null;
  mobile_number: string;
  status?: string;
  roles: (string | UserRole)[];
  membership_status?: string | null;
  assistance_status?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  date_of_birth?: string | null;
  blood_group?: string | null;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuthSession {
  user: UserProfile;
  access_token: string;
  refresh_token: string;
}

export interface LoginPayload {
  identifier: string; // email or mobile
  password: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  full_name: string;
  mobile_number: string;
  email?: string;
  password: string;
  confirm_password?: string;
  role_name?: 'DONATION_SEEKER' | 'MEMBER' | 'USER';
  date_of_birth?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface ChangePasswordPayload {
  current_password?: string;
  old_password?: string;
  new_password: string;
  confirm_password: string;
}

