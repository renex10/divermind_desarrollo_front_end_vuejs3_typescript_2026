<template>
  <div class="sesiones-vista bg-gray-50 min-h-screen">
    <div class="bg-white shadow-sm border-b border-gray-200 mb-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Gestión de Sesiones</h1>
            <p class="mt-1 text-sm text-gray-600">
              Mostrando la actividad más reciente por paciente para optimizar su gestión.
            </p>
          </div>
          <button @click="crearNuevaSesion" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nueva Sesión
          </button>
        </div>
      </div>
    </div>

    <main v-if="!isLoading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input v-model="searchQuery" type="text" placeholder="Buscar niño..." class="px-3 py-2 border rounded-md text-sm" />
          <div class="flex items-center px-3 text-xs text-gray-500 bg-gray-50 rounded-md border">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Vista simplificada: Una fila por niño
          </div>
        </div>
      </div>

      <div v-if="uniqueChildSessions.length > 0">
        <TablaSessions 
          :sessions="uniqueChildSessions"
          @view="manejarNavegacionSesion"
          @document="(s) => manejarNavegacionSesion(s, true)"
        />
      </div>

      <div v-else class="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
        <h3 class="text-sm font-medium text-gray-900">No hay sesiones activas</h3>
      </div>
    </main>

    <div v-if="showPreDocModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showPreDocModal = false"></div>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-blue-600 px-4 py-3 font-bold text-white">Contexto Clínico Anterior</div>
          <div class="p-6">
            <div v-if="selectedSessionForDoc" class="space-y-4">
              <p class="text-sm border-b pb-2 font-bold">{{ selectedSessionForDoc.child_name }}</p>
              <div class="bg-amber-50 p-4 rounded-lg border border-amber-100">
                 <p class="text-xs text-amber-800 font-bold uppercase mb-1">Último Foco Terapéutico:</p>
                 <p class="text-sm text-amber-900 leading-relaxed italic">
                   {{ selectedSessionForDoc.next_session_focus || 'Sin foco definido previamente.' }}
                 </p>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse gap-2">
            <button @click="confirmarDocumentacion" class="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-blue-700 transition-colors">
              Comenzar Documentación
            </button>
            <button @click="showPreDocModal = false" class="text-gray-600 text-sm px-4 py-2 hover:underline">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// Importación del servicio y tipos para gestionar sesiones
import { getAllTherapySessions, type TherapySession } from '@/services/sessionService'; 
import TablaSessions from '@/components/sesiones/tabla/TablaSessions.vue';
import { useAlertModalStore } from '@/store/alertModalStore';

const router = useRouter();
const alertModal = useAlertModalStore();

const isLoading = ref(true);
const sessions = ref<TherapySession[]>([]);
const searchQuery = ref('');

const showPreDocModal = ref(false);
const selectedSessionForDoc = ref<TherapySession | null>(null);

/**
 * Carga inicial: Obtiene todas las sesiones disponibles para el terapeuta.
 */
onMounted(async () => {
  try {
    sessions.value = await getAllTherapySessions();
  } catch (error) {
    alertModal.error('Error', 'No se pudieron cargar las sesiones desde el servidor.');
  } finally {
    isLoading.value = false;
  }
});

/**
 * LÓGICA DE AGRUPAMIENTO: 
 * Filtra las sesiones para mostrar solo la más reciente de cada niño para reducir carga cognitiva.
 *
 */
const uniqueChildSessions = computed(() => {
  const map = new Map<number, TherapySession>();
  
  // Ordenar por fecha descendente para asegurar que tomamos la última
  const sortedSessions = [...sessions.value].sort((a, b) => 
    new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime()
  );

  for (const session of sortedSessions) {
    if (!map.has(session.child)) {
      const matchesSearch = !searchQuery.value || 
        session.child_name?.toLowerCase().includes(searchQuery.value.toLowerCase());
      
      if (matchesSearch) {
        map.set(session.child, session);
      }
    }
  }
  
  return Array.from(map.values());
});

// --- ACCIONES DE NAVEGACIÓN Y FLUJO ---

/**
 * Lógica de Portero: Decide si enviar al usuario a ver el detalle o a documentar.
 * Reemplaza a 'navegarAHistorial' para corregir errores de TypeScript.
 */
function manejarNavegacionSesion(session: TherapySession, forzarDocumentacion = false) {
  const childId = session.child;
  const sessionId = session.id;

  // Validación de seguridad para IDs
  if (childId === undefined || childId === null) {
    alertModal.warning("Datos Incompletos", "No se pudo identificar al paciente.");
    return;
  }

  // FLUJO SECUENCIAL:
  // Si la sesión no tiene estado 'asistio' o se pide documentar explícitamente -> Ir a Documentar
  // Basado en TherapySession interface
  if (forzarDocumentacion || session.attendance_status !== 'asistio') {
    prepararDocumentacion(session);
  } else {
    // Si ya existe documentación, ir a la vista de resumen (SessionId.vue)
    router.push({ 
      name: 'detalle-sesion-especifica', 
      params: { 
        childId: String(childId),
        sessionId: String(sessionId)
      } 
    });
  }
}

/**
 * Activa el modal de contexto clínico antes de entrar a la documentación.
 */
function prepararDocumentacion(session: TherapySession) {
  selectedSessionForDoc.value = session;
  showPreDocModal.value = true;
}

/**
 * Redirige a la vista de DocumentarSesionView.vue tras confirmar en el modal.
 *
 */
function confirmarDocumentacion() {
  if (selectedSessionForDoc.value) {
    const s = selectedSessionForDoc.value;
    showPreDocModal.value = false;
    router.push({ 
      name: 'documentar-sesion', 
      params: { 
        childId: String(s.child), 
        sessionId: String(s.id) 
      } 
    });
  }
}

function crearNuevaSesion() {
  alertModal.info('Módulo en Desarrollo', 'La creación de nuevas citas estará disponible en la próxima actualización.');
}
</script>