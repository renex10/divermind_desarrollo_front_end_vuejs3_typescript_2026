<template>
  <!-- Usamos el componente BaseModal como contenedor -->
  <BaseModal
    :show="show"
    title="Agregar Nuevo Diagnóstico"
    size="md"
    @update:show="handleClose"
  >
    <!-- Contenido del Modal: El Formulario -->
    <form @submit.prevent="handleSubmit" id="diagnosis-form">
      <div class="space-y-4">

        <!-- Campo: Descripción del Diagnóstico -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
            Descripción <span class="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            v-model="formData.description"
            rows="3"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe el diagnóstico..."
          ></textarea>
        </div>

        <!-- Campo: Tipo de Diagnóstico -->
        <div>
          <label for="diagnosis_type" class="block text-sm font-medium text-gray-700 mb-1">
            Tipo <span class="text-red-500">*</span>
          </label>
          <select
            id="diagnosis_type"
            v-model="formData.diagnosis_type"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Selecciona un tipo</option>
            <option value="primary">Primario</option>
            <option value="secondary">Secundario</option>
            <option value="comorbidity">Comorbilidad</option>
            <!-- Puedes añadir más opciones si las tienes en tu modelo -->
          </select>
        </div>

        <!-- Campo: Fecha del Diagnóstico -->
        <div>
          <label for="diagnosis_date" class="block text-sm font-medium text-gray-700 mb-1">
            Fecha del Diagnóstico <span class="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="diagnosis_date"
            v-model="formData.diagnosis_date"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Campo: Código CIE-10 (Opcional) -->
        <div>
          <label for="cie10_code" class="block text-sm font-medium text-gray-700 mb-1">
            Código CIE-10 (Opcional)
          </label>
          <input
            type="text"
            id="cie10_code"
            v-model="formData.cie10_code"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: F84.0"
          />
        </div>

        <!-- Campo: Severidad (Opcional) -->
        <div>
          <label for="severity" class="block text-sm font-medium text-gray-700 mb-1">
            Severidad (Opcional)
          </label>
          <input
            type="text"
            id="severity"
            v-model="formData.severity"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Leve, Moderado, Severo"
          />
        </div>

        <!-- Campo: Observaciones (Opcional) - CORREGIDO -->
        <div>
          <label for="observations" class="block text-sm font-medium text-gray-700 mb-1">
            Observaciones (Opcional)
          </label>
          <textarea
            id="observations"
            v-model="formData.observations"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Añade cualquier observación relevante..."
          ></textarea>
        </div>

        <!-- Mensaje de Error (si ocurre) -->
        <div v-if="errorMessage" class="p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {{ errorMessage }}
        </div>

      </div>
    </form> <!-- Fin del <form> -->

    <!-- Footer del Modal: Botones de Acción (Hijo directo de BaseModal) -->
    <template #footer>
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="handleClose"
          class="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="button"
          @click="handleSubmit"
          :disabled="isSubmitting"
          class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {{ isSubmitting ? 'Guardando...' : 'Guardar Diagnóstico' }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseModal from '@/components/modal/BaseModal.vue'; // Importa el modal base
import {
  createDiagnosisForChild,
  type CreateDiagnosisPayload // Asegúrate que esta interfaz incluya cie10_code y observations
} from '@/services/sessionService'; // O diagnosisService si lo separaste

// --- Props ---
// Recibe 'show' para controlar la visibilidad (v-model)
// Recibe 'childId' para saber a qué niño asociar el diagnóstico
const props = defineProps<{
  show: boolean;
  childId: number;
}>();

// --- Emits ---
// Emite 'update:show' para cerrar el modal (v-model)
// Emite 'diagnosis-created' cuando el diagnóstico se guarda exitosamente
const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
  (e: 'diagnosis-created'): void;
}>();

// --- Estado del Componente ---
// Estado para controlar si se está enviando el formulario
const isSubmitting = ref(false);
// Estado para almacenar mensajes de error
const errorMessage = ref<string | null>(null);
// Estado reactivo para almacenar los datos del formulario
// Asegúrate que tu interfaz CreateDiagnosisPayload incluya los campos opcionales
const formData = ref<CreateDiagnosisPayload>({
  description: '',
  diagnosis_type: '',
  diagnosis_date: '',
  cie10_code: '', // Campo añadido
  severity: '',
  observations: '', // Campo añadido/corregido
  is_active: true // Por defecto, marcar como activo
});

// --- Métodos ---

/**
 * Maneja el cierre del modal.
 * Emite el evento para actualizar 'show' en el componente padre.
 */
const handleClose = () => {
  if (!isSubmitting.value) { // No permitir cerrar si está enviando
    emit('update:show', false);
    resetForm(); // Limpia el formulario al cerrar
  }
};

/**
 * Maneja el envío del formulario.
 * Llama a la función del servicio para crear el diagnóstico.
 */
const handleSubmit = async () => {
  // Validación básica de campos requeridos
  if (!formData.value.description || !formData.value.diagnosis_type || !formData.value.diagnosis_date) {
      errorMessage.value = "Por favor, completa los campos Descripción, Tipo y Fecha.";
      return;
  }

  isSubmitting.value = true;
  errorMessage.value = null; // Limpia errores previos

  try {
    console.log('Enviando datos de diagnóstico:', formData.value);
    // Llama a la función del servicio con el ID del niño y los datos del formulario
    await createDiagnosisForChild(props.childId, formData.value);

    console.log('Diagnóstico creado exitosamente!');
    emit('diagnosis-created'); // Notifica al padre que se creó
    handleClose(); // Cierra el modal automáticamente al éxito

  } catch (error: any) {
    console.error('Error al crear diagnóstico:', error);
    // Muestra un mensaje de error genérico o uno específico si la API lo devuelve
    errorMessage.value = error.response?.data?.detail || error.message || 'Ocurrió un error al guardar el diagnóstico.';
  } finally {
    isSubmitting.value = false; // Reactiva los botones
  }
};

/**
 * Resetea el formulario a sus valores iniciales.
 */
const resetForm = () => {
   formData.value = {
    description: '',
    diagnosis_type: '',
    diagnosis_date: '',
    cie10_code: '', // Resetear campo añadido
    severity: '',
    observations: '', // Resetear campo añadido/corregido
    is_active: true
  };
  errorMessage.value = null;
};

</script>

<style scoped>
/* Estilos adicionales si son necesarios */
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse))); /* 16px */
  margin-bottom: calc(1rem * var(--tw-space-y-reverse));
}
.text-red-500 {
  color: #ef4444; /* Rojo para indicar campos requeridos */
}
.disabled\:opacity-50:disabled {
  opacity: 0.5;
}
</style>

