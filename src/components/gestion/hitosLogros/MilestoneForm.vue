<template>
    <FormKit
      type="form"
      id="hitoForm"
      :actions="false"
      @submit="$emit('submitForm', formData)" 
      v-model="formData" 
      :incomplete-message="false"
      #default="{ state: { valid } }"
    >
      <div class="bg-white rounded-xl shadow-soft border border-gray-200 overflow-hidden">
        <section>
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ editingMilestoneId ? 'Editar Hito' : 'Nuevo Hito: Información Básica' }}
            </h3>
          </div>

          <div class="px-6 py-6 space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormKit
                type="date"
                name="date"
                label="Fecha de Observación"
                validation="required"
                :validation-messages="{ required: 'La fecha es requerida' }"
              />
              <FormKit
                type="select"
                name="category"
                label="Categoría"
                placeholder="Seleccione una categoría..."
                validation="required"
                :validation-messages="{ required: 'La categoría es requerida' }"
                :options="categoryOptions"
              />
            </div>

            <FormKit
              type="textarea"
              name="description"
              label="Descripción del Hito/Habilidad"
              validation="required|length:10"
              :validation-messages="{
                required: 'La descripción es requerida',
                length: 'Debe tener al menos 10 caracteres'
              }"
              placeholder="Describe específicamente qué logró el niño..."
              :rows="4"
            />

            <FormKit
              type="textarea"
              name="observations"
              label="Observaciones Adicionales"
              placeholder="Notas sobre el contexto, facilitadores, dificultades..."
              :rows="3"
            />
          </div>
        </section>

        <section>
          <div class="px-6 py-5 border-t border-b border-gray-200 bg-gray-50">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Evaluación del Hito
            </h3>
          </div>

          <div class="px-6 py-6 space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormKit
                type="select"
                name="proficiency_level"
                label="Nivel de Dominio"
                validation="required"
                :validation-messages="{ required: 'Campo requerido' }"
                :options="proficiencyOptions"
              />
              <FormKit
                type="select"
                name="context"
                label="Contexto Observado"
                validation="required"
                :validation-messages="{ required: 'Campo requerido' }"
                :options="contextOptions"
              />
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormKit
                type="select"
                name="support_level"
                label="Nivel de Apoyo Necesario"
                validation="required"
                 :validation-messages="{ required: 'Campo requerido' }"
                :options="supportOptions"
              />
              <FormKit
                type="text"
                name="functional_impact"
                label="Impacto Funcional"
                placeholder="Ej: Le permite comer solo, participar en juegos..."
              />
            </div>
          </div>
        </section>

        <div class="px-6 py-5 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <p class="text-sm text-gray-500">
            <span class="text-red-500 font-medium">*</span> Campos requeridos
          </p>
          <div class="flex items-center space-x-3">
            <button
              v-if="editingMilestoneId"
              type="button"
              @click="$emit('cancelEdit')"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Cancelar Edición
            </button>
            <button
              type="submit"
              :disabled="isSubmitting || !valid"
              class="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ buttonText }}
            </button>
          </div>
        </div>
      </div>
    </FormKit>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { MilestoneFormData } from '@/type/hitoServiceInterface'; // Ajusta la ruta a tu type

// Define Props (recibidos desde HitosLogrosView)
const props = defineProps<{
  // v-model para FormKit: se usa modelValue para recibir, emitir 'update:modelValue' para actualizar
  initialData: MilestoneFormData; 
  editingMilestoneId: number | string | null;
  isSubmitting: boolean;
}>();

// Define Emits (eventos que enviamos a HitosLogrosView)
const emit = defineEmits<{
  (e: 'submitForm', payload: MilestoneFormData): void;
  (e: 'cancelEdit'): void;
}>();

// --- Estado del Formulario Local (necesario para FormKit v-model) ---
const formData = ref<MilestoneFormData>({ ...props.initialData });

// Sincronizar cambios externos (ej: al hacer clic en "Editar" en la vista padre)
watch(() => props.initialData, (newVal) => {
  formData.value = { ...newVal };
}, { deep: true });


// --- Opciones para los Selects (Movidas desde la vista principal) ---
const categoryOptions = [
  { label: '📢 Comunicación', value: 'communication' },
  { label: '👥 Social', value: 'social' },
  { label: '📚 Académico', value: 'academic' },
  { label: '🏃 Motor', value: 'motor' },
  { label: '🧠 Cognitivo', value: 'cognitive' },
  { label: '💝 Emocional', value: 'emotional' },
  { label: '⚕️ Terapéutico', value: 'therapeutic' }
];
const proficiencyOptions = [
  { label: '🌱 Emergente - Con mucho apoyo', value: 'emerging' },
  { label: '🌿 En desarrollo - Con apoyo moderado', value: 'developing' },
  { label: '🌳 Competente - Mínimo apoyo', value: 'proficient' },
  { label: '⭐ Dominado - Independiente', value: 'mastered' }
];
const contextOptions = [
  { label: '🏥 En terapia', value: 'therapy' },
  { label: '🏠 En casa', value: 'home' },
  { label: '🏫 En escuela', value: 'school' },
  { label: '🌍 En comunidad', value: 'community' },
  { label: '🔄 Múltiples contextos', value: 'multiple' }
];
const supportOptions = [
  { label: '✅ Independiente', value: 'independent' },
  { label: '💬 Indicación verbal', value: 'verbal_cue' },
  { label: '👁️ Apoyo visual', value: 'visual_cue' },
  { label: '🤝 Ayuda física', value: 'physical_prompt' },
  { label: '🆘 Asistencia total', value: 'full_assistance' }
];


// --- Propiedades Computadas ---
const buttonText = computed(() => {
  if (props.isSubmitting) {
    return props.editingMilestoneId ? 'Actualizando...' : 'Guardando...';
  }
  return props.editingMilestoneId ? 'Actualizar Hito' : 'Guardar Hito';
});
</script>

<style scoped>
.shadow-soft {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
}
/* Asegúrate de que los estilos básicos de FormKit no se pierdan */
</style>