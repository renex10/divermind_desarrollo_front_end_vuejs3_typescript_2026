<!-- src/components/profile/tabcontent/card/HistorialMedico.vue -->
<template>
  <div class="info-card">
    <div class="card-header">
      <HeartIcon class="icon-md" />
      <h3>Historial Médico</h3>
    </div>
    <div class="card-body">
      <div class="historial-stats">
        <div class="stat-item">
          <span class="stat-number">{{ historialCount }}</span>
          <span class="stat-label">Registros</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ medicamentosCount }}</span>
          <span class="stat-label">Medicamentos</span>
        </div>
      </div>
      <button class="btn btn-outline full-width" @click="$emit('verHistorialCompleto')">
        <EyeIcon class="icon-sm" />
        Ver Historial Completo
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  HeartIcon, 
  EyeIcon 
} from '@heroicons/vue/24/outline'

defineProps<{
  historialCount: number
  medicamentosCount: number
}>()

defineEmits<{
  verHistorialCompleto: []
}>()
</script>

<style scoped>
.info-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  background: #f8fafc;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1.125rem;
  color: #1f2937;
}

.card-body {
  padding: 1.5rem;
}

.historial-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
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

.full-width {
  width: 100%;
  justify-content: center;
}

.icon-md {
  width: 1.5rem;
  height: 1.5rem;
}

.icon-sm {
  width: 1.25rem;
  height: 1.25rem;
}
</style>