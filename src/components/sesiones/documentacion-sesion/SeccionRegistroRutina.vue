<template>
  <div class="card overflow-hidden">
    <div class="card-header bg-indigo-50/50">
      <h3 class="card-title text-indigo-900">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        Registro de Ejecución de Rutina (Granularidad)
      </h3>
    </div>

    <div class="card-body p-0">
      <div v-if="loading" class="p-8 text-center text-gray-500">
        <div class="animate-spin h-6 w-6 border-b-2 border-indigo-600 rounded-full mx-auto mb-2"></div>
        Cargando pasos de la rutina activa...
      </div>

      <div v-else-if="steps.length === 0" class="p-8 text-center text-gray-500 italic">
        No se encontró una rutina activa para registrar en esta sesión.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Paso</th>
              <th class="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Logrado</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nivel de Apoyo</th>
              <th class="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Fricción</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tiempo Real</th>
              <th class="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Observación</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <template v-for="step in steps" :key="step.id">
              <tr class="hover:bg-blue-50/30 transition-colors">
                <td class="px-4 py-4">
                  <div class="text-sm font-bold text-gray-900">{{ step.action }}</div>
                  <div class="text-xs text-gray-500 italic">Est: {{ step.estimated_minutes }} min.</div>
                </td>

                <td class="px-4 py-4 text-center">
                  <input 
                    type="checkbox" 
                    v-model="performance[step.id].completed"
                    class="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  >
                </td>

                <td class="px-4 py-4">
                  <select 
                    v-model="performance[step.id].support_needed"
                    class="text-xs border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 w-full"
                  >
                    <option value="none">Independiente</option>
                    <option value="verbal">Apoyo Verbal</option>
                    <option value="visual">Apoyo Visual</option>
                    <option value="physical">Apoyo Físico</option>
                    <option value="full">Asistencia Total</option>
                  </select>
                </td>

                <td class="px-4 py-4 text-center">
                  <button 
                    @click="performance[step.id].had_difficulty = !performance[step.id].had_difficulty"
                    :class="performance[step.id].had_difficulty ? 'bg-red-100 text-red-600 border-red-200 scale-110 shadow-sm' : 'bg-gray-100 text-gray-400 border-gray-200'"
                    class="p-1.5 rounded-full border transition-all duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </td>

                <td class="px-4 py-4">
                  <div class="flex items-center gap-2">
                    <input 
                      type="number" 
                      v-model.number="performance[step.id].time_taken_seconds"
                      class="w-20 text-xs border-gray-300 rounded-md focus:ring-indigo-500"
                      placeholder="0"
                    >
                    <span class="text-[10px] text-gray-400 font-bold uppercase">Seg</span>
                  </div>
                </td>

                <td class="px-4 py-4 text-center relative">
                  <button 
                    @click="toggleNote(step.id)"
                    :class="[
                      performance[step.id].notes ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-600',
                      !performance[step.id].notes ? 'animate-pulse-custom shadow-pulse' : ''
                    ]"
                    class="p-2 rounded-lg border border-amber-300 transition-all duration-300 hover:scale-110"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                    </svg>
                  </button>
                </td>
              </tr>
              
              <tr v-if="activeNoteId === step.id" class="bg-amber-50/50">
                <td colspan="6" class="px-4 py-3">
                  <div class="flex flex-col gap-2 animate-fadeIn">
                    <label class="text-[10px] font-bold text-amber-700 uppercase">Observación cualitativa (Para la IA):</label>
                    <textarea 
                      v-model="performance[step.id].notes"
                      class="w-full text-sm border-amber-200 rounded-md focus:ring-amber-500 focus:border-amber-500 p-2 shadow-inner"
                      placeholder="Ej: Se observó distracción visual por estímulo externo o mayor resistencia al cambio de actividad..."
                      rows="2"
                    ></textarea>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import http from '@/services/http';
import { type RoutineStep } from '@/services/sessionService';

const props = defineProps<{
  childId: number;
  sessionId: number;
}>();

const loading = ref(true);
const steps = ref<RoutineStep[]>([]);
const performance = reactive<Record<number, any>>({});
const activeNoteId = ref<number | null>(null);

onMounted(async () => {
  try {
    const { data } = await http.get(`/seguimiento/ninos/${props.childId}/rutinas/activa/`);
    
    if (data && data.steps) {
      steps.value = data.steps;
      steps.value.forEach((step: RoutineStep) => {
        performance[step.id] = {
          step_id: step.id,
          step_action: step.action,
          completed: false,
          had_difficulty: false,
          support_needed: 'none',
          time_taken_seconds: null,
          notes: ''
        };
      });
    }
  } catch (error) {
    console.error("Error al cargar pasos:", error);
  } finally {
    loading.value = false;
  }
});

const toggleNote = (id: number) => {
  activeNoteId.value = activeNoteId.value === id ? null : id;
};

/**
 * EXPOSICIÓN PARA IA: Envía datos incluyendo las nuevas notas cualitativas.
 */
const getPerformanceData = () => {
  return Object.values(performance).map(p => ({
    step_id: p.step_id,
    step_action: p.step_action,
    support_needed: p.support_needed,
    time_seconds: p.time_taken_seconds || 0,
    had_difficulty: p.had_difficulty,
    notes: p.notes // Crítico para el Requerimiento de Sugerencias Personalizadas
  }));
};

/**
 * GUARDADO FINAL: Envía el lote masivo al StepCompletionCreateSerializer.
 */
const savePerformance = async () => {
  if (steps.value.length === 0) return;
  const payload = {
    session_id: props.sessionId,
    step_completions: Object.values(performance)
  };
  await http.post(`/seguimiento/sesiones/${props.sessionId}/registrar-pasos/`, payload);
};

defineExpose({ getPerformanceData, savePerformance });
</script>

<style scoped>
.card { @apply bg-white rounded-xl shadow-sm border border-gray-200; }
.card-header { @apply p-4 border-b border-gray-200; }
.card-title { @apply text-lg font-bold flex items-center gap-3; }

/* Animación de Pulso personalizada para llamar la atención */
@keyframes pulse-magnify {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 8px rgba(245, 158, 11, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
}

.animate-pulse-custom {
  animation: pulse-magnify 2s infinite ease-in-out;
}

.shadow-pulse {
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>