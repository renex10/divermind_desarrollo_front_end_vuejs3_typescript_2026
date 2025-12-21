<template>
  <div class="step-special-needs">
    <div class="step-header">
      <div class="step-number">5</div>
      <div class="step-title">
        <h2 class="text-2xl font-bold text-gray-900">Necesidades Especiales</h2>
        <p class="text-gray-600 mt-1">Información sobre necesidades educativas especiales y nivel de autismo</p>
      </div>
    </div>

    <FormKit
      type="form"
      id="special-needs-form"
      :actions="false"
      v-model="formDataRaw"
      @input="handleFormInput"
    >
      <div class="form-grid">
        <div class="form-group col-span-full">
          <FormKit
            type="radio"
            name="has_special_needs"
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

        <div class="form-group col-span-full" v-if="isNeeTrue">
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
        </div>

        <div class="form-group col-span-full">
          <FormKit
            type="select"
            name="autism_level_value"
            label="Nivel de Autismo"
            placeholder="Selecciona el nivel de autismo"
            :options="autismLevelOptions"
          />
        </div>

        <div class="form-group col-span-full" v-if="formDataRaw.has_special_needs !== ''">
          <div class="special-needs-summary" :class="overallStatusClass">
            <div class="flex items-center space-x-2">
              <AcademicCapIcon class="h-5 w-5" />
              <span class="font-bold">{{ neeStatusText }}</span>
            </div>
            <p v-if="isNeeTrue && formDataRaw.special_needs_type" class="text-xs mt-1">
              Tipo registrado: {{ specialNeedsTypeDisplay }}
            </p>
          </div>
        </div>
      </div>

      <div class="validation-info" :class="{ 'is-valid': isStepValid }">
        <div class="validation-icon">
          <CheckCircleIcon v-if="isStepValid" class="h-5 w-5" />
          <ExclamationCircleIcon v-else class="h-5 w-5" />
        </div>
        <div class="validation-text">
          <span v-if="isStepValid">✓ Información lista para el borrador</span>
          <span v-else>⚠ Seleccione una opción y complete los campos obligatorios</span>
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
  AcademicCapIcon
} from '@heroicons/vue/24/outline'

// Interface normalizada con el backend
interface SpecialNeedsData {
  has_special_needs: boolean | null
  special_needs_type: string
  autism_level_value: string
}

const props = defineProps<{ formData: SpecialNeedsData }>()
const emit = defineEmits(['update:formData', 'validate'])

// Fuente de verdad local vinculada a FormKit
const formDataRaw = ref({
  has_special_needs: '',
  special_needs_type: '',
  autism_level_value: 'no_review'
})

const specialNeedsOptions = { 'true': 'Sí, presenta NEE', 'false': 'No, no presenta NEE' }
const specialNeedsTypeOptions = { '': 'Selecciona el tipo', 'permanent': 'Permanente', 'temporary': 'Transitoria' }
const autismLevelOptions = {
  'no_review': 'Sin revisión',
  'level_1': 'Nivel 1 - Requiere apoyo',
  'level_2': 'Nivel 2 - Requiere apoyo sustancial',
  'level_3': 'Nivel 3 - Requiere apoyo muy sustancial',
  'none': 'No presenta'
}

// ✅ NORMALIZACIÓN CRÍTICA: Maneja la comparación string/boolean para la UI
const isNeeTrue = computed(() => String(formDataRaw.value.has_special_needs) === 'true')

const isStepValid = computed(() => {
  const hasSelection = formDataRaw.value.has_special_needs !== ''
  if (isNeeTrue.value) return hasSelection && !!formDataRaw.value.special_needs_type
  return hasSelection
})

/**
 * ✅ SINCRONIZACIÓN CON EL BORRADOR
 * Procesa los datos y los envía al componente padre inmediatamente
 */
const handleFormInput = (data: any) => {
  const processedData: SpecialNeedsData = {
    has_special_needs: data.has_special_needs === 'true' ? true : 
                       data.has_special_needs === 'false' ? false : null,
    special_needs_type: data.special_needs_type || '',
    autism_level_value: data.autism_level_value || 'no_review'
  }
  
  // Limpieza lógica si cambia a "No"
  if (processedData.has_special_needs === false) {
    formDataRaw.value.special_needs_type = ''
    processedData.special_needs_type = ''
  }

  emit('update:formData', processedData)
  emit('validate', isStepValid.value)
}

// Helpers visuales
const neeStatusText = computed(() => isNeeTrue.value ? 'Sí presenta NEE' : 'No presenta NEE')
const overallStatusClass = computed(() => isNeeTrue.value ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-green-50 border-green-200 text-green-800')
const specialNeedsTypeDisplay = computed(() => specialNeedsTypeOptions[formDataRaw.value.special_needs_type as keyof typeof specialNeedsTypeOptions] || '')

const validate = () => {
  emit('validate', isStepValid.value)
  return isStepValid.value
}

// ✅ INICIALIZACIÓN Y RECUPERACIÓN DE DRAFT
onMounted(() => {
  if (props.formData) {
    formDataRaw.value = {
      has_special_needs: props.formData.has_special_needs === true ? 'true' : 
                         props.formData.has_special_needs === false ? 'false' : '',
      special_needs_type: props.formData.special_needs_type || '',
      autism_level_value: props.formData.autism_level_value || 'no_review'
    }
  }
  emit('validate', isStepValid.value)
})

// ✅ VIGILANCIA DE CAMBIOS EXTERNOS (Previene deselecciones visuales)
watch(() => props.formData, (newData) => {
  if (newData) {
    const incomingVal = newData.has_special_needs === true ? 'true' : 
                        newData.has_special_needs === false ? 'false' : ''
    
    // Solo actualizar si el valor lógico es distinto para no resetear el FormKit
    if (incomingVal !== formDataRaw.value.has_special_needs) {
      formDataRaw.value.has_special_needs = incomingVal
    }
    formDataRaw.value.special_needs_type = newData.special_needs_type || ''
    formDataRaw.value.autism_level_value = newData.autism_level_value || 'no_review'
  }
}, { deep: true })

defineExpose({ validate })
</script>

<style scoped>
.step-special-needs { @apply space-y-6; }
.step-header { @apply flex items-start space-x-4 mb-8 pb-6 border-b border-gray-200; }
.step-number { @apply flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold; }
.form-grid { @apply grid grid-cols-1 gap-6; }
.special-needs-summary { @apply p-4 rounded-lg border transition-all; }
.validation-info { @apply mt-8 p-4 rounded-lg border flex items-center space-x-3 transition-colors; }
.validation-info:not(.is-valid) { @apply bg-yellow-50 border-yellow-200 text-yellow-800; }
.validation-info.is-valid { @apply bg-green-50 border-green-200 text-green-800; }
</style>

<style>
/* Estilos globales para FormKit consistentes con otros pasos */
#special-needs-form .formkit-outer { @apply mb-0; }
#special-needs-form .formkit-label { @apply block text-sm font-medium text-gray-700 mb-2; }
#special-needs-form .formkit-radio-wrapper { @apply flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer; }
#special-needs-form .formkit-radio-wrapper[data-checked="true"] { @apply bg-blue-50 border-blue-200; }
#special-needs-form .formkit-input { @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white; }
</style>