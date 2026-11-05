import type React from 'react';
import { useState, useMemo, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, AlertCircle } from 'lucide-react';
import { rightsStore } from '../store/rightsStore';
import { RightsStatsCards } from '../components/RightsStatsCards';
import { RightsStatusTabs } from '../components/RightsStatusTabs';
import { RightsSearchBar } from '../components/RightsSearchBar';
import { RightsListHeader, RightsCard } from '../components/RightsCard';
import { RightsFilterModal } from '../components/RightsFilterModal';
import { RightsPreviewModal } from '../components/RightsPreviewModal';
import { RightsDeleteModal } from '../components/RightsDeleteModal';
import { RightsActionMenu } from '../components/RightsActionMenu';
import {
  DEFAULT_RIGHTS_CATEGORIES,
  type RightsArticle,
  type RightsDateFilter,
  type RightsFilterState,
  type RightsFilterTab,
  type RightsListItem,
  type RightsStatus,
  type RightsStatusFilter,
} from '../types/rights.types';

const RIGHTS_MONTH_INDEX: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

const parseRightsDate = (dateStr: string): number => {
  const parts = dateStr ? dateStr.trim().split(' ') : [];
  if (parts.length < 3) return 0;
  const [day, month, year] = parts;
  return Date.UTC(Number(year), RIGHTS_MONTH_INDEX[month] ?? 0, Number(day));
};

export const KnowYourRightsPage: React.FC = () => {
  const navigate = useNavigate();
  const snapshot = useSyncExternalStore(rightsStore.subscribe, rightsStore.getSnapshot);
  const articles = snapshot.articles;

  const [activeStatus, setActiveStatus] = useState<RightsStatusFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<RightsDateFilter>('ANY');

  // Modals state
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<RightsArticle | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RightsListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Kebab Menu state
  const [menuArticle, setMenuArticle] = useState<RightsListItem | null>(null);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);

  const stats = useMemo(() => {
    const total = articles.length;
    const published = articles.filter((a) => a.status === 'PUBLISHED').length;
    const drafts = articles.filter((a) => a.status === 'DRAFT').length;
    const archived = articles.filter((a) => a.status === 'ARCHIVED').length;
    return { total, published, drafts, archived };
  }, [articles]);

  const statusTabs = useMemo<RightsFilterTab[]>(
    () => [
      { key: 'ALL', label: 'All', count: stats.total },
      { key: 'PUBLISHED', label: 'Published', count: stats.published },
      { key: 'DRAFT', label: 'Drafts', count: stats.drafts },
      { key: 'ARCHIVED', label: 'Archived', count: stats.archived },
    ],
    [stats],
  );

  const allCategories = useMemo(() => {
    const fromArticles = Array.from(new Set(articles.map((a) => a.category))).filter(Boolean);
    const combined = Array.from(new Set([...DEFAULT_RIGHTS_CATEGORIES, ...fromArticles]));
    return combined.sort();
  }, [articles]);

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const refTimestamp = 1790800000000; // Reference 2026 baseline

    return articles
      .filter((article) => {
        if (activeStatus !== 'ALL' && article.status !== activeStatus) return false;
        if (selectedCategory && article.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
        if (selectedDateRange !== 'ANY') {
          const itemDate = parseRightsDate(article.lastUpdatedDate);
          const diffDays = Math.abs(refTimestamp - itemDate) / (1000 * 60 * 60 * 24);
          if (selectedDateRange === 'TODAY' && diffDays > 1) return false;
          if (selectedDateRange === 'WEEK' && diffDays > 7) return false;
          if (selectedDateRange === 'MONTH' && diffDays > 31) return false;
        }
        if (!q) return true;

        const haystack = [
          article.title,
          article.description,
          article.category,
          article.author,
          ...(article.tags ?? []),
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      })
      .sort((a, b) => parseRightsDate(b.lastUpdatedDate) - parseRightsDate(a.lastUpdatedDate));
  }, [articles, searchQuery, activeStatus, selectedCategory, selectedDateRange]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    activeStatus !== 'ALL' ||
    selectedCategory !== null ||
    selectedDateRange !== 'ANY';

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveStatus('ALL');
    setSelectedCategory(null);
    setSelectedDateRange('ANY');
  };

  const handleCardPress = (article: RightsListItem) => {
    navigate(`/admin/rights/${article.id}`);
  };

  const handleMorePress = (article: RightsListItem, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setAnchorPosition({
      top: rect.bottom + 4,
      left: Math.max(16, rect.right - 180),
    });
    setMenuArticle(article);
  };

  const handleEdit = (article: RightsListItem) => {
    navigate(`/admin/rights/${article.id}/edit`);
  };

  const handleStatusChange = async (article: RightsListItem, newStatus: RightsStatus) => {
    await rightsStore.updateStatus(article.id, newStatus);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await rightsStore.delete(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Top Breadcrumb & Actions Bar */}
      <div style={styles.topBar}>
        <div>
          <div style={styles.breadcrumb}>
            <span>Content & Media</span>
            <span style={styles.bcSep}>/</span>
            <span style={styles.bcActive}>Know Your Rights</span>
          </div>
          <h1 style={styles.title}>Know Your Rights Directory</h1>
          <p style={styles.subtitle}>
            Statutory legal rights documentation, human rights handbook and citizen legal empowerment guides.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/rights/create')}
          style={styles.createBtn}
        >
          <Plus size={16} strokeWidth={2.4} />
          <span>New Rights Article</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <RightsStatsCards
        stats={stats}
        activeStatus={activeStatus}
        onSelectStatus={(status) => setActiveStatus(status)}
      />

      {/* Status Filter Tabs */}
      <RightsStatusTabs
        tabs={statusTabs}
        activeStatus={activeStatus}
        onSelectTab={(st) => setActiveStatus(st)}
      />

      {/* Search, Filter & Action Bar */}
      <RightsSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={allCategories}
        selectedDateRange={selectedDateRange}
        onDateRangeChange={setSelectedDateRange}
        onOpenFilterModal={() => setFilterModalOpen(true)}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        onAddRights={() => navigate('/admin/rights/create')}
      />

      {/* List Container */}
      <div style={styles.listContainer}>
        <RightsListHeader />

        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <RightsCard
              key={article.id}
              article={article}
              onPress={handleCardPress}
              onMorePress={handleMorePress}
            />
          ))
        ) : (
          <div style={styles.emptyState}>
            <AlertCircle size={40} color="#94A3B8" />
            <h3 style={styles.emptyTitle}>No Rights Articles Found</h3>
            <p style={styles.emptyText}>
              No articles match the selected filters or search keyword. Try clearing filters or creating a new article.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                style={styles.emptyResetBtn}
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <RightsFilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        categories={allCategories}
        applied={{
          status: activeStatus,
          category: selectedCategory,
          dateRange: selectedDateRange,
        }}
        onApply={(f: RightsFilterState) => {
          setActiveStatus(f.status);
          setSelectedCategory(f.category);
          setSelectedDateRange(f.dateRange);
        }}
        onReset={handleResetFilters}
      />

      {/* Preview Modal */}
      <RightsPreviewModal
        isOpen={Boolean(previewArticle)}
        onClose={() => setPreviewArticle(null)}
        article={previewArticle}
      />

      {/* Delete Confirmation Modal */}
      <RightsDeleteModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        article={deleteTarget}
        isDeleting={isDeleting}
      />

      {/* Kebab Action Context Menu */}
      <RightsActionMenu
        isOpen={Boolean(menuArticle)}
        article={menuArticle}
        anchorPosition={anchorPosition}
        onClose={() => {
          setMenuArticle(null);
          setAnchorPosition(null);
        }}
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
        onDelete={(a) => setDeleteTarget(a)}
      />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: '24px 32px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  topBar: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '20px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: '#64748B',
    marginBottom: '6px',
    fontWeight: 500,
  },
  bcSep: {
    color: '#CBD5E1',
  },
  bcActive: {
    color: '#06294D',
    fontWeight: 600,
  },
  title: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 700,
    color: '#011F39',
    fontFamily: 'Playfair Display, Georgia, serif',
  },
  subtitle: {
    margin: '4px 0 0 0',
    fontSize: '14px',
    color: '#64748B',
  },
  createBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '8px',
    backgroundColor: '#06294D',
    color: '#FFFFFF',
    border: 'none',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(6, 41, 77, 0.2)',
  },
  listContainer: {
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  emptyState: {
    padding: '60px 24px',
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderTop: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    margin: '16px 0 6px 0',
    fontSize: '17px',
    fontWeight: 700,
    color: '#1E293B',
  },
  emptyText: {
    margin: 0,
    fontSize: '13px',
    color: '#64748B',
    maxWidth: '440px',
  },
  emptyResetBtn: {
    marginTop: '16px',
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #CBD5E1',
    backgroundColor: '#FFFFFF',
    color: '#06294D',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
