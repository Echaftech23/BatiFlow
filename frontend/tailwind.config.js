/**
 * BatiFlow design tokens — canonical palette (production)
 *
 * Primary (orange):  #F27427
 * Navy:             #1A2B48
 * App background:   #F8F9FB
 * Surfaces:         #FFFFFF cards on soft gray app bg
 * Success (confirmé): #22C55E
 * Warning / en attente surfaces: #F59E0B
 * Destructive:      #EF4444
 * Auth hero navy:  #113362 (login gradient top)
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.tsx',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#F27427',
        'on-primary': '#FFFFFF',
        navy: '#1A2B48',
        'auth-navy': '#113362',
        background: '#F8F9FB',
        surface: '#FFFFFF',
        border: '#E8EAEF',
        muted: {
          DEFAULT: '#EEF0F4',
          foreground: '#6B7280',
        },
        success: {
          DEFAULT: '#22C55E',
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#F59E0B',
          foreground: '#1A2B48',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
      },
      borderRadius: {
        card: '20px',
        button: '12px',
        input: '12px',
        fab: '28px',
        pill: '9999px',
      },
      spacing: {
        'screen-x': '20px',
        'section-y': '24px',
      },
      fontSize: {
        title: ['24px', { lineHeight: '32px' }],
        subtitle: ['18px', { lineHeight: '26px' }],
        body: ['16px', { lineHeight: '24px' }],
        caption: ['14px', { lineHeight: '20px' }],
        badge: ['12px', { lineHeight: '16px' }],
      },
      fontFamily: {
        sans: ['Poppins_400Regular'],
        'sans-medium': ['Poppins_500Medium'],
        'sans-semibold': ['Poppins_600SemiBold'],
        'sans-bold': ['Poppins_700Bold'],
      },
      boxShadow: {
        card: '0px 2px 8px rgba(26, 43, 72, 0.08)',
        fab: '0px 4px 14px rgba(242, 116, 39, 0.35)',
        'login-cta':
          '0px 8px 20px rgba(242, 116, 39, 0.38)',
        segmented: '0px 1px 3px rgba(26, 43, 72, 0.06)',
      },
    },
  },
  plugins: [],
};
