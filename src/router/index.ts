import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PerfilNinoLayout from '@/views/dashboard/perfil_nino/PerfilNinoLayout.vue'
import { useNinoActivoStore } from '@/store/ninoActivoStore'

/**
 * Componente "cáscara" abstracto.
 * Simplemente renderiza la ruta hija que corresponda.
 * Lo usamos para agrupar la lista de NNA y el perfil de NNA bajo una misma ruta padre.
 */
const RouteShell = { template: '<router-view />' }

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
        meta: { breadcrumb: 'Inicio' },
        component: () => import('@/views/dashboard/DashboardView.vue') 
      },

      // ===================================================================
      // INICIO DE LA REESTRUCTURACIÓN DE GESTIÓN NNA
      // ===================================================================
      {
        // 1. RUTA PADRE (la que está en el sidebar)
        // Mantenemos el path 'ingreso-nna' para no romper enlaces
        path: 'ingreso-nna', 
        name: 'gestion-nna-parent', // Nombre lógico para el grupo
        component: RouteShell, // Usa la cáscara para renderizar hijos
        meta: { breadcrumb: 'Gestión NNA' }, // Breadcrumb padre
        children: [
          {
            // 2. RUTA HIJA (default): La lista de NNA
            path: '', // Se carga por defecto en /ingreso-nna
            name: 'lista-nna', // Este es el nombre que debe usar tu Sidebar
            component: () => import('@/views/dashboard/IngresoNneDashboard.vue')
            // No necesita meta.breadcrumb, usará el del padre
          },
          {
            // 3. RUTA HIJA: El perfil individual del niño
            path: ':id', // Se cargará en /ingreso-nna/:id
            name: 'perfil-nino-layout', // El nombre del layout se mantiene
            component: PerfilNinoLayout,
            props: true,
            meta: { 
              // Breadcrumb dinámico (ahora es hijo de 'Gestión NNA')
              breadcrumb: () => {
                const ninoStore = useNinoActivoStore()
                // Usamos un nombre más corto para que quepa en el breadcrumb
                return ninoStore.hasData 
                  ? ninoStore.nombreNino
                  : 'Perfil del Niño'
              }
            },
            // 4. PESTAÑAS (Hijas del perfil)
            // Estas rutas se mantienen idénticas, ahora están anidadas un nivel más profundo
            children: [
              {
                // Pestaña 1: Resumen
                path: 'resumen', // Cambiado de '' a 'resumen' para ser más explícito
                name: 'perfil-nino-resumen', // TU COMPONENTE TablaDesktopRow YA APUNTA A ESTE NOMBRE, ASÍ QUE SEGUIRÁ FUNCIONANDO
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
      // ===================================================================
      // FIN DE LA REESTRUCTURACIÓN
      // ===================================================================

      { 
        path: 'histos', 
        name: 'histos', 
        meta: { breadcrumb: 'Histos' },
        component: () => import('@/views/dashboard/HistosView.vue') 
        // NOTA: Esta ruta 'histos' podría ser redundante ahora que 'ingreso-nna'
        // contiene la lista. Puedes decidir si mantenerla o eliminarla.
      },

      // RUTA PARA LA LISTA GENERAL DE TODAS LAS SESIONES
      { 
        path: 'sesiones',
        name: 'sesiones',
        meta: { breadcrumb: 'Sesiones (General)' },
        component: () => import('@/views/dashboard/SessionesView.vue') 
      },
      
      // RUTA PARA DOCUMENTAR UNA SESIÓN ESPECÍFICA
      {
        path: 'ninos/:childId/sesiones/:sessionId/documentar',
        name: 'documentar-sesion',
        component: () => import('@/views/dashboard/DocumentarSesionView.vue'),
        props: true,
        meta: { breadcrumb: 'Documentar Sesión' }
      },
      
      // OTRAS RUTAS PRINCIPALES
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

// Guard global para proteger rutas (Sin cambios)
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