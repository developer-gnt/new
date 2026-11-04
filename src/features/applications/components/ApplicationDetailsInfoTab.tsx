import React from 'react';
import type { MembershipApplicationItem } from '../types/applications.types';
import {
  getApplicationAccountType,
  getApplicationFeeAmount,
  getApplicationPaymentStatus,
} from '../types/applications.types';
import { User, AlertCircle } from 'lucide-react';

interface ApplicationDetailsInfoTabProps {
  application: MembershipApplicationItem;
}

export const ApplicationDetailsInfoTab: React.FC<ApplicationDetailsInfoTabProps> = ({
  application,
}) => {
  const isSeeker = getApplicationAccountType(application) === 'seeker';
  const feeAmount = getApplicationFeeAmount(application);
  const paymentStatus = getApplicationPaymentStatus(application);

  const fields = [
    { label: 'Full Name', value: application.applicantName || 'Applicant' },
    { label: 'Account Type', value: isSeeker ? 'Donor Seeker' : 'Membership' },
    {
      label: isSeeker ? 'Assistance Type' : 'Member Type',
      value: application.membershipType || 'Standard Member',
    },
    { label: 'Amount', value: feeAmount },
    { label: 'Payment Status', value: isSeeker ? 'Free / Exempt' : paymentStatus },
    { label: 'Date of Birth', value: application.dob || 'Not specified' },
    { label: 'Gender', value: application.gender || 'Not specified' },
    { label: 'Phone Number', value: application.phone || 'Not provided' },
    { label: 'Email Address', value: application.email || 'Not provided' },
    { label: 'Father / Husband Name', value: application.fatherName || 'Not specified' },
    { label: 'Occupation', value: application.occupation || 'Not specified' },
    { label: 'Address', value: application.address || 'Not specified' },
    { label: 'Nearby Police Station', value: application.policeStation || 'Not specified' },
  ];

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #EDF2F7',
        padding: '24px 28px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px',
          borderBottom: '1px solid #EDF2F7',
          paddingBottom: '14px',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#EFF6FF',
            color: '#1D4ED8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <User size={20} />
        </div>
        <h3
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '18px',
            fontWeight: 700,
            color: '#011F39',
            margin: 0,
          }}
        >
          Personal & Application Information
        </h3>
      </div>

      {application.rejectionReason && (
        <div
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
          }}
        >
          <AlertCircle size={18} color="#DC2626" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#DC2626' }}>
              Rejection Reason Recorded:
            </div>
            <div style={{ fontSize: '13px', color: '#7F1D1D' }}>
              {application.rejectionReason}
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px 24px',
        }}
      >
        {fields.map(field => (
          <div
            key={field.label}
            style={{
              padding: '10px 14px',
              backgroundColor: '#FAF7F0',
              borderRadius: '8px',
              border: '1px solid #EDF2F7',
            }}
          >
            <div style={{ fontSize: '11px', color: '#718096', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {field.label}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#011F39', marginTop: '4px' }}>
              {field.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

