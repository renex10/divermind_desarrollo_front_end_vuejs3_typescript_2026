// src/composables/useNneFacade.ts
// -------------------------------------------------------------
// Este composable actúa como un "Facade" (fachada).
// Es decir, expone una interfaz simple y clara para que los
// componentes Vue trabajen con NNE (niños/estudiantes) y Padres,
// ocultando la complejidad de los servicios internos (Axios, rutas, etc).
//
// Flujo general:
//   Componente Vue -> useNneFacade -> nneService.ts (Axios) -> Backend DRF -> BD
//
// Ventajas:
// - Los componentes no necesitan saber cómo se llaman los endpoints.
// - Si mañana cambias Axios por otra librería, o cambias las rutas,
//   solo modificas los servicios internos, no todos los componentes.
// - Mantienes el frontend más limpio, desacoplado y fácil de mantener.
// -------------------------------------------------------------

import { ref } from 'vue'
import {
  createNneApi,
  createParentApi,
  searchParentsApi
} from '../services/nneService.ts'
import type { NneFormData, ParentUser } from '../type/nne.ts'

export function useNneFacade() {
  // Estado reactivo para manejar resultados y loading
  const parents = ref<ParentUser[]>([])
  const isLoading = ref(false)

  // -----------------------------------------------------------
  // Crear un nuevo NEE (niño/estudiante)
  // -----------------------------------------------------------
  const createNne = async (form: NneFormData) => {
    isLoading.value = true
    try {
      // Delegamos la llamada al servicio especializado
      const nne = await createNneApi(form)
      return nne
    } finally {
      isLoading.value = false
    }
  }

  // -----------------------------------------------------------
  // Crear un nuevo padre/tutor
  // -----------------------------------------------------------
  const createParent = async (parent: Omit<ParentUser, 'id'>) => {
    isLoading.value = true
    try {
      const newParent = await createParentApi(parent)
      return newParent
    } finally {
      isLoading.value = false
    }
  }

  // -----------------------------------------------------------
  // Buscar padres por nombre, rut o email
  // -----------------------------------------------------------
  const searchParents = async (q: string) => {
    isLoading.value = true
    try {
      parents.value = await searchParentsApi(q)
    } finally {
      isLoading.value = false
    }
  }

  // -----------------------------------------------------------
  // Retornamos la interfaz simplificada (la fachada)
  // -----------------------------------------------------------
  return {
    // Estado
    parents,
    isLoading,

    // Acciones
    createNne,
    createParent,
    searchParents
  }
}