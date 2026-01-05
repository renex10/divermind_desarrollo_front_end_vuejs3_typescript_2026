<template>
  <div class="agenda-padre-container">
    
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="routines.length === 0" class="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200">
      <p class="text-gray-500 font-bold text-lg">No hay rutinas programadas para hoy.</p>
      <p class="text-gray-400 text-sm mt-2">Consulta con tu terapeuta si deberías tener actividades asignadas.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div 
        v-for="rutina in routines" 
        :key="rutina.id" 
        class="bg-white rounded-[2rem] p-8 shadow-sm border transition-all duration-300 group relative overflow-hidden"
        :class="isCompleted(rutina.id) ? 'border-green-200 bg-green-50/20' : 'border-gray-100 hover:shadow-xl'"
      >
        <div v-if="isCompleted(rutina.id)" class="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <CheckCircleIcon class="w-32 h-32 text-green-500" />
        </div>

        <div class="flex justify-between items-start mb-6 relative z-10">
          <span class="px-4 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full">
            {{ rutina.routine_type_display }}
          </span>

          <div class="flex items-center gap-2">
            <span 
              v-if="isCompleted(rutina.id)" 
              class="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200"
            >
              <CheckCircleIcon class="w-4 h-4" />
              LISTO HOY
            </span>
            <div v-else class="flex items-center text-gray-400 font-bold text-sm">
              <ClockIcon class="w-5 h-5 mr-1.5 text-orange-400" />
              <span>{{ formatearHora(rutina) }}</span>
            </div>
          </div>
        </div>

        <h3 class="text-2xl font-black text-gray-900 mb-3 group-hover:text-primary-600 transition-colors relative z-10">
          {{ rutina.name }}
        </h3>
        <p class="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-2 relative z-10">
          {{ rutina.description }}
        </p>

        <button 
          @click="iniciarNavegacionSegura(rutina)"
          class="w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black transition-all transform active:scale-95 shadow-lg relative z-10"
          :class="isCompleted(rutina.id) 
            ? 'bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 shadow-none' 
            : 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-200'"
        >
          <component :is="isCompleted(rutina.id) ? PencilSquareIcon : PlayIcon" class="w-6 h-6 fill-current" />
          {{ isCompleted(rutina.id) ? 'EDITAR / VER DETALLE' : 'COMENZAR RUTINA' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ClockIcon, PlayIcon, CheckCircleIcon, PencilSquareIcon } from '@heroicons/vue/24/solid'
// ✅ Importamos el store para saber qué rutinas están listas
import { useRoutinesStore } from '@/store/rutinas/routinesStore'
import { useNinoActivoStore } from '@/store/ninoActivoStore'

// ✅ CORRECCIÓN: Quitamos "const props =" ya que no se usa en el script.
// defineProps sigue exponiendo las props al template automáticamente.
defineProps<{
  routines: any[],
  loading: boolean,
  childName: string
}>()

const router = useRouter()
const routinesStore = useRoutinesStore()
const ninoStore = useNinoActivoStore()

// ✅ Función para verificar si la rutina está completada hoy
const isCompleted = (routineId: number) => {
  return routinesStore.completedTodayIds.includes(routineId)
}

// ✅ Cargamos los pendientes al montar para asegurar que el badge esté fresco
onMounted(async () => {
  if (ninoStore.ninoActivoId) {
    await routinesStore.fetchPendingRoutines(ninoStore.ninoActivoId)
  }
})

// Función auxiliar para formatear hora
const formatTime = (timeString: string): string => {
  if (!timeString) return 'Sin hora'
  if (timeString.includes(':')) {
    const parts = timeString.split(':')
    return `${parts[0]}:${parts[1]}`
  }
  return timeString
}

// Lógica de hora (Manteniendo tu lógica de intentos)
const formatearHora = (rutina: any) => {
  if (rutina.schedules && rutina.schedules.length > 0 && rutina.schedules[0].start_time) {
    return formatTime(rutina.schedules[0].start_time)
  }
  if (rutina.schedule && rutina.schedule.start_time) {
    return formatTime(rutina.schedule.start_time)
  }
  if (rutina.start_time) {
    return formatTime(rutina.start_time)
  }
  if (rutina.next_scheduled_time) {
    return rutina.next_scheduled_time
  }
  return 'Flexible'
}

const iniciarNavegacionSegura = (rutina: any) => {
  if (!rutina.id) {
    console.error('❌ ERROR: La rutina no tiene un ID válido.')
    return
  }
  router.push({ 
    name: 'parent-rutina-ejecutar', 
    params: { routineId: rutina.id } 
  }).catch(err => {
    console.error('❌ ERROR de Vue Router:', err)
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.group:hover {
  transform: translateY(-5px);
}
</style>