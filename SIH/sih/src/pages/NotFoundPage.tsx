import React from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center mb-4">
        <AlertOctagon className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold font-mono text-slate-800 dark:text-slate-100">
        404 — Telemetry Route Not Found
      </h2>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
        The requested module or corridor coordinates do not match any active routing endpoint.
      </p>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 text-xs font-mono font-medium hover:opacity-90 transition-opacity"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};
