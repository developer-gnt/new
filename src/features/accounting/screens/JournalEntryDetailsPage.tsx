import type React from 'react';
import { useState, useSyncExternalStore, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  RotateCcw,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import { accountingStore } from '../store/accountingStore';
import { formatINR } from '../types/accounting.types';
import { ReverseJournalModal } from '../components/ReverseJournalModal';

export const JournalEntryDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const storeSnapshot = useSyncExternalStore(
    accountingStore.subscribe,
    accountingStore.getSnapshot
  );

  const [reverseModalOpen, setReverseModalOpen] = useState(false);

  // Derive reactively
  const entry = id ? storeSnapshot.journals.find((j) => j.id === id) || null : null;

  useEffect(() => {
    if (!entry) {
      accountingStore.fetchAll();
    }
  }, [entry]);

  if (!entry) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', color: '#011F39' }}>Journal Entry Not Found</h2>
        <p style={{ color: '#6B7280', fontSize: '14px', margin: '8px 0 20px 0' }}>
          The requested journal voucher could not be located.
        </p>
        <button
          type="button"
          onClick={() => navigate('/admin/accounting?tab=journals')}
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
          Return to Journal Entries
        </button>
      </div>
    );
  }

  const isReversed = entry.is_reversed || entry.entry_type === 'REVERSAL';

  const handlePrint = () => {
    window.print();
  };

  const handleConfirmReverse = async (reason: string) => {
    if (!entry) return;
    await accountingStore.reverseJournalEntry(entry.id, reason);
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Top Controls */}
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
          onClick={() => navigate('/admin/accounting?tab=journals')}
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
          <span>Back to Journals</span>
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
            <span>Print Journal Slip</span>
          </button>

          {!isReversed && (
            <button
              type="button"
              onClick={() => setReverseModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '8px',
                border: '1px solid #FECACA',
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={15} />
              <span>Reverse Voucher</span>
            </button>
          )}
        </div>
      </div>

      {/* Reversal Banner */}
      {entry.is_reversed && (
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
              Journal Entry Reversed
            </h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#B91C1C' }}>
              {entry.reversal_reason || 'This journal voucher was reversed with a mirrored correction entry.'}
            </p>
          </div>
        </div>
      )}

      {/* Slip Card */}
      <div
        id="printable-journal-slip"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        }}
      >
        {/* Slip Header */}
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
              <FileText size={22} color="#FAD465" />
              <span
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: '19px',
                  fontWeight: 700,
                  color: '#FAD465',
                }}
              >
                HUMAN RIGHTS SANRAKSHAN JYOTI MORCHA
              </span>
            </div>
            <p style={{ margin: '4px 0 0 30px', fontSize: '12px', color: '#93C5FD' }}>
              Central Accounting & Finance Department — Official Journal Voucher
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#93C5FD', textTransform: 'uppercase' }}>
              Voucher No.
            </span>
            <div style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
              {entry.entry_number}
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div
          style={{
            padding: '20px 32px',
            borderBottom: '1px solid #E5E7EB',
            backgroundColor: '#F9FAFB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: '#EFF6FF',
                color: '#1D4ED8',
                border: '1px solid #BFDBFE',
                textTransform: 'uppercase',
              }}
            >
              {entry.entry_type}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#4B5563' }}>
              <Calendar size={14} />
              <span>Date: <b>{entry.entry_date}</b></span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11.5px', color: '#6B7280', textTransform: 'uppercase' }}>
              Total Amount
            </span>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#011F39' }}>
              {formatINR(entry.total_debit)}
            </div>
          </div>
        </div>

        {/* Particulars */}
        <div style={{ padding: '24px 32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>
              Narration / Particulars
            </span>
            <div style={{ fontSize: '14px', color: '#111827', fontWeight: 500, marginTop: '4px', lineHeight: '1.5' }}>
              {entry.narration || '—'}
            </div>
          </div>

          {/* Lines Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '16px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F3F4F6', borderBottom: '1px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px', fontWeight: 600, color: '#4B5563' }}>Account Code & Name</th>
                <th style={{ padding: '10px 14px', fontWeight: 600, color: '#4B5563' }}>Type</th>
                <th style={{ padding: '10px 14px', fontWeight: 600, color: '#4B5563', textAlign: 'right' }}>Debit (Dr.)</th>
                <th style={{ padding: '10px 14px', fontWeight: 600, color: '#4B5563', textAlign: 'right' }}>Credit (Cr.)</th>
              </tr>
            </thead>
            <tbody>
              {entry.lines && entry.lines.length > 0 ? (
                entry.lines.map((line) => {
                  const debit = line.debit || line.debit_amount || 0;
                  const credit = line.credit || line.credit_amount || 0;

                  return (
                    <tr key={line.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '10px 14px', color: '#111827', fontWeight: 600 }}>
                        {line.account?.account_name}
                        {line.account?.account_code && (
                          <span style={{ color: '#6B7280', fontSize: '11px', marginLeft: '6px' }}>
                            (#{line.account.account_code})
                          </span>
                        )}
                        {line.narration && (
                          <div style={{ fontSize: '11.5px', color: '#6B7280', fontWeight: 400 }}>
                            {line.narration}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '10px 14px', color: '#6B7280', fontSize: '12px' }}>
                        {line.account?.account_type || 'GENERAL'}
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: '#011F39' }}>
                        {debit > 0 ? formatINR(debit) : '—'}
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: '#059669' }}>
                        {credit > 0 ? formatINR(credit) : '—'}
                      </td>
                    </tr>
                  );
                })
              ) : null}
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: '#F8FAFC', borderTop: '2px solid #D1D5DB' }}>
                <td colSpan={2} style={{ padding: '12px 14px', fontWeight: 700, color: '#011F39' }}>
                  Total Balanced Journal Postings:
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#011F39' }}>
                  {formatINR(entry.total_debit)}
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#059669' }}>
                  {formatINR(entry.total_credit)}
                </td>
              </tr>
            </tfoot>
          </table>

          {entry.total_debit === entry.total_credit && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#059669',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={14} />
              <span>Double-entry balance verified: Total Debits equal Total Credits.</span>
            </div>
          )}
        </div>

        {/* Slip Footer */}
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
            <div style={{ fontWeight: 600, color: '#111827' }}>Chief Financial Officer / Accountant</div>
            <div style={{ marginTop: '2px' }}>Human Rights Sanrakshan Jyoti Morcha</div>
          </div>
        </div>
      </div>

      {/* Reverse Modal */}
      <ReverseJournalModal
        visible={reverseModalOpen}
        onClose={() => setReverseModalOpen(false)}
        entry={entry}
        onConfirmReverse={handleConfirmReverse}
      />
    </div>
  );
};
