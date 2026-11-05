import React, { useRef } from 'react';
import {
  FileText,
  Search,
  Plus,
  ShieldCheck,
  FileEdit,
  X,
  ArrowRight,
  File,
  Image as ImageIcon,
} from 'lucide-react';
import type { HelpTopic } from '../../data/helpTopicsData';

export interface UploadedDoc {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
}

export interface ComplaintStep1Props {
  selectedTopics: HelpTopic[];
  onOpenTopicModal: () => void;
  onRemoveTopic: (id: string) => void;
  subject: string;
  setSubject: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  aadhaarFiles: UploadedDoc[];
  setAadhaarFiles: React.Dispatch<React.SetStateAction<UploadedDoc[]>>;
  handwrittenFiles: UploadedDoc[];
  setHandwrittenFiles: React.Dispatch<React.SetStateAction<UploadedDoc[]>>;
  errors: Record<string, string>;
  onNext: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const ComplaintStep1Details: React.FC<ComplaintStep1Props> = ({
  selectedTopics,
  onOpenTopicModal,
  onRemoveTopic,
  subject,
  setSubject,
  description,
  setDescription,
  aadhaarFiles,
  setAadhaarFiles,
  handwrittenFiles,
  setHandwrittenFiles,
  errors,
  onNext,
}) => {
  const aadhaarInputRef = useRef<HTMLInputElement>(null);
  const handwrittenInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<UploadedDoc[]>>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newDocs: UploadedDoc[] = [];
    const rejected: string[] = [];

    Array.from(files).forEach((file, idx) => {
      if (file.size > MAX_FILE_SIZE) {
        rejected.push(`${file.name} is larger than 5 MB.`);
        return;
      }
      newDocs.push({
        id: `doc-${Date.now()}-${idx}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
      });
    });

    if (rejected.length > 0) {
      alert(`Some files could not be uploaded:\n${rejected.join('\n')}`);
    }

    if (newDocs.length > 0) {
      setter(prev => [...prev, ...newDocs]);
    }

    // Reset input value so same file can be re-selected if removed
    e.target.value = '';
  };

  const removeAadhaar = (id: string) => {
    setAadhaarFiles(prev => prev.filter(f => f.id !== id));
  };

  const removeHandwritten = (id: string) => {
    setHandwrittenFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#06294D] tracking-tight">
          Complaint Details
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Provide complete incident facts and attach supporting documents if available.
        </p>
      </div>

      {/* Field: What type of help do you need? */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700">
          What type of help do you need? <span className="text-rose-500">*</span>
        </label>

        {selectedTopics.length > 0 ? (
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex flex-wrap gap-2">
              {selectedTopics.map(topic => (
                <div
                  key={topic.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-white shadow-xs text-xs font-bold text-[#06294D]"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: topic.badgeColor }}
                  />
                  <span>{topic.title}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveTopic(topic.id)}
                    className="ml-1 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onOpenTopicModal}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#06294D] hover:text-[#083563] cursor-pointer"
            >
              <Plus size={14} className="text-[#E9B82E]" />
              <span>+ Add / Edit Help Types ({selectedTopics.length} selected)</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenTopicModal}
            className={`w-full px-3.5 py-3 rounded-2xl border text-left flex items-center gap-2.5 cursor-pointer bg-white transition-all ${
              errors.helpType
                ? 'border-rose-400 ring-2 ring-rose-100'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <Search size={16} className="text-slate-400 shrink-0" />
            <span className="text-xs text-slate-400 font-medium">
              Select type(s) of help (multiple allowed)...
            </span>
          </button>
        )}
        {errors.helpType && (
          <p className="text-[11px] font-semibold text-rose-500">{errors.helpType}</p>
        )}
      </div>

      {/* Field: Subject / Title */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700">
          Subject / Title <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <FileText
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            required
            placeholder="Briefly describe your issue"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-2xl border bg-white text-xs font-medium placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#06294D] transition-all ${
              errors.subject
                ? 'border-rose-400 ring-2 ring-rose-100'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          />
        </div>
        {errors.subject && (
          <p className="text-[11px] font-semibold text-rose-500">{errors.subject}</p>
        )}
      </div>

      {/* Field: Detailed Description */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700">
          Detailed Description <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <textarea
            required
            rows={5}
            maxLength={1000}
            placeholder="Please provide full details of your complaint or the help you need."
            value={description}
            onChange={e => setDescription(e.target.value)}
            className={`w-full p-3.5 pb-7 rounded-2xl border bg-white text-xs font-medium placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#06294D] transition-all resize-y ${
              errors.description
                ? 'border-rose-400 ring-2 ring-rose-100'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          />
          <span className="absolute right-3 bottom-2 text-[10px] font-mono font-semibold text-slate-400">
            {description.length}/1000
          </span>
        </div>
        {errors.description && (
          <p className="text-[11px] font-semibold text-rose-500">{errors.description}</p>
        )}
      </div>

      {/* Field: Upload Aadhaar Card (Optional) */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700">
          Upload Aadhaar Card (Optional)
        </label>
        <input
          ref={aadhaarInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.pdf,image/*,application/pdf"
          onChange={e => handleFileUpload(e, setAadhaarFiles)}
          className="hidden"
        />
        <div
          onClick={() => aadhaarInputRef.current?.click()}
          className="p-4 sm:p-5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-slate-300 bg-slate-50/60 hover:bg-slate-50 text-center cursor-pointer transition-colors space-y-1"
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 text-[#06294D] flex items-center justify-center mx-auto mb-1.5">
            <ShieldCheck size={22} />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-[#06294D]">
            {aadhaarFiles.length > 0
              ? `${aadhaarFiles.length} Aadhaar file${aadhaarFiles.length === 1 ? '' : 's'} selected`
              : 'Tap to upload Aadhaar Card'}
          </h4>
          <p className="text-[11px] text-slate-500">
            {aadhaarFiles.length > 0
              ? 'Click to add more · JPG, PNG, PDF (max 5MB each)'
              : 'Front & Back copy · JPG, PNG, PDF (max 5MB each)'}
          </p>
        </div>

        {aadhaarFiles.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {aadhaarFiles.map(file => (
              <div
                key={file.id}
                className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#06294D] flex items-center justify-center shrink-0">
                    {file.name.toLowerCase().endsWith('.pdf') ? (
                      <File size={14} />
                    ) : (
                      <ImageIcon size={14} />
                    )}
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-slate-800 truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-400">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeAadhaar(file.id)}
                  className="p-1 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Field: Upload Handwritten Complaint (Optional) */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700">
          Upload Handwritten Complaint (Optional)
        </label>
        <input
          ref={handwrittenInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.pdf,image/*,application/pdf"
          onChange={e => handleFileUpload(e, setHandwrittenFiles)}
          className="hidden"
        />
        <div
          onClick={() => handwrittenInputRef.current?.click()}
          className="p-4 sm:p-5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-slate-300 bg-slate-50/60 hover:bg-slate-50 text-center cursor-pointer transition-colors space-y-1"
        >
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto mb-1.5">
            <FileEdit size={22} />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-[#06294D]">
            {handwrittenFiles.length > 0
              ? `${handwrittenFiles.length} file${handwrittenFiles.length === 1 ? '' : 's'} selected`
              : 'Tap to upload Handwritten Complaint'}
          </h4>
          <p className="text-[11px] text-slate-500">
            {handwrittenFiles.length > 0
              ? 'Click to add more · Photo or scanned letter (max 5MB)'
              : 'Clear photo or scanned letter · JPG, PNG, PDF (max 5MB)'}
          </p>
        </div>

        {handwrittenFiles.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {handwrittenFiles.map(file => (
              <div
                key={file.id}
                className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                    {file.name.toLowerCase().endsWith('.pdf') ? (
                      <File size={14} />
                    ) : (
                      <ImageIcon size={14} />
                    )}
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-slate-800 truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-400">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeHandwritten(file.id)}
                  className="p-1 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Step 1 Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onNext}
          className="w-full py-3.5 px-5 rounded-2xl bg-[#E9B82E] hover:bg-[#d8a825] text-[#06294D] font-extrabold text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Next: Your Details</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
