import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Clock,
  ArrowRight,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import { SeekerTimelineStepper } from '../components/SeekerTimelineStepper';
import { useSeekerStore } from '../store/seekerStore';
import type { AssistanceStatus } from '../types/seeker.types';

type FilterTab = 'ALL' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export const SeekerRequestsPage: React.FC = () => {
  const { requests, loadAll } = useSeekerStore();

  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      // Filter tab
      if (activeTab === 'UNDER_REVIEW' && r.status !== 'UNDER_REVIEW' && r.status !== 'PENDING') return false;
      if (activeTab === 'APPROVED' && r.status !== 'APPROVED') return false;
      if (activeTab === 'REJECTED' && r.status !== 'REJECTED') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const reasonMatch = (r.reason || '').toLowerCase().includes(q);
        const descMatch = (r.description || '').toLowerCase().includes(q);
        const idMatch = (r.id || '').toLowerCase().includes(q);
        return reasonMatch || descMatch || idMatch;
      }
      return true;
    });
  }, [requests, activeTab, searchQuery]);

  const tabs: Array<{ key: FilterTab; label: string }> = [
    { key: 'ALL', label: `All (${requests.length})` },
    { key: 'UNDER_REVIEW', label: 'In Review' },
    { key: 'APPROVED', label: 'Approved' },
    { key: 'REJECTED', label: 'Rejected' },
  ];

  const getStatusBadge = (status: AssistanceStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 size={13} />
            <span>Approved</span>
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock size={13} />
            <span>Under Review</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertCircle size={13} />
            <span>Action Required</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Clock size={13} />
            <span>Submitted</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-[#DCE4EC] p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">
            <FileText size={14} className="text-[#06294D]" />
            <span>Applications Tracker</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52]">
            Aid Application Tracker
          </h1>
          <p className="text-xs text-[#718096] mt-0.5">
            Track real-time verification status, field assessments, and relief progress.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-xl border border-[#DBE5EE] text-[#0B2F52] hover:bg-[#EDF2F7] transition cursor-pointer"
            title="Refresh application status"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>

          <Link
            to="/seeker/apply"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FAD465] hover:bg-[#E9B82E] active:bg-[#C9971A] text-[#011F39] text-xs font-bold rounded-xl shadow-xs transition"
          >
            <PlusCircle size={15} />
            <span>+ Apply for Aid</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl border border-[#DCE4EC] p-4 shadow-xs space-y-4">
        {/* Tabs */}
        <div className="flex border-b border-[#DBE5EE] gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-[#06294D] text-[#FAD465] shadow-xs'
                  : 'text-[#718096] hover:bg-[#EDF2F7] hover:text-[#0B2F52]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search applications by cause, reason, reference number..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#EDF2F7] border border-[#DBE5EE] rounded-xl text-[#0B2F52] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FAD465] focus:bg-white transition"
          />
          <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#DCE4EC] p-6 shadow-sm hover:border-[#FAD465]/80 transition space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#DBE5EE]">
                <div>
                  <div className="text-[11px] font-mono font-bold text-[#0D9488]">
                    ASST-{item.id.slice(0, 8).toUpperCase()}
                  </div>
                  <h3 className="text-lg font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52] mt-0.5">
                    {item.reason}
                  </h3>
                  <div className="text-xs text-[#718096] mt-0.5">
                    Submitted on{' '}
                    {new Date(item.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                <div>{getStatusBadge(item.status)}</div>
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-xs text-[#34516D] leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              )}

              {/* Required Amount Banner */}
              {Number(item.requested_amount) > 0 && (
                <div className="px-4 py-2.5 rounded-xl bg-[#EDF2F7] border-l-3 border-[#FAD465] flex items-center justify-between text-xs">
                  <span className="text-[#34516D] font-medium">Required Aid Amount</span>
                  <span className="text-base font-extrabold text-[#0B2F52]">
                    ₹{Number(item.requested_amount).toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              {/* 4-Step Stepper */}
              <div className="py-2">
                <SeekerTimelineStepper status={item.status} />
              </div>

              {/* Admin Remark Feedback */}
              {item.admin_remark && (
                <div
                  className={`p-3.5 rounded-xl text-xs border ${
                    item.status === 'REJECTED'
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : 'bg-[#EDF2F7] border-[#DBE5EE] text-[#0B2F52]'
                  }`}
                >
                  <div className="font-bold mb-0.5">Review Feedback:</div>
                  <p className="leading-relaxed">{item.admin_remark}</p>
                </div>
              )}

              {/* Live Campaign notice if approved */}
              {item.status === 'APPROVED' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-medium">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>
                    This cause has been verified and published to the HRSJM public relief fund!
                  </span>
                </div>
              )}

              {/* Card Actions */}
              <div className="pt-3 border-t border-[#DBE5EE] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[#718096] text-[11px]">
                    {item.documents && item.documents.length > 0
                      ? `${item.documents.length} document(s) attached`
                      : 'No documents attached'}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Link
                    to={`/seeker/support?query=ASST-${item.id.slice(0, 8).toUpperCase()}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DBE5EE] text-[#0B2F52] hover:bg-[#EDF2F7] font-semibold transition"
                  >
                    <MessageSquare size={13} className="text-[#0D47A1]" />
                    <span>Ask Helpdesk</span>
                  </Link>

                  <Link
                    to={`/seeker/requests/${item.id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#06294D] hover:bg-[#123F68] text-[#FAD465] font-bold shadow-xs transition"
                  >
                    <span>View Details & Docs</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-[#DCE4EC] p-12 text-center shadow-xs">
            <div className="w-14 h-14 bg-[#EDF2F7] rounded-full flex items-center justify-center mx-auto text-[#06294D] mb-3">
              <FolderOpen size={28} />
            </div>
            <h3 className="text-base font-bold text-[#0B2F52]">No Aid Applications Found</h3>
            <p className="text-xs text-[#718096] mt-1 max-w-sm mx-auto leading-relaxed">
              {searchQuery
                ? 'No applications match your search query.'
                : activeTab === 'ALL'
                ? "You haven't submitted any aid applications yet. Tap below to submit a new assistance application."
                : `No applications with status "${activeTab.replace('_', ' ')}".`}
            </p>
            <div className="mt-5">
              <Link
                to="/seeker/apply"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FAD465] hover:bg-[#E9B82E] active:bg-[#C9971A] text-[#011F39] text-xs font-bold rounded-xl shadow-xs transition"
              >
                <PlusCircle size={15} />
                <span>+ Submit Application</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

