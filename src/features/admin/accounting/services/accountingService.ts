import type {
  AccountItem,
  CreateAccountPayload,
  UpdateAccountPayload,
  JournalEntryItem,
  CreateJournalPayload,
  LedgerTransaction,
  LedgerSummary,
  AccountCategory,
} from '../types/accounting.types';
import {
  INITIAL_ACCOUNTS,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_LEDGER_TRANSACTIONS,
} from '../data/accountingFixtures';
import { apiClient } from '@/api/client';

const ACCOUNTS_STORAGE_KEY = 'hrsjm_local_accounts_v1';
const JOURNALS_STORAGE_KEY = 'hrsjm_local_journals_v1';
const LEDGER_STORAGE_KEY = 'hrsjm_local_ledger_v1';

function getStoredAccounts(): AccountItem[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse cached accounts:', e);
  }
  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(INITIAL_ACCOUNTS));
  return INITIAL_ACCOUNTS;
}

function saveStoredAccounts(accounts: AccountItem[]): void {
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.warn('Failed to save accounts to localStorage:', e);
  }
}

function getStoredJournals(): JournalEntryItem[] {
  try {
    const raw = localStorage.getItem(JOURNALS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse cached journals:', e);
  }
  localStorage.setItem(JOURNALS_STORAGE_KEY, JSON.stringify(INITIAL_JOURNAL_ENTRIES));
  return INITIAL_JOURNAL_ENTRIES;
}

function saveStoredJournals(journals: JournalEntryItem[]): void {
  try {
    localStorage.setItem(JOURNALS_STORAGE_KEY, JSON.stringify(journals));
  } catch (e) {
    console.warn('Failed to save journals to localStorage:', e);
  }
}

function getStoredLedger(): LedgerTransaction[] {
  try {
    const raw = localStorage.getItem(LEDGER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse cached ledger:', e);
  }
  localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(INITIAL_LEDGER_TRANSACTIONS));
  return INITIAL_LEDGER_TRANSACTIONS;
}

function saveStoredLedger(ledger: LedgerTransaction[]): void {
  try {
    localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(ledger));
  } catch (e) {
    console.warn('Failed to save ledger to localStorage:', e);
  }
}

export const accountingService = {
  // ================= Chart of Accounts =================
  async listAccounts(category?: AccountCategory): Promise<AccountItem[]> {
    try {
      const res = await apiClient.get<any>('/accounts', {
        params: category && category !== 'ALL' ? { account_type: category } : undefined,
      });
      const items = Array.isArray(res) ? res : res?.items || res?.data?.items || res?.data;
      if (Array.isArray(items)) return items;
    } catch {
      // Offline fallback
    }

    const all = getStoredAccounts();
    if (!category || category === 'ALL') return all;
    return all.filter((a) => a.account_type === category);
  },

  async getAccountById(id: string): Promise<AccountItem | null> {
    try {
      const data = await apiClient.get<AccountItem>(`/accounts/${id}`);
      if (data && data.id) return data;
    } catch {
      // Offline fallback
    }

    const all = getStoredAccounts();
    return all.find((a) => a.id === id) || null;
  },

  async createAccount(payload: CreateAccountPayload): Promise<AccountItem> {
    try {
      const created = await apiClient.post<AccountItem>('/accounts', payload);
      if (created && created.id) {
        const all = getStoredAccounts();
        all.push(created);
        saveStoredAccounts(all);
        return created;
      }
    } catch {
      // Offline fallback
    }

    const all = getStoredAccounts();
    const newId = `acc-${payload.account_type.toLowerCase().slice(0, 3)}-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const newAcc: AccountItem = {
      id: newId,
      account_code: payload.account_code || String(1000 + all.length),
      account_name: payload.account_name,
      account_type: payload.account_type,
      parent_account_id: payload.parent_account_id || null,
      description: payload.description || null,
      is_active: true,
      balance: 0,
      created_at: nowIso,
      updated_at: nowIso,
    };

    all.push(newAcc);
    saveStoredAccounts(all);
    return newAcc;
  },

  async updateAccount(id: string, payload: UpdateAccountPayload): Promise<AccountItem> {
    try {
      const updated = await apiClient.patch<AccountItem>(`/accounts/${id}`, payload);
      if (updated && updated.id) {
        const all = getStoredAccounts();
        const idx = all.findIndex((a) => a.id === id);
        if (idx !== -1) {
          all[idx] = updated;
          saveStoredAccounts(all);
        }
        return updated;
      }
    } catch {
      // Offline fallback
    }

    const all = getStoredAccounts();
    const idx = all.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Account not found');

    all[idx] = {
      ...all[idx],
      account_name: payload.account_name ?? all[idx].account_name,
      account_code: payload.account_code ?? all[idx].account_code,
      parent_account_id: payload.parent_account_id ?? all[idx].parent_account_id,
      description: payload.description ?? all[idx].description,
      updated_at: new Date().toISOString(),
    };

    saveStoredAccounts(all);
    return all[idx];
  },

  async updateAccountStatus(id: string, is_active: boolean): Promise<AccountItem> {
    try {
      const updated = await apiClient.patch<AccountItem>(`/accounts/${id}/status`, { is_active });
      if (updated && updated.id) {
        const all = getStoredAccounts();
        const idx = all.findIndex((a) => a.id === id);
        if (idx !== -1) {
          all[idx] = updated;
          saveStoredAccounts(all);
        }
        return updated;
      }
    } catch {
      // Offline fallback
    }

    const all = getStoredAccounts();
    const idx = all.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Account not found');

    all[idx].is_active = is_active;
    all[idx].updated_at = new Date().toISOString();
    saveStoredAccounts(all);
    return all[idx];
  },

  // ================= Journal Entries =================
  async listEntries(params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: JournalEntryItem[]; total: number }> {
    try {
      const queryParams: Record<string, string | number> = {};
      if (params?.status && params.status !== 'ALL') queryParams.status = params.status;
      if (params?.search) queryParams.search = params.search;
      if (params?.page) queryParams.page = params.page;
      if (params?.limit) queryParams.limit = params.limit;

      const res = await apiClient.get<any>('/accounting/entries', {
        params: queryParams,
      });

      if (res && Array.isArray(res.items)) {
        return { items: res.items, total: res.total || res.items.length };
      } else if (Array.isArray(res)) {
        return { items: res, total: res.length };
      }
    } catch {
      // Offline fallback
    }

    const all = getStoredJournals();
    let filtered = [...all];

    if (params?.status === 'POSTED') {
      filtered = filtered.filter((j) => !j.is_reversed);
    } else if (params?.status === 'REVERSED') {
      filtered = filtered.filter((j) => j.is_reversed || j.entry_type === 'REVERSAL');
    }

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(
        (j) =>
          j.entry_number.toLowerCase().includes(q) ||
          (j.narration || '').toLowerCase().includes(q)
      );
    }

    return { items: filtered, total: filtered.length };
  },

  async getEntryById(id: string): Promise<JournalEntryItem | null> {
    try {
      const data = await apiClient.get<JournalEntryItem>(`/accounting/entries/${id}`);
      if (data && data.id) return data;
    } catch {
      // Offline fallback
    }

    const all = getStoredJournals();
    return all.find((j) => j.id === id) || null;
  },

  async createEntry(payload: CreateJournalPayload): Promise<JournalEntryItem> {
    const all = getStoredJournals();
    const accounts = getStoredAccounts();
    const seq = all.length + 1;
    const entryNumber = `JV-2026-${String(seq).padStart(4, '0')}`;
    const newId = `je-local-${Date.now()}`;
    const nowIso = new Date().toISOString();

    let totalDebit = 0;
    let totalCredit = 0;

    const lines = payload.lines.map((l, i) => {
      const acc = accounts.find((a) => a.id === l.account_id);
      totalDebit += Number(l.debit) || 0;
      totalCredit += Number(l.credit) || 0;
      return {
        id: `jel-${newId}-${i + 1}`,
        account_id: l.account_id,
        account: acc
          ? {
              id: acc.id,
              account_name: acc.account_name,
              account_code: acc.account_code,
              account_type: acc.account_type,
            }
          : null,
        debit: Number(l.debit) || 0,
        credit: Number(l.credit) || 0,
        narration: l.narration,
      };
    });

    const newEntry: JournalEntryItem = {
      id: newId,
      entry_number: entryNumber,
      entry_date: payload.entry_date,
      entry_type: 'STANDARD',
      narration: payload.narration,
      is_reversed: false,
      total_debit: totalDebit,
      total_credit: totalCredit,
      lines,
      created_at: nowIso,
    };

    all.unshift(newEntry);
    saveStoredJournals(all);

    // Also append corresponding transactions to ledger
    const ledger = getStoredLedger();
    lines.forEach((line) => {
      if (line.account) {
        const isDebit = (line.debit || 0) > 0;
        const currentBal = ledger.length > 0 ? ledger[0].running_balance : 500000;
        const newBal = isDebit ? currentBal + (line.debit || 0) : currentBal - (line.credit || 0);

        ledger.unshift({
          id: `ltx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          entry_id: newId,
          entry_number: entryNumber,
          entry_date: payload.entry_date,
          entry_type: 'STANDARD',
          account_id: line.account.id,
          account_name: line.account.account_name,
          account_code: line.account.account_code,
          account_type: line.account.account_type || 'ASSET',
          reference_type: 'JOURNAL_VOUCHER',
          reference_id: newId,
          narration: line.narration || payload.narration,
          debit: line.debit || 0,
          credit: line.credit || 0,
          running_balance: newBal,
          category_tag: 'RECEIPT',
        });
      }
    });
    saveStoredLedger(ledger);

    return newEntry;
  },

  async reverseEntry(id: string, reason: string): Promise<JournalEntryItem> {
    try {
      const data = await apiClient.post<JournalEntryItem>(`/accounting/entries/${id}/reverse`, { reason });
      if (data && data.id) return data;
    } catch {
      // Offline fallback
    }

    const all = getStoredJournals();
    const idx = all.findIndex((j) => j.id === id);
    if (idx === -1) throw new Error('Journal entry not found');

    const original = all[idx];
    original.is_reversed = true;
    original.reversal_reason = reason;

    // Create opposite reversal journal entry
    const seq = all.length + 1;
    const reversalNumber = `JV-2026-${String(seq).padStart(4, '0')}`;
    const reversalId = `je-rev-${Date.now()}`;

    const reversedLines = (original.lines || []).map((l, i) => ({
      id: `jel-${reversalId}-${i + 1}`,
      account_id: l.account_id,
      account: l.account,
      debit: l.credit || 0, // Swapped
      credit: l.debit || 0, // Swapped
      narration: `Reversal of line in ${original.entry_number}`,
    }));

    const reversalEntry: JournalEntryItem = {
      id: reversalId,
      entry_number: reversalNumber,
      entry_date: new Date().toISOString().slice(0, 10),
      entry_type: 'REVERSAL',
      narration: `[REVERSED] Correction of ${original.entry_number}: ${reason}`,
      is_reversed: false,
      reversal_entry_id: original.id,
      reversal_reason: reason,
      total_debit: original.total_credit,
      total_credit: original.total_debit,
      lines: reversedLines,
      created_at: new Date().toISOString(),
    };

    all.unshift(reversalEntry);
    saveStoredJournals(all);

    return original;
  },

  // ================= General Ledger & Passbook =================
  async getGlobalLedger(params?: {
    from_date?: string;
    to_date?: string;
    search?: string;
  }): Promise<{
    transactions: LedgerTransaction[];
    summary: LedgerSummary;
  }> {
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      const queryParams: Record<string, string> = {
        from_date: params?.from_date || `${currentYear}-01-01`,
        to_date: params?.to_date || now.toISOString().slice(0, 10),
      };
      if (params?.search) queryParams.search = params.search;

      const remote = await apiClient.get<any>(
        '/accounting/ledger',
        { params: queryParams }
      );
      if (remote) {
        const transactions = Array.isArray(remote.items) ? remote.items : Array.isArray(remote.transactions) ? remote.transactions : [];
        if (Array.isArray(transactions)) {
          return {
            transactions,
            summary: remote.summary || {
              opening_balance: 0,
              total_debit: 0,
              total_credit: 0,
              closing_balance: 0,
              net_change: 0,
            },
          };
        }
      }
    } catch {
      // Offline fallback
    }

    const ledger = getStoredLedger();
    let filtered = [...ledger];

    if (params?.from_date) {
      filtered = filtered.filter((t) => t.entry_date >= params.from_date!);
    }
    if (params?.to_date) {
      filtered = filtered.filter((t) => t.entry_date <= params.to_date!);
    }
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(
        (t) =>
          t.entry_number.toLowerCase().includes(q) ||
          (t.narration || '').toLowerCase().includes(q) ||
          t.account_name.toLowerCase().includes(q) ||
          (t.received_from || '').toLowerCase().includes(q) ||
          (t.paid_to || '').toLowerCase().includes(q)
      );
    }

    let totalDebit = 0;
    let totalCredit = 0;
    filtered.forEach((t) => {
      totalDebit += Number(t.debit) || 0;
      totalCredit += Number(t.credit) || 0;
    });

    const closingBal = filtered.length > 0 ? filtered[0].running_balance : 500000;
    const openingBal = closingBal - totalDebit + totalCredit;

    return {
      transactions: filtered,
      summary: {
        opening_balance: openingBal,
        total_debit: totalDebit,
        total_credit: totalCredit,
        closing_balance: closingBal,
        net_change: totalDebit - totalCredit,
      },
    };
  },

  async getAccountLedger(
    accountId: string,
    params?: { from_date?: string; to_date?: string }
  ): Promise<{
    account: AccountItem | null;
    transactions: LedgerTransaction[];
    summary: LedgerSummary;
  }> {
    try {
      const queryParams: Record<string, string> = {};
      if (params?.from_date) queryParams.from_date = params.from_date;
      if (params?.to_date) queryParams.to_date = params.to_date;

      const remote = await apiClient.get<{
        account: AccountItem | null;
        transactions: LedgerTransaction[];
        summary: LedgerSummary;
      }>(`/accounts/${accountId}/ledger`, { params: queryParams });
      if (remote && Array.isArray(remote.transactions)) {
        return remote;
      }
    } catch {
      // Offline fallback
    }

    const accounts = getStoredAccounts();
    const account = accounts.find((a) => a.id === accountId) || null;
    const ledger = getStoredLedger();

    let filtered = ledger.filter((t) => t.account_id === accountId);
    if (params?.from_date) {
      filtered = filtered.filter((t) => t.entry_date >= params.from_date!);
    }
    if (params?.to_date) {
      filtered = filtered.filter((t) => t.entry_date <= params.to_date!);
    }

    let totalDebit = 0;
    let totalCredit = 0;
    filtered.forEach((t) => {
      totalDebit += Number(t.debit) || 0;
      totalCredit += Number(t.credit) || 0;
    });

    const closingBal = account?.balance || 0;
    const openingBal = closingBal - totalDebit + totalCredit;

    return {
      account,
      transactions: filtered,
      summary: {
        opening_balance: openingBal,
        total_debit: totalDebit,
        total_credit: totalCredit,
        closing_balance: closingBal,
        net_change: totalDebit - totalCredit,
      },
    };
  },
};
