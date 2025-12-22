<!-- src/components/forms/multi-step/NneMultiStepForm.vue -->
<!-- FORMULARIO MULTIPASOS PRINCIPAL - CON PERSISTENCIA Y SWEETALERT2 -->
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
          'clickable': step.number < currentStep || step.number === step.number
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
      
      <!-- ✅ BOTÓN DE SUBMIT CON SWEETALERT2 -->
      <button 
        v-if="currentStep === totalSteps"
        class="btn btn-success"
        :disabled="!getStepValidity(currentStep) || isSubmitting"
        :class="{ 'btn-disabled': !getStepValidity(currentStep) || isSubmitting }"
        @click="submitFormWithConfirmation"
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

// ✅ IMPORTAR SWEETALERT2
import Swal from 'sweetalert2'

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
  (e: 'submitSuccess', data: any): void
  (e: 'submitError', error: any): void
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

// ✅ SISTEMA DE PERSISTENCIA INTEGRADO
const {
  formData: draftData,
  clearAllDrafts,
  isRecovering,
  hasUnsavedChanges
} = useFormDraft({
  formId: 'nne-multi-step-form',
  autoSave: true,
  autoSaveDelay: 1500
})

// Flag para controlar si ya se inicializó
const isInitialized = ref(false)

// ✅ CORREGIDO: Computed para Paso 2 (sin conflicto con FormData nativo)
const paso2Data = computed(() => ({
  street: formData.street,
  street_number: formData.street_number,
  commune: formData.commune,
  region: formData.region
}))

// Computed para cada paso
const paso1Data = computed(() => ({
  first_name: formData.first_name,
  last_name: formData.last_name,
  rut: formData.rut,
  birth_date: formData.birth_date,
  gender: formData.gender
}))

// ✅ CORREGIDO: Paso 3 con school_adaptation_notes
const paso3Data = computed(() => ({
  establishment: formData.establishment,
  current_grade: formData.current_grade,
  school_journey: formData.school_journey,
  adaptation_notes: formData.adaptation_notes,
  school_adaptation_notes: formData.adaptation_notes // ← Alias para compatibilidad
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
  special_needs_type: formData.special_needs_type,
  autism_level: formData.autism_level,
  autism_level_value: formData.autism_level_value,
  pie_diagnosis: formData.pie_diagnosis,
  pie_entry_date: formData.pie_entry_date,
  pie_status: formData.pie_status
}))

const paso6Data = computed(() => ({
  has_previous_therapies: formData.has_previous_therapies,
  therapies_detail: formData.therapies_detail,
  referred_by: formData.referred_by,
  referred_by_detail: formData.referred_by_detail,
  attended_where: formData.attended_where
}))

const paso7Data = computed(() => ({
  guardian_consent: formData.guardian_consent,
  consent_date: formData.consent_date
}))

// Update functions para cada paso
const updatePaso1Data = (data: any) => {
  Object.assign(formData, data)
}

const updatePaso2Data = (data: any) => {
  Object.assign(formData, data)
}

const updatePaso3Data = (data: any) => {
  // Manejar tanto adaptation_notes como school_adaptation_notes
  if (data.school_adaptation_notes !== undefined) {
    data.adaptation_notes = data.school_adaptation_notes
  }
  Object.assign(formData, data)
}

const updatePaso4Data = (data: any) => {
  Object.assign(formData, data)
}

const updatePaso5Data = (data: any) => {
  Object.assign(formData, data)
}

const updatePaso6Data = (data: any) => {
  Object.assign(formData, data)
}

const updatePaso7Data = (data: any) => {
  Object.assign(formData, data)
}

const updateFormData = (data: any) => {
  Object.assign(formData, data)
}

// ==========================
// FUNCIONES DE NAVEGACIÓN
// ==========================

const setStepValidity = (step: number, isValid: boolean) => {
  stepValidity.value[step] = isValid
  console.log(`🔍 Paso ${step} validez actualizada a:`, isValid)
}

const getStepValidity = (step: number): boolean => {
  return stepValidity.value[step] || false
}

const nextStep = async () => {
  if (currentStep.value < totalSteps && getStepValidity(currentStep.value)) {
    currentStep.value++
    await nextTick()
    setTimeout(() => forceValidation(), 200)
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const goToStep = (step: number) => {
  if (step <= currentStep.value || step === currentStep.value) {
    currentStep.value = step
    setTimeout(() => forceValidation(), 200)
  }
}

// ✅ CORREGIDO: forceValidation sin error de tipo
const forceValidation = async () => {
  await nextTick()
  
  const stepRefs: Array<any> = [
    step1Ref,
    step2Ref,
    step3Ref,
    step4Ref,
    step5Ref,
    step6Ref,
    step7Ref,
    step8Ref,
    step9Ref
  ]
  
  const currentRef = stepRefs[currentStep.value - 1]
  
  // ✅ Verificar que el método validate existe
  if (currentRef?.value && 'validate' in currentRef.value && typeof (currentRef.value as any).validate === 'function') {
    const isValid = await (currentRef.value as any).validate()
    setStepValidity(currentStep.value, isValid)
  }
}

// ==========================
// FUNCIONES DE PERSISTENCIA
// ==========================

const initializeFormData = () => {
  if (draftData.value && Object.keys(draftData.value).length > 0 && !isRecovering.value) {
    console.log('✅ Recuperando datos del borrador:', draftData.value)
    Object.assign(formData, draftData.value)
    
    if (draftData.value.currentStep) {
      currentStep.value = draftData.value.currentStep
    }
  }
}

const handleRecover = () => {
  if (draftData.value && Object.keys(draftData.value).length > 0) {
    Object.assign(formData, draftData.value)
    if (draftData.value.currentStep) {
      currentStep.value = draftData.value.currentStep
    }
    setTimeout(() => forceValidation(), 500)
  }
}

const handleDiscard = () => {
  Object.keys(formData).forEach(key => {
    const typedKey = key as keyof NneFormData
    if (typeof formData[typedKey] === 'boolean') {
      (formData[typedKey] as any) = false
    } else if (Array.isArray(formData[typedKey])) {
      (formData[typedKey] as any) = []
    } else if (typeof formData[typedKey] === 'object') {
      (formData[typedKey] as any) = null
    } else {
      (formData[typedKey] as any) = ''
    }
  })
  currentStep.value = 1
  stepValidity.value = { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false }
}

// ✅ CORREGIDO: handleSave sin parámetros
const handleSave = () => {
  // La sincronización se hace automáticamente en el watcher
  console.log('💾 Guardado manual solicitado')
}

// ==========================
// SINCRONIZACIÓN DE DATOS
// ==========================

watch(formData, (newVal) => {
  if (isInitialized.value && !isRecovering.value) {
    const dataToSave = {
      ...newVal,
      currentStep: currentStep.value
    }
    Object.assign(draftData.value, dataToSave)
  }
}, { deep: true })

watch(currentStep, (newStep) => {
  if (isInitialized.value && !isRecovering.value) {
    draftData.value.currentStep = newStep
  }
})

// ==========================
// FUNCIÓN AUXILIAR
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
// ✅✅✅ NUEVA FUNCIÓN: Submit con SweetAlert2
// ==========================
const submitFormWithConfirmation = async () => {
  console.log('🚀 ========== INICIO SUBMIT CON SWEETALERT ==========')
  
  // Validación inicial
  if (!getStepValidity(totalSteps)) {
    console.error('❌ SUBMIT BLOQUEADO: Paso 9 no está válido')
    
    await Swal.fire({
      icon: 'warning',
      title: 'Formulario Incompleto',
      html: `
        <div style="text-align: left;">
          <p style="margin-bottom: 1rem;">Por favor complete todos los campos requeridos:</p>
          <ul style="color: #dc2626; line-height: 1.8;">
            <li>✓ Revise que todos los datos sean correctos</li>
            <li>✓ Verifique los padres/tutores asignados</li>
            <li>✓ Confirme la información en la revisión final</li>
          </ul>
        </div>
      `,
      confirmButtonColor: '#f59e0b',
      confirmButtonText: 'Entendido'
    })
    
    showDebug.value = true
    return
  }
  
  // ✅ CONFIRMACIÓN ANTES DE ENVIAR
  // ✅ CORREGIDO: No asignar a variable no usada
  await Swal.fire({
    title: '¿Registrar Niño/a?',
    html: `
      <div style="text-align: left; padding: 1rem;">
        <p style="margin-bottom: 1rem;"><strong>Se creará la ficha con los siguientes datos:</strong></p>
        <ul style="list-style: none; padding: 0; background: #f3f4f6; padding: 1rem; border-radius: 6px; font-size: 0.9rem;">
          <li style="margin-bottom: 0.5rem;">👤 <strong>Nombre:</strong> ${formData.first_name} ${formData.last_name}</li>
          <li style="margin-bottom: 0.5rem;">🆔 <strong>RUT:</strong> ${formData.rut}</li>
          <li style="margin-bottom: 0.5rem;">📅 <strong>Fecha Nacimiento:</strong> ${formData.birth_date}</li>
          <li style="margin-bottom: 0.5rem;">👨‍👩‍👧 <strong>Padres/Tutores:</strong> ${formData.usuarios.length} asignado(s)</li>
        </ul>
        <p style="margin-top: 1rem; color: #6b7280; font-size: 0.85rem;">
          ¿Confirma que los datos son correctos?
        </p>
      </div>
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, registrar',
    cancelButtonText: 'Revisar datos',
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      return await submitForm()
    },
    allowOutsideClick: () => !Swal.isLoading()
  })
}

// ==========================
// ✅ FUNCIÓN INTERNA: Submit real (llamada por confirmación)
// ==========================
const submitForm = async () => {
  console.log('✅ Confirmación recibida, iniciando envío...')
  console.log('📊 Estado de validación completo:', stepValidity.value)
  console.log('📋 Datos del formulario ANTES de preparar:', JSON.stringify(formData, null, 2))
  
  isSubmitting.value = true
  
  try {
    await nextTick()
    
    // Preparar datos para el backend
    const dataToSubmit = prepareDataForBackend(formData)
    
    console.log('📤 ========== DATOS FINALES A ENVIAR ==========')
    console.log(JSON.stringify(dataToSubmit, null, 2))
    console.log('📤 Usuarios a asociar:', dataToSubmit.usuarios)
    console.log('================================================')
    
    console.log('🎯 Emitiendo evento submit...')
    
    // Emitir evento al componente padre
    emit('submit', dataToSubmit as NneFormData)
    
    // NOTA: El éxito se manejará desde el componente padre
    // que llamará a handleSubmitSuccess
    
    return true
    
  } catch (error) {
    console.error('❌ ========== ERROR EN SUBMIT ==========')
    console.error('Error completo:', error)
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack available')
    
    // ✅ SWEETALERT2: Notificación de error
    await Swal.fire({
      icon: 'error',
      title: 'Error al Enviar Formulario',
      html: `
        <div style="text-align: left;">
          <p style="margin-bottom: 1rem; color: #dc2626;">
            <strong>Ocurrió un error al procesar el formulario:</strong>
          </p>
          <p style="background: #fee2e2; padding: 1rem; border-radius: 6px; color: #991b1b;">
            ${error instanceof Error ? error.message : 'Error desconocido'}
          </p>
        </div>
      `,
      confirmButtonColor: '#dc2626',
      footer: '<small>Por favor intente nuevamente o contacte al soporte técnico</small>'
    })
    
    return false
    
  } finally {
    isSubmitting.value = false
    console.log('🏁 ========== FIN SUBMIT FORM ==========')
  }
}

// ==========================
// ✅ FUNCIONES PÚBLICAS PARA EL COMPONENTE PADRE
// ==========================

/**
 * Llamar esta función cuando el backend confirme el éxito
 */
const handleSubmitSuccess = async (response: any) => {
  console.log('✅ handleSubmitSuccess llamado con:', response)
  
  // ✅ LIMPIAR BORRADORES DESPUÉS DE ÉXITO CONFIRMADO
  clearAllDrafts()
  console.log('🧹 Borradores limpiados después del éxito')
  
  // ✅ SWEETALERT2: Notificación de éxito
  await Swal.fire({
    icon: 'success',
    title: '¡Registro Exitoso! 🎉',
    html: `
      <div style="text-align: left; padding: 1rem;">
        <p style="margin-bottom: 1rem;"><strong>La ficha ha sido creada exitosamente:</strong></p>
        <ul style="list-style: none; padding: 0;">
          <li style="margin-bottom: 0.5rem;">✅ <strong>Niño/a:</strong> ${formData.first_name} ${formData.last_name}</li>
          <li style="margin-bottom: 0.5rem;">🆔 <strong>RUT:</strong> ${formData.rut}</li>
          ${response?.id ? `<li style="margin-bottom: 0.5rem;">📋 <strong>ID Ficha:</strong> ${response.id}</li>` : ''}
        </ul>
        <p style="margin-top: 1rem; color: #10b981; font-weight: 600; text-align: center; background: #d1fae5; padding: 0.75rem; border-radius: 6px;">
          ✅ El registro fue procesado correctamente
        </p>
      </div>
    `,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#10b981',
    timer: 6000,
    timerProgressBar: true,
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    }
  })
  
  // Emitir evento de éxito
  emit('submitSuccess', response)
}

/**
 * Llamar esta función cuando el backend retorne error
 */
const handleSubmitError = async (error: any) => {
  console.error('❌ handleSubmitError llamado con:', error)
  
  // Extraer mensaje de error
  let errorMessage = 'Error desconocido al procesar el registro'
  let errorDetails = ''
  
  if (error.response?.data) {
    const data = error.response.data
    
    // Manejar errores de validación
    if (data.errors) {
      errorDetails = '<ul style="text-align: left; color: #991b1b; line-height: 1.8;">'
      Object.entries(data.errors).forEach(([field, messages]: [string, any]) => {
        if (Array.isArray(messages)) {
          messages.forEach(msg => {
            errorDetails += `<li>• <strong>${field}:</strong> ${msg}</li>`
          })
        }
      })
      errorDetails += '</ul>'
      errorMessage = 'Errores de validación en el formulario'
    } else if (data.message) {
      errorMessage = data.message
    } else if (data.detail) {
      errorMessage = data.detail
    }
  } else if (error.message) {
    errorMessage = error.message
  }
  
  // ✅ SWEETALERT2: Notificación de error detallada
  await Swal.fire({
    icon: 'error',
    title: 'Error al Crear Ficha',
    html: `
      <div style="text-align: left;">
        <p style="margin-bottom: 1rem; color: #dc2626;">
          <strong>${errorMessage}</strong>
        </p>
        ${errorDetails ? `<div style="background: #fee2e2; padding: 1rem; border-radius: 6px; max-height: 300px; overflow-y: auto;">${errorDetails}</div>` : ''}
        ${!errorDetails ? `<p style="background: #fee2e2; padding: 1rem; border-radius: 6px; color: #991b1b;">${errorMessage}</p>` : ''}
      </div>
    `,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Entendido',
    footer: '<small>Revise los errores y vuelva a intentar. Si el problema persiste, contacte al soporte.</small>',
    width: '600px'
  })
  
  // Emitir evento de error
  emit('submitError', error)
}

// ==========================
// MOUNT y WATCHERS GLOBALES
// ==========================
onMounted(async () => {
  console.log('🚀 Montando NneMultiStepForm...')

  // Cargar datos de edición si existen
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

// ✅ EXPONER FUNCIONES PÚBLICAS
defineExpose({
  forceValidation,
  getCurrentStep: () => currentStep.value,
  getStepValidity: () => stepValidity.value,
  handleSubmitSuccess,
  handleSubmitError
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
  background-color: #dbeafe;
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
  background-color: #e5e7eb;
  color: #6b7280;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.step-indicator.active .step-number {
  background-color: #3b82f6;
  color: white;
}

.step-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.step-indicator.active .step-label {
  color: #1f2937;
  font-weight: 600;
}

.recovery-notice {
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  animation: slideDown 0.3s ease-out;
}

.recovery-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #92400e;
  font-weight: 500;
}

.step-content {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  min-height: 400px;
}

.step-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.navigation-spacer {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.unsaved-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #fef3c7;
  border-radius: 0.5rem;
}

.saving-dots {
  display: flex;
  gap: 0.25rem;
}

.saving-dots span {
  width: 6px;
  height: 6px;
  background: #f59e0b;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.saving-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.saving-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn:disabled,
.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #059669;
}

.btn-outline {
  background: white;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.btn-outline:hover:not(:disabled) {
  background: #f9fafb;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
}

.debug-info {
  background: #fef3c7;
  border: 2px solid #fbbf24;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.debug-info h4 {
  margin: 0 0 0.5rem 0;
  color: #92400e;
}

.debug-info p {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: #78350f;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .multi-step-form {
    padding: 1rem;
  }
  
  .steps-header {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  
  .step-label {
    font-size: 0.65rem;
  }
  
  .step-navigation {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}

/* ✅ ESTILOS PARA SWEETALERT2 */
:global(.swal2-popup) {
  font-family: inherit;
}

:global(.swal2-html-container ul) {
  text-align: left;
}

:global(.animate__animated) {
  animation-duration: 0.3s;
}
</style>