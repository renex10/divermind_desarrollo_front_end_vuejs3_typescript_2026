<!-- src/components/forms/multi-step/pasos/Paso5SpecialNeeds.vue -->
<template>
  <div class="step-special-needs">
    <!-- Header del Paso -->
    <div class="step-header">
      <div class="step-number">5</div>
      <div class="step-title">
        <h2 class="text-2xl font-bold text-gray-900">Necesidades Especiales</h2>
        <p class="text-gray-600 mt-1">Información sobre necesidades educativas especiales y nivel de autismo</p>
      </div>
    </div>

    <!-- Formulario -->
    <FormKit
      type="form"
      id="special-needs-form"
      :actions="false"
      v-model="formDataRaw"
      @input="handleFormInput"
    >
      <!-- Grid de Campos -->
      <div class="form-grid">
        <!-- ¿Presenta NEE? -->
        <div class="form-group col-span-full">
          <FormKit
            type="radio"
            name="special_needs"
            label="¿Presenta Necesidades Educativas Especiales (NEE)?"
            :options="specialNeedsOptions"
            validation="required"
            :validation-messages="{
              required: 'Esta información es requerida'
            }"
          />
          <div class="text-xs text-gray-500 mt-1">
            Indique si el niño/niña presenta necesidades educativas especiales
          </div>
        </div>

        <!-- Tipo de NEE (condicional) -->
        <div class="form-group col-span-full" v-if="localData.special_needs === true">
          <FormKit
            type="select"
            name="special_needs_type"
            label="Tipo de NEE *"
            placeholder="Selecciona el tipo de necesidad especial"
            :options="specialNeedsTypeOptions"
            validation="required"
            :validation-messages="{
              required: 'El tipo de NEE es obligatorio cuando se marcan necesidades especiales'
            }"
          />
          <div class="text-xs text-gray-500 mt-1">
            Seleccione el tipo de necesidad educativa especial que presenta
          </div>
        </div>

        <!-- Nivel de Autismo -->
        <div class="form-group col-span-full">
          <FormKit
            type="select"
            name="autism_level_value"
            label="Nivel de Autismo"
            placeholder="Selecciona el nivel de autismo"
            :options="autismLevelOptions"
          />
          <div class="text-xs text-gray-500 mt-1">
            Esta información ayuda a proporcionar el apoyo adecuado
          </div>
        </div>

        <!-- Información Adicional -->
        <div class="form-group col-span-full" v-if="showAdditionalInfo">
          <div class="additional-info">
            <InformationCircleIcon class="h-5 w-5 text-blue-500" />
            <div class="info-content">
              <h4 class="info-title">Información sobre NEE</h4>
              <p class="info-text">
                Las Necesidades Educativas Especiales (NEE) se refieren a los apoyos y recursos 
                adicionales que requieren algunos estudiantes para participar plenamente en el 
                proceso educativo.
              </p>
            </div>
          </div>
        </div>

        <!-- Resumen de Necesidades Especiales -->
        <div class="form-group col-span-full" v-if="showSpecialNeedsSummary">
          <label class="formkit-label">Resumen de Necesidades Especiales</label>
          <div class="special-needs-summary">
            <!-- Estado NEE -->
            <div class="summary-item">
              <div class="summary-icon" :class="neeStatusClass">
                <AcademicCapIcon class="h-5 w-5" />
              </div>
              <div class="summary-content">
                <span class="summary-label">Necesidades Educativas Especiales:</span>
                <span class="summary-value">{{ neeStatusText }}</span>
              </div>
            </div>

            <!-- Tipo de NEE -->
            <div class="summary-item" v-if="localData.special_needs_type">
              <TagIcon class="h-5 w-5 text-purple-500" />
              <div class="summary-content">
                <span class="summary-label">Tipo de NEE:</span>
                <span class="summary-value">{{ specialNeedsTypeDisplay }}</span>
              </div>
            </div>

            <!-- Nivel de Autismo -->
            <div class="summary-item" v-if="localData.autism_level_value && localData.autism_level_value !== 'no_review'">
              <UserIcon class="h-5 w-5 text-blue-500" />
              <div class="summary-content">
                <span class="summary-label">Nivel de Autismo:</span>
                <span class="summary-value">{{ autismLevelDisplay }}</span>
                <p class="summary-description">{{ autismLevelDescription }}</p>
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
          <span v-if="isStepValid">✓ Información de necesidades especiales completa</span>
          <span v-else>⚠ Complete la información requerida</span>
        </div>
      </div>

      <!-- Panel de Debug (solo desarrollo) -->
      <div v-if="showDebug" class="debug-panel mt-4 p-4 bg-gray-100 rounded-lg">
        <h4 class="font-bold mb-2">🐛 Debug Info Paso 5:</h4>
        <p><strong>Special Needs (boolean):</strong> {{ localData.special_needs }}</p>
        <p><strong>Special Needs Type:</strong> {{ localData.special_needs_type }}</p>
        <p><strong>Autism Level Value:</strong> {{ localData.autism_level_value }}</p>
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
  InformationCircleIcon,
  AcademicCapIcon,
  TagIcon,
  UserIcon,
  ShieldExclamationIcon
} from '@heroicons/vue/24/outline'

// Interfaces
interface SpecialNeedsData {
  special_needs: boolean | null
  special_needs_type: string
  autism_level_value: string
}

interface Props {
  formData: SpecialNeedsData
}

interface Emits {
  (e: 'update:formData', data: SpecialNeedsData): void
  (e: 'validate', isValid: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Estado local del formulario
const localData = ref<SpecialNeedsData>({
  special_needs: null,
  special_needs_type: '',
  autism_level_value: 'no_review'
})

const formDataRaw = ref<any>({})
const showDebug = ref(import.meta.env.DEV) // Solo mostrar debug en desarrollo

// Opciones para los campos
const specialNeedsOptions = {
  'true': 'Sí, presenta NEE',
  'false': 'No, no presenta NEE'
}

const specialNeedsTypeOptions = {
  '': 'Selecciona el tipo',
  'permanent': 'Permanente',
  'temporary': 'Transitoria',
  'none': 'No especificado'
}

const autismLevelOptions = {
  'no_review': 'Sin revisión',
  'level_1': 'Nivel 1 - Requiere apoyo',
  'level_2': 'Nivel 2 - Requiere apoyo sustancial',
  'level_3': 'Nivel 3 - Requiere apoyo muy sustancial',
  'not_applicable': 'No aplica',
  'none': 'No presenta'
}

// Display values y descripciones
const neeStatusText = computed(() => {
  if (localData.value.special_needs === true) return 'Sí presenta NEE'
  if (localData.value.special_needs === false) return 'No presenta NEE'
  return 'No especificado'
})

const neeStatusClass = computed(() => {
  if (localData.value.special_needs === true) return 'status-yes'
  if (localData.value.special_needs === false) return 'status-no'
  return 'status-unknown'
})

const specialNeedsTypeDisplay = computed(() => {
  return specialNeedsTypeOptions[localData.value.special_needs_type as keyof typeof specialNeedsTypeOptions] || 'No especificado'
})

const autismLevelDisplay = computed(() => {
  return autismLevelOptions[localData.value.autism_level_value as keyof typeof autismLevelOptions] || 'No especificado'
})

const autismLevelDescription = computed(() => {
  const descriptions: Record<string, string> = {
    'level_1': 'Apoyo para dificultades en comunicación social',
    'level_2': 'Apoyo sustancial para interacción social',
    'level_3': 'Apoyo muy sustancial para comunicación e interacción',
    'not_applicable': 'No presenta características del espectro autista',
    'none': 'No presenta características del espectro autista'
  }
  return descriptions[localData.value.autism_level_value] || ''
})

// Muestra información adicional cuando es relevante
const showAdditionalInfo = computed(() => {
  return localData.value.special_needs === true || 
         (localData.value.autism_level_value && localData.value.autism_level_value !== 'no_review')
})

// Muestra el resumen cuando hay datos
const showSpecialNeedsSummary = computed(() => {
  return localData.value.special_needs !== null || 
         localData.value.special_needs_type || 
         (localData.value.autism_level_value && localData.value.autism_level_value !== 'no_review')
})

// Estado general
const overallStatusText = computed(() => {
  if (localData.value.special_needs === true) {
    return 'Requiere apoyos educativos especiales'
  }
  if (localData.value.autism_level_value && localData.value.autism_level_value !== 'no_review' && localData.value.autism_level_value !== 'not_applicable' && localData.value.autism_level_value !== 'none') {
    return 'Requiere apoyo específico'
  }
  return 'Sin necesidades especiales identificadas'
})

const overallStatusClass = computed(() => {
  if (localData.value.special_needs === true) {
    return 'status-important'
  }
  if (localData.value.autism_level_value && localData.value.autism_level_value !== 'no_review' && localData.value.autism_level_value !== 'not_applicable' && localData.value.autism_level_value !== 'none') {
    return 'status-medium'
  }
  return 'status-neutral'
})

// Valida si el paso está completo
const isStepValid = computed(() => {
  // Si marcó que tiene NEE, entonces el tipo es obligatorio
  if (localData.value.special_needs === true) {
    const isValid = localData.value.special_needs_type !== ''
    console.log('🔍 Validación Paso 5 - NEE (true):', {
      special_needs: localData.value.special_needs,
      special_needs_type: localData.value.special_needs_type,
      isValid
    })
    return isValid
  }
  
  // Si no tiene NEE, el paso es válido
  const isValid = localData.value.special_needs !== null
  console.log('🔍 Validación Paso 5 - NEE (false/null):', {
    special_needs: localData.value.special_needs,
    isValid
  })
  return isValid
})

// ✅ MANEJO DE INPUT DEL FORMULARIO MEJORADO
const handleFormInput = (rawData: any) => {
  console.log('📝 Input del formulario Paso 5 (raw):', rawData)
  
  // 🔥 CRÍTICO: Convertir string a boolean para special_needs
  const specialNeedsBoolean = rawData.special_needs === 'true' ? true : 
                             rawData.special_needs === 'false' ? false : null

  // Procesar datos del formulario
  const processedData: SpecialNeedsData = {
    special_needs: specialNeedsBoolean,
    special_needs_type: rawData.special_needs_type || '',
    autism_level_value: rawData.autism_level_value || 'no_review'
  }
  
  console.log('🔄 Datos procesados Paso 5:', processedData)
  
  // Si cambia de "Sí" a "No" en NEE, limpiar el tipo
  if (processedData.special_needs === false && localData.value.special_needs === true) {
    processedData.special_needs_type = ''
  }
  
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
  console.log('🔍 Validación forzada Paso 5:', isValid)
  emit('validate', isValid)
  return isValid
}

// ✅ INICIALIZACIÓN MEJORADA
onMounted(() => {
  console.log('🚀 Paso 5 - Necesidades Especiales montado con datos iniciales:', props.formData)
  
  // Cargar datos iniciales del formulario
  if (props.formData) {
    localData.value = {
      special_needs: props.formData.special_needs,
      special_needs_type: props.formData.special_needs_type || '',
      autism_level_value: props.formData.autism_level_value || 'no_review'
    }
    
    // Sincronizar datos crudos para FormKit (convertir boolean a string)
    formDataRaw.value = {
      special_needs: props.formData.special_needs === true ? 'true' : 
                     props.formData.special_needs === false ? 'false' : '',
      special_needs_type: props.formData.special_needs_type || '',
      autism_level_value: props.formData.autism_level_value || 'no_review'
    }
  }
  
  // Emitir validación inicial después de un pequeño delay
  setTimeout(() => {
    const isValid = isStepValid.value
    console.log('📢 Validación inicial Paso 5:', isValid)
    emit('validate', isValid)
  }, 100)
})

// Watch para cambios en los props (en caso de edición)
watch(() => props.formData, (newData) => {
  if (newData) {
    const currentStr = JSON.stringify(localData.value)
    const newStr = JSON.stringify(newData)
    
    if (currentStr !== newStr) {
      console.log('📥 Actualización desde padre Paso 5:', newData)
      
      // Actualizar datos locales
      localData.value = {
        special_needs: newData.special_needs,
        special_needs_type: newData.special_needs_type || '',
        autism_level_value: newData.autism_level_value || 'no_review'
      }
      
      // Sincronizar datos crudos para FormKit
      formDataRaw.value = {
        special_needs: newData.special_needs === true ? 'true' : 
                       newData.special_needs === false ? 'false' : '',
        special_needs_type: newData.special_needs_type || '',
        autism_level_value: newData.autism_level_value || 'no_review'
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
.step-special-needs {
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
  @apply grid grid-cols-1 gap-6;
}

.col-span-full {
  @apply md:col-span-2;
}

.form-group {
  @apply space-y-2;
}

.additional-info {
  @apply flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg;
}

.info-content {
  @apply flex-1;
}

.info-title {
  @apply text-sm font-medium text-blue-900 mb-1;
}

.info-text {
  @apply text-sm text-blue-700;
}

.special-needs-summary {
  @apply space-y-4 p-4 bg-gray-50 border border-gray-200 rounded-lg;
}

.summary-item {
  @apply flex items-start space-x-3;
}

.summary-icon {
  @apply flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center;
}

.summary-icon.status-yes {
  @apply bg-red-100 text-red-600;
}

.summary-icon.status-no {
  @apply bg-green-100 text-green-600;
}

.summary-icon.status-unknown {
  @apply bg-gray-100 text-gray-600;
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
  @apply block text-xs text-gray-600 mt-1 italic;
}

.summary-status {
  @apply flex items-center space-x-2 p-3 rounded-lg border text-sm font-medium;
}

.status-important {
  @apply bg-red-50 border-red-200 text-red-800;
}

.status-medium {
  @apply bg-yellow-50 border-yellow-200 text-yellow-800;
}

.status-neutral {
  @apply bg-green-50 border-green-200 text-green-800;
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
#special-needs-form .formkit-outer {
  @apply mb-0;
}

#special-needs-form .formkit-label {
  @apply block text-sm font-medium text-gray-700 mb-2;
}

#special-needs-form .formkit-legend {
  @apply block text-sm font-medium text-gray-700 mb-3;
}

#special-needs-form .formkit-fieldset {
  @apply space-y-3;
}

#special-needs-form .formkit-radio-wrapper {
  @apply flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150;
}

#special-needs-form .formkit-radio-input {
  @apply h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300;
}

#special-needs-form .formkit-radio-label {
  @apply block text-sm font-medium text-gray-700 cursor-pointer;
}

#special-needs-form .formkit-input {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200 bg-white;
}

#special-needs-form .formkit-input:focus {
  @apply ring-2 ring-blue-500 ring-opacity-20;
}

#special-needs-form .formkit-input[validation="required"] ~ .formkit-label::after {
  content: " *";
  @apply text-red-500;
}

#special-needs-form .formkit-legend[validation="required"]::after {
  content: " *";
  @apply text-red-500;
}

#special-needs-form .formkit-message {
  @apply mt-1 text-sm text-red-600;
}

#special-needs-form .formkit-help {
  @apply mt-1 text-sm text-gray-500;
}

#special-needs-form .formkit-input[type="select"] {
  @apply pr-10 bg-white;
}

#special-needs-form .formkit-input:disabled {
  @apply bg-gray-50 text-gray-500 cursor-not-allowed opacity-60;
}

#special-needs-form .formkit-input[data-invalid="true"] {
  @apply border-red-300 focus:border-red-500 focus:ring-red-500;
}

#special-needs-form .formkit-input[data-valid="true"] {
  @apply border-green-300 focus:border-green-500 focus:ring-green-500;
}

#special-needs-form .formkit-radio-wrapper[data-checked="true"] {
  @apply bg-blue-50 border-blue-200;
}

#special-needs-form .formkit-radio-input[data-invalid="true"] {
  @apply border-red-300 text-red-600 focus:ring-red-500;
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
  
  .special-needs-summary {
    @apply p-3;
  }
  
  .summary-item {
    @apply items-start;
  }
  
  .summary-status {
    @apply p-2 text-xs;
  }
  
  .additional-info {
    @apply p-3;
  }
  
  .formkit-radio-wrapper {
    @apply p-2;
  }
}
</style>