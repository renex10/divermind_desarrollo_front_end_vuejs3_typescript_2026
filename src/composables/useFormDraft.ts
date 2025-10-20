// src/composables/useFormDraft.ts

import { ref, watch, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useFormDraftStore } from '@/store/formDraftStore'
import { FormDraft, FormDraftConfig } from '@/types/formDraft'

interface UseFormDraftOptions {
  formId: string
  autoSave?: boolean
  autoSaveDelay?: number
  maxDrafts?: number
  draftExpiryDays?: number
  storage?: 'localStorage' | 'sessionStorage' | 'memory'
}

export function useFormDraft(options: UseFormDraftOptions) {
  const {
    formId,
    autoSave = true,
    autoSaveDelay = 2000,
    maxDrafts = 5,
    draftExpiryDays = 7,
    storage = 'localStorage'
  } = options

  const store = useFormDraftStore()
  const currentStep = ref(1)
  const formData = ref<Record<string, any>>({})
  const hasUnsavedChanges = ref(false)
  const isRecovering = ref(false)
  const lastSaveTime = ref<Date | null>(null)
  
  let autoSaveTimer: number | null = null
  let isInitialized = false

  // Configuración
  const config: FormDraftConfig = {
    formId,
    storage,
    autoSave,
    autoSaveDelay,
    maxDrafts,
    draftExpiryDays
  }

  // ✅ CORREGIDO: Computed con tipos explícitos
  const drafts = computed(() => store.getDraftsByFormId(formId))
  
  // ✅ CORREGIDO: Tipos explícitos para latest y current
  const latestDraft = computed(() => {
    if (drafts.value.length === 0) return null
    return drafts.value.reduce((latest: FormDraft, current: FormDraft) => 
      current.metadata.updatedAt > latest.metadata.updatedAt ? current : latest, 
      drafts.value[0]
    )
  })
  
  const hasExistingDrafts = computed(() => drafts.value.length > 0)
  
  // ✅ CORREGIDO: Acceso seguro a recoveryOptions con valor por defecto
  const recoveryOptions = computed(() => {
    // Si store.recoveryOptions es undefined, usar valores por defecto
    if (!store.recoveryOptions) {
      console.warn('⚠️ store.recoveryOptions es undefined, usando valores por defecto')
      return {
        allowRecovery: true,
        showRecoveryModal: true,
        autoRecover: false
      }
    }
    return store.recoveryOptions
  })
  
  const canRecover = computed(() => 
    hasExistingDrafts.value && recoveryOptions.value.allowRecovery
  )

  // Métodos
  const scheduleAutoSave = () => {
    if (!autoSave || !store.autoSaveEnabled || isRecovering.value) return

    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer)
    }

    autoSaveTimer = window.setTimeout(() => {
      saveDraft()
    }, autoSaveDelay)
  }

  const saveDraft = () => {
    if (!hasUnsavedChanges.value && !isInitialized) return

    const draftData = { ...formData.value }
    const step = currentStep.value
    const title = `Borrador - Paso ${step}`

    try {
      if (store.currentDraft?.metadata.formId === formId) {
        store.updateDraft(store.currentDraft.metadata.id, draftData, step)
      } else {
        store.createDraft(formId, draftData, step, title, draftExpiryDays)
      }

      hasUnsavedChanges.value = false
      lastSaveTime.value = new Date()
      
      console.log(`💾 Borrador guardado para ${formId} - Paso ${step}`)
    } catch (error) {
      console.error('❌ Error al guardar borrador:', error)
    }
  }

  const recoverDraft = async (draftId?: string): Promise<boolean> => {
    let draft: FormDraft | null = null
    
    try {
      if (draftId) {
        draft = store.loadDraft(draftId)
      } else {
        draft = store.loadLatestDraft(formId)
      }

      if (draft) {
        isRecovering.value = true
        
        // Esperar al siguiente tick para asegurar que la UI esté lista
        await nextTick()
        
        // Restaurar datos
        Object.assign(formData.value, draft.data)
        currentStep.value = draft.metadata.step
        
        console.log(`🔄 Borrador recuperado: ${formId} - Paso ${currentStep.value}`)
        
        // Pequeño delay para asegurar que todo esté cargado
        setTimeout(() => {
          isRecovering.value = false
          hasUnsavedChanges.value = false
        }, 100)
        
        return true
      }
    } catch (error) {
      console.error('❌ Error al recuperar borrador:', error)
      isRecovering.value = false
    }
    
    return false
  }

  const deleteDraft = (draftId: string) => {
    try {
      store.deleteDraft(draftId)
    } catch (error) {
      console.error('❌ Error al eliminar borrador:', error)
    }
  }

  const clearAllDrafts = () => {
    try {
      store.clearFormDrafts(formId)
      hasUnsavedChanges.value = false
    } catch (error) {
      console.error('❌ Error al limpiar borradores:', error)
    }
  }

  const discardChanges = () => {
    try {
      if (store.currentDraft) {
        recoverDraft(store.currentDraft.metadata.id)
      } else {
        formData.value = {}
        currentStep.value = 1
      }
      hasUnsavedChanges.value = false
    } catch (error) {
      console.error('❌ Error al descartar cambios:', error)
    }
  }

  const forceSave = () => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer)
    }
    saveDraft()
  }

  // ✅ CORREGIDO: Watchers con manejo de errores
  watch(formData, () => {
    if (isInitialized && !isRecovering.value) {
      hasUnsavedChanges.value = true
      scheduleAutoSave()
    }
  }, { deep: true })

  watch(currentStep, () => {
    if (isInitialized && !isRecovering.value) {
      hasUnsavedChanges.value = true
      scheduleAutoSave()
    }
  })

  // Lifecycle
  onMounted(async () => {
    try {
      // Cargar borradores existentes
      store.loadDrafts()
      
      // ✅ CORREGIDO: Verificación segura con optional chaining
      if (hasExistingDrafts.value && recoveryOptions.value?.autoRecover) {
        console.log('🔄 Recuperación automática activada...')
        await recoverDraft()
      } else if (hasExistingDrafts.value) {
        console.log('📝 Borradores disponibles pero recuperación automática desactivada')
      }
      
      isInitialized = true
    } catch (error) {
      console.error('❌ Error en onMounted de useFormDraft:', error)
      isInitialized = true // Marcar como inicializado incluso con error
    }
  })

  onUnmounted(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer)
    }
    
    // Guardar final al desmontar
    if (hasUnsavedChanges.value) {
      saveDraft()
    }
  })

  // Exposición pública
  return {
    // Estado
    formData,
    currentStep,
    hasUnsavedChanges,
    isRecovering,
    lastSaveTime,
    
    // Computed
    drafts,
    latestDraft,
    hasExistingDrafts,
    canRecover,
    recoveryOptions, // ✅ EXPORTAR para debugging
    
    // Métodos
    saveDraft,
    recoverDraft,
    deleteDraft,
    clearAllDrafts,
    discardChanges,
    forceSave,
    scheduleAutoSave
  }
}