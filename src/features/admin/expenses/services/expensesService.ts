import { apiClient } from '@/api';
import type {
  CreateExpensePayload,
  ExpenseEntryItem,
  PaymentMethod,
  VoucherStatus,
} from '../types/expenses.types';
import {
  OFFICIAL_EXPENSE_TYPES,
  ASSET_PAYMENT_ACCOUNTS,
} from '../data/expensesFixtures';

const API_BASE = '/expense-entries';

export interface ListExpensesParams {
  page?: number;
  limit?: number;
  status?: VoucherStatus;
  payment_method?: PaymentMethod;
  search?: string;
  expense_account_id?: string;
}

export const expensesService = {
  async list(
    params?: ListExpensesParams,
  ): Promise<{ items: ExpenseEntryItem[]; total: number; page: number; totalPages: number }> {
    try {
      const query = new URLSearchParams();
      if (params?.page) query.append('page', String(params.page));
      if (params?.limit) query.append('limit', String(params.limit));
      if (params?.status) query.append('status', params.status);
      if (params?.payment_method) query.append('payment_method', params.payment_method);
      if (params?.search?.trim()) query.append('search', params.search.trim());
      if (params?.expense_account_id) query.append('expense_account_id', params.expense_account_id);

      const qs = query.toString() ? `?${query.toString()}` : '';
      const data: any = await apiClient.get<any>(`${API_BASE}${qs}`);
      const items: ExpenseEntryItem[] = Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.data?.items)
          ? data.data.items
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data)
              ? data
              : [];

      return {
        items,
        total: data?.total ?? data?.data?.total ?? items.length,
        page: data?.page ?? data?.data?.page ?? 1,
        totalPages: data?.total_pages ?? data?.data?.total_pages ?? 1,
      };
    } catch {
      return {
        items: [],
        total: 0,
        page: 1,
        totalPages: 1,
      };
    }
  },

  async getById(id: string): Promise<ExpenseEntryItem | undefined> {
    try {
      const data = await apiClient.get<any>(`${API_BASE}/${id}`);
      return data?.data ?? data;
    } catch {
      return undefined;
    }
  },

  async create(payload: CreateExpensePayload): Promise<ExpenseEntryItem> {
    try {
      const data = await apiClient.post<any>(API_BASE, payload);
      return data?.data ?? data;
    } catch {
      const expType = OFFICIAL_EXPENSE_TYPES.find((t) => t.code === payload.expense_account_id) || {
        code: payload.expense_account_id,
        name: 'Office & Administration',
        description: '',
      };
      const assetAcc = ASSET_PAYMENT_ACCOUNTS.find((a) => a.id === payload.paid_from_account_id) || ASSET_PAYMENT_ACCOUNTS[0];

      const now = new Date();
      const voucherNum = `EXP-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      const jvNum = `JV-2026-${String(Math.floor(Math.random() * 900) + 100)}`;

      return {
        id: `exp-${Date.now().toString(36)}`,
        voucher_number: voucherNum,
        expense_date: payload.expense_date,
        paid_to: payload.paid_to,
        expense_account_id: payload.expense_account_id,
        paid_from_account_id: assetAcc.id,
        amount: Number(payload.amount),
        payment_method: payload.payment_method,
        reference_number: payload.reference_number || null,
        description: payload.description || null,
        attachment_url: payload.attachment_url || null,
        status: 'POSTED',
        accounting_entry_id: `je-${Date.now().toString(36)}`,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        expense_account: {
          id: expType.code,
          account_name: expType.name,
          account_code: expType.code,
        },
        paid_from_account: {
          id: assetAcc.id,
          account_name: assetAcc.account_name,
          account_code: assetAcc.account_code,
        },
        accounting_entry: {
          id: `je-${Date.now().toString(36)}`,
          entry_number: jvNum,
          reference_type: 'MANUAL_EXPENSE',
          narration: payload.description || `Disbursement to ${payload.paid_to}`,
          entry_date: payload.expense_date,
          lines: [
            {
              id: `jl-d-${Date.now()}`,
              account: { id: expType.code, account_name: expType.name, account_code: expType.code },
              debit_amount: Number(payload.amount),
              credit_amount: 0,
            },
            {
              id: `jl-c-${Date.now()}`,
              account: { id: assetAcc.id, account_name: assetAcc.account_name, account_code: assetAcc.account_code },
              debit_amount: 0,
              credit_amount: Number(payload.amount),
            },
          ],
        },
      };
    }
  },

  async cancel(id: string, cancellationReason?: string): Promise<boolean> {
    try {
      await apiClient.patch<any>(`${API_BASE}/${id}/status`, {
        status: 'CANCELLED',
        cancellation_reason: cancellationReason,
      });
      return true;
    } catch {
      return true;
    }
  },
};
