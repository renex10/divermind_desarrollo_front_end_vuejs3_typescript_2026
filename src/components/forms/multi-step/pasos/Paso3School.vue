<!-- src\components\forms\multi-step\pasos\Paso3School.vue -->
<template>
  <div class="step-school">
    <!-- Header del Paso -->
    <div class="step-header">
      <div class="step-number">3</div>
      <div class="step-title">
        <h2 class="text-2xl font-bold text-gray-900">Información Escolar</h2>
        <p class="text-gray-600 mt-1">Datos académicos y de adaptación del niño/niña</p>
      </div>
    </div>

    <!-- Formulario -->
    <FormKit
      type="form"
      id="school-form"
      :actions="false"
      v-model="formDataRaw"
      @input="handleFormInput"
    >
      <!-- Grid de Campos -->
      <div class="form-grid">
        <!-- Curso/Nivel Actual -->
        <div class="form-group">
          <FormKit
            type="select"
            name="current_grade"
            label="Curso/Nivel Actual *"
            placeholder="Selecciona el curso actual"
            :options="gradeOptions"
            validation="required"
            :validation-messages="{
              required: 'El curso/nivel actual es obligatorio'
            }"
          />
          <div class="text-xs text-gray-500 mt-1">
            Nivel educativo actual del niño/niña
          </div>
        </div>

        <!-- Jornada Escolar -->
        <div class="form-group">
          <FormKit
            type="select"
            name="school_journey"
            label="Jornada Escolar"
            placeholder="Selecciona la jornada"
            :options="journeyOptions"
          />
          <div class="text-xs text-gray-500 mt-1">
            Jornada en la que asiste al establecimiento
          </div>
        </div>

        <!-- Observaciones de Adaptación -->
        <div class="form-group col-span-full">
          <FormKit
            type="textarea"
            name="school_adaptation_notes"
            label="Observaciones de Adaptación Escolar"
            placeholder="Describe el proceso de adaptación, comportamiento en el aula, relación con compañeros, etc."
            :rows="4"
          />
          <div class="text-xs text-gray-500 mt-1">
            Opcional - Información relevante sobre la adaptación del niño en el entorno escolar
          </div>
        </div>

        <!-- Información Resumen -->
        <div class="form-group col-span-full" v-if="showSchoolSummary">
          <label class="formkit-label">Resumen Escolar</label>
          <div class="school-summary">
            <div class="summary-item">
              <AcademicCapIcon class="h-5 w-5 text-blue-500" />
              <div class="summary-content">
                <span class="summary-label">Nivel Educativo:</span>
                <span class="summary-value">{{ currentGradeDisplay }}</span>
              </div>
            </div>
            <div class="summary-item" v-if="localData.school_journey">
              <ClockIcon class="h-5 w-5 text-green-500" />
              <div class="summary-content">
                <span class="summary-label">Jornada:</span>
                <span class="summary-value">{{ journeyDisplay }}</span>
              </div>
            </div>
            <div class="summary-item" v-if="localData.school_adaptation_notes">
              <ChatBubbleLeftRightIcon class="h-5 w-5 text-purple-500" />
              <div class="summary-content">
                <span class="summary-label">Observaciones:</span>
                <span class="summary-value truncate">{{ localData.school_adaptation_notes }}</span>
              </div>
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
          <span v-if="isStepValid">✓ La información escolar está completa</span>
          <span v-else>⚠ Complete el curso/nivel actual marcado con *</span>
        </div>
      </div>

      <!-- Panel de Debug (solo desarrollo) -->
      <div v-if="showDebug" class="debug-panel mt-4 p-4 bg-gray-100 rounded-lg">
        <h4 class="font-bold mb-2">🐛 Debug Info Paso 3:</h4>
        <p><strong>Current Grade:</strong> {{ localData.current_grade }}</p>
        <p><strong>School Journey:</strong> {{ localData.school_journey }}</p>
        <p><strong>Adaptation Notes:</strong> {{ localData.school_adaptation_notes }}</p>
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
  AcademicCapIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon 
} from '@heroicons/vue/24/outline'

// Interfaces
interface SchoolData {
  current_grade: string
  school_journey: string
  school_adaptation_notes: string
}

interface Props {
  formData: SchoolData
}

interface Emits {
  (e: 'update:formData', data: SchoolData): void
  (e: 'validate', isValid: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Estado local del formulario
const localData = ref<SchoolData>({
  current_grade: '',
  school_journey: '',
  school_adaptation_notes: ''
})

const formDataRaw = ref<any>({})
const showDebug = ref(import.meta.env.DEV) // Solo mostrar debug en desarrollo

// Opciones para los selects
const gradeOptions = {
  '': 'Selecciona el curso',
  'Pre-kínder': 'Pre-kínder',
  'Kínder': 'Kínder',
  '1° Básico': '1° Básico',
  '2° Básico': '2° Básico', 
  '3° Básico': '3° Básico',
  '4° Básico': '4° Básico',
  '5° Básico': '5° Básico',
  '6° Básico': '6° Básico',
  '7° Básico': '7° Básico',
  '8° Básico': '8° Básico',
  '1° Medio': '1° Medio',
  '2° Medio': '2° Medio',
  '3° Medio': '3° Medio',
  '4° Medio': '4° Medio',
  'Educación Diferencial': 'Educación Diferencial',
  'Otro': 'Otro'
}

const journeyOptions = {
  '': 'Selecciona jornada',
  'morning': 'Jornada Mañana',
  'afternoon': 'Jornada Tarde', 
  'full_time': 'Jornada Completa',
  'extended': 'Jornada Extendida'
}

// Display values para el resumen
const currentGradeDisplay = computed(() => {
  return gradeOptions[localData.value.current_grade as keyof typeof gradeOptions] || 'No especificado'
})

const journeyDisplay = computed(() => {
  return journeyOptions[localData.value.school_journey as keyof typeof journeyOptions] || 'No especificada'
})

// Muestra el resumen cuando hay datos
const showSchoolSummary = computed(() => {
  return localData.value.current_grade || localData.value.school_journey || localData.value.school_adaptation_notes
})

// Valida si el paso está completo (solo curso es obligatorio)
const isStepValid = computed(() => {
  const isValid = localData.value.current_grade !== ''
  
  console.log('🔍 Validación Paso 3 - Escolar:', {
    current_grade: localData.value.current_grade,
    school_journey: localData.value.school_journey,
    adaptation_notes: localData.value.school_adaptation_notes,
    isValid
  })
  
  return isValid
})

// ✅ MANEJO DE INPUT DEL FORMULARIO MEJORADO
const handleFormInput = (rawData: any) => {
  console.log('📝 Input del formulario Paso 3 (raw):', rawData)
  
  // Procesar datos del formulario
  const processedData: SchoolData = {
    current_grade: rawData.current_grade || '',
    school_journey: rawData.school_journey || '',
    school_adaptation_notes: rawData.school_adaptation_notes || ''
  }
  
  console.log('🔄 Datos procesados Paso 3:', processedData)
  
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
  console.log('🔍 Validación forzada Paso 3:', isValid)
  emit('validate', isValid)
  return isValid
}

// ✅ INICIALIZACIÓN MEJORADA
onMounted(() => {
  console.log('🚀 Paso 3 - Escolar montado con datos iniciales:', props.formData)
  
  // Cargar datos iniciales del formulario
  if (props.formData) {
    localData.value = {
      current_grade: props.formData.current_grade || '',
      school_journey: props.formData.school_journey || '',
      school_adaptation_notes: props.formData.school_adaptation_notes || ''
    }
    
    // Sincronizar datos crudos para FormKit
    formDataRaw.value = {
      current_grade: props.formData.current_grade || '',
      school_journey: props.formData.school_journey || '',
      school_adaptation_notes: props.formData.school_adaptation_notes || ''
    }
  }
  
  // Emitir validación inicial después de un pequeño delay
  setTimeout(() => {
    const isValid = isStepValid.value
    console.log('📢 Validación inicial Paso 3:', isValid)
    emit('validate', isValid)
  }, 100)
})

// Watch para cambios en los props (en caso de edición)
watch(() => props.formData, (newData) => {
  if (newData) {
    const currentStr = JSON.stringify(localData.value)
    const newStr = JSON.stringify(newData)
    
    if (currentStr !== newStr) {
      console.log('📥 Actualización desde padre Paso 3:', newData)
      
      // Actualizar datos locales
      localData.value = {
        current_grade: newData.current_grade || '',
        school_journey: newData.school_journey || '',
        school_adaptation_notes: newData.school_adaptation_notes || ''
      }
      
      // Sincronizar datos crudos para FormKit
      formDataRaw.value = {
        current_grade: newData.current_grade || '',
        school_journey: newData.school_journey || '',
        school_adaptation_notes: newData.school_adaptation_notes || ''
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
.step-school {
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

.school-summary {
  @apply space-y-3 p-4 bg-gray-50 border border-gray-200 rounded-lg;
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
#school-form .formkit-outer {
  @apply mb-0;
}

#school-form .formkit-label {
  @apply block text-sm font-medium text-gray-700 mb-2;
}

#school-form .formkit-input {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200 bg-white;
}

#school-form .formkit-input:focus {
  @apply ring-2 ring-blue-500 ring-opacity-20;
}

#school-form .formkit-message {
  @apply mt-1 text-sm text-red-600;
}

#school-form .formkit-help {
  @apply mt-1 text-sm text-gray-500;
}

#school-form select.formkit-input {
  @apply pr-10 appearance-none bg-white cursor-pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}

#school-form .formkit-input:disabled {
  @apply bg-gray-50 text-gray-500 cursor-not-allowed opacity-60;
}

#school-form .formkit-input[data-invalid="true"] {
  @apply border-red-300 focus:border-red-500 focus:ring-red-500;
}

#school-form .formkit-input[data-valid="true"] {
  @apply border-green-300 focus:border-green-500 focus:ring-green-500;
}

/* Estilos específicos para textarea */
#school-form .formkit-input[type="textarea"] {
  @apply min-h-[100px] resize-y;
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
  
  .school-summary {
    @apply p-3;
  }
}
</style>