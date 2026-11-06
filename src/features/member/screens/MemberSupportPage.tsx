import React, { useState } from 'react';
import {
  LifeBuoy,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Shield,
  X,
  MapPin,
  Check,
  Phone,
  MessageSquareText,
  Mail,
  FileText,
  Printer,
} from 'lucide-react';
import { useCurrentMember } from '../store/memberStore';
import { HrsjmLogo } from '@/components/common/HrsjmLogo';

interface CaseMilestone {
  id: string;
  stage: string;
  officer: string;
  notes: string;
  timestamp: string;
}

interface SupportTicket {
  id: string;
  ticketNumber: string; // e.g. TKT-2026-8812
  subject: string;
  category: 'Police Harassment' | 'Illegal Detention' | 'Human Rights Violation' | 'Legal Aid Request' | 'Membership Service';
  priority: 'URGENT' | 'HIGH' | 'NORMAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  updatedAt: string;
  assignedOfficer: string;
  location: string;
  description: string;
  latestUpdate: string;
  milestones: CaseMilestone[];
}

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-1',
    ticketNumber: 'TKT-2026-8812',
    subject: 'Unlawful detention of youth at Rohini Sector 14 police post',
    category: 'Illegal Detention',
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    createdAt: '2026-11-04T10:30:00.000Z',
    updatedAt: '2026-11-04T15:45:00.000Z',
    assignedOfficer: 'Adv. Vikas Verma (State Legal Cell)',
    location: 'Rohini, North West Delhi',
    description: 'A 19-year-old local student was picked up without formal memo or FIR disclosure since 8:00 AM. Station officials refusing to show GD entry.',
    latestUpdate: 'SHO has granted personal interview. Formal bail bond submitted; youth is being processed for immediate release.',
    milestones: [
      {
        id: 'm-1',
        stage: 'Case Registered & Rapid Legal Cell Assigned',
        officer: 'National Helpdesk Central',
        notes: 'Emergency report logged into national grievance register. Priority flagged as Urgent Action.',
        timestamp: '2026-11-04T10:30:00.000Z',
      },
      {
        id: 'm-2',
        stage: 'Section 41A CrPC Legal Notice Drafted',
        officer: 'Adv. Vikas Verma (State Legal Cell)',
        notes: 'Notice under Section 41A CrPC drafted; field defense advocate dispatched to police post.',
        timestamp: '2026-11-04T11:15:00.000Z',
      },
      {
        id: 'm-3',
        stage: 'Field Representation & Bail Bond Submission',
        officer: 'Adv. Vikas Verma (State Legal Cell)',
        notes: 'Met with SHO; formal bail bond tendered. Release formalities underway.',
        timestamp: '2026-11-04T15:45:00.000Z',
      },
    ],
  },
  {
    id: 'tkt-2',
    ticketNumber: 'TKT-2026-6420',
    subject: 'Speedpost tracking number for Physical ID Card & Certificate',
    category: 'Membership Service',
    priority: 'NORMAL',
    status: 'RESOLVED',
    createdAt: '2026-10-22T09:15:00.000Z',
    updatedAt: '2026-10-23T14:00:00.000Z',
    assignedOfficer: 'Central Dispatch Desk (New Delhi HQ)',
    location: 'New Delhi HQ',
    description: 'Member requested tracking number and consignment details for physical membership credential kit.',
    latestUpdate: 'Welcome kit and gold-embossed card dispatched via India Post Speedpost (Consignment No: EM892147101IN). Consignment delivered.',
    milestones: [
      {
        id: 'm-201',
        stage: 'Request Logged',
        officer: 'Membership Cell',
        notes: 'Request for consignment verification received.',
        timestamp: '2026-10-22T09:15:00.000Z',
      },
      {
        id: 'm-202',
        stage: 'Consignment Dispatched & Closed',
        officer: 'Central Dispatch Desk',
        notes: 'Tracking number EM892147101IN verified with postal portal. Ticket marked resolved.',
        timestamp: '2026-10-23T14:00:00.000Z',
      },
    ],
  },
  {
    id: 'tkt-3',
    ticketNumber: 'TKT-2026-5104',
    subject: 'Illegal encroachment on municipal school playground in Outer Delhi',
    category: 'Human Rights Violation',
    priority: 'HIGH',
    status: 'OPEN',
    createdAt: '2026-11-03T16:20:00.000Z',
    updatedAt: '2026-11-03T16:20:00.000Z',
    assignedOfficer: 'Civil Rights Scrutiny Desk',
    location: 'Outer Delhi Sub-division',
    description: 'Commercial building materials are being dumped across the playground of MCD Primary School, blocking children access.',
    latestUpdate: 'Formal representation drafted for submission to MCD Commissioner. On-ground inspection scheduled.',
    milestones: [
      {
        id: 'm-301',
        stage: 'Grievance Queued for Fact-Finding',
        officer: 'Civil Rights Scrutiny Desk',
        notes: 'Initial photographic evidence verified. Site inspection scheduled with district volunteer chapter.',
        timestamp: '2026-11-03T16:20:00.000Z',
      },
    ],
  },
];

export const MemberSupportPage: React.FC = () => {
  const { member } = useCurrentMember();

  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected case for formal dossier view modal
  const [viewingTicket, setViewingTicket] = useState<SupportTicket | null>(null);

  // Create Ticket Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<SupportTicket['category']>('Human Rights Violation');
  const [newPriority, setNewPriority] = useState<SupportTicket['priority']>('NORMAL');
  const [newLocation, setNewLocation] = useState('Delhi NCR');
  const [newDescription, setNewDescription] = useState('');
  const [attachmentName, setAttachmentName] = useState('');

  const filteredTickets = tickets.filter((t) => {
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = t.ticketNumber.toLowerCase().includes(q);
      const matchSub = t.subject.toLowerCase().includes(q);
      const matchCat = t.category.toLowerCase().includes(q);
      const matchLoc = t.location.toLowerCase().includes(q);
      if (!matchNum && !matchSub && !matchCat && !matchLoc) return false;
    }
    return true;
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) return;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newTkt: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-${new Date().getFullYear()}-${randomSuffix}`,
      subject: newSubject.trim(),
      category: newCategory,
      priority: newPriority,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedOfficer: 'National Grievance Cell (Under Assignment)',
      location: newLocation,
      description: newDescription.trim() + (attachmentName ? ` [Attached Document: ${attachmentName}]` : ''),
      latestUpdate: 'Grievance submitted successfully. Initial review under allocation to state human rights advocate.',
      milestones: [
        {
          id: `m-${Date.now()}`,
          stage: 'Grievance Lodged by Member',
          officer: member.fullName,
          notes: 'Case registered via Member Portal with verified credentials.',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    setTickets([newTkt, ...tickets]);
    setIsCreateModalOpen(false);

    // Reset Form
    setNewSubject('');
    setNewDescription('');
    setAttachmentName('');
  };

  const getPriorityBadge = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'URGENT':
        return (
          <span className="px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase bg-rose-100 text-rose-800 border border-rose-200">
            Urgent Action
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-200">
            High Priority
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
            Normal
          </span>
        );
    }
  };

  const getStatusBadge = (status: SupportTicket['status']) => {
    switch (status) {
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5" /> Under Action
          </span>
        );
      case 'OPEN':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <AlertTriangle className="w-3.5 h-3.5" /> Queued
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#011F39] via-[#06294D] to-[#011F39] text-white p-6 md:p-8 rounded-2xl shadow-md border border-[#FAD465]/30 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FAD465]/20 text-[#FAD465] border border-[#FAD465]/30">
              <LifeBuoy className="w-3.5 h-3.5" />
              National Member Grievance & Rapid Response Desk
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-['Playfair_Display',Georgia,serif] tracking-tight">
              Help & Support Desk
            </h1>
            <p className="text-xs md:text-sm text-slate-200 max-w-2xl">
              Report unlawful detention, police intimidation, local rights violations, or membership service requests with direct legal cell dispatch.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-[#FAD465] hover:bg-[#E9B82E] text-[#06294D] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0"
          >
            <Plus className="w-4 h-4" />
            Lodge New Grievance
          </button>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Grievances</div>
          <div className="text-2xl font-black text-[#06294D] mt-1 tabular-nums">{tickets.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Logged across all terms</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-blue-700 text-xs font-semibold uppercase tracking-wider">Under Action</div>
          <div className="text-2xl font-black text-blue-700 mt-1 tabular-nums">
            {tickets.filter((t) => t.status === 'IN_PROGRESS').length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Active legal cell dispatch</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-emerald-700 text-xs font-semibold uppercase tracking-wider">Resolved</div>
          <div className="text-2xl font-black text-emerald-700 mt-1 tabular-nums">
            {tickets.filter((t) => t.status === 'RESOLVED').length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Closed with formal relief</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-amber-700 text-xs font-semibold uppercase tracking-wider">Response Readiness</div>
          <div className="text-lg font-black text-slate-800 mt-1.5 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            24x7 Ready
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Legal cell on standby</div>
        </div>
      </div>

      {/* Emergency Assistance Direct Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">24/7 Legal Emergency Hotline</div>
            <div className="text-sm font-black text-rose-700">+91 11 2345 6789</div>
            <div className="text-[10px] text-slate-400">For immediate custody or harassment</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <MessageSquareText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">WhatsApp Rapid Dispatch</div>
            <div className="text-sm font-black text-emerald-700">+91 98765 43210</div>
            <div className="text-[10px] text-slate-400">Send FIR copy, memo or photo proofs</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#06294D] flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">National Secretariat Desk</div>
            <div className="text-sm font-black text-[#06294D]">grievance@hrsjm.org</div>
            <div className="text-[10px] text-slate-400">Formal legal representations & petitions</div>
          </div>
        </div>
      </div>

      {/* Grievance Records & Case Directory */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 md:p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold font-serif text-[#06294D]">My Registered Grievances &amp; Petitions</h2>
            <p className="text-xs text-slate-500">
              Track real-time legal status, assigned counsel, and official milestone records.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                filterStatus === 'ALL'
                  ? 'bg-[#06294D] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              All ({tickets.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('IN_PROGRESS')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                filterStatus === 'IN_PROGRESS'
                  ? 'bg-[#06294D] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              Active ({tickets.filter((t) => t.status === 'IN_PROGRESS').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('OPEN')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                filterStatus === 'OPEN'
                  ? 'bg-[#06294D] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              Queued ({tickets.filter((t) => t.status === 'OPEN').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('RESOLVED')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                filterStatus === 'RESOLVED'
                  ? 'bg-[#06294D] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              Resolved ({tickets.filter((t) => t.status === 'RESOLVED').length})
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ticket number, category, location, or subject..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#06294D]"
          />
        </div>

        {/* Case Cards Grid */}
        <div className="space-y-4">
          {filteredTickets.map((t) => (
            <div
              key={t.id}
              className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all bg-white hover:shadow-sm space-y-3"
            >
              {/* Card Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#06294D] bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                    {t.ticketNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                    {t.category}
                  </span>
                  {getPriorityBadge(t.priority)}
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(t.status)}
                  <button
                    type="button"
                    onClick={() => setViewingTicket(t)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#06294D] hover:bg-[#083a6b] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    View Case Dossier
                  </button>
                </div>
              </div>

              {/* Subject & Description */}
              <div>
                <h3 className="text-base font-extrabold font-serif text-[#06294D]">
                  {t.subject}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {t.description}
                </p>
              </div>

              {/* Latest Official Legal Action Note */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-amber-900 uppercase tracking-wide text-[10px] mr-1.5">
                    Latest Legal Action:
                  </span>
                  <span className="text-slate-800">{t.latestUpdate}</span>
                </div>
              </div>

              {/* Metadata Footer */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <strong>Jurisdiction:</strong> {t.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    <strong>Counsel:</strong> {t.assignedOfficer}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Registered: {new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>
          ))}

          {filteredTickets.length === 0 && (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl p-8 space-y-2">
              <LifeBuoy className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-700 text-sm">No Grievances Found</h4>
              <p className="text-xs text-slate-400">
                No cases match the selected filter or search term.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Formal Case Dossier Modal (Detailed Inspection, No Chat) */}
      {viewingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 border border-slate-200 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <HrsjmLogo size="md" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Official Grievance Record
                  </div>
                  <h2 className="text-lg font-black font-serif text-[#06294D]">
                    Case Dossier — {viewingTicket.ticketNumber}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Print Slip"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewingTicket(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Case Overview Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl text-xs border border-slate-200/80">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
                <span className="font-bold text-[#06294D]">{viewingTicket.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Priority</span>
                <div className="mt-0.5">{getPriorityBadge(viewingTicket.priority)}</div>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                <div className="mt-0.5">{getStatusBadge(viewingTicket.status)}</div>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Date Registered</span>
                <span className="font-bold text-slate-700">
                  {new Date(viewingTicket.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Complainant Statement */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Subject &amp; Complainant Statement
              </h4>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="text-sm font-bold text-[#06294D]">{viewingTicket.subject}</div>
                <p className="text-xs text-slate-600 leading-relaxed">{viewingTicket.description}</p>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span>Complainant: <strong>{member.fullName}</strong> ({member.membershipNumber})</span>
                  <span>Jurisdiction: <strong>{viewingTicket.location}</strong></span>
                </div>
              </div>
            </div>

            {/* Official Legal Cell Milestones Log */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#06294D]" />
                Official Legal Cell Action Chronology
              </h4>
              <div className="space-y-3">
                {viewingTicket.milestones.map((m, idx) => (
                  <div key={m.id} className="relative pl-6 pb-3 border-l-2 border-slate-200 last:border-l-0 last:pb-0">
                    <span className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-[#06294D] border-2 border-white ring-2 ring-slate-200" />
                    <div className="text-xs font-bold text-[#06294D] flex items-center gap-2">
                      <span>Step {idx + 1}: {m.stage}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {new Date(m.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{m.notes}</p>
                    <div className="text-[10px] text-slate-400 mt-1">Authorized By: <strong>{m.officer}</strong></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-400">
                Assigned Counsel: <strong className="text-slate-700">{viewingTicket.assignedOfficer}</strong>
              </div>
              <button
                type="button"
                onClick={() => setViewingTicket(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lodge New Grievance Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 border border-slate-200 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-3 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                Official Incident Reporting
              </span>
              <h2 className="text-xl font-bold font-['Playfair_Display',Georgia,serif] text-[#06294D] pt-1">
                Lodge Grievance or Violation Report
              </h2>
              <p className="text-xs text-slate-500">
                Logged reports are assigned to the state human rights legal cell within 2 hours.
              </p>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                  Incident Subject / Summary *
                </label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Unlawful harassment by local authorities..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-[#06294D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-[#06294D]"
                  >
                    <option value="Human Rights Violation">Human Rights Violation</option>
                    <option value="Police Harassment">Police Harassment</option>
                    <option value="Illegal Detention">Illegal Detention</option>
                    <option value="Legal Aid Request">Legal Aid Request</option>
                    <option value="Membership Service">Membership Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                    Priority *
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-[#06294D]"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High Priority</option>
                    <option value="URGENT">Urgent / Immediate Risk</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                  Incident Location (District / State) *
                </label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Rohini, North West Delhi"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-[#06294D]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                  Detailed Narrative &amp; Evidence Details *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Include dates, names of officials or victims, FIR numbers (if any), and specific assistance required..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-[#06294D]"
                />
              </div>

              {/* Attachment */}
              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                  Attach Photo / Document Evidence
                </label>
                <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center bg-slate-50">
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setAttachmentName(file.name);
                    }}
                    className="text-xs text-slate-500 block w-full file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#06294D] file:text-white"
                  />
                  {attachmentName && (
                    <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-1">
                      <Check className="w-3 h-3" /> Attached: {attachmentName}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#FAD465] hover:bg-[#E9B82E] text-[#011F39] font-bold text-xs tracking-wide transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Check className="w-3.5 h-3.5" />
                  Submit Grievance to Legal Cell
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberSupportPage;
