import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { MobileShell } from './components/layout/MobileShell';
import { OnboardingPage } from './pages/OnboardingPage';
import { HomePage } from './pages/HomePage';
import { ClimateNewsPage } from './pages/ClimateNewsPage';
import { AskMausamPage } from './pages/AskMausamPage';
import { HyperlocalMapPage } from './pages/HyperlocalMapPage';
import { CitizenReportPage } from './pages/CitizenReportPage';
import { AlertDetailPage } from './pages/AlertDetailPage';
import { SavedPlacesPage } from './pages/SavedPlacesPage';
import { ProfilePage } from './pages/ProfilePage';

export const App: React.FC = () => {
  const { hasCompletedOnboarding, theme, fetchForecast } = useAppStore();

  useEffect(() => {
    // Synchronize dark theme class on document element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Fetch initial weather forecast on app load
    fetchForecast();
  }, [theme]);

  return (
    <BrowserRouter>
      <MobileShell>
        <Routes>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route
            path="/"
            element={
              hasCompletedOnboarding ? (
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />
          <Route path="/home" element={<HomePage />} />
          <Route path="/news" element={<ClimateNewsPage />} />
          <Route path="/ask" element={<AskMausamPage />} />
          <Route path="/map" element={<HyperlocalMapPage />} />
          <Route path="/report" element={<CitizenReportPage />} />
          <Route path="/alert/:id" element={<AlertDetailPage />} />
          <Route path="/saved-places" element={<SavedPlacesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </MobileShell>
    </BrowserRouter>
  );
};

