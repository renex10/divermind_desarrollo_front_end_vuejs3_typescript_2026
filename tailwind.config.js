import formkitTheme from '@formkit/themes/tailwindcss'
import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,ts,js,jsx,tsx}',
    './tailwind-formkit-theme.js' // 👈 Añadir el archivo de tema de FormKit
  ],
  safelist: [ // 👈 Añadir safelist para clases dinámicas
    'priority-alta',
    'priority-media',
    'priority-baja',
    'bg-red-100',
    'text-red-800',
    'bg-yellow-100',
    'text-yellow-800',
    'bg-green-100',
    'text-green-800',
  ],
  theme: {
    extend: {
 
       // ====================
      // COLORES PERSONALIZADOS
      // ====================
      colors: {'sidebar': '#132441',//este color lo use para el sidebar pero pueden ser usado en cualquier otro lado o difenrente contexto
        'color3': '#3c5690',
        'color4': '#708fea',
        'color5': '#adceff',
        // Colores principales de la aplicación
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        
        // Colores semánticos para estados
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        
        // Colores neutros mejorados
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },

      // ====================
      // TIPOGRAFÍA PERSONALIZADA
      // ====================
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },

      // ====================
      // ESPACIADO PERSONALIZADO
      // ====================
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // ====================
      // BORDES Y SOMBRAS
      // ====================
      borderRadius: {
        '4xl': '2rem',
      },
      
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },

      // ====================
      // ANIMACIONES
      // ====================
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-soft': 'bounceSoft 2s infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        }
      },

      // ====================
      // TRANSICIONES
      // ====================
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [
    forms, // 👈 Usar la variable importada
    formkitTheme // 👈 Añadir el plugin de FormKit
  ],
}

