<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
    <!-- Header Section -->
    <div class="text-center mb-8 space-y-3">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4 animate-bounce-soft">
        <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
        Estrategias de Apoyo
      </h3>
      <p class="text-base text-gray-600 max-w-2xl mx-auto">
        Define estrategias específicas para facilitar el cumplimiento de la rutina
      </p>
      <div class="flex items-center justify-center gap-2 text-sm text-gray-500">
        <span class="inline-block w-1.5 h-1.5 rounded-full bg-primary-500"></span>
        <span>Paso 4 de 5</span>
      </div>
    </div>

    <div class="space-y-6">
      <!-- 🔍 DEBUG INFO -->
      <div v-if="showDebug" class="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 space-y-2 text-xs font-mono">
        <div class="flex items-center justify-between mb-2">
          <h5 class="font-bold text-yellow-900 text-sm">🔍 DEBUG MODE - ESTRATEGIAS</h5>
          <button 
            @click="showDebug = false"
            class="text-yellow-600 hover:text-yellow-800"
          >
            ✕ Cerrar
          </button>
        </div>
        
        <div class="space-y-1">
          <div><strong>Total estrategias:</strong> {{ strategies.length }}</div>
          <div><strong>Total pasos disponibles:</strong> {{ availableSteps.length }}</div>
          <div><strong>IDs únicos:</strong> {{ uniqueIdsCount }}</div>
          <div :class="hasIdConflicts ? 'text-red-600 font-bold' : 'text-green-600'">
            {{ hasIdConflicts ? '❌ IDS DUPLICADOS DETECTADOS' : '✅ Todos los IDs son únicos' }}
          </div>
          
          <details class="mt-2">
            <summary class="cursor-pointer text-yellow-800 font-bold">Ver estrategias completas</summary>
            <pre class="mt-2 bg-white p-2 rounded overflow-auto max-h-40">{{ strategiesDebugInfo }}</pre>
          </details>
        </div>
      </div>

      <!-- Lista de Estrategias CON DRAGGABLE -->
      <div v-if="strategies.length > 0" class="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-primary-50 to-primary-100/50 border-b border-primary-200">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-semibold text-primary-900 flex items-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
              </svg>
              Estrategias Configuradas
            </h4>
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 text-xs font-semibold bg-primary-600 text-white rounded-full">
                {{ strategies.length }}
              </span>
              <button 
                v-if="!showDebug"
                @click="showDebug = true"
                class="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                title="Mostrar debug"
              >
                🔍
              </button>
            </div>
          </div>
          <p class="text-xs text-primary-700 mt-1.5">Arrastra para reordenar ⬆️⬇️</p>
        </div>
        
        <!-- DRAGGABLE en lugar de TransitionGroup -->
        <draggable
          v-model="strategies"
          :item-key="getStrategyKey"
          handle=".drag-handle"
          ghost-class="ghost-strategy"
          drag-class="dragging-strategy"
          tag="ul"
          class="divide-y divide-gray-100"
          @start="onDragStart"
          @end="onDragEnd"
        >
          <div
            v-for="(strategy, index) in strategies"
            :key="strategy.id || index"
            class="p-5 hover:bg-gray-50 transition-colors duration-200 group flex items-start gap-3"
          >
            <!-- HANDLE DE ARRASTRE -->
            <button 
              class="drag-handle cursor-move text-gray-400 hover:text-purple-600 flex-shrink-0 mt-1 transition-colors p-1 rounded hover:bg-purple-50" 
              title="Reordenar estrategia"
              type="button"
            >
              <Bars3Icon class="w-5 h-5" />
            </button>

            <div class="flex-1 min-w-0 flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-start gap-3 mb-2">
                  <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <component :is="getStrategyIcon(strategy.strategy_type)" class="w-5 h-5 text-purple-600" />
                  </div>
                  <div class="flex-1">
                    <div class="flex items-start justify-between gap-2">
                      <h5 class="font-semibold text-gray-900">{{ getStrategyTypeLabel(strategy.strategy_type) }}</h5>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {{ strategy.strategy_type }}
                      </span>
                    </div>
                    <p v-if="strategy.description" class="text-sm text-gray-600 mt-1 line-clamp-2">
                      {{ strategy.description }}
                    </p>
                    <div v-if="strategy.related_step_order !== null" class="flex items-center gap-2 mt-2">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span class="text-xs text-gray-500">Vinculada al paso {{ strategy.related_step_order }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                @click="removeStrategy(index)"
                type="button"
                class="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-error-600 hover:bg-error-50 transition-all duration-200 group/delete"
                title="Eliminar estrategia"
              >
                <TrashIcon class="w-5 h-5 group-hover/delete:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </draggable>
      </div>

      <!-- Estado Vacío -->
      <div v-else class="text-center py-12 px-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-dashed border-purple-300 rounded-2xl animate-pulse-slow">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
          <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h5 class="text-base font-semibold text-purple-900 mb-2">Sin estrategias configuradas</h5>
        <p class="text-sm text-purple-700 max-w-md mx-auto">
          Las estrategias son opcionales, pero pueden ayudar a mejorar el cumplimiento de la rutina.
        </p>
      </div>

      <!-- Formulario para Añadir Estrategia -->
      <div class="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
          <h4 class="text-base font-semibold text-gray-900 flex items-center gap-2">
            <PlusCircleIcon class="w-5 h-5 text-primary-600" />
            Añadir Nueva Estrategia
          </h4>
        </div>

        <div class="p-6">
          <FormKit
            type="form"
            #default="{ value, state: { valid } }"
            v-model="newStrategyData"
            :actions="false"
            form-class="space-y-6"
            @submit="addStrategy"
            id="add-strategy-form"
          >
            <!-- Tipo de Estrategia -->
            <div class="form-group">
              <FormKit
                type="select"
                name="strategy_type"
                label="Tipo de Estrategia"
                placeholder="Selecciona un tipo"
                validation="required"
                outer-class="form-field-wrapper"
                input-class="form-select-enhanced"
                label-class="form-label-enhanced"
                :options="strategyTypeOptions"
                :validation-messages="{
                  required: 'Debes seleccionar un tipo de estrategia.',
                }"
              >
                <template #prefix>
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </template>
              </FormKit>
            </div>

            <!-- Descripción -->
            <div class="form-group">
              <FormKit
                type="textarea"
                name="description"
                label="Descripción"
                placeholder="Describe cómo aplicar esta estrategia..."
                :rows="4"
                validation="length:0,1000"
                outer-class="form-field-wrapper"
                input-class="form-textarea-enhanced"
                label-class="form-label-enhanced"
                help-class="form-help-text"
                help="Opcional - Máximo 1000 caracteres"
                :validation-messages="{
                  length: 'La descripción no puede exceder los 1000 caracteres.',
                }"
              />
              <div class="mt-2 text-right text-xs text-gray-500" v-if="newStrategyData.description">
                {{ newStrategyData.description?.length || 0 }} / 1000 caracteres
              </div>
            </div>

            <!-- Paso Relacionado -->
            <div class="form-group" v-if="availableSteps.length > 0">
              <FormKit
                type="select"
                name="related_step_order"
                label="Vincular a un Paso Específico"
                placeholder="Ninguno (aplica a toda la rutina)"
                outer-class="form-field-wrapper"
                input-class="form-select-enhanced"
                label-class="form-label-enhanced"
                help-class="form-help-text"
                help="Opcional - Asocia esta estrategia con un paso en particular"
                :options="stepOptions"
              >
                <template #prefix>
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </template>
              </FormKit>
            </div>

            <!-- Alerta si no hay pasos -->
            <div v-else class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <div class="flex-1">
                <h5 class="text-sm font-semibold text-amber-900 mb-1">No hay pasos definidos</h5>
                <p class="text-sm text-amber-800">
                  Define algunos pasos en el Step 3 para poder vincular estrategias específicas.
                </p>
              </div>
            </div>

            <!-- Botón Añadir -->
            <div class="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="submit"
                :disabled="!valid"
                class="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl shadow-sm hover:bg-primary-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <PlusCircleIcon class="w-5 h-5 mr-2" />
                Añadir Estrategia
              </button>
            </div>
          </FormKit>
        </div>
      </div>

      <!-- Info Card -->
      <div class="bg-primary-50 border border-primary-200 rounded-xl p-4 flex gap-3 animate-slide-in">
        <svg class="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        <div class="flex-1">
          <h4 class="text-sm font-semibold text-primary-900 mb-1">Consejo</h4>
          <p class="text-sm text-primary-800">
            Puedes reordenar las estrategias arrastrándolas. El orden puede ayudar a priorizar su aplicación.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import { useRoutineWizardStore } from '@/store/rutinas/routineWizardStore'
import { storeToRefs } from 'pinia'
import type { WizardStrategy } from '@/store/rutinas/routineWizardStore'
import { 
  TrashIcon, 
  PlusCircleIcon,
  SparklesIcon,
  PhotoIcon,
  BellAlertIcon,
  SpeakerWaveIcon,
  HandRaisedIcon,
  ClockIcon,
  Bars3Icon
} from '@heroicons/vue/24/outline'

const emit = defineEmits<{
  (e: 'update:validity', isValid: boolean): void
}>()

const wizardStore = useRoutineWizardStore()
const { strategies, steps } = storeToRefs(wizardStore)

// Estado local
const showDebug = ref(false)
let strategyIdCounter = 0

const newStrategyData = ref<WizardStrategy>({
  strategy_type: '',
  description: '',
  related_step_order: null,
})

// Opciones de tipos de estrategia
const strategyTypeOptions = computed(() => [
  { value: '', label: 'Selecciona un tipo...', attrs: { disabled: true } },
  { value: 'positive_reinforcement', label: '⭐ Refuerzo Positivo' },
  { value: 'visual_reminder', label: '🖼️ Recordatorio Visual' },
  { value: 'timer_alarm', label: '⏰ Temporizador/Alarma' },
  { value: 'sensory_adaptation', label: '🎨 Adaptación Sensorial' },
  { value: 'verbal_prompt', label: '💬 Indicación Verbal' },
  { value: 'physical_assistance', label: '🤝 Asistencia Física' },
  { value: 'choice_offering', label: '🔀 Ofrecer Opciones' },
  { value: 'break_time', label: '⏸️ Tiempo de Descanso' },
  { value: 'social_story', label: '📖 Historia Social' },
  { value: 'token_economy', label: '🎯 Sistema de Fichas' },
  { value: 'other', label: '➕ Otra' },
])

// Computed para debug
const uniqueIdsCount = computed(() => {
  const ids = strategies.value.map(s => s.id).filter(id => id !== undefined)
  return new Set(ids).size
})

const hasIdConflicts = computed(() => {
  const ids = strategies.value.map(s => s.id).filter(id => id !== undefined)
  return ids.length !== uniqueIdsCount.value && ids.length > 0
})

const strategiesDebugInfo = computed(() => {
  return strategies.value.map((s, i) => ({
    index: i,
    id: s.id,
    type: s.strategy_type,
    hasDescription: !!s.description,
    linkedToStep: s.related_step_order
  }))
})

const availableSteps = computed(() => steps.value || [])

const stepOptions = computed(() => {
  const options: { value: number | null, label: string }[] = [{ value: null, label: 'Ninguno (toda la rutina)' }]
  availableSteps.value.forEach((step, index) => {
    options.push({
      value: index + 1,
      label: `Paso ${index + 1}: ${step.action.substring(0, 40)}${step.action.length > 40 ? '...' : ''}`
    })
  })
  return options
})

function getStrategyKey(strategy: WizardStrategy): number | string {
  return strategy.id || Math.random()
}

function addStrategy() {
  const uniqueId = Date.now() + (strategyIdCounter++)
  
  console.log('➕ Agregando estrategia:', { 
    id: uniqueId, 
    type: newStrategyData.value.strategy_type 
  })
  
  const strategyToAdd = { 
    ...newStrategyData.value,
    id: uniqueId
  }
  strategies.value.push(strategyToAdd)
  
  console.log('📋 Total estrategias:', strategies.value.length)
  console.log('🔑 IDs:', strategies.value.map(s => s.id))
  
  // Resetear formulario
  newStrategyData.value = {
    strategy_type: '',
    description: '',
    related_step_order: null,
  }
  
  emitValidityStatus()
}

function removeStrategy(index: number) {
  console.log('🗑️ Eliminando estrategia en índice:', index)
  
  if (index >= 0 && index < strategies.value.length) {
    const removed = strategies.value[index]
    console.log('🗑️ Estrategia eliminada:', removed.strategy_type)
    strategies.value.splice(index, 1)
    emitValidityStatus()
  }
}

function onDragStart(event: any) {
  console.log('🎬 Arrastre de estrategia iniciado:', event.oldIndex)
}

function onDragEnd(event: any) {
  console.log('🏁 Arrastre de estrategia finalizado:', { from: event.oldIndex, to: event.newIndex })
  console.log('📋 Nuevo orden:', strategies.value.map((s, i) => `${i+1}. ${s.strategy_type}`))
}

function emitValidityStatus() {
  emit('update:validity', true)
  console.log('✉️ Emitiendo validez: true (estrategias opcionales)')
}

function getStrategyTypeLabel(type: string): string {
  const option = strategyTypeOptions.value.find(opt => opt.value === type)
  return option ? option.label.replace(/^[^\s]+\s/, '') : type
}

function getStrategyIcon(type: string) {
  const icons: Record<string, any> = {
    positive_reinforcement: SparklesIcon,
    visual_reminder: PhotoIcon,
    timer_alarm: BellAlertIcon,
    sensory_adaptation: SparklesIcon,
    verbal_prompt: SpeakerWaveIcon,
    physical_assistance: HandRaisedIcon,
    choice_offering: SparklesIcon,
    break_time: ClockIcon,
    social_story: PhotoIcon,
    token_economy: SparklesIcon,
    other: SparklesIcon,
  }
  return icons[type] || SparklesIcon
}

onMounted(() => {
  console.log('=== 🚀 STEP 4 STRATEGIES MONTADO (CON DRAGGABLE) ===')
  console.log('1️⃣ Estrategias iniciales:', strategies.value.length)
  console.log('2️⃣ Pasos disponibles:', availableSteps.value.length)
  console.log('=== FIN DEBUG INICIAL ===')
  
  emitValidityStatus()
})
</script>

<style scoped>
/* ... [Mismos estilos que antes] ... */

/* Draggable styles ADICIONALES */
.ghost-strategy {
  @apply opacity-50 bg-purple-100 border-2 border-dashed border-purple-400 rounded-lg;
}

.dragging-strategy {
  @apply bg-white shadow-2xl border-2 border-purple-400 rounded-lg cursor-grabbing transform rotate-1 scale-105;
}

.drag-handle {
  touch-action: none;
}

/* ... [Resto de estilos igual que la versión anterior] ... */
</style>