<template>
  <div class="documentacion-vista bg-gray-50 min-h-screen">
    <!-- 1. Cabecera de la Vista - CORREGIDO: Pasando todas las props -->
    <CabeceraDocumentacion
      v-if="sessionData"
      :child-name="sessionData.child_name || 'Niño'"
      :session-number="sessionData.session_number"
      :child-rut="sessionData.child_rut"
      :guardian-name="sessionData.guardian_name"
      :entry-date="sessionData.entry_date"
      :total-sessions="sessionData.total_sessions"
      @volver="navegarAlPerfil"
    />

    <!-- Estado de Carga -->
    <div v-if="isLoading" class="loading-state">
      <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600 mt-4">Cargando datos de la sesión...</p>
    </div>

    <!-- Contenido Principal del Formulario -->
    <main v-if="!isLoading && sessionData" class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <FormKit
        type="form"
        v-model="sessionData"
        @submit="handleGuardarInforme"
        :actions="false"
        
      >
        <!-- Layout de 2 Columnas -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Columna Principal (Izquierda) -->
          <div class="lg:col-span-2 flex flex-col gap-8">
            <!-- ✅ CORRECCIÓN: Se pasan ambos props necesarios al componente hijo -->
            <GestionObjetivosSesion :child-id="childId" :session-id="sessionId" />
            <SeccionNotasClinicas />
            <SeccionIntervenciones />
            <SeccionPlanificacionFutura />
          </div>

          <!-- Columna Lateral (Derecha) -->
          <div class="lg:col-span-1">
            <div class="sticky top-24">
              <SeccionEstadoAsistencia />
            </div>
          </div>
        </div>

        <!-- Acciones del Formulario (Guardar / Cancelar) -->
        <div class="mt-12 pt-6 border-t border-gray-200 flex justify-end items-center gap-4">
          <button
            type="button"
            class="px-6 py-2 bg-white border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="navegarAlPerfil"
          >
            Cancelar
          </button>
          <FormKit
            type="submit"
            :label="isSaving ? 'Guardando...' : 'Guardar Informe'"
            :disabled="isSaving"
          />
        </div>
      </FormKit>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { FormKitNode } from '@formkit/core'
import { getTherapySessionById, updateTherapySession, type TherapySessionDetail } from '@/services/sessionService'
import { useAlertModalStore } from '@/store/alertModalStore'
import { useAlertStore } from '@/store/alertStore'

// Importar los componentes de sección
import CabeceraDocumentacion from '@/components/sesiones/documentacion-sesion/CabeceraDocumentacion.vue'
import SeccionEstadoAsistencia from '@/components/sesiones/documentacion-sesion/SeccionEstadoAsistencia.vue'
import SeccionNotasClinicas from '@/components/sesiones/documentacion-sesion/SeccionNotasClinicas.vue'
import SeccionIntervenciones from '@/components/sesiones/documentacion-sesion/SeccionIntervenciones.vue'
import SeccionPlanificacionFutura from '@/components/sesiones/documentacion-sesion/SeccionPlanificacionFutura.vue'
import GestionObjetivosSesion from '@/components/sesiones/documentacion-sesion/GestionObjetivosSesion.vue'

const route = useRoute()
const router = useRouter()
const alertModal = useAlertModalStore()
const alert = useAlertStore()

const childId = Number(route.params.childId)
const sessionId = Number(route.params.sessionId)

// CORREGIDO: Usar el tipo específico TherapySessionDetail
const sessionData = ref<TherapySessionDetail | null>(null)
const isLoading = ref(true)
const isSaving = ref(false)

// DEBUG: Log para verificar que el componente padre se monta
onMounted(() => {
  console.log('🏠 Componente padre DocumentacionSesion.vue - MONTADO')
  console.log('🔗 Parámetros de ruta:', { childId, sessionId })
  
  if (!childId || !sessionId) {
    console.error('❌ Error: childId o sessionId no válidos')
    alertModal.error('Error', 'No se ha proporcionado un ID de niño o sesión válido en la URL.')
    router.push({ name: 'dashboard' })
    return
  }
  cargarDatosSesion()
})

async function cargarDatosSesion() {
  console.log('🔄 Iniciando carga de datos de sesión...')
  isLoading.value = true
  try {
    console.log(`📡 Llamando a getTherapySessionById(${childId}, ${sessionId})`)
    const data = await getTherapySessionById(childId, sessionId)
    console.log('✅ Datos recibidos del backend:', data)
    
    sessionData.value = data
    // ❌ ELIMINADO: No sobrescribir child_name con valor fijo
    // sessionData.value.child_name = "Nombre del Niño" // <- ESTO CAUSABA EL PROBLEMA
    
    console.log('📦 sessionData después de asignar:', sessionData.value)
  } catch (error) {
    console.error("❌ Error al cargar la sesión:", error)
    alertModal.error('Error de Carga', 'No se pudieron cargar los datos de la sesión.')
  } finally {
    isLoading.value = false
    console.log('🏁 Carga de datos completada, isLoading:', false)
  }
}

async function handleGuardarInforme(formData: any, node: FormKitNode) {
  console.log('💾 Iniciando guardado de informe...', formData)
  isSaving.value = true
  try {
    // Excluir campos que no son parte del modelo TherapySession base
    const { child_name, child_rut, guardian_name, entry_date, total_sessions, ...payload } = formData
    console.log('📤 Payload para actualizar:', payload)
    
    await updateTherapySession(childId, sessionId, payload)
    
    console.log('✅ Informe guardado exitosamente')
    alert.success('Informe Guardado', 'La documentación de la sesión se ha guardado correctamente.')
    alertModal.success('Informe Guardado', 'La documentación de la sesión se ha guardado correctamente.')
    
    navegarAlPerfil()
  } catch (error: any) {
    console.error("❌ Error al guardar el informe:", error)
    if (error.response && error.response.status === 400) {
      console.error('📋 Errores de validación:', error.response.data)
      node.setErrors(error.response.data)
    } else {
      alertModal.error('Error al Guardar', 'Ocurrió un problema al intentar guardar el informe.')
      alert.error('Error al Guardar', 'Ocurrió un problema al intentar guardar el informe.')
    }
  } finally {
    isSaving.value = false
    console.log('🏁 Guardado completado, isSaving:', false)
  }
}

function navegarAlPerfil() {
  console.log('🔙 Navegando al perfil del niño...')
  if (childId) {
    router.push({ name: 'perfil-nino', params: { id: childId } })
  } else {
    router.push({ name: 'dashboard' })
  }
}
</script>

<style scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  min-height: 50vh;
}
</style>