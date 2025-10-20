import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const routes = [
  // Ruta de login sin layout adicional
  {
    path: '/login',
    name: 'login',
    meta: { requiresAuth: false },
    component: () => import('@/views/auth/LoginView.vue')
  },

  // Rutas protegidas dentro del dashboard
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { 
        path: '', 
        name: 'dashboard', 
        component: () => import('@/views/dashboard/DashboardView.vue') 
      },
      { 
        path: 'ingreso-nna', 
        name: 'ingreso-nna', 
        component: () => import('@/views/dashboard/IngresoNneDashboard.vue') 
      },
      { 
        path: 'histos', 
        name: 'histos', 
        component: () => import('@/views/dashboard/HistosView.vue') 
      },
      // RUTA PARA EL PERFIL DE UN NIÑO
      { 
        path: 'perfil-nino/:id', 
        name: 'perfil-nino', 
        component: () => import('@/views/dashboard/PerfilSeguimientoPersonal.vue'),
        props: true
      },
      // RUTA PARA LA LISTA GENERAL DE TODAS LAS SESIONES
      { 
        path: 'sesiones',
        name: 'sesiones',
        component: () => import('@/views/dashboard/SessionesView.vue') 
      },
      // ✅ RUTA CORREGIDA: Ahora acepta ambos parámetros para ser coherente con la API.
      {
        path: 'ninos/:childId/sesiones/:sessionId/documentar', // Nueva estructura de URL
        name: 'documentar-sesion',
        component: () => import('@/views/dashboard/DocumentarSesionView.vue'),
        props: true
      },
      { 
        path: 'reportes', 
        name: 'reportes', 
        component: () => import('@/views/dashboard/ReportesView.vue') 
      },
      { 
        path: 'configuracion', 
        name: 'configuracion', 
        component: () => import('@/views/dashboard/ConfiguracionView.vue') 
      },
      { 
        path: 'establecimientos', 
        name: 'establecimientos', 
        component: () => import('@/views/dashboard/EstablecimientosView.vue') 
      }
    ]
  },

  // Ruta para páginas no encontradas
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

// Guard global para proteger rutas
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