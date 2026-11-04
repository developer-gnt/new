import React from 'react';
import { X, Printer, ShieldCheck } from 'lucide-react';
import type { DonationReceiptModel } from '../types/donations.types';
import { donationsService } from '../services/donationsService';

interface DonationReceiptModalProps {
  receipt: DonationReceiptModel | null;
  onClose: () => void;
}

const formatINR = (val: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
};

export const DonationReceiptModal: React.FC<DonationReceiptModalProps> = ({
  receipt,
  onClose,
}) => {
  if (!receipt) return null;

  const handlePrint = () => {
    donationsService.printDonationReceipt(receipt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#011F39] px-6 py-4 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-[#FAD465]" />
            <div>
              <h3 className="font-semibold text-base font-serif tracking-wide text-white">
                Official 80G Donation Receipt
              </h3>
              <p className="text-xs text-slate-300 font-mono">Receipt No: {receipt.receiptNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Receipt Document Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-5 bg-slate-50/50">
          <div className="bg-white border-2 border-[#011F39]/30 rounded-xl p-6 shadow-sm relative">
            {/* Trust Header */}
            <div className="text-center border-b-2 border-[#011F39] pb-4 mb-4">
              <h2 className="text-xl font-bold font-serif text-[#011F39] tracking-wide">
                HUMAN RIGHTS SANRAKSHAN JAN MANCH
              </h2>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">
                मानव अधिकार एवं सामाजिक न्याय संरक्षण ट्रस्ट
              </p>
              <p className="text-[11px] text-slate-500 italic mt-0.5">
                मानव अधिकार · सामाजिक न्याय
              </p>
              <p className="text-[11px] text-slate-600 mt-1">
                National HQ: New Delhi, India • Regd. No: HR/0092/2019 • PAN: AABTH4589K
              </p>
              <div className="inline-block bg-[#011F39] text-[#FAD465] text-xs font-bold uppercase tracking-wider px-4 py-1 rounded mt-2.5 shadow-sm">
                Official Donation Receipt
              </div>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Receipt No:</span>
                <span className="font-mono font-bold text-slate-900">{receipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Date:</span>
                <span className="font-mono text-slate-900">
                  {new Date(receipt.receiptDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Payment Mode:</span>
                <span className="font-medium text-slate-800">{receipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Txn Ref:</span>
                <span className="font-mono text-slate-800 font-medium">{receipt.transactionId || 'N/A'}</span>
              </div>
            </div>

            {/* Donor Information */}
            <div className="text-xs mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                DONOR DETAILS
              </span>
              <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-1">
                <div className="text-sm font-bold text-slate-900 font-serif">
                  {receipt.donorName}
                </div>
                {receipt.donorMobile && (
                  <div className="text-slate-600">Mobile: {receipt.donorMobile}</div>
                )}
                {receipt.donorEmail && (
                  <div className="text-slate-600">Email: {receipt.donorEmail}</div>
                )}
                {receipt.memberCode && (
                  <div className="text-slate-600 font-mono text-[11px]">
                    Member ID: <strong>{receipt.memberCode}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Contribution Details */}
            <div className="text-xs mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                CONTRIBUTION PARTICULARS
              </span>
              <div className="border border-slate-200 rounded-lg p-3 bg-white flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800">{receipt.cause}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Platform Source: {receipt.source || 'Website'}
                  </div>
                  {receipt.notes && (
                    <div className="text-[11px] text-slate-500 italic mt-0.5">
                      Note: {receipt.notes}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-mono text-lg font-bold text-emerald-700">
                    {formatINR(receipt.amount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Amount Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Total Amount Received
              </span>
              <span className="font-mono text-xl font-bold text-emerald-700">
                {formatINR(receipt.amount)}
              </span>
            </div>

            {/* 80G Tax Exemption Clause */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 leading-relaxed">
              <span className="font-bold">🏛️ Tax Exemption Notice under Section 80G:</span>
              <p className="mt-0.5 text-[11px] text-amber-800">
                Donations to Human Rights Sanrakshan Jan Manch are eligible for tax deduction under Section 80G of the Income Tax Act, 1961 vide Unique Registration Number (URN) <strong>AAATH1234KF20214</strong> dated 12/04/2021.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#011F39] text-[#FAD465] text-xs font-semibold hover:bg-[#022c50] shadow-sm transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Print Official Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
