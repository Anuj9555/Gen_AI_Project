import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, ArrowRight, Trash2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Trip } from '../../types/trip';
import { formatDate } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/currencyUtils';

interface TripCardProps {
  trip: Trip;
  onDelete?: (tripId: string) => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onDelete }) => {
  const isReady = trip.status === 'itinerary_ready' || (trip.total_estimated_cost && trip.total_estimated_cost > 0);

  return (
    <div className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
      {/* Top Banner Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-teal-400 opacity-80" />

      <div>
        {/* Status & Style Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {trip.travel_style} • {trip.pace}
          </span>
          {isReady ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3 h-3" /> Ready
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <Sparkles className="w-3 h-3" /> Needs AI Itinerary
            </span>
          )}
        </div>

        {/* Title & Destination */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
          {trip.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
          <span className="truncate">{trip.destination}</span>
        </p>

        {/* Metadata Details */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDate(trip.start_date)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{trip.group_size} {trip.group_size === 1 ? 'traveler' : 'travelers'}</span>
          </div>
        </div>

        {/* Budget vs Est Cost */}
        <div className="mt-3 flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-500">
            Budget: {formatCurrency(trip.budget, trip.currency)}
          </span>
          {trip.total_estimated_cost ? (
            <span className="text-emerald-600 dark:text-emerald-400">
              Est: {formatCurrency(trip.total_estimated_cost, trip.currency)}
            </span>
          ) : null}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <Link
          to={`/trips/${trip.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500 transition-colors"
        >
          <span>View Itinerary</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>

        {onDelete && (
          <button
            onClick={() => onDelete(trip.id)}
            title="Delete Trip"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
