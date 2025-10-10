<!-- src/components/forms/multi-step/pasos/Paso6Therapy.vue - VERSIÓN CORREGIDA COMPLETA -->
<template>
  <div class="step-therapy">
    <!-- Header del Paso -->
    <div class="step-header">
      <div class="step-number">6</div>
      <div class="step-title">
        <h2 class="text-2xl font-bold text-gray-900">Historial de Terapias</h2>
        <p class="text-gray-600 mt-1">Información sobre terapias previas y derivaciones</p>
      </div>
    </div>

    <!-- Formulario -->
    <FormKit
      type="form"
      id="therapy-form"
      :actions="false"
      v-model="localData"
      @input="handleFormChange"
    >
      <!-- Grid de Campos -->
      <div class="form-grid">
        <!-- ¿Ha recibido terapias antes? -->
        <div class="form-group col-span-full">
          <FormKit
            type="radio"
            name="has_previous_therapies"
            label="¿Ha recibido terapias antes? *"
            :options="therapyHistoryOptions"
            validation="required"
            :validation-messages="{
              required: 'Esta información es requerida'
            }"
            @input="handleTherapyChange"
          />
        </div>

        <!-- Detalle de Terapias Previas (condicional) -->
        <div class="form-group col-span-full" v-if="localData.has_previous_therapies === 'true'">
          <FormKit
            type="textarea"
            name="therapies_detail"
            label="Detalle de Terapias Previas *"
            placeholder="Describa los tipos de terapias recibidas, duración, frecuencia, profesionales tratantes, resultados observados, etc."
            :rows="4"
            validation="required|length:10,1000"
            :validation-messages="{
              required: 'El detalle de terapias es obligatorio cuando ha recibido terapias previas',
              length: 'El detalle debe tener entre 10 y 1000 caracteres'
            }"
          />
          <p class="text-xs text-gray-500 mt-1">
            Incluya tipo de terapia, duración, frecuencia y profesionales involucrados (mínimo 10 caracteres)
          </p>
          <p v-if="localData.therapies_detail && localData.therapies_detail.length < 10" class="text-xs text-red-500 mt-1">
            ⚠️ Faltan {{ 10 - localData.therapies_detail.length }} caracteres
          </p>
        </div>

        <!-- ¿Quién derivó? -->
        <div class="form-group">
          <FormKit
            type="select"
            name="referred_by"
            label="¿Quién derivó?"
            placeholder="Selecciona quién realizó la derivación"
            :options="referredByOptions"
          />
        </div>

        <!-- Detalle de Derivación -->
        <div class="form-group">
          <FormKit
            type="text"
            name="referred_by_detail"
            label="Detalle de Derivación"
            placeholder="Especifique nombre, cargo o detalles"
          />
          <p class="text-xs text-gray-500 mt-1">
            Ej: Dra. María González, neuróloga
          </p>
        </div>

        <!-- ¿Dónde se atendió previamente? -->
        <div class="form-group col-span-full">
          <FormKit
            type="select"
            name="attended_where"
            label="¿Dónde se atendió previamente?"
            placeholder="Selecciona el establecimiento anterior"
            :options="establishmentOptions"
          />
          <p class="text-xs text-gray-500 mt-1">
            Establecimiento donde recibió terapias anteriormente
          </p>
        </div>

        <!-- Información de Apoyo -->
        <div class="form-group col-span-full" v-if="showSupportInfo">
          <div class="support-info">
            <HeartIcon class="h-5 w-5 text-pink-500" />
            <div class="info-content">
              <h4 class="info-title">Importancia del Historial</h4>
              <p class="info-text">
                Conocer el historial de terapias nos ayuda a continuar con los apoyos de manera 
                consistente y a evitar la repetición de estrategias que no han sido efectivas.
              </p>
            </div>
          </div>
        </div>

        <!-- Resumen del Historial de Terapias -->
        <div class="form-group col-span-full" v-if="showTherapySummary">
          <label class="formkit-label">Resumen del Historial</label>
          <div class="therapy-summary">
            <!-- Estado de Terapias Previas -->
            <div class="summary-item">
              <div class="summary-icon" :class="therapyStatusClass">
                <ClockIcon class="h-5 w-5" />
              </div>
              <div class="summary-content">
                <span class="summary-label">Terapias Previas:</span>
                <span class="summary-value">{{ therapyStatusText }}</span>
              </div>
            </div>

            <!-- Detalle de Terapias -->
            <div class="summary-item" v-if="localData.therapies_detail">
              <DocumentTextIcon class="h-5 w-5 text-blue-500" />
              <div class="summary-content">
                <span class="summary-label">Detalle de Terapias:</span>
                <span class="summary-value">{{ localData.therapies_detail }}</span>
              </div>
            </div>

            <!-- Derivación -->
            <div class="summary-item" v-if="localData.referred_by || localData.referred_by_detail">
              <UserGroupIcon class="h-5 w-5 text-green-500" />
              <div class="summary-content">
                <span class="summary-label">Derivación:</span>
                <span class="summary-value">
                  <span v-if="localData.referred_by">{{ referredByDisplay }}</span>
                  <span v-if="localData.referred_by_detail" class="block text-sm text-gray-600">
                    {{ localData.referred_by_detail }}
                  </span>
                </span>
              </div>
            </div>

            <!-- Establecimiento Anterior -->
            <div class="summary-item" v-if="localData.attended_where">
              <BuildingLibraryIcon class="h-5 w-5 text-purple-500" />
              <div class="summary-content">
                <span class="summary-label">Establecimiento Anterior:</span>
                <span class="summary-value">{{ establishmentDisplay }}</span>
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
          <span v-if="isStepValid">✓ Información de historial completa</span>
          <span v-else>⚠ Complete la información requerida</span>
        </div>
      </div>

      <!-- Debug Info -->
      <div class="debug-info" v-if="showDebug">
        <div class="flex justify-between items-center mb-2">
          <h4 class="font-bold">🐛 Debug Paso 6 - Terapias:</h4>
          <button @click="showDebug = false" type="button" class="text-xs px-2 py-1 bg-yellow-200 rounded hover:bg-yellow-300">
            Ocultar
          </button>
        </div>
        <p><strong>has_previous_therapies:</strong> "{{ localData.has_previous_therapies }}" (tipo: {{ typeof localData.has_previous_therapies }})</p>
        <p><strong>therapies_detail:</strong> "{{ localData.therapies_detail }}" (largo: {{ localData.therapies_detail?.length || 0 }})</p>
        <p><strong>referred_by:</strong> "{{ localData.referred_by }}"</p>
        <p><strong>referred_by_detail:</strong> "{{ localData.referred_by_detail }}"</p>
        <p><strong>attended_where:</strong> "{{ localData.attended_where }}"</p>
        <p class="pt-2 border-t border-yellow-300 mt-2"><strong>isStepValid:</strong> {{ isStepValid ? '✅ TRUE' : '❌ FALSE' }}</p>
      </div>
    </FormKit>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  HeartIcon,
  ClockIcon,
  DocumentTextIcon,
  UserGroupIcon,
  BuildingLibraryIcon
} from '@heroicons/vue/24/outline'

// Props y Emits
interface Props {
  formData: {
    has_previous_therapies: string
    therapies_detail: string
    referred_by: string
    referred_by_detail: string
    attended_where: string
  }
}

interface Emits {
  (e: 'update:formData', data: Props['formData']): void
  (e: 'validate', isValid: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Estado local
const localData = ref({
  has_previous_therapies: '',
  therapies_detail: '',
  referred_by: '',
  referred_by_detail: '',
  attended_where: ''
})

const showDebug = ref(true) // Cambiar a false en producción

// Opciones para los campos
const therapyHistoryOptions = {
  'true': 'Sí, ha recibido terapias antes',
  'false': 'No, es la primera vez'
}

const referredByOptions = {
  '': 'Selecciona una opción',
  'school': 'Establecimiento Educacional',
  'doctor': 'Médico',
  'specialist': 'Especialista', 
  'family': 'Familia',
  'other': 'Otro'
}

const establishmentOptions = {
  '': 'Selecciona un establecimiento',
  '3': 'Centro de Terapia Norte',
  '4': 'Clínica Los Alerces', 
  '5': 'Hospital Regional',
  '6': 'Centro de Desarrollo Infantil'
}

// Computed properties
const therapyStatusText = computed(() => {
  if (localData.value.has_previous_therapies === 'true') return 'Sí ha recibido terapias'
  if (localData.value.has_previous_therapies === 'false') return 'Primera vez en terapia'
  return 'No especificado'
})

const therapyStatusClass = computed(() => {
  if (localData.value.has_previous_therapies === 'true') return 'status-yes'
  if (localData.value.has_previous_therapies === 'false') return 'status-no'
  return 'status-unknown'
})

const referredByDisplay = computed(() => {
  return referredByOptions[localData.value.referred_by as keyof typeof referredByOptions] || 'No especificado'
})

const establishmentDisplay = computed(() => {
  return establishmentOptions[localData.value.attended_where as keyof typeof establishmentOptions] || 'No especificado'
})

const showSupportInfo = computed(() => {
  return localData.value.has_previous_therapies === 'true' || 
         localData.value.referred_by !== '' ||
         localData.value.attended_where !== ''
})

const showTherapySummary = computed(() => {
  return localData.value.has_previous_therapies || 
         localData.value.therapies_detail || 
         localData.value.referred_by ||
         localData.value.referred_by_detail ||
         localData.value.attended_where
})

// ✅ VALIDACIÓN CORREGIDA
const isStepValid = computed(() => {
  // Si no ha respondido sobre terapias previas, no es válido
  if (!localData.value.has_previous_therapies || localData.value.has_previous_therapies === '') {
    console.log('❌ Paso 6 inválido: no ha respondido sobre terapias previas')
    return false
  }

  // Si tiene terapias previas, el detalle es obligatorio (mínimo 10 caracteres)
  if (localData.value.has_previous_therapies === 'true') {
    const isValid = localData.value.therapies_detail && localData.value.therapies_detail.trim().length >= 10
    console.log('🔍 Paso 6 con terapias previas:', {
      detail: localData.value.therapies_detail,
      length: localData.value.therapies_detail?.length || 0,
      isValid
    })
    return isValid
  }

  // Si no tiene terapias previas (false), el paso es válido
  console.log('✅ Paso 6 válido: sin terapias previas')
  return true
})

// Maneja cambio específico de terapias para limpiar el detalle
const handleTherapyChange = (value: string | undefined) => {
  console.log('🔄 Cambió respuesta de terapias a:', value)
  
  // Si cambia a "No", limpiar el detalle inmediatamente
  if (value === 'false') {
    nextTick(() => {
      localData.value.therapies_detail = ''
      console.log('🧹 Limpiado detalle de terapias')
      emitChanges()
    })
  }
}

// Maneja cambios en el formulario
const handleFormChange = () => {
  console.log('📝 Cambio en formulario Paso 6:', localData.value)
  emitChanges()
}

// Función centralizada para emitir cambios
const emitChanges = () => {
  // Emitir datos actualizados
  emit('update:formData', { ...localData.value })
  
  // Emitir validación
  nextTick(() => {
    const valid = Boolean(isStepValid.value)
    console.log('📤 Emitiendo validación Paso 6:', valid)
    emit('validate', valid)
  })
}

// Método para validación externa
const validate = () => {
  const isValid = Boolean(isStepValid.value)
  console.log('🔍 Validación forzada Paso 6:', isValid, localData.value)
  emit('validate', isValid)
  return isValid
}

// Inicializar con datos del prop
onMounted(() => {
  console.log('🚀 Paso 6 montado con props:', props.formData)
  
  if (props.formData) {
    // Asegurar que todos los valores sean strings
    localData.value = {
      has_previous_therapies: String(props.formData.has_previous_therapies || ''),
      therapies_detail: String(props.formData.therapies_detail || ''),
      referred_by: String(props.formData.referred_by || ''),
      referred_by_detail: String(props.formData.referred_by_detail || ''),
      attended_where: String(props.formData.attended_where || '')
    }
  }
  
  // Emitir validación inicial después de un breve delay
  setTimeout(() => {
    console.log('⏰ Validación inicial Paso 6')
    emit('validate', Boolean(isStepValid.value))
  }, 100)
})

// Watch para cambios en los props (sincronización)
watch(() => props.formData, (newData) => {
  if (newData && JSON.stringify(newData) !== JSON.stringify(localData.value)) {
    console.log('📥 Sincronizando props en Paso 6:', newData)
    localData.value = {
      has_previous_therapies: String(newData.has_previous_therapies || ''),
      therapies_detail: String(newData.therapies_detail || ''),
      referred_by: String(newData.referred_by || ''),
      referred_by_detail: String(newData.referred_by_detail || ''),
      attended_where: String(newData.attended_where || '')
    }
  }
}, { deep: true })

// Watch para cambios en localData (emitir al padre)
watch(localData, () => {
  emitChanges()
}, { deep: true })

defineExpose({
  validate
})
</script>

<style scoped>
.step-therapy {
  @apply space-y-6;
}

.step-header {
  @apply flex items-start space-x-4 mb-8 pb-6 border-b-2 border-gray-200;
}

.step-number {
  @apply flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold;
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

.form-group {
  @apply space-y-2;
}

.col-span-full {
  @apply md:col-span-2;
}

.support-info {
  @apply flex items-start space-x-3 p-4 bg-pink-50 border-2 border-pink-200 rounded-lg;
}

.info-content {
  @apply flex-1;
}

.info-title {
  @apply font-semibold text-pink-900 mb-1;
}

.info-text {
  @apply text-sm text-pink-800;
}

.therapy-summary {
  @apply space-y-4 p-4 bg-gray-50 border-2 border-gray-200 rounded-lg;
}

.summary-item {
  @apply flex items-start space-x-3;
}

.summary-icon {
  @apply flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center;
}

.summary-icon.status-yes {
  @apply bg-blue-100 text-blue-600;
}

.summary-icon.status-no {
  @apply bg-green-100 text-green-600;
}

.summary-icon.status-unknown {
  @apply bg-gray-100 text-gray-600;
}

.summary-content {
  @apply flex-1;
}

.summary-label {
  @apply text-sm font-medium text-gray-700;
}

.summary-value {
  @apply text-sm text-gray-900 ml-2;
}

.validation-info {
  @apply flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-200;
}

.validation-info:not(.is-valid) {
  @apply bg-yellow-50 border-yellow-200;
}

.validation-info.is-valid {
  @apply bg-green-50 border-green-200;
}

.validation-icon {
  @apply flex-shrink-0;
}

.validation-info:not(.is-valid) .validation-icon {
  @apply text-yellow-600;
}

.validation-info.is-valid .validation-icon {
  @apply text-green-600;
}

.validation-text {
  @apply font-medium;
}

.validation-info:not(.is-valid) .validation-text {
  @apply text-yellow-800;
}

.validation-info.is-valid .validation-text {
  @apply text-green-800;
}

.debug-info {
  @apply mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg text-sm font-mono;
}

.debug-info h4 {
  @apply font-bold mb-2 text-yellow-800;
}

.debug-info p {
  @apply mb-1 text-yellow-700;
}

/* Responsive */
@media (max-width: 768px) {
  .step-header {
    @apply flex-col space-x-0 space-y-3;
  }
  
  .step-number {
    @apply w-10 h-10 text-lg;
  }
}
</style>