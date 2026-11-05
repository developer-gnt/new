import type React from 'react';
import { useState, useMemo } from 'react';
import { Search, Plus, RotateCcw, ListFilter } from 'lucide-react';
import type { JournalEntryItem } from '../types/accounting.types';
import { formatINR } from '../types/accounting.types';

interface JournalEntriesTableProps {
  entries: JournalEntryItem[];
  onAddEntry: () => void;
  onViewLines: (entry: JournalEntryItem) => void;
  onReverseEntry: (entry: JournalEntryItem) => void;
}

type StatusTab = 'ALL' | 'POSTED' | 'REVERSED';

export const JournalEntriesTable: React.FC<JournalEntriesTableProps> = ({
  entries,
  onAddEntry,
  onViewLines,
  onReverseEntry,
}) => {
  const [statusTab, setStatusTab] = useState<StatusTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const statusTabs: Array<{ id: StatusTab; label: string }> = [
    { id: 'ALL', label: 'All Entries' },
    { id: 'POSTED', label: 'Posted' },
    { id: 'REVERSED', label: 'Reversed' },
  ];

  const filteredEntries = useMemo(() => {
    let list = [...entries];

    if (statusTab === 'POSTED') {
      list = list.filter((e) => !e.is_reversed && e.entry_type !== 'REVERSAL');
    } else if (statusTab === 'REVERSED') {
      list = list.filter((e) => e.is_reversed || e.entry_type === 'REVERSAL');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (e) =>
          e.entry_number.toLowerCase().includes(q) ||
          (e.narration || '').toLowerCase().includes(q) ||
          (e.reference_type || '').toLowerCase().includes(q)
      );
    }

    return list;
  }, [entries, statusTab, searchQuery]);

  return (
    <div>
      {/* Controls Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        {/* Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            border: '1px solid #D1D5DB',
            borderRadius: '8px',
            padding: '0 12px',
            height: '40px',
            flex: '1 1 280px',
            maxWidth: '460px',
          }}
        >
          <Search size={16} color="#9CA3AF" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search journal number, narration or voucher ref..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              marginLeft: '8px',
              fontSize: '13.5px',
              backgroundColor: 'transparent',
            }}
          />
        </div>

        {/* Create Manual Journal CTA */}
        <button
          type="button"
          onClick={onAddEntry}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '9px 18px',
            fontSize: '13.5px',
            fontWeight: 600,
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#011F39',
            color: '#FAD465',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(1, 31, 57, 0.15)',
          }}
        >
          <Plus size={16} color="#FAD465" />
          <span>New Journal Entry</span>
        </button>
      </div>

      {/* Status Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          marginBottom: '20px',
          borderBottom: '1px solid #E5E7EB',
          paddingBottom: '2px',
        }}
      >
        {statusTabs.map((tab) => {
          const isActive = statusTab === tab.id;
          const count =
            tab.id === 'ALL'
              ? entries.length
              : tab.id === 'POSTED'
                ? entries.filter((e) => !e.is_reversed && e.entry_type !== 'REVERSAL').length
                : entries.filter((e) => e.is_reversed || e.entry_type === 'REVERSAL').length;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#011F39' : '#6B7280',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid #011F39' : '2px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                marginBottom: '-1px',
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '1px 6px',
                  borderRadius: '10px',
                  backgroundColor: isActive ? '#011F39' : '#F3F4F6',
                  color: isActive ? '#FAD465' : '#4B5563',
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', border: '1px solid #E5E7EB', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', textAlign: 'left' }}>
              <th style={thStyle}>Entry No & Date</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Narration / Particulars</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Total Debit (Dr.)</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Total Credit (Cr.)</th>
              <th style={thStyle}>Status</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => {
                const isReversed = entry.is_reversed || entry.entry_type === 'REVERSAL';

                return (
                  <tr
                    key={entry.id}
                    style={{
                      borderBottom: '1px solid #E5E7EB',
                      backgroundColor: isReversed ? '#FEF2F2' : '#FFFFFF',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    {/* Entry No & Date */}
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      <div
                        style={{
                          fontWeight: 700,
                          color: isReversed ? '#991B1B' : '#011F39',
                          textDecoration: entry.is_reversed ? 'line-through' : 'none',
                        }}
                      >
                        {entry.entry_number}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '2px' }}>
                        {entry.entry_date}
                      </div>
                    </td>

                    {/* Entry Type */}
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor:
                            entry.entry_type === 'REVERSAL'
                              ? '#FEE2E2'
                              : entry.entry_type === 'CLOSING'
                                ? '#FEF3C7'
                                : '#EFF6FF',
                          color:
                            entry.entry_type === 'REVERSAL'
                              ? '#DC2626'
                              : entry.entry_type === 'CLOSING'
                                ? '#B45309'
                                : '#1D4ED8',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {entry.entry_type}
                      </span>
                    </td>

                    {/* Narration */}
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle', maxWidth: '360px' }}>
                      <div style={{ color: '#1F2937', fontWeight: 500, fontSize: '13px' }}>
                        {entry.narration || '—'}
                      </div>
                      {entry.lines && (
                        <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '3px' }}>
                          {entry.lines.length} double-entry line{entry.lines.length === 1 ? '' : 's'}
                        </div>
                      )}
                    </td>

                    {/* Debit */}
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle', textAlign: 'right' }}>
                      <span style={{ fontWeight: 700, color: '#011F39' }}>
                        {formatINR(entry.total_debit)}
                      </span>
                    </td>

                    {/* Credit */}
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle', textAlign: 'right' }}>
                      <span style={{ fontWeight: 700, color: '#059669' }}>
                        {formatINR(entry.total_credit)}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '10px',
                          backgroundColor: entry.is_reversed ? '#FEE2E2' : '#ECFDF5',
                          color: entry.is_reversed ? '#DC2626' : '#059669',
                          border: entry.is_reversed ? '1px solid #FECACA' : '1px solid #A7F3D0',
                        }}
                      >
                        {entry.is_reversed ? 'Reversed' : 'Posted'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => onViewLines(entry)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '5px 10px',
                            fontSize: '12px',
                            fontWeight: 500,
                            borderRadius: '6px',
                            border: '1px solid #D1D5DB',
                            backgroundColor: '#FFFFFF',
                            color: '#011F39',
                            cursor: 'pointer',
                          }}
                        >
                          <ListFilter size={13} />
                          <span>Lines</span>
                        </button>

                        {!entry.is_reversed && entry.entry_type !== 'REVERSAL' && (
                          <button
                            type="button"
                            onClick={() => onReverseEntry(entry)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '5px 10px',
                              fontSize: '12px',
                              fontWeight: 600,
                              borderRadius: '6px',
                              border: '1px solid #FECACA',
                              backgroundColor: '#FEF2F2',
                              color: '#DC2626',
                              cursor: 'pointer',
                            }}
                            title="Reverse Journal Entry"
                          >
                            <RotateCcw size={13} />
                            <span>Reverse</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#6B7280' }}>
                  No journal vouchers found matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#4B5563',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};
