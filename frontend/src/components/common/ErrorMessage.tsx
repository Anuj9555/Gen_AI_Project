import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/70 dark:bg-rose-950/20 p-5 flex items-start gap-4 ${className}`}
    >
      <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
        <AlertCircle className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-rose-900 dark:text-rose-200">{title}</h4>
        <p className="text-xs text-rose-700 dark:text-rose-300/90 mt-1 leading-relaxed">
          {message}
        </p>
        {onRetry && (
          <div className="mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={onRetry}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              className="border-rose-200 text-rose-700 hover:bg-rose-100 dark:border-rose-800 dark:text-rose-300"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
