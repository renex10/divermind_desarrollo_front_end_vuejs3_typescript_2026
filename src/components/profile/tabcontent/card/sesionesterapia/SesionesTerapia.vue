<template>
  <div class="tab-pane">
    <div class="sesiones-header">
      <div class="section-title">
        <ChatBubbleLeftRightIcon class="icon-lg" />
        <h3>Sesiones de Terapia</h3>
      </div>
      <div class="header-actions">
        <button class="btn btn-outline" @click="imprimir">
          <PrinterIcon class="icon-sm" />
          Imprimir
        </button>
        <button class="btn btn-secondary" @click="$emit('cargarSesiones')">
          <ArrowPathIcon class="icon-sm" />
          Actualizar
        </button>
        <button class="btn btn-primary" @click="$emit('abrirModalSesion')">
          <PlusIcon class="icon-sm" />
          Nueva Sesión
        </button>
      </div>
    </div>

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

    <div class="sesiones-list">
      <div v-if="loadingSesiones" class="loading-state">
        Cargando sesiones...
      </div>
      <div v-else-if="sesiones.length === 0" class="empty-state">
        <CalendarIcon class="icon-xxl" />
        <h4>No hay sesiones registradas</h4>
        <p>Comienza agregando la primera sesión de terapia</p>
        <button class="btn btn-primary" @click="$emit('abrirModalSesion')">
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
            <button class="btn btn-sm btn-outline" @click="$emit('verDetalleSesion', sesion.id)">
              <EyeIcon class="icon-xs" />
              Ver Detalle
            </button>
            <button class="btn btn-sm btn-primary" @click="$emit('editarSesion', sesion.id)">
              <PencilIcon class="icon-xs" />
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  PlusIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  FlagIcon,
  EyeIcon,
  PencilIcon,
  UserIcon,
  PrinterIcon  // ✅ NUEVO: Importar ícono de impresora
} from '@heroicons/vue/24/outline'

defineProps<{
  loadingSesiones: boolean
  sesiones: any[]
  statsSesiones: any
}>()

defineEmits<{
  cargarSesiones: []
  abrirModalSesion: []
  verDetalleSesion: [id: number]
  editarSesion: [id: number]
}>()

const formatFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString('es-CL')
}

// ✅ NUEVO: Función para llamar a la impresión del navegador
const imprimir = () => {
  window.print()
}
</script>

<style scoped>
.tab-pane {
  padding: 2rem;
}

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

.icon-xs {
  width: 1rem;
  height: 1rem;
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
  
  .sesiones-grid {
    grid-template-columns: 1fr;
  }
  
  .sesiones-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>