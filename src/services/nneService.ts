/// src/services/nneService.ts - VERSIÓN COMPLETAMENTE CORREGIDA
import http from './http'
import type { ParentUser, ParentUserCreate, NneFormData } from '@/type/nne'
import { parseApiError, ApiError, ApiErrorType, getUserFriendlyErrorMessage } from '@/exceptions/apiError'

// =====================================================
// INTERFACES PARA ESTABLECIMIENTOS
// =====================================================

interface Establishment {
  id: number
  name: string
  rbd: string | null
  address: string
  commune: number
  region: number
  establishment_type: number
  establishment_type_detail?: {
    id: number
    name: string
    description: string
  }
  commune_detail?: {
    id: number
    name: string
  }
  region_detail?: {
    id: number
    name: string
  }
}

// =====================================================
// INTERFAZ PARA DATOS REALES DEL BACKEND
// =====================================================

interface BackendNneData {
  first_name: string
  last_name: string
  rut: string
  birth_date: string
  gender: string
  establishment: number
  region: number
  commune: number
  street: string
  street_number: string
  current_grade: string
  school_journey: string
  adaptation_notes: string
  has_special_needs: boolean
  special_needs_type: string
  autism_level: string
  pie_diagnosis: string
  pie_entry_date: string | null
  pie_status: string
  allergies: string
  current_medication: string
  emergency_contact: string
  emergency_phone: string
  medical_notes: string
  guardian_consent: boolean
  consent_date: string
  has_previous_therapies: boolean
  therapies_detail: string
  referred_by: string
  referred_by_detail: string
  attended_where: number
  usuarios: number[]
}

// =====================================================
// FUNCIÓN DE TRANSFORMACIÓN CRÍTICA - COMPLETAMENTE CORREGIDA
// =====================================================

const transformToBackendFormat = (frontendData: NneFormData): BackendNneData => {
  console.log('🔄 Transformando datos frontend -> backend:', frontendData)
  
  // ✅ CONVERSIONES CRÍTICAS:
  // - Strings 'true'/'false' → booleanos true/false
  // - Asegurar números para IDs
  // - Campos opcionales con valores por defecto
  
  return {
    first_name: frontendData.first_name,
    last_name: frontendData.last_name,
    rut: frontendData.rut,
    birth_date: frontendData.birth_date,
    gender: frontendData.gender,
    establishment: Number(frontendData.establishment) || 0,
    region: Number(frontendData.region) || 0, // ✅ CORRECCIÓN 1: 'region' ya existe en NneFormData
    commune: Number(frontendData.commune) || 0,
    street: frontendData.street,
    street_number: frontendData.street_number,
    current_grade: frontendData.current_grade,
    school_journey: frontendData.school_journey,
    adaptation_notes: frontendData.school_adaptation_notes || '', // ✅ CORRECCIÓN 2: 'school_adaptation_notes'
    has_special_needs: frontendData.special_needs, // ✅ CORRECCIÓN 3: 'special_needs'
    special_needs_type: frontendData.special_needs_type || 'none',
    autism_level: frontendData.autism_level_value || 'none', // ✅ CORRECCIÓN 4: 'autism_level_value'
    pie_diagnosis: frontendData.pie_diagnosis || '',
    pie_entry_date: frontendData.pie_entry_date || null,
    pie_status: frontendData.pie_status || 'none',
    allergies: frontendData.allergies || 'Ninguna',
    current_medication: frontendData.current_medication || 'Ninguna',
    emergency_contact: frontendData.emergency_contact || '',
    emergency_phone: frontendData.emergency_phone || '',
    medical_notes: frontendData.medical_notes || '',
    
    // ✅ CORRECCIONES CRÍTICAS PARA PASO 7 - CONSENTIMIENTO:
    guardian_consent: frontendData.guardian_consent, // ✅ CORRECCIÓN 5: Eliminado === 'true'
    consent_date: frontendData.consent_date || new Date().toISOString().split('T')[0],
    
    // ✅ CORRECCIONES CRÍTICAS PARA PASO 6 - TERAPIAS:
    has_previous_therapies: frontendData.previous_therapies, // ✅ CORRECCIÓN 5/6: Eliminado === 'true' y nombre corregido
    therapies_detail: frontendData.previous_therapies_detail || '', // ✅ CORRECCIÓN 8: 'previous_therapies_detail'
    referred_by: frontendData.referred_by || '',
    referred_by_detail: frontendData.referred_by_detail || '',
    attended_where: Number(frontendData.attended_where) || 0,
    
    usuarios: frontendData.usuarios || []
  }
}

// =====================================================
// FUNCIONES SIMPLIFICADAS PARA ESTABLECIMIENTOS EDUCATIVOS
// =====================================================

/**
 * 🔍 Búsqueda simplificada de establecimientos educativos por nombre o RBD
 * Solo retorna establecimientos con RBD (escuelas, liceos, colegios)
 */
export const searchEducationalEstablishmentsApi = async (query: string): Promise<Array<{value: number; label: string}>> => {
  try {
    console.log(`🔍 Buscando establecimientos educativos: "${query}"`)
    
    if (!query || query.length < 2) {
      console.log('⚡ Query muy corta, retornando array vacío')
      return []
    }
    
    const response = await http.get('/establishments/establishments/search/', {
      params: { 
        name: query,
        rbd: query // Buscar tanto por nombre como por RBD
      }
    })
    
    console.log('✅ Respuesta búsqueda establecimientos:', response.data)
    
    let establishmentsData = response.data
    if (!Array.isArray(establishmentsData)) {
      console.warn('⚠️ Respuesta no es un array:', establishmentsData)
      return []
    }
    
    // 🔥 FILTRO CRÍTICO: Solo establecimientos con RBD (educativos)
    const educationalEstablishments = establishmentsData.filter((est: Establishment) => 
      est.rbd && est.rbd.trim() !== '' // Solo establecimientos con RBD
    )
    
    const mappedEstablishments = educationalEstablishments.map((est: Establishment) => ({
      value: est.id,
      label: `${est.name} ${est.rbd ? `(RBD: ${est.rbd})` : ''} - ${est.commune_detail?.name || 'Sin comuna'}`
    }))
    
    console.log(`✅ ${mappedEstablishments.length} establecimientos educativos encontrados para "${query}"`)
    return mappedEstablishments
    
  } catch (error: any) {
    console.error('❌ Error en búsqueda de establecimientos:', error)
    throw parseApiError(error)
  }
}

/**
 * 🔍 Obtener todos los establecimientos educativos (para selects grandes)
 */
export const getAllEducationalEstablishmentsApi = async (): Promise<Array<{value: number; label: string}>> => {
  try {
    console.log('🏫 Cargando todos los establecimientos educativos...')
    
    const response = await http.get('/establishments/establishments/')
    
    let establishmentsData = response.data
    if (!Array.isArray(establishmentsData)) {
      return []
    }
    
    // Filtrar solo establecimientos con RBD
    const educationalEstablishments = establishmentsData.filter((est: Establishment) => 
      est.rbd && est.rbd.trim() !== ''
    )
    
    const mappedEstablishments = educationalEstablishments.map((est: Establishment) => ({
      value: est.id,
      label: `${est.name} ${est.rbd ? `(RBD: ${est.rbd})` : ''} - ${est.commune_detail?.name || 'Sin comuna'}`
    }))
    
    console.log(`✅ ${mappedEstablishments.length} establecimientos educativos cargados`)
    return mappedEstablishments
    
  } catch (error: any) {
    console.error('❌ Error al cargar establecimientos:', error)
    throw parseApiError(error)
  }
}

/**
 * 📋 Obtener detalle completo de un establecimiento
 */
export const getEstablishmentDetailApi = async (establishmentId: number): Promise<Establishment> => {
  try {
    const response = await http.get(`/establishments/establishments/${establishmentId}/`)
    return response.data
  } catch (error: any) {
    console.error(`❌ Error al obtener detalle establecimiento ${establishmentId}:`, error)
    throw parseApiError(error)
  }
}

// =====================================================
// ENDPOINTS DE PADRES/TUTORES - CORREGIDOS
// =====================================================

export const searchParentsApi = async (query: string): Promise<ParentUser[]> => {
  try {
    console.log(`🔍 Buscando padres con query: "${query}"`)
    
    const response = await http.get('/user/padres/buscar/', {
      params: { q: query }
    })
    
    let resultsArray: any[] = []
    if (Array.isArray(response.data)) {
      resultsArray = response.data
    } else if (response.data.results && Array.isArray(response.data.results)) {
      resultsArray = response.data.results
    } else if (response.data.data && Array.isArray(response.data.data)) {
      resultsArray = response.data.data
    } else {
      console.warn('⚠️ Estructura de respuesta no reconocida:', response.data)
      return []
    }
    
    // ✅ CORRECCIÓN 7: 'mappedResults' ahora coincide con la interfaz ParentUser (que ya incluye 'role')
    const mappedResults: ParentUser[] = resultsArray.map((parent: any) => ({
      id: parent.id,
      username: parent.username || parent.email?.split('@')[0] || `user_${parent.id}`,
      email: parent.email,
      first_name: parent.first_name || parent.nombres || '',
      last_name: parent.last_name || parent.apellidos || '',
      rut: parent.rut,
      phone: parent.phone || parent.telefono || null,
      role: parent.role || (Array.isArray(parent.roles) ? parent.roles[0] : 'Padres') || 'Padres'
    }))
    
    const filteredResults = mappedResults.filter(user => 
      user.role === 'Padres' || !user.role
    )
    
    return filteredResults
  } catch (error: any) {
    console.error('❌ Error en búsqueda de padres:', error)
    throw parseApiError(error)
  }
}

export const createParentApi = async (parentData: ParentUserCreate): Promise<ParentUser> => {
  try {
    const response = await http.post('/user/padres/crear/', {
      ...parentData,
      role: 'Padres'
    })
    const responseData = response.data.data || response.data
    
    // ✅ CORRECCIÓN 7: El objeto de retorno ahora coincide con ParentUser (que ya incluye 'role')
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
    console.error('❌ Error al crear padre:', error)
    throw parseApiError(error)
  }
}

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
      // 'role' es opcional en ParentUser, así que está bien no devolverlo aquí
    }
  } catch (error: any) {
    console.error(`❌ Error al obtener padre ID ${parentId}:`, error)
    throw parseApiError(error)
  }
}

export const getParentsByIdsApi = async (parentIds: number[]): Promise<ParentUser[]> => {
  try {
    const promises = parentIds.map(id => getParentByIdApi(id))
    return await Promise.all(promises)
  } catch (error) {
    console.error('❌ Error al obtener múltiples padres:', error)
    return []
  }
}

// =====================================================
// ENDPOINTS DE NNE (NIÑOS) - CORREGIDOS
// =====================================================

export const createNneApi = async (nneData: NneFormData): Promise<any> => {
  try {
    const backendData = transformToBackendFormat(nneData)
    console.log('🚀 Enviando datos transformados al backend:', backendData)
    const response = await http.post('/ingreso/crear/', backendData)
    return response.data
  } catch (error: any) {
    console.error('❌ Error al crear NNE:', error)
    throw parseApiError(error)
  }
}

export const createNneIngresoApi = async (nneData: NneFormData): Promise<any> => {
  return createNneApi(nneData)
}

export const getNneListApi = async (filters?: any): Promise<any[]> => {
  try {
    const response = await http.get('/nne/', { // ✅ Slash inicial agregado
      params: filters
    })
    return response.data
  } catch (error: any) {
    console.error('❌ Error al obtener lista de NNE:', error)
    throw parseApiError(error)
  }
}

export const getNneByIdApi = async (nneId: number): Promise<any> => {
  try {
    const response = await http.get(`/nne/${nneId}/`) // ✅ Slash inicial agregado
    return response.data
  } catch (error: any) {
    console.error(`❌ Error al obtener NNE ID ${nneId}:`, error)
    throw parseApiError(error)
  }
}

export const updateNneApi = async (nneId: number, nneData: Partial<NneFormData>): Promise<any> => {
  try {
    const response = await http.put(`/nne/${nneId}/`, nneData)
    return response.data
  } catch (error: any) {
    console.error(`❌ Error al actualizar NNE ID ${nneId}:`, error)
    throw parseApiError(error)
  }
}

// =====================================================
// UTILIDADES Y HELPERS
// =====================================================

export const checkEmailAvailabilityApi = async (email: string): Promise<boolean> => {
  try {
    const response = await http.get('/user/check-email/', { params: { email } })
    return response.data.available
  } catch {
    return false
  }
}

// En nneService.ts - MODIFICAR la función existente

export const checkRutAvailabilityApi = async (rut: string): Promise<boolean> => {
  try {
    // ✅ NUEVO: Usar el endpoint de ingreso_fichas en lugar de user
    const response = await http.get('/ingreso/check-rut/', { 
      params: { rut } 
    })
    return response.data.available
  } catch (error: any) {
    console.error('❌ Error verificando disponibilidad de RUT (ingreso_fichas):', error)
    
    // ✅ NUEVO: Manejo específico de errores
    if (error.response?.status === 404) {
      // Endpoint no existe aún, asumir disponible (modo compatibilidad)
      console.warn('⚠️ Endpoint /ingreso/check-rut/ no disponible, asumiendo RUT disponible')
      return true
    }
    
    return false
  }
}



// En nneService.ts - AGREGAR nueva función

/**
 * ✅ NUEVO: Validación específica para RUT de niños
 * Incluye validación de formato y disponibilidad
 */
export const validateChildRutApi = async (rut: string): Promise<{
  isValid: boolean;
  isAvailable: boolean;
  message?: string;
  rutNormalized?: string;
}> => {
  try {
    const response = await http.post('/ingreso/validate-rut/', { rut })
    return response.data
  } catch (error: any) {
    console.error('❌ Error validando RUT de niño:', error)
    
    // Fallback: validación básica en frontend si el endpoint no existe
    if (error.response?.status === 404) {
      return {
        isValid: /^\d{7,8}-[0-9kK]$/.test(rut),
        isAvailable: true, // Asumir disponible hasta que backend confirme
        message: 'Validación local (servicio no disponible)'
      }
    }
    
    throw parseApiError(error)
  }
}

export const getCommunesApi = async (): Promise<any[]> => {
  try {
    const response = await http.get('/geo/comunas/')
    return response.data
  } catch {
    return []
  }
}



// En nneService.ts - AGREGAR nueva función

/**
 * ✅ NUEVO: Obtener lista paginada de padres
 * @param page Página actual (por defecto 1)
 * @param pageSize Tamaño de página (por defecto 5)
 * @param search Término de búsqueda opcional
 */
export const getParentsListApi = async (
  page: number = 1, 
  pageSize: number = 5,
  search: string = ''
): Promise<{
  results: ParentUser[];
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  next: boolean;
  previous: boolean;
  next_page?: number;
  previous_page?: number;
}> => {
  try {
    console.log(`📥 Solicitando lista de padres - Página ${page}, Tamaño: ${pageSize}`)
    
    const response = await http.get('/user/padres/listar/', {
      params: { 
        page, 
        page_size: pageSize,
        search: search || undefined
      }
    })
    
    console.log(`✅ Lista de padres recibida: ${response.data.count} padres totales`)
    return response.data
    
  } catch (error: any) {
    console.error('❌ Error al obtener lista de padres:', error)
    throw parseApiError(error)
  }
}

// =====================================================
// FUNCIONES GEOGRÁFICAS COMPLETAMENTE CORREGIDAS
// =====================================================

export const getRegionsApi = async (): Promise<Array<{value: number; label: string}>> => {
  try {
    console.log('🗺️ Cargando regiones desde el backend...')
    
    const response = await http.get('/geolocalization/regions/')
    
    console.log('✅ Respuesta completa de regiones:', response.data)
    
    let regionsData = response.data
    
    if (!Array.isArray(regionsData)) {
      console.warn('⚠️ Respuesta de regiones no es un array:', regionsData)
      return []
    }
    
    const mappedRegions = regionsData.map((region: any) => ({
      value: region.id,
      label: region.name
    }))
    
    console.log('✅ Regiones mapeadas:', mappedRegions.length)
    return mappedRegions
    
  } catch (error: any) {
    console.error('❌ Error al cargar regiones:', error)
    throw parseApiError(error)
  }
}

export const getCommunesByRegionApi = async (regionId: number): Promise<Array<{value: number; label: string}>> => {
  try {
    console.log(`🏘️ Cargando comunas para región ${regionId}...`)
    
    const response = await http.get('/geolocalization/communes/by_region/', {
      params: { region_id: regionId }
    })
    
    console.log('✅ Respuesta completa de comunas:', response.data)
    
    let communesData = response.data
    
    if (!Array.isArray(communesData)) {
      console.warn('⚠️ Respuesta de comunas no es un array:', communesData)
      return []
    }
    
    const mappedCommunes = communesData.map((commune: any) => ({
      value: commune.id,
      label: commune.name
    }))
    
    console.log(`✅ ${mappedCommunes.length} comunas cargadas para región ${regionId}`)
    return mappedCommunes
    
  } catch (error: any) {
    console.error(`❌ Error al cargar comunas para región ${regionId}:`, error)
    throw parseApiError(error)
  }
}

// =====================================================
// HELPERS DE ERRORES
// =====================================================

// En nneService.ts - ACTUALIZAR handleRutValidationError

export const handleRutValidationError = (error: ApiError): { title: string; message: string } => {
  const rutError = error.getFieldError('rut')

  // ✅ MEJORADO: Mensajes específicos para ingreso_fichas
  if (rutError?.message.includes('Dígito verificador incorrecto')) {
    return {
      title: 'Error en dígito verificador del RUT',
      message: `El RUT ingresado tiene un error en el dígito verificador.\n\n${rutError.message}`
    }
  }

  if (rutError?.message.includes('ya está registrado en el sistema para otro niño')) {
    return {
      title: 'RUT ya registrado',
      message: 'El RUT ingresado ya está registrado para otro niño en el sistema.'
    }
  }

  if (rutError?.message.includes('El RUT es obligatorio para el registro de niños')) {
    return {
      title: 'RUT obligatorio',
      message: 'El RUT es un campo obligatorio para el registro de niños.'
    }
  }

  if (rutError?.message.includes('Formato de RUT inválido')) {
    return {
      title: 'Formato de RUT incorrecto',
      message: 'El RUT debe tener el formato: 12345678-9 (con guión y dígito verificador).'
    }
  }

  // ✅ NUEVO: Mensaje genérico para errores de RUT
  if (rutError) {
    return {
      title: 'Error en RUT',
      message: rutError.message || 'Por favor verifique el RUT ingresado.'
    }
  }

  return { title: 'Error en RUT', message: getUserFriendlyErrorMessage(error) }
}

export const getErrorDisplayInfo = (error: any): { title: string; message: string } => {
  if (error instanceof ApiError) {
    if (error.hasFieldError('rut')) {
      return handleRutValidationError(error)
    }

    switch (error.type) {
      case ApiErrorType.VALIDATION_ERROR:
        return { title: 'Error de validación', message: getUserFriendlyErrorMessage(error) }
      case ApiErrorType.CONFLICT_ERROR:
        return { title: 'Conflicto de datos', message: getUserFriendlyErrorMessage(error) }
      case ApiErrorType.NETWORK_ERROR:
        return { title: 'Error de conexión', message: getUserFriendlyErrorMessage(error) }
      case ApiErrorType.AUTHENTICATION_ERROR:
        return { title: 'Error de autenticación', message: getUserFriendlyErrorMessage(error) }
      case ApiErrorType.AUTHORIZATION_ERROR:
        return { title: 'Error de autorización', message: getUserFriendlyErrorMessage(error) }
      case ApiErrorType.SERVER_ERROR:
        return { title: 'Error del servidor', message: getUserFriendlyErrorMessage(error) }
      default:
        return { title: 'Error', message: getUserFriendlyErrorMessage(error) }
    }
  }

  return { title: 'Error', message: getUserFriendlyErrorMessage(error) }
}

// =====================================================
// EXPORTS CONSOLIDADOS
// =====================================================

export default {
  // 🔍 Búsqueda simplificada de establecimientos educativos
  searchEducationalEstablishmentsApi,
  getAllEducationalEstablishmentsApi,
  getEstablishmentDetailApi,
  
  // 👨‍👩‍👧‍👦 Funciones de padres
  searchParentsApi,
  createParentApi,
  getParentByIdApi,
  getParentsByIdsApi,
  
  // 👶 Funciones de NNE
  createNneApi,
  createNneIngresoApi,
  getNneListApi,
  getNneByIdApi,
  updateNneApi,
  
  // 🗺️ Funciones geográficas
  checkEmailAvailabilityApi,
  checkRutAvailabilityApi,
  getCommunesApi,
  getRegionsApi,
  getCommunesByRegionApi,
  
  // 🛠️ Utilidades
  getErrorDisplayInfo,
  getUserFriendlyErrorMessage,
  transformToBackendFormat
}