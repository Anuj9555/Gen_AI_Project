import React from 'react';
import { Compass, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-base font-bold text-slate-900 dark:text-white">
              WanderAI
            </span>
            <span className="text-xs text-slate-400">
              © {new Date().getFullYear()} All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <Link to="/dashboard" className="hover:text-brand-600 dark:hover:text-brand-400">
              Dashboard
            </Link>
            <Link to="/trips/create" className="hover:text-brand-600 dark:hover:text-brand-400">
              Trip Builder
            </Link>
            <Link to="/profile" className="hover:text-brand-600 dark:hover:text-brand-400">
              Preferences
            </Link>
            <Link to="/settings" className="hover:text-brand-600 dark:hover:text-brand-400">
              Settings
            </Link>
          </div>

          <p className="text-xs text-slate-400 flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for globetrotters
          </p>
        </div>
      </div>
    </footer>
  );
};
