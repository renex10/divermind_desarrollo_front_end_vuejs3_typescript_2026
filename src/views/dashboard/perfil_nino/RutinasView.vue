<!-- src\views\dashboard\perfil_nino\RutinasView.vue -->
<template>
  <div class="rutinas-container min-h-screen bg-gray-50 flex flex-col">
    <!-- Header Responsivo -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm flex-shrink-0">
      <div class="container-responsive">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 sm:py-4 lg:py-6 gap-3 sm:gap-4">
          <!-- Title Section -->
          <div class="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
            <div class="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200 flex-shrink-0">
              <ClipboardDocumentListIcon class="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            
            <div class="flex-1 min-w-0">
              <h1 class="text-responsive-2xl font-black text-gray-900 tracking-tight truncate">
                Rutinas Diarias
              </h1>
              <p class="text-responsive-sm text-gray-500 mt-0.5 font-medium truncate">
                Gestiona rutinas de <span class="text-primary-600 font-bold">{{ childName }}</span>
              </p>
            </div>
          </div>

          <!-- Action Button -->
          <button
            @click="openCreateWizard"
            class="btn-primary-gradient w-full sm:w-auto"
          >
            <PlusIcon class="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 stroke-[3]" />
            <span class="text-xs sm:text-sm">Nueva Rutina</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Tabs Responsivos -->
    <div class="bg-white border-b border-gray-200 shadow-sm sticky top-[65px] sm:top-[81px] lg:top-[105px] z-30">
      <div class="container-responsive">
        <!-- Tabs Desktop/Tablet -->
        <nav class="hidden sm:flex space-x-1 lg:space-x-2" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            @click="changeTab(tab.name)"
            :class="[
              'relative px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 font-bold text-xs sm:text-sm transition-all duration-300 flex items-center gap-1.5 sm:gap-2',
              activeTab === tab.name
                ? 'text-primary-700 bg-primary-50/50'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            ]"
          >
            <span class="text-base sm:text-lg lg:text-xl">{{ tab.icon }}</span>
            <span class="hidden md:inline">{{ tab.label }}</span>
            <span class="md:hidden">{{ tab.shortLabel || tab.label }}</span>
            
            <span
              v-if="tab.count !== undefined"
              :class="[
                'ml-1 sm:ml-2 inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider',
                activeTab === tab.name
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-500'
              ]"
            >
              {{ tab.count }}
            </span>
            
            <span
              v-if="activeTab === tab.name"
              class="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-primary-600 rounded-t-full shadow-[0_-2px_10px_rgba(79,70,229,0.4)]"
            ></span>
          </button>
        </nav>

        <!-- Tabs Móvil (Selector desplegable) -->
        <div class="sm:hidden py-2">
          <select
            v-model="activeTab"
            @change="changeTab(activeTab)"
            class="w-full px-4 py-2.5 text-sm font-bold bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          >
            <option
              v-for="tab in tabs"
              :key="tab.name"
              :value="tab.name"
            >
              {{ tab.icon }} {{ tab.label }}
              <template v-if="tab.count !== undefined">({{ tab.count }})</template>
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 w-full mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 overflow-y-auto custom-scrollbar">
      
      <!-- Loading State -->
      <div v-if="routinesStore.loading" class="flex flex-col items-center justify-center py-16 sm:py-24 animate-pulse">
        <div class="relative w-12 h-12 sm:w-16 sm:h-16">
          <div class="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p class="mt-4 sm:mt-6 text-gray-500 font-bold text-xs sm:text-sm uppercase tracking-widest text-center px-4">
          Sincronizando con Divermind AI...
        </p>
      </div>

      <!-- Tab Content -->
      <KeepAlive v-else>
        <Transition name="fade-slide" mode="out-in">
          <component
            :is="currentTabComponent"
            :child-id="childId"
            :child-name="childName"
            :routines="routinesStore.routines"
            :loading="routinesStore.loading"
            @refresh="loadRoutines"
            @create-routine="openCreateWizard"
            @routine-updated="loadRoutines"
          />
        </Transition>
      </KeepAlive>
    </main>

    <!-- Wizard Modal -->
    <Suspense v-if="showWizard">
      <template #default>
        <RoutineCreationWizard
          :child-id="childId"
          :child-name="childName"
          @close="closeWizard"
          @created="handleRoutineCreated"
        />
      </template>
      <template #fallback>
        <Teleport to="body">
          <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col items-center max-w-sm w-full">
              <div class="w-10 h-10 sm:w-12 sm:h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <p class="mt-3 sm:mt-4 text-gray-900 font-black text-sm sm:text-base text-center">
                Preparando Asistente...
              </p>
            </div>
          </div>
        </Teleport>
      </template>
    </Suspense>

    <!-- Toast Notifications -->
    <Teleport to="body">
      <div class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] flex flex-col gap-2 sm:gap-3 max-w-[calc(100vw-2rem)] sm:max-w-md">
        <TransitionGroup name="toast">
          <div
            v-for="n in notifications" 
            :key="n.id"
            :class="['toast-card', getNotificationStyles(n.type)]"
          >
            <div class="flex items-center gap-3 sm:gap-4">
              <div :class="['p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/20 shadow-sm flex-shrink-0']">
                <CheckCircleIcon v-if="n.type === 'success'" class="w-5 h-5 sm:w-6 sm:h-6" />
                <ExclamationTriangleIcon v-else class="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-black text-xs sm:text-sm uppercase tracking-tight truncate">{{ n.title }}</p>
                <p class="text-[10px] sm:text-xs font-medium opacity-90 truncate">{{ n.message }}</p>
              </div>
              <button 
                @click="removeNotification(n.id)" 
                class="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              >
                <XMarkIcon class="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNinoActivoStore } from '@/store/ninoActivoStore'
import { useRoutinesStore } from '@/store/rutinas/routinesStore'
import { 
  ClipboardDocumentListIcon, PlusIcon, XMarkIcon, 
  CheckCircleIcon, ExclamationTriangleIcon 
} from '@heroicons/vue/24/outline'

// LAZY LOADING DE VISTAS
const RutinasAgendaView = defineAsyncComponent(() => import('./rutinas/RutinasAgendaView.vue'))
const RutinasListView = defineAsyncComponent(() => import('./rutinas/RutinasListView.vue'))
const RutinasAnalyticsView = defineAsyncComponent(() => import('./rutinas/RutinasAnalyticsView.vue'))
const RutinasComparisonView = defineAsyncComponent(() => import('./rutinas/RutinasComparisonView.vue'))

const RoutineCreationWizard = defineAsyncComponent(() => 
  import('@/components/gestion/rutinas/wizard/RoutineCreationWizard.vue')
)

// STORES Y CONFIGURACIÓN
const route = useRoute()
const router = useRouter()
const ninoStore = useNinoActivoStore()
const routinesStore = useRoutinesStore()

const childId = computed(() => parseInt(route.params.id))
const childName = computed(() => ninoStore.nombreNino || 'Cargando...')

// ✅ PERSISTENCIA DEL TAB ACTIVO
const TAB_STORAGE_KEY = `rutinas_tab_${childId.value}`

// Inicializar desde query param, localStorage o default
const getInitialTab = () => {
  // Prioridad 1: Query parameter
  if (route.query.tab) {
    return route.query.tab
  }
  
  // Prioridad 2: localStorage
  const savedTab = localStorage.getItem(TAB_STORAGE_KEY)
  if (savedTab) {
    return savedTab
  }
  
  // Prioridad 3: Default
  return 'agenda'
}

const activeTab = ref(getInitialTab())
const showWizard = ref(false)
const notifications = ref([])

// TABS CONFIGURACIÓN
const tabs = computed(() => [
  { 
    name: 'agenda', 
    label: 'Agenda Hoy', 
    shortLabel: 'Agenda',
    icon: '📅' 
  },
  { 
    name: 'list', 
    label: 'Mis Rutinas', 
    shortLabel: 'Rutinas',
    icon: '📋', 
    count: routinesStore.routines.length
  },
  { 
    name: 'analytics', 
    label: 'Análisis', 
    icon: '📊' 
  },
  { 
    name: 'comparison', 
    label: 'Comparar', 
    icon: '⚖️' 
  }
])

const currentTabComponent = computed(() => {
  const map = {
    agenda: RutinasAgendaView,
    list: RutinasListView,
    analytics: RutinasAnalyticsView,
    comparison: RutinasComparisonView
  }
  return map[activeTab.value]
})

// ✅ CAMBIAR TAB CON PERSISTENCIA
const changeTab = (tabName) => {
  activeTab.value = tabName
  
  // Guardar en localStorage
  localStorage.setItem(TAB_STORAGE_KEY, tabName)
  
  // Actualizar URL sin recargar
  router.replace({ 
    query: { ...route.query, tab: tabName }
  })
}

// ✅ SINCRONIZAR TAB AL CAMBIAR DE NIÑO
watch(() => childId.value, () => {
  const newStorageKey = `rutinas_tab_${childId.value}`
  const savedTab = localStorage.getItem(newStorageKey)
  
  if (savedTab) {
    activeTab.value = savedTab
  } else {
    activeTab.value = 'agenda'
  }
  
  loadRoutines()
})

// MÉTODOS DE DATOS
const loadRoutines = async () => {
  if (!childId.value) return
  try {
    await routinesStore.fetchRoutines(childId.value, { status: 'all' })
  } catch (err) {
    addNotification({ 
      type: 'error', 
      title: 'Error de Red', 
      message: 'No se pudo sincronizar la biblioteca.' 
    })
  }
}

const handleRoutineCreated = async (routine) => {
  showWizard.value = false
  addNotification({
    type: 'success',
    title: '¡Rutina Lista!',
    message: `"${routine?.name}" se ha añadido a la biblioteca.`
  })
  changeTab('list') // Usar changeTab en lugar de asignación directa
  await loadRoutines()
}

// GESTIÓN DE MODALES
const openCreateWizard = () => { showWizard.value = true }
const closeWizard = () => { showWizard.value = false }

// SISTEMA DE TOASTS
let nId = 0
const addNotification = (n) => {
  const id = ++nId
  notifications.value.push({ ...n, id })
  setTimeout(() => removeNotification(id), 5000)
}
const removeNotification = (id) => {
  notifications.value = notifications.value.filter(n => n.id !== id)
}
const getNotificationStyles = (type) => {
  return type === 'success' 
    ? 'bg-emerald-600 text-white shadow-emerald-200' 
    : 'bg-red-600 text-white shadow-red-200'
}

// INICIO
onMounted(() => {
  loadRoutines()
  
  // Asegurar que el query param esté en sync
  if (activeTab.value !== route.query.tab) {
    router.replace({ 
      query: { ...route.query, tab: activeTab.value }
    })
  }
})
</script>

<style scoped>
/* Botones Responsivos */
.btn-primary-gradient {
  @apply inline-flex items-center justify-center px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3.5;
  @apply bg-gradient-to-r from-primary-600 to-primary-700 text-white font-black;
  @apply rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl shadow-primary-200;
  @apply hover:scale-105 active:scale-95 transition-all duration-300;
  @apply text-xs sm:text-sm lg:text-base;
}

/* Scrollbar Personalizada */
.custom-scrollbar::-webkit-scrollbar { 
  width: 4px; 
}
.custom-scrollbar::-webkit-scrollbar-track { 
  background: transparent; 
}
.custom-scrollbar::-webkit-scrollbar-thumb { 
  background: #e2e8f0; 
  border-radius: 10px; 
}

/* Transiciones de Vista */
.fade-slide-enter-active, 
.fade-slide-leave-active { 
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
}
.fade-slide-enter-from { 
  opacity: 0; 
  transform: translateY(20px); 
}
.fade-slide-leave-to { 
  opacity: 0; 
  transform: translateY(-20px); 
}

/* Toast Cards Responsivos */
.toast-card {
  @apply min-w-0 w-full sm:min-w-[320px] p-3 sm:p-5;
  @apply rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl;
  @apply animate-fade-in pointer-events-auto;
}

.toast-enter-active { 
  animation: toast-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); 
}
.toast-leave-active { 
  animation: toast-in 0.3s reverse ease-in; 
}

@keyframes toast-in {
  from { 
    transform: translateX(100%); 
    opacity: 0; 
  }
  to { 
    transform: translateX(0); 
    opacity: 1; 
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .rutinas-container {
    min-height: 100vh;
    min-height: 100dvh; /* Para móviles con barra de navegación */
  }
}
</style>