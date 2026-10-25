import React from 'react';
import { PlusCircle, Compass, Sparkles, Map, Sliders } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Plan New Trip',
      desc: 'Let AI craft your custom itinerary',
      icon: PlusCircle,
      onClick: () => navigate('/trips/create'),
      color: 'bg-brand-500 text-white',
    },
    {
      title: 'Explore Destinations',
      desc: 'Browse trending spots and travel styles',
      icon: Compass,
      onClick: () => navigate('/trips/create'),
      color: 'bg-indigo-500 text-white',
    },
    {
      title: 'Travel Preferences',
      desc: 'Tune your budget & style presets',
      icon: Sliders,
      onClick: () => navigate('/profile'),
      color: 'bg-emerald-500 text-white',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <button
            key={act.title}
            onClick={act.onClick}
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-brand-300 dark:hover:border-brand-700 transition-all text-left group"
          >
            <div className={`p-3 rounded-xl ${act.color} shadow-sm group-hover:scale-105 transition-transform`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {act.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {act.desc}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
