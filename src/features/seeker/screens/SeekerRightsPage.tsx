import React, { useState, useMemo, useEffect, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  Search,
  ArrowRight,
  ShieldCheck,
  FileText,
  PhoneCall,
  Eye,
  Users,
  BookOpen,
  X,
  Phone,
  Shield,
} from 'lucide-react';
import { RIGHTS_ARTICLES } from '../data/seekerData';
import { rightsStore } from '@/features/admin/rights/store/rightsStore';
import { filterRightsForRole } from '@/features/content';

type CategoryFilter = 'ALL' | 'CONSTITUTIONAL' | 'WOMEN_CHILD' | 'CIVIL_JUSTICE' | 'LABOUR_WELFARE';

type SeekerArticleCategory = 'CONSTITUTIONAL' | 'WOMEN_CHILD' | 'CIVIL_JUSTICE' | 'LABOUR_WELFARE';

interface SeekerEnhancedArticle {
  id: string;
  title: string;
  category: SeekerArticleCategory;
  categoryLabel: string;
  legalReference: string;
  summary: string;
  fullContent: string;
  highlights: string[];
  helpline: string;
  views: number;
  thumbnailUrl?: string;
  tags?: string[];
}

const mapCategoryToSeeker = (rawCat: string): { key: SeekerArticleCategory; label: string } => {
  const c = (rawCat || '').toLowerCase();
  if (c.includes('constitut')) return { key: 'CONSTITUTIONAL', label: 'Constitutional' };
  if (c.includes('women') || c.includes('child')) return { key: 'WOMEN_CHILD', label: 'Women & Child' };
  if (c.includes('labour') || c.includes('labor') || c.includes('welfare') || c.includes('worker')) {
    return { key: 'LABOUR_WELFARE', label: 'Labour & Welfare' };
  }
  return { key: 'CIVIL_JUSTICE', label: 'Civil & Justice' };
};

const getCategoryBadgeStyle = (cat: SeekerArticleCategory) => {
  switch (cat) {
    case 'CONSTITUTIONAL':
      return 'bg-[#FAF7F0] text-[#06294D] border-[#DCE4EC]';
    case 'WOMEN_CHILD':
    case 'LABOUR_WELFARE':
    case 'CIVIL_JUSTICE':
    default:
      return 'bg-[#EDF2F7] text-[#06294D] border-[#DBE5EE]';
  }
};

export const SeekerRightsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalArticle, setActiveModalArticle] = useState<SeekerEnhancedArticle | null>(null);

  useEffect(() => {
    rightsStore.fetchRights().catch(() => {});
  }, []);

  const snapshot = useSyncExternalStore(rightsStore.subscribe, rightsStore.getSnapshot);

  const mergedArticles = useMemo<SeekerEnhancedArticle[]>(() => {
    const authorized = filterRightsForRole(snapshot.articles, 'SEEKER');
    const dynamicSeekerItems: SeekerEnhancedArticle[] = authorized.map((a: any) => {
      const catMeta = mapCategoryToSeeker(a.category);
      const legalRef =
        a.legal_reference ||
        a.legalReference ||
        (a.tags && a.tags.length > 0 ? a.tags[0] : 'Statutory Civil Protection');

      const highlightsList: string[] = Array.isArray(a.highlights)
        ? a.highlights.map((h: any) => (typeof h === 'string' ? h : h.title || h.description || ''))
        : typeof a.highlights === 'string'
        ? a.highlights.split(',').map((s: string) => s.trim())
        : ['Fundamental Guarantee', 'Legal Aid Available', 'Right to Redress'];

      return {
        id: a.id,
        title: a.title,
        category: catMeta.key,
        categoryLabel: catMeta.label,
        legalReference: legalRef,
        summary:
          a.description ||
          (Array.isArray(a.content) ? a.content.join(' ').slice(0, 180) + '...' : 'Verified human rights guide.'),
        fullContent: Array.isArray(a.content) ? a.content.join('\n\n') : a.description || a.content || '',
        highlights: highlightsList.filter(Boolean),
        helpline: '1800-HRSJM-AID',
        views: a.views || 2400,
        thumbnailUrl: a.thumbnailUrl || a.thumbnail_url,
        tags: a.tags || [],
      };
    });

    const seenTitles = new Set<string>();
    const combined: SeekerEnhancedArticle[] = [];

    // Prioritize dynamic items from admin/API
    for (const item of dynamicSeekerItems) {
      const norm = item.title.trim().toLowerCase();
      if (!seenTitles.has(norm)) {
        seenTitles.add(norm);
        combined.push(item);
      }
    }

    // Merge baseline static fixtures if not already present
    for (const item of RIGHTS_ARTICLES) {
      const norm = item.title.trim().toLowerCase();
      if (!seenTitles.has(norm)) {
        seenTitles.add(norm);
        combined.push({
          id: item.id,
          title: item.title,
          category: item.category,
          categoryLabel: item.categoryLabel,
          legalReference: item.legalReference,
          summary: item.summary,
          fullContent: item.fullContent || item.summary || '',
          highlights: item.highlights,
          helpline: item.helpline || '1800-HRSJM-AID',
          views: 3100,
        });
      }
    }

    return combined;
  }, [snapshot.articles]);

  const stats = useMemo(() => {
    const total = mergedArticles.length;
    const constitutional = mergedArticles.filter((a) => a.category === 'CONSTITUTIONAL').length;
    const womenChild = mergedArticles.filter((a) => a.category === 'WOMEN_CHILD').length;
    const civilJustice = mergedArticles.filter((a) => a.category === 'CIVIL_JUSTICE').length;
    const labourWelfare = mergedArticles.filter((a) => a.category === 'LABOUR_WELFARE').length;
    return { total, constitutional, womenChild, civilJustice, labourWelfare };
  }, [mergedArticles]);

  const categoryTabs = useMemo(() => [
    { key: 'ALL' as CategoryFilter, label: `All Rights (${stats.total})` },
    { key: 'CONSTITUTIONAL' as CategoryFilter, label: `Constitutional (${stats.constitutional})` },
    { key: 'WOMEN_CHILD' as CategoryFilter, label: `Women & Child (${stats.womenChild})` },
    { key: 'CIVIL_JUSTICE' as CategoryFilter, label: `Civil & Justice (${stats.civilJustice})` },
    { key: 'LABOUR_WELFARE' as CategoryFilter, label: `Labour & Welfare (${stats.labourWelfare})` },
  ], [stats]);

  const filteredArticles = useMemo(() => {
    return mergedArticles.filter((item) => {
      if (activeCategory !== 'ALL' && item.category !== activeCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchRef = item.legalReference.toLowerCase().includes(q);
        const matchSum = item.summary.toLowerCase().includes(q);
        const matchTags = (item.tags || []).some((t) => t.toLowerCase().includes(q));
        return matchTitle || matchRef || matchSum || matchTags;
      }
      return true;
    });
  }, [mergedArticles, activeCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER SECTION */}
      <div className="bg-white rounded-xl border border-[#DCE4EC] px-6 py-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#718096] uppercase tracking-[0.14em] mb-1">
            <Scale size={14} className="text-[#06294D]" />
            <span>Legal Literacy & Civic Rights</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52] leading-tight">
            Know Your Rights & <span className="text-[#C9971A]">Free Legal Aid</span>
          </h1>
          <p className="text-xs text-[#34516D] mt-1 max-w-2xl">
            Practical legal guidance on constitutional protections, welfare rights, and statutory grievance remedies.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="tel:180047756243"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#EDF2F7] hover:bg-[#DBE5EE] text-[#06294D] border border-[#DBE5EE] text-xs font-bold rounded-xl transition cursor-pointer"
          >
            <PhoneCall size={14} className="text-[#06294D]" />
            <span>1800-HRSJM-AID</span>
          </a>

          <Link
            to="/seeker/complaint"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#06294D] hover:bg-[#123F68] active:bg-[#011F39] text-[#FAD465] text-xs font-bold rounded-xl shadow-xs transition"
          >
            <FileText size={14} />
            <span>File a Legal Grievance</span>
          </Link>
        </div>
      </div>

      {/* 2. SIGNATURE 4-COLUMN STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Legal Guides */}
        <div className="bg-white rounded-xl border border-[#DCE4EC] p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#718096] uppercase tracking-[0.14em]">
              Total Legal Guides
            </div>
            <div className="text-2xl font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52] mt-1">
              {stats.total}
            </div>
            <div className="text-[11px] text-[#718096] mt-0.5">
              Constitutional & statutory guides
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#EDF2F7] text-[#06294D] flex items-center justify-center shrink-0">
            <Scale size={20} />
          </div>
        </div>

        {/* Card 2: Constitutional Protections */}
        <div className="bg-white rounded-xl border border-[#DCE4EC] p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#718096] uppercase tracking-[0.14em]">
              Constitutional
            </div>
            <div className="text-2xl font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52] mt-1">
              {stats.constitutional}
            </div>
            <div className="text-[11px] text-[#718096] mt-0.5">
              Fundamental rights & writ remedies
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#EDF2F7] text-[#06294D] flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
        </div>

        {/* Card 3: Women & Child Welfare */}
        <div className="bg-white rounded-xl border border-[#DCE4EC] p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#718096] uppercase tracking-[0.14em]">
              Women & Child
            </div>
            <div className="text-2xl font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52] mt-1">
              {stats.womenChild}
            </div>
            <div className="text-[11px] text-[#718096] mt-0.5">
              POSH, POCSO & safety laws
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#EDF2F7] text-[#06294D] flex items-center justify-center shrink-0">
            <Users size={20} />
          </div>
        </div>

        {/* Card 4: Free Legal Helpline */}
        <div className="bg-white rounded-xl border border-[#DCE4EC] p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#718096] uppercase tracking-[0.14em]">
              Free Legal Helpline
            </div>
            <div className="text-xl font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52] mt-1">
              1800-HRSJM
            </div>
            <div className="text-[11px] text-[#718096] mt-0.5">
              24×7 Citizen advocacy desk
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] text-[#C9971A] border border-[#DCE4EC] flex items-center justify-center shrink-0">
            <PhoneCall size={20} />
          </div>
        </div>
      </div>

      {/* 3. FILTER TABS & SEARCH BAR */}
      <div className="bg-white rounded-xl border border-[#DCE4EC] shadow-xs overflow-hidden">
        {/* Category Tabs */}
        <div className="flex border-b border-[#DBE5EE] px-2 overflow-x-auto scrollbar-none">
          {categoryTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveCategory(tab.key)}
              className={`py-3.5 px-4 text-xs font-semibold whitespace-nowrap border-b-2 transition cursor-pointer ${
                activeCategory === tab.key
                  ? 'border-[#E9B82E] text-[#06294D] font-bold bg-[#FAF7F0]/40'
                  : 'border-transparent text-[#718096] hover:text-[#0B2F52]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Row */}
        <div className="p-3.5 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3.5 top-2.5 text-[#718096]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search legal guides by law, article number, topic (e.g. RTI, arrest, domestic violence)..."
              className="w-full pl-10 pr-9 py-2 text-xs bg-[#EDF2F7] border border-[#DBE5EE] rounded-xl text-[#0B2F52] placeholder-[#718096] focus:outline-none focus:ring-2 focus:ring-[#FAD465] focus:bg-white transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="text-[11px] text-[#718096] font-medium shrink-0 self-end sm:self-center">
            Showing <span className="font-bold text-[#0B2F52]">{filteredArticles.length}</span> of {mergedArticles.length} guides
          </div>
        </div>
      </div>

      {/* 4. RIGHTS CARDS GRID */}
      {filteredArticles.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#DCE4EC] p-12 text-center shadow-xs space-y-3">
          <div className="w-12 h-12 bg-[#EDF2F7] rounded-full flex items-center justify-center mx-auto text-[#06294D]">
            <BookOpen size={24} />
          </div>
          <h3 className="text-base font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52]">No Legal Guides Found</h3>
          <p className="text-xs text-[#718096] max-w-sm mx-auto leading-relaxed">
            No rights articles match your search or selected category. Try selecting &quot;All Rights&quot; or clearing your query.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-[#FAD465] text-[#011F39] text-xs font-bold rounded-xl shadow-xs hover:bg-[#E9B82E] transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArticles.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-[#DCE4EC] p-5 md:p-6 shadow-xs hover:border-[#FAD465] hover:shadow-sm transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                {/* Card Top Row: Category Badge & Legal Reference Citation */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-[0.12em] border ${getCategoryBadgeStyle(
                      item.category
                    )}`}
                  >
                    {item.categoryLabel}
                  </span>

                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-[#FAF7F0] text-[#34516D] border border-[#DCE4EC] truncate max-w-[200px]">
                    {item.legalReference}
                  </span>
                </div>

                {/* Article Title */}
                <h3 className="text-base sm:text-lg font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52] leading-snug group-hover:text-[#06294D] transition-colors">
                  {item.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-[#34516D] mt-2 leading-relaxed line-clamp-3">
                  {item.summary}
                </p>

                {/* Highlight Badges with ShieldCheck */}
                {item.highlights && item.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3.5">
                    {item.highlights.slice(0, 3).map((h, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF7F0] text-[#06294D] border border-[#DCE4EC] text-[11px] font-medium"
                      >
                        <ShieldCheck size={12} className="text-[#C9971A] shrink-0" />
                        <span>{h}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer: Views & Primary CTA Button */}
              <div className="pt-3.5 border-t border-[#EDF2F7] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 text-[#718096] text-[11px]">
                  <span className="flex items-center gap-1">
                    <Eye size={13} className="text-[#718096]" />
                    <span>{item.views.toLocaleString('en-IN')} views</span>
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">Helpline: {item.helpline}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalArticle(item)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FAD465] hover:bg-[#E9B82E] active:bg-[#C9971A] text-[#011F39] text-xs font-bold shadow-xs transition cursor-pointer"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. INTERACTIVE ARTICLE READING MODAL */}
      {activeModalArticle && (
        <div className="fixed inset-0 z-50 bg-[#031B31]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-[#DCE4EC]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#DCE4EC] flex items-start justify-between gap-3 bg-[#FAF7F0]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getCategoryBadgeStyle(
                      activeModalArticle.category
                    )}`}
                  >
                    {activeModalArticle.categoryLabel}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#718096]">
                    {activeModalArticle.legalReference}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52]">
                  {activeModalArticle.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalArticle(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#EDF2F7] flex items-center justify-center text-[#718096] hover:text-[#06294D] transition cursor-pointer shrink-0 border border-[#DCE4EC]"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#34516D] leading-relaxed">
              <div className="p-3.5 bg-[#EDF2F7] border border-[#DBE5EE] rounded-xl text-[#0B2F52] flex items-start gap-2.5">
                <Shield size={16} className="mt-0.5 shrink-0 text-[#06294D]" />
                <p className="leading-relaxed">
                  <strong className="text-[#06294D]">Official Legal Summary:</strong> {activeModalArticle.summary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#0B2F52] uppercase tracking-[0.14em] mb-2">
                  Full Statutory Guidance & Protections
                </h4>
                <div className="space-y-3 whitespace-pre-line text-xs text-[#34516D] leading-relaxed bg-[#FAF7F0] p-4 rounded-xl border border-[#DCE4EC]">
                  {activeModalArticle.fullContent}
                </div>
              </div>

              {activeModalArticle.highlights && activeModalArticle.highlights.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#0B2F52] uppercase tracking-[0.14em] mb-2">
                    Key Entitlements & Citizen Safeguards
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeModalArticle.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-white border border-[#DCE4EC] rounded-xl flex items-start gap-2 text-xs"
                      >
                        <ShieldCheck size={14} className="text-[#C9971A] shrink-0 mt-0.5" />
                        <span className="font-semibold text-[#06294D]">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Free Helpline Box */}
              <div className="p-4 bg-[#FAF7F0] border border-[#DCE4EC] rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EDF2F7] text-[#06294D] flex items-center justify-center shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0B2F52]">
                      Need Free Representation or Legal Defense?
                    </div>
                    <div className="text-[11px] text-[#718096]">
                      HRSJM advocates provide pro-bono assistance for verified human rights violations.
                    </div>
                  </div>
                </div>
                <a
                  href="tel:180047756243"
                  className="px-3.5 py-1.5 bg-[#FAD465] hover:bg-[#E9B82E] text-[#011F39] text-xs font-bold rounded-xl shrink-0 transition"
                >
                  Call Helpline
                </a>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-[#DCE4EC] flex items-center justify-between gap-3 bg-[#FAF7F0]">
              <Link
                to={`/seeker/complaint?subject=${encodeURIComponent(activeModalArticle.title)}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#06294D] hover:bg-[#123F68] text-[#FAD465] text-xs font-bold rounded-xl shadow-xs transition"
              >
                <FileText size={14} />
                <span>File Grievance Under This Law</span>
              </Link>

              <button
                type="button"
                onClick={() => setActiveModalArticle(null)}
                className="px-4 py-2 bg-white hover:bg-[#EDF2F7] text-[#0B2F52] text-xs font-bold rounded-xl border border-[#DBE5EE] transition cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
