<template>
  <div class="step-therapy">
    <div class="step-header">
      <div class="step-number">6</div>
      <div class="step-title">
        <h2 class="text-2xl font-bold text-gray-900">Historial de Terapias</h2>
        <p class="text-gray-600 mt-1">Información sobre terapias previas y derivaciones</p>
      </div>
    </div>

    <FormKit
      type="form"
      id="therapy-form"
      :actions="false"
      v-model="formDataRaw"
      @input="handleFormInput"
    >
      <div class="form-grid">
        <div class="form-group col-span-full">
          <FormKit
            type="radio"
            name="has_previous_therapies"
            label="¿Ha recibido terapias antes? *"
            :options="therapyHistoryOptions"
            validation="required"
            :validation-messages="{ required: 'Esta información es requerida' }"
          />
        </div>

        <div class="form-group col-span-full" v-if="isTherapyTrue">
          <FormKit
            type="textarea"
            name="therapies_detail"
            label="Detalle de Terapias Previas *"
            placeholder="Describa tipos de terapia, duración y profesionales..."
            :rows="4"
            validation="required|length:10,1000"
            :validation-messages="{
              required: 'El detalle es obligatorio',
              length: 'Mínimo 10 caracteres'
            }"
          />
        </div>

        <div class="form-group">
          <FormKit
            type="select"
            name="referred_by"
            label="¿Quién derivó?"
            placeholder="Selecciona una opción"
            :options="referredByOptions"
          />
        </div>

        <div class="form-group">
          <FormKit
            type="text"
            name="referred_by_detail"
            label="Detalle de Derivación"
            placeholder="Ej: Dra. María González"
          />
        </div>

        <div class="form-group col-span-full">
          <FormKit
            type="select"
            name="attended_where"
            label="¿Dónde se atendió previamente?"
            placeholder="Selecciona el establecimiento"
            :options="establishmentOptions"
          />
        </div>
      </div>

      <div class="validation-info" :class="{ 'is-valid': isStepValid }">
        <div class="validation-icon">
          <CheckCircleIcon v-if="isStepValid" class="h-5 w-5" />
          <ExclamationCircleIcon v-else class="h-5 w-5" />
        </div>
        <div class="validation-text">
          <span v-if="isStepValid">✓ Historial listo para el borrador</span>
          <span v-else>⚠ Complete la información requerida</span>
        </div>
      </div>
    </FormKit>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'

interface TherapyData {
  has_previous_therapies: string | boolean
  therapies_detail: string
  referred_by: string
  referred_by_detail: string
  attended_where: string
}

const props = defineProps<{ formData: TherapyData }>()
const emit = defineEmits(['update:formData', 'validate'])

// ✅ Única fuente de verdad local para evitar rebotes circulares con el borrador
const formDataRaw = ref({
  has_previous_therapies: '',
  therapies_detail: '',
  referred_by: '',
  referred_by_detail: '',
  attended_where: ''
})

const therapyHistoryOptions = { 'true': 'Sí, ha recibido terapias antes', 'false': 'No, es la primera vez' }
const referredByOptions = { '': 'Selecciona una opción', 'school': 'Escuela', 'doctor': 'Médico', 'specialist': 'Especialista', 'family': 'Familia', 'other': 'Otro' }
const establishmentOptions = { '': 'Selecciona una opción', '3': 'Centro Norte', '4': 'Clínica Los Alerces', '5': 'Hospital Regional' }

const isTherapyTrue = computed(() => String(formDataRaw.value.has_previous_therapies) === 'true')

const isStepValid = computed(() => {
  const hasSelection = formDataRaw.value.has_previous_therapies !== ''
  if (isTherapyTrue.value) {
    return hasSelection && formDataRaw.value.therapies_detail.trim().length >= 10
  }
  return hasSelection
})

/**
 * ✅ SINCRONIZACIÓN INSTANTÁNEA
 * Se emite al padre en cada interacción para que el borrador se actualice al momento.
 */
const handleFormInput = (data: any) => {
  // Limpieza lógica si cambia a "No"
  if (String(data.has_previous_therapies) === 'false') {
    data.therapies_detail = ''
  }
  emit('update:formData', { ...data })
  emit('validate', isStepValid.value)
}

// Método expuesto para el padre
const validate = () => {
  emit('validate', isStepValid.value)
  return isStepValid.value
}

onMounted(() => {
  if (props.formData) {
    formDataRaw.value = {
      has_previous_therapies: String(props.formData.has_previous_therapies || ''),
      therapies_detail: props.formData.therapies_detail || '',
      referred_by: props.formData.referred_by || '',
      referred_by_detail: props.formData.referred_by_detail || '',
      attended_where: String(props.formData.attended_where || '')
    }
  }
  // ✅ Crítico: Notificar al padre inmediatamente que estamos en el Paso 6
  emit('validate', isStepValid.value)
})

watch(() => props.formData, (newData) => {
  if (newData) {
    const incomingVal = String(newData.has_previous_therapies || '')
    if (incomingVal !== formDataRaw.value.has_previous_therapies) {
      formDataRaw.value.has_previous_therapies = incomingVal
    }
    formDataRaw.value.therapies_detail = newData.therapies_detail || ''
    formDataRaw.value.referred_by = newData.referred_by || ''
    formDataRaw.value.referred_by_detail = newData.referred_by_detail || ''
    formDataRaw.value.attended_where = String(newData.attended_where || '')
  }
}, { deep: true })

defineExpose({ validate })
</script>

<style scoped>
.step-therapy { @apply space-y-6; }
.step-header { @apply flex items-start space-x-4 mb-8 pb-6 border-b border-gray-200; }
.step-number { @apply flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold; }
.form-grid { @apply grid grid-cols-1 md:grid-cols-2 gap-6; }
.col-span-full { @apply md:col-span-2; }
.validation-info { @apply mt-8 p-4 rounded-lg border flex items-center space-x-3 transition-colors; }
.validation-info:not(.is-valid) { @apply bg-yellow-50 border-yellow-200 text-yellow-800; }
.validation-info.is-valid { @apply bg-green-50 border-green-200 text-green-800; }
</style>

<style>
#therapy-form .formkit-outer { @apply mb-0; }
#therapy-form .formkit-label { @apply block text-sm font-medium text-gray-700 mb-2; }
#therapy-form .formkit-radio-wrapper { @apply flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer; }
#therapy-form .formkit-radio-wrapper[data-checked="true"] { @apply bg-blue-50 border-blue-200; }
#therapy-form .formkit-input { @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white; }
</style>