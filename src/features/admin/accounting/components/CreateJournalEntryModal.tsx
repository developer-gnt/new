import type React from 'react';
import { useState } from 'react';
import { X, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import type {
  AccountItem,
  CreateJournalPayload,
} from '../types/accounting.types';
import { formatINR } from '../types/accounting.types';

function getInitialDate(): string {
  return new Date().toISOString().slice(0, 10);
}

interface CreateJournalEntryModalProps {
  visible: boolean;
  onClose: () => void;
  accounts: AccountItem[];
  onCreate: (payload: CreateJournalPayload) => Promise<void>;
}

interface FormLine {
  id: string;
  account_id: string;
  debit: string;
  credit: string;
  narration: string;
}

export const CreateJournalEntryModal: React.FC<CreateJournalEntryModalProps> = ({
  visible,
  onClose,
  accounts,
  onCreate,
}) => {
  const [entryDate, setEntryDate] = useState(getInitialDate);
  const [narration, setNarration] = useState('');
  const [lines, setLines] = useState<FormLine[]>([
    { id: '1', account_id: accounts[0]?.id || '', debit: '', credit: '', narration: '' },
    { id: '2', account_id: accounts[1]?.id || '', debit: '', credit: '', narration: '' },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!visible) return null;

  const totalDebit = lines.reduce((acc, l) => acc + (parseFloat(l.debit) || 0), 0);
  const totalCredit = lines.reduce((acc, l) => acc + (parseFloat(l.credit) || 0), 0);
  const isBalanced = totalDebit > 0 && Math.abs(totalDebit - totalCredit) < 0.001;

  const handleAddLine = () => {
    setLines((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        account_id: accounts[0]?.id || '',
        debit: '',
        credit: '',
        narration: '',
      },
    ]);
  };

  const handleRemoveLine = (id: string) => {
    if (lines.length <= 2) return;
    setLines((prev) => prev.filter((l) => l.id !== id));
  };

  const handleLineChange = (id: string, field: keyof FormLine, value: string) => {
    setLines((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        // If debit is typed, clear credit; if credit is typed, clear debit
        if (field === 'debit' && value !== '') {
          return { ...l, debit: value, credit: '' };
        }
        if (field === 'credit' && value !== '') {
          return { ...l, credit: value, debit: '' };
        }
        return { ...l, [field]: value };
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!narration.trim()) {
      setError('Please provide a descriptive narration for this journal voucher.');
      return;
    }

    if (!isBalanced) {
      setError('Double-entry imbalance: Total Debits must exactly equal Total Credits.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onCreate({
        entry_date: entryDate,
        narration: narration.trim(),
        lines: lines.map((l) => ({
          account_id: l.account_id,
          debit: parseFloat(l.debit) || 0,
          credit: parseFloat(l.credit) || 0,
          narration: l.narration.trim() || undefined,
        })),
      });

      // Reset
      setNarration('');
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to post journal entry.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          maxWidth: '820px',
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
          <div>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#FAD465' }}>
              Create Manual Journal Entry
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#93C5FD' }}>
              Post custom balanced double-entry accounting adjustment or transfer voucher
            </p>
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
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', overflowY: 'auto' }}>
          {error && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#991B1B',
                fontSize: '13px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={16} color="#DC2626" />
              <span>{error}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>
                Entry Date <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Voucher Narration / Particulars <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                placeholder="e.g. Inter-bank fund transfer, annual depreciation adjustment, salary provision..."
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* Lines Table */}
          <div style={{ border: '1px solid #E5E7EB', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 600, color: '#4B5563' }}>Account</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, color: '#4B5563', width: '140px' }}>Debit (Dr. ₹)</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, color: '#4B5563', width: '140px' }}>Credit (Cr. ₹)</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, color: '#4B5563' }}>Line Narration</th>
                  <th style={{ padding: '10px 12px', width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '8px 12px' }}>
                      <select
                        value={line.account_id}
                        onChange={(e) => handleLineChange(line.id, 'account_id', e.target.value)}
                        style={{ ...inputStyle, padding: '7px 8px' }}
                      >
                        {accounts.map((acc) => (
                          <option key={acc.id} value={acc.id}>
                            [{acc.account_code || '—'}] {acc.account_name} ({acc.account_type})
                          </option>
                        ))}
                      </select>
                    </td>

                    <td style={{ padding: '8px 12px' }}>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={line.debit}
                        onChange={(e) => handleLineChange(line.id, 'debit', e.target.value)}
                        style={{
                          ...inputStyle,
                          padding: '7px 8px',
                          fontWeight: 600,
                          color: '#011F39',
                        }}
                      />
                    </td>

                    <td style={{ padding: '8px 12px' }}>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={line.credit}
                        onChange={(e) => handleLineChange(line.id, 'credit', e.target.value)}
                        style={{
                          ...inputStyle,
                          padding: '7px 8px',
                          fontWeight: 600,
                          color: '#059669',
                        }}
                      />
                    </td>

                    <td style={{ padding: '8px 12px' }}>
                      <input
                        type="text"
                        placeholder="Optional remarks..."
                        value={line.narration}
                        onChange={(e) => handleLineChange(line.id, 'narration', e.target.value)}
                        style={{ ...inputStyle, padding: '7px 8px' }}
                      />
                    </td>

                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                      {lines.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLine(line.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#EF4444',
                            padding: '4px',
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: '#F8FAFC', borderTop: '2px solid #D1D5DB' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: '#011F39' }}>Totals:</td>
                  <td style={{ padding: '10px 12px', fontWeight: 800, color: '#011F39' }}>
                    {formatINR(totalDebit)}
                  </td>
                  <td style={{ padding: '10px 12px', fontWeight: 800, color: '#059669' }}>
                    {formatINR(totalCredit)}
                  </td>
                  <td colSpan={2} style={{ padding: '10px 12px' }}>
                    {isBalanced ? (
                      <span style={{ color: '#059669', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={14} />
                        <span>Balanced</span>
                      </span>
                    ) : (
                      <span style={{ color: '#DC2626', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <AlertCircle size={14} />
                        <span>Diff: {formatINR(Math.abs(totalDebit - totalCredit))}</span>
                      </span>
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <button
            type="button"
            onClick={handleAddLine}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '6px',
              border: '1px solid #D1D5DB',
              backgroundColor: '#FFFFFF',
              color: '#011F39',
              fontWeight: 600,
              fontSize: '12.5px',
              cursor: 'pointer',
              marginBottom: '16px',
            }}
          >
            <Plus size={14} />
            <span>Add Double-Entry Line</span>
          </button>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: '9px 16px',
                fontSize: '13px',
                fontWeight: 500,
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                backgroundColor: '#FFFFFF',
                color: '#374151',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isBalanced}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 20px',
                fontSize: '13.5px',
                fontWeight: 600,
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isBalanced ? '#011F39' : '#9CA3AF',
                color: '#FAD465',
                cursor: isBalanced && !isSubmitting ? 'pointer' : 'not-allowed',
                boxShadow: isBalanced ? '0 2px 4px rgba(1, 31, 57, 0.15)' : 'none',
              }}
            >
              <span>{isSubmitting ? 'Posting...' : 'Post Journal Voucher'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12.5px',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  fontSize: '13px',
  borderRadius: '6px',
  border: '1px solid #D1D5DB',
  backgroundColor: '#FFFFFF',
  color: '#111827',
  boxSizing: 'border-box',
  outline: 'none',
};
