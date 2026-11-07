import type React from 'react';
import { useState, useMemo, useSyncExternalStore, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
  LifeBuoy,
} from 'lucide-react';
import type {
  SupportTicket,
  TicketTabKey,
  TicketStatus,
  SupportFilterState,
  CreateTicketBody,
} from '../types/support.types';
import { supportStore } from '../store/supportStore';
import { SupportStatsCards } from '../components/SupportStatsCards';
import { SupportStatusTabs } from '../components/SupportStatusTabs';
import { SupportSearchBar } from '../components/SupportSearchBar';
import { SupportTicketRow } from '../components/SupportTicketRow';
import { CreateTicketModal } from '../components/CreateTicketModal';
import { SupportFilterModal } from '../components/SupportFilterModal';
import { UpdateStatusModal } from '../components/UpdateStatusModal';

export const SupportTicketsListPage: React.FC = () => {
  const navigate = useNavigate();

  // Reactive store snapshot (cached, safe for React 19 useSyncExternalStore)
  const storeSnapshot = useSyncExternalStore(
    supportStore.subscribe,
    supportStore.getSnapshot
  );
  const tickets = storeSnapshot.tickets;
  const messagesByTicket = storeSnapshot.messagesByTicket;

  // Search & Filter state
  const [activeTab, setActiveTab] = useState<TicketTabKey>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSource, setSelectedSource] = useState('ALL');
  const [filters, setFilters] = useState<SupportFilterState>({
    status: 'ALL',
    category: 'ALL',
    priority: 'ALL',
    dateRange: 'ALL',
    source: 'ALL',
  });

  // Modals state
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [statusModalTicket, setStatusModalTicket] = useState<{
    ticket: SupportTicket;
    targetStatus: TicketStatus;
  } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  useEffect(() => {
    supportStore.fetchTickets();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await supportStore.fetchTickets();
    setIsRefreshing(false);
  };

  // Stats calculation
  const stats = useMemo(() => {
    let open = 0;
    let inProgress = 0;
    let resolved = 0;
    let closed = 0;

    for (const t of tickets) {
      if (t.status === 'SUBMITTED') open++;
      else if (t.status === 'UNDER_REVIEW') inProgress++;
      else if (t.status === 'RESOLVED') resolved++;
      else if (t.status === 'CLOSED') closed++;
    }

    return {
      total: tickets.length,
      open,
      inProgress,
      resolved,
      closed,
    };
  }, [tickets]);

  // Tab counts
  const tabCounts: Record<TicketTabKey, number> = useMemo(() => {
    let open = 0;
    let inProgress = 0;
    let resolved = 0;
    let closed = 0;

    for (const t of tickets) {
      if (t.status === 'SUBMITTED') open++;
      else if (t.status === 'UNDER_REVIEW') inProgress++;
      else if (t.status === 'RESOLVED') resolved++;
      else if (t.status === 'CLOSED') closed++;
    }

    return {
      ALL: tickets.length,
      SUBMITTED: open,
      UNDER_REVIEW: inProgress,
      RESOLVED: resolved,
      CLOSED: closed,
    };
  }, [tickets]);

  // Active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.status !== 'ALL') count++;
    if (filters.category !== 'ALL') count++;
    if (filters.priority !== 'ALL') count++;
    if (filters.source !== 'ALL') count++;
    if (filters.dateRange !== 'ALL') count++;
    return count;
  }, [filters]);

  // Filtered & Sorted Tickets
  const filteredTickets = useMemo(() => {
    let result = [...tickets];

    // Status Tab filter
    if (activeTab !== 'ALL') {
      result = result.filter((t) => t.status === activeTab);
    }

    // Modal Status filter override
    if (filters.status !== 'ALL' && activeTab === 'ALL') {
      result = result.filter((t) => t.status === filters.status);
    }

    // Category filter (SearchBar or Modal)
    const effectiveCategory =
      selectedCategory !== 'ALL' ? selectedCategory : filters.category;
    if (effectiveCategory !== 'ALL') {
      result = result.filter(
        (t) =>
          (t.category || '').toLowerCase().includes(effectiveCategory.toLowerCase()) ||
          (t.subject || '').toLowerCase().includes(effectiveCategory.toLowerCase())
      );
    }

    // Priority filter
    if (filters.priority !== 'ALL') {
      result = result.filter((t) => t.priority === filters.priority);
    }

    // Channel/Source filter
    const effectiveSource =
      selectedSource !== 'ALL' ? selectedSource : filters.source;
    if (effectiveSource !== 'ALL') {
      result = result.filter((t) => {
        const src = (t.source || '').toLowerCase();
        const desc = (t.description || '').toLowerCase();
        if (effectiveSource === 'website') {
          return src.includes('site') || desc.includes('source: website');
        }
        if (effectiveSource === 'app') {
          return src === 'app' || desc.includes('source: app');
        }
        if (effectiveSource === 'web') {
          return src === 'web' || desc.includes('source: web');
        }
        return true;
      });
    }

    // Search query filter (Subject, Ticket ID, citizen name, email, phone)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          (t.id || '').toLowerCase().includes(q) ||
          (t.subject || '').toLowerCase().includes(q) ||
          (t.description || '').toLowerCase().includes(q) ||
          (t.user?.full_name || '').toLowerCase().includes(q) ||
          (t.user?.email || '').toLowerCase().includes(q) ||
          (t.user?.mobile_number || '').toLowerCase().includes(q)
      );
    }

    // Sort: newest first
    result.sort(
      (a, b) =>
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );

    return result;
  }, [
    tickets,
    activeTab,
    selectedCategory,
    selectedSource,
    filters,
    searchQuery,
  ]);

  // Paginated slice
  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / pageSize));
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTickets.slice(start, start + pageSize);
  }, [filteredTickets, currentPage, pageSize]);

  // Handlers
  const handleView = (ticket: SupportTicket) => {
    navigate(`/admin/support/${ticket.id}`);
  };

  const handleOpenChat = (ticket: SupportTicket) => {
    navigate(`/admin/support/${ticket.id}/chat`);
  };

  const handleUpdateStatusTrigger = (ticket: SupportTicket, targetStatus: TicketStatus) => {
    setStatusModalTicket({ ticket, targetStatus });
  };

  const handleConfirmStatus = async (note?: string): Promise<boolean> => {
    if (!statusModalTicket) return false;
    const { ticket, targetStatus } = statusModalTicket;
    await supportStore.updateStatus(ticket.id, targetStatus, note);
    setSuccessBanner(
      `Ticket #${ticket.id} marked as ${targetStatus}. Resolution audit updated.`
    );
    setTimeout(() => setSuccessBanner(null), 4000);
    return true;
  };

  const handleCreateTicket = async (body: CreateTicketBody): Promise<boolean> => {
    const created = await supportStore.createTicket(body);
    setSuccessBanner(`Support Ticket #${created.id} created successfully.`);
    setTimeout(() => setSuccessBanner(null), 4000);
    return true;
  };

  const handleExportCsv = () => {
    const headers = [
      'Ticket ID',
      'Subject',
      'Complainant Name',
      'Email',
      'Phone',
      'Category',
      'Priority',
      'Channel',
      'Status',
      'Created Date',
    ];
    const rows = filteredTickets.map((t) => [
      t.id,
      `"${(t.subject || '').replace(/"/g, '""')}"`,
      `"${t.user?.full_name || 'Citizen'}"`,
      t.user?.email || '—',
      t.user?.mobile_number || '—',
      t.category || 'General',
      t.priority || 'NORMAL',
      t.source || 'web',
      t.status,
      new Date(t.created_at).toLocaleDateString('en-IN'),
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hrsjm_support_tickets_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF9E6] text-[#011F39] border border-[#FDE68A] mb-2 tracking-wide uppercase">
            <LifeBuoy size={12} className="text-[#B45309]" />
            <span>Citizen Helpdesk & Grievances</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#011F39]">
            Support & Complaints
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage citizen grievances, membership issues, donation queries and legal consultations
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs transition-colors cursor-pointer"
            title="Refresh tickets"
          >
            <RefreshCw
              size={14}
              className={isRefreshing ? 'animate-spin text-[#011F39]' : 'text-slate-500'}
            />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs transition-colors cursor-pointer"
            title="Export filtered tickets to CSV"
          >
            <Download size={14} className="text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold">✓</span>
            <span>{successBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessBanner(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Summary Metrics Cards */}
      <SupportStatsCards
        stats={stats}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setCurrentPage(1);
        }}
      />

      {/* Status Lifecycle Tabs */}
      <SupportStatusTabs
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setCurrentPage(1);
        }}
        counts={tabCounts}
      />

      {/* Search Bar & Primary Actions */}
      <SupportSearchBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        selectedCategory={selectedCategory}
        onCategoryChange={(c) => {
          setSelectedCategory(c);
          setCurrentPage(1);
        }}
        selectedSource={selectedSource}
        onSourceChange={(s) => {
          setSelectedSource(s);
          setCurrentPage(1);
        }}
        activeFilterCount={activeFiltersCount}
        onOpenFilterModal={() => setFilterModalVisible(true)}
        onOpenCreateModal={() => setCreateModalVisible(true)}
      />

      {/* Tickets List Area */}
      {paginatedTickets.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <MessageSquare size={28} className="text-slate-400" />
          </div>
          <h3 className="font-serif font-bold text-lg text-slate-800 mb-1">
            No support tickets found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            {searchQuery || activeFiltersCount > 0
              ? 'Try adjusting your search criteria or resetting filters.'
              : 'No tickets currently registered under this status category.'}
          </p>
        </div>
      ) : (
        <div>
          {paginatedTickets.map((t) => (
            <SupportTicketRow
              key={t.id}
              ticket={t}
              messageCount={(messagesByTicket[t.id] || []).length}
              onView={handleView}
              onOpenChat={handleOpenChat}
              onUpdateStatus={handleUpdateStatusTrigger}
            />
          ))}

          {/* Pagination Controls */}
          <div className="bg-white rounded-xl border border-slate-200/90 px-4 py-3 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
            <span className="text-xs text-slate-500 font-medium">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredTickets.length)} of{' '}
              {filteredTickets.length} tickets
            </span>

            <div className="flex items-center gap-2 self-center sm:self-auto">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                  currentPage === 1
                    ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs'
                }`}
              >
                <ChevronLeft size={14} />
                <span>Prev</span>
              </button>

              <span className="text-xs font-bold text-slate-700 px-2">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                  currentPage >= totalPages
                    ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs'
                }`}
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateTicketModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSubmit={handleCreateTicket}
      />

      <SupportFilterModal
        visible={filterModalVisible}
        filters={filters}
        onClose={() => setFilterModalVisible(false)}
        onApply={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
        }}
        onReset={() => {
          setFilters({
            status: 'ALL',
            category: 'ALL',
            priority: 'ALL',
            dateRange: 'ALL',
            source: 'ALL',
          });
          setSelectedCategory('ALL');
          setSelectedSource('ALL');
          setSearchQuery('');
          setCurrentPage(1);
        }}
      />

      <UpdateStatusModal
        visible={!!statusModalTicket}
        ticket={statusModalTicket?.ticket || null}
        targetStatus={statusModalTicket?.targetStatus || 'UNDER_REVIEW'}
        onClose={() => setStatusModalTicket(null)}
        onConfirm={handleConfirmStatus}
      />
    </div>
  );
};
