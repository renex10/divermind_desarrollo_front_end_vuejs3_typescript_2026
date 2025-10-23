<template>
  <header class="header-container">
    <div class="header-content">
      <!-- Icono y Título -->
      <div class="header-title-group">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h1 class="main-title">
            Documentando Sesión #{{ sessionNumber }}
          </h1>
          <p class="sub-title">
            para <span class="font-semibold text-gray-800">{{ childName }}</span>
            <span v-if="childRut" class="text-gray-600 ml-2">({{ childRut }})</span>
          </p>
          
          <!-- NUEVA INFORMACIÓN ADICIONAL -->
          <div class="additional-info" v-if="showAdditionalInfo && hasAdditionalData">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Apoderado:</span>
                <span class="info-value">{{ guardianName || 'No especificado' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Ingreso PIE:</span>
                <span class="info-value">{{ formatDate(entryDate) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Total sesiones:</span>
                <span class="info-value">{{ totalSessions }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón de Acción -->
      <button class="back-button" @click="$emit('volver')">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
        </svg>
        <span>Volver al Perfil</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Props actualizadas para recibir todos los datos del serializer
interface Props {
  childName: string;
  sessionNumber: number;
  childRut?: string;
  guardianName?: string;
  entryDate?: string;
  totalSessions?: number;
  showAdditionalInfo?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  childRut: '',
  guardianName: '',
  entryDate: '',
  totalSessions: 0,
  showAdditionalInfo: true
});

defineEmits<{
  (e: 'volver'): void;
}>();

// Computed para verificar si hay datos adicionales para mostrar
const hasAdditionalData = computed(() => {
  return props.guardianName || props.entryDate || props.totalSessions > 0;
});

// Función auxiliar para formatear fecha
const formatDate = (dateString?: string) => {
  if (!dateString) return 'No especificado';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return 'Fecha inválida';
  }
};
</script>

<style scoped>
.header-container {
  @apply w-full bg-white border-b border-gray-200 shadow-sm;
}
.header-content {
  @apply max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex justify-between items-center;
}
.header-title-group {
  @apply flex items-center gap-4;
}
.icon-wrapper {
  @apply hidden sm:flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100;
}
.main-title {
  @apply text-xl sm:text-2xl font-bold text-gray-900;
}
.sub-title {
  @apply text-sm text-gray-500 mt-1;
}
.additional-info {
  @apply mt-3;
}
.info-grid {
  @apply flex flex-wrap gap-4 sm:gap-6;
}
.info-item {
  @apply flex items-center gap-2;
}
.info-label {
  @apply text-xs font-medium text-gray-500;
}
.info-value {
  @apply text-xs font-semibold text-gray-700;
}
.back-button {
  @apply inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .header-content {
    @apply flex-col items-start gap-4;
  }
  
  .header-title-group {
    @apply w-full;
  }
  
  .back-button {
    @apply self-end;
  }
  
  .info-grid {
    @apply flex-col gap-2;
  }
}
</style>