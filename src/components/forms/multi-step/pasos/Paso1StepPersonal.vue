<template>
  <div class="step-personal">
    <div class="step-header">
      <div class="step-number">1</div>
      <div class="step-title">
        <h2 class="text-2xl font-bold text-gray-900">Datos Personales</h2>
        <p class="text-gray-600 mt-1">Información básica de identificación del niño/niña</p>
      </div>
    </div>

    <FormKit
      type="form"
      id="personal-form"
      :actions="false"
      v-model="localData"
      @input="handleFormChange"
      :config="{
        classes: {
          form: 'personal-form-grid'
        }
      }"
    >
      <div class="form-grid">
        <div class="form-group">
          <FormKit
            type="text"
            name="first_name"
            label="Nombres *"
            placeholder="Ingresa los nombres del niño/niña"
            validation="required|length:2,100"
            :validation-messages="{
              required: 'Los nombres son obligatorios',
              length: 'Los nombres deben tener entre 2 y 100 caracteres'
            }"
            :classes="{
              outer: 'formkit-outer',
              label: 'formkit-label',
              input: 'formkit-input',
              help: 'formkit-help',
              message: 'formkit-message'
            }"
          />
        </div>

        <div class="form-group">
          <FormKit
            type="text"
            name="last_name"
            label="Apellidos *"
            placeholder="Ingresa los apellidos del niño/niña"
            validation="required|length:2,100"
            :validation-messages="{
              required: 'Los apellidos son obligatorios',
              length: 'Los apellidos deben tener entre 2 y 100 caracteres'
            }"
            :classes="{
              outer: 'formkit-outer',
              label: 'formkit-label',
              input: 'formkit-input',
              help: 'formkit-help',
              message: 'formkit-message'
            }"
          />
        </div>

        <div class="form-group">
          <FormKit
            type="text"
            name="rut"
            label="RUT *"
            placeholder="12.345.678-9"
            :validation="rutValidationRules"
            :validation-messages="rutValidationMessages"
            :classes="{
              outer: 'formkit-outer',
              label: 'formkit-label',
              input: 'formkit-input',
              help: 'formkit-help',
              message: 'formkit-message'
            }"
            @blur="handleRutBlur"
          />
          <div class="rut-helpers">
            <p class="text-xs text-gray-500 mt-1">Formato: 12.345.678-9</p>
            <div v-if="rutValidationState !== 'idle'" class="rut-validation-status" :class="rutValidationState">
              <span v-if="rutValidationState === 'valid'" class="flex items-center text-green-600 text-xs mt-1">
                <CheckCircleIcon class="h-4 w-4 mr-1" />
                RUT válido y disponible
              </span>
              <span v-if="rutValidationState === 'checking'" class="flex items-center text-blue-600 text-xs mt-1">
                <ClockIcon class="h-4 w-4 mr-1 animate-spin" />
                Verificando disponibilidad...
              </span>
              <span v-if="rutValidationState === 'error'" class="flex items-center text-red-600 text-xs mt-1">
                <ExclamationCircleIcon class="h-4 w-4 mr-1" />
                {{ rutErrorMessage }}
              </span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <FormKit
            type="date"
            name="birth_date"
            label="Fecha de Nacimiento *"
            validation="required"
            :validation-messages="{
              required: 'La fecha de nacimiento es obligatoria'
            }"
            :max="maxBirthDate"
            :classes="{
              outer: 'formkit-outer',
              label: 'formkit-label',
              input: 'formkit-input',
              help: 'formkit-help',
              message: 'formkit-message'
            }"
            @input="validateBirthDate"
          />
          <div v-if="dateError" class="text-red-600 text-sm mt-1">
            {{ dateError }}
          </div>
        </div>

        <div class="form-group">
          <FormKit
            type="select"
            name="gender"
            label="Género"
            :options="genderOptions"
            placeholder="Selecciona una opción"
            :classes="{
              outer: 'formkit-outer',
              label: 'formkit-label',
              input: 'formkit-input',
              help: 'formkit-help',
              message: 'formkit-message'
            }"
          />
        </div>

        <div class="form-group" v-if="calculatedAge !== null">
          <label class="formkit-label">Edad Calculada</label>
          <div class="age-display">
            <span class="age-value">{{ calculatedAge }} años</span>
            <span class="age-info">(Basado en la fecha de nacimiento)</span>
          </div>
        </div>
      </div>

      <div class="validation-info" :class="{ 'is-valid': isStepValid }">
        <div class="validation-icon">
          <CheckCircleIcon v-if="isStepValid" class="h-5 w-5" />
          <ExclamationCircleIcon v-else class="h-5 w-5" />
        </div>
        <div class="validation-text">
          <span v-if="isStepValid">✓ Todos los campos requeridos están completos</span>
          <span v-else>⚠ Complete los campos obligatorios marcados con *</span>
        </div>
      </div>
    </FormKit>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { CheckCircleIcon, ExclamationCircleIcon, ClockIcon } from '@heroicons/vue/24/outline'
import { validarRutProgresivo, formatearRut } from '@/utils/rutValidator'
import { validateChildRutApi } from '@/services/nneService'

// Props y Emits
interface Props {
  formData: {
    first_name: string
    last_name: string
    rut: string
    birth_date: string
    gender: string
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
  first_name: '',
  last_name: '',
  rut: '',
  birth_date: '',
  gender: 'unspecified'
})

// Estado para evitar ciclos infinitos en el watcher
const isInitialized = ref(false)

// Estado de validación de RUT
const rutValidationState = ref<'idle' | 'checking' | 'valid' | 'error'>('idle')
const rutErrorMessage = ref('')
const isRutAvailable = ref<boolean | null>(null)

// Estado de validación de fecha
const dateError = ref('')

// Debounce timer
let emitTimer: number | null = null

// Opciones para el select de género
const genderOptions = {
  unspecified: 'No especifica',
  male: 'Masculino',
  female: 'Femenino',
  other: 'Otro'
}

// Reglas de validación para RUT
const rutValidationRules = computed(() => {
  return 'required'
})

// Mensajes de validación para RUT
const rutValidationMessages = {
  required: 'El RUT es obligatorio para el registro de niños'
}

// Fecha máxima permitida (hoy)
const maxBirthDate = computed(() => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
})

// Validación de fecha de nacimiento
const validateBirthDate = (value: string | undefined) => {
  dateError.value = ''
  
  if (!value) {
    return
  }
  
  const selectedDate = new Date(value + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  if (selectedDate >= today) {
    dateError.value = 'La fecha debe ser anterior a hoy'
  }
  
  // Emitir validación después de validar fecha
  debouncedEmit()
}

// Validación personalizada de RUT
const customRutValidation = async (value: string) => {
  if (!value) {
    rutValidationState.value = 'error'
    rutErrorMessage.value = 'El RUT es obligatorio'
    isRutAvailable.value = false
    return false
  }

  // Validación de formato
  const formatValidation = validarRutProgresivo(value)
  if (!formatValidation.isValid && !formatValidation.isPartial) {
    rutValidationState.value = 'error'
    rutErrorMessage.value = formatValidation.message || 'Formato de RUT inválido'
    isRutAvailable.value = false
    return false
  }

  // Si es un RUT parcial (en escritura), no validar disponibilidad aún
  if (formatValidation.isPartial) {
    rutValidationState.value = 'idle'
    rutErrorMessage.value = ''
    isRutAvailable.value = null
    return false
  }

  // Validación de disponibilidad en backend
  if (formatValidation.isValid && formatValidation.rutNormalized) {
    rutValidationState.value = 'checking'
    
    try {
      const validationResult = await validateChildRutApi(formatValidation.rutNormalized)
      
      if (validationResult.isValid && validationResult.isAvailable) {
        rutValidationState.value = 'valid'
        rutErrorMessage.value = ''
        isRutAvailable.value = true
        return true
      } else {
        rutValidationState.value = 'error'
        rutErrorMessage.value = validationResult.message || 'RUT no disponible'
        isRutAvailable.value = false
        return false
      }
    } catch (error: any) {
      console.error('Error validando RUT:', error)
      rutValidationState.value = 'error'
      rutErrorMessage.value = 'Error al verificar el RUT. Intente nuevamente.'
      isRutAvailable.value = false
      return false
    }
  }

  return false
}

// Manejar blur del campo RUT
const handleRutBlur = async (event: any) => {
  const rutValue = event.target.value
  if (rutValue) {
    const formattedRut = formatearRut(rutValue)
    if (formattedRut !== rutValue) {
      localData.value.rut = formattedRut
    }
    
    await customRutValidation(formattedRut)
    immediateEmit()
  }
}

// Calcula la edad basada en la fecha de nacimiento
const calculatedAge = computed(() => {
  if (!localData.value.birth_date) return null
  
  const birthDate = new Date(localData.value.birth_date + 'T00:00:00')
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
})

// Valida si el paso está completo
const isStepValid = computed(() => {
  const hasBasicFields = localData.value.first_name?.length >= 2 && 
                        localData.value.last_name?.length >= 2 && 
                        localData.value.birth_date !== ''
  
  const hasValidRut = rutValidationState.value === 'valid' && isRutAvailable.value === true
  const hasValidDate = localData.value.birth_date !== '' && dateError.value === ''
  
  return hasBasicFields && hasValidRut && hasValidDate
})

// Emitir inmediatamente (sin debounce)
const immediateEmit = () => {
  const isValid = isStepValid.value
  console.log('🔍 Paso 1 - Validación inmediata:', isValid)
  
  emit('update:formData', { ...localData.value })
  emit('validate', isValid)
}

// Emitir con debounce
const debouncedEmit = () => {
  if (emitTimer) {
    clearTimeout(emitTimer)
  }
  
  emitTimer = window.setTimeout(() => {
    const isValid = isStepValid.value
    console.log('🔍 Paso 1 - Validación (debounced):', isValid)
    
    emit('update:formData', { ...localData.value })
    emit('validate', isValid)
  }, 500)
}

// Maneja cambios en el formulario
const handleFormChange = () => {
  debouncedEmit()
}

// Método para validación externa
const validate = async () => {
  if (localData.value.rut) {
    await customRutValidation(localData.value.rut)
  }
  
  if (localData.value.birth_date) {
    validateBirthDate(localData.value.birth_date)
  }
  
  await new Promise(resolve => setTimeout(resolve, 200))
  
  immediateEmit()
  return isStepValid.value
}

// ✅ CORRECCIÓN: Watcher para sincronizar datos recuperados del borrador
watch(() => props.formData, (newData) => {
  if (newData && isInitialized.value) {
    // Evitar bucles infinitos comparando valores básicos
    if (newData.first_name !== localData.value.first_name || 
        newData.rut !== localData.value.rut ||
        newData.birth_date !== localData.value.birth_date) {
      
      console.log('🔄 Paso 1 - Sincronizando datos desde prop (Borrador recovered)');
      localData.value = { ...newData };
      
      // Si hay un RUT del borrador, re-validarlo inmediatamente
      if (localData.value.rut && localData.value.rut.length > 8) {
        customRutValidation(localData.value.rut);
      }
    }
  }
}, { deep: true });

// Inicializar con datos del prop
onMounted(() => {
  if (props.formData && Object.keys(props.formData).length > 0) {
    localData.value = { ...props.formData }
    
    // Validar RUT inicial si existe
    if (localData.value.rut) {
      setTimeout(async () => {
        await customRutValidation(localData.value.rut)
        immediateEmit()
      }, 500)
    }
  }
  
  isInitialized.value = true
  
  // Emitir validación inicial
  setTimeout(() => {
    immediateEmit()
  }, 100)
})

// Watch para cambios en el RUT
watch(() => localData.value.rut, (newRut, oldRut) => {
  if (newRut !== oldRut && newRut && newRut.length > 8) {
    setTimeout(async () => {
      await customRutValidation(newRut)
      immediateEmit()
    }, 500)
  }
})

// Exponer el método validate al componente padre
defineExpose({
  validate
})
</script>

<style scoped>
/* Estilos originales del componente */
.step-personal { @apply space-y-6; }
.step-header { @apply flex items-start space-x-4 mb-8 pb-6 border-b border-gray-200; }
.step-number { @apply flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold; }
.step-title h2 { @apply text-2xl font-bold text-gray-900; }
.step-title p { @apply text-gray-600 mt-1; }
.form-grid { @apply grid grid-cols-1 md:grid-cols-2 gap-6; }
.form-group { @apply space-y-2; }
.rut-helpers { @apply mt-1; }
.rut-validation-status.valid { @apply text-green-600; }
.rut-validation-status.checking { @apply text-blue-600; }
.rut-validation-status.error { @apply text-red-600; }
.age-display { @apply p-3 bg-blue-50 border border-blue-200 rounded-lg; }
.age-value { @apply block text-lg font-semibold text-blue-900; }
.age-info { @apply block text-sm text-blue-600; }
.validation-info { @apply mt-8 p-4 rounded-lg border flex items-center space-x-3 transition-colors duration-200; }
.validation-info:not(.is-valid) { @apply bg-yellow-50 border-yellow-200 text-yellow-800; }
.validation-info.is-valid { @apply bg-green-50 border-green-200 text-green-800; }
.validation-icon { @apply flex-shrink-0; }
.validation-text { @apply text-sm font-medium; }
</style>

<style>
/* Estilos globales para FormKit */
.personal-form-grid { @apply space-y-6; }
.formkit-outer { @apply mb-0; }
.formkit-label { @apply block text-sm font-medium text-gray-700 mb-2; }
.formkit-input { @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200; }
.formkit-input:focus { @apply ring-2 ring-blue-500 ring-opacity-20; }
.formkit-message { @apply mt-1 text-sm text-red-600; }
.formkit-help { @apply mt-1 text-sm text-gray-500; }
.formkit-input[type="date"] { @apply pr-10; }
.formkit-input[type="select"] { @apply pr-10 bg-white; }
.formkit-input[data-invalid="true"] { @apply border-red-300 focus:border-red-500 focus:ring-red-500; }
.formkit-input[data-valid="true"] { @apply border-green-300 focus:border-green-500 focus:ring-green-500; }
.formkit-input::placeholder { @apply text-gray-400; }
.formkit-input:disabled { @apply bg-gray-50 text-gray-500 cursor-not-allowed; }
@media (max-width: 768px) {
  .form-grid { @apply grid-cols-1 gap-4; }
  .step-header { @apply flex-col space-x-0 space-y-4; }
  .step-number { @apply w-8 h-8 text-base; }
}
</style>