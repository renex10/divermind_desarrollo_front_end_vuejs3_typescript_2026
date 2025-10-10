<!-- src/components/forms/multi-step/components/ListaPadresExistentes.vue -->
<template>
  <div class="existing-parents-section">
    <h4>👨‍👩‍👧‍👦 Padres Existentes en el Sistema</h4>
    
    <!-- Controles de búsqueda y filtro -->
    <div class="controls-container">
      <FormKit
        type="text"
        name="filter_parents"
        placeholder="Filtrar por nombre, RUT o email..."
        v-model="filterText"
        :classes="{
          input: 'filter-input'
        }"
        @input="handleFilterInput"
      />
      
      <button
        type="button"
        class="btn btn-outline"
        @click="toggleShowAll"
        :disabled="loading"
      >
        <span v-if="loading">⏳</span>
        {{ showAll ? 'Ocultar Lista' : 'Mostrar Todos' }}
      </button>
      
      <button
        type="button"
        class="btn btn-primary"
        @click="refreshParents"
        :disabled="loading"
      >
        🔄 Actualizar
      </button>
    </div>

    <!-- Información de paginación -->
    <div v-if="showAll && totalCount > 0" class="pagination-info">
      <span class="total-count">
        {{ totalCount }} padre(s) en total • Página {{ currentPage }} de {{ totalPages }}
      </span>
      <span class="selected-count" v-if="selectedCount > 0">
        {{ selectedCount }} seleccionado(s)
      </span>
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <span>{{ loadingMessage }}</span>
    </div>

    <!-- Lista de padres -->
    <div v-else-if="showAll && parentsList.length > 0" class="parents-list">
      <div class="parents-grid">
        <div 
          v-for="parent in parentsList"
          :key="parent.id"
          class="parent-card"
          :class="{ 'selected': isParentSelected(parent.id) }"
        >
          <div class="parent-avatar">
            {{ getInitials(parent.first_name, parent.last_name) }}
          </div>
          
          <div class="parent-info">
            <h5 class="parent-name">
              {{ parent.first_name }} {{ parent.last_name }}
            </h5>
            <div class="parent-details">
              <div class="detail-item">
                <span class="label">RUT:</span>
                <span class="value">{{ parent.rut }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Email:</span>
                <span class="value">{{ parent.email }}</span>
              </div>
              <div class="detail-item" v-if="parent.phone">
                <span class="label">Teléfono:</span>
                <span class="value">{{ parent.phone }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Username:</span>
                <span class="value">{{ parent.username }}</span>
              </div>
              <div class="detail-item" v-if="parent.estado">
                <span class="label">Estado:</span>
                <span class="value status-badge" :class="parent.estado">
                  {{ parent.estado }}
                </span>
              </div>
            </div>
          </div>

          <div class="parent-actions">
            <button
              type="button"
              class="btn btn-sm"
              :class="isParentSelected(parent.id) ? 'btn-danger' : 'btn-success'"
              @click="toggleParentSelection(parent)"
              :disabled="loading"
            >
              {{ isParentSelected(parent.id) ? '❌ Quitar' : '✅ Agregar' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Paginación -->
      <div v-if="totalPages > 1" class="pagination">
        <button
          type="button"
          class="btn btn-outline btn-sm"
          :disabled="currentPage === 1 || loading"
          @click="changePage(currentPage - 1)"
        >
          ← Anterior
        </button>
        
        <span class="page-info">
          Página {{ currentPage }} de {{ totalPages }}
        </span>
        
        <button
          type="button"
          class="btn btn-outline btn-sm"
          :disabled="currentPage === totalPages || loading"
          @click="changePage(currentPage + 1)"
        >
          Siguiente →
        </button>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-else-if="showAll && parentsList.length === 0" class="empty-state">
      <div class="empty-icon">👤</div>
      <h5>No se encontraron padres</h5>
      <p v-if="filterText">
        No hay padres que coincidan con "{{ filterText }}"
      </p>
      <p v-else>
        No hay padres registrados en el sistema
      </p>
      <button
        type="button"
        class="btn btn-primary btn-sm"
        @click="refreshParents"
      >
        🔄 Reintentar
      </button>
    </div>

    <!-- Información de selección -->
    <div v-if="selectedCount > 0" class="selection-info">
      <div class="selected-parents-summary">
        <strong>Padres seleccionados:</strong>
        <span class="selected-list">
          {{ selectedParentsList }}
        </span>
      </div>
      <button
        type="button"
        class="btn btn-danger btn-sm"
        @click="clearSelection"
        :disabled="loading"
      >
        🗑️ Limpiar Selección
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { getParentsListApi } from '@/services/nneService' // ✅ Usar la nueva función
import type { ParentUser } from '@/types'
import { useAlertModalStore } from '@/store/alertModalStore'

interface Props {
  selectedParents: ParentUser[]
}

interface Emits {
  (e: 'parent-selected', parent: ParentUser): void
  (e: 'parent-removed', parentId: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const alertModal = useAlertModalStore()

// Estado
const parentsList = ref<ParentUser[]>([])
const loading = ref(false)
const filterText = ref('')
const showAll = ref(false)
const currentPage = ref(1)
const totalCount = ref(0)
const totalPages = ref(0)
const pageSize = 5 // ✅ MÁXIMO 5 POR PÁGINA

// Computed
const selectedCount = computed(() => props.selectedParents.length)

const selectedParentsList = computed(() => {
  return props.selectedParents
    .map(p => `${p.first_name} ${p.last_name}`)
    .join(', ')
})

const loadingMessage = computed(() => {
  if (filterText.value) {
    return `Buscando padres con "${filterText.value}"...`
  }
  return `Cargando página ${currentPage.value} de padres...`
})

// Métodos
const getInitials = (firstName: string, lastName: string): string => {
  const first = firstName?.charAt(0) || ''
  const last = lastName?.charAt(0) || ''
  return (first + last).toUpperCase()
}

const isParentSelected = (parentId: number): boolean => {
  return props.selectedParents.some(p => p.id === parentId)
}

const toggleParentSelection = (parent: ParentUser) => {
  if (isParentSelected(parent.id)) {
    emit('parent-removed', parent.id)
  } else {
    emit('parent-selected', parent)
  }
}

const clearSelection = () => {
  props.selectedParents.forEach(parent => {
    emit('parent-removed', parent.id)
  })
}

const toggleShowAll = () => {
  showAll.value = !showAll.value
  if (showAll.value) {
    loadParents(1) // Cargar primera página
  } else {
    // Limpiar estado al ocultar
    parentsList.value = []
    totalCount.value = 0
    totalPages.value = 0
    currentPage.value = 1
    filterText.value = ''
  }
}

const refreshParents = async () => {
  if (showAll.value) {
    await loadParents(1) // Volver a la primera página al refrescar
  }
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadParents(page)
  }
}

// ✅ NUEVO: Cargar padres con paginación desde el backend
const loadParents = async (page: number = 1) => {
  if (!showAll.value) return
  
  loading.value = true
  try {
    console.log(`📥 Cargando página ${page} de padres...`, {
      filter: filterText.value,
      pageSize
    })
    
    const response = await getParentsListApi(page, pageSize, filterText.value)
    
    parentsList.value = response.results
    totalCount.value = response.count
    totalPages.value = response.total_pages
    currentPage.value = response.current_page
    
    console.log(`✅ Página ${page} cargada:`, {
      padresCargados: response.results.length,
      total: response.count,
      paginas: response.total_pages
    })
    
    // Solo mostrar alerta en la primera carga
    if (page === 1 && !filterText.value) {
      alertModal.success(
        'Lista cargada', 
        `Se cargaron ${response.count} padres del sistema`
      )
    }
    
  } catch (error: any) {
    console.error('❌ Error cargando padres:', error)
    
    let errorMessage = 'No se pudo cargar la lista de padres.'
    if (error.response?.status === 404) {
      errorMessage = 'El servicio de listado de padres no está disponible temporalmente.'
    } else if (error.message?.includes('network')) {
      errorMessage = 'Error de conexión. Verifique su internet.'
    }
    
    alertModal.error('Error al cargar padres', errorMessage)
    
    // Resetear estado en caso de error
    parentsList.value = []
    totalCount.value = 0
    totalPages.value = 0
    
  } finally {
    loading.value = false
  }
}

// ✅ NUEVO: Manejar el filtro con debounce
let filterTimeout: number | null = null

const handleFilterInput = () => {
  if (filterTimeout) {
    clearTimeout(filterTimeout)
  }
  
  filterTimeout = window.setTimeout(() => {
    if (showAll.value) {
      // Al filtrar, volver a página 1 y recargar con filtro
      currentPage.value = 1
      loadParents(1)
    }
  }, 500) // Debounce de 500ms
}

// Cargar datos cuando se active "Mostrar Todos"
watch(showAll, (newValue) => {
  if (newValue) {
    loadParents(1)
  }
})

// Exponer métodos para uso externo si es necesario
defineExpose({
  refreshParents,
  loadParents,
  toggleShowAll
})
</script>

<style scoped>
.existing-parents-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.existing-parents-section h4 {
  margin: 0 0 1.5rem 0;
  color: #374151;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.controls-container {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.controls-container .formkit-outer {
  flex: 1;
  min-width: 250px;
}

.filter-input {
  width: 100%;
}

.pagination-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #eff6ff;
  border-radius: 6px;
  border: 1px solid #dbeafe;
}

.pagination-info .total-count {
  font-weight: 600;
  color: #1e40af;
  font-size: 0.875rem;
}

.pagination-info .selected-count {
  background: #10b981;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem;
  color: #6b7280;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.parents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.parent-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.parent-card:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.parent-card.selected {
  border-color: #10b981;
  background: #f0fdf4;
}

.parent-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
  flex-shrink: 0;
}

.parent-card.selected .parent-avatar {
  background: #10b981;
}

.parent-info {
  flex: 1;
  min-width: 0;
}

.parent-name {
  margin: 0 0 0.75rem 0;
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 600;
}

.parent-details {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.detail-item .label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  min-width: 70px;
  flex-shrink: 0;
}

.detail-item .value {
  font-size: 0.75rem;
  color: #374151;
  word-break: break-word;
  flex: 1;
}

.status-badge {
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.activo {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.inactivo {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.suspendido {
  background: #fee2e2;
  color: #991b1b;
}

.parent-actions {
  flex-shrink: 0;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.page-info {
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h5 {
  margin: 0 0 0.75rem 0;
  color: #374151;
  font-size: 1.125rem;
}

.empty-state p {
  margin: 0 0 1.5rem 0;
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
}

.selection-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding: 1.25rem;
  background: #eff6ff;
  border: 1px solid #3b82f6;
  border-radius: 8px;
}

.selected-parents-summary {
  flex: 1;
}

.selected-parents-summary strong {
  color: #1e40af;
  font-size: 0.875rem;
}

.selected-list {
  display: block;
  margin-top: 0.5rem;
  color: #1e40af;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.4;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-outline {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-outline:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
  transform: translateY(-1px);
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .controls-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .parents-grid {
    grid-template-columns: 1fr;
  }
  
  .parent-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .parent-details {
    align-items: center;
  }
  
  .detail-item {
    justify-content: center;
    text-align: center;
  }
  
  .selection-info {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .pagination {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .pagination-info {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .existing-parents-section {
    padding: 1rem;
  }
  
  .parent-card {
    padding: 1rem;
  }
  
  .parent-avatar {
    width: 40px;
    height: 40px;
    font-size: 0.875rem;
  }
}
</style>