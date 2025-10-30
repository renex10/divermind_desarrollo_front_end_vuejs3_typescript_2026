<template>
  <Teleport to="body">
    <TransitionRoot appear :show="true" as="template">
      <Dialog as="div" @close="handleClose" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900 bg-opacity-75" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
              >
                <div class="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div>
                    <DialogTitle as="h3" class="text-2xl font-bold leading-6 text-gray-900">
                      ✨ Crear Nueva Rutina
                    </DialogTitle>
                    <p class="mt-1 text-sm text-gray-500">
                      Para: <span class="font-medium text-primary-600">{{ childName }}</span>
                    </p>
                  </div>
                  <button
                    @click="handleClose"
                    class="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label="Cerrar asistente"
                  >
                    <XMarkIcon class="h-6 w-6" />
                  </button>
                </div>

                <div class="my-6">
                  <WizardProgressBar
                    :steps="stepLabels"
                    :current-step="currentStep"
                  />
                </div>

                <!-- ❌ ESTE ERROR BANNER YA NO ES NECESARIO CON TOASTS -->
                <!-- Se mantiene solo como fallback para errores críticos -->
                <div v-if="submissionError && showErrorBanner" class="p-4 mb-4 bg-error-50 text-error-700 border border-error-200 rounded-lg flex items-start gap-3">
                  <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                  <div class="flex-1">
                    <p class="font-medium">Error al crear la rutina</p>
                    <p class="text-sm mt-1">{{ submissionError }}</p>
                  </div>
                  <button @click="showErrorBanner = false" class="text-error-600 hover:text-error-800">
                    <XMarkIcon class="w-5 h-5" />
                  </button>
                </div>

                <div class="min-h-[400px] max-h-[60vh] overflow-y-auto p-1 pr-4 custom-scrollbar">
                  <KeepAlive>
                    <component
                      :is="currentStepComponent"
                      :child-id="props.childId"
                      @update:validity="onStepValidityChange"
                    />
                  </KeepAlive>
                </div>

                <div class="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <button
                    type="button"
                    v-if="currentStep > 1"
                    @click="prevStep"
                    class="inline-flex items-center px-4 py-2 bg-white text-sm font-medium text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    <ChevronLeftIcon class="w-4 h-4 mr-1" />
                    Anterior
                  </button>

                  <div v-else></div>

                  <div>
                    <button
                      v-if="currentStep < steps.length"
                      type="button"
                      @click="nextStep"
                      :disabled="!isCurrentStepValid"
                      class="inline-flex items-center justify-center px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                      <ChevronRightIcon class="w-4 h-4 ml-1" />
                    </button>

                    <button
                      v-else
                      type="button"
                      @click="submitRoutine"
                      :disabled="!isCurrentStepValid || isLoading"
                      class="inline-flex items-center justify-center px-6 py-2 bg-success-600 text-white font-semibold rounded-lg shadow-md hover:bg-success-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-success-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span v-if="!isLoading" class="flex items-center">
                        <CheckCircleIcon class="w-5 h-5 mr-1" />
                        Finalizar Creación
                      </span>
                      <span v-else class="flex items-center">
                        <div class="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Guardando...
                      </span>
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, onMounted, onUnmounted } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild
} from '@headlessui/vue'
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

// ✨ IMPORTAR STORE DE NOTIFICACIONES
import { useNotificationStore } from '@/store/notificationStore'

// Importar el store dedicado para el wizard
import { useRoutineWizardStore } from '@/store/rutinas/routineWizardStore'

// --- Importar componentes hijos de forma asíncrona (Lazy Loading) ---
const WizardProgressBar = defineAsyncComponent(() => import('./WizardProgressBar.vue'))
const WizardStep1Basic = defineAsyncComponent(() => import('./WizardStep1Basic.vue'))
const WizardStep2Schedules = defineAsyncComponent(() => import('./WizardStep2Schedules.vue'))
const WizardStep3Steps = defineAsyncComponent(() => import('./WizardStep3Steps.vue'))
const WizardStep4Strategies = defineAsyncComponent(() => import('./WizardStep4Strategies.vue'))
const WizardStep5Review = defineAsyncComponent(() => import('./WizardStep5Review.vue'))

// === PROPS Y EMITS ===
const props = defineProps<{
  childId: number
  childName: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created', payload: any): void
}>()

// === STORES ===
const wizardStore = useRoutineWizardStore()
const notificationStore = useNotificationStore() // ✨ STORE DE NOTIFICACIONES

// Inicializar el store con el ID del niño al montar
onMounted(() => {
  wizardStore.initialize(props.childId)
})

// Limpiar el store al cerrar/desmontar
onUnmounted(() => {
  wizardStore.reset()
})

// === ESTADO DEL ASISTENTE ===
const currentStep = ref(1)
const isCurrentStepValid = ref(false)
const isLoading = ref(false)
const submissionError = ref<string | null>(null)
const showErrorBanner = ref(true) // ✨ Control para mostrar/ocultar banner de error

// --- Definición de los pasos del wizard ---
const steps = [
  { label: 'Información Básica', component: WizardStep1Basic, isValidGetter: () => wizardStore.isStep1Valid },
  { label: 'Horarios', component: WizardStep2Schedules, isValidGetter: () => wizardStore.isStep2Valid },
  { label: 'Pasos de la Rutina', component: WizardStep3Steps, isValidGetter: () => wizardStore.isStep3Valid },
  { label: 'Estrategias', component: WizardStep4Strategies, isValidGetter: () => wizardStore.isStep4Valid },
  { label: 'Revisión', component: WizardStep5Review, isValidGetter: () => true },
]

// === COMPUTED PROPS ===
const stepLabels = computed(() => steps.map(s => s.label))
const currentStepComponent = computed(() => steps[currentStep.value - 1].component)

// === MÉTODOS DE NAVEGACIÓN ===

function onStepValidityChange(isValid: boolean) {
  isCurrentStepValid.value = isValid
}

// ✨ FUNCIÓN MEJORADA CON TOAST
function nextStep() {
  if (isCurrentStepValid.value && currentStep.value < steps.length) {
    currentStep.value++
    
    isCurrentStepValid.value = steps[currentStep.value - 1].isValidGetter()
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
    isCurrentStepValid.value = true
  }
}

function handleClose() {
  // ✨ OPCIONAL: Toast al cerrar sin guardar (si hay datos)
  const hasData = wizardStore.basicInfo.name || wizardStore.steps.length > 0
  
  if (hasData) {
    notificationStore.warning(
      'Los cambios no guardados se perderán',
      '⚠️ Asistente Cerrado',
      3000
    )
  }
  
  emit('close')
}

// === MÉTODO DE ENVÍO FINAL CON TOASTS ===
async function submitRoutine() {
  if (!steps[currentStep.value - 1].isValidGetter() || !isCurrentStepValid.value) return

  isLoading.value = true
  submissionError.value = null
  showErrorBanner.value = true

  try {
    // ✨ TOAST: Guardando...
    const savingToastId = notificationStore.info(
      'Guardando la rutina en el servidor...',
      '⏳ Guardando',
      0 // Duración 0 = no se cierra automáticamente
    )

    // Llama a la acción principal del store
    const newRoutine = await wizardStore.submitAllData()

    // ✨ CERRAR TOAST DE "GUARDANDO"
    notificationStore.removeNotification(savingToastId)

    // ✨ TOAST DE ÉXITO
    notificationStore.success(
      `La rutina "${newRoutine.name}" ha sido creada correctamente`,
      '🎉 ¡Rutina Creada!',
      5000
    )

    // Éxito: Emitir eventos
    emit('created', newRoutine)
    
    // ✨ CERRAR MODAL DESPUÉS DE UN BREVE DELAY (para que se vea el toast)
    setTimeout(() => {
      emit('close')
    }, 500)

  } catch (err: any) {
    console.error("Error al crear la rutina desde el Wizard:", err)
    
    submissionError.value = err.message || 'Ocurrió un error inesperado. Por favor, revisa los datos o inténtalo más tarde.'
    
    // ✨ TOAST DE ERROR (más visible que el banner)
    notificationStore.error(
      err.message || 'Hubo un problema al guardar la rutina. Por favor, inténtalo nuevamente.',
      '❌ Error al Crear Rutina',
      8000 // Duración más larga para errores
    )
    
  } finally {
    isLoading.value = false
  }
}

// Revalidar el paso actual al montar
onMounted(() => {
  setTimeout(() => {
    isCurrentStepValid.value = steps[currentStep.value - 1].isValidGetter()
  }, 50)
})

</script>

<style scoped>
/* Estilo para la barra de scroll personalizada */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9; /* gray-100 */
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1; /* gray-300 */
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8; /* gray-400 */
}
</style>