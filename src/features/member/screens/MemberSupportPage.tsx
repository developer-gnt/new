import React, { useState } from 'react';
import {
  LifeBuoy,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  User,
  Shield,
  X,
  MapPin,
  Check,
} from 'lucide-react';
import { useCurrentMember } from '../store/memberStore';

interface SupportMessage {
  id: string;
  sender: 'MEMBER' | 'LEGAL_DESK';
  senderName: string;
  text: string;
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
  messages: SupportMessage[];
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
    messages: [
      {
        id: 'msg-1',
        sender: 'MEMBER',
        senderName: 'Adv. Rajeshwar Sharma',
        text: 'A 19-year-old local student has been picked up without formal memo or FIR disclosure since 8:00 AM. Station officials refusing to show GD entry.',
        timestamp: '2026-11-04T10:30:00.000Z',
      },
      {
        id: 'msg-2',
        sender: 'LEGAL_DESK',
        senderName: 'Adv. Vikas Verma (State Legal Cell)',
        text: 'Report registered as an Emergency Incident. A formal notice under Section 41A CrPC has been drafted and our field defense delegate is currently en route to the station.',
        timestamp: '2026-11-04T11:15:00.000Z',
      },
      {
        id: 'msg-3',
        sender: 'MEMBER',
        senderName: 'Adv. Rajeshwar Sharma',
        text: 'Understood. I am present at the main entrance along with the boy’s guardian.',
        timestamp: '2026-11-04T11:45:00.000Z',
      },
      {
        id: 'msg-4',
        sender: 'LEGAL_DESK',
        senderName: 'Adv. Vikas Verma (State Legal Cell)',
        text: 'Update: SHO has granted personal interview. Formal bail bond submitted; youth is being processed for immediate release.',
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
    assignedOfficer: 'Central Dispatch Desk (New Delhi)',
    location: 'New Delhi HQ',
    messages: [
      {
        id: 'msg-201',
        sender: 'MEMBER',
        senderName: 'Adv. Rajeshwar Sharma',
        text: 'Greetings. Could you please provide the consignment tracking number for my renewed executive card?',
        timestamp: '2026-10-22T09:15:00.000Z',
      },
      {
        id: 'msg-202',
        sender: 'LEGAL_DESK',
        senderName: 'Central Dispatch Desk',
        text: 'Your welcome kit and gold-embossed card were dispatched via India Post Speedpost. Consignment No: EM892147101IN. Estimated delivery: 2-3 business days.',
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
    messages: [
      {
        id: 'msg-301',
        sender: 'MEMBER',
        senderName: 'Adv. Rajeshwar Sharma',
        text: 'Commercial building materials are being dumped across the playground of MCD Primary School, blocking children access. Formal representation to MCD commissioner drafted.',
        timestamp: '2026-11-03T16:20:00.000Z',
      },
    ],
  },
];

export const MemberSupportPage: React.FC = () => {
  const { member } = useCurrentMember();

  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [activeTicketId, setActiveTicketId] = useState<string>(INITIAL_TICKETS[0].id);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Reply state
  const [replyText, setReplyText] = useState('');

  // Create Ticket Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<SupportTicket['category']>('Human Rights Violation');
  const [newPriority, setNewPriority] = useState<SupportTicket['priority']>('NORMAL');
  const [newLocation, setNewLocation] = useState('Delhi NCR');
  const [newDescription, setNewDescription] = useState('');
  const [attachmentName, setAttachmentName] = useState('');

  const activeTicket = tickets.find((t) => t.id === activeTicketId) || tickets[0];

  const filteredTickets = tickets.filter((t) => {
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = t.ticketNumber.toLowerCase().includes(q);
      const matchSub = t.subject.toLowerCase().includes(q);
      const matchCat = t.category.toLowerCase().includes(q);
      if (!matchNum && !matchSub && !matchCat) return false;
    }
    return true;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    const newMsg: SupportMessage = {
      id: `msg-${Date.now()}`,
      sender: 'MEMBER',
      senderName: member.fullName,
      text: replyText.trim(),
      timestamp: new Date().toISOString(),
    };

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === activeTicket.id) {
          return {
            ...t,
            updatedAt: new Date().toISOString(),
            messages: [...t.messages, newMsg],
          };
        }
        return t;
      })
    );

    setReplyText('');
  };

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
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'MEMBER',
          senderName: member.fullName,
          text: newDescription.trim() + (attachmentName ? ` [Attached: ${attachmentName}]` : ''),
          timestamp: new Date().toISOString(),
        },
      ],
    };

    setTickets([newTkt, ...tickets]);
    setActiveTicketId(newTkt.id);
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
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-100 text-rose-800 border border-rose-200">
            Urgent Action
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-200">
            High Priority
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
            Normal
          </span>
        );
    }
  };

  const getStatusBadge = (status: SupportTicket['status']) => {
    switch (status) {
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Resolved
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3" /> Under Action
          </span>
        );
      case 'OPEN':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <AlertTriangle className="w-3 h-3" /> Queued
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
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Grievance Helpdesk & Case Tracker
            </h1>
            <p className="text-xs md:text-sm text-slate-200 max-w-xl">
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

      {/* Main Two-Column Layout (Ticket List & Interactive Conversation Pane) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tickets Directory (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search & Filter */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket # or subject..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#06294D]"
              />
            </div>

            <div className="flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setFilterStatus('ALL')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  filterStatus === 'ALL'
                    ? 'bg-[#06294D] text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                All ({tickets.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('IN_PROGRESS')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  filterStatus === 'IN_PROGRESS'
                    ? 'bg-[#06294D] text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('RESOLVED')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  filterStatus === 'RESOLVED'
                    ? 'bg-[#06294D] text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                Resolved
              </button>
            </div>
          </div>

          {/* Ticket Cards List */}
          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
            {filteredTickets.map((t) => {
              const isSelected = activeTicketId === t.id;

              return (
                <div
                  key={t.id}
                  onClick={() => setActiveTicketId(t.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#06294D] ring-2 ring-[#06294D]/15 shadow-md'
                      : 'bg-white hover:bg-slate-50 border-slate-200/80 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {t.ticketNumber}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {getPriorityBadge(t.priority)}
                      {getStatusBadge(t.status)}
                    </div>
                  </div>

                  <h3 className="font-bold text-xs md:text-sm text-[#06294D] line-clamp-2">
                    {t.subject}
                  </h3>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {t.location}
                    </span>
                    <span>
                      {new Date(t.updatedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Case Correspondence Pane (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-[680px]">
          {activeTicket ? (
            <>
              {/* Thread Header */}
              <div className="p-4 md:p-5 border-b border-slate-100 bg-slate-50/70 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#06294D] bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                      {activeTicket.ticketNumber}
                    </span>
                    {getPriorityBadge(activeTicket.priority)}
                    {getStatusBadge(activeTicket.status)}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Category: <strong className="text-slate-700">{activeTicket.category}</strong>
                  </span>
                </div>

                <h2 className="text-base font-extrabold text-[#06294D]">
                  {activeTicket.subject}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                  <span>Assigned Officer: <strong className="text-slate-700">{activeTicket.assignedOfficer}</strong></span>
                  <span>Jurisdiction: <strong className="text-slate-700">{activeTicket.location}</strong></span>
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-[#FAF7F0]/40">
                {activeTicket.messages.map((msg) => {
                  const isUser = msg.sender === 'MEMBER';

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                          isUser
                            ? 'bg-[#06294D] text-[#FAD465]'
                            : 'bg-emerald-700 text-white'
                        }`}
                      >
                        {isUser ? <User className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                      </div>

                      <div className="space-y-1">
                        <div
                          className={`text-[10px] font-bold ${
                            isUser ? 'text-right text-slate-500' : 'text-left text-emerald-800'
                          }`}
                        >
                          {msg.senderName}
                        </div>

                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                            isUser
                              ? 'bg-[#06294D] text-white rounded-tr-none'
                              : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                          }`}
                        >
                          {msg.text}
                        </div>

                        <div
                          className={`text-[10px] text-slate-400 ${
                            isUser ? 'text-right' : 'text-left'
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Input Bar */}
              <form onSubmit={handleSendReply} className="p-3.5 bg-white border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type an official correspondence update or reply..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#06294D]"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm ${
                    replyText.trim()
                      ? 'bg-[#06294D] hover:bg-[#083a6b] text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  Reply
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
              Select a ticket to view conversation
            </div>
          )}
        </div>
      </div>

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
              <h2 className="text-xl font-black text-[#06294D] pt-1">
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

              <div className="grid grid-cols-2 gap-3">
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
                  Detailed Narrative & Evidence Details *
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
                  className="w-full py-3.5 rounded-xl bg-[#06294D] hover:bg-[#083a6b] text-white font-bold text-xs tracking-wide transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
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
