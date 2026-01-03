// src/services/rutinas/routineReportService.ts

import http from '../http'
import type { 
  RoutineSummary, 
  IndependenceEvolution, 
  SupportDistribution,
  AIReport 
} from '@/type/rutinas/reports'
// Importamos las interfaces de granularidad que definimos en el Store
import type { HeatMapData, TimeEfficiencyData } from '@/store/rutinas/routineReportsStore'

export const routineReportService = {
  /**
   * Obtiene el resumen general de la rutina (KPIs superiores).
   * Endpoint: /seguimiento/ninos/{id}/analiticas/resumen/
   */
  async getSummary(childId: string | number): Promise<RoutineSummary> {
    const { data } = await http.get(`/seguimiento/ninos/${childId}/analiticas/resumen/`);
    return data;
  },

  /**
   * Obtiene el historial para el gráfico de evolución de independencia.
   */
  async getIndependenceHistory(childId: string | number): Promise<IndependenceEvolution[]> {
    const { data } = await http.get(`/seguimiento/ninos/${childId}/analiticas/evolucion/`);
    return data;
  },

  /**
   * Obtiene el desglose de niveles de apoyo para el gráfico de dona.
   */
  async getSupportDistribution(childId: string | number): Promise<SupportDistribution> {
    const { data } = await http.get(`/seguimiento/ninos/${childId}/analiticas/distribucion-apoyos/`);
    return data;
  },

  /**
   * Obtiene los reportes narrativos generados por la IA.
   */
  async getAIReports(childId: string | number): Promise<AIReport[]> {
    const { data } = await http.get(`/seguimiento/ninos/${childId}/analiticas/informes-ia/`);
    return data;
  },

  /**
   * ✅ NUEVA FUNCIÓN: Obtiene el Mapa de Calor (Requerimiento 3)
   * Analiza la frecuencia de 'had_difficulty' por cada paso de la rutina.
   */
  async getHeatMap(childId: string | number): Promise<HeatMapData[]> {
    const { data } = await http.get(`/seguimiento/ninos/${childId}/analiticas/mapa-calor/`);
    return data;
  },

  /**
   * ✅ NUEVA FUNCIÓN: Obtiene la Eficiencia Temporal (Requerimiento 1)
   * Compara el tiempo real registrado contra el estimado del onboarding.
   */
  async getTimeEfficiency(childId: string | number): Promise<TimeEfficiencyData[]> {
    const { data } = await http.get(`/seguimiento/ninos/${childId}/analiticas/eficiencia-tiempos/`);
    return data;
  }
};