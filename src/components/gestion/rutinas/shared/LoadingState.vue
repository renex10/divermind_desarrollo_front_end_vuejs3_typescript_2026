<template>
  <div class="flex flex-col items-center justify-center text-center p-4">
    <svg 
      class="animate-spin h-10 w-10 text-primary-600" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        class="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        stroke-width="4"
      ></circle>
      <path 
        class="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>

    <p class="mt-3 text-sm font-medium text-gray-600">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
// === PROPS ===
// Define la propiedad 'message' que el componente aceptará
withDefaults(defineProps<{
  /**
   * El texto que se muestra debajo del spinner.
   */
  message?: string 
}>(), {
  // Valor por defecto si no se proporciona el mensaje
  message: 'Cargando...', 
})
</script>

<style scoped>
/* No se necesitan estilos adicionales si usas Tailwind */
</style>