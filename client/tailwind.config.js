/** @type {import('tailwindcss').Config} */
export const content = [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {
    colors: {
      primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
      },
      secondary: {
        // Add your secondary colors
      },
    },
    fontFamily: {
      sans: ['Inter var', 'sans-serif'],
    },
    spacing: {
      '128': '32rem',
    },
    borderRadius: {
      '4xl': '2rem',
    },
  },
};
export const plugins = [
  require('@tailwindcss/forms'),
];