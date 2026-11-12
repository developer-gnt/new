import type React from 'react';
import { useState, useSyncExternalStore } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Printer,
  Download,
  Ban,
  AlertCircle,
  Paperclip,
  ExternalLink,
} from 'lucide-react';
import { expensesStore } from '../store/expensesStore';
import { ExpenseCancelModal } from '../components/ExpenseCancelModal';
import { formatINR } from '../types/expenses.types';
import {
  printOfficialExpenseVoucher,
  downloadOfficialExpenseVoucherPdf,
} from '../utils/expenseReceiptGenerator';
import { numberToIndianWords } from '../../donations/utils/donationReceiptGenerator';
import hrsjmLogo from '../../../../assets/hrsjm_logo.png';

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

  const isWebApp = Boolean(
    voucher.reference_number?.toUpperCase().startsWith('WEB-APP') ||
    voucher.description?.includes('[Source: Web App]')
  );

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
    printOfficialExpenseVoucher(voucher);
  };

  const handleDownloadPdf = () => {
    downloadOfficialExpenseVoucherPdf(voucher);
  };

  return (
    <div style={styles.page}>
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          html, body, #root, #root > div, main, .admin-content-inner {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            background: #FFFFFF !important;
            box-shadow: none !important;
          }
          aside, header, nav, .no-print, button {
            display: none !important;
          }
          #printable-expense-voucher {
            display: block !important;
            margin: 0 auto !important;
            padding: 14px 18px !important;
            border: 2px solid #011F39 !important;
            border-radius: 8px !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            width: 100% !important;
            max-width: 820px !important;
            background: #FFFFFF !important;
          }
        }
      `}</style>

      {/* Top Header Navigation & Actions Bar */}
      <div style={styles.topBar} className="no-print">
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
            onClick={handleDownloadPdf}
            style={styles.downloadBtn}
          >
            <Download size={15} />
            <span>Download PDF</span>
          </button>

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

      {/* Cancellation Notice Banner */}
      {isCancelled && (
        <div style={styles.cancellationBanner} className="no-print">
          <AlertCircle size={20} color="#DC2626" />
          <div>
            <strong style={{ color: '#991B1B', fontSize: '14px' }}>Voucher Voided / Cancelled</strong>
            <p style={{ margin: '2px 0 0 0', color: '#B91C1C', fontSize: '13px' }}>
              {voucher.cancellation_reason || 'This expense voucher has been cancelled and reversed in the general ledger.'}
            </p>
          </div>
        </div>
      )}

      {/* Official Voucher Printable Receipt Slip */}
      <div id="printable-expense-voucher" style={styles.receiptSlip}>
        {/* Subtle Watermark */}
        <div style={styles.watermark}>HRSJM VOUCHER</div>

        {/* Letterhead Header */}
        <div style={styles.letterhead}>
          <div style={styles.logoWrap}>
            <img src={hrsjmLogo} alt="HRSJM Logo" style={styles.logoImg} />
          </div>
          <div style={styles.orgInfo}>
            <h1 style={styles.orgTitle}>HUMAN RIGHTS &amp; SOCIAL JUSTICE MISSION</h1>
            <div style={styles.orgHindi}>मानव अधिकार एवं सामाजिक न्याय मिशन</div>
            <div style={styles.orgTagline}>
              National Organization for Human Rights Advocacy, Social Justice, Legal Aid &amp; Public Welfare
            </div>
            <div style={styles.orgRegLine}>
              Registered under Societies Registration Act XXI of 1860 • NITI Aayog NGO-Darpan Regd: UP/2021/0285655 • Section 12A &amp; 80G Certified
              <br />
              Central Secretariat: New Delhi / Lucknow, Uttar Pradesh, India • contact@hrsjm.org • www.hrsjm.org
            </div>
          </div>
        </div>

        {/* Voucher Banner Ribbon */}
        <div style={styles.voucherRibbon}>
          <div>
            <div style={styles.ribbonTitle}>
              PAYMENT DISBURSEMENT VOUCHER
              {isCancelled && <span style={styles.cancelledTag}>[VOIDED / CANCELLED]</span>}
              {isWebApp && <span style={styles.webAppTag}>Web App</span>}
            </div>
            <div style={styles.ribbonSubtitle}>
              Official Double-Entry Statutory Society Expenditure Receipt
            </div>
          </div>
          <div style={styles.ribbonRight}>
            <div style={styles.ribbonNumLabel}>Voucher Number</div>
            <div style={styles.ribbonNumVal}>{voucher.voucher_number}</div>
          </div>
        </div>

        {/* 4-Column Metadata Grid */}
        <table style={styles.metaTable}>
          <tbody>
            <tr>
              <td style={styles.metaLabel}>Voucher Date</td>
              <td style={styles.metaVal}>{formatDate(voucher.expense_date)}</td>
              <td style={styles.metaLabel}>Payment Method</td>
              <td style={styles.metaVal}>
                {voucher.payment_method === 'UPI'
                  ? 'UPI'
                  : voucher.payment_method === 'CASH'
                  ? 'Cash'
                  : voucher.payment_method === 'BANK_TRANSFER'
                  ? 'Bank Transfer'
                  : voucher.payment_method}
              </td>
            </tr>
            <tr>
              <td style={styles.metaLabel}>Disbursing Source</td>
              <td style={styles.metaVal}>
                {voucher.payment_method === 'UPI'
                  ? 'UPI (Bank Account)'
                  : voucher.payment_method === 'CASH'
                  ? (voucher.paid_from_account?.account_name || 'Cash Account')
                  : (voucher.paid_from_account?.account_name || 'Bank Account')}
              </td>
              <td style={styles.metaLabel}>External Ref / Bill #</td>
              <td style={{ ...styles.metaVal, fontFamily: 'monospace' }}>{voucher.reference_number || '—'}</td>
            </tr>
            <tr>
              <td style={styles.metaLabel}>Audit Status</td>
              <td style={{ ...styles.metaVal, color: isCancelled ? '#DC2626' : '#15803D' }}>
                {voucher.status === 'POSTED' ? 'AUDITED & POSTED' : voucher.status}
              </td>
              <td style={styles.metaLabel}>Recorded At</td>
              <td style={styles.metaVal}>{formatDateTime(voucher.created_at)}</td>
            </tr>
          </tbody>
        </table>

        {/* Beneficiary & Classification Table */}
        <div style={styles.sectionTitle}>Disbursement Particulars &amp; Classification</div>
        <table style={styles.particularsTable}>
          <thead>
            <tr>
              <th style={{ width: '28%' }}>Paid To (Recipient / Payee)</th>
              <th style={{ width: '32%' }}>Expense Head (Classification)</th>
              <th style={{ width: '40%' }}>Detailed Purpose &amp; Narration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#011F39' }}>{voucher.paid_to}</div>
                <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '2px' }}>Authorized Payee / Beneficiary</div>
              </td>
              <td>
                <div style={{ fontWeight: 700, color: '#011F39' }}>{voucher.expense_account?.account_name || 'Expense Head'}</div>
                <div style={{ fontSize: '10.5px', color: '#64748B', fontFamily: 'monospace', marginTop: '2px' }}>
                  A/c #{voucher.expense_account?.account_code || '5002'}
                </div>
              </td>
              <td>
                <div style={{ color: '#334155', lineHeight: '1.45' }}>
                  {voucher.description || 'Disbursement for approved organizational operations and activities.'}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Amount Card with Amount in Words */}
        <div style={styles.amountCard}>
          <div style={styles.amountWordsBox}>
            <div style={styles.amountWordsTitle}>Amount Passed for Payment (in Words)</div>
            <div style={styles.amountWordsVal}>{numberToIndianWords(voucher.amount)}</div>
          </div>
          <div style={styles.amountDigitsBox}>
            <div style={styles.amountDigitsTitle}>Total Disbursed (INR)</div>
            <div style={{
              ...styles.amountDigitsVal,
              textDecoration: isCancelled ? 'line-through' : 'none',
              color: isCancelled ? '#94A3B8' : '#011F39',
            }}>
              {formatINR(voucher.amount)}
            </div>
          </div>
        </div>

        {/* Double-Entry Journal Postings */}
        <div style={styles.journalBox}>
          <div style={styles.journalBoxHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={14} color="#011F39" />
              <span style={{ fontWeight: 700 }}>Double-Entry General Ledger Postings</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '11px', color: '#64748B' }}>
                Ref: {voucher.accounting_entry?.entry_number || 'JV-AUTO'}
              </span>
              <button
                type="button"
                onClick={() => navigate(`/admin/accounting?search=${voucher.voucher_number || voucher.id}`)}
                className="no-print"
                style={styles.ledgerBtn}
              >
                <span>View in General Ledger</span>
                <ExternalLink size={12} />
              </button>
            </div>
          </div>

          <table style={styles.journalSubTable}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Account Code &amp; Name</th>
                <th style={{ textAlign: 'left' }}>Accounting Entry Type</th>
                <th style={{ textAlign: 'right' }}>Debit (Dr.)</th>
                <th style={{ textAlign: 'right' }}>Credit (Cr.)</th>
              </tr>
            </thead>
            <tbody>
              {lines.length > 0 ? (
                lines.map((l) => {
                  const debit = Number(l.debit_amount ?? l.debit ?? 0);
                  const credit = Number(l.credit_amount ?? l.credit ?? 0);
                  return (
                    <tr key={l.id}>
                      <td style={{ fontWeight: 600, color: '#0F172A' }}>
                        {l.account?.account_name}
                        {l.account?.account_code && (
                          <span style={{ color: '#64748B', fontSize: '10.5px', marginLeft: '6px' }}>
                            (A/c #{l.account.account_code})
                          </span>
                        )}
                      </td>
                      <td style={{ color: '#64748B' }}>
                        {debit > 0 ? 'Dr. Expense Allocation' : 'Cr. Disbursing Asset'}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600, color: debit > 0 ? '#15803D' : '#94A3B8' }}>
                        {debit > 0 ? formatINR(debit) : '—'}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600, color: credit > 0 ? '#C2410C' : '#94A3B8' }}>
                        {credit > 0 ? formatINR(credit) : '—'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td style={{ fontWeight: 600, color: '#0F172A' }}>
                    {voucher.expense_account?.account_name || 'Expense Head'}
                    {voucher.expense_account?.account_code && (
                      <span style={{ color: '#64748B', fontSize: '10.5px', marginLeft: '6px' }}>
                        (A/c #{voucher.expense_account.account_code})
                      </span>
                    )}
                  </td>
                  <td style={{ color: '#64748B' }}>Dr. Expense Allocation</td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: '#15803D' }}>
                    {formatINR(voucher.amount)}
                  </td>
                  <td style={{ textAlign: 'right', color: '#94A3B8' }}>—</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Attachment link if exists */}
        {voucher.attachment_url && (
          <div style={styles.attachmentBox} className="no-print">
            <Paperclip size={15} color="#0284C7" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#0369A1' }}>Supporting Document:</span>
            <a href={voucher.attachment_url} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#0284C7', textDecoration: 'underline' }}>
              View Attached Bill / Invoice
            </a>
          </div>
        )}

        {/* Signatures & Seal Authorization Block */}
        <div style={styles.signatureRow}>
          <div style={styles.signCol}>
            <div style={styles.signLine} />
            <div style={styles.signTitle}>Prepared By</div>
            <div style={styles.signRole}>Accounts Officer / Cashier</div>
          </div>

          <div style={styles.signCol}>
            <div style={styles.sealGraphic}>
              HRSJM<br />OFFICIAL<br />SEAL
            </div>
            <div style={styles.signTitle}>Verified &amp; Audited</div>
            <div style={styles.signRole}>Internal Finance Auditor</div>
          </div>

          <div style={styles.signCol}>
            <div style={styles.signLine} />
            <div style={styles.signTitle}>Authorized Signatory</div>
            <div style={styles.signRole}>Treasurer / General Secretary</div>
          </div>
        </div>

        {/* Official Statutory Footer */}
        <div style={styles.footerNote}>
          This is an official computer-generated payment disbursement voucher of <strong>Human Rights &amp; Social Justice Mission</strong>.
          <br />
          Certified for statutory society audit under the Societies Registration Act XXI of 1860. Retain for official accounting records.
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
    maxWidth: '920px',
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
  downloadBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1px solid #0284C7',
    backgroundColor: '#F0F9FF',
    color: '#0369A1',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  printBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #011F39',
    backgroundColor: '#011F39',
    color: '#FAD465',
    fontSize: '13px',
    fontWeight: 700,
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
  cancellationBanner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '14px 18px',
    borderRadius: '8px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #F87171',
    marginBottom: '20px',
  },

  /* Receipt Slip Document Card */
  receiptSlip: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    border: '2px solid #011F39',
    padding: '24px 28px',
    boxShadow: '0 4px 20px rgba(1, 31, 57, 0.08)',
    overflow: 'hidden',
  },
  watermark: {
    position: 'absolute',
    top: '48%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-24deg)',
    fontSize: '56px',
    fontWeight: 900,
    color: 'rgba(1, 31, 57, 0.03)',
    letterSpacing: '5px',
    textTransform: 'uppercase',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    userSelect: 'none',
  },

  /* Letterhead */
  letterhead: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    borderBottom: '2px solid #011F39',
    paddingBottom: '12px',
    marginBottom: '14px',
  },
  logoWrap: {
    width: '74px',
    height: '74px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  orgInfo: {
    flex: 1,
    textAlign: 'center',
  },
  orgTitle: {
    fontFamily: 'Playfair Display, Georgia, serif',
    fontSize: '19px',
    fontWeight: 900,
    color: '#011F39',
    letterSpacing: '0.4px',
    margin: 0,
    lineHeight: 1.2,
  },
  orgHindi: {
    fontSize: '12.5px',
    fontWeight: 700,
    color: '#926A04',
    marginTop: '2px',
  },
  orgTagline: {
    fontSize: '9.5px',
    color: '#475569',
    fontStyle: 'italic',
    marginTop: '2px',
  },
  orgRegLine: {
    fontSize: '9px',
    color: '#334155',
    fontWeight: 600,
    marginTop: '4px',
    lineHeight: 1.35,
  },

  /* Voucher Ribbon */
  voucherRibbon: {
    background: 'linear-gradient(90deg, #011F39 0%, #06294D 100%)',
    color: '#FAD465',
    padding: '8px 16px',
    borderRadius: '6px',
    marginBottom: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid #E9B82E',
  },
  ribbonTitle: {
    fontFamily: 'Playfair Display, Georgia, serif',
    fontSize: '13px',
    fontWeight: 800,
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  cancelledTag: {
    fontSize: '9px',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: '#DC2626',
    color: '#FFFFFF',
    fontWeight: 700,
  },
  webAppTag: {
    fontSize: '9px',
    padding: '2px 7px',
    borderRadius: '4px',
    backgroundColor: 'rgba(250, 212, 101, 0.25)',
    border: '1px solid rgba(250, 212, 101, 0.5)',
    color: '#FFFFFF',
    fontWeight: 700,
  },
  ribbonSubtitle: {
    fontSize: '9.5px',
    color: '#FDF4DC',
    marginTop: '2px',
  },
  ribbonRight: {
    textAlign: 'right',
  },
  ribbonNumLabel: {
    fontSize: '8.5px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#FDF4DC',
  },
  ribbonNumVal: {
    fontFamily: 'monospace',
    fontSize: '14.5px',
    fontWeight: 800,
    color: '#FFFFFF',
  },

  /* Metadata Table */
  metaTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '14px',
    backgroundColor: '#F8FAFC',
    border: '1px solid #CBD5E1',
    borderRadius: '6px',
    fontSize: '11px',
  },
  metaLabel: {
    padding: '6px 10px',
    color: '#64748B',
    fontWeight: 600,
    fontSize: '9.5px',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
    width: '25%',
    border: '1px solid #E2E8F0',
  },
  metaVal: {
    padding: '6px 10px',
    fontWeight: 700,
    color: '#0F172A',
    width: '25%',
    border: '1px solid #E2E8F0',
  },

  /* Section Title */
  sectionTitle: {
    fontSize: '10.5px',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    color: '#011F39',
    borderBottom: '1.5px solid #011F39',
    paddingBottom: '3px',
    margin: '12px 0 8px 0',
  },

  /* Particulars Table */
  particularsTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '12px',
    fontSize: '11px',
  },

  /* Amount Box */
  amountCard: {
    backgroundColor: '#F8FAFC',
    border: '1.5px solid #011F39',
    borderRadius: '6px',
    padding: '10px 14px',
    margin: '12px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
  },
  amountWordsBox: {
    flex: 1,
  },
  amountWordsTitle: {
    fontSize: '9px',
    fontWeight: 700,
    textTransform: 'uppercase',
    color: '#475569',
    letterSpacing: '0.4px',
  },
  amountWordsVal: {
    fontSize: '12px',
    fontWeight: 800,
    color: '#011F39',
    marginTop: '2px',
  },
  amountDigitsBox: {
    textAlign: 'right',
    paddingLeft: '16px',
    borderLeft: '1.5px solid #CBD5E1',
    minWidth: '160px',
  },
  amountDigitsTitle: {
    fontSize: '9px',
    fontWeight: 700,
    textTransform: 'uppercase',
    color: '#475569',
  },
  amountDigitsVal: {
    fontSize: '22px',
    fontWeight: 900,
    fontFamily: 'Playfair Display, Georgia, serif',
    lineHeight: 1.1,
    marginTop: '2px',
  },

  /* Double-Entry Journal Table */
  journalBox: {
    backgroundColor: '#FAFAFA',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    padding: '10px 12px',
    marginBottom: '12px',
  },
  journalBoxHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '10.5px',
    borderBottom: '1px solid #E2E8F0',
    paddingBottom: '6px',
    marginBottom: '6px',
  },
  journalSubTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '11px',
  },
  ledgerBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 8px',
    borderRadius: '4px',
    border: '1px solid #CBD5E1',
    backgroundColor: '#FFFFFF',
    color: '#0284C7',
    fontSize: '10.5px',
    fontWeight: 600,
    cursor: 'pointer',
  },

  /* Attachment Box */
  attachmentBox: {
    padding: '8px 12px',
    backgroundColor: '#F0F9FF',
    borderRadius: '6px',
    border: '1px solid #BAE6FD',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },

  /* Signatures */
  signatureRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: '20px',
    paddingTop: '12px',
    borderTop: '1px dashed #CBD5E1',
  },
  signCol: {
    textAlign: 'center',
    width: '28%',
  },
  signLine: {
    height: '36px',
    borderBottom: '1px solid #011F39',
    marginBottom: '4px',
  },
  signTitle: {
    fontSize: '10px',
    fontWeight: 800,
    color: '#011F39',
    textTransform: 'uppercase',
  },
  signRole: {
    fontSize: '8.5px',
    color: '#64748B',
  },
  sealGraphic: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    border: '1.5px dashed #06294D',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: '6.5px',
    fontWeight: 800,
    color: '#06294D',
    textTransform: 'uppercase',
    padding: '2px',
    lineHeight: 1.1,
    backgroundColor: '#F8FAFC',
    marginBottom: '4px',
  },

  /* Footer Note */
  footerNote: {
    textAlign: 'center',
    fontSize: '8.5px',
    color: '#64748B',
    marginTop: '16px',
    borderTop: '1px solid #E2E8F0',
    paddingTop: '8px',
    lineHeight: 1.4,
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
