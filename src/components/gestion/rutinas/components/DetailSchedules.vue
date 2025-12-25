<template>
  <div class="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden h-full flex flex-col">
    <div class="px-5 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
      <h4 class="text-sm font-bold text-gray-900 flex items-center">
        <ClockIcon class="w-5 h-5 mr-2 text-primary-600" />
        Horarios Programados
      </h4>
      <span class="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-bold rounded-full">
        {{ schedules.length }}
      </span>
    </div>

    <div class="flex-1 p-5 overflow-y-auto custom-scrollbar">
      <div v-if="schedules.length > 0" class="space-y-4">
        <div 
          v-for="(schedule, index) in schedules" 
          :key="index"
          class="p-4 rounded-xl border border-gray-100 bg-white hover:border-primary-200 hover:bg-primary-50/30 transition-all group"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="text-lg font-bold text-gray-900">{{ formatTime(schedule.start_time) }}</span>
              <span v-if="schedule.estimated_duration_minutes" class="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-lg border border-primary-100">
                {{ schedule.estimated_duration_minutes }} min
              </span>
            </div>
            <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
              <CalendarIcon class="w-4 h-4" />
            </div>
          </div>

          <div class="space-y-2">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
              Días asignados
            </p>
            <p class="text-sm text-gray-700 leading-snug">
              {{ formatDays(schedule.days_of_week) }}
            </p>
          </div>

          <div class="flex gap-1 mt-3">
            <span 
              v-for="day in dayLabels" 
              :key="day.id"
              :class="[
                'w-6 h-6 flex items-center justify-center rounded-md text-[10px] font-bold transition-colors',
                isDaySelected(schedule.days_of_week, day.id) 
                  ? 'bg-primary-600 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-400'
              ]"
            >
              {{ day.label }}
            </span>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-10 text-center">
        <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <ClockIcon class="w-6 h-6 text-gray-300" />
        </div>
        <p class="text-sm text-gray-500 px-4">No hay horarios específicos asignados a esta rutina.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ClockIcon, CalendarIcon } from '@heroicons/vue/24/outline'

// Tipado basado en routineWizardStore.ts
interface Schedule {
  start_time: string
  estimated_duration_minutes: number | null
  days_of_week: string[]
}

// Solución 1: Usar directamente la desestructuración (recomendado)
const { schedules } = defineProps<{
  schedules: Schedule[]
}>()

// Solución 2: Si prefieres mantener props por alguna razón, puedes usar:
// const props = defineProps<{
//   schedules: Schedule[]
// }>()
// Y entonces usar props.schedules en el template en lugar de schedules

const dayLabels = [
  { id: 'monday', label: 'L' },
  { id: 'tuesday', label: 'M' },
  { id: 'wednesday', label: 'X' },
  { id: 'thursday', label: 'J' },
  { id: 'friday', label: 'V' },
  { id: 'saturday', label: 'S' },
  { id: 'sunday', label: 'D' }
]

function isDaySelected(selectedDays: string[], dayId: string): boolean {
  return selectedDays.includes(dayId)
}

function formatTime(time: string): string {
  if (!time) return '--:--'
  return time.split(':').slice(0, 2).join(':')
}

/**
 * Lógica de formateo de días (Herencia funcional de WizardStep2Schedules.vue)
 */
function formatDays(days: string[]): string {
  if (!days || days.length === 0) return 'Ningún día'
  
  const dayMap: Record<string, string> = {
    monday: 'Lunes', tuesday: 'Martes', wednesday: 'Miércoles', thursday: 'Jueves', 
    friday: 'Viernes', saturday: 'Sábado', sunday: 'Domingo'
  }
  
  const orderedDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const sortedSelectedDays = orderedDays.filter(d => days.includes(d))

  if (sortedSelectedDays.length === 7) return 'Todos los días'
  if (sortedSelectedDays.length === 5 && 
      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].every(d => days.includes(d))) {
    return 'Lunes a Viernes'
  }
  if (sortedSelectedDays.length === 2 && days.includes('saturday') && days.includes('sunday')) {
    return 'Fines de semana'
  }
  
  // Lógica de rangos consecutivos
  if (sortedSelectedDays.length > 2) {
    const indices = sortedSelectedDays.map(d => orderedDays.indexOf(d))
    const isConsecutive = indices.every((val, i, arr) => i === 0 || val === arr[i - 1] + 1)
    if (isConsecutive) {
      return `${dayMap[sortedSelectedDays[0]]} a ${dayMap[sortedSelectedDays[sortedSelectedDays.length - 1]]}`
    }
  }
  
  return sortedSelectedDays.map(day => dayMap[day]).join(', ')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #f3f4f6; border-radius: 10px; }
</style>