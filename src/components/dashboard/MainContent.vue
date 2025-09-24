<template>
 <!--  ruta de este archivo src\components\dashboard\MainContent.vue -->
  <main class="flex-1 overflow-hidden">
    <!-- Contenedor principal con transiciones suaves -->
    <div class="h-full flex flex-col">
      
      <!-- Breadcrumb opcional -->
      <div v-if="showBreadcrumb" class="px-4 py-2 bg-gray-50 border-b border-gray-200">
        <nav class="flex items-center space-x-2 text-sm">
          <router-link to="/" class="text-blue-600 hover:text-blue-800 transition-colors duration-150">
            Inicio
          </router-link>
          <ChevronRightIcon class="h-4 w-4 text-gray-400" />
          <span class="text-gray-600">{{ currentPage }}</span>
        </nav>
      </div>

      <!-- Área de contenido adaptable -->
      <div class="flex-1 overflow-y-auto bg-gray-50">
        <div class="min-h-full">
          
          <!-- Contenedor responsive -->
          <div class="container mx-auto px-4 py-6 lg:px-6 xl:px-8">
            
            <!-- Header de página con animación -->
            <Transition
              enter-active-class="transition ease-out duration-300"
              enter-from-class="opacity-0 translate-y-4"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-200"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-4"
              mode="out-in"
            >
              <div :key="$route.name" class="mb-6">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div class="mb-4 sm:mb-0">
                    <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">
                      {{ pageTitle }}
                    </h1>
                    <p v-if="pageDescription" class="mt-1 text-gray-600">
                      {{ pageDescription }}
                    </p>
                  </div>
                  
                  <!-- Acciones de página -->
                  <div v-if="$slots.actions" class="flex items-center space-x-3">
                    <slot name="actions" />
                  </div>
                </div>
              </div>
            </Transition>

            <!-- Contenido principal con transición -->
            <Transition
              enter-active-class="transition ease-out duration-300 delay-75"
              enter-from-class="opacity-0 translate-y-4"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-200"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-4"
              mode="out-in"
            >
              <div :key="$route.path" class="space-y-6">
                
                <!-- Grid adaptable para contenido -->
                <div class="grid grid-cols-1 gap-6" 
                     :class="gridClasses">
                  
                  <!-- Slot principal para el contenido -->
                  <div class="space-y-6">
                    <slot />
                  </div>
                  
                  <!-- Sidebar opcional -->
                  <div v-if="$slots.sidebar" class="space-y-6">
                    <slot name="sidebar" />
                  </div>
                </div>
                
                <!-- Área inferior opcional -->
                <div v-if="$slots.footer" class="mt-8 pt-6 border-t border-gray-200">
                  <slot name="footer" />
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
      
      <!-- Barra de estado/progreso opcional -->
      <div v-if="$slots.statusBar" class="border-t border-gray-200 bg-white px-4 py-2">
        <slot name="statusBar" />
      </div>
    </div>

    <!-- Loading overlay -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div class="flex items-center space-x-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span class="text-gray-600">{{ loadingMessage }}</span>
        </div>
      </div>
    </Transition>
    
    <!-- Error state -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div v-if="hasError" class="absolute inset-0 bg-white flex items-center justify-center z-40">
        <div class="text-center max-w-md mx-auto px-4">
          <ExclamationTriangleIcon class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ errorTitle }}</h3>
          <p class="text-gray-600 mb-4">{{ errorMessage }}</p>
          <button @click="retryAction" 
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150">
            Reintentar
          </button>
        </div>
      </div>
    </Transition>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { ChevronRightIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

interface Props {
  showBreadcrumb?: boolean
  isLoading?: boolean
  loadingMessage?: string
  hasError?: boolean
  errorTitle?: string
  errorMessage?: string
  gridLayout?: 'single' | 'sidebar' | 'two-column' | 'three-column'
}

const props = withDefaults(defineProps<Props>(), {
  showBreadcrumb: false,
  isLoading: false,
  loadingMessage: 'Cargando...',
  hasError: false,
  errorTitle: 'Error inesperado',
  errorMessage: 'Ha ocurrido un error. Por favor, inténtalo de nuevo.',
  gridLayout: 'single'
})

const emit = defineEmits(['retry'])

const route = useRoute()

// Configuración de títulos y descripciones por página
const pageConfig = {
  'dashboard': {
    title: 'Dashboard',
    description: 'Resumen general del sistema'
  },
  'ingreso-nna': {
    title: 'Ingreso NNA',
    description: 'Registro de nuevos niños, niñas y adolescentes'
  },
  'histos': {
    title: 'Historiales',
    description: 'Historial clínico y seguimiento de casos'
  },
  'sessiones': {
    title: 'Sesiones',
    description: 'Gestión y programación de sesiones terapéuticas'
  },
  'reportes': {
    title: 'Reportes',
    description: 'Informes y estadísticas del sistema'
  },
  'configuracion': {
    title: 'Configuración',
    description: 'Ajustes y configuración del sistema'
  },
  'establecimientos': {
    title: 'Establecimientos',
    description: 'Gestión de centros educacionales'
  }
}

const currentPage = computed(() => {
  const config = pageConfig[route.name as keyof typeof pageConfig]
  return config?.title || 'Página'
})

const pageTitle = computed(() => {
  const config = pageConfig[route.name as keyof typeof pageConfig]
  return config?.title || 'Dashboard'
})

const pageDescription = computed(() => {
  const config = pageConfig[route.name as keyof typeof pageConfig]
  return config?.description || ''
})

const gridClasses = computed(() => {
  const layouts = {
    single: 'lg:grid-cols-1',
    sidebar: 'lg:grid-cols-4',
    'two-column': 'lg:grid-cols-2',
    'three-column': 'lg:grid-cols-3'
  }
  return layouts[props.gridLayout]
})

const retryAction = () => {
  emit('retry')
}

// Manejo de redimensionamiento para responsividad
const handleResize = () => {
  // Aquí puedes agregar lógica específica para el redimensionamiento
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Estilos específicos para el contenido principal */
.container {
  width: 100%;
  max-width: 1400px;
}

/* Optimización para pantallas pequeñas */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Optimización para tablets */
@media (min-width: 768px) and (max-width: 1024px) {
  .container {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

/* Optimización para televisores y pantallas grandes */
@media (min-width: 1920px) {
  .container {
    max-width: 1600px;
  }
}

/* Smooth scrolling */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f7fafc;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: #a0aec0;
}
</style>