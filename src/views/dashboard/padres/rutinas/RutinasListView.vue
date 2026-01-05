<template>
  <div class="routines-list-padre p-4">
    
    <div v-if="loading" class="flex justify-center py-10">
      <div class="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="rutina in routines" 
        :key="rutina.id" 
        class="rounded-3xl p-6 border shadow-sm transition-all duration-200"
        :class="isCompleted(rutina.id) ? 'bg-green-50/40 border-green-200' : 'bg-white border-gray-100 hover:shadow-md'"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="flex flex-col gap-2">
            <span class="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-full w-max">
              {{ rutina.routine_type_display }}
            </span>
            <span :class="['text-[10px] font-bold px-2 py-1 rounded-lg w-max', rutina.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500']">
              {{ rutina.is_active ? 'ACTIVA' : 'PAUSADA' }}
            </span>
          </div>

          <span 
            v-if="isCompleted(rutina.id)" 
            class="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-lg border border-green-200"
          >
            <CheckCircleIcon class="w-3 h-3" />
            LISTO HOY
          </span>
        </div>
        
        <h3 class="text-lg font-black text-gray-900 mb-2">{{ rutina.name }}</h3>
        <p class="text-gray-500 text-xs line-clamp-2 mb-6">{{ rutina.description }}</p>

        <div class="flex items-center justify-between border-t border-gray-50 pt-4">
          <span class="text-[10px] text-gray-400 font-bold uppercase">{{ rutina.total_steps }} Pasos</span>
          
          <router-link 
            :to="{ name: 'parent-rutina-ejecutar', params: { routineId: rutina.id } }"
            class="p-2 rounded-xl transition-colors shadow-sm"
            :class="isCompleted(rutina.id) 
              ? 'bg-white text-green-600 border border-green-200 hover:bg-green-50' 
              : 'bg-blue-600 text-white hover:bg-blue-700'"
          >
            <component :is="isCompleted(rutina.id) ? PencilSquareIcon : PlayIcon" class="w-4 h-4" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { PlayIcon, CheckCircleIcon, PencilSquareIcon } from '@heroicons/vue/24/solid'
import { useRoutinesStore } from '@/store/rutinas/routinesStore'
import { useNinoActivoStore } from '@/store/ninoActivoStore'

// No asignamos props a una variable porque no la usamos en el script
defineProps<{
  routines: any[],
  loading: boolean
}>()

const routinesStore = useRoutinesStore()
const ninoStore = useNinoActivoStore()

// ✅ Lógica de completado
const isCompleted = (routineId: number) => {
  return routinesStore.completedTodayIds.includes(routineId)
}

// ✅ Aseguramos que el store tenga la info actualizada al montar esta vista también
onMounted(async () => {
  if (ninoStore.ninoActivoId) {
    await routinesStore.fetchPendingRoutines(ninoStore.ninoActivoId)
  }
})
</script>