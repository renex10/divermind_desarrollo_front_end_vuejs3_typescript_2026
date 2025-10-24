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
      :value="formData" :incomplete-message="false"
      #default="{ state: { valid } }" >
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
              :disabled="isSubmitting || !valid" class="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
        <button
          @click="loadMilestones"
          :disabled="isLoadingHistory"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            :class="['w-4 h-4 mr-2', { 'animate-spin': isLoadingHistory }]"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          {{ isLoadingHistory ? 'Cargando...' : 'Refrescar' }}
        </button>
      </div>

      <MilestoneHistoryList
        :milestones="milestones"
        :is-loading="isLoadingHistory"
        @edit="handleEdit"
        @delete="handleDeleteRequest" />
    </section>

     </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useNinoActivoStore } from '@/store/ninoActivoStore';
import { useAlertModalStore } from '@/store/alertModalStore';
import MilestoneHistoryList from '@/components/gestion/hitosLogros/MilestoneHistoryList.vue';
// import ConfirmModal from '@/components/ui/ConfirmModal.vue'; // Omitido temporalmente
import { reset } from '@formkit/core'; // Import FormKit reset

// --- Import Service and Interfaces ---
import { hitosService } from '@/services/hitosService'; // ✅ Integrado
import type { Milestone, MilestoneFormData } from '@/type/hitoServiceInterface'; // ✅ Integrado

// --- Stores ---
const ninoStore = useNinoActivoStore();
const alertModal = useAlertModalStore();

// --- State ---
const isLoading = ref(true);
const isSubmitting = ref(false);
const isLoadingHistory = ref(false);
const milestones = ref<Milestone[]>([]);
const editingMilestoneId = ref<number | string | null>(null);
// --- State for Delete Modal (Omitido temporalmente) ---
// const showConfirmDeleteModal = ref(false);
// const milestoneToDeleteId = ref<number | string | null>(null);

// --- Form Data ---
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
const formData = reactive<MilestoneFormData>({ ...initialFormData });

// --- Select Options ---
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

// --- Computed ---
const buttonText = computed(() => {
  if (isSubmitting.value) {
    return editingMilestoneId.value ? 'Actualizando...' : 'Guardando...';
  }
  return editingMilestoneId.value ? 'Actualizar Hito' : 'Guardar Hito';
});

// --- Lifecycle ---
onMounted(async () => {
  // Watch for childId changes from the store if it might load late
  if (!ninoStore.ninoId) {
      watch(() => ninoStore.ninoId, async (newId) => {
          if (newId) {
              await initializeComponent(newId);
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


// --- API Functions ---
async function loadMilestones(childId: string | number | null = ninoStore.ninoId) {
  if (!childId) {
    console.warn("loadMilestones called without childId");
    milestones.value = [];
    return;
  }
  isLoadingHistory.value = true;
  console.log(`🔄 Loading milestones for child ${childId}...`);
  try {
    milestones.value = await hitosService.getMilestones(childId);
    console.log(`✅ Loaded ${milestones.value.length} milestones.`);
  } catch (error) {
    console.error("Error loading milestones history:", error);
    alertModal.error('Error', 'No se pudo cargar el historial de hitos.');
    milestones.value = [];
  } finally {
    isLoadingHistory.value = false;
  }
}

async function handleSubmit(submittedData: MilestoneFormData) {
  if (!ninoStore.ninoId) {
    alertModal.warning('Error', 'No se ha seleccionado un niño.');
    return;
  }

  isSubmitting.value = true;
  const childId = ninoStore.ninoId;

  const payload: MilestoneFormData = {
      ...submittedData,
      observations: submittedData.observations?.trim() || null,
      functional_impact: submittedData.functional_impact?.trim() || null,
  };
  console.log(`💾 Submitting milestone (Edit ID: ${editingMilestoneId.value}):`, payload);

  try {
    let savedMilestone: Milestone;
    if (editingMilestoneId.value) {
      console.log(`⬆️ Calling updateMilestone for ID ${editingMilestoneId.value}`);
      savedMilestone = await hitosService.updateMilestone(childId, editingMilestoneId.value, payload);
      alertModal.success('Hito Actualizado', 'El hito se actualizó correctamente.');
      const index = milestones.value.findIndex(m => m.id === editingMilestoneId.value);
      if (index !== -1) {
        milestones.value[index] = savedMilestone;
        milestones.value.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        console.log(`✅ Milestone ${savedMilestone.id} updated locally.`);
      } else {
         console.warn(`Milestone ${editingMilestoneId.value} not found locally after update, reloading list.`);
         await loadMilestones(childId);
      }
    } else {
      console.log(`➕ Calling createMilestone...`);
      savedMilestone = await hitosService.createMilestone(childId, payload);
      alertModal.success('Hito Guardado', 'El hito se registró correctamente.');
      milestones.value.unshift(savedMilestone);
      milestones.value.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      console.log(`✅ New milestone ${savedMilestone.id} created and added locally.`);
    }
    resetForm();

  } catch (error: any) {
    console.error("Error saving milestone:", error);
    let errorMessage = editingMilestoneId.value ? 'No se pudo actualizar el hito.' : 'No se pudo guardar el hito.';
    if (error.response && error.response.data) {
        const errors = error.response.data;
        const fieldErrors = Object.entries(errors)
            .map(([field, messages]) => `${field}: ${(Array.isArray(messages) ? messages.join(', ') : messages)}`)
            .join(' ');
        if (fieldErrors) {
            errorMessage = `Error de validación: ${fieldErrors}`;
        } else if (typeof errors === 'string') {
             errorMessage = errors;
        } else if (errors.detail) {
             errorMessage = errors.detail;
        }
    }
    alertModal.error('Error al Guardar', errorMessage);
  } finally {
    isSubmitting.value = false;
  }
}

// --- Delete Functions (Modal logic commented out) ---
async function confirmDelete() { // Renamed slightly as it doesn't wait for modal confirmation now
  // if (!ninoStore.ninoId || milestoneToDeleteId.value === null) {
  //     console.warn("confirmDelete called without necessary IDs.");
  //     return;
  // }
  // const childId = ninoStore.ninoId;
  // const idToDelete = milestoneToDeleteId.value;
  // // showConfirmDeleteModal.value = false; // Modal is already omitted
  // console.log(`🗑️ Attempting to delete milestone ${idToDelete} for child ${childId}...`);
  // try {
  //   await hitosService.deleteMilestone(childId, idToDelete);
  //   alertModal.success('Hito Eliminado', 'El hito se eliminó correctamente.');
  //   milestones.value = milestones.value.filter(m => m.id !== idToDelete);
  //    console.log(`✅ Milestone ${idToDelete} deleted locally.`);
  // } catch (error) {
  //   console.error("Error deleting milestone:", error);
  //   alertModal.error('Error al Eliminar', 'No se pudo eliminar el hito.');
  // } finally {
  //   milestoneToDeleteId.value = null;
  // }
  console.warn("Deletion confirmation modal is omitted. confirmDelete logic skipped.");
}

// --- Form/UI Functions ---
function handleEdit(milestoneId: number | string) {
  console.log(`✏️ Edit requested for milestone ID: ${milestoneId}`);
  const milestoneToEdit = milestones.value.find(m => m.id === milestoneId);
  if (milestoneToEdit) {
    console.log("Found milestone to edit:", milestoneToEdit);
    Object.keys(initialFormData).forEach(key => {
        if (key in milestoneToEdit) {
             (formData as any)[key] = (milestoneToEdit as any)[key] ?? initialFormData[key as keyof MilestoneFormData];
        } else {
             (formData as any)[key] = initialFormData[key as keyof MilestoneFormData];
        }
    });
    if (formData.date && formData.date.includes('T')) {
        formData.date = formData.date.split('T')[0];
    }
    formData.observations = formData.observations ?? '';
    formData.functional_impact = formData.functional_impact ?? '';

    editingMilestoneId.value = milestoneId;
    console.log("Form data populated for editing:", { ...formData });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    alertModal.info('Modo Edición', 'Modifique los campos necesarios y presione "Actualizar Hito".');
  } else {
    console.error(`Milestone with ID ${milestoneId} not found in local list.`);
    alertModal.error('Error', 'No se encontró el hito para editar en la lista actual.');
  }
}

function handleDeleteRequest(milestoneId: number | string) {
  console.log(`❓ Delete requested for milestone ID: ${milestoneId}. Modal omitted.`);
  // milestoneToDeleteId.value = milestoneId;
  // showConfirmDeleteModal.value = true; // Modal is omitted
  // You could directly call the delete service here if you REALLY want to skip confirmation,
  // but it's generally not recommended for destructive actions.
  // Example (USE WITH CAUTION):
  // if (confirm('¿Realmente deseas eliminar este hito SIN confirmación modal?')) {
  //    directDeleteMilestone(milestoneId);
  // }
}

/* // Function for direct delete (use cautiously)
async function directDeleteMilestone(idToDelete: string | number) {
    if (!ninoStore.ninoId) return;
    const childId = ninoStore.ninoId;
    console.log(`🗑️ Directly deleting milestone ${idToDelete} for child ${childId}...`);
    try {
        await hitosService.deleteMilestone(childId, idToDelete);
        alertModal.success('Hito Eliminado', 'El hito se eliminó directamente.');
        milestones.value = milestones.value.filter(m => m.id !== idToDelete);
        console.log(`✅ Milestone ${idToDelete} deleted locally.`);
    } catch (error) {
        console.error("Error deleting milestone directly:", error);
        alertModal.error('Error al Eliminar', 'No se pudo eliminar el hito.');
    }
}
*/

// --- Delete Modal Functions (Omitido temporalmente) ---
/*
function cancelDelete() {
  showConfirmDeleteModal.value = false;
  milestoneToDeleteId.value = null;
  console.log("Deletion cancelled.");
}
*/

function resetForm() {
  Object.assign(formData, initialFormData);
  editingMilestoneId.value = null;
  reset('hitoForm'); // Use FormKit's reset function by ID
  console.log("Form reset.");
}

function cancelEdit() {
    console.log("Edit cancelled.");
    resetForm();
}

// --- Helper Functions ---
function getProficiencyColor(level: string): string {
  const colors: Record<string, string> = {
    emerging: 'bg-yellow-100 text-yellow-800',
    developing: 'bg-blue-100 text-blue-800',
    proficient: 'bg-green-100 text-green-800',
    mastered: 'bg-purple-100 text-purple-800'
  };
  return colors[level] || 'bg-gray-100 text-gray-800';
}

function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'Fecha desconocida';
    try {
        return new Date(dateString).toLocaleString('es-CL', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    } catch (e) {
        return dateString;
    }
}

</script>

<style scoped>
/* Scoped styles remain the same */
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
</style>