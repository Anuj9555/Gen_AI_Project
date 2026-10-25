import React from 'react';
import { Compass, Calendar, DollarSign, MapPin } from 'lucide-react';
import { formatCurrency } from '../../utils/currencyUtils';

interface DashboardStatsProps {
  totalTrips: number;
  upcomingTripsCount: number;
  totalSpending: number;
  destinationsCount: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalTrips,
  upcomingTripsCount,
  totalSpending,
  destinationsCount,
}) => {
  const stats = [
    {
      label: 'Total Trips Created',
      value: totalTrips,
      icon: Compass,
      color: 'text-brand-600 bg-brand-50 dark:bg-brand-950/60 dark:text-brand-400',
    },
    {
      label: 'Upcoming Journeys',
      value: upcomingTripsCount,
      icon: Calendar,
      color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/60 dark:text-sky-400',
    },
    {
      label: 'Unique Destinations',
      value: destinationsCount,
      icon: MapPin,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400',
    },
    {
      label: 'Estimated Spending',
      value: formatCurrency(totalSpending),
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-all hover:shadow-md"
          >
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                {stat.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};
