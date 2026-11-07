import type React from 'react';
import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import type { ReceiptEntryItem } from '../types/receipts.types';
import { formatINR } from '../types/receipts.types';

interface ReceiptCancelModalProps {
  visible: boolean;
  onClose: () => void;
  voucher: ReceiptEntryItem | null;
  onConfirmCancel: (reason: string) => Promise<void>;
}

export const ReceiptCancelModal: React.FC<ReceiptCancelModalProps> = ({
  visible,
  onClose,
  voucher,
  onConfirmCancel,
}) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!visible || !voucher) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a reason for cancelling / voiding this voucher.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onConfirmCancel(reason.trim());
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to cancel voucher.');
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
          maxWidth: '480px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px',
            borderBottom: '1px solid #FEE2E2',
            backgroundColor: '#FEF2F2',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#FEE2E2',
                border: '1px solid #FECACA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={20} color="#DC2626" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#991B1B' }}>
                Cancel Receipt Voucher
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#B91C1C' }}>
                Void voucher and post reversing double-entry journal
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
              color: '#991B1B',
              padding: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }}>
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#F9FAFB',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              marginBottom: '16px',
              fontSize: '13px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#6B7280' }}>Voucher Number:</span>
              <span style={{ fontWeight: 600, color: '#111827' }}>{voucher.voucher_number}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#6B7280' }}>Received From:</span>
              <span style={{ fontWeight: 600, color: '#111827' }}>{voucher.received_from}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280' }}>Amount:</span>
              <span style={{ fontWeight: 700, color: '#059669' }}>{formatINR(voucher.amount)}</span>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '6px',
              }}
            >
              Cancellation Reason <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Cheque returned unpaid, duplicated gateway transaction, incorrect account allocation..."
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '13px',
                borderRadius: '8px',
                border: error ? '1px solid #DC2626' : '1px solid #D1D5DB',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
            {error && (
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#DC2626' }}>{error}</p>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
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
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '9px 18px',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? 'Cancelling...' : 'Confirm Void'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
