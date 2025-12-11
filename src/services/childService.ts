// src/services/childService.ts

import http from '@/services/http'

export interface ChildInfo {
  id: number
  nombre_completo: string
  first_name: string
  last_name: string
  fecha_nacimiento: string | null
  edad: number | null
  has_photo: boolean
  photo_url: string | null
}

export interface ParentChildrenResponse {
  count: number
  children: ChildInfo[]
}

export const childService = {
  /**
   * Obtener hijos del padre logueado
   * GET /api/core/parent/children/
   */
  async getMyChildren(): Promise<ParentChildrenResponse> {
    try {
      console.log('[childService] 🔍 Obteniendo hijos del padre...')
      
      const response = await http.get<ParentChildrenResponse>('/core/parent/children/')
      
      console.log('[childService] ✅ Hijos obtenidos:', {
        count: response.data.count,
        children: response.data.children.map(c => `${c.id}: ${c.nombre_completo}`)
      })
      
      return response.data
    } catch (error: any) {
      console.error('[childService] ❌ Error obteniendo hijos:', error)
      throw new Error(error?.response?.data?.detail || 'Error al obtener hijos')
    }
  }
}

export default childService