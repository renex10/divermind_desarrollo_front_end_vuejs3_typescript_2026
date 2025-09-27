<template>
  <div
    v-if="visible"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white rounded-lg shadow-lg p-6 w-96">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Sesión inactiva</h2>
      <p class="text-gray-600 mb-6">
        Tu sesión se cerrará en menos de 1 minuto por inactividad.
      </p>
      <div class="flex justify-end space-x-3">
        <button
          @click="onKeepAlive"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Mantener sesión activa
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  onKeepAlive: () => void
}>()
</script>
