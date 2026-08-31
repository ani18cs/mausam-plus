/**
 * @mausam/design-system Tokens
 * Unified design tokens for typography scale, neutral color palette, severity colors, motion durations, and spacing.
 */

export const tokens = {
  colors: {
    // 4 Core Severity Levels + Info (WCAG AA compliant in Light and Dark)
    severity: {
      info: {
        DEFAULT: '#0284C7', // Sky 600
        bg: 'rgba(2, 132, 199, 0.12)',
        border: 'rgba(2, 132, 199, 0.28)',
        text: '#0369A1',
        darkText: '#38BDF8',
      },
      safe: {
        DEFAULT: '#10B981', // Emerald 500
        bg: 'rgba(16, 185, 129, 0.12)',
        border: 'rgba(16, 185, 129, 0.28)',
        text: '#047857',
        darkText: '#34D399',
      },
      caution: {
        DEFAULT: '#F59E0B', // Amber 500
        bg: 'rgba(245, 158, 11, 0.12)',
        border: 'rgba(245, 158, 11, 0.28)',
        text: '#B45309',
        darkText: '#FBBF24',
      },
      warning: {
        DEFAULT: '#F97316', // Orange 500
        bg: 'rgba(249, 115, 22, 0.12)',
        border: 'rgba(249, 115, 22, 0.28)',
        text: '#C2410C',
        darkText: '#FB923C',
      },
      severe: {
        DEFAULT: '#EF4444', // Red 500
        bg: 'rgba(239, 68, 68, 0.12)',
        border: 'rgba(239, 68, 68, 0.28)',
        text: '#B91C1C',
        darkText: '#F87171',
      },
    },
    // IMD Standard 4-Tier Warning Colors
    imdWarning: {
      green: {
        DEFAULT: '#22C55E',
        label: 'No Warning',
        bg: 'rgba(34, 197, 94, 0.14)',
        border: 'rgba(34, 197, 94, 0.3)',
      },
      yellow: {
        DEFAULT: '#EAB308',
        label: 'Watch (Be Updated)',
        bg: 'rgba(234, 179, 8, 0.14)',
        border: 'rgba(234, 179, 8, 0.3)',
      },
      orange: {
        DEFAULT: '#F97316',
        label: 'Alert (Be Prepared)',
        bg: 'rgba(249, 115, 22, 0.14)',
        border: 'rgba(249, 115, 22, 0.3)',
      },
      red: {
        DEFAULT: '#EF4444',
        label: 'Warning (Take Action)',
        bg: 'rgba(239, 68, 68, 0.14)',
        border: 'rgba(239, 68, 68, 0.3)',
      },
    },
    // Doppler Radar Reflectivity Palette (dBZ)
    radarDbz: {
      veryLight: '#00E5FF', // < 15 dBZ (Drizzle)
      light: '#00E676',     // 15-30 dBZ (Light Rain)
      moderate: '#FFEA00',  // 30-45 dBZ (Moderate Rain)
      heavy: '#FF9100',     // 45-55 dBZ (Heavy Rain)
      intense: '#FF1744',   // 55-65 dBZ (Hail / Severe Core)
      extreme: '#D500F9',   // > 65 dBZ (Extreme Violent Storm)
    },
    // Neutral dark/light atmospheric ambient accents
    atmosphere: {
      clearDay: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(251, 191, 36, 0.08) 100%)',
      clearNight: 'linear-gradient(135deg, rgba(35, 35, 42, 0.8) 0%, rgba(18, 18, 20, 0.95) 100%)',
      cloudy: 'linear-gradient(135deg, rgba(60, 60, 68, 0.25) 0%, rgba(30, 30, 34, 0.4) 100%)',
      rain: 'linear-gradient(135deg, rgba(30, 64, 175, 0.18) 0%, rgba(20, 30, 50, 0.3) 100%)',
      heat: 'linear-gradient(135deg, rgba(234, 88, 12, 0.16) 0%, rgba(185, 28, 28, 0.12) 100%)',
    },
  },
  typography: {
    fontFamilies: {
      heading: '"Sora", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"JetBrains Mono", monospace',
    },
    fontSizeScale: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.25rem', // 20px
      xl: '1.75rem', // 28px
      '2xl': '2.5rem', // 40px
      hero: '3.75rem', // 60px - temperature display
    },
  },
  motion: {
    durations: {
      fast: 0.15, // 150ms - snappy tap feedback & peer tab switch
      base: 0.22, // 220ms - stack slide & card entrance
      sheet: 0.25, // 250ms - bottom sheet & modal slide
    },
    ease: [0.16, 1, 0.3, 1], // Apple-like spring cubic bezier
  },
  radii: {
    sm: '0.5rem', // 8px
    md: '0.75rem', // 12px
    lg: '1rem', // 16px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },
} as const;

export type SeverityType = 'info' | 'safe' | 'caution' | 'warning' | 'severe';
