import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PerfilNinoLayout from '@/views/dashboard/perfil_nino/PerfilNinoLayout.vue'
import { useNinoActivoStore } from '@/store/ninoActivoStore'

const RouteShell = { template: '<router-view />' }

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: { requiresAuth: false },
    component: () => import('@/views/auth/LoginView.vue')
  },

  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { 
        path: '', 
        name: 'dashboard', 
        meta: { breadcrumb: 'Inicio' },
        component: () => import('@/views/dashboard/DashboardView.vue') 
      },

      // ===================================================================
      // GESTIÓN NNA - ESTRUCTURA CORREGIDA
      // ===================================================================
      {
        path: 'ingreso-nna', 
        name: 'gestion-nna-parent',
        component: RouteShell,
        meta: { breadcrumb: 'Gestión NNA' },
        children: [
          {
            // Lista de NNA
            path: '', 
            name: 'lista-nna',
            component: () => import('@/views/dashboard/IngresoNneDashboard.vue')
          },
          {
            // Perfil individual - NOMBRE CAMBIADO A "perfil-nino"
            path: ':id',
            name: 'perfil-nino', // ← CAMBIADO de "perfil-nino-layout" a "perfil-nino"
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
                // Redirect automático a resumen cuando se accede al perfil
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

      { 
        path: 'histos', 
        name: 'histos', 
        meta: { breadcrumb: 'Histos' },
        component: () => import('@/views/dashboard/HistosView.vue') 
      },

      { 
        path: 'sesiones',
        name: 'sesiones',
        meta: { breadcrumb: 'Sesiones (General)' },
        component: () => import('@/views/dashboard/SessionesView.vue') 
      },
      
      {
        path: 'ninos/:childId/sesiones/:sessionId/documentar',
        name: 'documentar-sesion',
        component: () => import('@/views/dashboard/DocumentarSesionView.vue'),
        props: true,
        meta: { breadcrumb: 'Documentar Sesión' }
      },
      
      { 
        path: 'reportes', 
        name: 'reportes', 
        meta: { breadcrumb: 'Reportes' },
        component: () => import('@/views/dashboard/ReportesView.vue') 
      },
      { 
        path: 'configuracion', 
        name: 'configuracion', 
        meta: { breadcrumb: 'Configuración' },
        component: () => import('@/views/dashboard/ConfiguracionView.vue') 
      },
      { 
        path: 'establecimientos', 
        name: 'establecimientos', 
        meta: { breadcrumb: 'Establecimientos' },
        component: () => import('@/views/dashboard/EstablecimientosView.vue') 
      }
    ]
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/errors/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('access')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router