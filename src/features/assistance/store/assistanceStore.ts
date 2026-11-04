import type {
  AssistanceRequest,
  AssistanceStatus,
  AssistanceSummaryStats,
  CreateAssistanceRequestPayload,
  AssistanceDocumentItem,
} from '../types/assistance.types';
import { INITIAL_ASSISTANCE_SEEDS } from '../data/assistanceFixtures';
import { assistanceService } from '../services/assistanceService';

const STORAGE_KEY = 'hrsjm_local_assistance_v1';

class AssistanceStore {
  private requests: AssistanceRequest[] = [];
  private listeners: Set<() => void> = new Set();
  private version = 0;

  constructor() {
    this.requests = this.loadPersisted();
    this.sortInternal();
  }

  private sortInternal(): void {
    this.requests.sort((a, b) => {
      const timeA = new Date(a.created_at || 0).getTime() || 0;
      const timeB = new Date(b.created_at || 0).getTime() || 0;
      return timeB - timeA;
    });
  }

  private loadPersisted(): AssistanceRequest[] {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      }
    } catch {
      // Fallback
    }
    return [...INITIAL_ASSISTANCE_SEEDS];
  }

  private persist(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.requests));
      }
    } catch {
      // Ignore quota errors
    }
  }

  private notify(): void {
    this.version += 1;
    this.persist();
    this.listeners.forEach((l) => l());
  }

  public subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  public getSnapshot = (): { requests: AssistanceRequest[]; version: number } => {
    return {
      requests: this.requests,
      version: this.version,
    };
  };

  public getAllRequests(): AssistanceRequest[] {
    return [...this.requests];
  }

  public getById(id: string): AssistanceRequest | undefined {
    return this.requests.find((r) => r.id === id);
  }

  public getStats(): AssistanceSummaryStats {
    let underReview = 0;
    let approved = 0;
    let rejected = 0;
    let closed = 0;
    let totalAmount = 0;

    for (const r of this.requests) {
      if (r.status === 'UNDER_REVIEW' || r.status === 'PENDING') {
        underReview++;
      } else if (r.status === 'APPROVED') {
        approved++;
        totalAmount += Number(r.raised_amount || r.requested_amount || 0);
      } else if (r.status === 'REJECTED') {
        rejected++;
      } else if (r.status === 'CLOSED') {
        closed++;
        totalAmount += Number(r.raised_amount || r.requested_amount || 0);
      }
    }

    return {
      total: this.requests.length,
      underReview,
      approved,
      rejected,
      closed,
      totalAmount,
    };
  }

  public async fetchRequests(): Promise<void> {
    try {
      const res = await assistanceService.list({ limit: 100 });
      const remoteItems = res.items;
      if (Array.isArray(remoteItems) && remoteItems.length > 0) {
        const localMap = new Map<string, AssistanceRequest>();
        this.requests.forEach((r) => localMap.set(r.id, r));

        remoteItems.forEach((remote) => {
          const existing = localMap.get(remote.id);
          if (existing) {
            localMap.set(remote.id, {
              ...existing,
              ...remote,
              documents: existing.documents && existing.documents.length > 0 ? existing.documents : remote.documents,
            });
          } else {
            localMap.set(remote.id, remote);
          }
        });

        this.requests = Array.from(localMap.values());
        this.sortInternal();
        this.notify();
      }
    } catch {
      // In offline / dev mode, retain local store items
    }
  }

  public async createRequest(payload: CreateAssistanceRequestPayload): Promise<AssistanceRequest> {
    const newId = `ast-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const docs: AssistanceDocumentItem[] = (payload.documents || []).map((d, idx) => ({
      id: `doc-ast-${Date.now()}-${idx + 1}`,
      document_name: d.document_name,
      document_type: 'Supporting Document',
      original_file_name: d.file_name,
      mime_type: d.mime_type || 'application/pdf',
      file_size: d.file_size || '1.2 MB',
      description: 'Uploaded during registration',
      created_at: nowIso.split('T')[0],
      verified: false,
    }));

    const newRequest: AssistanceRequest = {
      id: newId,
      user_id: payload.user_id || `usr-${Math.floor(1000 + Math.random() * 9000)}`,
      full_name: payload.full_name.trim(),
      mobile: payload.mobile.trim(),
      email: payload.email?.trim() || null,
      requested_amount: Number(payload.requested_amount) || 0,
      raised_amount: 0,
      donor_count: 0,
      reason: payload.reason || 'Medical Emergency',
      description: payload.description || null,
      status: payload.status || 'UNDER_REVIEW',
      admin_remark: payload.admin_remark || null,
      reviewed_at: payload.status === 'APPROVED' ? nowIso : null,
      created_at: nowIso,
      updated_at: nowIso,
      age: payload.age,
      city: payload.city,
      state: payload.state,
      urgency: payload.urgency || 'NORMAL',
      documents: docs,
    };

    this.requests = [newRequest, ...this.requests];
    this.notify();

    // Call backend API asynchronously
    try {
      const res = await assistanceService.create(payload);
      if (res?.id && res.id !== newRequest.id) {
        newRequest.id = res.id;
        this.notify();
      }
    } catch {
      // Retain local copy
    }

    return newRequest;
  }

  public async updateStatus(
    id: string,
    newStatus: AssistanceStatus,
    adminRemark?: string
  ): Promise<boolean> {
    const idx = this.requests.findIndex((r) => r.id === id);
    if (idx === -1) return false;

    const current = this.requests[idx];
    const nowIso = new Date().toISOString();

    this.requests[idx] = {
      ...current,
      status: newStatus,
      admin_remark: adminRemark !== undefined ? adminRemark : current.admin_remark,
      reviewed_at: nowIso,
      updated_at: nowIso,
    };
    this.notify();

    try {
      await assistanceService.updateStatus(id, {
        status: newStatus,
        admin_remark: adminRemark,
      });
    } catch {
      // Local fallback handled
    }

    return true;
  }

  public toggleDocumentVerified(requestId: string, docId: string): void {
    const req = this.requests.find((r) => r.id === requestId);
    if (!req || !req.documents) return;

    const doc = req.documents.find((d) => d.id === docId);
    if (doc) {
      doc.verified = !doc.verified;
      this.notify();
    }
  }

  public resetToFixtures(): void {
    this.requests = [...INITIAL_ASSISTANCE_SEEDS];
    this.sortInternal();
    this.notify();
  }
}

export const assistanceStore = new AssistanceStore();

