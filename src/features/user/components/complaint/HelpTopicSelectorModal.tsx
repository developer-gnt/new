import React, { useState, useMemo } from 'react';
import { Search, X, Check, Scale, Shield, Users, FileText, Briefcase, GraduationCap, Clock, AlertTriangle, Building2, HeartHandshake } from 'lucide-react';
import { HELP_TOPICS, type HelpTopic } from '../../data/helpTopicsData';

export interface HelpTopicSelectorModalProps {
  isOpen: boolean;
  selectedTopics: HelpTopic[];
  onClose: () => void;
  onConfirm: (topics: HelpTopic[]) => void;
}

const HelpTopicSelectorModalContent: React.FC<HelpTopicSelectorModalProps> = ({
  selectedTopics,
  onClose,
  onConfirm,
}) => {
  const [query, setQuery] = useState('');
  const [tempSelected, setTempSelected] = useState<HelpTopic[]>(selectedTopics);

  const filteredTopics = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return HELP_TOPICS;
    return HELP_TOPICS.filter(topic =>
      topic.title.toLowerCase().includes(q) ||
      topic.description.toLowerCase().includes(q) ||
      topic.keywords.some(k => k.toLowerCase().includes(q))
    );
  }, [query]);

  const toggleTopic = (topic: HelpTopic) => {
    setTempSelected(prev => {
      const exists = prev.some(t => t.id === topic.id);
      if (exists) {
        return prev.filter(t => t.id !== topic.id);
      }
      return [...prev, topic];
    });
  };

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'Scale':
        return <Scale size={18} />;
      case 'Baby':
      case 'UserCheck':
        return <Shield size={18} />;
      case 'FileSearch':
      case 'FileText':
        return <FileText size={18} />;
      case 'GraduationCap':
        return <GraduationCap size={18} />;
      case 'Briefcase':
        return <Briefcase size={18} />;
      case 'Clock':
        return <Clock size={18} />;
      case 'ShieldAlert':
        return <AlertTriangle size={18} />;
      case 'Building2':
        return <Building2 size={18} />;
      case 'HeartHandshake':
        return <HeartHandshake size={18} />;
      case 'Users':
      default:
        return <Users size={18} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#06294D]">
              Select Type(s) of Help
            </h3>
            <p className="text-xs text-slate-500">
              Choose one or more categories relevant to your complaint
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search help topics or keywords (e.g. women, police, labour)..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#06294D]"
            />
          </div>
        </div>

        {/* Topics List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredTopics.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-xs">
              No matching help categories found. Try different keywords.
            </div>
          ) : (
            filteredTopics.map(topic => {
              const isSelected = tempSelected.some(t => t.id === topic.id);
              return (
                <div
                  key={topic.id}
                  onClick={() => toggleTopic(topic)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-[#06294D] bg-[#06294D]/5 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: topic.badgeBg, color: topic.badgeColor }}
                    >
                      {getTopicIcon(topic.iconName)}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#06294D]">
                        {topic.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {topic.description}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#06294D] border-[#06294D] text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-600">
            {tempSelected.length} {tempSelected.length === 1 ? 'category' : 'categories'} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm(tempSelected);
                onClose();
              }}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#E9B82E] hover:bg-[#d8a825] text-[#06294D] cursor-pointer shadow-xs transition-colors"
            >
              Apply Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HelpTopicSelectorModal: React.FC<HelpTopicSelectorModalProps> = (props) => {
  if (!props.isOpen) return null;
  return <HelpTopicSelectorModalContent {...props} />;
};
