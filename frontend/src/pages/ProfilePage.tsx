import React, { useState } from 'react';
import { User, Mail, Sparkles, Check, DollarSign } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [defaultBudget, setDefaultBudget] = useState(
    user?.travel_preferences?.default_budget || 2000
  );
  const [preferredStyle, setPreferredStyle] = useState(
    user?.travel_preferences?.preferred_travel_style || 'Balanced'
  );
  const [preferredPace, setPreferredPace] = useState(
    user?.travel_preferences?.preferred_pace || 'Balanced'
  );
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        full_name: fullName,
        travel_preferences: {
          default_budget: Number(defaultBudget),
          preferred_travel_style: preferredStyle,
          preferred_pace: preferredPace,
        },
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Traveler Profile & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your personal profile and default AI itinerary preferences.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" />
            Profile and preferences updated successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Personal Info */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Account Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                required
              />
              <Input
                label="Email Address"
                value={user?.email || ''}
                disabled
                helperText="Email is bound to your authentication identity."
                leftIcon={<Mail className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Default Travel Presets */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Default Travel Preferences
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Default Trip Budget"
                type="number"
                value={defaultBudget}
                onChange={(e) => setDefaultBudget(Number(e.target.value))}
                leftIcon={<DollarSign className="w-4 h-4" />}
              />

              <Select
                label="Preferred Travel Style"
                value={preferredStyle}
                onChange={(e) => setPreferredStyle(e.target.value)}
                options={[
                  { value: 'Balanced', label: 'Balanced' },
                  { value: 'Budget', label: 'Budget' },
                  { value: 'Luxury', label: 'Luxury' },
                  { value: 'Adventure', label: 'Adventure' },
                  { value: 'Cultural', label: 'Cultural' },
                  { value: 'Relaxed', label: 'Relaxed' },
                  { value: 'Romantic', label: 'Romantic' },
                ]}
              />

              <Select
                label="Preferred Pace"
                value={preferredPace}
                onChange={(e) => setPreferredPace(e.target.value)}
                options={[
                  { value: 'Relaxed', label: 'Relaxed' },
                  { value: 'Balanced', label: 'Balanced' },
                  { value: 'Packed', label: 'Packed' },
                ]}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" isLoading={saving} className="px-8">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
