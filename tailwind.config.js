/* tailwind.config.js */
import formkitTheme from '@formkit/themes/tailwindcss'
import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,ts,js,jsx,tsx}',
    './tailwind-formkit-theme.js'
  ],
  safelist: [
    'priority-alta',
    'priority-media',
    'priority-baja',
    'bg-red-100',
    'text-red-800',
    'bg-yellow-100',
    'text-yellow-800',
    'bg-green-100',
    'text-green-800',
    // 🔥 Safelist para clases dinámicas por rol
    'from-parent-600',
    'to-parent-800',
    'from-therapist-600',
    'to-therapist-800',
    'from-admin-600',
    'to-admin-800',
    'bg-parent-500',
    'bg-therapist-500',
    'bg-admin-500',
    'text-parent-600',
    'text-therapist-600',
    'text-admin-600',
  ],
  theme: {
    extend: {
      // ====================
      // 🔥 COLORES POR ROL
      // ====================
      colors: {
        // Colores legacy (mantener compatibilidad)
        'sidebar': '#132441',
        'color3': '#3c5690',
        'color4': '#708fea',
        'color5': '#adceff',

        // 🔥 NUEVO: Colores para PADRES
            parent: {
          50: '#f0f9ff',   // Azul muy claro (casi blanco)
          100: '#e0f2fe',  // Azul cielo claro
          200: '#bae6fd',  // Azul cielo
          300: '#7dd3fc',  // Azul claro
          400: '#38bdf8',  // Azul medio-claro
          500: '#0ea5e9',  // Azul principal
          600: '#0284c7',  // Azul medio
          700: '#0369a1',  // Azul medio-oscuro
          800: '#075985',  // Azul oscuro
          900: '#0c4a6e',  // Azul muy oscuro
        },

        // 🔥 COLORES PARA TERAPEUTAS (profesional)
        therapist: {
          50: '#eff6ff',   // Azul muy claro
          100: '#dbeafe',  // Azul claro
          200: '#bfdbfe',  // Azul suave
          300: '#93c5fd',  // Azul medio
          400: '#60a5fa',  // Azul vibrante
          500: '#3b82f6',  // Azul principal
          600: '#2563eb',  // Azul oscuro
          700: '#1d4ed8',  // Azul muy oscuro
          800: '#1e40af',  // Azul marino
          900: '#1e3a8a',  // Azul profundo
        },

        // 🔥 NUEVO: Colores para ADMIN (autoridad)
        admin: {
          50: '#faf5ff',   // Púrpura muy claro
          100: '#f3e8ff',  // Púrpura claro
          200: '#e9d5ff',  // Púrpura suave
          300: '#d8b4fe',  // Púrpura medio
          400: '#c084fc',  // Púrpura vibrante
          500: '#a855f7',  // Púrpura principal
          600: '#9333ea',  // Púrpura oscuro
          700: '#7e22ce',  // Púrpura muy oscuro
          800: '#6b21a8',  // Violeta oscuro
          900: '#581c87',  // Violeta profundo
        },

        // Colores principales (alias para therapist - compatibilidad)
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
        
        // Colores semánticos (sin cambios)
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
      // 🔥 GRADIENTES POR ROL
      // ====================
      backgroundImage: {
        // Gradientes para padres
        'gradient-parent': 'linear-gradient(135deg, #0891b2 0%, #164e63 100%)',
        'gradient-parent-soft': 'linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)',
        
        // Gradientes para terapeutas
        'gradient-therapist': 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
        'gradient-therapist-soft': 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        
        // Gradientes para admin
        'gradient-admin': 'linear-gradient(135deg, #9333ea 0%, #581c87 100%)',
        'gradient-admin-soft': 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
      },

      // ====================
      // TIPOGRAFÍA
      // ====================
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },

      // ====================
      // ESPACIADO
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
        'parent': '0 4px 25px -5px rgba(8, 145, 178, 0.2), 0 10px 10px -5px rgba(8, 145, 178, 0.1)',
        'admin': '0 4px 25px -5px rgba(147, 51, 234, 0.2), 0 10px 10px -5px rgba(147, 51, 234, 0.1)',
      },

      // ====================
      // 🔥 ANIMACIONES Y TRANSICIONES MEJORADAS
      // ====================
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-fast': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-soft': 'bounceSoft 2s infinite',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scale-in': 'scaleIn 0.3s ease-out',
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
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.8' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },

      // ====================
      // TRANSICIONES SUAVES
      // ====================
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
      
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    forms,
    formkitTheme
  ],
}