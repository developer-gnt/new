import React, { useState } from 'react';
import type { MembershipApplicationItem } from '../types/applications.types';
import {
  getApplicationAccountType,
  getApplicationFeeAmount,
  getApplicationPaymentStatus,
} from '../types/applications.types';
import { Award, Copy, Check, Phone, Mail, Calendar, ShieldCheck } from 'lucide-react';

interface ApplicationApplicantSummaryCardProps {
  application: MembershipApplicationItem;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string; label: string; border: string }> = {
  submitted: { bg: '#FFFBEB', text: '#B45309', dot: '#F59E0B', label: 'Submitted', border: '#FDE68A' },
  under_review: { bg: '#FFFBEB', text: '#B45309', dot: '#F59E0B', label: 'Under Review', border: '#FDE68A' },
  approved: { bg: '#ECFDF5', text: '#047857', dot: '#10B981', label: 'Approved & Active', border: '#A7F3D0' },
  rejected: { bg: '#FEF2F2', text: '#B91C1C', dot: '#EF4444', label: 'Rejected', border: '#FECACA' },
};

export const ApplicationApplicantSummaryCard: React.FC<ApplicationApplicantSummaryCardProps> = ({
  application,
}) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const isSeeker = getApplicationAccountType(application) === 'seeker';
  const feeAmount = getApplicationFeeAmount(application);
  const paymentStatus = getApplicationPaymentStatus(application);
  const statusStyle = STATUS_STYLES[application.status] || STATUS_STYLES.submitted;

  React.useEffect(() => {
    setImgError(false);
  }, [application.avatarUrl]);

  const initials = application.applicantName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0].toUpperCase())
    .join('');

  const handleCopyId = () => {
    if (!application.applicationId) return;
    navigator.clipboard?.writeText(application.applicationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #E2E8F0',
        padding: '24px 28px',
        boxShadow: '0 4px 20px rgba(6, 41, 77, 0.05)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
        marginBottom: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top golden accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #06294D 0%, #FAD465 50%, #06294D 100%)',
        }}
      />

      {/* Left Column: Avatar + Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: '320px', flex: 1 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {application.avatarUrl && !imgError ? (
            <img
              src={application.avatarUrl}
              alt={application.applicantName}
              onError={() => setImgError(true)}
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #FAF7F0',
                boxShadow: '0 4px 14px rgba(6, 41, 77, 0.12)',
              }}
            />
          ) : (
            <div
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: isSeeker
                  ? 'linear-gradient(135deg, #B45309 0%, #D97706 100%)'
                  : 'linear-gradient(135deg, #06294D 0%, #011F39 100%)',
                color: isSeeker ? '#FFFFFF' : '#FAD465',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '28px',
                boxShadow: '0 4px 14px rgba(6, 41, 77, 0.15)',
                border: '3px solid #FAF7F0',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              {initials || 'A'}
            </div>
          )}

          {/* Verification Badge */}
          <div
            title="Verified Statutory Applicant"
            style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: '#FAD465',
              color: '#06294D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              border: '2px solid #FFFFFF',
            }}
          >
            <ShieldCheck size={14} strokeWidth={2.5} />
          </div>
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <h2
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '24px',
                fontWeight: 800,
                color: '#06294D',
                margin: 0,
                letterSpacing: '-0.01em',
              }}
            >
              {application.applicantName}
            </h2>

            {/* Role & Category Badges */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                backgroundColor: isSeeker ? '#FEF3C7' : '#06294D',
                color: isSeeker ? '#92400E' : '#FAD465',
              }}
            >
              <Award size={12} />
              {isSeeker ? 'Donation Seeker' : 'Official Member'}
            </span>
          </div>

          <div
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#475569',
              marginBottom: '8px',
            }}
          >
            {application.membershipType}
          </div>

          {/* Metadata Row: ID, Date, Phone */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              fontSize: '12px',
              color: '#64748B',
            }}
          >
            {/* Application ID with copy */}
            <button
              type="button"
              onClick={handleCopyId}
              title="Click to copy Application ID"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 9px',
                borderRadius: '6px',
                backgroundColor: '#FAF7F0',
                border: '1px solid #E2E8F0',
                color: '#06294D',
                fontFamily: 'monospace',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              className="hover:bg-slate-100 transition"
            >
              <span>{application.applicationId}</span>
              {copied ? <Check size={12} color="#059669" /> : <Copy size={12} color="#64748B" />}
            </button>

            {/* Submission date */}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={13} color="#94A3B8" />
              <span>{application.submittedAt}</span>
            </span>

            {/* Phone */}
            {application.phone && application.phone !== '—' && (
              <a
                href={`tel:${application.phone}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#0369A1',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
                className="hover:underline"
              >
                <Phone size={12} />
                <span>{application.phone}</span>
              </a>
            )}

            {/* Email */}
            {application.email && application.email !== '—' && (
              <a
                href={`mailto:${application.email}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#0369A1',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
                className="hover:underline"
              >
                <Mail size={12} />
                <span>{application.email}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Fee Box & Review Status */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '12px',
          minWidth: '220px',
        }}
      >
        {/* Status Pill */}
        <div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 16px',
              borderRadius: '24px',
              fontSize: '12px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              backgroundColor: statusStyle.bg,
              color: statusStyle.text,
              border: `1px solid ${statusStyle.border}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: statusStyle.dot,
                boxShadow: `0 0 0 2px ${statusStyle.dot}33`,
              }}
            />
            {statusStyle.label}
          </span>
        </div>

        {/* Fee & Payment Card */}
        <div
          style={{
            textAlign: 'right',
            backgroundColor: '#FAF7F0',
            padding: '10px 16px',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            width: '100%',
          }}
        >
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Fee / Financial Requirement
          </div>
          <div
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: '#06294D',
              lineHeight: 1.2,
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            {feeAmount}
          </div>
          <div style={{ marginTop: '4px' }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: '11px',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '6px',
                backgroundColor:
                  paymentStatus === 'PAID'
                    ? '#ECFDF5'
                    : paymentStatus === 'EXEMPT'
                    ? '#EFF6FF'
                    : '#FEF2F2',
                color:
                  paymentStatus === 'PAID'
                    ? '#059669'
                    : paymentStatus === 'EXEMPT'
                    ? '#1D4ED8'
                    : '#DC2626',
              }}
            >
              Payment: {paymentStatus} {paymentStatus === 'PAID' ? '• Cashfree Verified' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

