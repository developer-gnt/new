import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  Search,
  ArrowRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { RIGHTS_ARTICLES } from '../data/seekerData';

type CategoryFilter = 'ALL' | 'CONSTITUTIONAL' | 'WOMEN_CHILD' | 'CIVIL_JUSTICE' | 'LABOUR_WELFARE';

export const SeekerRightsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = useMemo(() => {
    return RIGHTS_ARTICLES.filter((item) => {
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
  }, [activeCategory, searchQuery]);

  const categories: Array<{ key: CategoryFilter; label: string }> = [
    { key: 'ALL', label: 'All Rights' },
    { key: 'CONSTITUTIONAL', label: 'Constitutional' },
    { key: 'WOMEN_CHILD', label: 'Women & Child' },
    { key: 'CIVIL_JUSTICE', label: 'Civil & Justice' },
    { key: 'LABOUR_WELFARE', label: 'Labour & Welfare' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#DCE4EC] p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">
            <Scale size={14} className="text-[#06294D]" />
            <span>Legal Literacy & Civic Rights</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52]">
            Know Your Rights & Free Legal Aid
          </h1>
          <p className="text-xs text-[#718096] mt-0.5">
            Practical legal guidance on constitutional protections, welfare rights, and grievance remedies.
          </p>
        </div>

        <Link
          to="/seeker/complaint"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#06294D] hover:bg-[#123F68] text-[#FAD465] text-xs font-bold rounded-xl shadow-xs transition"
        >
          <FileText size={14} />
          <span>File a Legal Grievance</span>
        </Link>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-2xl border border-[#DCE4EC] p-4 shadow-xs space-y-4">
        <div className="flex border-b border-[#DBE5EE] gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer ${
                activeCategory === cat.key
                  ? 'bg-[#06294D] text-[#FAD465] shadow-xs'
                  : 'text-[#718096] hover:bg-[#EDF2F7] hover:text-[#0B2F52]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rights by law, article number, topic..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#EDF2F7] border border-[#DBE5EE] rounded-xl text-[#0B2F52] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FAD465] focus:bg-white transition"
          />
          <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
        </div>
      </div>

      {/* Rights Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-[#DCE4EC] p-6 shadow-sm hover:border-[#FAD465] transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-[#FFF9E6] text-[#C9971A] border border-[#FAD465]/40">
                  {item.categoryLabel}
                </span>
                <span className="text-[11px] font-mono text-gray-400 font-semibold">
                  {item.legalReference}
                </span>
              </div>

              <h3 className="text-base font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52] leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-[#34516D] mt-2 leading-relaxed line-clamp-3">
                {item.summary}
              </p>

              {/* Highlights Chips */}
              <div className="flex flex-wrap gap-1.5 mt-3">
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

            <div className="pt-3 border-t border-[#DBE5EE] flex items-center justify-between text-xs">
              <span className="text-[#718096] text-[11px]">Helpline: {item.helpline}</span>
              <Link
                to={`/seeker/rights/${item.id}`}
                className="text-[#06294D] font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>Read Full Law Guide</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

