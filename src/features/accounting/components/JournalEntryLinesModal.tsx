import type React from 'react';
import { X, FileText, CheckCircle2 } from 'lucide-react';
import type { JournalEntryItem } from '../types/accounting.types';
import { formatINR } from '../types/accounting.types';

interface JournalEntryLinesModalProps {
  visible: boolean;
  onClose: () => void;
  entry: JournalEntryItem | null;
}

export const JournalEntryLinesModal: React.FC<JournalEntryLinesModalProps> = ({
  visible,
  onClose,
  entry,
}) => {
  if (!visible || !entry) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          maxWidth: '720px',
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px',
            backgroundColor: '#011F39',
            color: '#FFFFFF',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} color="#FAD465" />
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#FAD465' }}>
                Journal Voucher Lines — {entry.entry_number}
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#93C5FD' }}>
                Posting Date: {entry.entry_date} | Type: {entry.entry_type}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#FFFFFF',
              padding: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', overflowY: 'auto' }}>
          {/* Narration box */}
          <div
            style={{
              backgroundColor: '#F9FAFB',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              padding: '12px 16px',
              marginBottom: '20px',
              fontSize: '13.5px',
            }}
          >
            <span style={{ fontWeight: 600, color: '#4B5563', fontSize: '12px' }}>Narration:</span>
            <div style={{ color: '#111827', marginTop: '2px', lineHeight: '1.4' }}>
              {entry.narration || 'No narrative description provided.'}
            </div>
            {entry.reversal_reason && (
              <div style={{ marginTop: '8px', color: '#DC2626', fontSize: '12.5px' }}>
                <b>Reversal Reason:</b> {entry.reversal_reason}
              </div>
            )}
          </div>

          {/* Double-Entry Lines Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F3F4F6', borderBottom: '1px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px', fontWeight: 600, color: '#4B5563' }}>Account Code & Name</th>
                <th style={{ padding: '10px 14px', fontWeight: 600, color: '#4B5563' }}>Classification</th>
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
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: '#6B7280' }}>
                    No line postings found.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: '#F8FAFC', borderTop: '2px solid #D1D5DB' }}>
                <td colSpan={2} style={{ padding: '12px 14px', fontWeight: 700, color: '#011F39' }}>
                  Total Balanced Journal Postings:
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#011F39', fontSize: '14px' }}>
                  {formatINR(entry.total_debit)}
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#059669', fontSize: '14px' }}>
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
                marginTop: '12px',
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

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'flex-end',
            backgroundColor: '#F9FAFB',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#011F39',
              color: '#FAD465',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
