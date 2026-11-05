import React from 'react';
import {
  User,
  Mail,
  MapPin,
  Shield,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { INDIA_LOCATIONS } from '../../data/indiaLocations';

export interface UserDetailsForm {
  fullName: string;
  mobile: string;
  email: string;
  address: string;
  policeStation: string;
  state: string;
  city: string;
}

export interface ComplaintStep2Props {
  form: UserDetailsForm;
  setForm: React.Dispatch<React.SetStateAction<UserDetailsForm>>;
  errors: Record<string, string>;
  onBack: () => void;
  onNext: () => void;
}

export const ComplaintStep2User: React.FC<ComplaintStep2Props> = ({
  form,
  setForm,
  errors,
  onBack,
  onNext,
}) => {
  const currentState = INDIA_LOCATIONS.find(s => s.name === form.state);
  const availableCities = currentState ? currentState.cities : [];

  const handleStateChange = (stateName: string) => {
    setForm(prev => ({
      ...prev,
      state: stateName,
      city: '', // Reset city when state changes
    }));
  };

  const handleMobileChange = (val: string) => {
    const digits = val.replace(/[^0-9]/g, '').slice(0, 10);
    setForm(prev => ({ ...prev, mobile: digits }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#06294D] tracking-tight">
          Your Details
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Enter your contact information so our legal defense officers can reach you.
        </p>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={e => setForm(prev => ({ ...prev, fullName: e.target.value }))}
              className={`w-full pl-10 pr-4 py-3 rounded-2xl border bg-white text-xs font-medium placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#06294D] transition-all ${
                errors.fullName
                  ? 'border-rose-400 ring-2 ring-rose-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="text-[11px] font-semibold text-rose-500">{errors.fullName}</p>
          )}
        </div>

        {/* Mobile Number with +91 */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Mobile Number <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 text-[#06294D] font-bold text-xs select-none">
              <span>🇮🇳</span>
              <span>+91</span>
            </div>
            <input
              type="tel"
              required
              maxLength={10}
              placeholder="Enter 10-digit mobile number"
              value={form.mobile}
              onChange={e => handleMobileChange(e.target.value)}
              className={`w-full pl-20 pr-4 py-3 rounded-2xl border bg-white text-xs font-medium placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#06294D] transition-all ${
                errors.mobile
                  ? 'border-rose-400 ring-2 ring-rose-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            />
          </div>
          {errors.mobile && (
            <p className="text-[11px] font-semibold text-rose-500">{errors.mobile}</p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Email Address <span className="text-slate-400 text-[11px] font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              placeholder="Enter your email address"
              value={form.email}
              onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
              className={`w-full pl-10 pr-4 py-3 rounded-2xl border bg-white text-xs font-medium placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#06294D] transition-all ${
                errors.email
                  ? 'border-rose-400 ring-2 ring-rose-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] font-semibold text-rose-500">{errors.email}</p>
          )}
        </div>

        {/* Complete Address */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Full Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              placeholder="Enter house no, street, locality or area"
              value={form.address}
              onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
              className={`w-full pl-10 pr-4 py-3 rounded-2xl border bg-white text-xs font-medium placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#06294D] transition-all ${
                errors.address
                  ? 'border-rose-400 ring-2 ring-rose-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            />
          </div>
          {errors.address && (
            <p className="text-[11px] font-semibold text-rose-500">{errors.address}</p>
          )}
        </div>

        {/* Nearby Police Station */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Nearby Police Station <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Shield size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              placeholder="Enter name of nearest police station having jurisdiction"
              value={form.policeStation}
              onChange={e => setForm(prev => ({ ...prev, policeStation: e.target.value }))}
              className={`w-full pl-10 pr-4 py-3 rounded-2xl border bg-white text-xs font-medium placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#06294D] transition-all ${
                errors.policeStation
                  ? 'border-rose-400 ring-2 ring-rose-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            />
          </div>
          {errors.policeStation && (
            <p className="text-[11px] font-semibold text-rose-500">{errors.policeStation}</p>
          )}
        </div>

        {/* State & City (2 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* State */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              State <span className="text-rose-500">*</span>
            </label>
            <select
              value={form.state}
              onChange={e => handleStateChange(e.target.value)}
              className={`w-full px-3.5 py-3 rounded-2xl border bg-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#06294D] transition-all ${
                errors.state
                  ? 'border-rose-400 ring-2 ring-rose-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <option value="">Select your state</option>
              {INDIA_LOCATIONS.map(s => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.state && (
              <p className="text-[11px] font-semibold text-rose-500">{errors.state}</p>
            )}
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              City / District <span className="text-rose-500">*</span>
            </label>
            <select
              disabled={!form.state}
              value={form.city}
              onChange={e => setForm(prev => ({ ...prev, city: e.target.value }))}
              className={`w-full px-3.5 py-3 rounded-2xl border bg-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#06294D] transition-all ${
                !form.state
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200'
                  : errors.city
                  ? 'border-rose-400 ring-2 ring-rose-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <option value="">
                {form.state ? 'Select your city' : 'Select state first'}
              </option>
              {availableCities.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="text-[11px] font-semibold text-rose-500">{errors.city}</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="pt-2 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
        >
          <ArrowLeft size={15} />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex-1 py-3.5 px-5 rounded-2xl bg-[#E9B82E] hover:bg-[#d8a825] text-[#06294D] font-extrabold text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Next: Review & Submit</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

