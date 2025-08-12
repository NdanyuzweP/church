/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E7ECF0',
          100: '#CFD9E1',
          200: '#A0B3C3',
          300: '#708DA5',
          400: '#416787',
          500: '#264653',
          600: '#203C46',
          700: '#183039',
          800: '#11242B',
          900: '#0B181D',
        },
        accent: {
          50: '#F2F5F3',
          100: '#E5EBE7',
          200: '#CBD7CF',
          300: '#B0C4B1',
          400: '#96B193',
          500: '#7C9E75',
          600: '#627E5D',
          700: '#485E45',
          800: '#2E3E2D',
          900: '#141E15',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4A4A4A',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};