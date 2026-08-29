import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Sparkles, Map, User } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { translate } from '../../utils/i18n';

export const BottomTabBar: React.FC = () => {
  const language = useAppStore((state) => state.language);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border-subtle bg-tabbar/95 backdrop-blur-lg pb-[calc(0.5rem+var(--sab))] pt-2 transition-colors max-w-lg mx-auto"
      role="navigation"
      aria-label={translate(language, 'nav.home')}
    >
      <div className="flex items-center justify-around px-3">
        {/* Tab 1: Home Feed */}
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `flex min-h-[44px] min-w-[56px] flex-col items-center justify-center gap-1 rounded-xl transition-colors ${
              isActive
                ? 'text-accent-primary font-bold'
                : 'text-content-muted hover:text-content-primary font-medium'
            }`
          }
        >
          <Home className="h-5 w-5" />
          <span className="text-[11px]">{translate(language, 'nav.home')}</span>
        </NavLink>

        {/* Tab 2: Ask Mausam AI (Elevated Flagship Button) */}
        <NavLink
          to="/ask"
          className={({ isActive }) =>
            `relative -top-3 flex flex-col items-center justify-center transition-transform active:scale-95 ${
              isActive ? 'scale-105' : ''
            }`
          }
        >
          <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-indigo-500 text-white shadow-floating border-2 border-card ring-2 ring-sky-400/30">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <span className="text-[11px] font-bold text-accent-primary mt-1">{translate(language, 'nav.ask')}</span>
        </NavLink>

        {/* Tab 3: Hyperlocal Risk Map */}
        <NavLink
          to="/map"
          className={({ isActive }) =>
            `flex min-h-[44px] min-w-[56px] flex-col items-center justify-center gap-1 rounded-xl transition-colors ${
              isActive
                ? 'text-accent-primary font-bold'
                : 'text-content-muted hover:text-content-primary font-medium'
            }`
          }
        >
          <Map className="h-5 w-5" />
          <span className="text-[11px]">{translate(language, 'nav.map')}</span>
        </NavLink>

        {/* Tab 4: Profile & Persona Settings */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex min-h-[44px] min-w-[56px] flex-col items-center justify-center gap-1 rounded-xl transition-colors ${
              isActive
                ? 'text-accent-primary font-bold'
                : 'text-content-muted hover:text-content-primary font-medium'
            }`
          }
        >
          <User className="h-5 w-5" />
          <span className="text-[11px]">{translate(language, 'nav.profile')}</span>
        </NavLink>
      </div>
    </nav>
  );
};
