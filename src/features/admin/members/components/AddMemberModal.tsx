import type React from 'react';
import { useState } from 'react';
import { X, UserPlus, CheckCircle2 } from 'lucide-react';
import type { MembershipCategoryItem } from '../types/members.types';
import { membersStore } from '../store/membersStore';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface AddMemberModalProps {
  visible: boolean;
  onClose: () => void;
  categories: MembershipCategoryItem[];
  onCreated?: () => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  visible,
  onClose,
  categories,
  onCreated,
}) => {
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '1');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('');
  const [qualification, setQualification] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [autoActivate, setAutoActivate] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useLockBodyScroll(visible);

  if (!visible) return null;

  const selectedCat = categories.find((c) => c.id === categoryId) || categories[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Full Name is required.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Mobile number is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await membersStore.createMember({
        category_id: categoryId,
        full_name: fullName.trim(),
        mobile_number: phone.trim(),
        email: email.trim() || undefined,
        personal_details: {
          gender,
          dob,
          qualification,
          father_name: fatherName,
          address,
          city,
          state,
          pincode,
        },
        admin_notes: adminNotes || 'Admin direct enrollment via web',
        auto_activate: autoActivate,
      });

      onCreated?.();
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to register member.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(1, 31, 57, 0.55)',
        backdropFilter: 'blur(3px)',
        zIndex: 1050,
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
          maxWidth: '680px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px',
            backgroundColor: '#011F39',
            color: '#FFFFFF',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserPlus size={18} color="#FAD465" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>
              Register New Organization Member
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#FFFFFF',
              padding: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
            {errorMsg && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#FEE2E2',
                  color: '#DC2626',
                  fontSize: '13px',
                  fontWeight: 500,
                  marginBottom: '16px',
                }}
              >
                {errorMsg}
              </div>
            )}

            {/* Category Banner Card */}
            <div
              style={{
                padding: '14px 16px',
                borderRadius: '10px',
                backgroundColor: '#FAF7F0',
                border: '1px solid #F3E8D2',
                marginBottom: '16px',
              }}
            >
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#011F39', marginBottom: '6px' }}>
                Select Membership Post & Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  fontSize: '13.5px',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                }}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — Fee: ₹{typeof c.fee === 'number' ? c.fee.toLocaleString('en-IN') : c.fee} ({c.description || 'Standard Validity'})
                  </option>
                ))}
              </select>
              {selectedCat && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#6B7280' }}>
                  {selectedCat.description}
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  placeholder="member@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Educational Qualification</label>
                <input
                  type="text"
                  placeholder="e.g. Graduate, Advocate, 10th Pass"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Personal Details */}
            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px', marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '13.5px', fontWeight: 700, color: '#011F39' }}>
                Personal Details
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Father / Guardian Name</label>
                  <input
                    type="text"
                    placeholder="Father's Name"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Residential Address */}
            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px', marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '13.5px', fontWeight: 700, color: '#011F39' }}>
                Residential & Delivery Address
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '14px' }}>
                <div style={{ gridColumn: 'span 3' }}>
                  <label style={labelStyle}>Street Address / House No.</label>
                  <input
                    type="text"
                    placeholder="e.g. House 42, Green Park Road"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>City</label>
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>State</label>
                  <input
                    type="text"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Pincode</label>
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Auto-Activate & Remarks */}
            <div
              style={{
                borderTop: '1px solid #E5E7EB',
                paddingTop: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: '#011F39',
                }}
              >
                <input
                  type="checkbox"
                  checked={autoActivate}
                  onChange={(e) => setAutoActivate(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#011F39' }}
                />
                <span>Auto-Activate Membership Immediately</span>
              </label>

              <div>
                <label style={labelStyle}>Administrative Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Enrolled directly at district headquarters camp..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '14px 24px',
              borderTop: '1px solid #E5E7EB',
              backgroundColor: '#F9FAFB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 18px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#4B5563',
                backgroundColor: '#FFFFFF',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 22px',
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#FFFFFF',
                backgroundColor: '#011F39',
                border: 'none',
                borderRadius: '8px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              <CheckCircle2 size={16} />
              <span>{isSubmitting ? 'Registering Member...' : 'Register Member'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12.5px',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '5px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  fontSize: '13px',
  borderRadius: '8px',
  border: '1px solid #D1D5DB',
  backgroundColor: '#FFFFFF',
  color: '#1F2937',
  outline: 'none',
  boxSizing: 'border-box',
};

