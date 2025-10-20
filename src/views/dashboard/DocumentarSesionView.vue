<template>
  <div class="documentacion-vista bg-gray-50 min-h-screen">
    <!-- 1. Cabecera de la Vista -->
    <CabeceraDocumentacion
      v-if="sessionData"
      :child-name="sessionData.child_name || 'Niño'"
      :session-number="sessionData.session_number"
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
        #default="{ value }"
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
import { getTherapySessionById, updateTherapySession } from '@/services/sessionService'
import { useAlertModalStore } from '@/store/alertModalStore'

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

const childId = Number(route.params.childId)
const sessionId = Number(route.params.sessionId)

const sessionData = ref<any>(null)
const isLoading = ref(true)
const isSaving = ref(false)

onMounted(() => {
  if (!childId || !sessionId) {
    alertModal.error('Error', 'No se ha proporcionado un ID de niño o sesión válido en la URL.')
    router.push({ name: 'dashboard' })
    return
  }
  cargarDatosSesion()
})

async function cargarDatosSesion() {
  isLoading.value = true
  try {
    const data = await getTherapySessionById(childId, sessionId)
    sessionData.value = data
    sessionData.value.child_name = "Nombre del Niño" // Placeholder
  } catch (error) {
    console.error("Error al cargar la sesión:", error)
    alertModal.error('Error de Carga', 'No se pudieron cargar los datos de la sesión.')
  } finally {
    isLoading.value = false
  }
}

async function handleGuardarInforme(formData: any, node: FormKitNode) {
  isSaving.value = true
  try {
    const { child_name, ...payload } = formData
    await updateTherapySession(childId, sessionId, payload)
    
    alertModal.success('Informe Guardado', 'La documentación de la sesión se ha guardado correctamente.')
    navegarAlPerfil()
  } catch (error: any) {
    console.error("Error al guardar el informe:", error)
    if (error.response && error.response.status === 400) {
      node.setErrors(error.response.data)
    } else {
      alertModal.error('Error al Guardar', 'Ocurrió un problema al intentar guardar el informe.')
    }
  } finally {
    isSaving.value = false
  }
}

function navegarAlPerfil() {
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

