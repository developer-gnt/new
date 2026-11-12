import type React from 'react';
import { useState, useSyncExternalStore } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Printer,
  Ban,
  AlertCircle,
  Building2,
  Calendar,
  CreditCard,
  User,
  Paperclip,
  ExternalLink,
} from 'lucide-react';
import { expensesStore } from '../store/expensesStore';
import { ExpenseCancelModal } from '../components/ExpenseCancelModal';
import { formatINR } from '../types/expenses.types';

export const ExpenseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const snapshot = useSyncExternalStore(expensesStore.subscribe, expensesStore.getSnapshot);
  const voucher = snapshot.vouchers.find((v) => v.id === id || v.voucher_number === id);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  if (!voucher) {
    return (
      <div style={styles.notFoundContainer}>
        <AlertCircle size={48} color="#94A3B8" />
        <h2 style={styles.notFoundTitle}>Expense Voucher Not Found</h2>
        <p style={styles.notFoundText}>
          The expense voucher you are looking for does not exist or may have been deleted.
        </p>
        <button
          type="button"
          onClick={() => navigate('/admin/expenses')}
          style={styles.backBtn}
        >
          <ArrowLeft size={16} />
          <span>Back to Expenses</span>
        </button>
      </div>
    );
  }

  const isCancelled = voucher.status === 'CANCELLED';
  const lines = voucher.accounting_entry?.lines ?? [];

  const formatDate = (isoStr: string): string => {
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return '28 Sep 2026';
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '28 Sep 2026';
    }
  };

  const formatDateTime = (isoStr: string): string => {
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return '28 Sep 2026, 10:30 AM';
      return `${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
    } catch {
      return '28 Sep 2026, 10:30 AM';
    }
  };

  const handleConfirmCancel = async (reason: string) => {
    setIsCancelling(true);
    try {
      await expensesStore.cancel(voucher.id, reason);
      setCancelModalOpen(false);
    } finally {
      setIsCancelling(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={styles.page}>
      {/* Top Header */}
      <div style={styles.topBar}>
        <button
          type="button"
          onClick={() => navigate('/admin/expenses')}
          style={styles.backBtn}
        >
          <ArrowLeft size={16} />
          <span>Back to Expenses</span>
        </button>

        <div style={styles.topActions}>
          <button
            type="button"
            onClick={handlePrint}
            style={styles.printBtn}
          >
            <Printer size={15} />
            <span>Print Voucher</span>
          </button>

          {!isCancelled && (
            <button
              type="button"
              onClick={() => setCancelModalOpen(true)}
              style={styles.cancelVoucherBtn}
            >
              <Ban size={15} />
              <span>Void / Cancel Voucher</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Details Wrapper */}
      <div style={styles.contentWrap}>
        {/* Top Hero Banner */}
        <div style={styles.heroCard}>
          <div style={styles.heroTop}>
            <div style={styles.heroLeft}>
              <div style={styles.voucherIconCircle}>
                <FileText size={20} color="#DC2626" />
              </div>
              <div>
                <span style={styles.voucherIdLabel}>EXPENSE VOUCHER</span>
                <h1 style={styles.voucherNum}>{voucher.voucher_number}</h1>
              </div>
            </div>

            <div
              style={{
                ...styles.statusBadge,
                backgroundColor: isCancelled ? '#FEE2E2' : '#E8F8F0',
                color: isCancelled ? '#DC2626' : '#16A34A',
                borderColor: isCancelled ? '#FECACA' : '#A7F3D0',
              }}
            >
              <span
                style={{
                  ...styles.statusDot,
                  backgroundColor: isCancelled ? '#DC2626' : '#16A34A',
                }}
              />
              <span>{voucher.status}</span>
            </div>
          </div>

          <div style={styles.amountBox}>
            <span style={styles.amountLabel}>Total Outgoing Payment</span>
            <div
              style={{
                ...styles.amountText,
                color: isCancelled ? '#94A3B8' : '#0B2F52',
                textDecoration: isCancelled ? 'line-through' : 'none',
              }}
            >
              {formatINR(voucher.amount)}
            </div>
          </div>

          {isCancelled && voucher.cancellation_reason && (
            <div style={styles.cancellationBox}>
              <span style={styles.cancelReasonLabel}>Cancellation Audit Note:</span>
              <p style={styles.cancelReasonText}>{voucher.cancellation_reason}</p>
            </div>
          )}
        </div>

        {/* Section 1: Expense Information */}
        <div style={styles.infoCard}>
          <h2 style={styles.sectionHeading}>Expense Information</h2>

          <div style={styles.dataGrid}>
            <div style={styles.dataItem}>
              <span style={styles.fieldLabel}>
                <Calendar size={13} color="#64748B" />
                <span>Expense Date</span>
              </span>
              <span style={styles.fieldValue}>{formatDate(voucher.expense_date)}</span>
            </div>

            <div style={styles.dataItem}>
              <span style={styles.fieldLabel}>
                <Building2 size={13} color="#64748B" />
                <span>Expense Account</span>
              </span>
              <span style={styles.fieldValueHighlight}>
                {voucher.expense_account?.account_name || 'Expense Account'}
              </span>
            </div>

            <div style={styles.dataItem}>
              <span style={styles.fieldLabel}>
                <User size={13} color="#64748B" />
                <span>Paid To (Recipient)</span>
              </span>
              <span style={styles.fieldValue}>{voucher.paid_to}</span>
            </div>

            <div style={styles.dataItem}>
              <span style={styles.fieldLabel}>
                <CreditCard size={13} color="#64748B" />
                <span>Paid From (Disbursing Source)</span>
              </span>
              <span style={styles.fieldValue}>
                {voucher.paid_from_account?.account_name || 'Bank Account'}
              </span>
            </div>

            <div style={styles.dataItem}>
              <span style={styles.fieldLabel}>Payment Method</span>
              <span style={styles.fieldValue}>{voucher.payment_method}</span>
            </div>

            <div style={styles.dataItem}>
              <span style={styles.fieldLabel}>External Reference / Bill #</span>
              <span style={styles.fieldValue}>{voucher.reference_number || '—'}</span>
            </div>

            <div style={styles.dataItem}>
              <span style={styles.fieldLabel}>Recorded At</span>
              <span style={styles.fieldValue}>{formatDateTime(voucher.created_at)}</span>
            </div>

            <div style={styles.dataItem}>
              <span style={styles.fieldLabel}>Voucher Sequence</span>
              <span style={styles.fieldValue}>{voucher.id}</span>
            </div>
          </div>

          {/* Description */}
          <div style={styles.descWrap}>
            <span style={styles.fieldLabel}>Expense Purpose & Description</span>
            <p style={styles.descText}>
              {voucher.description || 'No description provided for this expense transaction.'}
            </p>
          </div>

          {/* Bill Attachment */}
          {voucher.attachment_url && (
            <div style={styles.attachmentBox}>
              <Paperclip size={15} color="#0284C7" />
              <span style={styles.attachmentLabel}>Supporting Document / Receipt Bill:</span>
              <a
                href={voucher.attachment_url}
                target="_blank"
                rel="noreferrer"
                style={styles.attachmentLink}
              >
                View Uploaded Receipt
              </a>
            </div>
          )}
        </div>

        {/* Section 2: Journal Entry Posting */}
        <div style={styles.infoCard}>
          <div style={styles.journalHeader}>
            <div>
              <h2 style={styles.sectionHeading}>Double-Entry Journal Posting</h2>
              <span style={styles.journalSubtext}>
                General Ledger Reference: {voucher.accounting_entry?.reference_type || 'MANUAL_EXPENSE'} •{' '}
                {voucher.accounting_entry?.entry_number || 'JV-AUTO'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/admin/accounting?search=${voucher.voucher_number || voucher.id}`)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#011F39',
                backgroundColor: '#EDF2F7',
                border: '1px solid #DBE5EE',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span>View in General Ledger</span>
              <ExternalLink size={13} />
            </button>
          </div>

          <div style={styles.journalTable}>
            <div style={styles.journalTableHeader}>
              <div style={{ flex: '3 1 300px' }}>Account Name</div>
              <div style={{ flex: '1.2 1 120px', textAlign: 'right' }}>Debit (Dr)</div>
              <div style={{ flex: '1.2 1 120px', textAlign: 'right' }}>Credit (Cr)</div>
            </div>

            {lines.length > 0 ? (
              lines.map((l) => {
                const debit = Number(l.debit_amount ?? l.debit ?? 0);
                const credit = Number(l.credit_amount ?? l.credit ?? 0);
                return (
                  <div key={l.id} style={styles.journalTableRow}>
                    <div style={{ flex: '3 1 300px' }}>
                      <span style={styles.accountText}>
                        {l.account?.account_name || 'Account'}
                      </span>
                    </div>
                    <div style={{ flex: '1.2 1 120px', textAlign: 'right' }}>
                      <span style={{ color: debit > 0 ? '#15803D' : '#94A3B8', fontWeight: 600 }}>
                        {debit > 0 ? formatINR(debit) : '—'}
                      </span>
                    </div>
                    <div style={{ flex: '1.2 1 120px', textAlign: 'right' }}>
                      <span style={{ color: credit > 0 ? '#C2410C' : '#94A3B8', fontWeight: 600 }}>
                        {credit > 0 ? formatINR(credit) : '—'}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={styles.journalEmpty}>
                No explicit journal lines registered. Journal entry will reflect on monthly balance sheet audit.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      <ExpenseCancelModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        voucher={voucher}
        isCancelling={isCancelling}
      />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: '24px 32px',
    maxWidth: '960px',
    margin: '0 auto',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    backgroundColor: '#FFFFFF',
    color: '#06294D',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  topActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  printBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    backgroundColor: '#FFFFFF',
    color: '#334155',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  cancelVoucherBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #FECACA',
    backgroundColor: '#FEF2F2',
    color: '#DC2626',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  contentWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    padding: '28px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  heroTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  heroLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  voucherIconCircle: {
    width: '46px',
    height: '46px',
    borderRadius: '10px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FECACA',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voucherIdLabel: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#64748B',
    letterSpacing: '0.05em',
  },
  voucherNum: {
    margin: '2px 0 0 0',
    fontSize: '24px',
    fontWeight: 800,
    color: '#011F39',
    fontFamily: 'Playfair Display, Georgia, serif',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '16px',
    fontSize: '13px',
    fontWeight: 700,
    border: '1px solid',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },
  amountBox: {
    padding: '20px',
    backgroundColor: '#F8FAFC',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  amountLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
  amountText: {
    fontSize: '32px',
    fontWeight: 800,
    fontFamily: 'Inter, sans-serif',
  },
  cancellationBox: {
    marginTop: '16px',
    padding: '14px',
    backgroundColor: '#FEF2F2',
    borderRadius: '8px',
    border: '1px solid #FECACA',
  },
  cancelReasonLabel: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#991B1B',
  },
  cancelReasonText: {
    margin: '4px 0 0 0',
    fontSize: '13px',
    color: '#B91C1C',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    padding: '28px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  sectionHeading: {
    margin: '0 0 16px 0',
    fontSize: '17px',
    fontWeight: 700,
    color: '#011F39',
    fontFamily: 'Playfair Display, Georgia, serif',
  },
  dataGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  dataItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '10px 14px',
    backgroundColor: '#F8FAFC',
    borderRadius: '6px',
  },
  fieldLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#64748B',
  },
  fieldValue: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#0F172A',
  },
  fieldValueHighlight: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#0284C7',
  },
  descWrap: {
    paddingTop: '16px',
    borderTop: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  descText: {
    margin: 0,
    fontSize: '14px',
    lineHeight: 1.6,
    color: '#334155',
  },
  attachmentBox: {
    marginTop: '16px',
    padding: '12px 16px',
    backgroundColor: '#F0F9FF',
    borderRadius: '6px',
    border: '1px solid #BAE6FD',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  attachmentLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#0369A1',
  },
  attachmentLink: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#0284C7',
    textDecoration: 'underline',
  },
  journalHeader: {
    marginBottom: '16px',
  },
  journalSubtext: {
    fontSize: '12px',
    color: '#64748B',
  },
  journalTable: {
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    overflow: 'hidden',
  },
  journalTableHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 16px',
    backgroundColor: '#F8FAFC',
    borderBottom: '1px solid #E2E8F0',
    fontSize: '12px',
    fontWeight: 700,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  journalTableRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #F1F5F9',
    backgroundColor: '#FFFFFF',
    fontSize: '13.5px',
  },
  accountText: {
    fontWeight: 600,
    color: '#0F172A',
  },
  journalEmpty: {
    padding: '24px',
    textAlign: 'center',
    fontSize: '13px',
    color: '#94A3B8',
    backgroundColor: '#FFFFFF',
  },
  notFoundContainer: {
    padding: '80px 24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundTitle: {
    margin: '16px 0 8px 0',
    fontSize: '22px',
    fontWeight: 700,
    color: '#1E293B',
  },
  notFoundText: {
    margin: '0 0 24px 0',
    fontSize: '14px',
    color: '#64748B',
  },
};
