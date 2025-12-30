<template>
  <div class="agenda-padre-container">
    <!-- ✅ DEBUG: Panel de depuración -->
    <div v-if="routines.length > 0" class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <details class="cursor-pointer">
        <summary class="font-bold text-yellow-900">🔍 DEBUG: Ver estructura de datos</summary>
        <pre class="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-64">{{ JSON.stringify(routines[0], null, 2) }}</pre>
      </details>
    </div>

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
        class="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group"
      >
        <div class="flex justify-between items-start mb-6">
          <span class="px-4 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full">
            {{ rutina.routine_type_display }}
          </span>
          <div class="flex items-center text-gray-400 font-bold text-sm">
            <ClockIcon class="w-5 h-5 mr-1.5 text-blue-400" />
            <!-- ✅ MEJORADO: Múltiples intentos de acceso -->
            <span>{{ formatearHora(rutina) }}</span>
          </div>
        </div>

        <h3 class="text-2xl font-black text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
          {{ rutina.name }}
        </h3>
        <p class="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-2">
          {{ rutina.description }}
        </p>

        <button 
          @click="iniciarNavegacionSegura(rutina)"
          class="w-full flex items-center justify-center gap-3 py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black transition-all transform active:scale-95 shadow-lg shadow-primary-200"
        >
          <PlayIcon class="w-6 h-6 fill-current" />
          COMENZAR RUTINA
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ClockIcon, PlayIcon } from '@heroicons/vue/24/solid'

defineProps<{
  routines: any[],
  loading: boolean,
  childName: string
}>()

const router = useRouter()

// ✅ FUNCIÓN para formatear la hora con múltiples intentos
const formatearHora = (rutina: any) => {
  console.log('🔍 Estructura de rutina:', rutina)
  
  // Intento 1: schedules[0].start_time
  if (rutina.schedules && rutina.schedules.length > 0 && rutina.schedules[0].start_time) {
    const hora = rutina.schedules[0].start_time
    console.log('✅ Hora encontrada en schedules[0].start_time:', hora)
    return formatTime(hora)
  }
  
  // Intento 2: schedule.start_time (singular)
  if (rutina.schedule && rutina.schedule.start_time) {
    const hora = rutina.schedule.start_time
    console.log('✅ Hora encontrada en schedule.start_time:', hora)
    return formatTime(hora)
  }
  
  // Intento 3: start_time directo
  if (rutina.start_time) {
    const hora = rutina.start_time
    console.log('✅ Hora encontrada en start_time:', hora)
    return formatTime(hora)
  }
  
  // Intento 4: next_scheduled_time
  if (rutina.next_scheduled_time) {
    const hora = rutina.next_scheduled_time
    console.log('✅ Hora encontrada en next_scheduled_time:', hora)
    return hora
  }
  
  console.warn('⚠️ No se encontró hora en la rutina:', rutina)
  return 'Sin hora'
}

// Función auxiliar para formatear hora HH:MM:SS a HH:MM
const formatTime = (timeString: string): string => {
  if (!timeString) return 'Sin hora'
  
  // Si viene como "08:00:00", extraer solo "08:00"
  if (timeString.includes(':')) {
    const parts = timeString.split(':')
    return `${parts[0]}:${parts[1]}`
  }
  
  return timeString
}

const iniciarNavegacionSegura = (rutina: any) => {
  console.log('🚀 [Navegación] Intentando iniciar ejecución:', {
    routineId: rutina.id,
    routineName: rutina.name,
    fullData: rutina
  })

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