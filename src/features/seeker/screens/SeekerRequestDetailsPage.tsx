import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  FileText,
  CheckCircle2,
  UploadCloud,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import { SeekerTimelineStepper } from '../components/SeekerTimelineStepper';
import { seekerService } from '../services/seekerService';
import type { AssistanceDocumentItem, AssistanceRequest } from '../types/seeker.types';

export const SeekerRequestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [request, setRequest] = useState<AssistanceRequest | null>(null);
  const [documents, setDocuments] = useState<AssistanceDocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload modal / file attach state
  const [uploadDocName, setUploadDocName] = useState('Medical Report / Hospital Bill');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchDetails = async () => {
      setLoading(true);
      const req = await seekerService.getRequestById(id);
      if (req) {
        setRequest(req);
        const docs = await seekerService.listDocuments(req.id);
        setDocuments(docs.length > 0 ? docs : req.documents || []);
      }
      setLoading(false);
    };
    fetchDetails();
  }, [id]);

  const handleUploadAdditionalDoc = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !request) return;

    const file = files[0];
    setUploading(true);

    try {
      const attached = await seekerService.attachDocument(request.id, {
        document_name: uploadDocName,
        file_name: file.name,
        file_size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        file,
      });

      if (attached) {
        setDocuments((prev) => [...prev, attached]);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch {
      // Ignore
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-[#718096]">
        Loading assistance request details...
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-12 text-center space-y-3">
        <h3 className="text-base font-bold text-[#0B2F52]">Request Not Found</h3>
        <p className="text-xs text-[#718096]">Could not locate the requested assistance record.</p>
        <Link
          to="/seeker/requests"
          className="inline-block px-4 py-2 bg-[#06294D] text-[#FAD465] text-xs font-bold rounded-lg"
        >
          Back to Applications Tracker
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/seeker/requests')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B2F52] hover:text-[#06294D] transition cursor-pointer"
        >
          <ChevronLeft size={16} />
          <span>Back to Tracker</span>
        </button>

        <span className="text-xs font-mono font-bold text-[#0D9488]">
          ASST-{request.id.slice(0, 8).toUpperCase()}
        </span>
      </div>

      {/* Main Overview Card */}
      <div className="bg-white rounded-2xl border border-[#DCE4EC] p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#DBE5EE]">
          <div>
            <span className="text-[10px] font-extrabold text-[#06294D] uppercase tracking-wider block mb-1">
              AID REQUEST DOSSIER
            </span>
            <h1 className="text-xl md:text-2xl font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52]">
              {request.reason}
            </h1>
            <div className="text-xs text-[#718096] mt-1 flex items-center gap-2">
              <Calendar size={13} />
              <span>
                Registered on{' '}
                {new Date(request.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          <div className="self-start">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#EDF2F7] text-[#06294D] border border-[#DBE5EE]">
              {request.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Aid Amount Banner */}
        {Number(request.requested_amount) > 0 && (
          <div className="p-4 rounded-xl bg-[#EDF2F7] border-l-4 border-[#FAD465] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#34516D] font-medium block">Approved / Requested Sum</span>
              <span className="text-xl font-extrabold text-[#0B2F52]">
                ₹{Number(request.requested_amount).toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-[11px] text-[#718096]">Direct disbursement via welfare bank draft</span>
          </div>
        )}

        {/* 4-Step Stepper */}
        <div className="py-2">
          <SeekerTimelineStepper status={request.status} />
        </div>

        {/* Review Remarks Feedback Box */}
        {request.admin_remark && (
          <div
            className={`p-4 rounded-xl text-xs border ${
              request.status === 'REJECTED'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-[#EDF2F7] border-[#DBE5EE] text-[#0B2F52]'
            }`}
          >
            <div className="font-bold mb-1">Administrative Assessment & Note:</div>
            <p className="leading-relaxed">{request.admin_remark}</p>
          </div>
        )}

        {/* Description Section */}
        {request.description && (
          <div>
            <h3 className="text-xs font-bold text-[#06294D] uppercase tracking-wider mb-2">
              Circumstances & Ground Situation
            </h3>
            <p className="text-xs text-[#34516D] leading-relaxed bg-[#FAF7F0] p-4 rounded-xl border border-[#DCE4EC]">
              {request.description}
            </p>
          </div>
        )}

        {/* Supporting Documents Section */}
        <div className="space-y-4 pt-2 border-t border-[#DBE5EE]">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#06294D] uppercase tracking-wider">
              Supporting Verification Records ({documents.length})
            </h3>
          </div>

          {documents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 bg-[#FAF7F0] rounded-xl border border-[#DCE4EC] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3 truncate pr-2">
                    <FileText size={18} className="text-[#0D9488] shrink-0" />
                    <div className="truncate">
                      <div className="font-bold text-[#0B2F52] truncate">
                        {doc.document_name || 'Supporting Document'}
                      </div>
                      <div className="text-[10px] text-gray-500 truncate">
                        {doc.fileName || doc.file_name || 'Document.pdf'}
                        {doc.fileSize || doc.file_size ? ` • ${doc.fileSize || doc.file_size}` : ''}
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0] shrink-0">
                    {doc.verification_status || 'Attached'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500">No documents attached yet.</p>
          )}

          {/* Attach Additional Document Widget */}
          <div className="p-4 bg-[#EDF2F7] rounded-xl border border-[#DBE5EE] space-y-3">
            <div className="text-xs font-bold text-[#0B2F52]">
              Upload Additional / Rectified Document
            </div>

            {uploadSuccess && (
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={14} />
                <span>Document uploaded and attached successfully!</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <select
                value={uploadDocName}
                onChange={(e) => setUploadDocName(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-xs bg-white border border-[#DBE5EE] rounded-lg text-[#0B2F52]"
              >
                <option value="Medical Report / Hospital Bill">Medical Report / Hospital Bill</option>
                <option value="Aadhaar / ID Proof">Aadhaar / ID Proof</option>
                <option value="Income / Ration Card">Income / Ration Card</option>
                <option value="Tuition / School Fee Slip">Tuition / School Fee Slip</option>
                <option value="Other Document">Other Supporting Document</option>
              </select>

              <label className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#06294D] text-[#FAD465] text-xs font-bold rounded-lg cursor-pointer hover:bg-[#123F68] transition">
                <UploadCloud size={14} />
                <span>{uploading ? 'Uploading...' : 'Choose File to Attach'}</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleUploadAdditionalDoc}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Helpdesk Action Banner */}
        <div className="pt-4 border-t border-[#DBE5EE] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-[#718096]">
            Have a question regarding this application or disbursement timeline?
          </span>
          <Link
            to={`/seeker/support?query=ASST-${request.id.slice(0, 8).toUpperCase()}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFF9E6] border border-[#FAD465] text-[#06294D] font-bold hover:bg-[#FEF08A] transition cursor-pointer"
          >
            <MessageSquare size={14} className="text-[#0D47A1]" />
            <span>Open Ticket with Helpdesk</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

