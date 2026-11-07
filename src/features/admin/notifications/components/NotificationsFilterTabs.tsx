import React from 'react';
import { Bell, Inbox, FileText, MessageSquare, HeartHandshake, Radio } from 'lucide-react';

export type MainTabType = 'INBOX' | 'BROADCASTS';
export type InboxSubTab = 'ALL' | 'UNREAD' | 'APPLICATIONS' | 'SUPPORT' | 'FINANCE';

interface NotificationsFilterTabsProps {
  mainTab: MainTabType;
  onSelectMainTab: (tab: MainTabType) => void;
  inboxTab: InboxSubTab;
  onSelectInboxTab: (tab: InboxSubTab) => void;
  unreadCount: number;
}

export const NotificationsFilterTabs: React.FC<NotificationsFilterTabsProps> = ({
  mainTab,
  onSelectMainTab,
  inboxTab,
  onSelectInboxTab,
  unreadCount,
}) => {
  return (
    <div className="space-y-3.5 mb-5">
      {/* Primary Module Switcher (Inbox vs Broadcasts) */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => onSelectMainTab('INBOX')}
          className={`inline-flex items-center gap-2 px-4 py-3 border-b-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer -mb-px ${
            mainTab === 'INBOX'
              ? 'border-[#011F39] text-[#011F39]'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <Inbox size={16} className={mainTab === 'INBOX' ? 'text-[#011F39]' : 'text-slate-400'} />
          <span>My Notifications Inbox</span>
          {unreadCount > 0 && (
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                mainTab === 'INBOX'
                  ? 'bg-[#011F39] text-[#FAD465]'
                  : 'bg-rose-500 text-white'
              }`}
            >
              {unreadCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectMainTab('BROADCASTS')}
          className={`inline-flex items-center gap-2 px-4 py-3 border-b-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer -mb-px ${
            mainTab === 'BROADCASTS'
              ? 'border-[#011F39] text-[#011F39]'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <Radio size={16} className={mainTab === 'BROADCASTS' ? 'text-[#011F39]' : 'text-slate-400'} />
          <span>Broadcast Announcements</span>
        </button>
      </div>

      {/* Inbox Sub-filters (Only shown when viewing Inbox) */}
      {mainTab === 'INBOX' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => onSelectInboxTab('ALL')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              inboxTab === 'ALL'
                ? 'bg-[#011F39] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <Bell size={13} />
            <span>All Alerts</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectInboxTab('UNREAD')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              inboxTab === 'UNREAD'
                ? 'bg-[#011F39] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <span>Unread Only</span>
            {unreadCount > 0 && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-tight ${
                  inboxTab === 'UNREAD'
                    ? 'bg-[#FAD465] text-[#011F39]'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {unreadCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onSelectInboxTab('APPLICATIONS')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              inboxTab === 'APPLICATIONS'
                ? 'bg-[#011F39] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <FileText size={13} />
            <span>Applications & Members</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectInboxTab('SUPPORT')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              inboxTab === 'SUPPORT'
                ? 'bg-[#011F39] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <MessageSquare size={13} />
            <span>Support & Complaints</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectInboxTab('FINANCE')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              inboxTab === 'FINANCE'
                ? 'bg-[#011F39] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <HeartHandshake size={13} />
            <span>Donations & Accounting</span>
          </button>
        </div>
      )}
    </div>
  );
};
