import { defineStore } from 'pinia'
// (Opcional) Importa tu servicio real para cargar datos del niño
// import { getChildProfile } from '@/services/childService' 

// Define la interfaz de los datos del niño.
// Deberías ajustar esto a tu modelo de datos real.
export interface NinoProfile {
  id: string
  fullName: string
  rut: string
  birthDate: string
  // ... otros datos del perfil
}

// Define el estado inicial
interface State {
  perfil: NinoProfile | null
  isLoading: boolean
  error: string | null
}

/**
 * Store de Pinia para gestionar el estado del perfil del niño
 * que está actualmente activo (siendo visto) en la aplicación.
 */
export const useNinoActivoStore = defineStore('ninoActivo', {
  
  // 1. ESTADO (State)
  // Define la forma inicial de tus datos
  state: (): State => ({
    perfil: null,
    isLoading: false,
    error: null,
  }),

  // 2. GETTERS (Propiedades computadas)
  // Permiten acceder a datos derivados del estado.
  getters: {
    /**
     * Devuelve el nombre completo del niño activo.
     * Ideal para usar en Breadcrumbs o Títulos.
     */
    nombreNino: (state): string => {
      return state.perfil?.fullName || 'Cargando...'
    },

    /**
     * Devuelve el ID del niño activo.
     */
    ninoId: (state): string | null => {
      return state.perfil?.id || null
    },

    /**
     * Indica si hay un perfil cargado.
     */
    hasData: (state): boolean => {
      return !!state.perfil
    },
  },

  // 3. ACCIONES (Métodos)
  // Aquí es donde modificas el estado.
  actions: {
    
    /**
     * Carga el perfil de un niño por su ID.
     * Esta acción debe ser llamada desde el layout (PerfilNinoLayout.vue)
     * cuando el componente se monta (onMounted).
     * * @param childId El ID del niño a cargar.
     */
    async fetchNinoActivo(childId: string) {
      // Si ya estamos cargando o ya tenemos a este niño, no hacemos nada.
      if (this.isLoading || this.perfil?.id === childId) {
        return
      }

      // Reiniciamos el estado
      this.isLoading = true
      this.perfil = null
      this.error = null

      try {
        // --- USA TU SERVICIO REAL AQUÍ ---
        // const datosNino = await getChildProfile(childId)
        
        // --- INICIO: Datos de MOCK (simulación) ---
        // (Reemplaza esta promesa con tu llamada real a la API)
        const datosNino: NinoProfile = await new Promise(resolve => 
          setTimeout(() => {
            resolve({
              id: childId,
              fullName: `Martina González (ID: ${childId})`,
              rut: '25.123.456-K',
              birthDate: '2018-05-10'
            })
          }, 800) // Simula 0.8s de carga
        )
        // --- FIN: Datos de MOCK ---

        this.perfil = datosNino

      } catch (err) {
        console.error('Error al cargar perfil del niño:', err)
        this.error = 'No se pudo cargar la información del niño.'
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Limpia los datos del niño activo.
     * Es buena práctica llamar a esto cuando el usuario
     * abandona la sección del perfil (onUnmounted).
     */
    limpiarNinoActivo() {
      this.perfil = null
      this.isLoading = false
      this.error = null
    },

    /**
     * (Opcional) Acción simple que usaste en el plan original
     * solo para actualizar el nombre en el breadcrumb.
     * Es MEJOR usar fetchNinoActivo y el getter 'nombreNino'.
     */
    // setCurrentChildName(name: string) {
    //   if (this.perfil) {
    //     this.perfil.fullName = name
    //   } else {
    //     // Esto es un parche si solo quieres el nombre rápido
    //     this.perfil = { id: '', fullName: name, rut: '', birthDate: '' }
    //   }
    // }
  },
})