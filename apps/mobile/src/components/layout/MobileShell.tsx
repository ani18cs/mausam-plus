import React from 'react';
import { TopAppBar } from './TopAppBar';
import { BottomTabBar } from './BottomTabBar';
import { WhyModal } from './WhyModal';
import { useLocation } from 'react-router-dom';

export const MobileShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isOnboarding = location.pathname === '/onboarding';
  const isMap = location.pathname === '/map';

  return (
    <div className="min-h-screen w-full bg-[#0E0E11] text-content-primary flex justify-center items-start sm:py-6 sm:px-4">
      {/* Mobile Phone Frame / Responsive Canvas */}
      <div className="relative w-full max-w-md min-h-screen sm:min-h-[844px] sm:max-h-[920px] sm:rounded-[40px] sm:border-[8px] sm:border-[#222226] bg-app shadow-2xl flex flex-col overflow-hidden sm:ring-1 sm:ring-white/10">
        
        {/* Dynamic Notch Indicator (Desktop preview only) */}
        <div className="hidden sm:flex justify-center pt-2 pb-1 bg-card/85">
          <div className="h-4 w-28 bg-[#2A2A30] rounded-full" />
        </div>

        {/* Persistent Top App Bar (Hidden on full onboarding) */}
        {!isOnboarding && <TopAppBar />}

        {/* Main Content Area */}
        <main
          className={`flex-1 overflow-y-auto overscroll-contain transition-colors ${
            !isOnboarding && !isMap ? 'pb-24' : ''
          }`}
        >
          {children}
        </main>

        {/* Persistent Bottom Tab Bar */}
        {!isOnboarding && <BottomTabBar />}

        {/* Global "Why?" Explainability Modal */}
        <WhyModal />
      </div>
    </div>
  );
};
