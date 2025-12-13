<template>
  <div class="hitos-logros-view max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900">Registro de Hitos del Desarrollo</h2>
      <p class="mt-2 text-sm text-gray-600">
        Documenta los logros y avances del desarrollo del niño
      </p>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <svg
        class="animate-spin h-8 w-8 text-primary-500 mr-3"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <p class="text-gray-600 font-medium">Cargando...</p>
    </div>

    <FormKit
      v-else
      type="form"
      id="hitoForm"
      :actions="false"
      @submit="handleSubmit"
      v-model="formData" :incomplete-message="false"
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
              @click="cancelEdit"
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

    <section class="mt-12">
      <div class="flex justify-between items-center mb-6">
         <div>
            <h3 class="text-2xl font-bold text-gray-900">Historial de Hitos</h3>
            <p class="mt-1 text-sm text-gray-600">
                Registro cronológico de logros y avances
            </p>
         </div>
         <button @click="loadMilestones()" :disabled="isLoadingHistory" class="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <svg :class="['w-4 h-4 mr-2', { 'animate-spin': isLoadingHistory }]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
           {{ isLoadingHistory ? 'Cargando...' : 'Refrescar' }}
         </button>
      </div>

      <MilestoneHistoryList
        :milestones="milestones"
        :is-loading="isLoadingHistory"
        @edit="handleEdit"
        @delete="handleDeleteRequest"
      />
    </section>

     <ConfirmModal
        v-if="showConfirmDeleteModal"
        :show="showConfirmDeleteModal"
        @update:show="(value: boolean) => { if (!value) cancelDelete() }"
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar este hito? Esta acción no se puede deshacer."
        confirm-text="Sí, Eliminar"
        cancel-text="Cancelar"
        type="warning"
        @confirm="confirmDelete"
        @close="cancelDelete"
      />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useNinoActivoStore } from '@/store/ninoActivoStore';
import { useAlertModalStore } from '@/store/alertModalStore'; // Store para notificaciones (éxito/error)
import MilestoneHistoryList from '@/components/gestion/hitosLogros/MilestoneHistoryList.vue';
import ConfirmModal from '@/components/ui/ConfirmModal.vue'; // ✅ IMPORTAR ConfirmModal
import { reset } from '@formkit/core'; // Importar función reset de FormKit

// --- Importar Servicio e Interfaces ---
import { hitosService } from '@/services/hitosService'; // ✅ Servicio API
import type { Milestone, MilestoneFormData } from '@/type/hitoServiceInterface'; // ✅ Tipos

// --- Stores ---
const ninoStore = useNinoActivoStore();
const alertModal = useAlertModalStore(); // Para mensajes de éxito/error post-acción

// --- Estado del Componente ---
const isLoading = ref(true); // Carga inicial
const isSubmitting = ref(false); // Envío de formulario
const isLoadingHistory = ref(false); // Carga de historial
const milestones = ref<Milestone[]>([]); // Lista de hitos
const editingMilestoneId = ref<number | string | null>(null); // ID del hito en edición
// --- ✅ Estado para ConfirmModal ---
const showConfirmDeleteModal = ref(false); // Controla visibilidad del modal ConfirmModal
const milestoneToDeleteId = ref<number | string | null>(null); // Guarda ID a eliminar

// --- Datos del Formulario ---
const initialFormData: MilestoneFormData = {
  date: new Date().toISOString().split('T')[0],
  category: '',
  description: '',
  observations: '',
  proficiency_level: 'emerging',
  context: 'therapy',
  support_level: 'verbal_cue',
  functional_impact: '',
};
// ✅ *** CAMBIO: formData ahora es un ref() para que v-model funcione correctamente ***
// v-model en un <FormKit type="form"> funciona mejor con ref() para actualizaciones programáticas
const formData = ref<MilestoneFormData>({ ...initialFormData });

// --- Opciones para los Selects ---
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
  if (isSubmitting.value) {
    return editingMilestoneId.value ? 'Actualizando...' : 'Guardando...';
  }
  return editingMilestoneId.value ? 'Actualizar Hito' : 'Guardar Hito';
});

// --- Ciclo de Vida ---
onMounted(async () => {
  if (!ninoStore.ninoId) {
      const unwatch = watch(() => ninoStore.ninoId, async (newId) => {
          if (newId) {
              await initializeComponent(newId);
              unwatch();
          }
      }, { immediate: true });
  } else {
      await initializeComponent(ninoStore.ninoId);
  }
});

async function initializeComponent(childId: string | number) {
    isLoading.value = true;
    await loadMilestones(childId);
    isLoading.value = false;
}

// --- Funciones de Interacción con API ---

async function loadMilestones(childId: string | number | null = ninoStore.ninoId) {
  if (!childId) {
    console.warn("loadMilestones: No se proporcionó ID de niño.");
    milestones.value = [];
    return;
  }
  isLoadingHistory.value = true;
  console.log(`🔄 Cargando hitos para niño ${childId}...`);
  try {
    milestones.value = await hitosService.getMilestones(childId);
    console.log(`✅ ${milestones.value.length} hitos cargados.`);
  } catch (error) {
    console.error("Error cargando historial:", error);
    alertModal.error('Error de Carga', 'No se pudo cargar el historial de hitos.');
    milestones.value = [];
  } finally {
    isLoadingHistory.value = false;
  }
}

// Maneja el evento @submit del formulario FormKit
async function handleSubmit(submittedData: MilestoneFormData) {
  // `submittedData` es el valor actual del formulario, que es el mismo que `formData.value`
  if (!ninoStore.ninoId) {
    alertModal.warning('Error', 'ID de niño no encontrado.');
    return;
  }

  isSubmitting.value = true;
  const childId = ninoStore.ninoId;

  const payload: MilestoneFormData = {
      ...submittedData,
      observations: submittedData.observations?.trim() || null,
      functional_impact: submittedData.functional_impact?.trim() || null,
  };
  console.log(`💾 Enviando hito (Editando ID: ${editingMilestoneId.value}):`, payload);

  try {
    let savedMilestone: Milestone;
    if (editingMilestoneId.value) { // --- ACTUALIZAR ---
      console.log(`⬆️ Actualizando hito ID ${editingMilestoneId.value}`);
      savedMilestone = await hitosService.updateMilestone(childId, editingMilestoneId.value, payload);
      alertModal.success('Hito Actualizado', 'Cambios guardados correctamente.');
      const index = milestones.value.findIndex(m => m.id === editingMilestoneId.value);
      if (index !== -1) milestones.value[index] = savedMilestone;
      else await loadMilestones(childId);
      milestones.value.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      console.log(`✅ Hito ${savedMilestone.id} actualizado.`);
    } else { // --- CREAR ---
      console.log(`➕ Creando nuevo hito...`);
      savedMilestone = await hitosService.createMilestone(childId, payload);
      alertModal.success('Hito Guardado', 'Nuevo hito registrado.');
      milestones.value.unshift(savedMilestone);
      milestones.value.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      console.log(`✅ Nuevo hito ${savedMilestone.id} creado.`);
    }
    resetForm();

  } catch (error: any) { // --- MANEJO DE ERRORES ---
    console.error("Error guardando hito:", error);
    let errorMessage = editingMilestoneId.value ? 'Error al actualizar.' : 'Error al guardar.';
    if (error.response?.data) {
        const errors = error.response.data;
        const fieldErrors = Object.entries(errors)
            .map(([field, messages]) => `${field}: ${(Array.isArray(messages) ? messages.join(', ') : messages)}`)
            .join('; ');
        if (fieldErrors) errorMessage = `Error de validación: ${fieldErrors}`;
        else if (typeof errors === 'string') errorMessage = errors;
        else if (errors.detail) errorMessage = errors.detail;
    }
    alertModal.error('Error', errorMessage);
  } finally {
    isSubmitting.value = false;
  }
}

// --- Funciones para Borrado (usando ConfirmModal.vue) ---

function handleDeleteRequest(milestoneId: number | string) {
  console.log(`❓ Solicitud de borrado para hito ID: ${milestoneId}. Mostrando ConfirmModal.`);
  milestoneToDeleteId.value = milestoneId;
  showConfirmDeleteModal.value = true; // ✅ Activa el modal
}

async function confirmDelete() {
  if (!ninoStore.ninoId || milestoneToDeleteId.value === null) {
      console.warn("confirmDelete: Faltan IDs necesarios.");
      showConfirmDeleteModal.value = false;
      milestoneToDeleteId.value = null;
      return;
  }
  const childId = ninoStore.ninoId;
  const idToDelete = milestoneToDeleteId.value;

  showConfirmDeleteModal.value = false;
  console.log(`🗑️ Ejecutando borrado para hito ${idToDelete} del niño ${childId}...`);

  try {
    await hitosService.deleteMilestone(childId, idToDelete);
    alertModal.success('Hito Eliminado', 'El hito se eliminó correctamente.');
    milestones.value = milestones.value.filter(m => m.id !== idToDelete);
     console.log(`✅ Hito ${idToDelete} eliminado localmente.`);
  } catch (error) {
    console.error("Error durante eliminación de hito:", error);
    alertModal.error('Error al Eliminar', 'No se pudo eliminar el hito.');
  } finally {
    milestoneToDeleteId.value = null;
  }
}

function cancelDelete() {
  console.log("Borrado cancelado por el usuario.");
  showConfirmDeleteModal.value = false;
  milestoneToDeleteId.value = null;
}


// --- Funciones de UI y Formulario ---

function handleEdit(milestoneToEdit: Milestone) {
  console.log(`✏️ Solicitud de edición para hito ID: ${milestoneToEdit.id}`);
  const dataToEdit = milestones.value.find(m => m.id === milestoneToEdit.id);
  if (dataToEdit) {
    console.log("Hito encontrado para editar:", dataToEdit);
    
    // ✅ *** CAMBIO: Poblar el ref() formData.value ***
    // Esto actualizará los campos enlazados con v-model
    formData.value = {
        date: dataToEdit.date.includes('T') ? dataToEdit.date.split('T')[0] : dataToEdit.date, // Asegurar YYYY-MM-DD
        category: dataToEdit.category,
        description: dataToEdit.description,
        observations: dataToEdit.observations ?? '', // Convertir null a ''
        proficiency_level: dataToEdit.proficiency_level,
        context: dataToEdit.context,
        support_level: dataToEdit.support_level,
        functional_impact: dataToEdit.functional_impact ?? '' // Convertir null a ''
    };

    editingMilestoneId.value = dataToEdit.id;
    console.log("Formulario poblado para edición:", { ...formData.value });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    alertModal.info('Modo Edición', 'Modifica los campos necesarios y presione "Actualizar Hito".');
  } else {
    console.error(`Hito con ID ${milestoneToEdit.id} no encontrado localmente.`);
    alertModal.error('Error', 'No se encontró el hito para editar.');
  }
}

// Resetea el formulario y sale del modo edición
function resetForm() {
  editingMilestoneId.value = null; // Salir modo edición
  // ✅ *** CAMBIO: Usar reset() de FormKit para limpiar Y reasignar el ref() ***
  // Reasignar el ref es crucial para que v-model funcione al resetear
  formData.value = { ...initialFormData };
  // reset('hitoForm') limpia el estado *interno* de FormKit (errores, touched, etc.)
  reset('hitoForm'); 
  console.log("Formulario reseteado.");
}

// Se llama al presionar "Cancelar Edición"
function cancelEdit() {
    console.log("Edición cancelada.");
    resetForm();
}

// --- Funciones Auxiliares (Helpers) ---



</script>

<style scoped>
/* Estilos específicos del componente */
.input-style, .select-style, .textarea-style {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm;
}
.select-style {
  @apply bg-white;
}
.btn-primary {
  @apply inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200;
}
.btn-secondary {
   @apply px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors;
}
.shadow-soft {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
}
</style>