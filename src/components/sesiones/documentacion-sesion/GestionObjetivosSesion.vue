<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        Objetivos Específicos de la Sesión
      </h3>
      <button v-if="!showAddForm" @click="showAddForm = true" class="btn btn-primary btn-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Añadir Objetivo
      </button>
    </div>

    <div v-if="showAddForm" class="add-form-container">
      <FormKit
        type="form"
        v-model="newGoalData"
        @submit="handleAddNewGoal"
        :actions="false"
        form-class="flex flex-col sm:flex-row items-start gap-4"
      >
        <FormKit
          type="text"
          name="description"
          placeholder="Describe el nuevo objetivo..."
          validation="required"
          outer-class="flex-grow w-full"
        />
        <FormKit
          type="select"
          name="priority"
          :options="priorityOptions"
          validation="required"
          outer-class="w-full sm:w-48"
        />
        <div class="flex gap-2 mt-2 sm:mt-0">
          <FormKit type="submit" :label="isAdding ? 'Añadiendo...' : 'Añadir'" :disabled="isAdding" />
          <button type="button" @click="showAddForm = false" class="btn btn-secondary">Cancelar</button>
        </div>
      </FormKit>
    </div>

    <div class="table-container">
      <div v-if="isLoading" class="loading-state">
        <div class="animate-spin h-5 w-5 border-b-2 border-indigo-600 rounded-full mx-auto mb-2"></div>
        Cargando objetivos clínicos...
      </div>
      <div v-else-if="goals.length === 0" class="empty-state">
        <p>No hay objetivos definidos para esta sesión.</p>
        <p class="text-xs">Comienza añadiendo el primero para medir el progreso de Pangal.</p>
      </div>
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col">Prioridad</th>
            <th scope="col">Descripción</th>
            <th scope="col" class="w-48">Progreso Manual (%)</th>
            <th scope="col">Estado</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="goal in goals" :key="goal.id" class="hover:bg-gray-50/50">
            <td class="whitespace-nowrap">
              <span class="priority-badge" :class="`priority-${goal.priority}`">
                {{ goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1) }}
              </span>
            </td>
            <td class="max-w-xs truncate" :title="goal.description">{{ goal.description }}</td>
            
            <td class="w-48">
              <div class="flex items-center gap-3">
                <input 
                  type="range" 
                  min="0" max="100" step="10"
                  v-model.number="goal.progress_percentage"
                  @change="syncGoalProgress(goal)"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                >
                <span class="text-xs font-bold text-gray-600 w-8">{{ goal.progress_percentage }}%</span>
              </div>
            </td>

            <td class="whitespace-nowrap">
              <div class="flex items-center">
                <input
                  :id="`achieved-${goal.id}`"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  :checked="goal.achieved"
                  @change="toggleAchieved(goal, ($event.target as HTMLInputElement).checked)"
                />
                <label :for="`achieved-${goal.id}`" class="ml-2 block text-xs font-medium text-gray-700">
                  {{ goal.achieved ? 'Logrado' : 'En proceso' }}
                </label>
              </div>
            </td>
            <td class="whitespace-nowrap">
              <button @click="handleDeleteGoal(goal.id)" class="btn-icon" title="Eliminar objetivo">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAlertModalStore } from '@/store/alertModalStore';
import { createGoalForSession, deleteGoal, getGoalsForSession, type SessionGoal, updateGoal } from '@/services/sessionService';

const props = defineProps<{
  childId: number;
  sessionId: number;
}>();

const alertModal = useAlertModalStore();

const goals = ref<SessionGoal[]>([]);
const isLoading = ref(true);
const isAdding = ref(false);
const showAddForm = ref(false);
const newGoalData = ref({
  description: '',
  priority: 'media' as const,
});

const priorityOptions = [
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Media' },
  { value: 'baja', label: 'Baja' },
];

onMounted(fetchGoals);

async function fetchGoals() {
  isLoading.value = true;
  try {
    goals.value = await getGoalsForSession(props.childId, props.sessionId);
  } catch (error) {
    alertModal.error('Error', 'No se pudieron cargar los objetivos de la sesión.');
  } finally {
    isLoading.value = false;
  }
}

async function handleAddNewGoal() {
  if (!newGoalData.value.description) return;
  isAdding.value = true;
  try {
    const newGoal = await createGoalForSession(props.childId, props.sessionId, newGoalData.value);
    goals.value.push(newGoal);
    showAddForm.value = false;
    newGoalData.value.description = '';
    newGoalData.value.priority = 'media';
  } catch (error) {
    alertModal.error('Error', 'No se pudo añadir el objetivo.');
  } finally {
    isAdding.value = false;
  }
}

async function handleDeleteGoal(goalId: number) {
  alertModal.confirm(
    'Confirmar Eliminación',
    '¿Estás seguro de que quieres eliminar este objetivo?',
    async () => {
      try {
        await deleteGoal(props.childId, props.sessionId, goalId);
        goals.value = goals.value.filter(g => g.id !== goalId);
      } catch (error) {
        alertModal.error('Error', 'No se pudo eliminar el objetivo.');
      }
    }
  );
}

/**
 * Sincroniza el porcentaje manual con el estado de "Logrado"
 */
async function syncGoalProgress(goal: SessionGoal) {
  goal.achieved = goal.progress_percentage === 100;
  await saveGoalUpdate(goal);
}

async function toggleAchieved(goal: SessionGoal, isChecked: boolean) {
  goal.achieved = isChecked;
  // Si se marca logrado, forzamos 100%. Si se desmarca, mantenemos el progreso previo.
  if (isChecked) goal.progress_percentage = 100;
  await saveGoalUpdate(goal);
}

async function saveGoalUpdate(goal: SessionGoal) {
  try {
    await updateGoal(props.childId, props.sessionId, goal.id, {
      achieved: goal.achieved,
      progress_percentage: goal.progress_percentage,
    });
  } catch (error) {
    alertModal.error('Error', 'No se pudo actualizar el objetivo.');
    fetchGoals(); // Revertir datos
  }
}

/**
 * ✅ EXPOSICIÓN PARA LA IA:
 * Permite que DocumentarSesionView.vue extraiga los datos estructurados para el payload de la IA.
 */
const getGoalsData = () => {
  return goals.value.map(g => ({
    goal_id: g.id,
    description: g.description,
    progress_percentage: g.progress_percentage,
    achieved: g.achieved
  }));
};

defineExpose({ getGoalsData });
</script>

<style scoped>
.card { @apply bg-white rounded-lg shadow border border-gray-200; }
.card-header { @apply p-4 border-b border-gray-200 flex justify-between items-center; }
.card-title { @apply text-lg font-semibold text-gray-800 flex items-center gap-3; }
.add-form-container { @apply p-4 bg-indigo-50/30 border-b border-indigo-100; }
.table-container { @apply overflow-x-auto; }
.loading-state, .empty-state { @apply text-center p-8 text-gray-500; }
th { @apply px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest; }
td { @apply px-6 py-4 text-sm text-gray-700; }
.priority-badge { @apply px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase; }
.priority-alta { @apply bg-red-100 text-red-800; }
.priority-media { @apply bg-yellow-100 text-yellow-800; }
.priority-baja { @apply bg-green-100 text-green-800; }
.btn-icon { @apply text-gray-300 hover:text-red-600 transition-colors; }
.btn { @apply inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-all active:scale-95; }
.btn-primary { @apply bg-indigo-600 text-white hover:bg-indigo-700; }
.btn-sm { @apply px-3 py-1.5 text-xs; }
.btn-secondary { @apply bg-white text-gray-700 border-gray-300 hover:bg-gray-50; }
</style>