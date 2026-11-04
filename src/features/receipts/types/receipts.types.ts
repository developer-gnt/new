/**
 * Types for Income (Receipts) Module
 * Exact parity with APK: hrsjm-application-ui/src/features/admin/receipts/types/receipts.types.ts
 * and backend: HRSJM-back-api/src/modules/receipt-entries/
 */

export type PaymentMethod =
  | 'CASH'
  | 'BANK_TRANSFER'
  | 'UPI'
  | 'CHEQUE'
  | 'CARD'
  | 'OTHER';

export type VoucherStatus = 'POSTED' | 'CANCELLED';

export type ReceiptOriginCategory =
  | 'CAUSE_DONATION'
  | 'NGO_DONATION'
  | 'GENERAL_DONATION'
  | 'NEW_MEMBERSHIP'
  | 'MEMBERSHIP_PAYMENT'
  | 'RENEW_MEMBERSHIP'
  | 'RENEWAL_PAYMENT'
  | 'OTHER_INCOME';

export type IncomeSourceKey = 'WEBSITE' | 'WEB_APP' | 'APPLICATION';

export interface IncomeAccountInfo {
  id: string;
  account_name: string;
  account_code: string | null;
}

export interface ReceivedInAccountInfo {
  id: string;
  account_name: string;
  account_code: string | null;
}

export interface AccountingEntrySummary {
  id: string;
  entry_number: string;
  entry_date: string;
  reference_type?: string | null;
  reference_id?: string | null;
  narration?: string | null;
  is_reversed?: boolean;
  lines?: Array<{
    id: string;
    account: {
      id: string;
      account_name: string;
      account_code: string | null;
    } | null;
    debit?: number;
    credit?: number;
    debit_amount?: number;
    credit_amount?: number;
  }> | null;
}

/** Item of GET /receipt-entries (joins income_account + received_in_account). */
export interface ReceiptEntryItem {
  id: string;
  voucher_number: string;
  receipt_date: string;
  received_from: string;
  income_account_id: string;
  received_in_account_id?: string;
  amount: number;
  payment_method: PaymentMethod;
  reference_number: string | null;
  description: string | null;
  attachment_url: string | null;
  status: VoucherStatus;
  cancellation_reason?: string | null;
  accounting_entry_id: string | null;
  created_at: string;
  updated_at: string;
  income_account?: IncomeAccountInfo | null;
  received_in_account?: ReceivedInAccountInfo | null;
  accounting_entry?: AccountingEntrySummary | null;
}

export interface ReceiptEntryDetail extends ReceiptEntryItem {}

/** POST /receipt-entries body — exactly backend CreateReceiptEntryDto. */
export interface CreateReceiptPayload {
  receipt_date: string;
  received_from: string;
  income_account_id: string;
  received_in_account_id?: string;
  amount: number;
  payment_method: PaymentMethod;
  reference_number?: string;
  description?: string;
}

/** PATCH /receipt-entries/:id body — exactly backend UpdateReceiptEntryDto. */
export interface UpdateReceiptPayload {
  receipt_date?: string;
  received_from?: string;
  income_account_id?: string;
  received_in_account_id?: string;
  amount?: number;
  payment_method?: PaymentMethod;
  reference_number?: string;
  description?: string;
  attachment_url?: string;
}

export interface ReceiptStatsSummary {
  all: number;
  allAmount: number;
  ngoDonations: number;
  ngoAmount: number;
  causeDonations: number;
  causeAmount: number;
  membership: number;
  membershipAmount: number;
  renewals: number;
  renewalsAmount: number;
  membershipAndRenewals: number;
  membershipAndRenewalsAmount: number;
  otherIncome: number;
  otherAmount: number;
  cancelled: number;
  cancelledAmount: number;
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  UPI: 'UPI / Online / Cashfree',
  BANK_TRANSFER: 'Bank Transfer (IMPS/NEFT)',
  CASH: 'Cash in Hand',
  CHEQUE: 'Cheque / DD',
  CARD: 'Debit / Credit Card',
  OTHER: 'Other Payment Method',
};

export function formatINR(amount: number | string | null | undefined): string {
  const numeric = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
  if (isNaN(numeric) || numeric === null || numeric === undefined) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
}
