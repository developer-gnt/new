import type React from 'react';
import { useState, useSyncExternalStore } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  Mail,
  Copy,
  Check,
  FileCheck,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Save,
  ExternalLink,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import { assistanceStore } from '../store/assistanceStore';
import { AssistanceStatusBadge } from '../components/AssistanceStatusBadge';
import { URGENCY_CONFIG } from '../data/assistanceFixtures';
import { ApproveAssistanceModal } from '../components/ApproveAssistanceModal';
import { RejectAssistanceModal } from '../components/RejectAssistanceModal';
import type { AssistanceStatus } from '../types/assistance.types';

export const AssistanceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const storeSnapshot = useSyncExternalStore(
    assistanceStore.subscribe,
    assistanceStore.getSnapshot
  );

  const request = storeSnapshot.requests.find((r) => r.id === id);

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'REVIEW' | 'DOCUMENTS'>('OVERVIEW');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);

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

  if (!request) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <AlertCircle size={40} color="#DC2626" style={{ margin: '0 auto 12px auto' }} />
        <h2 style={{ color: '#011F39', margin: '0 0 8px 0' }}>Case File Not Found</h2>
        <p style={{ color: '#6B7280', margin: '0 0 16px 0' }}>
          The requested assistance case file could not be found or has been relocated.
        </p>
        <Link
          to="/admin/assistance"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '8px',
            backgroundColor: '#011F39',
            color: '#FFFFFF',
            textDecoration: 'none',
            fontSize: '13.5px',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} />
          <span>Return to Donation Seekers & Aid</span>
        </Link>
      </div>
    );
  }

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

  const handleApplyDetermination = async (e: React.FormEvent) => {
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
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Breadcrumb Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
          fontSize: '13px',
          color: '#6B7280',
        }}
      >
        <Link to="/admin/assistance" style={{ color: '#011F39', textDecoration: 'none', fontWeight: 600 }}>
          Donation Seekers & Aid
        </Link>
        <span>/</span>
        <span>{request.full_name}</span>
      </div>

      {/* Header Profile Banner */}
      <div
        style={{
          backgroundColor: '#011F39',
          color: '#FFFFFF',
          borderRadius: '14px',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            type="button"
            onClick={() => navigate('/admin/assistance')}
            style={{
              padding: '8px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={18} />
          </button>

          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#023158',
              color: '#FAD465',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 800,
              border: '2px solid #FAD465',
            }}
          >
            {request.full_name.charAt(0).toUpperCase()}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#FFFFFF' }}>
                {request.full_name}
              </h1>
              <AssistanceStatusBadge status={request.status} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
              <span style={{ fontFamily: 'monospace', color: '#FAD465', fontWeight: 700, fontSize: '13px' }}>
                {displayId}
              </span>
              <span style={{ color: '#64748B' }}>•</span>
              <span style={{ fontSize: '13px', color: '#DBE5EE' }}>
                {request.reason}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
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

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {request.status !== 'APPROVED' && (
            <button
              type="button"
              onClick={() => setApproveModalVisible(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                borderRadius: '8px',
                backgroundColor: '#059669',
                color: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <CheckCircle2 size={16} />
              <span>Approve Cause</span>
            </button>
          )}

          {request.status !== 'REJECTED' && (
            <button
              type="button"
              onClick={() => setRejectModalVisible(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                borderRadius: '8px',
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <XCircle size={16} />
              <span>Decline</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tabbed Container */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        }}
      >
        {/* Tabs Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #E5E7EB',
            backgroundColor: '#F9FAFB',
            padding: '0 20px',
          }}
        >
          {[
            { id: 'OVERVIEW' as const, label: 'Case Overview', icon: Heart },
            { id: 'REVIEW' as const, label: 'Review & Determination', icon: FileCheck },
            { id: 'DOCUMENTS' as const, label: 'Verified Documents', icon: FileText, count: request.documents?.length || 0 },
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
                  padding: '14px 20px',
                  border: 'none',
                  background: 'transparent',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#011F39' : '#6B7280',
                  borderBottom: isActive ? '3px solid #011F39' : '3px solid transparent',
                  cursor: 'pointer',
                  marginBottom: '-1px',
                }}
              >
                <Icon size={16} color={isActive ? '#011F39' : '#6B7280'} />
                <span>{t.label}</span>
                {typeof t.count === 'number' && (
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '2px 7px',
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

        {/* Tab Content Area */}
        <div style={{ padding: '24px' }}>
          {activeTab === 'OVERVIEW' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Contact Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  padding: '14px 20px',
                  borderRadius: '10px',
                  backgroundColor: '#FAF7F0',
                  border: '1px solid #F3E8D2',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={16} color="#00A859" />
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#011F39' }}>{request.mobile}</span>
                  </div>
                  {request.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={16} color="#2563EB" />
                      <span style={{ fontSize: '13.5px', color: '#011F39' }}>{request.email}</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(request.id, 'id')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '7px 14px',
                    fontSize: '12.5px',
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

              {/* Progress Summary Card */}
              <div
                style={{
                  padding: '20px 24px',
                  borderRadius: '10px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>
                      Total Target Allocation
                    </span>
                    <div style={{ fontSize: '26px', fontWeight: 800, color: '#011F39', marginTop: '2px' }}>
                      ₹{raised.toLocaleString('en-IN')}{' '}
                      <span style={{ fontSize: '16px', fontWeight: 500, color: '#6B7280' }}>
                        raised of ₹{requested.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: raisedPct >= 100 ? '#059669' : '#011F39' }}>
                      {raisedPct}%
                    </div>
                    <div style={{ fontSize: '13px', color: '#6B7280' }}>
                      {request.donor_count || 0} direct supporters
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    width: '100%',
                    height: '10px',
                    borderRadius: '9999px',
                    backgroundColor: '#F3F4F6',
                    overflow: 'hidden',
                    margin: '12px 0',
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

              {/* Case Story */}
              <div
                style={{
                  padding: '20px',
                  borderRadius: '10px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 700, color: '#011F39' }}>
                  Distress Background & Cause Narrative
                </h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#374151', lineHeight: 1.6 }}>
                  {request.description || 'No detailed hardship background recorded.'}
                </p>
              </div>

              {/* 2-Column Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ padding: '20px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                  <h3 style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: 700, color: '#011F39' }}>
                    Beneficiary Particulars
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
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

                <div style={{ padding: '20px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                  <h3 style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: 700, color: '#011F39' }}>
                    Governance & Timeline
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6B7280' }}>Registered On:</span>
                      <span style={{ fontWeight: 600 }}>{formattedCreatedDate}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6B7280' }}>Reviewed On:</span>
                      <span style={{ fontWeight: 600 }}>{formattedReviewedDate || 'Awaiting Assessment'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6B7280' }}>Lifecycle Stage:</span>
                      <AssistanceStatusBadge status={request.status} size="sm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Remark */}
              {request.admin_remark && (
                <div
                  style={{
                    padding: '16px 20px',
                    borderRadius: '10px',
                    backgroundColor: '#F3F4F6',
                    border: '1px solid #E5E7EB',
                    fontSize: '13.5px',
                    color: '#374151',
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#011F39' }}>Admin Remark: </span>
                  {request.admin_remark}
                </div>
              )}
            </div>
          )}

          {activeTab === 'REVIEW' && (
            <form onSubmit={handleApplyDetermination} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#011F39' }}>
                    Eligibility Determination
                  </h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#6B7280' }}>
                    Update request status and record official decision remark
                  </p>
                </div>

                {reviewSuccess && (
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#059669' }}>
                    ✓ Determination applied successfully
                  </span>
                )}
              </div>

              {/* Checklist */}
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: '10px',
                  backgroundColor: '#FAF7F0',
                  border: '1px solid #F3E8D2',
                }}
              >
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#011F39', marginBottom: '10px' }}>
                  Verification Checks
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={checkId} onChange={(e) => setCheckId(e.target.checked)} style={{ accentColor: '#011F39' }} />
                    <span>Beneficiary identity proof verified against government database</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={checkNeed} onChange={(e) => setCheckNeed(e.target.checked)} style={{ accentColor: '#011F39' }} />
                    <span>Hospital / Institution estimate verified directly with billing desk</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={checkDoc} onChange={(e) => setCheckDoc(e.target.checked)} style={{ accentColor: '#011F39' }} />
                    <span>Financial distress assessed (no active duplicate relief grant)</span>
                  </label>
                </div>
              </div>

              {/* Status Selectors */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                  Target Lifecycle Status
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  {[
                    { key: 'APPROVED' as AssistanceStatus, label: 'Approve Aid', icon: CheckCircle2, color: '#059669', bg: '#ECFDF5' },
                    { key: 'UNDER_REVIEW' as AssistanceStatus, label: 'Under Review', icon: FileCheck, color: '#1D4ED8', bg: '#EFF6FF' },
                    { key: 'REJECTED' as AssistanceStatus, label: 'Decline / Reject', icon: XCircle, color: '#DC2626', bg: '#FEF2F2' },
                    { key: 'CLOSED' as AssistanceStatus, label: 'Close Case', icon: ShieldCheck, color: '#475569', bg: '#F1F5F9' },
                  ].map((st) => {
                    const isSelected = targetStatus === st.key;
                    const Icon = st.icon;
                    return (
                      <button
                        key={st.key}
                        type="button"
                        onClick={() => setTargetStatus(st.key)}
                        style={{
                          padding: '14px 10px',
                          borderRadius: '8px',
                          border: isSelected ? `2px solid ${st.color}` : '1px solid #E5E7EB',
                          backgroundColor: isSelected ? st.bg : '#FFFFFF',
                          color: isSelected ? st.color : '#4B5563',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Icon size={18} color={st.color} />
                        <span>{st.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Admin Remark */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Administrative Determination Remarks
                </label>
                <textarea
                  rows={3}
                  value={adminRemark}
                  onChange={(e) => setAdminRemark(e.target.value)}
                  placeholder="Enter verification notes or disbursement directives..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #D1D5DB',
                    fontSize: '13.5px',
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
                    fontSize: '14px',
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

          {activeTab === 'DOCUMENTS' && (
            <div>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: '#011F39' }}>
                Supporting Verification Files
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
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1F2937' }}>
                            {doc.document_name}
                          </div>
                          <div style={{ fontSize: '12.5px', color: '#6B7280', marginTop: '2px' }}>
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
                            padding: '6px 14px',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            borderRadius: '6px',
                            border: doc.verified ? '1px solid #A7F3D0' : '1px solid #D1D5DB',
                            backgroundColor: doc.verified ? '#ECFDF5' : '#FFFFFF',
                            color: doc.verified ? '#059669' : '#6B7280',
                            cursor: 'pointer',
                          }}
                        >
                          <Check size={14} color={doc.verified ? '#059669' : '#9CA3AF'} />
                          <span>{doc.verified ? 'Verified' : 'Verify'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => alert(`Viewing ${doc.document_name}`)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 14px',
                            fontSize: '12.5px',
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
                <div style={{ textAlign: 'center', padding: '36px', color: '#9CA3AF' }}>
                  No supporting files attached to this request.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sub-modals */}
      <ApproveAssistanceModal
        visible={approveModalVisible}
        onClose={() => setApproveModalVisible(false)}
        request={request}
      />

      <RejectAssistanceModal
        visible={rejectModalVisible}
        onClose={() => setRejectModalVisible(false)}
        request={request}
      />
    </div>
  );
};
