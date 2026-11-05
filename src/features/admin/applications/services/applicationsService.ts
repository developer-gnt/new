import { apiClient } from '@/api';

export interface ListMembershipsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category_id?: string;
  user_id?: string;
}

export interface ListAssistanceParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
}

export const applicationsService = {
  /**
   * Fetches membership applications list from GET /memberships
   */
  async listMemberships(params?: ListMembershipsParams) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    if (params?.category_id) query.append('category_id', params.category_id);
    if (params?.user_id) query.append('user_id', params.user_id);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiClient.get<any>(`/memberships${queryString}`);
  },

  /**
   * Fetches membership summary KPI statistics from GET /memberships/stats
   */
  async getMembershipStats(search?: string, categoryId?: string) {
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    if (categoryId) query.append('category_id', categoryId);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiClient.get<any>(`/memberships/stats${queryString}`);
  },

  /**
   * Fetches single membership application details by ID from GET /memberships/:id
   */
  async getMembershipById(id: string) {
    return apiClient.get<any>(`/memberships/${id}`);
  },

  /**
   * Updates membership application status from PATCH /memberships/:id/status
   */
  async updateMembershipStatus(id: string, status: string, rejectionReason?: string, adminNotes?: string) {
    return apiClient.patch<any>(`/memberships/${id}/status`, {
      status,
      rejection_reason: rejectionReason,
      admin_notes: adminNotes,
    });
  },

  /**
   * Fetches attached KYC documents from GET /memberships/:id/documents
   */
  async getMembershipDocuments(id: string) {
    return apiClient.get<any>(`/memberships/${id}/documents`);
  },

  /**
   * Fetches donation seeker assistance requests from GET /assistance-requests
   */
  async listAssistanceRequests(params?: ListAssistanceParams) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    if (params?.category) query.append('category', params.category);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiClient.get<any>(`/assistance-requests${queryString}`);
  },

  /**
   * Fetches assistance request summary stats from GET /assistance-requests/stats/summary
   */
  async getAssistanceStats(dto?: ListAssistanceParams) {
    const query = new URLSearchParams();
    if (dto?.search) query.append('search', dto.search);
    if (dto?.status) query.append('status', dto.status);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiClient.get<any>(`/assistance-requests/stats/summary${queryString}`);
  },

  /**
   * Fetches single assistance request by ID from GET /assistance-requests/:id
   */
  async getAssistanceById(id: string) {
    return apiClient.get<any>(`/assistance-requests/${id}`);
  },

  /**
   * Updates assistance request status from PATCH /assistance-requests/:id/status
   */
  async updateAssistanceStatus(id: string, status: string, adminRemark?: string) {
    return apiClient.patch<any>(`/assistance-requests/${id}/status`, {
      status,
      admin_remark: adminRemark,
    });
  },
};

