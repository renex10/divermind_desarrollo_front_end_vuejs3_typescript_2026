/* ruta de este archivo es src\composables\useInactivityLogout.ts */
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from './useAuth.ts'
import { useAlertStore } from '@/store/alertStore.ts'


/**
 * Cierra sesión automáticamente tras inactividad del usuario,
 * mostrando un modal de advertencia con contador regresivo.
 * @param timeoutMs Tiempo total de inactividad permitido (ej: 20 min = 1_200_000 ms)
 */
export function useInactivityLogout(timeoutMs = 20 * 60 * 1000) {
  const { logout } = useAuth()
  const alertStore = useAlertStore()

  const showWarningModal = ref(false)
  const countdown = ref(60) // segundos restantes
  let inactivityTimer: number | undefined
  let warningTimer: number | undefined
  let countdownInterval: number | undefined

  const resetTimer = () => {
    clearTimeout(inactivityTimer)
    clearTimeout(warningTimer)
    clearInterval(countdownInterval)

    showWarningModal.value = false
    countdown.value = 60

    // ⚠️ Mostrar advertencia 1 minuto antes de cerrar sesión
    warningTimer = window.setTimeout(() => {
      showWarningModal.value = true
      alertStore.trigger(
        'warning',
        'Inactividad detectada',
        'Tu sesión se cerrará en 1 minuto por inactividad.'
      )

      // ⏳ Iniciar contador regresivo
      countdownInterval = window.setInterval(() => {
        if (countdown.value > 0) {
          countdown.value--
        }
      }, 1000)
    }, timeoutMs - 60 * 1000)

    // ⏹️ Cerrar sesión al cumplirse el tiempo
    inactivityTimer = window.setTimeout(async () => {
      console.warn('[Inactividad] Cerrando sesión por inactividad...')
      await logout()
    }, timeoutMs)
  }

  const keepSessionAlive = () => {
    resetTimer()
  }

  onMounted(() => {
    window.addEventListener('mousemove', resetTimer)
    window.addEventListener('keydown', resetTimer)
    window.addEventListener('click', resetTimer)
    window.addEventListener('scroll', resetTimer)
    resetTimer()
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', resetTimer)
    window.removeEventListener('keydown', resetTimer)
    window.removeEventListener('click', resetTimer)
    window.removeEventListener('scroll', resetTimer)
    clearTimeout(inactivityTimer)
    clearTimeout(warningTimer)
    clearInterval(countdownInterval)
  })

  return {
    showWarningModal,
    keepSessionAlive,
    countdown
  }
}
