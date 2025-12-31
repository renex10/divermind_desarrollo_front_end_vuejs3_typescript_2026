/**
 * src/type/rutinas/reports.ts
 * Interfaces para el módulo de analítica clínica de rutinas.
 */

// --- RESUMEN GENERAL ---
export interface RoutineSummary {
  total_executions: number;
  avg_independence: number;         // Promedio de independence_rating
  independence_pct: number;         // Cálculo de pasos sin apoyo vs total
  most_difficult_step: string | null; // El nombre del paso con más 'had_difficulty'
  last_execution_date: string;
}

// --- EVOLUCIÓN HISTÓRICA ---
export interface IndependenceEvolution {
  date: string;                     // Fecha de la ejecución (YYYY-MM-DD)
  score: number;                    // Porcentaje o rating de esa fecha
  routine_name?: string;            // Opcional: para filtrar por rutina específica
}

// --- DISTRIBUCIÓN DE APOYOS ---
/**
 * Representa los datos para gráficos de torta/donas basados en
 * el campo 'support_needed' de la tabla step_completion.
 */
export interface SupportDistribution {
  independent: number;
  verbal_cue: number;
  visual_cue: number;
  gestural_cue: number;
  physical_prompt: number;
  not_completed: number;            // Conteo de pasos donde 'completed' = false
}

// --- COMPARATIVA DE TIEMPOS ---
export interface TimeComparison {
  date: string;
  estimated_minutes: number;
  actual_minutes: number;           // Basado en 'actual_duration_minutes'
  emotional_impact: 'happy' | 'calm' | 'irritable' | 'anxious'; // 'emotional_state_end'
}

// --- INFORMES DE IA ---
/**
 * Mapeo de la tabla 'seguimiento_aigeneratedreport'.
 */
export interface AIReport {
  id: number;
  date: string;
  generated_text: string;
  status: 'draft' | 'reviewed' | 'sent';
  key_insights: string[];           // Procesado desde 'raw_data_snapshot' si es necesario
}

// --- ALERTAS CLÍNICAS ---
export interface ClinicalAlert {
  type: 'warning' | 'danger' | 'success';
  message: string;
  routine_id: number;
  detected_at: string;
}