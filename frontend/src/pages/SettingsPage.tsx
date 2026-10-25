import React, { useState } from 'react';
import { Settings, Shield, Bell, Key, Database, Sparkles, Check } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '../components/common/Button';

export const SettingsPage: React.FC = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [currency, setCurrency] = useState('USD');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Application Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage connectivity, notifications, and application preferences.
          </p>
        </div>

        {saved && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" /> Settings updated successfully!
          </div>
        )}

        {/* Integration Status */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Database className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Connected Integrations
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Supabase PostgreSQL & Auth
                </span>
                <span className="text-slate-500">Live cloud database connection with RLS</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold">
                Operational
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  WanderAI Itinerary Generator Core
                </span>
                <span className="text-slate-500">Configurable LLM provider & fallback generator</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-brand-100 text-brand-700 text-[11px] font-bold">
                Ready
              </span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Notifications & Communication
          </h3>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
            />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Receive departure reminders and itinerary updates via email
            </span>
          </label>
        </div>

        <div className="flex justify-end">
          <Button variant="primary" onClick={handleSave} className="px-6">
            Save Settings
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};
