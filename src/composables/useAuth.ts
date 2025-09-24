// src/composables/useAuth.ts
import { loginApi, logoutApi } from '@/services/authService.ts'
import { useAlertStore } from '@/store/alertStore.ts'
import { useRouter } from 'vue-router'

export function useAuth() {
  const router = useRouter()
  const alert = useAlertStore()

  /**
   * Limpia la sesión local (tokens y usuario)
   */
  const clearSession = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('user')
  }

  /**
   * Inicia sesión con email y contraseña
   */
  const login = async (email: string, password: string) => {
    try {
      const { access, refresh, user } = await loginApi(email, password)

      // Guardar tokens y datos del usuario en localStorage
      localStorage.setItem('access', access)
      localStorage.setItem('refresh', refresh)
      localStorage.setItem('user', JSON.stringify(user))

      // Mostrar alerta de éxito (se cierra automáticamente)
      alert.success('¡Bienvenido!', `Hola ${user.name}, has iniciado sesión correctamente`)

      // Redirigir al dashboard usando el nombre de la ruta
      router.push({ name: 'dashboard' })
    } catch (error: any) {
      // Extraer mensaje de error de forma segura
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        'Las credenciales que proporcionaste son incorrectas'

      // Mostrar alerta de error (se mantiene hasta que el usuario la cierre)
      alert.error('Error de autenticación', message)
    }
  }

  /**
   * Cierra sesión del usuario
   */
  const logout = async () => {
    try {
      // Llamada al backend para cerrar sesión (si tu backend invalida el refresh token)
      await logoutApi()
    } catch (error) {
      console.error('Error en logout:', error)
      // Si hay error en el backend, mostrar advertencia pero continuar
      alert.warning(
        'Advertencia', 
        'Hubo un problema al cerrar sesión en el servidor, pero se cerró la sesión local'
      )
    } finally {
      // Siempre limpiar sesión local
      clearSession()

      // Mostrar alerta de cierre de sesión exitoso
      alert.success('Sesión cerrada', 'Has cerrado sesión correctamente')

      // Redirigir al login
      router.push({ name: 'login' })
    }
  }

  return { login, logout }
}