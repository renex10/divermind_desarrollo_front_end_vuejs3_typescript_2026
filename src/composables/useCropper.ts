// src/composables/useCropper.ts

import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { CropperResult, CropperSettings } from '@/type/cropper.types'

export function useCropper(settings?: CropperSettings) {
  const cropperRef = ref<any>(null)
  const zoom = ref(0)
  const rotation = ref(0)
  const isProcessing = ref(false)
  
  // Zoom
  const zoomIn = () => {
    if (cropperRef.value) {
      cropperRef.value.zoom(1.1)
      zoom.value = Math.min(zoom.value + 10, 200)
    }
  }
  
  const zoomOut = () => {
    if (cropperRef.value) {
      cropperRef.value.zoom(0.9)
      zoom.value = Math.max(zoom.value - 10, 0)
    }
  }
  
  // Rotación
  const rotate = (degrees: number) => {
    if (cropperRef.value) {
      rotation.value = (rotation.value + degrees) % 360
      cropperRef.value.rotate(degrees)
    }
  }
  
  // Reset
  const reset = () => {
    if (cropperRef.value) {
      cropperRef.value.reset()
      zoom.value = 0
      rotation.value = 0
    }
  }
  
  // Obtener resultado
  const getResult = async (): Promise<CropperResult | null> => {
    if (!cropperRef.value) return null
    
    try {
      isProcessing.value = true
      
      const { canvas, coordinates } = cropperRef.value.getResult()
      
      // Convertir canvas a Blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b: Blob | null) => {
            if (b) resolve(b)
            else reject(new Error('No se pudo crear Blob'))
          },
          'image/jpeg',
          0.85
        )
      })
      
      return { blob, canvas, coordinates }
    } catch (error) {
      console.error('[useCropper] Error obteniendo resultado:', error)
      return null
    } finally {
      isProcessing.value = false
    }
  }
  
  return {
    cropperRef,
    zoom,
    rotation,
    isProcessing,
    zoomIn,
    zoomOut,
    rotate,
    reset,
    getResult
  }
}