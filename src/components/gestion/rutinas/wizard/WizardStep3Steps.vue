<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
    <!-- Header Section -->
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
      <!-- 🔍 DEBUG INFO (Quitar en producción) -->
      <div v-if="showDebug" class="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 space-y-2 text-xs font-mono">
        <div class="flex items-center justify-between mb-2">
          <h5 class="font-bold text-yellow-900 text-sm">🔍 DEBUG MODE</h5>
          <button 
            @click="showDebug = false"
            class="text-yellow-600 hover:text-yellow-800"
          >
            ✕ Cerrar
          </button>
        </div>
        
        <div class="space-y-1">
          <div><strong>Total steps:</strong> {{ steps.length }}</div>
          <div><strong>IDs únicos:</strong> {{ uniqueIdsCount }}</div>
          <div :class="hasIdConflicts ? 'text-red-600 font-bold' : 'text-green-600'">
            {{ hasIdConflicts ? '❌ IDS DUPLICADOS DETECTADOS' : '✅ Todos los IDs son únicos' }}
          </div>
          
          <details class="mt-2">
            <summary class="cursor-pointer text-yellow-800 font-bold">Ver IDs completos</summary>
            <pre class="mt-2 bg-white p-2 rounded overflow-auto max-h-40">{{ stepsDebugInfo }}</pre>
          </details>
        </div>
      </div>

      <!-- Lista de Pasos (Draggable) -->
      <div v-if="steps.length > 0" class="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <!-- Header de la lista -->
        <div class="px-6 py-4 bg-gradient-to-r from-primary-50 to-primary-100/50 border-b border-primary-200">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-semibold text-primary-900 flex items-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
              </svg>
              Secuencia de Pasos
            </h4>
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 text-xs font-semibold bg-primary-600 text-white rounded-full">
                {{ steps.length }}
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
          <p class="text-xs text-primary-700 mt-1.5">Arrastra para reordenar</p>
        </div>
        
        <!-- Componente draggable - SINTAXIS SIN SLOT -->
        <draggable
          v-model="steps"
          item-key="id"
          handle=".handle"
          ghost-class="ghost-step"
          drag-class="dragging-step"
          tag="div"
          class="divide-y divide-gray-100"
          @start="onDragStart"
          @end="onDragEnd"
        >
          <div 
            v-for="(step, index) in steps" 
            :key="step.id"
            class="step-item flex items-start p-5 hover:bg-gray-50 transition-all duration-200 group"
          >
            <!-- Handle -->
            <button 
              class="handle cursor-move text-gray-400 hover:text-primary-600 mr-3 flex-shrink-0 mt-1 transition-colors p-1 rounded hover:bg-primary-50" 
              title="Reordenar paso"
              type="button"
            >
              <Bars3Icon class="w-5 h-5" />
            </button>

            <!-- Número de orden -->
            <div class="mr-4 flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <span class="text-sm font-bold text-primary-700">{{ index + 1 }}</span>
              </div>
            </div>

            <!-- Contenido del paso -->
            <div class="flex-1 min-w-0 mr-4">
              <h5 class="font-semibold text-gray-900 mb-1 line-clamp-2">{{ step.action }}</h5>
              
              <p v-if="step.description" class="text-sm text-gray-600 mb-2 line-clamp-2">
                {{ step.description }}
              </p>
              
              <div class="flex flex-wrap gap-2 mt-2">
                <!-- Duración -->
                <span v-if="step.estimated_minutes" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <ClockIcon class="w-3 h-3 mr-1" />
                  {{ step.estimated_minutes }} min
                </span>
                
                <!-- Supervisión -->
                <span v-if="step.requires_supervision" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  Supervisión
                </span>
                
                <!-- Saltable -->
                <span v-if="step.is_skippable" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Opcional
                </span>
                
                <!-- Apoyo Visual -->
                <span v-if="step.visual_support" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                  </svg>
                  Visual
                </span>
              </div>
            </div>

            <!-- Botón eliminar -->
            <button
              @click="removeStep(index)"
              type="button"
              class="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-error-600 hover:bg-error-50 transition-all duration-200 group/delete"
              title="Eliminar paso"
            >
              <TrashIcon class="w-5 h-5 group-hover/delete:scale-110 transition-transform" />
            </button>
          </div>
        </draggable>
      </div>

      <!-- Estado Vacío -->
      <div v-else class="text-center py-12 px-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-dashed border-yellow-300 rounded-2xl animate-pulse-slow">
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

      <!-- Formulario para Añadir Paso -->
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
            #default="{ value, state: { valid } }"
            v-model="newStepData"
            :actions="false"
            form-class="space-y-6"
            @submit="addStep"
            id="add-step-form"
          >
            <!-- Acción (campo principal) -->
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
                :validation-messages="{
                  required: 'La acción es obligatoria.',
                  length: 'Debe tener entre 3 y 500 caracteres.'
                }"
              >
                <template #prefix>
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </template>
              </FormKit>
            </div>

            <!-- Descripción y Duración -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="form-group">
                <FormKit
                  type="textarea"
                  name="description"
                  label="Descripción"
                  placeholder="Detalles adicionales sobre el paso..."
                  :rows="3"
                  validation="length:0,1000"
                  outer-class="form-field-wrapper"
                  input-class="form-textarea-enhanced"
                  label-class="form-label-enhanced"
                  help-class="form-help-text"
                  help="Opcional - Máximo 1000 caracteres"
                  :validation-messages="{ length: 'Máximo 1000 caracteres.' }"
                />
              </div>

              <div class="space-y-6">
                <div class="form-group">
                  <FormKit
                    type="number"
                    name="estimated_minutes"
                    label="Duración Estimada (minutos)"
                    placeholder="Ej: 5"
                    min="1"
                    step="1"
                    outer-class="form-field-wrapper"
                    input-class="form-input-enhanced"
                    label-class="form-label-enhanced"
                    help-class="form-help-text"
                    help="Opcional"
                    validation="number|min:1"
                    :validation-messages="{
                      number: 'Debe ser un número.',
                      min: 'Mínimo 1 minuto.'
                    }"
                  >
                    <template #prefix>
                      <ClockIcon class="w-5 h-5 text-gray-400" />
                    </template>
                  </FormKit>
                </div>

                <div class="form-group">
                  <FormKit
                    type="text"
                    name="visual_support"
                    label="Apoyo Visual"
                    placeholder="Nombre o descripción del apoyo"
                    outer-class="form-field-wrapper"
                    input-class="form-input-enhanced"
                    label-class="form-label-enhanced"
                    help-class="form-help-text"
                    help="Opcional - Podrás subir imágenes después"
                  >
                    <template #prefix>
                      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </template>
                  </FormKit>
                </div>
              </div>
            </div>

            <!-- Checkboxes -->
            <div class="bg-gray-50 rounded-xl p-4 space-y-3">
              <h5 class="text-sm font-semibold text-gray-700 mb-3">Opciones del Paso</h5>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormKit
                  type="checkbox"
                  name="requires_supervision"
                  label="Requiere supervisión"
                  outer-class="checkbox-enhanced"
                />
                <FormKit
                  type="checkbox"
                  name="is_skippable"
                  label="Puede saltarse (opcional)"
                  outer-class="checkbox-enhanced"
                />
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
                Añadir Paso
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
            Divide tareas complejas en pasos simples y específicos. Esto facilitará el seguimiento y comprensión de la rutina.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import { useRoutineWizardStore } from '@/store/rutinas/routineWizardStore'
import { storeToRefs } from 'pinia'
import type { WizardStep } from '@/store/rutinas/routineWizardStore'
import { Bars3Icon, ClockIcon, TrashIcon, PlusCircleIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits<{
  (e: 'update:validity', isValid: boolean): void
}>()

const wizardStore = useRoutineWizardStore()
const { steps } = storeToRefs(wizardStore)

// Estado local
const showDebug = ref(false)
let stepIdCounter = 0 // Contador para IDs únicos

const newStepData = ref<WizardStep>({
  action: '',
  description: '',
  estimated_minutes: null,
  visual_support: '',
  requires_supervision: false,
  is_skippable: false,
})

// Computed properties para debugging
const uniqueIdsCount = computed(() => {
  const ids = steps.value.map(s => s.id)
  return new Set(ids).size
})

const hasIdConflicts = computed(() => {
  return steps.value.length !== uniqueIdsCount.value
})

const stepsDebugInfo = computed(() => {
  return steps.value.map((s, i) => ({
    index: i,
    id: s.id,
    action: s.action.substring(0, 30) + (s.action.length > 30 ? '...' : '')
  }))
})

// Función mejorada para agregar paso con ID único garantizado
function addStep() {
  // Generar ID único y robusto
  const uniqueId = Date.now() + (stepIdCounter++)
  
  // Verificar que no exista (por seguridad extra)
  const idExists = steps.value.some(s => s.id === uniqueId)
  
  if (idExists) {
    console.warn('⚠️ ID duplicado detectado, regenerando...')
    stepIdCounter += 100 // Saltar más adelante
    setTimeout(() => addStep(), 10)
    return
  }
  
  const stepToAdd = { 
    ...newStepData.value,
    id: uniqueId
  }
  
  console.log('➕ Agregando paso:', { 
    id: uniqueId, 
    action: stepToAdd.action,
    counter: stepIdCounter 
  })
  
  steps.value.push(stepToAdd)
  
  // Verificación post-adición
  console.log('📋 Total steps:', steps.value.length)
  console.log('🔑 IDs:', steps.value.map(s => s.id))
  console.log('✅ IDs únicos:', uniqueIdsCount.value)
  
  if (hasIdConflicts.value) {
    console.error('❌ CONFLICTO DE IDs DETECTADO!')
  }
  
  // Resetear el formulario
  newStepData.value = {
    action: '',
    description: '',
    estimated_minutes: null,
    visual_support: '',
    requires_supervision: false,
    is_skippable: false,
  }
}

function removeStep(index: number) {
  console.log('🗑️ Eliminando paso en índice:', index)
  if (index >= 0 && index < steps.value.length) {
    const removedStep = steps.value[index]
    console.log('🗑️ Paso eliminado:', { id: removedStep.id, action: removedStep.action })
    steps.value.splice(index, 1)
  }
}

function onDragStart(event: any) {
  console.log('🎬 Arrastre iniciado:', event.oldIndex)
}

function onDragEnd(event: any) {
  console.log('🏁 Arrastre finalizado:', { from: event.oldIndex, to: event.newIndex })
  console.log('📋 Nuevo orden:', steps.value.map((s, i) => `${i+1}. ${s.action}`))
}

function emitValidityStatus() {
  const isValid = steps.value.length > 0
  emit('update:validity', isValid)
  console.log('✉️ Emitiendo validez:', isValid)
}

// Watch para detectar cambios
watch(steps, () => {
  console.log('👁️ Steps watch: longitud =', steps.value.length)
  emitValidityStatus()
}, { deep: true })

onMounted(async () => {
  console.log('=== 🚀 COMPONENTE MONTADO ===')
  console.log('1️⃣ Steps iniciales:', steps.value.length)
  console.log('2️⃣ Contenido:', JSON.stringify(steps.value, null, 2))
  
  emitValidityStatus()
  
  await nextTick()
  
  // Verificar DOM
  const stepItems = document.querySelectorAll('.step-item')
  console.log('3️⃣ Elementos .step-item en DOM:', stepItems.length)
  
  const draggableContainer = document.querySelector('.divide-y')
  console.log('4️⃣ Contenedor draggable:', !!draggableContainer)
  console.log('5️⃣ Hijos del contenedor:', draggableContainer?.children.length)
  
  console.log('=== FIN DEBUG INICIAL ===')
})
</script>

<style scoped>
/* Animaciones base */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes bounceSoft {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes pulseSlow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

.animate-slide-in {
  animation: slideIn 0.5s ease-out;
}

.animate-bounce-soft {
  animation: bounceSoft 3s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulseSlow 3s ease-in-out infinite;
}

/* Draggable styles */
.ghost-step {
  @apply opacity-50 bg-primary-100 border-2 border-dashed border-primary-400 rounded-lg;
}

.dragging-step {
  @apply bg-white shadow-2xl border-2 border-primary-400 rounded-lg cursor-grabbing transform rotate-2 scale-105;
}

.handle {
  touch-action: none;
}

/* Line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* FormKit styles */
:deep(.form-input-enhanced) {
  @apply w-full px-4 py-3 pl-11 rounded-lg border border-gray-300 
         focus:border-primary-500 focus:ring-2 focus:ring-primary-200 
         transition-all duration-300 text-gray-900 placeholder-gray-400
         hover:border-gray-400;
}

:deep(.form-textarea-enhanced) {
  @apply w-full px-4 py-3 rounded-lg border border-gray-300 
         focus:border-primary-500 focus:ring-2 focus:ring-primary-200 
         transition-all duration-300 text-gray-900 placeholder-gray-400
         hover:border-gray-400 resize-none;
}

:deep(.form-label-enhanced) {
  @apply block text-sm font-semibold text-gray-700 mb-2;
}

:deep(.form-help-text) {
  @apply text-xs text-gray-500 mt-1.5 italic;
}

:deep(.formkit-prefix) {
  @apply absolute left-3 top-[2.6rem] pointer-events-none;
}

/* Checkboxes mejorados */
:deep(.checkbox-enhanced .formkit-wrapper) {
  @apply flex items-center p-3 border-2 border-gray-200 rounded-lg
         hover:border-primary-400 hover:bg-primary-50 transition-all duration-200
         cursor-pointer;
}

:deep(.checkbox-enhanced input[type="checkbox"]) {
  @apply w-5 h-5 rounded border-gray-300 text-primary-600 
         focus:ring-2 focus:ring-primary-500 focus:ring-offset-0
         transition-all duration-200 cursor-pointer;
}

:deep(.checkbox-enhanced .formkit-label) {
  @apply text-sm font-medium text-gray-700 ml-3 cursor-pointer;
}

:deep(.checkbox-enhanced input[type="checkbox"]:checked ~ .formkit-label) {
  @apply text-primary-700 font-semibold;
}

/* Animación de error */
:deep(.formkit-outer[data-invalid]) .form-input-enhanced,
:deep(.formkit-outer[data-invalid]) .form-textarea-enhanced {
  @apply border-error-400 focus:border-error-500 focus:ring-error-200;
  animation: shake 0.4s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}

:deep(.formkit-message) {
  @apply text-sm text-error-600 flex items-center gap-1.5 mt-1;
}

/* Responsive */
@media (max-width: 640px) {
  :deep(.form-input-enhanced),
  :deep(.form-textarea-enhanced) {
    @apply py-2.5 text-sm;
  }
}
</style>