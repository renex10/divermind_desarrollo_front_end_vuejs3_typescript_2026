<!-- src/components/profile/tabcontent/TabContent.vue -->
<template>
  <div class="tab-content">
    <!-- PESTAÑA: INFORMACIÓN GENERAL -->
    <div v-if="activeTab === 'general'" class="tab-pane">
      <!-- DEBUG INFO (remover después) -->
      <div style="background: #fef3c7; padding: 1rem; margin-bottom: 1rem; border-radius: 8px;">
        <strong>🐛 DEBUG TabContent:</strong>
        <pre style="font-size: 0.75rem; overflow: auto;">{{ JSON.stringify({
          hasProfileData: !!profileData,
          hasCards: !!profileData?.cards,
          cardKeys: profileData?.cards ? Object.keys(profileData.cards) : []
        }, null, 2) }}</pre>
      </div>

      <div class="info-grid">
        <!-- ========================================= -->
        <!-- TARJETAS NUEVAS CON DATOS DEL API -->
        <!-- ========================================= -->
        
        <!-- 1. INFORMACIÓN PERSONAL -->
        <InformacionPersonal 
          :personal-data="profileData?.cards?.personal"
        />

        <!-- 2. NECESIDADES ESPECIALES -->
        <NecesidadesEspeciales 
          :special-needs-data="profileData?.cards?.special_needs"
        />

        <!-- 3. REGISTRO PIE -->
        <RegistroPIE 
          :pie-data="profileData?.cards?.pie"
        />

        <!-- 4. INFORMACIÓN MÉDICA -->
        <InformacionMedica 
          :medical-data="profileData?.cards?.medical"
        />

        <!-- 5. INFORMACIÓN ESCOLAR -->
        <InformacionEscolar 
          :school-data="profileData?.cards?.school"
        />

        <!-- 6. INFORMACIÓN DEL TUTOR -->
        <InformacionTutor 
          :guardian-data="profileData?.cards?.guardian"
        />

        <!-- 7. HISTORIAL DE TERAPIAS -->
        <HistorialTerapias 
          :therapy-data="profileData?.cards?.therapy"
        />

        <!-- 8. INFORMACIÓN DE UBICACIÓN -->
        <InformacionBasica 
          :location-data="profileData?.cards?.location"
          :loading="loading"
        />

        <!-- ========================================= -->
        <!-- TARJETAS EXISTENTES (Mantener por ahora) -->
        <!-- ========================================= -->
        
        <!-- CONTACTOS DE EMERGENCIA -->
        <ContactoEmergencia 
          :contactos="contactos"
          @gestionar-contactos="$emit('gestionarContactos')"
        />

        <!-- DIAGNÓSTICOS -->
        <RegistroDiagnostico 
          :diagnosticos="diagnosticos"
        />

        <!-- HISTORIAL MÉDICO -->
        <HistorialMedico 
          :historial-count="historialCount"
          :medicamentos-count="medicamentosCount"
          @ver-historial-completo="$emit('verHistorialCompleto')"
        />
      </div>
    </div>

    <!-- PESTAÑA: SESIONES DE TERAPIA -->
    <div v-if="activeTab === 'sesiones'">
      <SesionesTerapia
        :loading-sesiones="loadingSesiones"
        :sesiones="sesiones"
        :stats-sesiones="statsSesiones"
        @cargar-sesiones="$emit('cargarSesiones')"
        @abrir-modal-sesion="$emit('abrirModalSesion')"
        @ver-detalle-sesion="$emit('verDetalleSesion', $event)"
        @editar-sesion="$emit('editarSesion', $event)"
      />
    </div>

    <!-- PESTAÑA: PROGRESO Y MÉTRICAS -->
    <div v-if="activeTab === 'progreso'">
      <ProgresoMetricas
        :periodo="periodo"
        :metricas="metricas"
        :registros-recientes="registrosRecientes"
        @update:periodo="$emit('update:periodo', $event)"
        @cargar-hitos-desarrollo="$emit('cargarHitosDesarrollo')"
        @cargar-progresos-comunicacion="$emit('cargarProgresosComunicacion')"
        @cargar-habilidades-sociales="$emit('cargarHabilidadesSociales')"
      />
    </div>

    <!-- PESTAÑA: DOCUMENTOS -->
    <div v-if="activeTab === 'documentos'">
      <DocumentosArchivos
        :loading-documentos="loadingDocumentos"
        :documentos="documentos"
        :stats-documentos="statsDocumentos"
        @cargar-documentos="$emit('cargarDocumentos')"
        @subir-documento="$emit('subirDocumento')"
        @descargar-documento="$emit('descargarDocumento', $event)"
        @ver-documento="$emit('verDocumento', $event)"
        @eliminar-documento="$emit('eliminarDocumento', $event)"
      />
    </div>

    <!-- PESTAÑA: REPORTES -->
    <div v-if="activeTab === 'reportes'">
      <ReporteCompleto
        @generar-reporte-completo="$emit('generarReporteCompleto')"
        @comparar-progreso="$emit('compararProgreso')"
        @exportar-datos="$emit('exportarDatos')"
        @ver-dashboard="$emit('verDashboard')"
      />
      <ReportesRapido
        @generar-reporte-sesiones="$emit('generarReporteSesiones')"
        @generar-reporte-progreso="$emit('generarReporteProgreso')"
        @generar-reporte-comportamiento="$emit('generarReporteComportamiento')"
        @generar-reporte-medico="$emit('generarReporteMedico')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'

// ========================================
// IMPORTAR TODAS LAS TARJETAS NUEVAS
// ========================================
import InformacionPersonal from './card/informaciongeneral/InformacionPersonal.vue'
import NecesidadesEspeciales from './card/informaciongeneral/NecesidadesEspeciales.vue'
import RegistroPIE from './card/informaciongeneral/RegistroPIE.vue'
import InformacionMedica from './card/informaciongeneral/InformacionMedica.vue'
import InformacionEscolar from './card/informaciongeneral/InformacionEscolar.vue'
import InformacionTutor from './card/informaciongeneral/InformacionTutor.vue'
import HistorialTerapias from './card/informaciongeneral/HistorialTerapias.vue'
import InformacionBasica from './card/informaciongeneral/InformacionBasica.vue'

// Tarjetas existentes
import ContactoEmergencia from './card/informaciongeneral/ContactoEmergencia.vue'
import RegistroDiagnostico from './card/informaciongeneral/RegistroDiagnostico.vue'
import HistorialMedico from './card/informaciongeneral/HistorialMedico.vue'

// Componentes de otras pestañas
import SesionesTerapia from './card/sesionesterapia/SesionesTerapia.vue'
import ProgresoMetricas from './card/progresometricas/ProgresoMetricas.vue'
import DocumentosArchivos from './documentos/DocumentosArchivos.vue'
import ReporteCompleto from './reportes/ReporteCompleto.vue'
import ReportesRapido from './card/ReportesRapido.vue'

// ========================================
// PROPS
// ========================================
const props = defineProps<{
  activeTab: string
  profileData?: any  // 🔥 CAMBIO: Recibir profileData completo
  loading: boolean
  contactos: any[]
  diagnosticos: any[]
  historialCount: number
  medicamentosCount: number
  loadingSesiones: boolean
  sesiones: any[]
  statsSesiones: any
  periodo: string
  metricas: any
  registrosRecientes: any[]
  loadingDocumentos: boolean
  documentos: any[]
  statsDocumentos: any
}>()

// ========================================
// DEBUG: Observar cambios en profileData
// ========================================
watch(() => props.profileData, (newVal) => {
  console.log('📦 [TabContent] profileData actualizado:', newVal)
  console.log('📦 [TabContent] cards disponibles:', newVal?.cards)
  if (newVal?.cards) {
    console.log('📍 [TabContent] location:', newVal.cards.location)
    console.log('👤 [TabContent] personal:', newVal.cards.personal)
    console.log('🏥 [TabContent] medical:', newVal.cards.medical)
  }
}, { immediate: true, deep: true })

// ========================================
// EMITS
// ========================================
defineEmits<{
  gestionarContactos: []
  verHistorialCompleto: []
  cargarSesiones: []
  abrirModalSesion: []
  verDetalleSesion: [id: number]
  editarSesion: [id: number]
  'update:periodo': [value: string]
  cargarHitosDesarrollo: []
  cargarProgresosComunicacion: []
  cargarHabilidadesSociales: []
  cargarDocumentos: []
  subirDocumento: []
  descargarDocumento: [id: number]
  verDocumento: [id: number]
  eliminarDocumento: [id: number]
  generarReporteCompleto: []
  compararProgreso: []
  exportarDatos: []
  verDashboard: []
  generarReporteSesiones: []
  generarReporteProgreso: []
  generarReporteComportamiento: []
  generarReporteMedico: []
}>()
</script>

<style scoped>
.tab-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tab-pane {
  padding: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .tab-pane {
    padding: 1rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>