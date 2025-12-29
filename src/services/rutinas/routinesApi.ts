// src/services/rutinas/routinesApi.ts
// -------------------------------------------------------------
// Servicio de API para el Módulo de Rutinas
// ✅ CORREGIDO: Usa RoutineWriteData en lugar de RoutineCreateData
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
  WizardStrategy,
  LogCreateData,
  LogEntry,
  ToggleStatusResponse,
  CloneRoutineData,
  ApiFilters,
  EffectivenessReport,
  ComparisonData
} from '@/type/rutinas/rutinas'

/**
 * Helper para construir la URL base de las rutinas anidadas de un niño.
 */
const API_BASE_URL = (childId: number) => `/seguimiento/ninos/${childId}/rutinas-diarias`

export const routinesApi = {

  // ==========================================================
  // 1. DailyRoutineViewSet (CRUD Principal)
  // ==========================================================

  /**
   * Obtiene la lista de rutinas de un niño
   */
  getRoutines(childId: number, params?: ApiFilters): Promise<AxiosResponse<DailyRoutineList[]>> {
    return http.get(API_BASE_URL(childId) + '/', { params })
  },

  /**
   * Obtiene el detalle completo de una rutina
   */
  getRoutineDetail(childId: number, routineId: number): Promise<AxiosResponse<DailyRoutineDetail>> {
    return http.get(`${API_BASE_URL(childId)}/${routineId}/`)
  },

  /**
   * Crea una nueva rutina
   * ✅ CORREGIDO: Usa RoutineWriteData en lugar de RoutineCreateData
   */
  createRoutine(childId: number, data: RoutineWriteData): Promise<AxiosResponse<DailyRoutineDetail>> {
    return http.post(`${API_BASE_URL(childId)}/`, data)
  },

  /**
   * Actualiza una rutina existente (PATCH)
   */
  updateRoutine(childId: number, routineId: number, data: Partial<RoutineWriteData>): Promise<AxiosResponse<DailyRoutineDetail>> {
    return http.patch(`${API_BASE_URL(childId)}/${routineId}/`, data)
  },

  /**
   * Elimina (archiva) una rutina
   */
  deleteRoutine(childId: number, routineId: number): Promise<AxiosResponse<void>> {
    return http.delete(`${API_BASE_URL(childId)}/${routineId}/`)
  },

  // ==========================================================
  // 2. Acciones Personalizadas
  // ==========================================================

  /**
   * Alterna el estado de una rutina (activa/pausada)
   */
  toggleStatus(childId: number, routineId: number): Promise<AxiosResponse<ToggleStatusResponse>> {
    return http.post(`${API_BASE_URL(childId)}/${routineId}/toggle_status/`)
  },

  /**
   * Clona una rutina existente
   */
  cloneRoutine(childId: number, routineId: number, data: CloneRoutineData): Promise<AxiosResponse<DailyRoutineDetail>> {
    return http.post(`${API_BASE_URL(childId)}/${routineId}/clone/`, data)
  },

  // ==========================================================
  // 3. Recursos Anidados (Horarios, Pasos, Estrategias)
  // ==========================================================

  /**
   * Crea un horario para una rutina
   */
  createSchedule(childId: number, routineId: number, data: WizardSchedule): Promise<AxiosResponse<RoutineSchedule>> {
    return http.post(`${API_BASE_URL(childId)}/${routineId}/horarios/`, data)
  },

  /**
   * Crea un paso para una rutina
   */
  createStep(childId: number, routineId: number, data: WizardStep): Promise<AxiosResponse<RoutineStep>> {
    return http.post(`${API_BASE_URL(childId)}/${routineId}/pasos/`, data)
  },

  /**
   * Reordena los pasos de una rutina
   */
  reorderSteps(childId: number, routineId: number, stepIds: number[]): Promise<AxiosResponse<void>> {
    return http.post(`${API_BASE_URL(childId)}/${routineId}/pasos/reorder/`, { step_ids: stepIds })
  },
  
  /**
   * Crea la configuración general de estrategias (Wizard - Paso 4)
   */
  createStrategyConfig(childId: number, routineId: number, data: WizardStrategies): Promise<AxiosResponse<RoutineStrategy>> {
    return http.post(`${API_BASE_URL(childId)}/${routineId}/estrategias/`, data)
  },

  /**
   * Crea una estrategia individual
   */
  createIndividualStrategy(childId: number, routineId: number, data: WizardStrategy): Promise<AxiosResponse<any>> {
    return http.post(`${API_BASE_URL(childId)}/${routineId}/estrategias-individuales/`, data)
  },
  
  /**
   * Actualiza la configuración de estrategias
   */
  updateStrategy(childId: number, routineId: number, data: Partial<WizardStrategies>): Promise<AxiosResponse<RoutineStrategy>> {
    return http.patch(`${API_BASE_URL(childId)}/${routineId}/estrategias/`, data)
  },

  // ==========================================================
  // 4. Registros de Cumplimiento (Logs)
  // ==========================================================
  
  /**
   * Crea un log de ejecución de rutina
   */
  createLog(childId: number, routineId: number, data: LogCreateData): Promise<AxiosResponse<LogEntry>> {
    return http.post(`${API_BASE_URL(childId)}/${routineId}/registros/`, data)
  },

  /**
   * Obtiene los logs de una rutina
   */
  getLogs(childId: number, routineId: number, params?: any): Promise<AxiosResponse<LogEntry[]>> {
    return http.get(`${API_BASE_URL(childId)}/${routineId}/registros/`, { params })
  },

  // ==========================================================
  // 5. Vistas de Analítica (Reportes)
  // ==========================================================

  /**
   * Obtiene la agenda del día para un niño
   */
  getDailyAgenda(childId: number): Promise<AxiosResponse<DailyRoutineList[]>> {
    return http.get(`${API_BASE_URL(childId)}/agenda-hoy/`)
  },

  /**
   * Compara dos rutinas
   */
  getComparison(childId: number, routineAId: number, routineBId: number, periodDays: number): Promise<AxiosResponse<ComparisonData>> {
    const params = {
      routine_a: routineAId,
      routine_b: routineBId,
      period_days: periodDays
    }
    return http.get(`${API_BASE_URL(childId)}/comparar/`, { params })
  },

  /**
   * Obtiene el reporte de efectividad de una rutina
   */
  getEffectivenessReport(childId: number, routineId: number, periodDays: number = 30): Promise<AxiosResponse<EffectivenessReport>> {
    return http.get(`${API_BASE_URL(childId)}/${routineId}/effectiveness_report/`, {
      params: { period_days: periodDays }
    })
  }
} 