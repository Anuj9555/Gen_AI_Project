import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { TripHeader } from '../components/trip/TripHeader';
import { TripSummary } from '../components/trip/TripSummary';
import { TripPreferences } from '../components/trip/TripPreferences';
import { TripActions } from '../components/trip/TripActions';
import { ItineraryView } from '../components/itinerary/ItineraryView';
import { Loader } from '../components/common/Loader';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Button } from '../components/common/Button';
import { useItinerary } from '../hooks/useItinerary';
import { useTripStore } from '../store/tripStore';

export const TripDetailsPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const {
    trip,
    itinerary,
    recommendations,
    isLoading,
    isGenerating,
    error,
    generateItinerary,
    regenerateDay,
    addActivity,
    updateActivity,
    deleteActivity,
  } = useItinerary(tripId);

  const { deleteTrip } = useTripStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteTrip = async () => {
    if (!tripId) return;
    setIsDeleting(true);
    try {
      await deleteTrip(tripId);
      navigate('/dashboard');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && !trip) {
    return (
      <DashboardLayout>
        <Loader fullScreen message="Loading trip details and itinerary..." />
      </DashboardLayout>
    );
  }

  if (error && !trip) {
    return (
      <DashboardLayout>
        <div className="max-w-xl mx-auto py-12 text-center space-y-4">
          <ErrorMessage message={error} />
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (!trip) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-sm text-slate-500">Trip not found.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {/* Header Hero Banner */}
        <TripHeader
          trip={trip}
          isGenerating={isGenerating}
          onGenerateAI={generateItinerary}
          onShare={() => {}}
        />

        {/* If no itinerary exists yet, prompt user to generate one */}
        {!itinerary && (
          <div className="p-8 rounded-3xl border border-dashed border-brand-300 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-950/20 text-center space-y-3">
            <Sparkles className="w-10 h-10 text-brand-600 dark:text-brand-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Itinerary Not Generated Yet
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Ready to explore {trip.destination}? Click below to let WanderAI craft your complete day-by-day plan.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                isLoading={isGenerating}
                onClick={generateItinerary}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Generate Custom Itinerary Now
              </Button>
            </div>
          </div>
        )}

        {/* If itinerary is being regenerated */}
        {isGenerating && (
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <Loader message="WanderAI is synthesizing your tailored itinerary stops..." />
          </div>
        )}

        {/* If itinerary exists, show Summary, ItineraryView, Preferences & Actions */}
        {itinerary && (
          <>
            <TripSummary trip={trip} itinerary={itinerary} />

            <ItineraryView
              itinerary={itinerary}
              recommendations={recommendations}
              currency={trip.currency}
              onRegenerateDay={regenerateDay}
              onAddActivity={addActivity}
              onUpdateActivity={updateActivity}
              onDeleteActivity={deleteActivity}
            />

            <TripPreferences trip={trip} />

            <TripActions tripId={trip.id} onDelete={() => setDeleteDialogOpen(true)} />
          </>
        )}
      </div>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Trip"
        message="Are you sure you want to delete this trip permanently?"
        confirmLabel="Delete Trip"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleDeleteTrip}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </DashboardLayout>
  );
};
