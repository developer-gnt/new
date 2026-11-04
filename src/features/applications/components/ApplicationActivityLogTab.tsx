import React from 'react';
import type { MembershipApplicationItem } from '../types/applications.types';
import { History, CheckCircle2, Clock3, AlertCircle, ArrowDown } from 'lucide-react';

interface ApplicationActivityLogTabProps {
  application: MembershipApplicationItem;
}

export const ApplicationActivityLogTab: React.FC<ApplicationActivityLogTabProps> = ({
  application,
}) => {
  const logs = application.activityLog || [];

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
          marginBottom: '24px',
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
          <History size={20} />
        </div>
        <div>
          <h3
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '18px',
              fontWeight: 700,
              color: '#011F39',
              margin: '0 0 2px',
            }}
          >
            Review & Activity History
          </h3>
          <p style={{ fontSize: '13px', color: '#718096', margin: 0 }}>
            Chronological audit log of submission, review milestones, and administrative decisions.
          </p>
        </div>
      </div>

      <div style={{ position: 'relative', paddingLeft: '28px' }}>
        {/* Vertical track line */}
        <div
          style={{
            position: 'absolute',
            left: '14px',
            top: '12px',
            bottom: '12px',
            width: '2px',
            backgroundColor: '#DBE5EE',
          }}
        />

        {logs.map((log, idx) => {
          const isApproved = log.status === 'approved';
          const isRejected = log.status === 'rejected';
          const isUnderReview = log.status === 'under_review';

          const iconColor = isApproved
            ? '#059669'
            : isRejected
            ? '#DC2626'
            : isUnderReview
            ? '#D97706'
            : '#123F68';

          const iconBg = isApproved
            ? '#ECFDF5'
            : isRejected
            ? '#FEF2F2'
            : isUnderReview
            ? '#FFFBEB'
            : '#EFF6FF';

          const IconComponent = isApproved
            ? CheckCircle2
            : isRejected
            ? AlertCircle
            : isUnderReview
            ? Clock3
            : ArrowDown;

          return (
            <div
              key={log.id || idx}
              style={{
                position: 'relative',
                marginBottom: idx === logs.length - 1 ? 0 : '24px',
              }}
            >
              {/* Dot icon */}
              <div
                style={{
                  position: 'absolute',
                  left: '-28px',
                  top: '0px',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: iconBg,
                  color: iconColor,
                  border: `2px solid ${iconColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconComponent size={16} />
              </div>

              <div
                style={{
                  backgroundColor: '#FAF7F0',
                  border: '1px solid #EDF2F7',
                  borderRadius: '12px',
                  padding: '16px 20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '4px',
                  }}
                >
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#011F39' }}>
                    {log.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#718096', fontWeight: 500 }}>
                    {log.timestamp}
                  </div>
                </div>

                <div style={{ fontSize: '13px', color: '#34516D', lineHeight: 1.5 }}>
                  {log.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

