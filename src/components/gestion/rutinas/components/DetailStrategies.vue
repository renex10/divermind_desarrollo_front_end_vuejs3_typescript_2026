<template>
  <div class="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden flex flex-col">
    <div class="px-5 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
      <h4 class="text-sm font-bold text-gray-900 flex items-center">
        <SparklesIcon class="w-5 h-5 mr-2 text-primary-600" />
        Estrategias y Flexibilidad
      </h4>
    </div>

    <div class="p-5 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
      <div class="space-y-3">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Nivel de Flexibilidad
        </p>
        <div :class="['p-3 rounded-xl border flex items-center gap-3', flexibilityTheme.container]">
          <div :class="['w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-sm', flexibilityTheme.iconBg]">
            {{ flexibilityTheme.icon }}
          </div>
          <div class="min-w-0">
            <p :class="['text-sm font-bold', flexibilityTheme.text]">
              {{ flexibilityTheme.label }}
            </p>
            <p class="text-xs text-gray-600 line-clamp-1">
              {{ flexibilityTheme.description }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="strategies?.needs_advance_warning" class="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
        <div class="flex items-center gap-2 mb-2">
          <BellIcon class="w-4 h-4 text-blue-600" />
          <p class="text-xs font-bold text-blue-800 uppercase tracking-tight">Anticipación Requerida</p>
        </div>
        <p class="text-sm text-blue-900 font-medium">
          Aviso previo de <span class="text-blue-700 font-bold">{{ strategies.warning_time_minutes }} minutos</span>
        </p>
        <p v-if="strategies.warning_method" class="text-xs text-blue-700 mt-1">
          Método: {{ strategies.warning_method }}
        </p>
      </div>

      <div v-if="strategies?.change_tolerance_notes" class="space-y-2">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
          <ExclamationTriangleIcon class="w-3.5 h-3.5 mr-1" />
          Tolerancia al cambio
        </p>
        <p class="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 italic leading-relaxed">
          "{{ strategies.change_tolerance_notes }}"
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <div v-if="strategies?.transition_strategies" class="space-y-2">
          <p class="text-xs font-semibold text-primary-700 uppercase tracking-wider">Estrategias de Transición</p>
          <div class="text-sm text-gray-700 leading-relaxed">
            {{ strategies.transition_strategies }}
          </div>
        </div>

        <div v-if="strategies?.calming_strategies" class="space-y-2 pt-2 border-t border-gray-100">
          <p class="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Técnicas de Calma</p>
          <div class="text-sm text-gray-700 leading-relaxed">
            {{ strategies.calming_strategies }}
          </div>
        </div>
      </div>

      <div v-if="strategies?.visual_supports_needed" class="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
        <div class="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white">
          <PhotoIcon class="w-5 h-5" />
        </div>
        <div>
          <p class="text-xs font-bold text-purple-900 uppercase">Apoyo Visual Activo</p>
          <p class="text-xs text-purple-700">{{ strategies.visual_support_type || 'Tipo no especificado' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RoutineStrategy } from '@/type/rutinas/rutinas'
import { 
  SparklesIcon, 
  BellIcon, 
  ExclamationTriangleIcon, 
  PhotoIcon 
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  strategies: RoutineStrategy | null
}>()

/**
 * Define el tema visual del bloque de flexibilidad según el nivel
 */
const flexibilityTheme = computed(() => {
  const level = props.strategies?.flexibility_level || 'medium'
  
  const themes: any = {
    low: {
      label: 'Flexibilidad Baja',
      description: 'Requiere estructura rígida y sin cambios.',
      icon: '🔒',
      container: 'bg-red-50 border-red-100',
      iconBg: 'bg-white text-red-600',
      text: 'text-red-800'
    },
    medium: {
      label: 'Flexibilidad Media',
      description: 'Acepta cambios ligeros con previo aviso.',
      icon: '⚖️',
      container: 'bg-amber-50 border-amber-100',
      iconBg: 'bg-white text-amber-600',
      text: 'text-amber-800'
    },
    high: {
      label: 'Flexibilidad Alta',
      description: 'Se adapta bien a variaciones en la rutina.',
      icon: '🍃',
      container: 'bg-emerald-50 border-emerald-100',
      iconBg: 'bg-white text-emerald-600',
      text: 'text-emerald-800'
    }
  }
  
  return themes[level]
})
</script>

<style scoped>
.shadow-soft {
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
}
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #f3f4f6; border-radius: 10px; }
</style>