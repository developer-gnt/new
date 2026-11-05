import type React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  User,
  RotateCcw,
  TrendingUp,
  ChevronRight,
  Landmark,
} from 'lucide-react';
import type { ReceiptEntryItem } from '../types/receipts.types';
import {
  classifyReceipt,
  formatPaymentMethodBadge,
  formatVoucherStatusBadge,
} from '../utils/receiptClassification';
import { formatINR } from '../types/receipts.types';

interface ReceiptCardProps {
  voucher: ReceiptEntryItem;
  onCancelVoucher?: (voucher: ReceiptEntryItem) => void;
}

export const ReceiptCard: React.FC<ReceiptCardProps> = ({ voucher }) => {
  const navigate = useNavigate();
  const classified = classifyReceipt(voucher);
  const methodBadge = formatPaymentMethodBadge(voucher.payment_method);
  const statusBadge = formatVoucherStatusBadge(voucher.status);

  const getCategoryIcon = () => {
    switch (classified.iconType) {
      case 'heart':
        return <Heart size={16} color={classified.iconColor} />;
      case 'user':
        return <User size={16} color={classified.iconColor} />;
      case 'rotate-cw':
        return <RotateCcw size={16} color={classified.iconColor} />;
      default:
        return <TrendingUp size={16} color={classified.iconColor} />;
    }
  };

  const isCancelled = voucher.status === 'CANCELLED';

  return (
    <tr
      onClick={() => navigate(`/admin/receipts/${voucher.id}`)}
      style={{
        borderBottom: '1px solid #E5E7EB',
        cursor: 'pointer',
        transition: 'background-color 0.15s ease',
        backgroundColor: isCancelled ? '#FEF2F2' : '#FFFFFF',
      }}
      onMouseEnter={(e) => {
        if (!isCancelled) e.currentTarget.style.backgroundColor = '#F9FAFB';
      }}
      onMouseLeave={(e) => {
        if (!isCancelled) e.currentTarget.style.backgroundColor = '#FFFFFF';
      }}
    >
      {/* 1. Voucher No, Category & Origin Channel */}
      <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: classified.iconBg,
              border: `1px solid ${classified.iconBorder}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '2px',
            }}
          >
            {getCategoryIcon()}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: isCancelled ? '#9CA3AF' : '#011F39',
                  textDecoration: isCancelled ? 'line-through' : 'none',
                }}
              >
                {voucher.voucher_number}
              </span>

              {/* Category Badge */}
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 600,
                  padding: '1px 6px',
                  borderRadius: '4px',
                  backgroundColor: classified.badgeBg,
                  color: classified.badgeColor,
                  border: `1px solid ${classified.badgeBorder}`,
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}
              >
                {classified.categoryLabel}
              </span>

              {/* Origin Channel Badge */}
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 500,
                  padding: '1px 6px',
                  borderRadius: '10px',
                  backgroundColor: classified.sourceBadgeBg,
                  color: classified.sourceBadgeColor,
                  border: `1px solid ${classified.sourceBadgeBorder}`,
                }}
              >
                {classified.sourceBadgeText}
              </span>
            </div>

            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '3px' }}>
              Date: <b>{voucher.receipt_date}</b>
            </div>

            {/* Highlight Pill (Cause / Plan / Member ID) */}
            {classified.sourceHighlightValue && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '5px',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: classified.sourceHighlightBg,
                  color: classified.sourceHighlightColor,
                  border: `1px solid ${classified.sourceHighlightBorder}`,
                  fontSize: '11.5px',
                  fontWeight: 500,
                  maxWidth: '380px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {classified.sourceHighlightIcon === 'heart' && <Heart size={12} />}
                {classified.sourceHighlightIcon === 'user' && <User size={12} />}
                {classified.sourceHighlightIcon === 'rotate-cw' && <RotateCcw size={12} />}
                {classified.sourceHighlightIcon === 'landmark' && <Landmark size={12} />}
                <span>
                  {classified.sourceHighlightLabel && <b>{classified.sourceHighlightLabel} </b>}
                  {classified.sourceHighlightValue}
                </span>
              </div>
            )}
          </div>
        </div>
      </td>

      {/* 2. Received From (Contributor / Payer) */}
      <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
        <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#111827' }}>
          {classified.payerName || voucher.received_from || '—'}
        </div>
        {classified.payerContact && (
          <div style={{ fontSize: '12px', color: '#4B5563', marginTop: '2px' }}>
            {classified.payerContact}
          </div>
        )}
        {voucher.reference_number && (
          <div
            style={{
              fontSize: '11px',
              color: '#6B7280',
              marginTop: '3px',
              fontFamily: 'monospace',
            }}
          >
            Ref: {voucher.reference_number}
          </div>
        )}
      </td>

      {/* 3. Account Allocation */}
      <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#011F39' }}>
          {voucher.income_account?.account_name || 'Donation Income'}
        </div>
        <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '2px' }}>
          To: {voucher.received_in_account?.account_name || 'HDFC Bank Main'}
        </div>
      </td>

      {/* 4. Payment Method */}
      <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11.5px',
            fontWeight: 500,
            padding: '3px 8px',
            borderRadius: '6px',
            backgroundColor: methodBadge.bg,
            color: methodBadge.color,
            border: `1px solid ${methodBadge.border}`,
          }}
        >
          {methodBadge.label}
        </span>
      </td>

      {/* 5. Amount */}
      <td style={{ padding: '14px 16px', verticalAlign: 'top', textAlign: 'right' }}>
        <div
          style={{
            fontSize: '15px',
            fontWeight: 700,
            color: isCancelled ? '#9CA3AF' : '#059669',
            textDecoration: isCancelled ? 'line-through' : 'none',
          }}
        >
          {formatINR(voucher.amount)}
        </div>
        <span
          style={{
            display: 'inline-block',
            marginTop: '4px',
            fontSize: '11px',
            fontWeight: 600,
            padding: '1px 6px',
            borderRadius: '4px',
            backgroundColor: statusBadge.bg,
            color: statusBadge.color,
            border: `1px solid ${statusBadge.border}`,
          }}
        >
          {statusBadge.label}
        </span>
      </td>

      {/* 6. Action */}
      <td style={{ padding: '14px 16px', verticalAlign: 'middle', textAlign: 'right' }}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/receipts/${voucher.id}`);
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            border: '1px solid #E5E7EB',
            backgroundColor: '#FFFFFF',
            color: '#6B7280',
            cursor: 'pointer',
          }}
          title="View Voucher Slip"
        >
          <ChevronRight size={16} />
        </button>
      </td>
    </tr>
  );
};
