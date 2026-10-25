import React from 'react';
import { Bus, MapPin } from 'lucide-react';
import { TransportOption } from '../../types/itinerary';
import { formatCurrency } from '../../utils/currencyUtils';

export const TransportCard: React.FC<{ item: TransportOption; currency?: string }> = ({
  item,
  currency = 'USD',
}) => {
  return (
    <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
          <Bus className="w-4 h-4" />
        </div>
        <div>
          <h5 className="text-xs font-bold text-slate-900 dark:text-white">{item.mode}</h5>
          <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
        </div>
      </div>
      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
        ~{formatCurrency(item.estimated_cost, currency)}
      </span>
    </div>
  );
};
