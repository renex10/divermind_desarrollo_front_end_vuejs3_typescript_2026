<!-- src/components/ui/alertas/AlertModal.vue -->
<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="state.isOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
        @click.self="state.showCloseButton ? close() : null"
      >
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 transform scale-95 translate-y-4"
          enter-to-class="opacity-100 transform scale-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 transform scale-100 translate-y-0"
          leave-to-class="opacity-0 transform scale-95 translate-y-4"
        >
          <div 
            class="w-full max-w-md rounded-lg shadow-xl"
            :class="modalClasses"
          >
            <!-- Header -->
            <div class="flex items-center p-4 border-b" :class="headerClasses">
              <div class="flex items-center justify-center w-10 h-10 rounded-full" :class="iconContainerClasses">
                <component :is="iconComponent" class="w-6 h-6" :class="iconClasses" />
              </div>
              <h3 class="ml-3 text-lg font-semibold" :class="titleClasses">
                {{ state.title }}
              </h3>
              <button
                v-if="state.showCloseButton"
                @click="close"
                class="ml-auto rounded-lg p-1.5 transition-colors duration-150"
                :class="closeButtonClasses"
                type="button"
                aria-label="Cerrar modal"
              >
                <XMarkIcon class="w-5 h-5" />
              </button>
            </div>

            <!-- Content -->
            <div class="p-4">
              <p class="text-sm" :class="messageClasses">
                {{ state.message }}
              </p>
            </div>

            <!-- Actions -->
            <div v-if="state.actions.length > 0" class="flex justify-end gap-3 p-4 border-t" :class="footerClasses">
              <button
                v-for="(action, index) in state.actions"
                :key="index"
                @click="action.handler"
                class="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2"
                :class="getButtonClasses(action.variant)"
                type="button"
              >
                {{ action.label }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAlertModalStore, type AlertModalType } from '@/store/alertModalStore'
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon, 
  XMarkIcon 
} from '@heroicons/vue/24/outline'

const alertModalStore = useAlertModalStore()
const { state, close } = alertModalStore

// Icono según el tipo
const iconComponent = computed(() => {
  const icons: Record<AlertModalType, any> = {
    success: CheckCircleIcon,
    error: ExclamationCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon
  }
  return icons[state.type]
})

// Clases dinámicas basadas en el tipo
const modalClasses = computed(() => {
  const base = 'bg-white'
  return base
})

const headerClasses = computed(() => {
  const classes: Record<AlertModalType, string> = {
    success: 'border-green-200',
    error: 'border-red-200',
    warning: 'border-yellow-200',
    info: 'border-blue-200'
  }
  return classes[state.type]
})

const iconContainerClasses = computed(() => {
  const classes: Record<AlertModalType, string> = {
    success: 'bg-green-100',
    error: 'bg-red-100',
    warning: 'bg-yellow-100',
    info: 'bg-blue-100'
  }
  return classes[state.type]
})

const iconClasses = computed(() => {
  const classes: Record<AlertModalType, string> = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  }
  return classes[state.type]
})

const titleClasses = computed(() => {
  const classes: Record<AlertModalType, string> = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800'
  }
  return classes[state.type]
})

const messageClasses = computed(() => {
  const classes: Record<AlertModalType, string> = {
    success: 'text-green-700',
    error: 'text-red-700',
    warning: 'text-yellow-700',
    info: 'text-blue-700'
  }
  return classes[state.type]
})

const footerClasses = computed(() => {
  const classes: Record<AlertModalType, string> = {
    success: 'border-green-200',
    error: 'border-red-200',
    warning: 'border-yellow-200',
    info: 'border-blue-200'
  }
  return classes[state.type]
})

const closeButtonClasses = computed(() => {
  const classes: Record<AlertModalType, string> = {
    success: 'text-green-400 hover:text-green-600 hover:bg-green-100',
    error: 'text-red-400 hover:text-red-600 hover:bg-red-100',
    warning: 'text-yellow-400 hover:text-yellow-600 hover:bg-yellow-100',
    info: 'text-blue-400 hover:text-blue-600 hover:bg-blue-100'
  }
  return classes[state.type]
})

const getButtonClasses = (variant: string = 'primary') => {
  const base = 'px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: {
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
      error: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
      info: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
    },
    secondary: {
      success: 'bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500',
      error: 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500',
      warning: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus:ring-yellow-500',
      info: 'bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-blue-500'
    },
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  }

  if (variant === 'danger') {
    return `${base} ${variants.danger}`
  }

  const typeVariant = variants[variant as keyof typeof variants]
  return `${base} ${typeVariant[state.type]}`
}
</script>

<style scoped>
/* Animaciones personalizadas */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Asegurar que el modal esté por encima de otros modales */
.z-50 {
  z-index: 9999;
}

/* Mejoras de accesibilidad */
button:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* Transiciones suaves */
.transition-all {
  transition-property: all;
}

.duration-300 {
  transition-duration: 300ms;
}

.duration-200 {
  transition-duration: 200ms;
}
</style>