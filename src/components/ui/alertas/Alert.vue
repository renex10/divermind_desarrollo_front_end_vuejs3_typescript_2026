<template>
  <!-- src\components\ui\alertas\Alert.vue -->
  <Teleport to="body">
    <div
      v-if="alert.show"
      class="fixed top-4 right-4 z-50 w-full max-w-sm"
    >
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 transform translate-y-[-100%] scale-95"
        enter-to-class="opacity-100 transform translate-y-0 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 transform translate-y-0 scale-100"
        leave-to-class="opacity-0 transform translate-y-[-20px] scale-95"
      >
        <div
          v-if="alert.show"
          role="alert"
          class="rounded-lg p-4 shadow-lg backdrop-blur-sm"
          :class="[
            backgroundClass,
            borderClass
          ]"
        >
          <div class="flex items-start gap-3">
            <!-- Icono dinámico según tipo -->
            <div class="flex-shrink-0">
              <component
                :is="iconComponent"
                class="h-6 w-6"
                :class="iconColorClass"
              />
            </div>

            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-sm" :class="titleColorClass">
                {{ alert.title }}
              </h4>
              <p class="mt-1 text-sm" :class="messageColorClass">
                {{ alert.message }}
              </p>
            </div>

            <!-- Botón de cerrar (solo para error e info) -->
            <button
              v-if="alert.type !== 'success'"
              @click="alert.close"
              class="flex-shrink-0 rounded-lg p-1.5 transition-colors duration-150"
              :class="closeButtonClass"
              type="button"
              aria-label="Cerrar alerta"
            >
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>

          <!-- Barra de progreso para alertas de éxito -->
          <div
            v-if="alert.type === 'success'"
            class="mt-3 h-1 bg-green-200 rounded-full overflow-hidden"
          >
            <div
              class="h-full bg-green-500 rounded-full transition-all duration-3000 ease-linear"
              :style="{ width: progressWidth + '%' }"
            ></div>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, onUnmounted, ref, watch } from 'vue'
import { useAlertStore } from '@/store/alertStore'

// Importar iconos desde @heroicons/vue
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon, 
  XMarkIcon 
} from '@heroicons/vue/24/outline'

const alert = useAlertStore()
const progressWidth = ref(100)
let progressInterval: number | null = null
let autoCloseTimeout: number | null = null

// Componente de icono según el tipo
const iconComponent = computed(() => {
  switch (alert.type) {
    case 'success': return CheckCircleIcon
    case 'error': return ExclamationCircleIcon
    case 'warning': return ExclamationTriangleIcon
    default: return InformationCircleIcon
  }
})

// Clases de color para el icono
const iconColorClass = computed(() => {
  switch (alert.type) {
    case 'success': return 'text-green-600'
    case 'error': return 'text-red-600'
    case 'warning': return 'text-amber-600'
    default: return 'text-blue-600'
  }
})

// Clases de fondo y borde
const backgroundClass = computed(() => {
  switch (alert.type) {
    case 'success': return 'bg-green-50 border-l-4 border-l-green-500'
    case 'error': return 'bg-red-50 border-l-4 border-l-red-500'
    case 'warning': return 'bg-amber-50 border-l-4 border-l-amber-500'
    default: return 'bg-blue-50 border-l-4 border-l-blue-500'
  }
})

// Clases de borde
const borderClass = computed(() => {
  switch (alert.type) {
    case 'success': return 'border border-green-200'
    case 'error': return 'border border-red-200'
    case 'warning': return 'border border-amber-200'
    default: return 'border border-blue-200'
  }
})

// Clases de color para el título
const titleColorClass = computed(() => {
  switch (alert.type) {
    case 'success': return 'text-green-800'
    case 'error': return 'text-red-800'
    case 'warning': return 'text-amber-800'
    default: return 'text-blue-800'
  }
})

// Clases de color para el mensaje
const messageColorClass = computed(() => {
  switch (alert.type) {
    case 'success': return 'text-green-700'
    case 'error': return 'text-red-700'
    case 'warning': return 'text-amber-700'
    default: return 'text-blue-700'
  }
})

// Clases para el botón de cerrar
const closeButtonClass = computed(() => {
  switch (alert.type) {
    case 'error': return 'text-red-400 hover:text-red-600 hover:bg-red-100'
    case 'warning': return 'text-amber-400 hover:text-amber-600 hover:bg-amber-100'
    default: return 'text-blue-400 hover:text-blue-600 hover:bg-blue-100'
  }
})

// Auto-cerrar alertas de éxito después de 3 segundos
const startAutoClose = () => {
  if (alert.type === 'success') {
    progressWidth.value = 100
    
    // Animación de la barra de progreso
    progressInterval = setInterval(() => {
      progressWidth.value -= 100 / 30 // 30 frames en 3 segundos
      if (progressWidth.value <= 0) {
        progressWidth.value = 0
        if (progressInterval) clearInterval(progressInterval)
      }
    }, 100)

    // Auto-cerrar después de 3 segundos
    autoCloseTimeout = setTimeout(() => {
      alert.close()
    }, 3000)
  }
}

// Limpiar timeouts
const clearTimeouts = () => {
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
  if (autoCloseTimeout) {
    clearTimeout(autoCloseTimeout)
    autoCloseTimeout = null
  }
}

// Watch para detectar cuando se muestra una nueva alerta
watch(() => alert.show, (newValue) => {
  if (newValue) {
    clearTimeouts()
    startAutoClose()
  } else {
    clearTimeouts()
  }
})

// Limpiar al desmontar el componente
onUnmounted(() => {
  clearTimeouts()
})
</script>

<style scoped>
.transition-all {
  transition-property: all;
}

.duration-3000 {
  transition-duration: 3000ms;
}
</style>