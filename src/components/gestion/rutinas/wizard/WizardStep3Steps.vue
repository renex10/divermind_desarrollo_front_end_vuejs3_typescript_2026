<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
    <div class="text-center mb-8 space-y-3">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4 animate-bounce-soft">
        <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      </div>
      <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
        Pasos de la Rutina
      </h3>
      <p class="text-base text-gray-600 max-w-2xl mx-auto">
        Define las acciones individuales con pictogramas de apoyo. Puedes reordenarlas arrastrándolas.
      </p>
      <div class="flex items-center justify-center gap-2 text-sm text-gray-500">
        <span class="inline-block w-1.5 h-1.5 rounded-full bg-primary-500"></span>
        <span>Paso 3 de 5</span>
      </div>
    </div>

    <div class="space-y-6">
      <div v-show="localSteps.length > 0" class="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-primary-50 to-primary-100/50 border-b border-primary-200">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-semibold text-primary-900 flex items-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
              </svg>
              Secuencia de Pasos
            </h4>
            <span class="px-3 py-1 text-xs font-semibold bg-primary-600 text-white rounded-full">
              {{ localSteps.length }}
            </span>
          </div>
          <p class="text-xs text-primary-700 mt-1.5">Arrastra para reordenar</p>
        </div>
        
        <div 
          ref="stepsContainer"
          class="divide-y divide-gray-100 sortable-list"
        >
          <div 
            v-for="(step, index) in localSteps" 
            :key="step.id"
            class="step-item flex items-start p-5 hover:bg-gray-50 transition-all duration-200 group sortable-item"
            :data-id="step.id"
          >
            <button 
              class="handle cursor-move text-gray-400 hover:text-primary-600 mr-3 flex-shrink-0 mt-1 transition-colors p-1 rounded hover:bg-primary-50" 
              title="Reordenar paso"
              type="button"
            >
              <Bars3Icon class="w-5 h-5" />
            </button>

            <div v-if="getPictogramForStep(step)" class="mr-4 flex-shrink-0">
              <div class="w-14 h-14 rounded-xl bg-primary-50 border-2 border-primary-200 flex items-center justify-center group-hover:border-primary-300 transition-colors">
                <component 
                  :is="getPictogramForStep(step)!.component" 
                  class="w-8 h-8 text-primary-600"
                />
              </div>
            </div>

            <div class="mr-4 flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <span class="text-sm font-bold text-primary-700">{{ index + 1 }}</span>
              </div>
            </div>

            <div class="flex-1 min-w-0 mr-4">
              <h5 class="font-semibold text-gray-900 mb-1 line-clamp-2">{{ step.action }}</h5>
              <p v-if="step.description" class="text-sm text-gray-600 mb-2 line-clamp-2">{{ step.description }}</p>
              
              <div class="flex flex-wrap gap-2 mt-2">
                <span v-if="step.estimated_minutes" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <ClockIcon class="w-3 h-3 mr-1" />
                  {{ step.estimated_minutes }} min
                </span>
                
                <span v-if="step.requires_supervision" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  Supervisión
                </span>
                
                <span v-if="step.is_skippable" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Opcional
                </span>
                
                <span v-if="step.visual_support_description" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                  </svg>
                  Con Pictograma
                </span>
              </div>
            </div>

            <button
              @click="removeStep(index)"
              type="button"
              class="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-error-600 hover:bg-error-50 transition-all duration-200 group/delete"
            >
              <TrashIcon class="w-5 h-5 group-hover/delete:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div v-show="localSteps.length === 0" class="text-center py-12 px-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-dashed border-yellow-300 rounded-2xl animate-pulse-slow">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
          <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h5 class="text-base font-semibold text-yellow-900 mb-2">Sin pasos definidos</h5>
        <p class="text-sm text-yellow-700 max-w-md mx-auto">
          Necesitas añadir al menos un paso para continuar. Define las acciones que componen tu rutina.
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
          <h4 class="text-base font-semibold text-gray-900 flex items-center gap-2">
            <PlusCircleIcon class="w-5 h-5 text-primary-600" />
            Añadir Nuevo Paso
          </h4>
        </div>

        <div class="p-6">
          <FormKit
            type="form"
            #default="{ state: { valid } }"
            v-model="newStepData"
            :actions="false"
            form-class="space-y-6"
            @submit="addStep"
            id="add-step-form"
          >
            <div class="form-group">
              <FormKit
                type="text"
                name="action"
                label="Acción"
                placeholder="Ej: Lavarse los dientes"
                validation="required|length:3,500"
                outer-class="form-field-wrapper"
                input-class="form-input-enhanced"
                label-class="form-label-enhanced"
              >
                <template #prefix>
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </template>
              </FormKit>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormKit
                type="textarea"
                name="description"
                label="Descripción"
                placeholder="Detalles adicionales..."
                :rows="3"
                input-class="form-textarea-enhanced"
                label-class="form-label-enhanced"
              />

              <div class="space-y-6">
                <FormKit
                  type="number"
                  name="estimated_minutes"
                  label="Duración (minutos)"
                  min="1"
                  input-class="form-input-enhanced"
                  label-class="form-label-enhanced"
                >
                  <template #prefix>
                    <ClockIcon class="w-5 h-5 text-gray-400" />
                  </template>
                </FormKit>

                <div class="form-group">
                  <label class="form-label-enhanced mb-3 block">Pictograma de Apoyo Visual</label>
                  
                  <div v-if="selectedPictogram" class="mb-3 p-4 bg-primary-50 border-2 border-primary-200 rounded-xl flex items-center gap-3">
                    <div class="w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center">
                      <component :is="selectedPictogram.component" class="w-8 h-8 text-primary-600" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-primary-900">{{ selectedPictogram.label }}</p>
                    </div>
                    <button @click="clearPictogram" type="button" class="text-primary-600 hover:text-primary-800">
                      <XMarkIcon class="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    @click="showPictogramModal = true"
                    type="button"
                    class="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
                  >
                    {{ selectedPictogram ? 'Cambiar Pictograma' : 'Seleccionar Pictograma' }}
                  </button>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 rounded-xl p-4 space-y-3">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormKit type="checkbox" name="requires_supervision" label="Requiere supervisión" outer-class="checkbox-enhanced" />
                <FormKit type="checkbox" name="is_skippable" label="Puede saltarse" outer-class="checkbox-enhanced" />
              </div>
            </div>

            <div class="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="submit"
                :disabled="!valid"
                class="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <PlusCircleIcon class="w-5 h-5 mr-2 inline" />
                Añadir Paso
              </button>
            </div>
          </FormKit>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <TransitionRoot :show="showPictogramModal" as="template">
        <Dialog @close="showPictogramModal = false" class="relative z-50">
          <TransitionChild enter="duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200" leave-from="opacity-100" leave-to="opacity-0">
            <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </TransitionChild>
          <div class="fixed inset-0 flex items-center justify-center p-4">
            <TransitionChild enter="duration-300" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
              <DialogPanel class="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div class="px-6 py-4 bg-primary-600 flex items-center justify-between">
                  <DialogTitle class="text-xl font-bold text-white">Seleccionar Pictograma</DialogTitle>
                  <button @click="showPictogramModal = false" class="text-white"><XMarkIcon class="w-6 h-6" /></button>
                </div>
                <div class="p-6 max-h-[70vh] overflow-y-auto">
                  <PictogramSelector @select="onPictogramSelect" />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </TransitionRoot>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue'
import { useRoutineWizardStore } from '@/store/rutinas/routineWizardStore'
import { storeToRefs } from 'pinia'
import type { WizardStep } from '@/store/rutinas/routineWizardStore'
import { Bars3Icon, ClockIcon, TrashIcon, PlusCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import Sortable from 'sortablejs'
import PictogramSelector from './PictogramSelector.vue'
import { getPictogramById, type Pictogram } from '@/data/pictograms'

const emit = defineEmits<{ (e: 'update:validity', isValid: boolean): void }>()
const wizardStore = useRoutineWizardStore()
const { steps } = storeToRefs(wizardStore)

// Estado local y formulario
let stepIdCounter = 0
const initialStepState: WizardStep = {
  action: '',
  description: '',
  estimated_minutes: null,
  visual_support_description: '', // ✅ Corregido para sincronizar con Backend
  visual_support_image_id: null,
  visual_support: '',
  requires_supervision: false,
  is_skippable: false,
}

const newStepData = ref<WizardStep>({ ...initialStepState })
const showPictogramModal = ref(false)
const selectedPictogram = ref<Pictogram | null>(null)
const localSteps = ref<WizardStep[]>([])
const stepsContainer = ref<HTMLElement | null>(null)
let sortableInstance: Sortable | null = null

// Lógica de Pictogramas
function getPictogramForStep(step: WizardStep): Pictogram | undefined {
  if (!step.visual_support_description) return undefined
  return getPictogramById(step.visual_support_description)
}

function onPictogramSelect(pictogram: Pictogram) {
  selectedPictogram.value = pictogram
  newStepData.value.visual_support_description = pictogram.id // ✅ Corregido
  showPictogramModal.value = false
}

function clearPictogram() {
  selectedPictogram.value = null
  newStepData.value.visual_support_description = ''
}

// Lógica de Lista y Store
function initializeStepIds() {
  const stepsWithIds = steps.value.map((step, index) => ({
    ...step,
    id: step.id || `temp-${Date.now()}-${index}`
  }))
  wizardStore.$patch({ steps: stepsWithIds })
  localSteps.value = [...stepsWithIds]
}

function syncWithStore() {
  wizardStore.$patch({ steps: [...localSteps.value] })
}

function initSortable() {
  if (!stepsContainer.value || sortableInstance) return
  sortableInstance = Sortable.create(stepsContainer.value, {
    animation: 150,
    handle: '.handle',
    ghostClass: 'ghost-step',
    onEnd: (evt) => {
      if (evt.oldIndex !== undefined && evt.newIndex !== undefined) {
        const movedItem = localSteps.value.splice(evt.oldIndex, 1)[0]
        localSteps.value.splice(evt.newIndex, 0, movedItem)
        syncWithStore()
        localSteps.value = [...localSteps.value]
      }
    }
  })
}

function addStep() {
  const uniqueId = `temp-${Date.now()}-${stepIdCounter++}`
  localSteps.value = [...localSteps.value, { ...newStepData.value, id: uniqueId }]
  syncWithStore()
  newStepData.value = { ...initialStepState }
  selectedPictogram.value = null
}

function removeStep(index: number) {
  localSteps.value.splice(index, 1)
  syncWithStore()
}

function emitValidityStatus() {
  emit('update:validity', localSteps.value.length > 0)
}

watch(localSteps, emitValidityStatus, { deep: true })

onMounted(async () => {
  initializeStepIds()
  emitValidityStatus()
  await nextTick(() => initSortable())
})

onUnmounted(() => {
  if (sortableInstance) sortableInstance.destroy()
})
</script>

<style scoped>
/* Animaciones y Sortable */
.animate-fade-in { animation: fadeIn 0.6s ease-out; }
.animate-pulse-slow { animation: pulseSlow 3s ease-in-out infinite; }
.ghost-step { @apply opacity-40 bg-primary-100 border-2 border-dashed border-primary-400 rounded-lg; }

/* Estilos FormKit y UI */
:deep(.form-input-enhanced), :deep(.form-textarea-enhanced) {
  @apply w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all;
}
:deep(.form-label-enhanced) { @apply block text-sm font-semibold text-gray-700 mb-1; }
:deep(.checkbox-enhanced .formkit-wrapper) { @apply flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-primary-400 transition-all; }
:deep(.checkbox-enhanced input[type="checkbox"]:checked ~ .formkit-label) { @apply text-primary-700 font-bold; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulseSlow { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }
</style>