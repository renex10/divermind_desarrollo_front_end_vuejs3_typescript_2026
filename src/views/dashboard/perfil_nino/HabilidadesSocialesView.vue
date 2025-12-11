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

const route = useRoute();
const alertModalStore = useAlertModalStore(); // Para modales grandes (errores graves)
const alertStore = useAlertStore(); // Para notificaciones Toast (éxito rápido)
const childId = Number(route.params.id);

// --- ESTADO DE DATOS ---
const loading = ref(true);
const history = ref<SocialSkill[]>([]);
const totalItems = ref(0);
const currentPage = ref(1);
const pageSize = ref(5); // Default 5 items por el ancho de las cards

// --- ESTADO DE UI ---
const showModal = ref(false);
const selectedSkill = ref<SocialSkill | null>(null);
const showDeleteModal = ref(false);
const itemToDeleteId = ref<number | null>(null);

// --- MÉTODOS ---

// Cargar datos con paginación
const loadData = async () => {
  try {
    loading.value = true;
    
    const response = await socialSkillService.getHistory(
      childId, 
      currentPage.value, 
      pageSize.value
    );
    
    // Asignar datos de la respuesta paginada
    history.value = response.results;
    totalItems.value = response.count;
    
  } catch (error) {
    console.error("Error cargando historial:", error);
    alertStore.error('Error', 'No se pudo cargar el historial.');
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
  currentPage.value = 1; // Volver a pág 1 al cambiar tamaño
  loadData();
};

// Acción al terminar Crear/Editar
const handleSuccess = async () => {
  await loadData(); 
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

// 1. Trigger (Click en icono basura)
const handleDeleteClick = (id: number | undefined) => {
  if (!id) return;
  itemToDeleteId.value = id;
  showDeleteModal.value = true;
};

// 2. Acción Confirmada
const confirmDelete = async () => {
  if (!itemToDeleteId.value) return;

  try {
    showDeleteModal.value = false; // Cerrar modal visualmente
    
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