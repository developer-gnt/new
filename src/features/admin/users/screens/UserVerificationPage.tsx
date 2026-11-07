import React, { useState, useSyncExternalStore } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usersStore } from '../store/usersStore';
import type { UserVerificationDocument } from '../types/user.types';
import { UserDocumentViewerModal } from '../components/UserDocumentViewerModal';
import {
  ChevronLeft,
  ShieldCheck,
  CheckCircle,
  XCircle,
  RefreshCw,
  FileText,
  AlertCircle,
} from 'lucide-react';

const REUPLOAD_REASONS = [
  'Document image is blurry or unreadable',
  'Document is expired or invalid',
  'Incorrect document type submitted',
  'Name on document does not match account',
  'Incomplete document / edges cropped',
];

export const UserVerificationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useSyncExternalStore(usersStore.subscribe, usersStore.getSnapshot);

  const user = id ? usersStore.getUserById(id) : undefined;

  const [adminNotes, setAdminNotes] = useState('');
  const [viewingDoc, setViewingDoc] = useState<UserVerificationDocument | null>(null);

  // Modals
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showReuploadModal, setShowReuploadModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState(REUPLOAD_REASONS[0]);
  const [customRejectReason, setCustomRejectReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  if (!user) {
    return (
      <div
        style={{
          maxWidth: '600px',
          margin: '60px auto',
          textAlign: 'center',
          backgroundColor: '#FFFFFF',
          padding: '40px 30px',
          borderRadius: '16px',
          border: '1px solid #EDF2F7',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        <AlertCircle size={48} color="#DC2626" style={{ margin: '0 auto 16px' }} />
        <h2
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '22px',
            color: '#011F39',
            margin: '0 0 8px',
          }}
        >
          User Not Found
        </h2>
        <p style={{ fontSize: '14px', color: '#718096', margin: '0 0 24px' }}>
          Cannot review verification because the user record does not exist.
        </p>
        <button
          type="button"
          onClick={() => navigate('/admin/users')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#011F39',
            color: '#FFFFFF',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Return to Users List
        </button>
      </div>
    );
  }

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      const res = await usersStore.verifyUser(user.id, 'approve', adminNotes);
      if (res.success) {
        setShowApproveModal(false);
        setActionSuccess(`Verification approved successfully for ${user.name}!`);
        setTimeout(() => navigate(`/admin/users/${user.id}`), 1200);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!customRejectReason.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await usersStore.verifyUser(
        user.id,
        'reject',
        adminNotes,
        customRejectReason.trim()
      );
      if (res.success) {
        setShowRejectModal(false);
        setActionSuccess(`Verification rejected. Account status updated for ${user.name}.`);
        setTimeout(() => navigate(`/admin/users/${user.id}`), 1200);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReupload = async () => {
    setIsSubmitting(true);
    try {
      const res = await usersStore.verifyUser(
        user.id,
        'reupload',
        adminNotes,
        selectedReason
      );
      if (res.success) {
        setShowReuploadModal(false);
        setActionSuccess(`Re-upload requested from ${user.name}.`);
        setTimeout(() => navigate(`/admin/users/${user.id}`), 1200);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleDocVerification = (docId: string, verified: boolean) => {
    usersStore.updateDocumentVerification(user.id, docId, verified);
  };

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0].toUpperCase())
    .join('');

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Back button */}
      <div style={{ marginBottom: '16px' }}>
        <button
          type="button"
          onClick={() => navigate(`/admin/users/${user.id}`)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#011F39',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <ChevronLeft size={18} />
          <span>Back to User Details</span>
        </button>
      </div>

      {actionSuccess && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#059669',
            padding: '14px 18px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '20px',
          }}
        >
          <CheckCircle size={20} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Header Profile Box */}
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
          gap: '20px',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#011F39',
              color: '#FAD465',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '22px',
            }}
          >
            {initials || 'U'}
          </div>
          <div>
            <h2
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '22px',
                fontWeight: 700,
                color: '#011F39',
                margin: '0 0 4px',
              }}
            >
              {user.name}
            </h2>
            <div style={{ fontSize: '13px', color: '#718096' }}>
              {user.email || 'No email'} • {user.phone || 'No phone'}
            </div>
            <div style={{ fontSize: '12px', color: '#123F68', marginTop: '4px', fontWeight: 600 }}>
              Role: {user.userType.toUpperCase()} | Application:{' '}
              {user.applicationNumber || user.memberId || `#${user.id.slice(-6)}`}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '6px 14px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor:
                user.status === 'active'
                  ? '#ECFDF5'
                  : user.status === 'pending'
                  ? '#FFFBEB'
                  : '#FEF2F2',
              color:
                user.status === 'active'
                  ? '#059669'
                  : user.status === 'pending'
                  ? '#D97706'
                  : '#DC2626',
            }}
          >
            Current Status: {user.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Submitted Documents Section */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #EDF2F7',
          padding: '24px 28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          marginBottom: '24px',
        }}
      >
        <div style={{ marginBottom: '20px', borderBottom: '1px solid #EDF2F7', paddingBottom: '14px' }}>
          <h3
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '18px',
              fontWeight: 700,
              color: '#011F39',
              margin: '0 0 4px',
            }}
          >
            Verification Documents Submitted
          </h3>
          <p style={{ fontSize: '13px', color: '#718096', margin: 0 }}>
            Inspect proof of identification, income, or eligibility documents before approving.
          </p>
        </div>

        {user.documents && user.documents.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {user.documents.map(doc => (
              <div
                key={doc.id}
                style={{
                  border: '1px solid #EDF2F7',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  backgroundColor: '#FAF7F0',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #DBE5EE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#123F68',
                    }}
                  >
                    <FileText size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#011F39' }}>
                      {doc.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>
                      {doc.fileName} • {doc.fileSize || 'Standard file'} • Uploaded: {doc.uploadedAt || 'N/A'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setViewingDoc(doc)}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #DBE5EE',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#011F39',
                      cursor: 'pointer',
                    }}
                  >
                    Preview Document
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleDocVerification(doc.id, !doc.verified)}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: doc.verified ? '#ECFDF5' : '#FFFBEB',
                      border: '1px solid',
                      borderColor: doc.verified ? '#A7F3D0' : '#FDE68A',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: doc.verified ? '#059669' : '#D97706',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {doc.verified ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                    <span>{doc.verified ? 'Verified' : 'Mark Verified'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '30px 20px',
              textAlign: 'center',
              backgroundColor: '#FAF7F0',
              borderRadius: '10px',
              color: '#718096',
              fontSize: '13px',
            }}
          >
            No digital documents uploaded by this user yet. You may still approve based on offline verification.
          </div>
        )}
      </div>

      {/* Admin Review Notes & Decisions Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #EDF2F7',
          padding: '24px 28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <h3
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '18px',
            fontWeight: 700,
            color: '#011F39',
            margin: '0 0 14px',
          }}
        >
          Admin Verification Notes
        </h3>

        <textarea
          value={adminNotes}
          onChange={e => setAdminNotes(e.target.value)}
          placeholder="Add verification notes, background check findings, or instructions for this user..."
          rows={3}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '12px 14px',
            fontSize: '14px',
            borderRadius: '10px',
            border: '1px solid #DBE5EE',
            backgroundColor: '#FFFFFF',
            color: '#011F39',
            outline: 'none',
            fontFamily: 'inherit',
            resize: 'vertical',
            marginBottom: '24px',
          }}
        />

        {/* Action Buttons Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            borderTop: '1px solid #EDF2F7',
            paddingTop: '20px',
          }}
        >
          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Request Re-upload */}
            <button
              type="button"
              onClick={() => setShowReuploadModal(true)}
              style={{
                padding: '10px 18px',
                backgroundColor: '#FFFBEB',
                color: '#D97706',
                border: '1px solid #FDE68A',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <RefreshCw size={15} /> Request Re-upload
            </button>

            {/* Reject Verification */}
            <button
              type="button"
              onClick={() => setShowRejectModal(true)}
              style={{
                padding: '10px 18px',
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                border: '1px solid #FECACA',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <XCircle size={15} /> Reject
            </button>
          </div>

          {/* Approve Verification */}
          <button
            type="button"
            onClick={() => setShowApproveModal(true)}
            style={{
              padding: '10px 24px',
              backgroundColor: '#059669',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)',
            }}
          >
            <ShieldCheck size={17} /> Approve Verification
          </button>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1050,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(1, 31, 57, 0.55)',
            backdropFilter: 'blur(3px)',
            padding: '16px',
          }}
          onClick={() => setShowApproveModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '28px 24px 24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#ECFDF5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <ShieldCheck size={32} />
              </div>
              <h3
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#011F39',
                  margin: '0 0 8px',
                }}
              >
                Approve Verification?
              </h3>
              <p style={{ fontSize: '14px', color: '#34516D', margin: 0, lineHeight: 1.5 }}>
                Are you sure you want to approve KYC verification for <strong>{user.name}</strong>?
                {user.userType === 'seeker' &&
                  ' This will promote their role to approved Donation Seeker on the platform.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setShowApproveModal(false)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: '#EDF2F7',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#34516D',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleApprove}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: '#059669',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? 'Approving...' : 'Confirm Approval'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1050,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(1, 31, 57, 0.55)',
            backdropFilter: 'blur(3px)',
            padding: '16px',
          }}
          onClick={() => setShowRejectModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '28px 24px 24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#FEF2F2',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <XCircle size={32} />
              </div>
              <h3
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#011F39',
                  margin: '0 0 8px',
                }}
              >
                Reject Verification
              </h3>
              <p style={{ fontSize: '13px', color: '#34516D', margin: 0 }}>
                Please specify a reason for rejecting verification for <strong>{user.name}</strong>.
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#011F39',
                  marginBottom: '6px',
                }}
              >
                Rejection Reason <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <textarea
                value={customRejectReason}
                onChange={e => setCustomRejectReason(e.target.value)}
                placeholder="e.g. Identity documents cannot be verified with authorities"
                rows={3}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px 14px',
                  fontSize: '13px',
                  borderRadius: '8px',
                  border: '1px solid #DBE5EE',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: '#EDF2F7',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#34516D',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting || !customRejectReason.trim()}
                onClick={handleReject}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: '#DC2626',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: isSubmitting || !customRejectReason.trim() ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting || !customRejectReason.trim() ? 0.6 : 1,
                }}
              >
                {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Re-upload Modal */}
      {showReuploadModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1050,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(1, 31, 57, 0.55)',
            backdropFilter: 'blur(3px)',
            padding: '16px',
          }}
          onClick={() => setShowReuploadModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '28px 24px 24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFBEB',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <RefreshCw size={28} />
              </div>
              <h3
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#011F39',
                  margin: '0 0 8px',
                }}
              >
                Request Document Re-upload
              </h3>
              <p style={{ fontSize: '13px', color: '#34516D', margin: 0 }}>
                Select the issue with the current document so {user.name} can upload an updated copy.
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#011F39',
                  marginBottom: '10px',
                }}
              >
                Reason for Re-upload
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {REUPLOAD_REASONS.map(r => (
                  <label
                    key={r}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: selectedReason === r ? '#FAF7F0' : '#FFFFFF',
                      border: selectedReason === r ? '1px solid #011F39' : '1px solid #DBE5EE',
                      fontSize: '13px',
                      color: '#011F39',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="reuploadReason"
                      checked={selectedReason === r}
                      onChange={() => setSelectedReason(r)}
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setShowReuploadModal(false)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: '#EDF2F7',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#34516D',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleReupload}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: '#D97706',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? 'Sending...' : 'Request Re-upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      <UserDocumentViewerModal
        isOpen={Boolean(viewingDoc)}
        document={viewingDoc}
        onClose={() => setViewingDoc(null)}
        onVerify={docId => handleToggleDocVerification(docId, true)}
      />
    </div>
  );
};
