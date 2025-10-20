<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
        Intervenciones y Técnicas Aplicadas
      </h3>
    </div>
    <div class="card-body">
      <div class="form-grid">
        <!-- Técnicas y Estrategias Aplicadas -->
        <FormKit
          type="textarea"
          name="techniques_applied"
          label="Técnicas y Estrategias Aplicadas"
          placeholder="Ej: Se utilizó modelado para enseñar el saludo y técnicas de respiración para la autorregulación."
          rows="5"
          help="Describe las metodologías, abordajes terapéuticos o intervenciones específicas que utilizaste."
        />

        <!-- Materiales y Recursos Utilizados -->
        <FormKit
          type="textarea"
          name="materials_used"
          label="Materiales y Recursos Utilizados"
          placeholder="Ej: Bloques de construcción, pictogramas de emociones, pelota de terapia."
          rows="5"
          help="Menciona los juegos, instrumentos, herramientas terapéuticas o tecnología usada en la sesión."
        />

        <!-- Intervenciones en Crisis Aplicadas -->
        <FormKit
          type="textarea"
          name="crisis_interventions"
          label="Intervenciones en Crisis (Si aplica)"
          placeholder="Ej: Se aplicó el protocolo de contención verbal, se retiraron estímulos estresantes y se guio al niño a un espacio de calma."
          rows="5"
          help="Si hubo una situación crítica o desregulación, describe las intervenciones específicas que se llevaron a cabo."
          outer-class="col-span-1 sm:col-span-2"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Este componente es "tonto" (presentacional).
// No necesita lógica propia, ya que FormKit maneja el estado del formulario
// a través del v-model en el componente padre (DocumentarSesionView.vue).
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
  @apply grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2;
}
</style>
