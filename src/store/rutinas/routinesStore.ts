// src/store/rutinas/routinesStore.ts
// ✅ VERSIÓN FINAL - Con gestión de PENDIENTES y COMPLETADAS HOY

import { defineStore } from 'pinia'
import { routinesApi } from '@/services/rutinas/routinesApi'
import type {
  DailyRoutineList,
  DailyRoutineDetail,
  RoutineWriteData,
  RoutineFilters,
  ApiFilters,
  ToggleStatusResponse
} from '@/type/rutinas/rutinas'

// =============================================================================
// INTERFACES ADICIONALES DEL STORE
// =============================================================================

/**
 * Datos para actualizar una rutina (PATCH)
 */
export type RoutineUpdateData = Partial<RoutineWriteData>

/**
 * Tipado del estado del store de Pinia.
 */
export interface RoutinesState {
  routines: DailyRoutineList[]        // Todas las rutinas (activas, pausadas, etc)
  pendingRoutines: DailyRoutineList[] // ✅ NUEVO: Solo las pendientes de hoy
  currentRoutine: DailyRoutineDetail | null
  loading: boolean
  error: string | null
  filters: RoutineFilters
}

// =============================================================================
// DEFINICIÓN DEL STORE
// =============================================================================

export const useRoutinesStore = defineStore('routines', {
  state: (): RoutinesState => ({
    routines: [],
    pendingRoutines: [], // Inicializamos vacío
    currentRoutine: null,
    loading: false,
    error: null,
    filters: {
      status: 'active',
      routineType: null,
      search: ''
    }
  }),

  getters: {
    /**
     * Rutinas activas (status 'active' y flag is_active true)
     */
    activeRoutines: (state: RoutinesState): DailyRoutineList[] =>
      state.routines.filter(r => r.is_active && r.status === 'active'),

    /**
     * Rutinas archivadas
     */
    archivedRoutines: (state: RoutinesState): DailyRoutineList[] =>
      state.routines.filter(r => r.status === 'archived'),

    /**
     * ✅ NUEVO: Cuenta de rutinas pendientes para el Badge rojo
     */
    pendingCount: (state: RoutinesState): number => state.pendingRoutines.length,

    /**
     * ✅ NUEVO: IDs de rutinas completadas hoy.
     * Lógica: Si está activa pero NO está en pendientes, es que ya se hizo hoy.
     */
    completedTodayIds: (state: RoutinesState): number[] => {
      const activeIds = state.routines
        .filter(r => r.is_active && r.status === 'active')
        .map(r => r.id)
      
      const pendingIds = state.pendingRoutines.map(r => r.id)
      
      // Retorna las activas que NO están pendientes
      return activeIds.filter(id => !pendingIds.includes(id))
    },

    /**
     * Rutinas filtradas según los filtros locales del store
     */
    filteredRoutines: (state: RoutinesState): DailyRoutineList[] => {
      let filtered = state.routines

      // Filtro por estado
      if (state.filters.status !== 'all') {
        filtered = filtered.filter(r => r.status === state.filters.status)
      }

      // Filtro por tipo de rutina
      if (state.filters.routineType) {
        filtered = filtered.filter(r => r.routine_type === state.filters.routineType)
      }

      // Filtro por búsqueda de texto
      if (state.filters.search) {
        const search = state.filters.search.toLowerCase()
        filtered = filtered.filter(r =>
          r.name.toLowerCase().includes(search)
        )
      }

      return filtered
    },

    /**
     * Obtiene una rutina por ID
     */
    getRoutineById: (state: RoutinesState) => 
      (id: number): DailyRoutineList | undefined =>
        state.routines.find(r => r.id === id)
  },

  actions: {
    /**
     * Carga la lista de rutinas para un niño
     */
    async fetchRoutines(childId: number, filters: ApiFilters = {}): Promise<void> {
      this.loading = true
      this.error = null

      try {
        const response = await routinesApi.getRoutines(childId, filters)
        this.routines = response.data
        
        // Al cargar las rutinas, también actualizamos las pendientes para sincronizar estados
        // (Opcional: puedes llamarlo explícitamente desde el componente si prefieres)
        await this.fetchPendingRoutines(childId)
        
      } catch (err: any) {
        this.error = err.message || 'Error al cargar rutinas'
        console.error('Error en fetchRoutines:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * ✅ NUEVO: Carga las rutinas pendientes para el día de hoy
     * Llama al endpoint /pending/ del backend
     */
    async fetchPendingRoutines(childId: number): Promise<void> {
      // No ponemos loading global para no bloquear toda la UI si esto es secundario
      try {
        // Asumimos que agregaste getPendingRoutines a tu routinesApi service
        const response = await routinesApi.getPendingRoutines(childId)
        this.pendingRoutines = response.data
      } catch (err: any) {
        console.error('Error cargando rutinas pendientes:', err)
        // No lanzamos error crítico, solo logueamos
      }
    },

    /**
     * Carga el detalle completo de una rutina
     */
    async fetchRoutineDetail(childId: number, routineId: number): Promise<DailyRoutineDetail> {
      this.loading = true
      this.error = null

      try {
        const response = await routinesApi.getRoutineDetail(childId, routineId)
        this.currentRoutine = response.data
        return response.data
      } catch (err: any) {
        this.error = err.message || 'Error al cargar detalle de rutina'
        console.error('Error en fetchRoutineDetail:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Crea una nueva rutina
     */
    async createRoutine(childId: number, data: RoutineWriteData): Promise<DailyRoutineList> {
      this.loading = true
      this.error = null

      try {
        const response = await routinesApi.createRoutine(childId, data)
        this.routines.push(response.data)
        // Si creamos una nueva, por defecto estará pendiente hoy
        await this.fetchPendingRoutines(childId) 
        return response.data
      } catch (err: any) {
        this.error = err.message || 'Error al crear rutina'
        console.error('Error en createRoutine:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Actualiza una rutina existente
     */
    async updateRoutine(
      childId: number, 
      routineId: number, 
      data: RoutineUpdateData
    ): Promise<DailyRoutineList> {
      this.loading = true
      this.error = null

      try {
        const response = await routinesApi.updateRoutine(childId, routineId, data)
        
        // Actualiza el objeto en el listado local
        const index = this.routines.findIndex(r => r.id === routineId)
        if (index !== -1) {
          this.routines[index] = { ...this.routines[index], ...response.data }
        }
        
        // Si es la rutina actual, también la actualiza
        if (this.currentRoutine?.id === routineId) {
          this.currentRoutine = { ...this.currentRoutine, ...response.data }
        }
        
        // Refrescamos pendientes por si cambió de estado o se desactivó
        await this.fetchPendingRoutines(childId)

        return response.data
      } catch (err: any) {
        this.error = err.message || 'Error al actualizar rutina'
        console.error('Error en updateRoutine:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Elimina (archiva) una rutina
     */
    async deleteRoutine(childId: number, routineId: number): Promise<void> {
      this.loading = true
      this.error = null

      try {
        await routinesApi.deleteRoutine(childId, routineId)
        
        // Actualizar estado local
        const index = this.routines.findIndex(r => r.id === routineId)
        if (index !== -1) {
          this.routines[index].status = 'archived'
          this.routines[index].is_active = false
        }
        
        // Si es la rutina actual, limpiarla
        if (this.currentRoutine?.id === routineId) {
          this.currentRoutine = null
        }

        // Refrescar pendientes (si la borré, ya no está pendiente)
        await this.fetchPendingRoutines(childId)

      } catch (err: any) {
        this.error = err.message || 'Error al eliminar rutina'
        console.error('Error en deleteRoutine:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Clona una rutina existente
     */
    async cloneRoutine(
      childId: number, 
      routineId: number, 
      newName: string
    ): Promise<DailyRoutineList> {
      this.loading = true
      this.error = null

      try {
        const response = await routinesApi.cloneRoutine(childId, routineId, {
          new_name: newName,
          copy_steps: true,
          copy_strategies: true
        })
        
        // Añade la nueva rutina clonada al listado
        this.routines.push(response.data)
        // La clonada aparecerá como pendiente
        await this.fetchPendingRoutines(childId)
        
        return response.data
      } catch (err: any) {
        this.error = err.message || 'Error al clonar rutina'
        console.error('Error en cloneRoutine:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Alterna el estado de una rutina (activa/pausada)
     */
    async toggleStatus(
      childId: number, 
      routineId: number
    ): Promise<ToggleStatusResponse> {
      this.loading = true
      this.error = null

      try {
        const response = await routinesApi.toggleStatus(childId, routineId)
        
        // Actualizar estado local
        const index = this.routines.findIndex(r => r.id === routineId)
        if (index !== -1) {
          this.routines[index].status = response.data.status
          this.routines[index].is_active = response.data.status === 'active'
        }
        
        // Si es la rutina actual, también actualizarla
        if (this.currentRoutine?.id === routineId) {
          this.currentRoutine.status = response.data.status
          this.currentRoutine.is_active = response.data.status === 'active'
        }
        
        // Refrescar pendientes
        await this.fetchPendingRoutines(childId)
        
        return response.data
      } catch (err: any) {
        this.error = err.message || 'Error al cambiar estado de rutina'
        console.error('Error en toggleStatus:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Actualiza los filtros del store
     */
    setFilters(filters: Partial<RoutineFilters>): void {
      this.filters = { ...this.filters, ...filters }
    },

    /**
     * Limpia el estado de error
     */
    clearError(): void {
      this.error = null
    },

    /**
     * Limpia la rutina actual
     */
    clearCurrentRoutine(): void {
      this.currentRoutine = null
    },

    /**
     * Resetea todos los filtros a sus valores por defecto
     */
    resetFilters(): void {
      this.filters = {
        status: 'active',
        routineType: null,
        search: ''
      }
    },

    // --- MÉTODOS LOCALES (Sin API) ---

    addRoutineLocal(routine: DailyRoutineList): void {
      const exists = this.routines.some(r => r.id === routine.id)
      if (!exists) {
        this.routines.push(routine)
      }
    },

    updateRoutineLocal(routine: Partial<DailyRoutineList> & { id: number }): void {
      const index = this.routines.findIndex(r => r.id === routine.id)
      if (index !== -1) {
        this.routines[index] = { ...this.routines[index], ...routine }
      }
    },

    removeRoutineLocal(routineId: number): void {
      const index = this.routines.findIndex(r => r.id === routineId)
      if (index !== -1) {
        this.routines.splice(index, 1)
        if (this.currentRoutine?.id === routineId) {
          this.currentRoutine = null
        }
      }
    }
  }
})