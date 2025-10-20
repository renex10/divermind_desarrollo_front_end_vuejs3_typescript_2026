<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Estado y Asistencia
      </h3>
    </div>
    <div class="card-body">
      <div class="form-grid">
        <!-- Estado de la Asistencia -->
        <FormKit
          type="select"
          name="attendance_status"
          label="Estado de la Asistencia"
          placeholder="Selecciona un estado"
          :options="attendanceOptions"
          help="Registra si el niño asistió, se ausentó o si la sesión fue cancelada."
        />

        <!-- Motivo de Cancelación (Condicional) -->
        <!-- Este campo solo aparece si se selecciona un estado de cancelación -->
        <FormKit
          type="textarea"
          name="cancellation_reason"
          label="Motivo de Cancelación/Ausencia"
          placeholder="Describe brevemente el motivo..."
          rows="3"
          v-if="attendanceStatus && (attendanceStatus.includes('ausente') || attendanceStatus.includes('cancelado'))"
          help="Aplica para ausencias o cancelaciones."
        />

        <!-- Fecha y Hora Real -->
        <FormKit
          type="datetime-local"
          name="actual_date"
          label="Fecha y Hora de Realización"
          help="La fecha y hora exacta en que se realizó la sesión. Se llena automáticamente si el estado es 'Asistió'."
        />

        <!-- Duración en Minutos -->
        <FormKit
          type="number"
          name="duration_minutes"
          label="Duración Real (minutos)"
          help="Duración final de la sesión en minutos."
          validation="number|min:0"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Opciones para el campo de selección, basadas en el modelo de Django.
const attendanceOptions = [
  { value: 'asistio', label: 'Asistió' },
  { value: 'ausente_justificado', label: 'Ausente (Justificado)' },
  { value: 'ausente_sin_aviso', label: 'Ausente (Sin Aviso)' },
  { value: 'cancelado_terapeuta', label: 'Cancelado por Terapeuta' },
  { value: 'cancelado_familia', label: 'Cancelado por Familia' },
  { value: 'reprogramado', label: 'Reprogramado' },
  { value: 'suspendido', label: 'Suspendido' },
];

import { ref } from 'vue';

// Estado reactivo para el estado de asistencia
const attendanceStatus = ref<string | null>(null);

// Este componente es "tonto" (presentacional).
// No necesita lógica propia, ya que FormKit maneja el estado del formulario
// y la lógica condicional directamente en el template.
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow border border-gray-200;
}
.card-header {
  @apply p-4 border-b border-gray-200;
}
.card-title {
  @apply text-lg font-semibold text-gray-800 flex items-center gap-3;
}
.card-body {
  @apply p-4 md:p-6;
}
.form-grid {
  @apply grid grid-cols-1 gap-y-4;
}
</style>

