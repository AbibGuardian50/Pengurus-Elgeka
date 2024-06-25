/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hospital' : "url('/src/assets/hospital-alternate.jpg')",
        'work' : "url('/src/assets/work.png')",
        'seeingstatistics' : "url('/src/assets/seeingstatistics.png')"
      },
      boxShadow: {
        's': '2px 1px 5px 0px rgba(0, 0, 0, 0.25)',
      },
      colors: {
        'red': '#8B1A0F',
        'orange': '#FF914C',
        'teal': '#0A6B77',
        'bluegray': '#667085',
        'midnightblue': '#222539',
        'blueblack': '#040503',
        'black': '#000000',
        'deepbluegray': '#344054',
        'lightgray': '#D0D5DD',
        'warmgray': '#777271',
        'white': '#FFFFFF',
        'offwhite': '#F9F0EE',
        'deepnavyblue': ' #040503B2',
        'lightcream': '#FFFFFFB2',
        'shadegreen': '#009E73',
        'shadepink': '#CC79A7',
        'shadeblue': '#56B4E9',
        'shadeorange': '#E69F00',
        'lightsilver': '#D4D4D4 ',
        'maize': '#F0E442',
        'crimson': '#FF5B5A',
        'charcoalgray': '#454256',
        'charcoalblue': '#3F4252',
        'whisperingsilver': '#EEEEED99',
        'midnightshadow': '#070707',
        'azurebreeze': '#4AD0E0',
        'deepseateal': '#0A6B77',
        'verylightgray': '#EEEEED',
      }
    },
    fontFamily: {
      'gotham': ['GothamPro', 'sans-serif'],
      'inter': ['Inter', 'sans-serif'],
      'verdana': ['verdana', 'sans-serif'],
      'poppins': ['poppins', 'sans-serif'],
      'opensans': ['open-sans', 'sans-serif'],
      'assistant': ["Assistant", "sans-serif"],
      'opensans': ["Open Sans", "sans-serif"],
      'hindsiliguri': ["Hind Siliguri", "sans-serif"],
      'bebasneue': ["Bebas Neue", "sans-serif"],
    },
  },
  plugins: [],
}