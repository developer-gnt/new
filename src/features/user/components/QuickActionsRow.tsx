import React from 'react';
import type { HomeQuickAction } from '../types/userHome.types';
import { Users, FileText, Heart, CreditCard } from 'lucide-react';

interface QuickActionsRowProps {
  actions: HomeQuickAction[];
  onPressAction?: (action: HomeQuickAction) => void;
}

const renderIcon = (iconName: string, color: string) => {
  switch (iconName) {
    case 'users':
      return <Users size={22} className={color} strokeWidth={1.8} />;
    case 'file-text':
      return <FileText size={22} className={color} strokeWidth={1.8} />;
    case 'heart':
      return <Heart size={22} className={color} strokeWidth={1.8} />;
    case 'id-card':
    default:
      return <CreditCard size={22} className={color} strokeWidth={1.8} />;
  }
};

const formatLabel = (id: string, label: string) => {
  switch (id) {
    case 'join':
      return 'Join HRSJM';
    case 'complaint':
      return 'File a Complaint';
    case 'donate':
      return 'Donate Now';
    case 'renew':
    case 'membership':
      return 'Become a Member';
    default:
      return label;
  }
};

export const QuickActionsRow: React.FC<QuickActionsRowProps> = ({
  actions,
  onPressAction,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full">
      {actions.map(action => {
        const isEmphasized = action.emphasized === true;
        return (
          <button
            key={action.id}
            type="button"
            onClick={() => onPressAction?.(action)}
            className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl text-center transition-all duration-200 active:scale-98 cursor-pointer min-h-[92px] ${
              isEmphasized
                ? 'bg-[#06294D] text-white shadow-md hover:bg-[#083563] border border-[#06294D]'
                : 'bg-white text-[#06294D] border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow'
            }`}
            aria-label={action.label}
          >
            <div className="mb-2 flex items-center justify-center">
              {renderIcon(
                action.icon,
                isEmphasized ? 'text-[#FAD465]' : 'text-[#06294D]'
              )}
            </div>
            <span
              className={`text-[12px] sm:text-[13px] font-bold leading-tight ${
                isEmphasized ? 'text-white' : 'text-[#06294D]'
              }`}
            >
              {formatLabel(action.id, action.label)}
            </span>
          </button>
        );
      })}
    </div>
  );
};

