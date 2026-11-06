import { useSyncExternalStore } from 'react';
import type {
  AssistanceRequest,
  CreateAssistancePayload,
  CreateSupportTicketPayload,
  SeekerNotification,
  SupportTicket,
} from '../types/seeker.types';
import { seekerService } from '../services/seekerService';

interface SeekerStoreState {
  requests: AssistanceRequest[];
  tickets: SupportTicket[];
  notifications: SeekerNotification[];
  loading: boolean;
  version: number;
}

class SeekerStore {
  private requests: AssistanceRequest[] = [];
  private tickets: SupportTicket[] = [];
  private notifications: SeekerNotification[] = [];
  private loading = false;
  private listeners: Set<() => void> = new Set();
  private version = 0;
  private cachedSnapshot: SeekerStoreState;

  constructor() {
    this.requests = seekerService.getLocalRequests();
    this.tickets = seekerService.getLocalTickets();
    this.notifications = seekerService.getNotifications(this.requests);
    this.cachedSnapshot = this.buildSnapshot();
  }

  private buildSnapshot(): SeekerStoreState {
    return {
      requests: this.requests,
      tickets: this.tickets,
      notifications: this.notifications,
      loading: this.loading,
      version: this.version,
    };
  }

  private notify(): void {
    this.version += 1;
    this.cachedSnapshot = this.buildSnapshot();
    this.listeners.forEach((l) => l());
  }

  public subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  public getSnapshot = (): SeekerStoreState => {
    return this.cachedSnapshot;
  };

  public async loadAll(): Promise<void> {
    this.loading = true;
    this.notify();
    try {
      const [reqs, tkts] = await Promise.all([
        seekerService.getMyRequests(),
        seekerService.getMyTickets(),
      ]);
      this.requests = Array.isArray(reqs) ? reqs : seekerService.getLocalRequests();
      this.tickets = Array.isArray(tkts) ? tkts : seekerService.getLocalTickets();
      this.notifications = seekerService.getNotifications(this.requests);
    } catch {
      // Keep cached
    } finally {
      this.loading = false;
      this.notify();
    }
  }

  public async createRequest(payload: CreateAssistancePayload): Promise<AssistanceRequest> {
    this.loading = true;
    this.notify();
    try {
      const created = await seekerService.createRequest(payload);
      this.requests = [created, ...this.requests.filter((r) => r.id !== created.id)];
      this.notifications = seekerService.getNotifications(this.requests);
      return created;
    } finally {
      this.loading = false;
      this.notify();
    }
  }

  public async createTicket(payload: CreateSupportTicketPayload): Promise<SupportTicket> {
    const created = await seekerService.createTicket(payload);
    this.tickets = [created, ...this.tickets.filter((t) => t.id !== created.id)];
    this.notify();
    return created;
  }

  public async addTicketMessage(ticketId: string, message: string): Promise<void> {
    await seekerService.addTicketMessage(ticketId, message);
    const updated = await seekerService.getMyTickets();
    this.tickets = updated;
    this.notify();
  }
}

export const seekerStore = new SeekerStore();

const storeActions = {
  loadAll: () => seekerStore.loadAll(),
  createRequest: (payload: CreateAssistancePayload) => seekerStore.createRequest(payload),
  createTicket: (payload: CreateSupportTicketPayload) => seekerStore.createTicket(payload),
  addTicketMessage: (ticketId: string, message: string) => seekerStore.addTicketMessage(ticketId, message),
};

export function useSeekerStore(): SeekerStoreState & typeof storeActions {
  const snapshot = useSyncExternalStore(seekerStore.subscribe, seekerStore.getSnapshot);

  return {
    ...snapshot,
    ...storeActions,
  };
}

