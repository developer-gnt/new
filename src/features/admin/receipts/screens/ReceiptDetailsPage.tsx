import type React from 'react';
import { useState, useSyncExternalStore, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  Ban,
  FileText,
  Heart,
  User,
  RotateCcw,
  AlertTriangle,
  Landmark,
  ShieldCheck,
  Calendar,
  CreditCard,
  ExternalLink,
} from 'lucide-react';
import { receiptsStore } from '../store/receiptsStore';
import {
  classifyReceipt,
  formatPaymentMethodBadge,
  formatVoucherStatusBadge,
} from '../utils/receiptClassification';
import { formatINR } from '../types/receipts.types';
import { ReceiptCancelModal } from '../components/ReceiptCancelModal';

export const ReceiptDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const storeSnapshot = useSyncExternalStore(
    receiptsStore.subscribe,
    receiptsStore.getSnapshot
  );

  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  // Derive voucher reactively from store
  const voucher = id ? storeSnapshot.vouchers.find((v) => v.id === id) || null : null;

  useEffect(() => {
    if (!voucher) {
      receiptsStore.fetchVouchers();
    }
  }, [voucher]);

  if (!voucher) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', color: '#011F39' }}>Receipt Voucher Not Found</h2>
        <p style={{ color: '#6B7280', fontSize: '14px', margin: '8px 0 20px 0' }}>
          The requested receipt voucher could not be located or may have been removed.
        </p>
        <button
          type="button"
          onClick={() => navigate('/admin/receipts')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            backgroundColor: '#011F39',
            color: '#FAD465',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Return to Receipts List
        </button>
      </div>
    );
  }

  const classified = classifyReceipt(voucher);
  const methodBadge = formatPaymentMethodBadge(voucher.payment_method);
  const statusBadge = formatVoucherStatusBadge(voucher.status);
  const isCancelled = voucher.status === 'CANCELLED';

  const handlePrint = () => {
    window.print();
  };

  const handleConfirmCancel = async (reason: string) => {
    if (!voucher) return;
    await receiptsStore.cancelVoucher(voucher.id, reason);
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Top Navigation & Actions Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
        className="no-print"
      >
        <button
          type="button"
          onClick={() => navigate('/admin/receipts')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            fontSize: '13.5px',
            fontWeight: 500,
            borderRadius: '8px',
            border: '1px solid #D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#374151',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Receipts</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={handlePrint}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 500,
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              backgroundColor: '#FFFFFF',
              color: '#374151',
              cursor: 'pointer',
            }}
          >
            <Printer size={15} />
            <span>Print Receipt Slip</span>
          </button>

          {!isCancelled && (
            <button
              type="button"
              onClick={() => setCancelModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '8px',
                border: '1px solid #FCA5A5',
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                cursor: 'pointer',
              }}
            >
              <Ban size={15} />
              <span>Void Voucher</span>
            </button>
          )}
        </div>
      </div>

      {/* Cancellation Notice Banner */}
      {isCancelled && (
        <div
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <AlertTriangle size={22} color="#DC2626" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#991B1B' }}>
              Voucher Voided / Cancelled
            </h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#B91C1C' }}>
              {voucher.cancellation_reason || 'This receipt voucher was cancelled and double-entry reversal entries have been posted to the general ledger.'}
            </p>
          </div>
        </div>
      )}

      {/* Official Voucher Slip Printable Container */}
      <div
        id="printable-receipt-slip"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        }}
      >
        {/* Slip Top Header with Org Branding */}
        <div
          style={{
            backgroundColor: '#011F39',
            padding: '24px 32px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={22} color="#FAD465" />
              <span
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#FAD465',
                  letterSpacing: '0.02em',
                }}
              >
                HUMAN RIGHTS SANRAKSHAN JYOTI MORCHA
              </span>
            </div>
            <p style={{ margin: '4px 0 0 30px', fontSize: '12px', color: '#93C5FD' }}>
              Regd. National Human Rights & Humanitarian Legal Advocacy Organization (Govt. of India)
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#93C5FD',
              }}
            >
              Official Receipt Slip
            </span>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '17px',
                fontWeight: 700,
                color: '#FFFFFF',
                marginTop: '2px',
              }}
            >
              {voucher.voucher_number}
            </div>
          </div>
        </div>

        {/* Voucher Main Metadata Bar */}
        <div
          style={{
            padding: '24px 32px',
            borderBottom: '1px solid #E5E7EB',
            backgroundColor: '#F9FAFB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '6px',
                  backgroundColor: classified.badgeBg,
                  color: classified.badgeColor,
                  border: `1px solid ${classified.badgeBorder}`,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {classified.categoryLabel}
              </span>

              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: '12px',
                  backgroundColor: classified.sourceBadgeBg,
                  color: classified.sourceBadgeColor,
                  border: `1px solid ${classified.sourceBadgeBorder}`,
                }}
              >
                {classified.sourceBadgeText}
              </span>

              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: '6px',
                  backgroundColor: statusBadge.bg,
                  color: statusBadge.color,
                  border: `1px solid ${statusBadge.border}`,
                }}
              >
                {statusBadge.label}
              </span>
            </div>

            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#4B5563' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={14} color="#6B7280" />
                <span>Date: <b>{voucher.receipt_date}</b></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CreditCard size={14} color="#6B7280" />
                <span>Payment: <b>{methodBadge.label}</b></span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Amount Credited
            </span>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: isCancelled ? '#9CA3AF' : '#059669',
                textDecoration: isCancelled ? 'line-through' : 'none',
                letterSpacing: '-0.02em',
              }}
            >
              {formatINR(voucher.amount)}
            </div>
          </div>
        </div>

        {/* Highlight Pill Banner (When Valid Cause or Member ID exists) */}
        {classified.sourceHighlightValue && (
          <div
            style={{
              padding: '14px 32px',
              backgroundColor: classified.sourceHighlightBg,
              borderBottom: `1px solid ${classified.sourceHighlightBorder}`,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {classified.sourceHighlightIcon === 'heart' && <Heart size={18} color={classified.sourceHighlightColor} />}
            {classified.sourceHighlightIcon === 'user' && <User size={18} color={classified.sourceHighlightColor} />}
            {classified.sourceHighlightIcon === 'rotate-cw' && <RotateCcw size={18} color={classified.sourceHighlightColor} />}
            {classified.sourceHighlightIcon === 'landmark' && <Landmark size={18} color={classified.sourceHighlightColor} />}
            <span style={{ fontSize: '13.5px', fontWeight: 600, color: classified.sourceHighlightColor }}>
              {classified.sourceHighlightLabel} {classified.sourceHighlightValue}
            </span>
          </div>
        )}

        {/* 2-Column Details Body */}
        <div style={{ padding: '28px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {/* Left Column: Contributor & Payer Info */}
          <div>
            <h4
              style={{
                margin: '0 0 16px 0',
                fontSize: '13px',
                fontWeight: 700,
                color: '#011F39',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderBottom: '1px solid #E5E7EB',
                paddingBottom: '8px',
              }}
            >
              Contributor / Payer Details
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>Received From:</span>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginTop: '2px' }}>
                  {classified.payerName || voucher.received_from}
                </div>
              </div>

              {classified.payerContact && (
                <div>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>Contact (Phone / Email):</span>
                  <div style={{ fontSize: '13.5px', fontWeight: 500, color: '#1F2937', marginTop: '2px' }}>
                    {classified.payerContact}
                  </div>
                </div>
              )}

              {classified.contributorType && (
                <div>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>Designation / Type:</span>
                  <div style={{ fontSize: '13.5px', fontWeight: 500, color: '#1F2937', marginTop: '2px' }}>
                    {classified.contributorType}
                  </div>
                </div>
              )}

              {voucher.reference_number && (
                <div>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>Payment Gateway / Ref Number:</span>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      fontFamily: 'monospace',
                      color: '#011F39',
                      marginTop: '2px',
                      backgroundColor: '#F3F4F6',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      display: 'inline-block',
                    }}
                  >
                    {voucher.reference_number}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Account Allocation & Classification */}
          <div>
            <h4
              style={{
                margin: '0 0 16px 0',
                fontSize: '13px',
                fontWeight: 700,
                color: '#011F39',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderBottom: '1px solid #E5E7EB',
                paddingBottom: '8px',
              }}
            >
              Account Allocation & Origin
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>Income Account (Credit):</span>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#011F39', marginTop: '2px' }}>
                  {voucher.income_account?.account_name || 'Donation Income'}
                  {voucher.income_account?.account_code && (
                    <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 400, marginLeft: '6px' }}>
                      (A/c #{voucher.income_account.account_code})
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>Received-In Account (Debit Asset):</span>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#011F39', marginTop: '2px' }}>
                  {voucher.received_in_account?.account_name || 'HDFC Bank - General Main A/c'}
                  {voucher.received_in_account?.account_code && (
                    <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 400, marginLeft: '6px' }}>
                      (A/c #{voucher.received_in_account.account_code})
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>Origin Channel:</span>
                <div style={{ fontSize: '13.5px', fontWeight: 500, color: '#1F2937', marginTop: '2px' }}>
                  {classified.sourceLabel}
                </div>
              </div>

              {voucher.description && (
                <div>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>Narration / Remarks:</span>
                  <div
                    style={{
                      fontSize: '12.5px',
                      color: '#4B5563',
                      marginTop: '2px',
                      lineHeight: '1.4',
                      backgroundColor: '#F9FAFB',
                      padding: '8px 10px',
                      borderRadius: '6px',
                    }}
                  >
                    {voucher.description}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Double-Entry Journal Lines Breakdown */}
        {voucher.accounting_entry && voucher.accounting_entry.lines && voucher.accounting_entry.lines.length > 0 && (
          <div style={{ borderTop: '1px solid #E5E7EB', padding: '24px 32px', backgroundColor: '#FAFAFA' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} color="#011F39" />
                <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#011F39', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Double-Entry Journal Postings ({voucher.accounting_entry.entry_number})
                </h4>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>
                  Date: {voucher.accounting_entry.entry_date}
                </span>
                <button
                  type="button"
                  onClick={() => navigate(`/admin/accounting?search=${voucher.voucher_number || voucher.id}`)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    color: '#011F39',
                    backgroundColor: '#EDF2F7',
                    border: '1px solid #DBE5EE',
                    cursor: 'pointer',
                  }}
                >
                  <span>View in General Ledger</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F3F4F6', borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, color: '#4B5563' }}>Account Code & Name</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, color: '#4B5563' }}>Type</th>
                  <th style={{ textAlign: 'right', padding: '8px 12px', fontWeight: 600, color: '#4B5563' }}>Debit (Dr.)</th>
                  <th style={{ textAlign: 'right', padding: '8px 12px', fontWeight: 600, color: '#4B5563' }}>Credit (Cr.)</th>
                </tr>
              </thead>
              <tbody>
                {voucher.accounting_entry.lines.map((line) => (
                  <tr key={line.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '8px 12px', color: '#111827', fontWeight: 500 }}>
                      {line.account?.account_name}
                      {line.account?.account_code && (
                        <span style={{ color: '#6B7280', fontSize: '11px', marginLeft: '6px' }}>
                          ({line.account.account_code})
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '8px 12px', color: '#6B7280' }}>
                      {Number(line.debit || line.debit_amount || 0) > 0 ? 'Asset (Received-In)' : 'Income Stream'}
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#011F39' }}>
                      {Number(line.debit || line.debit_amount || 0) > 0 ? formatINR(line.debit || line.debit_amount) : '—'}
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#059669' }}>
                      {Number(line.credit || line.credit_amount || 0) > 0 ? formatINR(line.credit || line.credit_amount) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Seal & Authorization Signature */}
        <div
          style={{
            borderTop: '1px solid #E5E7EB',
            padding: '24px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#6B7280',
          }}
        >
          <div>
            <div>System Generated Voucher Slip — Digitally Signed & Audited</div>
            <div style={{ marginTop: '2px' }}>HRSJM Central Accounting & Finance Department</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 600, color: '#111827' }}>Authorized Signatory</div>
            <div style={{ marginTop: '2px' }}>Human Rights Sanrakshan Jyoti Morcha</div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      <ReceiptCancelModal
        visible={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        voucher={voucher}
        onConfirmCancel={handleConfirmCancel}
      />
    </div>
  );
};
