import type React from 'react';
import { Eye, MoreVertical } from 'lucide-react';
import type { RightsListItem } from '../types/rights.types';
import {
  RIGHTS_STATUS_TONES,
  RIGHTS_STATUS_LABELS,
  formatRightsViews,
} from '../types/rights.types';

export const RightsListHeader: React.FC = () => {
  return (
    <div className="hidden md:flex items-center gap-4 px-5 py-3.5 bg-slate-50/90 border border-slate-200/90 rounded-t-xl text-[11px] font-bold text-slate-500 uppercase tracking-wider">
      <div className="flex-1 min-w-[280px]">
        <span>Rights Details</span>
      </div>
      <div className="w-36 shrink-0">
        <span>Category</span>
      </div>
      <div className="w-32 shrink-0">
        <span>Last Updated</span>
      </div>
      <div className="w-28 shrink-0">
        <span>Status</span>
      </div>
      <div className="w-20 shrink-0 text-right">
        <span>Views</span>
      </div>
      <div className="w-12 shrink-0 text-right">
        <span>Action</span>
      </div>
    </div>
  );
};

export interface RightsCardProps {
  article: RightsListItem;
  onPress: (article: RightsListItem) => void;
  onMorePress: (article: RightsListItem, e: React.MouseEvent) => void;
}

export const RightsCard: React.FC<RightsCardProps> = ({
  article,
  onPress,
  onMorePress,
}) => {
  const statusTone = RIGHTS_STATUS_TONES[article.status] || RIGHTS_STATUS_TONES.DRAFT;

  return (
    <div
      onClick={() => onPress(article)}
      className="group flex flex-col md:flex-row md:items-center gap-4 px-5 py-3.5 bg-white hover:bg-slate-50/80 border-x border-b border-slate-200/90 first:border-t md:first:border-t-0 last:rounded-b-xl transition-colors cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onPress(article);
      }}
    >
      {/* Col 1: Rights Details */}
      <div className="flex items-center gap-3.5 flex-1 min-w-[280px] overflow-hidden">
        {article.thumbnailUrl ? (
          <img
            src={article.thumbnailUrl}
            alt={article.title}
            className="w-14 h-11 rounded-lg object-cover bg-slate-100 shrink-0"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-14 h-11 rounded-lg bg-[#011F39] text-[#FAD465] flex items-center justify-center font-bold text-[10px] tracking-wider shrink-0">
            HRSJM
          </div>
        )}

        <div className="flex flex-col min-w-0 overflow-hidden">
          <h3 className="font-serif font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#B45309] transition-colors truncate">
            {article.title}
          </h3>
          <p className="text-xs text-slate-500 truncate leading-snug">
            {article.description}
          </p>
        </div>
      </div>

      {/* Mobile Meta Row */}
      <div className="flex md:contents items-center justify-between gap-3 text-xs pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
        {/* Col 2: Category */}
        <div className="w-auto md:w-36 shrink-0">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/80">
            {article.category}
          </span>
        </div>

        {/* Col 3: Last Updated */}
        <div className="w-auto md:w-32 shrink-0 flex flex-col">
          <span className="text-xs font-medium text-slate-800">
            {article.lastUpdatedDate}
          </span>
          <span className="text-[11px] text-slate-400">
            {article.lastUpdatedTime}
          </span>
        </div>

        {/* Col 4: Status */}
        <div className="w-auto md:w-28 shrink-0">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-2xs"
            style={{
              backgroundColor: statusTone.bg,
              borderColor: statusTone.border,
              color: statusTone.text,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: statusTone.dot }}
            />
            <span>{RIGHTS_STATUS_LABELS[article.status]}</span>
          </span>
        </div>

        {/* Col 5: Views */}
        <div className="w-auto md:w-20 shrink-0 flex items-center md:justify-end gap-1 text-slate-500">
          <Eye size={13} className="text-slate-400" />
          <span className="text-xs font-semibold">{formatRightsViews(article.views)}</span>
        </div>

        {/* Col 6: Action */}
        <div
          className="w-auto md:w-12 shrink-0 flex justify-end"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMorePress(article, e);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="More actions"
            aria-label="Actions menu"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
