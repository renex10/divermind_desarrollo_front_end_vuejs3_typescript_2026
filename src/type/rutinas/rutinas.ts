// src/type/rutinas.ts
// -------------------------------------------------------------
// Definiciones de TypeScript para el Módulo de Rutinas
//
// Este archivo contiene todas las interfaces y tipos de datos
// que se utilizan para la comunicación entre el frontend (Vue/Pinia)
// y el backend (Django REST Framework).
// -------------------------------------------------------------

// =============================================================
// 1. TIPOS BÁSICOS Y DE FILTRO
// =============================================================

/**
 * Tipos de estado de rutina para los filtros del store.
 */
export type RoutineStatusFilter = 'active' | 'paused' | 'archived' | 'draft' | 'all'

/**
 * Objeto de filtros para el estado local del store (Pinia).
 */
export interface RoutineFilters {
  status: RoutineStatusFilter
  routineType: string | null
  search: string
}

/**
 * Objeto de filtros para los query params de la API.
 */
export interface ApiFilters {
  status?: string
  routine_type?: string
  is_active?: boolean
  date_from?: string
  date_to?: string
}

// =============================================================
// 2. INTERFACES DE COMPONENTES DE RUTINA (Serializers Anidados)
// =============================================================

/**
 * Horario de una rutina (RoutineScheduleSerializer)
 */
export interface RoutineSchedule {
  id: number
  start_time: string // "HH:mm:ss"
  estimated_duration_minutes: number | null
  days_of_week: string[] // ['monday', 'tuesday', ...]
}

/**
 * Paso de una rutina (RoutineStepSerializer)
 */
export interface RoutineStep {
  id: number
  order: number
  action: string
  description: string
  estimated_minutes: number | null
  visual_support: string | null // URL o path
  requires_supervision: boolean
  is_skippable: boolean
  common_difficulties: string
  strategies: string
}

/**
 * Estrategias de una rutina (RoutineStrategySerializer)
 */
export interface RoutineStrategy {
  id: number
  flexibility_level: 'low' | 'medium' | 'high'
  flexibility_level_display: string
  change_tolerance_notes: string
  needs_advance_warning: boolean
  warning_time_minutes: number | null
  warning_method: string
  warning_method_display: string
  transition_strategies: string
  calming_strategies: string
  visual_supports_needed: boolean
  visual_support_type: string
  visual_support_type_display: string
}

/**
 * Motivación de una rutina (RoutineMotivationSerializer)
 */
export interface RoutineMotivation {
  id: number
  uses_reinforcement: boolean
  reinforcement_system: string
  motivators: string
}

/**
 * Metas de independencia (RoutineIndependenceGoalSerializer)
 */
export interface RoutineIndependenceGoal {
  id: number
  current_level: string
  current_level_display: string
  target_level: string
  target_level_display: string
  success_criteria: string
}

/**
 * Coordinación (RoutineCoordinationSerializer)
 */
export interface RoutineCoordination {
  id: number
  family_involvement: string
  parent_training_needed: boolean
  school_coordination_notes: string
  tracking_method: string
  tracking_method_display: string
  next_review_date: string | null
}

/**
 * Desafíos (RoutineChallengeSerializer)
 */
export interface RoutineChallenge {
  id: number
  common_challenges: string
  trigger_points: string
}

/**
 * Evaluación (RoutineEvaluationSerializer)
 */
export interface RoutineEvaluation {
  id: number
  evaluation_date: string
  effectiveness_rating: number
  effectiveness_notes: string
  evaluated_by_name: string
}

// =============================================================
// 3. INTERFACES PRINCIPALES DE RUTINA (Serializers Principales)
// =============================================================

/**
 * Objeto para la API de listado (DailyRoutineListSerializer)
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
 * Hereda de List e incluye todas las relaciones anidadas.
 */
export interface DailyRoutineDetail extends DailyRoutineList {
  description: string
  child: number
  created_by_name: string
  date_ended: string | null
  
  // Relaciones anidadas
  schedules: RoutineSchedule[]
  steps: RoutineStep[]
  strategies: RoutineStrategy | null
  motivation: RoutineMotivation | null
  independence_goal: RoutineIndependenceGoal | null
  coordination: RoutineCoordination | null
  challenges: RoutineChallenge | null
  evaluations: RoutineEvaluation[]
}

/**
 * Objeto para crear/actualizar una rutina (DailyRoutineWriteSerializer)
 */
export interface RoutineWriteData {
  name: string
  routine_type: string
  description?: string
  status?: string
  is_active?: boolean
  date_started?: string | null
  date_ended?: string | null
}

// =============================================================
// 4. INTERFACES DEL ASISTENTE (Wizard Store)
// =============================================================

/**
 * Paso 1: Información Básica (Wizard)
 */
export interface WizardBasicInfo {
  name: string
  routine_type: string | null
  description: string
  status: 'draft' | 'active'
}

/**
 * Paso 2: Horarios (Wizard)
 */
export interface WizardSchedule {
  id?: number | string
  start_time: string // "HH:mm"
  estimated_duration_minutes: number | null
  days_of_week: string[] // ['monday', 'tuesday', ...]
}

/**
 * Paso 3: Pasos (Wizard)
 */
export interface WizardStep {
  // 'id' y 'order' se gestionan en el backend
  action: string
  description: string
  estimated_minutes: number | null
  visual_support: string // (Asumimos URL o path)
  requires_supervision: boolean
  is_skippable: boolean
}

// --- AÑADIR ESTA INTERFAZ ---
/**
 * Representa una estrategia individual añadida en el wizard.
 * (Ajusta los campos según lo que necesites guardar por estrategia)
 */
export interface WizardStrategy { // <-- La interfaz que faltaba
    id?: number | string  // ✅ AGREGAR ESTA LÍNEA
  strategy_type: string // Ej: 'calming', 'transition', 'visual_support'
  description: string   // Ej: 'Usar temporizador visual', 'Ofrecer objeto sensorial'
  related_step_order?: number | null // Opcional: A qué paso se asocia
  // Añade otros campos si son necesarios por estrategia individual
}

/**
 * Paso 4: Estrategias (Wizard)
 */
export interface WizardStrategies {
  flexibility_level: 'low' | 'medium' | 'high' | null
  change_tolerance_notes: string
  needs_advance_warning: boolean
  warning_time_minutes: number | null
  warning_method: string | null
  transition_strategies: string
  calming_strategies: string
  visual_supports_needed: boolean
  visual_support_type: string | null
}

// =============================================================
// 5. INTERFACES DE REGISTROS (Completion Logs)
// =============================================================

/**
 * Detalle de un paso completado (StepCompletionSerializer)
 */
export interface StepCompletion {
  id: number
  step: number
  step_order: number
  step_action: string
  completed: boolean
  had_difficulty: boolean
  time_taken_seconds: number | null
  support_needed: 'none' | 'verbal' | 'visual' | 'physical' | 'full'
  notes: string
}

/**
 * Objeto para crear un detalle de paso (StepCompletionCreateSerializer)
 */
export interface StepCompletionCreateData {
  step_id: number
  completed: boolean
  had_difficulty: boolean
  time_taken_seconds?: number | null
  support_needed?: 'none' | 'verbal' | 'visual' | 'physical' | 'full'
  notes?: string
}

/**
 * Registro de cumplimiento (RoutineCompletionLogDetailSerializer)
 */
export interface LogEntry {
  id: number
  routine: number
  routine_name: string
  child_name: string
  logged_by_name: string
  date: string
  start_time: string
  end_time: string
  actual_duration_minutes: number
  completion_status: 'completed' | 'completed_help' | 'partial' | 'skipped'
  completion_status_display: string
  support_level_needed: 'none' | 'low' | 'medium' | 'high'
  support_level_display: string
  independence_rating: number | null // 1-5
  went_well: string
  difficulties: string
  modifications_made: string
  crisis_occurred: boolean
  crisis_details: string
  emotional_state_start: string
  emotional_state_start_display: string
  emotional_state_end: string
  emotional_state_end_display: string
  completion_percentage: number
  
  // Relaciones anidadas
  step_completions: StepCompletion[]
  // (steps_completed y steps_with_difficulty son listas de IDs o objetos RoutineStep)
  steps_completed: RoutineStep[]
  steps_with_difficulty: RoutineStep[]
}

/**
 * Objeto para crear un registro (RoutineCompletionLogCreateSerializer)
 */
export interface LogCreateData {
  date: string
  start_time: string
  end_time: string
  actual_duration_minutes?: number
  completion_status: 'completed' | 'completed_help' | 'partial' | 'skipped'
  support_level_needed: 'none' | 'low' | 'medium' | 'high'
  independence_rating?: number | null
  went_well?: string
  difficulties?: string
  modifications_made?: string
  crisis_occurred?: boolean
  crisis_details?: string
  emotional_state_start?: string
  emotional_state_end?: string
  notes?: string
  
  // Array anidado para creación en batch
  step_completions: StepCompletionCreateData[]
}

// =============================================================
// 6. INTERFACES DE ACCIONES Y ANALÍTICAS (API Views)
// =============================================================

/**
 * Respuesta de la acción 'toggleStatus'.
 */
export interface ToggleStatusResponse {
  status: string
  message: string
}

/**
 * Payload para la acción 'clone'.
 */
export interface CloneRoutineData {
  new_name: string
  copy_steps?: boolean
  copy_strategies?: boolean
}

/**
 * Datos de una rutina para la comparación.
 */
interface ComparisonRoutineData {
  name: string
  metrics: {
    total_logs: number
    completion_rate: number
    crisis_rate: number
    avg_independence: number
  }
}

/**
 * Respuesta de la API de 'RoutineComparisonView'.
 */
export interface ComparisonData {
  period_days: number
  routine_a: ComparisonRoutineData
  routine_b: ComparisonRoutineData
  winner: 'routine_a' | 'routine_b' | null
  recommendation: string
}

/**
 * Respuesta de la API de 'effectiveness_report'.
 */
export interface EffectivenessReport {
  routine_id: number
  routine_name: string
  period_days: number
  total_logs: number
  metrics: {
    completed: number
    partial: number
    skipped: number
    completion_rate: number
    crisis_count: number
    crisis_rate: number
    avg_independence: number
  }
  problematic_steps: {
    step: string
    difficulty_count: number
  }[]
  recommendations: string[]
  needs_review: boolean
}