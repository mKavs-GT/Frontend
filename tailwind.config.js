/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/**/*.html",
    "./frontend/**/*.js",
    "./frontend/**/*.jsx",
    "./frontend/**/*.tsx",
    "./frontend/**/*.ts",
    "!./frontend/admin/**",
    "!./frontend/**/node_modules/**"
  ],
  theme: {
    extend: {
      fontSize: {
        '4xl-plus': 'calc(2.25rem + 5px)',
        '6xl-plus': 'calc(3.75rem + 5px)',
      },
      colors: {
        'waypoint-primary': '#A665A5',
        'waypoint-secondary': '#C4A4D4',
        'waypoint-accent': '#E5B4E2',
        'waypoint-dark': '#4C2A4C',
        'waypoint-darkest': '#3F172C',
      },
      fontFamily: {
        'marker': ['"Permanent Marker"', 'cursive'],
        'sans': ['"Outfit"', 'sans-serif'],
      },
      scale: {
        '80': '0.80',
      },
      animation: {
        'scroll-left': 'scroll-left 40s linear infinite',
        'scroll-right': 'scroll-right 40s linear infinite',
      },
      keyframes: {
        'scroll-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'scroll-right': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' }
        }
      }
    }
  },
  safelist: [
    // Dynamic JS state classes from scripts.js, about.js, and inline scripts
    'text-[#c7f908]',
    'text-gray-500',
    'text-white',
    'rounded-t-[40px]',
    'md:rounded-t-[80px]',
    'opacity-0',
    '-translate-x-full',
    'opacity-100',
    'translate-x-0',
    'opacity-20',
    'opacity-40',
    'opacity-80',
    'opacity-90',
    'scale-0',
    'scale-50',
    'scale-80',
    'scale-100',
    'cursor-grabbing',
    'select-none',
    '-translate-y-full',
    'translate-y-0',
    'translate-y-full',
    'translate-x-10',
    'translate-x-full',
    'font-bold',
    'text-4xl',
    'pointer-events-none',
    'pointer-events-auto',
    // Custom configured theme classes
    'animate-scroll-left',
    'animate-scroll-right',
    'font-marker',
    'font-sans',
    'text-4xl-plus',
    'text-6xl-plus'
  ],
  plugins: []
};
