<!-- src/components/forms/multi-step/steps/Step4ReviewConsent.vue -->
<template>
  <div class="step4-review-consent">
    <div class="step-header">
      <h3>📋 Revisión y Consentimiento</h3>
      <p>Revise toda la información y otorgue el consentimiento para finalizar el registro</p>
    </div>

    <!-- Resumen de la Información -->
    <div class="review-sections">
      <!-- Sección 1: Datos Básicos -->
      <div class="review-section">
        <h4 @click="toggleSection('basic')" class="section-toggle">
          <span class="toggle-icon">{{ sections.basic ? '▼' : '►' }}</span>
          👶 Datos Básicos del Niño
        </h4>
        <div v-if="sections.basic" class="section-content">
          <div class="review-grid">
            <div class="review-item">
              <label>Nombre completo:</label>
              <span>{{ formData.first_name }} {{ formData.last_name }}</span>
            </div>
            <div class="review-item">
              <label>RUT:</label>
              <span>{{ formData.rut || 'No especificado' }}</span>
            </div>
            <div class="review-item">
              <label>Fecha de nacimiento:</label>
              <span>{{ formatDate(formData.birth_date) }}</span>
            </div>
            <div class="review-item">
              <label>Género:</label>
              <span>{{ getGenderLabel(formData.gender) }}</span>
            </div>
            <div class="review-item">
              <label>Dirección:</label>
              <span>{{ formatAddress() }}</span>
            </div>
            <div class="review-item">
              <label>Establecimiento:</label>
              <span>{{ getEstablishmentLabel(formData.establishment) }}</span>
            </div>
            <div class="review-item">
              <label>Curso/Nivel:</label>
              <span>{{ formData.current_grade || 'No especificado' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección 2: Información Médica -->
      <div class="review-section">
        <h4 @click="toggleSection('medical')" class="section-toggle">
          <span class="toggle-icon">{{ sections.medical ? '▼' : '►' }}</span>
          🏥 Información Médica y NEE
        </h4>
        <div v-if="sections.medical" class="section-content">
          <div class="review-grid">
            <div class="review-item">
              <label>¿Presenta NEE?:</label>
              <span>{{ formData.special_needs ? 'Sí' : 'No' }}</span>
            </div>
            <div v-if="formData.special_needs" class="review-item">
              <label>Tipo de NEE:</label>
              <span>{{ getSpecialNeedsTypeLabel(formData.special_needs_type) }}</span>
            </div>
            <div v-if="formData.special_needs" class="review-item">
              <label>Diagnóstico PIE:</label>
              <span>{{ formData.pie_diagnosis || 'No especificado' }}</span>
            </div>
            <div class="review-item">
              <label>Alergias:</label>
              <span>{{ formData.allergies || 'Ninguna registrada' }}</span>
            </div>
            <div class="review-item">
              <label>Medicación actual:</label>
              <span>{{ formData.current_medication || 'Ninguna' }}</span>
            </div>
            <div class="review-item">
              <label>Contacto emergencia:</label>
              <span>{{ formData.emergency_contact || 'No especificado' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección 3: Padres/Tutores -->
      <div class="review-section">
        <h4 @click="toggleSection('parents')" class="section-toggle">
          <span class="toggle-icon">{{ sections.parents ? '▼' : '►' }}</span>
          👥 Padres/Tutores Asignados
        </h4>
        <div v-if="sections.parents" class="section-content">
          <div v-if="selectedParents.length > 0" class="parents-list">
            <div v-for="parent in selectedParents" :key="parent.id" class="parent-item">
              <div class="parent-avatar">
                {{ getInitials(parent.first_name, parent.last_name) }}
              </div>
              <div class="parent-info">
                <strong>{{ parent.first_name }} {{ parent.last_name }}</strong>
                <div class="parent-details">
                  {{ parent.email }} • {{ parent.rut || 'Sin RUT' }}
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-parents">
            ❌ No se han asignado padres/tutores
          </div>
        </div>
      </div>

      <!-- Sección 4: Consentimiento -->
      <div class="review-section consent-section">
        <h4>✅ Consentimiento del Apoderado</h4>
        <div class="section-content">
          <!-- Formulario de Consentimiento con FormKit usando v-model directo -->
          <FormKit
            type="form"
            id="consentForm"
            v-model="internalConsentData"
            :actions="false"
            @input="handleFormInput"
            :config="{ validationVisibility: 'live' }"
          >
            <div class="consent-grid">
              <!-- Consentimiento -->
              <FormKit
                type="checkbox"
                name="guardian_consent"
                label="Yo, como apoderado legal del niño, otorgo mi consentimiento para el registro y tratamiento de la información proporcionada de acuerdo a la Ley de Protección de Datos Personales."
                validation="required"
                :validation-messages="{
                  required: 'Debe otorgar su consentimiento para continuar'
                }"
                help="Al marcar esta casilla, acepta los términos y condiciones"
              />

              <!-- Fecha de Consentimiento -->
              <FormKit
                type="date"
                name="consent_date"
                label="Fecha de Consentimiento *"
                :max="today"
                validation="required|date_before:today"
                :validation-messages="{
                  required: 'La fecha de consentimiento es obligatoria',
                  date_before: 'La fecha no puede ser futura'
                }"
                help="Fecha en que se otorga el consentimiento"
              />

              <!-- Información de Derivación -->
              <FormKit
                type="select"
                name="referred_by"
                label="¿Quién derivó al niño?"
                :options="referredByOptions"
                help="Persona o institución que recomendó la evaluación"
              />

              <FormKit
                type="text"
                name="referred_by_detail"
                label="Detalle de Derivación"
                placeholder="Nombre específico de quien derivó"
                validation="length:0,100"
                :validation-messages="{
                  length: 'El detalle no puede exceder 100 caracteres'
                }"
              />
            </div>
          </FormKit>

          <!-- Declaración de Veracidad -->
          <div class="truth-declaration">
            <h5>Declaración de Veracidad</h5>
            <p>
              Declaro bajo juramento que la información proporcionada en este formulario es verídica 
              y completa. Comprendo que la información falsa o incompleta puede afectar la calidad 
              de la atención proporcionada al niño.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Resumen de Validación -->
    <div class="validation-summary">
      <div class="summary-header">
        <h4>📊 Resumen de Validación</h4>
      </div>
      <div class="summary-items">
        <div class="summary-item" :class="{ valid: basicDataValid }">
          <span class="status-icon">{{ basicDataValid ? '✅' : '❌' }}</span>
          <span>Datos básicos del niño</span>
        </div>
        <div class="summary-item" :class="{ valid: medicalDataValid }">
          <span class="status-icon">{{ medicalDataValid ? '✅' : '⚠️' }}</span>
          <span>Información médica</span>
        </div>
        <div class="summary-item" :class="{ valid: parentsDataValid }">
          <span class="status-icon">{{ parentsDataValid ? '✅' : '❌' }}</span>
          <span>Padres/tutores asignados</span>
        </div>
        <div class="summary-item" :class="{ valid: consentValid }">
          <span class="status-icon">{{ consentValid ? '✅' : '❌' }}</span>
          <span>Consentimiento del apoderado</span>
        </div>
      </div>
      
      <div v-if="isFormComplete" class="completion-message">
        🎉 ¡Todo listo! Puede proceder con el registro del niño.
      </div>
      <div v-else class="incomplete-message">
        ⚠️ Complete todos los requisitos antes de continuar
      </div>
    </div>

    <!-- Indicador de Validación -->
    <div v-if="showValidation" class="validation-status">
      <div v-if="isValid" class="status-valid">
        ✅ Todos los requisitos están completos
      </div>
      <div v-else class="status-invalid">
        ⚠️ Complete los campos requeridos marcados con *
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch, onMounted } from 'vue'
import type { NneFormData } from '../../../../type/nne'

interface ParentUser {
  id: number
  first_name: string
  last_name: string
  email: string
  rut?: string
}

interface Props {
  formData: Partial<NneFormData>
  selectedParentsData?: ParentUser[]
  showValidation?: boolean
}

interface Emits {
  (e: 'update:formData', data: Partial<NneFormData>): void
  (e: 'validate', isValid: boolean): void
}

// Props y Emits
const props = withDefaults(defineProps<Props>(), {
  showValidation: false,
  selectedParentsData: () => []
})

const emit = defineEmits<Emits>()

// Estado para las secciones expandibles
const sections = reactive({
  basic: true,
  medical: true,
  parents: true
})

// Datos internos para FormKit (evita problemas de tipado)
const internalConsentData = reactive<any>({
  guardian_consent: props.formData.guardian_consent || false,
  consent_date: props.formData.consent_date || '',
  referred_by: props.formData.referred_by || '',
  referred_by_detail: props.formData.referred_by_detail || ''
})

// Opciones para selects
const referredByOptions = [
  { label: 'Seleccione opción', value: '', attrs: { disabled: true } },
  { label: 'Establecimiento Educacional', value: 'school' },
  { label: 'Médico', value: 'doctor' },
  { label: 'Especialista', value: 'specialist' },
  { label: 'Familia', value: 'family' },
  { label: 'Otro', value: 'other' }
]

// Fecha de hoy
const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

// Validaciones de cada sección
const basicDataValid = computed(() => {
  return props.formData.first_name && 
         props.formData.last_name && 
         props.formData.rut && 
         props.formData.birth_date && 
         props.formData.gender
})

const medicalDataValid = computed(() => {
  // La información médica es opcional, pero si hay NEE, debe estar completa
  if (props.formData.special_needs) {
    return props.formData.special_needs_type && props.formData.pie_diagnosis
  }
  return true
})

const parentsDataValid = computed(() => {
  return props.selectedParentsData.length > 0
})

const consentValid = computed(() => {
  return Boolean(internalConsentData.guardian_consent) && 
         Boolean(internalConsentData.consent_date)
})

// Validación general del formulario
const isValid = computed(() => {
  return basicDataValid.value && medicalDataValid.value && 
         parentsDataValid.value && consentValid.value
})

const isFormComplete = computed(() => isValid.value)

// Lista de padres seleccionados
const selectedParents = computed(() => props.selectedParentsData)

// Métodos
const toggleSection = (section: keyof typeof sections) => {
  sections[section] = !sections[section]
}

const formatDate = (dateString: string): string => {
  if (!dateString) return 'No especificada'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-CL')
}

const getGenderLabel = (gender: string): string => {
  const genders: { [key: string]: string } = {
    male: 'Masculino',
    female: 'Femenino',
    other: 'Otro',
    unspecified: 'No especifica'
  }
  return genders[gender] || 'No especificado'
}

const getSpecialNeedsTypeLabel = (type: string): string => {
  const types: { [key: string]: string } = {
    permanent: 'Permanente',
    temporary: 'Transitoria'
  }
  return types[type] || 'No especificado'
}

const formatAddress = (): string => {
  const street = props.formData.street
  const number = props.formData.street_number
  if (!street && !number) return 'No especificada'
  return `${street || ''} ${number ? `#${number}` : ''}`.trim()
}

const getEstablishmentLabel = (establishmentId: number): string => {
  // En una implementación real, esto vendría de una lista de establecimientos
  const establishments: { [key: number]: string } = {
    1: 'Colegio Los Laureles',
    2: 'Escuela Básica Municipal',
    3: 'Jardín Infantil Arcoíris'
  }
  return establishments[establishmentId] || 'No especificado'
}

const getInitials = (firstName: string, lastName: string): string => {
  const first = firstName?.charAt(0) || ''
  const last = lastName?.charAt(0) || ''
  return (first + last).toUpperCase()
}

const handleFormInput = () => {
  // Convertir y emitir los datos en el formato esperado
  const formattedData: Partial<NneFormData> = {
    ...props.formData,
    guardian_consent: Boolean(internalConsentData.guardian_consent),
    consent_date: internalConsentData.consent_date || '',
    referred_by: internalConsentData.referred_by || '',
    referred_by_detail: internalConsentData.referred_by_detail || ''
  }
  
  emit('update:formData', formattedData)
}

// Watch para cambios en la validación
watch(isValid, (newIsValid) => {
  emit('validate', newIsValid)
}, { immediate: true })

// Watch para cambios en los datos del padre
watch(() => props.formData, (newData) => {
  Object.assign(internalConsentData, {
    guardian_consent: newData.guardian_consent || false,
    consent_date: newData.consent_date || '',
    referred_by: newData.referred_by || '',
    referred_by_detail: newData.referred_by_detail || ''
  })
}, { deep: true, immediate: true })

// Watch para cambios en padres seleccionados
watch(() => props.selectedParentsData, () => {
  // Revalidar cuando cambien los padres seleccionados
}, { deep: true })

// Inicializar
onMounted(() => {
  handleFormInput()
})
</script>

<style scoped>
.step4-review-consent {
  max-height: 700px;
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

.review-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.review-section {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.review-section h4 {
  margin: 0;
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
}

.consent-section h4 {
  cursor: default;
  background: #d1fae5;
}

.section-toggle:hover {
  background: #f1f5f9;
}

.toggle-icon {
  font-size: 0.875rem;
  width: 16px;
  text-align: center;
}

.section-content {
  padding: 1.5rem;
}

.review-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.review-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.review-item label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.review-item span {
  color: #6b7280;
  padding: 0.5rem;
  background: #f9fafb;
  border-radius: 4px;
  border-left: 3px solid #3b82f6;
}

.parents-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.parent-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.parent-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.parent-info {
  flex: 1;
}

.parent-info strong {
  display: block;
  margin-bottom: 0.25rem;
}

.parent-details {
  font-size: 0.75rem;
  color: #6b7280;
}

.no-parents {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px dashed #d1d5db;
}

.consent-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.truth-declaration {
  padding: 1rem;
  background: #fffbeb;
  border-radius: 6px;
  border-left: 4px solid #f59e0b;
}

.truth-declaration h5 {
  margin: 0 0 0.5rem 0;
  color: #92400e;
}

.truth-declaration p {
  margin: 0;
  font-size: 0.875rem;
  color: #92400e;
  line-height: 1.5;
}

.validation-summary {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  background: #f8fafc;
}

.summary-header {
  margin-bottom: 1rem;
}

.summary-header h4 {
  margin: 0;
  color: #374151;
}

.summary-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 6px;
  background: white;
  border: 1px solid #e5e7eb;
}

.summary-item.valid {
  border-color: #10b981;
  background: #f0fdf4;
}

.status-icon {
  font-size: 1.125rem;
}

.completion-message {
  background: #d1fae5;
  color: #065f46;
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
}

.incomplete-message {
  background: #fef3c7;
  color: #92400e;
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
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

/* Estilos para FormKit */
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

/* Checkbox personalizado para consentimiento */
:deep(.formkit-option) {
  margin-bottom: 0.5rem;
}

:deep(.formkit-option input[type="checkbox"]) {
  margin-right: 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .review-grid {
    grid-template-columns: 1fr;
  }
  
  .summary-items {
    grid-template-columns: 1fr;
  }
  
  .section-content {
    padding: 1rem;
  }
  
  .step-header h3 {
    font-size: 1.25rem;
  }
}

/* Scrollbar personalizado */
.step4-review-consent::-webkit-scrollbar {
  width: 6px;
}

.step4-review-consent::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.step4-review-consent::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.step4-review-consent::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>

<style>
/* Estilos globales para FormKit */
.formkit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.formkit-actions {
  display: none;
}
</style>