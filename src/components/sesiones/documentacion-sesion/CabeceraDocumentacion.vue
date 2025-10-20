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
          </p>
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
// Define las propiedades que este componente espera recibir de su padre.
defineProps<{
  childName: string;
  sessionNumber: number;
}>();

// Define los eventos que este componente puede emitir hacia su padre.
defineEmits<{
  (e: 'volver'): void;
}>();
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
.back-button {
  @apply inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors;
}
</style>

