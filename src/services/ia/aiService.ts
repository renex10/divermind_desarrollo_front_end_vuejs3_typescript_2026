// src/services/ia/aiService.ts
import http from "../http";

/**
 * Registro individual del desempeño en un paso de rutina.
 * Alimenta los Requerimientos 1 (Desvío Temporal) y 3 (Mapa de Calor).
 */
export interface AIStepPerformance {
  step_id: number;
  step_action: string;
  support_needed: string; // Cambiado de support_level para matchear el serializer
  time_taken_seconds: number;
  had_difficulty: boolean;
}

/**
 * Estado de progreso de los objetivos específicos.
 * Alimenta el Requerimiento 4 (Logro de Objetivos).
 */
export interface AIGoalProgress {
  goal_id: number;
  description: string;
  progress_percentage: number; // 0 a 100
  achieved: boolean;
}

/**
 * Payload de análisis: Estructura de datos completa enviada al motor de IA.
 * Combina el contexto narrativo con métricas granulares para evitar el 0% de datos.
 */
export interface AIAnalysisPayload {
  // --- Contexto Narrativo (Lo que el terapeuta escribe) ---
  objectives: string;      // Objetivos generales de la sesión
  strengths: string;       // Fortalezas observadas
  challenges: string;      // Dificultades encontradas
  techniques: string;      // Técnicas aplicadas
  session_number: number;  // Para análisis evolutivo

  // --- Contexto Estructurado (Métricas para Gráficos y Reportes) ---
  
  // Requerimiento 2: Análisis de Regulación Emocional
  emotional_state_start: string; // Ej: 'calm', 'irritable', 'anxious'
  emotional_state_end: string;   // Para medir el impacto de la sesión

  // Requerimientos 1 y 3: Desempeño paso a paso
  step_performance?: AIStepPerformance[];

  // Requerimiento 4: Seguimiento de Metas
  goals_progress?: AIGoalProgress[];

  // Requerimiento 5: Comunicación y Habilidades Sociales
  was_spontaneous?: boolean;      // ¿Inició comunicación solo?
  interaction_partner?: string;   // 'peer', 'therapist', 'family'
}

/**
 * Respuesta de la IA: Estructura de datos devuelta por Django.
 * Genera borradores optimizados para reducir el esfuerzo cognitivo del terapeuta.
 */
export interface AIAnalysisResponse {
  draft_focus: string;           // Sugerencia técnica para 'next_session_focus'
  draft_recommendations: string; // Sugerencia práctica para el hogar (Padres)
  clinical_insight?: string;      // Análisis profundo del patrón detectado (Opcional)
}

/**
 * ✅ SERVICIO DE INTELIGENCIA ARTIFICIAL (AI SERVICE)
 * Centraliza las peticiones de análisis, resúmenes y proyecciones clínicas.
 */
export const aiService = {
  
  /**
   * Envía el contexto clínico completo para obtener sugerencias de planificación.
   * Llama al endpoint de Django: POST /seguimiento/ia/analizar-sesion/
   * * @param payload Objeto con métricas y narrativa de la sesión actual.
   * @returns Promesa con los borradores para el terapeuta y la familia.
   */
  async getPlanningSuggestion(payload: AIAnalysisPayload): Promise<AIAnalysisResponse> {
    const endpoint = `/seguimiento/ia/analizar-sesion/`; 
    
    try {
      // Realizamos la petición POST al backend
      // El backend ahora recibe datos granulares para cumplir con los 5 requerimientos
      const { data } = await http.post<AIAnalysisResponse>(endpoint, payload);
      return data;
    } catch (error) {
      console.error("❌ [AI Service Error]: Fallo en la generación de inteligencia clínica.", error);
      throw error; 
    }
  },

  /**
   * Funciones proyectadas para la Fase de Automatización y Reportes de 30/90 días:
   * - generateLongTermReport(childId, periodDays)
   * - detectRegressionAlerts(childId)
   */
}

export default aiService;