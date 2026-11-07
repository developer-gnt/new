import React, { useState, useMemo, useEffect, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  Search,
  ArrowRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { RIGHTS_ARTICLES } from '../data/seekerData';
import type { RightsArticle as SeekerRightsItem } from '../types/seeker.types';
import { rightsStore } from '@/features/admin/rights/store/rightsStore';
import { filterRightsForRole } from '@/features/content';

type CategoryFilter = 'ALL' | 'CONSTITUTIONAL' | 'WOMEN_CHILD' | 'CIVIL_JUSTICE' | 'LABOUR_WELFARE';

interface CategoryFilterTab {
  key: CategoryFilter;
  label: string;
}

const CATEGORY_TABS: CategoryFilterTab[] = [
  { key: 'ALL', label: 'All Rights' },
  { key: 'CONSTITUTIONAL', label: 'Constitutional' },
  { key: 'WOMEN_CHILD', label: 'Women & Child' },
  { key: 'CIVIL_JUSTICE', label: 'Civil & Justice' },
  { key: 'LABOUR_WELFARE', label: 'Labour & Welfare' },
];

type SeekerArticleCategory = 'CONSTITUTIONAL' | 'WOMEN_CHILD' | 'CIVIL_JUSTICE' | 'LABOUR_WELFARE';

const mapCategoryToSeeker = (rawCat: string): { key: SeekerArticleCategory; label: string } => {
  const c = (rawCat || '').toLowerCase();
  if (c.includes('constitut')) return { key: 'CONSTITUTIONAL', label: 'Constitutional' };
  if (c.includes('women') || c.includes('child')) return { key: 'WOMEN_CHILD', label: 'Women & Child' };
  if (c.includes('labour') || c.includes('labor') || c.includes('welfare') || c.includes('worker')) {
    return { key: 'LABOUR_WELFARE', label: 'Labour & Welfare' };
  }
  return { key: 'CIVIL_JUSTICE', label: 'Civil & Justice' };
};

/**
 * Exact replication of MemberRightsScreen.tsx from the HRSJM React Native APK:
 * - Header: "Know Your Rights & Free Legal Aid" with "File a Legal Grievance" button
 * - Filter Tabs: All Rights, Constitutional, Women & Child, Civil & Justice, Labour & Welfare
 * - Search bar with #EDF2F7 input
 * - Cards with category badge, legal reference citation, Serif title, summary, highlight chips with ShieldCheck, and helpline footer
 */
export const SeekerRightsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    rightsStore.fetchRights().catch(() => {});
  }, []);

  const snapshot = useSyncExternalStore(rightsStore.subscribe, rightsStore.getSnapshot);

  const mergedArticles = useMemo(() => {
    const authorized = filterRightsForRole(snapshot.articles, 'SEEKER');
    const dynamicSeekerItems: SeekerRightsItem[] = authorized.map((a) => {
      const catMeta = mapCategoryToSeeker(a.category);
      return {
        id: a.id,
        title: a.title,
        category: catMeta.key,
        categoryLabel: catMeta.label,
        legalReference: a.tags && a.tags.length > 0 ? a.tags[0] : 'Statutory Civil Protection',
        summary:
          a.description ||
          (Array.isArray(a.content) ? a.content.join(' ').slice(0, 180) + '...' : 'Verified human rights guide.'),
        fullContent: Array.isArray(a.content) ? a.content.join('\n\n') : a.description,
        highlights:
          a.highlights && a.highlights.length > 0
            ? a.highlights.map((h) => h.title || h.description || String(h))
            : ['Fundamental Guarantee', 'Legal Aid Available', 'Right to Redress'],
        helpline: 'HRSJM Legal Cell: 1800-HRSJM-AID',
      };
    });

    const seenTitles = new Set<string>();
    const combined: SeekerRightsItem[] = [];

    // Prioritize centrally managed dynamic items from admin
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
        combined.push(item);
      }
    }

    return combined;
  }, [snapshot.articles]);

  const filteredArticles = useMemo(() => {
    return mergedArticles.filter((item) => {
      if (activeCategory !== 'ALL' && item.category !== activeCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchRef = item.legalReference.toLowerCase().includes(q);
        const matchSum = item.summary.toLowerCase().includes(q);
        return matchTitle || matchRef || matchSum;
      }
      return true;
    });
  }, [mergedArticles, activeCategory, searchQuery]);

  return (
    <div className="space-y-4">
      {/* 1. HEADER */}
      <div className="bg-white rounded-2xl border border-[#DCE4EC] px-5 py-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#718096] uppercase tracking-wider mb-0.5">
            <Scale size={14} className="text-[#06294D]" />
            <span>Legal Literacy & Civic Rights</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52] leading-tight">
            Know Your Rights & Free Legal Aid
          </h1>
          <p className="text-xs text-[#718096] mt-0.5">
            Practical legal guidance on constitutional protections, welfare rights, and grievance remedies.
          </p>
        </div>

        <Link
          to="/seeker/complaint"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#06294D] hover:bg-[#123F68] text-[#FAD465] text-xs font-bold rounded-xl shadow-xs transition shrink-0"
        >
          <FileText size={14} />
          <span>File a Legal Grievance</span>
        </Link>
      </div>

      {/* 2. FILTER TABS & SEARCH */}
      <div className="bg-white rounded-2xl border border-[#DCE4EC] shadow-xs overflow-hidden">
        <div className="flex border-b border-[#DBE5EE] px-2 overflow-x-auto">
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`py-3 px-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition cursor-pointer ${
                activeCategory === cat.key
                  ? 'border-[#E9B82E] text-[#06294D] font-bold'
                  : 'border-transparent text-[#718096] hover:text-[#0B2F52]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="p-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rights by law, article number, topic..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#EDF2F7] border border-[#DBE5EE] rounded-xl text-[#0B2F52] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FAD465] focus:bg-white transition"
            />
            <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* 3. RIGHTS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredArticles.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-[#DCE4EC] p-5 shadow-xs hover:border-[#FAD465] transition flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF9E6] text-[#C9971A] border border-[#FAD465]/40">
                  {item.categoryLabel}
                </span>
                <span className="text-[11px] font-mono text-gray-400 font-semibold truncate">
                  {item.legalReference}
                </span>
              </div>

              <h3 className="text-base font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52] leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-[#34516D] mt-1.5 leading-relaxed line-clamp-3">
                {item.summary}
              </p>

              {/* Highlights Chips */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {item.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#EDF2F7] text-[#0B2F52] text-[10px] font-medium"
                  >
                    <ShieldCheck size={11} className="text-[#0D9488]" />
                    <span>{h}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2.5 border-t border-[#DBE5EE] flex items-center justify-between text-xs">
              <span className="text-[#718096] text-[11px]">Helpline: {item.helpline}</span>
              <Link
                to={`/seeker/rights/${item.id}`}
                className="text-[#06294D] font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>Read Full Law Guide</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
