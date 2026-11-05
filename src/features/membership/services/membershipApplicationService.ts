import { apiClient, ENDPOINTS } from '@/api';
import type { MembershipApplicationFormData } from '../types/membershipApplication.types';

export const membershipApplicationService = {
  /**
   * Submits a new membership application
   * POST /api/v1/memberships
   */
  async submitApplication(formData: MembershipApplicationFormData) {
    const payload = {
      category_id: formData.selectedPost.id,
      post_name: formData.selectedPost.postName,
      full_name: formData.personal.fullName.trim(),
      father_spouse_name: formData.personal.fatherOrSpouseName.trim(),
      dob: formData.personal.dateOfBirth,
      gender: formData.personal.gender,
      mobile_number: formData.personal.mobileNumber.replace(/\D/g, '').slice(-10),
      email: formData.personal.email.trim(),
      blood_group: formData.personal.bloodGroup,
      occupation: formData.personal.occupation.trim(),
      police_station: formData.personal.policeStation || undefined,
      address_line: formData.address.addressLine.trim(),
      state: formData.address.state.trim(),
      district: formData.address.district.trim(),
      pincode: formData.address.pinCode.trim(),
      proposed_chapter: formData.address.proposedChapter.trim(),
      emergency_contact_name: formData.address.emergencyContactName?.trim(),
      emergency_contact_phone: formData.address.emergencyContactPhone?.trim(),
      id_proof_type: formData.documents.idProofType,
      id_proof_number: formData.documents.idProofNumber.trim(),
      photo_url: formData.personal.photoUrl,
      id_proof_url: formData.documents.idProofFileUrl,
      signature_url: formData.documents.signatureFileUrl,
    };

    return apiClient.post<any>(ENDPOINTS.memberships.apply, payload);
  },

  /**
   * Fetches status of an application by ID
   * GET /api/v1/memberships/:id
   */
  async getApplicationStatus(applicationId: string) {
    return apiClient.get<any>(ENDPOINTS.memberships.getById(applicationId));
  },

  /**
   * Uploads an identity or KYC document
   * POST /api/v1/documents
   */
  async uploadDocument(fileData: { name: string; type: string; base64: string }) {
    return apiClient.post<any>('/documents', fileData);
  },

  /**
   * Re-uploads a flagged document
   * PATCH /api/v1/memberships/:id
   */
  async reuploadDocument(applicationId: string, docPayload: { doc_type: string; file_url: string }) {
    return apiClient.patch<any>(ENDPOINTS.memberships.update(applicationId), docPayload);
  },
};
