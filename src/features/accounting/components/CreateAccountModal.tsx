import type React from 'react';
import { useState } from 'react';
import { X, Check } from 'lucide-react';
import type {
  AccountItem,
  AccountType,
  CreateAccountPayload,
} from '../types/accounting.types';
import { ACCOUNT_TYPE_LABELS } from '../types/accounting.types';

interface CreateAccountModalProps {
  visible: boolean;
  onClose: () => void;
  accounts: AccountItem[];
  onCreate: (payload: CreateAccountPayload) => Promise<void>;
}

export const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
  visible,
  onClose,
  accounts,
  onCreate,
}) => {
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('ASSET');
  const [accountCode, setAccountCode] = useState('');
  const [parentAccountId, setParentAccountId] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!visible) return null;

  const parentOptions = accounts.filter(
    (a) => a.account_type === accountType && !a.parent_account_id
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountName.trim()) {
      setError('Please provide a valid account name.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onCreate({
        account_name: accountName.trim(),
        account_type: accountType,
        account_code: accountCode.trim() || undefined,
        parent_account_id: parentAccountId || null,
        description: description.trim() || undefined,
      });

      // Reset
      setAccountName('');
      setAccountCode('');
      setParentAccountId('');
      setDescription('');
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create account.');
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
          maxWidth: '520px',
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
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
            borderBottom: '1px solid #E5E7EB',
            backgroundColor: '#011F39',
            color: '#FFFFFF',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#FAD465' }}>
              Add New Account
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#93C5FD' }}>
              Create an account in the organization Chart of Accounts
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
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#991B1B',
                fontSize: '13px',
              }}
            >
              {error}
            </div>
          )}

          {/* Account Category */}
          <div>
            <label style={labelStyle}>
              Account Classification / Type <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <select
              value={accountType}
              onChange={(e) => {
                setAccountType(e.target.value as AccountType);
                setParentAccountId('');
              }}
              style={selectStyle}
            >
              {(Object.keys(ACCOUNT_TYPE_LABELS) as AccountType[]).map((type) => (
                <option key={type} value={type}>
                  {ACCOUNT_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>

          {/* Account Name */}
          <div>
            <label style={labelStyle}>
              Account Name <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g. Axis Bank - Operations, Legal Subsidy Fund..."
              required
              style={inputStyle}
            />
          </div>

          {/* Account Code */}
          <div>
            <label style={labelStyle}>Account Code (GL Code)</label>
            <input
              type="text"
              value={accountCode}
              onChange={(e) => setAccountCode(e.target.value)}
              placeholder="e.g. 1004, 5010 (leave blank to auto-generate)"
              style={inputStyle}
            />
          </div>

          {/* Parent Account */}
          {parentOptions.length > 0 && (
            <div>
              <label style={labelStyle}>Parent Account (Optional)</label>
              <select
                value={parentAccountId}
                onChange={(e) => setParentAccountId(e.target.value)}
                style={selectStyle}
              >
                <option value="">None (Top-Level Head)</option>
                {parentOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.account_code || '—'}] {p.account_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Description */}
          <div>
            <label style={labelStyle}>Description / Usage Purpose</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the nature of transactions to be routed through this account..."
              rows={3}
              style={{ ...inputStyle, fontFamily: 'inherit' }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
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
              disabled={isSubmitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 20px',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#011F39',
                color: '#FAD465',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              <Check size={16} color="#FAD465" />
              <span>{isSubmitting ? 'Creating...' : 'Create Account'}</span>
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
  padding: '9px 12px',
  fontSize: '13px',
  borderRadius: '8px',
  border: '1px solid #D1D5DB',
  backgroundColor: '#FFFFFF',
  color: '#111827',
  boxSizing: 'border-box',
  outline: 'none',
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  fontSize: '13px',
  borderRadius: '8px',
  border: '1px solid #D1D5DB',
  backgroundColor: '#FFFFFF',
  color: '#111827',
  outline: 'none',
};
