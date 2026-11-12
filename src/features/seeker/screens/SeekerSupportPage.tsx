import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  MessageSquare,
  Plus,
  Send,
  User,
  ShieldCheck,
  Search,
  X,
  Clock,
  CheckCircle2,
  PhoneCall,
  AlertCircle,
  FileText,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Check,
} from 'lucide-react';
import { useSeekerStore } from '../store/seekerStore';
import type { SupportTicket } from '../types/seeker.types';

type TicketFilterTab = 'all' | 'open' | 'in_progress' | 'resolved';

interface ParsedGrievance {
  source?: string;
  narrative: string;
  complainant?: string;
  phone?: string;
  email?: string;
  address?: string;
  policeStation?: string;
  location?: string;
}

function parseGrievanceDescription(raw: string): ParsedGrievance {
  if (!raw) return { narrative: 'Grievance inquiry logged in system.' };

  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
  const narrativeLines: string[] = [];
  let complainant: string | undefined;
  let phone: string | undefined;
  let email: string | undefined;
  let address: string | undefined;
  let policeStation: string | undefined;
  let location: string | undefined;
  let source: string | undefined;

  for (const line of lines) {
    if (line.toLowerCase().includes('[source:')) {
      const match = line.match(/\[source:\s*([^\]]+)\]/i);
      if (match && !source) source = match[1];
      continue;
    }
    if (line.toLowerCase().startsWith('complainant:')) {
      complainant = line.split(':')[1]?.trim();
    } else if (line.toLowerCase().startsWith('phone:')) {
      phone = line.split(':')[1]?.trim();
    } else if (line.toLowerCase().startsWith('email:')) {
      email = line.split(':')[1]?.trim();
    } else if (line.toLowerCase().startsWith('address:')) {
      const val = line.split(':')[1]?.trim();
      if (val && val !== 'N/A') address = val;
    } else if (line.toLowerCase().startsWith('nearby police station:')) {
      const val = line.split(':')[1]?.trim();
      if (val && val !== 'N/A') policeStation = val;
    } else if (line.toLowerCase().startsWith('location:')) {
      const val = line.split(':')[1]?.trim();
      if (val && val !== 'N/A') location = val;
    } else {
      narrativeLines.push(line);
    }
  }

  return {
    source: source || 'Citizen App',
    narrative: narrativeLines.join('\n') || 'Grievance submitted for official investigation.',
    complainant,
    phone,
    email,
    address,
    policeStation,
    location,
  };
}

function cleanSubject(subject: string): { title: string; categoryPrefix?: string } {
  if (!subject) return { title: 'Untitled Grievance' };
  const match = subject.match(/^\[([^\]]+)\]\s*(.*)$/);
  if (match) {
    return { categoryPrefix: match[1], title: match[2] || subject };
  }
  return { title: subject };
}

function getTicketRef(t: { id: string; ticket_number?: string }) {
  if (t.ticket_number) return t.ticket_number;
  return `HRSJM-CMP-${t.id.replace(/-/g, '').slice(0, 8).toUpperCase()}`;
}

const GrievanceTimelineStepper: React.FC<{ status: string }> = ({ status }) => {
  const s = (status || '').toUpperCase();
  let currentStep = 1;
  let isResolved = false;

  if (s === 'RESOLVED' || s === 'CLOSED') {
    currentStep = 4;
    isResolved = true;
  } else if (s === 'IN_PROGRESS' || s === 'UNDER_REVIEW') {
    currentStep = 3;
  } else {
    currentStep = 2;
  }

  const steps = [
    { number: 1, label: 'Submitted' },
    { number: 2, label: 'Secretariat Review' },
    { number: 3, label: 'Investigation' },
    { number: 4, label: 'Resolution' },
  ];

  return (
    <div className="flex items-center justify-between w-full py-1">
      {steps.map((step, idx) => {
        const isPast = step.number < currentStep || (step.number === 4 && isResolved);
        const isCurrent = step.number === currentStep && !isResolved;
        const isLast = idx === steps.length - 1;

        return (
          <React.Fragment key={step.number}>
            <div className="flex items-center gap-1.5 shrink-0">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isPast
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-[#0D9488] text-white ring-2 ring-[#0D9488]/30 animate-pulse'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isPast ? <Check size={11} strokeWidth={3} /> : step.number}
              </div>
              <span
                className={`text-[11px] font-semibold hidden sm:inline ${
                  isPast || isCurrent ? 'text-[#06294D]' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  step.number < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const SeekerSupportPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('query');

  const { tickets, loadAll, addTicketMessage } = useSeekerStore();

  const [activeTab, setActiveTab] = useState<TicketFilterTab>('all');
  const [searchFilter, setSearchFilter] = useState(queryParam || '');
  const [refreshing, setRefreshing] = useState(false);

  const [expandedChatMap, setExpandedChatMap] = useState<Record<string, boolean>>({});
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [submittingMap, setSubmittingMap] = useState<Record<string, boolean>>({});
  const [viewDetailsTicket, setViewDetailsTicket] = useState<SupportTicket | null>(null);

  React.useEffect(() => {
    loadAll().catch(() => {});
  }, [loadAll]);

  const totalCount = tickets.length;
  const openCount = tickets.filter((t) => {
    const s = String(t.status || '').toUpperCase();
    return s === 'OPEN' || s === 'SUBMITTED' || !s;
  }).length;
  const inProgressCount = tickets.filter((t) => {
    const s = String(t.status || '').toUpperCase();
    return s === 'IN_PROGRESS' || s === 'UNDER_REVIEW';
  }).length;
  const resolvedCount = tickets.filter((t) => {
    const s = String(t.status || '').toUpperCase();
    return s === 'RESOLVED' || s === 'CLOSED';
  }).length;

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

  const getStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'RESOLVED':
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]">
            <CheckCircle2 size={12} />
            <span>Resolved</span>
          </span>
        );
      case 'IN_PROGRESS':
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
            <Clock size={12} />
            <span>In Progress</span>
          </span>
        );
      case 'SUBMITTED':
      case 'OPEN':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF9E6] text-[#B45309] border border-[#FAD465]">
            <AlertCircle size={12} />
            <span>Open / Submitted</span>
          </span>
        );
    }
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const s = (t.status || '').toUpperCase();
      if (activeTab === 'open' && s !== 'OPEN' && s !== 'SUBMITTED') return false;
      if (activeTab === 'in_progress' && s !== 'IN_PROGRESS' && s !== 'UNDER_REVIEW') return false;
      if (activeTab === 'resolved' && s !== 'RESOLVED' && s !== 'CLOSED') return false;

      if (!searchFilter.trim()) return true;
      const q = searchFilter.toLowerCase();
      return (
        t.subject.toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q) ||
        (t.ticket_number || '').toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
      );
    });
  }, [tickets, activeTab, searchFilter]);

  const toggleChat = (ticketId: string) => {
    setExpandedChatMap((prev) => ({
      ...prev,
      [ticketId]: !prev[ticketId],
    }));
  };

  const handleSendReply = async (ticketId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = (replyTextMap[ticketId] || '').trim();
    if (!text) return;

    setSubmittingMap((prev) => ({ ...prev, [ticketId]: true }));
    try {
      await addTicketMessage(ticketId, text);
      setReplyTextMap((prev) => ({ ...prev, [ticketId]: '' }));
    } catch {
      // Ignore
    } finally {
      setSubmittingMap((prev) => ({ ...prev, [ticketId]: false }));
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Section */}
      <div className="bg-white rounded-2xl border border-[#DCE4EC] px-5 py-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#718096] uppercase tracking-wider mb-0.5">
            <MessageSquare size={14} className="text-[#06294D]" />
            <span>Citizen Helpdesk & Grievances</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52] leading-tight">
            Helpdesk & Support Queries
          </h1>
          <p className="text-xs text-[#718096] mt-0.5 font-medium">
            Track status, case progress, and communicate directly with assigned HRSJM field officers.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-xl border border-[#DBE5EE] text-[#0B2F52] hover:bg-[#EDF2F7] transition cursor-pointer"
            title="Refresh tickets"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          </button>

          <a
            href="tel:+919888880004"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#EDF2F7] hover:bg-[#DBE5EE] text-[#06294D] text-xs font-bold rounded-xl transition"
          >
            <PhoneCall size={14} className="text-[#10B981]" />
            <span>24×7 Helpline</span>
          </a>

          <Link
            to="/seeker/complaint"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FAD465] hover:bg-[#E9B82E] active:bg-[#C9971A] text-[#011F39] text-xs font-bold rounded-xl shadow-xs transition shrink-0"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>New Support Ticket</span>
          </Link>
        </div>
      </div>

      {/* 2. 4-Column Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#DCE4EC] p-4 sm:p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#718096] uppercase tracking-wider">
              Total Tickets
            </div>
            <div className="text-2xl font-bold font-serif text-[#0B2F52] mt-1">{totalCount}</div>
            <div className="text-[11px] text-[#718096] mt-0.5">All support grievances</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#EDF2F7] text-[#06294D] flex items-center justify-center shrink-0">
            <MessageSquare size={18} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#DCE4EC] p-4 sm:p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#718096] uppercase tracking-wider">
              Open / Submitted
            </div>
            <div className="text-2xl font-bold font-serif text-amber-600 mt-1">{openCount}</div>
            <div className="text-[11px] text-[#718096] mt-0.5">Awaiting secretariat review</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock size={18} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#DCE4EC] p-4 sm:p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#718096] uppercase tracking-wider">
              In Progress
            </div>
            <div className="text-2xl font-bold font-serif text-blue-600 mt-1">{inProgressCount}</div>
            <div className="text-[11px] text-[#718096] mt-0.5">Under field investigation</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck size={18} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#DCE4EC] p-4 sm:p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#718096] uppercase tracking-wider">
              Resolved
            </div>
            <div className="text-2xl font-bold font-serif text-emerald-600 mt-1">{resolvedCount}</div>
            <div className="text-[11px] text-[#718096] mt-0.5">Solutions delivered</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} />
          </div>
        </div>
      </div>

      {/* 3. Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl border border-[#DCE4EC] shadow-xs overflow-hidden">
        <div className="flex border-b border-[#DBE5EE] px-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`py-2.5 px-4 text-xs font-semibold whitespace-nowrap border-b-2 transition cursor-pointer ${
              activeTab === 'all'
                ? 'border-[#E9B82E] text-[#06294D] font-bold'
                : 'border-transparent text-[#718096] hover:text-[#0B2F52]'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('open')}
            className={`py-2.5 px-4 text-xs font-semibold whitespace-nowrap border-b-2 transition cursor-pointer ${
              activeTab === 'open'
                ? 'border-[#E9B82E] text-[#06294D] font-bold'
                : 'border-transparent text-[#718096] hover:text-[#0B2F52]'
            }`}
          >
            Open ({openCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('in_progress')}
            className={`py-2.5 px-4 text-xs font-semibold whitespace-nowrap border-b-2 transition cursor-pointer ${
              activeTab === 'in_progress'
                ? 'border-[#E9B82E] text-[#06294D] font-bold'
                : 'border-transparent text-[#718096] hover:text-[#0B2F52]'
            }`}
          >
            In Progress ({inProgressCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('resolved')}
            className={`py-2.5 px-4 text-xs font-semibold whitespace-nowrap border-b-2 transition cursor-pointer ${
              activeTab === 'resolved'
                ? 'border-[#E9B82E] text-[#06294D] font-bold'
                : 'border-transparent text-[#718096] hover:text-[#0B2F52]'
            }`}
          >
            Resolved ({resolvedCount})
          </button>
        </div>

        <div className="p-2.5">
          <div className="relative">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search grievances by reference ID, title, or category..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-[#EDF2F7] border border-[#DBE5EE] rounded-xl text-[#0B2F52] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FAD465] focus:bg-white transition"
            />
            <Search size={14} className="absolute left-3 top-2 text-gray-400" />
            {searchFilter && (
              <button
                type="button"
                onClick={() => setSearchFilter('')}
                className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Compact Complaint Cards List */}
      <div className="space-y-3">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => {
            const ref = getTicketRef(ticket);
            const clean = cleanSubject(ticket.subject);
            const parsed = parseGrievanceDescription(ticket.description);
            const messages = ticket.messages || [];
            const msgCount = messages.length;
            const isChatOpen = expandedChatMap[ticket.id] || false;
            const replyVal = replyTextMap[ticket.id] || '';
            const isSubmitting = submittingMap[ticket.id] || false;

            return (
              <div
                key={ticket.id}
                className="bg-white rounded-2xl border border-[#DCE4EC] p-4 sm:p-5 shadow-xs space-y-3 hover:border-[#FAD465] transition"
              >
                {/* Top Meta Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0D9488] bg-[#F0FDFA] px-2 py-0.5 rounded-md border border-[#CCFBF1] tracking-wider">
                      {ref}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFF9E6] text-[#B45309] border border-[#FDE68A]">
                      {ticket.category || clean.categoryPrefix || 'Civil Rights'}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                      {parsed.source || 'Citizen App'}
                    </span>
                    {ticket.priority && (ticket.priority === 'HIGH' || ticket.priority === 'CRITICAL') && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                        {ticket.priority}
                      </span>
                    )}
                    <span className="text-[11px] text-[#718096] hidden sm:inline">
                      • {new Date(ticket.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div>{getStatusBadge(ticket.status)}</div>
                </div>

                {/* Subject Title & Narrative Quote */}
                <div>
                  <h3 className="text-base font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52] leading-tight">
                    {clean.title}
                  </h3>

                  {parsed.narrative && (
                    <div className="mt-2 bg-[#FAF7F0] border-l-2 border-[#E9B82E] px-3 py-1.5 rounded-r-lg text-xs text-[#0B2F52]">
                      <p className="italic font-medium leading-relaxed line-clamp-2">
                        &ldquo;{parsed.narrative}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                {/* Complainant & Location (Single Inline Row) */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#718096] pt-0.5">
                  {parsed.complainant && (
                    <span className="inline-flex items-center gap-1">
                      <User size={12} className="text-[#0D47A1]" />
                      <span className="font-semibold text-[#0B2F52]">{parsed.complainant}</span>
                    </span>
                  )}
                  {parsed.phone && (
                    <span className="inline-flex items-center gap-1 font-mono">
                      <Phone size={12} className="text-[#10B981]" />
                      <span>{parsed.phone}</span>
                    </span>
                  )}
                  {parsed.email && (
                    <span className="inline-flex items-center gap-1">
                      <Mail size={12} className="text-[#0D9488]" />
                      <span>{parsed.email}</span>
                    </span>
                  )}
                  {parsed.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} className="text-rose-500" />
                      <span>{parsed.location}</span>
                    </span>
                  )}
                </div>

                {/* Slim 4-Step Grievance Stepper */}
                <div className="pt-2 border-t border-[#EDF2F7]">
                  <GrievanceTimelineStepper status={ticket.status} />
                </div>

                {/* Action Bar */}
                <div className="pt-2 border-t border-[#EDF2F7] flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleChat(ticket.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer ${
                        isChatOpen
                          ? 'bg-[#06294D] text-[#FAD465]'
                          : 'bg-[#EDF2F7] hover:bg-[#DBE5EE] text-[#06294D]'
                      }`}
                    >
                      <MessageSquare size={13} />
                      <span>Chat with Officer</span>
                      <span className="text-[10px] px-1 py-0.2 rounded-full bg-white/20">
                        ({msgCount})
                      </span>
                      {isChatOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setViewDetailsTicket(ticket)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-gray-50 text-[#0B2F52] border border-[#DCE4EC] transition cursor-pointer"
                    >
                      <FileText size={12} className="text-gray-400" />
                      <span>Case Details</span>
                    </button>
                  </div>

                  <a
                    href="tel:+919888880004"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#718096] hover:text-[#0D9488] transition"
                  >
                    <PhoneCall size={12} className="text-[#10B981]" />
                    <span>Helpline 24×7: +91 98888 80004</span>
                  </a>
                </div>

                {/* Collapsible Chat */}
                {isChatOpen && (
                  <div className="mt-3 pt-3 border-t-2 border-dashed border-[#DBE5EE] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-[#0B2F52] flex items-center gap-1.5">
                        <MessageSquare size={13} className="text-[#0D9488]" />
                        <span>Officer Case Thread</span>
                      </div>
                      <span className="text-[10px] text-[#718096]">
                        {msgCount} {msgCount === 1 ? 'Message' : 'Messages'}
                      </span>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl max-h-[220px] overflow-y-auto space-y-2.5">
                      {messages.length === 0 ? (
                        <div className="py-4 text-center text-xs text-gray-500 space-y-1">
                          <MessageSquare size={20} className="mx-auto text-gray-300" />
                          <p className="font-semibold text-gray-600">No messages in this case thread yet</p>
                          <p className="text-[11px] text-gray-400">
                            Type a question or clarification below to communicate directly with your case officer.
                          </p>
                        </div>
                      ) : (
                        messages.map((msg) => {
                          const isAdmin = msg.is_admin;
                          return (
                            <div
                              key={msg.id}
                              className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}
                            >
                              <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-0.5 px-1">
                                {isAdmin ? (
                                  <>
                                    <ShieldCheck size={11} className="text-[#06294D]" />
                                    <span className="font-bold text-[#06294D]">HRSJM Officer</span>
                                  </>
                                ) : (
                                  <>
                                    <User size={11} className="text-gray-600" />
                                    <span className="font-bold text-[#0B2F52]">You</span>
                                  </>
                                )}
                                <span>•</span>
                                <span>
                                  {new Date(msg.created_at).toLocaleTimeString('en-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>

                              <div
                                className={`max-w-[85%] p-2.5 rounded-xl text-xs leading-relaxed ${
                                  isAdmin
                                    ? 'bg-white border border-[#DBE5EE] text-[#0B2F52] rounded-tl-xs shadow-2xs'
                                    : 'bg-[#06294D] text-white rounded-tr-xs shadow-2xs'
                                }`}
                              >
                                {msg.message}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <form
                      onSubmit={(e) => handleSendReply(ticket.id, e)}
                      className="flex gap-2 items-center"
                    >
                      <input
                        type="text"
                        value={replyVal}
                        onChange={(e) =>
                          setReplyTextMap((prev) => ({ ...prev, [ticket.id]: e.target.value }))
                        }
                        placeholder="Type your message, document clarification, or query..."
                        className="flex-1 px-3.5 py-2 text-xs bg-[#EDF2F7] border border-[#DBE5EE] rounded-xl text-[#0B2F52] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FAD465] focus:bg-white transition"
                        disabled={isSubmitting}
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting || !replyVal.trim()}
                        className="px-4 py-2 bg-[#06294D] hover:bg-[#123F68] active:bg-[#041A30] text-[#FAD465] rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50 shadow-xs shrink-0"
                      >
                        <Send size={12} />
                        <span>{isSubmitting ? 'Sending...' : 'Send'}</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-[#DCE4EC] p-10 text-center text-xs text-gray-400 space-y-2.5">
            <FileText size={28} className="mx-auto text-gray-300" />
            <h4 className="text-sm font-bold text-[#0B2F52]">No Grievance Tickets Found</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {searchFilter
                ? 'No grievances match your search criteria. Try a different search query or clear the filter.'
                : 'You have not submitted any grievance tickets in this category yet.'}
            </p>
            <div className="pt-1">
              <Link
                to="/seeker/complaint"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FAD465] hover:bg-[#E9B82E] text-[#011F39] text-xs font-bold rounded-xl shadow-xs transition"
              >
                <Plus size={13} />
                <span>Submit Grievance</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 5. Modal */}
      {viewDetailsTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#DCE4EC] max-w-xl w-full p-6 shadow-2xl space-y-4 overflow-hidden">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#0D9488] bg-[#F0FDFA] px-2.5 py-0.5 rounded-md border border-[#CCFBF1]">
                  {getTicketRef(viewDetailsTicket)}
                </span>
                <h3 className="text-base font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52] mt-1">
                  {cleanSubject(viewDetailsTicket.subject).title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewDetailsTicket(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Category & Status
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#FFF9E6] text-[#B45309] border border-[#FDE68A]">
                    {viewDetailsTicket.category || 'Civil Rights'}
                  </span>
                  {getStatusBadge(viewDetailsTicket.status)}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Full Grievance Statement
                </div>
                <div className="p-3 bg-[#FAF7F0] border border-[#E9E1D2] rounded-xl text-xs text-[#0B2F52] leading-relaxed whitespace-pre-line">
                  {viewDetailsTicket.description}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Registration Details
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1 text-gray-600">
                  <p>
                    <span className="font-semibold text-gray-800">Lodged Date:</span>{' '}
                    {new Date(viewDetailsTicket.created_at).toLocaleString('en-IN')}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Authority:</span> Human Rights &
                    Social Justice Mission (HRSJM) National Secretariat
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setViewDetailsTicket(null)}
                className="px-4 py-2 bg-[#06294D] text-[#FAD465] font-bold text-xs rounded-xl shadow-xs hover:bg-[#123F68] transition cursor-pointer"
              >
                Close Case File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeekerSupportPage;
