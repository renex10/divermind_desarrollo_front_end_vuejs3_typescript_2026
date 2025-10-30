// stores/routinesStore.ts

import { defineStore } from 'pinia'
// (Asumiendo que tu cliente de API también está tipado)
import { routinesApi } from '@/services/rutinas/routinesApi'

// =============================================================================
// INTERFACES (Basadas en los Serializers de Django)
// =============================================================================

/**
 * Filtros de estado para el store.
 */
export type RoutineStatusFilter = 'active' | 'paused' | 'archived' | 'draft' | 'all'

/**
 * Objeto de filtros del store.
 */
export interface RoutineFilters {
  status: RoutineStatusFilter
  routineType: string | null
  search: string
}

/**
 * Objeto para la API de listado (DailyRoutineListSerializer)
 [cite_start]* [cite: 54, 55]
 */
export interface DailyRoutineList {
  id: number
  name: string
  routine_type: string
  routine_type_display: string
  status: string
  status_display: string
  is_active: boolean
  child_name: string
  total_steps: number
  completion_rate_7days: number | null
  date_started: string
  created_at: string
}

/**
 * Objeto para la API de detalle (DailyRoutineDetailSerializer)
 * Es un superconjunto de 'DailyRoutineList'.
 [cite_start]* [cite: 58, 59, 60, 61, 62]
 */
export interface DailyRoutineDetail extends DailyRoutineList {
  description: string
  // (Aquí se tiparían los objetos anidados si se definieran)
  schedules: any[] // Debería ser RoutineSchedule[]
  steps: any[] // Debería ser RoutineStep[]
  strategies: any | null // Debería ser RoutineStrategy | null
  motivation: any | null // Debería ser RoutineMotivation | null
  independence_goal: any | null // Debería ser RoutineIndependenceGoal | null
  coordination: any | null // Debería ser RoutineCoordination | null
  challenges: any | null // Debería ser RoutineChallenge | null
  evaluations: any[] // Debería ser RoutineEvaluation[]
}

/**
 * Datos para crear una rutina (DailyRoutineWriteSerializer)
 [cite_start]* [cite: 63]
 */
// Reemplaza la interfaz RoutineCreateData en routinesStore.ts:

/**
 * Datos para crear una rutina (DailyRoutineWriteSerializer)
 */
export interface RoutineCreateData {
  name: string
  routine_type: string
  description?: string  // Ahora es opcional
  status: 'active' | 'draft'  // Ahora es requerido
  is_active?: boolean
  date_started?: string | null
  date_ended?: string | null
}
/**
 * Datos para actualizar una rutina (PATCH)
 */
export type RoutineUpdateData = Partial<RoutineCreateData>

/**
 * Parámetros de filtro para la API.
 */
export interface ApiFilters {
  status?: string
  routine_type?: string
  is_active?: boolean
}

/**
 * Respuesta de la API para 'toggleStatus'.
 */
export interface ToggleStatusResponse {
  status: string
  message: string
}

/**
 * Tipado del estado del store de Pinia.
 */
export interface RoutinesState {
  routines: DailyRoutineList[]
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
    activeRoutines: (state: RoutinesState): DailyRoutineList[] =>
      state.routines.filter(r => r.is_active && r.status === 'active'),

    archivedRoutines: (state: RoutinesState): DailyRoutineList[] =>
      state.routines.filter(r => r.status === 'archived'),

    /**
     * Devuelve rutinas filtradas según los filtros locales del store.
     */
    filteredRoutines: (state: RoutinesState): DailyRoutineList[] => {
      let filtered = state.routines

      if (state.filters.status !== 'all') {
        filtered = filtered.filter(r => r.status === state.filters.status)
      }

      if (state.filters.routineType) {
        filtered = filtered.filter(r => r.routine_type === state.filters.routineType)
      }

      if (state.filters.search) {
        const search = state.filters.search.toLowerCase()
        filtered = filtered.filter(r =>
          r.name.toLowerCase().includes(search)
        )
      }

      return filtered
    },

    getRoutineById: (state: RoutinesState) => 
      (id: number): DailyRoutineList | undefined =>
        state.routines.find(r => r.id === id)
  },

  actions: {
    /**
     * Carga la lista de rutinas para un niño.
     */
    async fetchRoutines(childId: number, filters: ApiFilters = {}): Promise<void> {
      this.loading = true
      this.error = null

      try {
        // (Asumiendo que routinesApi.getRoutines devuelve { data: DailyRoutineList[] })
        const response = await routinesApi.getRoutines(childId, filters)
        this.routines = response.data
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Carga el detalle completo de una rutina.
     */
    async fetchRoutineDetail(childId: number, routineId: number): Promise<DailyRoutineDetail> {
      this.loading = true

      try {
        // (Asumiendo que routinesApi.getRoutineDetail devuelve { data: DailyRoutineDetail })
        const response = await routinesApi.getRoutineDetail(childId, routineId)
        this.currentRoutine = response.data
        return response.data
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Crea una nueva rutina.
     */
    async createRoutine(childId: number, data: RoutineCreateData): Promise<DailyRoutineList> {
      this.loading = true

      try {
        // (Asumiendo que la API devuelve el objeto 'DailyRoutineList' al crear)
        const response = await routinesApi.createRoutine(childId, data)
        this.routines.push(response.data)
        return response.data
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Actualiza una rutina existente.
     */
    async updateRoutine(childId: number, routineId: number, data: RoutineUpdateData): Promise<DailyRoutineList> {
      this.loading = true

      try {
        const response = await routinesApi.updateRoutine(childId, routineId, data)
        const index = this.routines.findIndex(r => r.id === routineId)
        if (index !== -1) {
          // Actualiza el objeto en el listado
          this.routines[index] = { ...this.routines[index], ...response.data }
        }
        return response.data
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * "Elimina" (archiva) una rutina.
     */
    async deleteRoutine(childId: number, routineId: number): Promise<void> {
      this.loading = true

      try {
        await routinesApi.deleteRoutine(childId, routineId)
        // La API (views.py) no borra, sino que archiva.
        // Por consistencia, actualizamos el estado local o recargamos.
        // Opción 1: Filtrar (como en el JS)
        // this.routines = this.routines.filter(r => r.id !== routineId)
        
        // Opción 2: Actualizar estado (más preciso)
        const index = this.routines.findIndex(r => r.id === routineId)
        if (index !== -1) {
          this.routines[index].status = 'archived'
          this.routines[index].is_active = false
        }
        
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Clona una rutina existente.
     */
    async cloneRoutine(childId: number, routineId: number, newName: string): Promise<DailyRoutineList> {
      this.loading = true

      try {
        const response = await routinesApi.cloneRoutine(childId, routineId, {
          new_name: newName,
          copy_steps: true,
          copy_strategies: true
        })
        this.routines.push(response.data) // Añade la nueva rutina clonada
        return response.data
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Alterna el estado de una rutina (activa/pausada).
     */
    async toggleStatus(childId: number, routineId: number): Promise<ToggleStatusResponse> {
      this.loading = true

      try {
        const response = await routinesApi.toggleStatus(childId, routineId)
        const index = this.routines.findIndex(r => r.id === routineId)
        if (index !== -1) {
          this.routines[index].status = response.data.status
          this.routines[index].is_active = response.data.status === 'active'
        }
        return response.data
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Actualiza los filtros del store.
     */
    setFilters(filters: Partial<RoutineFilters>): void {
      this.filters = { ...this.filters, ...filters }
    },

    /**
     * Limpia el estado de error.
     */
clearError(): void {
  this.error = null
},

    
// Agregar este método en la sección de actions del routinesStore.ts
// Justo después del método clearError()

/**
 * Añade una rutina directamente al estado local sin hacer petición a la API.
 * Útil cuando ya tienes el objeto de rutina (ej: después de crearla en el wizard).
 */
addRoutineLocal(routine: DailyRoutineList): void {
  // Verificar que no exista ya en el array
  const exists = this.routines.some(r => r.id === routine.id)
  if (!exists) {
    this.routines.push(routine)
  }
}
  }
})

