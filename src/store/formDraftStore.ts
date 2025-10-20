// src/store/formDraftStore.ts

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { FormDraft, FormDraftMetadata, DraftRecoveryOptions } from '@/types/formDraft'
import { formPersistenceService } from '@/services/formPersistenceService'

export const useFormDraftStore = defineStore('formDraft', () => {
  // Estado
  const drafts = ref<FormDraft[]>([])
  const currentDraft = ref<FormDraft | null>(null)
  const autoSaveEnabled = ref(true)
  const lastSavedAt = ref<Date | null>(null)
  
  // ✅ CORREGIDO: recoveryOptions como reactive object normal
  const recoveryOptions = ref<DraftRecoveryOptions>({
    allowRecovery: true,
    showRecoveryModal: true,
    autoRecover: false
  })

  // Getters
  const draftsCount = computed(() => drafts.value.length)
  const hasCurrentDraft = computed(() => currentDraft.value !== null)
  const lastSavedText = computed(() => {
    if (!lastSavedAt.value) return 'Nunca'
    
    const now = new Date()
    const diffMs = now.getTime() - lastSavedAt.value.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Hace unos segundos'
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`
    
    const diffDays = Math.floor(diffHours / 24)
    return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`
  })

  // Acciones
  const loadDrafts = () => {
    drafts.value = formPersistenceService.getAllDrafts()
  }

  const createDraft = (formId: string, data: any, step: number, title: string, expiresInDays: number = 7) => {
    const id = formPersistenceService.generateDraftId()
    const now = new Date()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiresInDays)

    const metadata: FormDraftMetadata = {
      id,
      formId,
      createdAt: now,
      updatedAt: now,
      step,
      title,
      expiresAt
    }

    const draft: FormDraft = { metadata, data }
    formPersistenceService.saveDraft(draft)
    drafts.value.push(draft)
    currentDraft.value = draft
    lastSavedAt.value = now
    
    return draft
  }

  const updateDraft = (id: string, data: any, step: number) => {
    const draftIndex = drafts.value.findIndex((d: FormDraft) => d.metadata.id === id)
    if (draftIndex === -1) return

    const draft = drafts.value[draftIndex]
    draft.data = data
    draft.metadata.step = step
    draft.metadata.updatedAt = new Date()

    formPersistenceService.saveDraft(draft)
    drafts.value[draftIndex] = draft
    currentDraft.value = draft
    lastSavedAt.value = new Date()
  }

  const setCurrentDraft = (draft: FormDraft | null) => {
    currentDraft.value = draft
  }

  const loadDraft = (id: string) => {
    const draft = formPersistenceService.getDraft(id)
    setCurrentDraft(draft)
    return draft
  }

  const loadLatestDraft = (formId: string) => {
    const draft = formPersistenceService.getLatestDraft(formId)
    setCurrentDraft(draft)
    return draft
  }

  const deleteDraft = (id: string) => {
    formPersistenceService.deleteDraft(id)
    drafts.value = drafts.value.filter((d: FormDraft) => d.metadata.id !== id)
    if (currentDraft.value?.metadata.id === id) {
      setCurrentDraft(null)
    }
  }

  const clearFormDrafts = (formId: string) => {
    formPersistenceService.clearFormDrafts(formId)
    drafts.value = drafts.value.filter((d: FormDraft) => d.metadata.formId !== formId)
    if (currentDraft.value?.metadata.formId === formId) {
      setCurrentDraft(null)
    }
  }

  const clearAllDrafts = () => {
    formPersistenceService.clearAllDrafts()
    drafts.value = []
    setCurrentDraft(null)
    lastSavedAt.value = null
  }

  const getDraftsByFormId = (formId: string) => {
    return drafts.value.filter((d: FormDraft) => d.metadata.formId === formId)
  }

  const hasDraftsForForm = (formId: string) => {
    return formPersistenceService.hasDrafts(formId)
  }

  // ✅ CORREGIDO: setRecoveryOptions con tipo correcto
  const setRecoveryOptions = (options: Partial<DraftRecoveryOptions>) => {
    recoveryOptions.value = { ...recoveryOptions.value, ...options }
  }

  const toggleAutoSave = (enabled: boolean) => {
    autoSaveEnabled.value = enabled
  }

  // Cargar borradores al inicializar
  loadDrafts()

  return {
    // Estado
    drafts,
    currentDraft,
    autoSaveEnabled,
    lastSavedAt,
    recoveryOptions, // ✅ Ya es un ref, no necesita .value adicional

    // Getters
    draftsCount,
    hasCurrentDraft,
    lastSavedText,

    // Acciones
    loadDrafts,
    createDraft,
    updateDraft,
    setCurrentDraft,
    loadDraft,
    loadLatestDraft,
    deleteDraft,
    clearFormDrafts,
    clearAllDrafts,
    getDraftsByFormId,
    hasDraftsForForm,
    setRecoveryOptions,
    toggleAutoSave
  }
})