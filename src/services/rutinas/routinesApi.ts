// src/services/rutinas/routinesApi.ts
// -------------------------------------------------------------
// Servicio de API para el Módulo de Rutinas
// -------------------------------------------------------------

import http from '@/services/http'
import type { AxiosResponse } from 'axios'

// --- Importación de Tipos Centralizados ---
import type {
  DailyRoutineList,
  DailyRoutineDetail,
  RoutineWriteData,
  RoutineSchedule,
  RoutineStep,
  RoutineStrategy,
  WizardSchedule,
  WizardStep,
  WizardStrategies,
  WizardStrategy, // ✅ Agregado aquí para resolver el error TS6133 al usarlo abajo
  LogCreateData,
  LogEntry,
  ToggleStatusResponse,
  CloneRoutineData,
  ApiFilters,
  EffectivenessReport,
  ComparisonData
} from '@/type/rutinas/rutinas'
import { RoutineCreateData } from '@/store/rutinas/routinesStore'

/**
 * Helper para construir la URL base de las rutinas anidadas de un niño.
 */
const API_BASE_URL = (childId: number) => `/seguimiento/ninos/${childId}/rutinas-diarias`

export const routinesApi = {

  // ==========================================================
  // 1. DailyRoutineViewSet (CRUD Principal)
  // ==========================================================

  getRoutines(childId: number, params?: ApiFilters): Promise<AxiosResponse<DailyRoutineList[]>> {
    return http.get(API_BASE_URL(childId) + '/', { params })
  },

  getRoutineDetail(childId: number, routineId: number): Promise<AxiosResponse<DailyRoutineDetail>> {
    return http.get(`${API_BASE_URL(childId)}/${routineId}/`)
  },

  createRoutine(childId: number, data: RoutineCreateData): Promise<AxiosResponse<DailyRoutineDetail>> {
    return http.post(`${API_BASE_URL(childId)}/`, data)
  },

  updateRoutine(childId: number, routineId: number, data: Partial<RoutineWriteData>): Promise<AxiosResponse<DailyRoutineDetail>> {
    return http.patch(`${API_BASE_URL(childId)}/${routineId}/`, data)
  },

  deleteRoutine(childId: number, routineId: number): Promise<AxiosResponse<void>> {
    return http.delete(`${API_BASE_URL(childId)}/${routineId}/`)
  },

  // ==========================================================
  // 2. Acciones Personalizadas
  // ==========================================================

  toggleStatus(childId: number, routineId: number): Promise<AxiosResponse<ToggleStatusResponse>> {
    return http.post(`${API_BASE_URL(childId)}/${routineId}/toggle_status/`)
  },

  cloneRoutine(childId: number, routineId: number, data: CloneRoutineData): Promise<AxiosResponse<DailyRoutineDetail>> {
    return http.post(`${API_BASE_URL(childId)}/${routineId}/clone/`, data)
  },

  // ==========================================================
  // 3. Recursos Anidados (Horarios, Pasos, Estrategias)
  // ==========================================================

  createSchedule(childId: number, routineId: number, data: WizardSchedule): Promise<AxiosResponse<RoutineSchedule>> {
    return http.post(`${API_BASE_URL(childId)}/${routineId}/horarios/`, data)
  },

  createStep(childId: number, routineId: number, data: WizardStep): Promise<AxiosResponse<RoutineStep>> {
    return http.post(`${API_BASE_URL(childId)}/${routineId}/pasos/`, data)
  },

  reorderSteps(childId: number, routineId: number, stepIds: number[]): Promise<AxiosResponse<void>> {
    return http.post(`${API_BASE_URL(childId)}/${routineId}/pasos/reorder/`, { step_ids: stepIds })
  },
  
  /**
   * ✅ IMPLEMENTADO: Crea la configuración general de estrategias (Wizard - Paso 4).
   */
  createStrategyConfig(childId: number, routineId: number, data: WizardStrategies): Promise<AxiosResponse<RoutineStrategy>> {
    return http.post(`${API_BASE_URL(childId)}/${routineId}/estrategias/`, data)
  },

  /**
   * ✅ IMPLEMENTADO: Crea una estrategia individual.
   * NOTA: Se agrega para evitar errores de tipo "is not a function" en el store.
   */
  createIndividualStrategy(childId: number, routineId: number, data: WizardStrategy): Promise<AxiosResponse<any>> {
    return http.post(`${API_BASE_URL(childId)}/${routineId}/estrategias-individuales/`, data)
  },
  
  updateStrategy(childId: number, routineId: number, data: Partial<WizardStrategies>): Promise<AxiosResponse<RoutineStrategy>> {
    return http.patch(`${API_BASE_URL(childId)}/${routineId}/estrategias/`, data)
  },

  // ==========================================================
  // 4. Registros de Cumplimiento (Logs)
  // ==========================================================
  
  createLog(childId: number, routineId: number, data: LogCreateData): Promise<AxiosResponse<LogEntry>> {
    return http.post(`${API_BASE_URL(childId)}/${routineId}/registros/`, data)
  },

  getLogs(childId: number, routineId: number, params?: any): Promise<AxiosResponse<LogEntry[]>> {
    return http.get(`${API_BASE_URL(childId)}/${routineId}/registros/`, { params })
  },

  // ==========================================================
  // 5. Vistas de Analítica (Reportes)
  // ==========================================================

  getDailyAgenda(childId: number): Promise<AxiosResponse<DailyRoutineList[]>> {
    return http.get(`${API_BASE_URL(childId)}/agenda-hoy/`)
  },

  getComparison(childId: number, routineAId: number, routineBId: number, periodDays: number): Promise<AxiosResponse<ComparisonData>> {
    const params = {
      routine_a: routineAId,
      routine_b: routineBId,
      period_days: periodDays
    }
    return http.get(`${API_BASE_URL(childId)}/comparar/`, { params })
  },

  getEffectivenessReport(childId: number, routineId: number, periodDays: number = 30): Promise<AxiosResponse<EffectivenessReport>> {
    return http.get(`${API_BASE_URL(childId)}/${routineId}/effectiveness_report/`, {
      params: { period_days: periodDays }
    })
  }
}