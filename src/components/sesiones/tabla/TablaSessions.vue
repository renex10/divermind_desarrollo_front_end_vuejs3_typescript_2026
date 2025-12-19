<template>
  <div class="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
    <table class="min-w-full divide-y divide-gray-200 text-left">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            # Sesión
          </th>
          <th scope="col" class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Niño
          </th>
          <th scope="col" class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Fecha
          </th>
          <th scope="col" class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Duración
          </th>
          <th scope="col" class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
            Estado
          </th>
          <th scope="col" class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr 
          v-for="session in sessions" 
          :key="session.id"
          class="hover:bg-blue-50/50 transition-colors duration-150"
        >
          <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
            {{ session.session_number }}
          </td>

          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900 font-medium">{{ session.child_name || 'No asignado' }}</div>
            <div class="text-xs text-gray-400">ID: {{ session.child }}</div>
          </td>

          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
            {{ formatDate(session.scheduled_date) }}
          </td>

          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
            <span class="flex items-center">
              <svg class="h-4 w-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {{ session.duration_minutes }}'
            </span>
          </td>

          <td class="px-6 py-4 whitespace-nowrap text-center">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
              :class="getStatusStyle(session.attendance_status)"
            >
              {{ getStatusLabel(session.attendance_status) }}
            </span>
          </td>

          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div class="flex justify-end space-x-3">
              <button 
                @click="$emit('view', session)"
                class="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100 transition-colors"
                title="Ver Detalles"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </button>
              <button 
                @click="$emit('document', session)"
                class="text-emerald-600 hover:text-emerald-900 p-1 rounded hover:bg-emerald-100 transition-colors"
                title="Documentar Sesión"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { type TherapySession } from '@/services/sessionService';

defineProps<{
  sessions: TherapySession[]
}>();

defineEmits(['view', 'document']);

// --- Lógica Estética Centralizada ---
function getStatusStyle(status: string | null) {
  const styles: Record<string, string> = {
    asistio: 'bg-green-50 text-green-700 border-green-200',
    pendiente: 'bg-amber-50 text-amber-700 border-amber-200',
    cancelado_familia: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  return styles[status || 'pendiente'] || 'bg-gray-50 text-gray-700 border-gray-200';
}

function getStatusLabel(status: string | null) {
  const labels: Record<string, string> = {
    asistio: 'Asistió',
    pendiente: 'Pendiente',
    cancelado_familia: 'Cancelada',
  };
  return labels[status || 'pendiente'] || 'No definido';
}

function formatDate(dateStr: string) {
  if (!dateStr) return '---';
  return new Date(dateStr).toLocaleDateString('es-CL', { 
    day: '2-digit', 
    month: 'short', 
    year: '2-digit' 
  });
}
</script>