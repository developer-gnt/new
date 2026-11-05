import type React from 'react';
import { useState, useMemo, useSyncExternalStore, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Search,
  AlertCircle,
} from 'lucide-react';
import { accountingStore } from '../store/accountingStore';
import { formatINR } from '../types/accounting.types';

export const AccountLedgerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const storeSnapshot = useSyncExternalStore(
    accountingStore.subscribe,
    accountingStore.getSnapshot
  );

  const [searchQuery, setSearchQuery] = useState('');

  // Derive account reactively from store snapshot
  const account = id ? storeSnapshot.accounts.find((a) => a.id === id) || null : null;

  useEffect(() => {
    if (!account) {
      accountingStore.fetchAll();
    }
  }, [account]);

  // Transactions filtered to this account
  const accountTransactions = useMemo(() => {
    if (!id) return [];
    let list = storeSnapshot.transactions.filter((t) => t.account_id === id);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.entry_number.toLowerCase().includes(q) ||
          (t.narration || '').toLowerCase().includes(q) ||
          (t.received_from || '').toLowerCase().includes(q) ||
          (t.paid_to || '').toLowerCase().includes(q)
      );
    }

    return list;
  }, [id, storeSnapshot.transactions, searchQuery]);

  // Compute summary for this account
  const summary = useMemo(() => {
    let debits = 0;
    let credits = 0;
    for (const t of accountTransactions) {
      debits += Number(t.debit) || 0;
      credits += Number(t.credit) || 0;
    }
    const closing = account?.balance || 0;
    const opening = closing - debits + credits;
    return {
      opening,
      debits,
      credits,
      closing,
    };
  }, [accountTransactions, account]);

  const handleExportCsv = () => {
    if (!account) return;
    const headers = [
      'Date',
      'Voucher / Entry No',
      'Particulars',
      'Inflow / Debit (Dr)',
      'Outflow / Credit (Cr)',
      'Running Balance',
      'Party / Description',
    ];
    const rows = accountTransactions.map((t) => [
      t.entry_date,
      t.entry_number,
      `"${(t.narration || '').replace(/"/g, '""')}"`,
      t.debit,
      t.credit,
      t.running_balance,
      `"${t.received_from || t.paid_to || ''}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hrsjm_ledger_${account.account_code || 'account'}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!account) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', color: '#011F39' }}>Account Not Found</h2>
        <p style={{ color: '#6B7280', fontSize: '14px', margin: '8px 0 20px 0' }}>
          The requested general ledger account could not be found.
        </p>
        <button
          type="button"
          onClick={() => navigate('/admin/accounting?tab=accounts')}
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
          Return to Chart of Accounts
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Back button */}
      <div style={{ marginBottom: '16px' }}>
        <button
          type="button"
          onClick={() => navigate('/admin/accounting?tab=accounts')}
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
          <span>Back to Chart of Accounts</span>
        </button>
      </div>

      {/* Account Header Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          padding: '24px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '13px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '6px',
                backgroundColor: '#E5E7EB',
                color: '#011F39',
              }}
            >
              #{account.account_code || '—'}
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: '#EFF6FF',
                color: '#1D4ED8',
                border: '1px solid #BFDBFE',
              }}
            >
              {account.account_type}
            </span>
          </div>
          <h1
            style={{
              margin: '6px 0 0 0',
              fontSize: '22px',
              fontWeight: 700,
              color: '#011F39',
            }}
          >
            {account.account_name} — Running Ledger
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6B7280' }}>
            {account.description || 'Dedicated account general ledger running transaction statement'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={handleExportCsv}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
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
            <Download size={15} />
            <span>Export Statement</span>
          </button>
        </div>
      </div>

      {/* Account KPI Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div style={kpiBoxStyle}>
          <span style={kpiLabelStyle}>Opening Balance</span>
          <div style={kpiValueStyle}>{formatINR(summary.opening)}</div>
          <span style={kpiSubStyle}>Start balance</span>
        </div>

        <div style={kpiBoxStyle}>
          <span style={kpiLabelStyle}>Total Inflow (Debits)</span>
          <div style={{ ...kpiValueStyle, color: '#059669' }}>+ {formatINR(summary.debits)}</div>
          <span style={kpiSubStyle}>Credits into account</span>
        </div>

        <div style={kpiBoxStyle}>
          <span style={kpiLabelStyle}>Total Outflow (Credits)</span>
          <div style={{ ...kpiValueStyle, color: '#DC2626' }}>- {formatINR(summary.credits)}</div>
          <span style={kpiSubStyle}>Disbursements out</span>
        </div>

        <div style={{ ...kpiBoxStyle, backgroundColor: '#011F39', color: '#FFFFFF', border: 'none' }}>
          <span style={{ ...kpiLabelStyle, color: '#93C5FD' }}>Closing Balance</span>
          <div style={{ ...kpiValueStyle, color: '#FAD465' }}>{formatINR(summary.closing)}</div>
          <span style={{ ...kpiSubStyle, color: '#DBE5EE', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            Current running net balance
          </span>
        </div>
      </div>

      {/* Transactions Container */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          padding: '20px',
        }}
      >
        {/* Search */}
        <div style={{ marginBottom: '16px', maxWidth: '420px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              padding: '0 12px',
              height: '38px',
            }}
          >
            <Search size={15} color="#9CA3AF" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                marginLeft: '8px',
                fontSize: '13px',
              }}
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div style={{ overflowX: 'auto', border: '1px solid #E5E7EB', borderRadius: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', textAlign: 'left' }}>
                <th style={thStyle}>Date & Voucher</th>
                <th style={thStyle}>Particulars / Narration</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Debit (Dr. ₹)</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Credit (Cr. ₹)</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Running Balance</th>
              </tr>
            </thead>
            <tbody>
              {accountTransactions.length > 0 ? (
                accountTransactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 700, color: '#011F39' }}>{tx.entry_number}</div>
                      <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '2px' }}>
                        {tx.entry_date}
                      </div>
                    </td>

                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 600, color: '#111827' }}>
                        {tx.narration || 'General transaction'}
                      </div>
                      {(tx.received_from || tx.paid_to) && (
                        <div style={{ fontSize: '11.5px', color: '#4B5563', marginTop: '2px' }}>
                          Party: {tx.received_from || tx.paid_to}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      {tx.debit > 0 ? (
                        <span style={{ fontWeight: 700, color: '#059669' }}>
                          + {formatINR(tx.debit)}
                        </span>
                      ) : (
                        <span style={{ color: '#D1D5DB' }}>—</span>
                      )}
                    </td>

                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      {tx.credit > 0 ? (
                        <span style={{ fontWeight: 700, color: '#DC2626' }}>
                          - {formatINR(tx.credit)}
                        </span>
                      ) : (
                        <span style={{ color: '#D1D5DB' }}>—</span>
                      )}
                    </td>

                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <span style={{ fontWeight: 800, color: '#011F39' }}>
                        {formatINR(tx.running_balance)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: '#6B7280' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle size={24} color="#9CA3AF" />
                      <div>No transactions posted to this account yet.</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  padding: '10px 14px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#4B5563',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const kpiBoxStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  border: '1px solid #E5E7EB',
  padding: '16px 18px',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
};

const kpiLabelStyle: React.CSSProperties = {
  fontSize: '11.5px',
  fontWeight: 600,
  color: '#6B7280',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const kpiValueStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 700,
  color: '#011F39',
  marginTop: '4px',
};

const kpiSubStyle: React.CSSProperties = {
  fontSize: '11.5px',
  color: '#6B7280',
  marginTop: '8px',
  display: 'block',
};
