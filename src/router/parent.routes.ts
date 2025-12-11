// src/router/parent.routes.ts

/**
 * RUTAS DEL PANEL DE PADRES/FAMILIA
 * Todas las rutas bajo /parent/
 * 
 * Estructura simplificada:
 * - Dashboard simple
 * - Mis hijos
 * - Registro diario
 * - Rutinas
 * - Medicación
 * - Mensajes
 * - Reportes
 */

export default [
  // Dashboard principal padres
  {
    path: '',
    name: 'parent-dashboard',
    meta: { breadcrumb: 'Inicio' },
    component: () => import('@/views/dashboard/padres/DashboardView.vue')
  },

  // Mis hijos
  {
    path: 'mis-hijos',
    name: 'parent-mis-hijos',
    meta: { breadcrumb: 'Mis Hijos' },
    component: () => import('@/views/dashboard/padres/MisHijosView.vue')
  },

  // Detalle de un hijo
  {
    path: 'hijos/:id',
    name: 'parent-hijo-detalle',
    component: () => import('@/views/dashboard/padres/HijoDetalleView.vue'),
    props: true,
    meta: { breadcrumb: 'Detalle de mi Hijo' }
  },

  // Registro diario
  {
    path: 'registro-diario',
    name: 'parent-registro-diario',
    meta: { breadcrumb: 'Registro Diario' },
    component: () => import('@/views/dashboard/padres/RegistroDiarioView.vue')
  },

  // Rutinas
  {
    path: 'rutinas',
    name: 'parent-rutinas',
    meta: { breadcrumb: 'Rutinas' },
    component: () => import('@/views/dashboard/padres/RutinasView.vue')
  },

  // Medicación
  {
    path: 'medicacion',
    name: 'parent-medicacion',
    meta: { breadcrumb: 'Medicación' },
    component: () => import('@/views/dashboard/padres/MedicacionView.vue')
  },

  // Mensajes/Feedback
  {
    path: 'mensajes',
    name: 'parent-mensajes',
    meta: { breadcrumb: 'Mensajes' },
    component: () => import('@/views/dashboard/padres/MensajesView.vue')
  },

  // Reportes
  {
    path: 'reportes',
    name: 'parent-reportes',
    meta: { breadcrumb: 'Reportes' },
    component: () => import('@/views/dashboard/padres/ReportesView.vue')
  },

  // Configuración (opcional)
  {
    path: 'configuracion',
    name: 'parent-configuracion',
    meta: { breadcrumb: 'Configuración' },
    component: () => import('@/views/dashboard/padres/ConfiguracionView.vue')
  }
]