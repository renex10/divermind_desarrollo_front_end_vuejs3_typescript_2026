// src/services/parentService.ts

import http from '@/services/http' // ✅ Tu instancia de Axios
import type { LatestSessionUpdate } from '@/type/parent' // ✅ El tipo que acabamos de crear

/**
 * Llama al nuevo endpoint del backend para obtener la última
 * actualización de sesión para el padre logueado.
 *
 * Endpoint: GET /seguimiento/parent/latest-update/
 * (Tu 'http.ts' ya añade el prefijo '/api')
 */
export const fetchLatestSessionUpdate = async (): Promise<LatestSessionUpdate> => {
  try {
    console.log('[parentService] 🔍 Obteniendo última actualización de sesión...')
    
    // Tu http.ts se encarga del 'baseURL' y del token
    const { data } = await http.get<LatestSessionUpdate>('/seguimiento/parent/latest-update/')
    
    console.log('[parentService] ✅ Actualización obtenida.')
    return data
  
  } catch (error: any) {
    // El composable/componente que llame a esto manejará el error
    console.error("Error al cargar la última actualización:", error)
    throw error
  }
}

// Aquí puedes agregar más funciones de servicio para padres en el futuro
// export const fetchMisFacturas = async (): ...