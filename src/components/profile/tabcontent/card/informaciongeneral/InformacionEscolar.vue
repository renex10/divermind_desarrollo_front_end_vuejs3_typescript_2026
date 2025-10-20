<!-- src/components/profile/tabcontent/card/informaciongeneral/InformacionEscolar.vue -->
<template>
  <div class="info-card">
    <div class="card-header">
      <AcademicCapIcon class="icon-md" />
      <h3>Información Escolar</h3>
    </div>
    <div class="card-body">
      <div class="info-list">
        <div class="info-item">
          <BookOpenIcon class="icon-sm" />
          <div>
            <label>Grado Actual</label>
            <span>{{ schoolData?.current_grade || 'No especificado' }}</span>
          </div>
        </div>
        <div class="info-item">
          <ClockIcon class="icon-sm" />
          <div>
            <label>Jornada Escolar</label>
            <span>{{ schoolData?.school_journey || 'No especificada' }}</span>
          </div>
        </div>
        <div v-if="schoolData?.adaptation_notes" class="info-item">
          <PencilSquareIcon class="icon-sm" />
          <div>
            <label>Notas de Adaptación</label>
            <span class="adaptation-notes">{{ schoolData.adaptation_notes }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  AcademicCapIcon,
  BookOpenIcon,
  ClockIcon,
  PencilSquareIcon
} from '@heroicons/vue/24/outline'

defineProps<{
  schoolData?: any
}>()
</script>

<style scoped>
.adaptation-notes {
  line-height: 1.4;
  font-style: italic;
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