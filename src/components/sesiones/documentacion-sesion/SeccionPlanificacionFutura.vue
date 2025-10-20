<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Planificación Futura
      </h3>
    </div>
    <div class="card-body">
      <div class="form-grid">
        <!-- Tareas para Casa -->
        <FormKit
          type="textarea"
          name="homework_assigned"
          label="Tareas o Actividades para Casa"
          placeholder="Ej: Practicar la identificación de emociones con las tarjetas visuales."
          rows="4"
          help="Describe cualquier ejercicio o actividad asignada al niño o la familia para realizar entre sesiones."
        />

        <!-- Recomendaciones para la Próxima Sesión -->
        <FormKit
          type="textarea"
          name="next_session_recommendations"
          label="Recomendaciones para la Próxima Sesión"
          placeholder="Ej: Traer el juguete favorito del niño para trabajar el juego compartido."
          rows="4"
          help="Anotaciones o preparativos necesarios para la siguiente sesión."
        />

        <!-- Enfoque para la Próxima Sesión -->
        <FormKit
          type="textarea"
          name="next_session_focus"
          label="Enfoque Principal para la Próxima Sesión"
          placeholder="Ej: Reforzar las habilidades de toma de turnos y la comunicación no verbal."
          rows="4"
          help="Temas pendientes, áreas a reforzar u objetivos para la siguiente intervención."
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
