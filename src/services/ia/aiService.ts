//ruta src\services\ia\aiService.ts
import http from "../http";

/**
 * Payload de análisis: Estructura de datos que enviamos al motor de IA.
 * Contiene el contexto clínico capturado en tiempo real desde el formulario.
 */
export interface AIAnalysisPayload {
  objectives: string;      // Objetivos definidos para la sesión
  strengths: string;       // Notas sobre Fortalezas Observadas
  challenges: string;      // Notas sobre Dificultades Encontradas
  techniques: string;      // Notas sobre Intervenciones y Técnicas Aplicadas
  session_number: number;  // Número correlativo de la sesión actual
}

/**
 * Respuesta de la IA: Estructura de datos que el Backend devuelve tras el procesamiento.
 * Entrega dos borradores diferenciados por destinatario.
 */
export interface AIAnalysisResponse {
  draft_focus: string;           // Sugerencia técnica para 'next_session_focus'
  draft_recommendations: string;  // Sugerencia práctica para 'next_session_recommendations'
}

/**
 * ✅ SERVICIO DE INTELIGENCIA ARTIFICIAL (AI SERVICE)
 * * Centraliza las peticiones de análisis, resúmenes y proyecciones clínicas.
 * Este servicio es independiente de sessionService para permitir escalabilidad futura
 * (ej: análisis de hitos, reportes automáticos, etc.)
 */
export const aiService = {
  
  /**
   * Envía las notas de la sesión actual para obtener una propuesta de planificación dual.
   * Llama al endpoint de Django: POST /seguimiento/ia/analizar-sesion/
   * * @param payload Objeto con el contexto actual de la sesión.
   * @returns Promesa con los borradores para el terapeuta y la familia.
   */
  async getPlanningSuggestion(payload: AIAnalysisPayload): Promise<AIAnalysisResponse> {
    const endpoint = `/seguimiento/ia/analizar-sesion/`; 
    
    try {
      // Realizamos la petición POST al backend
      const { data } = await http.post<AIAnalysisResponse>(endpoint, payload);
      return data;
    } catch (error) {
      // Registramos el error de forma centralizada para facilitar el debug
      console.error("❌ [AI Service Error]: No se pudo obtener la sugerencia de planificación.", error);
      throw error; 
    }
  },

  /**
   * Nota: Aquí se pueden añadir futuras funciones relacionadas con IA:
   * - analyzeEmotionalTrends(childId: number)
   * - generateSummaryForGuardians(sessionId: number)
   */
}

export default aiService;