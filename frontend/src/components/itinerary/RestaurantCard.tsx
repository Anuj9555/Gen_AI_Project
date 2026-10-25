import React from 'react';
import { Utensils, MapPin, DollarSign } from 'lucide-react';
import { FoodRecommendation } from '../../types/itinerary';
import { formatCurrency } from '../../utils/currencyUtils';

export const RestaurantCard: React.FC<{ item: FoodRecommendation; currency?: string }> = ({
  item,
  currency = 'USD',
}) => {
  return (
    <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            {item.meal_type}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            {item.cuisine} • {item.price_level}
          </span>
        </div>
        <h5 className="text-xs font-bold text-slate-900 dark:text-white">
          {item.name}
        </h5>
        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
          {item.description}
        </p>
        <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-slate-400" />
          {item.location}
        </span>
      </div>
      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 shrink-0">
        ~{formatCurrency(item.estimated_cost, currency)}
      </span>
    </div>
  );
};
