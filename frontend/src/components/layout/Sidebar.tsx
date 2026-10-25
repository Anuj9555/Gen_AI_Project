import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Compass, Settings, User, Map, Sparkles } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/trips/create', label: 'Create Trip', icon: PlusCircle },
    { to: '/profile', label: 'Preferences', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1 mb-8">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
          Navigation
        </p>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 text-current" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* AI Inspiration Card */}
      <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-brand-600 to-teal-700 text-white shadow-md shadow-brand-900/10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-bold uppercase tracking-wider text-brand-100">
            Smart Generator
          </span>
        </div>
        <p className="text-xs text-brand-50/90 leading-relaxed mb-3">
          Our AI synthesizes thousands of local guides into zero-stress, optimized day itineraries.
        </p>
        <div className="text-[11px] font-medium text-brand-200">
          Powered by WanderAI Core
        </div>
      </div>
    </aside>
  );
};
