<!-- src/components/profile/tabcontent/card/RegistroDiagnostico.vue -->
<template>
  <div class="info-card">
    <div class="card-header">
      <ClipboardDocumentListIcon class="icon-md" />
      <h3>Diagnósticos</h3>
    </div>
    <div class="card-body">
      <div class="diagnosticos-list">
        <div v-if="diagnosticos.length === 0" class="empty-state">
          <ExclamationTriangleIcon class="icon-lg" />
          <p>No hay diagnósticos registrados</p>
        </div>
        <div v-else class="diagnostico-item" v-for="diagnostico in diagnosticos" :key="diagnostico.id">
          <div class="diagnostico-type" :class="diagnostico.type">
            {{ diagnostico.type }}
          </div>
          <div class="diagnostico-desc">{{ diagnostico.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  ClipboardDocumentListIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/vue/24/outline'

defineProps<{
  diagnosticos: any[]
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

.diagnostico-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.diagnostico-item:last-child {
  border-bottom: none;
}

.diagnostico-type {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  margin-bottom: 0.5rem;
}

.diagnostico-type.primary {
  background: #fef3c7;
  color: #92400e;
}

.diagnostico-type.secondary {
  background: #dbeafe;
  color: #1e40af;
}

.diagnostico-desc {
  color: #374151;
  font-size: 0.875rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.icon-md {
  width: 1.5rem;
  height: 1.5rem;
}

.icon-lg {
  width: 2rem;
  height: 2rem;
}
</style>