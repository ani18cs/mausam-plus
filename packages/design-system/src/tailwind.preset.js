/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        app: 'var(--bg-app)',
        card: {
          DEFAULT: 'var(--bg-card)',
          glass: 'var(--bg-card-glass)',
          subtle: 'var(--bg-card-subtle)',
        },
        input: 'var(--bg-input)',
        tabbar: 'var(--bg-tab-bar)',
        border: {
          subtle: 'var(--border-subtle)',
          strong: 'var(--border-strong)',
          glass: 'var(--border-glass)',
        },
        content: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          inverse: 'var(--text-inverse)',
        },
        accent: {
          primary: 'var(--accent-primary)',
          'primary-hover': 'var(--accent-primary-hover)',
          'primary-subtle': 'var(--accent-primary-subtle)',
        },
        severity: {
          safe: 'var(--severity-safe)',
          'safe-bg': 'var(--severity-safe-bg)',
          'safe-border': 'var(--severity-safe-border)',
          'safe-text': 'var(--severity-safe-text)',

          caution: 'var(--severity-caution)',
          'caution-bg': 'var(--severity-caution-bg)',
          'caution-border': 'var(--severity-caution-border)',
          'caution-text': 'var(--severity-caution-text)',

          warning: 'var(--severity-warning)',
          'warning-bg': 'var(--severity-warning-bg)',
          'warning-border': 'var(--severity-warning-border)',
          'warning-text': 'var(--severity-warning-text)',

          severe: 'var(--severity-severe)',
          'severe-bg': 'var(--severity-severe-bg)',
          'severe-border': 'var(--severity-severe-border)',
          'severe-text': 'var(--severity-severe-text)',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Sora', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        floating: 'var(--shadow-floating)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
