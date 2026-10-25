import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { TripForm } from '../components/trip/TripForm';
import { Loader } from '../components/common/Loader';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { useTripStore } from '../store/tripStore';
import { TripCreateInput } from '../types/trip';

export const CreateTripPage: React.FC = () => {
  const navigate = useNavigate();
  const { createTrip, generateItinerary } = useTripStore();
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: TripCreateInput) => {
    setError(null);
    setLoading(true);
    try {
      setLoadingStep('Saving your vacation preferences...');
      const newTrip = await createTrip(data);

      setLoadingStep(`AI is orchestrating your custom day-by-day itinerary for ${newTrip.destination}...`);
      await generateItinerary(newTrip.id);

      navigate(`/trips/${newTrip.id}`);
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message ||
          err.message ||
          'Failed to build trip. Please check details and try again.'
      );
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Itinerary Architect</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Plan a Personalized Vacation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fill in your trip criteria below. WanderAI will calculate geographically clustered stops,
            budget estimates, restaurant gems, and day plans.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        {loading ? (
          <div className="p-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <Loader message={loadingStep} />
          </div>
        ) : (
          <TripForm onSubmit={handleSubmit} isLoading={loading} />
        )}
      </div>
    </DashboardLayout>
  );
};
