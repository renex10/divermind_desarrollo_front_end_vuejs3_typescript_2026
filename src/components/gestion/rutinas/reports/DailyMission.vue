<template>
  <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all h-full flex flex-col relative overflow-hidden">
    
    <div v-if="isRecent" class="absolute top-6 right-8 flex items-center gap-1.5">
      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      <span class="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Actualizado</span>
    </div>

    <div class="flex items-center gap-4 mb-8">
      <div class="p-3 bg-blue-50 rounded-2xl">
        <ClipboardDocumentCheckIcon class="w-6 h-6 text-blue-600" />
      </div>
      <div>
        <h3 class="text-xl font-black text-gray-900 tracking-tight">Misión en el Hogar</h3>
        <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest">Continuidad terapéutica para Pangal</p>
      </div>
    </div>

    <div class="flex-1 space-y-6">
      
      <div class="p-5 bg-gray-50 rounded-3xl border border-gray-100 relative group">
        
        <div class="flex justify-between items-center mb-3">
          <h4 class="text-[10px] font-black text-blue-600 uppercase tracking-widest">
            Desafío de la semana
          </h4>
          
          <button 
            @click="toggleSpeech"
            class="relative flex items-center justify-center w-9 h-9 rounded-full bg-white border border-blue-100 shadow-sm text-blue-500 cursor-pointer transition-all duration-300 hover:text-blue-600 hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1"
            :class="isPlaying ? 'bg-blue-50 border-blue-200' : 'animate-soft-pulse'"
            title="Escuchar misión"
          >
            <span v-if="!isPlaying" class="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-0 group-hover:animate-ping-slow"></span>
            
            <StopIcon v-if="isPlaying" class="w-5 h-5 relative z-10" />
            <SpeakerWaveIcon v-else class="w-5 h-5 relative z-10" />
          </button>
        </div>

        <p class="text-gray-700 font-medium leading-relaxed">
          {{ missionData?.homework_assigned || 'No hay tareas asignadas para hoy.' }}
        </p>
      </div>

      <div class="flex items-start gap-3 px-2">
        <div class="mt-1">
          <SparklesIcon class="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Próximo objetivo</h4>
          <p class="text-sm text-gray-600 font-medium italic">
            "{{ missionData?.next_session_focus || 'Continuar con el plan de trabajo establecido.' }}"
          </p>
        </div>
      </div>
    </div>

    <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <FaceSmileIcon v-if="isPositive" class="w-5 h-5 text-emerald-500" />
        <FaceFrownIcon v-else class="w-5 h-5 text-blue-400" />
        <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Estado al finalizar: <span class="text-gray-900">{{ missionData?.emotional_state_display || 'Estable' }}</span>
        </span>
      </div>
      
      <p class="text-[9px] font-bold text-gray-300">
        Sincronizado: {{ formattedDate }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onUnmounted } from 'vue'
import { 
  ClipboardDocumentCheckIcon, 
  SparklesIcon, 
  FaceSmileIcon,
  FaceFrownIcon,
  SpeakerWaveIcon,
  StopIcon 
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  missionData: any
}>()

const isPlaying = ref(false)
const synthesis = window.speechSynthesis

const toggleSpeech = () => {
  if (isPlaying.value) {
    synthesis.cancel()
    isPlaying.value = false
  } else {
    const tarea = props.missionData?.homework_assigned || 'No hay tareas asignadas.'
    const objetivo = props.missionData?.next_session_focus || ''
    const textToRead = `Desafío de la semana. ${tarea}. Próximo objetivo: ${objetivo}`

    const utterance = new SpeechSynthesisUtterance(textToRead)
    utterance.lang = 'es-ES'
    utterance.rate = 0.9
    utterance.pitch = 1

    utterance.onend = () => { isPlaying.value = false }
    utterance.onerror = () => { isPlaying.value = false }

    synthesis.speak(utterance)
    isPlaying.value = true
  }
}

onUnmounted(() => {
  if (synthesis.speaking) synthesis.cancel()
})

const formattedDate = computed(() => {
  if (!props.missionData?.session_date) return '--/--'
  return new Date(props.missionData.session_date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short'
  })
})

const isRecent = computed(() => {
  if (!props.missionData?.session_date) return false
  const sessionDate = new Date(props.missionData.session_date)
  const today = new Date()
  return sessionDate.toDateString() === today.toDateString()
})

const isPositive = computed(() => {
  const state = props.missionData?.emotional_state_display?.toLowerCase()
  return state === 'calmo' || state === 'estable' || state === 'feliz'
})
</script>

<style scoped>
/* Animación personalizada de pulso suave (respiración) */
@keyframes soft-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
  50% { transform: scale(1.08); box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
}

.animate-soft-pulse {
  animation: soft-pulse 3s infinite ease-in-out;
}

/* Animación de ping más lenta para el efecto de onda al pasar el mouse */
@keyframes ping-slow {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}
.group-hover\:animate-ping-slow {
  animation: ping-slow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>