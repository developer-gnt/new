import type React from 'react';
import { useState } from 'react';
import { X, Download, FileSpreadsheet, FileText } from 'lucide-react';
import type { LedgerTransaction } from '../types/accounting.types';

interface PassbookExportModalProps {
  visible: boolean;
  onClose: () => void;
  transactions: LedgerTransaction[];
}

export const PassbookExportModal: React.FC<PassbookExportModalProps> = ({
  visible,
  onClose,
  transactions,
}) => {
  const [format, setFormat] = useState<'CSV' | 'PRINT'>('CSV');
  const [dateRange, setDateRange] = useState<'ALL' | 'CUSTOM'>('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  if (!visible) return null;

  const handleExport = () => {
    let toExport = [...transactions];
    if (dateRange === 'CUSTOM') {
      if (fromDate) toExport = toExport.filter((t) => t.entry_date >= fromDate);
      if (toDate) toExport = toExport.filter((t) => t.entry_date <= toDate);
    }

    if (format === 'CSV') {
      const headers = [
        'Date',
        'Voucher / Entry No',
        'Particulars / Narration',
        'Account Code',
        'Account Name',
        'Debit (Dr)',
        'Credit (Cr)',
        'Running Balance',
        'Payment Method',
        'Contributor / Beneficiary',
      ];
      const rows = toExport.map((t) => [
        t.entry_date,
        t.entry_number,
        `"${(t.narration || '').replace(/"/g, '""')}"`,
        t.account_code || '',
        `"${t.account_name}"`,
        t.debit,
        t.credit,
        t.running_balance,
        t.payment_method || '',
        `"${t.received_from || t.paid_to || ''}"`,
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `hrsjm_passbook_ledger_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.print();
    }

    onClose();
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
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={18} color="#FAD465" />
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#FAD465' }}>
              Export Passbook Statement
            </h3>
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

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Export Format</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setFormat('CSV')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: format === 'CSV' ? '2px solid #011F39' : '1px solid #D1D5DB',
                  backgroundColor: format === 'CSV' ? '#EFF6FF' : '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                <FileSpreadsheet size={18} color={format === 'CSV' ? '#1D4ED8' : '#6B7280'} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>CSV / Excel</div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>Data sheet format</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('PRINT')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: format === 'PRINT' ? '2px solid #011F39' : '1px solid #D1D5DB',
                  backgroundColor: format === 'PRINT' ? '#EFF6FF' : '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                <FileText size={18} color={format === 'PRINT' ? '#1D4ED8' : '#6B7280'} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>Print Slip</div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>Printable document</div>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Date Range Scope</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button
                type="button"
                onClick={() => setDateRange('ALL')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '6px',
                  border: dateRange === 'ALL' ? '2px solid #011F39' : '1px solid #D1D5DB',
                  backgroundColor: dateRange === 'ALL' ? '#EFF6FF' : '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                All Records ({transactions.length})
              </button>
              <button
                type="button"
                onClick={() => setDateRange('CUSTOM')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '6px',
                  border: dateRange === 'CUSTOM' ? '2px solid #011F39' : '1px solid #D1D5DB',
                  backgroundColor: dateRange === 'CUSTOM' ? '#EFF6FF' : '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Custom Range
              </button>
            </div>

            {dateRange === 'CUSTOM' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  style={inputStyle}
                />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
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
              type="button"
              onClick={handleExport}
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
                cursor: 'pointer',
              }}
            >
              <Download size={15} color="#FAD465" />
              <span>Download Statement</span>
            </button>
          </div>
        </div>
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
  fontSize: '12.5px',
  borderRadius: '6px',
  border: '1px solid #D1D5DB',
  backgroundColor: '#FFFFFF',
  color: '#111827',
  boxSizing: 'border-box',
  outline: 'none',
};
