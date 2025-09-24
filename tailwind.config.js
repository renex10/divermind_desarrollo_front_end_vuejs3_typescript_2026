/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html',
    'src/**/*.{vue,ts,js,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'sidebar': '#132441',//este color lo use para el sidebar pero pueden ser usado en cualquier otro lado o difenrente contexto
        'color3': '#3c5690',
        'color4': '#708fea',
        'color5': '#adceff',
      }
    },
  },
  plugins: [],
}

