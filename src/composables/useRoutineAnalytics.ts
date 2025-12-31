/**
 * COMPOSABLE: useRoutineAnalytics
 * Propósito: Encapsular la lógica de transformación de datos clínicos.
 * Convierte los logs de ejecución en formatos compatibles con Chart.js 
 * y calcula KPIs de independencia automáticamente.
 */

import { computed } from 'vue'
import { useRoutineReportsStore } from '@/store/rutinas/routineReportsStore'

export function useRoutineAnalytics() {
  const reportsStore = useRoutineReportsStore()

  // --- MÉTRICAS DE INDEPENDENCIA ---

  /**
   * Calcula el porcentaje de avance de independencia comparando 
   * el primer registro del mes con el último.
   */
  const independenceGrowth = computed(() => {
    if (reportsStore.evolution.length < 2) return 0
    const first = reportsStore.evolution[0].score
    const last = reportsStore.evolution[reportsStore.evolution.length - 1].score
    return last - first
  })

  /**
   * Determina el color clínico del estado de independencia
   */
  const independenceStatusColor = computed(() => {
    const score = reportsStore.summary?.independence_pct || 0
    if (score >= 80) return 'text-emerald-600'
    if (score >= 50) return 'text-blue-600'
    return 'text-amber-600'
  })

  // --- PROCESAMIENTO PARA GRÁFICOS ---

  /**
   * Transforma la distribución de apoyos en un array simple para Chart.js
   * Siguiendo el orden clínico: Independiente -> Físico
   */
  const supportChartSeries = computed(() => {
    if (!reportsStore.supportDistribution) return []
    const d = reportsStore.supportDistribution
    return [
      d.independent,
      d.verbal_cue,
      d.visual_cue,
      d.gestural_cue,
      d.physical_prompt,
      d.not_completed
    ]
  })

  /**
   * Identifica la emoción predominante al finalizar las rutinas
   * Basado en 'emotional_state_end'
   */
  const predominantEmotion = computed(() => {
    // Aquí podrías implementar una lógica de conteo si el store 
    // tuviera el desglose, o usar el resumen de la IA.
    return reportsStore.summary?.most_difficult_step ? 'Atención Requerida' : 'Estable'
  })

  // --- ACCIONES ---

  const loadAllData = async (childId: number) => {
    await reportsStore.fetchAllReports(childId)
  }

  return {
    // Estado
    reportsStore,
    isLoading: computed(() => reportsStore.isLoading),
    error: computed(() => reportsStore.error),
    
    // Métricas calculadas
    independenceGrowth,
    independenceStatusColor,
    supportChartSeries,
    predominantEmotion,
    
    // Métodos
    loadAllData
  }
}