import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  House,
  FileText,
  Scale,
  Calendar,
  MessageSquare,
  User,
} from 'lucide-react';

interface TabItem {
  id: string;
  name: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number; color?: string }>;
}

const SEEKER_BOTTOM_TABS: TabItem[] = [
  { id: 'home', name: 'SeekerHome', label: 'Home', path: '/seeker/home', icon: House },
  { id: 'requests', name: 'SeekerRequests', label: 'My Aid', path: '/seeker/requests', icon: FileText },
  { id: 'rights', name: 'SeekerRights', label: 'Rights', path: '/seeker/rights', icon: Scale },
  { id: 'events', name: 'SeekerEvents', label: 'Events', path: '/seeker/events', icon: Calendar },
  { id: 'support', name: 'SeekerSupport', label: 'Helpdesk', path: '/seeker/support', icon: MessageSquare },
  { id: 'profile', name: 'SeekerProfile', label: 'Profile', path: '/seeker/profile', icon: User },
];

/**
 * Mobile Bottom Navigation Bar:
 * Replicates the exact 6-tab SeekerTabNavigator from the HRSJM React Native APK:
 * - Home (House)
 * - My Aid (FileText)
 * - Rights (Scale)
 * - Events (Calendar)
 * - Helpdesk (MessageSquare)
 * - Profile (User)
 *
 * Active color: #E9B82E (Gold), inactive color: #718096, active label: #06294D
 */
export const SeekerBottomNav: React.FC = () => {
  const location = useLocation();

  const isTabActive = (path: string) => {
    if (path === '/seeker/home') {
      return location.pathname === '/seeker/home' || location.pathname === '/seeker';
    }
    if (path === '/seeker/profile') {
      return (
        location.pathname === '/seeker/profile' ||
        location.pathname === '/seeker/profile/id-card' ||
        location.pathname === '/seeker/id-card'
      );
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#DBE5EE] shadow-lg px-1.5 py-1.5 flex items-center justify-around select-none"
      role="navigation"
      aria-label="Seeker Bottom Navigation"
    >
      {SEEKER_BOTTOM_TABS.map((tab) => {
        const IconComponent = tab.icon;
        const active = isTabActive(tab.path);

        return (
          <NavLink
            key={tab.id}
            to={tab.path}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              active ? 'text-[#E9B82E]' : 'text-[#718096] hover:text-[#06294D]'
            }`}
            aria-label={tab.label}
            aria-current={active ? 'page' : undefined}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <IconComponent
                size={21}
                strokeWidth={active ? 2.3 : 1.8}
                color={active ? '#E9B82E' : '#718096'}
              />
            </div>
            <span
              className={`text-[10.5px] font-bold mt-0.5 tracking-tight ${
                active ? 'text-[#06294D]' : 'text-[#718096]'
              }`}
            >
              {tab.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
};

