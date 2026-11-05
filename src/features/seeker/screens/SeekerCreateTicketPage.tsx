import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  MessageSquare,
  Send,
  AlertCircle,
  UploadCloud,
  FileText,
  X,
} from 'lucide-react';
import { useSeekerStore } from '../store/seekerStore';
import { TICKET_CATEGORIES } from '../data/seekerData';

/**
 * Exact replication of CreateSupportTicketScreen.tsx & FileComplaintScreen.tsx from the HRSJM React Native APK:
 * - Header: Back arrow in circle, Title "Create Support Ticket / File Grievance", subtitle
 * - Category selector pills
 * - Subject input with validation
 * - Urgency level selector (Low, Medium, High, Critical)
 * - Description textarea
 * - Supporting record attachment
 * - Cancel and Submit CTA buttons
 */
export const SeekerCreateTicketPage: React.FC = () => {
  const navigate = useNavigate();
  const { createTicket } = useSeekerStore();

  const [category, setCategory] = useState<string>('Application Status');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');
  const [attachment, setAttachment] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setError('Please provide both a subject and detailed description.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await createTicket({
        category,
        subject: subject.trim(),
        description: description.trim(),
        priority,
      });

      navigate('/seeker/support');
    } catch (err: any) {
      setError(err?.message || 'Failed to submit ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#DCE4EC] px-4 py-3 shadow-xs flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/seeker/support')}
          className="w-9 h-9 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center text-[#0F2C59] transition cursor-pointer"
          aria-label="Go back"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>

        <div className="flex-1 truncate">
          <h1 className="text-base font-bold text-[#0F2C59] truncate">
            New Support Ticket / Grievance
          </h1>
          <p className="text-[11px] text-[#64748B] truncate">
            Official inquiry to HRSJM assessment and legal desk
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/seeker/support')}
          className="w-9 h-9 rounded-full bg-[#F8FAFC] hover:bg-[#F1F5F9] flex items-center justify-center text-[#64748B] transition cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#DCE4EC] shadow-xs overflow-hidden">
        {/* Banner */}
        <div className="bg-[#06294D] p-5 text-white flex items-center gap-3 border-b-2 border-[#FAD465]">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#FAD465] shrink-0">
            <MessageSquare size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold font-['Playfair_Display',Georgia,serif]">
              Submit Inquiry or Legal Complaint
            </h2>
            <p className="text-xs text-blue-200 mt-0.5">
              Case officers respond within 24 hours to verified applicants.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
              <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#0B2F52] uppercase tracking-wider mb-1.5">
              Query Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-[#EDF2F7] border border-[#CBD5E1] rounded-xl text-[#0B2F52] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FAD465]"
            >
              {TICKET_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B2F52] uppercase tracking-wider mb-1.5">
              Subject / Topic <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Inquiring regarding status of Medical Aid ASST-..."
              className="w-full px-3.5 py-2 text-xs bg-[#EDF2F7] border border-[#CBD5E1] rounded-xl text-[#0B2F52] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FAD465]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B2F52] uppercase tracking-wider mb-1.5">
              Urgency / Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                    priority === p
                      ? 'bg-[#06294D] text-[#FAD465] border-[#06294D]'
                      : 'bg-[#EDF2F7] text-[#718096] border-[#DBE5EE]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B2F52] uppercase tracking-wider mb-1.5">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide complete details, application reference number, and specific questions..."
              className="w-full px-3.5 py-2 text-xs bg-[#EDF2F7] border border-[#CBD5E1] rounded-xl text-[#0B2F52] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FAD465]"
              required
            />
          </div>

          {/* Attachment */}
          <div>
            <label className="block text-xs font-semibold text-[#0B2F52] uppercase tracking-wider mb-1.5">
              Attach Supporting Record (Optional)
            </label>
            {attachment ? (
              <div className="flex items-center justify-between p-2.5 bg-[#EDF2F7] rounded-xl text-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileText size={15} className="text-[#06294D] shrink-0" />
                  <span className="truncate">{attachment.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-2 p-3 border-2 border-dashed border-[#CBD5E1] rounded-xl bg-[#F8FAFC] hover:border-[#06294D] cursor-pointer text-xs text-[#34516D]">
                <UploadCloud size={16} className="text-[#06294D]" />
                <span>Upload document or photo (PDF, JPG, PNG)</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#DBE5EE]">
            <button
              type="button"
              onClick={() => navigate('/seeker/support')}
              className="px-4 py-2 bg-[#EDF2F7] hover:bg-[#E2E8F0] text-[#34516D] font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#FAD465] hover:bg-[#E9B82E] active:bg-[#C9971A] text-[#011F39] font-bold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-60"
            >
              <Send size={13} />
              <span>{submitting ? 'Submitting...' : 'Submit Ticket'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
