<!-- src/components/profile/tabcontent/card/informaciongeneral/RegistroPIE.vue -->
<template>
  <div class="info-card">
    <div class="card-header">
      <ClipboardDocumentCheckIcon class="icon-md" />
      <h3>Registro PIE</h3>
    </div>
    <div class="card-body">
      <div class="info-list">
        <div class="info-item">
          <DocumentTextIcon class="icon-sm" />
          <div>
            <label>Diagnóstico</label>
            <span class="diagnosis-text">{{ pieData?.diagnosis || 'No especificado' }}</span>
          </div>
        </div>
        <div class="info-item">
          <CalendarIcon class="icon-sm" />
          <div>
            <label>Fecha de Ingreso</label>
            <span>{{ pieData?.entry_date || 'No especificada' }}</span>
          </div>
        </div>
        <div class="info-item">
          <StatusOnlineIcon class="icon-sm" />
          <div>
            <label>Estado</label>
            <span :class="statusClass">{{ pieData?.status || 'No especificado' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
  CalendarIcon,
} from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const props = defineProps<{
  pieData?: any
}>()

const statusClass = computed(() => {
  const status = props.pieData?.status;
  if (status === 'Activo') return 'text-green-600';
  if (status === 'Inactivo') return 'text-red-600';
  return 'text-gray-600';
})
</script>

<style scoped>
.text-green-600 {
  color: #059669;
}

.text-red-600 {
  color: #dc2626;
}

.text-gray-600 {
  color: #4b5563;
}

.diagnosis-text {
  line-height: 1.4;
}

/* Mantener estilos base de la tarjeta */
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

.info-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.info-item label {
  font-size: 0.875rem;
  color: #6b7280;
  display: block;
  margin-bottom: 0.25rem;
}

.info-item span {
  font-weight: 500;
  color: #1f2937;
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