// src/services/rutinas/routinesApi.ts
// -------------------------------------------------------------
// Servicio de API para el Módulo de Rutinas
//
// Este archivo centraliza todas las llamadas al backend de Django
// relacionadas con la gestión de rutinas diarias.
//
// Dependencias:
// - /src/services/http.ts: Instancia de Axios preconfigurada
//   (maneja baseURL, autenticación y refresh de tokens).
// - /src/type/rutinas: Definiciones de TypeScript para
//   todas las interfaces y tipos de datos de rutinas.
//
// Arquitectura de URL:
// El baseURL de http.ts es: http://127.0.0.1:8000/api
// Las rutas en este archivo son relativas a esa base.
// -------------------------------------------------------------

import http from '@/services/http'
import type { AxiosResponse } from 'axios'
import type { WizardStrategy } from '@/type/rutinas/rutinas'

// --- Importación de Tipos Centralizados ---
// Asumimos que todas las interfaces están definidas en este archivo
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
 * El resultado es: /seguimiento/ninos/{childId}/rutinas-diarias
 */
const API_BASE_URL = (childId: number) => `/seguimiento/ninos/${childId}/rutinas-diarias`

// --- Definición del Servicio de API ---

export const routinesApi = {

  // ==========================================================
  // 1. DailyRoutineViewSet (CRUD Principal de Rutinas)
  // ==========================================================

  /**
   * Obtiene la lista de todas las rutinas para un niño.
   * GET /api/seguimiento/ninos/{childId}/rutinas-diarias/
   */
  getRoutines(childId: number, params?: ApiFilters): Promise<AxiosResponse<DailyRoutineList[]>> {
    return http.get(API_BASE_URL(childId) + '/', { params })
  },

  /**
   * Obtiene el detalle completo de una rutina.
   * GET /api/seguimiento/ninos/{childId}/rutinas-diarias/{routineId}/
   */
  getRoutineDetail(childId: number, routineId: number): Promise<AxiosResponse<DailyRoutineDetail>> {
    return http.get(`${API_BASE_URL(childId)}/${routineId}/`)
  },

  /**
   * Crea una nueva rutina (Usado por el Wizard - Paso 1).
   * POST /api/seguimiento/ninos/{childId}/rutinas-diarias/
   * (Se espera que la API devuelva el objeto DailyRoutineDetail)
   */
/**
   * Crea una nueva rutina.
   * POST /api/seguimiento/ninos/{childId}/rutinas-diarias/
   * (Se espera que la API devuelva el objeto DailyRoutineDetail)
   */
  createRoutine(childId: number, data: RoutineCreateData): Promise<AxiosResponse<DailyRoutineDetail>> { // <-- Tipo CORREGIDO aquí
    // Asegúrate de importar RoutineCreateData si no lo estaba ya
    return http.post(`${API_BASE_URL(childId)}/`, data)
  },

  /**
   * Actualiza parcialmente una rutina existente.
   * PATCH /api/seguimiento/ninos/{childId}/rutinas-diarias/{routineId}/
   */
  updateRoutine(childId: number, routineId: number, data: Partial<RoutineWriteData>): Promise<AxiosResponse<DailyRoutineDetail>> {
    return http.patch(`${API_BASE_URL(childId)}/${routineId}/`, data)
  },

  /**
   * Archiva (soft delete) una rutina.
   * DELETE /api/seguimiento/ninos/{childId}/rutinas-diarias/{routineId}/
   */
  deleteRoutine(childId: number, routineId: number): Promise<AxiosResponse<void>> {
    return http.delete(`${API_BASE_URL(childId)}/${routineId}/`)
  },

  // ==========================================================
  // 2. Acciones Personalizadas (en DailyRoutineViewSet)
  // ==========================================================

  /**
   * Pausa o reactiva una rutina.
   * POST /api/seguimiento/ninos/{childId}/rutinas-diarias/{routineId}/toggle_status/
   */
  toggleStatus(childId: number, routineId: number): Promise<AxiosResponse<ToggleStatusResponse>> {
    return http.post(`${API_BASE_URL(childId)}/${routineId}/toggle_status/`)
  },

  /**
   * Clona una rutina existente.
   * POST /api/seguimiento/ninos/{childId}/rutinas-diarias/{routineId}/clone/
   */
  cloneRoutine(childId: number, routineId: number, data: CloneRoutineData): Promise<AxiosResponse<DailyRoutineDetail>> {
    return http.post(`${API_BASE_URL(childId)}/${routineId}/clone/`, data)
  },

  // ==========================================================
  // 3. Recursos Anidados (Horarios, Pasos, Estrategias)
  // ==========================================================

  /**
   * Crea un nuevo horario (Usado por el Wizard - Paso 2).
   * POST /.../rutinas-diarias/{routineId}/horarios/
   */
  createSchedule(childId: number, routineId: number, data: WizardSchedule): Promise<AxiosResponse<RoutineSchedule>> {
    return http.post(`${API_BASE_URL(childId)}/${routineId}/horarios/`, data)
  },

  /**
   * Crea un nuevo paso (Usado por el Wizard - Paso 3).
   * POST /.../rutinas-diarias/{routineId}/pasos/
   */
  createStep(childId: number, routineId: number, data: WizardStep): Promise<AxiosResponse<RoutineStep>> {
    return http.post(`${API_BASE_URL(childId)}/${routineId}/pasos/`, data)
  },

  /**
   * Reordena la lista de pasos.
   * POST /.../rutinas-diarias/{routineId}/pasos/reorder/
   */
  reorderSteps(childId: number, routineId: number, stepIds: number[]): Promise<AxiosResponse<void>> {
    return http.post(`${API_BASE_URL(childId)}/${routineId}/pasos/reorder/`, { step_ids: stepIds })
  },
  
 /**
 * Crea la configuración general de estrategias (Usado por el Wizard - Paso 4).
 * POST /.../rutinas-diarias/{routineId}/estrategias/
 */
createStrategyConfig(childId: number, routineId: number, data: WizardStrategies): Promise<AxiosResponse<RoutineStrategy>> {
  return http.post(`${API_BASE_URL(childId)}/${routineId}/estrategias/`, data)
},

/**
 * Crea una estrategia individual (si el backend lo soporta).
 * POST /.../rutinas-diarias/{routineId}/estrategias-individuales/
 * NOTA: Este endpoint podría no existir en tu backend actual
 */
/**
 * Crea una estrategia individual (si el backend lo soporta).
 * POST /.../rutinas-diarias/{routineId}/estrategias-individuales/ ??? <-- Revisa este endpoint
 * NOTA: Este endpoint podría no existir en tu backend actual
 */
createIndividualStrategy(childId: number, routineId: number, data: WizardStrategy): Promise<AxiosResponse<any>> { // <-- Cambiado el tipo aquí
  // Verifica si la URL del endpoint es correcta según tu urls.py
  return http.post(`${API_BASE_URL(childId)}/${routineId}/estrategias-individuales/`, data)
},
  
  /**
   * Actualiza las estrategias (para edición fuera del wizard).
   * PATCH /.../rutinas-diarias/{routineId}/estrategias/
   */
  updateStrategy(childId: number, routineId: number, data: Partial<WizardStrategies>): Promise<AxiosResponse<RoutineStrategy>> {
    // Nota: El backend usa get_or_create, un POST podría fallar si ya existe.
    // Un PATCH (o PUT) es más seguro para actualizaciones.
    // Asumimos que el backend tiene un ID fijo para la estrategia (ej: /.../estrategias/1/) o maneja PUT/PATCH en la raíz.
    // Esta implementación asume que puedes hacer PATCH a la raíz.
    return http.patch(`${API_BASE_URL(childId)}/${routineId}/estrategias/`, data)
  },

  // ==========================================================
  // 4. Registros de Cumplimiento (Logs)
  // ==========================================================
  
  /**
   * Crea un nuevo registro de cumplimiento.
   * POST /.../rutinas-diarias/{routineId}/registros/
   */
  createLog(childId: number, routineId: number, data: LogCreateData): Promise<AxiosResponse<LogEntry>> {
    return http.post(`${API_BASE_URL(childId)}/${routineId}/registros/`, data)
  },

  /**
   * Obtiene la lista de registros para una rutina.
   * GET /.../rutinas-diarias/{routineId}/registros/
   */
  getLogs(childId: number, routineId: number, params?: any): Promise<AxiosResponse<LogEntry[]>> {
    return http.get(`${API_BASE_URL(childId)}/${routineId}/registros/`, { params })
  },

  // ==========================================================
  // 5. Vistas de Analítica (Reportes)
  // ==========================================================

  /**
   * Obtiene las rutinas programadas para hoy.
   * GET /api/seguimiento/ninos/{childId}/rutinas-diarias/agenda-hoy/
   */
  getDailyAgenda(childId: number): Promise<AxiosResponse<DailyRoutineList[]>> {
    return http.get(`${API_BASE_URL(childId)}/agenda-hoy/`)
  },

  /**
   * Compara dos rutinas (para RutinasComparisonView).
   * GET /api/seguimiento/ninos/{childId}/rutinas-diarias/comparar/
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
   * Obtiene el reporte de efectividad (para RutinasAnalyticsView).
   * GET /.../rutinas-diarias/{routineId}/effectiveness_report/
   */
  getEffectivenessReport(childId: number, routineId: number, periodDays: number = 30): Promise<AxiosResponse<EffectivenessReport>> {
    return http.get(`${API_BASE_URL(childId)}/${routineId}/effectiveness_report/`, {
      params: { period_days: periodDays }
    })
  }
}