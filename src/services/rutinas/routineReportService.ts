/**
 * src/services/rutinas/routineReportService.ts
 * -------------------------------------------------------------------------
 * Servicio para la obtención de métricas y analítica clínica de rutinas.
 * Conecta con los endpoints de reporte del terapeuta.
 * -------------------------------------------------------------------------
 */

import http from '../http'
import type { 
  RoutineSummary, 
  IndependenceEvolution, 
  SupportDistribution,
  AIReport 
} from '@/type/rutinas/reports'

export const routineReportService = {
  
  /**
   * Obtiene el resumen general (total de ejecuciones, rating, etc.)
   * Endpoint: http://127.0.0.1:8000/api/seguimiento/v1/terapeuta/reportes/{id}/summary/
   */
  async getSummary(childId: string | number): Promise<RoutineSummary> {
    // Agregamos /seguimiento para que coincida con el router de Django
    const response = await http.get<RoutineSummary>(`/seguimiento/v1/terapeuta/reportes/${childId}/summary/`)
    return response.data
  },

  /**
   * Obtiene el historial de independencia para el gráfico de líneas
   * Endpoint: http://127.0.0.1:8000/api/seguimiento/v1/terapeuta/reportes/{id}/independence-history/
   */
  async getIndependenceHistory(childId: string | number): Promise<IndependenceEvolution[]> {
    const response = await http.get<IndependenceEvolution[]>(`/seguimiento/v1/terapeuta/reportes/${childId}/independence-history/`)
    return response.data
  },

  /**
   * Obtiene el desglose de niveles de apoyo para el gráfico de dona
   * Endpoint: http://127.0.0.1:8000/api/seguimiento/v1/terapeuta/reportes/{id}/support-distribution/
   */
  async getSupportDistribution(childId: string | number): Promise<SupportDistribution> {
    const response = await http.get<SupportDistribution>(`/seguimiento/v1/terapeuta/reportes/${childId}/support-distribution/`)
    return response.data
  },

  /**
   * Obtiene los informes de insights generados por la IA
   * Endpoint: http://127.0.0.1:8000/api/seguimiento/v1/terapeuta/reportes/{id}/ai-insights/
   */
  async getAIReports(childId: string | number): Promise<AIReport[]> {
    const response = await http.get<AIReport[]>(`/seguimiento/v1/terapeuta/reportes/${childId}/ai-insights/`)
    return response.data
  }
}