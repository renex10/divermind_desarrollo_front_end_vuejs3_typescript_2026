// src/store/rutinas/routineWizardStore.ts
// ✅ VERSIÓN CORREGIDA - WizardStep importado desde rutinas.ts

import { defineStore } from 'pinia'
import { routinesApi } from '@/services/rutinas/routinesApi'
import { useRoutinesStore } from './routinesStore'
import type { 
  DailyRoutineList, 
  FlexibilityLevel, 
  WizardStrategies,
  WizardStep  // ✅ CORRECCIÓN: Importar WizardStep desde rutinas.ts
} from '@/type/rutinas/rutinas' 
import Swal from 'sweetalert2'

// =============================================================================
// INTERFACES LOCALES
// =============================================================================

export interface WizardBasicInfo {
  name: string
  routine_type: string | null
  description: string
  status: 'draft' | 'active'
}

export interface WizardSchedule {
  start_time: string
  estimated_duration_minutes: number | null
  days_of_week: string[]
}



export interface WizardStrategy {
  id?: number | string
  strategy_type: string
  description: string
  related_step_order: number | null
}

export interface RoutineWizardState {
  childId: number | null
  basicInfo: WizardBasicInfo
  schedules: WizardSchedule[]
  steps: WizardStep[]
  strategies: WizardStrategy[] 
  strategiesConfig: WizardStrategies 
  isLoading: boolean
  error: string | null
}

// =============================================================================
// VALORES POR DEFECTO
// =============================================================================

const getDefaultBasicInfo = (): WizardBasicInfo => ({
  name: '',
  routine_type: null,
  description: '',
  status: 'active',
})

const getDefaultStrategiesConfig = (): WizardStrategies => ({
  flexibility_level: 'medium' as FlexibilityLevel, 
  change_tolerance_notes: '',
  needs_advance_warning: false,
  warning_time_minutes: 5,
  warning_method: 'verbal',    
  transition_strategies: '',
  calming_strategies: '',
  visual_supports_needed: false,
  visual_support_type: 'pictograms' 
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
    strategies: [], 
    strategiesConfig: getDefaultStrategiesConfig(),
    isLoading: false,
    error: null,
  }),

  getters: {
    isStep1Valid: (state): boolean => {
      return !!state.basicInfo.name &&
             state.basicInfo.name.length >= 4 &&
             !!state.basicInfo.routine_type
    },
    isStep2Valid: (state): boolean => state.schedules.length > 0,
    isStep3Valid: (state): boolean => {
      return state.steps.length > 0 &&
             state.steps.every(step => !!step.action && step.action.trim().length > 0)
    },
    isStep4Valid: (state): boolean => !!state.strategiesConfig.flexibility_level,
  },

  actions: {
    initialize(childId: number) {
      this.resetStore()
      this.childId = childId
    },

    resetStore() {
      this.childId = null
      this.basicInfo = getDefaultBasicInfo()
      this.schedules = []
      this.steps = []
      this.strategies = []
      this.strategiesConfig = getDefaultStrategiesConfig()
      this.isLoading = false
      this.error = null
    },

    /**
     * ✅ CORRECCIÓN FINAL: Mapea valores del frontend a los valores EXACTOS del backend
     * Backend espera: 'rigid', 'low', 'moderate', 'high'
     * Frontend usa: 'low', 'medium', 'high'
     */
    mapFlexibilityToBackend(level: FlexibilityLevel | string): string {
      const normalized = level?.toLowerCase() || 'medium'
      
      if (normalized.includes('low') || normalized === 'baja') {
        return 'low'  // ✅ Backend acepta 'low'
      }
      if (normalized.includes('medium') || normalized === 'media') {
        return 'moderate'  // ✅ CRÍTICO: Backend espera 'moderate' NO 'medium'
      }
      if (normalized.includes('high') || normalized === 'alta') {
        return 'high'  // ✅ Backend acepta 'high'
      }
      
      return 'moderate'  // Default seguro
    },

    /**
     * ✅ Limpia y valida el objeto de estrategias
     */
    sanitizeStrategiesForAPI(config: WizardStrategies): any {
      // Validar warning_method
      const validWarningMethods = ['verbal', 'timer', 'visual', 'song', 'countdown', 'mixed']
      const safeWarningMethod = validWarningMethods.includes(config.warning_method) 
        ? config.warning_method 
        : 'verbal'

      // Validar visual_support_type
      const validVisualTypes = ['pictograms', 'written_list', 'checklist', 'timer_visual', 'sequence_board', 'video_model', 'mixed']
      const safeVisualSupportType = validVisualTypes.includes(config.visual_support_type) 
        ? config.visual_support_type 
        : 'pictograms'

      const sanitized = {
        flexibility_level: this.mapFlexibilityToBackend(config.flexibility_level), // ✅ 'moderate'
        change_tolerance_notes: config.change_tolerance_notes?.trim() || '',
        needs_advance_warning: Boolean(config.needs_advance_warning),
        warning_time_minutes: Math.max(0, Number(config.warning_time_minutes) || 5),
        warning_method: safeWarningMethod,
        transition_strategies: config.transition_strategies?.trim() || '',
        calming_strategies: config.calming_strategies?.trim() || '',
        visual_supports_needed: Boolean(config.visual_supports_needed),
        visual_support_type: safeVisualSupportType
      }

      console.log('🔍 [DEBUG] Payload de estrategias ANTES de enviar:', JSON.stringify(sanitized, null, 2))

      return sanitized
    },

    /**
     * ✅ saveFullRoutine: Orquesta la creación completa
     */
    async saveFullRoutine(childId: number) {
      Swal.fire({
        title: 'Sincronizando Routine AI...',
        text: 'Estamos guardando la configuración de horarios y estrategias.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading()
        }
      });

      this.isLoading = true
      this.error = null
      const routinesStore = useRoutinesStore()
      let createdRoutineId: number | null = null

      try {
        // --- Paso 1: Crear la Rutina Principal ---
        console.log('📤 [PASO 1] Creando rutina base...')
        const routineResponse = await routinesApi.createRoutine(childId, {
          ...this.basicInfo,
          routine_type: this.basicInfo.routine_type || '',
          description: this.basicInfo.description || '',
        })

        const responseData = routineResponse.data as any
        createdRoutineId = responseData?.id ?? responseData?.data?.id

        if (!createdRoutineId) {
          throw new Error("El servidor de Divermind no devolvió un ID válido.")
        }
        
        console.log(`✅ [PASO 1] Rutina creada con ID: ${createdRoutineId}`)
        
        const newRoutine = routineResponse.data
        const promises: Promise<any>[] = []

        // --- Paso 2: Preparar Detalles en Paralelo ---
        
        // 2a. Guardar Horarios
        console.log(`📤 [PASO 2] Guardando ${this.schedules.length} horario(s)...`)
        this.schedules.forEach(schedule => {
          promises.push(routinesApi.createSchedule(childId, createdRoutineId!, schedule))
        })

        // 2b. Guardar Pasos
        console.log(`📤 [PASO 3] Guardando ${this.steps.length} paso(s)...`)
        this.steps.forEach((step, index) => {
          // ✅ CORRECCIÓN: Ahora step tiene common_difficulties y strategies
          const stepData = { 
            ...step, 
            order: index + 1,
            visual_support: step.visual_support_description || '',
            // ✅ Asegurar que los campos obligatorios existan
            common_difficulties: step.common_difficulties || '',
            strategies: step.strategies || ''
          }
          if (typeof stepData.id === 'string' && stepData.id.startsWith('temp-')) {
            delete stepData.id
          }
          promises.push(routinesApi.createStep(childId, createdRoutineId!, stepData))
        })

        // 2c. Guardar Estrategias
        console.log('📤 [PASO 4] Preparando estrategias...')
        console.log('🔍 [DEBUG] strategiesConfig RAW:', JSON.stringify(this.strategiesConfig, null, 2))
        
        const cleanStrategies = this.sanitizeStrategiesForAPI(this.strategiesConfig)

        promises.push(
          routinesApi.createStrategyConfig(childId, createdRoutineId!, cleanStrategies)
        )

        // --- Paso 3: Ejecución ---
        console.log(`⏳ Ejecutando ${promises.length} peticiones en paralelo...`)
        await Promise.all(promises)
        
        console.log('✅ Todas las peticiones completadas exitosamente')
        
        this.isLoading = false
        routinesStore.addRoutineLocal(newRoutine as DailyRoutineList)
        
        await Swal.fire({
          icon: 'success',
          title: '¡Rutina Configurada!',
          text: `Todo se guardó correctamente.`,
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-3xl border-none'
          }
        });

        return { success: true, data: newRoutine }

      } catch (err: any) {
        this.isLoading = false
        
        console.error('❌ Error capturado en saveFullRoutine:', err)
        console.error('📋 Detalles del error:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          config: err.config
        })
        
        this.error = err?.response?.data 
          ? JSON.stringify(err.response.data) 
          : (err.message || "Error desconocido")

        Swal.fire({
          icon: 'error',
          title: 'Error de Sincronización',
          html: `
            <p class="mb-2">No pudimos guardar los detalles. Se ha cancelado la creación para evitar datos incompletos.</p>
            <details class="mt-3 text-left">
              <summary class="cursor-pointer text-sm font-bold text-red-600">Ver detalles técnicos</summary>
              <pre class="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">${this.error}</pre>
            </details>
          `,
          confirmButtonText: 'Revisar formulario',
          confirmButtonColor: '#4f46e5',
          customClass: {
            confirmButton: 'rounded-xl px-6 py-2'
          }
        });

        if (createdRoutineId) {
          console.warn(`🗑️ [ROLLBACK] Limpiando rutina incompleta ID: ${createdRoutineId}`)
          await routinesApi.deleteRoutine(childId, createdRoutineId).catch((rollbackErr) => {
            console.error('⚠️ Error en rollback (no crítico):', rollbackErr)
          })
        }

        return { success: false, error: this.error }
      }
    },

    /**
     * ⚠️ DEPRECADO: Mantiene compatibilidad
     */
    mapFlexibility(level: string | null): FlexibilityLevel {
      const normalized = level?.toLowerCase() || 'medium'
      if (normalized.includes('low') || normalized === 'baja') return 'low' as FlexibilityLevel
      if (normalized.includes('high') || normalized === 'alta') return 'high' as FlexibilityLevel
      return 'medium' as FlexibilityLevel
    }
  },
})