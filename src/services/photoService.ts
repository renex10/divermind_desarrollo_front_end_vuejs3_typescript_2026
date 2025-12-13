// src/services/photoService.ts

import http from '@/services/http'
import type { AxiosProgressEvent } from 'axios'

/**
 * INTERFACES DE RESPUESTAS
 */
export interface PhotoUploadResponse {
  id: string
  image_type: string
  title: string
  alt_text: string
  url_thumbnail: string
  url_medium: string
  url_large: string
  url_original: string
  width: number
  height: number
  file_size: number
  uploaded_at: string
  is_optimized: boolean
}

export interface ChildPhotoResponse {
  has_photo: boolean
  photo: PhotoUploadResponse | null
}

/**
 * SERVICIO DE GESTIÓN DE FOTOS
 * Maneja la subida, obtención y eliminación de fotos de perfil de niños
 */
export const photoService = {
  /**
   * Subir foto de perfil de un hijo
   * POST /api/core/parent/children/{childId}/photo/
   * 
   * @param childId - ID del niño
   * @param imageFile - Archivo de imagen a subir
   * @param onProgress - Callback opcional para trackear progreso (0-100)
   * @returns Promise con datos de la foto subida
   */
  async uploadChildPhoto(
    childId: number,
    imageFile: File,
    onProgress?: (progress: number) => void
  ): Promise<PhotoUploadResponse> {
    try {
      // Crear FormData para envío multipart
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('image_type', 'profile')
      formData.append('title', `Foto de perfil`)
      formData.append('alt_text', `Foto de perfil`)

      console.log('[photoService] 📤 Subiendo foto:', {
        childId,
        fileName: imageFile.name,
        fileSize: `${(imageFile.size / 1024 / 1024).toFixed(2)} MB`,
        fileType: imageFile.type
      })

      // 🔥 CON /core/ en la ruta
      const response = await http.post<PhotoUploadResponse>(
        `/core/parent/children/${childId}/photo/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000, // 30 segundos para uploads de imágenes
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total && onProgress) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              )
              console.log(`[photoService] 📊 Progreso: ${progress}%`)
              onProgress(progress)
            }
          }
        }
      )

      console.log('[photoService] ✅ Foto subida exitosamente:', {
        id: response.data.id,
        urls: {
          thumbnail: response.data.url_thumbnail,
          medium: response.data.url_medium
        }
      })

      return response.data

    } catch (error: any) {
      console.error('[photoService] ❌ Error subiendo foto:', error)

      // Extraer mensaje de error más específico
      const message = 
        error?.response?.data?.detail ||
        error?.response?.data?.image?.[0] ||
        error?.response?.data?.error ||
        error?.message ||
        'Error al subir la foto'

      throw new Error(message)
    }
  },

  /**
   * Obtener foto actual del hijo
   * GET /api/core/parent/children/{childId}/photo/
   * 
   * @param childId - ID del niño
   * @returns Promise con datos de la foto (o null si no tiene)
   */
  async getChildPhoto(childId: number): Promise<ChildPhotoResponse> {
    try {
      console.log('[photoService] 🔍 Obteniendo foto del hijo:', childId)

      // 🔥 CON /core/ en la ruta
      const response = await http.get<ChildPhotoResponse>(
        `/core/parent/children/${childId}/photo/`
      )

      console.log('[photoService] ✅ Foto obtenida:', {
        hasPhoto: response.data.has_photo,
        photoId: response.data.photo?.id
      })

      return response.data

    } catch (error: any) {
      console.error('[photoService] ⚠️ Error obteniendo foto:', error)

      // Si es 404, significa que el niño no tiene foto (no es error)
      if (error?.response?.status === 404) {
        console.log('[photoService] ℹ️ El niño no tiene foto de perfil')
        return {
          has_photo: false,
          photo: null
        }
      }

      const message = 
        error?.response?.data?.detail ||
        error?.message ||
        'Error al obtener la foto'

      throw new Error(message)
    }
  },

  /**
   * Eliminar foto del hijo (volver a placeholder)
   * DELETE /api/core/parent/children/{childId}/photo/
   * 
   * @param childId - ID del niño
   */
  async deleteChildPhoto(childId: number): Promise<void> {
    try {
      console.log('[photoService] 🗑️ Eliminando foto del hijo:', childId)

      // 🔥 CON /core/ en la ruta
      await http.delete(`/core/parent/children/${childId}/photo/`)

      console.log('[photoService] ✅ Foto eliminada exitosamente')

    } catch (error: any) {
      console.error('[photoService] ❌ Error eliminando foto:', error)

      const message = 
        error?.response?.data?.detail ||
        error?.message ||
        'Error al eliminar la foto'

      throw new Error(message)
    }
  },

  /**
   * Obtener todas las fotos de un hijo (galería de logros, etc.)
   * GET /api/core/parent/children/{childId}/photos/
   * 
   * @param childId - ID del niño
   * @param imageType - Tipo de imagen a filtrar (opcional)
   * @returns Promise con array de fotos
   */
  async getChildPhotos(
    childId: number,
    imageType?: string
  ): Promise<PhotoUploadResponse[]> {
    try {
      console.log('[photoService] 🖼️ Obteniendo fotos del hijo:', childId)

      const params = imageType ? { image_type: imageType } : {}

      // 🔥 CON /core/ en la ruta
      const response = await http.get<PhotoUploadResponse[]>(
        `/core/parent/children/${childId}/photos/`,
        { params }
      )

      console.log('[photoService] ✅ Fotos obtenidas:', response.data.length)

      return response.data

    } catch (error: any) {
      console.error('[photoService] ❌ Error obteniendo fotos:', error)

      const message = 
        error?.response?.data?.detail ||
        error?.message ||
        'Error al obtener las fotos'

      throw new Error(message)
    }
  },

  /**
   * Validar imagen en el cliente ANTES de subir al servidor
   * Valida: formato, tamaño, dimensiones mínimas
   * 
   * @param file - Archivo de imagen a validar
   * @returns Objeto con resultado de validación y mensaje de error (si aplica)
   */
  async validateImage(file: File): Promise<{ valid: boolean; error?: string }> {
    console.log('[photoService] 🔍 Validando imagen:', file.name)

    // 1. Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      console.warn('[photoService] ⚠️ Formato no válido:', file.type)
      return {
        valid: false,
        error: 'Formato no válido. Usa JPG, PNG o WebP.'
      }
    }

    // 2. Validar tamaño del archivo (máx 10MB)
    const maxSizeMB = 10
    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > maxSizeMB) {
      console.warn('[photoService] ⚠️ Archivo muy grande:', sizeMB.toFixed(2), 'MB')
      return {
        valid: false,
        error: `Archivo muy grande (${sizeMB.toFixed(1)}MB). Máximo ${maxSizeMB}MB.`
      }
    }

    // 3. Validar dimensiones mínimas (200x200px)
    try {
      const dimensions = await this.getImageDimensions(file)
      
      console.log('[photoService] 📐 Dimensiones:', dimensions)

      if (dimensions.width < 200 || dimensions.height < 200) {
        console.warn('[photoService] ⚠️ Imagen muy pequeña:', dimensions)
        return {
          valid: false,
          error: `Imagen muy pequeña (${dimensions.width}x${dimensions.height}px). Mínimo 200x200px.`
        }
      }

      console.log('[photoService] ✅ Validación exitosa')
      return { valid: true }

    } catch (error) {
      console.error('[photoService] ❌ Error validando imagen:', error)
      return {
        valid: false,
        error: 'No se pudo leer la imagen. Verifica que sea un archivo válido.'
      }
    }
  },

  /**
   * Obtener dimensiones de una imagen
   * Funciona con File y Blob
   * 
   * @param file - Archivo de imagen
   * @returns Promise con width y height en píxeles
   */
  async getImageDimensions(file: File | Blob): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const objectUrl = URL.createObjectURL(file)

      // Timeout para evitar espera infinita
      const timeout = setTimeout(() => {
        URL.revokeObjectURL(objectUrl)
        reject(new Error('Timeout al cargar la imagen'))
      }, 5000) // 5 segundos

      img.onload = () => {
        clearTimeout(timeout)
        URL.revokeObjectURL(objectUrl)
        resolve({
          width: img.width,
          height: img.height
        })
      }

      img.onerror = (error) => {
        clearTimeout(timeout)
        URL.revokeObjectURL(objectUrl)
        console.error('[photoService] Error cargando imagen:', error)
        reject(new Error('No se pudo cargar la imagen. Verifica el formato.'))
      }

      // Asignar src DESPUÉS de los listeners
      img.src = objectUrl
    })
  },

  /**
   * Crear URL temporal para preview de imagen
   * IMPORTANTE: Liberar después con revokePreviewUrl()
   * 
   * @param file - Archivo de imagen
   * @returns URL blob temporal
   */
  createPreviewUrl(file: File): string {
    const url = URL.createObjectURL(file)
    console.log('[photoService] 🔗 URL de preview creada:', url)
    return url
  },

  /**
   * Liberar URL temporal de preview
   * Previene memory leaks
   * 
   * @param url - URL blob a liberar
   */
  revokePreviewUrl(url: string): void {
    try {
      URL.revokeObjectURL(url)
      console.log('[photoService] 🗑️ URL de preview liberada')
    } catch (error) {
      console.warn('[photoService] ⚠️ Error liberando URL:', error)
    }
  },

  /**
   * Comprimir imagen en el cliente antes de subir (opcional)
   * Reduce el tamaño del archivo sin pérdida significativa de calidad
   * 
   * Requiere: npm install browser-image-compression
   * 
   * @param file - Archivo de imagen original
   * @param maxSizeMB - Tamaño máximo después de comprimir
   * @returns Promise con archivo comprimido
   */
  async compressImage(file: File, maxSizeMB: number = 1): Promise<File> {
    try {
      // Nota: Implementar solo si instalas browser-image-compression
      // const imageCompression = await import('browser-image-compression')
      
      // const options = {
      //   maxSizeMB,
      //   maxWidthOrHeight: 1920,
      //   useWebWorker: true
      // }
      
      // return await imageCompression.default(file, options)

      console.warn(`[photoService] ⚠️ Compresión no implementada (target: ${maxSizeMB}MB). Instalar: npm install browser-image-compression`)
      return file

    } catch (error) {
      console.error('[photoService] ❌ Error comprimiendo imagen:', error)
      throw new Error('Error al comprimir la imagen')
    }
  }
}

/**
 * EXPORT POR DEFECTO
 * Permite: import photoService from '@/services/photoService'
 */
export default photoService
