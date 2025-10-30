<!-- src/views/dashboard/perfil_nino/RutinasView.vue -->
<template>
  <div class="rutinas-container min-h-screen bg-gray-50">
    <!-- HEADER CON ACCIONES -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between py-6">
          <div class="flex items-center space-x-4">
            <div class="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
            </div>
            
            <div>
              <h1 class="text-3xl font-bold text-gray-900">
                Rutinas Diarias
              </h1>
              <p class="text-sm text-gray-500 mt-1">
                Gestiona y monitorea las rutinas de {{ childName }}
              </p>
            </div>
          </div>

          <button
            @click="openCreateWizard"
            class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-primary-700 hover:to-primary-800 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Nueva Rutina
          </button>
        </div>
      </div>
    </div>

    <!-- TABS DE NAVEGACIÓN -->
    <div class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex space-x-1" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            @click="activeTab = tab.name"
            :class="[
              'relative px-6 py-4 font-medium text-sm rounded-t-lg transition-all duration-200',
              activeTab === tab.name
                ? 'text-primary-700 bg-gray-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            ]"
          >
            <span class="text-xl mr-2">{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
            
            <span
              v-if="tab.count !== undefined"
              :class="[
                'ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                activeTab === tab.name
                  ? 'bg-primary-100 text-primary-800'
                  : 'bg-gray-100 text-gray-600'
              ]"
            >
              {{ tab.count }}
            </span>
            
            <span
              v-if="activeTab === tab.name"
              class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 to-primary-500 rounded-t-full"
            ></span>
          </button>
        </nav>
      </div>
    </div>

    <!-- CONTENIDO DEL TAB ACTIVO -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
          <p class="mt-4 text-gray-600">Cargando rutinas...</p>
        </div>
      </div>

      <!-- Contenido -->
      <KeepAlive v-else>
        <Transition name="fade" mode="out-in">
          <component
            :is="currentTabComponent"
            :child-id="childId"
            :child-name="childName"
            @refresh="handleRefresh"
            @routine-created="handleRoutineCreated"
            @routine-updated="handleRoutineUpdated"
            @update-count="handleUpdateCount"
          />
        </Transition>
      </KeepAlive>
    </div>

    <!-- ✅ MODAL: WIZARD DE CREACIÓN (SIN TRANSITION REDUNDANTE) -->
    <Suspense v-if="showWizard">
      <template #default>
        <component
          :is="RoutineCreationWizard"
          :child-id="childId"
          :child-name="childName"
          @close="closeWizard"
          @created="handleRoutineCreated"
        />
      </template>
      <template #fallback>
        <Teleport to="body">
          <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-8">
              <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto"></div>
              <p class="mt-4 text-gray-600">Cargando wizard...</p>
            </div>
          </div>
        </Teleport>
      </template>
    </Suspense>

    <!-- TOAST NOTIFICATIONS (se mantiene igual) -->
    <Teleport to="body">
      <div class="fixed bottom-4 right-4 z-50 space-y-2">
        <TransitionGroup
          enter-active-class="transition ease-out duration-300"
          enter-from-class="transform translate-x-full opacity-0"
          enter-to-class="transform translate-x-0 opacity-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="transform translate-x-0 opacity-100"
          leave-to-class="transform translate-x-full opacity-0"
        >
          <div
            v-for="notification in notifications"
            :key="notification.id"
            :class="[
              'max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden',
              getNotificationStyles(notification.type)
            ]"
          >
            <div class="p-4">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg 
                    v-if="notification.type === 'success'" 
                    class="h-6 w-6 text-green-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <svg 
                    v-else-if="notification.type === 'error'" 
                    class="h-6 w-6 text-red-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <svg 
                    v-else 
                    class="h-6 w-6 text-blue-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-3 w-0 flex-1">
                  <p class="text-sm font-medium text-gray-900">
                    {{ notification.title }}
                  </p>
                  <p v-if="notification.message" class="mt-1 text-sm text-gray-500">
                    {{ notification.message }}
                  </p>
                </div>
                <div class="ml-4 flex-shrink-0 flex">
                  <button
                    @click="removeNotification(notification.id)"
                    class="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useNinoActivoStore } from '@/store/ninoActivoStore'

// LAZY LOADING DE SUB-VISTAS con loading component
const createAsyncComponent = (loader) => {
  return defineAsyncComponent({
    loader,
    loadingComponent: {
      template: `
        <div class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            <p class="mt-4 text-gray-600">Cargando vista...</p>
          </div>
        </div>
      `
    },
    errorComponent: {
      template: `
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p class="text-red-600 font-medium">Error al cargar la vista</p>
          <p class="text-red-500 text-sm mt-2">Por favor, recarga la página</p>
        </div>
      `
    },
    delay: 200,
    timeout: 10000
  })
}

const RutinasAgendaView = createAsyncComponent(() =>
  import('./rutinas/RutinasAgendaView.vue')
)
const RutinasListView = createAsyncComponent(() =>
  import('./rutinas/RutinasListView.vue')
)
const RutinasAnalyticsView = createAsyncComponent(() =>
  import('./rutinas/RutinasAnalyticsView.vue')
)
const RutinasComparisonView = createAsyncComponent(() =>
  import('./rutinas/RutinasComparisonView.vue')
)

const RoutineCreationWizard = defineAsyncComponent({
  loader: () => import('@/components/gestion/rutinas/wizard/RoutineCreationWizard.vue'),
  errorComponent: {
    template: '<div class="p-4 bg-red-50 text-red-600 rounded">Error al cargar wizard</div>'
  }
})

// PROPS Y ROUTER
const route = useRoute()
const childId = computed(() => parseInt(route.params.id))
const ninoStore = useNinoActivoStore()
const childName = computed(() => ninoStore.nombreNino || 'Cargando...')

// STORE DE RUTINAS - Intento de carga opcional
let routinesStore = null
try {
  // Descomenta cuando el store exista:
  // const { useRoutinesStore } = await import('@/store/rutinas/routinesStore')
  // routinesStore = useRoutinesStore()
} catch (error) {
  console.info('Store de rutinas no disponible, usando modo local')
}

// STATE
const activeTab = ref('agenda')
const showWizard = ref(false)
const isLoading = ref(false)
const notifications = ref([])
const routineCount = ref(0) // Contador local

// CONFIGURACIÓN DE TABS
const tabs = computed(() => [
  {
    name: 'agenda',
    label: 'Agenda Hoy',
    icon: '📅',
    count: undefined
  },
  {
    name: 'list',
    label: 'Mis Rutinas',
    icon: '📋',
    count: routinesStore?.activeRoutines?.length ?? routineCount.value
  },
  {
    name: 'analytics',
    label: 'Análisis',
    icon: '📊',
    count: undefined
  },
  {
    name: 'comparison',
    label: 'Comparar',
    icon: '⚖️',
    count: undefined
  }
])

// COMPONENTE DINÁMICO SEGÚN TAB
const currentTabComponent = computed(() => {
  const componentMap = {
    agenda: RutinasAgendaView,
    list: RutinasListView,
    analytics: RutinasAnalyticsView,
    comparison: RutinasComparisonView
  }
  return componentMap[activeTab.value]
})

// MÉTODOS
const openCreateWizard = () => {
  showWizard.value = true
}

const closeWizard = () => {
  showWizard.value = false
}

const handleRoutineCreated = (routine) => {
  showWizard.value = false
  
  addNotification({
    type: 'success',
    title: 'Rutina creada',
    message: `"${routine?.name || 'La rutina'}" se creó exitosamente`
  })
  
  activeTab.value = 'list'
  loadRoutines()
}

const handleRoutineUpdated = () => {
  addNotification({
    type: 'success',
    title: 'Rutina actualizada',
    message: 'Los cambios se guardaron correctamente'
  })
  
  loadRoutines()
}

const handleRefresh = () => {
  loadRoutines()
}

// Nuevo: handler para actualizar contador desde sub-vistas
const handleUpdateCount = (count) => {
  routineCount.value = count
}

const loadRoutines = async () => {
  // Si hay store, úsalo
  if (routinesStore?.fetchRoutines) {
    isLoading.value = true
    try {
      await routinesStore.fetchRoutines(childId.value)
      routineCount.value = routinesStore.activeRoutines?.length || 0
    } catch (error) {
      console.error('Error cargando rutinas:', error)
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudieron cargar las rutinas'
      })
    } finally {
      isLoading.value = false
    }
  } else {
    // Si no hay store, las sub-vistas manejan sus propios datos
    console.info('Usando datos locales de sub-vistas')
  }
}

// SISTEMA DE NOTIFICACIONES
let notificationId = 0

const addNotification = ({ type, title, message }) => {
  const id = ++notificationId
  notifications.value.push({ id, type, title, message })
  
  setTimeout(() => {
    removeNotification(id)
  }, 5000)
}

const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index !== -1) {
    notifications.value.splice(index, 1)
  }
}

const getNotificationStyles = (type) => {
  const styles = {
    success: 'border-l-4 border-green-500',
    error: 'border-l-4 border-red-500',
    warning: 'border-l-4 border-yellow-500',
    info: 'border-l-4 border-blue-500'
  }
  return styles[type] || styles.info
}

// LIFECYCLE HOOKS
onMounted(async () => {
  await loadRoutines()
})

watch(() => childId.value, async (newId) => {
  if (newId) {
    await loadRoutines()
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.rutinas-container ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.rutinas-container ::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded;
}

.rutinas-container ::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded hover:bg-gray-400;
}
</style>