<!-- src/components/dashboard/padres/PhotoUploadModal.vue -->
<template>
  <BaseModal
    v-model:show="isVisible"
    :title="modalTitle"
    size="lg"
    @close="handleClose"
  >
    <!-- CONTENIDO DEL MODAL -->
    <div class="space-y-6">
      
      <!-- PASO 1: SELECCIONAR ARCHIVO -->
      <div v-if="currentStep === 'select'">
        <DropZone
          @file-selected="handleFileSelected"
          @file-error="handleFileError"
          :accept="acceptedFormats"
          :max-size-mb="10"
        />
        
        <!-- Mensajes de error -->
        <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-start gap-3">
            <ExclamationCircleIcon class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-red-800">Error al cargar la imagen</p>
              <p class="text-sm text-red-600 mt-1">{{ errorMessage }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- PASO 2: EDITAR/CROP IMAGEN -->
      <div v-else-if="currentStep === 'edit' && selectedFile">
        <ImageCropper
          :image-file="selectedFile"
          :aspect-ratio="1"
          crop-shape="circle"
          @crop-complete="handleCropComplete"
          @cancel="resetToSelect"
        />
      </div>

      <!-- PASO 3: PREVIEW Y CONFIRMAR -->
      <div v-else-if="currentStep === 'confirm' && croppedImage">
        <PhotoPreview
          :original-url="currentPhotoUrl"
          :new-image-blob="croppedImage"
          :child-name="childName"
        />

        <!-- Checkbox de consentimiento -->
        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <label class="flex items-start gap-3 cursor-pointer">
            <input
              v-model="consentGiven"
              type="checkbox"
              class="mt-1 w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
            />
            <div class="text-sm">
              <p class="font-medium text-gray-900">
                Autorizo el uso de esta fotografía
              </p>
              <p class="text-gray-600 mt-1">
                Esta foto será visible para el equipo terapéutico asignado a {{ childName }}.
                <a href="#" class="text-sky-600 hover:text-sky-700 underline">
                  Leer política de privacidad
                </a>
              </p>
            </div>
          </label>
        </div>
      </div>

      <!-- PASO 4: UPLOADING -->
      <div v-else-if="currentStep === 'uploading'">
        <UploadProgress
          :progress="uploadProgress"
          :status="uploadStatus"
          :message="uploadMessage"
        />
      </div>

    </div>

    <!-- FOOTER CON BOTONES -->
    <template #footer>
      <div class="flex items-center justify-between gap-3">
        
        <!-- Botones según el paso actual -->
        <div v-if="currentStep === 'select'" class="w-full flex justify-end">
          <button
            @click="handleClose"
            class="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancelar
          </button>
        </div>

        <!-- En paso 'edit' los botones están dentro de ImageCropper -->
        <div v-else-if="currentStep === 'edit'" class="w-full">
          <!-- Espacio vacío - botones están en ImageCropper -->
        </div>

        <div v-else-if="currentStep === 'confirm'" class="flex gap-3 w-full">
          <button
            @click="backToEdit"
            class="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            ← Editar otra vez
          </button>
          <button
            @click="handleUpload"
            :disabled="!consentGiven || isUploading"
            class="flex-1 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar foto
          </button>
        </div>

        <div v-else-if="currentStep === 'uploading'" class="w-full">
          <!-- Sin botones durante upload -->
        </div>

      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import BaseModal from '@/components/modal/BaseModal.vue'
import DropZone from '@/components/common/DropZone.vue'
import ImageCropper from '@/components/common/ImageCropper.vue'
import PhotoPreview from '@/components/dashboard/padres/PhotoPreview.vue'
import UploadProgress from '@/components/common/UploadProgress.vue'
import { usePhotoUpload } from '@/composables/usePhotoUpload'
import { useAlertStore } from '@/store/alertStore'

interface Props {
  visible: boolean
  childId: number
  childName: string
  currentPhotoUrl: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'success': [photoUrl: string]
}>()

// Estado local
const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

type Step = 'select' | 'edit' | 'confirm' | 'uploading'
const currentStep = ref<Step>('select')
const selectedFile = ref<File | null>(null)
const croppedImage = ref<Blob | null>(null)
const consentGiven = ref(false)
const errorMessage = ref<string | null>(null)
const acceptedFormats = 'image/jpeg,image/png,image/webp'

// Composable
const {
  isUploading,
  uploadProgress,
  uploadPhoto,
  validateFile,
  error: uploadError
} = usePhotoUpload(computed(() => props.childId))

const alert = useAlertStore()

// Computed
const modalTitle = computed(() => {
  const titles = {
    select: `Subir foto de ${props.childName}`,
    edit: 'Ajustar foto',
    confirm: 'Confirmar nueva foto',
    uploading: 'Subiendo foto...'
  }
  return titles[currentStep.value]
})

const uploadStatus = computed(() => {
  if (uploadProgress.value < 50) return 'uploading'
  if (uploadProgress.value < 100) return 'processing'
  return 'complete'
})

const uploadMessage = computed(() => {
  if (uploadProgress.value < 50) return 'Subiendo tu foto...'
  if (uploadProgress.value < 100) return 'Optimizando imagen...'
  return '¡Listo!'
})

// Métodos
const handleFileSelected = async (file: File) => {
  errorMessage.value = null
  
  console.log('[PhotoUploadModal] 📁 Archivo seleccionado:', file.name, `(${(file.size / 1024 / 1024).toFixed(2)} MB)`)
  
  try {
    // Validar archivo
    const isValid = await validateFile(file)
    
    if (!isValid) {
      errorMessage.value = uploadError.value || 'Imagen inválida'
      console.error('[PhotoUploadModal] ❌ Validación falló:', errorMessage.value)
      return
    }
    
    // Si es válida, continuar al crop
    console.log('[PhotoUploadModal] ✅ Validación exitosa, ir a editar')
    selectedFile.value = file
    currentStep.value = 'edit'
    
  } catch (error: any) {
    console.error('[PhotoUploadModal] ❌ Error validando:', error)
    errorMessage.value = error.message || 'Error al validar la imagen'
  }
}

const handleFileError = (error: string) => {
  errorMessage.value = error
  console.error('[PhotoUploadModal] ❌ Error en archivo:', error)
}

const handleCropComplete = (blob: Blob) => {
  console.log('[PhotoUploadModal] ✂️ Crop completado:', {
    size: `${(blob.size / 1024).toFixed(2)} KB`,
    type: blob.type
  })
  
  // Verificar que el blob no esté vacío
  if (blob.size < 1000) {
    console.error('[PhotoUploadModal] ❌ Blob muy pequeño:', blob.size, 'bytes')
    errorMessage.value = 'Error procesando imagen. El archivo resultante es inválido. Intenta de nuevo.'
    currentStep.value = 'select'
    return
  }
  
  croppedImage.value = blob
  currentStep.value = 'confirm'
}

const resetToSelect = () => {
  console.log('[PhotoUploadModal] 🔄 Reset a select')
  currentStep.value = 'select'
  selectedFile.value = null
  croppedImage.value = null
  errorMessage.value = null
}

const backToEdit = () => {
  console.log('[PhotoUploadModal] ⬅️ Volver a editar')
  currentStep.value = 'edit'
  croppedImage.value = null
}

// src/components/dashboard/padres/PhotoUploadModal.vue

const handleUpload = async () => {
  if (!croppedImage.value || !consentGiven.value) {
    console.warn('[PhotoUploadModal] ⚠️ Falta imagen o consentimiento')
    return
  }

  try {
    currentStep.value = 'uploading'
    
    console.log('[PhotoUploadModal] 🚀 Iniciando upload del Blob procesado:', {
      size: `${(croppedImage.value.size / 1024).toFixed(2)} KB`,
      type: croppedImage.value.type
    })
    
    // Subir blob directamente
    const photoUrl = await uploadPhoto(croppedImage.value)

    // Éxito
    console.log('[PhotoUploadModal] ✅ Upload exitoso:', photoUrl)
    
    // 🔥 FIX: Cambiar step ANTES de cerrar
    currentStep.value = 'select'
    
    alert.success(
      '¡Foto actualizada!',
      `La foto de ${props.childName} se actualizó correctamente`
    )

    emit('success', photoUrl)
    
    // 🔥 FIX: Pequeño delay para que el alert se muestre
    setTimeout(() => {
      handleClose()
    }, 100)

  } catch (error: any) {
    console.error('[PhotoUploadModal] ❌ Error en upload:', error)
    currentStep.value = 'confirm'
    alert.error(
      'Error al subir foto',
      uploadError.value || 'Ocurrió un error al subir la foto. Intenta nuevamente.'
    )
  }
}

const handleClose = () => {
  if (currentStep.value === 'uploading') {
    console.warn('[PhotoUploadModal] ⚠️ No se puede cerrar durante upload')
    return
  }
  
  console.log('[PhotoUploadModal] ❌ Cerrando modal')
  
  // Reset
  currentStep.value = 'select'
  selectedFile.value = null
  croppedImage.value = null
  consentGiven.value = false
  errorMessage.value = null
  
  isVisible.value = false
}

// Watch para reset cuando se cierra
watch(() => props.visible, (newVal) => {
  if (!newVal) {
    setTimeout(() => {
      currentStep.value = 'select'
      selectedFile.value = null
      croppedImage.value = null
      consentGiven.value = false
      errorMessage.value = null
    }, 300) // Esperar animación de cierre
  }
})
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>