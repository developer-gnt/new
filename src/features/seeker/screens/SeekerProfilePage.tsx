import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  CreditCard,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Edit2,
  X,
} from 'lucide-react';
import { useAuth, executeSignOut } from '../../auth/store/authStore';
import { authService } from '../../auth/services/authService';

export const SeekerProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUserState } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || 'Mumbai');
  const [state, setState] = useState(user?.state || 'Maharashtra');
  const [pincode, setPincode] = useState(user?.pincode || '400050');

  // Change password modal
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMessage, setPwMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);
  const [pwSubmitting, setPwSubmitting] = useState(false);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authService.updateMe({
        full_name: fullName,
        email,
        address,
        city,
        state,
        pincode,
      });
      updateUserState({
        full_name: fullName,
        email,
        address,
        city,
        state,
        pincode,
      });
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      // Ignore
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw.length < 6) {
      setPwMessage({ tone: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPw !== confirmPw) {
      setPwMessage({ tone: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPwSubmitting(true);
    setPwMessage(null);

    try {
      const res = await authService.changePassword({
        current_password: currentPw,
        new_password: newPw,
        confirm_password: confirmPw,
      });
      setPwMessage({ tone: 'success', text: res.message });
      setTimeout(() => {
        setPwModalOpen(false);
        setCurrentPw('');
        setNewPw('');
        setConfirmPw('');
        setPwMessage(null);
      }, 1500);
    } catch (err: any) {
      setPwMessage({ tone: 'error', text: err?.message || 'Failed to update password.' });
    } finally {
      setPwSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await executeSignOut(navigate);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-[#DCE4EC] p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-20 h-20 rounded-full bg-[#06294D] text-[#FAD465] flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
          {user?.full_name?.charAt(0) || 'S'}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-xl font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52]">
              {user?.full_name || 'HRSJM Seeker'}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0] self-center sm:self-auto">
              <CheckCircle2 size={12} />
              <span>Verified Seeker</span>
            </span>
          </div>

          <p className="text-xs text-[#718096] mt-1">
            Registered Account: <strong className="text-[#06294D] font-mono">{user?.mobile_number || '9888880004'}</strong>
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
            <Link
              to="/seeker/profile/id-card"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#06294D] text-[#FAD465] text-xs font-bold rounded-lg hover:bg-[#123F68] transition"
            >
              <CreditCard size={13} />
              <span>View Seeker ID Card</span>
            </Link>

            <button
              type="button"
              onClick={() => setPwModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EDF2F7] text-[#0B2F52] text-xs font-bold rounded-lg hover:bg-[#DBE5EE] transition cursor-pointer"
            >
              <Lock size={13} />
              <span>Change Password</span>
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg hover:bg-rose-100 transition cursor-pointer"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Profile details updated successfully!</span>
        </div>
      )}

      {/* Personal Info & Residential Data */}
      <div className="bg-white rounded-2xl border border-[#DCE4EC] p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#DBE5EE]">
          <h3 className="text-sm font-bold text-[#06294D] uppercase tracking-wider">
            Personal & Residential Information
          </h3>

          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#06294D] hover:underline cursor-pointer"
            >
              <Edit2 size={13} />
              <span>Edit Details</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:underline cursor-pointer"
            >
              <X size={13} />
              <span>Cancel</span>
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#0B2F52] uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#EDF2F7] border border-[#DBE5EE] rounded-lg text-[#0B2F52] focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#0B2F52] uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#EDF2F7] border border-[#DBE5EE] rounded-lg text-[#0B2F52] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#0B2F52] uppercase mb-1">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-[#EDF2F7] border border-[#DBE5EE] rounded-lg text-[#0B2F52] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#0B2F52] uppercase mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-[#EDF2F7] border border-[#DBE5EE] rounded-lg text-[#0B2F52] focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#0B2F52] uppercase mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 bg-[#EDF2F7] border border-[#DBE5EE] rounded-lg text-[#0B2F52] focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#0B2F52] uppercase mb-1">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2 bg-[#EDF2F7] border border-[#DBE5EE] rounded-lg text-[#0B2F52] focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-[#EDF2F7] text-gray-700 font-bold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-[#FAD465] hover:bg-[#E9B82E] text-[#011F39] font-bold rounded-lg cursor-pointer shadow-xs"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#DCE4EC]">
              <span className="text-[10px] text-gray-500 uppercase font-semibold block">Full Name</span>
              <span className="text-sm font-bold text-[#0B2F52] mt-0.5 block">{user?.full_name || 'HRSJM Seeker'}</span>
            </div>

            <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#DCE4EC]">
              <span className="text-[10px] text-gray-500 uppercase font-semibold block">Mobile Number</span>
              <span className="text-sm font-bold text-[#0B2F52] mt-0.5 block">{user?.mobile_number || '9888880004'}</span>
            </div>

            <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#DCE4EC]">
              <span className="text-[10px] text-gray-500 uppercase font-semibold block">Email Address</span>
              <span className="text-sm font-bold text-[#0B2F52] mt-0.5 block">{user?.email || 'seeker@hrsjm.org'}</span>
            </div>

            <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#DCE4EC]">
              <span className="text-[10px] text-gray-500 uppercase font-semibold block">City & State</span>
              <span className="text-sm font-bold text-[#0B2F52] mt-0.5 block">
                {user?.city || 'Mumbai'}, {user?.state || 'Maharashtra'} - {user?.pincode || '400050'}
              </span>
            </div>

            <div className="sm:col-span-2 p-3 bg-[#FAF7F0] rounded-xl border border-[#DCE4EC]">
              <span className="text-[10px] text-gray-500 uppercase font-semibold block">Residential Address</span>
              <span className="text-xs font-semibold text-[#0B2F52] mt-0.5 block">
                {user?.address || 'HRSJM Social Welfare Center, Bandra West, Mumbai'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      {pwModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <button
              type="button"
              onClick={() => setPwModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 text-[#06294D]">
              <Lock size={18} />
              <h3 className="font-bold text-base text-[#0B2F52]">Change Account Password</h3>
            </div>

            {pwMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                  pwMessage.tone === 'success'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {pwMessage.tone === 'success' ? (
                  <CheckCircle2 size={16} className="shrink-0" />
                ) : (
                  <AlertCircle size={16} className="shrink-0" />
                )}
                <span>{pwMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#0B2F52] uppercase mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-[#EDF2F7] border border-[#DBE5EE] rounded-lg text-[#0B2F52]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#0B2F52] uppercase mb-1">
                  New Password (min 6 characters)
                </label>
                <input
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-[#EDF2F7] border border-[#DBE5EE] rounded-lg text-[#0B2F52]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#0B2F52] uppercase mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-[#EDF2F7] border border-[#DBE5EE] rounded-lg text-[#0B2F52]"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPwModalOpen(false)}
                  className="px-4 py-2 bg-[#EDF2F7] text-gray-700 font-bold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pwSubmitting}
                  className="px-5 py-2 bg-[#06294D] hover:bg-[#123F68] text-[#FAD465] font-bold rounded-lg cursor-pointer shadow-xs"
                >
                  {pwSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

