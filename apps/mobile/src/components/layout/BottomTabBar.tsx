import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Newspaper, Sparkles, Map, User } from 'lucide-react';
import { useTranslation } from '../../utils/i18n';

export const BottomTabBar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border-subtle bg-tabbar/95 backdrop-blur-lg pb-[calc(0.5rem+var(--sab))] pt-1.5 transition-colors max-w-lg mx-auto"
      role="navigation"
      aria-label="Bottom Navigation"
    >
      <div className="flex items-center justify-around px-2">
        {/* Tab 1: Home Feed */}
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `flex min-h-[44px] min-w-[50px] flex-col items-center justify-center gap-0.5 rounded-xl transition-colors ${
              isActive
                ? 'text-accent-primary font-bold'
                : 'text-content-muted hover:text-content-primary font-medium'
            }`
          }
        >
          <Home className="h-4.5 w-4.5" />
          <span className="text-[10px]">{t('nav.home')}</span>
        </NavLink>

        {/* Tab 2: Climate News Feed */}
        <NavLink
          to="/news"
          className={({ isActive }) =>
            `flex min-h-[44px] min-w-[50px] flex-col items-center justify-center gap-0.5 rounded-xl transition-colors ${
              isActive
                ? 'text-accent-primary font-bold'
                : 'text-content-muted hover:text-content-primary font-medium'
            }`
          }
        >
          <Newspaper className="h-4.5 w-4.5" />
          <span className="text-[10px]">{t('nav.news')}</span>
        </NavLink>

        {/* Tab 3: Ask Mausam AI (Elevated Flagship Button) */}
        <NavLink
          to="/ask"
          className={({ isActive }) =>
            `relative -top-2 flex flex-col items-center justify-center transition-transform active:scale-95 ${
              isActive ? 'scale-105' : ''
            }`
          }
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-indigo-500 text-white shadow-floating border-2 border-card ring-2 ring-sky-400/30">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <span className="text-[10px] font-bold text-accent-primary mt-0.5">{t('nav.ask')}</span>
        </NavLink>

        {/* Tab 4: Hyperlocal Risk Map */}
        <NavLink
          to="/map"
          className={({ isActive }) =>
            `flex min-h-[44px] min-w-[50px] flex-col items-center justify-center gap-0.5 rounded-xl transition-colors ${
              isActive
                ? 'text-accent-primary font-bold'
                : 'text-content-muted hover:text-content-primary font-medium'
            }`
          }
        >
          <Map className="h-4.5 w-4.5" />
          <span className="text-[10px]">{t('nav.map')}</span>
        </NavLink>

        {/* Tab 5: Profile & Personalization */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex min-h-[44px] min-w-[50px] flex-col items-center justify-center gap-0.5 rounded-xl transition-colors ${
              isActive
                ? 'text-accent-primary font-bold'
                : 'text-content-muted hover:text-content-primary font-medium'
            }`
          }
        >
          <User className="h-4.5 w-4.5" />
          <span className="text-[10px]">{t('nav.profile')}</span>
        </NavLink>
      </div>
    </nav>
  );
};
