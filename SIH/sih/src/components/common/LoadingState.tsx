import React from 'react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullHeight?: boolean;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading analytics telemetry...',
  size = 'md',
  fullHeight = false,
  className = '',
}) => {
  const spinnerSizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  }[size];

  return (
    <div
      className={`flex flex-col items-center justify-center p-6 text-slate-500 dark:text-slate-400 ${
        fullHeight ? 'min-h-[280px] h-full' : ''
      } ${className}`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`${spinnerSizes} rounded-full border-slate-300 border-t-emerald-600 dark:border-slate-700 dark:border-t-emerald-500 animate-spin mb-3`}
      />
      <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {message}
      </span>
    </div>
  );
};
