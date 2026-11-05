import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Scale, Calendar, MessageSquare, Clock } from 'lucide-react';

const TABS = [
  { id: 'home', label: 'Home', path: '/', icon: Home },
  { id: 'about', label: 'About', path: '/about', icon: FileText },
  { id: 'rights', label: 'Rights', path: '/rights', icon: Scale },
  { id: 'events', label: 'Events', path: '/events', icon: Calendar },
  { id: 'news', label: 'News', path: '/news', icon: MessageSquare },
  { id: 'history', label: 'History', path: '/donations', icon: Clock },
];

export const UserBottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around select-none"
      role="navigation"
      aria-label="Mobile Bottom Navigation"
    >
      {TABS.map(tab => {
        const IconComponent = tab.icon;
        const isActive =
          tab.path === '/'
            ? location.pathname === '/' || location.pathname === '/user/dashboard'
            : location.pathname.startsWith(tab.path);

        return (
          <Link
            key={tab.id}
            to={tab.path}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              isActive ? 'text-[#E9B82E]' : 'text-[#718096] hover:text-slate-800'
            }`}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <IconComponent size={21} strokeWidth={isActive ? 2.3 : 1.8} />
            <span
              className={`text-[10.5px] font-bold mt-0.5 tracking-tight ${
                isActive ? 'text-[#06294D]' : 'text-slate-500'
              }`}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

