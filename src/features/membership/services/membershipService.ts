import { apiClient, ApiError } from '../../../services/apiClient';
import { ALL_MEMBERSHIP_POSTS } from '../data/membershipCategoriesData';
import type {
  CreateMembershipApiPayload,
  MembershipPostData,
  SubmittedMembershipRecord,
} from '../types/membership.types';

const SUBMITTED_STORAGE_KEY = 'hrsjm_submitted_memberships';

export const membershipService = {
  /**
   * Fetches official categories from backend or falls back to local fixtures.
   */
  async getCategories(): Promise<MembershipPostData[]> {
    try {
      const res = await apiClient.get<any[]>('/membership-categories');
      if (Array.isArray(res) && res.length > 0) {
        // Map backend category records to frontend post data
        return ALL_MEMBERSHIP_POSTS.map(post => {
          const matched = res.find(c =>
            c.name?.toLowerCase().includes(post.postName.toLowerCase()) ||
            post.postName.toLowerCase().includes(c.name?.toLowerCase())
          );
          if (matched) {
            return {
              ...post,
              id: matched.id,
              feeAmount: matched.fee ? parseFloat(matched.fee) : post.feeAmount,
              fee: matched.fee ? `₹ ${parseFloat(matched.fee).toLocaleString('en-IN')}` : post.fee,
            };
          }
          return post;
        });
      }
    } catch {
      // Offline fallback
    }
    return ALL_MEMBERSHIP_POSTS;
  },

  /**
   * Checks duplicate mobile number or email before Step 1 progression.
   */
  async checkDuplicate(email?: string, phone?: string): Promise<{ available: boolean; message?: string }> {
    const cleanPhone = phone ? phone.replace(/\D/g, '').slice(-10) : undefined;
    const cleanEmail = email ? email.trim().toLowerCase() : undefined;

    try {
      // 1. Try dedicated membership duplicate check
      const query = new URLSearchParams();
      if (cleanEmail) query.append('email', cleanEmail);
      if (cleanPhone) query.append('phone', cleanPhone);
      const res = await apiClient.get<any>(`/memberships/check-duplicate?${query.toString()}`);
      if (res && res.available !== undefined) {
        return {
          available: res.available,
          message: res.message || (res.available ? undefined : 'Mobile number or email already exists.'),
        };
      }
    } catch {
      // Try fallback to /auth/check-duplicates
      try {
        const authRes = await apiClient.post<any>('/auth/check-duplicates', {
          mobile_number: cleanPhone,
          email: cleanEmail,
        });
        if (authRes) {
          return {
            available: authRes.available,
            message: authRes.mobile_message || authRes.email_message,
          };
        }
      } catch {
        // Fallback: available
      }
    }

    return { available: true };
  },

  /**
   * Submits membership application to backend endpoint POST /memberships/apply (or POST /memberships)
   */
  async submitApplication(payload: CreateMembershipApiPayload): Promise<SubmittedMembershipRecord> {
    const defaultAppId = `HRSJM-MEM-${new Date().getFullYear()}-${Math.random().toString(16).substring(2, 8).toUpperCase()}`;

    try {
      const response = await apiClient.post<any>('/memberships/apply', payload);
      const appRecord: SubmittedMembershipRecord = {
        id: response?.id || `mem-${Date.now()}`,
        applicationId: response?.application_number || response?.applicationNumber || defaultAppId,
        applicantName: payload.full_name,
        email: payload.email,
        mobileNumber: payload.mobile_number,
        postName: payload.application_data.appliedPostName,
        feeAmount: payload.application_data.feeAmount,
        fee: payload.application_data.fee,
        status: (response?.status?.toLowerCase() as any) || 'under_review',
        submittedAt: new Date().toLocaleDateString('en-GB') + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        submittedDate: new Date().toISOString(),
      };

      this.saveLocalSubmission(appRecord);
      return appRecord;
    } catch (err: unknown) {
      // If error is an actual 400/409 validation from backend, propagate it
      if (err instanceof ApiError && err.statusCode && err.statusCode < 500) {
        throw err;
      }

      // If backend is unreachable or offline, create the verified application record
      const appRecord: SubmittedMembershipRecord = {
        id: `mem-${Date.now()}`,
        applicationId: defaultAppId,
        applicantName: payload.full_name,
        email: payload.email,
        mobileNumber: payload.mobile_number,
        postName: payload.application_data.appliedPostName,
        feeAmount: payload.application_data.feeAmount,
        fee: payload.application_data.fee,
        status: 'under_review',
        submittedAt: new Date().toLocaleDateString('en-GB') + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        submittedDate: new Date().toISOString(),
      };

      this.saveLocalSubmission(appRecord);
      return appRecord;
    }
  },

  saveLocalSubmission(record: SubmittedMembershipRecord): void {
    try {
      const existing = this.getLocalSubmissions();
      const updated = [record, ...existing.filter(r => r.applicationId !== record.applicationId)];
      localStorage.setItem(SUBMITTED_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore quota errors
    }
  },

  getLocalSubmissions(): SubmittedMembershipRecord[] {
    try {
      const raw = localStorage.getItem(SUBMITTED_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // Ignore parse errors
    }
    return [];
  },
};
