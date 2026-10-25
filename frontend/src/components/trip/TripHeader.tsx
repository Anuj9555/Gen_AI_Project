import React from 'react';
import { MapPin, Calendar, Users, DollarSign, Sparkles, Share2 } from 'lucide-react';
import { Trip } from '../../types/trip';
import { formatDate } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/currencyUtils';
import { Button } from '../common/Button';

interface TripHeaderProps {
  trip: Trip;
  onGenerateAI?: () => void;
  onShare?: () => void;
  isGenerating?: boolean;
}

export const TripHeader: React.FC<TripHeaderProps> = ({
  trip,
  onGenerateAI,
  onShare,
  isGenerating = false,
}) => {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-navy-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
              {trip.travel_style} Pace
            </span>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 text-slate-200">
              {trip.pace} Schedule
            </span>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 text-slate-200">
              {trip.group_size} {trip.group_size === 1 ? 'Traveler' : 'Travelers'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {trip.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-400" />
              <span>{trip.destination}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>
                {formatDate(trip.start_date)} — {formatDate(trip.end_date)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Budget: {formatCurrency(trip.budget, trip.currency)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {onShare && (
            <Button
              variant="outline"
              size="md"
              onClick={onShare}
              leftIcon={<Share2 className="w-4 h-4" />}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Share Trip
            </Button>
          )}

          {onGenerateAI && (
            <Button
              variant="primary"
              size="md"
              isLoading={isGenerating}
              onClick={onGenerateAI}
              leftIcon={<Sparkles className="w-4 h-4" />}
              className="shadow-lg shadow-brand-500/30"
            >
              Regenerate Full Itinerary
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
