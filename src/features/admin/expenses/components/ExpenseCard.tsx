import type React from 'react';
import { FileText, ChevronRight } from 'lucide-react';
import type { ExpenseEntryItem } from '../types/expenses.types';
import { formatINR } from '../types/expenses.types';

export const ExpenseListHeader: React.FC = () => {
  return (
    <div style={styles.headerRow}>
      <div style={{ flex: '1.8 1 180px' }}>
        <span style={styles.headerText}>Voucher & Date</span>
      </div>
      <div style={{ flex: '2.5 1 250px' }}>
        <span style={styles.headerText}>Expense Account & Payee</span>
      </div>
      <div style={{ flex: '1.2 1 120px' }}>
        <span style={styles.headerText}>Payment Source</span>
      </div>
      <div style={{ flex: '1 1 100px' }}>
        <span style={styles.headerText}>Status</span>
      </div>
      <div style={{ flex: '1.4 1 140px', textAlign: 'right' }}>
        <span style={styles.headerText}>Amount</span>
      </div>
      <div style={{ flex: '0.4 1 40px', textAlign: 'right' }}>
        <span style={styles.headerText} />
      </div>
    </div>
  );
};

export const ExpenseCard: React.FC<{
  voucher: ExpenseEntryItem;
  onPress: (voucher: ExpenseEntryItem) => void;
}> = ({ voucher, onPress }) => {
  const isCancelled = voucher.status === 'CANCELLED';
  const accountName = voucher.expense_account?.account_name || 'Expense';
  const paidFrom = voucher.paid_from_account?.account_name || voucher.payment_method || 'Bank Transfer';

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

  return (
    <div
      style={styles.cardRow}
      onClick={() => onPress(voucher)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onPress(voucher);
      }}
    >
      {/* Col 1: Voucher Number, Icon & Date */}
      <div style={{ ...styles.col, flex: '1.8 1 180px' }}>
        <div style={styles.iconCircle}>
          <FileText size={16} color="#DC2626" />
        </div>
        <div style={styles.voucherCol}>
          <span style={styles.voucherNumber}>{voucher.voucher_number}</span>
          <span style={styles.dateText}>{formatDate(voucher.expense_date)}</span>
        </div>
      </div>

      {/* Col 2: Expense Account & Payee */}
      <div style={{ ...styles.col, flex: '2.5 1 250px' }}>
        <div style={styles.detailsCol}>
          <span style={styles.accountName}>{accountName}</span>
          <span style={styles.payeeText}>
            Paid to <strong style={{ color: '#0F172A' }}>{voucher.paid_to}</strong>
          </span>
          {voucher.reference_number && (
            <span style={styles.refText}>Ref: {voucher.reference_number}</span>
          )}
        </div>
      </div>

      {/* Col 3: Payment Method / Account Source */}
      <div style={{ ...styles.col, flex: '1.2 1 120px' }}>
        <div style={styles.methodPill}>
          <span style={styles.methodDot} />
          <span style={styles.methodText}>{paidFrom}</span>
        </div>
      </div>

      {/* Col 4: Status */}
      <div style={{ ...styles.col, flex: '1 1 100px' }}>
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

      {/* Col 5: Amount */}
      <div
        style={{
          ...styles.col,
          flex: '1.4 1 140px',
          justifyContent: 'flex-end',
          textAlign: 'right',
        }}
      >
        <span
          style={{
            ...styles.amountText,
            color: isCancelled ? '#94A3B8' : '#0B2F52',
            textDecoration: isCancelled ? 'line-through' : 'none',
          }}
        >
          {formatINR(voucher.amount)}
        </span>
      </div>

      {/* Col 6: Arrow */}
      <div
        style={{
          ...styles.col,
          flex: '0.4 1 40px',
          justifyContent: 'flex-end',
        }}
      >
        <ChevronRight size={16} color="#94A3B8" />
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 18px',
    backgroundColor: '#F8FAFC',
    borderRadius: '8px 8px 0 0',
    border: '1px solid #E2E8F0',
    borderBottom: 'none',
  },
  headerText: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    fontFamily: 'Inter, sans-serif',
  },
  cardRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 18px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderTop: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
  col: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    minWidth: 0,
  },
  iconCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FECACA',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  voucherCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
  },
  voucherNumber: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#0B2F52',
    fontFamily: 'Inter, sans-serif',
  },
  dateText: {
    fontSize: '12px',
    color: '#64748B',
  },
  detailsCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
    overflow: 'hidden',
  },
  accountName: {
    fontSize: '13.5px',
    fontWeight: 600,
    color: '#0F172A',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  payeeText: {
    fontSize: '12px',
    color: '#64748B',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  refText: {
    fontSize: '11px',
    color: '#94A3B8',
  },
  methodPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '12px',
    backgroundColor: '#F1F5F9',
    maxWidth: '180px',
  },
  methodDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#0284C7',
    flexShrink: 0,
  },
  methodText: {
    fontSize: '11.5px',
    color: '#334155',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
    border: '1px solid',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },
  amountText: {
    fontSize: '15px',
    fontWeight: 700,
    fontFamily: 'Inter, sans-serif',
  },
};
