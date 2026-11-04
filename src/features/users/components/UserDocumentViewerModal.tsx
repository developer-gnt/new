import React from 'react';
import type { UserVerificationDocument } from '../types/user.types';
import { FileText, CheckCircle, X } from 'lucide-react';

interface UserDocumentViewerModalProps {
  isOpen: boolean;
  document: UserVerificationDocument | null;
  onClose: () => void;
  onVerify?: (docId: string, verified: boolean) => void;
}

export const UserDocumentViewerModal: React.FC<UserDocumentViewerModalProps> = ({
  isOpen,
  document,
  onClose,
  onVerify,
}) => {
  if (!isOpen || !document) return null;

  const isImage =
    document.fileType.startsWith('image/') ||
    Boolean(document.fileName.match(/\.(jpeg|jpg|png|webp|svg)$/i));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1060,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(1, 31, 57, 0.65)',
        backdropFilter: 'blur(4px)',
        padding: '20px',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #EDF2F7',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #EDF2F7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#011F39',
            color: '#FFFFFF',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} color="#FAD465" />
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>{document.title}</div>
              <div style={{ fontSize: '12px', color: '#DBE5EE' }}>
                {document.fileName} • {document.fileSize || '1.5 MB'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '12px',
                backgroundColor: document.verified ? '#059669' : '#D97706',
                color: '#FFFFFF',
              }}
            >
              {document.verified ? 'Verified' : 'Pending Verification'}
            </span>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '6px',
              }}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div
          style={{
            flex: 1,
            minHeight: '360px',
            maxHeight: '500px',
            overflow: 'auto',
            backgroundColor: '#FAF7F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          {isImage && document.fileUri ? (
            <img
              src={document.fileUri}
              alt={document.title}
              style={{
                maxWidth: '100%',
                maxHeight: '460px',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #EDF2F7',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                maxWidth: '400px',
              }}
            >
              <FileText size={48} color="#123F68" style={{ margin: '0 auto 12px' }} />
              <div
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#011F39',
                  marginBottom: '6px',
                }}
              >
                {document.title}
              </div>
              <div style={{ fontSize: '13px', color: '#718096', marginBottom: '16px' }}>
                Format: {document.fileType || 'PDF Document'} ({document.fileSize || 'Standard file'})
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: '#059669',
                  backgroundColor: '#ECFDF5',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  display: 'inline-block',
                }}
              >
                Official KYC verification document attached to user account
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid #EDF2F7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FFFFFF',
          }}
        >
          <div style={{ fontSize: '12px', color: '#718096' }}>
            Uploaded: {document.uploadedAt || 'N/A'}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {onVerify && !document.verified && (
              <button
                type="button"
                onClick={() => {
                  onVerify(document.id, true);
                  onClose();
                }}
                style={{
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: '#ECFDF5',
                  color: '#059669',
                  border: '1px solid #A7F3D0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CheckCircle size={15} /> Mark Verified
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: 600,
                backgroundColor: '#011F39',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
