import React, { useState } from 'react';
import { PlusCircle, Sparkles, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { QuickActions } from '../components/dashboard/QuickActions';
import { UpcomingTrips } from '../components/dashboard/UpcomingTrips';
import { RecentTrips } from '../components/dashboard/RecentTrips';
import { Loader } from '../components/common/Loader';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useTrips } from '../hooks/useTrips';
import { Trip } from '../types/trip';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { trips, upcomingTrips, pastTrips, totalSpending, isLoading, error, refreshTrips, deleteTrip } =
    useTrips();

  const [tripToDelete, setTripToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const uniqueDestinations = new Set(trips.map((t: Trip) => t.destination.toLowerCase())).size;

  const handleDeleteConfirm = async () => {
    if (!tripToDelete) return;
    setIsDeleting(true);
    try {
      await deleteTrip(tripToDelete);
      setTripToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Personalized Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Welcome back, {user?.full_name?.split(' ')[0] || 'Traveler'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Here is an overview of your planned itineraries, travel spending, and upcoming adventures.
            </p>
          </div>

          <Button
            size="md"
            variant="primary"
            onClick={() => navigate('/trips/create')}
            leftIcon={<PlusCircle className="w-4 h-4" />}
            className="shadow-md shadow-brand-500/20 shrink-0"
          >
            Create New Trip
          </Button>
        </div>

        {/* Loading / Error States */}
        {isLoading && trips.length === 0 && <Loader message="Fetching your journeys..." />}
        {error && <ErrorMessage message={error} onRetry={refreshTrips} />}

        {/* Stats Grid */}
        <DashboardStats
          totalTrips={trips.length}
          upcomingTripsCount={upcomingTrips.length}
          totalSpending={totalSpending}
          destinationsCount={uniqueDestinations}
        />

        {/* Quick Actions Bar */}
        <QuickActions />

        {/* Upcoming Trips */}
        <UpcomingTrips trips={upcomingTrips} onDelete={(id) => setTripToDelete(id)} />

        {/* Past Trips */}
        <RecentTrips trips={pastTrips} onDelete={(id) => setTripToDelete(id)} />
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!tripToDelete}
        title="Delete Travel Itinerary"
        message="Are you sure you want to permanently delete this trip and its generated itinerary? This action cannot be undone."
        confirmLabel="Delete Trip"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setTripToDelete(null)}
      />
    </DashboardLayout>
  );
};
