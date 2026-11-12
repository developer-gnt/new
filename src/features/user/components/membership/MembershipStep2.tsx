import React, { useState } from 'react';
import { MapPin, Building, Globe, AlertCircle } from 'lucide-react';
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
  const defaultState = initialData.state || 'Maharashtra';
  const defaultCities = STATE_CITIES[defaultState] || ['Mumbai', 'Pune', 'Nagpur', 'Nashik'];
  const defaultCity = initialData.city || defaultCities[0] || 'Mumbai';

  const [formData, setFormData] = useState<Step2FormData>({
    ...initialData,
    state: initialData.state || defaultState,
    city: initialData.city || defaultCity,
    country: initialData.country || 'India',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customCityMode, setCustomCityMode] = useState(false);

  const availableCities = formData.state && STATE_CITIES[formData.state]
    ? STATE_CITIES[formData.state]
    : ['Mumbai', 'Delhi', 'Bengaluru', 'Kolkata', 'Chennai', 'Hyderabad', 'Ahmedabad', 'Pune', 'Jaipur', 'Lucknow'];

  const validate = () => {
    const errs: Record<string, string> = {};

    const cleanAddress = formData.addressLine1.trim();
    if (!cleanAddress || cleanAddress.length < 3) {
      errs.addressLine1 = 'Address line 1 must be at least 3 characters.';
    }

    if (!formData.state.trim()) {
      errs.state = 'Please select your state.';
    }

    if (!formData.city.trim()) {
      errs.city = 'Please select or enter your city / district.';
    }

    const cleanPin = formData.pincode.replace(/\D/g, '');
    if (!cleanPin || cleanPin.length !== 6) {
      errs.pincode = 'Must be a valid 6-digit Indian postal pincode.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    } else {
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
      {/* Step Header */}
      <div className="border-b border-slate-100 pb-4">
        <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
          Step 2 of 3
        </span>
        <h2 className="text-xl font-black text-[#06294D]">Residential Address &amp; Delivery Details</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Your official appointment certificate and welcome credentials kit will be dispatched to this address.
        </p>
      </div>

      {/* Global Error Banner if validation fails */}
      {Object.keys(errors).length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 font-bold text-rose-900">
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
            <span>Please complete the required address fields to proceed:</span>
          </div>
          <ul className="list-disc list-inside text-[11.5px] text-rose-700 pl-1 space-y-0.5 font-medium">
            {Object.values(errors).map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

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
              onChange={e => {
                setFormData({ ...formData, addressLine1: e.target.value });
                if (errors.addressLine1) setErrors({ ...errors, addressLine1: '' });
              }}
              placeholder="e.g. Flat 402, Royal Palms, Link Road"
              className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D] ${
                errors.addressLine1 ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              }`}
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
              if (errors.state) setErrors({ ...errors, state: '' });
            }}
            className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D] bg-white cursor-pointer ${
              errors.state ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
            }`}
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
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[11px] font-bold text-slate-700">
              City / District *
            </label>
            <button
              type="button"
              onClick={() => setCustomCityMode(!customCityMode)}
              className="text-[10px] text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              {customCityMode ? 'Choose from list' : 'Type custom city'}
            </button>
          </div>

          {customCityMode || availableCities.length === 0 ? (
            <div className="relative">
              <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={formData.city}
                onChange={e => {
                  setFormData({ ...formData, city: e.target.value });
                  if (errors.city) setErrors({ ...errors, city: '' });
                }}
                placeholder="Enter city or district name"
                className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D] ${
                  errors.city ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
            </div>
          ) : (
            <div className="relative">
              <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <select
                value={formData.city}
                onChange={e => {
                  setFormData({ ...formData, city: e.target.value });
                  if (errors.city) setErrors({ ...errors, city: '' });
                }}
                className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D] bg-white cursor-pointer ${
                  errors.city ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              >
                <option value="">Select City / District</option>
                {availableCities.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
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
            onChange={e => {
              const clean = e.target.value.replace(/\D/g, '').slice(0, 6);
              setFormData({ ...formData, pincode: clean });
              if (errors.pincode) setErrors({ ...errors, pincode: '' });
            }}
            placeholder="e.g. 400001"
            className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D] tracking-wider ${
              errors.pincode ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
            }`}
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
