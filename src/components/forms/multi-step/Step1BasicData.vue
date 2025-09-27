<!-- src/components/forms/multi-step/steps/Step1BasicData.vue -->
<!-- VERSIÓN CORREGIDA - SIN BUCLES INFINITOS -->
<template>
  <div class="step1-basic-data">
    <div class="step-header">
      <h3>👶 Datos Básicos del Niño</h3>
      <p>Complete la información personal y de contacto del niño</p>
    </div>

    <!-- DEBUG INFO (remover en producción) -->
    <div v-if="showDebugInfo" class="debug-panel">
      <h4>🐛 Debug Step 1:</h4>
      <div class="debug-grid">
        <div><strong>Nombres:</strong> "{{ formData.first_name }}" ({{ formData.first_name ? '✅' : '❌' }})</div>
        <div><strong>Apellidos:</strong> "{{ formData.last_name }}" ({{ formData.last_name ? '✅' : '❌' }})</div>
        <div><strong>RUT:</strong> "{{ formData.rut }}" ({{ isRutValid ? '✅' : '❌' }})</div>
        <div><strong>Fecha Nac:</strong> "{{ formData.birth_date }}" ({{ isBirthDateValid ? '✅' : '❌' }})</div>
        <div><strong>Género:</strong> "{{ formData.gender }}" ({{ formData.gender ? '✅' : '❌' }})</div>
        <div><strong>Formulario Válido:</strong> {{ isFormValid ? '✅ SÍ' : '❌ NO' }}</div>
      </div>
      <button @click="showDebugInfo = false" class="btn-debug">Cerrar Debug</button>
    </div>

    <!-- Formulario con FormKit -->
    <FormKit
      type="form"
      id="basicDataForm"
      v-model="localFormData"
      :actions="false"
      :config="{
        validationVisibility: 'live'
      }"
    >
      <!-- Sección: Información Personal -->
      <div class="form-section">
        <h4>📋 Información Personal</h4>
        <div class="form-grid">
          <!-- Nombre -->
          <FormKit
            type="text"
            name="first_name"
            label="Nombres *"
            placeholder="Ej: Juan Carlos"
            validation="required|length:2,100"
            validation-visibility="live"
            :validation-messages="{
              required: 'Los nombres son obligatorios',
              length: 'Los nombres deben tener entre 2 y 100 caracteres'
            }"
            help="Nombres completos del niño"
            @input="handleFieldChange('first_name', $event)"
          />

          <!-- Apellidos -->
          <FormKit
            type="text"
            name="last_name"
            label="Apellidos *"
            placeholder="Ej: Pérez González"
            validation="required|length:2,100"
            validation-visibility="live"
            :validation-messages="{
              required: 'Los apellidos son obligatorios',
              length: 'Los apellidos deben tener entre 2 y 100 caracteres'
            }"
            help="Apellidos completos del niño"
            @input="handleFieldChange('last_name', $event)"
          />

          <!-- RUT -->
          <FormKit
            type="text"
            name="rut"
            label="RUT *"
            placeholder="Ej: 24322958-8"
            :validation="[
              ['required'],
              [validateChileanRUT]
            ]"
            validation-visibility="live"
            :validation-messages="{
              required: 'El RUT es obligatorio',
              validateChileanRUT: 'RUT chileno inválido'
            }"
            help="RUT chileno del niño (con dígito verificador)"
            @input="handleRutInput"
            @blur="formatRUT"
          />

          <!-- Fecha de Nacimiento -->
          <FormKit
            type="date"
            name="birth_date"
            label="Fecha de Nacimiento *"
            :validation="[
              ['required'],
              [validateBirthDate]
            ]"
            validation-visibility="live"
            :validation-messages="{
              required: 'La fecha de nacimiento es obligatoria',
              validateBirthDate: 'Fecha inválida o el niño debe tener entre 0 y 18 años'
            }"
            help="Fecha de nacimiento del niño"
            :max="maxBirthDate"
            @input="handleFieldChange('birth_date', $event)"
          />

          <!-- Género -->
          <FormKit
            type="select"
            name="gender"
            label="Género *"
            placeholder="Seleccione un género"
            :options="genderOptions"
            validation="required"
            validation-visibility="live"
            :validation-messages="{
              required: 'El género es obligatorio'
            }"
            help="Género del niño"
            @input="handleFieldChange('gender', $event)"
          />
        </div>
      </div>

      <!-- Sección: Información de Contacto -->
      <div class="form-section">
        <h4>🏠 Información de Contacto</h4>
        <div class="form-grid">
          <!-- Calle -->
          <FormKit
            type="text"
            name="street"
            label="Calle"
            placeholder="Ej: Av. Principal"
            validation="length:0,255"
            validation-visibility="live"
            :validation-messages="{
              length: 'La calle no puede exceder 255 caracteres'
            }"
            @input="handleFieldChange('street', $event)"
          />

          <!-- Número -->
          <FormKit
            type="text"
            name="street_number"
            label="Número"
            placeholder="Ej: 123"
            validation="length:0,20"
            validation-visibility="live"
            :validation-messages="{
              length: 'El número no puede exceder 20 caracteres'
            }"
            @input="handleFieldChange('street_number', $event)"
          />

          <!-- Comuna -->
          <FormKit
            type="select"
            name="commune"
            label="Comuna"
            placeholder="Seleccione una comuna"
            :options="communeOptions"
            help="Comuna de residencia"
            @input="handleFieldChange('commune', $event)"
          />

          <!-- Establecimiento Educacional -->
          <FormKit
            type="select"
            name="establishment"
            label="Establecimiento Educacional"
            placeholder="Seleccione un establecimiento"
            :options="establishmentOptions"
            help="Establecimiento donde estudia el niño"
            @input="handleFieldChange('establishment', $event)"
          />
        </div>
      </div>

      <!-- Sección: Información Escolar -->
      <div class="form-section">
        <h4>🏫 Información Escolar</h4>
        <div class="form-grid">
          <!-- Curso/Nivel Actual -->
          <FormKit
            type="text"
            name="current_grade"
            label="Curso/Nivel Actual"
            placeholder="Ej: 1° Básico, Pre-kínder"
            validation="length:0,50"
            validation-visibility="live"
            :validation-messages="{
              length: 'El curso no puede exceder 50 caracteres'
            }"
            @input="handleFieldChange('current_grade', $event)"
          />

          <!-- Jornada Escolar -->
          <FormKit
            type="select"
            name="school_journey"
            label="Jornada Escolar"
            placeholder="Seleccione una jornada"
            :options="schoolJourneyOptions"
            help="Jornada en la que estudia el niño"
            @input="handleFieldChange('school_journey', $event)"
          />

          <!-- Observaciones Adaptación Escolar -->
          <FormKit
            type="textarea"
            name="school_adaptation_notes"
            label="Observaciones de Adaptación Escolar"
            placeholder="Describa cómo se adapta el niño al entorno escolar..."
            rows="3"
            validation="length:0,1000"
            validation-visibility="live"
            :validation-messages="{
              length: 'Las observaciones no pueden exceder 1000 caracteres'
            }"
            help="Comportamiento, adaptación y necesidades en el colegio"
            @input="handleFieldChange('school_adaptation_notes', $event)"
          />
        </div>
      </div>
    </FormKit>

    <!-- Indicador de Validación -->
    <div class="validation-status">
      <div v-if="isFormValid" class="status-valid">
        ✅ Todos los campos obligatorios están completos
      </div>
      <div v-else class="status-invalid">
        ⚠️ Complete los campos obligatorios marcados con *
      </div>
      <button 
        @click="showDebugInfo = !showDebugInfo" 
        class="btn-debug"
        :class="{ 'btn-debug-active': showDebugInfo }"
      >
        {{ showDebugInfo ? 'Ocultar' : 'Mostrar' }} Debug
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'

// Types
interface Step1Data {
  first_name: string
  last_name: string
  rut: string
  birth_date: string
  gender: string
  street: string
  street_number: string
  commune: number | null
  establishment: number | null
  current_grade: string
  school_journey: string
  school_adaptation_notes: string
}

interface Props {
  formData: any
  showValidation?: boolean
}

interface Emits {
  (e: 'update:formData', data: Partial<Step1Data>): void
  (e: 'validate', isValid: boolean): void
}

// Props y Emits
const props = withDefaults(defineProps<Props>(), {
  showValidation: false
})

const emit = defineEmits<Emits>()

// Estado de debug
const showDebugInfo = ref(false)

// Estado reactivo del formulario LOCAL (para evitar bucles)
const localFormData = reactive<Step1Data>({
  first_name: '',
  last_name: '',
  rut: '',
  birth_date: '',
  gender: '',
  street: '',
  street_number: '',
  commune: null,
  establishment: null,
  current_grade: '',
  school_journey: '',
  school_adaptation_notes: ''
})

// Datos del formulario para validación (separados)
const formData = computed(() => localFormData)

// Estado de validación individual
const isRutValid = ref(false)
const isBirthDateValid = ref(false)

// Opciones para selects
const genderOptions = [
  { label: 'Seleccione género', value: '', attrs: { disabled: true } },
  { label: 'Masculino', value: 'male' },
  { label: 'Femenino', value: 'female' },
  { label: 'Otro', value: 'other' },
  { label: 'No especifica', value: 'unspecified' }
]

const schoolJourneyOptions = [
  { label: 'Seleccione jornada', value: '', attrs: { disabled: true } },
  { label: 'Jornada Mañana', value: 'morning' },
  { label: 'Jornada Tarde', value: 'afternoon' },
  { label: 'Jornada Completa', value: 'full_time' },
  { label: 'Jornada Extendida', value: 'extended' }
]

const communeOptions = ref([
  { label: 'Seleccione comuna', value: '', attrs: { disabled: true } },
  { label: 'Santiago', value: 1 },
  { label: 'Providencia', value: 2 },
  { label: 'Las Condes', value: 3 },
  { label: 'Ñuñoa', value: 4 }
])

const establishmentOptions = ref([
  { label: 'Seleccione establecimiento', value: '', attrs: { disabled: true } },
  { label: 'Colegio Los Laureles', value: 1 },
  { label: 'Escuela Básica Municipal', value: 2 },
  { label: 'Jardín Infantil Arcoíris', value: 3 }
])

// Fecha máxima para nacimiento (hoy)
const maxBirthDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

// Función auxiliar para validar dígito verificador del RUT
const validateRUTCheckDigit = (rutNumber: string, checkDigit: string): boolean => {
  let sum = 0
  let multiplier = 2
  
  for (let i = rutNumber.length - 1; i >= 0; i--) {
    sum += parseInt(rutNumber[i]) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }
  
  const remainder = sum % 11
  let expectedCheckDigit = (11 - remainder).toString()
  
  if (expectedCheckDigit === '11') expectedCheckDigit = '0'
  if (expectedCheckDigit === '10') expectedCheckDigit = 'K'
  
  return checkDigit === expectedCheckDigit
}

// Función para validar RUT chileno - SIN LOGS REPETITIVOS
const validateChileanRUT = (node: any) => {
  const rut = node.value || localFormData.rut
  
  if (!rut || rut.trim() === '') {
    isRutValid.value = false
    return false
  }
  
  const cleanRUT = rut.replace(/[.\s-]/g, '').toUpperCase()
  
  if (!/^\d{7,8}[0-9K]$/.test(cleanRUT)) {
    isRutValid.value = false
    return false
  }
  
  const rutNumber = cleanRUT.slice(0, -1)
  const checkDigit = cleanRUT.slice(-1)
  
  const isValid = validateRUTCheckDigit(rutNumber, checkDigit)
  isRutValid.value = isValid
  return isValid
}

// Función para validar fecha de nacimiento - SIN LOGS REPETITIVOS
const validateBirthDate = (node: any) => {
  const value = node.value || localFormData.birth_date
  
  if (!value || value.trim() === '') {
    isBirthDateValid.value = false
    return true // Required se encarga de esto
  }

  const birthDate = new Date(value)
  const today = new Date()
  
  if (isNaN(birthDate.getTime())) {
    isBirthDateValid.value = false
    return false
  }
  
  if (birthDate > today) {
    isBirthDateValid.value = false
    return false
  }

  const birthYear = birthDate.getFullYear()
  const birthMonth = birthDate.getMonth()
  const birthDay = birthDate.getDate()
  
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth()
  const currentDay = today.getDate()

  let age = currentYear - birthYear

  if (currentMonth < birthMonth || 
      (currentMonth === birthMonth && currentDay < birthDay)) {
    age--
  }

  const isValid = age >= 0 && age <= 18
  isBirthDateValid.value = isValid
  
  return isValid
}

// Manejar cambios de campos individuales - SIN CAUSAR BUCLES
const handleFieldChange = (fieldName: string, value: any) => {
  console.log(`📝 Field ${fieldName} changed to:`, value)
  
  // Actualizar el dato local
  ;(localFormData as any)[fieldName] = value
  
  // Emitir al padre PERO SIN VALIDAR INMEDIATAMENTE
  emit('update:formData', { ...localFormData })
  
  // Validar después de un pequeño delay para evitar bucles
  setTimeout(() => {
    validateFormSilently()
  }, 50)
}

// Manejar RUT específicamente
const handleRutInput = (value: string) => {
  const cleanValue = value.replace(/[^0-9kK]/g, '').toUpperCase()
  localFormData.rut = cleanValue
  emit('update:formData', { ...localFormData })
  
  setTimeout(() => {
    validateFormSilently()
  }, 50)
}

// Formatear RUT al perder el foco
const formatRUT = () => {
  if (!localFormData.rut || localFormData.rut.trim() === '') return
  
  let cleanRUT = localFormData.rut.replace(/[^0-9kK]/g, '').toUpperCase()
  
  if (cleanRUT.length < 2) {
    localFormData.rut = cleanRUT
    emit('update:formData', { ...localFormData })
    return
  }
  
  const rutNumber = cleanRUT.slice(0, -1)
  const checkDigit = cleanRUT.slice(-1)
  
  let formattedRUT = rutNumber
  if (rutNumber.length >= 7) {
    formattedRUT = rutNumber.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }
  
  formattedRUT += '-' + checkDigit
  localFormData.rut = formattedRUT
  emit('update:formData', { ...localFormData })
  
  setTimeout(() => {
    validateFormSilently()
  }, 50)
}

// Validación silenciosa (sin logs repetitivos)
const validateFormSilently = () => {
  const requiredFields = ['first_name', 'last_name', 'rut', 'birth_date', 'gender']
  
  const isValid = requiredFields.every(field => {
    const value = (localFormData as any)[field]
    
    if (!value || value.toString().trim().length === 0) {
      return false
    }
    
    if (field === 'rut') {
      return validateChileanRUT({ value })
    }
    
    if (field === 'birth_date') {
      return validateBirthDate({ value })
    }
    
    return true
  })

  // Solo emitir si el estado cambió
  if (isFormValid.value !== isValid) {
    console.log(`🔄 Step 1 validation changed to: ${isValid}`)
    emit('validate', isValid)
  }
}

// Computed para validación del formulario
const isFormValid = computed(() => {
  const requiredFields = ['first_name', 'last_name', 'rut', 'birth_date', 'gender']
  
  return requiredFields.every(field => {
    const value = (localFormData as any)[field]
    
    if (!value || value.toString().trim().length === 0) {
      return false
    }
    
    if (field === 'rut') {
      return isRutValid.value
    }
    
    if (field === 'birth_date') {
      return isBirthDateValid.value
    }
    
    return true
  })
})

// Método público para validación forzada
const validate = () => {
  console.log('🔍 Force validation called on Step1')
  validateFormSilently()
}

// Exponer método validate para el componente padre
defineExpose({
  validate
})

// Inicializar datos desde props
onMounted(async () => {
  if (props.formData) {
    Object.assign(localFormData, props.formData)
  }
  
  await nextTick()
  
  // Validación inicial después de un delay
  setTimeout(() => {
    console.log('🚀 Initial validation for Step1')
    validateFormSilently()
  }, 100)
})

// Watch para cambios en props - SIN VALIDAR AUTOMÁTICAMENTE
watch(() => props.formData, (newData) => {
  if (newData) {
    Object.assign(localFormData, newData)
  }
}, { deep: true })

// Watch para emitir validación cuando cambie el estado
watch(isFormValid, (newValue) => {
  console.log(`✅ Step 1 validity computed as: ${newValue}`)
  emit('validate', newValue)
}, { immediate: true })
</script>

<style scoped>
/* Todos los estilos anteriores más estos nuevos */
.step1-basic-data {
  max-height: 500px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.debug-panel {
  background: #fef3c7;
  border: 2px solid #f59e0b;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}

.debug-panel h4 {
  margin: 0 0 1rem 0;
  color: #92400e;
}

.debug-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.debug-grid div {
  padding: 0.25rem 0.5rem;
  background: #fffbeb;
  border-radius: 4px;
  border: 1px solid #fde68a;
  color: #78350f;
}

.btn-debug {
  background: #f59e0b;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s;
}

.btn-debug:hover {
  background: #d97706;
}

.btn-debug-active {
  background: #dc2626 !important;
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
}

.validation-status {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 6px;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

/* FormKit Styles */
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

:deep(.formkit-wrapper) {
  margin-bottom: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .debug-grid {
    grid-template-columns: 1fr;
  }
  
  .validation-status {
    flex-direction: column;
    gap: 1rem;
  }
}

/* Scrollbar */
.step1-basic-data::-webkit-scrollbar {
  width: 6px;
}

.step1-basic-data::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.step1-basic-data::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}
</style>