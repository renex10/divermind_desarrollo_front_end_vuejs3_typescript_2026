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
        class="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group"
      >
        <div class="flex justify-between items-start mb-6">
          <span class="px-4 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full">
            {{ rutina.routine_type_display }}
          </span>
          <div class="flex items-center text-gray-400 font-bold text-sm">
            <ClockIcon class="w-5 h-5 mr-1.5 text-blue-400" />
            <span>{{ rutina.schedules?.[0]?.start_time || 'Sin hora' }}</span>
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
/**
 * COMPONENTE: RutinasAgendaView (Versión Padre)
 */
import { useRouter } from 'vue-router'
import { ClockIcon, PlayIcon } from '@heroicons/vue/24/solid'

// Define las props sin asignarlas a una variable (son automáticamente disponibles en el template)
defineProps<{
  routines: any[],
  loading: boolean,
  childName: string
}>()

const router = useRouter()

// FUNCIÓN DE DEPURACIÓN
const iniciarNavegacionSegura = (rutina: any) => {
  // 1. LOG DE CONTROL
  console.log('🚀 [Navegación] Intentando iniciar ejecución:', {
    routineId: rutina.id,
    routineName: rutina.name,
    fullData: rutina
  })

  // 2. VERIFICACIÓN DE ID
  if (!rutina.id) {
    console.error('❌ ERROR: La rutina no tiene un ID válido. Redirección abortada para evitar error 404.')
    return
  }

  // 3. NAVEGACIÓN PROGRAMÁTICA
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