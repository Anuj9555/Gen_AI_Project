import React, { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface RegenerateDayProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  date: string;
  onConfirmRegenerate: (override: string) => Promise<void>;
}

export const RegenerateDay: React.FC<RegenerateDayProps> = ({
  isOpen,
  onClose,
  dayNumber,
  date,
  onConfirmRegenerate,
}) => {
  const [override, setOverride] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onConfirmRegenerate(override);
      onClose();
      setOverride('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Regenerate Day ${dayNumber} Itinerary`}
      description={`Re-curate a fresh schedule for ${date} with custom AI guidance.`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
            What would you like to change or focus on?
          </label>
          <textarea
            rows={3}
            value={override}
            onChange={(e) => setOverride(e.target.value)}
            placeholder="e.g. Less walking, more focus on local bakeries, hidden gardens, or indoor art galleries..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm p-3.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={loading}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Regenerate Day {dayNumber}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
