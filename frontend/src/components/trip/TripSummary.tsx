import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { DollarSign, AlertCircle, Info, Sparkles, CheckCircle2 } from 'lucide-react';
import { Trip } from '../../types/trip';
import { FullItinerary } from '../../types/itinerary';
import { formatCurrency } from '../../utils/currencyUtils';

interface TripSummaryProps {
  trip: Trip;
  itinerary: FullItinerary | null;
}

const COLORS = ['#0d9488', '#38bdf8', '#f59e0b', '#ec4899'];

export const TripSummary: React.FC<TripSummaryProps> = ({ trip, itinerary }) => {
  const totalCost = itinerary?.total_estimated_cost || trip.total_estimated_cost || 0;
  const budget = trip.budget;
  const isOverBudget = totalCost > budget;

  // Calculate rough distribution for chart
  const estimatedActivities = Math.round(totalCost * 0.35);
  const estimatedFood = Math.round(totalCost * 0.35);
  const estimatedStay = Math.round(totalCost * 0.20);
  const estimatedTransport = Math.round(totalCost * 0.10);

  const chartData = [
    { name: 'Activities & Tours', value: estimatedActivities },
    { name: 'Dining & Cafes', value: estimatedFood },
    { name: 'Lodging & Stays', value: estimatedStay },
    { name: 'Transit & Local Rail', value: estimatedTransport },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Trip Story & Overview */}
      <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Trip Overview
            </h3>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {itinerary?.trip_summary ||
              `A customized ${trip.travel_style.toLowerCase()} travel plan for ${trip.destination}, carefully tuned to a ${trip.pace.toLowerCase()} pace.`}
          </p>

          {/* Travel Tips List */}
          {itinerary?.travel_tips && itinerary.travel_tips.length > 0 && (
            <div className="mt-5 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Curator Travel Tips
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {itinerary.travel_tips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Interests Badges */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-400 mr-2">Interests:</span>
          {trip.interests.map((interest) => (
            <span
              key={interest}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Budget Breakdown & Recharts Visualization */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              Budget Estimation
            </h3>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isOverBudget
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              }`}
            >
              {isOverBudget ? 'Over Budget' : 'On Track'}
            </span>
          </div>

          <div className="space-y-1 mb-4">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {formatCurrency(totalCost, trip.currency)}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                allocated of {formatCurrency(budget, trip.currency)}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (totalCost / budget) * 100)}%` }}
              />
            </div>
          </div>

          {/* Interactive Recharts Pie Chart */}
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={60}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [formatCurrency(val, trip.currency), 'Estimated']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 mt-2">
          {chartData.map((d, i) => (
            <div key={d.name} className="flex items-center gap-1.5 truncate">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[i] }}
              />
              <span className="truncate">{d.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
