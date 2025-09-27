<!-- src/components/forms/multi-step/steps/Step2MedicalInfo.vue - Solución Final -->
<template>
  <div class="step2-medical-info">
    <div class="step-header">
      <h3>🏥 Información Médica y NEE</h3>
      <p>Complete la información de salud y necesidades educativas especiales del niño</p>
    </div>

    <!-- Formulario con FormKit usando v-model directo -->
    <FormKit
      type="form"
      id="medicalInfoForm"
      v-model="internalFormData"
      :actions="false"
      @input="handleFormInput"
      :config="{
        validationVisibility: 'live'
      }"
    >
      <!-- Sección: Necesidades Educativas Especiales -->
      <div class="form-section">
        <h4>🎯 Necesidades Educativas Especiales (NEE)</h4>
        
        <!-- ¿Presenta NEE? -->
        <FormKit
          type="checkbox"
          name="special_needs"
          label="¿El niño presenta Necesidades Educativas Especiales (NEE)?"
          help="Marque esta casilla si el niño tiene diagnóstico de NEE"
        />

        <!-- Campos condicionales para NEE -->
        <div v-if="internalFormData.special_needs" class="conditional-fields">
          <div class="form-grid">
            <!-- Tipo de NEE -->
            <FormKit
              type="select"
              name="special_needs_type"
              label="Tipo de NEE *"
              placeholder="Seleccione el tipo"
              :options="specialNeedsTypeOptions"
              validation="required"
              validation-visibility="live"
              :validation-messages="{
                required: 'El tipo de NEE es requerido cuando se marcan necesidades especiales'
              }"
              help="Clasificación de la necesidad especial"
            />

            <!-- Nivel de Autismo -->
            <FormKit
              type="select"
              name="autism_level_value"
              label="Nivel de Autismo (si aplica)"
              placeholder="Seleccione nivel"
              :options="autismLevelOptions"
              help="Solo si el diagnóstico incluye TEA"
            />

            <!-- Diagnóstico PIE -->
            <FormKit
              type="textarea"
              name="pie_diagnosis"
              label="Diagnóstico PIE *"
              placeholder="Describa el diagnóstico profesional..."
              rows="3"
              validation="required"
              validation-visibility="live"
              :validation-messages="{
                required: 'El diagnóstico es requerido cuando se marcan necesidades especiales'
              }"
              help="Diagnóstico formal realizado por especialista"
            />

            <!-- Fecha Ingreso PIE -->
            <FormKit
              type="date"
              name="pie_entry_date"
              label="Fecha de Ingreso al PIE"
              :max="today"
              validation="date_before:today"
              validation-visibility="live"
              :validation-messages="{
                date_before: 'La fecha no puede ser futura'
              }"
              help="Fecha en que ingresó al Programa de Integración Escolar"
            />

            <!-- Estado PIE -->
            <FormKit
              type="select"
              name="pie_status"
              label="Estado PIE"
              placeholder="Seleccione estado"
              :options="pieStatusOptions"
              help="Estado actual en el programa de integración"
            />
          </div>
        </div>
      </div>

      <!-- Sección: Información Médica General -->
      <div class="form-section">
        <h4>💊 Información Médica General</h4>
        <div class="form-grid">
          <!-- Alergias -->
          <FormKit
            type="textarea"
            name="allergies"
            label="Alergias"
            placeholder="Ej: Alergia a penicilina, polen, alimentos..."
            rows="2"
            validation="length:0,500"
            validation-visibility="live"
            :validation-messages="{
              length: 'El texto no puede exceder 500 caracteres'
            }"
            help="Lista de alergias conocidas"
          />

          <!-- Medicación Actual -->
          <FormKit
            type="textarea"
            name="current_medication"
            label="Medicación Actual"
            placeholder="Ej: Metilfenidato 10mg, 1 tableta al día..."
            rows="2"
            validation="length:0,500"
            validation-visibility="live"
            :validation-messages="{
              length: 'El texto no puede exceder 500 caracteres'
            }"
            help="Medicamentos que está tomando actualmente"
          />

          <!-- Contacto de Emergencia -->
          <FormKit
            type="text"
            name="emergency_contact"
            label="Contacto de Emergencia"
            placeholder="Ej: María González (Madre)"
            validation="length:0,100"
            validation-visibility="live"
            :validation-messages="{
              length: 'El nombre no puede exceder 100 caracteres'
            }"
            help="Persona a contactar en caso de emergencia"
          />

          <!-- Teléfono de Emergencia -->
          <FormKit
            type="tel"
            name="emergency_phone"
            label="Teléfono de Emergencia"
            placeholder="Ej: +56912345678"
            validation="matches:/^(\+?\d{7,15})?$/"
            validation-visibility="live"
            :validation-messages="{
              matches: 'Formato de teléfono inválido'
            }"
            help="Teléfono de contacto de emergencia"
          />
        </div>
      </div>

      <!-- Sección: Información Médica Adicional -->
      <div class="form-section">
        <h4>📝 Información Médica Adicional</h4>
        
        <!-- ¿Ha recibido terapias antes? -->
        <FormKit
          type="checkbox"
          name="previous_therapies"
          label="¿Ha recibido terapias o intervenciones anteriores?"
          help="Marque si el niño ha tenido tratamientos previos"
        />

        <!-- Detalle de terapias previas (condicional) -->
        <div v-if="internalFormData.previous_therapies" class="conditional-fields">
          <FormKit
            type="textarea"
            name="previous_therapies_detail"
            label="Detalle de Terapias Previas *"
            placeholder="Describa los tipos de terapia, duración, resultados..."
            rows="3"
            validation="required"
            validation-visibility="live"
            :validation-messages="{
              required: 'El detalle es requerido cuando se marcan terapias previas'
            }"
            help="Historial de intervenciones terapéuticas"
          />
        </div>

        <!-- Derivación -->
        <div class="form-grid">
          <!-- ¿Quién derivó? -->
          <FormKit
            type="select"
            name="referred_by"
            label="¿Quién derivó al niño?"
            placeholder="Seleccione opción"
            :options="referredByOptions"
            help="Persona o institución que recomendó la evaluación"
          />

          <!-- Detalle de Derivación -->
          <FormKit
            type="text"
            name="referred_by_detail"
            label="Detalle de Derivación"
            placeholder="Ej: Nombre del médico, escuela, etc."
            validation="length:0,100"
            validation-visibility="live"
            :validation-messages="{
              length: 'El detalle no puede exceder 100 caracteres'
            }"
            help="Información específica de quién realizó la derivación"
          />

          <!-- ¿Dónde se atendió previamente? -->
          <FormKit
            type="textarea"
            name="attended_where"
            label="¿Dónde se atendió previamente?"
            placeholder="Ej: Centro de salud familiar, hospital, clínica privada..."
            rows="2"
            validation="length:0,500"
            validation-visibility="live"
            :validation-messages="{
              length: 'El texto no puede exceder 500 caracteres'
            }"
            help="Lugares donde ha recibido atención anteriormente"
          />
        </div>

        <!-- Observaciones Médicas Adicionales -->
        <FormKit
          type="textarea"
          name="medical_notes"
          label="Observaciones Médicas Adicionales"
          placeholder="Otra información médica relevante, condiciones especiales, recomendaciones..."
          rows="4"
          validation="length:0,1000"
          validation-visibility="live"
          :validation-messages="{
            length: 'Las observaciones no pueden exceder 1000 caracteres'
          }"
          help="Cualquier información adicional que considere importante"
        />
      </div>
    </FormKit>

    <!-- Indicador de Validación -->
    <div v-if="showValidation" class="validation-status">
      <div v-if="isValid" class="status-valid">
        ✅ Información médica completa
      </div>
      <div v-else class="status-invalid">
        ⚠️ Complete los campos requeridos condicionales
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NneFormData } from '@/type/nne'
import { ref, reactive, computed, watch, onMounted } from 'vue'


interface Props {
  formData: Partial<NneFormData>
  showValidation?: boolean
}

interface Emits {
  (e: 'update:formData', data: Partial<NneFormData>): void
  (e: 'validate', isValid: boolean): void
}

// Props y Emits
const props = withDefaults(defineProps<Props>(), {
  showValidation: false
})

const emit = defineEmits<Emits>()

// Estado reactivo del formulario interno para FormKit
const internalFormData = reactive<any>({
  special_needs: props.formData.special_needs || false,
  special_needs_type: props.formData.special_needs_type || '',
  autism_level_value: props.formData.autism_level_value || 'no_review',
  pie_diagnosis: props.formData.pie_diagnosis || '',
  pie_entry_date: props.formData.pie_entry_date || '',
  pie_status: props.formData.pie_status || '',
  allergies: props.formData.allergies || '',
  current_medication: props.formData.current_medication || '',
  emergency_contact: props.formData.emergency_contact || '',
  emergency_phone: props.formData.emergency_phone || '',
  previous_therapies: props.formData.previous_therapies || false,
  previous_therapies_detail: props.formData.previous_therapies_detail || '',
  referred_by: props.formData.referred_by || '',
  referred_by_detail: props.formData.referred_by_detail || '',
  attended_where: props.formData.attended_where || '',
  medical_notes: props.formData.medical_notes || ''
})

// Opciones para selects
const specialNeedsTypeOptions = [
  { label: 'Seleccione tipo', value: '', attrs: { disabled: true } },
  { label: 'Permanente', value: 'permanent' },
  { label: 'Transitoria', value: 'temporary' }
]

const autismLevelOptions = [
  { label: 'Sin revisión', value: 'no_review' },
  { label: 'Nivel 1 - Requiere apoyo', value: 'level_1' },
  { label: 'Nivel 2 - Requiere apoyo sustancial', value: 'level_2' },
  { label: 'Nivel 3 - Requiere apoyo muy sustancial', value: 'level_3' },
  { label: 'No aplica', value: 'not_applicable' }
]

const pieStatusOptions = [
  { label: 'Seleccione estado', value: '', attrs: { disabled: true } },
  { label: 'Postulante', value: 'postulant' },
  { label: 'Evaluación', value: 'evaluation' },
  { label: 'Activo', value: 'active' },
  { label: 'Egresado', value: 'graduated' },
  { label: 'Derivado', value: 'referred' }
]

const referredByOptions = [
  { label: 'Seleccione opción', value: '', attrs: { disabled: true } },
  { label: 'Establecimiento Educacional', value: 'school' },
  { label: 'Médico', value: 'doctor' },
  { label: 'Especialista', value: 'specialist' },
  { label: 'Familia', value: 'family' },
  { label: 'Otro', value: 'other' }
]

// Fecha de hoy para validaciones
const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

// Validación del formulario
const isValid = computed(() => {
  let isFormValid = true

  // Validaciones condicionales para NEE
  if (internalFormData.special_needs) {
    if (!internalFormData.special_needs_type || !internalFormData.pie_diagnosis?.trim()) {
      isFormValid = false
    }
  }

  // Validaciones condicionales para terapias previas
  if (internalFormData.previous_therapies) {
    if (!internalFormData.previous_therapies_detail?.trim()) {
      isFormValid = false
    }
  }

  return isFormValid
})

// Manejar input del formulario
const handleFormInput = () => {
  // Limpiar campos condicionales si se desmarcan checkboxes
  if (!internalFormData.special_needs) {
    internalFormData.special_needs_type = ''
    internalFormData.pie_diagnosis = ''
    internalFormData.pie_entry_date = ''
    internalFormData.pie_status = ''
  }

  if (!internalFormData.previous_therapies) {
    internalFormData.previous_therapies_detail = ''
  }

  // Convertir a formato esperado y emitir
  const formattedData: Partial<NneFormData> = {
    special_needs: Boolean(internalFormData.special_needs),
    special_needs_type: internalFormData.special_needs_type || '',
    autism_level_value: internalFormData.autism_level_value || 'no_review',
    pie_diagnosis: internalFormData.pie_diagnosis || '',
    pie_entry_date: internalFormData.pie_entry_date || '',
    pie_status: internalFormData.pie_status || '',
    allergies: internalFormData.allergies || '',
    current_medication: internalFormData.current_medication || '',
    emergency_contact: internalFormData.emergency_contact || '',
    emergency_phone: internalFormData.emergency_phone || '',
    previous_therapies: Boolean(internalFormData.previous_therapies),
    previous_therapies_detail: internalFormData.previous_therapies_detail || '',
    referred_by: internalFormData.referred_by || '',
    referred_by_detail: internalFormData.referred_by_detail || '',
    attended_where: internalFormData.attended_where || '',
    medical_notes: internalFormData.medical_notes || ''
  }

  emit('update:formData', formattedData)
}

// Watch para cambios en la validación
watch(isValid, (newIsValid) => {
  emit('validate', newIsValid)
}, { immediate: true })

// Watch para cambios en los datos del padre
watch(() => props.formData, (newData) => {
  Object.assign(internalFormData, {
    special_needs: newData.special_needs || false,
    special_needs_type: newData.special_needs_type || '',
    autism_level_value: newData.autism_level_value || 'no_review',
    pie_diagnosis: newData.pie_diagnosis || '',
    pie_entry_date: newData.pie_entry_date || '',
    pie_status: newData.pie_status || '',
    allergies: newData.allergies || '',
    current_medication: newData.current_medication || '',
    emergency_contact: newData.emergency_contact || '',
    emergency_phone: newData.emergency_phone || '',
    previous_therapies: newData.previous_therapies || false,
    previous_therapies_detail: newData.previous_therapies_detail || '',
    referred_by: newData.referred_by || '',
    referred_by_detail: newData.referred_by_detail || '',
    attended_where: newData.attended_where || '',
    medical_notes: newData.medical_notes || ''
  })
}, { deep: true, immediate: true })

onMounted(() => {
  handleFormInput()
})
</script>

<style scoped>
.step2-medical-info {
  max-height: 600px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.step-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.step-header h3 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-size: 1.5rem;
}

.step-header p {
  margin: 0;
  color: #6b7280;
  font-size: 1rem;
}

.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.form-section h4 {
  margin: 0 0 1.5rem 0;
  color: #374151;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.conditional-fields {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  border-left: 4px solid #3b82f6;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.validation-status {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 6px;
  font-weight: 500;
}

.status-valid {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.status-invalid {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

/* Estilos FormKit */
:deep(.formkit-outer) {
  margin-bottom: 0;
}

:deep(.formkit-label) {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  display: block;
}

:deep(.formkit-help) {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

:deep(.formkit-messages) {
  list-style: none;
  padding: 0;
  margin: 0.25rem 0 0 0;
}

:deep(.formkit-message) {
  font-size: 0.75rem;
  color: #dc2626;
}

:deep(.formkit-input) {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s;
}

:deep(.formkit-input:focus) {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

:deep(.formkit-input[data-invalid="true"]) {
  border-color: #dc2626;
}

:deep(.formkit-input[data-invalid="true"]:focus) {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

:deep(.formkit-wrapper) {
  margin-bottom: 1rem;
}

:deep(.formkit-fieldset) {
  border: none;
  padding: 0;
  margin: 0;
}

:deep(.formkit-options) {
  list-style: none;
  padding: 0;
  margin: 0;
}

:deep(.formkit-option) {
  margin-bottom: 0.5rem;
}

:deep(.formkit-option input[type="checkbox"]) {
  margin-right: 0.5rem;
}

:deep(textarea.formkit-input) {
  resize: vertical;
  min-height: 80px;
}

/* Responsive */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .form-section {
    padding: 1rem;
  }
  
  .step-header h3 {
    font-size: 1.25rem;
  }
  
  .conditional-fields {
    padding: 1rem;
    margin-top: 1rem;
  }
}

.step2-medical-info::-webkit-scrollbar {
  width: 6px;
}

.step2-medical-info::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.step2-medical-info::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.step2-medical-info::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>

<style>
.formkit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.formkit-actions {
  display: none;
}
</style>