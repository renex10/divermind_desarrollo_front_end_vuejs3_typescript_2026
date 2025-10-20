<!-- src/components/profile/tabcontent/card/informaciongeneral/InformacionMedica.vue -->
<template>
  <div class="info-card">
    <div class="card-header">
      <HeartIcon class="icon-md" />
      <h3>Información Médica</h3>
    </div>
    <div class="card-body">
      <div class="info-list">
        <div class="info-item">
          <ExclamationTriangleIcon class="icon-sm" />
          <div>
            <label>Alergias</label>
            <span :class="allergiesClass">{{ medicalData?.allergies }}</span>
          </div>
        </div>
        <div class="info-item">
          <ClipboardDocumentCheckIcon class="icon-sm" />
          <div>
            <label>Medicación Actual</label>
            <span :class="medicationClass">{{ medicalData?.current_medication }}</span>
          </div>
        </div>
        <div class="info-item">
          <PhoneIcon class="icon-sm" />
          <div>
            <label>Contacto Emergencia</label>
            <span>{{ medicalData?.emergency_contact || 'No especificado' }}</span>
          </div>
        </div>
        <div class="info-item">
          <DevicePhoneMobileIcon class="icon-sm" />
          <div>
            <label>Teléfono Emergencia</label>
            <span class="phone-number">{{ medicalData?.emergency_phone || 'No especificado' }}</span>
          </div>
        </div>
        <div v-if="medicalData?.medical_notes" class="info-item">
          <DocumentTextIcon class="icon-sm" />
          <div>
            <label>Notas Médicas</label>
            <span class="medical-notes">{{ medicalData.medical_notes }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  HeartIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentCheckIcon,
  PhoneIcon,
  DevicePhoneMobileIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const props = defineProps<{
  medicalData?: any
}>()

const allergiesClass = computed(() => 
  props.medicalData?.has_allergies ? 'text-red-600' : 'text-green-600'
)

const medicationClass = computed(() => 
  props.medicalData?.has_medication ? 'text-yellow-600' : 'text-green-600'
)
</script>

<style scoped>
.text-red-600 {
  color: #dc2626;
}

.text-yellow-600 {
  color: #d97706;
}

.text-green-600 {
  color: #059669;
}

.phone-number {
  font-family: monospace;
  font-weight: 600;
}

.medical-notes {
  line-height: 1.4;
  font-style: italic;
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