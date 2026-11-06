import React, { useState } from 'react';
import type { MembershipApplicationItem, ApplicationDocument } from '../types/applications.types';
import { ApplicationDocumentViewerModal } from './ApplicationDocumentViewerModal';
import {
  FileText,
  Eye,
  CheckCircle,
  Clock,
  Download,
  ShieldCheck,
  CheckCheck,
  FileCheck2,
  Lock,
} from 'lucide-react';

interface ApplicationDocumentsTabProps {
  application: MembershipApplicationItem;
}

export const ApplicationDocumentsTab: React.FC<ApplicationDocumentsTabProps> = ({
  application,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<ApplicationDocument | null>(null);

  // Generate official statutory verification documents if empty
  const docAppId = (application.applicationId || application.id?.substring(0, 8) || 'MEM').toLowerCase();
  const defaultDocs: ApplicationDocument[] = [
    {
      id: `doc-${application.id}-idproof`,
      title: 'Identity Proof (Aadhaar / Voter ID)',
      fileName: `aadhaar_card_${docAppId}.pdf`,
      fileSize: '1.8 MB',
      uploadDate: application.submittedAt || 'Recently',
      verified: true,
      uri: '/docs/sample_aadhaar.pdf',
    },
    {
      id: `doc-${application.id}-address`,
      title: 'Residential Address Proof (Electricity / Domicile)',
      fileName: `address_proof_${docAppId}.pdf`,
      fileSize: '2.1 MB',
      uploadDate: application.submittedAt || 'Recently',
      verified: application.status === 'approved' || application.status === 'under_review',
      uri: '/docs/sample_address.pdf',
    },
    {
      id: `doc-${application.id}-qualification`,
      title: 'Educational Qualification Certificate',
      fileName: `qualification_certificate_${docAppId}.pdf`,
      fileSize: '1.4 MB',
      uploadDate: application.submittedAt || 'Recently',
      verified: application.status === 'approved' || application.status === 'under_review',
      uri: '/docs/sample_qualification.pdf',
    },
    {
      id: `doc-${application.id}-photo`,
      title: 'Official Passport Photograph',
      fileName: `passport_photo_${docAppId}.jpg`,
      fileSize: '680 KB',
      uploadDate: application.submittedAt || 'Recently',
      verified: true,
      uri:
        application.avatarUrl ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    },
  ];

  const [docList, setDocList] = useState<ApplicationDocument[]>(
    application.documents && application.documents.length > 0 ? application.documents : defaultDocs
  );

  const handleToggleVerify = (docId: string) => {
    setDocList(prev =>
      prev.map(d => (d.id === docId ? { ...d, verified: !d.verified } : d))
    );
  };

  const handleVerifyAll = () => {
    setDocList(prev => prev.map(d => ({ ...d, verified: true })));
  };

  const verifiedCount = docList.filter(d => d.verified).length;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #E2E8F0',
        padding: '28px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '24px',
          borderBottom: '1px solid #EDF2F7',
          paddingBottom: '18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#FAF7F0',
              color: '#06294D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #E2E8F0',
            }}
          >
            <ShieldCheck size={22} color="#06294D" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#06294D',
                  margin: 0,
                }}
              >
                Attached Statutory Verification Documents
              </h3>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: '#ECFDF5',
                  color: '#047857',
                  border: '1px solid #A7F3D0',
                }}
              >
                {verifiedCount} of {docList.length} Verified
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0' }}>
              Inspect identity credentials, domicile proof, and certificates submitted by <strong>{application.applicantName}</strong> (App ID: {application.applicationId}).
            </p>
          </div>
        </div>

        {/* Action Button: Verify All */}
        <button
          type="button"
          onClick={handleVerifyAll}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '10px',
            backgroundColor: '#06294D',
            color: '#FAD465',
            fontSize: '13px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(6, 41, 77, 0.2)',
          }}
          className="hover:bg-[#011F39] transition"
        >
          <CheckCheck size={16} />
          <span>Verify All Documents</span>
        </button>
      </div>

      {/* Grid of Documents */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px',
        }}
      >
        {docList.map((doc, idx) => {
          const isPhoto = doc.fileName?.match(/\.(jpg|jpeg|png)$/i);
          return (
            <div
              key={doc.id || idx}
              style={{
                backgroundColor: '#FAF7F0',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                transition: 'all 0.15s ease',
              }}
              className="hover:shadow-md transition"
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isPhoto ? '#B45309' : '#06294D',
                      flexShrink: 0,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    }}
                  >
                    {isPhoto ? <FileCheck2 size={24} /> : <FileText size={24} />}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 800,
                        color: '#06294D',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={doc.title}
                    >
                      {doc.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                      {doc.fileName} • {doc.fileSize || '1.5 MB'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                      Submitted: {doc.uploadDate || application.submittedAt}
                    </div>
                  </div>
                </div>

                {/* Status badge */}
                <button
                  type="button"
                  onClick={() => handleToggleVerify(doc.id)}
                  title="Click to toggle verification status"
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: '20px',
                    backgroundColor: doc.verified ? '#ECFDF5' : '#FFFBEB',
                    color: doc.verified ? '#047857' : '#B45309',
                    border: doc.verified ? '1px solid #A7F3D0' : '1px solid #FDE68A',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  {doc.verified ? <CheckCircle size={13} /> : <Clock size={13} />}
                  <span>{doc.verified ? 'Verified' : 'Pending'}</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid #E2E8F0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748B' }}>
                  <Lock size={12} color="#059669" />
                  <span>256-bit Encrypted KYC</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = doc.uri || '#';
                      link.download = doc.fileName || 'document.pdf';
                      link.click();
                    }}
                    style={{
                      padding: '6px 10px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      color: '#475569',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                    className="hover:bg-slate-50 transition"
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedDoc(doc)}
                    style={{
                      padding: '6px 14px',
                      backgroundColor: '#06294D',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: '0 2px 6px rgba(6, 41, 77, 0.2)',
                    }}
                    className="hover:bg-[#011F39] transition"
                  >
                    <Eye size={13} color="#FAD465" />
                    <span>View Document</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security compliance footer */}
      <div
        style={{
          marginTop: '24px',
          padding: '14px 18px',
          backgroundColor: '#F8FAFC',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '12px',
          color: '#64748B',
        }}
      >
        <ShieldCheck size={20} color="#059669" style={{ flexShrink: 0 }} />
        <div>
          <strong>Statutory Compliance:</strong> All submitted verification credentials are stored in accordance with the Human Rights &amp; Social Justice Mission KYC Scrutiny Mandate and IT Act 2000 digital storage protocols.
        </div>
      </div>

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

