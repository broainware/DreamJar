/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        sky: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
        },
        mint: { 100: '#D1FAE5', 500: '#10B981', 600: '#059669' },
        peach: { 100: '#FEE2E2', 500: '#EF4444' },
        lavender: { 100: '#EDE9FE', 500: '#8B5CF6' },
        lemon: { 100: '#FEF9C3', 500: '#EAB308' },
      },
      fontFamily: {
        sans: ['"Nunito"', 'ui-sans-serif', 'system-ui'],
        display: ['"Fredoka One"', 'cursive'],
      },
      borderRadius: { xl: '1rem', '2xl': '1.5rem', '3xl': '2rem' },
      boxShadow: {
        card: '0 4px 24px 0 rgba(59,130,246,0.08)',
        'card-hover': '0 8px 32px 0 rgba(59,130,246,0.15)',
        glass: '0 8px 32px 0 rgba(31,38,135,0.08)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        wiggle: 'wiggle 0.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        wiggle: { '0%,100%': { transform: 'rotate(-5deg)' }, '50%': { transform: 'rotate(5deg)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
    },
  },
  plugins: [],
}
