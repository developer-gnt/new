import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  Eye,
  CheckCircle2,
  XCircle,
  FileCheck,
  Calendar,
  Users,
} from 'lucide-react';
import type { AssistanceRequest } from '../types/assistance.types';
import { AssistanceStatusBadge } from './AssistanceStatusBadge';
import { URGENCY_CONFIG } from '../data/assistanceFixtures';

interface SeekerRowCardProps {
  request: AssistanceRequest;
  onView: (request: AssistanceRequest) => void;
  onReview: (request: AssistanceRequest) => void;
  onQuickApprove?: (request: AssistanceRequest) => void;
  onQuickReject?: (request: AssistanceRequest) => void;
}

export const SeekerRowCard: React.FC<SeekerRowCardProps> = ({
  request,
  onView,
  onReview,
  onQuickApprove,
  onQuickReject,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const displayId = `#DS${request.id.replace(/-/g, '').slice(0, 8).toUpperCase()}`;

  const isReviewable =
    request.status === 'PENDING' || request.status === 'UNDER_REVIEW';

  const raised = Number(request.raised_amount) || 0;
  const requested = Number(request.requested_amount) || 1;
  const raisedPct =
    requested > 0
      ? Math.min(100, Math.max(0, Math.round((raised / requested) * 100)))
      : 0;

  const formattedDate = request.created_at
    ? new Date(request.created_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

  const urgency = request.urgency || 'NORMAL';
  const urgencyStyle = URGENCY_CONFIG[urgency] || URGENCY_CONFIG.NORMAL;

  const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (name[0] || 'S').toUpperCase();
  };

  return (
    <tr
      style={{
        borderBottom: '1px solid #E5E7EB',
        transition: 'background-color 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#F9FAFB';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {/* Seeker Identity (Avatar, Name, ID, Age/Location) */}
      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#011F39',
              color: '#FAD465',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '15px',
              fontWeight: 700,
              flexShrink: 0,
              border: '2px solid #E5E7EB',
            }}
          >
            {getInitials(request.full_name)}
          </div>

          <div>
            <div
              onClick={() => onView(request)}
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#011F39',
                cursor: 'pointer',
              }}
            >
              {request.full_name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  backgroundColor: '#F3F4F6',
                  color: '#4B5563',
                  padding: '1px 6px',
                  borderRadius: '4px',
                }}
              >
                {displayId}
              </span>
              {request.city && (
                <span style={{ fontSize: '11.5px', color: '#6B7280' }}>
                  • {request.city}{request.state ? `, ${request.state}` : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Cause Category & Urgency */}
      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#011F39' }}>
          {request.reason}
        </div>
        <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 7px',
              borderRadius: '4px',
              backgroundColor: urgencyStyle.bg,
              color: urgencyStyle.color,
              border: `1px solid ${urgencyStyle.border}`,
            }}
          >
            {urgencyStyle.label}
          </span>
          {request.age && (
            <span style={{ fontSize: '11px', color: '#6B7280' }}>
              Age {request.age} yrs
            </span>
          )}
        </div>
      </td>

      {/* Funding Progress (Requested vs Raised) */}
      <td style={{ padding: '14px 16px', verticalAlign: 'middle', minWidth: '180px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
          <span style={{ fontWeight: 700, color: '#011F39' }}>
            ₹{raised.toLocaleString('en-IN')}
          </span>
          <span style={{ color: '#6B7280' }}>
            of ₹{requested.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '9999px',
            backgroundColor: '#E5E7EB',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${raisedPct}%`,
              height: '100%',
              borderRadius: '9999px',
              backgroundColor: raisedPct >= 100 ? '#059669' : '#011F39',
              transition: 'width 0.4s ease',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: raisedPct >= 100 ? '#059669' : '#4B5563' }}>
            {raisedPct}% funded
          </span>
          {request.donor_count !== undefined && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#6B7280' }}>
              <Users size={11} />
              <span>{request.donor_count} donors</span>
            </span>
          )}
        </div>
      </td>

      {/* Contact & Date */}
      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
        <div style={{ fontSize: '13px', fontWeight: 500, color: '#1F2937' }}>
          {request.mobile}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#6B7280', marginTop: '3px' }}>
          <Calendar size={12} color="#9CA3AF" />
          <span>{formattedDate}</span>
        </div>
      </td>

      {/* Lifecycle Status Badge */}
      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
        <AssistanceStatusBadge status={request.status} />
      </td>

      {/* Row Context Menu Actions */}
      <td style={{ padding: '14px 16px', verticalAlign: 'middle', textAlign: 'right' }}>
        <div style={{ position: 'relative', display: 'inline-block' }} ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              padding: '6px',
              borderRadius: '6px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF',
              color: '#4B5563',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Actions"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                marginTop: '4px',
                width: '190px',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                border: '1px solid #E5E7EB',
                zIndex: 50,
                padding: '4px 0',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onView(request);
                }}
                style={menuItemStyle}
              >
                <Eye size={15} color="#011F39" />
                <span>View Full Details</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onReview(request);
                }}
                style={menuItemStyle}
              >
                <FileCheck size={15} color="#2563EB" />
                <span>Review & Assess</span>
              </button>

              {isReviewable && (
                <>
                  <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '4px 0' }} />

                  {onQuickApprove && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onQuickApprove(request);
                      }}
                      style={{ ...menuItemStyle, color: '#059669' }}
                    >
                      <CheckCircle2 size={15} color="#059669" />
                      <span>Approve Cause</span>
                    </button>
                  )}

                  {onQuickReject && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onQuickReject(request);
                      }}
                      style={{ ...menuItemStyle, color: '#DC2626' }}
                    >
                      <XCircle size={15} color="#DC2626" />
                      <span>Decline Request</span>
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

const menuItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
  padding: '8px 14px',
  fontSize: '13px',
  fontWeight: 500,
  color: '#374151',
  background: 'none',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
};

