import React from 'react';
import { Home, Star, MapPin } from 'lucide-react';
import { Recommendation } from '../../types/itinerary';
import { formatCurrency } from '../../utils/currencyUtils';

export const HotelCard: React.FC<{ item: Recommendation; currency?: string }> = ({
  item,
  currency = 'USD',
}) => {
  return (
    <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
            <Home className="w-3 h-3" /> Stay Recommendation
          </span>
          <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {item.rating}
          </span>
        </div>
        <h5 className="text-sm font-bold text-slate-900 dark:text-white">
          {item.name}
        </h5>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
          {item.description}
        </p>
        <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-slate-400" />
          {item.location}
        </div>
        <p className="text-[11px] text-brand-600 dark:text-brand-400 font-medium mt-1">
          Why: {item.reason}
        </p>
      </div>
      <div className="text-right shrink-0">
        <span className="text-xs text-slate-400 block">from</span>
        <span className="text-sm font-extrabold text-slate-900 dark:text-white">
          {formatCurrency(item.estimated_cost, currency)}
        </span>
        <span className="text-[10px] text-slate-400 block">/ night</span>
      </div>
    </div>
  );
};
