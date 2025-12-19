<template>
  <div class="relative group">
    <div class="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
    
    <div class="relative bg-white border border-purple-100 rounded-xl shadow-sm overflow-hidden">
      <div class="bg-gradient-to-r from-purple-50 via-white to-blue-50 px-6 py-4 border-b border-purple-100 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="bg-purple-600 p-2 rounded-lg shadow-lg text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-purple-900 uppercase tracking-tight">Asistente de Planificación</h3>
            <p class="text-[10px] text-purple-500 font-bold uppercase tracking-widest">DiverMind AI Engine</p>
          </div>
        </div>

        <button 
          type="button" 
          @click="$emit('generar')"
          :disabled="loading"
          class="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          <span v-if="!loading">Generar Propuestas</span>
          <span v-else class="flex items-center gap-2">
            <svg class="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analizando...
          </span>
        </button>
      </div>

      <transition name="fade-slide">
        <div v-if="draftFocus || draftRecommendations" class="p-6 space-y-6 bg-white">
          
          <div v-if="draftFocus" class="pl-4 border-l-4 border-amber-400 bg-amber-50/50 p-4 rounded-r-lg">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h4 class="text-xs font-black text-amber-800 uppercase tracking-wide">Foco Terapéutico (Para ti)</h4>
              </div>
              
              <button 
                type="button"
                @click="$emit('edit-focus')" 
                class="p-1 text-amber-600 hover:bg-amber-100 rounded-md transition-colors"
                title="Editar propuesta clínica"
              >
                <PencilSquareIcon class="h-4 w-4" />
              </button>
            </div>
            <p class="text-sm text-gray-700 leading-relaxed italic">"{{ draftFocus }}"</p>
            <div class="mt-3 flex justify-end">
              <button 
                type="button" 
                @click="$emit('aplicar-foco')" 
                class="text-[10px] bg-amber-600 text-white px-3 py-1 rounded font-bold hover:bg-amber-700 uppercase transition-all shadow-sm active:translate-y-px"
              >
                Aplicar Foco
              </button>
            </div>
          </div>

          <div v-if="draftRecommendations" class="pl-4 border-l-4 border-emerald-400 bg-emerald-50/50 p-4 rounded-r-lg">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <h4 class="text-xs font-black text-emerald-800 uppercase tracking-wide">Recomendación Familiar (Para Hogar)</h4>
              </div>

              <button 
                type="button"
                @click="$emit('edit-recommendations')" 
                class="p-1 text-emerald-600 hover:bg-emerald-100 rounded-md transition-colors"
                title="Editar propuesta para familia"
              >
                <PencilSquareIcon class="h-4 w-4" />
              </button>
            </div>
            <p class="text-sm text-gray-700 leading-relaxed italic">"{{ draftRecommendations }}"</p>
            <div class="mt-3 flex justify-end">
              <button 
                type="button" 
                @click="$emit('aplicar-familia')" 
                class="text-[10px] bg-emerald-600 text-white px-3 py-1 rounded font-bold hover:bg-emerald-700 uppercase transition-all shadow-sm active:translate-y-px"
              >
                Aplicar a Familia
              </button>
            </div>
          </div>

          <div class="flex justify-center pt-2 border-t border-gray-100">
            <button 
              type="button" 
              @click="$emit('descartar')" 
              class="text-[10px] text-gray-400 hover:text-red-500 font-bold uppercase tracking-widest transition-colors"
            >
              × Descartar Todo
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PencilSquareIcon } from '@heroicons/vue/24/outline'

defineProps<{
  loading: boolean;
  draftFocus: string;
  draftRecommendations: string;
}>();

defineEmits([
  'generar', 
  'aplicar-foco', 
  'aplicar-familia', 
  'descartar',
  'edit-focus',
  'edit-recommendations'
]);
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>