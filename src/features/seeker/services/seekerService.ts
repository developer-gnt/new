import { apiClient } from '../../../services/apiClient';
import { assistanceStore } from '../../assistance/store/assistanceStore';
import type {
  SeekerPersonalDetails,
  AssistanceNeedDetails,
  UploadedDocFile,
  SeekerApplicationRecord,
  DocumentTypeOption,
} from '../types/seekerRegistration.types';

const STORAGE_KEY = 'hrsjm_seeker_applications_list';
const LAST_APP_NO_KEY = 'hrsjm_seeker_application_number';

export const seekerService = {
  /**
   * Check if mobile number or email is already in use
   */
  async checkDuplicate(params: { mobile_number?: string; email?: string }): Promise<{
    mobile_taken?: boolean;
    mobile_message?: string;
    email_taken?: boolean;
    email_message?: string;
  }> {
    try {
      const res = await apiClient.post<any>('/auth/check-duplicates', params);
      return res?.data || res || {};
    } catch {
      // Offline fallback: check local storage records
      const cleanMobile = params.mobile_number?.replace(/\D/g, '').slice(-10);
      const cleanEmail = params.email?.trim().toLowerCase();
      const existing = seekerService.getSavedApplications();

      const mobileMatch = cleanMobile
        ? existing.some(
            (a) => a.phone.replace(/\D/g, '').slice(-10) === cleanMobile
          )
        : false;
      const emailMatch = cleanEmail
        ? existing.some((a) => a.email?.trim().toLowerCase() === cleanEmail)
        : false;

      return {
        mobile_taken: mobileMatch,
        mobile_message: mobileMatch
          ? 'Mobile number is already registered. Please login.'
          : undefined,
        email_taken: emailMatch,
        email_message: emailMatch
          ? 'Email address is already registered. Please login.'
          : undefined,
      };
    }
  },

  /**
   * Submit complete Donation Seeker Registration & Assistance Request
   */
  async submitApplication(data: {
    personal: SeekerPersonalDetails;
    selectedDocType: DocumentTypeOption;
    selectedDocTitle: string;
    identityFiles: UploadedDocFile[];
    need: AssistanceNeedDetails;
  }): Promise<SeekerApplicationRecord> {
    const cleanMobile = data.personal.phone.replace(/\D/g, '').slice(-10);
    const cleanEmail =
      data.personal.email && data.personal.email.trim()
        ? data.personal.email.trim().toLowerCase()
        : undefined;
    const effectivePassword =
      data.personal.password && data.personal.password.trim().length >= 6
        ? data.personal.password.trim()
        : 'Hrsjm@2026';

    let backendAppNumber: string | undefined;
    let backendRequestId: string | undefined;
    let authUserId: string | undefined;

    // 1. Register Auth Account as DONATION_SEEKER
    try {
      const authRes = await apiClient.post<any>('/auth/register', {
        full_name: data.personal.fullName.trim(),
        mobile_number: cleanMobile,
        email: cleanEmail,
        password: effectivePassword,
        confirm_password: effectivePassword,
        role_name: 'DONATION_SEEKER',
        dob: data.personal.dob || undefined,
      });

      const responsePayload = authRes?.data || authRes;
      if (responsePayload?.user?.id) {
        authUserId = responsePayload.user.id;
      }
      if (responsePayload?.assistance_application_number) {
        backendAppNumber = responsePayload.assistance_application_number;
      }
      if (responsePayload?.assistance_request_id) {
        backendRequestId = responsePayload.assistance_request_id;
      }

      // Store auth session if returned
      if (responsePayload?.accessToken) {
        try {
          localStorage.setItem('hrsjm_auth_token', responsePayload.accessToken);
          localStorage.setItem(
            'hrsjm_current_user',
            JSON.stringify(responsePayload.user || {})
          );
        } catch {
          // ignore localStorage issues
        }
      }
    } catch (err: any) {
      console.warn('Backend /auth/register issue, continuing offline mode:', err?.message || err);
    }

    // 2. Generate reliable Application Reference Number if not provisioned by backend
    if (!backendAppNumber) {
      const hex = Math.random().toString(16).substring(2, 8).toUpperCase();
      backendAppNumber = `HRSJM-SEK-${hex}`;
    }

    // 3. Create or Update Detailed Assistance Request
    try {
      const assistPayload = {
        full_name: data.personal.fullName.trim(),
        mobile: cleanMobile,
        email: cleanEmail,
        requested_amount: Number(data.need.requestedAmount) || 10000,
        reason: data.need.cause === 'Other' && data.need.otherCauseDetails
          ? `Other: ${data.need.otherCauseDetails.trim()}`
          : data.need.cause,
        description: data.need.description?.trim() || `${data.need.cause} emergency assistance application.`,
        user_id: authUserId,
      };

      const assistRes = await apiClient.post<any>('/assistance-requests', assistPayload);
      const createdAssist = assistRes?.data || assistRes;
      if (createdAssist?.id) {
        backendRequestId = createdAssist.id;
      }
    } catch (err) {
      console.warn('Could not POST /assistance-requests, record saved locally:', err);
    }

    // 4. Attach Uploaded Documents to Backend if backendRequestId exists
    const allFiles = [...data.identityFiles, ...data.need.additionalDocuments];
    if (backendRequestId && allFiles.length > 0) {
      for (const item of allFiles) {
        if (item.file) {
          try {
            const formData = new FormData();
            formData.append('file', item.file);
            formData.append('document_name', item.docTitle || item.name);
            formData.append('description', `Uploaded during seeker registration: ${item.name}`);
            await apiClient.post(`/assistance-requests/${backendRequestId}/documents`, formData);
          } catch (uploadErr) {
            console.warn(`Failed to upload ${item.name} to backend:`, uploadErr);
          }
        }
      }
    }

    // 5. Build Complete Application Record
    const nowIso = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + ', ' + new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const record: SeekerApplicationRecord = {
      id: backendRequestId || authUserId || `sek-${Date.now()}`,
      applicationNumber: backendAppNumber,
      fullName: data.personal.fullName.trim(),
      phone: `+91 ${cleanMobile}`,
      email: cleanEmail,
      dob: data.personal.dob,
      gender: data.personal.gender,
      selectedDocType: data.selectedDocType,
      selectedDocTitle: data.selectedDocTitle,
      identityDocuments: data.identityFiles,
      cause: data.need.cause,
      requestedAmount: Number(data.need.requestedAmount) || 10000,
      urgency: data.need.urgency,
      description: data.need.description,
      additionalDocuments: data.need.additionalDocuments,
      status: 'under_review',
      submittedAt: formattedDate,
      submittedDate: nowIso,
      timeline: [
        {
          title: 'Application Submitted',
          description: `Applicant ${data.personal.fullName} submitted assistance request for ₹${(Number(data.need.requestedAmount) || 10000).toLocaleString('en-IN')}.`,
          timestamp: formattedDate,
          completed: true,
        },
        {
          title: 'Document & Identity Verification',
          description: `KYC ${data.selectedDocTitle} submitted. Under verification by HRSJM Secretariat.`,
          timestamp: 'In Progress',
          completed: false,
        },
        {
          title: 'Field Verification & Cause Assessment',
          description: 'Local unit review and aid validation committee assessment.',
          timestamp: 'Pending Verification',
          completed: false,
        },
        {
          title: 'Approval & Fund Sanction',
          description: 'Official grant approval, 80G compliant sanction, and direct transfer.',
          timestamp: 'Final Stage',
          completed: false,
        },
      ],
    };

    // 6. Sync into Local Storage and Admin Assistance Store
    seekerService.saveApplication(record);
    try {
      localStorage.setItem(LAST_APP_NO_KEY, record.applicationNumber);
    } catch {
      // ignore
    }

    // Sync into Admin Assistance Store so it immediately shows in /admin/assistance
    try {
      assistanceStore.createRequest({
        full_name: record.fullName,
        mobile: record.phone,
        email: record.email || '',
        requested_amount: record.requestedAmount,
        reason: `${record.cause}: ${record.description.slice(0, 80)}`,
        description: record.description,
        urgency: record.urgency,
        documents: allFiles.map((f) => ({
          document_name: f.docTitle || f.name,
          file_name: f.name,
          file_size: f.formattedSize,
          mime_type: f.type,
          uri: f.previewUrl || f.uri || '',
          url: f.previewUrl || f.uri || '',
        })),
      });
    } catch (storeErr) {
      console.warn('Could not sync to assistanceStore:', storeErr);
    }

    return record;
  },

  /**
   * Save application to localStorage cache
   */
  saveApplication(record: SeekerApplicationRecord): void {
    try {
      const existing = seekerService.getSavedApplications();
      const filtered = existing.filter(
        (a) => a.applicationNumber !== record.applicationNumber
      );
      filtered.unshift(record);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch {
      // ignore
    }
  },

  /**
   * Get all locally saved seeker applications
   */
  getSavedApplications(): SeekerApplicationRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore
    }
    return [];
  },

  /**
   * Lookup application status by Application Number or Phone
   */
  async trackApplication(
    query: string
  ): Promise<SeekerApplicationRecord | null> {
    const cleanQuery = query.trim().toUpperCase();
    const cleanMobile = query.replace(/\D/g, '').slice(-10);

    // 1. Search locally saved applications first
    const saved = seekerService.getSavedApplications();
    const localMatch = saved.find(
      (a) =>
        a.applicationNumber.toUpperCase() === cleanQuery ||
        (cleanMobile.length === 10 &&
          a.phone.replace(/\D/g, '').slice(-10) === cleanMobile)
    );
    if (localMatch) {
      return localMatch;
    }

    // 2. Query backend assistance requests if online
    try {
      const endpoint = `/assistance-requests?search=${encodeURIComponent(query)}&limit=10`;
      const res = await apiClient.get<any>(endpoint);
      const data = res?.data?.data || res?.data || res;
      const items = Array.isArray(data) ? data : data?.items || [];
      const found = items.find(
        (i: any) =>
          i.id === query ||
          i.mobile?.replace(/\D/g, '').slice(-10) === cleanMobile ||
          `HRSJM-SEK-${i.id.replace(/-/g, '').slice(0, 6).toUpperCase()}` === cleanQuery
      );

      if (found) {
        const appNo = `HRSJM-SEK-${found.id.replace(/-/g, '').slice(0, 6).toUpperCase()}`;
        return {
          id: found.id,
          applicationNumber: appNo,
          fullName: found.full_name || 'Applicant',
          phone: found.mobile || '',
          email: found.email,
          selectedDocType: 'aadhaar',
          selectedDocTitle: 'Identity Verification',
          identityDocuments: [],
          cause: (found.reason?.split(':')[0] || 'Medical Emergency') as any,
          requestedAmount: Number(found.requested_amount) || 0,
          urgency: 'HIGH',
          description: found.description || found.reason || '',
          additionalDocuments: [],
          status: (found.status?.toLowerCase() === 'approved'
            ? 'approved'
            : found.status?.toLowerCase() === 'rejected'
            ? 'rejected'
            : 'under_review') as any,
          submittedAt: new Date(found.created_at || Date.now()).toLocaleDateString('en-GB'),
          submittedDate: found.created_at || new Date().toISOString(),
          sanctionedAmount: found.sanctioned_amount,
          adminRemark: found.admin_remark,
          timeline: [
            {
              title: 'Application Submitted',
              description: 'Assistance request logged in official registry.',
              timestamp: 'Completed',
              completed: true,
            },
            {
              title: 'Under Review',
              description: found.admin_remark || 'Verification in progress by administration.',
              timestamp: found.status === 'PENDING' ? 'In Progress' : 'Completed',
              completed: found.status !== 'PENDING',
            },
            {
              title: 'Final Decision',
              description: found.status === 'APPROVED' ? 'Approved & Sanctioned' : found.status === 'REJECTED' ? 'Rejected' : 'Pending',
              timestamp: found.status === 'PENDING' ? 'Pending' : 'Completed',
              completed: found.status === 'APPROVED' || found.status === 'REJECTED',
            },
          ],
        };
      }
    } catch {
      // ignore
    }

    return null;
  },

  /**
   * Get last submitted application number
   */
  getLastApplicationNumber(): string | null {
    try {
      return localStorage.getItem(LAST_APP_NO_KEY);
    } catch {
      return null;
    }
  },
};
