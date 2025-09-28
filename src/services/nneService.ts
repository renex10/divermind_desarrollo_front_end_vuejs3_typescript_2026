// src/services/nneService.ts
// Servicio API para gestión de NNE (Niños, Niñas y Estudiantes)

import http from './http'
import type { ParentUser, ParentUserCreate, NneFormData } from '@/types/nne'

// =====================================================
// ENDPOINTS DE PADRES/TUTORES
// =====================================================

/**
 * Busca padres por criterio (RUT, nombre, email)
 * @param query - Término de búsqueda
 * @returns Lista de padres que coinciden con el criterio
 */
export const searchParentsApi = async (query: string): Promise<ParentUser[]> => {
  try {
    console.log(`🔍 Buscando padres con query: "${query}"`)
    
    const response = await http.get('/user/padres/buscar/', {
      params: { q: query }
    })
    
    console.log(`✅ Búsqueda exitosa. Respuesta completa:`, response.data)
    
    // VERIFICAR LA ESTRUCTURA DE LA RESPUESTA
    let resultsArray: any[] = []
    
    if (Array.isArray(response.data)) {
      // Caso 1: La API devuelve un array directo
      resultsArray = response.data
    } else if (response.data.results && Array.isArray(response.data.results)) {
      // Caso 2: La API devuelve {status, count, results}
      resultsArray = response.data.results
      console.log(`📊 Estructura detectada: objeto con results. Count: ${response.data.count}`)
    } else if (response.data.data && Array.isArray(response.data.data)) {
      // Caso 3: Otra estructura común {data: [...]}
      resultsArray = response.data.data
    } else {
      console.warn('⚠️ Estructura de respuesta no reconocida:', response.data)
      return []
    }
    
    console.log(`👥 Resultados procesados: ${resultsArray.length} padres`)
    
    // Mapear los resultados a la interfaz ParentUser
    const mappedResults = resultsArray.map((parent: any) => ({
      id: parent.id,
      username: parent.username || parent.email?.split('@')[0] || `user_${parent.id}`,
      email: parent.email,
      first_name: parent.first_name || parent.nombres || '',
      last_name: parent.last_name || parent.apellidos || '',
      rut: parent.rut,
      phone: parent.phone || parent.telefono || null,
      role: parent.role || parent.roles?.[0] || 'Padres'
    }))
    
    // Filtrar solo usuarios con rol 'Padres' (por si acaso)
    const filteredResults = mappedResults.filter(user => 
      user.role === 'Padres' || 
      user.roles?.includes('Padres') ||
      // Si no hay información de rol, asumimos que son padres (por el endpoint)
      !user.role
    )
    
    console.log(`✅ Padres filtrados: ${filteredResults.length} de ${mappedResults.length}`)
    return filteredResults
    
  } catch (error: any) {
    console.error('❌ Error en búsqueda de padres:', error)
    
    // Log detallado del error
    if (error.response) {
      console.error('📊 Detalles del error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      })
    }
    
    if (error.response?.status === 404) {
      // No encontrado no es realmente un error, devolver array vacío
      return []
    }
    
    if (error.response?.status === 400) {
      throw new Error('Parámetros de búsqueda inválidos')
    }
    
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      throw new Error('Error de conexión. Verifique su internet')
    }
    
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.detail ||
      'Error al buscar padres. Intente nuevamente.'
    )
  }
}

/**
 * Crea un nuevo padre/tutor
 * @param parentData - Datos del padre a crear
 * @returns Padre creado
 */
export const createParentApi = async (parentData: ParentUserCreate): Promise<ParentUser> => {
  try {
    console.log('🆕 Creando nuevo padre:', { 
      ...parentData, 
      // No loguear información sensible
      password: parentData.password ? '[OCULTO]' : undefined
    })
    
    const response = await http.post('/user/padres/crear/', {
      ...parentData,
      role: 'Padres'
    })
    
    console.log('✅ Padre creado exitosamente:', response.data)
    
    // Manejar diferentes estructuras de respuesta
    const responseData = response.data.data || response.data
    
    return {
      id: responseData.id,
      username: responseData.username,
      email: responseData.email,
      first_name: responseData.first_name,
      last_name: responseData.last_name,
      rut: responseData.rut,
      phone: responseData.phone || null,
      role: 'Padres'
    }
    
  } catch (error: any) {
    console.error('❌ Error al crear padre:', error.response?.data || error.message)
    
    if (error.response?.status === 400) {
      const errors = error.response.data.errors || error.response.data
      const errorMessage = typeof errors === 'string' 
        ? errors 
        : 'Error de validación. Verifique los datos ingresados.'
      throw new Error(errorMessage)
    }
    
    if (error.response?.status === 409) {
      throw new Error('Ya existe un usuario con ese RUT o email')
    }
    
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.detail ||
      'Error al crear el padre. Verifique los datos e intente nuevamente.'
    )
  }
}

/**
 * Obtiene información completa de un padre por ID
 * @param parentId - ID del padre
 * @returns Información del padre
 */
export const getParentByIdApi = async (parentId: number): Promise<ParentUser> => {
  try {
    const response = await http.get(`/user/padres/${parentId}/`)
    
    return {
      id: response.data.id,
      username: response.data.username,
      email: response.data.email,
      first_name: response.data.first_name,
      last_name: response.data.last_name,
      rut: response.data.rut,
      phone: response.data.phone || null
    }
    
  } catch (error: any) {
    console.error(`❌ Error al obtener padre ID ${parentId}:`, error)
    throw new Error('Error al obtener información del padre')
  }
}

/**
 * Obtiene múltiples padres por sus IDs
 * @param parentIds - Array de IDs de padres
 * @returns Array de padres
 */
export const getParentsByIdsApi = async (parentIds: number[]): Promise<ParentUser[]> => {
  try {
    const promises = parentIds.map(id => getParentByIdApi(id))
    return await Promise.all(promises)
  } catch (error) {
    console.error('❌ Error al obtener múltiples padres:', error)
    return [] // En caso de error, retornar array vacío
  }
}

// =====================================================
// ENDPOINTS DE NNE (NIÑOS)
// =====================================================

/**
 * Crea un nuevo NNE (Niño, Niña o Estudiante)
 * @param nneData - Datos completos del NNE
 * @returns NNE creado
 */
export const createNneApi = async (nneData: NneFormData): Promise<any> => {
  try {
    console.log('🆕 Creando nuevo NNE:', nneData)
    
    const response = await http.post('/nne/', nneData)
    
    console.log('✅ NNE creado exitosamente:', response.data)
    
    return response.data
    
  } catch (error: any) {
    console.error('❌ Error al crear NNE:', error.response?.data || error.message)
    
    if (error.response?.status === 400) {
      const errors = error.response.data.errors || error.response.data
      throw new Error(`Error de validación: ${JSON.stringify(errors)}`)
    }
    
    throw new Error(
      error.response?.data?.message || 
      'Error al crear el niño. Verifique los datos e intente nuevamente.'
    )
  }
}

/**
 * Obtiene lista de todos los NNE
 * @param filters - Filtros opcionales
 * @returns Lista de NNE
 */
export const getNneListApi = async (filters?: any): Promise<any[]> => {
  try {
    const response = await http.get('nne/', {
      params: filters
    })
    
    return response.data
    
  } catch (error: any) {
    console.error('❌ Error al obtener lista de NNE:', error)
    throw new Error('Error al cargar la lista de niños')
  }
}

/**
 * Obtiene un NNE específico por ID
 * @param nneId - ID del NNE
 * @returns Datos del NNE
 */
export const getNneByIdApi = async (nneId: number): Promise<any> => {
  try {
    const response = await http.get(`nne/${nneId}/`)
    return response.data
  } catch (error: any) {
    console.error(`❌ Error al obtener NNE ID ${nneId}:`, error)
    throw new Error('Error al cargar información del niño')
  }
}

/**
 * Actualiza un NNE existente
 * @param nneId - ID del NNE
 * @param nneData - Datos actualizados
 * @returns NNE actualizado
 */
export const updateNneApi = async (nneId: number, nneData: Partial<NneFormData>): Promise<any> => {
  try {
    const response = await http.put(`/nne/${nneId}/`, nneData)
    console.log('✅ NNE actualizado exitosamente')
    return response.data
  } catch (error: any) {
    console.error(`❌ Error al actualizar NNE ID ${nneId}:`, error)
    throw new Error('Error al actualizar información del niño')
  }
}

// =====================================================
// UTILIDADES Y HELPERS
// =====================================================

/**
 * Valida si un email ya está registrado
 * @param email - Email a verificar
 * @returns true si está disponible, false si ya existe
 */
export const checkEmailAvailabilityApi = async (email: string): Promise<boolean> => {
  try {
    const response = await http.get('/user/check-email/', {
      params: { email }
    })
    return response.data.available
  } catch (error) {
    console.error('Error al verificar disponibilidad de email:', error)
    return false
  }
}

/**
 * Valida si un RUT ya está registrado
 * @param rut - RUT a verificar
 * @returns true si está disponible, false si ya existe
 */
export const checkRutAvailabilityApi = async (rut: string): Promise<boolean> => {
  try {
    const response = await http.get('/user/check-rut/', {
      params: { rut }
    })
    return response.data.available
  } catch (error) {
    console.error('Error al verificar disponibilidad de RUT:', error)
    return false
  }
}

/**
 * Obtiene datos de comunas para el formulario
 * @returns Lista de comunas
 */
export const getCommunesApi = async (): Promise<any[]> => {
  try {
    const response = await http.get('/geo/comunas/')
    return response.data
  } catch (error) {
    console.error('Error al cargar comunas:', error)
    return []
  }
}

/**
 * Obtiene datos de establecimientos educacionales
 * @returns Lista de establecimientos
 */
export const getEstablishmentsApi = async (): Promise<any[]> => {
  try {
    const response = await http.get('/api/establecimientos/')
    return response.data
  } catch (error) {
    console.error('Error al cargar establecimientos:', error)
    return []
  }
}

// =====================================================
// EXPORTS CONSOLIDADOS
// =====================================================

export default {
  // Padres
  searchParentsApi,
  createParentApi,
  getParentByIdApi,
  getParentsByIdsApi,
  
  // NNE
  createNneApi,
  getNneListApi,
  getNneByIdApi,
  updateNneApi,
  
  // Utilidades
  checkEmailAvailabilityApi,
  checkRutAvailabilityApi,
  getCommunesApi,
  getEstablishmentsApi
}