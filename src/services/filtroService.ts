// src/services/filtroService.ts
// Servicio para gestión de filtros y listado de NNA

import http from './http'
import { parseApiError, ApiError, getUserFriendlyErrorMessage } from '@/exceptions/apiError'

// =====================================================
// INTERFACES Y TIPOS
// =====================================================

/**
 * Interfaz para los datos de NNA provenientes de la API
 */
export interface NnaFromApi {
  id: number
  first_name: string
  last_name: string
  full_name: string
  rut: string
  birth_date: string
  current_grade: string
  created_at: string
  commune_name: string
  region_name: string
  address: string
  attended_where_name?: string
  usuarios_count: number
  autism_level_value: string
  autism_level_display: string
  pie_status: 'active' | 'inactive'
  pie_status_display: string
  school_journey: 'morning' | 'afternoon'
  photo_url?: string      // ✨ NUEVO: URL de la foto
  has_photo?: boolean     // ✨ NUEVO: Indicador de foto
}

/**
 * Interfaz para la respuesta paginada de la API
 */
export interface NnaListResponse {
  results: NnaFromApi[]
  pagination: {
    count: number
    total_pages: number
    current_page: number
    has_next: boolean
    has_previous: boolean
    page_size: number
  }
}

/**
 * Interfaz para los filtros disponibles
 */
export interface AvailableFilters {
  grades: string[]
  statuses: string[]
  communes: string[]
  regions: string[]
  autism_levels: string[]
  school_journeys: string[]
}

/**
 * Interfaz para los parámetros de búsqueda
 */
export interface SearchParams {
  page?: number
  page_size?: number
  search?: string
  grade?: string
  status?: string
  commune?: string
  region?: string
  autism_level?: string
  school_journey?: string
}

/**
 * Interfaz para comunas por región
 */
export interface CommuneByRegion {
  id: number
  name: string
  region_id: number
}

// =====================================================
// FUNCIONES PRINCIPALES
// =====================================================

/**
 * Obtiene la lista de NNA con paginación y filtros
 * @param params - Parámetros de búsqueda y paginación
 * @returns Lista paginada de NNA
 */
export const getNnaListApi = async (params: SearchParams = {}): Promise<NnaListResponse> => {
  try {
    console.log('📋 Obteniendo lista de NNA con parámetros:', params)
    
    const response = await http.get('/ingreso/listar/', {
      params: {
        page: params.page || 1,
        page_size: params.page_size || 10,
        search: params.search || '',
        grade: params.grade || '',
        status: params.status || '',
        commune: params.commune || '',
        region: params.region || '',
        autism_level: params.autism_level || '',
        school_journey: params.school_journey || ''
      }
    })
    
    console.log('✅ Lista de NNA obtenida exitosamente:', {
      count: response.data.pagination?.count,
      total_pages: response.data.pagination?.total_pages,
      results_count: response.data.results?.length,
      con_fotos: response.data.results?.filter((n: any) => n.photo_url).length
    })
    
    return response.data
    
  } catch (error: any) {
    console.error('❌ Error al obtener lista de NNA:', error)
    throw parseApiError(error)
  }
}

/**
 * Obtiene los filtros disponibles para el formulario
 * @returns Objeto con arrays de filtros disponibles
 */
export const getAvailableFiltersApi = async (): Promise<AvailableFilters> => {
  try {
    console.log('🎯 Obteniendo filtros disponibles')
    
    const response = await http.get('/ingreso/filtros/disponibles/')
    
    console.log('✅ Filtros disponibles obtenidos:', response.data)
    
    // Mapear la respuesta de la API a nuestra interfaz
    return {
      grades: response.data.grades || [],
      statuses: response.data.statuses || [],
      communes: response.data.communes || [],
      regions: response.data.regions || [],
      autism_levels: response.data.autism_levels || [],
      school_journeys: response.data.school_journeys || []
    }
    
  } catch (error: any) {
    console.error('❌ Error al obtener filtros disponibles:', error)
    throw parseApiError(error)
  }
}

/**
 * Obtiene las comunas por región
 * @param regionId - ID de la región (opcional)
 * @returns Lista de comunas
 */
export const getCommunesByRegionApi = async (regionId?: number): Promise<CommuneByRegion[]> => {
  try {
    console.log('🗺️ Obteniendo comunas por región:', regionId || 'todas')
    
    const params = regionId ? { region_id: regionId } : {}
    const response = await http.get('/ingreso/comunas/por-region/', { params })
    
    console.log('✅ Comunas obtenidas:', response.data.length)
    
    return response.data
    
  } catch (error: any) {
    console.error('❌ Error al obtener comunas por región:', error)
    throw parseApiError(error)
  }
}

// =====================================================
// FUNCIONES DE TRANSFORMACIÓN
// =====================================================

/**
 * Transforma los datos de la API al formato esperado por el componente TablaFiltro
 * ✨ ACTUALIZADO: Ahora incluye photo_url y has_photo para mostrar fotos en tabla
 */
export const transformNnaForTable = (nnaFromApi: NnaFromApi) => {
  return {
    id: nnaFromApi.id,
    first_name: nnaFromApi.first_name,
    last_name: nnaFromApi.last_name,
    birth_date: nnaFromApi.birth_date,
    current_grade: nnaFromApi.current_grade,
    status: nnaFromApi.pie_status === 'active' ? 'active' : 'suspended',
    last_session: nnaFromApi.created_at, // Usamos created_at como última sesión por ahora
    
    // Campos adicionales que podrían ser útiles
    rut: nnaFromApi.rut,
    full_name: nnaFromApi.full_name,
    commune_name: nnaFromApi.commune_name,
    region_name: nnaFromApi.region_name,
    address: nnaFromApi.address,
    autism_level: nnaFromApi.autism_level_display,
    school_journey: nnaFromApi.school_journey,
    
    // ✨ NUEVO: Campos para mostrar foto en tabla
    photo_url: nnaFromApi.photo_url,      // URL de la foto subida por padre
    has_photo: nnaFromApi.has_photo,      // Indicador de si tiene foto
    pie_status_display: nnaFromApi.pie_status_display,  // Estado para mostrar
    attended_where_name: nnaFromApi.attended_where_name,  // Institución
    usuarios_count: nnaFromApi.usuarios_count,  // Contador de usuarios
    autism_level_value: nnaFromApi.autism_level_value  // Valor numérico del nivel
  }
}

/**
 * Transforma una lista de NNA de la API al formato de tabla
 * ✨ ACTUALIZADO: Ahora incluye photo_url para cada NNA
 */
export const transformNnaListForTable = (nnaList: NnaFromApi[]) => {
  console.log('[filtroService] 📷 Transformando', nnaList.length, 'NNA para tabla...')
  
  const transformedList = nnaList.map(nna => {
    const transformed = transformNnaForTable(nna)
    
    // Log de debugging para primeros NNA
    if (nnaList.indexOf(nna) < 3) {
      console.log(`[filtroService] 📷 NNA transformado - ID: ${transformed.id}, foto: ${transformed.photo_url ? '✅' : '❌'}`)
    }
    
    return transformed
  })
  
  console.log('[filtroService] ✅ Transformación completada:', {
    total: transformedList.length,
    con_foto: transformedList.filter(n => n.photo_url).length,
    sin_foto: transformedList.filter(n => !n.photo_url).length
  })
  
  return transformedList
}

// =====================================================
// HELPERS Y UTILIDADES
// =====================================================

/**
 * Calcula la edad a partir de la fecha de nacimiento
 */
export const calculateAge = (birthDate: string): number => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

/**
 * Formatea la fecha para mostrar en la tabla
 */
export const formatLastSession = (date: string): string => {
  if (!date) return 'Nunca'
  
  const sessionDate = new Date(date)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (sessionDate.toDateString() === today.toDateString()) {
    return 'Hoy'
  } else if (sessionDate.toDateString() === yesterday.toDateString()) {
    return 'Ayer'
  } else {
    return sessionDate.toLocaleDateString('es-CL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    })
  }
}

/**
 * Obtiene las iniciales para el avatar
 */
export const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

// =====================================================
// EXPORTS CONSOLIDADOS
// =====================================================

export default {
  // Funciones principales
  getNnaListApi,
  getAvailableFiltersApi,
  getCommunesByRegionApi,
  
  // Funciones de transformación
  transformNnaForTable,
  transformNnaListForTable,
  
  // Utilidades
  calculateAge,
  formatLastSession,
  getInitials,
  
  // Helpers de error (re-exportados)
  parseApiError,
  getUserFriendlyErrorMessage
}