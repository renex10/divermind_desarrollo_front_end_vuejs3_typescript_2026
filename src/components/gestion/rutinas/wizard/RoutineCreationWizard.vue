<template>
  <!-- src\components\gestion\rutinas\wizard\RoutineCreationWizard.vue -->
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
          <div class="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm" />
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
                class="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-100"
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
                    :current-step="currentStep"
                    :total-steps="steps.length"
                  />
                </div>

                <div v-if="submissionError && showErrorBanner" class="p-4 mb-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-start gap-3 animate-fade-in">
                  <ExclamationCircleIcon class="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div class="flex-1">
                    <p class="font-bold text-sm">Error en el proceso</p>
                    <p class="text-xs mt-1">{{ submissionError }}</p>
                  </div>
                  <button @click="showErrorBanner = false" class="text-red-600 hover:text-red-800">
                    <XMarkIcon class="w-5 h-5" />
                  </button>
                </div>

                <div class="min-h-[400px] max-h-[60vh] overflow-y-auto p-1 pr-4 custom-scrollbar">
                  <KeepAlive>
                    <Transition name="fade-slide" mode="out-in">
                      <component
                        :is="currentStepComponent"
                        :child-id="props.childId"
                        @update:validity="onStepValidityChange"
                      />
                    </Transition>
                  </KeepAlive>
                </div>

                <div class="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <button
                    type="button"
                    v-if="currentStep > 1"
                    @click="prevStep"
                    :disabled="isLoading"
                    class="inline-flex items-center px-4 py-2 bg-white text-sm font-medium text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  >
                    <ChevronLeftIcon class="w-4 h-4 mr-1" />
                    Anterior
                  </button>

                  <div v-else></div>

                  <div class="flex gap-3">
                    <button
                      v-if="currentStep < steps.length"
                      type="button"
                      @click="nextStep"
                      :disabled="!isCurrentStepValid"
                      class="inline-flex items-center justify-center px-8 py-2.5 bg-primary-600 text-white font-bold rounded-xl shadow-md hover:bg-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                      <ChevronRightIcon class="w-4 h-4 ml-1" />
                    </button>

                    <button
                      v-else
                      type="button"
                      @click="submitRoutine"
                      :disabled="!isCurrentStepValid || isLoading"
                      class="inline-flex items-center justify-center px-8 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span v-if="!isLoading" class="flex items-center">
                        <CheckCircleIcon class="w-5 h-5 mr-2" />
                        Finalizar Creación
                      </span>
                      <span v-else class="flex items-center">
                        <ArrowPathIcon class="w-5 h-5 mr-2 animate-spin" />
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
import { ref, computed, defineAsyncComponent, onMounted } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild
} from '@headlessui/vue'
import { 
  XMarkIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  ArrowPathIcon 
} from '@heroicons/vue/24/outline'

import { useNotificationStore } from '@/store/notificationStore'
import { useRoutineWizardStore } from '@/store/rutinas/routineWizardStore'

// --- Carga Asíncrona de Componentes (Rutas relativas corregidas) ---
const WizardProgressBar = defineAsyncComponent(() => import('./WizardProgressBar.vue'))
const WizardStep1Basic = defineAsyncComponent(() => import('./WizardStep1Basic.vue'))
const WizardStep2Schedules = defineAsyncComponent(() => import('./WizardStep2Schedules.vue'))
const WizardStep3Steps = defineAsyncComponent(() => import('./WizardStep3Steps.vue'))
const WizardStep4Strategies = defineAsyncComponent(() => import('./WizardStep4Strategies.vue'))
const WizardStep5Review = defineAsyncComponent(() => import('./WizardStep5Review.vue'))

const props = defineProps<{
  childId: number | string
  childName: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created', payload: any): void
}>()

const wizardStore = useRoutineWizardStore()
const notificationStore = useNotificationStore()

// Estado
const currentStep = ref(1)
const isCurrentStepValid = ref(false)
const isLoading = ref(false)
const submissionError = ref<string | null>(null)
const showErrorBanner = ref(true)

const steps = [
  { label: 'Información Básica', component: WizardStep1Basic, isValid: () => wizardStore.isStep1Valid },
  { label: 'Horarios', component: WizardStep2Schedules, isValid: () => wizardStore.isStep2Valid },
  { label: 'Pasos', component: WizardStep3Steps, isValid: () => wizardStore.isStep3Valid },
  { label: 'Estrategias', component: WizardStep4Strategies, isValid: () => wizardStore.isStep4Valid },
  { label: 'Revisión', component: WizardStep5Review, isValid: () => true },
]

const currentStepComponent = computed(() => steps[currentStep.value - 1].component)

function onStepValidityChange(isValid: boolean) {
  isCurrentStepValid.value = isValid
}

function nextStep() {
  if (isCurrentStepValid.value && currentStep.value < steps.length) {
    currentStep.value++
    // Re-validar al entrar al nuevo paso
    isCurrentStepValid.value = steps[currentStep.value - 1].isValid()
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
    isCurrentStepValid.value = true
  }
}

function handleClose() {
  if (wizardStore.steps.length > 0 || wizardStore.basicInfo.name) {
    if (confirm('Hay cambios sin guardar. ¿Estás seguro de que deseas cerrar?')) {
      emit('close')
    }
  } else {
    emit('close')
  }
}

async function submitRoutine() {
  isLoading.value = true
  submissionError.value = null
  
  try {
    const savingToastId = notificationStore.info('Guardando rutina...', '⏳ Procesando', 0)
    
    // Ejecución centralizada en el store
    const result = await wizardStore.saveFullRoutine(Number(props.childId))
    
    notificationStore.removeNotification(savingToastId)

    if (result.success) {
      notificationStore.success(`Rutina creada con éxito`, '🎉 ¡Completado!')
      emit('created', result.data)
      setTimeout(() => emit('close'), 500)
    } else {
      throw new Error(result.error || 'Fallo en la comunicación con el servidor')
    }
  } catch (err: any) {
    submissionError.value = err.message
    notificationStore.error(err.message, '❌ Error al guardar')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => wizardStore.$reset())
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(20px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-20px); }
</style>