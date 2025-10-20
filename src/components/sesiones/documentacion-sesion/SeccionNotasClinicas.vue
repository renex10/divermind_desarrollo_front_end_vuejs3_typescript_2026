<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        Notas Clínicas y Observaciones
      </h3>
    </div>
    <div class="card-body">
      <div class="form-grid">
        <!-- Estado Emocional al Inicio -->
        <FormKit
          type="textarea"
          name="emotional_state_start"
          label="Estado Emocional al Inicio"
          placeholder="Describe cómo llegó el niño a la sesión: ánimo, disposición, comportamiento..."
          rows="4"
        />

        <!-- Estado Emocional al Finalizar -->
        <FormKit
          type="textarea"
          name="emotional_state_end"
          label="Estado Emocional al Finalizar"
          placeholder="Describe cómo terminó la sesión el niño: cambios observados, respuesta emocional..."
          rows="4"
        />

        <!-- Fortalezas Observadas -->
        <FormKit
          type="textarea"
          name="strengths_observed"
          label="Fortalezas Observadas"
          placeholder="Menciona aspectos positivos, recursos del niño, logros espontáneos..."
          rows="4"
        />

        <!-- Dificultades Encontradas -->
        <FormKit
          type="textarea"
          name="challenges_encountered"
          label="Dificultades Encontradas"
          placeholder="Describe barreras, resistencias o contratiempos durante la sesión..."
          rows="4"
        />

        <!-- Observaciones Generales -->
        <FormKit
          type="textarea"
          name="observations"
          label="Observaciones Generales"
          placeholder="Anota cualquier otra observación relevante que no encaje en las otras categorías."
          rows="5"
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
