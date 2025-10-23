<template>
  <div class="tab-content">
    <div v-if="activeTab === 'general'" class="tab-pane">
      <div class="info-grid">
        <InformacionPersonal
          :personal-data="profileData?.cards?.personal"
        />

        <NecesidadesEspeciales
          :special-needs-data="profileData?.cards?.special_needs"
        />

        <RegistroPIE
          :pie-data="profileData?.cards?.pie"
        />

        <InformacionMedica
          :medical-data="profileData?.cards?.medical"
        />

        <InformacionEscolar
          :school-data="profileData?.cards?.school"
        />

        <InformacionTutor
          :guardian-data="profileData?.cards?.guardian"
        />

        <HistorialTerapias
          :therapy-data="profileData?.cards?.therapy"
        />

        <InformacionBasica
          :location-data="profileData?.cards?.location"
          :loading="loading"
        />

        <ContactoEmergencia
          :contactos="contactos"
          @gestionar-contactos="$emit('gestionarContactos')"
        />

        <RegistroDiagnostico
          :diagnosticos="diagnosticos"
          @add-diagnosis="$emit('add-diagnosis')"
        />

        <HistorialMedico
          :historial-count="historialCount"
          :medicamentos-count="medicamentosCount"
          @ver-historial-completo="$emit('verHistorialCompleto')"
        />

        <InteresesPrincipales
          v-if="childId"
          :key="`intereses-${childId}-${interestUpdateKey}`"
          :child-id="childId"
          @gestionar-intereses="$emit('gestionarIntereses')"
        />

      </div>
    </div>

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

import InformacionPersonal from './card/informaciongeneral/InformacionPersonal.vue'
import NecesidadesEspeciales from './card/informaciongeneral/NecesidadesEspeciales.vue'
import RegistroPIE from './card/informaciongeneral/RegistroPIE.vue'
import InformacionMedica from './card/informaciongeneral/InformacionMedica.vue'
import InformacionEscolar from './card/informaciongeneral/InformacionEscolar.vue'
import InformacionTutor from './card/informaciongeneral/InformacionTutor.vue'
import HistorialTerapias from './card/informaciongeneral/HistorialTerapias.vue'
import InformacionBasica from './card/informaciongeneral/InformacionBasica.vue'
import InteresesPrincipales from './card/informaciongeneral/InteresesPrincipales.vue'

import ContactoEmergencia from './card/informaciongeneral/ContactoEmergencia.vue'
import RegistroDiagnostico from './card/informaciongeneral/RegistroDiagnostico.vue'
import HistorialMedico from './card/informaciongeneral/HistorialMedico.vue'

import SesionesTerapia from './card/sesionesterapia/SesionesTerapia.vue'
import ProgresoMetricas from './card/progresometricas/ProgresoMetricas.vue'
import DocumentosArchivos from './documentos/DocumentosArchivos.vue'
import ReporteCompleto from './reportes/ReporteCompleto.vue'
import ReportesRapido from './card/ReportesRapido.vue'

const props = defineProps<{
  activeTab: string
  profileData?: any
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
  childId?: string | number
  interestUpdateKey?: number
}>()

watch(() => props.profileData, (newVal) => {
  console.log('📦 [TabContent] profileData actualizado:', newVal)
  console.log('🆔 [TabContent] childId recibido:', props.childId)
  console.log('🔑 [TabContent] interestUpdateKey:', props.interestUpdateKey)
}, { immediate: true, deep: true })

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
  'add-diagnosis': []
  'gestionarIntereses': []
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