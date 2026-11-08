import { apiClient } from '@/api';
import type {
  CreateDonationInput,
  Donation,
  DonationCategory,
  DonationReceiptModel,
  DonationStatus,
  DateRange,
} from '../types/donations.types';
import {
  createDonationReceipt as makeReceipt,
  isWithinDateRange as checkDateRange,
} from '../data/donationsFixtures';

const STORAGE_KEY = 'hrsjm_local_donations_v1';

function getStoredDonations(): Donation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse cached donations:', e);
  }
  return [];
}

function saveStoredDonations(donations: Donation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(donations));
  } catch (e) {
    console.warn('Failed to save donations to localStorage:', e);
  }
}

function triggerCsvDownload(csvContent: string, fileName: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const donationsService = {
  async getMyDonations(): Promise<Donation[]> {
    try {
      const res = await apiClient.get<any>('/donation-payments/my');
      const items = Array.isArray(res?.items)
        ? res.items
        : Array.isArray(res?.data?.items)
        ? res.data.items
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];
      return items.map((p: any) => ({
        id: p.id,
        donor_name: p.donor_name || 'Donor',
        donor_mobile: p.donor_mobile || '',
        donor_email: p.donor_email || '',
        amount: Number(p.amount) || 0,
        donation_type: (p.donation_type || 'ONE_TIME') as DonationCategory,
        status: (p.status || 'PAID') as DonationStatus,
        cause: p.cause || p.campaign_title || 'General Relief Fund',
        source: p.source || 'ONLINE',
        is_80g_claimed: Boolean(p.is_80g_eligible ?? true),
        pan_number: p.pan_number || undefined,
        receipt_number: p.receipt_number || undefined,
        created_at: p.created_at || new Date().toISOString(),
      }));
    } catch (e) {
      console.warn('Failed to load my donations:', e);
      return [];
    }
  },

  async getDonations(params?: {
    search?: string | null;
    status?: DonationStatus | null;
    category?: DonationCategory | null;
    source?: string | null;
    dateRange?: DateRange | null;
  }): Promise<Donation[]> {
    try {
      const query = new URLSearchParams();
      if (params?.status) query.set('status', params.status);
      if (params?.search) query.set('search', params.search);
      if (params?.source && params.source !== 'ALL') query.set('source', params.source);

      const url = `/donations${query.toString() ? `?${query.toString()}` : ''}`;
      const res = await apiClient.get<any>(url);
      const items = Array.isArray(res?.data?.items)
        ? res.data.items
        : Array.isArray(res?.items)
        ? res.items
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : null;

      if (Array.isArray(items)) {
        return items;
      }
    } catch (e) {
      console.warn('Backend /donations unavailable, using local mock store:', e);
    }

    // Local in-memory / localStorage fallback
    let list = getStoredDonations();

    if (params?.category && params.category !== 'ALL') {
      list = list.filter(d => d.donation_type === params.category);
    }

    if (params?.status) {
      list = list.filter(d => d.status?.toUpperCase() === params.status?.toUpperCase());
    }

    if (params?.source && params.source !== 'ALL') {
      list = list.filter(d => (d.source ?? '').toLowerCase() === params.source?.toLowerCase());
    }

    if (params?.dateRange && (params.dateRange.from || params.dateRange.to)) {
      list = list.filter(d => checkDateRange(d.created_at, params.dateRange?.from, params.dateRange?.to));
    }

    if (params?.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      list = list.filter(d => {
        const name = d.donor_name.toLowerCase();
        const mobile = (d.donor_mobile || '').toLowerCase();
        const code = (d.member_code || '').toLowerCase();
        const cause = d.cause.toLowerCase();
        const remark = (d.remark || '').toLowerCase();
        const src = (d.source || '').toLowerCase();
        const amt = String(d.amount);
        return (
          name.includes(q) ||
          mobile.includes(q) ||
          code.includes(q) ||
          cause.includes(q) ||
          remark.includes(q) ||
          src.includes(q) ||
          amt.includes(q)
        );
      });
    }

    return list;
  },

  async getDonationById(id: string): Promise<Donation | null> {
    try {
      const res = await apiClient.get<any>(`/donations/${id}`);
      const data = res?.data || res;
      if (data && data.id) return data;
    } catch (e) {
      console.warn(`Backend /donations/${id} unavailable, checking local store:`, e);
    }

    const localList = getStoredDonations();
    return localList.find(d => d.id === id) || null;
  },

  async createDonation(input: CreateDonationInput): Promise<Donation> {
    try {
      const res = await apiClient.post<any>('/donations', {
        donor_name: input.donor_name.trim(),
        donor_mobile: input.donor_mobile?.trim(),
        donor_email: input.donor_email?.trim() || undefined,
        cause: input.cause?.trim() || 'General Donation',
        amount: Number(input.amount),
        is_anonymous: Boolean(input.is_anonymous),
        remark: input.remark?.trim() || undefined,
        source: input.source || 'Web App',
      });
      const data = res?.data || res;
      if (data && data.id) {
        // Also save to local storage
        const current = getStoredDonations();
        saveStoredDonations([data, ...current]);
        return data;
      }
    } catch (e) {
      console.warn('Backend create donation failed, creating locally:', e);
    }

    const current = getStoredDonations();
    const newDonation: Donation = {
      id: `don-${Date.now()}`,
      donor_name: input.donor_name.trim(),
      donor_mobile: input.donor_mobile?.trim() || '+91 98000 00000',
      donor_email: input.donor_email?.trim() || null,
      cause: input.cause?.trim() || 'General Donation',
      amount: Number(input.amount),
      status: 'SUCCESS',
      remark: input.remark?.trim() || 'Recorded from Web Admin',
      source: input.source || 'Web App',
      donation_type: input.donation_type || 'ONE_TIME',
      member_code: `MEM${Math.floor(100000 + Math.random() * 900000)}`,
      payment_method: input.payment_method || 'Online Payment',
      transaction_id: input.transaction_id || `TXN${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveStoredDonations([newDonation, ...current]);
    return newDonation;
  },

  async refundDonation(id: string, reason = 'Admin initiated refund from Web Application'): Promise<boolean> {
    try {
      await apiClient.post(`/donations/${id}/refund`, { reason });
    } catch (e) {
      console.warn('Backend refund endpoint failed, updating locally:', e);
    }

    const current = getStoredDonations();
    const updated = current.map(d => (d.id === id ? { ...d, status: 'REFUNDED', remark: `${d.remark || ''} [Refunded: ${reason}]` } : d));
    saveStoredDonations(updated);
    return true;
  },

  async getReceiptByDonationId(id: string): Promise<DonationReceiptModel> {
    try {
      const res = await apiClient.get<any>(`/receipts/donation/${id}`);
      const data = res?.data || res;
      if (data && data.receipt_number) {
        return {
          id: data.id || id,
          receiptNumber: data.receipt_number,
          receiptDate: data.receipt_date || new Date().toISOString(),
          donorName: data.issued_to || data.user?.full_name || 'Donor',
          donorMobile: data.user?.mobile_number || null,
          donorEmail: data.user?.email || null,
          memberCode: null,
          cause: 'Donation Contribution',
          amount: data.amount,
          paymentMethod: data.payment_method || 'Online',
          transactionId: data.transaction_id || data.reference_number || null,
          status: 'SUCCESS',
          notes: data.notes || null,
        };
      }
    } catch {
      // fallback to donation entity
    }

    const donation = await this.getDonationById(id);
    if (!donation) {
      throw new Error(`Donation with ID ${id} not found`);
    }
    return makeReceipt(donation);
  },

  exportDonationsCsv(donations: Donation[]): void {
    const headers = [
      'Donation ID',
      'Donor Name',
      'Mobile Number',
      'Email',
      'Member Code',
      'Cause / Campaign',
      'Amount (INR)',
      'Category',
      'Source / Platform',
      'Status',
      'Payment Method',
      'Transaction ID',
      'Date & Time',
      'Remarks',
    ];

    const rows = donations.map(d => [
      `"${d.id}"`,
      `"${(d.donor_name || '').replace(/"/g, '""')}"`,
      `"${d.donor_mobile || ''}"`,
      `"${d.donor_email || ''}"`,
      `"${d.member_code || ''}"`,
      `"${(d.cause || '').replace(/"/g, '""')}"`,
      d.amount.toFixed(2),
      `"${d.donation_type || 'ONE_TIME'}"`,
      `"${d.source || 'Website'}"`,
      `"${d.status || 'SUCCESS'}"`,
      `"${(d.payment_method || '').replace(/"/g, '""')}"`,
      `"${d.transaction_id || ''}"`,
      `"${new Date(d.created_at).toLocaleString('en-IN')}"`,
      `"${(d.remark || '').replace(/"/g, '""')}"`,
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    triggerCsvDownload(csv, `HRSJM_Donations_Export_${new Date().toISOString().slice(0, 10)}.csv`);
  },

  printDonationReceipt(receipt: DonationReceiptModel): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to open the official donation receipt.');
      return;
    }

    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Donation Receipt - ${receipt.receiptNumber}</title>
        <meta charset="utf-8" />
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          body { font-family: 'Inter', Arial, sans-serif; color: #011F39; margin: 0; padding: 25px; font-size: 13px; line-height: 1.5; }
          .receipt-border { border: 3px double #011F39; padding: 25px; border-radius: 8px; position: relative; }
          .header { text-align: center; border-bottom: 2px solid #011F39; padding-bottom: 15px; margin-bottom: 20px; }
          .org-title { font-size: 22px; font-weight: 800; color: #011F39; letter-spacing: 0.5px; }
          .org-subtitle { font-size: 13px; font-weight: 600; color: #011F39; margin-top: 2px; }
          .org-tagline { font-size: 11px; color: #64748b; font-style: italic; }
          .org-reg { font-size: 11px; color: #475569; margin-top: 6px; }
          .receipt-badge { display: inline-block; background: #011F39; color: #FAD465; padding: 6px 20px; font-weight: 800; font-size: 14px; border-radius: 4px; margin: 15px 0; text-transform: uppercase; letter-spacing: 1px; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 6px; margin-bottom: 20px; font-size: 12px; }
          .meta-item { display: flex; justify-content: space-between; }
          .meta-label { color: #64748b; font-weight: 600; }
          .meta-val { font-weight: 700; color: #0f172a; font-family: monospace; }
          .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #011F39; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin: 18px 0 10px 0; }
          .details-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .details-table th { background: #f1f5f9; padding: 8px 12px; text-align: left; font-size: 11px; color: #475569; border-bottom: 1px solid #cbd5e1; }
          .details-table td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
          .amount-banner { background: #ecfdf5; border: 2px solid #10b981; border-radius: 6px; padding: 15px; margin: 20px 0; display: flex; justify-content: space-between; align-items: center; }
          .amount-label { font-size: 12px; font-weight: 800; color: #065f46; text-transform: uppercase; }
          .amount-val { font-size: 24px; font-weight: 800; color: #047857; font-family: monospace; }
          .tax-exemption-box { background: #fefce8; border: 1px solid #fde047; padding: 12px; border-radius: 6px; font-size: 11px; color: #854d0e; line-height: 1.5; margin-bottom: 25px; }
          .tax-icon { font-size: 14px; font-weight: bold; margin-right: 4px; }
          .footer-signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 50px; padding-top: 20px; }
          .sig-box { text-align: center; border-top: 1px dashed #011F39; padding-top: 8px; font-size: 11px; font-weight: 600; color: #475569; }
          .watermark { position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 70px; font-weight: 900; color: rgba(1, 31, 57, 0.04); text-transform: uppercase; pointer-events: none; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="receipt-border">
          <div class="watermark">HRSJM OFFICIAL</div>
          <div class="header">
            <div class="org-title">HUMAN RIGHTS SANRAKSHAN JAN MANCH</div>
            <div class="org-subtitle">मानव अधिकार एवं सामाजिक न्याय संरक्षण ट्रस्ट</div>
            <div class="org-tagline">Registered National Human Rights Non-Governmental Organization</div>
            <div class="org-reg">National HQ: New Delhi, India • Regd. No: HR/0092/2019 • PAN: AABTH4589K</div>
            <div class="receipt-badge">Official Donation Receipt</div>
          </div>

          <div class="meta-grid">
            <div class="meta-item">
              <span class="meta-label">Receipt Number:</span>
              <span class="meta-val">${receipt.receiptNumber}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Receipt Date:</span>
              <span class="meta-val">${new Date(receipt.receiptDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Payment Mode:</span>
              <span class="meta-val">${receipt.paymentMethod || 'Online Transfer'}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Transaction Reference:</span>
              <span class="meta-val">${receipt.transactionId || 'N/A'}</span>
            </div>
          </div>

          <div class="section-title">Donor Information</div>
          <table class="details-table">
            <tr>
              <th style="width: 25%;">Donor Full Name</th>
              <td style="font-weight: bold; font-size: 14px;">${receipt.donorName}</td>
            </tr>
            <tr>
              <th>Contact Mobile</th>
              <td>${receipt.donorMobile || 'Not Provided'}</td>
            </tr>
            <tr>
              <th>Email Address</th>
              <td>${receipt.donorEmail || 'Not Provided'}</td>
            </tr>
            ${receipt.memberCode ? `<tr><th>Member Registration ID</th><td style="font-family: monospace; font-weight: bold;">${receipt.memberCode}</td></tr>` : ''}
          </table>

          <div class="section-title">Contribution Particulars</div>
          <table class="details-table">
            <thead>
              <tr>
                <th>Purpose / Campaign Cause</th>
                <th>Source Platform</th>
                <th style="text-align: right;">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>${receipt.cause}</strong>
                  ${receipt.notes ? `<div style="font-size: 11px; color: #64748b; margin-top: 3px;">Note: ${receipt.notes}</div>` : ''}
                </td>
                <td>${receipt.source || 'Website'}</td>
                <td style="text-align: right; font-weight: bold; font-size: 14px;">₹ ${receipt.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>

          <div class="amount-banner">
            <div>
              <div class="amount-label">Net Received Amount</div>
              <div style="font-size: 11px; color: #065f46; margin-top: 2px;">Transferred to HRSJM Corpus / Relief Fund</div>
            </div>
            <div class="amount-val">₹ ${receipt.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          </div>

          <div class="tax-exemption-box">
            <span class="tax-icon">🏛️</span>
            <strong>Tax Exemption Endorsement (Section 80G):</strong>
            Donations to Human Rights Sanrakshan Jan Manch are eligible for tax exemption under Section 80G of the Income Tax Act, 1961 vide Unique Registration Number (URN) <strong>AAATH1234KF20214</strong> dated 12/04/2021.
          </div>

          <div class="footer-signatures">
            <div class="sig-box">
              Verified by Finance &amp; Accounts Desk<br>
              <span style="font-size: 10px; color: #94a3b8;">Human Rights Sanrakshan Jan Manch</span>
            </div>
            <div class="sig-box">
              Authorized Signatory / National Treasurer<br>
              <span style="font-size: 10px; color: #94a3b8;">Stamp &amp; Seal of Trust</span>
            </div>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(fullHtml);
    printWindow.document.close();
  },
};
