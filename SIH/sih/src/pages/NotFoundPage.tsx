import React from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
      <div className="w-12 h-12 rounded-full bg-[#edf7f1] text-[#244d3b] flex items-center justify-center mb-4">
        <AlertOctagon className="w-6 h-6" />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-[#101827] font-sans">
        404 — Telemetry Route Not Found
      </h2>
      <p className="text-sm text-[#4b5563] max-w-sm mt-1.5 mb-6 font-sans">
        The requested module or corridor coordinates do not match any active routing endpoint.
      </p>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#527568] text-white text-sm font-semibold hover:bg-[#436257] transition-colors shadow-xs cursor-pointer font-sans"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};
