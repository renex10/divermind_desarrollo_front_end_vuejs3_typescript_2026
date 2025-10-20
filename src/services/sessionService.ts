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


// ===============================================
// FUNCIONES PARA GESTIONAR SESIONES (TherapySession)
// ===============================================

/**
 * ✅ NUEVA FUNCIÓN: Obtiene una lista de TODAS las sesiones a las que el terapeuta tiene acceso.
 * Ideal para la vista principal de "Gestión de Sesiones".
 * NOTA: Requerirá un nuevo endpoint en el backend (ej: /seguimiento/sesiones-terapia/all/)
 * que devuelva las sesiones incluyendo el nombre del niño.
 * @returns Un array con todas las sesiones.
 */
export async function getAllTherapySessions(): Promise<TherapySession[]> {
  const endpoint = `/seguimiento/sesiones-terapia/all/`; // Endpoint hipotético que debes crear en Django
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
 * Obtiene los detalles completos de una sesión de terapia específica.
 * Llama al endpoint: GET /seguimiento/ninos/{childId}/sesiones-terapia/{sessionId}/
 */
export async function getTherapySessionById(childId: number, sessionId: number): Promise<TherapySession> {
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

