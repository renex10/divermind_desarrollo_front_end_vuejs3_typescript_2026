<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
      <h3 class="font-bold text-gray-800">Historial de Intervenciones</h3>
      <span class="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full border">
        {{ sessions.length }} sesiones registradas
      </span>
    </div>
    
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50/50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">#</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Fecha</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Estado</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Modalidad</th>
            <th class="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Acción</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="s in sessions" :key="s.id" 
              :class="{'bg-blue-50/50': s.id === currentSessionId}"
              class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
              {{ s.session_number }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ formatDate(s.scheduled_date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(s.attendance_status)" class="px-2 py-1 rounded-full text-xs font-bold">
                {{ s.attendance_status_display || s.attendance_status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 italic">
              {{ s.modality_display || s.modality }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <button @click="$emit('select', s)" 
                      class="text-blue-600 hover:text-blue-900 font-bold text-sm">
                Ver
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type TherapySession } from '@/services/sessionService';

defineProps<{
  sessions: TherapySession[],
  currentSessionId?: number
}>();

defineEmits(['select']);

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-CL', { 
    day: '2-digit', month: 'short', year: '2-digit' 
  });
}

function getStatusClass(status: string | null) {
  const styles: Record<string, string> = {
    asistio: 'bg-green-100 text-green-700',
    pendiente: 'bg-amber-100 text-amber-700',
    cancelado_familia: 'bg-red-100 text-red-700',
  };
  return styles[status || ''] || 'bg-gray-100 text-gray-700';
}
</script>