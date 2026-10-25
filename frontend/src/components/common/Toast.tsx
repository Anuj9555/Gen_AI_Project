import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ id, type, message, onDismiss }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-sky-500" />,
  };

  const borders = {
    success: 'border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900',
    error: 'border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-900',
    info: 'border-sky-200 dark:border-sky-800 bg-white dark:bg-slate-900',
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl border shadow-lg ${borders[type]} animate-in slide-in-from-bottom-2 duration-200`}
    >
      {icons[type]}
      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{message}</p>
      <button
        onClick={() => onDismiss(id)}
        className="ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
