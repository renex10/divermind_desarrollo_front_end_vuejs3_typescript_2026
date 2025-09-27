<!-- src\components\forms\multi-step\NneMultiStepForm.vue -->
<!-- FORMULARIO MULTIPASOS PRINCIPAL - VERSIÓN MEJORADA -->
<template>
  <div class="multi-step-form">
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

    <!-- Debug Info (remover en producción) -->
    <div class="debug-info" v-if="showDebug">
      <h4>🐛 Debug Info:</h4>
      <p>Current Step: {{ currentStep }}</p>
      <p>Step Validity: {{ JSON.stringify(stepValidity) }}</p>
      <p>Can proceed: {{ stepValidity[currentStep] }}</p>
      <button @click="showDebug = false" class="btn btn-sm">Ocultar Debug</button>
    </div>

    <!-- Step Content -->
    <div class="step-content">
      <Step1BasicData
        v-if="currentStep === 1"
        v-model:form-data="formData"
        @validate="setStepValidity(1, $event)"
        ref="step1Ref"
      />
      
      <Step2MedicalInfo
        v-if="currentStep === 2"
        v-model:form-data="formData"
        @validate="setStepValidity(2, $event)"
        ref="step2Ref"
      />
      
      <Step3ParentsManager
        v-if="currentStep === 3"
        v-model:form-data="formData"
        @validate="setStepValidity(3, $event)"
        ref="step3Ref"
      />
      
      <Step4ReviewConsent
        v-if="currentStep === 4"
        v-model:form-data="formData"
        @validate="setStepValidity(4, $event)"
        ref="step4Ref"
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
        <!-- Botón de debug -->
        <button 
          @click="showDebug = !showDebug" 
          class="btn btn-outline btn-sm debug-toggle"
          type="button"
        >
          🐛 Debug
        </button>
        
        <!-- Botón para forzar validación -->
        <button 
          @click="forceValidation" 
          class="btn btn-outline btn-sm"
          type="button"
        >
          🔄 Validar
        </button>
      </div>
      
      <button 
        v-if="currentStep < totalSteps"
        class="btn btn-primary"
        :disabled="!stepValidity[currentStep]"
        :class="{ 'btn-disabled': !stepValidity[currentStep] }"
        @click="nextStep"
        type="button"
      >
        <span v-if="stepValidity[currentStep]">Siguiente →</span>
        <span v-else>⚠️ Complete los campos requeridos</span>
      </button>
      
      <button 
        v-if="currentStep === totalSteps"
        class="btn btn-success"
        :disabled="!stepValidity[currentStep] || isSubmitting"
        :class="{ 'btn-disabled': !stepValidity[currentStep] || isSubmitting }"
        @click="submitForm"
        type="button"
      >
        <span v-if="isSubmitting">⏳ Enviando...</span>
        <span v-else-if="stepValidity[currentStep]">✅ Registrar Niño</span>
        <span v-else>⚠️ Complete la revisión</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import type { NneFormData } from '../../../type/nne'

// Step Components
import Step1BasicData from './Step1BasicData.vue'
import Step2MedicalInfo from './Step2MedicalInfo.vue'
import Step3ParentsManager from './Step3ParentsManager.vue'
import Step4ReviewConsent from './Step4ReviewConsent.vue'

interface Props {
  editData?: Partial<NneFormData>
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'submit', data: NneFormData): void
  (e: 'cancel'): void
}>()

// Referencias a los componentes de pasos
const step1Ref = ref(null)
const step2Ref = ref(null)
const step3Ref = ref(null)
const step4Ref = ref(null)

const steps = [
  { number: 1, label: 'Datos Básicos' },
  { number: 2, label: 'Información Médica' },
  { number: 3, label: 'Padres/Tutores' },
  { number: 4, label: 'Revisión' }
]

const totalSteps = steps.length
const currentStep = ref(1)
const stepValidity = reactive({ 1: false, 2: false, 3: false, 4: false })
const isSubmitting = ref(false)
const showDebug = ref(false)

// Datos del formulario - inicializados con valores por defecto más completos
const formData = reactive<NneFormData>({
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
  school_adaptation_notes: '',
  special_needs: false, 
  special_needs_type: '', 
  autism_level_value: 'no_review',
  pie_diagnosis: '', 
  pie_entry_date: '', 
  pie_status: '',
  allergies: '', 
  current_medication: '', 
  emergency_contact: '',
  emergency_phone: '', 
  medical_notes: '',
  usuarios: [],
  guardian_consent: false, 
  consent_date: '',
  previous_therapies: false, 
  previous_therapies_detail: '',
  referred_by: '', 
  referred_by_detail: '', 
  attended_where: ''
})

// Cargar datos de edición
onMounted(async () => {
  if (props.editData) {
    Object.assign(formData, props.editData)
  }
  
  // Esperar a que Vue renderice los componentes
  await nextTick()
  
  // Forzar validación inicial después de un delay más largo
  setTimeout(() => {
    console.log('🚀 Iniciando validación inicial...')
    forceValidation()
  }, 500)
})

// Función mejorada para establecer la validez de cada paso
const setStepValidity = (step: number, isValid: boolean) => {
  console.log(`✅ Step ${step} validity changed to:`, isValid)
  const oldValue = stepValidity[step]
  stepValidity[step] = isValid
  
  if (oldValue !== isValid) {
    console.log(`🔄 Step ${step} validity CHANGED from ${oldValue} to ${isValid}`)
  }
}

// Función para forzar validación del paso actual - SIN BUCLES
const forceValidation = async () => {
  console.log(`🔍 Forzando validación del paso ${currentStep.value}`)
  
  await nextTick()
  
  // Intentar llamar al método de validación del componente actual
  const currentStepRef = getCurrentStepRef()
  if (currentStepRef && typeof currentStepRef.validate === 'function') {
    console.log('📞 Llamando método validate del componente')
    currentStepRef.validate()
  }
  
  // NO modificar formData aquí para evitar bucles infinitos
  // const formDataCopy = JSON.parse(JSON.stringify(formData))
  // Object.assign(formData, formDataCopy)
  
  console.log(`📊 Estado después de forzar validación: ${stepValidity[currentStep.value]}`)
}

// Obtener referencia del componente del paso actual
const getCurrentStepRef = () => {
  switch (currentStep.value) {
    case 1: return step1Ref.value
    case 2: return step2Ref.value  
    case 3: return step3Ref.value
    case 4: return step4Ref.value
    default: return null
  }
}

// Navegación entre pasos mejorada
const goToStep = (step: number) => { 
  console.log(`🎯 Intentando ir al paso ${step}`)
  
  // Permitir ir hacia atrás o al paso actual
  if (step >= 1 && step <= totalSteps && step <= currentStep.value) {
    currentStep.value = step
    console.log(`✅ Navegado al paso ${step}`)
    
    // Forzar validación del nuevo paso después de un pequeño delay
    setTimeout(() => {
      forceValidation()
    }, 100)
  } else {
    console.log(`❌ No se puede navegar al paso ${step} desde el paso ${currentStep.value}`)
  }
}

const nextStep = async () => { 
  console.log('▶️ Next step clicked. Current validity:', stepValidity[currentStep.value])
  console.log('📋 Form data state:', JSON.stringify(formData, null, 2))
  
  if (currentStep.value < totalSteps) {
    // Forzar una última validación antes de avanzar
    await forceValidation()
    
    // Esperar un momento para que la validación se procese
    await new Promise(resolve => setTimeout(resolve, 100))
    
    if (stepValidity[currentStep.value]) {
      const oldStep = currentStep.value
      currentStep.value++
      console.log(`✅ Avanzado del paso ${oldStep} al paso ${currentStep.value}`)
      
      // Validar el nuevo paso
      setTimeout(() => {
        forceValidation()
      }, 100)
    } else {
      console.warn('⚠️ No se puede proceder: El paso actual no es válido')
      console.warn('📊 Estado de validez actual:', stepValidity)
      
      // Mostrar información de debug automáticamente
      showDebug.value = true
    }
  }
}

const previousStep = () => { 
  if (currentStep.value > 1) {
    const oldStep = currentStep.value
    currentStep.value--
    console.log(`⬅️ Retrocedido del paso ${oldStep} al paso ${currentStep.value}`)
  }
}

// Watchers mejorados
watch(stepValidity, (newValidity, oldValidity) => {
  console.log('📊 Step validity status changed:', {
    old: oldValidity,
    new: newValidity
  })
}, { deep: true })

watch(currentStep, (newStep, oldStep) => {
  console.log(`🔀 Current step changed from ${oldStep} to ${newStep}`)
})

// Watch más específico para cambios importantes en formData - DESHABILITADO PARA EVITAR BUCLES
// watch(() => [
//   formData.first_name,
//   formData.last_name,
//   formData.rut,
//   formData.birth_date,
//   formData.gender
// ], () => {
//   if (currentStep.value === 1) {
//     console.log('🔄 Datos básicos cambiaron, revalidando...')
//     setTimeout(() => forceValidation(), 50)
//   }
// }, { deep: true })

// Watch simplificado que NO causa bucles infinitos
watch(formData, () => {
  // Solo loggear, no forzar validación automática
  console.log('📝 Form data changed, waiting for manual validation...')
}, { deep: true })

const submitForm = async () => {
  console.log('📤 Submitting form. Step 4 validity:', stepValidity[4])
  
  if (!stepValidity[4]) {
    console.error('❌ Cannot submit: Step 4 is not valid')
    showDebug.value = true
    return
  }
  
  isSubmitting.value = true
  try {
    await nextTick()
    const submitData = { ...formData }
    console.log('📤 Submitting data:', submitData)
    emit('submit', submitData)
  } catch (error) {
    console.error('💥 Error submitting form:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.multi-step-form {
  display: flex;
  flex-direction: column;
  height: 600px;
}

.steps-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  min-width: 80px;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.step-indicator.clickable {
  cursor: pointer;
}

.step-indicator.clickable:hover {
  background-color: #f3f4f6;
  transform: translateY(-2px);
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  font-weight: bold;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.step-indicator.active .step-number {
  background: #3b82f6;
  color: white;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.step-indicator.completed .step-number {
  background: #10b981;
  color: white;
  border-color: #059669;
}

.step-label {
  font-size: 0.875rem;
  text-align: center;
  font-weight: 500;
}

.step-indicator.active .step-label {
  color: #3b82f6;
  font-weight: 600;
}

.step-indicator.completed .step-label {
  color: #10b981;
}

.step-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 0.5rem;
}

.step-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
  gap: 1rem;
}

.navigation-spacer {
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #4b5563;
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
  transform: none !important;
  box-shadow: none !important;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  min-height: 36px;
}

.debug-toggle {
  margin-right: 0.5rem;
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
</style>