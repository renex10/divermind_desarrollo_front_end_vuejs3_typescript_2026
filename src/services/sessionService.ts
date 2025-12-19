// src/services/sessionService.ts

import http from './http'

// --- INTERFACES PARA SESIONES ---

/**
 * Define la estructura de datos necesaria para crear una nueva sesión de terapia.
 * Se utiliza como el cuerpo (payload) de la petición POST.
 */
interface CreateTherapySessionPayload {
  scheduled_date: string
  duration_minutes: number
  session_type: string
  modality: string
  objectives: string
}

/**
 * Representa el objeto completo de una sesión de terapia, tal como lo devuelve la API.
 * Proporciona un tipado estricto para una mayor seguridad y autocompletado en el código.
 * ✅ Se ha añadido 'child_name' como opcional para la vista de lista.
 */
export interface TherapySession {
  id: number
  child: number
  therapist: number
  session_number: number
  session_type: string
  modality: string
  scheduled_date: string
  actual_date: string | null
  duration_minutes: number
  attendance_status: string | null
  cancellation_reason: string | null
  objectives: string
  session_focus: string | null
  emotional_state_start: string | null
  emotional_state_end: string | null
  materials_used: string | null
  techniques_applied: string | null
  challenges_encountered: string | null
  strengths_observed: string | null
  observations: string | null
  crisis_interventions: string | null
  homework_assigned: string | null
  next_session_recommendations: string | null
  next_session_focus: string | null
  collaborative_team: number[]
  created_at: string
  updated_at: string
  child_name?: string // Necesario para la vista de lista general
  // Campos display opcionales según respuesta del Serializer
  therapist_name?: string
  session_type_display?: string
  modality_display?: string
  attendance_status_display?: string
}

/**
 * ✅ NUEVA INTERFAZ: Representa los datos detallados de una sesión
 * según TherapySessionDetailSerializer del backend.
 * Incluye información contextual del niño y apoderado.
 */
export interface TherapySessionDetail extends TherapySession {
  child_name: string
  child_rut: string
  guardian_name: string
  entry_date: string
  total_sessions: number
}

// --- INTERFACES PARA OBJETIVOS DE SESIÓN ---

/**
 * Define la estructura para crear un nuevo objetivo dentro de una sesión.
 */
export interface CreateGoalPayload {
  description: string;
  priority: 'alta' | 'media' | 'baja';
}

/**
 * Representa el objeto completo de un objetivo de sesión.
 */
export interface SessionGoal {
  id: number;
  session: number;
  description: string;
  achieved: boolean;
  achievement_notes: string;
  progress_percentage: number;
  priority: 'alta' | 'media' | 'baja';
  created_at: string;
  updated_at: string;
}


/**
 * ✅ NUEVA INTERFAZ: Representa las métricas de terapia
 * que devuelve el endpoint /metricas/ del backend.
 */
export interface TherapyMetrics {
  sessions_count: number;
  completed_sessions: number;
  upcoming_sessions: number;
  attendance_rate: number;
  goals_count: number;
  goals_achieved: number;
  success_rate: number;
  avg_session_duration: number;
}


/**
 * ✅ NUEVA INTERFAZ: Representa la respuesta completa
 * de MeasurableDataAPIView (la vista de /metricas/)
 */
export interface MetricsApiResponse {
  child_info: any;
  development_metrics: any;
  therapy_metrics: TherapyMetrics; // <-- Esto es lo que nos importa
  timeline_data: any;
}



// --- INTERFACES PARA DIAGNÓSTICOS ---

export interface Diagnosis {
  id: number;
  child: number;
  diagnosis_type: string; // 'primary', 'secondary', 'comorbidity' etc.
  description: string;
  diagnosis_date: string; // Formato YYYY-MM-DD
  diagnosed_by: number | null; // ID del usuario que diagnosticó (si aplica)
  severity: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CreateDiagnosisPayload {
  diagnosis_type: string;
  description: string;
  diagnosis_date: string; // Formato YYYY-MM-DD
  severity?: string;
  // ✅ AÑADIR/CORREGIR ESTOS:
  cie10_code?: string | null; // Hacerlos opcionales
  observations?: string | null; // Corregir 'notes' a 'observations'
  notes?: string;
  is_active?: boolean;
}


// --- INTERFACES PARA INTERESES --- (NUEVO BLOQUE)

/**
 * Representa el objeto completo de un interés estable, tal como lo devuelve la API.
 */
export interface Interest {
  id: number;
  child: number;
  // ✅ CORREGIDO: Usar 'category' en lugar de 'interest_type' para coincidir con el modelo
  category: string; // 'food', 'games', 'music', etc.
  description: string;
  intensity: string; // 'mild', 'moderate', 'strong', 'obsessive'
  // ✅ CORREGIDO: Usar 'therapeutic_utility' en lugar de 'notes' para coincidir con el modelo
  therapeutic_utility: string | null;
  created_at: string;
}

/**
 * Define la estructura de datos necesaria para crear un nuevo interés estable.
 */
export interface CreateInterestPayload {
  description: string;
  category: string;
  intensity: string;
  therapeutic_utility?: string | null; // Opcional y permite null
}




// ===============================================
// FUNCIONES PARA GESTIONAR SESIONES (TherapySession)
// ===============================================

/**
 * ✅ NUEVA FUNCIÓN: Obtiene una lista de TODAS las sesiones a las que el terapeuta tiene acceso.
 * Ideal para la vista principal de "Gestión de Sesiones".
 * @returns Un array con todas las sesiones.
 */
export async function getAllTherapySessions(): Promise<TherapySession[]> {
  const endpoint = `/seguimiento/sesiones-terapia/all/`;
  const { data } = await http.get(endpoint);
  return data;
}

/**
 * Crea una nueva sesión de terapia para un niño específico.
 * Llama al endpoint: POST /seguimiento/ninos/{childId}/sesiones-terapia/
 */
export async function createTherapySession(
  childId: number,
  sessionData: CreateTherapySessionPayload
): Promise<TherapySession> {
  const endpoint = `/seguimiento/ninos/${childId}/sesiones-terapia/`
  const { data } = await http.post(endpoint, sessionData)
  return data
}

/**
 * Obtiene la lista de todas las sesiones de terapia para un niño específico.
 * Llama al endpoint: GET /seguimiento/ninos/{childId}/sesiones-terapia/
 */
export async function getTherapySessionsForChild(childId: number): Promise<TherapySession[]> {
  const endpoint = `/seguimiento/ninos/${childId}/sesiones-terapia/`
  const { data } = await http.get(endpoint)
  return data
}

/**
 * ✅ ACTUALIZADA: Obtiene los detalles completos de una sesión de terapia específica.
 * Ahora usa TherapySessionDetail que incluye datos contextuales del niño.
 * Llama al endpoint: GET /seguimiento/ninos/{childId}/sesiones-terapia/{sessionId}/
 */
export async function getTherapySessionById(childId: number, sessionId: number): Promise<TherapySessionDetail> {
  // Validación de seguridad para evitar peticiones con IDs inválidos (NaN)
  if (!childId || isNaN(Number(childId))) {
    console.error("❌ Error: childId es inválido para la petición:", childId);
    throw new Error("ID de niño no válido");
  }

  const endpoint = `/seguimiento/ninos/${childId}/sesiones-terapia/${sessionId}/`
  const { data } = await http.get(endpoint)
  return data
}

/**
 * Actualiza una sesión de terapia existente (para guardar la documentación).
 * Llama al endpoint: PATCH /seguimiento/ninos/{childId}/sesiones-terapia/{sessionId}/
 */
export async function updateTherapySession(
  childId: number,
  sessionId: number,
  updatedData: Partial<TherapySession>
): Promise<TherapySession> {
  const endpoint = `/seguimiento/ninos/${childId}/sesiones-terapia/${sessionId}/`
  const { data } = await http.patch(endpoint, updatedData)
  return data
}

// ===============================================
// FUNCIONES PARA GESTIONAR OBJETIVOS (SessionGoal)
// ===============================================

/**
 * Obtiene todos los objetivos de una sesión específica.
 */
export async function getGoalsForSession(childId: number, sessionId: number): Promise<SessionGoal[]> {
  const endpoint = `/seguimiento/ninos/${childId}/sesiones-terapia/${sessionId}/objetivos/`;
  const { data } = await http.get(endpoint);
  return data;
}

/**
 * Crea un nuevo objetivo para una sesión específica.
 */
export async function createGoalForSession(childId: number, sessionId: number, goalData: CreateGoalPayload): Promise<SessionGoal> {
  const endpoint = `/seguimiento/ninos/${childId}/sesiones-terapia/${sessionId}/objetivos/`;
  const { data } = await http.post(endpoint, goalData);
  return data;
}

/**
 * Actualiza un objetivo específico.
 */
export async function updateGoal(childId: number, sessionId: number, goalId: number, updatedData: Partial<SessionGoal>): Promise<SessionGoal> {
  const endpoint = `/seguimiento/ninos/${childId}/sesiones-terapia/${sessionId}/objetivos/${goalId}/`;
  const { data } = await http.patch(endpoint, updatedData);
  return data;
}

/**
 * Elimina un objetivo específico.
 */
export async function deleteGoal(childId: number, sessionId: number, goalId: number): Promise<void> {
  const endpoint = `/seguimiento/ninos/${childId}/sesiones-terapia/${sessionId}/objetivos/${goalId}/`;
  await http.delete(endpoint);
}

// ===============================================
// ✅ NUEVA FUNCIÓN PARA OBTENER MÉTRICAS
// ===============================================

/**
 * Obtiene las métricas de terapia (stats) para un niño específico.
 * Llama al endpoint: GET /seguimiento/ninos/{childId}/metricas/
 */
export async function getTherapyMetricsForChild(childId: number): Promise<TherapyMetrics> {
  const endpoint = `/seguimiento/ninos/${childId}/metricas/`;
  
  // Hacemos la llamada al endpoint de métricas
  const { data } = await http.get<MetricsApiResponse>(endpoint);
  
  // Devolvemos solo el objeto 'therapy_metrics' que contiene los contadores
  return data.therapy_metrics;
}



// ===============================================
// FUNCIONES PARA GESTIONAR DIAGNÓSTICOS (Diagnosis)
// ===============================================

/**
 * Obtiene la lista de diagnósticos para un niño específico.
 * Llama a: GET /seguimiento/ninos/{childId}/diagnosticos/
 */
export async function getDiagnosesForChild(childId: number): Promise<Diagnosis[]> {
  const endpoint = `/seguimiento/ninos/${childId}/diagnosticos/`;
  const { data } = await http.get(endpoint);
  return data;
}

/**
 * Crea un nuevo diagnóstico para un niño específico.
 * Llama a: POST /seguimiento/ninos/{childId}/diagnosticos/
 */
export async function createDiagnosisForChild(childId: number, diagnosisData: CreateDiagnosisPayload): Promise<Diagnosis> {
  const endpoint = `/seguimiento/ninos/${childId}/diagnosticos/`;
  const { data } = await http.post(endpoint, diagnosisData);
  return data;
}


// ===============================================
// FUNCIONES PARA GESTIONAR INTERESES (Interest) (NUEVO BLOQUE)
// ===============================================

/**
 * Obtiene la lista de intereses estables de un niño.
 * Llama a: GET /seguimiento/ninos/{childId}/intereses/
 */
export async function getInterestsForChild(childId: number): Promise<Interest[]> {
  const endpoint = `/seguimiento/ninos/${childId}/intereses/`;
  const { data } = await http.get(endpoint);
  return data;
}

/**
 * Crea un nuevo interés estable para un niño.
 * Llama a: POST /seguimiento/ninos/{childId}/intereses/
 */
export async function createInterestForChild(childId: number, interestData: CreateInterestPayload): Promise<Interest> {
  const endpoint = `/seguimiento/ninos/${childId}/intereses/`;
  const { data } = await http.post(endpoint, interestData);
  return data;
}