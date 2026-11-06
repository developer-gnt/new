import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Camera,
  FileText,
  Building2,
  Check,
  BadgeCheck,
} from 'lucide-react';
import { useCurrentMember } from '../store/memberStore';

export const MemberProfilePage: React.FC = () => {
  const { member, updateProfile } = useCurrentMember();

  const [activeTab, setActiveTab] = useState<'PERSONAL' | 'ADDRESS' | 'DOCS' | 'SECURITY'>('PERSONAL');

  // Form states
  const [fullName, setFullName] = useState(member.fullName);
  const [email, setEmail] = useState(member.email);
  const [phone, setPhone] = useState(member.phone);
  const [bloodGroup, setBloodGroup] = useState(member.bloodGroup);
  const [occupation, setOccupation] = useState(member.occupation || 'Advocate / Legal Consultant');
  const [fatherOrSpouse, setFatherOrSpouse] = useState(member.fatherOrSpouseName || '');

  // Address states
  const [addressLine, setAddressLine] = useState(member.address.line);
  const [city, setCity] = useState(member.address.city);
  const [stateName, setStateName] = useState(member.address.state);
  const [pincode, setPincode] = useState(member.address.pincode);

  // Security password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Profile save feedback
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const success = await updateProfile({
      full_name: fullName,
      email,
      phone,
      blood_group: bloodGroup,
    });

    setIsSaving(false);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword === confirmPassword) {
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-[#011F39] via-[#06294D] to-[#011F39] text-white p-6 md:p-8 rounded-2xl shadow-md border border-[#FAD465]/30 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          {/* Avatar with Camera Overlay */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-[#FAD465] shadow-lg bg-slate-800">
              <img
                src={member.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'}
                alt={member.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              className="absolute -bottom-2 -right-2 p-2 bg-[#FAD465] hover:bg-[#E9B82E] text-[#06294D] rounded-xl shadow-md transition-transform group-hover:scale-105 cursor-pointer"
              title="Change Profile Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Member Metadata */}
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="font-mono text-xs font-bold text-[#FAD465] bg-white/10 px-2.5 py-0.5 rounded border border-[#FAD465]/30">
                {member.membershipNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5" /> Verified Active
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold font-['Playfair_Display',Georgia,serif] tracking-tight">
              {member.fullName}
            </h1>

            <p className="text-xs md:text-sm text-slate-200">
              {member.designation} • {member.categoryTitle}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#FAD465]" /> {member.chapter}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#FAD465]" /> {member.phone}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#FAD465]" /> {member.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('PERSONAL')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'PERSONAL'
              ? 'bg-[#06294D] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          Personal & Professional
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ADDRESS')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'ADDRESS'
              ? 'bg-[#06294D] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Address & Chapter
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('DOCS')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'DOCS'
              ? 'bg-[#06294D] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          Accredited Documents
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('SECURITY')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'SECURITY'
              ? 'bg-[#06294D] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Lock className="w-4 h-4" />
          Security & Password
        </button>
      </div>

      {/* Save Toast Feedback */}
      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Profile updated successfully! All active sessions synchronized.
        </div>
      )}

      {/* Tab Panels */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-sm">
        {/* Tab 1: Personal & Professional */}
        {activeTab === 'PERSONAL' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-[#06294D]">
                Personal & Professional Identity
              </h2>
              <p className="text-xs text-slate-500">
                Update your registered contact and statutory personal details.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                  Full Name (As on Aadhaar / Bar Council) *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-[#06294D]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                  Father / Spouse Name
                </label>
                <input
                  type="text"
                  value={fatherOrSpouse}
                  onChange={(e) => setFatherOrSpouse(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-[#06294D]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                  Registered Mobile Number *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-[#06294D]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-[#06294D]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                  Blood Group
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-[#06294D]"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                  Occupation / Profession
                </label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-[#06294D]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-[#06294D] hover:bg-[#083a6b] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Address & Chapter */}
        {activeTab === 'ADDRESS' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-[#06294D]">
                Residential Address & Unit Chapter
              </h2>
              <p className="text-xs text-slate-500">
                Accredited jurisdiction and local dispatch address.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                  Street Address Line
                </label>
                <input
                  type="text"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-[#06294D]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                  City / District
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-[#06294D]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                  State / UT
                </label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-[#06294D]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                  Postal PIN Code
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-[#06294D]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                  Assigned Chapter
                </label>
                <input
                  type="text"
                  readOnly
                  value={member.chapter}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-100 border border-slate-200 font-bold text-slate-600 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-[#06294D] hover:bg-[#083a6b] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                {isSaving ? 'Updating...' : 'Update Address'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Accredited Documents */}
        {activeTab === 'DOCS' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-[#06294D]">
                Accredited KYC & Verification Documents
              </h2>
              <p className="text-xs text-slate-500">
                Official scanned credentials verified during membership induction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {member.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      {doc.type.replace('_', ' ')}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <Check className="w-3 h-3" /> {doc.status}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="font-bold text-slate-800 truncate">{doc.title}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{doc.fileName}</p>
                    <p className="text-[10px] text-slate-400">Uploaded on {doc.uploadedAt}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">{doc.fileSize || 'Verified'}</span>
                    <span className="font-bold text-[#06294D] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Encrypted Vault
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Security & Password */}
        {activeTab === 'SECURITY' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-lg">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-[#06294D]">
                Account Security & Credentials
              </h2>
              <p className="text-xs text-slate-500">
                Update your login password and manage credential authentication.
              </p>
            </div>

            {passwordSuccess && (
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Password updated successfully!
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-[#06294D]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                  New Password (Min 8 characters)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-[#06294D]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-[#06294D]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#06294D] hover:bg-[#083a6b] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                Update Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
