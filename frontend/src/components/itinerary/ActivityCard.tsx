import React, { useState } from 'react';
import { Clock, MapPin, DollarSign, Edit3, Trash2, Check, X, Camera, Utensils, Landmark, TreePine, Wine } from 'lucide-react';
import { Activity } from '../../types/itinerary';
import { formatCurrency } from '../../utils/currencyUtils';
import { formatDuration } from '../../utils/formatters';

interface ActivityCardProps {
  activity: Activity;
  currency?: string;
  onUpdate?: (activityId: string, updates: Partial<Activity>) => Promise<void>;
  onDelete?: (activityId: string) => Promise<void>;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  currency = 'USD',
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(activity.title);
  const [time, setTime] = useState(activity.time);
  const [location, setLocation] = useState(activity.location);
  const [description, setDescription] = useState(activity.description);
  const [cost, setCost] = useState(activity.estimated_cost);
  const [duration, setDuration] = useState(activity.duration_minutes);
  const [saving, setSaving] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'food':
        return <Utensils className="w-3.5 h-3.5 text-amber-500" />;
      case 'culture':
      case 'museums':
        return <Landmark className="w-3.5 h-3.5 text-indigo-500" />;
      case 'nature':
        return <TreePine className="w-3.5 h-3.5 text-emerald-500" />;
      case 'nightlife':
        return <Wine className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return <Camera className="w-3.5 h-3.5 text-brand-500" />;
    }
  };

  const handleSave = async () => {
    if (!activity.id || !onUpdate) return;
    setSaving(true);
    try {
      await onUpdate(activity.id, {
        title,
        time,
        location,
        description,
        estimated_cost: Number(cost),
        duration_minutes: Number(duration),
      });
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="p-4 rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50/20 dark:bg-brand-950/20 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            className="text-xs p-2 rounded-lg border dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="Time (e.g. 10:00 AM)"
          />
          <input
            type="number"
            className="text-xs p-2 rounded-lg border dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
            placeholder="Cost"
          />
        </div>
        <input
          type="text"
          className="text-xs font-bold w-full p-2 rounded-lg border dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Activity Title"
        />
        <input
          type="text"
          className="text-xs w-full p-2 rounded-lg border dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
        />
        <textarea
          rows={2}
          className="text-xs w-full p-2 rounded-lg border dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsEditing(false)}
            className="px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-200 rounded-lg flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-3 py-1 text-xs bg-brand-600 text-white font-bold rounded-lg flex items-center gap-1 hover:bg-brand-500"
          >
            <Check className="w-3 h-3" /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:border-brand-200 dark:hover:border-brand-800 shadow-sm transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
            {activity.time}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 capitalize">
            {getTypeIcon(activity.activity_type)}
            {activity.activity_type}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
            {activity.estimated_cost === 0
              ? 'Free'
              : formatCurrency(activity.estimated_cost, currency)}
          </span>
          {onUpdate && (
            <button
              onClick={() => setIsEditing(true)}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-brand-600 transition-opacity"
              title="Edit Activity"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && activity.id && (
            <button
              onClick={() => onDelete(activity.id!)}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
              title="Delete Activity"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
        {activity.title}
      </h4>

      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
        {activity.description}
      </p>

      <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] text-slate-400 font-medium">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-slate-400" />
          {activity.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" />
          {formatDuration(activity.duration_minutes)}
        </span>
      </div>
    </div>
  );
};
