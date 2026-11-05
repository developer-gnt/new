import React, { useState } from 'react';
import type { ApplicationDocument } from '../types/applications.types';
import { FileText, X, ZoomIn, ZoomOut, CheckCircle, Download, ExternalLink } from 'lucide-react';

interface ApplicationDocumentViewerModalProps {
  isOpen: boolean;
  document: ApplicationDocument | null;
  applicantName?: string;
  onClose: () => void;
}

export const ApplicationDocumentViewerModal: React.FC<ApplicationDocumentViewerModalProps> = ({
  isOpen,
  document,
  applicantName,
  onClose,
}) => {
  const [zoom, setZoom] = useState(1);

  if (!isOpen || !document) return null;

  const isImage =
    Boolean(document.fileName?.match(/\.(jpeg|jpg|png|webp|svg)$/i)) ||
    Boolean(document.uri?.startsWith('data:image'));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1070,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(1, 31, 57, 0.7)',
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
          maxWidth: '740px',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
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
                {applicantName ? ` • Applicant: ${applicantName}` : ''}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {document.verified && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '12px',
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <CheckCircle size={12} /> Verified
              </span>
            )}
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
            minHeight: '380px',
            maxHeight: '520px',
            overflow: 'auto',
            backgroundColor: '#FAF7F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            position: 'relative',
          }}
        >
          {isImage && document.uri ? (
            <img
              src={document.uri}
              alt={document.title}
              style={{
                maxWidth: '100%',
                maxHeight: '460px',
                transform: `scale(${zoom})`,
                transition: 'transform 0.2s ease',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
              }}
            />
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 24px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #EDF2F7',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                maxWidth: '440px',
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
              <div style={{ fontSize: '13px', color: '#718096', marginBottom: '14px' }}>
                {document.fileName} ({document.fileSize || 'Standard PDF file'})
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: '#059669',
                  backgroundColor: '#ECFDF5',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  display: 'inline-block',
                }}
              >
                Legitimate verification document attached to online application
              </div>
            </div>
          )}

          {/* Zoom controls for images */}
          {isImage && (
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                display: 'flex',
                gap: '6px',
                backgroundColor: 'rgba(1, 31, 57, 0.8)',
                padding: '4px',
                borderRadius: '8px',
              }}
            >
              <button
                type="button"
                onClick={() => setZoom(z => Math.max(0.6, z - 0.2))}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  padding: '4px',
                }}
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <button
                type="button"
                onClick={() => setZoom(1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '4px 6px',
                }}
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                type="button"
                onClick={() => setZoom(z => Math.min(2.5, z + 0.2))}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  padding: '4px',
                }}
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid #EDF2F7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FFFFFF',
          }}
        >
          <div style={{ fontSize: '12px', color: '#718096' }}>
            Submitted Date: {document.uploadDate || 'Recently'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {document.uri ? (
              <a
                href={document.uri}
                target="_blank"
                rel="noopener noreferrer"
                download={document.fileName}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: '#FFFFFF',
                  color: '#011F39',
                  border: '1px solid #DBE5EE',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <Download size={14} />
                <span>Download / Open</span>
                <ExternalLink size={12} color="#718096" />
              </a>
            ) : null}
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

