/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        kenya: {
          red: '#C8102E',
          green: '#006600',
          black: '#000000',
          white: '#FFFFFF',
        },
        urban: {
          bg: '#050507',
          surface: '#0c0c0f',
          card: '#111116',
          cardHover: '#161620',
          border: '#1e1e2a',
          borderLight: '#2a2a3a',
          muted: '#5a5a72',
          accent: '#00d4ff',
          accentSoft: '#00aacc',
          gold: '#e8a000',
          goldSoft: '#ffbd40',
          glow: '#C8102E',
          purple: '#7c3aed',
          violet: '#a855f7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Oswald', 'Impact', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-right': 'slideRight 0.5s ease-out forwards',
        'pulse-red': 'pulseRed 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'float': 'float 7s ease-in-out infinite',
        'float-slow': 'float 12s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'scan': 'scan 3s linear infinite',
        'ticker': 'ticker 25s linear infinite',
        'border-glow': 'borderGlow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideRight: {
          from: { opacity: '0', transform: 'translateX(-24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        pulseRed: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(200,16,46,0.3), 0 0 60px rgba(200,16,46,0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(200,16,46,0.6), 0 0 80px rgba(200,16,46,0.25)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-12px) rotate(1deg)' },
          '66%': { transform: 'translateY(-6px) rotate(-1deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200%)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        borderGlow: {
          from: { borderColor: 'rgba(200,16,46,0.2)' },
          to: { borderColor: 'rgba(200,16,46,0.6)' },
        },
      },
      backgroundImage: {
        'mesh-dark': `
          radial-gradient(ellipse 80% 60% at 20% 0%, rgba(200,16,46,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 80% 100%, rgba(0,212,255,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 50% 50%, rgba(124,58,237,0.04) 0%, transparent 70%)
        `,
        'mesh-card': `
          radial-gradient(ellipse 120% 80% at 50% -20%, rgba(200,16,46,0.07) 0%, transparent 60%)
        `,
        'gradient-flag': 'linear-gradient(180deg, #C8102E 0%, #000000 50%, #006600 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'shimmer-white': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
      },
      boxShadow: {
        'red-glow': '0 0 24px rgba(200,16,46,0.35), 0 0 60px rgba(200,16,46,0.12)',
        'red-glow-lg': '0 0 40px rgba(200,16,46,0.5), 0 0 100px rgba(200,16,46,0.2)',
        'cyan-glow': '0 0 24px rgba(0,212,255,0.35), 0 0 60px rgba(0,212,255,0.12)',
        'gold-glow': '0 0 24px rgba(232,160,0,0.4), 0 0 60px rgba(232,160,0,0.15)',
        'card': '0 1px 3px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
        'card-hover': '0 4px 6px rgba(0,0,0,0.5), 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,16,46,0.15)',
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.2)',
        'input': '0 0 0 1px rgba(30,30,42,1), inset 0 2px 4px rgba(0,0,0,0.3)',
        'input-focus': '0 0 0 2px rgba(200,16,46,0.4), inset 0 2px 4px rgba(0,0,0,0.2)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
