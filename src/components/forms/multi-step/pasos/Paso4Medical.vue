<!-- src\components\forms\multi-step\pasos\Paso4Medical.vue -->
<template>
  <div class="step-medical">
    <!-- Header del Paso -->
    <div class="step-header">
      <div class="step-number">4</div>
      <div class="step-title">
        <h2 class="text-2xl font-bold text-gray-900">Perfil Médico</h2>
        <p class="text-gray-600 mt-1">Información de salud y contacto de emergencia</p>
      </div>
    </div>

    <!-- Formulario -->
    <FormKit
      type="form"
      id="medical-form"
      :actions="false"
      v-model="formDataRaw"
      @input="handleFormInput"
    >
      <!-- Grid de Campos -->
      <div class="form-grid">
        <!-- Alergias -->
        <div class="form-group col-span-full">
          <FormKit
            type="textarea"
            name="allergies"
            label="Alergias"
            placeholder="Describa las alergias conocidas (alimentarias, medicamentos, ambientales, etc.)"
            :rows="3"
          />
          <div class="text-xs text-gray-500 mt-1">
            Ej: Penicilina, frutos secos, polvo, etc. Dejar vacío si no hay alergias conocidas.
          </div>
        </div>

        <!-- Medicación Actual -->
        <div class="form-group col-span-full">
          <FormKit
            type="textarea"
            name="current_medication"
            label="Medicación Actual"
            placeholder="Describa la medicación que está tomando actualmente"
            :rows="3"
          />
          <div class="text-xs text-gray-500 mt-1">
            Incluya dosis y frecuencia si es conocido. Dejar vacío si no toma medicación.
          </div>
        </div>

        <!-- Contacto de Emergencia -->
        <div class="form-group">
          <FormKit
            type="text"
            name="emergency_contact"
            label="Contacto de Emergencia *"
            placeholder="Nombre y parentesco del contacto"
            validation="required|length:2,100"
            :validation-messages="{
              required: 'El contacto de emergencia es obligatorio',
              length: 'El contacto debe tener entre 2 y 100 caracteres'
            }"
          />
          <div class="text-xs text-gray-500 mt-1">
            Ej: María González (Madre)
          </div>
        </div>

        <!-- Teléfono de Emergencia -->
        <div class="form-group">
          <FormKit
            type="tel"
            name="emergency_phone"
            label="Teléfono de Emergencia *"
            placeholder="+56 9 1234 5678"
            validation="required|length:8,20"
            :validation-messages="{
              required: 'El teléfono de emergencia es obligatorio',
              length: 'El teléfono debe tener entre 8 y 20 caracteres'
            }"
          />
          <div class="text-xs text-gray-500 mt-1">
            Formato: +56 9 1234 5678 o 912345678
          </div>
        </div>

        <!-- Observaciones Médicas -->
        <div class="form-group col-span-full">
          <FormKit
            type="textarea"
            name="medical_notes"
            label="Observaciones Médicas Adicionales"
            placeholder="Otra información médica relevante (condiciones crónicas, cirugías previas, etc.)"
            :rows="4"
          />
          <div class="text-xs text-gray-500 mt-1">
            Información adicional que considere importante para el cuidado del niño
          </div>
        </div>

        <!-- Resumen Médico -->
        <div class="form-group col-span-full" v-if="showMedicalSummary">
          <label class="formkit-label">Resumen Médico</label>
          <div class="medical-summary">
            <!-- Alergias -->
            <div class="summary-item" v-if="localData.allergies">
              <ExclamationTriangleIcon class="h-5 w-5 text-red-500" />
              <div class="summary-content">
                <span class="summary-label">Alergias:</span>
                <span class="summary-value">{{ localData.allergies }}</span>
              </div>
            </div>

            <!-- Medicación -->
            <div class="summary-item" v-if="localData.current_medication">
              <ClipboardIcon class="h-5 w-5 text-blue-500" />
              <div class="summary-content">
                <span class="summary-label">Medicación Actual:</span>
                <span class="summary-value">{{ localData.current_medication }}</span>
              </div>
            </div>

            <!-- Contacto de Emergencia -->
            <div class="summary-item" v-if="localData.emergency_contact || localData.emergency_phone">
              <PhoneIcon class="h-5 w-5 text-green-500" />
              <div class="summary-content">
                <span class="summary-label">Contacto Emergencia:</span>
                <span class="summary-value">
                  {{ localData.emergency_contact }}
                  <span v-if="localData.emergency_phone" class="block text-sm text-gray-600">
                    📞 {{ formatPhoneNumber(localData.emergency_phone) }}
                  </span>
                </span>
              </div>
            </div>

            <!-- Observaciones -->
            <div class="summary-item" v-if="localData.medical_notes">
              <DocumentTextIcon class="h-5 w-5 text-purple-500" />
              <div class="summary-content">
                <span class="summary-label">Observaciones:</span>
                <span class="summary-value">{{ localData.medical_notes }}</span>
              </div>
            </div>

            <!-- Estado General -->
            <div class="summary-status" :class="medicalStatusClass">
              <ShieldCheckIcon class="h-5 w-5" />
              <span class="status-text">{{ medicalStatusText }}</span>
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
          <span v-if="isStepValid">✓ Información médica completa</span>
          <span v-else>⚠ Complete los campos de contacto de emergencia marcados con *</span>
        </div>
      </div>

      <!-- Panel de Debug (solo desarrollo) -->
      <div v-if="showDebug" class="debug-panel mt-4 p-4 bg-gray-100 rounded-lg">
        <h4 class="font-bold mb-2">🐛 Debug Info Paso 4:</h4>
        <p><strong>Allergies:</strong> "{{ localData.allergies }}"</p>
        <p><strong>Current Medication:</strong> "{{ localData.current_medication }}"</p>
        <p><strong>Emergency Contact:</strong> "{{ localData.emergency_contact }}"</p>
        <p><strong>Emergency Phone:</strong> "{{ localData.emergency_phone }}"</p>
        <p><strong>Medical Notes:</strong> "{{ localData.medical_notes }}"</p>
        <p><strong>Step Valid:</strong> {{ isStepValid }}</p>
        <p><strong>Raw Form Data:</strong> {{ formDataRaw }}</p>
      </div>
    </FormKit>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  ClipboardIcon,
  PhoneIcon,
  DocumentTextIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'

// Interfaces
interface MedicalData {
  allergies: string
  current_medication: string
  emergency_contact: string
  emergency_phone: string
  medical_notes: string
}

interface Props {
  formData: MedicalData
}

interface Emits {
  (e: 'update:formData', data: MedicalData): void
  (e: 'validate', isValid: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Estado local del formulario
const localData = ref<MedicalData>({
  allergies: '',
  current_medication: '',
  emergency_contact: '',
  emergency_phone: '',
  medical_notes: ''
})

const formDataRaw = ref<any>({})
const showDebug = ref(import.meta.env.DEV) // Solo mostrar debug en desarrollo

// Muestra el resumen cuando hay datos médicos
const showMedicalSummary = computed(() => {
  return localData.value.allergies || 
         localData.value.current_medication || 
         localData.value.emergency_contact ||
         localData.value.emergency_phone ||
         localData.value.medical_notes
})

// Estado médico general
const medicalStatusText = computed(() => {
  if (localData.value.allergies || localData.value.current_medication) {
    return 'Información médica importante registrada'
  }
  if (localData.value.emergency_contact && localData.value.emergency_phone) {
    return 'Contactos de emergencia registrados'
  }
  return 'Sin información médica específica'
})

const medicalStatusClass = computed(() => {
  if (localData.value.allergies || localData.value.current_medication) {
    return 'status-important'
  }
  if (localData.value.emergency_contact && localData.value.emergency_phone) {
    return 'status-ok'
  }
  return 'status-neutral'
})

// Valida si el paso está completo (solo contacto de emergencia es obligatorio)
const isStepValid = computed(() => {
  const isValid = Boolean(
    localData.value.emergency_contact && 
    localData.value.emergency_contact.trim().length >= 2 && 
    localData.value.emergency_phone && 
    localData.value.emergency_phone.trim().length >= 8
  )
  
  console.log('🔍 Validación Paso 4 - Médico:', {
    emergency_contact: localData.value.emergency_contact?.length,
    emergency_phone: localData.value.emergency_phone?.length,
    isValid
  })
  
  return isValid
})

// Formatea el número de teléfono para mejor visualización
const formatPhoneNumber = (phone: string) => {
  if (!phone) return ''
  
  // Remover todos los caracteres no numéricos excepto el +
  const cleaned = phone.replace(/[^\d+]/g, '')
  
  // Formatear según el patrón chileno
  if (cleaned.startsWith('+56') && cleaned.length === 12) {
    return `+${cleaned.slice(1, 3)} ${cleaned.slice(3, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8)}`
  } else if (cleaned.startsWith('56') && cleaned.length === 11) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`
  } else if (cleaned.startsWith('9') && cleaned.length === 9) {
    return `+56 ${cleaned.slice(0, 1)} ${cleaned.slice(1, 5)} ${cleaned.slice(5)}`
  }
  
  return phone
}

// ✅ MANEJO DE INPUT DEL FORMULARIO MEJORADO
const handleFormInput = (rawData: any) => {
  console.log('📝 Input del formulario Paso 4 (raw):', rawData)
  
  // Procesar datos del formulario
  const processedData: MedicalData = {
    allergies: rawData.allergies || '',
    current_medication: rawData.current_medication || '',
    emergency_contact: rawData.emergency_contact || '',
    emergency_phone: rawData.emergency_phone || '',
    medical_notes: rawData.medical_notes || ''
  }
  
  console.log('🔄 Datos procesados Paso 4:', processedData)
  
  // Actualizar datos locales
  localData.value = processedData
  
  // Emitir cambios al padre
  emit('update:formData', processedData)
  
  // Emitir validación
  emit('validate', isStepValid.value)
}

// Método para validación externa
const validate = () => {
  const isValid = isStepValid.value
  console.log('🔍 Validación forzada Paso 4:', isValid)
  emit('validate', isValid)
  return isValid
}

// ✅ INICIALIZACIÓN MEJORADA
onMounted(() => {
  console.log('🚀 Paso 4 - Médico montado con datos iniciales:', props.formData)
  
  // Cargar datos iniciales del formulario
  if (props.formData) {
    localData.value = {
      allergies: props.formData.allergies || '',
      current_medication: props.formData.current_medication || '',
      emergency_contact: props.formData.emergency_contact || '',
      emergency_phone: props.formData.emergency_phone || '',
      medical_notes: props.formData.medical_notes || ''
    }
    
    // Sincronizar datos crudos para FormKit
    formDataRaw.value = {
      allergies: props.formData.allergies || '',
      current_medication: props.formData.current_medication || '',
      emergency_contact: props.formData.emergency_contact || '',
      emergency_phone: props.formData.emergency_phone || '',
      medical_notes: props.formData.medical_notes || ''
    }
  }
  
  // Emitir validación inicial después de un pequeño delay
  setTimeout(() => {
    const isValid = isStepValid.value
    console.log('📢 Validación inicial Paso 4:', isValid)
    emit('validate', isValid)
  }, 100)
})

// Watch para cambios en los props (en caso de edición)
watch(() => props.formData, (newData) => {
  if (newData) {
    const currentStr = JSON.stringify(localData.value)
    const newStr = JSON.stringify(newData)
    
    if (currentStr !== newStr) {
      console.log('📥 Actualización desde padre Paso 4:', newData)
      
      // Actualizar datos locales
      localData.value = {
        allergies: newData.allergies || '',
        current_medication: newData.current_medication || '',
        emergency_contact: newData.emergency_contact || '',
        emergency_phone: newData.emergency_phone || '',
        medical_notes: newData.medical_notes || ''
      }
      
      // Sincronizar datos crudos para FormKit
      formDataRaw.value = {
        allergies: newData.allergies || '',
        current_medication: newData.current_medication || '',
        emergency_contact: newData.emergency_contact || '',
        emergency_phone: newData.emergency_phone || '',
        medical_notes: newData.medical_notes || ''
      }
    }
  }
}, { deep: true })

// Exponer el método validate al componente padre
defineExpose({
  validate
})
</script>

<style scoped>
.step-medical {
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

.medical-summary {
  @apply space-y-4 p-4 bg-gray-50 border border-gray-200 rounded-lg;
}

.summary-item {
  @apply flex items-start space-x-3;
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

.summary-status {
  @apply flex items-center space-x-2 p-3 rounded-lg border text-sm font-medium;
}

.status-important {
  @apply bg-red-50 border-red-200 text-red-800;
}

.status-ok {
  @apply bg-green-50 border-green-200 text-green-800;
}

.status-neutral {
  @apply bg-gray-50 border-gray-200 text-gray-600;
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

.debug-panel {
  @apply text-xs font-mono;
}

.debug-panel h4 {
  @apply text-sm font-bold text-gray-700;
}

.debug-panel p {
  @apply mb-1;
}
</style>

<style>
/* Estilos globales para FormKit - CONSISTENTES CON PASOS ANTERIORES */
#medical-form .formkit-outer {
  @apply mb-0;
}

#medical-form .formkit-label {
  @apply block text-sm font-medium text-gray-700 mb-2;
}

#medical-form .formkit-input {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200 bg-white;
}

#medical-form .formkit-input:focus {
  @apply ring-2 ring-blue-500 ring-opacity-20;
}

#medical-form .formkit-message {
  @apply mt-1 text-sm text-red-600;
}

#medical-form .formkit-help {
  @apply mt-1 text-sm text-gray-500;
}

#medical-form .formkit-input[type="textarea"] {
  @apply min-h-[80px] resize-y;
}

#medical-form .formkit-input:disabled {
  @apply bg-gray-50 text-gray-500 cursor-not-allowed opacity-60;
}

#medical-form .formkit-input[data-invalid="true"] {
  @apply border-red-300 focus:border-red-500 focus:ring-red-500;
}

#medical-form .formkit-input[data-valid="true"] {
  @apply border-green-300 focus:border-green-500 focus:ring-green-500;
}

/* Responsive */
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
  
  .medical-summary {
    @apply p-3;
  }
  
  .summary-item {
    @apply items-start;
  }
  
  .summary-status {
    @apply p-2 text-xs;
  }
}
</style>