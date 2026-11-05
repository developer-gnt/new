import type React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, CheckCircle2 } from 'lucide-react';
import { membersStore } from '../store/membersStore';
import { membersService } from '../services/membersService';
import { STANDARD_MEMBERSHIP_CATEGORIES } from '../data/membersFixtures';
import type { MembershipCategoryItem } from '../types/members.types';

export const AddMemberPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<MembershipCategoryItem[]>(STANDARD_MEMBERSHIP_CATEGORIES);

  const [categoryId, setCategoryId] = useState('1');
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

  useEffect(() => {
    membersService.getCategories().then((cats) => {
      if (Array.isArray(cats) && cats.length > 0) {
        setCategories(cats);
        setCategoryId(cats[0].id);
      }
    });
  }, []);

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
      const created = await membersStore.createMember({
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

      navigate(`/admin/members/${created.id}`);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to register member.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
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
        <Link to="/admin/members" style={{ color: '#011F39', textDecoration: 'none', fontWeight: 600 }}>
          Members Directory
        </Link>
        <span>/</span>
        <span>Register Member</span>
      </div>

      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            backgroundColor: '#011F39',
            color: '#FFFFFF',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={() => navigate('/admin/members')}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#FFFFFF',
                padding: '6px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
                Register New Member
              </h1>
              <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: '#DBE5EE' }}>
                Direct administrative enrollment into the official organization directory
              </p>
            </div>
          </div>
          <UserPlus size={22} color="#FAD465" />
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {errorMsg && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                fontSize: '13.5px',
                fontWeight: 500,
                marginBottom: '20px',
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* Membership Category Banner */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: '10px',
              backgroundColor: '#FAF7F0',
              border: '1px solid #F3E8D2',
              marginBottom: '20px',
            }}
          >
            <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#011F39', marginBottom: '8px' }}>
              Select Membership Category / Post *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '14px',
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
              <div style={{ marginTop: '8px', fontSize: '12.5px', color: '#6B7280' }}>
                {selectedCat.description}
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Adv. Rajesh Sharma"
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
          <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: 700, color: '#011F39' }}>
              Personal Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
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
          <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: 700, color: '#011F39' }}>
              Residential & Welcome Kit Delivery Address
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: 'span 3' }}>
                <label style={labelStyle}>Street Address / House No.</label>
                <input
                  type="text"
                  placeholder="e.g. House No. 42, Civil Lines Road"
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
              paddingTop: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                color: '#011F39',
              }}
            >
              <input
                type="checkbox"
                checked={autoActivate}
                onChange={(e) => setAutoActivate(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#011F39' }}
              />
              <span>Auto-Activate Membership Immediately</span>
            </label>

            <div>
              <label style={labelStyle}>Administrative Remark</label>
              <input
                type="text"
                placeholder="e.g. Registered in direct member camp with verification..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '28px',
              paddingTop: '16px',
              borderTop: '1px solid #E5E7EB',
            }}
          >
            <button
              type="button"
              onClick={() => navigate('/admin/members')}
              style={{
                padding: '10px 20px',
                fontSize: '13.5px',
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
                padding: '10px 24px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#FFFFFF',
                backgroundColor: '#011F39',
                border: 'none',
                borderRadius: '8px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              <CheckCircle2 size={16} />
              <span>{isSubmitting ? 'Registering...' : 'Complete Registration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  fontSize: '13.5px',
  borderRadius: '8px',
  border: '1px solid #D1D5DB',
  backgroundColor: '#FFFFFF',
  color: '#1F2937',
  outline: 'none',
  boxSizing: 'border-box',
};

