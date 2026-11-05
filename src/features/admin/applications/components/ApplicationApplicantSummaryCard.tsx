import React from 'react';
import type { MembershipApplicationItem } from '../types/applications.types';
import {
  getApplicationAccountType,
  getApplicationFeeAmount,
  getApplicationPaymentStatus,
} from '../types/applications.types';

interface ApplicationApplicantSummaryCardProps {
  application: MembershipApplicationItem;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  submitted: { bg: '#FFFBEB', text: '#D97706', dot: '#F59E0B', label: 'Submitted' },
  under_review: { bg: '#FFFBEB', text: '#D97706', dot: '#F59E0B', label: 'Under Review' },
  approved: { bg: '#ECFDF5', text: '#059669', dot: '#10B981', label: 'Approved' },
  rejected: { bg: '#FEF2F2', text: '#DC2626', dot: '#EF4444', label: 'Rejected' },
};

export const ApplicationApplicantSummaryCard: React.FC<ApplicationApplicantSummaryCardProps> = ({
  application,
}) => {
  const isSeeker = getApplicationAccountType(application) === 'seeker';
  const feeAmount = getApplicationFeeAmount(application);
  const paymentStatus = getApplicationPaymentStatus(application);
  const statusStyle = STATUS_STYLES[application.status] || STATUS_STYLES.submitted;

  const initials = application.applicantName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0].toUpperCase())
    .join('');

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #EDF2F7',
        padding: '24px 28px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
        marginBottom: '24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: '280px' }}>
        {application.avatarUrl ? (
          <img
            src={application.avatarUrl}
            alt={application.applicantName}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #EDF2F7',
              boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
            }}
          />
        ) : (
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: isSeeker ? '#B45309' : '#011F39',
              color: isSeeker ? '#FFFFFF' : '#FAD465',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '26px',
              boxShadow: '0 4px 10px rgba(1, 31, 57, 0.12)',
            }}
          >
            {initials || 'A'}
          </div>
        )}

        <div>
          <h2
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '22px',
              fontWeight: 700,
              color: '#011F39',
              margin: '0 0 6px',
            }}
          >
            {application.applicantName}
          </h2>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '6px',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '3px 10px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 700,
                backgroundColor: isSeeker ? '#FEF3C7' : '#EFF6FF',
                color: isSeeker ? '#B45309' : '#1D4ED8',
              }}
            >
              {isSeeker ? 'Donor Seeker' : 'Membership'}
            </span>

            <span style={{ fontSize: '13px', fontWeight: 600, color: '#34516D' }}>
              {application.membershipType}
            </span>
          </div>

          <div style={{ fontSize: '12px', color: '#718096' }}>
            Application ID: <strong>{application.applicationId}</strong> • Submitted: {application.submittedAt}
          </div>
        </div>
      </div>

      {/* Right Column: Amount & Status Badge */}
      <div style={{ textAlign: 'right', minWidth: '180px' }}>
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '12px', color: '#718096', marginBottom: '2px' }}>
            Application Fee / Requested
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#011F39' }}>
            {feeAmount}
          </div>
          <span
            style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '6px',
              marginTop: '4px',
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
            Payment: {paymentStatus}
          </span>
        </div>

        <div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '14px',
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor: statusStyle.bg,
              color: statusStyle.text,
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: statusStyle.dot,
              }}
            />
            Status: {statusStyle.label}
          </span>
        </div>
      </div>
    </div>
  );
};

