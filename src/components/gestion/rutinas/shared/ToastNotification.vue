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
        Define las acciones individuales. Puedes reordenarlas arrastrándolas.
      </p>
      <div class="flex items-center justify-center gap-2 text-sm text-gray-500">
        <span class="inline-block w-1.5 h-1.5 rounded-full bg-primary-500"></span>
        <span>Paso 3 de 5</span>
      </div>
    </div>

    <div class="space-y-6">
      <div v-if="showDebug" class="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 space-y-2 text-xs font-mono">
        <div class="flex items-center justify-between mb-2">
          <h5 class="font-bold text-yellow-900 text-sm">🔍 DEBUG MODE</h5>
          <button @click="showDebug = false" class="text-yellow-600">✕</button>
        </div>
        <div><strong>Total steps:</strong> {{ steps.length }}</div>
        <div :class="hasIdConflicts ? 'text-red-600' : 'text-green-600'">
          {{ hasIdConflicts ? '❌ IDS DUPLICADOS' : '✅ IDs Únicos' }}
        </div>
      </div>

      <div v-if="steps.length > 0" class="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-primary-50 to-primary-100/50 border-b border-primary-200 flex items-center justify-between">
          <h4 class="text-sm font-semibold text-primary-900 flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" /></svg>
            Secuencia de Pasos
          </h4>
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 text-xs font-semibold bg-primary-600 text-white rounded-full">{{ steps.length }}</span>
            <button v-if="!showDebug" @click="showDebug = true" class="text-yellow-600">🔍</button>
          </div>
        </div>
        
        <Sortable
          :list="steps"
          item-key="id"
          tag="div"
          class="divide-y divide-gray-100"
          :options="{ handle: '.handle', animation: 200, ghostClass: 'ghost-step' }"
          @end="onDragEnd"
        >
          <template #item="{ element, index }">
            <div class="step-item flex items-start p-5 hover:bg-gray-50 group" :key="element.id">
              <button class="handle cursor-move text-gray-400 hover:text-primary-600 mr-3 mt-1 p-1 rounded hover:bg-primary-50">
                <Bars3Icon class="w-5 h-5" />
              </button>

              <div class="mr-4 flex-shrink-0">
                <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <span class="text-sm font-bold text-primary-700">{{ index + 1 }}</span>
                </div>
              </div>

              <div class="flex-1 min-w-0 mr-4">
                <h5 class="font-semibold text-gray-900 mb-1 line-clamp-2">{{ element.action }}</h5>
                <p v-if="element.description" class="text-sm text-gray-600 mb-2 line-clamp-2">{{ element.description }}</p>
                <div class="flex flex-wrap gap-2 mt-2">
                  <span v-if="element.estimated_minutes" class="badge-blue">{{ element.estimated_minutes }} min</span>
                  <span v-if="element.requires_supervision" class="badge-amber">Supervisión</span>
                  <span v-if="element.is_skippable" class="badge-green">Opcional</span>
                  <span v-if="element.visual_support_description" class="badge-purple">Visual</span>
                </div>
              </div>

              <button @click="removeStep(index)" class="text-gray-400 hover:text-error-600 p-2">
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>
          </template>
        </Sortable>
      </div>

      <div class="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h4 class="text-base font-semibold text-gray-900 flex items-center gap-2">
            <PlusCircleIcon class="w-5 h-5 text-primary-600" /> Añadir Nuevo Paso
          </h4>
        </div>

        <div class="p-6">
          <FormKit
            type="form"
            #default="{ state: { valid } }"
            v-model="newStepData"
            :actions="false"
            @submit="addStep"
          >
            <div class="space-y-6">
              <FormKit type="text" name="action" label="Acción" placeholder="Ej: Lavarse los dientes" validation="required|length:3" input-class="form-input-enhanced" />
              
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormKit type="textarea" name="description" label="Descripción" placeholder="..." :rows="3" input-class="form-textarea-enhanced" />
                <div class="space-y-6">
                  <FormKit type="number" name="estimated_minutes" label="Duración (min)" min="1" input-class="form-input-enhanced" />
                  <FormKit type="text" name="visual_support_description" label="Apoyo Visual" placeholder="Nombre del apoyo" input-class="form-input-enhanced" />
                </div>
              </div>

              <div class="bg-gray-50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormKit type="checkbox" name="requires_supervision" label="Requiere supervisión" outer-class="checkbox-enhanced" />
                <FormKit type="checkbox" name="is_skippable" label="Es opcional" outer-class="checkbox-enhanced" />
              </div>

              <div class="flex justify-end pt-4">
                <button type="submit" :disabled="!valid" class="btn-primary-enhanced">
                  <PlusCircleIcon class="w-5 h-5 mr-2" /> Añadir Paso
                </button>
              </div>
            </div>
          </FormKit>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Sortable } from 'sortablejs-vue3' // ✨ Importación corregida
import { useRoutineWizardStore } from '@/store/rutinas/routineWizardStore'
import { useNotificationStore } from '@/store/notificationStore'
import { storeToRefs } from 'pinia'
import type { WizardStep } from '@/store/rutinas/routineWizardStore'
import { Bars3Icon, TrashIcon, PlusCircleIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits<{ (e: 'update:validity', isValid: boolean): void }>()
const wizardStore = useRoutineWizardStore()
const notificationStore = useNotificationStore()
const { steps } = storeToRefs(wizardStore)

const showDebug = ref(false)
let stepIdCounter = 0

// ✅ CORRECCIÓN TS2345: Se añaden los campos faltantes a la inicialización
const initialStepState: WizardStep = {
  action: '',
  description: '',
  estimated_minutes: null,
  visual_support: '',
  visual_support_description: '', // ✨ Campo requerido por la interfaz
  visual_support_image_id: null,   // ✨ Campo requerido por la interfaz
  requires_supervision: false,
  is_skippable: false,
}

const newStepData = ref<WizardStep>({ ...initialStepState })

const uniqueIdsCount = computed(() => new Set(steps.value.map(s => s.id)).size)
const hasIdConflicts = computed(() => steps.value.length !== uniqueIdsCount.value)

function addStep() {
  const uniqueId = Date.now() + (stepIdCounter++)
  steps.value.push({ ...newStepData.value, id: uniqueId })
  
  notificationStore.success(`Paso añadido correctamente`)
  
  // ✅ CORRECCIÓN TS2322: Reset limpio con todos los campos
  newStepData.value = { ...initialStepState }
}

function removeStep(index: number) {
  if (index >= 0 && index < steps.value.length) {
    steps.value.splice(index, 1)
    notificationStore.info('Paso eliminado')
  }
}

function onDragEnd(event: any) {
  if (event.oldIndex !== event.newIndex) {
    notificationStore.success('Orden actualizado')
  }
}

const emitValidityStatus = () => emit('update:validity', steps.value.length > 0)
watch(steps, emitValidityStatus, { deep: true })
onMounted(emitValidityStatus)
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.6s ease-out; }
.ghost-step { @apply opacity-50 bg-primary-100 border-2 border-dashed border-primary-400 rounded-lg; }
.badge-blue { @apply inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800; }
.badge-amber { @apply inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800; }
.badge-green { @apply inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800; }
.badge-purple { @apply inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800; }

:deep(.form-input-enhanced), :deep(.form-textarea-enhanced) {
  @apply w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all;
}
:deep(.checkbox-enhanced .formkit-wrapper) { @apply flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-all; }
.btn-primary-enhanced { @apply inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all transform hover:scale-105 disabled:opacity-50; }
</style>