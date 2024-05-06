/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'gotham': ['Gotham', 'SansSerif'],
      'inter': ['Inter', 'SansSerif'],
      'verdana': ['Verdana', 'SansSerif']
    },
    extend: {
      backgroundImage: {
        'hospital' : "url('/src/assets/hospital-alternate.jpg')"
      },
      colors: {
        'orange': '#FF914C',
        'bluegray': '#667085',
        'blueblack': '#040503',
        'deepbluegray': '#344054',
        'lightgray': '#D0D5DD',
        'warmgray': '#777271',
        'white': '#FFFFFF',
        'deepnavyblue': ' #040503B2',
      }
    },
  },
  plugins: [],
}