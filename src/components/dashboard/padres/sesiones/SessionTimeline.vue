<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 class="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
      <span>🚀</span> Resumen de la Aventura de Hoy
    </h3>

    <div v-if="loading" class="space-y-4 animate-pulse">
      <div v-for="i in 3" :key="i" class="flex gap-4">
        <div class="w-12 h-12 rounded-full bg-gray-200 shrink-0"></div>
        <div class="flex-1 space-y-2 py-1">
          <div class="h-4 bg-gray-200 rounded w-1/4"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>

    <div v-else class="relative pl-4 sm:pl-6 space-y-8">
      
      <div class="absolute top-2 left-[27px] sm:left-[35px] h-[calc(100%-24px)] w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-transparent -z-0"></div>

      <div 
        v-for="(event, index) in events" 
        :key="index"
        class="relative flex items-start group"
      >
        <div 
          class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-4 border-white shadow-md shrink-0 z-10 transition-transform duration-300 group-hover:scale-110"
          :class="getCategoryColor(event.category)"
        >
          <span class="text-xs sm:text-sm">{{ getCategoryIcon(event.category) }}</span>
        </div>

        <div class="ml-4 sm:ml-6 bg-gray-50 hover:bg-white rounded-lg p-3 sm:p-4 border border-transparent hover:border-gray-200 hover:shadow-md transition-all duration-300 w-full">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
            <h4 class="font-bold text-gray-800 text-sm sm:text-base">
              {{ event.title }}
            </h4>
            <span class="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-500 uppercase tracking-wider self-start sm:self-auto">
              {{ event.time_label || `Paso ${index + 1}` }}
            </span>
          </div>
          
          <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {{ event.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

interface TimelineEvent {
  time_label: string
  title: string
  description: string
  category: 'EMOCION' | 'LOGRO' | 'JUEGO' | 'DESAFIO' | string
}

// Definición de props
defineProps<{
  events: TimelineEvent[]
  loading?: boolean
}>()

// Configuración visual según la categoría
const getCategoryColor = (category: string) => {
  const map: Record<string, string> = {
    'EMOCION': 'bg-rose-100 text-rose-600',
    'LOGRO': 'bg-amber-100 text-amber-600',
    'JUEGO': 'bg-blue-100 text-blue-600',
    'DESAFIO': 'bg-purple-100 text-purple-600'
  }
  return map[category] || 'bg-gray-100 text-gray-600'
}

const getCategoryIcon = (category: string) => {
  const map: Record<string, string> = {
    'EMOCION': '❤️',
    'LOGRO': '⭐',
    'JUEGO': '🎨',
    'DESAFIO': '💪'
  }
  return map[category] || '📍'
}
</script>