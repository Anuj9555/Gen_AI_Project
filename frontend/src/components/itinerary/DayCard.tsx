import React, { useState } from 'react';
import { Calendar, RefreshCw, Plus, Utensils, Bus } from 'lucide-react';
import { DayItinerary, Activity } from '../../types/itinerary';
import { ActivityCard } from './ActivityCard';
import { RestaurantCard } from './RestaurantCard';
import { TransportCard } from './TransportCard';
import { RegenerateDay } from './RegenerateDay';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { formatDate } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/currencyUtils';

interface DayCardProps {
  day: DayItinerary;
  currency?: string;
  onRegenerateDay: (dayNumber: number, override: string) => Promise<void>;
  onAddActivity: (dayId: string, activity: Partial<Activity>) => Promise<void>;
  onUpdateActivity: (activityId: string, updates: Partial<Activity>) => Promise<void>;
  onDeleteActivity: (activityId: string) => Promise<void>;
}

export const DayCard: React.FC<DayCardProps> = ({
  day,
  currency = 'USD',
  onRegenerateDay,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
}) => {
  const [regenModalOpen, setRegenModalOpen] = useState(false);
  const [addActModalOpen, setAddActModalOpen] = useState(false);

  // New activity form state
  const [actTitle, setActTitle] = useState('');
  const [actTime, setActTime] = useState('02:00 PM');
  const [actLoc, setActLoc] = useState('');
  const [actDesc, setActDesc] = useState('');
  const [actCost, setActCost] = useState(20);
  const [actType, setActType] = useState('sightseeing');
  const [adding, setAdding] = useState(false);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!day.id || !actTitle) return;
    setAdding(true);
    try {
      await onAddActivity(day.id, {
        title: actTitle,
        time: actTime,
        location: actLoc || 'City Center',
        description: actDesc || 'Custom self-planned visit',
        estimated_cost: Number(actCost),
        duration_minutes: 90,
        activity_type: actType,
      });
      setAddActModalOpen(false);
      setActTitle('');
      setActDesc('');
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden mb-6">
        {/* Day Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-lg bg-brand-600 text-white font-extrabold text-xs tracking-wider uppercase">
                Day {day.day_number}
              </span>
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(day.date)}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {day.summary}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              Day Est: {formatCurrency(day.estimated_daily_cost, currency)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddActModalOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Activity
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRegenModalOpen(true)}
              leftIcon={<RefreshCw className="w-3.5 h-3.5 text-brand-600" />}
            >
              Regenerate Day
            </Button>
          </div>
        </div>

        {/* Day Activities List */}
        <div className="p-5 space-y-3">
          <div className="space-y-3">
            {day.activities.map((act, idx) => (
              <ActivityCard
                key={act.id || idx}
                activity={act}
                currency={currency}
                onUpdate={onUpdateActivity}
                onDelete={onDeleteActivity}
              />
            ))}
          </div>

          {/* Dining Recommendations */}
          {day.food_recommendations && day.food_recommendations.length > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-amber-500" />
                Recommended Dining for Day {day.day_number}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {day.food_recommendations.map((food, fIdx) => (
                  <RestaurantCard key={fIdx} item={food} currency={currency} />
                ))}
              </div>
            </div>
          )}

          {/* Transit options */}
          {day.transportation && day.transportation.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Bus className="w-3.5 h-3.5 text-sky-500" />
                Transit & Route Advice
              </h4>
              <div className="space-y-2">
                {day.transportation.map((trans, tIdx) => (
                  <TransportCard key={tIdx} item={trans} currency={currency} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Regenerate Day Modal */}
      <RegenerateDay
        isOpen={regenModalOpen}
        onClose={() => setRegenModalOpen(false)}
        dayNumber={day.day_number}
        date={formatDate(day.date)}
        onConfirmRegenerate={(override) => onRegenerateDay(day.day_number, override)}
      />

      {/* Add Custom Activity Modal */}
      <Modal
        isOpen={addActModalOpen}
        onClose={() => setAddActModalOpen(false)}
        title={`Add Custom Activity to Day ${day.day_number}`}
        description="Insert an extra spot, museum, or stop into your timeline."
      >
        <form onSubmit={handleAddSubmit} className="space-y-3.5">
          <Input
            label="Activity Title"
            placeholder="e.g. Afternoon Tea at Le Salon"
            value={actTitle}
            onChange={(e) => setActTitle(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Scheduled Time"
              placeholder="e.g. 03:00 PM"
              value={actTime}
              onChange={(e) => setActTime(e.target.value)}
            />
            <Input
              label="Estimated Cost"
              type="number"
              value={actCost}
              onChange={(e) => setActCost(Number(e.target.value))}
            />
          </div>
          <Input
            label="Location"
            placeholder="e.g. 12 Rue de Rivoli"
            value={actLoc}
            onChange={(e) => setActLoc(e.target.value)}
          />
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Description
            </label>
            <textarea
              rows={2}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs p-3"
              placeholder="Brief details about what to do here..."
              value={actDesc}
              onChange={(e) => setActDesc(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAddActModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={adding}>
              Add Activity
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
