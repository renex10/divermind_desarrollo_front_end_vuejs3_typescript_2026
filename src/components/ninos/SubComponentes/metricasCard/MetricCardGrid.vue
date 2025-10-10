<!-- src/components/ninos/SubComponentes/metricasCard/MetricCardGrid.vue -->
<template>
  <section class="metricas-dashboard">
    <!-- Header con título y controles -->
    <div class="metricas-header">
      <h2 class="metricas-title">Resumen Ejecutivo</h2>
      <div class="metricas-controls">
        <button 
          @click="$emit('refresh')" 
          class="refresh-btn"
          :disabled="loading"
        >
          <span class="refresh-icon">🔄</span>
          Actualizar
        </button>
        <div v-if="metricas?.metadata" class="last-update">
          Actualizado: {{ formatLastUpdate(metricas.metadata.ultima_actualizacion) }}
        </div>
      </div>
    </div>

    <!-- Estado de error -->
    <div v-if="error && !loading" class="metricas-error">
      <div class="error-icon">❌</div>
      <div class="error-message">{{ error }}</div>
      <button @click="$emit('refresh')" class="retry-btn">
        Reintentar
      </button>
    </div>

    <!-- Grid de métricas -->
    <div v-else class="metricas-grid">
      <!-- Resumen General -->
      <MetricSummaryCard
        :total-ninos="metricas?.resumen_general.total_ninos ?? 0"
        :loading="loading"
      />
      
      <MetricClinicalCard
        :con-necesidades-especiales="metricas?.resumen_general.con_necesidades_especiales ?? 0"
        :porcentaje-con-nee="metricas?.resumen_general.porcentaje_con_nee ?? 0"
        :loading="loading"
      />
      
      <MetricCard
        titulo="En Programa PIE"
        :valor="metricas?.resumen_general.en_programa_pie ?? 0"
        subtitulo="Con programa activo"
        icono="📊"
        :loading="loading"
      />
      
      <MetricCard
        titulo="Nuevos Este Mes"
        :valor="metricas?.resumen_general.nuevos_este_mes ?? 0"
        subtitulo="Altas recientes"
        icono="🆕"
        tendencia="positiva"
        :loading="loading"
      />

      <!-- Gestión Operativa -->
      <MetricOperationalCard
        :sin-consentimiento="metricas?.gestion_operativa.sin_consentimiento ?? 0"
        :loading="loading"
      />
      
      <MetricCard
        titulo="En Evaluación PIE"
        :valor="metricas?.gestion_operativa.en_evaluacion_pie ?? 0"
        subtitulo="Procesos en curso"
        icono="📋"
        :loading="loading"
      />
      
      <MetricCard
        titulo="Sin Establecimiento"
        :valor="metricas?.gestion_operativa.sin_establecimiento ?? 0"
        subtitulo="Requieren asignación"
        icono="🏫"
        tendencia="negativa"
        :loading="loading"
      />
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="metricas-loading">
      <div class="loading-spinner"></div>
      <p>Cargando métricas...</p>
    </div>
  </section>
</template>

<script setup lang="ts">

import MetricCard from './MetricCard.vue';
import MetricSummaryCard from './MetricSummaryCard.vue';
import MetricClinicalCard from './MetricClinicalCard.vue';
import MetricOperationalCard from './MetricOperationalCard.vue';
import { MetricCardGridProps } from '@/type/metricas';
defineProps<MetricCardGridProps>();
defineEmits<{
  refresh: [];
}>();

// Formatear fecha de última actualización
const formatLastUpdate = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('es-CL');
};
</script>

<style scoped>
.metricas-dashboard {
  margin-bottom: 2rem;
}

.metricas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.metricas-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.metricas-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background: #2563eb;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-icon {
  font-size: 0.875rem;
}

.last-update {
  font-size: 0.75rem;
  color: #6b7280;
}

.metricas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.metricas-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  text-align: center;
  gap: 1rem;
}

.error-icon {
  font-size: 2rem;
}

.error-message {
  color: #dc2626;
  font-weight: 500;
}

.retry-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.retry-btn:hover {
  background: #b91c1c;
}

.metricas-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  gap: 1rem;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .metricas-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .metricas-controls {
    justify-content: space-between;
  }
  
  .metricas-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>