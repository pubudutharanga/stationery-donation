/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mesh-pale': '#E0F7FA',
        'mesh-sky': '#4facfe',
        'mesh-teal': '#00f2fe',
        'mesh-purple': '#a18cd1',
        'glass-white': 'rgba(255, 255, 255, 0.15)',
        'glass-dark': 'rgba(30, 64, 175, 0.05)',
      },
      backdropBlur: {
        'mesh-sm': '8px',
        'mesh-md': '16px',
        'mesh-lg': '32px',
        'mesh-xl': '64px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-mesh': 'pulse-mesh 4s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'blob': 'blob 7s infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-mesh': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}