import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Clock,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { SeekerTimelineStepper } from '../components/SeekerTimelineStepper';
import { useSeekerStore } from '../store/seekerStore';
import type { AssistanceStatus } from '../types/seeker.types';

type FilterTab = 'ALL' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

/**
 * Exact replication of SeekerRequestsScreen.tsx from the HRSJM React Native APK:
 * - Title section: "Aid Application Tracker" with subtitle and "+ Apply" gold button
 * - Filter tabs: All, In Review, Approved, Rejected with gold underline indicator
 * - Search input row with #EDF2F7 background
 * - Request card with reference ID, reason title, date, AssistanceStatusBadge, amount bar, 4-step stepper, and "Ask Helpdesk" button
 */
export const SeekerRequestsPage: React.FC = () => {
  const { requests, loadAll } = useSeekerStore();

  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  React.useEffect(() => {
    loadAll().catch(() => {});
  }, [loadAll]);

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
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]">
            <CheckCircle2 size={13} />
            <span>Approved</span>
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#FFF9E6] text-[#B45309] border border-[#FAD465]">
            <Clock size={13} />
            <span>Under Review</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle size={13} />
            <span>Action Required</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#EDF2F7] text-[#06294D] border border-[#DBE5EE]">
            <Clock size={13} />
            <span>Submitted</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. TOP TITLE SECTION (Exact APK SeekerRequestsScreen Title Section) */}
      <div className="bg-white rounded-2xl border border-[#DCE4EC] px-5 py-4 shadow-xs flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52] leading-tight">
            Aid Application Tracker
          </h1>
          <p className="text-xs text-[#718096] mt-0.5 font-medium">
            Track status and timeline of your requests
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-xl border border-[#DBE5EE] text-[#0B2F52] hover:bg-[#EDF2F7] transition cursor-pointer"
            title="Refresh application status"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          </button>

          <Link
            to="/seeker/apply"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FAD465] hover:bg-[#E9B82E] active:bg-[#C9971A] text-[#011F39] text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>+ Apply</span>
          </Link>
        </div>
      </div>

      {/* 2. FILTER TABS & SEARCH INPUT (Exact APK Filter Bar) */}
      <div className="bg-white rounded-2xl border border-[#DCE4EC] shadow-xs overflow-hidden">
        {/* Tabs Bar */}
        <div className="flex border-b border-[#DBE5EE] px-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`py-3 px-4 text-xs font-semibold whitespace-nowrap border-b-2 transition cursor-pointer ${
                activeTab === tab.key
                  ? 'border-[#E9B82E] text-[#06294D] font-bold'
                  : 'border-transparent text-[#718096] hover:text-[#0B2F52]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Row */}
        <div className="p-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search requests by purpose, cause..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#EDF2F7] border border-[#DBE5EE] rounded-xl text-[#0B2F52] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FAD465] focus:bg-white transition"
            />
            <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* 3. REQUEST CARDS LIST */}
      <div className="space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#DCE4EC] p-5 shadow-xs space-y-3.5 hover:border-[#FAD465]/80 transition"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-2 border-b border-[#DBE5EE]">
                <div>
                  <div className="text-[11px] font-mono font-bold text-[#0D9488]">
                    ASST-{item.id.slice(0, 8).toUpperCase()}
                  </div>
                  <h3 className="text-base font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52] mt-0.5">
                    {item.reason}
                  </h3>
                  <div className="text-[11px] text-[#718096] mt-0.5">
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
                <p className="text-xs text-[#34516D] leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              )}

              {/* Required Amount Banner */}
              {Number(item.requested_amount) > 0 && (
                <div className="px-3.5 py-2 rounded-xl bg-[#EDF2F7] border-l-3 border-[#FAD465] flex items-center justify-between text-xs">
                  <span className="text-[#34516D] font-medium">Required Aid Amount</span>
                  <span className="text-base font-extrabold text-[#0B2F52]">
                    ₹{Number(item.requested_amount).toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              {/* 4-Step Stepper */}
              <div className="py-1">
                <SeekerTimelineStepper status={item.status} />
              </div>

              {/* Admin Remark Feedback */}
              {item.admin_remark && (
                <div
                  className={`p-3 rounded-xl text-xs border ${
                    item.status === 'REJECTED'
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : 'bg-[#EDF2F7] border-[#DBE5EE] text-[#0B2F52]'
                  }`}
                >
                  <div className="font-bold mb-0.5">Review Feedback:</div>
                  <p className="leading-relaxed">{item.admin_remark}</p>
                </div>
              )}

              {/* Approved Notice */}
              {item.status === 'APPROVED' && (
                <div className="p-2.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl flex items-center gap-2 text-xs text-[#065F46] font-medium">
                  <CheckCircle2 size={15} className="text-[#10B981] shrink-0" />
                  <span>
                    This cause is verified and live on the HRSJM public donation portal!
                  </span>
                </div>
              )}

              {/* Card Actions */}
              <div className="pt-2 border-t border-[#DBE5EE] flex items-center justify-between gap-3 text-xs">
                <span className="text-[#718096] text-[11px]">
                  {item.documents && item.documents.length > 0
                    ? `${item.documents.length} document(s) attached`
                    : 'No documents attached'}
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/seeker/support?query=ASST-${item.id.slice(0, 8).toUpperCase()}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DBE5EE] text-[#0B2F52] hover:bg-[#EDF2F7] font-semibold transition"
                  >
                    <MessageSquare size={13} className="text-[#0D47A1]" />
                    <span>Ask Helpdesk</span>
                  </Link>

                  <Link
                    to={`/seeker/requests/${item.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#06294D] hover:bg-[#123F68] text-[#FAD465] font-bold shadow-xs transition"
                  >
                    <span>View Details</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-[#DCE4EC] p-10 text-center shadow-xs space-y-3">
            <div className="w-12 h-12 bg-[#EDF2F7] rounded-full flex items-center justify-center mx-auto text-[#06294D]">
              <FileText size={22} />
            </div>
            <h3 className="text-base font-bold text-[#0B2F52]">No Applications Found</h3>
            <p className="text-xs text-[#718096] max-w-sm mx-auto leading-relaxed">
              {searchQuery
                ? 'No applications match your search query.'
                : activeTab === 'ALL'
                ? "You haven't submitted any aid applications yet. Tap below to submit a new application."
                : `No applications with status "${activeTab.replace('_', ' ')}".`}
            </p>
            <div className="pt-2">
              <Link
                to="/seeker/apply"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FAD465] hover:bg-[#E9B82E] active:bg-[#C9971A] text-[#011F39] text-xs font-bold rounded-xl shadow-xs transition"
              >
                <Plus size={15} strokeWidth={2.5} />
                <span>+ Submit Application</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
