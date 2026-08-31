import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, ShieldAlert, Sparkles, Compass, User } from 'lucide-react';
import { useTranslation } from '../../utils/i18n';
import { motion } from 'framer-motion';

export const BottomTabBar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const tabs = [
    {
      to: '/home',
      label: t('nav.home') || 'Home',
      icon: Home,
      id: 'tab-home',
    },
    {
      to: '/alerts',
      label: t('nav.alerts') || 'Alerts',
      icon: ShieldAlert,
      id: 'tab-alerts',
    },
    {
      to: '/ask',
      label: t('nav.ask') || 'Ask AI',
      icon: Sparkles,
      id: 'tab-ask',
      isFlagship: true,
    },
    {
      to: '/explore',
      label: t('nav.explore') || 'Explore',
      icon: Compass,
      id: 'tab-explore',
    },
    {
      to: '/profile',
      label: t('nav.profile') || 'Profile',
      icon: User,
      id: 'tab-profile',
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border-subtle bg-tabbar/95 backdrop-blur-xl pb-[calc(0.5rem+var(--sab))] pt-1.5 transition-colors max-w-md mx-auto"
      role="navigation"
      aria-label="Bottom Navigation"
    >
      <div className="flex items-center justify-around px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.to;

          if (tab.isFlagship) {
            return (
              <NavLink
                key={tab.id}
                to={tab.to}
                className="relative -top-2 flex flex-col items-center justify-center min-w-[50px] min-h-[44px] transition-transform active:scale-95 focus:outline-none"
                aria-label={tab.label}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-indigo-500 text-white shadow-floating border-2 border-card ring-2 ${
                    isActive ? 'ring-sky-400 scale-105 shadow-glow-safe' : 'ring-sky-400/30'
                  } transition-all`}
                >
                  <Sparkles className={`h-5 w-5 ${isActive ? 'animate-spin' : 'animate-pulse'}`} />
                </div>
                <span
                  className={`text-[10px] mt-0.5 ${
                    isActive ? 'font-bold text-accent-primary' : 'font-semibold text-content-muted'
                  }`}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute -bottom-1 h-1 w-1 rounded-full bg-accent-primary"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </NavLink>
            );
          }

          return (
            <NavLink
              key={tab.id}
              to={tab.to}
              className="relative flex min-h-[44px] min-w-[50px] flex-col items-center justify-center gap-0.5 rounded-xl transition-colors focus:outline-none"
              aria-label={tab.label}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`h-5 w-5 transition-transform ${
                    isActive
                      ? 'text-accent-primary stroke-[2.5px] scale-110'
                      : 'text-content-muted hover:text-content-primary stroke-[1.8px]'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] transition-colors ${
                  isActive
                    ? 'font-bold text-accent-primary'
                    : 'font-medium text-content-muted hover:text-content-primary'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-accent-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
