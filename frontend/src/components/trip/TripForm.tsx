import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Compass,
  Sparkles,
  Heart,
  Check,
  Clock,
  Home,
  Car,
  Utensils,
  FileText,
} from 'lucide-react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { tripFormSchema, TripFormData } from '../../utils/validation';
import { TripCreateInput } from '../../types/trip';

const TRAVEL_STYLES = [
  'Budget',
  'Balanced',
  'Luxury',
  'Adventure',
  'Relaxed',
  'Cultural',
  'Romantic',
  'Family',
];

const PACE_OPTIONS = ['Relaxed', 'Balanced', 'Packed'];

const INTERESTS_OPTIONS = [
  'Sightseeing',
  'Food',
  'Nature',
  'Adventure',
  'Culture',
  'History',
  'Shopping',
  'Nightlife',
  'Photography',
  'Beaches',
  'Museums',
  'Local experiences',
];

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'JPY', label: 'JPY (¥)' },
  { value: 'CAD', label: 'CAD ($)' },
  { value: 'AUD', label: 'AUD ($)' },
];

interface TripFormProps {
  onSubmit: (data: TripCreateInput) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<TripCreateInput>;
}

export const TripForm: React.FC<TripFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData,
}) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    initialData?.interests || ['Sightseeing', 'Food', 'Culture']
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      destination: initialData?.destination || '',
      start_date: initialData?.start_date || new Date().toISOString().split('T')[0],
      end_date:
        initialData?.end_date ||
        new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      budget: initialData?.budget || 1500,
      currency: initialData?.currency || 'USD',
      group_size: initialData?.group_size || 1,
      travel_style: initialData?.travel_style || 'Balanced',
      pace: initialData?.pace || 'Balanced',
      interests: selectedInterests,
      accommodation_preference: initialData?.accommodation_preference || 'Boutique Hotel',
      transportation_preference:
        initialData?.transportation_preference || 'Public Transit & Walking',
      food_preference: initialData?.food_preference || 'Local specialties & casual dining',
      special_requirements: initialData?.special_requirements || '',
    },
  });

  const currentStyle = watch('travel_style');
  const currentPace = watch('pace');

  const toggleInterest = (interest: string) => {
    let updated: string[];
    if (selectedInterests.includes(interest)) {
      updated = selectedInterests.filter((i) => i !== interest);
    } else {
      updated = [...selectedInterests, interest];
    }
    setSelectedInterests(updated);
    setValue('interests', updated, { shouldValidate: true });
  };

  const handleFormSubmit = async (data: TripFormData) => {
    await onSubmit({
      ...data,
      interests: selectedInterests,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Basic Trip Details */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          Trip Details & Destination
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Trip Title"
            placeholder="e.g. Kyoto Cherry Blossom Adventure"
            error={errors.title?.message}
            {...register('title')}
          />
          <Input
            label="Destination (City, Country)"
            placeholder="e.g. Kyoto, Japan or Paris, France"
            leftIcon={<MapPin className="w-4 h-4" />}
            error={errors.destination?.message}
            {...register('destination')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Input
            label="Start Date"
            type="date"
            leftIcon={<Calendar className="w-4 h-4" />}
            error={errors.start_date?.message}
            {...register('start_date')}
          />
          <Input
            label="End Date"
            type="date"
            leftIcon={<Calendar className="w-4 h-4" />}
            error={errors.end_date?.message}
            {...register('end_date')}
          />
          <Input
            label="Total Trip Budget"
            type="number"
            step="50"
            min="100"
            leftIcon={<DollarSign className="w-4 h-4" />}
            error={errors.budget?.message}
            {...register('budget')}
          />
          <Select
            label="Currency"
            options={CURRENCIES}
            error={errors.currency?.message}
            {...register('currency')}
          />
        </div>

        <div className="max-w-xs">
          <Input
            label="Travelers / Group Size"
            type="number"
            min="1"
            max="30"
            leftIcon={<Users className="w-4 h-4" />}
            error={errors.group_size?.message}
            {...register('group_size')}
          />
        </div>
      </div>

      {/* Travel Style & Pace */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
            <Heart className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            Travel Style
          </h3>
          <p className="text-xs text-slate-500">
            Choose what best describes the mood and standard of your vacation.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
            {TRAVEL_STYLES.map((style) => {
              const isSelected = currentStyle === style;
              return (
                <button
                  type="button"
                  key={style}
                  onClick={() => setValue('travel_style', style)}
                  className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50 text-brand-800 dark:bg-brand-950/60 dark:text-brand-300 ring-2 ring-brand-500/20'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  <span>{style}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pace */}
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            Desired Trip Pace
          </h3>
          <p className="text-xs text-slate-500">
            How full would you like each day's schedule to be?
          </p>
          <div className="grid grid-cols-3 gap-3 mt-3">
            {PACE_OPTIONS.map((pace) => {
              const isSelected = currentPace === pace;
              const descriptions: Record<string, string> = {
                Relaxed: '1-2 highlights/day, late starts, ample cafe time',
                Balanced: '3 activities/day, great flow with free evenings',
                Packed: 'Full day sightseeing, early departures, maximum sights',
              };
              return (
                <button
                  type="button"
                  key={pace}
                  onClick={() => setValue('pace', pace)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/60 ring-2 ring-brand-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {pace}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-brand-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    {descriptions[pace]}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interests Selection */}
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Interests & Highlights
          </h3>
          <p className="text-xs text-slate-500">
            Select the themes and activities you enjoy most (select at least one).
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {INTERESTS_OPTIONS.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  <span>{interest}</span>
                </button>
              );
            })}
          </div>
          {errors.interests && (
            <p className="text-xs text-rose-500 font-medium mt-1.5">
              {errors.interests.message}
            </p>
          )}
        </div>
      </div>

      {/* Preferences & Logistics */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          Lodging, Transit & Food Preferences
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Accommodation Preference"
            placeholder="e.g. Boutique Hotel, Airbnb, Resort"
            leftIcon={<Home className="w-4 h-4" />}
            {...register('accommodation_preference')}
          />
          <Input
            label="Transportation Preference"
            placeholder="e.g. Public Transit, Rental Car, Walking"
            leftIcon={<Car className="w-4 h-4" />}
            {...register('transportation_preference')}
          />
          <Input
            label="Food Preference"
            placeholder="e.g. Local Street Food, Vegan, Michelin"
            leftIcon={<Utensils className="w-4 h-4" />}
            {...register('food_preference')}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
            Special Requirements / Notes
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Traveling with an infant, need wheelchair accessible spots, prefer avoiding steep stairs..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm p-3.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            {...register('special_requirements')}
          />
        </div>
      </div>

      {/* Submit Action */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          leftIcon={<Sparkles className="w-5 h-5" />}
          className="w-full sm:w-auto px-8"
        >
          Create Trip & Generate AI Itinerary
        </Button>
      </div>
    </form>
  );
};
