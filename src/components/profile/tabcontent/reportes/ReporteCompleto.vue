<!-- src/components/profile/tabcontent/card/ReporteCompleto.vue -->
<template>
  <div class="tab-pane">
    <div class="reportes-header">
      <div class="section-title">
        <DocumentChartBarIcon class="icon-lg" />
        <h3>Reportes y Análisis</h3>
      </div>
    </div>

    <!-- ACCIONES PRINCIPALES -->
    <div class="reportes-actions">
      <div class="reporte-card" @click="$emit('generarReporteCompleto')">
        <div class="reporte-icon">
          <DocumentTextIcon class="icon-xl" />
        </div>
        <div class="reporte-content">
          <h4>Reporte Completo</h4>
          <p>Genera un reporte detallado con toda la información del niño</p>
        </div>
        <ArrowRightIcon class="icon-sm" />
      </div>

      <div class="reporte-card" @click="$emit('compararProgreso')">
        <div class="reporte-icon">
          <ChartBarSquareIcon class="icon-xl" />
        </div>
        <div class="reporte-content">
          <h4>Comparar Progreso</h4>
          <p>Analiza la evolución entre diferentes períodos de tiempo</p>
        </div>
        <ArrowRightIcon class="icon-sm" />
      </div>

      <div class="reporte-card" @click="$emit('exportarDatos')">
        <div class="reporte-icon">
          <DocumentArrowDownIcon class="icon-xl" />
        </div>
        <div class="reporte-content">
          <h4>Exportar Datos</h4>
          <p>Exporta toda la información en diferentes formatos</p>
        </div>
        <ArrowRightIcon class="icon-sm" />
      </div>

      <div class="reporte-card" @click="$emit('verDashboard')">
        <div class="reporte-icon">
          <PresentationChartLineIcon class="icon-xl" />
        </div>
        <div class="reporte-content">
          <h4>Dashboard Interactivo</h4>
          <p>Visualiza métricas y tendencias en tiempo real</p>
        </div>
        <ArrowRightIcon class="icon-sm" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  DocumentChartBarIcon,
  DocumentTextIcon,
  ChartBarSquareIcon,
  DocumentArrowDownIcon,
  PresentationChartLineIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'

defineEmits<{
  generarReporteCompleto: []
  compararProgreso: []
  exportarDatos: []
  verDashboard: []
}>()
</script>

<style scoped>
.tab-pane {
  padding: 2rem;
}

.reportes-header {
  margin-bottom: 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title h3 {
  margin: 0;
  color: #1f2937;
}

.reportes-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.reporte-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.reporte-card:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.reporte-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: #dbeafe;
  color: #1e40af;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reporte-content {
  flex: 1;
}

.reporte-content h4 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
}

.reporte-content p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.icon-sm {
  width: 1.25rem;
  height: 1.25rem;
}

.icon-lg {
  width: 2rem;
  height: 2rem;
}

.icon-xl {
  width: 2.5rem;
  height: 2.5rem;
}

@media (max-width: 768px) {
  .tab-pane {
    padding: 1rem;
  }
  
  .reportes-actions {
    grid-template-columns: 1fr;
  }
}
</style>