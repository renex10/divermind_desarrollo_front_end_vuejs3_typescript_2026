<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        Notas Clínicas y Estructuración Emocional
      </h3>
    </div>
    <div class="card-body">
      <div class="form-grid">
        
        <div class="col-span-1 sm:col-span-1 space-y-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
          <label class="block text-sm font-bold text-blue-900 uppercase tracking-wider">Estado Emocional al Inicio</label>
          
          <FormKit
            type="radio"
            name="emotional_state_start"
            :options="{
              'calm': '😊 Calmo',
              'anxious': '😟 Ansioso',
              'irritable': '😠 Irritable',
              'withdrawn': '😶 Retraído',
              'stable': '🙂 Estable'
            }"
            validation="required"
            label="Categoría Inicial"
            options-class="grid grid-cols-2 gap-2"
          />

          <FormKit
            type="textarea"
            name="emotional_state_start_description"
            label="Detalle cualitativo"
            placeholder="Ej: Inicia con hipervigilancia a ruidos..."
            rows="3"
          />
        </div>

        <div class="col-span-1 sm:col-span-1 space-y-4 bg-green-50/50 p-4 rounded-xl border border-green-100">
          <label class="block text-sm font-bold text-green-900 uppercase tracking-wider">Estado Emocional al Finalizar</label>
          
          <FormKit
            type="radio"
            name="emotional_state_end"
            :options="{
              'calm': '😊 Calmo',
              'anxious': '😟 Ansioso',
              'irritable': '😠 Irritable',
              'withdrawn': '😶 Retraído',
              'stable': '🙂 Estable'
            }"
            validation="required"
            label="Categoría Final"
            options-class="grid grid-cols-2 gap-2"
          />

          <FormKit
            type="textarea"
            name="emotional_state_end_description"
            label="Detalle cualitativo"
            placeholder="Ej: Se observa autorregulación tras la rutina..."
            rows="3"
          />
        </div>

        <FormKit
          type="textarea"
          name="strengths_observed"
          label="Fortalezas Observadas"
          placeholder="Logros espontáneos, recursos del niño..."
          rows="4"
        />

        <FormKit
          type="textarea"
          name="challenges_encountered"
          label="Dificultades Encontradas"
          placeholder="Barreras, resistencias o contratiempos..."
          rows="4"
        />

        <FormKit
          type="textarea"
          name="observations"
          label="Observaciones Generales"
          placeholder="Cualquier otra observación relevante..."
          rows="5"
          outer-class="col-span-1 sm:col-span-2"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// FormKit sigue manejando el estado a través del v-model del padre.
</script>

<style scoped>
.card { @apply bg-white rounded-lg shadow border border-gray-200; }
.card-header { @apply p-4 border-b border-gray-200; }
.card-title { @apply text-lg font-semibold text-gray-800 flex items-center gap-3; }
.card-body { @apply p-4 md:p-6; }
.form-grid { @apply grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6; }

/* Personalización para los radios de emociones */
:deep(.formkit-options) {
  @apply flex flex-wrap gap-2;
}
:deep(.formkit-option) {
  @apply bg-white border border-gray-200 rounded-lg p-2 hover:border-indigo-500 cursor-pointer transition-all;
}
:deep(.formkit-input[type="radio"]:checked + .formkit-label) {
  @apply text-indigo-700 font-bold;
}
</style>