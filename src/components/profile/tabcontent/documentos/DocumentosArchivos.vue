<!-- src/components/profile/tabcontent/card/DocumentosArchivos.vue -->
<template>
  <div class="tab-pane">
    <div class="documentos-header">
      <div class="section-title">
        <FolderIcon class="icon-lg" />
        <h3>Documentos</h3>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" @click="$emit('cargarDocumentos')">
          <ArrowPathIcon class="icon-sm" />
          Actualizar
        </button>
        <button class="btn btn-primary" @click="$emit('subirDocumento')">
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
        Cargando documentos...
      </div>
      <div v-else-if="documentos.length === 0" class="empty-state">
        <FolderOpenIcon class="icon-xxl" />
        <h4>No hay documentos</h4>
        <p>Comienza subiendo el primer documento</p>
        <button class="btn btn-primary" @click="$emit('subirDocumento')">
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
            <button class="btn btn-icon" @click="$emit('descargarDocumento', doc.id)" title="Descargar">
              <ArrowDownTrayIcon class="icon-sm" />
            </button>
            <button class="btn btn-icon" @click="$emit('verDocumento', doc.id)" title="Vista previa">
              <EyeIcon class="icon-sm" />
            </button>
            <button class="btn btn-icon" @click="$emit('eliminarDocumento', doc.id)" title="Eliminar">
              <TrashIcon class="icon-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  FolderIcon,
  ArrowPathIcon,
  CloudArrowUpIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentChartBarIcon,
  FolderOpenIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'

defineProps<{
  loadingDocumentos: boolean
  documentos: any[]
  statsDocumentos: any
}>()

defineEmits<{
  cargarDocumentos: []
  subirDocumento: []
  descargarDocumento: [id: number]
  verDocumento: [id: number]
  eliminarDocumento: [id: number]
}>()
</script>

<style scoped>
.tab-pane {
  padding: 2rem;
}

.documentos-header {
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

.icon-sm {
  width: 1.25rem;
  height: 1.25rem;
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

@media (max-width: 768px) {
  .tab-pane {
    padding: 1rem;
  }
  
  .documentos-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>