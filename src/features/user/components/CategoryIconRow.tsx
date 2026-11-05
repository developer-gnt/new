import type { RightsCategory } from '../types/userHome.types';
import {
  Scale,
  Users,
  GraduationCap,
  Baby,
  Megaphone,
  BookOpen,
  Handshake,
  Shield,
} from 'lucide-react';

interface CategoryIconRowProps<T extends RightsCategory> {
  items: T[];
  onPressItem?: (item: T) => void;
}

const renderCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'scale':
      return <Scale size={20} className="text-[#06294D]" strokeWidth={1.8} />;
    case 'users':
      return <Users size={20} className="text-[#06294D]" strokeWidth={1.8} />;
    case 'graduation-cap':
      return <GraduationCap size={20} className="text-[#06294D]" strokeWidth={1.8} />;
    case 'baby':
    case 'child-care':
      return <Baby size={20} className="text-[#06294D]" strokeWidth={1.8} />;
    case 'megaphone':
      return <Megaphone size={20} className="text-[#06294D]" strokeWidth={1.8} />;
    case 'book-open':
    case 'doc-search':
      return <BookOpen size={20} className="text-[#06294D]" strokeWidth={1.8} />;
    case 'handshake':
    case 'heart-hands':
      return <Handshake size={20} className="text-[#06294D]" strokeWidth={1.8} />;
    default:
      return <Shield size={20} className="text-[#06294D]" strokeWidth={1.8} />;
  }
};

const REFERENCE_LABELS: Record<string, string> = {
  'Human Rights': 'Human\nRights',
  "Women's Rights": "Women's\nRights",
  'Right to Education': 'Right to\nEducation',
  "Children's Rights": "Children's\nRights",
  'Awareness Campaigns': 'Awareness\nCampaigns',
  'Workshops & Training': 'Workshops\nand Training',
  'Workshops and Training': 'Workshops\nand Training',
  'Research & Education': 'Research and\nEducation',
  'Research and Education': 'Research and\nEducation',
  'Research & Rights Education': 'Research and\nEducation',
  'Research and Rights Education': 'Research and\nEducation',
  'Community Activities': 'Community\nActivities',
};

export const CategoryIconRow = <T extends RightsCategory>({
  items,
  onPressItem,
}: CategoryIconRowProps<T>) => {
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full">
      {items.map(item => (
        <button
          key={item.id}
          type="button"
          onClick={() => onPressItem?.(item)}
          className="flex flex-col items-center justify-center p-2 sm:p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 active:scale-98 cursor-pointer min-h-[88px] sm:min-h-[96px] text-center min-w-0"
          aria-label={item.title}
        >
          {/* Pale-Gold Circular Icon Backdrop */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center mb-1.5 sm:mb-2 shrink-0">
            {renderCategoryIcon(item.icon)}
          </div>

          <span className="text-[10px] sm:text-[12px] font-bold text-[#06294D] leading-tight whitespace-pre-line">
            {REFERENCE_LABELS[item.title] ?? item.title}
          </span>
        </button>
      ))}
    </div>
  );
};
