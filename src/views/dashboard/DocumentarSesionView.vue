<template>
  <div class="documentacion-vista bg-gray-50 min-h-screen">
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

    <div v-if="isLoading" class="loading-state">
      <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600 mt-4 font-medium">Sincronizando expediente clínico...</p>
    </div>

    <main v-if="!isLoading && sessionData" class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <FormKit
        type="form"
        v-model="sessionData"
        @submit="handleGuardarInforme"
        :actions="false"
      >
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 flex flex-col gap-8">
            <GestionObjetivosSesion 
              ref="objetivosRef"
              :child-id="childId" 
              :session-id="sessionId" 
            />
            <SeccionRegistroRutina 
              ref="rutinaRef"
              :child-id="childId"
              :session-id="sessionId"
            />
            <SeccionNotasClinicas />
            <SeccionIntervenciones />
            <AsistenteIAWidget 
              :loading="isGeneratingIA"
              :draft-focus="iaDraftFocus"
              :draft-recommendations="iaDraftRecommendations"
              @generar="prepararYGenerarIA"
              @aplicar-foco="aplicarFoco"
              @aplicar-familia="aplicarFamilia"
              @descartar="limpiarBorradoresIA"
              @edit-focus="abrirEditorIA('foco')"
              @edit-recommendations="abrirEditorIA('familia')"
            />
            <SeccionPlanificacionFutura />
          </div>
          <div class="lg:col-span-1">
            <div class="sticky top-24">
              <SeccionEstadoAsistencia />
            </div>
          </div>
        </div>

        <div class="mt-12 pt-6 border-t border-gray-200 flex justify-end items-center gap-4">
          <button
            type="button"
            class="px-6 py-2 bg-white border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            @click="navegarAlPerfil"
          >
            Cancelar
          </button>
          <FormKit
            type="submit"
            :label="isSaving ? 'Guardando...' : 'Guardar Informe Final'"
            :disabled="isSaving"
          />
        </div>
      </FormKit>
    </main>

    <BaseModal 
      :show="showIAEditor" 
      :title="editorTitle"
      size="lg"
      @close="showIAEditor = false"
    >
      <div class="space-y-4">
        <div class="bg-blue-50 border-l-4 border-blue-400 p-3">
          <p class="text-xs text-blue-700 leading-relaxed">
            <strong>Criterio Profesional:</strong> Revisa y ajusta la propuesta de la IA antes de incorporarla al expediente clínico.
          </p>
        </div>
        <textarea 
          v-model="tempEditorContent" 
          class="w-full h-64 p-4 border border-purple-100 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm leading-relaxed text-gray-700 shadow-inner"
        ></textarea>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showIAEditor = false" class="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Descartar</button>
          <button @click="confirmarEdicionIA" class="px-6 py-2 bg-purple-600 text-white rounded-md text-sm font-bold hover:bg-purple-700 transition-all shadow-md active:scale-95">
            Confirmar Edición
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTherapySessionById, updateTherapySession, type TherapySessionDetail } from '@/services/sessionService'
import { useAlertModalStore } from '@/store/alertModalStore'
import { useAlertStore } from '@/store/alertStore'
import { aiService, type AIAnalysisPayload } from '@/services/ia/aiService'
import AsistenteIAWidget from '@/components/sesiones/widget/ia/AsistenteIAWidget.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import CabeceraDocumentacion from '@/components/sesiones/documentacion-sesion/CabeceraDocumentacion.vue'
import SeccionEstadoAsistencia from '@/components/sesiones/documentacion-sesion/SeccionEstadoAsistencia.vue'
import SeccionNotasClinicas from '@/components/sesiones/documentacion-sesion/SeccionNotasClinicas.vue'
import SeccionIntervenciones from '@/components/sesiones/documentacion-sesion/SeccionIntervenciones.vue'
import SeccionPlanificacionFutura from '@/components/sesiones/documentacion-sesion/SeccionPlanificacionFutura.vue'
import GestionObjetivosSesion from '@/components/sesiones/documentacion-sesion/GestionObjetivosSesion.vue'
import SeccionRegistroRutina from '@/components/sesiones/documentacion-sesion/SeccionRegistroRutina.vue'

const route = useRoute()
const router = useRouter()
const alertModal = useAlertModalStore()
const alert = useAlertStore()

const objetivosRef = ref<any>(null)
const rutinaRef = ref<any>(null)
const childId = Number(route.params.childId)
const sessionId = Number(route.params.sessionId)
const sessionData = ref<TherapySessionDetail | null>(null)
const isLoading = ref(true)
const isSaving = ref(false)
const isGeneratingIA = ref(false)
const iaDraftFocus = ref('')
const iaDraftRecommendations = ref('')
const showIAEditor = ref(false)
const editorTitle = ref('')
const tempEditorContent = ref('')
const editingType = ref<'foco' | 'familia' | null>(null)

onMounted(cargarDatosSesion)

async function cargarDatosSesion() {
  isLoading.value = true
  try {
    sessionData.value = await getTherapySessionById(childId, sessionId)
  } catch (error) {
    alertModal.error('Error', 'No se pudieron recuperar los datos clínicos.')
  } finally {
    isLoading.value = false
  }
}

async function prepararYGenerarIA() {
  if (!sessionData.value) return
  isGeneratingIA.value = true
  try {
    const payload: AIAnalysisPayload = {
      objectives: sessionData.value.objectives || '',
      strengths: sessionData.value.strengths_observed || '',
      challenges: sessionData.value.challenges_encountered || '',
      techniques: sessionData.value.techniques_applied || '',
      session_number: sessionData.value.session_number,
      emotional_state_start: sessionData.value.emotional_state_start || 'neutral',
      emotional_state_end: sessionData.value.emotional_state_end || 'neutral',
      goals_progress: objetivosRef.value?.getGoalsData() || [],
      step_performance: rutinaRef.value?.getPerformanceData() || []
    }
    const response = await aiService.getPlanningSuggestion(payload)
    iaDraftFocus.value = response.draft_focus
    iaDraftRecommendations.value = response.draft_recommendations
    alert.success('IA DiverMind', 'Análisis clínico completado.')
  } catch (error) {
    alert.error('Error', 'No se pudo conectar con el motor de IA.')
  } finally {
    isGeneratingIA.value = false
  }
}

function abrirEditorIA(tipo: 'foco' | 'familia') {
  editingType.value = tipo
  if (tipo === 'foco') {
    editorTitle.value = 'Refinar Foco Terapéutico'
    tempEditorContent.value = iaDraftFocus.value
  } else {
    editorTitle.value = 'Refinar Recomendación Familiar'
    tempEditorContent.value = iaDraftRecommendations.value
  }
  showIAEditor.value = true
}

function confirmarEdicionIA() {
  if (editingType.value === 'foco') {
    iaDraftFocus.value = tempEditorContent.value
  } else {
    iaDraftRecommendations.value = tempEditorContent.value
  }
  showIAEditor.value = false
  alert.info('Cambios Guardados', 'Sugerencia refinada exitosamente.')
}

function aplicarFoco() {
  if (sessionData.value && iaDraftFocus.value) {
    sessionData.value.next_session_focus = iaDraftFocus.value
    iaDraftFocus.value = '' 
    alert.success('Actualizado', 'Foco terapéutico inyectado.')
  }
}

function aplicarFamilia() {
  if (sessionData.value && iaDraftRecommendations.value) {
    sessionData.value.homework_assigned = iaDraftRecommendations.value
    sessionData.value.next_session_recommendations = iaDraftRecommendations.value
    iaDraftRecommendations.value = '' 
    alert.success('Actualizado', 'Orientación familiar completada.')
  }
}

function limpiarBorradoresIA() {
  iaDraftFocus.value = ''
  iaDraftRecommendations.value = ''
}

async function handleGuardarInforme(formData: any) {
  isSaving.value = true
  try {
    const { child_name, child_rut, guardian_name, entry_date, total_sessions, ...payload } = formData
    await updateTherapySession(childId, sessionId, payload)
    if (rutinaRef.value) await rutinaRef.value.savePerformance()
    alertModal.success('Sincronizado', 'El expediente clínico ha sido actualizado.')
    router.push({ 
      name: 'detalle-sesion-especifica', 
      params: { childId: String(childId), sessionId: String(sessionId) } 
    })
  } catch (error: any) {
    alertModal.error('Error', 'No se pudieron guardar los cambios.')
  } finally {
    isSaving.value = false
  }
}

function navegarAlPerfil() {
  router.push({ name: 'perfil-nino', params: { id: childId } })
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