<template>
  
  <div v-if="isLoading" class="mt-6 p-4 bg-gray-50 border-l-4 border-gray-300 rounded-r-lg animate-pulse">
    <p class="text-xs font-semibold text-gray-500 uppercase">
      📢 Cargando última actualización...
    </p>
    <div class="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
    <div class="h-3 bg-gray-200 rounded w-1/4 mt-2"></div>
  </div>

  <div v-else-if="latestUpdate" class="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
    <p class="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-2">
      📢 Último mensaje del terapeuta
    </p>
    <p class="text-sm text-gray-700 leading-relaxed italic">
      "{{ latestUpdate.message }}"
    </p>
    <p class="text-xs text-gray-500 mt-2">
      - {{ latestUpdate.therapist_full_name }} (Sesión de {{ latestUpdate.child_name }})
    </p>
    <p class="text-xs text-gray-400 mt-1">
      {{ formattedDate }}
    </p>
  </div>

  <div v-else-if="error" class="mt-6 p-4 bg-gray-50 border-l-4 border-gray-400 rounded-r-lg">
    <p class="text-xs font-semibold text-gray-700 uppercase">
      📢 Actualizaciones
    </p>
    <p class="text-sm text-gray-600">
      {{ error }}
    </p>
  </div>
  
  <div v-else>
    </div>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLatestUpdate } from '@/composables/padres/useLatestUpdate'
// Tu package.json confirma que tienes 'date-fns'
import { formatDistanceToNow } from 'date-fns' 
import { es } from 'date-fns/locale'

// 1. Usar el composable para obtener los datos
const { latestUpdate, isLoading, error } = useLatestUpdate()

// 2. Crear la fecha "hace 3 horas"
const formattedDate = computed(() => {
  if (latestUpdate.value?.session_date) {
    return formatDistanceToNow(new Date(latestUpdate.value.session_date), {
      addSuffix: true, // "hace 3 horas"
      locale: es       // en español
    })
  }
  return ''
})
</script>