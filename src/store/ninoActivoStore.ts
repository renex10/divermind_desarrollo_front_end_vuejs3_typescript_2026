import { defineStore } from 'pinia'
import { profileService } from '@/services/profileService'
import Swal from 'sweetalert2'

// =============================================================================
// INTERFACES
// =============================================================================

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

export interface NinoProfile extends TransformedProfileData {
  id: number
}

interface State {
  perfil: NinoProfile | null
  isLoading: boolean
  error: string | null
}

const STORAGE_KEY = 'nino_activo_id'

// =============================================================================
// STORE
// =============================================================================

export const useNinoActivoStore = defineStore('ninoActivo', {
  state: (): State => ({
    perfil: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    ninoActivoId: (state): number | null => state.perfil?.id || null,
    ninoActivoNombre: (state): string => state.perfil?.header?.first_name || '',
    nombreCompleto: (state): string => state.perfil?.cards?.personal?.full_name || 'Sin nombre',
    hasData: (state): boolean => !!state.perfil,
    isLoadingData: (state): boolean => state.isLoading,
    errorMessage: (state): string | null => state.error
  },

  actions: {
    /**
     * Inicializa el niño activo desde localStorage al cargar la app
     */
    async initializeFromStorage() {
      const storedId = localStorage.getItem(STORAGE_KEY)
      if (!storedId) return

      const childId = parseInt(storedId)
      if (isNaN(childId)) {
        this.clearNinoActivo()
        return
      }

      try {
        await this.fetchNinoActivo(childId, true)
      } catch (error: any) {
        console.error('❌ Error inicializando desde storage:', error)
      }
    },

    /**
     * Acción principal para obtener datos de la API
     */
    async fetchNinoActivo(childId: number, fromLocalStorage: boolean = false) {
      if (this.isLoading) return
      
      this.isLoading = true
      this.error = null

      try {
        const transformedData = await profileService.getChildProfile(childId.toString())
        
        // Al asignar esto, se dispara la reactividad en toda la app
        this.perfil = {
          id: childId,
          ...transformedData
        }

        localStorage.setItem(STORAGE_KEY, childId.toString())
      } catch (err: any) {
        this.handleError(err, fromLocalStorage)
        throw err
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Establece un nuevo niño activo (Usado por el Navbar)
     */
    async setNinoActivo(childId: number) {
      // Limpiamos perfil actual para que los componentes muestren estado de carga
      this.perfil = null 
      await this.fetchNinoActivo(childId, false)
    },

    clearNinoActivo() {
      this.perfil = null
      this.error = null
      localStorage.removeItem(STORAGE_KEY)
    },

    handleError(err: any, fromLocalStorage: boolean) {
      const status = err.response?.status
      if (status === 403) {
        this.error = 'No tienes permisos para este perfil'
        if (fromLocalStorage) this.clearNinoActivo()
        this.handleAccessDenied()
      } else if (status === 404) {
        this.error = 'Niño no encontrado'
        if (fromLocalStorage) this.clearNinoActivo()
        this.handleNotFound()
      } else {
        this.error = 'Error de conexión con el servidor'
      }
    },

    handleAccessDenied() {
      Swal.fire({
        icon: 'warning',
        title: 'Acceso Denegado',
        text: 'No tienes permisos para ver este perfil.',
        confirmButtonText: 'Ir al inicio'
      }).then(() => { window.location.href = '/parent' })
    },

    handleNotFound() {
      Swal.fire({
        icon: 'error',
        title: 'No Encontrado',
        text: 'El perfil solicitado no existe.',
        confirmButtonText: 'Ir al inicio'
      }).then(() => { window.location.href = '/parent' })
    }
  }
})