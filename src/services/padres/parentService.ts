// src/services/parentService.ts
import http from '@/services/http' // ✅ Tu instancia de Axios que añade '/api'
import type { LatestSessionUpdate } from '@/type/parent' 

/**
 * Llama al nuevo endpoint del backend para obtener la última
 * actualización de sesión del niño seleccionado.
 *
 * Endpoint corregido: GET /seguimiento/padres/ninos/{childId}/latest-update/
 */
export const fetchLatestSessionUpdate = async (childId: number): Promise<LatestSessionUpdate> => {
  try {
    // Validamos que el ID exista antes de la petición
    if (!childId) {
      throw new Error("Se requiere el ID del niño para obtener actualizaciones.");
    }

    console.log(`[parentService] 🔍 Obteniendo actualización para el niño ID: ${childId}...`);
    
    // ✅ URL ACTUALIZADA: Coincide con seguimiento/urls/padre_urls.py
    const { data } = await http.get<LatestSessionUpdate>(`/seguimiento/padres/ninos/${childId}/latest-update/`);
    
    console.log('[parentService] ✅ Actualización obtenida con éxito.');
    return data;
  
  } catch (error: any) {
    // Proporcionamos un log más descriptivo para el 404 o errores de permisos
    console.error(`[parentService] ❌ Error al cargar actualización (ID: ${childId}):`, error.response?.data || error.message);
    throw error;
  }
}