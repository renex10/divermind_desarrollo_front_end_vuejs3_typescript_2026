// src/services/metricasService.ts
import http from './http';
import { MetricasData } from '@/type/metricas';

/**
 * Servicio dedicado para operaciones relacionadas con métricas
 * 
 * Responsabilidades:
 * - Comunicación con endpoints de métricas
 * - Transformación de datos del backend al frontend
 * - Centralización de llamadas API para métricas
 */

export const metricasService = {
  /**
   * Obtiene las métricas del dashboard desde el backend
   * 
   * Flujo: http.ts → API (/ingreso/metricas/) → Transforma respuesta
   */
  async getMetricasDashboard(): Promise<MetricasData> {
    try {
      console.log('📊 Solicitando métricas del dashboard...');
      
      // NOTA: http.ts ya incluye la base URL, solo necesitamos el endpoint relativo
      const response = await http.get('/ingreso/metricas/');
      
      console.log('✅ Métricas recibidas:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error en metricasService:', error);
      throw error; // El error será manejado por el composable
    }
  },

  /**
   * Obtiene métricas con filtros específicos (para futura implementación)
   */
  async getMetricasConFiltros(filtros: any): Promise<MetricasData> {
    // Implementación futura para métricas filtradas
    const response = await http.get('/ingreso/metricas/', { params: filtros });
    return response.data;
  }
};

export default metricasService;