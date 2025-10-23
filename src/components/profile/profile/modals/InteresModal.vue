<template>
  <BaseModal
    :show="show"
    title="Agregar Nuevo Interés Principal"
    size="md"
    @update:show="handleClose"
  >
    <FormKit
      type="form"
      id="interest-form"
      v-model="formData"
      :actions="false"
      @submit="handleSubmit"
    >
      <div class="space-y-4">

        <FormKit
          type="textarea"
          name="description"
          label="Descripción del Interés"
          placeholder="Describe el interés principal del niño..."
          validation="required"
          rows="3"
        />

        <FormKit
          type="select"
          name="category"
          label="Categoría"
          placeholder="Selecciona una categoría"
          validation="required"
          :options="categoryOptions"
        />

        <FormKit
          type="select"
          name="intensity"
          label="Intensidad"
          placeholder="Selecciona la intensidad"
          validation="required"
          :options="intensityOptions"
        />

        <FormKit
          type="textarea"
          name="therapeutic_utility"
          label="Utilidad Terapéutica (Opcional)"
          placeholder="Describe cómo se puede usar este interés en terapia..."
          rows="2"
        />

        <div v-if="errorMessage" class="p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {{ errorMessage }}
        </div>

      </div>
    </FormKit>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="handleClose"
          class="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <FormKit
          type="submit"
          form="interest-form"
          :label="isSubmitting ? 'Guardando...' : 'Guardar Interés'"
          :disabled="isSubmitting"
          outer-class="!mb-0"
          input-class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FormKit } from '@formkit/vue';
import BaseModal from '@/components/modal/BaseModal.vue';
import {
  createInterestForChild,
  type CreateInterestPayload
} from '@/services/sessionService';

const props = defineProps<{
  show: boolean;
  childId: number;
}>();

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
  (e: 'interest-created'): void;
}>();

const isSubmitting = ref(false);
const errorMessage = ref<string | null>(null);
const formData = ref<CreateInterestPayload>({
  description: '',
  category: '',
  intensity: '',
  therapeutic_utility: ''
});

const categoryOptions = [
  { value: 'food', label: 'Comida' },
  { value: 'games', label: 'Juegos' },
  { value: 'music', label: 'Música' },
  { value: 'movies', label: 'Películas' },
  { value: 'books', label: 'Libros' },
  { value: 'activities', label: 'Actividades' },
  { value: 'objects', label: 'Objetos' },
  { value: 'other', label: 'Otro' },
];

const intensityOptions = [
  { value: 'mild', label: 'Leve' },
  { value: 'moderate', label: 'Moderado' },
  { value: 'strong', label: 'Fuerte' },
  { value: 'obsessive', label: 'Obsesivo' },
];

const handleClose = () => {
  if (!isSubmitting.value) {
    emit('update:show', false);
    resetForm();
  }
};

const handleSubmit = async (submittedData: CreateInterestPayload) => {
  isSubmitting.value = true;
  errorMessage.value = null;

  try {
    console.log('Enviando datos de interés:', submittedData);
    await createInterestForChild(props.childId, submittedData);

    console.log('Interés creado exitosamente!');
    emit('interest-created');
    handleClose();

  } catch (error: any) {
    console.error('Error al crear interés:', error);
    errorMessage.value = error.response?.data?.detail || error.message || 'Ocurrió un error al guardar el interés.';
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  formData.value = {
    description: '',
    category: '',
    intensity: '',
    therapeutic_utility: ''
  };
  errorMessage.value = null;
};

</script>

<style scoped>
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1rem * var(--tw-space-y-reverse));
}

.text-red-500 {
  color: #ef4444;
}

:deep(.formkit-outer) {
  margin-bottom: 1rem;
}

:deep(.formkit-label) {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

:deep(.formkit-input[type="text"]),
:deep(.formkit-input[type="date"]),
:deep(.formkit-select .formkit-input),
:deep(.formkit-textarea .formkit-input) {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

:deep(.formkit-input:focus) {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

:deep(.formkit-form > .formkit-actions) {
  display: none;
}

.formkit-outer.\!mb-0 {
  margin-bottom: 0 !important;
}
</style>