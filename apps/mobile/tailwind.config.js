/** @type {import('tailwindcss').Config} */
import preset from '../../packages/design-system/src/tailwind.preset.js';

export default {
  presets: [preset],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/design-system/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};
