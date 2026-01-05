<template>
  <div 
    v-if="isLoading"
    class="relative overflow-hidden rounded-[2rem] bg-gray-50 p-6 shadow-sm border border-gray-100 animate-pulse"
  >
    <div class="flex items-center gap-2.5 mb-5">
      <div class="h-9 w-9 bg-gray-200 rounded-full"></div>
      <div class="h-6 w-40 bg-gray-200 rounded"></div>
    </div>
    <div class="bg-white rounded-2xl p-4 flex items-start gap-4 border border-gray-100 mb-4">
      <div class="h-10 w-10 bg-gray-200 rounded-xl"></div>
      <div class="flex flex-col gap-2 w-full">
        <div class="h-8 w-3/4 bg-gray-200 rounded"></div>
        <div class="h-6 w-1/2 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>

  <div 
    v-else-if="latestUpdate"
    class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-100 p-6 shadow-sm transition-all duration-300 hover:shadow-md border border-blue-100/50"
  >
    <div class="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-blue-200/40 blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-teal-200/40 blur-2xl pointer-events-none"></div>

    <div class="relative z-10 flex flex-col gap-5">
      
      <div class="flex items-center gap-2.5">
        <div class="bg-white/80 p-2 rounded-full shadow-sm text-teal-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
            <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
            <path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 17.25 3v1.5h1.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-13.5A1.125 1.125 0 0 1 4 15.375v-9.75c0-.621.504-1.125 1.125-1.125H6.5V3a.75.75 0 0 1 .75-.75Zm0 5.25h-.75a.375.375 0 0 0-.375.375v9.75c0 .207.168.375.375.375h13.5a.375.375 0 0 0 .375-.375v-9.75a.375.375 0 0 0-.375-.375H17.25v1.5a.75.75 0 0 1-1.5 0v-1.5h-9v1.5a.75.75 0 0 1-1.5 0v-1.5Z" clip-rule="evenodd" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-teal-900 tracking-tight">
          Próxima Sesión Agendada
        </h3>
      </div>

      <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-4 flex items-start gap-4 border border-white/50 shadow-sm">
        <div class="bg-blue-100 p-3 rounded-xl shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-blue-600">
            <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="flex flex-col">
          <span class="text-2xl sm:text-3xl font-black text-blue-900 capitalize leading-tight">
            {{ dateParts.date }}
          </span>
          <span class="text-xl sm:text-2xl font-bold text-blue-600 mt-1">
            {{ dateParts.time }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2 ml-1">
        <div class="bg-teal-100/50 p-1.5 rounded-full text-teal-700">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
            <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1 1.5 0c.217.31.466.602.74.875A.75.75 0 0 1 21.75 21H2.25a.75.75 0 0 1-.74-.875c.274-.273.523-.565.74-.875Z" clip-rule="evenodd" />
          </svg>
        </div>
        <p class="text-sm font-medium text-gray-600">
          Terapeuta: 
          <span class="font-bold text-teal-800 text-base">
            {{ latestUpdate.therapist_full_name }}
          </span>
        </p>
      </div>
    </div>
  </div>

  <div 
    v-else
    class="rounded-[2rem] border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 flex flex-col items-center justify-center text-center text-gray-400 gap-3"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-gray-300">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
    <div>
      <p class="font-bold text-gray-500 text-lg">
        {{ error ? 'Sin información disponible' : 'Sin próximas citas' }}
      </p>
      <p class="text-sm">Contacta al centro para agendar.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLatestUpdate } from '@/composables/padres/useLatestUpdate'
import { useNinoActivoStore } from '@/store/ninoActivoStore'

// 1. ✅ CONEXIÓN DE DATOS REALES
const ninoStore = useNinoActivoStore()

// Obtenemos los datos reactivos del niño activo
const { latestUpdate, isLoading, error } = useLatestUpdate(() => ninoStore.ninoActivoId)

// 2. ✅ FORMATEO DE FECHA
// Transformamos la fecha ISO que viene del backend en un formato legible
const dateParts = computed(() => {
  if (!latestUpdate.value?.session_date) {
    return { date: '---', time: '--:--' }
  }

  const dateObj = new Date(latestUpdate.value.session_date)
  
  // Formateador para "Sábado, 15 de Febrero"
  const dateFormatter = new Intl.DateTimeFormat('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  // Formateador para hora "04:30 p.m."
  const timeFormatter = new Intl.DateTimeFormat('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })

  return {
    date: dateFormatter.format(dateObj),
    time: timeFormatter.format(dateObj)
  }
})
</script>