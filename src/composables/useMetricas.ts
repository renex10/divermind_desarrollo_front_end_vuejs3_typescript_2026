// src/composables/useMetricas.ts
import { ref, onMounted } from 'vue';
import { metricasService } from '@/services/metricasService';
import { MetricasData } from '@/type/metricas';
import { parseApiError, getUserFriendlyErrorMessage } from '@/exceptions/apiError';

/**
 * Composable para manejar el estado de las métricas del dashboard
 * 
 * Responsabilidades:
 * - Estado reactivo de métricas, loading y error
 * - Lógica de fetching y caching
 * - Manejo de errores usando el sistema existente
 * - Auto-refresh opcional
 */

export function useMetricas() {
  // Estado reactivo
  const metricas = ref<MetricasData | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Carga las métricas desde el servicio
   * 
   * Flujo: metricasService → http.ts → API → Actualiza estado
   */
  const cargarMetricas = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      metricas.value = await metricasService.getMetricasDashboard();
    } catch (err) {
      // Usa el sistema de errores existente de tu aplicación
      const apiError = parseApiError(err);
      error.value = getUserFriendlyErrorMessage(apiError);
      console.error('Error cargando métricas:', apiError);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Recarga las métricas (útil para botón de actualizar)
   */
  const recargarMetricas = async () => {
    await cargarMetricas();
  };

  // Auto-cargar al usar el composable (opcional)
  onMounted(() => {
    cargarMetricas();
  });

  return {
    // Estado
    metricas,
    loading,
    error,
    
    // Acciones
    cargarMetricas,
    recargarMetricas,
  };
}