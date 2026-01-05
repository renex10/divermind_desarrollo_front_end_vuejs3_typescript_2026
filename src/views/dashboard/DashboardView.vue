<template>
<!--   src\views\dashboard\DashboardView.vue -->
  <div class="dashboard-view p-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">
      Dashboard Principal
    </h1>

    <p class="text-lg text-gray-600 mb-8">
      Resumen del estado general de la plataforma y los NNA.
    </p>

    <MetricCardGrid 
      :metricas="metricasData"
      :loading="metricasLoading"
      :error="metricasError"
      @refresh="recargarMetricas"
    />
    
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import MetricCardGrid from '@/components/ninos/SubComponentes/metricasCard/MetricCardGrid.vue'
import { useMetricas } from '@/composables/useMetricas'

// ✅ Lógica de métricas AÑADIDA
const { 
  metricas: metricasData, 
  loading: metricasLoading, 
  error: metricasError, 
  cargarMetricas, 
  recargarMetricas 
} = useMetricas()

// ✅ Cargar las métricas al montar este componente
onMounted(() => {
  cargarMetricas()
})
</script>

<style scoped>
/* Puedes agregar estilos específicos para tu dashboard si lo necesitas */
.dashboard-view {
  max-width: 1200px;
  margin: 0 auto;
}
</style>