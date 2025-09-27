
import type { NneFormData, ParentUser } from '../type/nne.ts'
import http from './http.ts'

// Crear un nuevo NEE
export async function createNneApi(payload: NneFormData) {
  const { data } = await http.post('/ingreso/crear/', payload)
  return data
}

// Crear un nuevo padre/tutor
export async function createParentApi(payload: Omit<ParentUser, 'id'>) {
  const { data } = await http.post('/user/padres/crear/', payload)
  return data as ParentUser
}

// Buscar padres por query (nombre, rut, etc.)
export async function searchParentsApi(query: string) {
  const { data } = await http.get('/user/padres/buscar/', {
    params: { q: query }
  })
  return data as ParentUser[]
}