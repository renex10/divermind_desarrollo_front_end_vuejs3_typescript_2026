// src/composables/useLatestUpdate.ts

import { ref, onMounted } from 'vue'
import { fetchLatestSessionUpdate } from '@/services/padres/parentService'
import type { LatestSessionUpdate } from '@/type/parent'
import { useAlertStore } from '@/store/alertStore'

/**
 * Composable para obtener el componente "Última Actualización"
 */
export function useLatestUpdate() {
  const alert = useAlertStore()

  // 1. Estados reactivos
  const latestUpdate = ref<LatestSessionUpdate | null>(null)
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  // 2. Función para cargar los datos
  const loadData = async () => {
    isLoading.value = true
    error.value = null
    try {
      latestUpdate.value = await fetchLatestSessionUpdate()
    } catch (err: any) {
      if (err.response?.status === 404) {
        // Esto es un 404 esperado (sin sesiones), no un error del sistema
        error.value = 'Aún no hay actualizaciones de tu terapeuta.'
        console.log('[useLatestUpdate] No se encontraron actualizaciones (404).')
      } else {
        // Esto es un error real (ej. 500)
        error.value = 'No se pudo cargar la última actualización.'
        alert.error('Error de Red', error.value)
      }
    } finally {
      isLoading.value = false
    }
  }

  // 3. Cargar los datos automáticamente cuando se usa el composable
  onMounted(loadData)

  // 4. Exponer los estados al componente
  return {
    latestUpdate,
    isLoading,
    error
  }
}