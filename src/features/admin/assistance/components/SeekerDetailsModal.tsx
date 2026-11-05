import type React from 'react';
import { useState } from 'react';
import {
  X,
  Phone,
  Mail,
  Copy,
  Check,
  Heart,
  FileCheck,
  FileText,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldCheck,
  Save,
} from 'lucide-react';
import type { AssistanceRequest, AssistanceStatus } from '../types/assistance.types';
import { AssistanceStatusBadge } from './AssistanceStatusBadge';
import { URGENCY_CONFIG } from '../data/assistanceFixtures';
import { assistanceStore } from '../store/assistanceStore';

interface SeekerDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  request: AssistanceRequest | null;
  initialTab?: 'OVERVIEW' | 'REVIEW' | 'DOCUMENTS';
  onStatusUpdated?: () => void;
}

export const SeekerDetailsModal: React.FC<SeekerDetailsModalProps> = ({
  visible,
  onClose,
  request,
  initialTab = 'OVERVIEW',
  onStatusUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'REVIEW' | 'DOCUMENTS'>(initialTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Review & Assessment State
  const [targetStatus, setTargetStatus] = useState<AssistanceStatus>(
    request?.status || 'APPROVED'
  );
  const [adminRemark, setAdminRemark] = useState(request?.admin_remark || '');
  const [checkId, setCheckId] = useState(true);
  const [checkNeed, setCheckNeed] = useState(true);
  const [checkDoc, setCheckDoc] = useState(true);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  if (!visible || !request) return null;

  const displayId = `#DS${request.id.replace(/-/g, '').slice(0, 8).toUpperCase()}`;

  const raised = Number(request.raised_amount) || 0;
  const requested = Number(request.requested_amount) || 1;
  const raisedPct =
    requested > 0
      ? Math.min(100, Math.max(0, Math.round((raised / requested) * 100)))
      : 0;

  const urgency = request.urgency || 'NORMAL';
  const urgencyStyle = URGENCY_CONFIG[urgency] || URGENCY_CONFIG.NORMAL;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleApplyStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      await assistanceStore.updateStatus(
        request.id,
        targetStatus,
        adminRemark.trim() || undefined
      );
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
      onStatusUpdated?.();
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const formattedCreatedDate = request.created_at
    ? new Date(request.created_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

  const formattedReviewedDate = request.reviewed_at
    ? new Date(request.reviewed_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(1, 31, 57, 0.55)',
        backdropFilter: 'blur(3px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div
          style={{
            padding: '20px 24px',
            backgroundColor: '#011F39',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: '#023158',
                color: '#FAD465',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 800,
                border: '2px solid #FAD465',
                flexShrink: 0,
              }}
            >
              {request.full_name.charAt(0).toUpperCase()}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
                  {request.full_name}
                </h2>
                <AssistanceStatusBadge status={request.status} size="sm" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#FAD465',
                    fontWeight: 600,
                  }}
                >
                  {displayId}
                </span>
                <span style={{ color: '#64748B' }}>•</span>
                <span style={{ fontSize: '12.5px', color: '#DBE5EE' }}>
                  {request.reason}
                </span>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 600,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    backgroundColor: urgencyStyle.bg,
                    color: urgencyStyle.color,
                  }}
                >
                  {urgencyStyle.label}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #E5E7EB',
            backgroundColor: '#F9FAFB',
            padding: '0 16px',
          }}
        >
          {[
            { id: 'OVERVIEW' as const, label: 'Case Overview', icon: Heart },
            { id: 'REVIEW' as const, label: 'Review & Assessment', icon: FileCheck },
            { id: 'DOCUMENTS' as const, label: 'Supporting Documents', icon: FileText, count: request.documents?.length || 0 },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 18px',
                  border: 'none',
                  background: 'transparent',
                  fontSize: '13.5px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#011F39' : '#6B7280',
                  borderBottom: isActive ? '3px solid #011F39' : '3px solid transparent',
                  cursor: 'pointer',
                  marginBottom: '-1px',
                }}
              >
                <Icon size={15} color={isActive ? '#011F39' : '#6B7280'} />
                <span>{t.label}</span>
                {typeof t.count === 'number' && (
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '1px 6px',
                      borderRadius: '9999px',
                      backgroundColor: isActive ? '#011F39' : '#E5E7EB',
                      color: isActive ? '#FFFFFF' : '#4B5563',
                    }}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Contact & Quick ID Strip */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#FAF7F0',
                  border: '1px solid #F3E8D2',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <a
                    href={`tel:${request.mobile}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#011F39',
                      textDecoration: 'none',
                    }}
                  >
                    <Phone size={15} color="#00A859" />
                    <span>{request.mobile}</span>
                  </a>
                  {request.email && (
                    <>
                      <span style={{ color: '#D1D5DB' }}>|</span>
                      <a
                        href={`mailto:${request.email}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '13px',
                          fontWeight: 500,
                          color: '#011F39',
                          textDecoration: 'none',
                        }}
                      >
                        <Mail size={15} color="#2563EB" />
                        <span>{request.email}</span>
                      </a>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(request.id, 'id')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#FFFFFF',
                    color: '#374151',
                    cursor: 'pointer',
                  }}
                >
                  {copiedKey === 'id' ? <Check size={14} color="#00A859" /> : <Copy size={14} />}
                  <span>{copiedKey === 'id' ? 'Copied' : 'Copy Case ID'}</span>
                </button>
              </div>

              {/* Funding Progress Card */}
              <div
                style={{
                  padding: '18px 20px',
                  borderRadius: '10px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>
                      Fundraising Target & Disbursements
                    </span>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#011F39', marginTop: '2px' }}>
                      ₹{raised.toLocaleString('en-IN')}{' '}
                      <span style={{ fontSize: '15px', fontWeight: 500, color: '#6B7280' }}>
                        raised of ₹{requested.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontSize: '18px',
                        fontWeight: 800,
                        color: raisedPct >= 100 ? '#059669' : '#011F39',
                      }}
                    >
                      {raisedPct}%
                    </span>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>
                      {request.donor_count || 0} generous donors
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '9999px',
                    backgroundColor: '#F3F4F6',
                    overflow: 'hidden',
                    margin: '10px 0',
                  }}
                >
                  <div
                    style={{
                      width: `${raisedPct}%`,
                      height: '100%',
                      borderRadius: '9999px',
                      backgroundColor: raisedPct >= 100 ? '#059669' : '#011F39',
                    }}
                  />
                </div>
              </div>

              {/* Case Story & Cause Description */}
              <div
                style={{
                  padding: '18px 20px',
                  borderRadius: '10px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 700, color: '#011F39' }}>
                  Aid Request Description & Assessment Background
                </h4>
                <p style={{ margin: 0, fontSize: '13.5px', color: '#374151', lineHeight: 1.6 }}>
                  {request.description || 'No detailed case description submitted with this request.'}
                </p>
              </div>

              {/* Demographic & Timeline Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 700, color: '#011F39', textTransform: 'uppercase' }}>
                    Beneficiary Demographics
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6B7280' }}>Age:</span>
                      <span style={{ fontWeight: 600 }}>{request.age ? `${request.age} years` : '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6B7280' }}>City / District:</span>
                      <span style={{ fontWeight: 600 }}>{request.city || '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6B7280' }}>State / Region:</span>
                      <span style={{ fontWeight: 600 }}>{request.state || '—'}</span>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 700, color: '#011F39', textTransform: 'uppercase' }}>
                    Application Timelines
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6B7280' }}>Submitted On:</span>
                      <span style={{ fontWeight: 600 }}>{formattedCreatedDate}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6B7280' }}>Reviewed On:</span>
                      <span style={{ fontWeight: 600 }}>{formattedReviewedDate || 'Awaiting Review'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6B7280' }}>Current Status:</span>
                      <AssistanceStatusBadge status={request.status} size="sm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Remark */}
              {request.admin_remark && (
                <div
                  style={{
                    padding: '14px 16px',
                    borderRadius: '10px',
                    backgroundColor: '#F3F4F6',
                    border: '1px solid #E5E7EB',
                    fontSize: '13px',
                    color: '#374151',
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#011F39' }}>Admin Remark: </span>
                  {request.admin_remark}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REVIEW & ASSESSMENT */}
          {activeTab === 'REVIEW' && (
            <form onSubmit={handleApplyStatusChange} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#011F39' }}>
                    Eligibility Review & Determination
                  </h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: '#6B7280' }}>
                    Evaluate seeker documents, assess genuine financial distress and update case lifecycle
                  </p>
                </div>

                {reviewSuccess && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      backgroundColor: '#E8F8EE',
                      color: '#00A859',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    <Check size={14} />
                    Status Updated
                  </span>
                )}
              </div>

              {/* Verification Checklist */}
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: '10px',
                  backgroundColor: '#FAF7F0',
                  border: '1px solid #F3E8D2',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#011F39', marginBottom: '10px' }}>
                  Pre-Approval Verification Checklist
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={checkId}
                      onChange={(e) => setCheckId(e.target.checked)}
                      style={{ accentColor: '#011F39' }}
                    />
                    <span>Government photo ID (Aadhaar / Voter ID) verified & name matched</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={checkNeed}
                      onChange={(e) => setCheckNeed(e.target.checked)}
                      style={{ accentColor: '#011F39' }}
                    />
                    <span>Hospital estimate / school fee invoice verified with issuing authority</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={checkDoc}
                      onChange={(e) => setCheckDoc(e.target.checked)}
                      style={{ accentColor: '#011F39' }}
                    />
                    <span>Income distress confirmed (no conflicting active duplicate grant)</span>
                  </label>
                </div>
              </div>

              {/* Target Status Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                  Select Determination Action *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {[
                    { key: 'APPROVED' as AssistanceStatus, label: 'Approve Aid', icon: CheckCircle2, color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
                    { key: 'UNDER_REVIEW' as AssistanceStatus, label: 'Under Review', icon: FileCheck, color: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE' },
                    { key: 'REJECTED' as AssistanceStatus, label: 'Decline / Reject', icon: XCircle, color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
                    { key: 'CLOSED' as AssistanceStatus, label: 'Close Case', icon: ShieldCheck, color: '#475569', bg: '#F1F5F9', border: '#CBD5E1' },
                  ].map((st) => {
                    const isSelected = targetStatus === st.key;
                    const Icon = st.icon;
                    return (
                      <button
                        key={st.key}
                        type="button"
                        onClick={() => setTargetStatus(st.key)}
                        style={{
                          padding: '12px 10px',
                          borderRadius: '8px',
                          border: isSelected ? `2px solid ${st.color}` : '1px solid #E5E7EB',
                          backgroundColor: isSelected ? st.bg : '#FFFFFF',
                          color: isSelected ? st.color : '#4B5563',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          textAlign: 'center',
                        }}
                      >
                        <Icon size={18} color={st.color} />
                        <span>{st.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Administrative Remarks */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Administrative Assessment Remarks
                </label>
                <textarea
                  rows={3}
                  value={adminRemark}
                  onChange={(e) => setAdminRemark(e.target.value)}
                  placeholder="Provide verification findings, disbursement directives or decline justification..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D1D5DB',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    backgroundColor: '#011F39',
                    color: '#FFFFFF',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: isSubmittingReview ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Save size={16} />
                  <span>{isSubmittingReview ? 'Saving...' : 'Apply Determination'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SUPPORTING DOCUMENTS */}
          {activeTab === 'DOCUMENTS' && (
            <div>
              <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', fontWeight: 700, color: '#011F39' }}>
                Verified Beneficiary Documentation
              </h3>
              {request.documents && request.documents.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {request.documents.map((doc) => (
                    <div
                      key={doc.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        borderRadius: '10px',
                        border: '1px solid #E5E7EB',
                        backgroundColor: '#F9FAFB',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FileText size={22} color="#011F39" />
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1F2937' }}>
                            {doc.document_name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                            {doc.document_type} • {String(doc.file_size || '1.2 MB')} • Uploaded {doc.created_at}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => assistanceStore.toggleDocumentVerified(request.id, doc.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            borderRadius: '6px',
                            border: doc.verified ? '1px solid #A7F3D0' : '1px solid #D1D5DB',
                            backgroundColor: doc.verified ? '#ECFDF5' : '#FFFFFF',
                            color: doc.verified ? '#059669' : '#6B7280',
                            cursor: 'pointer',
                          }}
                        >
                          <Check size={13} color={doc.verified ? '#059669' : '#9CA3AF'} />
                          <span>{doc.verified ? 'Verified' : 'Verify'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => alert(`Previewing ${doc.document_name}`)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            borderRadius: '6px',
                            border: '1px solid #011F39',
                            backgroundColor: '#FFFFFF',
                            color: '#011F39',
                            cursor: 'pointer',
                          }}
                        >
                          <ExternalLink size={13} />
                          <span>View</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '36px', color: '#9CA3AF', fontSize: '13.5px' }}>
                  No supporting files attached to this request.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid #E5E7EB',
            backgroundColor: '#F9FAFB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: '12.5px', color: '#6B7280' }}>
            Registered under Human Rights & Social Justice Mission Relief Fund
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 20px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#374151',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
