// src/store/ninoActivoStore.ts
// ✅ Store de Pinia para gestionar el perfil del niño activo con validación de permisos

import { defineStore } from 'pinia'
import { profileService } from '@/services/profileService'
import Swal from 'sweetalert2'

// =============================================================================
// INTERFACES
// =============================================================================

/**
 * Estructura completa del perfil transformado por profileService
 */
interface TransformedProfileData {
  header: {
    first_name: string
    last_name: string
    rut: string
    age: number
    grade: string
    autism_level: string
  }
  cards: {
    personal: {
      full_name: string
      rut: string
      birth_date: string
      age: number
      gender: string
      created_at: string
    }
    special_needs: any
    pie: any
    medical: any
    school: any
    guardian: any
    therapy: any
    location: any
  }
  emergencyContacts: any[]
}

/**
 * Perfil completo del niño incluyendo su ID
 */
export interface NinoProfile extends TransformedProfileData {
  id: number
}

/**
 * Estado del store
 */
interface State {
  perfil: NinoProfile | null
  isLoading: boolean
  error: string | null
}

// =============================================================================
// CONSTANTES
// =============================================================================

const STORAGE_KEY = 'nino_activo_id'

// =============================================================================
// STORE
// =============================================================================

export const useNinoActivoStore = defineStore('ninoActivo', {

  // --- ESTADO ---
  state: (): State => ({
    perfil: null,
    isLoading: false,
    error: null,
  }),

  // --- GETTERS ---
  getters: {
    /**
     * ID del niño activo
     */
    ninoActivoId: (state): number | null => {
      return state.perfil?.id || null
    },

    /**
     * Nombre completo del niño
     */
    ninoActivoNombre: (state): string => {
      return state.perfil?.header?.first_name || ''
    },

    /**
     * Apellido del niño
     */
    ninoActivoApellido: (state): string => {
      return state.perfil?.header?.last_name || ''
    },

    /**
     * Nombre completo (nombre + apellido)
     */
    nombreCompleto: (state): string => {
      return state.perfil?.cards?.personal?.full_name || 'Sin nombre'
    },

    /**
     * RUT del niño
     */
    rutNino: (state): string => {
      return state.perfil?.cards?.personal?.rut || ''
    },

    /**
     * Edad del niño
     */
    edadNino: (state): number | null => {
      return state.perfil?.header?.age || null
    },

    /**
     * Nivel de autismo
     */
    nivelAutismo: (state): string => {
      return state.perfil?.header?.autism_level || ''
    },

    /**
     * Indica si hay datos cargados
     */
    hasData: (state): boolean => {
      return !!state.perfil
    },

    /**
     * Indica si está cargando
     */
    isLoadingData: (state): boolean => {
      return state.isLoading
    },

    /**
     * Mensaje de error si existe
     */
    errorMessage: (state): string | null => {
      return state.error
    }
  },

  // --- ACCIONES ---
  actions: {
    /**
     * Inicializa el niño activo desde localStorage
     * Valida que el niño exista y el usuario tenga acceso
     */
    async initializeFromStorage() {
      const storedId = localStorage.getItem(STORAGE_KEY)
      
      if (!storedId) {
        console.log('ℹ️ No hay niño activo guardado en localStorage')
        return
      }

      const childId = parseInt(storedId)
      
      if (isNaN(childId)) {
        console.warn('⚠️ ID guardado no es válido, limpiando...')
        this.clearNinoActivo()
        return
      }

      console.log('🔄 Intentando cargar niño ID:', childId, 'desde localStorage')

      try {
        await this.fetchNinoActivo(childId)
      } catch (error: any) {
        const status = error.response?.status
        
        if (status === 403) {
          console.warn('⚠️ Error 403: No tienes permisos para acceder a este niño')
          this.handleAccessDenied()
        } else if (status === 404) {
          console.warn('⚠️ Error 404: El niño no existe en la base de datos')
          this.handleNotFound()
        } else {
          console.error('❌ Error desconocido al cargar niño:', error)
        }
      }
    },

    /**
     * Carga el perfil completo de un niño por su ID
     * @param childId - ID del niño a cargar
     */
    async fetchNinoActivo(childId: number) {
      // Evitar recargas innecesarias
      if (this.isLoading) {
        console.log('⏳ Ya hay una carga en progreso, esperando...')
        return
      }

      if (this.perfil && this.perfil.id === childId) {
        console.log(`✅ Niño ID ${childId} ya está cargado`)
        return
      }

      console.log(`🚀 fetchNinoActivo: Iniciando carga para niño ID: ${childId}`)
      
      this.isLoading = true
      this.error = null

      try {
        // Llamar al servicio para obtener datos transformados
        const transformedData = await profileService.getChildProfile(childId.toString())
        
        console.log('✅ Datos transformados recibidos del servicio')

        // Asignar datos al estado, incluyendo el ID
        this.perfil = {
          id: childId,
          ...transformedData
        }

        // Guardar en localStorage solo si la carga fue exitosa
        localStorage.setItem(STORAGE_KEY, childId.toString())
        
        console.log('✅ Perfil del niño actualizado en el store:', {
          id: this.perfil.id,
          nombre: this.nombreCompleto
        })

      } catch (err: any) {
        console.error(`❌ Error en fetchNinoActivo para ID ${childId}:`, err)
        
        const status = err.response?.status
        
        // Manejo específico de errores
        if (status === 403) {
          this.error = 'No tienes permisos para acceder a este perfil'
          this.clearNinoActivo()
          throw err // Re-lanzar para que initializeFromStorage pueda manejarlo
        } else if (status === 404) {
          this.error = 'El perfil del niño no fue encontrado'
          this.clearNinoActivo()
          throw err
        } else if (status === 401) {
          this.error = 'Tu sesión ha expirado, por favor inicia sesión nuevamente'
        } else {
          this.error = err.message || 'No se pudo cargar la información del niño'
        }

        // Limpiar perfil en caso de error
        this.perfil = null

        throw err

      } finally {
        this.isLoading = false
        console.log(`🏁 fetchNinoActivo: Carga finalizada para niño ID: ${childId}`)
      }
    },

    /**
     * Establece un niño como activo de forma manual
     * @param childId - ID del niño
     */
    async setNinoActivo(childId: number) {
      console.log(`📌 Estableciendo niño activo: ID ${childId}`)
      
      try {
        // Cargar el perfil completo
        await this.fetchNinoActivo(childId)
        
        console.log('✅ Niño activo establecido correctamente')
      } catch (error) {
        console.error('❌ Error al establecer niño activo:', error)
        throw error
      }
    },

    /**
     * Limpia los datos del niño activo del store y localStorage
     */
    clearNinoActivo() {
      console.log('🗑️ Limpiando datos del niño activo')
      
      this.perfil = null
      this.isLoading = false
      this.error = null
      
      localStorage.removeItem(STORAGE_KEY)
      
      console.log('✅ Datos del niño activo limpiados')
    },

    /**
     * Maneja el caso de acceso denegado (403)
     */
    handleAccessDenied() {
      this.clearNinoActivo()
      
      Swal.fire({
        icon: 'warning',
        title: 'Acceso Denegado',
        html: `
          <p>No tienes permisos para ver este perfil.</p>
          <p class="text-sm text-gray-600 mt-2">Por favor, selecciona uno de tus hijos desde el inicio.</p>
        `,
        confirmButtonText: 'Ir al inicio',
        confirmButtonColor: '#3b82f6',
        allowOutsideClick: false
      }).then(() => {
        // Redirigir al dashboard de padres
        window.location.href = '/parent'
      })
    },

    /**
     * Maneja el caso de niño no encontrado (404)
     */
    handleNotFound() {
      this.clearNinoActivo()
      
      Swal.fire({
        icon: 'error',
        title: 'Niño No Encontrado',
        html: `
          <p>El perfil que intentas acceder no existe.</p>
          <p class="text-sm text-gray-600 mt-2">Por favor, selecciona un niño válido.</p>
        `,
        confirmButtonText: 'Ir al inicio',
        confirmButtonColor: '#3b82f6',
        allowOutsideClick: false
      }).then(() => {
        window.location.href = '/parent'
      })
    },

    /**
     * Recarga el perfil del niño activo
     */
    async reloadProfile() {
      if (!this.ninoActivoId) {
        console.warn('⚠️ No hay niño activo para recargar')
        return
      }

      console.log('🔄 Recargando perfil del niño activo...')
      
      // Forzar recarga limpiando el perfil actual
      const currentId = this.ninoActivoId
      this.perfil = null
      
      try {
        await this.fetchNinoActivo(currentId)
        console.log('✅ Perfil recargado exitosamente')
      } catch (error) {
        console.error('❌ Error al recargar perfil:', error)
        throw error
      }
    }
  }
})