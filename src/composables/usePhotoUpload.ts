// src/composables/usePhotoUpload.ts

import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { photoService } from '@/services/photoService'
import type { PhotoUploadResponse } from '@/services/photoService'

export function usePhotoUpload(childId: Ref<number>) {
  // Estados
  const isUploading = ref(false)
  const uploadProgress = ref(0)
  const error = ref<string | null>(null)
  const uploadedPhoto = ref<PhotoUploadResponse | null>(null)

  /**
   * Validar archivo ORIGINAL (antes de procesarlo)
   * Solo para archivos File, NO para Blobs procesados
   */
  const validateFile = async (file: File): Promise<boolean> => {
    error.value = null

    try {
      console.log('[usePhotoUpload] Validando archivo original:', {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
      })

      const validation = await photoService.validateImage(file)
      
      if (!validation.valid) {
        error.value = validation.error || 'Imagen inválida'
        return false
      }

      console.log('[usePhotoUpload] ✅ Validación exitosa')
      return true
    } catch (err: any) {
      console.error('[usePhotoUpload] Error validando:', err)
      error.value = err.message || 'Error al validar la imagen'
      return false
    }
  }

  /**
   * Subir foto al servidor
   * NO VALIDA - asume que ya fue validada antes
   */
  const uploadPhoto = async (file: File | Blob): Promise<string> => {
    try {
      isUploading.value = true
      uploadProgress.value = 0
      error.value = null

      console.log('[usePhotoUpload] 📤 Iniciando upload...', {
        childId: childId.value,
        fileName: file instanceof File ? file.name : 'processed-image.jpg',
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`
      })

      // 🔥 NO VALIDAR AQUÍ - ya se validó el archivo original
      
      // Convertir a File si es Blob
      const fileToUpload = file instanceof File 
        ? file 
        : new File([file], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' })

      // Callback de progreso
      const onProgress = (progress: number) => {
        uploadProgress.value = progress
        console.log(`[usePhotoUpload] 📊 Progreso: ${progress}%`)
      }

      // Llamar al servicio
      const response = await photoService.uploadChildPhoto(
        childId.value,
        fileToUpload,
        onProgress
      )

      // Guardar respuesta
      uploadedPhoto.value = response
      uploadProgress.value = 100

      console.log('[usePhotoUpload] ✅ Upload exitoso:', response.url_medium)

      return response.url_medium

    } catch (err: any) {
      console.error('[usePhotoUpload] ❌ Error en upload:', err)
      error.value = err.message || 'Error al subir la foto'
      throw err
    } finally {
      isUploading.value = false
    }
  }

  /**
   * Obtener foto actual del hijo
   */
  const fetchCurrentPhoto = async (): Promise<void> => {
    try {
      error.value = null

      const response = await photoService.getChildPhoto(childId.value)
      
      if (response.has_photo && response.photo) {
        uploadedPhoto.value = response.photo
      }

    } catch (err: any) {
      console.error('[usePhotoUpload] Error obteniendo foto:', err)
      error.value = err.message || 'Error al obtener la foto'
    }
  }

  /**
   * Eliminar foto actual
   */
  const deletePhoto = async (): Promise<void> => {
    try {
      error.value = null
      isUploading.value = true

      await photoService.deleteChildPhoto(childId.value)
      
      uploadedPhoto.value = null

    } catch (err: any) {
      console.error('[usePhotoUpload] Error eliminando foto:', err)
      error.value = err.message || 'Error al eliminar la foto'
      throw err
    } finally {
      isUploading.value = false
    }
  }

  /**
   * Reset del composable
   */
  const reset = () => {
    isUploading.value = false
    uploadProgress.value = 0
    error.value = null
    uploadedPhoto.value = null
  }

  // Computed
  const currentPhotoUrl = computed(() => {
    return uploadedPhoto.value?.url_medium || null
  })

  const hasPhoto = computed(() => {
    return uploadedPhoto.value !== null
  })

  return {
    // Estados
    isUploading,
    uploadProgress,
    error,
    uploadedPhoto,
    currentPhotoUrl,
    hasPhoto,

    // Métodos
    validateFile,
    uploadPhoto,
    fetchCurrentPhoto,
    deletePhoto,
    reset
  }
}