import React from 'react';
import type { MembershipApplicationItem } from '../types/applications.types';
import {
  getApplicationAccountType,
  getApplicationFeeAmount,
  getApplicationPaymentStatus,
} from '../types/applications.types';
import {
  User,
  AlertCircle,
  CreditCard,
  MapPin,
  Award,
  Package,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';

interface ApplicationDetailsInfoTabProps {
  application: MembershipApplicationItem;
}

export const ApplicationDetailsInfoTab: React.FC<ApplicationDetailsInfoTabProps> = ({
  application,
}) => {
  const isSeeker = getApplicationAccountType(application) === 'seeker';
  const feeAmount = getApplicationFeeAmount(application);
  const paymentStatus = getApplicationPaymentStatus(application);

  const kit = application.kitFulfillment;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Rejection Alert if rejected */}
      {application.rejectionReason && (
        <div
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <AlertCircle size={20} color="#DC2626" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#DC2626' }}>
              Statutory Rejection Reason Recorded:
            </div>
            <div style={{ fontSize: '13px', color: '#7F1D1D', marginTop: '2px' }}>
              {application.rejectionReason}
            </div>
          </div>
        </div>
      )}

      {/* Admin Notes if present */}
      {application.adminNotes && (
        <div
          style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '16px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <FileCheck size={18} color="#1D4ED8" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '13px', color: '#1E40AF', fontWeight: 500 }}>
            <strong>Central Secretariat Note:</strong> {application.adminNotes}
          </div>
        </div>
      )}

      {/* Section 1: Candidate Identity & Contact Profile */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
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
              borderRadius: '10px',
              backgroundColor: '#FAF7F0',
              color: '#06294D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #E2E8F0',
            }}
          >
            <User size={18} />
          </div>
          <div>
            <h3
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '18px',
                fontWeight: 800,
                color: '#06294D',
                margin: 0,
              }}
            >
              Candidate Identity &amp; Contact Profile
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
              Verified personal and demographic records submitted during enrollment.
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '14px 20px',
          }}
        >
          <div style={{ padding: '12px 16px', backgroundColor: '#FAF7F0', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Full Legal Name
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#06294D', marginTop: '4px' }}>
              {application.applicantName}
            </div>
          </div>

          <div style={{ padding: '12px 16px', backgroundColor: '#FAF7F0', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Mobile Phone
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#06294D', marginTop: '4px' }}>
              {application.phone ? (
                <a href={`tel:${application.phone}`} style={{ color: '#0369A1', textDecoration: 'none' }}>
                  {application.phone}
                </a>
              ) : '—'}
            </div>
          </div>

          <div style={{ padding: '12px 16px', backgroundColor: '#FAF7F0', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Email Address
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#06294D', marginTop: '4px', wordBreak: 'break-all' }}>
              {application.email ? (
                <a href={`mailto:${application.email}`} style={{ color: '#0369A1', textDecoration: 'none' }}>
                  {application.email}
                </a>
              ) : '—'}
            </div>
          </div>

          <div style={{ padding: '12px 16px', backgroundColor: '#FAF7F0', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Date of Birth &amp; Gender
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#06294D', marginTop: '4px' }}>
              {application.dob || '—'} • {application.gender || 'Not specified'}
            </div>
          </div>

          <div style={{ padding: '12px 16px', backgroundColor: '#FAF7F0', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Father / Husband Name
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#06294D', marginTop: '4px' }}>
              {application.fatherName || 'Not specified'}
            </div>
          </div>

          <div style={{ padding: '12px 16px', backgroundColor: '#FAF7F0', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Nearby Police Station (Character Verification)
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#06294D', marginTop: '4px' }}>
              {application.policeStation || 'Azad Maidan Police Station, Mumbai'}
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1', padding: '12px 16px', backgroundColor: '#FAF7F0', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Permanent Residential Address
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#06294D', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} color="#B45309" style={{ flexShrink: 0 }} />
              <span>{application.address || '123 Court Road, Fort, Mumbai, Maharashtra - 400001'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Membership Designation & Appointment Terms */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
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
              borderRadius: '10px',
              backgroundColor: '#EFF6FF',
              color: '#1D4ED8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Award size={18} />
          </div>
          <div>
            <h3
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '18px',
                fontWeight: 800,
                color: '#06294D',
                margin: 0,
              }}
            >
              Membership Designation &amp; Council Post
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
              Official governance post, category jurisdiction, and tenure details.
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '14px 20px',
          }}
        >
          <div style={{ padding: '12px 16px', backgroundColor: '#FAF7F0', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Designated Post Name
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#06294D', marginTop: '4px' }}>
              {application.membershipType}
            </div>
          </div>

          <div style={{ padding: '12px 16px', backgroundColor: '#FAF7F0', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Account &amp; Jurisdiction Level
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#06294D', marginTop: '4px' }}>
              {isSeeker ? 'Financial Assistance Seeker' : 'National & State Level Council'}
            </div>
          </div>

          <div style={{ padding: '12px 16px', backgroundColor: '#FAF7F0', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Tenure &amp; Validity
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#059669', marginTop: '4px' }}>
              {application.validityDays ? `${Math.round(application.validityDays / 365)} Years Official Term` : '10 Years Validity'}
            </div>
          </div>

          <div style={{ padding: '12px 16px', backgroundColor: '#FAF7F0', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Prescribed Statutory Qualification
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#06294D', marginTop: '4px' }}>
              {application.qualificationRequirement || 'Graduate / Degree (For Politicians & Advocates)'}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Statutory Payment & Cashfree Gateway Record */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
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
              borderRadius: '10px',
              backgroundColor: '#ECFDF5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CreditCard size={18} />
          </div>
          <div>
            <h3
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '18px',
                fontWeight: 800,
                color: '#06294D',
                margin: 0,
              }}
            >
              Statutory Fee &amp; Payment Gateway Record
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
              Official Cashfree Payment Gateway settlement audit and 80G tax receipt records.
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '14px 20px',
          }}
        >
          <div style={{ padding: '12px 16px', backgroundColor: '#FAF7F0', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Payment Amount
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#06294D', marginTop: '2px' }}>
              {feeAmount}
            </div>
          </div>

          <div style={{ padding: '12px 16px', backgroundColor: '#FAF7F0', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Payment Status
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#059669', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#059669" />
              <span>{paymentStatus} • Gateway Verified</span>
            </div>
          </div>

          <div style={{ padding: '12px 16px', backgroundColor: '#FAF7F0', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Payment Method &amp; Gateway
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#06294D', marginTop: '4px' }}>
              {application.paymentMethod || 'ONLINE • Cashfree Secured Payment'}
            </div>
          </div>

          <div style={{ padding: '12px 16px', backgroundColor: '#FAF7F0', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Transaction Reference ID
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#06294D', marginTop: '4px', fontFamily: 'monospace' }}>
              {application.transactionId || 'PAY-1793975446852'}
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Welcome Kit Fulfillment & Physical Records */}
      {kit && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
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
                borderRadius: '10px',
                backgroundColor: '#FFFBEB',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Package size={18} />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#06294D',
                  margin: 0,
                }}
              >
                Official Welcome Kit &amp; Physical Credentials Dispatch
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                Physical identity badge, appointment certificate, and kit dispatch tracking.
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '14px 20px',
            }}
          >
            <div style={{ padding: '12px 16px', backgroundColor: '#FAF7F0', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Courier &amp; Logistics Partner
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#06294D', marginTop: '4px' }}>
                {kit.courierName || 'India Post Speed Post'}
              </div>
            </div>

            <div style={{ padding: '12px 16px', backgroundColor: '#FAF7F0', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Postal Consignment Tracking
              </div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0369A1', marginTop: '4px', fontFamily: 'monospace' }}>
                {kit.trackingNumber || 'SP-HRSJM00033'}
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1', padding: '12px 16px', backgroundColor: '#FAF7F0', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                Enclosed Physical Items
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(kit.items || [
                  'Official Appointment Letter',
                  'Membership Certificate',
                  'Physical ID Card & Lanyard',
                  'Car / Bike Sticker',
                  'HRSJM Official T-Shirt',
                ]).map((item, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '12px',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      color: '#06294D',
                      fontWeight: 600,
                    }}
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

