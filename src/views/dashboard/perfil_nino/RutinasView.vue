<template>
  <div class="rutinas-container min-h-screen bg-gray-50 flex flex-col">
    <header class="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm flex-shrink-0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between py-6">
          <div class="flex items-center space-x-4">
            <div class="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200">
              <ClipboardDocumentListIcon class="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h1 class="text-3xl font-black text-gray-900 tracking-tight">
                Rutinas Diarias
              </h1>
              <p class="text-sm text-gray-500 mt-0.5 font-medium">
                Gestiona y monitorea las rutinas de <span class="text-primary-600 font-bold">{{ childName }}</span>
              </p>
            </div>
          </div>

          <button
            @click="openCreateWizard"
            class="btn-primary-gradient"
          >
            <PlusIcon class="w-5 h-5 mr-2 stroke-[3]" />
            Nueva Rutina
          </button>
        </div>
      </div>
    </header>

    <div class="bg-white border-b border-gray-200 shadow-sm sticky top-[105px] z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex space-x-2" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            @click="activeTab = tab.name"
            :class="[
              'relative px-6 py-4 font-bold text-sm transition-all duration-300 flex items-center gap-2',
              activeTab === tab.name
                ? 'text-primary-700 bg-primary-50/50'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            ]"
          >
            <span class="text-xl">{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
            
            <span
              v-if="tab.count !== undefined"
              :class="[
                'ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider',
                activeTab === tab.name
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-500'
              ]"
            >
              {{ tab.count }}
            </span>
            
            <span
              v-if="activeTab === tab.name"
              class="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-t-full shadow-[0_-2px_10px_rgba(79,70,229,0.4)]"
            ></span>
          </button>
        </nav>
      </div>
    </div>

    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto custom-scrollbar">
      
      <div v-if="routinesStore.loading" class="flex flex-col items-center justify-center py-24 animate-pulse">
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p class="mt-6 text-gray-500 font-bold text-sm uppercase tracking-widest">Sincronizando con Divermind AI...</p>
      </div>

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
          <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div class="bg-white rounded-3xl p-10 shadow-2xl flex flex-col items-center">
              <div class="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <p class="mt-4 text-gray-900 font-black">Preparando Asistente...</p>
            </div>
          </div>
        </Teleport>
      </template>
    </Suspense>

    <Teleport to="body">
      <div class="fixed bottom-6 right-6 z-[60] flex flex-col gap-3">
        <TransitionGroup name="toast">
          <div
            v-for="n in notifications" :key="n.id"
            :class="['toast-card', getNotificationStyles(n.type)]"
          >
            <div class="flex items-center gap-4">
              <div :class="['p-2 rounded-xl bg-white/20 shadow-sm']">
                <CheckCircleIcon v-if="n.type === 'success'" class="w-6 h-6" />
                <ExclamationTriangleIcon v-else class="w-6 h-6" />
              </div>
              <div class="flex-1">
                <p class="font-black text-sm uppercase tracking-tight">{{ n.title }}</p>
                <p class="text-xs font-medium opacity-90">{{ n.message }}</p>
              </div>
              <button @click="removeNotification(n.id)" class="p-1 hover:bg-white/10 rounded-lg">
                <XMarkIcon class="w-5 h-5" />
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
import { useRoute } from 'vue-router'
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
const ninoStore = useNinoActivoStore()
const routinesStore = useRoutinesStore()

const childId = computed(() => parseInt(route.params.id))
const childName = computed(() => ninoStore.nombreNino || 'Cargando...')

// ESTADO DE LA VISTA
const activeTab = ref('agenda')
const showWizard = ref(false)
const notifications = ref([])

// TABS CONFIGURACIÓN
const tabs = computed(() => [
  { name: 'agenda', label: 'Agenda Hoy', icon: '📅' },
  { 
    name: 'list', 
    label: 'Mis Rutinas', 
    icon: '📋', 
    count: routinesStore.routines.length // Conexión directa al Store
  },
  { name: 'analytics', label: 'Análisis', icon: '📊' },
  { name: 'comparison', label: 'Comparar', icon: '⚖️' }
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

// MÉTODOS DE DATOS
const loadRoutines = async () => {
  if (!childId.value) return
  try {
    // Sincronización completa: obtenemos todo (drafts y active) para la biblioteca
    await routinesStore.fetchRoutines(childId.value, { status: 'all' })
  } catch (err) {
    addNotification({ type: 'error', title: 'Error de Red', message: 'No se pudo sincronizar la biblioteca.' })
  }
}

const handleRoutineCreated = async (routine) => {
  showWizard.value = false
  addNotification({
    type: 'success',
    title: '¡Rutina Lista!',
    message: `"${routine?.name}" se ha añadido a la biblioteca.`
  })
  activeTab.value = 'list'
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
onMounted(() => loadRoutines())
watch(() => childId.value, () => loadRoutines())
</script>

<style scoped>
/* Botones con estilo Divermind */
.btn-primary-gradient {
  @apply inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-black rounded-2xl shadow-xl shadow-primary-200 hover:scale-105 active:scale-95 transition-all duration-300;
}

/* Scrollbar Personalizada */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

/* Transiciones de Vista */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.fade-slide-enter-from { opacity: 0; transform: translateY(20px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(-20px); }

/* Animación de Toasts */
.toast-card {
  @apply min-w-[320px] p-5 rounded-2xl shadow-2xl animate-fade-in pointer-events-auto;
}
.toast-enter-active { animation: toast-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
.toast-leave-active { animation: toast-in 0.3s reverse ease-in; }

@keyframes toast-in {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
</style>