/**
 * ESTE ARCHIVO ES EL "CEREBRO" DE LA ANALÍTICA (FASE 6).
 * * ¿Para qué sirve?
 * Guarda y gestiona todos los reportes de progreso de las rutinas de un niño.
 * Centraliza los datos de independencia, tiempos y sugerencias de la IA para que
 * los gráficos del dashboard se muestren de forma rápida y reactiva.
 */

import { defineStore } from 'pinia'
import { routineReportService } from '@/services/rutinas/routineReportService'
import type { 
  RoutineSummary, 
  IndependenceEvolution, 
  SupportDistribution,
  AIReport 
} from '@/type/rutinas/reports'

interface RoutineReportsState {
  summary: RoutineSummary | null
  evolution: IndependenceEvolution[]
  supportDistribution: SupportDistribution | null
  aiReports: AIReport[]
  isLoading: boolean
  error: string | null
}

export const useRoutineReportsStore = defineStore('routineReports', {
  // --- ESTADO (Los datos que guardamos) ---
  state: (): RoutineReportsState => ({
    summary: null,
    evolution: [],
    supportDistribution: null,
    aiReports: [],
    isLoading: false,
    error: null
  }),

  // --- GETTERS (Acceso rápido a datos calculados) ---
  getters: {
    hasReports: (state) => state.evolution.length > 0 || !!state.summary,
    recentAIInsight: (state) => state.aiReports[0] || null
  },

  // --- ACCIONES (Funciones para traer datos del servidor) ---
  actions: {
    /**
     * Carga todos los reportes necesarios para el Dashboard de una sola vez
     */
    async fetchAllReports(childId: string | number) {
      this.isLoading = true
      this.error = null
      
      try {
        // Ejecutamos todas las peticiones en paralelo para mayor velocidad
        const [summary, evolution, distribution, aiReports] = await Promise.all([
          routineReportService.getSummary(childId),
          routineReportService.getIndependenceHistory(childId),
          routineReportService.getSupportDistribution(childId),
          routineReportService.getAIReports(childId)
        ])

        this.summary = summary
        this.evolution = evolution
        this.supportDistribution = distribution
        this.aiReports = aiReports
        
        console.log(`✅ Reportes cargados exitosamente para el niño ID: ${childId}`)
      } catch (err: any) {
        this.error = 'No se pudieron cargar los informes analíticos.'
        console.error('❌ Error en routineReportsStore:', err)
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Limpia los datos (útil cuando cambiamos de niño en el perfil)
     */
    clearReports() {
      this.summary = null
      this.evolution = []
      this.supportDistribution = null
      this.aiReports = []
      this.error = null
    }
  }
})