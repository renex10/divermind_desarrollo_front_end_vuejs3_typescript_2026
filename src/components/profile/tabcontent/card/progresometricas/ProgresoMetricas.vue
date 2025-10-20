<!-- src/components/profile/tabcontent/card/ProgresoMetricas.vue -->
<template>
  <div class="tab-pane">
    <div class="metricas-header">
      <div class="section-title">
        <ChartBarIcon class="icon-lg" />
        <h3>Progreso y Métricas</h3>
      </div>
      <div class="time-filters">
        <button class="btn btn-sm" :class="{ active: periodo === '30d' }" @click="$emit('update:periodo', '30d')">
          30 días
        </button>
        <button class="btn btn-sm" :class="{ active: periodo === '90d' }" @click="$emit('update:periodo', '90d')">
          90 días
        </button>
        <button class="btn btn-sm" :class="{ active: periodo === '1a' }" @click="$emit('update:periodo', '1a')">
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
        <button class="btn btn-outline full-width" @click="$emit('cargarHitosDesarrollo')">
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
        <button class="btn btn-outline full-width" @click="$emit('cargarProgresosComunicacion')">
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
        <button class="btn btn-outline full-width" @click="$emit('cargarHabilidadesSociales')">
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
          <ChartBarSquareIcon class="icon-xxl" />
          <p>Gráfico de tendencia se cargará aquí</p>
        </div>
      </div>
      
      <div class="grafico-card">
        <h4>Distribución por Áreas</h4>
        <div class="grafico-placeholder">
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
</template>

<script setup lang="ts">
import {
  ChartBarIcon,
  TrophyIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ArrowRightIcon,
  ChartBarSquareIcon,
  CircleStackIcon
} from '@heroicons/vue/24/outline'

defineProps<{
  periodo: string
  metricas: any
  registrosRecientes: any[]
}>()

defineEmits<{
  'update:periodo': [value: string]
  cargarHitosDesarrollo: []
  cargarProgresosComunicacion: []
  cargarHabilidadesSociales: []
}>()
</script>

<style scoped>
.tab-pane {
  padding: 2rem;
}

.metricas-header {
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

.full-width {
  width: 100%;
  justify-content: center;
}

.icon-sm {
  width: 1.25rem;
  height: 1.25rem;
}

.icon-lg {
  width: 2rem;
  height: 2rem;
}

.icon-xxl {
  width: 3rem;
  height: 3rem;
}

@media (max-width: 768px) {
  .tab-pane {
    padding: 1rem;
  }
  
  .metricas-principales {
    grid-template-columns: 1fr;
  }
  
  .graficos-section {
    grid-template-columns: 1fr;
  }
  
  .metricas-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>