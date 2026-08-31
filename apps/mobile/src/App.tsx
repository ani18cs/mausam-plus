import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { MobileShell } from './components/layout/MobileShell';
import { SplashScreen } from './components/layout/SplashScreen';
import { OnboardingPage } from './pages/OnboardingPage';
import { HomePage } from './pages/HomePage';
import { ClimateNewsPage } from './pages/ClimateNewsPage';
import { AskMausamPage } from './pages/AskMausamPage';
import { HyperlocalMapPage } from './pages/HyperlocalMapPage';
import { CitizenReportPage } from './pages/CitizenReportPage';
import { AlertDetailPage } from './pages/AlertDetailPage';
import { SavedPlacesPage } from './pages/SavedPlacesPage';
import { ProfilePage } from './pages/ProfilePage';
import { RadarSatellitePage } from './pages/RadarSatellitePage';
import { CycloneMarinePage } from './pages/CycloneMarinePage';
import { SpecializedHubPage } from './pages/SpecializedHubPage';
import { AlertsPage } from './pages/AlertsPage';
import { ExplorePage } from './pages/ExplorePage';
import { AnimatePresence, motion } from 'framer-motion';
import {
  syncNativeStatusBarTheme,
  initPushNotifications,
  setupHardwareBackButton,
  hideNativeSplashScreen,
} from './services/nativeServices';

const ROOT_TABS = ['/home', '/alerts', '/ask', '/explore', '/profile'];
const MODAL_ROUTES = ['/report'];

const HardwareBackButtonHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const cleanup = setupHardwareBackButton(() => {
      if (ROOT_TABS.includes(location.pathname)) {
        if (location.pathname !== '/home') {
          navigate('/home');
        }
      } else {
        navigate(-1);
      }
    });

    return cleanup;
  }, [location.pathname, navigate]);

  return null;
};

const PageTransitionWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isRootTab = ROOT_TABS.includes(location.pathname);
  const isModal = MODAL_ROUTES.includes(location.pathname);

  let initial = { opacity: 0, x: 0, y: 0 };
  let animate = { opacity: 1, x: 0, y: 0 };
  let exit = { opacity: 0, x: 0, y: 0 };
  let transition = { duration: 0.18, ease: [0.16, 1, 0.3, 1] };

  if (isModal) {
    initial = { opacity: 0, x: 0, y: 32 };
    animate = { opacity: 1, x: 0, y: 0 };
    exit = { opacity: 0, x: 0, y: 32 };
    transition = { duration: 0.24, ease: [0.16, 1, 0.3, 1] };
  } else if (!isRootTab) {
    // Stack push / pop
    initial = { opacity: 0, x: 24, y: 0 };
    animate = { opacity: 1, x: 0, y: 0 };
    exit = { opacity: 0, x: 24, y: 0 };
    transition = { duration: 0.22, ease: [0.16, 1, 0.3, 1] };
  }

  return (
    <motion.div
      key={location.pathname}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      className="w-full min-h-full"
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const { hasCompletedOnboarding } = useAppStore();

  return (
    <AnimatePresence mode="wait">
      <PageTransitionWrapper>
        <Routes location={location} key={location.pathname}>
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
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/radar" element={<RadarSatellitePage />} />
          <Route path="/cyclone" element={<CycloneMarinePage />} />
          <Route path="/specialized" element={<SpecializedHubPage />} />
          <Route path="/news" element={<ClimateNewsPage />} />
          <Route path="/ask" element={<AskMausamPage />} />
          <Route path="/map" element={<HyperlocalMapPage />} />
          <Route path="/report" element={<CitizenReportPage />} />
          <Route path="/alert/:id" element={<AlertDetailPage />} />
          <Route path="/saved-places" element={<SavedPlacesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </PageTransitionWrapper>
    </AnimatePresence>
  );
};

export const App: React.FC = () => {
  const { theme, fetchForecast, showSplash, setShowSplash, language } = useAppStore();

  useEffect(() => {
    // 1. Synchronize dark theme class on document element
    const isDark = theme === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // 2. Synchronize Native Status Bar Theme
    syncNativeStatusBarTheme(isDark);

    // 3. Initialize Native Push Notifications & sync language
    initPushNotifications((token) => {
      // Sync FCM token to BFF if available
      fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fcmToken: token,
          language,
          type: 'what_changed',
          variables: { diff: '1.5', trend: 'cooler', humidDiff: '10' },
        }),
      }).catch(() => {});
    });

    // 4. Hide Native Splash Screen once ready
    hideNativeSplashScreen();

    // 5. Fetch initial weather forecast on app load
    fetchForecast();

    // 6. Live Real-Time Telemetry Heartbeat (refresh every 60 seconds)
    const interval = setInterval(() => {
      fetchForecast();
    }, 60000);

    return () => clearInterval(interval);
  }, [theme, language]);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen
            onFinish={() => setShowSplash(false)}
            durationMs={2000}
          />
        )}
      </AnimatePresence>

      <BrowserRouter>
        <HardwareBackButtonHandler />
        <MobileShell>
          <AnimatedRoutes />
        </MobileShell>
      </BrowserRouter>
    </>
  );
};
