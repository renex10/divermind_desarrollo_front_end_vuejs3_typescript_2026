<!-- src/components/forms/multi-step/NneMultiStepForm.vue -->
<!-- FORMULARIO MULTIPASOS PRINCIPAL - CON PERSISTENCIA INTEGRADA -->
<template>
  <div class="multi-step-form">
    <!-- ✅ DRAFT MANAGER PARA PERSISTENCIA -->
    <DraftManager
      :form-id="'nne-multi-step-form'"
      :show-status="true"
      :current-data="formData"
      :current-step="currentStep"
      @recover="handleRecover"
      @discard="handleDiscard"
      @save="handleSave"
    />

    <!-- Progress Steps -->
    <div class="steps-header">
      <div 
        v-for="step in steps" 
        :key="step.number"
        :class="['step-indicator', {
          'active': currentStep === step.number,
          'completed': currentStep > step.number,
          'clickable': step.number < currentStep || step.number === currentStep
        }]"
        @click="goToStep(step.number)"
      >
        <div class="step-number">
          <span v-if="currentStep > step.number">✓</span>
          <span v-else>{{ step.number }}</span>
        </div>
        <div class="step-label">{{ step.label }}</div>
      </div>
    </div>

    <!-- ✅ INDICADOR DE RECUPERACIÓN -->
    <div v-if="isRecovering" class="recovery-notice">
      <div class="recovery-content">
        <ArrowPathIcon class="h-5 w-5 animate-spin" />
        <span>Recuperando borrador anterior...</span>
      </div>
    </div>

    <!-- Debug Info -->
    <div class="debug-info" v-if="showDebug">
      <h4>🐛 Debug Info:</h4>
      <p>Current Step: {{ currentStep }}</p>
      <p>Step Validity: {{ JSON.stringify(stepValidity) }}</p>
      <p>Can proceed: {{ getStepValidity(currentStep) }}</p>
      <p>Form Data usuarios: {{ formData.usuarios }}</p>
      <p>Has Unsaved Changes: {{ hasUnsavedChanges }}</p>
      <p>Is Recovering: {{ isRecovering }}</p>
      <button @click="showDebug = false" class="btn btn-sm">Ocultar Debug</button>
    </div>

    <!-- Step Content -->
    <div class="step-content">
      <!-- Paso 1: Datos Personales -->
      <Paso1StepPersonal
        v-if="currentStep === 1"
        :formData="paso1Data"
        @update:formData="updatePaso1Data"
        @validate="setStepValidity(1, $event)"
        ref="step1Ref"
      />
      
      <!-- Paso 2: Ubicación -->
      <Paso2Location
        v-if="currentStep === 2"
        :formData="paso2Data"
        @update:formData="updatePaso2Data"
        @validate="setStepValidity(2, $event)"
        ref="step2Ref"
      />
      
      <!-- Paso 3: Información Escolar -->
      <Paso3School
        v-if="currentStep === 3"
        :formData="paso3Data"
        @update:formData="updatePaso3Data"
        @validate="setStepValidity(3, $event)"
        ref="step3Ref"
      />
      
      <!-- Paso 4: Perfil Médico -->
      <Paso4Medical
        v-if="currentStep === 4"
        :formData="paso4Data"
        @update:formData="updatePaso4Data"
        @validate="setStepValidity(4, $event)"
        ref="step4Ref"
      />
      
      <!-- Paso 5: Necesidades Especiales -->
      <Paso5SpecialNeeds
        v-if="currentStep === 5"
        :formData="paso5Data"
        @update:formData="updatePaso5Data"
        @validate="setStepValidity(5, $event)"
        ref="step5Ref"
      />
      
      <!-- Paso 6: Historial Terapias -->
      <Paso6Therapy
        v-if="currentStep === 6"
        :formData="paso6Data"
        @update:formData="updatePaso6Data"
        @validate="setStepValidity(6, $event)"
        ref="step6Ref"
      />
      
      <!-- Paso 7: Consentimiento -->
      <Paso7Guardian
        v-if="currentStep === 7"
        :formData="paso7Data"
        @update:formData="updatePaso7Data"
        @validate="setStepValidity(7, $event)"
        ref="step7Ref"
      />
      
      <!-- Paso 8: Padres/Tutores -->
      <Paso8Parents
        v-if="currentStep === 8"
        :formData="formData"
        @update:formData="updateFormData"
        @validate="setStepValidity(8, $event)"
        ref="step8Ref"
      />
      
      <!-- Paso 9: Revisión Final -->
      <Paso9Review
        v-if="currentStep === 9"
        :formData="formData"
        @validate="setStepValidity(9, $event)"
        ref="step9Ref"
      />
    </div>

    <!-- Navigation -->
    <div class="step-navigation">
      <button 
        v-if="currentStep > 1"
        class="btn btn-secondary"
        @click="previousStep"
        type="button"
      >
        ← Anterior
      </button>
      
      <div class="navigation-spacer">
        <button 
          @click="showDebug = !showDebug" 
          class="btn btn-outline btn-sm debug-toggle"
          type="button"
        >
          🐛 Debug
        </button>
        
        <button 
          @click="forceValidation" 
          class="btn btn-outline btn-sm"
          type="button"
        >
          🔄 Validar
        </button>

        <!-- ✅ INDICADOR DE GUARDADO -->
        <div v-if="hasUnsavedChanges" class="unsaved-indicator">
          <div class="saving-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span class="text-xs text-gray-600">Guardando...</span>
        </div>
      </div>
      
      <button 
        v-if="currentStep < totalSteps"
        class="btn btn-primary"
        :disabled="!getStepValidity(currentStep)"
        :class="{ 'btn-disabled': !getStepValidity(currentStep) }"
        @click="nextStep"
        type="button"
      >
        <span v-if="getStepValidity(currentStep)">Siguiente →</span>
        <span v-else>⚠️ Complete los campos requeridos</span>
      </button>
      
      <button 
        v-if="currentStep === totalSteps"
        class="btn btn-success"
        :disabled="!getStepValidity(currentStep) || isSubmitting"
        :class="{ 'btn-disabled': !getStepValidity(currentStep) || isSubmitting }"
        @click="submitForm"
        type="button"
      >
        <span v-if="isSubmitting">⏳ Enviando...</span>
        <span v-else-if="getStepValidity(currentStep)">✅ Registrar Niño</span>
        <span v-else>⚠️ Complete la revisión</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'

// Importar los 9 componentes
import Paso1StepPersonal from './pasos/Paso1StepPersonal.vue'
import Paso2Location from './pasos/Paso2Location.vue'
import Paso3School from './pasos/Paso3School.vue'
import Paso4Medical from './pasos/Paso4Medical.vue'
import Paso5SpecialNeeds from './pasos/Paso5SpecialNeeds.vue'
import Paso6Therapy from './pasos/Paso6Therapy.vue'
import Paso7Guardian from './pasos/Paso7Guardian.vue'
import Paso8Parents from './pasos/Paso8Parents.vue'
import Paso9Review from './pasos/Paso9Review.vue'

// ✅ IMPORTAR SISTEMA DE PERSISTENCIA
import { useFormDraft } from '@/composables/useFormDraft'
import DraftManager from '@/components/forms/DraftManager.vue'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'

// ✅ CORREGIDO: Interface con tipo explícito para stepValidity
interface StepValidityMap {
  [key: number]: boolean
}

// Interface para los datos del formulario
interface NneFormData {
  first_name: string
  last_name: string
  rut: string
  birth_date: string
  gender: string
  street: string
  street_number: string
  commune: any
  region: any
  establishment: any
  current_grade: string
  school_journey: string
  adaptation_notes: string
  allergies: string
  current_medication: string
  emergency_contact: string
  emergency_phone: string
  medical_notes: string
  has_special_needs: boolean
  special_needs_type: string
  autism_level: string
  autism_level_value: string
  pie_diagnosis: string
  pie_entry_date: string
  pie_status: string
  guardian_consent: boolean
  consent_date: string
  has_previous_therapies: boolean
  therapies_detail: string
  referred_by: string
  referred_by_detail: string
  attended_where: any
  usuarios: number[]
}

interface Props {
  editData?: Partial<NneFormData>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'submit', data: NneFormData): void
  (e: 'cancel'): void
}>()

// Referencias a los componentes
const step1Ref = ref<InstanceType<typeof Paso1StepPersonal> | null>(null)
const step2Ref = ref<InstanceType<typeof Paso2Location> | null>(null)
const step3Ref = ref<InstanceType<typeof Paso3School> | null>(null)
const step4Ref = ref<InstanceType<typeof Paso4Medical> | null>(null)
const step5Ref = ref<InstanceType<typeof Paso5SpecialNeeds> | null>(null)
const step6Ref = ref<InstanceType<typeof Paso6Therapy> | null>(null)
const step7Ref = ref<InstanceType<typeof Paso7Guardian> | null>(null)
const step8Ref = ref<InstanceType<typeof Paso8Parents> | null>(null)
const step9Ref = ref<InstanceType<typeof Paso9Review> | null>(null)

// Configuración de pasos
const steps = [
  { number: 1, label: 'Datos Personales' },
  { number: 2, label: 'Ubicación' },
  { number: 3, label: 'Info. Escolar' },
  { number: 4, label: 'Perfil Médico' },
  { number: 5, label: 'Necesidades' },
  { number: 6, label: 'Terapias' },
  { number: 7, label: 'Consentimiento' },
  { number: 8, label: 'Padres' },
  { number: 9, label: 'Revisión' }
]

const totalSteps = steps.length
const currentStep = ref(1)

// ✅ CORREGIDO: stepValidity con tipo explícito
const stepValidity = ref<StepValidityMap>({ 
  1: false, 2: false, 3: false, 4: false, 
  5: false, 6: false, 7: false, 8: false, 9: false 
})

const showDebug = ref(false)
const isSubmitting = ref(false)

// Datos del formulario
const formData = reactive<NneFormData>({
  first_name: '',
  last_name: '', 
  rut: '', 
  birth_date: '', 
  gender: 'unspecified',
  street: '', 
  street_number: '', 
  commune: null, 
  region: null,
  establishment: null,
  current_grade: '', 
  school_journey: '', 
  adaptation_notes: '',
  allergies: '', 
  current_medication: '', 
  emergency_contact: '',
  emergency_phone: '', 
  medical_notes: '',
  has_special_needs: false, 
  special_needs_type: '', 
  autism_level: 'no_review',
  autism_level_value: '',
  pie_diagnosis: '', 
  pie_entry_date: '', 
  pie_status: '',
  guardian_consent: false, 
  consent_date: '',
  has_previous_therapies: false, 
  therapies_detail: '',
  referred_by: '', 
  referred_by_detail: '', 
  attended_where: null,
  usuarios: []
})

// ==========================
// ✅ INICIALIZAR SISTEMA DE PERSISTENCIA (MEJORADO)
// ==========================
const {
  formData: draftData,
  currentStep: draftStep,
  hasUnsavedChanges,
  isRecovering,
  clearAllDrafts,
  forceSave
} = useFormDraft({
  formId: 'nne-multi-step-form',
  autoSave: true,
  autoSaveDelay: 3000,
  draftExpiryDays: 7
})

// ✅ CORREGIDO: Estado de inicialización
const isInitialized = ref(false)

// ✅ CORREGIDO: Inicialización mejorada para sincronización
const initializeFormData = () => {
  console.log('🔄 Inicializando formData con datos del draft...')
  
  // Si hay datos en el draft, usarlos
  if (draftData?.value && Object.keys(draftData.value).length > 0) {
    console.log('📥 Cargando datos del draft:', draftData.value)
    Object.assign(formData, draftData.value)
  } else if (props.editData) {
    // Si no hay draft pero hay datos de edición, usarlos
    console.log('📥 Cargando datos de edición:', props.editData)
    Object.assign(formData, props.editData)
  }
  
  console.log('✅ formData inicializado:', formData)
}

// ==========================
// ✅ SINCRONIZACIÓN MEJORADA ENTRE formData <-> draftData y pasos
// ==========================

// Watch para sincronizar formData -> draftData (cuando el usuario edita)
watch(() => formData, (newFormData) => {
  if (!isRecovering.value && isInitialized.value) {
    console.log('📤 Sincronizando formData -> draftData:', newFormData)
    Object.assign(draftData.value, newFormData)
  }
}, { deep: true, immediate: false })

// Watch para sincronizar draftData -> formData (durante recuperación)
watch(draftData, (newDraftData) => {
  if (isRecovering.value) {
    console.log('📥 Sincronizando draftData -> formData (recuperación):', newDraftData)
    Object.assign(formData, newDraftData)
  }
}, { deep: true })

// Sincronizar currentStep -> draftStep
watch(() => currentStep.value, (newStep) => {
  if (!isRecovering.value && isInitialized.value) {
    draftStep.value = newStep
    console.log('🔀 Sincronizando currentStep -> draftStep:', newStep)
  }
})

// Sincronizar draftStep -> currentStep (durante recuperación)
watch(draftStep, (newDraftStep) => {
  if (isRecovering.value) {
    currentStep.value = newDraftStep
    console.log('🔀 Sincronizando draftStep -> currentStep (recuperación):', newDraftStep)
  }
})

// ✅ CORREGIDO: Manejo mejorado de recuperación (manual / programático)
const handleRecover = async (data: any, step: number) => {
  console.log('🔄 Iniciando recuperación manual...', { step, data })
  try {
    // Asignar datos directamente al formData
    Object.assign(formData, data)
    currentStep.value = step

    console.log('✅ Datos recuperados asignados al formData:', formData)
    console.log('✅ Paso actualizado:', currentStep.value)
    
    // Forzar re-renderizado de los componentes y validaciones
    await nextTick()
    await forceValidation()

    console.log('✅ Recuperación manual completada')
  } catch (error) {
    console.error('❌ Error en recuperación manual:', error)
  }
}

const handleDiscard = () => {
  console.log('🗑️ Descartando borrador...')
  clearAllDrafts()
  
  // Resetear formulario a valores por defecto
  Object.keys(formData).forEach(key => {
    if (Array.isArray((formData as any)[key])) {
      ;(formData as any)[key] = []
    } else if (typeof (formData as any)[key] === 'object' && (formData as any)[key] !== null) {
      ;(formData as any)[key] = null
    } else if (key === 'gender') {
      ;(formData as any)[key] = 'unspecified'
    } else if (key === 'autism_level') {
      ;(formData as any)[key] = 'no_review'
    } else {
      ;(formData as any)[key] = ''
    }
  })
  currentStep.value = 1
  
  console.log('✅ Formulario reseteado')
}

const handleSave = () => {
  console.log('💾 Guardado manual solicitado...')
  forceSave()
}

// ==========================
// FUNCIONES DE ACTUALIZACIÓN (deben estar antes de los computed)
// ==========================
const updatePaso1Data = (data: any) => {
  Object.assign(formData, {
    first_name: data.first_name,
    last_name: data.last_name,
    rut: data.rut,
    birth_date: data.birth_date,
    gender: data.gender
  })
}

const updatePaso2Data = (data: any) => {
  Object.assign(formData, {
    establishment: data.establishment,
    region: data.region,
    commune: data.commune,
    street: data.street,
    street_number: data.street_number
  })
}

const updatePaso3Data = (data: any) => {
  Object.assign(formData, {
    current_grade: data.current_grade,
    school_journey: data.school_journey,
    adaptation_notes: data.school_adaptation_notes
  })
}

const updatePaso4Data = (data: any) => {
  Object.assign(formData, {
    allergies: data.allergies,
    current_medication: data.current_medication,
    emergency_contact: data.emergency_contact,
    emergency_phone: data.emergency_phone,
    medical_notes: data.medical_notes
  })
}

const updatePaso5Data = (data: any) => {
  Object.assign(formData, {
    has_special_needs: data.has_special_needs,
    special_needs_type: data.special_needs_type,
    autism_level: data.autism_level,
    autism_level_value: data.autism_level_value,
    pie_diagnosis: data.pie_diagnosis,
    pie_entry_date: data.pie_entry_date,
    pie_status: data.pie_status
  })
}

const updatePaso6Data = (data: any) => {
  console.log('📥 Actualizando datos Paso 6:', data)
  Object.assign(formData, {
    has_previous_therapies: data.has_previous_therapies,
    therapies_detail: data.therapies_detail,
    referred_by: data.referred_by,
    referred_by_detail: data.referred_by_detail,
    attended_where: data.attended_where
  })
  console.log('✅ formData.has_previous_therapies:', formData.has_previous_therapies)
}

const updatePaso7Data = (data: any) => {
  Object.assign(formData, {
    guardian_consent: data.guardian_consent,
    consent_date: data.consent_date
  })
}

// ==========================
// COMPUTED PROPERTIES para cada paso
// ==========================
const paso1Data = computed(() => ({
  first_name: formData.first_name,
  last_name: formData.last_name,
  rut: formData.rut,
  birth_date: formData.birth_date,
  gender: formData.gender
}))

const paso2Data = computed(() => ({
  establishment: formData.establishment,
  region: formData.region,
  commune: formData.commune,
  street: formData.street,
  street_number: formData.street_number
}))

const paso3Data = computed(() => ({
  current_grade: formData.current_grade,
  school_journey: formData.school_journey,
  school_adaptation_notes: formData.adaptation_notes
}))

const paso4Data = computed(() => ({
  allergies: formData.allergies,
  current_medication: formData.current_medication,
  emergency_contact: formData.emergency_contact,
  emergency_phone: formData.emergency_phone,
  medical_notes: formData.medical_notes
}))

const paso5Data = computed(() => ({
  has_special_needs: formData.has_special_needs,
  special_needs: formData.has_special_needs,
  special_needs_type: formData.special_needs_type,
  autism_level: formData.autism_level,
  autism_level_value: formData.autism_level_value,
  pie_diagnosis: formData.pie_diagnosis,
  pie_entry_date: formData.pie_entry_date,
  pie_status: formData.pie_status
}))

const paso6Data = computed(() => ({
  has_previous_therapies: String(formData.has_previous_therapies),
  therapies_detail: formData.therapies_detail,
  referred_by: formData.referred_by,
  referred_by_detail: formData.referred_by_detail,
  attended_where: formData.attended_where ? String(formData.attended_where) : ''
}))

const paso7Data = computed(() => ({
  guardian_consent: String(formData.guardian_consent),
  consent_date: formData.consent_date
}))

// ==========================
// ✅ NUEVO: Función helper para obtener validez de paso de forma segura
// ==========================
const getStepValidity = (step: number): boolean => {
  return stepValidity.value[step] ?? false
}

// ✅ CORREGIDO: setStepValidity con tipo seguro
const setStepValidity = (step: number, isValid: boolean) => {
  console.log(`✅ Step ${step} validity changed to:`, isValid)
  stepValidity.value = {
    ...stepValidity.value,
    [step]: isValid
  }
}

// ✅ NUEVO: Actualizar formData desde Paso8
const updateFormData = (data: any) => {
  console.log('📥 Actualizando formData desde paso 8:', data)
  Object.assign(formData, data)
  console.log('✅ formData.usuarios actualizado:', formData.usuarios)
}

const forceValidation = async () => {
  console.log(`🔍 Forzando validación del paso ${currentStep.value}`)
  await nextTick()
  
  const currentStepRef = getCurrentStepRef()
  if (currentStepRef && typeof (currentStepRef as any).validate === 'function') {
    const isValid = (currentStepRef as any).validate()
    setStepValidity(currentStep.value, isValid)
  }
}

const getCurrentStepRef = () => {
  switch (currentStep.value) {
    case 1: return step1Ref.value
    case 2: return step2Ref.value  
    case 3: return step3Ref.value
    case 4: return step4Ref.value
    case 5: return step5Ref.value
    case 6: return step6Ref.value
    case 7: return step7Ref.value
    case 8: return step8Ref.value
    case 9: return step9Ref.value
    default: return null
  }
}

// ✅ MEJORA: Forzar guardado de metadata al cambiar de paso
const nextStep = async () => { 
  if (currentStep.value < totalSteps) {
    await forceValidation()
    // Pequeño delay para asegurar que la validación se procese
    await new Promise(resolve => setTimeout(resolve, 150))
    
    if (getStepValidity(currentStep.value)) {
      currentStep.value++
      
      // 🔥 CRÍTICO: Guardado forzado instantáneo para actualizar el número de paso en el borrador
      await nextTick()
      forceSave() 
      
      setTimeout(() => forceValidation(), 300)
    } else {
      showDebug.value = true
    }
  }
}

const previousStep = async () => { 
  if (currentStep.value > 1) {
    currentStep.value--
    
    // 🔥 CRÍTICO: Guardar paso actual inmediatamente
    await nextTick()
    forceSave()
    
    setTimeout(() => forceValidation(), 100)
  }
}

const goToStep = async (step: number) => { 
  if (step >= 1 && step <= totalSteps && step <= currentStep.value) {
    currentStep.value = step
    
    // 🔥 CRÍTICO: Guardar paso actual inmediatamente
    await nextTick()
    forceSave()
    
    setTimeout(() => forceValidation(), 200)
  }
}

// ==========================
// ✅ HELPER: Convertir a booleano
// ==========================
const convertToBoolean = (value: any): boolean => {
  if (typeof value === 'boolean') return value
  if (value === 'true') return true
  if (value === 'false') return false
  return Boolean(value)
}

// ==========================
// ✅ NUEVA FUNCIÓN: Preparar datos para el backend
// ==========================
const prepareDataForBackend = (data: NneFormData) => {
  console.log('🔄 Preparando datos para backend:', data)
  
  const prepared = {
    // Datos personales
    first_name: data.first_name,
    last_name: data.last_name,
    rut: data.rut,
    birth_date: data.birth_date,
    gender: data.gender || 'unspecified',
    
    // Ubicación
    establishment: Number(data.establishment) || 0,
    region: Number(data.region) || 0,
    commune: Number(data.commune) || 0,
    street: data.street,
    street_number: data.street_number,
    
    // Escolar
    current_grade: data.current_grade,
    school_journey: data.school_journey || '',
    adaptation_notes: data.adaptation_notes || '',
    
    // Médico
    allergies: data.allergies || 'Ninguna',
    current_medication: data.current_medication || 'Ninguna',
    emergency_contact: data.emergency_contact,
    emergency_phone: data.emergency_phone,
    medical_notes: data.medical_notes || '',
    
    // Necesidades especiales - ✅ CONVERTIR A BOOLEANO
    has_special_needs: convertToBoolean(data.has_special_needs),
    special_needs_type: data.special_needs_type || 'none',
    autism_level: data.autism_level || 'no_review',
    
    // PIE
    pie_diagnosis: data.pie_diagnosis || '',
    pie_entry_date: data.pie_entry_date || null,
    pie_status: data.pie_status || '',
    
    // Consentimiento - ✅ CONVERTIR A BOOLEANO
    guardian_consent: convertToBoolean(data.guardian_consent),
    consent_date: data.consent_date || new Date().toISOString().split('T')[0],
    
    // Terapias - ✅ CONVERTIR A BOOLEANO
    has_previous_therapies: convertToBoolean(data.has_previous_therapies),
    therapies_detail: data.therapies_detail || '',
    referred_by: data.referred_by || '',
    referred_by_detail: data.referred_by_detail || '',
    attended_where: Number(data.attended_where) || 0,
    
    // Padres - ✅ ASEGURAR ARRAY DE NÚMEROS
    usuarios: Array.isArray(data.usuarios) 
      ? data.usuarios.map(Number).filter(Boolean)
      : []
  }
  
  console.log('📤 Datos preparados:', prepared)
  return prepared
}

// ==========================
// ✅ CORREGIDO: submitForm con preparación de datos y LIMPIEZA DE BORRADORES
// ==========================
const submitForm = async () => {
  console.log('🚀 ========== INICIO SUBMIT FORM ==========')
  console.log('📊 Estado de validación completo:', stepValidity.value)
  console.log('📋 Datos del formulario ANTES de preparar:', JSON.stringify(formData, null, 2))
  console.log('🔍 Paso actual:', currentStep.value)
  console.log('🔍 Total de pasos:', totalSteps)
  console.log('🔍 Validez del último paso:', getStepValidity(totalSteps))
  
  if (!getStepValidity(totalSteps)) {
    console.error('❌ SUBMIT BLOQUEADO: Paso 9 no está válido')
    console.error('❌ Estado de validación del paso 9:', stepValidity.value[9])
    showDebug.value = true
    alert('⚠️ Por favor complete todos los campos requeridos en la revisión final.')
    return
  }
  
  console.log('✅ Validación del paso 9 APROBADA, continuando...')
  isSubmitting.value = true
  
  try {
    await nextTick()
    
    // Preparar datos para el backend
    const dataToSubmit = prepareDataForBackend(formData)
    
    console.log('📤 ========== DATOS FINALES A ENVIAR ==========')
    console.log(JSON.stringify(dataToSubmit, null, 2))
    console.log('📤 Usuarios a asociar:', dataToSubmit.usuarios)
    console.log('📤 Has special needs:', dataToSubmit.has_special_needs, typeof dataToSubmit.has_special_needs)
    console.log('📤 Guardian consent:', dataToSubmit.guardian_consent, typeof dataToSubmit.guardian_consent)
    console.log('📤 Has previous therapies:', dataToSubmit.has_previous_therapies, typeof dataToSubmit.has_previous_therapies)
    console.log('================================================')
    
    console.log('🎯 Emitiendo evento submit...')
    emit('submit', dataToSubmit as NneFormData)
    
    // ✅ LIMPIAR BORRADORES DESPUÉS DE ENVÍO EXITOSO
    clearAllDrafts()
    console.log('🧹 Borradores limpiados después del envío exitoso')
    
    console.log('✅ Evento submit emitido correctamente')
    
  } catch (error) {
    console.error('❌ ========== ERROR EN SUBMIT ==========>')
    console.error('Error completo:', error)
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack available')
    console.error('==========================================')
    alert(`❌ Error al enviar el formulario: ${error instanceof Error ? error.message : 'Error desconocido'}`)
  } finally {
    isSubmitting.value = false
    console.log('🏁 ========== FIN SUBMIT FORM ==========')
  }
}

// ==========================
// MOUNT y WATCHERS GLOBALES
// ==========================
onMounted(async () => {
  console.log('🚀 Montando NneMultiStepForm...')

  // Cargar datos de edición si existen (inmediatamente para evitar sobrescritura por draft)
  if (props.editData && Object.keys(props.editData).length > 0) {
    console.log('📥 Cargando props.editData en onMounted:', props.editData)
    Object.assign(formData, props.editData)
  }

  // Pequeño delay para permitir que useFormDraft se inicialice
  setTimeout(() => {
    initializeFormData()
    isInitialized.value = true
    console.log('✅ NneMultiStepForm inicializado completamente')
  }, 100)
  
  await nextTick()
  setTimeout(() => forceValidation(), 800)
})

watch(currentStep, async () => {
  await nextTick()
  setTimeout(() => forceValidation(), 200)
})

defineExpose({
  forceValidation,
  getCurrentStep: () => currentStep.value,
  getStepValidity: () => stepValidity.value
})
</script>

<style scoped>
.multi-step-form {
  min-height: 100vh;
  background: #f8fafc;
  padding: 2rem;
}

.steps-header {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 0.5rem;
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0.25rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  cursor: default;
  min-width: 0;
}

.step-indicator.clickable {
  cursor: pointer;
}

.step-indicator.clickable:hover {
  background-color: #f8fafc;
}

.step-indicator.active {
  background-color: #eff6ff;
}

.step-indicator.completed .step-number {
  background-color: #10b981;
  color: white;
}

.step-number {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  color: #6b7280;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.step-indicator.active .step-number {
  background-color: #3b82f6;
  color: white;
}

.step-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-align: center;
  line-height: 1.2;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

.step-indicator.active .step-label {
  color: #3b82f6;
  font-weight: 600;
}

.step-indicator.completed .step-label {
  color: #10b981;
}

.step-content {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;
  min-height: 400px;
  padding: 2rem;
}

.step-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.navigation-spacer {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

/* ✅ ESTILOS PARA INDICADOR DE RECUPERACIÓN */
.recovery-notice {
  @apply bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4;
}

.recovery-content {
  @apply flex items-center gap-3 text-blue-700 font-medium;
}

/* ✅ ESTILOS PARA INDICADOR DE GUARDADO */
.unsaved-indicator {
  @apply flex items-center gap-2 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-lg;
}

.saving-dots {
  @apply flex space-x-1;
}

.saving-dots span {
  @apply w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse;
}

.saving-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.saving-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  white-space: nowrap;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

.btn-success {
  background-color: #10b981;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #059669;
}

.btn-outline {
  background-color: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.btn-outline:hover:not(:disabled) {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.btn-disabled,
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.debug-info {
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  font-family: monospace;
  font-size: 0.875rem;
}

.debug-info h4 {
  margin: 0 0 0.5rem 0;
  color: #92400e;
}

.debug-info p {
  margin: 0.25rem 0;
  color: #78350f;
}

@media (max-width: 1200px) {
  .steps-header {
    grid-template-columns: repeat(9, minmax(70px, 1fr));
    gap: 0.25rem;
    padding: 1rem 0.5rem;
  }
  
  .step-label {
    font-size: 0.65rem;
  }
  
  .step-number {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 768px) {
  .multi-step-form {
    padding: 1rem;
  }
  
  .steps-header {
    grid-template-columns: repeat(9, 1fr);
    gap: 0.25rem;
    padding: 0.75rem 0.5rem;
  }
  
  .step-label {
    font-size: 0.6rem;
  }
  
  .step-number {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.7rem;
  }
  
  .step-content {
    padding: 1rem;
  }
  
  .step-navigation {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .navigation-spacer {
    order: -1;
    width: 100%;
    justify-content: center;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }

  .unsaved-indicator {
    justify-content: center;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .steps-header {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 0.5rem;
    padding: 1rem;
  }
  
  .step-label {
    font-size: 0.7rem;
  }
  
  .step-number {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.75rem;
  }
}
</style>