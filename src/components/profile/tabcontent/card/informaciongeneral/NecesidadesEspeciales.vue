<!-- src/components/profile/tabcontent/card/informaciongeneral/NecesidadesEspeciales.vue -->
<template>
  <div class="info-card">
    <div class="card-header">
      <ExclamationTriangleIcon class="icon-md" />
      <h3>Necesidades Especiales</h3>
    </div>
    <div class="card-body">
      <div class="info-list">
        <div class="info-item">
          <CheckCircleIcon class="icon-sm" />
          <div>
            <label>¿Tiene NEE?</label>
            <span :class="needsClass">
              {{ specialNeedsData?.has_special_needs ? 'Sí' : 'No' }}
            </span>
          </div>
        </div>
        <div v-if="specialNeedsData?.has_special_needs" class="info-item">
          <TagIcon class="icon-sm" />
          <div>
            <label>Tipo de NEE</label>
            <span>{{ specialNeedsData?.special_needs_type || 'No especificado' }}</span>
          </div>
        </div>
        <div class="info-item">
          <SparklesIcon class="icon-sm" />
          <div>
            <label>Nivel de Autismo</label>
            <span :class="autismLevelClass">
              {{ specialNeedsData?.autism_level || 'No especificado' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  TagIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const props = defineProps<{
  specialNeedsData?: any
}>()

const needsClass = computed(() => 
  props.specialNeedsData?.has_special_needs ? 'text-green-600' : 'text-gray-500'
)

const autismLevelClass = computed(() => {
  const level = props.specialNeedsData?.autism_level;
  if (!level) return 'text-gray-500';
  
  if (level.includes('Nivel 1')) return 'text-blue-600';
  if (level.includes('Nivel 2')) return 'text-yellow-600';
  if (level.includes('Nivel 3')) return 'text-red-600';
  
  return 'text-gray-600';
})
</script>

<style scoped>
.text-green-600 {
  color: #059669;
}

.text-blue-600 {
  color: #2563eb;
}

.text-yellow-600 {
  color: #d97706;
}

.text-red-600 {
  color: #dc2626;
}

.text-gray-500 {
  color: #6b7280;
}

.text-gray-600 {
  color: #4b5563;
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