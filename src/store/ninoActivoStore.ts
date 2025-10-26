import { defineStore } from 'pinia';
// 👇 *** 1. IMPORTA TU SERVICIO REAL *** 👇
import { profileService } from '@/services/profileService'; // Asegúrate que la ruta sea correcta

// 👇 *** 2. DEFINE UNA INTERFAZ MÁS COMPLETA *** 👇
//    (Basada en la estructura que DEVUELVE profileService.transformCompleteData)
//    Ajusta esto según la estructura EXACTA de tu transformCompleteData
interface TransformedProfileData {
  header: {
    first_name: string;
    last_name: string;
    rut: string;
    age: number;
    grade: string;
    autism_level: string;
  };
  cards: {
    personal: {
      full_name: string;
      rut: string;
      birth_date: string; // Ya formateada por el service
      age: number;
      gender: string; // Ya formateado
      created_at: string; // Ya formateado
    };
    special_needs: any; // Define más si es necesario
    pie: any;
    medical: any;
    school: any;
    guardian: any;
    therapy: any;
    location: any;
  };
  emergencyContacts: any[];
}

// Interfaz principal del perfil en el store (Incluye el ID)
export interface NinoProfile extends TransformedProfileData {
  id: string; // Añadimos el ID aquí
}


// Define el estado inicial
interface State {
  perfil: NinoProfile | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Store de Pinia para gestionar el estado del perfil del niño
 * que está actualmente activo (siendo visto) en la aplicación.
 */
export const useNinoActivoStore = defineStore('ninoActivo', {

  // 1. ESTADO (State)
  state: (): State => ({
    perfil: null,
    isLoading: false,
    error: null,
  }),

  // 2. GETTERS (Propiedades computadas)
  getters: {
    /**
     * Devuelve el nombre completo del niño activo.
     */
    nombreNino: (state): string => {
      // Accede a la estructura transformada
      return state.perfil?.cards?.personal?.full_name || 'Cargando...';
    },

    /**
     * Devuelve el ID del niño activo.
     */
    ninoId: (state): string | null => {
      // El ID ahora está en el nivel superior del perfil
      return state.perfil?.id || null;
    },

    /**
     * Indica si hay un perfil cargado.
     */
    hasData: (state): boolean => {
      return !!state.perfil;
    },

    // Puedes añadir más getters para acceder a otros datos si los necesitas
    // Ejemplo:
    // edadNino: (state): number | string => {
    //   return state.perfil?.header?.age ?? 'N/A';
    // },
    // rutNino: (state): string => {
    //    return state.perfil?.cards?.personal?.rut ?? 'N/A';
    // }
  },

  // 3. ACCIONES (Métodos)
  actions: {

    /**
     * Carga el perfil de un niño por su ID usando el profileService.
     */
    async fetchNinoActivo(childId: string) {
      // Evita recargas innecesarias
      if (this.isLoading || (this.perfil && this.perfil.id === childId)) {
        console.log(`fetchNinoActivo: Skipping fetch for ${childId} (already loading or loaded)`);
        return;
      }

      console.log(`🚀 fetchNinoActivo: Iniciando carga para niño ID: ${childId}`);
      this.isLoading = true;
      this.perfil = null;
      this.error = null;

      try {
        // --- 👇 *** 3. USA TU SERVICIO REAL AQUÍ *** 👇 ---
        // Llama a getChildProfile que ya transforma los datos
        const transformedData = await profileService.getChildProfile(childId);
        console.log('✅ Datos transformados recibidos del service:', transformedData);

        // --- ❌ ELIMINA O COMENTA EL BLOQUE MOCK ---
        /*
        const datosNinoMock: NinoProfile = await new Promise(resolve =>
          setTimeout(() => { ... }, 800)
        )
        */

        // Asigna los datos transformados al estado, añadiendo el ID explícitamente
        // ya que la función transform no lo incluye en la raíz
        this.perfil = {
          id: childId, // Añade el ID
          ...transformedData // El resto de los datos transformados
        };
        console.log('✅ Perfil actualizado en el store:', this.perfil);

      } catch (err: any) {
        console.error(`❌ Error en fetchNinoActivo para ID ${childId}:`, err);
        // Intenta obtener un mensaje de error más específico si es posible
        this.error = err.message || 'No se pudo cargar la información del niño.';
        // Podrías añadir lógica para errores específicos (ej. 404 Not Found)
        // if (err.response?.status === 404) {
        //   this.error = `No se encontró el perfil para el niño con ID ${childId}.`;
        // }
      } finally {
        this.isLoading = false;
        console.log(`🏁 fetchNinoActivo: Carga finalizada para niño ID: ${childId}`);
      }
    },

    /**
     * Limpia los datos del niño activo.
     */
    limpiarNinoActivo() {
      console.log('🧹 Limpiando datos del niño activo en el store.');
      this.perfil = null;
      this.isLoading = false;
      this.error = null;
    },
  },
})