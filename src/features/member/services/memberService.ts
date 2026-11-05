import { apiClient } from '../../../services/apiClient';

export interface UpdateProfilePayload {
  full_name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  address?: string;
  blood_group?: string;
}

const hasToken = (): boolean => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return Boolean(window.localStorage.getItem('hrsjm_auth_token'));
    }
  } catch {
    // Ignore
  }
  return false;
};

export const memberService = {
  /**
   * Fetches the current logged-in user's active membership profile
   * GET /api/v1/users/me/membership
   */
  async getOwnMembership() {
    if (!hasToken()) return null;
    try {
      return await apiClient.get<any>('/users/me/membership');
    } catch {
      return null;
    }
  },

  /**
   * Fetches the authenticated user profile
   * GET /api/v1/auth/me
   */
  async getOwnProfile() {
    if (!hasToken()) return null;
    try {
      return await apiClient.get<any>('/auth/me');
    } catch {
      return null;
    }
  },

  /**
   * Updates authenticated user profile details
   * PATCH /api/v1/auth/me
   */
  async updateOwnProfile(payload: UpdateProfilePayload) {
    if (!hasToken()) return null;
    try {
      return await apiClient.patch<any>('/auth/me', payload);
    } catch {
      return null;
    }
  },

  /**
   * Fetches available membership tiers and categories
   * GET /api/v1/membership-categories
   */
  async getMembershipCategories() {
    try {
      return await apiClient.get<any>('/membership-categories');
    } catch {
      return null;
    }
  },

  /**
   * Fetches payment history for the logged-in member
   * GET /api/v1/membership-payments
   */
  async getOwnMembershipPayments() {
    if (!hasToken()) return null;
    try {
      return await apiClient.get<any>('/membership-payments');
    } catch {
      return null;
    }
  },

  /**
   * Fetches donation payments made by the logged-in member
   * GET /api/v1/donation-payments
   */
  async getOwnDonations() {
    if (!hasToken()) return null;
    try {
      return await apiClient.get<any>('/donation-payments');
    } catch {
      return null;
    }
  },

  /**
   * Fetches documents uploaded for the membership
   * GET /api/v1/memberships/:id/documents
   */
  async getMembershipDocuments(membershipId: string) {
    try {
      return await apiClient.get<any>(`/memberships/${membershipId}/documents`);
    } catch {
      return null;
    }
  },

  /**
   * Fetches member renewal records
   * GET /api/v1/memberships/:id/renewal-history
   */
  async getRenewalHistory(membershipId: string) {
    try {
      return await apiClient.get<any>(`/memberships/${membershipId}/renewal-history`);
    } catch {
      return null;
    }
  },
};
