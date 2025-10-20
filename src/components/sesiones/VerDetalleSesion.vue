<template>
  <BaseModal
    :show="props.show"
    @close="handleClose"
    :title="`Detalles de la Sesión #${sessionData.session_number}`"
    size="lg"
  >
    <div v-if="sessionData" class="details-container">
      <!-- Sección de Información General -->
      <div class="section">
        <h3 class="section-title">Información General</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailItem label="Niño" :value="sessionData.child_name || 'No especificado'" />
          <DetailItem label="Fecha Programada" :value="formatDate(sessionData.scheduled_date)" />
          <DetailItem label="Fecha Realización" :value="formatDate(sessionData.actual_date) || 'No realizada'" />
          <DetailItem label="Duración" :value="`${sessionData.duration_minutes || 'N/A'} min`" />
          <DetailItem label="Tipo" :value="sessionData.session_type" />
          <DetailItem label="Modalidad" :value="sessionData.modality" />
        </div>
      </div>

      <!-- Sección de Estado y Asistencia -->
      <div class="section">
        <h3 class="section-title">Estado y Asistencia</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p class="detail-label">Estado</p>
            <span
              class="px-3 py-1 text-sm font-medium rounded-full"
              :class="getStatusClass(sessionData.attendance_status)"
            >
              {{ getStatusLabel(sessionData.attendance_status) }}
            </span>
          </div>
          <DetailItem v-if="sessionData.cancellation_reason" label="Motivo de Cancelación" :value="sessionData.cancellation_reason" />
        </div>
      </div>

      <!-- Sección de Objetivos y Notas -->
      <div class="section">
        <h3 class="section-title">Objetivos y Notas Principales</h3>
        <div class="space-y-4">
          <DetailTextarea label="Objetivos de la Sesión" :content="sessionData.objectives" />
          <DetailTextarea label="Observaciones Generales" :content="sessionData.observations" />
          <DetailTextarea label="Fortalezas Observadas" :content="sessionData.strengths_observed" />
          <DetailTextarea label="Dificultades Encontradas" :content="sessionData.challenges_encountered" />
        </div>
      </div>
    </div>

    <!-- Footer del Modal -->
    <template #footer>
      <div class="flex justify-end">
        <button
          @click="handleClose"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Cerrar
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue';
import BaseModal from '@/components/modal/BaseModal.vue';

// --- PROPS Y EMITS ---
const props = defineProps<{
  show: boolean;
  sessionData: any; // Idealmente, deberías usar tu interfaz TherapySession aquí
}>();

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
}>();

// --- COMPONENTES INTERNOS ---
// Pequeños componentes para mantener el template limpio
const DetailItem = defineComponent({
  props: ['label', 'value'],
  template: `
    <div>
      <p class="detail-label">{{ label }}</p>
      <p class="detail-value">{{ value }}</p>
    </div>
  `
});

const DetailTextarea = defineComponent({
  props: ['label', 'content'],
  template: `
    <div>
      <p class="detail-label">{{ label }}</p>
      <p class="detail-textarea">{{ content || 'No registrado' }}</p>
    </div>
  `
});

// --- MÉTODOS ---
function handleClose() {
  emit('update:show', false);
}

// --- UTILIDADES (duplicadas de la vista padre para consistencia) ---
function getStatusClass(status: string) {
  const classes: { [key: string]: string } = {
    asistio: 'bg-green-100 text-green-800',
    pendiente: 'bg-yellow-100 text-yellow-800',
    cancelado_familia: 'bg-red-100 text-red-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
}

function getStatusLabel(status: string) {
  const labels: { [key: string]: string } = {
    asistio: 'Asistió',
    pendiente: 'Pendiente',
    cancelado_familia: 'Cancelada'
  };
  return labels[status] || status || 'No definido';
}

function formatDate(date: string) {
  if (!date) return null;
  return new Date(date).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>

<style scoped>
.details-container {
  @apply space-y-6;
}
.section {
  @apply pb-4 border-b border-gray-200;
}
.section:last-child {
  @apply border-b-0 pb-0;
}
.section-title {
  @apply text-lg font-semibold text-gray-800 mb-3;
}
.detail-label {
  @apply text-sm font-medium text-gray-500 mb-1;
}
.detail-value {
  @apply text-base text-gray-800;
}
.detail-textarea {
  @apply text-base text-gray-800 bg-gray-50 p-3 rounded-md border border-gray-200 whitespace-pre-wrap;
}
</style>