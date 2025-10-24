<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4">
            <button 
              @click="$router.back()"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeftIcon class="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Rutinas Diarias</h1>
              <p class="text-sm text-gray-600">
                Gestión de rutinas estructuradas para {{ childName }}
              </p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <!-- Filtro por tipo de rutina -->
            <FormKit
              type="select"
              v-model="filters.routineType"
              :options="routineTypeOptions"
              placeholder="Todas las rutinas"
              outer-class="w-48"
            />
            
            <!-- Botón nueva rutina -->
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              Nueva Rutina
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Estadísticas Rápidas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon class="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Rutinas</p>
              <p class="text-2xl font-semibold text-gray-900">{{ routines.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <PlayCircleIcon class="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Activas</p>
              <p class="text-2xl font-semibold text-gray-900">{{ activeRoutinesCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ClockIcon class="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Cumplimiento</p>
              <p class="text-2xl font-semibold text-gray-900">{{ overallCompletionRate }}%</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <ExclamationTriangleIcon class="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Con Crisis</p>
              <p class="text-2xl font-semibold text-gray-900">{{ crisisCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de Rutinas -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Rutinas del Niño
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Gestión de rutinas diarias estructuradas
          </p>
        </div>

        <!-- Estado de carga -->
        <div v-if="loading" class="p-8 text-center">
          <div class="inline-flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando rutinas...
          </div>
        </div>

        <!-- Lista vacía -->
        <div v-else-if="filteredRoutines.length === 0" class="p-8 text-center">
          <CalendarDaysIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No hay rutinas</h3>
          <p class="mt-1 text-sm text-gray-500">
            Comienza creando la primera rutina estructurada.
          </p>
          <div class="mt-6">
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              Nueva Rutina
            </button>
          </div>
        </div>

        <!-- Grid de rutinas -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          <div
            v-for="routine in filteredRoutines"
            :key="routine.id"
            class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <!-- Header de la rutina -->
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div 
                    class="w-3 h-3 rounded-full"
                    :class="getRoutineStatusColor(routine.status)"
                  ></div>
                  <h3 class="text-lg font-medium text-gray-900 truncate">
                    {{ routine.name }}
                  </h3>
                </div>
                <div class="flex items-center space-x-2">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getRoutineTypeBadgeClass(routine.routine_type)"
                  >
                    {{ getRoutineTypeDisplay(routine.routine_type) }}
                  </span>
                </div>
              </div>

              <p class="mt-2 text-sm text-gray-500 line-clamp-2">
                {{ routine.description }}
              </p>

              <!-- Información rápida -->
              <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div class="flex items-center text-gray-500">
                  <ClockIcon class="h-4 w-4 mr-1" />
                  {{ routine.start_time || 'Sin hora' }}
                </div>
                <div class="flex items-center text-gray-500">
                  <ListBulletIcon class="h-4 w-4 mr-1" />
                  {{ routine.total_steps }} pasos
                </div>
                <div class="flex items-center text-gray-500">
                  <CalendarIcon class="h-4 w-4 mr-1" />
                  {{ routine.days_of_week_display?.length || 0 }} días
                </div>
                <div class="flex items-center text-gray-500">
                  <CheckBadgeIcon class="h-4 w-4 mr-1" />
                  {{ routine.completion_rate_last_week?.percentage || 0 }}%
                </div>
              </div>

              <!-- Barra de progreso -->
              <div class="mt-4">
                <div class="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Progreso semanal</span>
                  <span>{{ routine.completion_rate_last_week?.percentage || 0 }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-green-600 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${routine.completion_rate_last_week?.percentage || 0}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Acciones -->
            <div class="px-4 py-4 bg-gray-50 border-t border-gray-200 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex space-x-2">
                  <button
                    @click="viewRoutineDetails(routine)"
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <EyeIcon class="h-4 w-4 mr-1" />
                    Ver
                  </button>
                  
                  <button
                    @click="editRoutine(routine)"
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PencilIcon class="h-4 w-4 mr-1" />
                    Editar
                  </button>
                </div>

                <button
                  @click="toggleRoutineStatus(routine)"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md"
                  :class="routine.is_active ? 
                    'text-red-700 bg-red-100 hover:bg-red-200' : 
                    'text-green-700 bg-green-100 hover:bg-green-200'"
                >
                  <PowerIcon class="h-4 w-4 mr-1" />
                  {{ routine.is_active ? 'Pausar' : 'Activar' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Crear/Editar Rutina -->
    <RoutineModal
      v-if="showCreateModal || editingRoutine"
      :routine="editingRoutine"
      :child-id="childId"
      @close="closeModal"
      @saved="handleRoutineSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeftIcon,
  PlusIcon,
  CheckCircleIcon,
  PlayCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  ListBulletIcon,
  CalendarIcon,
  CheckBadgeIcon,
  EyeIcon,
  PencilIcon,
  PowerIcon
} from '@heroicons/vue/24/outline'

// Components
//import RoutineModal from './components/RoutineModal.vue'

// Types
interface Routine {
  id: number
  name: string
  description: string
  routine_type: string
  status: string
  is_active: boolean
  start_time: string | null
  total_steps: number
  days_of_week_display: string[]
  completion_rate_last_week: {
    percentage: number
    total_expected: number
    total_logged: number
    completed: number
  } | null
}

// Props
const route = useRoute()
const router = useRouter()

// Data
const loading = ref(true)
const routines = ref<Routine[]>([])
const filters = ref({
  routineType: ''
})
const showCreateModal = ref(false)
const editingRoutine = ref<Routine | null>(null)

// Computed
const childId = computed(() => route.params.childId as string)
const childName = computed(() => 'Nombre del Niño') // Reemplazar con datos reales

const filteredRoutines = computed(() => {
  if (!filters.value.routineType) return routines.value
  return routines.value.filter(r => r.routine_type === filters.value.routineType)
})

const activeRoutinesCount = computed(() => 
  routines.value.filter(r => r.is_active).length
)

const overallCompletionRate = computed(() => {
  if (routines.value.length === 0) return 0
  const total = routines.value.reduce((sum, routine) => 
    sum + (routine.completion_rate_last_week?.percentage || 0), 0
  )
  return Math.round(total / routines.value.length)
})

const crisisCount = computed(() => {
  // Implementar lógica real para contar crisis
  return 0
})

// Methods
const getRoutineStatusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    active: 'bg-green-500',
    paused: 'bg-yellow-500',
    archived: 'bg-gray-500',
    draft: 'bg-blue-500'
  }
  return colors[status] || 'bg-gray-400'
}

const getRoutineTypeBadgeClass = (type: string) => {
  const classes: { [key: string]: string } = {
    morning: 'bg-blue-100 text-blue-800',
    bedtime: 'bg-purple-100 text-purple-800',
    school_prep: 'bg-green-100 text-green-800',
    therapy_session: 'bg-orange-100 text-orange-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const getRoutineTypeDisplay = (type: string) => {
  const displays: { [key: string]: string } = {
    morning: 'Mañana',
    bedtime: 'Noche',
    school_prep: 'Escuela',
    therapy_session: 'Terapia'
  }
  return displays[type] || type
}

const viewRoutineDetails = (routine: Routine) => {
  router.push(`/dashboard/child/${childId.value}/routines/${routine.id}`)
}

const editRoutine = (routine: Routine) => {
  editingRoutine.value = { ...routine }
}

const toggleRoutineStatus = async (routine: Routine) => {
  try {
    // Implementar llamada API para cambiar estado
    routine.is_active = !routine.is_active
    routine.status = routine.is_active ? 'active' : 'paused'
  } catch (error) {
    console.error('Error cambiando estado:', error)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingRoutine.value = null
}

const handleRoutineSaved = (newRoutine: Routine) => {
  if (editingRoutine.value) {
    const index = routines.value.findIndex(r => r.id === newRoutine.id)
    if (index !== -1) {
      routines.value[index] = newRoutine
    }
  } else {
    routines.value.unshift(newRoutine)
  }
  closeModal()
}

// Options para filtro
const routineTypeOptions = [
  { value: '', label: 'Todas las rutinas' },
  { value: 'morning', label: 'Rutinas de mañana' },
  { value: 'bedtime', label: 'Rutinas de noche' },
  { value: 'school_prep', label: 'Preparación escolar' },
  { value: 'therapy_session', label: 'Sesiones de terapia' }
]

// Lifecycle
onMounted(async () => {
  try {
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Datos de ejemplo - reemplazar con llamada real a API
    routines.value = [
      {
        id: 1,
        name: 'Rutina de Mañana Escolar',
        description: 'Preparación para ir al colegio incluyendo desayuno y aseo personal',
        routine_type: 'morning',
        status: 'active',
        is_active: true,
        start_time: '07:30',
        total_steps: 8,
        days_of_week_display: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],
        completion_rate_last_week: {
          percentage: 85,
          total_expected: 5,
          total_logged: 5,
          completed: 4
        }
      },
      {
        id: 2,
        name: 'Rutina para Dormir',
        description: 'Actividades relajantes antes de dormir para mejorar el descanso',
        routine_type: 'bedtime',
        status: 'active',
        is_active: true,
        start_time: '20:00',
        total_steps: 6,
        days_of_week_display: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        completion_rate_last_week: {
          percentage: 92,
          total_expected: 7,
          total_logged: 7,
          completed: 6
        }
      }
    ]
  } catch (error) {
    console.error('Error cargando rutinas:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>