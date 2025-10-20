<!-- src/views/dashboard/PerfilSeguimientoPersonal.vue -->
<template>
  <div class="perfil-seguimiento">
    <!-- HEADER DEL PERFIL -->
    <PerfilHeader
      :nna-data="headerData"
      @ver-dashboard="verDashboard"
      @exportar-datos="exportarDatos"
    />

    <!-- SISTEMA DE PESTAÑAS -->
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

      <!-- CONTENIDO PESTAÑAS -->
      <TabContent
        :active-tab="activeTab"
        :profile-data="profileData"
        :loading="loading"
        :contactos="contactos"
        :diagnosticos="diagnosticos"
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
      />
    </div>

    <!-- MODAL PARA NUEVA SESIÓN -->
    <NuevaSession
      v-if="childId"
      v-model:show="showModalSesion"
      :child-id="parseInt(childId)"
      @sesionCreada="handleSesionCreada"
    />
  </div>
</template>

<script setup lang="ts">
import { profileService } from '@/services/profileService'
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

import PerfilHeader from '@/components/profile/header/PerfilHeader.vue'
import TabContent from '@/components/profile/tabcontent/TabContent.vue'
import NuevaSession from '@/components/forms/sesiones/NuevaSession.vue' // <-- 1. IMPORTADO

import {
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  FolderIcon,
  DocumentChartBarIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const childId = ref<string>(route.params.id as string)

// ========================================
// ESTADO REACTIVO - DATOS DEL API
// ========================================
const profileData = ref<any>(null)
const loading = ref(false)
const activeTab = ref('general')

// Estados para otras pestañas (TODO: Conectar con API)
const sesiones = ref<any[]>([])
const loadingSesiones = ref(false)
const showModalSesion = ref(false) // <-- 2. ESTE ESTADO AHORA CONTROLA EL NUEVO MODAL
const periodo = ref('30d')
const documentos = ref<any[]>([])
const loadingDocumentos = ref(false)

// ========================================
// COMPUTED - DATOS DERIVADOS DEL PERFIL
// ========================================

// Datos para el header
const headerData = computed(() => profileData.value?.header || null)

// Contactos de emergencia desde el API
const contactos = computed(() => profileData.value?.emergencyContacts || [])

// Diagnósticos desde el API (si existen en el perfil PIE)
const diagnosticos = computed(() => {
  if (!profileData.value?.cards?.pie?.diagnosis) return []

  return [
    {
      id: 1,
      type: 'primary',
      description: profileData.value.cards.pie.diagnosis
    }
  ]
})

// Contadores médicos (TODO: Obtener del API cuando estén disponibles)
const historialCount = computed(() => 0)
const medicamentosCount = computed(() => {
  // Contar si tiene medicación actual
  return profileData.value?.cards?.medical?.has_medication ? 1 : 0
})

// Métricas (TODO: Conectar con API real)
const metricas = ref({
  hitos_desarrollo: 0,
  progresos_comunicacion: 0,
  habilidades_sociales: 0
})

// Stats de sesiones (TODO: Conectar con API real)
const statsSesiones = ref({
  total: 0,
  completadas: 0,
  pendientes: 0,
  objetivos: 0
})

// Stats de documentos (TODO: Conectar con API real)
const statsDocumentos = ref({
  total: 0,
  imagenes: 0,
  videos: 0,
  reportes: 0
})

// Registros recientes (TODO: Conectar con API real)
const registrosRecientes = ref([])

// ========================================
// CONFIGURACIÓN DE TABS
// ========================================
const tabs = ref([
  { id: 'general', label: 'Información General', icon: UserCircleIcon },
  { id: 'sesiones', label: 'Sesiones de Terapia', icon: ChatBubbleLeftRightIcon },
  { id: 'progreso', label: 'Progreso y Métricas', icon: ChartBarIcon },
  { id: 'documentos', label: 'Documentos', icon: FolderIcon },
  { id: 'reportes', label: 'Reportes', icon: DocumentChartBarIcon }
])

// ========================================
// LIFECYCLE HOOKS
// ========================================
onMounted(async () => {
  await cargarDatosNino()
  // TODO: Cargar datos de otras pestañas cuando estén disponibles
  // await cargarSesiones()
  // await cargarDocumentos()
})

watch(
  () => route.params.id,
  (newId) => {
    childId.value = newId as string
    cargarDatosNino()
  }
)

// ========================================
// FUNCIONES DE CARGA DE DATOS
// ========================================
const cargarDatosNino = async () => {
  loading.value = true
  try {
    console.log(`🔄 Cargando perfil del niño ID: ${childId.value}`)

    const data = await profileService.getChildProfile(childId.value)
    profileData.value = data

    console.log('✅ Datos completos cargados:', profileData.value)
    console.log('📋 Cards disponibles:', profileData.value?.cards)
    console.log('📞 Contactos de emergencia:', profileData.value?.emergencyContacts)
  } catch (error) {
    console.error('❌ Error cargando perfil:', error)
  } finally {
    loading.value = false
  }
}

const cargarSesiones = async () => {
  loadingSesiones.value = true
  try {
    // TODO: Implementar llamada al API de sesiones
    console.log('⏳ Cargando sesiones...')
    sesiones.value = []
  } catch (error) {
    console.error('❌ Error cargando sesiones:', error)
  } finally {
    loadingSesiones.value = false
  }
}

const cargarDocumentos = async () => {
  loadingDocumentos.value = true
  try {
    // TODO: Implementar llamada al API de documentos
    console.log('⏳ Cargando documentos...')
    documentos.value = []
  } catch (error) {
    console.error('❌ Error cargando documentos:', error)
  } finally {
    loadingDocumentos.value = false
  }
}

// ========================================
// HANDLERS DE EVENTOS
// ========================================
const gestionarContactos = () => {
  console.log('📞 Gestionar contactos')
  // TODO: Abrir modal de gestión de contactos
}

const verHistorialCompleto = () => {
  console.log('📋 Ver historial completo')
  // TODO: Navegar a vista de historial médico
}

const abrirModalSesion = () => {
  showModalSesion.value = true
}

// 3. NUEVO HANDLER PARA EL EVENTO DEL MODAL
const handleSesionCreada = () => {
  console.log('🎉 Sesión creada exitosamente, recargando la lista...')
  cargarSesiones()
}

const verDetalleSesion = (id: number) => {
  console.log(`👁️ Ver detalle sesión ${id}`)
  // TODO: Navegar a detalle de sesión
}

const editarSesion = (id: number) => {
  console.log(`✏️ Editar sesión ${id}`)
  // TODO: Abrir modal de edición
}

const cargarHitosDesarrollo = () => {
  console.log('📈 Cargar hitos de desarrollo')
  // TODO: Implementar carga de hitos
}

const cargarProgresosComunicacion = () => {
  console.log('💬 Cargar progresos de comunicación')
  // TODO: Implementar carga de progresos
}

const cargarHabilidadesSociales = () => {
  console.log('👥 Cargar habilidades sociales')
  // TODO: Implementar carga de habilidades
}

const subirDocumento = () => {
  console.log('📤 Subir documento')
  // TODO: Abrir modal de carga de archivo
}

const descargarDocumento = (id: number) => {
  console.log(`💾 Descargar documento ${id}`)
  // TODO: Implementar descarga
}

const verDocumento = (id: number) => {
  console.log(`👁️ Ver documento ${id}`)
  // TODO: Abrir visor de documento
}

const eliminarDocumento = (id: number) => {
  console.log(`🗑️ Eliminar documento ${id}`)
  // TODO: Confirmar y eliminar
}

const exportarDatos = () => {
  console.log('📊 Exportar datos')
  // TODO: Generar y descargar export
}

const verDashboard = () => {
  console.log('📊 Ver dashboard')
  // TODO: Navegar a dashboard
}

const generarReporteCompleto = () => {
  console.log('📄 Generar reporte completo')
  // TODO: Generar PDF completo
}

const compararProgreso = () => {
  console.log('📊 Comparar progreso')
  // TODO: Abrir vista de comparación
}

const generarReporteSesiones = () => {
  console.log('📄 Generar reporte de sesiones')
  // TODO: Generar PDF de sesiones
}

const generarReporteProgreso = () => {
  console.log('📄 Generar reporte de progreso')
  // TODO: Generar PDF de progreso
}

const generarReporteComportamiento = () => {
  console.log('📄 Generar reporte de comportamiento')
  // TODO: Generar PDF de comportamiento
}

const generarReporteMedico = () => {
  console.log('📄 Generar reporte médico')
  // TODO: Generar PDF médico
}
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
