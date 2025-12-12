<template>
  <div class="space-y-6 p-6 animate-fade-in">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Habilidades Sociales</h2>
        <p class="text-sm text-gray-500 mt-1">Registro y evolución de competencias sociales</p>
      </div>
      
      <button 
        @click="openCreateModal"
        class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-sm"
      >
        <PlusIcon class="w-5 h-5" />
        Nueva Habilidad
      </button>
    </div>

    <div v-if="metricsHistory.length > 0" class="animate-fade-in-up">
      <SocialSkillsMetrics :data="metricsHistory" />
    </div>

    <SocialSkillsList 
      :skills="history"
      :loading="loading"
      :total-items="totalItems"
      :current-page="currentPage"
      :page-size="pageSize"
      @edit="openEditModal"
      @delete="handleDeleteClick"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    />

    <SocialSkillModal
      v-if="showModal"
      :show="showModal"
      :child-id="childId"
      :edit-data="selectedSkill" 
      @update:show="showModal = $event"
      @success="handleSuccess"
    />

    <ConfirmModal
      v-if="showDeleteModal"
      type="error"
      title="Eliminar Registro"
      message="¿Estás seguro de que deseas eliminar este registro de habilidad social? Esta acción es permanente y no se puede deshacer."
      confirm-text="Sí, Eliminar"
      cancel-text="Cancelar"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { PlusIcon } from '@heroicons/vue/24/outline';
import { useAlertModalStore } from '@/store/alertModalStore';
import { useAlertStore } from '@/store/alertStore';

// 1. Tipos y Servicio
import type { SocialSkill } from '@/type/socialSkill';
import socialSkillService from '@/services/socialSkillService';

// 2. Componentes Hijos
import SocialSkillModal from '@/components/dashboard/perfil_nino/modals/SocialSkillModal.vue'; 
import SocialSkillsList from '@/components/dashboard/perfil_nino/habilidadessociales/SocialSkillsList.vue';
import ConfirmModal from '@/components/ui/ConfirmModal.vue';
import SocialSkillsMetrics from '@/components/dashboard/perfil_nino/habilidadessociales/SocialSkillsMetrics.vue';

const route = useRoute();
const alertModalStore = useAlertModalStore(); // Modales grandes
const alertStore = useAlertStore(); // Toasts rápidos
const childId = Number(route.params.id);

// --- ESTADO DE DATOS ---
const loading = ref(true);
const history = ref<SocialSkill[]>([]);       // Datos paginados (para la lista)
const metricsHistory = ref<SocialSkill[]>([]); // Datos completos (para gráficos)
const totalItems = ref(0);
const currentPage = ref(1);
const pageSize = ref(5); // Default 5 items

// --- ESTADO DE UI ---
const showModal = ref(false);
const selectedSkill = ref<SocialSkill | null>(null);
const showDeleteModal = ref(false);
const itemToDeleteId = ref<number | null>(null);

// --- MÉTODOS ---

// Cargar datos
const loadData = async () => {
  try {
    loading.value = true;
    
    // 1. Cargar lista paginada (para la tabla)
    const response = await socialSkillService.getHistory(
      childId, 
      currentPage.value, 
      pageSize.value
    );
    
    // Asignar datos paginados
    history.value = response.results;
    totalItems.value = response.count;

    // 2. Cargar datos para métricas (si es necesario)
    // Lógica inteligente: Si hay más items en total que los que tengo en métricas, recargo todo
    if (metricsHistory.value.length === 0 || totalItems.value !== metricsHistory.value.length) {
        metricsHistory.value = await socialSkillService.getMetricsData(childId);
    }
    
  } catch (error) {
    console.error("Error cargando datos:", error);
    alertStore.error('Error', 'No se pudieron cargar los datos del perfil.');
  } finally {
    loading.value = false;
  }
};

// Manejo de Paginación
const handlePageChange = (page: number) => {
  currentPage.value = page;
  loadData();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handlePageSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1; 
  loadData();
};

// Acción al terminar Crear/Editar
const handleSuccess = async () => {
  await loadData(); // Recargar todo para actualizar lista y gráficos
  showModal.value = false; 
  selectedSkill.value = null; 
};

// Abrir Modal CREAR
const openCreateModal = () => {
  selectedSkill.value = null;
  showModal.value = true;
};

// Abrir Modal EDITAR
const openEditModal = (skill: SocialSkill) => {
  selectedSkill.value = { ...skill }; 
  showModal.value = true;
};

// --- LÓGICA DE ELIMINACIÓN ---

const handleDeleteClick = (id: number | undefined) => {
  if (!id) return;
  itemToDeleteId.value = id;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!itemToDeleteId.value) return;

  try {
    showDeleteModal.value = false; 
    
    await socialSkillService.delete(childId, itemToDeleteId.value);
    
    alertStore.success('Eliminado', 'El registro ha sido eliminado correctamente.');
    
    // Si borramos el último item de una página, volver a la anterior
    if (history.value.length === 1 && currentPage.value > 1) {
        currentPage.value--;
    }
    
    await loadData(); 
    
  } catch (error) {
    console.error("Error al eliminar:", error);
    alertModalStore.error('Error', 'No se pudo eliminar el registro. Intente nuevamente.');
  } finally {
    itemToDeleteId.value = null;
  }
};

// Inicialización
onMounted(loadData);
</script>