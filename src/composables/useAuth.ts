// src/composables/useAuth.ts

// =====================================================================

// COMPOSABLE DE AUTENTICACIÓN

// Gestiona el login, logout y estado de autenticación del usuario

// Incluye manejo de roles, tokens JWT y redirección automática

// =====================================================================

 

import { ref, computed } from 'vue'

import { loginApi, logoutApi } from '@/services/authService.ts'

import { useAlertStore } from '@/store/alertStore.ts'

import { useRouter } from 'vue-router'

import type { User } from '@/type/user.ts'

 

// =====================================================================

// ESTADO GLOBAL REACTIVO

// Se inicializa fuera del composable para compartir entre instancias

// =====================================================================

 

// Usuario autenticado (null si no hay sesión)

const user = ref<User | null>(null)

 

// Token JWT de acceso (se recupera de localStorage si existe)

const token = ref<String | null>(localStorage.getItem('access'))

 

// =====================================================================

// FUNCIÓN HELPER: Mapeo de roles del backend al frontend

// =====================================================================

 

/**

 * Convierte los nombres de roles del backend (español) a formato frontend (inglés)

 *

 * Backend envía: ["Terapeuta"] o ["Padres"] o ["Admin"]

 * Frontend necesita: "therapist" | "parent" | "admin"

 *

 * @param rolesArray - Array de roles desde el backend (ej: ["Terapeuta"])

 * @returns Rol mapeado en formato frontend o null si no se puede mapear

 */

function mapRoleFromBackend(rolesArray: string[]): 'parent' | 'therapist' | 'admin' | null {

  // Validar que el parámetro sea un array válido y no vacío

  if (!rolesArray || !Array.isArray(rolesArray) || rolesArray.length === 0) {

    return null

  }

 

  // Tomar el primer rol y convertir a minúsculas para comparación

  const firstRole = rolesArray[0].toLowerCase()

 

  // Mapeo de roles: español → inglés

  if (firstRole.includes('terapeuta')) return 'therapist'

  if (firstRole.includes('padres') || firstRole.includes('parent')) return 'parent'

  if (firstRole.includes('admin')) return 'admin'

 

  // Si no coincide con ningún rol conocido

  return null

}

 

// =====================================================================

// COMPOSABLE PRINCIPAL

// =====================================================================

 

export function useAuth() {

  // Instancias de router y store de alertas

  const router = useRouter()

  const alert = useAlertStore()

 

  // -------------------------------------------------------------------

  // COMPUTED PROPERTIES: Estado de autenticación y roles

  // -------------------------------------------------------------------

 

  /**

   * Indica si el usuario está autenticado

   * Requiere tanto token como datos de usuario

   */

  const isAuthenticated = computed(() => !!token.value && !!user.value)

 

  /**

   * Verifica si el usuario tiene rol de padre/apoderado

   */

  const isParent = computed(() => user.value?.role === 'parent')

 

  /**

   * Verifica si el usuario tiene rol de terapeuta

   */

  const isTherapist = computed(() => user.value?.role === 'therapist')

 

  /**

   * Verifica si el usuario tiene rol de administrador

   */

  const isAdmin = computed(() => user.value?.role === 'admin')

 

  /**

   * Determina la ruta del dashboard según el rol del usuario

   * Retorna la ruta apropiada o login si no hay usuario

   */

  const dashboardRoute = computed(() => {

    // Si no hay usuario autenticado, ir a login

    if (!user.value) return { name: 'login' }

 

    console.log('[useAuth] Determinando ruta para rol:', user.value.role)

 

    // Mapeo de roles a rutas del dashboard

    // IMPORTANTE: Se usa 'path' en lugar de 'name' para evitar problemas de routing

    switch (user.value.role) {

      case 'parent':

        return { path: '/parent' }

      case 'therapist':

        return { path: '/therapist' }

      case 'admin':

        return { path: '/admin' }

      default:

        // Si el rol no es reconocido, mostrar advertencia y redirigir a login

        console.warn('[useAuth] Rol desconocido:', user.value.role)

        return { name: 'login' }

    }

  })

 

  // -------------------------------------------------------------------

  // FUNCIÓN: Limpiar sesión

  // -------------------------------------------------------------------

 

  /**

   * Elimina todos los datos de sesión del localStorage y resetea el estado

   * Se usa en logout y cuando hay errores de autenticación

   */

  const clearSession = () => {

    // Eliminar datos persistidos

    localStorage.removeItem('access')

    localStorage.removeItem('refresh')

    localStorage.removeItem('user')

 

    // Resetear estado reactivo

    user.value = null

    token.value = null

  }

 

  // -------------------------------------------------------------------

  // FUNCIÓN: Login

  // -------------------------------------------------------------------

 

  /**

   * Autentica al usuario con email y contraseña

   *

   * Flujo:

   * 1. Llama al API de login

   * 2. Valida que la respuesta incluya un rol válido

   * 3. Guarda tokens y datos en localStorage

   * 4. Actualiza el estado reactivo

   * 5. Muestra alerta de éxito

   * 6. Redirige al dashboard correspondiente

   *

   * @param email - Correo electrónico del usuario

   * @param password - Contraseña del usuario

   */

  const login = async (email: string, password: string) => {

    try {

      console.log('[useAuth] 🔐 Iniciando login...', { email })

 

      // 1️⃣ LLAMADA AL API

      // loginApi retorna: { access, refresh, user: {...} }

      const response = await loginApi(email, password)

      const { access, refresh, user: userData } = response

 

      console.log('[useAuth] ✅ Respuesta CRUDA del backend:', userData)

 

      // 2️⃣ DETERMINAR Y VALIDAR EL ROL

      // Intentar obtener el rol del campo 'role' (preferido)

      let userRole = userData.role

 

      // FALLBACK: Si no viene 'role', mapearlo desde 'roles[]'
      if (!userRole && userData.roles && Array.isArray(userData.roles)) {
        console.warn('[useAuth] ⚠️ Campo "role" ausente, mapeando desde "roles"...')
        const mappedRole = mapRoleFromBackend(userData.roles)
        if (mappedRole) {
          userRole = mappedRole
        }
        console.log('[useAuth] 🔧 Rol mapeado:', userRole)
      }

 

      // VALIDACIÓN CRÍTICA: Sin rol válido no se puede continuar

      if (!userRole) {

        console.error('[useAuth] ❌ No se pudo determinar el rol:', {

          role: userData.role,

          roles: userData.roles

        })

        alert.error(

          'Error de configuración',

          'Tu cuenta no tiene un rol asignado. Contacta al administrador.'

        )

        clearSession()

        return // Detener ejecución

      }

 

      // 3️⃣ CREAR OBJETO USER COMPLETO

      // Asegurar que el objeto tenga TODOS los campos necesarios

      const completeUserData: User = {

        ...userData,           // Copiar todos los campos del backend

        role: userRole         // ✅ Asegurar que 'role' siempre esté presente

      }

 

      console.log('[useAuth] ✅ Usuario procesado:', {

        username: completeUserData.username,

        email: completeUserData.email,

        role: completeUserData.role,

        roles: completeUserData.roles

      })

 

      // 4️⃣ PERSISTIR EN LOCALSTORAGE

      // Se guarda PRIMERO en localStorage antes de actualizar estado

      // Esto asegura que si hay error, los datos están disponibles

      localStorage.setItem('access', access)

      localStorage.setItem('refresh', refresh)

      localStorage.setItem('user', JSON.stringify(completeUserData))

 

      console.log('[useAuth] 💾 Token guardado (preview):', access.substring(0, 30) + '...')

 

      // 5️⃣ ACTUALIZAR ESTADO REACTIVO

      // Ahora que los datos están persistidos, actualizar el estado de Vue

      token.value = access

      user.value = completeUserData

 

      console.log('[useAuth] ♻️ Estado reactivo actualizado')

 

      // 6️⃣ NOTIFICACIÓN AL USUARIO

      // Mostrar alerta de éxito con nombre del usuario

      alert.success('¡Bienvenido!', `Hola ${completeUserData.name}`)

 

      // 7️⃣ DETERMINAR RUTA DE REDIRECCIÓN

      // Usar el computed property que mapea rol → ruta

      const targetRoute = dashboardRoute.value

      console.log('[useAuth] 🚀 Redirigiendo a:', targetRoute, 'para rol:', completeUserData.role)

 

      // 8️⃣ ESPERAR SINCRONIZACIÓN

      // Delay de 250ms para asegurar que:

      // - localStorage esté completamente actualizado

      // - Los interceptores de Axios puedan leer el nuevo token

      // - El estado reactivo se haya propagado

      await new Promise(resolve => setTimeout(resolve, 250))

 

      // 9️⃣ REDIRECCIÓN FINAL

      // Usar 'replace' en lugar de 'push' para no dejar login en historial

      await router.replace(targetRoute)

 

      console.log('[useAuth] ✅ Login completado exitosamente')

 

    } catch (error: any) {

      // MANEJO DE ERRORES

      console.error('[useAuth] ❌ Error en login:', error)

 

      // Extraer mensaje de error desde diferentes fuentes posibles

      const message =

        error?.response?.data?.detail ||  // Error del backend

        error?.message ||                 // Error de red/Axios

        'Las credenciales son incorrectas'  // Mensaje por defecto

 

      // Mostrar error al usuario

      alert.error('Error de autenticación', message)

 

      // Limpiar cualquier dato parcial que se haya guardado

      clearSession()

    }

  }

 

  // -------------------------------------------------------------------

  // FUNCIÓN: Logout

  // -------------------------------------------------------------------

 

  /**

   * Cierra la sesión del usuario

   *

   * Flujo:

   * 1. Llama al API para invalidar el token en el servidor

   * 2. Limpia los datos locales (siempre, incluso si el API falla)

   * 3. Redirige al login

   */

  const logout = async () => {

    try {

      // Intentar invalidar el token en el servidor

      await logoutApi()

    } catch (error) {

      // Si falla, solo loguear pero continuar con el logout local

      console.error('[useAuth] Error en logout:', error)

      alert.warning('Advertencia', 'Error al cerrar sesión en el servidor')

    } finally {

      // SIEMPRE ejecutar el logout local (aunque el server falle)

      clearSession()

      alert.success('Sesión cerrada', 'Has cerrado sesión correctamente')

 

      // Redirigir al login

      router.push({ name: 'login' })

    }

  }

 

  // -------------------------------------------------------------------

  // FUNCIÓN: Inicializar autenticación

  // -------------------------------------------------------------------

 

  /**

   * Restaura la sesión desde localStorage al cargar la aplicación

   *

   * Se ejecuta:

   * - Al crear el composable (primera vez)

   * - Al recargar la página

   *

   * Valida que:

   * - Existan datos en localStorage

   * - Los datos sean válidos (JSON parseable)

   * - El usuario tenga un rol válido

   */

  const initializeAuth = () => {

    const storedUser = localStorage.getItem('user')

    const storedToken = localStorage.getItem('access')

 

    // Verificar que existan ambos datos

    if (storedUser && storedToken) {

      try {

        // Parsear el JSON del usuario

        const parsedUser = JSON.parse(storedUser)

 

        // VALIDAR/MAPEAR ROL

        let userRole = parsedUser.role

 

        // Si no tiene 'role' pero sí 'roles', mapear automáticamente

        if (!userRole && parsedUser.roles) {

          console.warn('[initializeAuth] ⚠️ Usuario recuperado sin rol, mapeando...')

          userRole = mapRoleFromBackend(parsedUser.roles)

 

          // Actualizar el objeto y re-guardar en localStorage

          parsedUser.role = userRole

          localStorage.setItem('user', JSON.stringify(parsedUser))

        }

 

        // Si aún no hay rol válido, limpiar sesión

        if (!userRole) {

          console.warn('[initializeAuth] ⚠️ No se pudo recuperar rol válido, limpiando sesión')

          clearSession()

          return

        }

 

        // Todo OK: Restaurar el estado

        user.value = parsedUser

        token.value = storedToken

 

        console.log('[initializeAuth] ♻️ Usuario recuperado:', {

          username: parsedUser.username,

          role: parsedUser.role

        })

      } catch (error) {

        // Si hay error al parsear (datos corruptos), limpiar todo

        console.error('[initializeAuth] ❌ Error al parsear user:', error)

        clearSession()

      }

    }

  }

 

  // -------------------------------------------------------------------

  // AUTO-INICIALIZACIÓN

  // Se ejecuta automáticamente al importar el composable

  // -------------------------------------------------------------------

 

  if (!user.value && localStorage.getItem('user')) {

    initializeAuth()

  }

 

  // -------------------------------------------------------------------

  // API PÚBLICA DEL COMPOSABLE

  // -------------------------------------------------------------------

 

  return {

    // Estado

    user,              // Usuario autenticado (reactivo)

    token,             // Token JWT (reactivo)

 

    // Computed properties

    isAuthenticated,   // true si hay sesión válida

    isParent,          // true si es padre/apoderado

    isTherapist,       // true si es terapeuta

    isAdmin,           // true si es administrador

    dashboardRoute,    // Ruta del dashboard según rol

 

    // Métodos

    login,             // Autenticar usuario

    logout,            // Cerrar sesión

    initializeAuth     // Restaurar sesión desde localStorage

  }

}