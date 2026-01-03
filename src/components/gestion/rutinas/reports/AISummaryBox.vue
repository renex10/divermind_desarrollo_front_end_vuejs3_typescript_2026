<template>
  <div class="bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-900 rounded-[2.5rem] shadow-xl shadow-blue-100 overflow-hidden text-white flex flex-col h-full max-h-[650px] transition-all duration-500 border border-white/5">
    
    <div class="p-6 pb-4 flex items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-md z-10">
      <div class="flex items-center space-x-3">
        <div class="p-2.5 bg-white/20 rounded-2xl ring-1 ring-white/30 shadow-inner">
          <SparklesIcon class="w-5 h-5 text-blue-100" />
        </div>
        <div>
          <h3 class="text-lg font-black leading-none tracking-tight">Reporte Analítico IA</h3>
          <p class="text-[10px] text-indigo-100 mt-1 font-bold uppercase tracking-[0.15em] opacity-80">Evidencia clínica automatizada</p>
        </div>
      </div>

      <div v-if="report" class="flex items-center space-x-3">
        <button 
          @click="toggleAudio"
          class="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all active:scale-95 group shadow-sm"
          :class="{ 'ring-2 ring-emerald-400/50 bg-white/20': isReading }"
          :title="isReading ? 'Detener audio' : 'Escuchar reporte clínico'"
        >
          <component 
            :is="isReading ? SpeakerXMarkIcon : SpeakerWaveIcon" 
            class="w-4 h-4 text-blue-100 group-hover:scale-110 transition-transform" 
          />
          <span class="text-[9px] font-black uppercase tracking-widest">
            {{ isReading ? 'Detener' : 'Escuchar' }}
          </span>
        </button>

        <div class="flex items-center space-x-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-[10px] font-black bg-white/10 border border-white/20 px-3 py-1.5 rounded-full uppercase tracking-widest">
            {{ formatDate(report.date) }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-10 custom-scrollbar relative bg-white/5">
      <div class="absolute top-0 right-0 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div v-if="loading" class="h-full flex flex-col items-center justify-center space-y-4 py-20">
        <div class="w-12 h-12 border-4 border-indigo-200/20 border-t-white rounded-full animate-spin"></div>
        <p class="text-xs font-black uppercase tracking-[0.2em] text-indigo-100">Sintetizando patrones...</p>
      </div>

      <div v-else-if="!report" class="h-full flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-white/10 rounded-[2.5rem]">
        <div class="text-4xl mb-4 opacity-20">📋</div>
        <p class="text-sm font-bold text-indigo-100/60 italic max-w-xs">
          Aún no se ha generado un análisis clínico para este periodo.
        </p>
      </div>

      <div v-else class="relative z-10">
        <div 
          class="whitespace-pre-line text-[15px] leading-relaxed font-medium text-indigo-50/95 tracking-wide antialiased selection:bg-blue-400/30"
          style="word-spacing: 0.05em;"
        >
          {{ cleanText }}
        </div>
        
        <div class="mt-12 pt-8 border-t border-white/10">
          <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 mb-5 opacity-70">Conceptos Detectados</h4>
          <div class="flex flex-wrap gap-2.5">
            <span 
              v-for="tag in report.key_insights" 
              :key="tag" 
              class="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-default"
            >
              # {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="p-5 bg-black/20 backdrop-blur-md flex items-center justify-between border-t border-white/10 flex-shrink-0">
      <div class="flex items-center space-x-2">
        <div class="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
        <p class="text-[9px] font-black uppercase tracking-widest text-indigo-200/60">
          Paciente: {{ childName }}
        </p>
      </div>
      <p class="text-[9px] font-bold text-white/40 uppercase tracking-[0.1em]">Clinical IA Engine v2.0</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { 
  SparklesIcon, 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon 
} from '@heroicons/vue/24/solid'
import type { AIReport } from '@/type/rutinas/reports'

const props = defineProps<{
  report: AIReport | null
  loading: boolean
  childName: string
}>()

// --- LÓGICA DE AUDIO (WEB SPEECH API) ---
const isReading = ref(false)
let currentUtterance: SpeechSynthesisUtterance | null = null

/**
 * Control de Audio: Reproduce o detiene la lectura del texto limpio.
 */
const toggleAudio = () => {
  if (isReading.value) {
    window.speechSynthesis.cancel()
    isReading.value = false
    return
  }

  if (cleanText.value) {
    window.speechSynthesis.cancel() // Limpia cualquier cola pendiente
    
    currentUtterance = new SpeechSynthesisUtterance(cleanText.value)
    currentUtterance.lang = 'es-CL' // Acento local para Chile
    currentUtterance.rate = 0.9     // Velocidad pausada para lectura clínica
    currentUtterance.pitch = 1;

    currentUtterance.onstart = () => { isReading.value = true }
    currentUtterance.onend = () => { isReading.value = false }
    currentUtterance.onerror = () => { isReading.value = false }

    window.speechSynthesis.speak(currentUtterance)
  }
}

// Limpiar audio si el usuario navega fuera de la vista
onUnmounted(() => {
  window.speechSynthesis.cancel()
})

// --- PROPIEDADES COMPUTADAS ---

/**
 * Limpieza del texto generado para evitar que el lector de voz
 * deletree caracteres de Markdown (como asteriscos).
 */
const cleanText = computed(() => {
  if (!props.report?.generated_text) return ''
  return props.report.generated_text
    .replace(/\*\*\*/g, '') 
    .replace(/\*\*/g, '')  
    .replace(/#/g, '')     
    .trim()
})

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'long'
  })
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.25); }

.antialiased {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>