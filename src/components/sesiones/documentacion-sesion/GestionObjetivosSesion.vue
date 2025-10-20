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

    <!-- Formulario para Añadir Nuevo Objetivo -->
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

    <!-- Tabla de Objetivos -->
    <div class="table-container">
      <div v-if="isLoading" class="loading-state">Cargando objetivos...</div>
      <div v-else-if="goals.length === 0" class="empty-state">
        <p>No hay objetivos definidos para esta sesión.</p>
        <p>Comienza añadiendo el primero.</p>
      </div>
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col">Prioridad</th>
            <th scope="col">Descripción</th>
            <th scope="col">Progreso</th>
            <th scope="col">Estado</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="goal in goals" :key="goal.id">
            <td class="whitespace-nowrap">
              <span class="priority-badge" :class="`priority-${goal.priority}`">
                {{ goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1) }}
              </span>
            </td>
            <td>{{ goal.description }}</td>
            <td class="w-48">
              <div class="flex items-center gap-2">
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: `${goal.progress_percentage}%` }"></div>
                </div>
                <span class="text-sm font-medium text-gray-700">{{ goal.progress_percentage }}%</span>
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
                <label :for="`achieved-${goal.id}`" class="ml-2 block text-sm text-gray-900">
                  {{ goal.achieved ? 'Logrado' : 'En Progreso' }}
                </label>
              </div>
            </td>
            <td class="whitespace-nowrap">
              <button @click="handleDeleteGoal(goal.id)" class="btn-icon">
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
  childId: number; // ✅ Necesario para las llamadas a la API
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
    // ✅ CORRECCIÓN: Pasar ambos IDs a la función del servicio
    goals.value = await getGoalsForSession(props.childId, props.sessionId);
  } catch (error) {
    console.error("Error al cargar objetivos:", error);
    alertModal.error('Error', 'No se pudieron cargar los objetivos de la sesión.');
  } finally {
    isLoading.value = false;
  }
}

async function handleAddNewGoal() {
  if (!newGoalData.value.description) return;
  isAdding.value = true;
  try {
    // ✅ CORRECCIÓN: Pasar ambos IDs a la función del servicio
    const newGoal = await createGoalForSession(props.childId, props.sessionId, newGoalData.value);
    goals.value.push(newGoal);
    showAddForm.value = false;
    newGoalData.value.description = '';
    newGoalData.value.priority = 'media';
  } catch (error) {
    console.error("Error al añadir objetivo:", error);
    alertModal.error('Error', 'No se pudo añadir el nuevo objetivo.');
  } finally {
    isAdding.value = false;
  }
}

async function handleDeleteGoal(goalId: number) {
  alertModal.confirm(
    'Confirmar Eliminación',
    '¿Estás seguro de que quieres eliminar este objetivo? Esta acción no se puede deshacer.',
    async () => {
      try {
        // ✅ CORRECCIÓN: Pasar todos los IDs necesarios a la función del servicio
        await deleteGoal(props.childId, props.sessionId, goalId);
        goals.value = goals.value.filter(g => g.id !== goalId);
        alertModal.success('Eliminado', 'El objetivo ha sido eliminado.');
      } catch (error) {
        console.error("Error al eliminar objetivo:", error);
        alertModal.error('Error', 'No se pudo eliminar el objetivo.');
      }
    }
  );
}

async function toggleAchieved(goal: SessionGoal, isChecked: boolean) {
  const originalAchieved = goal.achieved;
  const originalProgress = goal.progress_percentage;
  
  goal.achieved = isChecked;
  goal.progress_percentage = isChecked ? 100 : originalProgress === 100 ? 0 : originalProgress;

  try {
    // ✅ CORRECCIÓN: Pasar todos los IDs necesarios a la función del servicio
    await updateGoal(props.childId, props.sessionId, goal.id, {
      achieved: goal.achieved,
      progress_percentage: goal.progress_percentage,
    });
  } catch (error) {
    console.error("Error al actualizar objetivo:", error);
    alertModal.error('Error', 'No se pudo actualizar el estado del objetivo.');
    // Revertir en caso de error
    goal.achieved = originalAchieved;
    goal.progress_percentage = originalProgress;
  }
}
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow border border-gray-200;
}
.card-header {
  @apply p-4 border-b border-gray-200 flex justify-between items-center;
}
.card-title {
  @apply text-lg font-semibold text-gray-800 flex items-center gap-3;
}
.add-form-container {
  @apply p-4 bg-gray-50;
}
.table-container {
  @apply overflow-x-auto;
}
.loading-state, .empty-state {
  @apply text-center p-8 text-gray-500;
}
th {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}
td {
  @apply px-6 py-4 text-sm text-gray-700;
}
.priority-badge {
  @apply px-2.5 py-0.5 text-xs font-semibold rounded-full;
}
.priority-alta {
  @apply bg-red-100 text-red-800;
}
.priority-media {
  @apply bg-yellow-100 text-yellow-800;
}
.priority-baja {
  @apply bg-green-100 text-green-800;
}
.btn-icon {
  @apply text-gray-400 hover:text-red-600 transition-colors duration-200;
}
.btn {
    @apply inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2;
}
.btn-primary {
    @apply bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500;
}
.btn-sm {
    @apply px-3 py-1.5 text-xs;
}
.btn-secondary {
    @apply bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-indigo-500;
}
</style>


