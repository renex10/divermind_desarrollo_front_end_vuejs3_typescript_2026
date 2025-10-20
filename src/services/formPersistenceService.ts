// src/services/formPersistenceService.ts

import { FormDraft, StorageStrategy } from '@/type/formDraft'

const STORAGE_KEYS = {
  DRAFTS: 'form-drafts',
  CONFIG: 'form-drafts-config'
} as const

export class FormPersistenceService {
  private strategy: StorageStrategy
  private memoryStorage: Map<string, FormDraft> = new Map()

  constructor(strategy: StorageStrategy = 'localStorage') {
    this.strategy = strategy
    this.cleanupExpiredDrafts()
  }

  private getStorage(): Storage | null {
    if (typeof window === 'undefined') return null

    switch (this.strategy) {
      case 'localStorage':
        return window.localStorage
      case 'sessionStorage':
        return window.sessionStorage
      default:
        return null
    }
  }

  private serializeDraft(draft: FormDraft): string {
    return JSON.stringify({
      ...draft,
      metadata: {
        ...draft.metadata,
        createdAt: draft.metadata.createdAt.toISOString(),
        updatedAt: draft.metadata.updatedAt.toISOString(),
        expiresAt: draft.metadata.expiresAt?.toISOString()
      }
    })
  }

  private deserializeDraft(raw: string): FormDraft {
    const parsed = JSON.parse(raw)
    return {
      ...parsed,
      metadata: {
        ...parsed.metadata,
        createdAt: new Date(parsed.metadata.createdAt),
        updatedAt: new Date(parsed.metadata.updatedAt),
        expiresAt: parsed.metadata.expiresAt ? new Date(parsed.metadata.expiresAt) : undefined
      }
    }
  }

  private getMemoryDrafts(): FormDraft[] {
    return Array.from(this.memoryStorage.values())
  }

  private setMemoryDrafts(drafts: FormDraft[]): void {
    this.memoryStorage.clear()
    drafts.forEach(draft => {
      this.memoryStorage.set(draft.metadata.id, draft)
    })
  }

  // Obtener todos los borradores
  getAllDrafts(): FormDraft[] {
    try {
      switch (this.strategy) {
        case 'memory':
          return this.getMemoryDrafts()
        
        case 'sessionStorage':
        case 'localStorage':
          const storage = this.getStorage()
          if (!storage) return []
          
          const draftsRaw = storage.getItem(STORAGE_KEYS.DRAFTS)
          if (!draftsRaw) return []
          
          const drafts: FormDraft[] = JSON.parse(draftsRaw).map((draftRaw: string) =>
            this.deserializeDraft(draftRaw)
          )
          return drafts
          
        default:
          return []
      }
    } catch (error) {
      console.error('Error al cargar borradores:', error)
      return []
    }
  }

  // Guardar un borrador
  saveDraft(draft: FormDraft): void {
    try {
      const drafts = this.getAllDrafts()
      const existingIndex = drafts.findIndex(d => d.metadata.id === draft.metadata.id)

      if (existingIndex >= 0) {
        drafts[existingIndex] = draft
      } else {
        drafts.push(draft)
      }

      switch (this.strategy) {
        case 'memory':
          this.setMemoryDrafts(drafts)
          break
        
        case 'sessionStorage':
        case 'localStorage':
          const storage = this.getStorage()
          if (!storage) return
          
          const serializedDrafts = drafts.map(d => this.serializeDraft(d))
          storage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(serializedDrafts))
          break
      }
    } catch (error) {
      console.error('Error al guardar borrador:', error)
    }
  }

  // Obtener un borrador por ID
  getDraft(id: string): FormDraft | null {
    const drafts = this.getAllDrafts()
    return drafts.find(d => d.metadata.id === id) || null
  }

  // Obtener borradores por formId
  getDraftsByFormId(formId: string): FormDraft[] {
    const drafts = this.getAllDrafts()
    return drafts.filter(d => d.metadata.formId === formId)
  }

  // Eliminar un borrador
  deleteDraft(id: string): void {
    try {
      const drafts = this.getAllDrafts().filter(d => d.metadata.id !== id)
      
      switch (this.strategy) {
        case 'memory':
          this.setMemoryDrafts(drafts)
          break
        
        case 'sessionStorage':
        case 'localStorage':
          const storage = this.getStorage()
          if (!storage) return
          
          const serializedDrafts = drafts.map(d => this.serializeDraft(d))
          storage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(serializedDrafts))
          break
      }
    } catch (error) {
      console.error('Error al eliminar borrador:', error)
    }
  }

  // Limpiar todos los borradores de un formulario
  clearFormDrafts(formId: string): void {
    try {
      const drafts = this.getAllDrafts().filter(d => d.metadata.formId !== formId)
      
      switch (this.strategy) {
        case 'memory':
          this.setMemoryDrafts(drafts)
          break
        
        case 'sessionStorage':
        case 'localStorage':
          const storage = this.getStorage()
          if (!storage) return
          
          const serializedDrafts = drafts.map(d => this.serializeDraft(d))
          storage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(serializedDrafts))
          break
      }
    } catch (error) {
      console.error('Error al limpiar borradores del formulario:', error)
    }
  }

  // Limpiar todos los borradores
  clearAllDrafts(): void {
    try {
      switch (this.strategy) {
        case 'memory':
          this.memoryStorage.clear()
          break
        
        case 'sessionStorage':
        case 'localStorage':
          const storage = this.getStorage()
          if (!storage) return
          storage.removeItem(STORAGE_KEYS.DRAFTS)
          break
      }
    } catch (error) {
      console.error('Error al limpiar borradores:', error)
    }
  }

  // Generar un ID único
  generateDraftId(): string {
    return `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Limpiar borradores expirados
  private cleanupExpiredDrafts(): void {
    try {
      const drafts = this.getAllDrafts()
      const now = new Date()
      const validDrafts = drafts.filter(draft => {
        if (!draft.metadata.expiresAt) return true
        return new Date(draft.metadata.expiresAt) > now
      })

      if (validDrafts.length !== drafts.length) {
        switch (this.strategy) {
          case 'memory':
            this.setMemoryDrafts(validDrafts)
            break
          
          case 'sessionStorage':
          case 'localStorage':
            const storage = this.getStorage()
            if (!storage) return
            
            const serializedDrafts = validDrafts.map(d => this.serializeDraft(d))
            storage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(serializedDrafts))
            break
        }
        
        console.log(`🧹 Limpiados ${drafts.length - validDrafts.length} borradores expirados`)
      }
    } catch (error) {
      console.error('Error al limpiar borradores expirados:', error)
    }
  }

  // Verificar si hay borradores para un formulario
  hasDrafts(formId: string): boolean {
    return this.getDraftsByFormId(formId).length > 0
  }

  // Obtener el borrador más reciente de un formulario
  getLatestDraft(formId: string): FormDraft | null {
    const drafts = this.getDraftsByFormId(formId)
    if (drafts.length === 0) return null
    
    return drafts.reduce((latest, current) => 
      current.metadata.updatedAt > latest.metadata.updatedAt ? current : latest
    )
  }
}

// Instancia por defecto
export const formPersistenceService = new FormPersistenceService('localStorage')