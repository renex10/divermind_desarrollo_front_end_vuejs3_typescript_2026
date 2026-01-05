import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchLatestSessionUpdate } from '@/services/padres/parentService'
// Asegúrate de importar las interfaces actualizadas
import type { LatestSessionUpdate, TimelineEvent } from '@/types/parent'

export const useParentReportsStore = defineStore('parentReports', () => {
  // --- ESTADO ---
  const latestUpdate = ref<LatestSessionUpdate | null>(null)
  
  // ✅ NUEVO ESTADO: Aquí guardaremos la lista para el Timeline
  const timelineEvents = ref<TimelineEvent[]>([])
  
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // --- ACCIONES ---
  const fetchLatestUpdate = async (childId: number) => {
    if (!childId || typeof childId !== 'number') return;

    try {
      isLoading.value = true
      error.value = null
      
      const data = await fetchLatestSessionUpdate(childId)
      
      latestUpdate.value = data
      
      // ✅ ASIGNACIÓN: Extraemos los eventos si vienen en la respuesta
      // Si el backend no los manda aún, ponemos un array vacío para no romper la UI
      timelineEvents.value = data.timeline_events || []
      
    } catch (err: any) {
      console.error("[parentReportsStore] ❌ Error:", err)
      error.value = err.response?.data?.detail || err.message || "Error al sincronizar datos"
      latestUpdate.value = null
      timelineEvents.value = [] // Limpiamos en caso de error
    } finally {
      isLoading.value = false
    }
  }

  const clearStore = () => {
    latestUpdate.value = null
    timelineEvents.value = [] // ✅ Limpiamos también el timeline
    error.value = null
    isLoading.value = false
  }

  return {
    latestUpdate,
    timelineEvents, // ✅ EXPORTAMOS LA VARIABLE PARA QUE LA VISTA LA VEA
    isLoading,
    error,
    fetchLatestUpdate,
    clearStore
  }
})