/* tailwind.config.js - OPTIMIZADO PARA RESPONSIVE */
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
    // ========================================
    // 🔥 BREAKPOINTS PERSONALIZADOS
    // ========================================
    screens: {
      'xs': '375px',    // Móviles muy pequeños (iPhone SE)
      'sm': '640px',    // Móviles grandes / Tablets pequeñas
      'md': '768px',    // Tablets
      'lg': '1024px',   // Laptops pequeñas
      'xl': '1280px',   // Desktops
      '2xl': '1536px',  // Pantallas grandes
      
      // 🎯 Breakpoints personalizados por dispositivo
      'mobile-sm': {'max': '374px'},  // Móviles muy pequeños
      'mobile': {'max': '639px'},     // Solo móviles
      'tablet': {'min': '640px', 'max': '1023px'}, // Solo tablets
      'desktop': {'min': '1024px'},   // Solo desktop
    },
    
    extend: {
      // ====================
      // COLORES (sin cambios)
      // ====================
      colors: {
        'sidebar': '#132441',
        'color3': '#3c5690',
        'color4': '#708fea',
        'color5': '#adceff',

        parent: {
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

        therapist: {
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

        admin: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },

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
      // GRADIENTES (sin cambios)
      // ====================
      backgroundImage: {
        'gradient-parent': 'linear-gradient(135deg, #0891b2 0%, #164e63 100%)',
        'gradient-parent-soft': 'linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)',
        'gradient-therapist': 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
        'gradient-therapist-soft': 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        'gradient-admin': 'linear-gradient(135deg, #9333ea 0%, #581c87 100%)',
        'gradient-admin-soft': 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
      },

      // ====================
      // TIPOGRAFÍA RESPONSIVA
      // ====================
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      
      // 🔥 TAMAÑOS DE FUENTE OPTIMIZADOS
      fontSize: {
        // Móvil pequeño
        'xs': ['0.65rem', { lineHeight: '1rem' }],      // 10.4px
        'sm': ['0.75rem', { lineHeight: '1.25rem' }],   // 12px
        'base': ['0.875rem', { lineHeight: '1.5rem' }], // 14px
        'lg': ['1rem', { lineHeight: '1.75rem' }],      // 16px
        'xl': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
        '2xl': ['1.25rem', { lineHeight: '2rem' }],     // 20px
        '3xl': ['1.5rem', { lineHeight: '2.25rem' }],   // 24px
        '4xl': ['1.875rem', { lineHeight: '2.5rem' }],  // 30px
        '5xl': ['2.25rem', { lineHeight: '2.75rem' }],  // 36px
      },

      // ====================
      // 🔥 ESPACIADO RESPONSIVO
      // ====================
      spacing: {
        // Espaciado estándar (mantener)
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        
        // 🎯 Nuevos espaciados móvil
        'mobile-sm': '0.5rem',   // 8px
        'mobile-md': '0.75rem',  // 12px
        'mobile-lg': '1rem',     // 16px
        'tablet-sm': '1.5rem',   // 24px
        'tablet-md': '2rem',     // 32px
        'desktop-sm': '2.5rem',  // 40px
        'desktop-md': '3rem',    // 48px
      },

      // ====================
      // 🔥 CONTENEDORES MÁXIMOS RESPONSIVOS
      // ====================
      maxWidth: {
        // Móviles
        'mobile': '100%',
        'mobile-content': '343px',  // 375px - 32px padding
        
        // Tablets
        'tablet': '608px',          // 640px - 32px padding
        
        // Desktop
        'desktop': '1200px',
        'desktop-wide': '1400px',
      },

      // ====================
      // BORDES Y SOMBRAS
      // ====================
      borderRadius: {
        '4xl': '2rem',
        // 🎯 Bordes responsivos
        'mobile': '0.75rem',   // 12px en móvil
        'tablet': '1rem',      // 16px en tablet
        'desktop': '1.5rem',   // 24px en desktop
      },
      
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'parent': '0 4px 25px -5px rgba(8, 145, 178, 0.2), 0 10px 10px -5px rgba(8, 145, 178, 0.1)',
        'admin': '0 4px 25px -5px rgba(147, 51, 234, 0.2), 0 10px 10px -5px rgba(147, 51, 234, 0.1)',
        // 🎯 Sombras móvil (más sutiles)
        'mobile': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'mobile-md': '0 2px 8px rgba(0, 0, 0, 0.08)',
      },

      // ====================
      // ANIMACIONES (sin cambios)
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
      // TRANSICIONES (sin cambios)
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
    formkitTheme,
    
    // 🔥 PLUGIN PERSONALIZADO PARA UTILIDADES RESPONSIVAS
    function({ addComponents, theme }) {
      addComponents({
        // Contenedor responsivo global
        '.container-responsive': {
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4'),
          
          '@screen xs': {
            maxWidth: '343px',
            paddingLeft: theme('spacing.3'),
            paddingRight: theme('spacing.3'),
          },
          
          '@screen sm': {
            maxWidth: '608px',
            paddingLeft: theme('spacing.4'),
            paddingRight: theme('spacing.4'),
          },
          
          '@screen md': {
            maxWidth: '736px',
            paddingLeft: theme('spacing.6'),
            paddingRight: theme('spacing.6'),
          },
          
          '@screen lg': {
            maxWidth: '992px',
            paddingLeft: theme('spacing.8'),
            paddingRight: theme('spacing.8'),
          },
          
          '@screen xl': {
            maxWidth: '1200px',
          },
          
          '@screen 2xl': {
            maxWidth: '1400px',
          },
        },
        
        // Card responsiva
        '.card-responsive': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.lg'),
          padding: theme('spacing.3'),
          boxShadow: theme('boxShadow.mobile'),
          
          '@screen sm': {
            borderRadius: theme('borderRadius.xl'),
            padding: theme('spacing.4'),
            boxShadow: theme('boxShadow.soft'),
          },
          
          '@screen lg': {
            borderRadius: theme('borderRadius.2xl'),
            padding: theme('spacing.6'),
          },
        },
        
        // Texto responsivo
        '.text-responsive-sm': {
          fontSize: theme('fontSize.xs[0]'),
          lineHeight: theme('fontSize.xs[1].lineHeight'),
          
          '@screen sm': {
            fontSize: theme('fontSize.sm[0]'),
            lineHeight: theme('fontSize.sm[1].lineHeight'),
          },
        },
        
        '.text-responsive-base': {
          fontSize: theme('fontSize.sm[0]'),
          lineHeight: theme('fontSize.sm[1].lineHeight'),
          
          '@screen sm': {
            fontSize: theme('fontSize.base[0]'),
            lineHeight: theme('fontSize.base[1].lineHeight'),
          },
        },
        
        '.text-responsive-lg': {
          fontSize: theme('fontSize.base[0]'),
          lineHeight: theme('fontSize.base[1].lineHeight'),
          
          '@screen sm': {
            fontSize: theme('fontSize.lg[0]'),
            lineHeight: theme('fontSize.lg[1].lineHeight'),
          },
          
          '@screen lg': {
            fontSize: theme('fontSize.xl[0]'),
            lineHeight: theme('fontSize.xl[1].lineHeight'),
          },
        },
        
        '.text-responsive-xl': {
          fontSize: theme('fontSize.lg[0]'),
          lineHeight: theme('fontSize.lg[1].lineHeight'),
          
          '@screen sm': {
            fontSize: theme('fontSize.xl[0]'),
            lineHeight: theme('fontSize.xl[1].lineHeight'),
          },
          
          '@screen lg': {
            fontSize: theme('fontSize.2xl[0]'),
            lineHeight: theme('fontSize.2xl[1].lineHeight'),
          },
        },
        
        '.text-responsive-2xl': {
          fontSize: theme('fontSize.xl[0]'),
          lineHeight: theme('fontSize.xl[1].lineHeight'),
          
          '@screen sm': {
            fontSize: theme('fontSize.2xl[0]'),
            lineHeight: theme('fontSize.2xl[1].lineHeight'),
          },
          
          '@screen lg': {
            fontSize: theme('fontSize.3xl[0]'),
            lineHeight: theme('fontSize.3xl[1].lineHeight'),
          },
        },
      })
    }
  ],
}