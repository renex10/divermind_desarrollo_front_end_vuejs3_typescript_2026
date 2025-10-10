<!-- src\components\forms\multi-step\pasos\Paso7Guardian.vue -->
<template>
  <div class="step-guardian">
    <!-- Header del Paso -->
    <div class="step-header">
      <div class="step-number">7</div>
      <div class="step-title">
        <h2 class="text-2xl font-bold text-gray-900">Consentimiento del Apoderado</h2>
        <p class="text-gray-600 mt-1">Autorización y consentimiento para el tratamiento del niño/niña</p>
      </div>
    </div>

    <!-- Formulario -->
    <FormKit
      type="form"
      id="guardian-form"
      :actions="false"
      v-model="localData"
      @change="handleFormChange"
      :config="{
        classes: {
          form: 'guardian-form-grid'
        }
      }"
    >
      <!-- Grid de Campos -->
      <div class="form-grid">
        <!-- Consentimiento del Apoderado -->
        <div class="form-group col-span-full">
          <FormKit
            type="radio"
            name="guardian_consent"
            label="Consentimiento del Apoderado *"
            :options="consentOptions"
            validation="required"
            :validation-messages="{
              required: 'El consentimiento es obligatorio'
            }"
            :classes="{
              outer: 'formkit-outer',
              legend: 'formkit-legend',
              fieldset: 'formkit-fieldset',
              wrapper: 'formkit-radio-wrapper',
              input: 'formkit-radio-input',
              label: 'formkit-radio-label',
              help: 'formkit-help',
              message: 'formkit-message'
            }"
          />
          <p class="text-xs text-gray-500 mt-2">
            Este consentimiento autoriza el tratamiento y uso de la información del niño/niña 
            de acuerdo con las políticas de privacidad y protección de datos.
          </p>
        </div>

        <!-- Fecha de Consentimiento (condicional) -->
        <div class="form-group" v-if="localData.guardian_consent === 'true'">
          <FormKit
            type="date"
            name="consent_date"
            label="Fecha de Consentimiento *"
            validation="required|date_before:today"
            :validation-messages="{
              required: 'La fecha de consentimiento es obligatoria',
              date_before: 'La fecha no puede ser futura'
            }"
            :classes="{
              outer: 'formkit-outer',
              label: 'formkit-label',
              input: 'formkit-input',
              help: 'formkit-help',
              message: 'formkit-message'
            }"
          />
          <p class="text-xs text-gray-500 mt-1">
            Fecha en que se otorgó el consentimiento
          </p>
        </div>

        <!-- Información sobre el Consentimiento -->
        <div class="form-group col-span-full">
          <div class="consent-info">
            <ShieldCheckIcon class="h-5 w-5 text-green-500" />
            <div class="info-content">
              <h4 class="info-title">Importancia del Consentimiento</h4>
              <ul class="info-list">
                <li>• Autoriza la evaluación e intervención del niño/niña</li>
                <li>• Permite el intercambio de información entre profesionales</li>
                <li>• Garantiza el cumplimiento de las normativas de protección de datos</li>
                <li>• Establece los términos de confidencialidad y uso de información</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Documento de Consentimiento (simulado) -->
        <div class="form-group col-span-full" v-if="showConsentDocument">
          <label class="formkit-label">Documento de Consentimiento</label>
          <div class="consent-document">
            <div class="document-header">
              <DocumentTextIcon class="h-6 w-6 text-blue-500" />
              <h3 class="document-title">Autorización para Evaluación e Intervención</h3>
            </div>
            <div class="document-content">
              <p class="document-text">
                Yo, <strong>apoderado/tutor legal</strong> del niño/niña, autorizo al establecimiento 
                educacional y al equipo de profesionales a:
              </p>
              <ul class="document-list">
                <li>Realizar evaluaciones diagnósticas necesarias</li>
                <li>Aplicar estrategias de intervención y apoyo</li>
                <li>Compartir información relevante entre profesionales del equipo</li>
                <li>Mantener registro de los avances y progresos</li>
                <li>Utilizar la información únicamente con fines educativos y terapéuticos</li>
              </ul>
              <div class="document-footer">
                <p class="document-date" v-if="localData.consent_date">
                  <strong>Fecha de autorización:</strong> {{ formatConsentDate }}
                </p>
                <p class="document-status" :class="consentStatusClass">
                  <strong>Estado:</strong> {{ consentStatusText }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen del Consentimiento -->
        <div class="form-group col-span-full" v-if="showConsentSummary">
          <label class="formkit-label">Resumen del Consentimiento</label>
          <div class="consent-summary">
            <!-- Estado del Consentimiento -->
            <div class="summary-item">
              <div class="summary-icon" :class="consentIconClass">
                <CheckCircleIcon v-if="localData.guardian_consent === 'true'" class="h-5 w-5" />
                <XCircleIcon v-else-if="localData.guardian_consent === 'false'" class="h-5 w-5" />
                <QuestionMarkCircleIcon v-else class="h-5 w-5" />
              </div>
              <div class="summary-content">
                <span class="summary-label">Consentimiento Otorgado:</span>
                <span class="summary-value">{{ consentStatusText }}</span>
                <p class="summary-description" v-if="localData.consent_date">
                  Fecha: {{ formatConsentDate }}
                </p>
              </div>
            </div>

            <!-- Implicancias -->
            <div class="summary-item">
              <InformationCircleIcon class="h-5 w-5 text-blue-500" />
              <div class="summary-content">
                <span class="summary-label">Implicancias:</span>
                <span class="summary-value">
                  {{ consentImplications }}
                </span>
              </div>
            </div>

            <!-- Estado General -->
            <div class="summary-status" :class="overallStatusClass">
              <ShieldExclamationIcon class="h-5 w-5" />
              <span class="status-text">{{ overallStatusText }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Información de Validación -->
      <div class="validation-info" :class="{ 'is-valid': isStepValid }">
        <div class="validation-icon">
          <CheckCircleIcon v-if="isStepValid" class="h-5 w-5" />
          <ExclamationCircleIcon v-else class="h-5 w-5" />
        </div>
        <div class="validation-text">
          <span v-if="isStepValid">✓ Consentimiento registrado correctamente</span>
          <span v-else>⚠ Complete la información de consentimiento</span>
        </div>
      </div>
    </FormKit>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  XCircleIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon,
  ShieldExclamationIcon
} from '@heroicons/vue/24/outline'

// Props y Emits
interface Props {
  formData: {
    guardian_consent: string
    consent_date: string
  }
}

interface Emits {
  (e: 'update:formData', data: Props['formData']): void
  (e: 'validate', isValid: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Datos locales para el formulario
const localData = ref({
  guardian_consent: '',
  consent_date: ''
})

// Opciones para el consentimiento
const consentOptions = {
  'true': 'Sí, otorgo mi consentimiento',
  'false': 'No, no otorgo mi consentimiento'
}

// Display values y estados
const consentStatusText = computed(() => {
  if (localData.value.guardian_consent === 'true') return 'Consentimiento OTORGADO'
  if (localData.value.guardian_consent === 'false') return 'Consentimiento DENEGADO'
  return 'Pendiente de respuesta'
})

const consentIconClass = computed(() => {
  if (localData.value.guardian_consent === 'true') return 'status-approved'
  if (localData.value.guardian_consent === 'false') return 'status-denied'
  return 'status-pending'
})

const consentStatusClass = computed(() => {
  if (localData.value.guardian_consent === 'true') return 'status-approved'
  if (localData.value.guardian_consent === 'false') return 'status-denied'
  return 'status-pending'
})

const formatConsentDate = computed(() => {
  if (!localData.value.consent_date) return 'No especificada'
  
  const date = new Date(localData.value.consent_date)
  return date.toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const consentImplications = computed(() => {
  if (localData.value.guardian_consent === 'true') {
    return 'El niño/niña puede recibir evaluación e intervención completa'
  }
  if (localData.value.guardian_consent === 'false') {
    return 'No se puede proceder con la evaluación e intervención'
  }
  return 'Es necesario el consentimiento para continuar'
})

// Muestra el documento de consentimiento cuando se otorga
const showConsentDocument = computed(() => {
  return localData.value.guardian_consent === 'true'
})

// Muestra el resumen cuando hay datos
const showConsentSummary = computed(() => {
  return localData.value.guardian_consent !== ''
})

// Estado general
const overallStatusText = computed(() => {
  if (localData.value.guardian_consent === 'true') {
    return 'Autorizado para evaluación e intervención'
  }
  if (localData.value.guardian_consent === 'false') {
    return 'No autorizado - Requiere revisión'
  }
  return 'Consentimiento pendiente'
})

const overallStatusClass = computed(() => {
  if (localData.value.guardian_consent === 'true') {
    return 'status-approved'
  }
  if (localData.value.guardian_consent === 'false') {
    return 'status-denied'
  }
  return 'status-pending'
})

// Valida si el paso está completo
const isStepValid = computed(() => {
  // Si otorga consentimiento, la fecha es obligatoria
  if (localData.value.guardian_consent === 'true') {
    return localData.value.consent_date !== ''
  }
  // Si no otorga consentimiento o no ha respondido, el paso no es válido hasta que responda
  return localData.value.guardian_consent !== ''
})

// Maneja cambios en el formulario
const handleFormChange = () => {
  // Si cambia a "No" en consentimiento, limpiar la fecha
  if (localData.value.guardian_consent === 'false') {
    localData.value.consent_date = ''
  }
  
  // Emitir datos actualizados al componente padre
  emit('update:formData', { ...localData.value })
  
  // Emitir estado de validación
  emit('validate', isStepValid.value)
}

// Método para validación externa
const validate = () => {
  emit('validate', isStepValid.value)
  return isStepValid.value
}

// Inicializar con datos del prop
onMounted(() => {
  if (props.formData) {
    localData.value = { ...props.formData }
  }
  
  // Emitir validación inicial
  setTimeout(() => {
    emit('validate', isStepValid.value)
  }, 100)
})

// Watch para cambios en los props (en caso de edición)
watch(() => props.formData, (newData) => {
  if (newData) {
    localData.value = { ...newData }
  }
}, { deep: true, immediate: true })

// Exponer el método validate al componente padre
defineExpose({
  validate
})
</script>

<style scoped>
.step-guardian {
  @apply space-y-6;
}

.step-header {
  @apply flex items-start space-x-4 mb-8 pb-6 border-b border-gray-200;
}

.step-number {
  @apply flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold;
}

.step-title h2 {
  @apply text-2xl font-bold text-gray-900;
}

.step-title p {
  @apply text-gray-600 mt-1;
}

.form-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6;
}

.col-span-full {
  @apply md:col-span-2;
}

.form-group {
  @apply space-y-2;
}

.consent-info {
  @apply flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg;
}

.info-content {
  @apply flex-1;
}

.info-title {
  @apply text-sm font-medium text-green-900 mb-2;
}

.info-list {
  @apply text-sm text-green-700 space-y-1;
}

.consent-document {
  @apply border border-gray-200 rounded-lg overflow-hidden;
}

.document-header {
  @apply bg-blue-50 px-4 py-3 border-b border-blue-200 flex items-center space-x-3;
}

.document-title {
  @apply text-lg font-semibold text-blue-900;
}

.document-content {
  @apply p-4 bg-white;
}

.document-text {
  @apply text-gray-700 mb-4;
}

.document-list {
  @apply space-y-2 mb-4 text-gray-700;
}

.document-list li {
  @apply ml-4;
}

.document-footer {
  @apply pt-4 border-t border-gray-200 space-y-2;
}

.document-date {
  @apply text-sm text-gray-600;
}

.document-status {
  @apply text-sm font-medium;
}

.document-status.status-approved {
  @apply text-green-600;
}

.document-status.status-denied {
  @apply text-red-600;
}

.document-status.status-pending {
  @apply text-yellow-600;
}

.consent-summary {
  @apply space-y-4 p-4 bg-gray-50 border border-gray-200 rounded-lg;
}

.summary-item {
  @apply flex items-start space-x-3;
}

.summary-icon {
  @apply flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center;
}

.summary-icon.status-approved {
  @apply bg-green-100 text-green-600;
}

.summary-icon.status-denied {
  @apply bg-red-100 text-red-600;
}

.summary-icon.status-pending {
  @apply bg-yellow-100 text-yellow-600;
}

.summary-content {
  @apply flex-1 min-w-0;
}

.summary-label {
  @apply block text-sm font-medium text-gray-700;
}

.summary-value {
  @apply block text-sm text-gray-900 mt-1;
}

.summary-description {
  @apply block text-xs text-gray-600 mt-1;
}

.summary-status {
  @apply flex items-center space-x-2 p-3 rounded-lg border text-sm font-medium;
}

.summary-status.status-approved {
  @apply bg-green-50 border-green-200 text-green-800;
}

.summary-status.status-denied {
  @apply bg-red-50 border-red-200 text-red-800;
}

.summary-status.status-pending {
  @apply bg-yellow-50 border-yellow-200 text-yellow-800;
}

.status-text {
  @apply font-medium;
}

.validation-info {
  @apply mt-8 p-4 rounded-lg border flex items-center space-x-3 transition-colors duration-200;
}

.validation-info:not(.is-valid) {
  @apply bg-yellow-50 border-yellow-200 text-yellow-800;
}

.validation-info.is-valid {
  @apply bg-green-50 border-green-200 text-green-800;
}

.validation-icon {
  @apply flex-shrink-0;
}

.validation-text {
  @apply text-sm font-medium;
}
</style>

<style>
/* Estilos globales para FormKit en este componente - CONSISTENTES CON PASOS ANTERIORES */
.guardian-form-grid {
  @apply space-y-6;
}

.formkit-outer {
  @apply mb-0;
}

.formkit-label {
  @apply block text-sm font-medium text-gray-700 mb-2;
}

.formkit-legend {
  @apply block text-sm font-medium text-gray-700 mb-3;
}

.formkit-fieldset {
  @apply space-y-3;
}

.formkit-radio-wrapper {
  @apply flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150;
}

.formkit-radio-input {
  @apply h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300;
}

.formkit-radio-label {
  @apply block text-sm font-medium text-gray-700 cursor-pointer;
}

.formkit-input {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200;
}

.formkit-input:focus {
  @apply ring-2 ring-blue-500 ring-opacity-20;
}

.formkit-input[validation="required"] ~ .formkit-label::after {
  content: " *";
  @apply text-red-500;
}

.formkit-legend[validation="required"]::after {
  content: " *";
  @apply text-red-500;
}

.formkit-message {
  @apply mt-1 text-sm text-red-600;
}

.formkit-help {
  @apply mt-1 text-sm text-gray-500;
}

/* Estados de validación */
.formkit-input[data-invalid="true"] {
  @apply border-red-300 focus:border-red-500 focus:ring-red-500;
}

.formkit-input[data-valid="true"] {
  @apply border-green-300 focus:border-green-500 focus:ring-green-500;
}

/* Estados para radio buttons */
.formkit-radio-wrapper[data-checked="true"] {
  @apply bg-blue-50 border-blue-200;
}

.formkit-radio-input[data-invalid="true"] {
  @apply border-red-300 text-red-600 focus:ring-red-500;
}

/* Placeholder styling */
.formkit-input::placeholder {
  @apply text-gray-400;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .form-grid {
    @apply grid-cols-1 gap-4;
  }
  
  .step-header {
    @apply flex-col space-x-0 space-y-4;
  }
  
  .step-number {
    @apply w-8 h-8 text-base;
  }
  
  .consent-summary {
    @apply p-3;
  }
  
  .summary-item {
    @apply items-start;
  }
  
  .summary-status {
    @apply p-2 text-xs;
  }
  
  .consent-info {
    @apply p-3;
  }
  
  .formkit-radio-wrapper {
    @apply p-2;
  }
  
  .consent-document {
    @apply text-sm;
  }
  
  .document-header {
    @apply px-3 py-2;
  }
  
  .document-content {
    @apply p-3;
  }
}

/* Mejoras para radio buttons */
.formkit-radio-wrapper {
  @apply cursor-pointer;
}

.formkit-radio-input:checked {
  @apply bg-blue-600 border-blue-600;
}
</style>