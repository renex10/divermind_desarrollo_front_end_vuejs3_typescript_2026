<template>
  <div class="session-detail-view bg-gray-50 min-h-screen">
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-500 animate-pulse">Cargando expediente clínico...</p>
      </div>
    </div>

    <div v-else-if="session" class="max-w-7xl mx-auto px-4 py-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">
                Sesión #{{ session.session_number }}
              </span>
              <h1 class="text-2xl font-bold text-gray-900">{{ session.child_name }}</h1>
            </div>
            <p class="text-gray-500 text-sm italic">
              RUT: {{ session.child_rut }} | Fecha: {{ formatDateFull(session.scheduled_date) }}
            </p>
          </div>
          <div class="flex gap-3">
            <button @click="$router.back()" class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Volver
            </button>
            <button @click="irADocumentar" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
              Editar Documentación
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 class="font-bold text-gray-800">Resumen de la Intervención</h3>
            </div>
            <div class="p-6 space-y-6">
              <section>
                <h4 class="text-sm font-semibold text-blue-600 uppercase mb-2">Objetivos de la Sesión</h4>
                <p class="text-gray-700 leading-relaxed bg-blue-50/30 p-4 rounded-lg border border-blue-100 italic">
                  "{{ session.objectives }}"
                </p>
              </section>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section>
                  <h4 class="text-sm font-semibold text-gray-800 mb-2">Fortalezas Observadas</h4>
                  <p class="text-gray-600 text-sm leading-relaxed">{{ session.strengths_observed || 'Sin registros' }}</p>
                </section>
                <section>
                  <h4 class="text-sm font-semibold text-gray-800 mb-2">Desafíos Encontrados</h4>
                  <p class="text-gray-600 text-sm leading-relaxed">{{ session.challenges_encountered || 'Sin registros' }}</p>
                </section>
              </div>

              <section>
                <h4 class="text-sm font-semibold text-gray-800 mb-2">Técnicas Aplicadas</h4>
                <div class="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-100 font-medium">
                  {{ session.techniques_applied || 'No especificado' }}
                </div>
              </section>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden border-l-4 border-l-amber-400">
            <div class="p-6">
              <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                Proyección para Próxima Sesión
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 class="text-xs font-bold text-gray-500 uppercase">Foco Sugerido</h4>
                  <p class="mt-1 text-gray-800 font-medium">{{ session.next_session_focus || 'Por definir' }}</p>
                </div>
                <div>
                  <h4 class="text-xs font-bold text-gray-500 uppercase">Recomendaciones</h4>
                  <p class="mt-1 text-gray-700 text-sm leading-relaxed">{{ session.next_session_recommendations || 'Sin recomendaciones' }}</p>
                </div>
              </div>
            </div>
          </div>

          <TablaSessionForId 
            :sessions="history" 
            :currentSessionId="Number(sessionId)"
            @select="cambiarSesion"
          />
        </div>

        <div class="space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="font-bold text-gray-800 mb-4 border-b pb-2">Datos de Gestión</h3>
            <ul class="space-y-4">
              <li class="flex justify-between items-center text-sm">
                <span class="text-gray-500">Estado:</span>
                <span :class="getStatusClass(session.attendance_status)" class="px-2 py-1 rounded text-xs font-bold uppercase">
                  {{ session.attendance_status_display || 'Pendiente' }}
                </span>
              </li>
              <li class="flex justify-between items-center text-sm">
                <span class="text-gray-500">Modalidad:</span>
                <span class="font-medium text-gray-800">{{ session.modality_display || session.modality }}</span>
              </li>
              <li class="flex justify-between items-center text-sm">
                <span class="text-gray-500">Duración:</span>
                <span class="font-medium text-gray-800">{{ session.duration_minutes }} minutos</span>
              </li>
              <li class="flex justify-between items-center text-sm border-t pt-4">
                <span class="text-gray-500">Terapeuta:</span>
                <span class="font-bold text-blue-600">{{ session.therapist_name }}</span>
              </li>
            </ul>
          </div>

          <div class="bg-blue-600 rounded-xl shadow-lg p-6 text-white">
            <h3 class="font-bold mb-2 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              Evolución del Paciente
            </h3>
            <p class="text-xs text-blue-100 mb-4 italic">Datos consolidados del perfil.</p>
            <div class="space-y-3">
              <div class="bg-blue-500/30 p-3 rounded-lg border border-white/10">
                <p class="text-xs opacity-80 uppercase font-bold tracking-wider">Sesiones Totales</p>
                <p class="text-3xl font-black">{{ session.total_sessions }}</p>
              </div>
              <div class="bg-blue-500/30 p-3 rounded-lg border border-white/10">
                <p class="text-xs opacity-80 uppercase font-bold tracking-wider">Fecha de Ingreso</p>
                <p class="text-sm font-bold">{{ formatDateSimple(session.entry_date) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getTherapySessionById, getTherapySessionsForChild, type TherapySession, type TherapySessionDetail } from '@/services/sessionService'
import { useAlertModalStore } from '@/store/alertModalStore'
import TablaSessionForId from '@/components/sesiones/tabla/TablaSessionForId.vue'

const props = defineProps<{
  childId: string | number
  sessionId: string | number
}>()

const router = useRouter()
const alertModal = useAlertModalStore()

const session = ref<TherapySessionDetail | null>(null)
const history = ref<TherapySession[]>([])
const isLoading = ref(true)

/**
 * Carga inicial de datos coordinada.
 * Se integra el llamado al historial por childId.
 */
const cargarDatos = async () => {
  isLoading.value = true
  try {
    const cId = Number(props.childId)
    const sId = Number(props.sessionId)

    // Llamadas concurrentes para optimizar carga
    const [detalleRes, historialRes] = await Promise.all([
      getTherapySessionById(cId, sId),
      getTherapySessionsForChild(cId)
    ])

    session.value = detalleRes
    history.value = historialRes
  } catch (error) {
    console.error("Error al cargar expediente:", error)
    alertModal.error('Error', 'No se pudo recuperar la información del paciente.')
    router.back()
  } finally {
    isLoading.value = false
  }
}

onMounted(cargarDatos)

// Vigilar cambios en sessionId para refrescar la vista cuando se selecciona otra del historial
watch(() => props.sessionId, cargarDatos)

function formatDateFull(date: string) {
  if (!date) return '---'
  return new Date(date).toLocaleDateString('es-CL', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  })
}

function formatDateSimple(date: string) {
  if (!date) return '---'
  return new Date(date).toLocaleDateString('es-CL', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  })
}

function getStatusClass(status: string | null) {
  const styles: Record<string, string> = {
    asistio: 'bg-green-100 text-green-700',
    pendiente: 'bg-amber-100 text-amber-700',
    cancelado_familia: 'bg-red-100 text-red-700',
  }
  return styles[status || 'pendiente'] || 'bg-gray-100 text-gray-700'
}

function cambiarSesion(s: TherapySession) {
  router.push({ 
    name: 'detalle-sesion-especifica', 
    params: { childId: props.childId, sessionId: s.id } 
  })
}

function irADocumentar() {
  router.push({ 
    name: 'documentar-sesion',
    params: { childId: props.childId, sessionId: props.sessionId } 
  })
}
</script>

<style scoped>
.session-detail-view {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>