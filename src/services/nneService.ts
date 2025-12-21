/**
 * src/services/nneService.ts
 * ✅ VERSIÓN FINAL CORREGIDA
 * 
 * Cambios realizados:
 * 1. ✅ Retornos de getRegionsApi y getCommunesByRegionApi ahora son SelectOption[]
 * 2. ✅ searchEducationalEstablishmentsApi retorna SelectOption[]
 * 3. ✅ Agregado 'export' a createParentApi
 * 4. ✅ Sincronizadas URLs con el módulo 'extenduser' (/api/user/)
 * 5. ✅ Mapeo de campos normalizados para el backend
 * 6. ✅ IMPLEMENTADAS createEstablishmentApi y updateEstablishmentApi
 */

import http from './http'
import type { 
  ParentUser, 
  ParentUserCreate, 
  NneFormData,
  SelectOption,
  Region,
  Commune,
  Establishment  // ✅ Importar desde nne.ts
} from '@/type/nne'
import { parseApiError } from '@/exceptions/apiError'

// =====================================================
// INTERFACES INTERNAS
// =====================================================

export interface EstablishmentType {
  id: number
  name: string
  description?: string
}

// ✅ Establishment ya no se define aquí, viene de @/type/nne

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
  attended_where: number | null
  usuarios: number[]
}

// =====================================================
// FUNCIÓN DE TRANSFORMACIÓN CRÍTICA
// =====================================================

const transformToBackendFormat = (frontendData: NneFormData): BackendNneData => {
  console.log('📄 Transformando datos frontend -> backend (Normalizado):', frontendData)
  
  return {
    first_name: frontendData.first_name,
    last_name: frontendData.last_name,
    rut: frontendData.rut,
    birth_date: frontendData.birth_date,
    gender: frontendData.gender,
    
    establishment: Number(frontendData.establishment) || 0,
    region: Number(frontendData.region) || 0,
    commune: Number(frontendData.commune) || 0,
    street: frontendData.street || '',
    street_number: frontendData.street_number || '',
    
    current_grade: frontendData.current_grade,
    school_journey: frontendData.school_journey,
    adaptation_notes: frontendData.school_adaptation_notes || '', 
    
    has_special_needs: frontendData.special_needs, 
    special_needs_type: frontendData.special_needs_type || 'none',
    autism_level: frontendData.autism_level_value || 'no_review', 
    
    pie_diagnosis: frontendData.pie_diagnosis || '',
    pie_entry_date: frontendData.pie_entry_date || null,
    pie_status: frontendData.pie_status || 'none',
    
    allergies: frontendData.allergies || 'Ninguna',
    current_medication: frontendData.current_medication || 'Ninguna',
    emergency_contact: frontendData.emergency_contact || '',
    emergency_phone: frontendData.emergency_phone || '',
    medical_notes: frontendData.medical_notes || '',
    
    guardian_consent: frontendData.guardian_consent,
    consent_date: frontendData.consent_date || new Date().toISOString().split('T')[0],
    
    has_previous_therapies: frontendData.previous_therapies, 
    therapies_detail: frontendData.previous_therapies_detail || '', 
    referred_by: frontendData.referred_by || '',
    referred_by_detail: frontendData.referred_by_detail || '',
    attended_where: frontendData.attended_where ? Number(frontendData.attended_where) : null,
    
    usuarios: Array.isArray(frontendData.usuarios) ? frontendData.usuarios.map(Number) : []
  }
}

// =====================================================
// ESTABLECIMIENTOS EDUCATIVOS
// =====================================================

export const getEstablishmentTypesApi = async (): Promise<EstablishmentType[]> => {
  try {
    const response = await http.get('/establishments/establishment-types/')
    return Array.isArray(response.data) ? response.data : []
  } catch (error: any) {
    throw parseApiError(error)
  }
}

/**
 * ✅ Retorna SelectOption[] para selects
 */
export const searchEducationalEstablishmentsApi = async (query: string): Promise<SelectOption[]> => {
  try {
    if (!query || query.length < 2) return []
    const response = await http.get('/establishments/establishments/search/', {
      params: { search: query }
    })
    
    const establishmentsData = response.data.results || (Array.isArray(response.data) ? response.data : [])
    
    return establishmentsData
      .filter((est: Establishment) => est.rbd && est.rbd.trim() !== '')
      .map((est: Establishment) => ({
        value: est.id,
        label: `${est.name} ${est.rbd ? `(RBD: ${est.rbd})` : ''} - ${est.commune_detail?.name || 'Sin comuna'}`
      }))
  } catch (error: any) {
    console.error('❌ Error en búsqueda de establecimientos:', error)
    throw parseApiError(error)
  }
}

/**
 * ✅ Retorna SelectOption[] para selects
 */
export const getAllEducationalEstablishmentsApi = async (): Promise<SelectOption[]> => {
  try {
    const response = await http.get('/establishments/establishments/')
    const establishmentsData = Array.isArray(response.data) ? response.data : []
    
    return establishmentsData
      .filter((est: Establishment) => est.rbd && est.rbd.trim() !== '')
      .map((est: Establishment) => ({
        value: est.id,
        label: `${est.name} ${est.rbd ? `(RBD: ${est.rbd})` : ''} - ${est.commune_detail?.name || 'Sin comuna'}`
      }))
  } catch (error: any) {
    throw parseApiError(error)
  }
}

/**
 * ✅ Búsqueda que retorna objetos completos
 */
export const searchEstablishmentsFullApi = async (query: string): Promise<Establishment[]> => {
  try {
    if (!query || query.length < 2) return []
    const response = await http.get('/establishments/establishments/search/', {
      params: { search: query }
    })
    
    const establishmentsData = response.data.results || (Array.isArray(response.data) ? response.data : [])
    return establishmentsData
  } catch (error: any) {
    console.error('❌ Error en búsqueda de establecimientos:', error)
    throw parseApiError(error)
  }
}

/**
 * ✅ Obtener detalle de establecimiento
 */
export const getEstablishmentDetailApi = async (establishmentId: number): Promise<Establishment> => {
  try {
    const response = await http.get(`/establishments/establishments/${establishmentId}/`)
    return response.data
  } catch (error: any) {
    throw parseApiError(error)
  }
}

/**
 * 🆕 CREAR NUEVO ESTABLECIMIENTO
 * ✅ IMPLEMENTACIÓN REAL (NO STUB)
 */
export const createEstablishmentApi = async (data: {
  name: string
  establishment_type: number
  rbd?: string
  address: string
  street_number?: string
  region: number
  commune: number
  phone?: string
  email?: string
}): Promise<Establishment> => {
  try {
    console.log('📤 [createEstablishmentApi] Enviando datos:', data)
    const response = await http.post('/establishments/establishments/', data)
    console.log('✅ [createEstablishmentApi] Respuesta:', response.data)
    return response.data
  } catch (error: any) {
    console.error('❌ [createEstablishmentApi] Error:', error)
    throw parseApiError(error)
  }
}

/**
 * 🆕 ACTUALIZAR ESTABLECIMIENTO
 */
export const updateEstablishmentApi = async (
  establishmentId: number,
  data: Partial<{
    name: string
    establishment_type: number
    rbd: string
    address: string
    street_number: string
    region: number
    commune: number
    phone: string
    email: string
  }>
): Promise<Establishment> => {
  try {
    const response = await http.patch(
      `/establishments/establishments/${establishmentId}/`,
      data
    )
    return response.data
  } catch (error: any) {
    console.error('❌ Error actualizando establecimiento:', error)
    throw parseApiError(error)
  }
}

// =====================================================
// PADRES / TUTORES
// =====================================================

export const searchParentsApi = async (query: string): Promise<ParentUser[]> => {
  try {
    const response = await http.get('/user/padres/buscar/', { params: { q: query } })
    const resultsArray = response.data.results || response.data
    
    return resultsArray.map((parent: any) => ({
      id: parent.id,
      username: parent.username || parent.email?.split('@')[0],
      email: parent.email,
      first_name: parent.first_name || '',
      last_name: parent.last_name || '',
      rut: parent.rut,
      phone: parent.phone || null,
      role: parent.role || 'Padres'
    }))
  } catch (error: any) {
    throw parseApiError(error)
  }
}

export const getParentsListApi = async (page = 1, pageSize = 5, search = ''): Promise<any> => {
  const response = await http.get('/user/padres/listar/', {
    params: { page, page_size: pageSize, search: search || undefined }
  })
  return response.data
}

/**
 * ✅ Crear padre/tutor
 */
export const createParentApi = async (parentData: ParentUserCreate): Promise<ParentUser> => {
  try {
    const response = await http.post('/user/padres/crear/', { ...parentData, role: 'Padres' })
    const res = response.data.data || response.data
    return { 
      ...res, 
      role: 'Padres' 
    }
  } catch (error: any) {
    throw parseApiError(error)
  }
}

export const getParentByIdApi = async (parentId: number): Promise<ParentUser> => {
  const response = await http.get(`/user/padres/${parentId}/`)
  return response.data
}

// =====================================================
// NNE (NIÑOS) Y VALIDACIONES
// =====================================================

export const validateChildRutApi = async (rut: string): Promise<{
  isValid: boolean;
  isAvailable: boolean;
  message?: string;
}> => {
  try {
    const response = await http.get('/user/check-rut/', { params: { rut } });
    
    return {
      isValid: response.data.status === 'success',
      isAvailable: response.data.available,
      message: response.data.message
    };
  } catch (error: any) {
    console.error('❌ Error validando RUT:', error);
    return {
      isValid: false,
      isAvailable: false,
      message: 'Error de validación o RUT duplicado'
    };
  }
}

export const createNneApi = async (nneData: NneFormData): Promise<any> => {
  try {
    const backendData = transformToBackendFormat(nneData)
    const response = await http.post('/ingreso/crear/', backendData)
    return response.data
  } catch (error: any) {
    throw parseApiError(error)
  }
}

// =====================================================
// GEOGRAFÍA
// =====================================================

/**
 * ✅ Retorna SelectOption[] directamente
 */
export const getRegionsApi = async (): Promise<SelectOption[]> => {
  try {
    const response = await http.get('/geolocalization/regions/')
    const regionsData: Region[] = Array.isArray(response.data) ? response.data : (response.data.results || [])
    
    return regionsData.map((region: Region) => ({
      value: region.id,
      label: region.name
    }))
  } catch (error) {
    console.error('❌ Error cargando regiones:', error)
    return []
  }
}

/**
 * ✅ Retorna SelectOption[] directamente
 */
export const getCommunesByRegionApi = async (regionId: number): Promise<SelectOption[]> => {
  try {
    const response = await http.get('/geolocalization/communes/by_region/', {
      params: { region_id: regionId }
    })
    
    const communesData: Commune[] = Array.isArray(response.data) ? response.data : []
    
    return communesData.map((commune: Commune) => ({
      value: commune.id,
      label: commune.name
    }))
  } catch (error) {
    console.error('❌ Error cargando comunas:', error)
    return []
  }
}

// =====================================================
// EXPORT DEFAULT
// =====================================================

export default {
  getEstablishmentTypesApi,
  searchEducationalEstablishmentsApi,
  getAllEducationalEstablishmentsApi,
  searchEstablishmentsFullApi,
  getEstablishmentDetailApi,
  createEstablishmentApi,      // ✅ EXPORTADO
  updateEstablishmentApi,      // ✅ EXPORTADO
  searchParentsApi,
  getParentsListApi,
  createParentApi,
  getParentByIdApi,
  validateChildRutApi,
  createNneApi,
  getRegionsApi,
  getCommunesByRegionApi,
  transformToBackendFormat
}