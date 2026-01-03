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
  child_name?: string 
  therapist_name?: string
  session_type_display?: string
  modality_display?: string
  attendance_status_display?: string
}

/**
 * Representa los datos detallados de una sesión con contexto del niño.
 */
export interface TherapySessionDetail extends TherapySession {
  child_name: string
  child_rut: string
  guardian_name: string
  entry_date: string
  total_sessions: number
}

// --- INTERFACES PARA RUTINAS (NUEVO) ---

/**
 * ✅ NUEVA INTERFAZ: Representa un paso individual de la rutina.
 * Basado en RoutineStepSerializer del backend.
 */
export interface RoutineStep {
  id: number;
  routine: number;
  order: number;
  action: string;
  description: string;
  estimated_minutes: number;
  visual_support_description?: string;
  visual_support_image?: string;
  requires_supervision: boolean;
  is_skippable: boolean;
  common_difficulties?: string;
  strategies?: string;
  created_at?: string;
  updated_at?: string;
}

// --- INTERFACES PARA OBJETIVOS DE SESIÓN ---

export interface CreateGoalPayload {
  description: string;
  priority: 'alta' | 'media' | 'baja';
}

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

// --- INTERFACES PARA MÉTRICAS Y DIAGNÓSTICOS ---

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

export interface MetricsApiResponse {
  child_info: any;
  development_metrics: any;
  therapy_metrics: TherapyMetrics;
  timeline_data: any;
}

export interface Diagnosis {
  id: number;
  child: number;
  diagnosis_type: string;
  description: string;
  diagnosis_date: string;
  diagnosed_by: number | null;
  severity: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CreateDiagnosisPayload {
  diagnosis_type: string;
  description: string;
  diagnosis_date: string;
  severity?: string;
  cie10_code?: string | null;
  observations?: string | null;
  notes?: string;
  is_active?: boolean;
}

// --- INTERFACES PARA INTERESES ---

export interface Interest {
  id: number;
  child: number;
  category: string;
  description: string;
  intensity: string;
  therapeutic_utility: string | null;
  created_at: string;
}

export interface CreateInterestPayload {
  description: string;
  category: string;
  intensity: string;
  therapeutic_utility?: string | null;
}

// ===============================================
// FUNCIONES PARA GESTIONAR SESIONES (TherapySession)
// ===============================================

export async function getAllTherapySessions(): Promise<TherapySession[]> {
  const endpoint = `/seguimiento/sesiones-terapia/all/`;
  const { data } = await http.get(endpoint);
  return data;
}

export async function createTherapySession(
  childId: number,
  sessionData: CreateTherapySessionPayload
): Promise<TherapySession> {
  const endpoint = `/seguimiento/ninos/${childId}/sesiones-terapia/`
  const { data } = await http.post(endpoint, sessionData)
  return data
}

export async function getTherapySessionsForChild(childId: number): Promise<TherapySession[]> {
  const endpoint = `/seguimiento/ninos/${childId}/sesiones-terapia/`
  const { data } = await http.get(endpoint)
  return data
}

export async function getTherapySessionById(childId: number, sessionId: number): Promise<TherapySessionDetail> {
  if (!childId || isNaN(Number(childId))) {
    console.error("❌ Error: childId es inválido:", childId);
    throw new Error("ID de niño no válido");
  }
  const endpoint = `/seguimiento/ninos/${childId}/sesiones-terapia/${sessionId}/`
  const { data } = await http.get(endpoint)
  return data
}

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

export async function getGoalsForSession(childId: number, sessionId: number): Promise<SessionGoal[]> {
  const endpoint = `/seguimiento/ninos/${childId}/sesiones-terapia/${sessionId}/objetivos/`;
  const { data } = await http.get(endpoint);
  return data;
}

export async function createGoalForSession(childId: number, sessionId: number, goalData: CreateGoalPayload): Promise<SessionGoal> {
  const endpoint = `/seguimiento/ninos/${childId}/sesiones-terapia/${sessionId}/objetivos/`;
  const { data } = await http.post(endpoint, goalData);
  return data;
}

export async function updateGoal(childId: number, sessionId: number, goalId: number, updatedData: Partial<SessionGoal>): Promise<SessionGoal> {
  const endpoint = `/seguimiento/ninos/${childId}/sesiones-terapia/${sessionId}/objetivos/${goalId}/`;
  const { data } = await http.patch(endpoint, updatedData);
  return data;
}

export async function deleteGoal(childId: number, sessionId: number, goalId: number): Promise<void> {
  const endpoint = `/seguimiento/ninos/${childId}/sesiones-terapia/${sessionId}/objetivos/${goalId}/`;
  await http.delete(endpoint);
}

// ===============================================
// FUNCIONES PARA MÉTRICAS, DIAGNÓSTICOS E INTERESES
// ===============================================

export async function getTherapyMetricsForChild(childId: number): Promise<TherapyMetrics> {
  const endpoint = `/seguimiento/ninos/${childId}/metricas/`;
  const { data } = await http.get<MetricsApiResponse>(endpoint);
  return data.therapy_metrics;
}

export async function getDiagnosesForChild(childId: number): Promise<Diagnosis[]> {
  const endpoint = `/seguimiento/ninos/${childId}/diagnosticos/`;
  const { data } = await http.get(endpoint);
  return data;
}

export async function createDiagnosisForChild(childId: number, diagnosisData: CreateDiagnosisPayload): Promise<Diagnosis> {
  const endpoint = `/seguimiento/ninos/${childId}/diagnosticos/`;
  const { data } = await http.post(endpoint, diagnosisData);
  return data;
}

export async function getInterestsForChild(childId: number): Promise<Interest[]> {
  const endpoint = `/seguimiento/ninos/${childId}/intereses/`;
  const { data } = await http.get(endpoint);
  return data;
}

export async function createInterestForChild(childId: number, interestData: CreateInterestPayload): Promise<Interest> {
  const endpoint = `/seguimiento/ninos/${childId}/intereses/`;
  const { data } = await http.post(endpoint, interestData);
  return data;
}