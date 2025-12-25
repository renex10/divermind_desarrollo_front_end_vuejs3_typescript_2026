<template>
  <div class="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
    <div :class="['h-2 w-full', typeBgClass]"></div>
    
    <div class="p-6 sm:p-8">
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div class="flex items-start gap-5">
          <div :class="['flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-transform hover:scale-105', typeBgClassLight]">
            {{ routineIcon }}
          </div>
          
          <div class="space-y-1">
            <div class="flex items-center gap-3">
              <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                {{ name }}
              </h2>
            </div>
            
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <span class="inline-flex items-center font-medium text-primary-700">
                <TagIcon class="w-4 h-4 mr-1.5" />
                {{ typeLabel }}
              </span>
              <span class="text-gray-400">•</span>
              <span class="inline-flex items-center text-gray-500">
                <CalendarIcon class="w-4 h-4 mr-1.5" />
                Creada el {{ formattedDate }}
              </span>
            </div>
          </div>
        </div>

        <div class="hidden sm:block">
          <span class="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-mono rounded-full border border-gray-200">
            REF: #{{ type?.toUpperCase().substring(0, 3) }}-RD
          </span>
        </div>
      </div>

      <div v-if="description" class="mt-6 pt-6 border-t border-gray-50">
        <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center">
          <InformationCircleIcon class="w-4 h-4 mr-1" />
          Objetivo de la Rutina
        </h4>
        <p class="text-gray-600 leading-relaxed italic text-sm sm:text-base">
          "{{ description }}"
        </p>
      </div>
      
      <div v-else class="mt-6 pt-6 border-t border-gray-50 italic text-gray-400 text-sm">
        Sin descripción adicional para esta rutina.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { 
  CalendarIcon, 
  TagIcon, 
  InformationCircleIcon 
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  name: string
  type: string
  description?: string
  createdAt: string
}>()

// Mapeo de tipos a etiquetas legibles e iconos
const typeOptions: Record<string, { label: string, icon: string, color: string }> = {
  morning: { label: 'Mañana', icon: '🌅', color: 'orange' },
  breakfast: { label: 'Desayuno', icon: '🍳', color: 'amber' },
  school_prep: { label: 'Preparación Escuela', icon: '🎒', color: 'blue' },
  after_school: { label: 'Después de Escuela', icon: '🏠', color: 'indigo' },
  homework: { label: 'Tareas', icon: '📚', color: 'purple' },
  dinner: { label: 'Cena', icon: '🍽️', color: 'rose' },
  bath: { label: 'Baño', icon: '🛁', color: 'cyan' },
  bedtime: { label: 'Dormir', icon: '🌙', color: 'slate' },
  therapy_session: { label: 'Terapia', icon: '💆', color: 'emerald' },
  weekend: { label: 'Fin de Semana', icon: '🎉', color: 'pink' },
  transition: { label: 'Transición', icon: '🔄', color: 'teal' },
  other: { label: 'Otra', icon: '📋', color: 'gray' }
}

const typeInfo = computed(() => typeOptions[props.type] || typeOptions.other)

const typeLabel = computed(() => typeInfo.value.label)
const routineIcon = computed(() => typeInfo.value.icon)

// Clases dinámicas de color para la franja y el fondo del icono
const typeBgClass = computed(() => {
  const colors: Record<string, string> = {
    orange: 'bg-orange-500', amber: 'bg-amber-500', blue: 'bg-blue-500', 
    indigo: 'bg-indigo-500', purple: 'bg-purple-500', rose: 'bg-rose-500',
    cyan: 'bg-cyan-500', slate: 'bg-slate-700', emerald: 'bg-emerald-500',
    pink: 'bg-pink-500', teal: 'bg-teal-500', gray: 'bg-gray-500'
  }
  return colors[typeInfo.value.color]
})

const typeBgClassLight = computed(() => {
  const colors: Record<string, string> = {
    orange: 'bg-orange-50 text-orange-600', amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600', indigo: 'bg-indigo-50 text-indigo-600',
    purple: 'bg-purple-50 text-purple-600', rose: 'bg-rose-50 text-rose-600',
    cyan: 'bg-cyan-50 text-cyan-600', slate: 'bg-slate-50 text-slate-600',
    emerald: 'bg-emerald-50 text-emerald-600', pink: 'bg-pink-50 text-pink-600',
    teal: 'bg-teal-50 text-teal-600', gray: 'bg-gray-50 text-gray-600'
  }
  return colors[typeInfo.value.color]
})

const formattedDate = computed(() => {
  if (!props.createdAt) return 'N/A'
  try {
    return format(parseISO(props.createdAt), "d 'de' MMMM, yyyy", { locale: es })
  } catch (e) {
    return props.createdAt
  }
})
</script>

<style scoped>
.shadow-soft {
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
}
</style>