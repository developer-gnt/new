import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  MessageSquare,
  PlusCircle,
  Send,
  User,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { useSeekerStore } from '../store/seekerStore';

export const SeekerSupportPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('query');

  const { tickets, addTicketMessage } = useSeekerStore();

  const initialTicketId = React.useMemo(() => {
    if (queryParam) {
      const match = tickets.find(
        (t) =>
          t.subject.toLowerCase().includes(queryParam.toLowerCase()) ||
          t.description.toLowerCase().includes(queryParam.toLowerCase())
      );
      if (match) return match.id;
    }
    return tickets[0]?.id || null;
  }, [tickets, queryParam]);

  const [userSelectedId, setUserSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [searchFilter, setSearchFilter] = useState(queryParam || '');
  const [submittingReply, setSubmittingReply] = useState(false);

  const activeId = userSelectedId || initialTicketId;
  const selectedTicket = tickets.find((t) => t.id === activeId) || tickets[0] || null;

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    setSubmittingReply(true);
    try {
      await addTicketMessage(selectedTicket.id, replyText.trim());
      setReplyText('');
    } catch {
      // Ignore
    } finally {
      setSubmittingReply(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RESOLVED':
      case 'CLOSED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            Resolved
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
            In Progress
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            Open
          </span>
        );
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      t.subject.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      (t.ticket_number || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#DCE4EC] p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">
            <MessageSquare size={14} className="text-[#06294D]" />
            <span>Seeker Helpdesk & Grievances</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52]">
            Helpdesk & Support Queries
          </h1>
          <p className="text-xs text-[#718096] mt-0.5">
            Direct communication channel with HRSJM field assessment officers and case coordinators.
          </p>
        </div>

        <Link
          to="/seeker/complaint"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FAD465] hover:bg-[#E9B82E] active:bg-[#C9971A] text-[#011F39] text-xs font-bold rounded-xl shadow-xs transition"
        >
          <PlusCircle size={15} />
          <span>+ Create New Ticket</span>
        </Link>
      </div>

      {/* Main Two-Column Layout (Ticket List + Thread Chat) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
        {/* Left Column: Tickets List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#DCE4EC] p-4 shadow-xs space-y-3 flex flex-col">
          <div className="relative">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by subject or ticket number..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#EDF2F7] border border-[#DBE5EE] rounded-xl text-[#0B2F52] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FAD465] focus:bg-white"
            />
            <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[500px]">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setUserSelectedId(t.id)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition ${
                    activeId === t.id
                      ? 'bg-[#EDF2F7] border-[#06294D] shadow-xs'
                      : 'bg-white border-[#DBE5EE] hover:bg-[#FAF7F0]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] font-bold text-[#0D9488]">
                      {t.ticket_number || `TKT-${t.id.slice(-4)}`}
                    </span>
                    {getStatusBadge(t.status)}
                  </div>
                  <h4 className="font-bold text-[#0B2F52] line-clamp-1">{t.subject}</h4>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2">
                    <span className="truncate">{t.category}</span>
                    <span>{new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-gray-400">
                No tickets matching criteria.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Ticket Thread Chat */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#DCE4EC] shadow-xs flex flex-col overflow-hidden">
          {selectedTicket ? (
            <>
              {/* Ticket Top Bar */}
              <div className="p-4 border-b border-[#DBE5EE] bg-[#FAF7F0] flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0D9488]">
                      {selectedTicket.ticket_number || `TKT-${selectedTicket.id.slice(-4)}`}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-200 text-gray-700">
                      {selectedTicket.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0B2F52] mt-1">{selectedTicket.subject}</h3>
                </div>

                <div>{getStatusBadge(selectedTicket.status)}</div>
              </div>

              {/* Chat Thread Messages */}
              <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 max-h-[420px] bg-[#FAF7F0]/40">
                {/* Initial Description Box */}
                <div className="bg-[#EDF2F7] p-3.5 rounded-xl border border-[#DBE5EE] text-xs">
                  <span className="font-bold text-[#0B2F52] block mb-1">Issue Description:</span>
                  <p className="text-[#34516D] leading-relaxed">{selectedTicket.description}</p>
                </div>

                {/* Messages */}
                {(selectedTicket.messages || []).map((msg) => {
                  const isAdmin = msg.is_admin;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-1 px-1">
                        {isAdmin ? (
                          <>
                            <ShieldCheck size={12} className="text-[#06294D]" />
                            <span className="font-bold text-[#06294D]">HRSJM Support Officer</span>
                          </>
                        ) : (
                          <>
                            <User size={12} />
                            <span>You</span>
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
                        className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isAdmin
                            ? 'bg-white border border-[#DBE5EE] text-[#0B2F52] rounded-tl-xs shadow-xs'
                            : 'bg-[#06294D] text-white rounded-tr-xs shadow-xs'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="p-3 border-t border-[#DBE5EE] bg-white flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your message or clarification..."
                  className="flex-1 px-4 py-2 text-xs bg-[#EDF2F7] border border-[#DBE5EE] rounded-xl text-[#0B2F52] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FAD465] focus:bg-white"
                  disabled={submittingReply}
                />
                <button
                  type="submit"
                  disabled={submittingReply || !replyText.trim()}
                  className="px-4 py-2 bg-[#06294D] hover:bg-[#123F68] text-[#FAD465] rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                >
                  <Send size={14} />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-400">
              <MessageSquare size={36} className="text-gray-300 mb-2" />
              <p className="text-xs">Select a ticket from the left panel to view message history.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

