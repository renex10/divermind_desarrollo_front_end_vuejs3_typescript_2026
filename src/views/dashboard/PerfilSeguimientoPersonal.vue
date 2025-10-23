<template>
  <div class="perfil-seguimiento">
    <PerfilHeader
      :nna-data="headerData"
      @ver-dashboard="verDashboard"
      @exportar-datos="exportarDatos"
    />

    <div class="tabs-container">
      <nav class="tabs-nav">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab-button', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <component :is="tab.icon" class="icon-sm" />
          {{ tab.label }}
        </button>
      </nav>

      <TabContent
        :active-tab="activeTab"
        :profile-data="profileData"
        :child-id="childId"
        :loading="loading"
        :contactos="contactos"
        :diagnosticos="diagnosticosList"
        :historial-count="historialCount"
        :medicamentos-count="medicamentosCount"
        :loading-sesiones="loadingSesiones"
        :sesiones="sesiones"
        :stats-sesiones="statsSesiones"
        :periodo="periodo"
        :metricas="metricas"
        :registros-recientes="registrosRecientes"
        :loading-documentos="loadingDocumentos"
        :documentos="documentos"
        :stats-documentos="statsDocumentos"
        :interest-update-key="interestUpdateKey"
        @gestionar-contactos="gestionarContactos"
        @ver-historial-completo="verHistorialCompleto"
        @cargar-sesiones="cargarSesiones"
        @abrir-modal-sesion="abrirModalSesion"
        @ver-detalle-sesion="verDetalleSesion"
        @editar-sesion="editarSesion"
        @update:periodo="(value) => (periodo = value)"
        @cargar-hitos-desarrollo="cargarHitosDesarrollo"
        @cargar-progresos-comunicacion="cargarProgresosComunicacion"
        @cargar-habilidades-sociales="cargarHabilidadesSociales"
        @cargar-documentos="cargarDocumentos"
        @subir-documento="subirDocumento"
        @descargar-documento="descargarDocumento"
        @ver-documento="verDocumento"
        @eliminar-documento="eliminarDocumento"
        @generar-reporte-completo="generarReporteCompleto"
        @comparar-progreso="compararProgreso"
        @exportar-datos="exportarDatos"
        @ver-dashboard="verDashboard"
        @generar-reporte-sesiones="generarReporteSesiones"
        @generar-reporte-progreso="generarReporteProgreso"
        @generar-reporte-comportamiento="generarReporteComportamiento"
        @generar-reporte-medico="generarReporteMedico"
        @add-diagnosis="abrirModalDiagnostico"
        @gestionar-intereses="abrirModalIntereses"
      />
    </div>

    <NuevaSession
      v-if="childId"
      v-model:show="showModalSesion"
      :child-id="parseInt(childId)"
      @sesionCreada="handleSesionCreada"
    />

    <DiagnosticoModal
      v-if="childId && showDiagnosticoModal"
      v-model:show="showDiagnosticoModal"
      :child-id="parseInt(childId)"
      @diagnosis-created="handleDiagnosticoCreado"
    />

    <InteresModal
      v-if="childId && showInteresModal"
      v-model:show="showInteresModal"
      :child-id="parseInt(childId)"
      @interest-created="handleInteresCreado"
    />
  </div>
</template>

<script setup lang="ts">
import { profileService } from '@/services/profileService'
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

import PerfilHeader from '@/components/profile/header/PerfilHeader.vue'
import TabContent from '@/components/profile/tabcontent/TabContent.vue'
import NuevaSession from '@/components/forms/sesiones/NuevaSession.vue'
import DiagnosticoModal from '@/components/profile/profile/modals/DiagnosticoModal.vue'
import InteresModal from '@/components/profile/profile/modals/InteresModal.vue'

import {
  getTherapySessionsForChild,
  getTherapyMetricsForChild,
  getDiagnosesForChild,
  type Diagnosis,
  type TherapySession,
  type TherapyMetrics
} from '@/services/sessionService'

import {
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  FolderIcon,
  DocumentChartBarIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const childId = ref<string>(route.params.id as string)

const profileData = ref<any>(null)
const loading = ref(false)
const activeTab = ref('general')

const sesiones = ref<TherapySession[]>([])
const loadingSesiones = ref(false)
const showModalSesion = ref(false)
const statsSesiones = ref({ total: 0, completadas: 0, pendientes: 0, objetivos: 0 })

const diagnosticosList = ref<Diagnosis[]>([])
const showDiagnosticoModal = ref(false)
const loadingDiagnosticos = ref(false)

const showInteresModal = ref(false)
const interestUpdateKey = ref(0)

const periodo = ref('30d')
const documentos = ref<any[]>([])
const loadingDocumentos = ref(false)
const metricas = ref({ hitos_desarrollo: 0, progresos_comunicacion: 0, habilidades_sociales: 0 })
const statsDocumentos = ref({ total: 0, imagenes: 0, videos: 0, reportes: 0 })
const registrosRecientes = ref([])

const headerData = computed(() => profileData.value?.header || null)
const contactos = computed(() => profileData.value?.emergencyContacts || [])
const historialCount = computed(() => 0)
const medicamentosCount = computed(() => {
  return profileData.value?.cards?.medical?.has_medication ? 1 : 0
})

const tabs = ref([
  { id: 'general', label: 'Información General', icon: UserCircleIcon },
  { id: 'sesiones', label: 'Sesiones de Terapia', icon: ChatBubbleLeftRightIcon },
  { id: 'progreso', label: 'Progreso y Métricas', icon: ChartBarIcon },
  { id: 'documentos', label: 'Documentos', icon: FolderIcon },
  { id: 'reportes', label: 'Reportes', icon: DocumentChartBarIcon }
])

onMounted(async () => {
  if (!childId.value) return

  loading.value = true
  loadingSesiones.value = true
  loadingDiagnosticos.value = true

  await Promise.all([
    cargarDatosNino(),
    cargarSesiones(),
    cargarMetricasSesiones(),
    cargarDiagnosticos()
  ])

  loading.value = false
})

watch(
  () => route.params.id,
  (newId) => {
    childId.value = newId as string
    if (childId.value) {
      cargarDatosNino()
      cargarSesiones()
      cargarMetricasSesiones()
      cargarDiagnosticos()
      interestUpdateKey.value++
    }
  }
)

const cargarDatosNino = async () => {
  if (!childId.value) return
  loading.value = true
  try {
    console.log(`🔄 Cargando perfil del niño ID: ${childId.value}`)
    const data = await profileService.getChildProfile(childId.value)
    profileData.value = data
    console.log('✅ Datos completos cargados:', profileData.value)
  } catch (error) {
    console.error('❌ Error cargando perfil:', error)
  } finally {
    loading.value = false
  }
}

const cargarSesiones = async () => {
  if (!childId.value) return
  loadingSesiones.value = true
  try {
    console.log(`⏳ Cargando sesiones para el niño ID: ${childId.value}...`)
    const data = await getTherapySessionsForChild(parseInt(childId.value))
    sesiones.value = data
    console.log(`✅ ${data.length} sesiones cargadas.`)
  } catch (error) {
    console.error('❌ Error cargando sesiones:', error)
    sesiones.value = []
  } finally {
    loadingSesiones.value = false
  }
}

const cargarMetricasSesiones = async () => {
  if (!childId.value) return
  try {
    console.log(`⏳ Cargando métricas de sesiones para el niño ID: ${childId.value}...`)
    const metrics: TherapyMetrics = await getTherapyMetricsForChild(parseInt(childId.value))
    statsSesiones.value = {
      total: metrics.sessions_count,
      completadas: metrics.completed_sessions,
      pendientes: metrics.upcoming_sessions,
      objetivos: metrics.goals_count
    }
    console.log('✅ Métricas de sesiones cargadas:', statsSesiones.value)
  } catch (error) {
    console.error('❌ Error cargando métricas de sesiones:', error)
    statsSesiones.value = { total: 0, completadas: 0, pendientes: 0, objetivos: 0 }
  }
}

const cargarDiagnosticos = async () => {
  if (!childId.value) return
  loadingDiagnosticos.value = true
  try {
    console.log(`⏳ Cargando diagnósticos para el niño ID: ${childId.value}...`)
    const data = await getDiagnosesForChild(parseInt(childId.value))
    diagnosticosList.value = data
    console.log(`✅ ${data.length} diagnósticos cargados.`)
  } catch (error) {
    console.error('❌ Error al cargar diagnósticos:', error)
    diagnosticosList.value = []
  } finally {
    loadingDiagnosticos.value = false
  }
}

const cargarDocumentos = async () => {
  if (!childId.value) return
  loadingDocumentos.value = true
  try {
    console.log('⏳ Cargando documentos...')
    documentos.value = []
  } catch (error) {
    console.error('❌ Error cargando documentos:', error)
  } finally {
    loadingDocumentos.value = false
  }
}

const gestionarContactos = () => { console.log('📞 Gestionar contactos') }
const verHistorialCompleto = () => { console.log('📋 Ver historial completo') }

const abrirModalSesion = () => {
  showModalSesion.value = true
}

const abrirModalDiagnostico = () => {
  console.log('➕ Abriendo modal para agregar diagnóstico...')
  showDiagnosticoModal.value = true
}

const abrirModalIntereses = () => {
  console.log('✨ Abriendo modal para gestionar intereses...')
  showInteresModal.value = true
}

const handleInteresCreado = () => {
  console.log('💡 Interés creado/actualizado. Cerrando modal y forzando recarga de tarjeta.')
  showInteresModal.value = false
  interestUpdateKey.value++
}

const handleDiagnosticoCreado = () => {
  console.log('🩺 Diagnóstico creado exitosamente. Recargando lista...')
  showDiagnosticoModal.value = false
  cargarDiagnosticos()
}

const handleSesionCreada = () => {
  console.log('🎉 Sesión creada exitosamente, recargando la lista y métricas...')
  cargarSesiones()
  cargarMetricasSesiones()
}

const verDetalleSesion = (id: number) => { console.log(`👁️ Ver detalle sesión ${id}`) }
const editarSesion = (id: number) => { console.log(`✏️ Editar sesión ${id}`) }
const cargarHitosDesarrollo = () => { console.log('📈 Cargar hitos de desarrollo') }
const cargarProgresosComunicacion = () => { console.log('💬 Cargar progresos de comunicación') }
const cargarHabilidadesSociales = () => { console.log('👥 Cargar habilidades sociales') }
const subirDocumento = () => { console.log('📤 Subir documento') }
const descargarDocumento = (id: number) => { console.log(`💾 Descargar documento ${id}`) }
const verDocumento = (id: number) => { console.log(`👁️ Ver documento ${id}`) }
const eliminarDocumento = (id: number) => { console.log(`🗑️ Eliminar documento ${id}`) }
const exportarDatos = () => { console.log('📊 Exportar datos') }
const verDashboard = () => { console.log('📊 Ver dashboard') }
const generarReporteCompleto = () => { console.log('📄 Generar reporte completo') }
const compararProgreso = () => { console.log('📊 Comparar progreso') }
const generarReporteSesiones = () => { console.log('📄 Generar reporte de sesiones') }
const generarReporteProgreso = () => { console.log('📄 Generar reporte de progreso') }
const generarReporteComportamiento = () => { console.log('📄 Generar reporte de comportamiento') }
const generarReporteMedico = () => { console.log('📄 Generar reporte médico') }
</script>

<style scoped>
.perfil-seguimiento {
  min-height: 100vh;
  background: #f8fafc;
}

.tabs-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.tabs-nav {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 2rem;
  overflow-x: auto;
}

.tab-button {
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-button:hover {
  color: #374151;
}

.tab-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

@media (max-width: 768px) {
  .tabs-container {
    padding: 1rem;
  }

  .tabs-nav {
    flex-wrap: wrap;
  }

  .tab-button {
    flex: 1;
    min-width: 120px;
    text-align: center;
    justify-content: center;
  }
}
</style>