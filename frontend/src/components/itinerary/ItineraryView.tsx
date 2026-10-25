import React, { useState } from 'react';
import { CalendarDays, Clock, Map, Sparkles, Filter } from 'lucide-react';
import { FullItinerary, Activity, Recommendation } from '../../types/itinerary';
import { DayCard } from './DayCard';
import { Timeline } from './Timeline';
import { TravelMap } from '../map/TravelMap';
import { HotelCard } from './HotelCard';
import { RestaurantCard } from './RestaurantCard';
import { Button } from '../common/Button';

interface ItineraryViewProps {
  itinerary: FullItinerary;
  recommendations: Recommendation[];
  currency?: string;
  onRegenerateDay: (dayNumber: number, override: string) => Promise<void>;
  onAddActivity: (dayId: string, activity: Partial<Activity>) => Promise<void>;
  onUpdateActivity: (activityId: string, updates: Partial<Activity>) => Promise<void>;
  onDeleteActivity: (activityId: string) => Promise<void>;
  onFilterRecommendations?: (category: string) => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary,
  recommendations,
  currency = 'USD',
  onRegenerateDay,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
}) => {
  const [activeTab, setActiveTab] = useState<'days' | 'timeline' | 'map' | 'recommendations'>('days');
  const [selectedRecCategory, setSelectedRecCategory] = useState<string>('All');

  // Collect all activities for map view
  const allActivities = itinerary.days.flatMap((d) => d.activities);

  const categories = ['All', 'Attractions', 'Restaurants', 'Hotels', 'Transportation', 'Experiences'];

  const filteredRecs =
    selectedRecCategory === 'All'
      ? recommendations
      : recommendations.filter((r) => r.category.toLowerCase() === selectedRecCategory.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Navigation View Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80">
          <button
            onClick={() => setActiveTab('days')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'days'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Day-by-Day</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'map'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Map View</span>
          </button>

          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'recommendations'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Curated Gems</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          {itinerary.days.length} Days Planned • {allActivities.length} Stops Total
        </div>
      </div>

      {/* Tab: Day-by-Day */}
      {activeTab === 'days' && (
        <div className="space-y-6">
          {itinerary.days.map((day) => (
            <DayCard
              key={day.day_number}
              day={day}
              currency={currency}
              onRegenerateDay={onRegenerateDay}
              onAddActivity={onAddActivity}
              onUpdateActivity={onUpdateActivity}
              onDeleteActivity={onDeleteActivity}
            />
          ))}
        </div>
      )}

      {/* Tab: Timeline */}
      {activeTab === 'timeline' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <Timeline itinerary={itinerary} currency={currency} />
        </div>
      )}

      {/* Tab: Map View */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <TravelMap activities={allActivities} destinationName={itinerary.destination} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {allActivities.map((act, i) => (
              <div
                key={act.id || i}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between"
              >
                <div className="truncate">
                  <span className="font-bold text-brand-600 dark:text-brand-400 mr-1.5">
                    #{i + 1}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {act.title}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 ml-2">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Curated Recommendations */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedRecCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  selectedRecCategory === cat
                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRecs.map((rec, rIdx) => (
              <HotelCard key={rec.id || rIdx} item={rec} currency={currency} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
