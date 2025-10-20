<!-- src/components/profile/tabcontent/card/informaciongeneral/InformacionTutor.vue -->
<template>
  <div class="info-card">
    <div class="card-header">
      <UserGroupIcon class="icon-md" />
      <h3>Información del Tutor</h3>
    </div>
    <div class="card-body">
      <div class="info-list">
        <div class="info-item">
          <CheckCircleIcon class="icon-sm" />
          <div>
            <label>Consentimiento del Apoderado</label>
            <span :class="consentClass">{{ guardianData?.guardian_consent }}</span>
          </div>
        </div>
        <div v-if="guardianData?.consent_date" class="info-item">
          <CalendarIcon class="icon-sm" />
          <div>
            <label>Fecha de Consentimiento</label>
            <span>{{ guardianData.consent_date }}</span>
          </div>
        </div>
        
        <!-- Lista de Tutores/Usuarios -->
        <div v-if="guardianData?.usuarios_info?.length > 0" class="tutores-section">
          <h4 class="tutores-title">Tutores Registrados</h4>
          <div class="tutores-list">
            <div v-for="usuario in guardianData.usuarios_info" :key="usuario.id" class="tutor-item">
              <div class="tutor-info">
                <strong>{{ usuario.full_name }}</strong>
                <span class="tutor-email">{{ usuario.email }}</span>
                <span v-if="usuario.rut" class="tutor-rut">RUT: {{ usuario.rut }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-tutores">
          <ExclamationTriangleIcon class="icon-sm" />
          <span>No hay tutores registrados</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  UserGroupIcon,
  CheckCircleIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const props = defineProps<{
  guardianData?: any
}>()

const consentClass = computed(() => 
  props.guardianData?.guardian_consent === 'Sí' ? 'text-green-600' : 'text-red-600'
)
</script>

<style scoped>
.text-green-600 {
  color: #059669;
}

.text-red-600 {
  color: #dc2626;
}

.tutores-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

.tutores-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
}

.tutores-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tutor-item {
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.tutor-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tutor-info strong {
  color: #1f2937;
  font-size: 0.875rem;
}

.tutor-email {
  color: #3b82f6;
  font-size: 0.75rem;
}

.tutor-rut {
  color: #6b7280;
  font-size: 0.75rem;
}

.empty-tutores {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 1rem;
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