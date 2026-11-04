import type {
  CreateTicketBody,
  SupportTicket,
  SupportTicketMessage,
  TicketStatsData,
  TicketStatus,
} from '../types/support.types';
import { INITIAL_SUPPORT_MESSAGES, INITIAL_SUPPORT_TICKETS } from '../data/supportFixtures';
import { supportService } from '../services/supportService';

const STORAGE_KEY_TICKETS = 'hrsjm_local_support_tickets_v1';
const STORAGE_KEY_MESSAGES = 'hrsjm_local_support_messages_v1';

class SupportStore {
  private tickets: SupportTicket[] = [];
  private messagesByTicket: Record<string, SupportTicketMessage[]> = {};
  private listeners: Set<() => void> = new Set();
  private version = 0;
  private cachedSnapshot: {
    tickets: SupportTicket[];
    messagesByTicket: Record<string, SupportTicketMessage[]>;
    version: number;
  };

  constructor() {
    this.tickets = this.loadPersistedTickets();
    this.messagesByTicket = this.loadPersistedMessages();
    this.sortInternal();
    this.cachedSnapshot = {
      tickets: this.tickets,
      messagesByTicket: this.messagesByTicket,
      version: this.version,
    };
  }

  private sortInternal(): void {
    this.tickets.sort((a, b) => {
      const timeA = new Date(a.created_at || 0).getTime() || 0;
      const timeB = new Date(b.created_at || 0).getTime() || 0;
      return timeB - timeA;
    });
  }

  private loadPersistedTickets(): SupportTicket[] {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(STORAGE_KEY_TICKETS);
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
    return [...INITIAL_SUPPORT_TICKETS];
  }

  private loadPersistedMessages(): Record<string, SupportTicketMessage[]> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(STORAGE_KEY_MESSAGES);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            return parsed;
          }
        }
      }
    } catch {
      // Fallback
    }
    return { ...INITIAL_SUPPORT_MESSAGES };
  }

  private persist(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(this.tickets));
        window.localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(this.messagesByTicket));
      }
    } catch {
      // Ignore quota errors
    }
  }

  private notify(): void {
    this.version += 1;
    this.cachedSnapshot = {
      tickets: [...this.tickets],
      messagesByTicket: { ...this.messagesByTicket },
      version: this.version,
    };
    this.persist();
    this.listeners.forEach((l) => l());
  }

  public subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  public getSnapshot = (): {
    tickets: SupportTicket[];
    messagesByTicket: Record<string, SupportTicketMessage[]>;
    version: number;
  } => {
    return this.cachedSnapshot;
  };

  public getAllTickets(): SupportTicket[] {
    return [...this.tickets];
  }

  public getTicketById(id: string): SupportTicket | undefined {
    return this.tickets.find((t) => t.id === id);
  }

  public getMessagesForTicket(ticketId: string): SupportTicketMessage[] {
    return this.messagesByTicket[ticketId] ? [...this.messagesByTicket[ticketId]] : [];
  }

  public getStats(): TicketStatsData {
    let open = 0;
    let inProgress = 0;
    let resolved = 0;
    let closed = 0;

    for (const t of this.tickets) {
      if (t.status === 'SUBMITTED') open++;
      else if (t.status === 'UNDER_REVIEW') inProgress++;
      else if (t.status === 'RESOLVED') resolved++;
      else if (t.status === 'CLOSED') closed++;
    }

    return {
      total: this.tickets.length,
      open,
      inProgress,
      resolved,
      closed,
    };
  }

  public async fetchTickets(): Promise<void> {
    try {
      const res = await supportService.list({ limit: 100 });
      const items = res?.items || (Array.isArray(res) ? res : []);
      if (Array.isArray(items) && items.length > 0) {
        const localMap = new Map<string, SupportTicket>();
        this.tickets.forEach((t) => localMap.set(t.id, t));
        items.forEach((remote: SupportTicket) => {
          localMap.set(remote.id, {
            ...localMap.get(remote.id),
            ...remote,
          });
        });
        this.tickets = Array.from(localMap.values());
        this.sortInternal();
        this.notify();
      }
    } catch {
      // Offline fallback: use local fixtures
    }
  }

  public async createTicket(body: CreateTicketBody): Promise<SupportTicket> {
    let newTicket: SupportTicket;
    try {
      newTicket = await supportService.create(body);
    } catch {
      // Offline fallback creation
      const id = `tkt-${Date.now().toString(36)}`;
      newTicket = {
        id,
        user_id: 'usr-admin-current',
        user: {
          id: 'usr-admin-current',
          full_name: 'Administrator',
          email: 'admin@hrsjm.org',
          roles: ['ADMIN'],
        },
        subject: body.subject,
        description: body.description,
        status: 'SUBMITTED',
        category: body.category || 'General',
        priority: body.priority || 'NORMAL',
        source: body.source || 'web',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        documents: body.attachments || [],
      };
    }

    this.tickets.unshift(newTicket);
    this.sortInternal();
    this.notify();
    return newTicket;
  }

  public async updateStatus(
    id: string,
    status: TicketStatus,
    note?: string
  ): Promise<SupportTicket | undefined> {
    try {
      await supportService.updateStatus(id, { status, note });
    } catch {
      // Offline mock fallback
    }

    const index = this.tickets.findIndex((t) => t.id === id);
    if (index !== -1) {
      const existing = this.tickets[index];
      const updated: SupportTicket = {
        ...existing,
        status,
        resolution_note: note || existing.resolution_note,
        resolved_at: status === 'RESOLVED' ? new Date().toISOString() : existing.resolved_at,
        resolved_by: status === 'RESOLVED' || status === 'CLOSED' ? 'admin-001' : existing.resolved_by,
        resolved_by_user:
          status === 'RESOLVED' || status === 'CLOSED'
            ? { id: 'admin-001', full_name: 'Administrator', email: 'admin@hrsjm.org' }
            : existing.resolved_by_user,
        updated_at: new Date().toISOString(),
      };
      this.tickets[index] = updated;

      // Also add an audit system message in chat
      if (note) {
        this.appendLocalMessage(id, {
          id: `msg-${Date.now()}`,
          ticket_id: id,
          author_id: 'admin-001',
          author: { id: 'admin-001', full_name: 'Administrator · Admin', roles: ['ADMIN'] },
          body: `[Status Updated to ${status}]: ${note}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      this.notify();
      return updated;
    }
    return undefined;
  }

  public async addMessage(ticketId: string, bodyText: string): Promise<SupportTicketMessage> {
    let msg: SupportTicketMessage;
    try {
      msg = await supportService.addMessage(ticketId, { body: bodyText });
    } catch {
      // Offline mock fallback
      msg = {
        id: `msg-${Date.now()}`,
        ticket_id: ticketId,
        author_id: 'admin-001',
        author: {
          id: 'admin-001',
          full_name: 'Administrator · Support',
          email: 'admin@hrsjm.org',
          roles: ['ADMIN'],
        },
        body: bodyText,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    this.appendLocalMessage(ticketId, msg);
    return msg;
  }

  private appendLocalMessage(ticketId: string, msg: SupportTicketMessage): void {
    if (!this.messagesByTicket[ticketId]) {
      this.messagesByTicket[ticketId] = [];
    }
    this.messagesByTicket[ticketId].push(msg);
    this.notify();
  }
}

export const supportStore = new SupportStore();
