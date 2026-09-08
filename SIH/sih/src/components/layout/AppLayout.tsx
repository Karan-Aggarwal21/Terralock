import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavbar } from './TopNavbar';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F8F6] text-[#101827] font-sans flex flex-col antialiased selection:bg-[#244d3b] selection:text-white relative overflow-hidden">
      {/* Subtle Ambient Background Gradient Glows matching HeroSection */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#edf5f0]/80 via-transparent to-transparent rounded-full pointer-events-none -z-10 blur-3xl" />
      <div className="absolute top-[35%] left-[-200px] w-[600px] h-[600px] bg-gradient-to-tr from-[#f3f7f4]/80 via-transparent to-transparent rounded-full pointer-events-none -z-10 blur-3xl" />

      {/* Top Application Shell Navigation */}
      <TopNavbar />

      {/* Primary Page Canvas */}
      <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="max-w-[1536px] mx-auto space-y-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
