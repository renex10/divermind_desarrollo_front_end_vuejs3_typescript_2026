<!-- src/components/common/PhotoUploadButton.vue -->
<template>
  <button
    :class="buttonClasses"
    :disabled="loading"
    @click="handleClick"
    :title="tooltip"
  >
    <!-- Icono dinámico -->
    <component
      :is="loading ? ArrowPathIcon : CameraIcon"
      :class="[
        'transition-transform duration-200',
        iconSizeClass,
        loading && 'animate-spin'
      ]"
    />
    
    <!-- Label (solo si no es variant icon) -->
    <span v-if="variant !== 'icon' && label" class="font-medium">
      {{ loading ? loadingText : label }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CameraIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

interface Props {
  variant?: 'primary' | 'secondary' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  label?: string
  loadingText?: string
  loading?: boolean
  tooltip?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  label: 'Cambiar foto',
  loadingText: 'Subiendo...',
  loading: false,
  tooltip: 'Subir foto de perfil'
})

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  if (!props.loading) {
    emit('click')
  }
}

// Clases dinámicas según variant
const buttonClasses = computed(() => {
  const base = [
    'inline-flex items-center justify-center gap-2',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  ]

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-5 py-3 text-lg rounded-xl'
  }

  const variants = {
    primary: [
      'bg-gradient-to-r from-sky-500 to-blue-600',
      'text-white font-medium shadow-md',
      'hover:from-sky-600 hover:to-blue-700 hover:shadow-lg hover:scale-105',
      'focus:ring-sky-500'
    ],
    secondary: [
      'bg-white text-gray-700 border-2 border-gray-300',
      'hover:bg-gray-50 hover:border-sky-500 hover:text-sky-600',
      'focus:ring-gray-400'
    ],
    icon: [
      'w-10 h-10 rounded-full',
      'bg-white/90 backdrop-blur-sm text-gray-700',
      'hover:bg-sky-500 hover:text-white hover:scale-110',
      'shadow-md hover:shadow-lg',
      'focus:ring-sky-500'
    ]
  }

  return [
    ...base,
    sizes[props.size],
    ...(props.variant === 'icon' ? variants.icon : variants[props.variant])
  ]
})

const iconSizeClass = computed(() => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  return sizes[props.size]
})
</script>