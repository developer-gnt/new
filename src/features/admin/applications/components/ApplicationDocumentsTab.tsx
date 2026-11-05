import React, { useState } from 'react';
import type { MembershipApplicationItem, ApplicationDocument } from '../types/applications.types';
import { ApplicationDocumentViewerModal } from './ApplicationDocumentViewerModal';
import { FileText, Eye, CheckCircle, Clock } from 'lucide-react';

interface ApplicationDocumentsTabProps {
  application: MembershipApplicationItem;
}

export const ApplicationDocumentsTab: React.FC<ApplicationDocumentsTabProps> = ({
  application,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<ApplicationDocument | null>(null);

  const docs = application.documents || [];

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
          <FileText size={20} />
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
            Attached Verification Documents
          </h3>
          <p style={{ fontSize: '13px', color: '#718096', margin: 0 }}>
            Inspect identity credentials, income proof, or certificates submitted by {application.applicantName}.
          </p>
        </div>
      </div>

      {docs.length === 0 ? (
        <div
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            backgroundColor: '#FAF7F0',
            borderRadius: '12px',
            color: '#718096',
            fontSize: '14px',
          }}
        >
          No digital documents were uploaded with this application. Verification can be completed based on physical registration records.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
          }}
        >
          {docs.map(doc => (
            <div
              key={doc.id}
              style={{
                backgroundColor: '#FAF7F0',
                border: '1px solid #EDF2F7',
                borderRadius: '12px',
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DBE5EE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#011F39',
                    flexShrink: 0,
                  }}
                >
                  <FileText size={22} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#011F39',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={doc.title}
                  >
                    {doc.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#718096' }}>
                    {doc.fileName} • {doc.fileSize || '1.5 MB'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '8px',
                    backgroundColor: doc.verified ? '#ECFDF5' : '#FFFBEB',
                    color: doc.verified ? '#059669' : '#D97706',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {doc.verified ? <CheckCircle size={12} /> : <Clock size={12} />}
                  <span>{doc.verified ? 'Verified' : 'Pending'}</span>
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedDoc(doc)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DBE5EE',
                    borderRadius: '6px',
                    color: '#011F39',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Eye size={13} />
                  <span>View</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Viewer Modal */}
      <ApplicationDocumentViewerModal
        isOpen={Boolean(selectedDoc)}
        document={selectedDoc}
        applicantName={application.applicantName}
        onClose={() => setSelectedDoc(null)}
      />
    </div>
  );
};

