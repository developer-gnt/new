import React, { useState } from 'react';
import { MapPin, Building, Globe, CreditCard } from 'lucide-react';
import { INDIAN_STATES, STATE_CITIES } from '../../data/membershipCategoriesData';

export interface Step2FormData {
  addressLine1: string;
  addressLine2: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  aadhaarNumber: string;
}

interface MembershipStep2Props {
  initialData: Step2FormData;
  onNext: (data: Step2FormData) => void;
  onBack: () => void;
}

export const MembershipStep2: React.FC<MembershipStep2Props> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const [formData, setFormData] = useState<Step2FormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableCities = formData.state && STATE_CITIES[formData.state]
    ? STATE_CITIES[formData.state]
    : ['Mumbai', 'Delhi', 'Bengaluru', 'Kolkata', 'Chennai', 'Hyderabad', 'Ahmedabad', 'Pune', 'Jaipur', 'Lucknow'];

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.addressLine1.trim() || formData.addressLine1.trim().length < 5) {
      errs.addressLine1 = 'Address line 1 must be at least 5 characters.';
    }

    if (!formData.state) {
      errs.state = 'Please select your state.';
    }

    if (!formData.city) {
      errs.city = 'Please select or enter your city / district.';
    }

    const cleanPin = formData.pincode.replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      errs.pincode = 'Must be a valid 6-digit Indian postal pincode.';
    }

    const cleanAadhaar = formData.aadhaarNumber.replace(/[\s-]/g, '');
    if (cleanAadhaar.length < 10) {
      errs.aadhaarNumber = 'Please enter a valid Aadhaar number (12 digits) or Voter ID.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
      {/* Step Header */}
      <div className="border-b border-slate-100 pb-4">
        <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
          Step 2 of 3
        </span>
        <h2 className="text-xl font-black text-[#06294D]">Residential Address & Official Identity</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Your official appointment certificate and welcome credentials kit will be dispatched to this address.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Address Line 1 */}
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Permanent Address Line 1 (House / Flat No, Building, Street) *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              required
              value={formData.addressLine1}
              onChange={e => setFormData({ ...formData, addressLine1: e.target.value })}
              placeholder="e.g. Flat 402, Royal Palms, Link Road"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D]"
            />
          </div>
          {errors.addressLine1 && <p className="text-[11px] text-rose-600 mt-1">{errors.addressLine1}</p>}
        </div>

        {/* Address Line 2 */}
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Address Line 2 (Area, Colony, Landmark)
          </label>
          <input
            type="text"
            value={formData.addressLine2}
            onChange={e => setFormData({ ...formData, addressLine2: e.target.value })}
            placeholder="e.g. Near City Civil Court"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D]"
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            State / Union Territory *
          </label>
          <select
            value={formData.state}
            onChange={e => {
              const newState = e.target.value;
              const newCities = STATE_CITIES[newState] || [];
              setFormData({
                ...formData,
                state: newState,
                city: newCities.length > 0 ? newCities[0] : '',
              });
            }}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D] bg-white cursor-pointer"
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.state && <p className="text-[11px] text-rose-600 mt-1">{errors.state}</p>}
        </div>

        {/* City / District */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            City / District *
          </label>
          {availableCities.length > 0 ? (
            <div className="relative">
              <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <select
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D] bg-white cursor-pointer"
              >
                {availableCities.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <input
              type="text"
              required
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              placeholder="Enter city or district"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D]"
            />
          )}
          {errors.city && <p className="text-[11px] text-rose-600 mt-1">{errors.city}</p>}
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Postal Pincode (6 Digits) *
          </label>
          <input
            type="text"
            required
            maxLength={6}
            value={formData.pincode}
            onChange={e => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
            placeholder="e.g. 400001"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D]"
          />
          {errors.pincode && <p className="text-[11px] text-rose-600 mt-1">{errors.pincode}</p>}
        </div>

        {/* Country */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Country *
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              disabled
              value={formData.country || 'India'}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-600 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Aadhaar / Voter ID (Full Width) */}
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Aadhaar Card Number / Voter ID Number *
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              required
              value={formData.aadhaarNumber}
              onChange={e => setFormData({ ...formData, aadhaarNumber: e.target.value })}
              placeholder="e.g. 1234 5678 9012 or Voter ID"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D]"
            />
          </div>
          <p className="text-[10.5px] text-slate-500 mt-1">
            Used strictly for KYC identity verification under Societies Registration Act 1860.
          </p>
          {errors.aadhaarNumber && <p className="text-[11px] text-rose-600 mt-1">{errors.aadhaarNumber}</p>}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          ← Back to Step 1
        </button>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-[#FAD465] hover:bg-[#E9B82E] active:bg-[#D4A416] text-[#011F39] text-xs font-black shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer flex items-center gap-2 border border-[#E9B82E]"
        >
          <span>Continue to Documents &amp; Fee (Step 3)</span>
          <span>→</span>
        </button>
      </div>
    </form>
  );
};

