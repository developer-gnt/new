import React, { useState, useEffect, useMemo } from 'react';
import {
  Scale,
  Search,
  BookOpen,
  ArrowRight,
  Shield,
  X,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { rightsService } from '../../admin/rights/services/rightsService';
import type { RightsArticle } from '../../admin/rights/types/rights.types';
import { USER_RIGHTS_ARTICLES } from '../data/userRightsData';

const RIGHTS_CATEGORIES = [
  'ALL',
  'Human Rights',
  "Women's Rights",
  'Right to Education',
  "Children's Rights",
  'Labor & Worker Rights',
  'Senior Citizens',
  'Minority Rights',
];

const getCanonicalCategory = (category: string): string => {
  const c = (category || '').toLowerCase().trim();
  if (c.includes('child')) return 'CHILDREN';
  if (c.includes('women')) return 'WOMEN';
  if (c.includes('education')) return 'EDUCATION';
  if (c.includes('labor') || c.includes('labour') || c.includes('worker')) return 'LABOR';
  if (c.includes('senior') || c.includes('elder')) return 'SENIOR';
  if (c.includes('minority')) return 'MINORITY';
  if (c.includes('human') || c.includes('constitution') || c.includes('fundamental')) return 'HUMAN';
  return c;
};

const matchesCategoryFilter = (
  selected: string,
  articleCategory: string
): boolean => {
  if (!selected || selected === 'ALL') return true;

  const target = getCanonicalCategory(selected);
  const actual = getCanonicalCategory(articleCategory);

  return target === actual;
};

const deduplicateByTitle = (list: RightsArticle[]): RightsArticle[] => {
  const seen = new Set<string>();
  return list.filter(item => {
    const key = item.title
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/labour/g, 'labor')
      .replace(/[^a-z0-9]/g, '');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const UserRightsPage: React.FC = () => {
  const [articles, setArticles] = useState<RightsArticle[]>(USER_RIGHTS_ARTICLES);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeArticle, setActiveArticle] = useState<RightsArticle | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await rightsService.list({ status: 'PUBLISHED' });
        if (isMounted) {
          // Filter out legacy admin mock items (r-01 to r-08) to prevent duplicates,
          // while preserving any newly published backend rights.
          const serverItems = (res.items || []).filter(
            item => !item.id.startsWith('r-0')
          );
          const combined = deduplicateByTitle([...USER_RIGHTS_ARTICLES, ...serverItems]);
          setArticles(combined);
        }
      } catch {
        if (isMounted) {
          setArticles(USER_RIGHTS_ARTICLES);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchArticles();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter(item => {
      const matchesCat = matchesCategoryFilter(
        selectedCategory,
        item.category
      );
      const matchesSearch =
        !search.trim() ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [articles, selectedCategory, search]);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-[#06294D] text-white p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9B82E]/20 text-[#FAD465] text-xs font-bold uppercase tracking-wider mb-2">
            <Scale size={14} />
            <span>Constitutional Literacy Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Know Your Rights</h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1">
            Empower yourself with fundamental constitutional knowledge, civil rights safeguards, and legal recourse procedures under Indian Law.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-72 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search rights or articles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#FAD465]"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {RIGHTS_CATEGORIES.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#06294D] text-[#FAD465] shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {cat === 'ALL' ? 'All Rights' : cat}
          </button>
        ))}
      </div>

      {/* Grid of Rights Articles */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
          <BookOpen size={36} className="mx-auto mb-2 text-slate-400" />
          <p className="text-sm font-bold text-slate-700">No legal articles found</p>
          <p className="text-xs text-slate-400 mt-1">Try modifying your search or selecting another category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map(article => (
            <div
              key={article.id}
              onClick={() => setActiveArticle(article)}
              className="flex flex-col justify-between p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Eye size={12} />
                    <span>{article.views} views</span>
                  </div>
                </div>

                <h3 className="text-base font-bold font-serif text-[#06294D] group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug mb-2">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {article.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#06294D]">
                <span>Read Full Guide</span>
                <div className="w-6 h-6 rounded-full bg-slate-50 group-hover:bg-[#06294D] flex items-center justify-center transition-colors">
                  <ArrowRight size={12} className="text-slate-600 group-hover:text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Article Detail Reading Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-3xl rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50">
              <div className="pr-4">
                <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                  {activeArticle.category}
                </span>
                <h2 className="text-xl font-black font-serif text-[#06294D] mt-2 leading-tight">
                  {activeArticle.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Authored by {activeArticle.author || 'HRSJM Legal Cell'} • {activeArticle.lastUpdatedDate}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700 leading-relaxed">
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-[#06294D] leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <Shield size={14} className="text-amber-600" />
                  <span>Constitutional Principle Overview</span>
                </div>
                {activeArticle.description}
              </div>

              {activeArticle.highlights && activeArticle.highlights.length > 0 && (
                <div>
                  <h4 className="font-bold text-[#06294D] text-xs uppercase tracking-wider mb-2">
                    Key Legal Rights & Provisions:
                  </h4>
                  <div className="space-y-2">
                    {activeArticle.highlights.map((h: any, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                        <CheckCircle size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900 block">{h.title}</strong>
                          <span className="text-slate-600">{h.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeArticle.content && activeArticle.content.length > 0 && (
                <div className="space-y-3 pt-2 text-slate-600 text-xs sm:text-sm">
                  {activeArticle.content.map((p: string, i: number) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">Need specific legal counsel on this issue?</span>
              <button
                type="button"
                onClick={() => {
                  setActiveArticle(null);
                  window.location.href = '/support';
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#06294D] hover:bg-[#083563] cursor-pointer"
              >
                File a Free Grievance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
