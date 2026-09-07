import React, { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: ReactNode;
  action?: ReactNode;
  fullHeight?: boolean;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Available',
  message = 'There are no active records or metrics to display for this selection.',
  icon,
  action,
  fullHeight = false,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-900/30 ${
        fullHeight ? 'min-h-[260px] h-full' : ''
      } ${className}`}
    >
      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
        {icon || <Inbox className="w-5 h-5" />}
      </div>
      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
        {title}
      </h4>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
        {message}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
