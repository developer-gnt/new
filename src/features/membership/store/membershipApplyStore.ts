import { useSyncExternalStore } from 'react';
import type {
  MembershipApplicationFormData,
  MembershipCategoryOption,
  SubmittedApplicationRecord,
  ApplicationStatus,
  PersonalInfoForm,
  AddressInfoForm,
  DocumentsInfoForm,
} from '../types/membershipApplication.types';
import type { PaymentReceiptDetails } from '../../payments/types/payment.types';
import { MEMBERSHIP_CATEGORIES } from '../data/membershipCategoriesData';
import { membershipApplicationService } from '../services/membershipApplicationService';
import { apiClient } from '@/api';

const FORM_STORAGE_KEY = 'hrsjm_membership_apply_draft';
const APPS_STORAGE_KEY = 'hrsjm_submitted_applications';

const DEFAULT_PERSONAL: PersonalInfoForm = {
  fullName: '',
  fatherOrSpouseName: '',
  dateOfBirth: '',
  gender: 'Male',
  mobileNumber: '',
  email: '',
  bloodGroup: 'O+',
  occupation: '',
  policeStation: '',
  photoUrl: '',
};

const DEFAULT_ADDRESS: AddressInfoForm = {
  addressLine: '',
  state: '',
  district: '',
  pinCode: '',
  proposedChapter: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
};

const DEFAULT_DOCUMENTS: DocumentsInfoForm = {
  idProofType: 'aadhaar',
  idProofNumber: '',
  idProofFileName: '',
  idProofFileUrl: '',
  signatureFileName: '',
  signatureFileUrl: '',
  agreedToCharter: false,
};

// Seed submitted application for immediate demonstration & testing in /membership/status
const INITIAL_SUBMITTED_APPS: SubmittedApplicationRecord[] = [
  {
    applicationId: 'HRSJM-APP-2026-9214',
    postName: 'District Active Member',
    categoryFee: 800,
    validity: '1 Year',
    fullName: 'Adv. Rajeshwar Sharma',
    phone: '+91 98765 43210',
    email: 'rajeshwar.sharma@example.org',
    submittedAt: '2026-10-15T11:30:00.000Z',
    status: 'APPROVED',
    currentStage: 4,
    reviewerRemarks: 'All KYC documentation verified. Inducted into National Capital Chapter.',
    assignedChapter: 'National Capital Chapter, New Delhi',
    documents: {
      photo: { name: 'passport_photo.jpg', status: 'VERIFIED' },
      idProof: { name: 'aadhaar_card_masked.pdf', type: 'Aadhaar', status: 'VERIFIED' },
      signature: { name: 'signature_specimen.png', status: 'VERIFIED' },
    },
    generatedMemberId: 'HRSJM-MEM-2026-0842',
  },
  {
    applicationId: 'HRSJM-APP-2026-4819',
    postName: 'State Unit Post',
    categoryFee: 2300,
    validity: '2 Years',
    fullName: 'Sunita Mehra',
    phone: '+91 98111 22334',
    email: 'sunita.mehra@example.com',
    submittedAt: '2026-11-02T14:20:00.000Z',
    status: 'UNDER_REVIEW',
    currentStage: 2,
    reviewerRemarks: 'Application received. Document verification in progress by State Directorate.',
    assignedChapter: 'Haryana State Chapter, Gurugram',
    documents: {
      photo: { name: 'sunita_photo.jpg', status: 'VERIFIED' },
      idProof: { name: 'voter_id_front.jpg', type: 'Voter ID', status: 'PENDING' },
      signature: { name: 'sign.png', status: 'VERIFIED' },
    },
  },
  {
    applicationId: 'HRSJM-APP-2026-1105',
    postName: 'District Unit Post',
    categoryFee: 1300,
    validity: '1 Year',
    fullName: 'Mohd. Imran Khan',
    phone: '+91 99887 76655',
    email: 'imran.khan@example.org',
    submittedAt: '2026-11-03T09:15:00.000Z',
    status: 'REUPLOAD_REQUIRED',
    currentStage: 2,
    reviewerRemarks: 'Aadhaar copy is blurry and address is not clearly legible. Please re-upload a clear scanned copy.',
    assignedChapter: 'Uttar Pradesh Chapter, Lucknow',
    documents: {
      photo: { name: 'imran_photo.jpg', status: 'VERIFIED' },
      idProof: { name: 'aadhaar_scan.pdf', type: 'Aadhaar', status: 'REJECTED' },
      signature: { name: 'imran_sign.jpg', status: 'VERIFIED' },
    },
  },
];

class MembershipApplyStore {
  private currentStep = 1;
  private formData: MembershipApplicationFormData;
  private submittedApps: SubmittedApplicationRecord[] = [];
  private activeTrackRecord: SubmittedApplicationRecord | null = null;
  private isSubmitting = false;
  private error: string | null = null;
  private listeners: Set<() => void> = new Set();
  private version = 0;

  constructor() {
    this.formData = this.loadDraft();
    this.submittedApps = this.loadSubmittedApps();
    this.activeTrackRecord = this.submittedApps[1] || this.submittedApps[0] || null;
  }

  private loadDraft(): MembershipApplicationFormData {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(FORM_STORAGE_KEY);
        if (raw) {
          return JSON.parse(raw);
        }
      }
    } catch {
      // Ignore
    }
    return {
      selectedPost: MEMBERSHIP_CATEGORIES[0],
      personal: { ...DEFAULT_PERSONAL },
      address: { ...DEFAULT_ADDRESS },
      documents: { ...DEFAULT_DOCUMENTS },
    };
  }

  private saveDraft(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(this.formData));
      }
    } catch {
      // Ignore
    }
  }

  private loadSubmittedApps(): SubmittedApplicationRecord[] {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(APPS_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      }
    } catch {
      // Ignore
    }
    return [...INITIAL_SUBMITTED_APPS];
  }

  private persistSubmittedApps(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(this.submittedApps));
      }
    } catch {
      // Ignore
    }
  }

  public getSnapshot = (): number => this.version;

  public subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private notify(): void {
    this.version += 1;
    this.saveDraft();
    this.persistSubmittedApps();
    this.listeners.forEach((l) => l());
  }

  public getStep = () => this.currentStep;
  public getFormData = () => this.formData;
  public getSubmittedApps = () => this.submittedApps;
  public getActiveTrackRecord = () => this.activeTrackRecord;
  public getSubmitting = () => this.isSubmitting;
  public getError = () => this.error;

  public setStep(step: number): void {
    this.currentStep = Math.max(1, Math.min(4, step));
    this.notify();
  }

  public setSelectedPost(post: MembershipCategoryOption): void {
    this.formData.selectedPost = post;
    this.notify();
  }

  public updatePersonal(fields: Partial<PersonalInfoForm>): void {
    this.formData.personal = { ...this.formData.personal, ...fields };
    this.notify();
  }

  public updateAddress(fields: Partial<AddressInfoForm>): void {
    this.formData.address = { ...this.formData.address, ...fields };
    this.notify();
  }

  public updateDocuments(fields: Partial<DocumentsInfoForm>): void {
    this.formData.documents = { ...this.formData.documents, ...fields };
    this.notify();
  }

  public resetDraft(): void {
    this.currentStep = 1;
    this.formData = {
      selectedPost: MEMBERSHIP_CATEGORIES[0],
      personal: { ...DEFAULT_PERSONAL },
      address: { ...DEFAULT_ADDRESS },
      documents: { ...DEFAULT_DOCUMENTS },
    };
    this.notify();
  }

  /**
   * Submits application to API (or local simulation fallback)
   */
  public async submitApplication(receiptDetails?: PaymentReceiptDetails): Promise<{ success: boolean; applicationId: string; message?: string }> {
    this.isSubmitting = true;
    this.error = null;
    this.notify();

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedAppId = `HRSJM-APP-${new Date().getFullYear()}-${randomSuffix}`;
    const finalAppId = receiptDetails?.applicationId || generatedAppId;

    try {
      try {
        await membershipApplicationService.submitApplication(this.formData);
      } catch {
        // Fallback for offline/local simulation
      }

      const newRecord: SubmittedApplicationRecord = {
        applicationId: finalAppId,
        postName: this.formData.selectedPost.postName,
        categoryFee: receiptDetails ? receiptDetails.amount : this.formData.selectedPost.feeAmount,
        validity: this.formData.selectedPost.validity,
        fullName: receiptDetails?.donorName || this.formData.personal.fullName,
        phone: receiptDetails?.donorMobile || this.formData.personal.mobileNumber,
        email: receiptDetails?.donorEmail || this.formData.personal.email,
        submittedAt: receiptDetails?.paidAt || new Date().toISOString(),
        status: 'APPLIED',
        currentStage: 1,
        reviewerRemarks: receiptDetails
          ? `Application registered via verified Cashfree PG (Order: ${receiptDetails.orderId}). Queued for scrutiny.`
          : 'Application submitted successfully. Queued for document inspection.',
        assignedChapter: this.formData.address.proposedChapter,
        documents: {
          photo: { name: this.formData.personal.photoFileName || 'photo.jpg', status: 'PENDING', url: this.formData.personal.photoUrl },
          idProof: { name: this.formData.documents.idProofFileName || 'id_proof.pdf', type: this.formData.documents.idProofType.toUpperCase(), status: 'PENDING', url: this.formData.documents.idProofFileUrl },
          signature: { name: this.formData.documents.signatureFileName || 'signature.png', status: 'PENDING', url: this.formData.documents.signatureFileUrl },
        },
        paymentStatus: receiptDetails ? 'PAID' : 'PENDING',
        paymentOrderId: receiptDetails?.orderId,
        paymentTransactionId: receiptDetails?.transactionId,
        paymentReceipt: receiptDetails,
      };

      this.submittedApps.unshift(newRecord);
      this.activeTrackRecord = newRecord;
      this.currentStep = 4; // Complete
      this.isSubmitting = false;
      this.notify();

      return { success: true, applicationId: finalAppId };
    } catch (err: any) {
      this.isSubmitting = false;
      this.error = err?.message || 'Failed to submit application';
      this.notify();
      return { success: false, applicationId: '', message: this.error || undefined };
    }
  }

  /**
   * Searches and sets active application tracking record
   */
  public trackApplication(query: string): boolean {
    const q = query.trim().toLowerCase();
    if (!q) return false;

    // Trigger backend query to sync live database status
    this.trackApplicationBackend(query).catch(() => {});

    const found = this.submittedApps.find(
      (app) =>
        app.applicationId.toLowerCase().includes(q) ||
        app.phone.replace(/\D/g, '').includes(q) ||
        app.email.toLowerCase().includes(q)
    );

    if (found) {
      this.activeTrackRecord = found;
      this.notify();
      return true;
    }
    return false;
  }

  public async trackApplicationBackend(query: string): Promise<boolean> {
    const q = query.trim();
    if (!q) return false;
    try {
      const res = await apiClient.get<any>(`/memberships?search=${encodeURIComponent(q)}`);
      const items = res?.items || res?.data?.items || (Array.isArray(res) ? res : []);
      if (Array.isArray(items) && items.length > 0) {
        const item = items[0];
        const appData = item.application_data || {};
        const personal = appData.personal_details || {};
        const rawStatus = (item.status || '').toUpperCase();
        let status: ApplicationStatus = 'APPLIED';
        let currentStage = 1;
        if (rawStatus === 'ACTIVE' || rawStatus === 'APPROVED') {
          status = 'APPROVED';
          currentStage = 4;
        } else if (rawStatus === 'REJECTED') {
          status = 'REJECTED';
          currentStage = 2;
        } else if (rawStatus === 'UNDER_REVIEW') {
          status = 'UNDER_REVIEW';
          currentStage = 2;
        }

        const backendRecord: SubmittedApplicationRecord = {
          applicationId: item.membership_number || item.id,
          postName: item.category?.name || appData.appliedPostName || 'Membership',
          categoryFee: item.payment?.amount || item.amount || 800,
          validity: '1 Year',
          fullName: item.user?.full_name || personal.full_name || 'Applicant',
          phone: item.user?.mobile_number || personal.mobile_number || '—',
          email: item.user?.email || personal.email || '—',
          submittedAt: item.applied_at || item.created_at || new Date().toISOString(),
          status,
          currentStage,
          reviewerRemarks: item.admin_notes || item.rejection_reason || undefined,
          assignedChapter: 'National Directorate',
          documents: {
            photo: { name: 'Passport Photo', status: 'VERIFIED' },
            idProof: { name: 'Identity Proof', type: 'Official ID', status: 'VERIFIED' },
            signature: { name: 'Signature', status: 'VERIFIED' },
          },
          generatedMemberId: item.membership_number,
          paymentStatus: 'PAID',
        };

        this.activeTrackRecord = backendRecord;
        this.notify();
        return true;
      }
    } catch {
      // Ignore network errors in tracking
    }
    return false;
  }

  public setActiveTrackRecord(record: SubmittedApplicationRecord | null): void {
    this.activeTrackRecord = record;
    this.notify();
  }

  /**
   * Re-uploads a flagged document
   */
  public reuploadDocument(applicationId: string, docType: 'photo' | 'idProof' | 'signature', fileName: string, fileUrl?: string): void {
    const idx = this.submittedApps.findIndex((a) => a.applicationId === applicationId);
    if (idx !== -1) {
      const app = this.submittedApps[idx];
      if (docType === 'idProof') {
        app.documents.idProof = {
          name: fileName,
          type: 'REUPLOAD',
          status: 'PENDING',
          url: fileUrl,
        };
      } else {
        app.documents[docType] = {
          name: fileName,
          status: 'PENDING',
          url: fileUrl,
        };
      }
      app.status = 'UNDER_REVIEW';
      app.reviewerRemarks = 'Document re-uploaded. Sent back to queue for re-verification.';
      this.activeTrackRecord = { ...app };
      this.notify();
    }
  }
}

export const membershipApplyStore = new MembershipApplyStore();

export const useMembershipApply = () => {
  useSyncExternalStore(membershipApplyStore.subscribe, membershipApplyStore.getSnapshot, membershipApplyStore.getSnapshot);

  return {
    currentStep: membershipApplyStore.getStep(),
    formData: membershipApplyStore.getFormData(),
    submittedApps: membershipApplyStore.getSubmittedApps(),
    activeTrackRecord: membershipApplyStore.getActiveTrackRecord(),
    isSubmitting: membershipApplyStore.getSubmitting(),
    error: membershipApplyStore.getError(),
    setStep: (s: number) => membershipApplyStore.setStep(s),
    setSelectedPost: (p: MembershipCategoryOption) => membershipApplyStore.setSelectedPost(p),
    updatePersonal: (f: Partial<PersonalInfoForm>) => membershipApplyStore.updatePersonal(f),
    updateAddress: (f: Partial<AddressInfoForm>) => membershipApplyStore.updateAddress(f),
    updateDocuments: (f: Partial<DocumentsInfoForm>) => membershipApplyStore.updateDocuments(f),
    resetDraft: () => membershipApplyStore.resetDraft(),
    submitApplication: (receiptDetails?: PaymentReceiptDetails) => membershipApplyStore.submitApplication(receiptDetails),
    trackApplication: (q: string) => membershipApplyStore.trackApplication(q),
    setActiveTrackRecord: (r: SubmittedApplicationRecord | null) => membershipApplyStore.setActiveTrackRecord(r),
    reuploadDocument: (appId: string, docType: 'photo' | 'idProof' | 'signature', fileName: string, fileUrl?: string) =>
      membershipApplyStore.reuploadDocument(appId, docType, fileName, fileUrl),
  };
};
