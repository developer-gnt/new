import type {
  MembershipApplicationItem,
  ApplicationStatsData,
  ApplicationStatus,
  ApplicationFilterOptions,
} from '../types/applications.types';
import { applicationsService } from '../services/applicationsService';

const STORAGE_KEY = 'hrsjm_local_membership_applications';

export function mapBackendToApplicationItem(backend: any): MembershipApplicationItem {
  const appData = backend.application_data || {};
  const personal = appData.personal_details || {};
  const user = backend.user || {};

  const name =
    personal.full_name?.trim() ||
    appData.full_name?.trim() ||
    user.full_name?.trim() ||
    'Applicant';

  const phone =
    personal.mobile_number?.trim() ||
    appData.mobile_number?.trim() ||
    user.mobile_number?.trim() ||
    '—';

  const email =
    personal.email?.trim() ||
    appData.email?.trim() ||
    user.email?.trim() ||
    '—';

  const rawStatus = (backend.status || '').toUpperCase();
  let status: ApplicationStatus = 'submitted';
  if (rawStatus === 'ACTIVE' || rawStatus === 'APPROVED') {
    status = 'approved';
  } else if (
    rawStatus === 'REJECTED' ||
    rawStatus === 'CANCELLED' ||
    rawStatus === 'EXPIRED'
  ) {
    status = 'rejected';
  } else if (rawStatus === 'UNDER_REVIEW') {
    status = 'under_review';
  } else {
    status = 'submitted';
  }

  const rawDate = backend.applied_at || backend.created_at || new Date().toISOString();
  let submittedAt = '—';
  try {
    const d = new Date(rawDate);
    submittedAt =
      d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) +
      ', ' +
      d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
  } catch {
    submittedAt = String(rawDate);
  }

  const isSeekerApp =
    backend.membership_number?.startsWith('HRSJM-SEK') ||
    (backend.application_data as any)?.type === 'DONATION_SEEKER' ||
    backend.application_data?.membership_type === 'Donation Seeker';

  const addressParts = [
    personal.address_line1 || user.address_line1 || appData.address_line1,
    personal.address_line2 || user.address_line2 || appData.address_line2,
    personal.city || user.city || appData.city,
    personal.state || user.state || appData.state,
    personal.pincode || user.pincode || appData.pincode,
  ].filter(Boolean);

  const address =
    addressParts.join(', ') ||
    personal.address ||
    appData.address ||
    user.address ||
    undefined;

  const rawDocs = appData.documents || backend.documents || [];
  const documents = Array.isArray(rawDocs)
    ? rawDocs.map((d: any, idx: number) => ({
        id: d.id || `doc-${idx + 1}`,
        title: d.title || d.name || d.type || 'Identity / Verification Document',
        fileName: d.fileName || d.file_name || d.name || 'document.pdf',
        fileSize: d.fileSize || d.file_size || '1.5 MB',
        uploadDate: d.uploadDate || 'Recently',
        uri: d.url || d.file_url || d.uri || d.fileUri,
        verified: Boolean(d.verified),
      }))
    : [];

  return {
    id: backend.id,
    applicationId:
      backend.membership_number ||
      backend.application_data?.application_id ||
      `APP-${backend.id.substring(0, 8).toUpperCase()}`,
    applicantName: name,
    accountType: isSeekerApp ? 'seeker' : 'membership',
    membershipType:
      backend.application_data?.membership_type ||
      (isSeekerApp
        ? 'Donation Seeker'
        : backend.category?.name || 'Individual Membership'),
    avatarUrl: user.avatar || personal.avatar || undefined,
    status,
    submittedAt,
    submittedDate: rawDate,
    phone,
    email,
    gender: personal.gender || user.gender || undefined,
    dob: personal.dob || undefined,
    fatherName: personal.father_or_husband_name || undefined,
    address,
    policeStation: personal.police_station?.trim() || undefined,
    occupation: personal.occupation || user.occupation || undefined,
    amount: backend.payment?.amount || backend.amount || 800,
    paymentStatus: isSeekerApp ? 'EXEMPT' : 'PAID',
    documents,
    activityLog: [
      {
        id: `log-${backend.id}`,
        title: status === 'approved' ? 'Application Approved' : 'Application Submitted',
        description:
          status === 'approved'
            ? 'Application verified and approved by Administrator.'
            : 'Application submitted successfully for review.',
        timestamp: submittedAt,
        status,
      },
    ],
  };
}

export function mapAssistanceRequestToApplicationItem(item: any): MembershipApplicationItem {
  const rawStatus = (item.status || '').toUpperCase();
  let status: ApplicationStatus = 'submitted';
  if (rawStatus === 'ACTIVE' || rawStatus === 'APPROVED') {
    status = 'approved';
  } else if (rawStatus === 'REJECTED' || rawStatus === 'CLOSED' || rawStatus === 'CANCELLED') {
    status = 'rejected';
  } else if (rawStatus === 'UNDER_REVIEW') {
    status = 'under_review';
  } else {
    status = 'submitted';
  }

  const rawDate = item.created_at || new Date().toISOString();
  let submittedAt = '—';
  try {
    const d = new Date(rawDate);
    submittedAt =
      d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) +
      ', ' +
      d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
  } catch {
    submittedAt = String(rawDate);
  }

  const user = item.user || {};
  const appId =
    item.application_number ||
    `HRSJM-SEK-${(item.id || '').replace(/-/g, '').slice(0, 6).toUpperCase()}`;

  const rawDocs = item.documents || [];
  const documents = Array.isArray(rawDocs)
    ? rawDocs.map((d: any, idx: number) => ({
        id: d.id || `doc-ast-${idx + 1}`,
        title: d.document_name || d.title || 'Verification Document',
        fileName: d.file_name || d.fileName || 'document.pdf',
        fileSize: d.fileSize || '1.2 MB',
        uploadDate: 'Recently',
        uri: d.storage_path ? `/uploads/${d.file_name}` : d.uri,
        verified: Boolean(d.verified),
      }))
    : [];

  return {
    id: item.id,
    applicationId: appId,
    applicantName: item.full_name?.trim() || user.full_name?.trim() || 'Donation Seeker Applicant',
    accountType: 'seeker',
    membershipType: item.reason ? `Donation Seeker (${item.reason})` : 'Donation Seeker',
    status,
    submittedAt,
    submittedDate: rawDate,
    phone: item.mobile?.trim() || user.mobile_number?.trim() || undefined,
    email: item.email?.trim() || user.email?.trim() || undefined,
    address: user.address_line1 || user.city || user.state || undefined,
    amount: item.amount || item.requested_amount || undefined,
    paymentStatus: 'EXEMPT',
    documents,
    activityLog: [
      {
        id: `log-${item.id}`,
        title: 'Donation Seeker Application Submitted',
        description: item.description || item.reason || 'Assistance request submitted online.',
        timestamp: submittedAt,
        status,
      },
    ],
  };
}

class ApplicationsStore {
  private applications: MembershipApplicationItem[] = [];
  private listeners: Set<() => void> = new Set();
  private version = 0;

  constructor() {
    this.applications = this.loadPersisted();
    this.sortInternal();
  }

  private sortInternal(): void {
    this.applications.sort((a, b) => {
      const timeA = new Date(a.submittedDate || 0).getTime() || 0;
      const timeB = new Date(b.submittedDate || 0).getTime() || 0;
      return timeB - timeA;
    });
  }

  private loadPersisted(): MembershipApplicationItem[] {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      }
    } catch {
      // Ignore storage errors
    }
    return [];
  }

  private persist(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.applications));
      }
    } catch {
      // Ignore storage errors
    }
  }

  public getSnapshot = (): number => {
    return this.version;
  };

  public subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private notify(): void {
    this.version += 1;
    this.persist();
    this.listeners.forEach(l => l());
  }

  public getAllApplications(): MembershipApplicationItem[] {
    return [...this.applications];
  }

  public getApplicationById(id: string): MembershipApplicationItem | undefined {
    if (!id) return undefined;
    const clean = id.trim();
    return this.applications.find(
      a =>
        a.id === clean ||
        a.applicationId === clean ||
        a.id.toLowerCase() === clean.toLowerCase() ||
        a.applicationId.toLowerCase() === clean.toLowerCase()
    );
  }

  public getStats(): ApplicationStatsData {
    let underReview = 0;
    let approved = 0;
    let rejected = 0;

    for (const app of this.applications) {
      if (app.status === 'under_review' || app.status === 'submitted') underReview++;
      else if (app.status === 'approved') approved++;
      else if (app.status === 'rejected') rejected++;
    }

    return {
      total: this.applications.length,
      underReview,
      approved,
      rejected,
    };
  }

  public getFilteredApplications(filters?: ApplicationFilterOptions): MembershipApplicationItem[] {
    let result = [...this.applications];

    if (!filters) {
      return result;
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      result = result.filter(a => a.status === filters.status);
    }

    // Account Type filter
    if (filters.type && filters.type !== 'all') {
      result = result.filter(a => a.accountType === filters.type);
    }

    // Search query
    if (filters.searchQuery?.trim()) {
      const q = filters.searchQuery.trim().toLowerCase();
      result = result.filter(
        a =>
          a.applicantName.toLowerCase().includes(q) ||
          a.applicationId.toLowerCase().includes(q) ||
          (a.phone && a.phone.includes(q)) ||
          (a.email && a.email.toLowerCase().includes(q)) ||
          a.membershipType.toLowerCase().includes(q)
      );
    }

    // Sort Order
    const sortBy = filters.sortBy || 'newest';
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        const timeA = new Date(a.submittedDate || 0).getTime() || 0;
        const timeB = new Date(b.submittedDate || 0).getTime() || 0;
        return timeB - timeA;
      }
      if (sortBy === 'oldest') {
        const timeA = new Date(a.submittedDate || 0).getTime() || 0;
        const timeB = new Date(b.submittedDate || 0).getTime() || 0;
        return timeA - timeB;
      }
      if (sortBy === 'name_asc') {
        return a.applicantName.localeCompare(b.applicantName);
      }
      return 0;
    });

    return result;
  }

  public async fetchApplications(): Promise<MembershipApplicationItem[]> {
    try {
      const [membershipsRes, assistanceRes] = await Promise.allSettled([
        applicationsService.listMemberships({ limit: 100 }),
        applicationsService.listAssistanceRequests({ limit: 100 }),
      ]);

      const mapped: MembershipApplicationItem[] = [];

      if (membershipsRes.status === 'fulfilled') {
        const raw = membershipsRes.value;
        const items = Array.isArray(raw?.items)
          ? raw.items
          : Array.isArray(raw?.data?.items)
          ? raw.data.items
          : Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw)
          ? raw
          : [];
        mapped.push(...items.map(mapBackendToApplicationItem));
      }

      if (assistanceRes.status === 'fulfilled') {
        const raw = assistanceRes.value;
        const aItems = Array.isArray(raw?.items)
          ? raw.items
          : Array.isArray(raw?.data?.items)
          ? raw.data.items
          : Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw)
          ? raw
          : [];
        mapped.push(...aItems.map(mapAssistanceRequestToApplicationItem));
      }

      if (membershipsRes.status === 'fulfilled' || assistanceRes.status === 'fulfilled') {
        this.applications = mapped;
        this.sortInternal();
        this.notify();
      }
    } catch {
      // Gracefully maintain offline/fixtures state
    }
    return this.getAllApplications();
  }

  public async updateStatus(
    id: string,
    newStatus: ApplicationStatus,
    notes?: string
  ): Promise<boolean> {
    const idx = this.applications.findIndex(
      a => a.id === id || a.applicationId === id
    );
    if (idx === -1) return false;

    const current = this.applications[idx];
    if (current.status === newStatus) return true;

    const nowStr =
      new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) +
      ', ' +
      new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

    const statusTitleMap: Record<ApplicationStatus, string> = {
      submitted: 'Application Submitted',
      under_review: 'Under Review',
      approved: 'Application Approved',
      rejected: 'Application Rejected',
    };

    const statusDescMap: Record<ApplicationStatus, string> = {
      submitted: 'Application submitted online.',
      under_review: 'Application marked under review for document verification.',
      approved: 'Application verified and approved by Administrator.',
      rejected: notes ? `Rejected: ${notes}` : 'Application status marked as rejected.',
    };

    const newLogItem = {
      id: `log-${Date.now()}`,
      title: statusTitleMap[newStatus],
      description: statusDescMap[newStatus],
      timestamp: nowStr,
      status: newStatus,
    };

    this.applications[idx] = {
      ...current,
      status: newStatus,
      rejectionReason: newStatus === 'rejected' ? notes || 'Incomplete documents' : undefined,
      paymentStatus: newStatus === 'approved' ? 'PAID' : current.paymentStatus,
      activityLog: [newLogItem, ...(current.activityLog || [])],
    };

    this.notify();

    // Call backend
    const isSeeker = current.accountType === 'seeker';
    const backendStatus =
      newStatus === 'approved'
        ? (isSeeker ? 'APPROVED' : 'APPROVED')
        : newStatus === 'rejected'
        ? 'REJECTED'
        : newStatus === 'under_review'
        ? 'UNDER_REVIEW'
        : 'PENDING';

    try {
      if (isSeeker) {
        await applicationsService.updateAssistanceStatus(current.id, backendStatus, notes);
      } else {
        await applicationsService.updateMembershipStatus(
          current.id,
          backendStatus,
          newStatus === 'rejected' ? notes || 'Incomplete documents' : undefined,
          notes
        );
      }
      // Re-fetch in background to synchronize any backend-generated IDs or transitions
      this.fetchApplications().catch(() => {});
    } catch (err) {
      console.error('Failed to update application status on backend:', err);
      // Revert optimistic update
      this.applications[idx] = current;
      this.notify();
      throw err;
    }

    return true;
  }
}

export const applicationsStore = new ApplicationsStore();

