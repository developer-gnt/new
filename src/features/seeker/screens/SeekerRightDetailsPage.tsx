import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, FileText } from 'lucide-react';
import { RIGHTS_ARTICLES } from '../data/seekerData';
import { rightsStore } from '@/features/admin/rights/store/rightsStore';
import type { RightsArticle as SeekerRightsItem } from '../types/seeker.types';

export const SeekerRightDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const aliasMap: Record<string, string> = {
    'human-rights': 'fundamental-rights',
    'childrens-rights': 'right-to-education',
  };
  const targetId = (id && aliasMap[id]) || id;

  // First check admin rightsStore for centrally managed article
  const adminArticle = targetId ? rightsStore.getById(targetId) : undefined;

  let article: SeekerRightsItem;
  if (adminArticle) {
    article = {
      id: adminArticle.id,
      title: adminArticle.title,
      category: 'CIVIL_JUSTICE',
      categoryLabel: adminArticle.category || 'Constitutional & Legal Aid',
      legalReference:
        adminArticle.tags && adminArticle.tags.length > 0
          ? adminArticle.tags[0]
          : 'Statutory Civil Protection',
      summary:
        adminArticle.description ||
        (Array.isArray(adminArticle.content) ? adminArticle.content.join(' ') : ''),
      fullContent: Array.isArray(adminArticle.content)
        ? adminArticle.content.join('\n\n')
        : adminArticle.description || '',
      highlights:
        adminArticle.highlights && adminArticle.highlights.length > 0
          ? adminArticle.highlights.map((h) => h.title || h.description || String(h))
          : ['Legal Entitlement', 'Statutory Redress', 'Free Legal Aid Available'],
      helpline: 'HRSJM Legal Helpline: 1800-HRSJM-AID',
    };
  } else {
    article = RIGHTS_ARTICLES.find((a) => a.id === targetId) || RIGHTS_ARTICLES[0];
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/seeker/rights')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B2F52] hover:text-[#06294D] transition cursor-pointer"
        >
          <ChevronLeft size={16} />
          <span>Back to All Rights</span>
        </button>

        <span className="text-xs font-mono text-gray-500">{article.legalReference}</span>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-[#DCE4EC] p-6 md:p-10 shadow-sm space-y-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFF9E6] text-[#C9971A] border border-[#FAD465]/40 inline-block mb-3">
            {article.categoryLabel}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold font-['Playfair_Display',Georgia,serif] text-[#0B2F52] leading-tight">
            {article.title}
          </h1>
          <div className="text-xs text-[#718096] mt-2">
            Statutory Basis: <strong className="text-[#06294D]">{article.legalReference}</strong>
          </div>
        </div>

        {/* Highlights Bar */}
        <div className="p-4 bg-[#EDF2F7] rounded-xl border border-[#DBE5EE]">
          <div className="text-xs font-bold text-[#0B2F52] uppercase mb-2">Core Entitlements & Rights:</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {article.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-[#34516D] font-medium">
                <ShieldCheck size={16} className="text-[#C9971A] shrink-0" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Full Explanatory Text */}
        <div className="space-y-4 text-xs md:text-sm text-[#34516D] leading-relaxed whitespace-pre-line border-t border-[#DBE5EE] pt-6">
          {article.fullContent || article.summary}
        </div>

        {/* Action Callout */}
        <div className="mt-8 p-5 bg-[#FFF9E6] border border-[#FAD465] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-[#06294D]">Have Your Rights Been Violated?</h4>
            <p className="text-xs text-[#34516D] mt-0.5">
              Submit an online complaint to the HRSJM Legal Cell for free assessment and intervention.
            </p>
          </div>
          <Link
            to="/seeker/complaint"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#06294D] hover:bg-[#123F68] text-[#FAD465] text-xs font-bold rounded-xl shadow-xs transition shrink-0"
          >
            <FileText size={14} />
            <span>File Grievance Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

