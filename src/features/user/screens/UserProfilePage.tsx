import React, { useState } from 'react';
import {
  Shield,
  Save,
  CheckCircle,
} from 'lucide-react';
import { ProfileService } from '../../profile/services/profileService';
import type { AdminProfile } from '../../profile/types/profile.types';
import { useUserAuth } from '../store/userAuthStore';

export const UserProfilePage: React.FC = () => {
  const { user, setUser } = useUserAuth();

  const [profile, setProfile] = useState<AdminProfile>(() =>
    ProfileService.getInstance().getProfile()
  );

  // Form State
  const [fullName, setFullName] = useState(profile.fullName || user?.full_name || 'Mohd. Ayaan Shaikh');
  const [email, setEmail] = useState(profile.email || user?.email || 'ayaan.shaikh@hrsjm.org');
  const [phone, setPhone] = useState(profile.phone || user?.mobile_number || '+91 98765 43210');
  const [bloodGroup, setBloodGroup] = useState(profile.bloodGroup || 'O+');
  const [stateName, setStateName] = useState(profile.state || 'Maharashtra');
  const [city, setCity] = useState(profile.city || 'Mumbai');
  const [address, setAddress] = useState(profile.address || 'Bandra West, Mumbai');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const updated = ProfileService.getInstance().updatePersonalInfo({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      bloodGroup,
      state: stateName.trim(),
      city: city.trim(),
      address: address.trim(),
    });

    setProfile(updated);

    // Also sync to userAuthStore
    if (user) {
      setUser({
        ...user,
        full_name: fullName.trim(),
        email: email.trim(),
        mobile_number: phone.trim(),
      });
    }

    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const initials = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase())
    .join('') || 'U';

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-[#06294D] text-white p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-[#FAD465] text-[#FAD465] flex items-center justify-center font-black text-xl shadow-md shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{fullName}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-[#FAD465] border border-[#FAD465]/30">
                {user?.account_type || 'Active Member'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{email} • {phone}</p>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2">
          <CheckCircle size={18} className="text-emerald-600" />
          <span>Profile changes saved and updated successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Edit Form */}
        <form onSubmit={handleSaveProfile} className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
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
                required
                value={stateName}
                onChange={e => setStateName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">City / District</label>
              <input
                type="text"
                required
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Permanent Residential Address</label>
            <textarea
              required
              rows={2}
              value={address}
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
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
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
                <span className="text-slate-500">Member ID:</span>
                <span className="font-mono font-bold text-[#06294D]">{profile.memberId || 'HRSJM-ACT-2026-9042'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Tier:</span>
                <span className="font-bold text-amber-700">Active Member</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">State Chapter:</span>
                <span className="font-semibold text-slate-800">Maharashtra / Mumbai</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Account Status:</span>
                <span className="text-emerald-700 font-bold">Active &amp; Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
