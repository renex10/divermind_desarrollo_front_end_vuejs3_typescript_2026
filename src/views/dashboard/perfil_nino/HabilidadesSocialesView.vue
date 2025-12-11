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
      @edit="openEditModal"
      @delete="handleDelete"
    />

    <SocialSkillModal
      v-if="showModal"
      :show="showModal"
      :child-id="childId"
      :edit-data="selectedSkill" 
      @update:show="showModal = $event"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { PlusIcon } from '@heroicons/vue/24/outline';
import { useAlertModalStore } from '@/store/alertModalStore';

// 1. Tipos y Servicio
import type { SocialSkill } from '@/type/socialSkill';
import socialSkillService from '@/services/socialSkillService';

// 2. Componentes Hijos
import SocialSkillModal from '@/components/dashboard/perfil_nino/modals/SocialSkillModal.vue'; 
import SocialSkillsList from '@/components/dashboard/perfil_nino/habilidadessociales/SocialSkillsList.vue';

const route = useRoute();
const alertModal = useAlertModalStore();
const childId = Number(route.params.id);

// --- ESTADO ---
const loading = ref(true);
const history = ref<SocialSkill[]>([]);
const showModal = ref(false);
const selectedSkill = ref<SocialSkill | null>(null); // ✅ Almacena el item a editar

// --- MÉTODOS ---

// Cargar datos
const loadData = async () => {
  try {
    loading.value = true;
    history.value = await socialSkillService.getHistory(childId);
    console.log("✅ Historial cargado:", history.value.length, "registros");
  } catch (error) {
    console.error("Error cargando historial:", error);
    alertModal.error('Error de Conexión', 'No se pudo cargar el historial.');
  } finally {
    loading.value = false;
  }
};

// Acción al terminar (Crear o Editar exitoso)
const handleSuccess = async () => {
  await loadData(); // Recargar lista para ver cambios
  showModal.value = false; // Cerrar modal por si acaso
  selectedSkill.value = null; // Limpiar selección
};

// ✅ ABRIR MODAL EN MODO CREAR
const openCreateModal = () => {
  selectedSkill.value = null; // Limpiamos para que el modal sepa que es nuevo
  showModal.value = true;
};

// ✅ ABRIR MODAL EN MODO EDITAR
const openEditModal = (skill: SocialSkill) => {
  console.log("✏️ Abriendo edición para:", skill.id);
  // Clonamos el objeto para evitar reactividad directa en la lista mientras se edita
  selectedSkill.value = { ...skill }; 
  showModal.value = true;
};

// Acción de Eliminar
const handleDelete = async (id: number | undefined) => {
  if (!id) return;
  
  // Usamos el modal de confirmación del sistema
  alertModal.confirm(
    'Confirmar eliminación',
    '¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.',
    async () => {
      try {
        await socialSkillService.delete(childId, id); 
        console.log("🗑️ Eliminado ID:", id);
        alertModal.success('Eliminado', 'El registro se ha eliminado correctamente.');
        await loadData(); // Recargar lista
      } catch (error) {
        console.error("Error al eliminar:", error);
        alertModal.error('Error', 'No se pudo eliminar el registro.');
      }
    }
  );
};

// Inicialización
onMounted(loadData);
</script>