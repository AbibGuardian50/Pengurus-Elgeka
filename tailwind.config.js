/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'inter': ['Inter', 'SansSerif'],
      'verdana': ['Verdana', 'SansSerif']
    },
    extend: {
      colors: {
        'orange': '#FF914C',
        'bluegray': '#667085',
        'deepbluegray': '#344054',
        'warmgray': '#777271',
        'white': '#FFFFFF',
        'deepnavyblue': ' #040503B2',
      }
    },
  },
  plugins: [],
}