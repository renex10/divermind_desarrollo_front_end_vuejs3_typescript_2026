import { defineStore } from 'pinia'
import { routineReportService } from '@/services/rutinas/routineReportService'
import type { 
  RoutineSummary, 
  IndependenceEvolution, 
  SupportDistribution,
  AIReport 
} from '@/type/rutinas/reports'

// ✅ INTERFACES PARA GRANULARIDAD CLÍNICA
export interface HeatMapData {
  step_id: number;
  step_action: string;
  friction_count: number;
  total_attempts: number;
  friction_rate: number; 
}

export interface TimeEfficiencyData {
  step_action: string;
  avg_estimated_seconds: number;
  avg_real_seconds: number;
  deviation_percentage: number; 
}

export interface ExtendedRoutineSummary extends RoutineSummary {
  avg_deviation_pct: number; 
}

interface RoutineReportsState {
  summary: ExtendedRoutineSummary | null
  evolution: IndependenceEvolution[]
  supportDistribution: SupportDistribution | null
  heatMap: HeatMapData[]
  timeEfficiency: TimeEfficiencyData[]
  aiReports: AIReport[]
  isLoading: boolean
  error: string | null
}

export const useRoutineReportsStore = defineStore('routineReports', {
  // --- ESTADO INICIAL ---
  state: (): RoutineReportsState => ({
    summary: null,
    evolution: [],
    supportDistribution: null,
    heatMap: [],
    timeEfficiency: [],
    aiReports: [],
    isLoading: false,
    error: null
  }),

  // --- GETTERS (Cómputos reactivos del estado) ---
  getters: {
    hasReports: (state) => state.evolution.length > 0 || !!state.summary,
    recentAIInsight: (state) => state.aiReports[0] || null
  },

  // --- ACCIONES (Lógica de negocio y llamadas a API) ---
  actions: {
    /**
     * ✅ CARGA REAL: Obtiene toda la analítica clínica desde el servidor.
     * Ejecuta las peticiones en paralelo para optimizar la carga del Dashboard.
     */
    async fetchAllReports(childId: string | number) {
      this.isLoading = true
      this.error = null
      
      try {
        const [summary, evolution, distribution, aiReports, heatMap, timeEfficiency] = await Promise.all([
          routineReportService.getSummary(childId),
          routineReportService.getIndependenceHistory(childId),
          routineReportService.getSupportDistribution(childId),
          routineReportService.getAIReports(childId),
          routineReportService.getHeatMap(childId),
          routineReportService.getTimeEfficiency(childId)
        ])

        this.summary = summary as ExtendedRoutineSummary
        this.evolution = evolution
        this.supportDistribution = distribution
        this.aiReports = aiReports
        this.heatMap = heatMap
        this.timeEfficiency = timeEfficiency
        
        console.log(`✅ Evidencia clínica sincronizada para el niño ID: ${childId}`)
      } catch (err: any) {
        this.error = 'Error al sincronizar con el servidor de analíticas.'
        console.error('❌ Error en routineReportsStore:', err)
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Limpia el estado de reportes. 
     * Útil al cerrar sesión o cambiar de paciente.
     */
    clearReports() {
      this.summary = null
      this.evolution = []
      this.supportDistribution = null
      this.heatMap = []
      this.timeEfficiency = []
      this.aiReports = []
      this.error = null
    }
  }
})