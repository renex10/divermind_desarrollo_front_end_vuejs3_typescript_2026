// src/types/formDraft.ts

export interface FormDraftMetadata {
  id: string
  formId: string
  createdAt: Date
  updatedAt: Date
  step: number
  title: string
  dataPreview?: string
  expiresAt?: Date
}

export interface FormDraft<T = any> {
  metadata: FormDraftMetadata
  data: T
}

export interface FormDraftState {
  drafts: FormDraft[]
  currentDraft: FormDraft | null
  autoSaveEnabled: boolean
  lastSavedAt: Date | null
}

export type StorageStrategy = 'localStorage' | 'sessionStorage' | 'memory'

export interface DraftRecoveryOptions {
  allowRecovery: boolean
  showRecoveryModal: boolean
  autoRecover: boolean
}

export interface FormDraftConfig {
  formId: string
  storage: StorageStrategy
  autoSave: boolean
  autoSaveDelay: number
  maxDrafts: number
  draftExpiryDays: number
}