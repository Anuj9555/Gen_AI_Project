import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Trip } from '../../types/trip';
import { TripCard } from '../trip/TripCard';
import { Button } from '../common/Button';

interface UpcomingTripsProps {
  trips: Trip[];
  onDelete?: (tripId: string) => void;
}

export const UpcomingTrips: React.FC<UpcomingTripsProps> = ({ trips, onDelete }) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Upcoming Journeys
          </h2>
        </div>
        <Link
          to="/trips/create"
          className="text-xs font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400 inline-flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Plan Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
          <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No upcoming trips planned yet
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Ready for your next adventure? Let WanderAI craft your custom itinerary in seconds.
          </p>
          <div className="mt-4">
            <Link to="/trips/create">
              <Button size="sm" variant="primary">
                Create First Trip
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onDelete={onDelete} />
          ))}
        </div>
      )}
    </section>
  );
};
