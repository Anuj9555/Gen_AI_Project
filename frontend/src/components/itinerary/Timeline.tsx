import React from 'react';
import { Clock, MapPin, DollarSign, Calendar } from 'lucide-react';
import { FullItinerary } from '../../types/itinerary';
import { formatDate } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/currencyUtils';

interface TimelineProps {
  itinerary: FullItinerary;
  currency?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ itinerary, currency = 'USD' }) => {
  return (
    <div className="space-y-8">
      {itinerary.days.map((day) => (
        <div key={day.day_number} className="relative">
          {/* Day Milestone */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-brand-500/20">
              D{day.day_number}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {day.summary}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(day.date)} • Day Total: {formatCurrency(day.estimated_daily_cost, currency)}
              </p>
            </div>
          </div>

          {/* Timeline track */}
          <div className="relative pl-6 ml-5 border-l-2 border-slate-200 dark:border-slate-800 space-y-6">
            {day.activities.map((act, idx) => (
              <div key={act.id || idx} className="relative group">
                {/* Node pin */}
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-brand-500 bg-white dark:bg-slate-900 group-hover:scale-125 transition-transform" />

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span className="flex items-center gap-1 text-brand-600 dark:text-brand-400 font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      {act.time}
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">
                      {act.estimated_cost === 0 ? 'Free' : formatCurrency(act.estimated_cost, currency)}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {act.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {act.description}
                  </p>

                  <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {act.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
