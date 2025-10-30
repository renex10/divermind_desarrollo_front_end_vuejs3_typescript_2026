// src/store/rutinas/routineWizardStore.ts

import { defineStore } from 'pinia'
import { routinesApi } from '@/services/rutinas/routinesApi'
// Importa useRoutinesStore para añadir la rutina al final
import { useRoutinesStore } from './routinesStore'
// Importa los tipos necesarios desde el archivo centralizado
// Ya no necesitamos importar WizardBasicInfo, etc. aquí si las definimos y exportamos localmente
import type { DailyRoutineList } from '@/type/rutinas/rutinas' // Asegúrate que la ruta sea correcta

// =============================================================================
// INTERFACES (Definidas y Exportadas Localmente)
// =============================================================================

// --- Paso 1: Información Básica ---
export interface WizardBasicInfo { // <-- EXPORT AÑADIDO
  name: string
  routine_type: string | null
  description: string
  status: 'draft' | 'active'
}

// --- Paso 2: Horarios ---
export interface WizardSchedule { // <-- EXPORT AÑADIDO
  start_time: string
  estimated_duration_minutes: number | null
  days_of_week: string[]
}

// --- Paso 3: Pasos ---
export interface WizardStep {
  id?: number | string  // ✅ AGREGAR ESTA LÍNEA
  action: string
  description: string
  estimated_minutes: number | null
  visual_support: string
  requires_supervision: boolean
  is_skippable: boolean
}

// --- Paso 4: Estrategias (Individual) ---
export interface WizardStrategy { // <-- EXPORT AÑADIDO
  id?: number | string  // ✅ OPCIONAL - se asigna dinámicamente
  strategy_type: string
  description: string
  related_step_order: number | null
}

// --- Paso 4: Estrategias (Configuración General) ---
export interface WizardStrategies { // <-- EXPORT AÑADIDO
  flexibility_level: 'low' | 'medium' | 'high' | null
  change_tolerance_notes: string
  needs_advance_warning: boolean
  warning_time_minutes: number | null
  warning_method: string | null
  transition_strategies: string
  calming_strategies: string
  visual_supports_needed: boolean
  visual_support_type: string | null
}

// --- Estado Principal del Store ---
export interface RoutineWizardState { // <-- EXPORT AÑADIDO
  childId: number | null
  basicInfo: WizardBasicInfo
  schedules: WizardSchedule[]
  steps: WizardStep[]
  strategies: WizardStrategy[] // Array de estrategias individuales
  strategiesConfig: WizardStrategies // Configuración general de estrategias
  isLoading: boolean
  error: string | null
}

// =============================================================================
// VALORES POR DEFECTO
// =============================================================================

// Función para obtener el estado inicial de basicInfo
const getDefaultBasicInfo = (): WizardBasicInfo => ({
  name: '',
  routine_type: null,
  description: '', // Asegúrate que coincida con el tipo (string, no undefined)
  status: 'draft',
})

// Función para obtener el estado inicial de strategiesConfig
const getDefaultStrategiesConfig = (): WizardStrategies => ({
  flexibility_level: 'medium',
  change_tolerance_notes: '',
  needs_advance_warning: false,
  warning_time_minutes: 5,
  warning_method: null,
  transition_strategies: '',
  calming_strategies: '',
  visual_supports_needed: false,
  visual_support_type: null,
})

// =============================================================================
// DEFINICIÓN DEL STORE
// =============================================================================

export const useRoutineWizardStore = defineStore('routineWizard', {

  state: (): RoutineWizardState => ({
    childId: null,
    basicInfo: getDefaultBasicInfo(),
    schedules: [],
    steps: [],
    strategies: [], // Array vacío para estrategias individuales
    strategiesConfig: getDefaultStrategiesConfig(), // Configuración general
    isLoading: false,
    error: null,
  }),

  getters: {
    /**
     * Valida si el Paso 1 (Información Básica) está completo.
     */
    isStep1Valid: (state): boolean => {
      return !!state.basicInfo.name &&
             state.basicInfo.name.length >= 4 && // Ajustado a validación FormKit
             !!state.basicInfo.routine_type
    },

    /**
     * Valida si el Paso 2 (Horarios) está completo.
     * Es válido incluso sin horarios.
     */
    isStep2Valid: (): boolean => {
      // Podrías añadir validación más compleja si los horarios fueran obligatorios
      // o si hubiera reglas entre ellos.
      return true
    },

    /**
     * Valida si el Paso 3 (Pasos) está completo.
     * Requiere al menos un paso con una acción definida.
     */
    isStep3Valid: (state): boolean => {
      return state.steps.length > 0 &&
             state.steps.every(step => !!step.action && step.action.trim().length > 0)
    },

    /**
     * Valida si el Paso 4 (Estrategias) está completo.
     * Por ahora, se considera siempre válido.
     */
    isStep4Valid: (): boolean => {
      // Podrías añadir validación si ciertos campos de strategiesConfig
      // fueran obligatorios basados en otras selecciones.
      return true
    },
  },

  actions: {
    /**
     * Inicializa el store con el ID del niño y resetea los datos.
     */
    initialize(childId: number) {
      this.reset() // Limpia datos previos
      this.childId = childId
      console.log(`Wizard Store inicializado para childId: ${childId}`)
    },

    /**
     * Resetea el estado del store a sus valores por defecto.
     */
    reset() {
      this.childId = null
      this.basicInfo = getDefaultBasicInfo()
      this.schedules = []
      this.steps = []
      this.strategies = []
      this.strategiesConfig = getDefaultStrategiesConfig()
      this.isLoading = false
      this.error = null
      console.log('Wizard Store reseteado')
    },

    /**
     * Orquesta la creación completa de la rutina llamando a la API secuencialmente.
     * @returns {Promise<DailyRoutineList>} La rutina básica creada (DailyRoutineList).
     * @throws {Error} Si falla la creación o el rollback.
     */
    async submitAllData(): Promise<DailyRoutineList> {
      // --- Validación Preliminar ---
      if (this.childId === null) {
        console.error('submitAllData: childId es null')
        throw new Error("No se ha proporcionado un ID de niño.")
      }
      // Validar que todos los pasos requeridos sean válidos (opcional, defensa extra)
      if (!this.isStep1Valid || !this.isStep3Valid) {
         console.error('submitAllData: Pasos 1 o 3 no son válidos', {s1: this.isStep1Valid, s3: this.isStep3Valid})
         throw new Error("Por favor, completa todos los campos obligatorios en los pasos anteriores.")
      }

      // --- Inicio del Proceso ---
      const childId = this.childId // Asegura que no sea null para TypeScript
      this.isLoading = true
      this.error = null
      const routinesStore = useRoutinesStore()
      let createdRoutineId: number | null = null // Variable para guardar el ID de la rutina creada

      try {
        console.log('Wizard: Iniciando submitAllData...')
        // --- 1. Crear la Rutina Principal ---
        console.log('Wizard: Creando rutina principal...', this.basicInfo)
        const routineResponse = await routinesApi.createRoutine(
          childId,
          // Asegúrate que el objeto enviado coincida con RoutineCreateData o WizardBasicInfo según routinesApi
          {
            ...this.basicInfo,
            // El backend espera routine_type como string, no null
            routine_type: this.basicInfo.routine_type || '', // Convierte null a string vacío si es necesario
            description: this.basicInfo.description || '', // Envía string vacío si no hay descripción
          }
        )
        createdRoutineId = routineResponse.data.id // Guarda el ID devuelto por la API
        const newRoutine = routineResponse.data // Guarda el objeto completo

        // --- VERIFICACIÓN CRÍTICA ---
        if (!createdRoutineId || typeof createdRoutineId !== 'number') {
          console.error('Wizard: No se obtuvo un ID válido para la rutina creada:', createdRoutineId)
          throw new Error("Error crítico: No se pudo obtener el ID de la rutina principal creada desde la API.");
        }
        console.log(`Wizard: Rutina principal creada con ID: ${createdRoutineId}`)

        // --- 2. Crear Elementos Anidados (en paralelo) ---
        const promises: Promise<any>[] = []
        console.log('Wizard: Preparando creación de elementos anidados...')

        // 2a. Horarios
        if (this.schedules.length > 0) {
          console.log(`Wizard: Añadiendo ${this.schedules.length} horarios a las promesas...`)
          this.schedules.forEach(schedule => {
            promises.push(
              routinesApi.createSchedule(childId, createdRoutineId!, schedule)
            )
          })
        }

        // 2b. Pasos (añadiendo el 'order')
        if (this.steps.length > 0) {
          console.log(`Wizard: Añadiendo ${this.steps.length} pasos a las promesas...`)
          this.steps.forEach((step, index) => {
            const stepDataWithOrder = { ...step, order: index + 1 }
            promises.push(
              routinesApi.createStep(childId, createdRoutineId!, stepDataWithOrder)
            )
          })
        }

        // 2c. Estrategias individuales (SI TU BACKEND LO SOPORTA)
        if (this.strategies.length > 0) {
           console.log(`Wizard: Añadiendo ${this.strategies.length} estrategias individuales a las promesas...`)
           this.strategies.forEach(strategy => {
             // Asegúrate que la API y el backend soporten esto
             promises.push(
               routinesApi.createIndividualStrategy(childId, createdRoutineId!, strategy)
             )
           })
        }

        // 2d. Configuración general de estrategias
        // Solo la enviamos si tiene datos o si siempre debe existir
        // (Podrías añadir una comprobación si getDefaultStrategiesConfig() representa un estado "vacío")
        console.log('Wizard: Añadiendo configuración general de estrategias a las promesas...')
        promises.push(
          routinesApi.createStrategyConfig(childId, createdRoutineId!, this.strategiesConfig)
        )

        // Esperar a que todas las promesas de creación de sub-elementos terminen
        console.log(`Wizard: Ejecutando ${promises.length} promesas en paralelo...`)
        await Promise.all(promises)
        console.log('Wizard: Elementos anidados creados exitosamente.')

        // --- 3. Éxito Final ---
        this.isLoading = false

        // Añadir la nueva rutina (con datos básicos) al store principal localmente
        // Esto actualiza la UI sin necesidad de un fetch completo inmediato
        routinesStore.addRoutineLocal(newRoutine as DailyRoutineList) // Usa la acción local
        console.log('Wizard: Rutina añadida al store principal localmente.')

        return newRoutine // Devuelve la rutina creada

      } catch (err: any) {
        // --- Manejo de Errores ---
        console.error('Wizard: Error durante submitAllData:', err)
        this.isLoading = false
        // Intenta obtener un mensaje de error específico
        this.error = err?.response?.data?.detail || err?.response?.data?.error || err?.message || "Ocurrió un error desconocido durante la creación."

        // --- 4. ROLLBACK (Intentar eliminar la rutina base si se creó) ---
        if (createdRoutineId !== null) {
          console.warn(`Wizard: Intentando Rollback - Eliminando rutina base ID: ${createdRoutineId}`)
          try {
            await routinesApi.deleteRoutine(childId, createdRoutineId)
            console.log(`Wizard: Rollback exitoso - Rutina ${createdRoutineId} eliminada.`)
          } catch (deleteErr: any) {
            console.error("Wizard: Error CRÍTICO durante el Rollback:", deleteErr)
            // Informar al usuario que puede haber quedado una rutina incompleta
            this.error = `Error al crear los detalles de la rutina. Es posible que se haya creado una rutina incompleta (${this.basicInfo.name}). Por favor, revísala o contacta a soporte. Detalle: ${this.error}`
          }
        }

        // Relanzar el error para que el componente Wizard lo capture
        throw new Error(this.error || 'An unknown error occurred')
      }
    }, // Fin de submitAllData
  }, // Fin de actions
}) // Fin de defineStore