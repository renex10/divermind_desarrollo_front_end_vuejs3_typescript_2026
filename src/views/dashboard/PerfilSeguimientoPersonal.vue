<!-- src/views/dashboard/PerfilSeguimientoPersonal.vue -->
<template>
  <div class="perfil-seguimiento">
    <!-- ==================== -->
    <!-- HEADER DEL PERFIL -->
    <!-- ==================== -->
    <div class="perfil-header">
      <div class="breadcrumb">
        <router-link to="/ingreso-nna" class="breadcrumb-link">
          <ArrowLeftIcon class="icon-sm" />
          Volver a Gestión de NNA
        </router-link>
      </div>
      
      <div class="header-content">
        <div class="nna-info">
          <div class="avatar-section">
            <div class="avatar-placeholder">
              <UserIcon class="icon-xl" />
            </div>
            <div class="nna-details">
              <h1 class="nna-name">{{ nnaData?.first_name }} {{ nnaData?.last_name }}</h1>
              <p class="nna-meta">
                <span v-if="nnaData?.rut" class="meta-item">
                  <IdentificationIcon class="icon-sm" />
                  {{ nnaData.rut }}
                </span>
                <span v-if="nnaData?.age" class="meta-item">
                  <CalendarIcon class="icon-sm" />
                  {{ nnaData.age }} años
                </span>
                <span v-if="nnaData?.grade" class="meta-item">
                  <AcademicCapIcon class="icon-sm" />
                  {{ nnaData.grade }}
                </span>
                <span v-if="nnaData?.autism_level" class="meta-item">
                  <SparklesIcon class="icon-sm" />
                  {{ nnaData.autism_level }}
                </span>
              </p>
            </div>
          </div>
        </div>
        
        <div class="header-actions">
          <button class="btn btn-secondary" @click="verDashboard">
            <ChartBarIcon class="icon-sm" />
            Dashboard
          </button>
          <button class="btn btn-primary" @click="exportarDatos">
            <DocumentArrowDownIcon class="icon-sm" />
            Exportar Datos
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== -->
    <!-- SISTEMA DE PESTAÑAS -->
    <!-- ==================== -->
    <div class="tabs-container">
      <nav class="tabs-nav">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab-button', { 'active': activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <component :is="tab.icon" class="icon-sm" />
          {{ tab.label }}
        </button>
      </nav>

      <!-- ==================== -->
      <!-- CONTENIDO PESTAÑAS -->
      <!-- ==================== -->
      <div class="tab-content">
        
        <!-- PESTAÑA: INFORMACIÓN GENERAL -->
        <div v-if="activeTab === 'general'" class="tab-pane">
          <div class="info-grid">
            <!-- TARJETA: INFORMACIÓN BÁSICA -->
            <div class="info-card">
              <div class="card-header">
                <UserCircleIcon class="icon-md" />
                <h3>Información Básica</h3>
              </div>
              <div class="card-body">
                <div v-if="loading" class="loading-state">
                  <!-- <SpinnerIcon class="icon-spin" /> -->
                  Cargando información...
                </div>
                <div v-else class="info-list">
                  <div class="info-item">
                    <BuildingLibraryIcon class="icon-sm" />
                    <div>
                      <label>Establecimiento</label>
                      <span>{{ nnaData?.establishment_name || 'No asignado' }}</span>
                    </div>
                  </div>
                  <div class="info-item">
                    <MapPinIcon class="icon-sm" />
                    <div>
                      <label>Comuna</label>
                      <span>{{ nnaData?.commune_name || 'No especificada' }}</span>
                    </div>
                  </div>
                  <div class="info-item">
                    <MapIcon class="icon-sm" />
                    <div>
                      <label>Región</label>
                      <span>{{ nnaData?.region_name || 'No especificada' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- TARJETA: CONTACTOS DE EMERGENCIA -->
            <div class="info-card">
              <div class="card-header">
                <PhoneIcon class="icon-md" />
                <h3>Contactos de Emergencia</h3>
              </div>
              <div class="card-body">
                <div class="contactos-list">
                  <div v-if="contactos.length === 0" class="empty-state">
                    <ExclamationTriangleIcon class="icon-lg" />
                    <p>No hay contactos registrados</p>
                  </div>
                  <div v-else class="contacto-item" v-for="contacto in contactos" :key="contacto.id">
                    <div class="contacto-info">
                      <strong>{{ contacto.name }}</strong>
                      <span class="relationship">{{ contacto.relationship }}</span>
                    </div>
                    <div class="contacto-phone">{{ contacto.phone }}</div>
                  </div>
                </div>
                <button class="btn btn-outline full-width" @click="gestionarContactos">
                  <PlusIcon class="icon-sm" />
                  Gestionar Contactos
                </button>
              </div>
            </div>

            <!-- TARJETA: DIAGNÓSTICOS -->
            <div class="info-card">
              <div class="card-header">
                <ClipboardDocumentListIcon class="icon-md" />
                <h3>Diagnósticos</h3>
              </div>
              <div class="card-body">
                <div class="diagnosticos-list">
                  <div v-if="diagnosticos.length === 0" class="empty-state">
                    <ExclamationTriangleIcon class="icon-lg" />
                    <p>No hay diagnósticos registrados</p>
                  </div>
                  <div v-else class="diagnostico-item" v-for="diagnostico in diagnosticos" :key="diagnostico.id">
                    <div class="diagnostico-type" :class="diagnostico.type">
                      {{ diagnostico.type }}
                    </div>
                    <div class="diagnostico-desc">{{ diagnostico.description }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- TARJETA: HISTORIAL MÉDICO -->
            <div class="info-card">
              <div class="card-header">
                <HeartIcon class="icon-md" />
                <h3>Historial Médico</h3>
              </div>
              <div class="card-body">
                <div class="historial-stats">
                  <div class="stat-item">
                    <span class="stat-number">{{ historialCount }}</span>
                    <span class="stat-label">Registros</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">{{ medicamentosCount }}</span>
                    <span class="stat-label">Medicamentos</span>
                  </div>
                </div>
                <button class="btn btn-outline full-width" @click="verHistorialCompleto">
                  <EyeIcon class="icon-sm" />
                  Ver Historial Completo
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- PESTAÑA: SESIONES DE TERAPIA -->
        <div v-if="activeTab === 'sesiones'" class="tab-pane">
          <div class="sesiones-header">
            <div class="section-title">
              <ChatBubbleLeftRightIcon class="icon-lg" />
              <h3>Sesiones de Terapia</h3>
            </div>
            <div class="header-actions">
              <button class="btn btn-secondary" @click="cargarSesiones">
                <ArrowPathIcon class="icon-sm" />
                Actualizar
              </button>
              <button class="btn btn-primary" @click="abrirModalSesion">
                <PlusIcon class="icon-sm" />
                Nueva Sesión
              </button>
            </div>
          </div>

          <!-- ESTADÍSTICAS RÁPIDAS -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon total">
                <CalendarIcon class="icon-lg" />
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ statsSesiones.total }}</span>
                <span class="stat-label">Total Sesiones</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon completed">
                <CheckCircleIcon class="icon-lg" />
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ statsSesiones.completadas }}</span>
                <span class="stat-label">Completadas</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon pending">
                <ClockIcon class="icon-lg" />
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ statsSesiones.pendientes }}</span>
                <span class="stat-label">Pendientes</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon goals">
                <FlagIcon class="icon-lg" />
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ statsSesiones.objetivos }}</span>
                <span class="stat-label">Objetivos</span>
              </div>
            </div>
          </div>

          <!-- LISTA DE SESIONES -->
          <div class="sesiones-list">
            <div v-if="loadingSesiones" class="loading-state">
              <SpinnerIcon class="icon-spin" />
              Cargando sesiones...
            </div>
            <div v-else-if="sesiones.length === 0" class="empty-state">
              <CalendarIcon class="icon-xxl" />
              <h4>No hay sesiones registradas</h4>
              <p>Comienza agregando la primera sesión de terapia</p>
              <button class="btn btn-primary" @click="abrirModalSesion">
                <PlusIcon class="icon-sm" />
                Crear Primera Sesión
              </button>
            </div>
            <div v-else class="sesiones-grid">
              <div class="sesion-card" v-for="sesion in sesiones" :key="sesion.id">
                <div class="sesion-header">
                  <div class="sesion-fecha">
                    <CalendarIcon class="icon-sm" />
                    {{ formatFecha(sesion.scheduled_date) }}
                  </div>
                  <div class="sesion-estado" :class="sesion.estado">
                    <CheckCircleIcon v-if="sesion.estado === 'completada'" class="icon-sm" />
                    <ClockIcon v-else class="icon-sm" />
                    {{ sesion.estado }}
                  </div>
                </div>
                <div class="sesion-body">
                  <h4 class="sesion-titulo">{{ sesion.objectives }}</h4>
                  <div class="sesion-meta">
                    <div class="meta-item">
                      <UserIcon class="icon-xs" />
                      {{ sesion.therapist }}
                    </div>
                    <div class="meta-item">
                      <ClockIcon class="icon-xs" />
                      {{ sesion.duration_minutes }} min
                    </div>
                  </div>
                </div>
                <div class="sesion-footer">
                  <button class="btn btn-sm btn-outline" @click="verDetalleSesion(sesion.id)">
                    <EyeIcon class="icon-xs" />
                    Ver Detalle
                  </button>
                  <button class="btn btn-sm btn-primary" @click="editarSesion(sesion.id)">
                    <PencilIcon class="icon-xs" />
                    Editar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- PESTAÑA: PROGRESO Y MÉTRICAS -->
        <div v-if="activeTab === 'progreso'" class="tab-pane">
          <div class="metricas-header">
            <div class="section-title">
              <ChartBarIcon class="icon-lg" />
              <h3>Progreso y Métricas</h3>
            </div>
            <div class="time-filters">
              <button class="btn btn-sm" :class="{ active: periodo === '30d' }" @click="periodo = '30d'">
                30 días
              </button>
              <button class="btn btn-sm" :class="{ active: periodo === '90d' }" @click="periodo = '90d'">
                90 días
              </button>
              <button class="btn btn-sm" :class="{ active: periodo === '1a' }" @click="periodo = '1a'">
                1 año
              </button>
            </div>
          </div>

          <!-- MÉTRICAS PRINCIPALES -->
          <div class="metricas-principales">
            <div class="metrica-principal">
              <div class="metrica-header">
                <div class="metrica-icon desarrollo">
                  <TrophyIcon class="icon-lg" />
                </div>
                <div class="metrica-info">
                  <span class="metrica-valor">{{ metricas.hitos_desarrollo }}</span>
                  <span class="metrica-label">Hitos de Desarrollo</span>
                </div>
              </div>
              <button class="btn btn-outline full-width" @click="cargarHitosDesarrollo">
                <ArrowRightIcon class="icon-sm" />
                Ver Detalles
              </button>
            </div>

            <div class="metrica-principal">
              <div class="metrica-header">
                <div class="metrica-icon comunicacion">
                  <ChatBubbleLeftRightIcon class="icon-lg" />
                </div>
                <div class="metrica-info">
                  <span class="metrica-valor">{{ metricas.progresos_comunicacion }}</span>
                  <span class="metrica-label">Progresos Comunicación</span>
                </div>
              </div>
              <button class="btn btn-outline full-width" @click="cargarProgresosComunicacion">
                <ArrowRightIcon class="icon-sm" />
                Ver Detalles
              </button>
            </div>

            <div class="metrica-principal">
              <div class="metrica-header">
                <div class="metrica-icon social">
                  <UserGroupIcon class="icon-lg" />
                </div>
                <div class="metrica-info">
                  <span class="metrica-valor">{{ metricas.habilidades_sociales }}</span>
                  <span class="metrica-label">Habilidades Sociales</span>
                </div>
              </div>
              <button class="btn btn-outline full-width" @click="cargarHabilidadesSociales">
                <ArrowRightIcon class="icon-sm" />
                Ver Detalles
              </button>
            </div>
          </div>

          <!-- GRÁFICOS Y TENDENCIAS -->
          <div class="graficos-section">
            <div class="grafico-card">
              <h4>Tendencia de Progreso</h4>
              <div class="grafico-placeholder">
                <!-- Aquí irá el componente de gráfico -->
                <ChartBarSquareIcon class="icon-xxl" />
                <p>Gráfico de tendencia se cargará aquí</p>
              </div>
            </div>
            
            <div class="grafico-card">
              <h4>Distribución por Áreas</h4>
              <div class="grafico-placeholder">
                <!-- Aquí irá el componente de gráfico circular -->
                <CircleStackIcon class="icon-xxl" />
                <p>Gráfico de distribución se cargará aquí</p>
              </div>
            </div>
          </div>

          <!-- REGISTROS RECIENTES -->
          <div class="registros-recientes">
            <h4>Registros Recientes</h4>
            <div class="registros-list">
              <div class="registro-item" v-for="registro in registrosRecientes" :key="registro.id">
                <div class="registro-icon" :class="registro.tipo">
                  <component :is="registro.icono" class="icon-sm" />
                </div>
                <div class="registro-content">
                  <div class="registro-desc">{{ registro.descripcion }}</div>
                  <div class="registro-meta">
                    <span class="registro-fecha">{{ registro.fecha }}</span>
                    <span class="registro-categoria">{{ registro.categoria }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- PESTAÑA: DOCUMENTOS -->
        <div v-if="activeTab === 'documentos'" class="tab-pane">
          <div class="documentos-header">
            <div class="section-title">
              <FolderIcon class="icon-lg" />
              <h3>Documentos</h3>
            </div>
            <div class="header-actions">
              <button class="btn btn-secondary" @click="cargarDocumentos">
                <ArrowPathIcon class="icon-sm" />
                Actualizar
              </button>
              <button class="btn btn-primary" @click="subirDocumento">
                <CloudArrowUpIcon class="icon-sm" />
                Subir Documento
              </button>
            </div>
          </div>

          <!-- ESTADÍSTICAS DOCUMENTOS -->
          <div class="docs-stats">
            <div class="doc-stat">
              <DocumentTextIcon class="icon-lg" />
              <span class="stat-number">{{ statsDocumentos.total }}</span>
              <span class="stat-label">Total Documentos</span>
            </div>
            <div class="doc-stat">
              <PhotoIcon class="icon-lg" />
              <span class="stat-number">{{ statsDocumentos.imagenes }}</span>
              <span class="stat-label">Imágenes</span>
            </div>
            <div class="doc-stat">
              <VideoCameraIcon class="icon-lg" />
              <span class="stat-number">{{ statsDocumentos.videos }}</span>
              <span class="stat-label">Videos</span>
            </div>
            <div class="doc-stat">
              <DocumentChartBarIcon class="icon-lg" />
              <span class="stat-number">{{ statsDocumentos.reportes }}</span>
              <span class="stat-label">Reportes</span>
            </div>
          </div>

          <!-- LISTA DE DOCUMENTOS -->
          <div class="documentos-list">
            <div v-if="loadingDocumentos" class="loading-state">
              <SpinnerIcon class="icon-spin" />
              Cargando documentos...
            </div>
            <div v-else-if="documentos.length === 0" class="empty-state">
              <FolderOpenIcon class="icon-xxl" />
              <h4>No hay documentos</h4>
              <p>Comienza subiendo el primer documento</p>
              <button class="btn btn-primary" @click="subirDocumento">
                <CloudArrowUpIcon class="icon-sm" />
                Subir Primer Documento
              </button>
            </div>
            <div v-else class="documentos-grid">
              <div class="documento-card" v-for="doc in documentos" :key="doc.id">
                <div class="doc-icon">
                  <component :is="doc.icono" class="icon-xl" />
                </div>
                <div class="doc-content">
                  <h4 class="doc-name">{{ doc.name }}</h4>
                  <div class="doc-meta">
                    <span class="doc-type">{{ doc.type }}</span>
                    <span class="doc-date">{{ doc.fecha }}</span>
                    <span class="doc-size">{{ doc.size }}</span>
                  </div>
                </div>
                <div class="doc-actions">
                  <button class="btn btn-icon" @click="descargarDocumento(doc.id)" title="Descargar">
                    <ArrowDownTrayIcon class="icon-sm" />
                  </button>
                  <button class="btn btn-icon" @click="verDocumento(doc.id)" title="Vista previa">
                    <EyeIcon class="icon-sm" />
                  </button>
                  <button class="btn btn-icon" @click="eliminarDocumento(doc.id)" title="Eliminar">
                    <TrashIcon class="icon-sm" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- PESTAÑA: REPORTES -->
        <div v-if="activeTab === 'reportes'" class="tab-pane">
          <div class="reportes-header">
            <div class="section-title">
              <DocumentChartBarIcon class="icon-lg" />
              <h3>Reportes y Análisis</h3>
            </div>
          </div>

          <!-- ACCIONES PRINCIPALES -->
          <div class="reportes-actions">
            <div class="reporte-card" @click="generarReporteCompleto">
              <div class="reporte-icon">
                <DocumentTextIcon class="icon-xl" />
              </div>
              <div class="reporte-content">
                <h4>Reporte Completo</h4>
                <p>Genera un reporte detallado con toda la información del niño</p>
              </div>
              <ArrowRightIcon class="icon-sm" />
            </div>

            <div class="reporte-card" @click="compararProgreso">
              <div class="reporte-icon">
                <ChartBarSquareIcon class="icon-xl" />
              </div>
              <div class="reporte-content">
                <h4>Comparar Progreso</h4>
                <p>Analiza la evolución entre diferentes períodos de tiempo</p>
              </div>
              <ArrowRightIcon class="icon-sm" />
            </div>

            <div class="reporte-card" @click="exportarDatos">
              <div class="reporte-icon">
                <DocumentArrowDownIcon class="icon-xl" />
              </div>
              <div class="reporte-content">
                <h4>Exportar Datos</h4>
                <p>Exporta toda la información en diferentes formatos</p>
              </div>
              <ArrowRightIcon class="icon-sm" />
            </div>

            <div class="reporte-card" @click="verDashboard">
              <div class="reporte-icon">
                <PresentationChartLineIcon class="icon-xl" />
              </div>
              <div class="reporte-content">
                <h4>Dashboard Interactivo</h4>
                <p>Visualiza métricas y tendencias en tiempo real</p>
              </div>
              <ArrowRightIcon class="icon-sm" />
            </div>
          </div>

          <!-- REPORTES RÁPIDOS -->
          <div class="reportes-rapidos">
            <h4>Reportes Rápidos</h4>
            <div class="rapidos-grid">
              <button class="btn btn-outline" @click="generarReporteSesiones">
                <CalendarIcon class="icon-sm" />
                Sesiones de Terapia
              </button>
              <button class="btn btn-outline" @click="generarReporteProgreso">
                <ChartBarIcon class="icon-sm" />
                Progreso General
              </button>
              <button class="btn btn-outline" @click="generarReporteComportamiento">
                <FaceSmileIcon class="icon-sm" />
                Comportamiento
              </button>
              <button class="btn btn-outline" @click="generarReporteMedico">
                <HeartIcon class="icon-sm" />
                Historial Médico
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== -->
    <!-- MODALES (PLACEHOLDER) -->
    <!-- ==================== -->
    <div v-if="showModalSesion" class="modal-backdrop">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Nueva Sesión de Terapia</h3>
          <button class="btn btn-icon" @click="showModalSesion = false">
            <XMarkIcon class="icon-sm" />
          </button>
        </div>
        <div class="modal-body">
          <!-- Formulario de sesión - Será extraído a componente -->
          <p>Formulario para crear nueva sesión de terapia</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showModalSesion = false">
            Cancelar
          </button>
          <button class="btn btn-primary" @click="crearSesion">
            Crear Sesión
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

// ==================== -->
// ICONOS HEROICONS
// ==================== -->
import {
  ArrowLeftIcon,
  UserIcon,
  IdentificationIcon,
  CalendarIcon,
  AcademicCapIcon,
  SparklesIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  UserCircleIcon,
  BuildingLibraryIcon,
  MapPinIcon,
  MapIcon,
  PhoneIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  FlagIcon,
  PencilIcon,
  TrophyIcon,
  ChatBubbleLeftRightIcon as CommsIcon,
  UserGroupIcon,
  ArrowRightIcon,
  ChartBarSquareIcon,
  CircleStackIcon,
  FolderIcon,
  CloudArrowUpIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentChartBarIcon,
  FolderOpenIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  PresentationChartLineIcon,
  FaceSmileIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

// import { SpinnerIcon } from '@/components/icons'

// Props y route
const route = useRoute()
const childId = ref<string>(route.params.id as string)

// ==================== -->
// ESTADO REACTIVO
// ==================== -->
const nnaData = ref<any>(null)
const loading = ref(false)
const activeTab = ref('general')
const sesiones = ref<any[]>([])
const loadingSesiones = ref(false)
const showModalSesion = ref(false)
const periodo = ref('30d')
const documentos = ref<any[]>([])
const loadingDocumentos = ref(false)

// ==================== -->
// DATOS DE EJEMPLO
// ==================== -->
const contactos = ref([
  { id: 1, name: 'María González', relationship: 'Madre', phone: '+56 9 1234 5678' },
  { id: 2, name: 'Pedro López', relationship: 'Padre', phone: '+56 9 8765 4321' }
])

const diagnosticos = ref([
  { id: 1, type: 'primary', description: 'Trastorno del Espectro Autista Nivel 1' },
  { id: 2, type: 'secondary', description: 'Trastorno de Ansiedad' }
])

const statsSesiones = ref({
  total: 12,
  completadas: 8,
  pendientes: 4,
  objetivos: 24
})

const metricas = ref({
  hitos_desarrollo: 15,
  progresos_comunicacion: 28,
  habilidades_sociales: 12
})

const statsDocumentos = ref({
  total: 8,
  imagenes: 3,
  videos: 2,
  reportes: 3
})

const registrosRecientes = ref([
  { id: 1, tipo: 'desarrollo', icono: TrophyIcon, descripcion: 'Primeras palabras completas', fecha: 'Hoy', categoria: 'Comunicación' },
  { id: 2, tipo: 'social', icono: UserGroupIcon, descripcion: 'Interacción grupal exitosa', fecha: 'Ayer', categoria: 'Social' },
  { id: 3, tipo: 'terapia', icono: CommsIcon, descripcion: 'Sesión de terapia completada', fecha: '2 días', categoria: 'Terapia' }
])

// ==================== -->
// COMPUTED
// ==================== -->
const historialCount = computed(() => 15)
const medicamentosCount = computed(() => 3)

// ==================== -->
// TABS DISPONIBLES
// ==================== -->
const tabs = ref([
  { id: 'general', label: 'Información General', icon: UserCircleIcon },
  { id: 'sesiones', label: 'Sesiones de Terapia', icon: ChatBubbleLeftRightIcon },
  { id: 'progreso', label: 'Progreso y Métricas', icon: ChartBarIcon },
  { id: 'documentos', label: 'Documentos', icon: FolderIcon },
  { id: 'reportes', label: 'Reportes', icon: DocumentChartBarIcon }
])

// ==================== -->
// LIFECYCLE
// ==================== -->
onMounted(async () => {
  await cargarDatosNino()
  await cargarSesiones()
  await cargarDocumentos()
})

watch(() => route.params.id, (newId) => {
  childId.value = newId as string
  cargarDatosNino()
})

// ==================== -->
// FUNCIONES PRINCIPALES
// ==================== -->
const cargarDatosNino = async () => {
  loading.value = true
  try {
    console.log(`Cargando datos del niño ID: ${childId.value}`)
    
    // Simular datos de ejemplo
    nnaData.value = {
      first_name: 'Juan',
      last_name: 'Pérez',
      rut: '12.345.678-9',
      age: 8,
      grade: '2° Básico',
      establishment_name: 'Escuela Primaria Los Alerces',
      commune_name: 'Santiago',
      region_name: 'Metropolitana',
      autism_level: 'Nivel 1 - Necesita apoyo'
    }
  } catch (error) {
    console.error('Error cargando datos del niño:', error)
  } finally {
    loading.value = false
  }
}

const cargarSesiones = async () => {
  loadingSesiones.value = true
  try {
    // Simular carga de sesiones
    sesiones.value = [
      {
        id: 1,
        scheduled_date: '2024-01-15',
        estado: 'completada',
        objectives: 'Desarrollo de habilidades sociales básicas',
        therapist: 'Dra. Ana López',
        duration_minutes: 60
      },
      {
        id: 2,
        scheduled_date: '2024-01-22',
        estado: 'pendiente',
        objectives: 'Terapia de comunicación no verbal',
        therapist: 'Dra. Ana López',
        duration_minutes: 45
      }
    ]
  } catch (error) {
    console.error('Error cargando sesiones:', error)
  } finally {
    loadingSesiones.value = false
  }
}

const cargarDocumentos = async () => {
  loadingDocumentos.value = true
  try {
    documentos.value = [
      {
        id: 1,
        name: 'Evaluación Inicial.pdf',
        type: 'PDF',
        fecha: '15 Ene 2024',
        size: '2.4 MB',
        icono: DocumentTextIcon
      },
      {
        id: 2,
        name: 'Sesión Terapia Foto.jpg',
        type: 'Imagen',
        fecha: '20 Ene 2024',
        size: '1.2 MB',
        icono: PhotoIcon
      }
    ]
  } catch (error) {
    console.error('Error cargando documentos:', error)
  } finally {
    loadingDocumentos.value = false
  }
}

// ==================== -->
// FUNCIONES DE UTILIDAD
// ==================== -->
const formatFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString('es-CL')
}

const gestionarContactos = () => {
  console.log('Gestionando contactos...')
}

const verHistorialCompleto = () => {
  console.log('Viendo historial completo...')
}

const abrirModalSesion = () => {
  showModalSesion.value = true
}

const crearSesion = () => {
  console.log('Creando sesión...')
  showModalSesion.value = false
}

const verDetalleSesion = (id: number) => {
  console.log(`Viendo detalle sesión ${id}...`)
}

const editarSesion = (id: number) => {
  console.log(`Editando sesión ${id}...`)
}

const cargarProgresosComunicacion = () => {
  console.log('Cargando progresos de comunicación...')
}

const cargarHabilidadesSociales = () => {
  console.log('Cargando habilidades sociales...')
}

const cargarHitosDesarrollo = () => {
  console.log('Cargando hitos de desarrollo...')
}

const subirDocumento = () => {
  console.log('Subiendo documento...')
}

const descargarDocumento = (id: number) => {
  console.log(`Descargando documento ${id}...`)
}

const verDocumento = (id: number) => {
  console.log(`Viendo documento ${id}...`)
}

const eliminarDocumento = (id: number) => {
  console.log(`Eliminando documento ${id}...`)
}

const exportarDatos = () => {
  console.log('Exportando datos...')
}

const verDashboard = () => {
  console.log('Viendo dashboard...')
}

const generarReporteCompleto = () => {
  console.log('Generando reporte completo...')
}

const compararProgreso = () => {
  console.log('Comparando progreso...')
}

const generarReporteSesiones = () => {
  console.log('Generando reporte de sesiones...')
}

const generarReporteProgreso = () => {
  console.log('Generando reporte de progreso...')
}

const generarReporteComportamiento = () => {
  console.log('Generando reporte de comportamiento...')
}

const generarReporteMedico = () => {
  console.log('Generando reporte médico...')
}
</script>

<style scoped>
.perfil-seguimiento {
  min-height: 100vh;
  background: #f8fafc;
}

/* ==================== */
/* HEADER STYLES */
/* ==================== */
.perfil-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem 2rem;
}

.breadcrumb {
  margin-bottom: 1rem;
}

.breadcrumb-link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.nna-name {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.nna-meta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin: 0;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

/* ==================== */
/* TABS STYLES */
/* ==================== */
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

.tab-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tab-pane {
  padding: 2rem;
}

/* ==================== */
/* INFO GRID STYLES */
/* ==================== */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.info-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  background: #f8fafc;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1.125rem;
  color: #1f2937;
}

.card-body {
  padding: 1.5rem;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.info-item label {
  font-size: 0.875rem;
  color: #6b7280;
  display: block;
  margin-bottom: 0.25rem;
}

.info-item span {
  font-weight: 500;
  color: #1f2937;
}

/* ==================== */
/* CONTACTOS STYLES */
/* ==================== */
.contactos-list {
  margin-bottom: 1rem;
}

.contacto-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.contacto-item:last-child {
  border-bottom: none;
}

.contacto-info {
  display: flex;
  flex-direction: column;
}

.contacto-info strong {
  color: #1f2937;
}

.relationship {
  font-size: 0.875rem;
  color: #6b7280;
}

.contacto-phone {
  color: #3b82f6;
  font-weight: 500;
}

/* ==================== */
/* DIAGNOSTICOS STYLES */
/* ==================== */
.diagnostico-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.diagnostico-item:last-child {
  border-bottom: none;
}

.diagnostico-type {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  margin-bottom: 0.5rem;
}

.diagnostico-type.primary {
  background: #fef3c7;
  color: #92400e;
}

.diagnostico-type.secondary {
  background: #dbeafe;
  color: #1e40af;
}

.diagnostico-desc {
  color: #374151;
  font-size: 0.875rem;
}

/* ==================== */
/* HISTORIAL STATS */
/* ==================== */
.historial-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

/* ==================== */
/* SESIONES STYLES */
/* ==================== */
.sesiones-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title h3 {
  margin: 0;
  color: #1f2937;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.total {
  background: #dbeafe;
  color: #1e40af;
}

.stat-icon.completed {
  background: #dcfce7;
  color: #166534;
}

.stat-icon.pending {
  background: #fef3c7;
  color: #92400e;
}

.stat-icon.goals {
  background: #f3e8ff;
  color: #7c3aed;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.sesiones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.sesion-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  background: white;
}

.sesion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.sesion-fecha {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #374151;
  font-weight: 500;
}

.sesion-estado {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.sesion-estado.completada {
  background: #dcfce7;
  color: #166534;
}

.sesion-estado.pendiente {
  background: #fef3c7;
  color: #92400e;
}

.sesion-body {
  padding: 1.5rem;
}

.sesion-titulo {
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-size: 1rem;
}

.sesion-meta {
  display: flex;
  gap: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.sesion-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 0.75rem;
}

/* ==================== */
/* MÉTRICAS STYLES */
/* ==================== */
.metricas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.time-filters {
  display: flex;
  gap: 0.5rem;
}

.metricas-principales {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metrica-principal {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  background: white;
}

.metrica-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.metrica-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metrica-icon.desarrollo {
  background: #fef3c7;
  color: #92400e;
}

.metrica-icon.comunicacion {
  background: #dbeafe;
  color: #1e40af;
}

.metrica-icon.social {
  background: #dcfce7;
  color: #166534;
}

.metrica-info {
  display: flex;
  flex-direction: column;
}

.metrica-valor {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.metrica-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.graficos-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.grafico-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  background: white;
}

.grafico-card h4 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.grafico-placeholder {
  height: 200px;
  background: #f8fafc;
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.registros-recientes h4 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.registros-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.registro-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

.registro-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.registro-icon.desarrollo {
  background: #fef3c7;
  color: #92400e;
}

.registro-icon.social {
  background: #dcfce7;
  color: #166534;
}

.registro-icon.terapia {
  background: #dbeafe;
  color: #1e40af;
}

.registro-content {
  flex: 1;
}

.registro-desc {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.registro-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
}

.registro-fecha {
  color: #6b7280;
}

.registro-categoria {
  color: #3b82f6;
  font-weight: 500;
}

/* ==================== */
/* DOCUMENTOS STYLES */
/* ==================== */
.documentos-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.docs-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.doc-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  text-align: center;
}

.documentos-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.documento-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
}

.doc-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.doc-content {
  flex: 1;
}

.doc-name {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
}

.doc-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.doc-actions {
  display: flex;
  gap: 0.5rem;
}

/* ==================== */
/* REPORTES STYLES */
/* ==================== */
.reportes-header {
  margin-bottom: 2rem;
}

.reportes-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.reporte-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.reporte-card:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.reporte-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: #dbeafe;
  color: #1e40af;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reporte-content {
  flex: 1;
}

.reporte-content h4 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
}

.reporte-content p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.rapidos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

/* ==================== */
/* UTILITY STYLES */
/* ==================== */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn-outline {
  background: transparent;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-outline:hover {
  background: #f9fafb;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
}

.btn-icon {
  padding: 0.5rem;
  border-radius: 6px;
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #64748b;
}

.btn-icon:hover {
  background: #f8fafc;
}

.full-width {
  width: 100%;
  justify-content: center;
}

.loading-state {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem;
  color: #6b7280;
  justify-content: center;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.empty-state h4 {
  margin: 1rem 0 0.5rem 0;
  color: #374151;
}

.empty-state p {
  margin: 0 0 1.5rem 0;
}

/* ==================== */
/* ICON STYLES */
/* ==================== */
.icon-xs {
  width: 1rem;
  height: 1rem;
}

.icon-sm {
  width: 1.25rem;
  height: 1.25rem;
}

.icon-md {
  width: 1.5rem;
  height: 1.5rem;
}

.icon-lg {
  width: 2rem;
  height: 2rem;
}

.icon-xl {
  width: 2.5rem;
  height: 2.5rem;
}

.icon-xxl {
  width: 3rem;
  height: 3rem;
}

.icon-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ==================== */
/* MODAL STYLES */
/* ==================== */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  color: #1f2937;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* ==================== */
/* RESPONSIVE STYLES */
/* ==================== */
@media (max-width: 768px) {
  .perfil-header {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
  }
  
  .header-actions {
    width: 100%;
    justify-content: stretch;
  }
  
  .header-actions .btn {
    flex: 1;
    justify-content: center;
  }
  
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
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .sesiones-grid {
    grid-template-columns: 1fr;
  }
  
  .metricas-principales {
    grid-template-columns: 1fr;
  }
  
  .graficos-section {
    grid-template-columns: 1fr;
  }
  
  .reportes-actions {
    grid-template-columns: 1fr;
  }
  
  .nna-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .avatar-section {
    flex-direction: column;
    text-align: center;
  }
  
  .sesiones-header,
  .documentos-header,
  .metricas-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>