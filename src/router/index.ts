// src/router/index.ts
import { createRouter, createWebHistory, type RouteLocationNormalized, type NavigationGuardNext, type RouteRecordRaw } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import ParentLayout from '@/layouts/ParentLayout.vue'

import therapistRoutes from './therapist.routes'
import parentRoutes from './parent.routes'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    role?: 'therapist' | 'parent' | 'admin'
    breadcrumb?: string | (() => string)
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    meta: { requiresAuth: false },
    component: () => import('@/views/auth/LoginView.vue')
  },

  // RUTAS TERAPEUTAS
  {
    path: '/therapist',
    component: DashboardLayout,
    meta: { 
      requiresAuth: true,
      role: 'therapist'
    },
    children: therapistRoutes
  },

  // RUTAS PADRES
  {
    path: '/parent',
    component: ParentLayout,
    meta: { 
      requiresAuth: true,
      role: 'parent'
    },
    children: parentRoutes
  },

  // REDIRECCIÓN RAÍZ
  {
    path: '/',
    redirect: () => {
      const userRole = getUserRole()
      console.log('[Router] Redirigiendo desde /, rol detectado:', userRole)
      
      if (userRole === 'parent') {
        return '/parent'
      } else if (userRole === 'therapist') {
        return '/therapist'
      }
      
      return '/login'
    }
  },

  // 404
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

// 🔥 NAVIGATION GUARD MEJORADO
router.beforeEach((
  to: RouteLocationNormalized, 
  from: RouteLocationNormalized, 
  next: NavigationGuardNext
) => {
  const isAuthenticated = !!localStorage.getItem('access')
  const userRole = getUserRole()

  console.log('[Router Guard] Navegando:', {
    from: from.path,
    to: to.path,
    isAuth: isAuthenticated,
    userRole: userRole,
    requiredRole: to.meta.role
  })

  // 1. Verificar autenticación
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('[Router Guard] ❌ No autenticado, redirigiendo a login')
    return next({ name: 'login' })
  }

  // 2. Si está en login y ya está autenticado
  if (to.name === 'login' && isAuthenticated) {
    console.log('[Router Guard] ✅ Ya autenticado, redirigiendo a dashboard')
    
    if (userRole === 'parent') {
      return next('/parent')
    } else if (userRole === 'therapist') {
      return next('/therapist')
    }
    return next('/therapist')
  }

  // 3. Verificar permisos de rol
  const requiredRole = to.meta.role
  if (requiredRole && userRole && userRole !== requiredRole) {
    console.warn(`[Router Guard] ⚠️ Rol incorrecto. Requerido: ${requiredRole}, Actual: ${userRole}`)
    
    // Redirigir a su dashboard correcto
    if (userRole === 'parent') {
      return next('/parent')
    } else if (userRole === 'therapist') {
      return next('/therapist')
    }
  }

  console.log('[Router Guard] ✅ Permitiendo navegación')
  next()
})

// 🔥 HELPER MEJORADO
function getUserRole(): 'parent' | 'therapist' | 'admin' | null {
  try {
    // 🔥 OPCIÓN 1: Leer desde localStorage 'user'
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      
      // ✅ Buscar en campo 'role' (singular)
      if (user.role) {
        console.log('[getUserRole] ✅ Rol encontrado en user.role:', user.role)
        return user.role
      }
      
      // ✅ Fallback: Buscar en 'roles' (array)
      if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
        const firstRole = user.roles[0]
        const mappedRole = firstRole.toLowerCase().includes('terapeuta') ? 'therapist' :
                          firstRole.toLowerCase().includes('padres') ? 'parent' :
                          firstRole.toLowerCase().includes('admin') ? 'admin' : null
        
        console.log('[getUserRole] ⚠️ Usando roles[0]:', firstRole, '→', mappedRole)
        return mappedRole
      }
    }

    console.warn('[getUserRole] ❌ No se encontró rol en localStorage')
    return null
  } catch (error) {
    console.error('[getUserRole] Error:', error)
    return null
  }
}

export default router