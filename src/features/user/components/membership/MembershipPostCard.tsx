import React from 'react';
import {
  User,
  Users,
  Shield,
  Award,
  Crown,
  Scale,
  Calendar,
  CheckCircle2,
  Package,
} from 'lucide-react';
import type { MembershipPostData } from '../../data/membershipCategoriesData';

interface MembershipPostCardProps {
  post: MembershipPostData;
  onApply: (post: MembershipPostData) => void;
}

export const MembershipPostCard: React.FC<MembershipPostCardProps> = ({ post, onApply }) => {
  const getPostIcon = () => {
    switch (post.iconType) {
      case 'user':
        return <User className="w-5 h-5 text-blue-700" />;
      case 'community':
        return <Users className="w-5 h-5 text-emerald-700" />;
      case 'crown':
        return <Crown className="w-5 h-5 text-amber-600" />;
      case 'counselor':
        return <Award className="w-5 h-5 text-emerald-700" />;
      case 'shield':
        return <Shield className="w-5 h-5 text-blue-700" />;
      case 'director':
        return <Award className="w-5 h-5 text-amber-700" />;
      case 'scale':
        return <Scale className="w-5 h-5 text-blue-700" />;
      case 'minority':
        return <Users className="w-5 h-5 text-emerald-700" />;
      case 'women':
        return <Award className="w-5 h-5 text-purple-700" />;
      case 'political':
        return <Shield className="w-5 h-5 text-indigo-700" />;
      default:
        return <Shield className="w-5 h-5 text-blue-700" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DCE4EC] shadow-xs hover:shadow-md transition-shadow">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#DBE5EE]">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-slate-200/70"
            style={{ backgroundColor: post.iconBgColor }}
          >
            {getPostIcon()}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-extrabold text-[#06294D] tracking-tight leading-snug truncate">
              {post.postName}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              {post.qualification}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-base sm:text-lg font-black text-[#059669]">
            {post.fee}
          </div>
          <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-[10.5px] font-bold text-emerald-800 border border-emerald-200">
            {post.validity}
          </span>
        </div>
      </div>

      {/* Main Details Body (Two Columns on md+, stacked on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3.5">
        {/* Left Column: Checklist & Duration */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            {post.checklistItems.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                <span className="text-xs text-slate-700 font-medium leading-tight">
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Membership Duration Info */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-blue-50/70 border border-blue-100">
            <Calendar className="w-4 h-4 text-blue-700 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block leading-tight">
                Membership Duration
              </span>
              <span className="text-xs font-bold text-[#06294D]">
                {post.validity}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Membership Kit & Apply Button */}
        <div className="flex flex-col justify-between space-y-3 md:border-l md:border-slate-100 md:pl-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Package className="w-3.5 h-3.5 text-blue-700" />
              <span className="text-[11px] font-bold text-[#06294D] uppercase tracking-wider">
                Membership Kit
              </span>
            </div>
            <div className="space-y-1">
              {post.kitItems.map((item, idx) => (
                <p key={idx} className="text-[11px] text-slate-600 leading-snug">
                  {item}
                </p>
              ))}
            </div>
          </div>

          {/* Apply Now Button */}
          <button
            type="button"
            onClick={() => onApply(post)}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#E9B82E] hover:bg-[#d8a825] text-[#011F39] font-extrabold text-xs shadow-xs hover:shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Apply Now</span>
            <span className="text-[#011F39]/80 font-black">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

