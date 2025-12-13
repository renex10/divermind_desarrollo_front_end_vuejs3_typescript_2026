<!-- src/components/gestion/rutinas/core/RoutineCard.vue -->
<template>
  <div class="bg-white rounded-2xl shadow-soft transition-all duration-300 hover:shadow-medium divide-y divide-gray-200 border border-gray-100">

    <!-- Header con nombre y acciones -->
    <div class="p-5 flex justify-between items-start">
      <div class="flex-1 min-w-0">
        <button 
          @click="onViewDetail" 
          class="text-left group w-full"
        >
          <h3 class="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
            {{ routine.name }}
          </h3>
        </button>
        <p class="text-sm font-medium text-primary-600 mt-1">
          {{ getRoutineTypeDisplay }}
        </p>
        
        <!-- Estado y metadata en línea -->
        <div class="flex items-center gap-3 mt-2">
          <RoutineStatusBadge :status="routine.status" />
          <span class="text-xs text-gray-500">
            {{ routine.total_steps || 0 }} pasos
          </span>
          <span class="text-xs text-gray-500">
            {{ formattedDate }}
          </span>
        </div>
      </div>
      
      <RoutineActionMenu 
        :routine="routine"
        @edit="handleAction('edit')"
        @clone="handleAction('clone')"
        @toggle-status="handleAction('toggle-status')"
        @archive="handleAction('archive')"
      />
    </div>

    <!-- Progreso y métricas -->
    <div class="p-5">
      <div v-if="hasProgressData" class="space-y-3">
        <!-- Barra de progreso -->
        <div>
          <div class="flex justify-between items-center mb-1">
            <span class="text-sm font-medium text-gray-700">Progreso (7 días)</span>
            <span class="text-sm font-bold" :class="progressColor">
              {{ routine.completion_rate_7days }}%
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              class="h-2.5 rounded-full transition-all duration-500" 
              :class="progressBarColor"
              :style="{ width: completionWidth }"
            ></div>
          </div>
        </div>

        <!-- Métricas adicionales -->
        <div class="grid grid-cols-2 gap-4 text-xs">
          <div class="text-center p-2 bg-gray-50 rounded-lg">
            <div class="font-semibold text-gray-900">{{ routine.total_steps || 0 }}</div>
            <div class="text-gray-500">Pasos totales</div>
          </div>
          <div class="text-center p-2 bg-gray-50 rounded-lg">
            <div class="font-semibold text-gray-900">{{ routineStatusText }}</div>
            <div class="text-gray-500">Estado</div>
          </div>
        </div>
      </div>
      
      <!-- Estado sin datos -->
      <div v-else class="text-center py-4">
        <div class="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-2">
          <CalendarDaysIcon class="w-6 h-6 text-gray-400" />
        </div>
        <p class="text-sm text-gray-500">
          Sin registros recientes
        </p>
        <button 
          @click="onViewDetail"
          class="mt-2 text-xs text-primary-600 hover:text-primary-700 font-medium"
        >
          Ver detalles →
        </button>
      </div>
    </div>

    <!-- Footer con acciones rápidas -->
    <div class="p-4 bg-gray-50 rounded-b-2xl">
      <div class="flex justify-between items-center">
        <button
          @click="onViewDetail"
          class="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          <EyeIcon class="w-4 h-4 mr-1" />
          Ver
        </button>
        
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500" :title="`Creado: ${fullFormattedDate}`">
            {{ timeAgo }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import { format, parseISO, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

// Importar tipos desde el archivo recién creado
import type { DailyRoutineList } from '@/type/rutinas/rutinas'

// Iconos
import { 
  CalendarDaysIcon, 
  EyeIcon 
} from '@heroicons/vue/24/outline'

// Componentes
import RoutineStatusBadge from './RoutineStatusBadge.vue'
import RoutineActionMenu from './RoutineActionMenu.vue'

// === PROPS ===
const props = defineProps({
  routine: {
    type: Object as PropType<DailyRoutineList>,
    required: true
  }
})

// === EMITS ===
const emit = defineEmits<{
  (e: 'view-detail', id: number): void
  (e: 'edit', id: number): void
  (e: 'clone', id: number): void
  (e: 'toggle-status', id: number): void
  (e: 'archive', id: number): void
}>()

// === COMPUTED PROPERTIES ===

/** Muestra el tipo de rutina formateado */
const getRoutineTypeDisplay = computed(() => {
  return props.routine.routine_type_display || props.routine.routine_type
})

/** Fecha formateada corta para el header */
const formattedDate = computed(() => {
  if (!props.routine.created_at) return 'N/A'
  try {
    return format(parseISO(props.routine.created_at), 'd MMM', { locale: es })
  } catch {
    return props.routine.created_at.split('T')[0]
  }
})

/** Fecha completa para tooltip */
const fullFormattedDate = computed(() => {
  if (!props.routine.created_at) return 'Fecha no disponible'
  try {
    return format(parseISO(props.routine.created_at), "d 'de' MMMM 'de' yyyy", { locale: es })
  } catch {
    return props.routine.created_at
  }
})

/** Tiempo relativo (hace X tiempo) */
const timeAgo = computed(() => {
  if (!props.routine.created_at) return 'Nunca'
  try {
    return formatDistanceToNow(parseISO(props.routine.created_at), { 
      addSuffix: true, 
      locale: es 
    })
  } catch {
    return 'Fecha inválida'
  }
})

/** Ancho de la barra de progreso */
const completionWidth = computed(() => {
  return `${props.routine.completion_rate_7days ?? 0}%`
})

/** Color del texto del progreso basado en el porcentaje */
const progressColor = computed(() => {
  const rate = props.routine.completion_rate_7days
  if (rate === null || rate === undefined) return 'text-gray-500'
  if (rate >= 80) return 'text-green-600'
  if (rate >= 60) return 'text-primary-600'
  if (rate >= 40) return 'text-yellow-600'
  return 'text-red-600'
})

/** Color de la barra de progreso */
const progressBarColor = computed(() => {
  const rate = props.routine.completion_rate_7days
  if (rate === null || rate === undefined) return 'bg-gray-400'
  if (rate >= 80) return 'bg-green-500'
  if (rate >= 60) return 'bg-primary-500'
  if (rate >= 40) return 'bg-yellow-500'
  return 'bg-red-500'
})

/** Texto del estado de la rutina */
const routineStatusText = computed(() => {
  const status = props.routine.status
  const statusMap: Record<string, string> = {
    'active': 'Activa',
    'paused': 'Pausada', 
    'archived': 'Archivada',
    'draft': 'Borrador'
  }
  return statusMap[status] || props.routine.status_display || status
})

/** Verifica si hay datos de progreso para mostrar */
const hasProgressData = computed(() => {
  return props.routine.completion_rate_7days !== null && 
         props.routine.completion_rate_7days !== undefined
})

// === MÉTODOS ===

function onViewDetail() {
  console.log('📋 Viewing routine detail:', props.routine.id)
  emit('view-detail', props.routine.id)
}

function handleAction(actionName: 'edit' | 'clone' | 'toggle-status' | 'archive') {
  console.log(`🔄 Routine action: ${actionName}`, props.routine.id)
  
  switch (actionName) {
    case 'edit':
      emit('edit', props.routine.id)
      break
    case 'clone':
      emit('clone', props.routine.id)
      break
    case 'toggle-status':
      emit('toggle-status', props.routine.id)
      break
    case 'archive':
      emit('archive', props.routine.id)
      break
  }
}
</script>

<style scoped>
/* Estilos de transición para hover */
.shadow-soft {
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.shadow-medium {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

/* Transición suave para todos los estados interactivos */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Mejora la legibilidad del truncado */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>