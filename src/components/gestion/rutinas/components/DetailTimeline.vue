<template>
  <div class="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
    <div class="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
      <h4 class="text-sm font-bold text-gray-900 flex items-center uppercase tracking-wider">
        <QueueListIcon class="w-5 h-5 mr-2 text-primary-600" />
        Secuencia de Pasos
      </h4>
      <span class="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded-md">
        {{ steps.length }} Pasos totales
      </span>
    </div>

    <div class="p-6 sm:p-8">
      <div v-if="steps && steps.length > 0" class="relative">
        <div 
          class="absolute left-4 sm:left-6 top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary-200 via-primary-100 to-transparent"
          aria-hidden="true"
        ></div>

        <div class="space-y-10">
          <div 
            v-for="(step, index) in sortedSteps" 
            :key="step.id || index" 
            class="relative flex items-start group"
          >
            <div class="relative z-10 flex-shrink-0 flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-primary-500 shadow-sm transition-transform group-hover:scale-110">
              <span class="text-sm sm:text-base font-bold text-primary-700">{{ index + 1 }}</span>
            </div>

            <div class="ml-4 sm:ml-8 flex-1 min-w-0 pt-0.5">
              <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div class="space-y-1 flex-1">
                  <h5 class="text-lg font-bold text-gray-900 leading-tight group-hover:text-primary-700 transition-colors">
                    {{ step.action }}
                  </h5>
                  
                  <p v-if="step.description" class="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">
                    {{ step.description }}
                  </p>

                  <div v-if="getPictogramForStep(step)" class="mt-4 inline-flex items-center p-3 bg-primary-50 rounded-xl border border-primary-100 shadow-sm">
                    <div class="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-3 shadow-inner">
                      <component 
                        :is="getPictogramForStep(step)!.component" 
                        class="w-8 h-8 text-primary-600" 
                      />
                    </div>
                    <div class="min-w-0">
                      <p class="text-xs font-bold text-primary-800 uppercase tracking-tight">Apoyo Visual</p>
                      <p class="text-sm text-primary-700 truncate font-medium">{{ getPictogramForStep(step)!.label }}</p>
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap gap-2 flex-shrink-0 mt-1 sm:mt-0">
                  <span v-if="step.estimated_minutes" class="badge-base bg-blue-50 text-blue-700 border-blue-100">
                    <ClockIcon class="w-3.5 h-3.5 mr-1" />
                    {{ step.estimated_minutes }} min
                  </span>
                  
                  <span v-if="step.requires_supervision" class="badge-base bg-amber-50 text-amber-700 border-amber-100">
                    <UserIcon class="w-3.5 h-3.5 mr-1" />
                    Supervisión
                  </span>
                  
                  <span v-if="step.is_skippable" class="badge-base bg-emerald-50 text-emerald-700 border-emerald-100">
                    <ArrowUturnRightIcon class="w-3.5 h-3.5 mr-1" />
                    Opcional
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <QueueListIcon class="w-8 h-8 text-gray-300" />
        </div>
        <h5 class="text-gray-900 font-bold text-lg">Secuencia no definida</h5>
        <p class="text-gray-500 max-w-xs mt-1">Esta rutina no tiene pasos configurados. Edita la rutina para añadir la secuencia de acciones.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RoutineStep } from '@/type/rutinas/rutinas'
import { 
  QueueListIcon, 
  ClockIcon, 
  UserIcon, 
  ArrowUturnRightIcon 
} from '@heroicons/vue/24/outline'
import { getPictogramById, type Pictogram } from '@/data/pictograms'

const props = defineProps<{
  steps: RoutineStep[]
}>()

// Asegurar que los pasos siempre se muestren en el orden correcto de ejecución
const sortedSteps = computed(() => {
  return [...props.steps].sort((a, b) => a.order - b.order)
})

/**
 * Obtiene el objeto de pictograma completo para mostrar el icono
 */
function getPictogramForStep(step: RoutineStep): Pictogram | undefined {
  if (!step.visual_support) return undefined
  return getPictogramById(step.visual_support)
}
</script>

<style scoped>
.badge-base {
  @apply inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border transition-colors;
}

.shadow-soft {
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
}

/* Animación sutil de entrada para los elementos */
.space-y-10 > div {
  animation: slideIn 0.4s ease-out forwards;
  opacity: 0;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Delay escalonado para la animación */
.space-y-10 > div:nth-child(1) { animation-delay: 0.1s; }
.space-y-10 > div:nth-child(2) { animation-delay: 0.2s; }
.space-y-10 > div:nth-child(3) { animation-delay: 0.3s; }
.space-y-10 > div:nth-child(n+4) { animation-delay: 0.4s; }
</style>