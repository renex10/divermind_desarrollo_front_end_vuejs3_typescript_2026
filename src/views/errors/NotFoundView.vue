<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-900">404</h1>
      <p class="text-2xl font-medium text-gray-600 mt-4">Página no encontrada</p>
      <p class="text-gray-500 mt-2">Lo sentimos, no pudimos encontrar la página que estás buscando.</p>
      <router-link 
        to="/" 
        class="mt-6 inline-block px-4 py-2 bg-[#132441] text-white rounded-md hover:bg-[#3c5690] transition-colors"
      >
        Volver al inicio
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>