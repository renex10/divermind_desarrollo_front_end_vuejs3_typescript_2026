// src/router/therapist.routes.ts

/**
 * RUTAS DEL PANEL DE TERAPEUTAS
 * Todas las rutas bajo /therapist/
 */

import PerfilNinoLayout from '@/views/dashboard/perfil_nino/PerfilNinoLayout.vue'
import { useNinoActivoStore } from '@/store/ninoActivoStore'

const RouteShell = { template: '<router-view />' }

export default [
  // Dashboard principal
  { 
    path: '', 
    name: 'dashboard', 
    meta: { breadcrumb: 'Inicio' },
    component: () => import('@/views/dashboard/DashboardView.vue') 
  },

  // Gestión NNA
  {
    path: 'ingreso-nna', 
    name: 'gestion-nna-parent',
    component: RouteShell,
    meta: { breadcrumb: 'Gestión NNA' },
    children: [
      {
        path: '', 
        name: 'lista-nna',
        component: () => import('@/views/dashboard/IngresoNneDashboard.vue')
      },
      {
        path: ':id',
        name: 'perfil-nino',
        component: PerfilNinoLayout,
        props: true,
        meta: { 
          breadcrumb: () => {
            const ninoStore = useNinoActivoStore()
            return ninoStore.hasData 
              ? ninoStore.nombreNino
              : 'Perfil del Niño'
          }
        },
        children: [
          {
            path: '',
            redirect: { name: 'perfil-nino-resumen' }
          },
          {
            path: 'resumen',
            name: 'perfil-nino-resumen',
            component: () => import('@/views/dashboard/PerfilSeguimientoPersonal.vue'),
            props: true,
            meta: { breadcrumb: 'Resumen' }
          },
          {
            path: 'hitos-logros',
            name: 'perfil-nino-hitos',
            component: () => import('@/views/dashboard/perfil_nino/HitosLogrosView.vue'),
            props: true,
            meta: { breadcrumb: 'Hitos y Logros' }
          },
          {
            path: 'rutinas',
            name: 'perfil-nino-rutinas',
            component: () => import('@/views/dashboard/perfil_nino/RutinasView.vue'),
            props: true,
            meta: { breadcrumb: 'Rutinas' }
          },
          {
            path: 'cognitivo',
            name: 'perfil-nino-cognitivo',
            component: () => import('@/views/dashboard/perfil_nino/CognitivoView.vue'),
            props: true,
            meta: { breadcrumb: 'P. Cognitivo' }
          },
          {
            path: 'habilidades-sociales',
            name: 'perfil-nino-habilidades',
            component: () => import('@/views/dashboard/perfil_nino/HabilidadesSocialesView.vue'),
            props: true,
            meta: { breadcrumb: 'H. Sociales' }
          },
          {
            path: 'sensorial',
            name: 'perfil-nino-sensorial',
            component: () => import('@/views/dashboard/perfil_nino/SensorialView.vue'),
            props: true,
            meta: { breadcrumb: 'Sensorial' }
          },
          {
            path: 'comunicacion',
            name: 'perfil-nino-comunicacion',
            component: () => import('@/views/dashboard/perfil_nino/ComunicacionView.vue'),
            props: true,
            meta: { breadcrumb: 'Comunicación' }
          },
          {
            path: 'autonomia',
            name: 'perfil-nino-autonomia',
            component: () => import('@/views/dashboard/perfil_nino/AutonomiaView.vue'),
            props: true,
            meta: { breadcrumb: 'Autonomía' }
          },
          {
            path: 'regulacion',
            name: 'perfil-nino-regulacion',
            component: () => import('@/views/dashboard/perfil_nino/RegulacionView.vue'),
            props: true,
            meta: { breadcrumb: 'Regulación' }
          },
          {
            path: 'detonantes-crisis',
            name: 'perfil-nino-detonantes',
            component: () => import('@/views/dashboard/perfil_nino/DetonantesCrisisView.vue'),
            props: true,
            meta: { breadcrumb: 'Detonantes' }
          },
          {
            path: 'tareas',
            name: 'perfil-nino-tareas',
            component: () => import('@/views/dashboard/perfil_nino/TareasView.vue'),
            props: true,
            meta: { breadcrumb: 'Tareas' }
          },
          {
            path: 'sesiones',
            name: 'perfil-nino-sesiones',
            component: () => import('@/views/dashboard/perfil_nino/SesionesNinoView.vue'),
            props: true,
            meta: { breadcrumb: 'Sesiones' }
          }
        ]
      }
    ]
  },

  // Hitos
  { 
    path: 'histos', 
    name: 'histos', 
    meta: { breadcrumb: 'Histos' },
    component: () => import('@/views/dashboard/HistosView.vue') 
  },

  // Sesiones (General)
  { 
    path: 'sesiones',
    name: 'sesiones',
    meta: { breadcrumb: 'Sesiones (General)' },
    component: () => import('@/views/dashboard/SessionesView.vue') 
  },
  
  // ✅ RUTA ACTUALIZADA: Detalle de sesión específica
  // Se cambia el nombre para que coincida con lo que el componente llama: "detalle-sesion-especifica"
  {
    path: 'ninos/:childId/sesiones/:sessionId', 
    name: 'detalle-sesion-especifica', 
    component: () => import('@/views/dashboard/perfil_nino/SessionId.vue'),
    props: true,
    meta: { breadcrumb: 'Detalle de Sesión' }
  },
  
  // Documentar sesión
  {
    path: 'ninos/:childId/sesiones/:sessionId/documentar',
    name: 'documentar-sesion',
    component: () => import('@/views/dashboard/DocumentarSesionView.vue'),
    props: true,
    meta: { breadcrumb: 'Documentar Sesión' }
  },
  
  // Reportes
  { 
    path: 'reportes', 
    name: 'reportes', 
    meta: { breadcrumb: 'Reportes' },
    component: () => import('@/views/dashboard/ReportesView.vue') 
  },

  // Configuración
  { 
    path: 'configuracion', 
    name: 'configuracion', 
    meta: { breadcrumb: 'Configuración' },
    component: () => import('@/views/dashboard/ConfiguracionView.vue') 
  },

  // Establecimientos
  { 
    path: 'establecimientos', 
    name: 'establecimientos', 
    meta: { breadcrumb: 'Establecimientos' },
    component: () => import('@/views/dashboard/EstablecimientosView.vue') 
  }
]