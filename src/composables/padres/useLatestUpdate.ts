// src/composables/padres/useLatestUpdate.ts
import { ref, watch, isRef } from 'vue' // ✅ Importamos isRef
import { fetchLatestSessionUpdate } from '@/services/padres/parentService'
import type { LatestSessionUpdate } from '@/types/parent'
import { useAlertStore } from '@/store/alertStore'

export function useLatestUpdate(childId: any) {
  const alert = useAlertStore()

  const latestUpdate = ref<LatestSessionUpdate | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadData = async (id: number) => {
    // Si no es un número válido, salimos
    if (!id || typeof id !== 'number') return

    isLoading.value = true
    error.value = null
    
    try {
      console.log(`[useLatestUpdate] 🛰️ Solicitando datos para niño ID: ${id}`)
      const data = await fetchLatestSessionUpdate(id)
      latestUpdate.value = data
    } catch (err: any) {
      if (err.response?.status === 404) {
        error.value = 'Aún no hay misiones diarias asignadas.'
        latestUpdate.value = null
      } else {
        error.value = 'No se pudo sincronizar la última actualización.'
        alert.error('Error de Conexión', error.value)
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * ✅ WATCHER CORREGIDO:
   * Extrae el valor de forma segura. Si childId es undefined, retorna null y no explota.
   */
  watch(
    () => {
      // 1. Si childId es undefined o null, devolvemos null
      if (childId === undefined || childId === null) return null
      
      // 2. Si es una función (getter), la ejecutamos
      if (typeof childId === 'function') return childId()
      
      // 3. Si es un Ref de Vue, devolvemos su .value
      if (isRef(childId)) return childId.value
      
      // 4. Si es un valor primitivo, lo devolvemos tal cual
      return childId
    },
    (newId) => {
      // Solo ejecutamos si tenemos un ID real
      if (newId && typeof newId === 'number') {
        loadData(newId)
      }
    },
    { immediate: true }
  )

  return {
    latestUpdate,
    isLoading,
    error,
    refresh: () => {
        // Safe refresh
        const id = isRef(childId) ? childId.value : (typeof childId === 'function' ? childId() : childId);
        if (id) loadData(id);
    }
  }
}