<template>
  <div class="tabla-filtro-container">
    <!-- Sección de Búsqueda -->
    <BusquedaFiltros
      v-model:search-query="searchQuery"
      @clear-filters="() => (searchQuery = '')"
    />

    <!-- Información de resultados -->
    <div class="results-info">
      <p class="results-text">
        Mostrando <span class="font-semibold">{{ filteredData.length }}</span>
        de <span class="font-semibold">{{ props.data.length }}</span> registros
        <span v-if="searchQuery" class="filtered-badge">Filtrado</span>
      </p>
    </div>

    <!-- Debug: Mostrar datos crudos -->
    <div v-if="showDebug" class="debug-section">
      <details>
        <summary class="debug-toggle">📊 Datos Debug ({{ props.data.length }} registros)</summary>
        <pre class="debug-data">{{ JSON.stringify(props.data, null, 2) }}</pre>
      </details>
    </div>

    <!-- Tabla Desktop -->
    <div class="table-wrapper desktop-table" v-show="!isMobile">
      <table class="nna-table">
        <thead>
          <tr>
            <th @click="sortBy('first_name')" class="sortable">
              <div class="th-content">
                Nombre
                <span class="sort-icon">{{ getSortIcon('first_name') }}</span>
              </div>
            </th>
            <th>Información</th>
            <th @click="sortBy('age')" class="sortable">
              <div class="th-content">
                Edad
                <span class="sort-icon">{{ getSortIcon('age') }}</span>
              </div>
            </th>
            <th>Estado</th>
            <th @click="sortBy('last_session')" class="sortable">
              <div class="th-content">
                Última Sesión
                <span class="sort-icon">{{ getSortIcon('last_session') }}</span>
              </div>
            </th>
            <th class="actions-column">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <!-- 
            ESTADO DE CARGA
            Muestra un spinner mientras los datos están cargando
          -->
          <tr v-if="loading" class="loading-row">
            <td colspan="6">
              <div class="loading-container">
                <div class="spinner"></div>
                <span>Cargando datos...</span>
              </div>
            </td>
          </tr>

          <!-- 
            ESTADO VACÍO
            Muestra mensaje cuando no hay datos para mostrar
          -->
          <tr v-else-if="filteredData.length === 0" class="empty-row">
            <td colspan="6">
              <div class="empty-state">
                <p class="empty-title">No se encontraron registros</p>
                <p class="empty-subtitle">
                  {{ searchQuery ? 'Intenta ajustar la búsqueda' : 'Agrega tu primer NNA para comenzar' }}
                </p>
              </div>
            </td>
          </tr>

          <!-- 
            ✅ CORRECCIÓN DEL PROBLEMA DE DUPLICACIÓN
            
            PROBLEMA ORIGINAL:
            Antes, el código tenía:
            <TablaDesktopRow v-else v-for="..." />
            
            Esto causaba que Vue manejara incorrectamente la combinación de v-else + v-for
            en el mismo elemento, resultando en renderizado múltiple de los datos.
            
            SOLUCIÓN:
            Usar <template> como contenedor para v-else, y luego aplicar v-for
            al componente TablaDesktopRow. El <template> no genera elementos HTML,
            solo actúa como contenedor lógico para las directivas de Vue.
            
            RESULTADO:
            - Cada NNA se renderiza EXACTAMENTE UNA VEZ
            - La estructura del DOM queda limpia (solo los <tr> de TablaDesktopRow)
            - Vue maneja correctamente la lógica condicional y el loop
          -->
          <template v-else>
            <TablaDesktopRow
              v-for="nna in filteredData"
              :key="nna.id"
              :nna="nna"
              @view="handleView"
              @edit="handleEdit"
              @toggle="handleToggleStatus"
            />
          </template>
        </tbody>
      </table>
    </div>

    <!-- Cards Mobile -->
    <div class="mobile-cards" v-show="isMobile">
      <div v-if="loading" class="loading-container mobile-loading">
        <div class="spinner"></div>
        <span>Cargando datos...</span>
      </div>

      <div v-else-if="filteredData.length === 0" class="empty-state mobile-empty">
        <p class="empty-title">No se encontraron registros</p>
        <p class="empty-subtitle">
          {{ searchQuery ? 'Intenta ajustar la búsqueda' : 'Agrega tu primer NNA' }}
        </p>
      </div>

      <!-- 
        NOTA: En la versión mobile también aplicamos <template>
        para mantener consistencia y buenas prácticas
      -->
      <template v-else>
        <TablaMobileCard
          v-for="nna in filteredData"
          :key="nna.id"
          :nna="nna"
          @view="handleView"
          @edit="handleEdit"
          @toggle="handleToggleStatus"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import TablaDesktopRow from './SubComponentes/TablaDesktopRow.vue'
/* import TablaMobileCard from './SubComponentes/TablaMobileCard.vue' */
import BusquedaFiltros from './SubComponentes/BusquedaFiltros.vue'

// ============================================
// INTERFACES
// ============================================
interface NnaData {
  id: number | string
  first_name: string
  last_name: string
  birth_date: string
  current_grade: string
  status: 'active' | 'suspended'
  last_session: string
  rut?: string
  full_name?: string
  commune_name?: string
  region_name?: string
  address?: string
  autism_level?: string
  school_journey?: string
  created_at?: string
  pie_status_display?: string
  attended_where_name?: string
  usuarios_count?: number
  autism_level_value?: string
}

// ============================================
// PROPS & EMITS
// ============================================
/**
 * Props recibidas desde el componente padre (IngresoNneDashboard)
 * - data: Array de NNA que viene del backend
 * - loading: Estado de carga para mostrar spinner
 */
const props = defineProps<{
  data: NnaData[]
  loading?: boolean
}>()

/**
 * Eventos que se emiten hacia el componente padre
 * - view: Cuando se hace clic en ver detalles
 * - edit: Cuando se hace clic en editar
 * - toggle: Cuando se cambia el estado activo/suspendido
 */
const emit = defineEmits<{
  view: [nna: NnaData]
  edit: [nna: NnaData]
  toggle: [nna: NnaData, newStatus: 'active' | 'suspended']
}>()

// ============================================
// ESTADO LOCAL
// ============================================
const searchQuery = ref('')
const sortColumn = ref<keyof NnaData | ''>('')
const sortDirection = ref<'asc' | 'desc'>('asc')
const showDebug = ref(false)

// ============================================
// RESPONSIVE: DETECTAR MOBILE
// ============================================
const isMobile = ref(window.innerWidth < 768)
const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}
onMounted(() => window.addEventListener('resize', handleResize))
onUnmounted(() => window.removeEventListener('resize', handleResize))

// ============================================
// COMPUTED: FILTRADO Y ORDENAMIENTO
// ============================================
/**
 * Computed que procesa los datos para:
 * 1. Aplicar búsqueda por texto
 * 2. Ordenar por columna seleccionada
 * 
 * Este computed es REACTIVO, por lo que cada vez que:
 * - props.data cambia (nuevos datos del backend)
 * - searchQuery cambia (el usuario busca)
 * - sortColumn/sortDirection cambian (el usuario ordena)
 * 
 * Se recalcula automáticamente y actualiza la tabla
 */
const filteredData = computed(() => {
  let result = [...props.data]

  // FILTRO DE BÚSQUEDA
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(nna =>
      nna.first_name?.toLowerCase().includes(query) ||
      nna.last_name?.toLowerCase().includes(query) ||
      nna.rut?.toLowerCase().includes(query) ||
      nna.commune_name?.toLowerCase().includes(query) ||
      nna.current_grade?.toLowerCase().includes(query) ||
      nna.autism_level?.toLowerCase().includes(query)
    )
  }

  // ORDENAMIENTO
  if (sortColumn.value) {
    result.sort((a, b) => {
      let aVal: any = a[sortColumn.value as keyof NnaData]
      let bVal: any = b[sortColumn.value as keyof NnaData]

      // Caso especial: ordenar por edad calculada
      if (sortColumn.value === 'age') {
        aVal = calculateAge(a.birth_date)
        bVal = calculateAge(b.birth_date)
      }

      if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
      return 0
    })
  }

  return result
})

// ============================================
// MÉTODOS
// ============================================

/**
 * Maneja el ordenamiento al hacer clic en headers de columna
 * Si ya está ordenando por esa columna, invierte la dirección
 * Si es una nueva columna, inicia con orden ascendente
 */
const sortBy = (column: keyof NnaData) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

/**
 * Retorna el icono apropiado para el estado de ordenamiento
 */
const getSortIcon = (column: string) => {
  if (sortColumn.value !== column) return '⇅'
  return sortDirection.value === 'asc' ? '↑' : '↓'
}

/**
 * Calcula la edad a partir de la fecha de nacimiento
 */
const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 0
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

/**
 * Manejadores de eventos que propagan las acciones al padre
 */
const handleToggleStatus = (nna: NnaData, newStatus: 'active' | 'suspended') => {
  emit('toggle', nna, newStatus)
}
const handleView = (nna: NnaData) => emit('view', nna)
const handleEdit = (nna: NnaData) => emit('edit', nna)
</script>

<style scoped>
.tabla-filtro-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Sección Debug */
.debug-section {
  padding: 1rem 1.5rem;
  background: #fef3c7;
  border-bottom: 1px solid #f59e0b;
}

.debug-toggle {
  cursor: pointer;
  font-weight: 600;
  color: #92400e;
  user-select: none;
}

.debug-data {
  margin-top: 0.5rem;
  padding: 1rem;
  background: #fffbeb;
  border: 1px solid #fbbf24;
  border-radius: 6px;
  font-size: 0.75rem;
  max-height: 300px;
  overflow: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* Información de resultados */
.results-info {
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.results-text {
  font-size: 0.875rem;
  color: #6b7280;
}

.filtered-badge {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.125rem 0.5rem;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Tabla Desktop */
.table-wrapper {
  overflow-x: auto;
}

.desktop-table {
  display: block;
}

@media (max-width: 768px) {
  .desktop-table {
    display: none;
  }
}

.nna-table {
  width: 100%;
  border-collapse: collapse;
}

.nna-table thead {
  background: #f9fafb;
}

.nna-table th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
}

.nna-table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}

.nna-table th.sortable:hover {
  background: #f3f4f6;
}

.th-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-icon {
  font-size: 0.875rem;
  color: #9ca3af;
}

.nna-table td {
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  color: #1f2937;
  border-bottom: 1px solid #f3f4f6;
}

/* Estados de carga y vacío */
.loading-row td {
  text-align: center;
  padding: 3rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #6b7280;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-row td {
  text-align: center;
  padding: 3rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #6b7280;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  color: #d1d5db;
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
}

.empty-subtitle {
  font-size: 0.875rem;
}

/* Cards Mobile */
.mobile-cards {
  display: none;
  padding: 1rem;
  gap: 1rem;
  flex-direction: column;
}

@media (max-width: 768px) {
  .mobile-cards {
    display: flex;
  }
}

.mobile-loading,
.mobile-empty {
  padding: 2rem;
  text-align: center;
}

/* Paginación */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  gap: 0.25rem;
}

.pagination-number {
  min-width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-number:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.pagination-number.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}
</style>