import type { Config } from 'tailwindcss';
export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // brand palette
        'brand-beige': '#C7A47D',
        'brand-black': '#0B0B0B',
        'brand-white': '#FFFFFF',
        'brand-gray': '#F2F2F2',
      },
    },
  },
  plugins: [],
} satisfies Config;
