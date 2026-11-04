import React, { useState } from 'react';
import { FileText, Eye } from 'lucide-react';
import type { ContentPerformanceItem } from '../types/reports.types';

type ContentTab = 'Rights' | 'Blogs' | 'News';

interface TopContentTableProps {
  rights: ContentPerformanceItem[];
  blogs: ContentPerformanceItem[];
  news: ContentPerformanceItem[];
  currentPresetLabel?: string;
}

export const TopContentTable: React.FC<TopContentTableProps> = ({
  rights = [],
  blogs = [],
  news = [],
  currentPresetLabel = 'This Month',
}) => {
  const [activeTab, setActiveTab] = useState<ContentTab>('Rights');

  const currentList =
    activeTab === 'Rights' ? rights : activeTab === 'Blogs' ? blogs : news;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-serif">Top Content Performance</h4>
              <p className="text-xs text-slate-500">Most viewed rights, blogs and news.</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600">
            {currentPresetLabel}
          </span>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg mb-4">
          {(['Rights', 'Blogs', 'News'] as ContentTab[]).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === tab
                  ? 'bg-white text-[#011F39] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden border border-slate-100 rounded-lg">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-3 w-10 text-center">#</th>
              <th className="py-2.5 px-3">Title</th>
              <th className="py-2.5 px-3 text-right w-24">Views</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentList.map(item => (
              <tr key={item.rank} className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 px-3 text-center">
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                      item.rank === 1
                        ? 'bg-[#FAD465] text-[#011F39]'
                        : item.rank === 2
                        ? 'bg-slate-200 text-slate-700'
                        : item.rank === 3
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.rank}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-medium text-slate-800 line-clamp-1">
                  {item.title}
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                    <Eye className="h-3 w-3 text-slate-400" />
                    {item.views}
                  </span>
                </td>
              </tr>
            ))}
            {currentList.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-6 text-slate-400">
                  No records available for this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
