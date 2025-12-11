<!-- src/components/common/DropZone.vue -->
<template>
  <div
    @drop.prevent="handleDrop"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @click="triggerFileInput"
    :class="[
      'border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200',
      isDragging 
        ? 'border-sky-500 bg-sky-50 scale-105' 
        : 'border-gray-300 hover:border-sky-400 hover:bg-gray-50'
    ]"
  >
    <!-- Icono -->
    <div class="flex justify-center mb-4">
      <PhotoIcon :class="[
        'w-16 h-16 transition-colors',
        isDragging ? 'text-sky-500' : 'text-gray-400'
      ]" />
    </div>

    <!-- Texto principal -->
    <p class="text-lg font-medium text-gray-700 mb-2">
      {{ isDragging ? '¡Suelta la foto aquí!' : 'Arrastra una foto aquí' }}
    </p>
    
    <!-- Texto secundario -->
    <p class="text-sm text-gray-500 mb-4">
      o haz clic para seleccionar
    </p>

    <!-- Info de formatos -->
    <div class="text-xs text-gray-400 space-y-1">
      <p>Formatos: JPG, PNG, WebP</p>
      <p>Tamaño máximo: {{ maxSizeMB }} MB</p>
    </div>

    <!-- Input file oculto -->
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      @change="handleFileSelect"
      class="hidden"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PhotoIcon } from '@heroicons/vue/24/outline'

interface Props {
  accept?: string
  maxSizeMB?: number
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/jpeg,image/png,image/webp',
  maxSizeMB: 10
})

const emit = defineEmits<{
  'file-selected': [file: File]
  'file-error': [error: string]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

const validateFile = (file: File): string | null => {
  // Validar tipo
  if (!props.accept.split(',').some(type => file.type === type.trim())) {
    return 'Formato de archivo no permitido. Usa JPG, PNG o WebP.'
  }

  // Validar tamaño
  const sizeMB = file.size / (1024 * 1024)
  if (sizeMB > props.maxSizeMB) {
    return `El archivo es muy grande. Máximo ${props.maxSizeMB} MB.`
  }

  return null
}

const processFile = (file: File) => {
  const error = validateFile(file)
  if (error) {
    emit('file-error', error)
  } else {
    emit('file-selected', file)
  }
}

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  const files = input.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}
</script>