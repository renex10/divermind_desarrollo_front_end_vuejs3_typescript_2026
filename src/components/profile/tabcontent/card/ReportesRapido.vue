<!-- src/components/profile/tabcontent/card/ReportesRapido.vue -->
<template>
  <div class="reportes-rapidos">
    <h4>Reportes Rápidos</h4>
    <div class="rapidos-grid">
      <button class="btn btn-outline" @click="$emit('generarReporteSesiones')">
        <CalendarIcon class="icon-sm" />
        Sesiones de Terapia
      </button>
      <button class="btn btn-outline" @click="$emit('generarReporteProgreso')">
        <ChartBarIcon class="icon-sm" />
        Progreso General
      </button>
      <button class="btn btn-outline" @click="$emit('generarReporteComportamiento')">
        <FaceSmileIcon class="icon-sm" />
        Comportamiento
      </button>
      <button class="btn btn-outline" @click="$emit('generarReporteMedico')">
        <HeartIcon class="icon-sm" />
        Historial Médico
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CalendarIcon,
  ChartBarIcon,
  FaceSmileIcon,
  HeartIcon
} from '@heroicons/vue/24/outline'

defineEmits<{
  generarReporteSesiones: []
  generarReporteProgreso: []
  generarReporteComportamiento: []
  generarReporteMedico: []
}>()
</script>

<style scoped>
.reportes-rapidos h4 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.rapidos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.btn-outline {
  background: transparent;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-outline:hover {
  background: #f9fafb;
}

.icon-sm {
  width: 1.25rem;
  height: 1.25rem;
}

@media (max-width: 768px) {
  .rapidos-grid {
    grid-template-columns: 1fr;
  }
}
</style>