import React, { useState, useEffect } from 'react';
import {
  Shield,
  Save,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useUserAuth } from '../store/userAuthStore';
import { authService } from '@/features/auth/services/authService';

export const UserProfilePage: React.FC = () => {
  const { user, setUser } = useUserAuth();

  // Form State initialized directly from the live authenticated user
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.mobile_number || '');
  const [bloodGroup, setBloodGroup] = useState(user?.blood_group || 'O+');
  const [stateName, setStateName] = useState(user?.state || '');
  const [city, setCity] = useState(user?.city || '');
  const [address, setAddress] = useState(user?.address || '');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch live fresh profile from backend on mount and update state
  useEffect(() => {
    let mounted = true;
    authService.fetchMe().then((fresh) => {
      if (mounted && fresh) {
        setUser(fresh as any);
        setFullName(fresh.full_name || '');
        setEmail(fresh.email || '');
        setPhone(fresh.mobile_number || '');
        if (fresh.blood_group) setBloodGroup(fresh.blood_group);
        if (fresh.state) setStateName(fresh.state);
        if (fresh.city) setCity(fresh.city);
        if (fresh.address) setAddress(fresh.address);
      }
    });
    return () => {
      mounted = false;
    };
  }, [setUser]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);

    try {
      const updated = await authService.updateMe({
        full_name: fullName.trim(),
        email: email.trim(),
        mobile_number: phone.trim(),
        blood_group: bloodGroup,
        state: stateName.trim(),
        city: city.trim(),
        address: address.trim(),
      });

      if (updated) {
        setUser(updated as any);
      } else if (user) {
        setUser({
          ...user,
          full_name: fullName.trim(),
          email: email.trim(),
          mobile_number: phone.trim(),
          blood_group: bloodGroup,
          state: stateName.trim(),
          city: city.trim(),
          address: address.trim(),
        });
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const initials = (fullName || user?.full_name || 'U')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase())
    .join('') || 'U';

  const memberStatus = user?.membership_status;
  const isMemberActive = memberStatus === 'ACTIVE' || memberStatus === 'APPROVED';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-[#06294D] text-white p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-[#FAD465] text-[#FAD465] flex items-center justify-center font-black text-xl shadow-md shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {fullName || user?.full_name || 'My Profile'}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-[#FAD465] border border-[#FAD465]/30">
                {user?.account_type || (isMemberActive ? 'Member' : 'General')}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {email || user?.email || 'No email registered'} {phone ? `• ${phone}` : ''}
            </p>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2">
          <CheckCircle size={18} className="text-emerald-600" />
          <span>Profile changes saved and updated in database successfully!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-bold flex items-center gap-2">
          <AlertCircle size={18} className="text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Edit Form */}
        <form
          onSubmit={handleSaveProfile}
          className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4"
        >
          <div>
            <h2 className="text-base font-bold text-[#06294D]">Personal Information</h2>
            <p className="text-xs text-slate-500">Update your verified contact and identity information.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={fullName}
                placeholder="Enter full legal name"
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                placeholder="name@example.com"
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mobile Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                placeholder="10-digit mobile number"
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={e => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D] bg-white"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">State Chapter</label>
              <input
                type="text"
                value={stateName}
                placeholder="e.g. Maharashtra, Delhi"
                onChange={e => setStateName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">City / District</label>
              <input
                type="text"
                value={city}
                placeholder="e.g. Mumbai, New Delhi"
                onChange={e => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Permanent Residential Address</label>
            <textarea
              rows={2}
              value={address}
              placeholder="Enter permanent residential address"
              onChange={e => setAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="py-2.5 px-6 rounded-xl bg-[#06294D] hover:bg-[#083563] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-98 transition-all"
          >
            <Save size={14} />
            <span>{saving ? 'Saving to Database...' : 'Save Profile Changes'}</span>
          </button>
        </form>

        {/* Account Credentials Card */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-[#06294D] uppercase tracking-wider flex items-center gap-1.5">
              <Shield size={14} />
              <span>Membership Credentials</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Account Type:</span>
                <span className="font-bold text-[#06294D] uppercase">
                  {user?.account_type || 'General'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Member ID:</span>
                <span className="font-mono font-bold text-[#06294D]">
                  {user?.membership_number || user?.id?.slice(0, 16) || 'NOT ENROLLED'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Verification Status:</span>
                <span
                  className={`font-bold ${
                    isMemberActive
                      ? 'text-emerald-700'
                      : memberStatus === 'PENDING' || memberStatus === 'UNDER_REVIEW'
                      ? 'text-amber-700'
                      : 'text-slate-600'
                  }`}
                >
                  {memberStatus || 'Registered Citizen'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold text-slate-800">
                  {city || stateName ? `${city || ''}${city && stateName ? ', ' : ''}${stateName || ''}` : 'India'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
