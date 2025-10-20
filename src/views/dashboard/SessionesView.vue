<template>
  <div class="sesiones-vista bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200 mb-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Gestión de Sesiones</h1>
            <p class="mt-1 text-sm text-gray-600">
              Administra y documenta las sesiones terapéuticas de todos los niños.
            </p>
          </div>
          <button
            @click="crearNuevaSesion"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nueva Sesión
          </button>
        </div>
      </div>
    </div>

    <!-- Estado de Carga -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600 ml-4">Cargando sesiones...</p>
    </div>

    <!-- Contenido Principal -->
    <main v-if="!isLoading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      
      <!-- Filtros y Búsqueda -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar por Niño</label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Nombre o RUT del niño..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              v-model="filterStatus"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="asistio">Asistió</option>
              <option value="pendiente">Pendiente</option>
              <option value="cancelado_familia">Cancelada</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
            <input
              v-model="filterDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- Lista de Sesiones -->
      <div v-if="filteredSessions.length > 0" class="space-y-4">
        <div
          v-for="session in filteredSessions"
          :key="session.id"
          class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center">
                  <h3 class="text-lg font-semibold text-gray-900">
                    Sesión #{{ session.session_number }}
                  </h3>
                  <span
                    class="ml-3 px-3 py-1 text-xs font-medium rounded-full"
                    :class="getStatusClass(session.attendance_status)"
                  >
                    {{ getStatusLabel(session.attendance_status) }}
                  </span>
                </div>
                <p class="mt-1 text-sm text-gray-600">
                  <span class="font-medium">Niño:</span> {{ session.child_name || 'No especificado' }}
                </p>
                <div class="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                  <span class="flex items-center">
                    <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {{ formatDate(session.scheduled_date) }}
                  </span>
                  <span v-if="session.duration_minutes" class="flex items-center">
                    <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {{ session.duration_minutes }} min
                  </span>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="verDetalleSesion(session)"
                  class="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors duration-150"
                >
                  Ver Detalles
                </button>
                <button
                  @click="documentarSesion(session)"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-150"
                >
                  Documentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado Vacío -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No hay sesiones</h3>
        <p class="mt-1 text-sm text-gray-500">
          No se encontraron sesiones con los filtros aplicados.
        </p>
      </div>
    </main>

    <!-- Modal para ver Detalles (se renderiza cuando es necesario) -->
    <VerDetalleSesion
      v-if="sesionParaVer"
      v-model:show="isDetalleModalOpen"
      :session-data="sesionParaVer"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAlertModalStore } from '@/store/alertModalStore';
import { getAllTherapySessions, type TherapySession } from '@/services/sessionService'; 
import VerDetalleSesion from '@/components/sesiones/VerDetalleSesion.vue';

const router = useRouter();
const alertModal = useAlertModalStore();

// --- ESTADO ---
const isLoading = ref(true);
const sessions = ref<TherapySession[]>([]);
const searchQuery = ref('');
const filterStatus = ref('');
const filterDate = ref('');

// --- ESTADO PARA EL MODAL DE DETALLES ---
const isDetalleModalOpen = ref(false);
const sesionParaVer = ref<TherapySession | null>(null);


// --- LIFECYCLE ---
onMounted(async () => {
  await loadSessions();
});

// --- CARGA DE DATOS ---
async function loadSessions() {
  isLoading.value = true;
  try {
    // ✅ REEMPLAZADO: Ahora llama a la función del servicio que obtiene todas las sesiones.
    sessions.value = await getAllTherapySessions();
  } catch (error) {
    console.error('Error al cargar sesiones:', error);
    alertModal.error('Error', 'No se pudieron cargar las sesiones. Asegúrate de que el endpoint /api/seguimiento/sesiones-terapia/all/ exista en el backend.');
  } finally {
    isLoading.value = false;
  }
}

// --- COMPUTED ---
const filteredSessions = computed(() => {
  return sessions.value.filter(session => {
    const matchesSearch = !searchQuery.value || 
      (session.child_name && session.child_name.toLowerCase().includes(searchQuery.value.toLowerCase()));
    const matchesStatus = !filterStatus.value || session.attendance_status === filterStatus.value;
    const matchesDate = !filterDate.value || (session.scheduled_date && session.scheduled_date.startsWith(filterDate.value));
    
    return matchesSearch && matchesStatus && matchesDate;
  });
});

// --- UTILIDADES ---
function getStatusClass(status: string | null) {
  const classes: { [key: string]: string } = {
    asistio: 'bg-green-100 text-green-800',
    pendiente: 'bg-yellow-100 text-yellow-800',
    cancelado_familia: 'bg-red-100 text-red-800',
    // Añade más estados si los tienes en tu modelo
  };
  return classes[status || 'pendiente'] || 'bg-gray-100 text-gray-800';
}

function getStatusLabel(status: string | null) {
  const labels: { [key: string]: string } = {
    asistio: 'Asistió',
    pendiente: 'Pendiente',
    cancelado_familia: 'Cancelada',
    // Añade más etiquetas si las tienes
  };
  return labels[status || 'pendiente'] || status || 'No definido';
}

function formatDate(date: string) {
  if (!date) return 'Sin fecha';
  return new Date(date).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
}

// --- ACCIONES ---
function documentarSesion(session: TherapySession) {
  // ✅ CORREGIDO: Se pasan ambos IDs dinámicamente a la ruta de documentación.
  router.push({ 
    name: 'documentar-sesion',
    params: { 
      // La API anidada necesita tanto el ID del niño como el de la sesión.
      childId: session.child, 
      sessionId: session.id 
    } 
  });
}

function verDetalleSesion(session: TherapySession) {
  sesionParaVer.value = session;
  isDetalleModalOpen.value = true;
}

function crearNuevaSesion() {
  // TODO: Implementar un modal que primero pregunte para qué niño es la sesión
  alertModal.info('Próximamente', 'La funcionalidad para crear una nueva sesión desde esta vista estará disponible pronto.');
}
</script>
