import React from 'react';
import { Home, Car, Utensils, FileText, CheckCircle2 } from 'lucide-react';
import { Trip } from '../../types/trip';

interface TripPreferencesProps {
  trip: Trip;
}

export const TripPreferences: React.FC<TripPreferencesProps> = ({ trip }) => {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
        Logistics & Preferences
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <Home className="w-4 h-4 text-brand-500" />
            <span className="text-xs font-semibold">Accommodation</span>
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {trip.accommodation_preference || 'Standard Hotel / Boutique'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <Car className="w-4 h-4 text-sky-500" />
            <span className="text-xs font-semibold">Transportation</span>
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {trip.transportation_preference || 'Public Transit & Walking'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <Utensils className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold">Dining Style</span>
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {trip.food_preference || 'Local specialties & casual cafes'}
          </p>
        </div>
      </div>

      {trip.special_requirements && (
        <div className="mt-4 p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300">
          <span className="font-bold block mb-1">Special Requirements & Accessibility Notes:</span>
          <p className="leading-relaxed">{trip.special_requirements}</p>
        </div>
      )}
    </div>
  );
};
