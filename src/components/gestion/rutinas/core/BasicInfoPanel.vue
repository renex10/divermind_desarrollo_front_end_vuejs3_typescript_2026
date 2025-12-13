<template>
  <div class="bg-white rounded-2xl shadow-soft p-6">
    
    <h3 class="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-4 flex items-center">
      <InformationCircleIcon class="w-5 h-5 mr-2 text-primary-600" />
      Información General
    </h3>

    <dl class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">

      <div class="md:col-span-2"> {/* Ocupa ambas columnas en md */}
        <dt class="text-gray-500 font-medium">Nombre de la Rutina</dt>
        <dd class="mt-1 text-gray-900 font-semibold text-base">{{ routineData.name }}</dd>
      </div>

      <div>
        <dt class="text-gray-500 font-medium">Tipo</dt>
        <dd class="mt-1 text-gray-900">{{ routineData.routine_type_display }}</dd>
      </div>

      <div>
        <dt class="text-gray-500 font-medium">Estado</dt>
        <dd class="mt-1">
          <RoutineStatusBadge :status="routineData.status" />
        </dd>
      </div>
      
      <div class="md:col-span-2">
        <dt class="text-gray-500 font-medium">Descripción</dt>
        <dd class="mt-1 text-gray-900 whitespace-pre-wrap">{{ routineData.description || 'No especificada' }}</dd>
      </div>

      <div>
        <dt class="text-gray-500 font-medium">Fecha de Inicio</dt>
        <dd class="mt-1 text-gray-900">{{ formattedStartDate }}</dd>
      </div>

      <div>
        <dt class="text-gray-500 font-medium">Creado Por</dt>
        <dd class="mt-1 text-gray-900">{{ routineData.created_by_name }}</dd>
      </div>

      <div class="md:col-span-2">
        <dt class="text-gray-500 font-medium">Para</dt>
        <dd class="mt-1 text-gray-900 font-medium">{{ routineData.child_name }}</dd>
      </div>

    </dl>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Importamos la interfaz que define la estructura esperada
import type { DailyRoutineDetail } from '@/type/rutinas/rutinas' 

// Importamos date-fns para formatear fechas (de tus dependencias)
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

// Importamos el icono (de tus dependencias)
import { InformationCircleIcon } from '@heroicons/vue/24/outline'

// Importamos el componente Badge (de la misma carpeta 'core')
import RoutineStatusBadge from './RoutineStatusBadge.vue'

// === PROPS ===
// Este componente esperaría recibir el objeto de rutina completo
// const props = defineProps({
//   routine: {
//     type: Object as PropType<DailyRoutineDetail>,
//     required: true
//   }
// })

// === DATOS DE EJEMPLO (Simulando la Prop 'routine') ===
// Estos datos coinciden con la estructura de DailyRoutineDetailSerializer
const routineData = ref<DailyRoutineDetail>({
  id: 15,
  name: "Rutina Matutina Escolar",
  routine_type: "morning",
  routine_type_display: "Mañana",
  description: "Preparación completa para ir al colegio, desde levantarse hasta salir de casa.",
  status: "active",
  status_display: "Activa",
  is_active: true,
  date_started: "2025-09-01",
  date_ended: null,
  child: 4,
  child_name: "Matías González",
  created_by_name: "Dr. Ana Torres",
  total_steps: 8,
  completion_rate_7days: 85.7, // Campo calculado por el serializer
  created_at: "2025-08-25T10:30:00Z",
  // Relaciones anidadas (no usadas directamente en este panel, pero parte del tipo)
  schedules: [], 
  steps: [],
  strategies: null,
  motivation: null,
  independence_goal: null,
  coordination: null,
  challenges: null,
  evaluations: [],
})

// === COMPUTED ===

/**
 * Formatea la fecha de inicio a un formato legible (ej: "1 sep 2025")
 */
const formattedStartDate = computed(() => {
  if (!routineData.value.date_started) return 'No definida'
  try {
    // parseISO convierte el string YYYY-MM-DD en un objeto Date
    // format lo convierte al formato deseado
    return format(parseISO(routineData.value.date_started), 'd MMM yyyy', { locale: es })
  } catch (error) {
    console.warn('Error formatting start date:', routineData.value.date_started)
    return routineData.value.date_started // Fallback
  }
})

</script>

<style scoped>
/* Estilos específicos si fueran necesarios, 
  pero Tailwind debería cubrir la mayoría.
  'whitespace-pre-wrap' en la descripción permite 
  respetar los saltos de línea y espacios múltiples.
*/
</style>