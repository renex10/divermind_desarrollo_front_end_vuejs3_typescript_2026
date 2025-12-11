<!-- src/components/common/ImageCropper.vue -->
<template>
  <div class="image-cropper-container">
    
    <!-- CROPPER -->
    <div class="cropper-wrapper">
      <Cropper
        ref="cropperRef"
        class="cropper"
        :src="imageUrl"
        :stencil-props="{
          aspectRatio: aspectRatio,
          movable: true,
          resizable: true,
        }"
        :stencil-component="stencilComponent"
        :canvas="{
          minWidth: minWidth,
          minHeight: minHeight,
          maxWidth: maxWidth,
          maxHeight: maxHeight
        }"
        image-restriction="stencil"
      />
    </div>
    
    <!-- CONTROLES -->
    <div class="controls-wrapper">
      
      <!-- Zoom -->
      <div class="control-group">
        <label class="control-label">🔍 Zoom</label>
        <div class="flex items-center gap-3">
          <button @click="zoomOut" class="control-btn" :disabled="isProcessing" type="button">
            <MinusIcon class="w-4 h-4" />
          </button>
          <div class="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              class="bg-sky-500 h-2 rounded-full transition-all"
              :style="{ width: `${zoom}%` }"
            ></div>
          </div>
          <button @click="zoomIn" class="control-btn" :disabled="isProcessing" type="button">
            <PlusIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <!-- Rotación -->
      <div class="control-group">
        <label class="control-label">🔄 Rotar</label>
        <div class="flex gap-2">
          <button @click="rotate(-90)" class="control-btn flex-1" :disabled="isProcessing" type="button">
            <ArrowPathIcon class="w-4 h-4 transform rotate-180" />
            <span class="ml-1">90° ←</span>
          </button>
          <button @click="rotate(90)" class="control-btn flex-1" :disabled="isProcessing" type="button">
            <span class="mr-1">90° →</span>
            <ArrowPathIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <!-- Reset -->
      <button @click="reset" class="reset-btn" :disabled="isProcessing" type="button">
        <ArrowPathIcon class="w-4 h-4" />
        Restablecer
      </button>
      
    </div>
    
    <!-- FOOTER ACTIONS -->
    <div class="footer-actions">
      <button @click="handleCancel" class="btn-cancel" :disabled="isProcessing" type="button">
        Cancelar
      </button>
      <button @click="handleContinue" class="btn-continue" :disabled="isProcessing" type="button">
        <span v-if="isProcessing">Procesando...</span>
        <span v-else>Continuar →</span>
      </button>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Cropper, CircleStencil, RectangleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { MinusIcon, PlusIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

interface Props {
  imageFile: File
  aspectRatio?: number
  cropShape?: 'circle' | 'rect'
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  aspectRatio: 1,
  cropShape: 'circle',
  minWidth: 150,
  minHeight: 150,
  maxWidth: 1200,
  maxHeight: 1200
})

const emit = defineEmits<{
  'crop-complete': [blob: Blob]
  'cancel': []
}>()

// Refs
const cropperRef = ref<any>(null)
const imageUrl = ref<string>('')
const zoom = ref(50)
const isProcessing = ref(false)

// Computed
const stencilComponent = computed(() => {
  return props.cropShape === 'circle' ? CircleStencil : RectangleStencil
})

// Métodos
const zoomIn = () => {
  if (cropperRef.value) {
    cropperRef.value.zoom(1.2)
    zoom.value = Math.min(zoom.value + 10, 100)
  }
}

const zoomOut = () => {
  if (cropperRef.value) {
    cropperRef.value.zoom(0.8)
    zoom.value = Math.max(zoom.value - 10, 0)
  }
}

const rotate = (degrees: number) => {
  if (cropperRef.value) {
    cropperRef.value.rotate(degrees)
  }
}

const reset = () => {
  if (cropperRef.value) {
    cropperRef.value.reset()
    zoom.value = 50
  }
}

const handleCancel = () => {
  console.log('[ImageCropper] ❌ Cancelando')
  emit('cancel')
}

const handleContinue = async () => {
  if (!cropperRef.value) {
    console.error('[ImageCropper] ❌ Cropper ref no disponible')
    return
  }
  
  try {
    isProcessing.value = true
    
    console.log('[ImageCropper] 🔄 Obteniendo resultado...')
    
    const { canvas } = cropperRef.value.getResult()
    
    if (!canvas) {
      throw new Error('No se pudo obtener canvas del cropper')
    }
    
    // Convertir canvas a Blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b: Blob | null) => {
          if (b) {
            console.log('[ImageCropper] ✅ Blob creado:', {
              size: `${(b.size / 1024).toFixed(2)} KB`,
              type: b.type
            })
            resolve(b)
          } else {
            reject(new Error('No se pudo crear Blob desde canvas'))
          }
        },
        'image/jpeg',
        0.85
      )
    })
    
    emit('crop-complete', blob)
    
  } catch (error) {
    console.error('[ImageCropper] ❌ Error obteniendo resultado:', error)
    alert('Error al procesar la imagen. Intenta de nuevo.')
  } finally {
    isProcessing.value = false
  }
}

// Lifecycle
onMounted(() => {
  imageUrl.value = URL.createObjectURL(props.imageFile)
  console.log('[ImageCropper] ✅ Montado, URL creada')
})

onUnmounted(() => {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value)
    console.log('[ImageCropper] 🗑️ URL revocada')
  }
})
</script>

<style scoped>
.image-cropper-container {
  @apply space-y-6;
}

.cropper-wrapper {
  @apply relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200;
}

.cropper {
  @apply w-full h-full;
}

/* Estilo para crop circular */
:deep(.vue-circle-stencil) {
  border-radius: 50%;
}

.controls-wrapper {
  @apply space-y-4 p-4 bg-gray-50 rounded-lg;
}

.control-group {
  @apply space-y-2;
}

.control-label {
  @apply text-sm font-medium text-gray-700;
}

.control-btn {
  @apply p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-sky-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center;
}

.reset-btn {
  @apply w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 hover:border-sky-500 text-gray-700 rounded-lg transition-all;
}

.footer-actions {
  @apply flex gap-3 pt-4 border-t;
}

.btn-cancel {
  @apply flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50;
}

.btn-continue {
  @apply flex-1 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>