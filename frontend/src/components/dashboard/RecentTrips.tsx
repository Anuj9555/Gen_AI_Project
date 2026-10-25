import React from 'react';
import { History } from 'lucide-react';
import { Trip } from '../../types/trip';
import { TripCard } from '../trip/TripCard';

interface RecentTripsProps {
  trips: Trip[];
  onDelete?: (tripId: string) => void;
}

export const RecentTrips: React.FC<RecentTripsProps> = ({ trips, onDelete }) => {
  if (trips.length === 0) return null;

  return (
    <section className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-slate-500" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Past Trips & Archive
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} onDelete={onDelete} />
        ))}
      </div>
    </section>
  );
};
