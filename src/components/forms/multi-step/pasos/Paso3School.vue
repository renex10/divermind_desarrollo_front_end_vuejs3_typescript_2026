<template>
  <div class="step-school">
    <div class="step-header">
      <div class="step-number">3</div>
      <div class="step-title">
        <h2 class="text-2xl font-bold text-gray-900">Información Escolar</h2>
        <p class="text-gray-600 mt-1">Datos académicos y de adaptación del niño/niña</p>
      </div>
    </div>

    <FormKit
      type="form"
      id="school-form"
      :actions="false"
      v-model="formDataRaw"
      @input="handleFormInput"
    >
      <div class="form-grid">
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

        <div class="form-group col-span-full" v-if="showSchoolSummary">
          <label class="formkit-label">Vista Previa de Progreso</label>
          <div class="school-summary">
            <div class="summary-item">
              <AcademicCapIcon class="h-5 w-5 text-blue-500" />
              <div class="summary-content">
                <span class="summary-label">Nivel Educativo:</span>
                <span class="summary-value">{{ currentGradeDisplay }}</span>
              </div>
            </div>
            <div class="summary-item" v-if="formDataRaw.school_journey">
              <ClockIcon class="h-5 w-5 text-green-500" />
              <div class="summary-content">
                <span class="summary-label">Jornada:</span>
                <span class="summary-value">{{ journeyDisplay }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="validation-info" :class="{ 'is-valid': isStepValid }">
        <div class="validation-icon">
          <CheckCircleIcon v-if="isStepValid" class="h-5 w-5" />
          <ExclamationCircleIcon v-else class="h-5 w-5" />
        </div>
        <div class="validation-text">
          <span v-if="isStepValid">✓ Información escolar lista para guardar</span>
          <span v-else>⚠ Complete el curso actual para asegurar el borrador</span>
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
  AcademicCapIcon,
  ClockIcon
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

const props = defineProps<Props>()
const emit = defineEmits(['update:formData', 'validate'])

// ✅ Única fuente de verdad local vinculada a FormKit
const formDataRaw = ref<SchoolData>({
  current_grade: '',
  school_journey: '',
  school_adaptation_notes: ''
})

// Opciones para los selects
const gradeOptions = {
  '': 'Selecciona el curso',
  'Pre-kínder': 'Pre-kínder', 'Kínder': 'Kínder',
  '1° Básico': '1° Básico', '2° Básico': '2° Básico', '3° Básico': '3° Básico',
  '4° Básico': '4° Básico', '5° Básico': '5° Básico', '6° Básico': '6° Básico',
  '7° Básico': '7° Básico', '8° Básico': '8° Básico',
  '1° Medio': '1° Medio', '2° Medio': '2° Medio', '3° Medio': '3° Medio', '4° Medio': '4° Medio',
  'Educación Diferencial': 'Educación Diferencial', 'Otro': 'Otro'
}

const journeyOptions = {
  '': 'Selecciona jornada',
  'morning': 'Jornada Mañana', 'afternoon': 'Jornada Tarde', 
  'full_time': 'Jornada Completa', 'extended': 'Jornada Extendida'
}

// Display values para el resumen
const currentGradeDisplay = computed(() => gradeOptions[formDataRaw.value.current_grade as keyof typeof gradeOptions] || 'No especificado')
const journeyDisplay = computed(() => journeyOptions[formDataRaw.value.school_journey as keyof typeof journeyOptions] || 'No especificada')
const showSchoolSummary = computed(() => !!formDataRaw.value.current_grade || !!formDataRaw.value.school_journey)

// ✅ Validación síncrona para habilitar botones y borrador
const isStepValid = computed(() => formDataRaw.value.current_grade !== '')

/**
 * ✅ SINCRONIZACIÓN INMEDIATA:
 * Cada vez que el usuario interactúa, emitimos al padre.
 * Esto asegura que useFormDraft en NneMultiStepForm capture el cambio al instante.
 */
const handleFormInput = (data: any) => {
  emit('update:formData', { ...data })
  emit('validate', isStepValid.value)
}

// Método expuesto para validación forzada desde el padre
const validate = () => {
  emit('validate', isStepValid.value)
  return isStepValid.value
}

// ✅ RECURACIÓN DE DATOS (Maneja el estado del borrador al montar)
onMounted(() => {
  if (props.formData) {
    formDataRaw.value = {
      current_grade: props.formData.current_grade || '',
      school_journey: props.formData.school_journey || '',
      school_adaptation_notes: props.formData.school_adaptation_notes || ''
    }
  }
  // Notificar validez inicial para que el padre sepa que estamos en este paso
  emit('validate', isStepValid.value)
})

// ✅ VIGILAR CAMBIOS EXTERNOS (Sincroniza si el borrador se carga después del mount)
watch(() => props.formData, (newData) => {
  if (newData) {
    formDataRaw.value = {
      current_grade: newData.current_grade || '',
      school_journey: newData.school_journey || '',
      school_adaptation_notes: newData.school_adaptation_notes || ''
    }
  }
}, { deep: true })

defineExpose({ validate })
</script>

<style scoped>
.step-school { @apply space-y-6; }
.step-header { @apply flex items-start space-x-4 mb-8 pb-6 border-b border-gray-200; }
.step-number { @apply flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold; }
.form-grid { @apply grid grid-cols-1 md:grid-cols-2 gap-6; }
.col-span-full { @apply md:col-span-2; }
.school-summary { @apply space-y-3 p-4 bg-gray-50 border border-gray-200 rounded-lg; }
.summary-item { @apply flex items-start space-x-3; }
.summary-content { @apply flex-1 min-w-0; }
.summary-label { @apply block text-sm font-medium text-gray-700; }
.summary-value { @apply block text-sm text-gray-900 mt-1; }
.validation-info { @apply mt-8 p-4 rounded-lg border flex items-center space-x-3 transition-colors duration-200; }
.validation-info:not(.is-valid) { @apply bg-yellow-50 border-yellow-200 text-yellow-800; }
.validation-info.is-valid { @apply bg-green-50 border-green-200 text-green-800; }
</style>

<style>
/* Estilos globales para FormKit consistentes con la suite */
#school-form .formkit-input { @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white; }
#school-form .formkit-label { @apply block text-sm font-medium text-gray-700 mb-2; }
#school-form .formkit-message { @apply mt-1 text-sm text-red-600; }
#school-form .formkit-help { @apply mt-1 text-sm text-gray-500; }
#school-form .formkit-input[type="textarea"] { @apply min-h-[100px] resize-y; }
</style>