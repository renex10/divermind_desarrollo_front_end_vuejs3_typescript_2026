<template>
  <div class="space-y-6 animate-fade-in">
    <!-- 📌 HEADER DE LA VISTA -->
    <div class="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
          <AcademicCapIcon class="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">
            Dominio Cognitivo
          </h2>
          <p class="text-sm text-gray-500 mt-1">
            Seguimiento de hitos, logros y desafíos en el área cognitiva de {{ childName }}
          </p>
        </div>
      </div>
    </div>

    <!-- 📊 SECCIÓN: HITOS COGNITIVOS -->
    <section>
      <!-- Header con acciones -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <h3 class="text-xl font-semibold text-gray-800">Hitos Cognitivos Registrados</h3>
          <span 
            v-if="!isLoading && cognitiveMilestones.length > 0"
            class="px-3 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full"
          >
            {{ cognitiveMilestones.length }}
          </span>
        </div>

        <!-- Botón para agregar nuevo hito (futuro) -->
        <button
          v-if="!isLoading && cognitiveMilestones.length > 0"
          class="btn-secondary-sm"
          @click="handleAddMilestone"
          title="Agregar nuevo hito"
        >
          <PlusIcon class="w-4 h-4 mr-1.5" />
          Agregar Hito
        </button>
      </div>

      <!-- 🔄 LOADING STATE -->
      <div v-if="isLoading" class="bg-white rounded-2xl shadow-soft p-12">
        <LoadingState message="Cargando hitos cognitivos..." />
      </div>
      
      <!-- 📭 EMPTY STATE -->
      <EmptyState
        v-else-if="!isLoading && cognitiveMilestones.length === 0"
        icon="AcademicCapIcon"
        title="Sin Hitos Cognitivos"
        message="Aún no se han registrado hitos en la categoría 'Cognitivo' para este niño."
      >
        <template #actions>
          <button 
            @click="handleAddMilestone"
            class="btn-primary mt-4"
          >
            <PlusIcon class="w-5 h-5 mr-2" />
            Registrar Primer Hito
          </button>
        </template>
      </EmptyState>

      <!-- 📋 GRID DE HITOS -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="hito in cognitiveMilestones" 
          :key="hito.id"
          class="bg-white rounded-2xl shadow-soft border border-gray-100 p-5 transition-all duration-300 hover:shadow-medium hover:border-purple-200 group"
        >
          <!-- Header del hito con edad -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <p class="font-semibold text-gray-900 leading-snug group-hover:text-purple-700 transition-colors">
                {{ hito.description }}
              </p>
              
              <!-- Badge de edad al logro -->
              <div 
                v-if="hito.age_at_milestone" 
                class="inline-block mt-2 px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-md"
              >
                <svg class="w-3 h-3 inline-block mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ hito.age_at_milestone }}
              </div>
            </div>

            <!-- Menú de acciones (futuro) -->
            <button 
              class="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              @click="handleEditMilestone(hito)"
              title="Editar hito"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
          
          <!-- Fecha del hito -->
          <p class="text-sm text-purple-600 font-medium my-3 flex items-center">
            <CalendarDaysIcon class="w-4 h-4 mr-1.5" />
            {{ formatHitoDate(hito.date) }}
          </p>
          
          <!-- Detalles del hito -->
          <div class="space-y-2.5">
            <!-- Nivel de dominio -->
            <div class="flex items-center text-sm text-gray-700">
              <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-success-100 flex items-center justify-center mr-3">
                <CheckBadgeIcon class="w-5 h-5 text-success-600" />
              </div>
              <div>
                <span class="font-medium text-gray-500">Nivel:</span>
                <span class="ml-1.5 text-gray-900">{{ hito.proficiency_level_display }}</span>
              </div>
            </div>

            <!-- Contexto -->
            <div class="flex items-center text-sm text-gray-700">
              <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                <MapPinIcon class="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <span class="font-medium text-gray-500">Contexto:</span>
                <span class="ml-1.5 text-gray-900">{{ hito.context_display }}</span>
              </div>
            </div>

            <!-- Apoyo requerido -->
            <div class="flex items-center text-sm text-gray-700">
              <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center mr-3">
                <UserGroupIcon class="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <span class="font-medium text-gray-500">Apoyo:</span>
                <span class="ml-1.5 text-gray-900">{{ hito.support_level_display }}</span>
              </div>
            </div>

            <!-- Impacto funcional (si existe) -->
            <div 
              v-if="hito.functional_impact"
              class="flex items-center text-sm text-gray-700"
            >
              <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <span class="font-medium text-gray-500">Impacto:</span>
                <span class="ml-1.5 text-gray-900">{{ hito.functional_impact }}</span>
              </div>
            </div>
          </div>
          
          <!-- Observaciones adicionales -->
          <div v-if="hito.observations" class="mt-4 pt-4 border-t border-gray-200">
            <div class="flex items-start gap-2">
              <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <p class="text-xs text-gray-600 italic leading-relaxed">{{ hito.observations }}</p>
            </div>
          </div>

          <!-- Footer con metadata -->
          <div 
            v-if="hito.registered_by_name || hito.previous_records_count > 0"
            class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500"
          >
            <span v-if="hito.registered_by_name" class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {{ hito.registered_by_name }}
            </span>
            
            <span 
              v-if="hito.previous_records_count > 0"
              class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
              :title="`Este hito tiene ${hito.previous_records_count} registros previos`"
            >
              {{ hito.previous_records_count }} registro{{ hito.previous_records_count === 1 ? '' : 's' }} previo{{ hito.previous_records_count === 1 ? '' : 's' }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- 📊 INFO CARD (Opcional - Estadísticas rápidas) -->
    <div 
      v-if="!isLoading && cognitiveMilestones.length > 0"
      class="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4 flex gap-3"
    >
      <svg class="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
      </svg>
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-purple-900 mb-1">Progreso Cognitivo</h4>
        <p class="text-sm text-purple-800">
          Se han registrado <strong>{{ cognitiveMilestones.length }}</strong> hito{{ cognitiveMilestones.length === 1 ? '' : 's' }} 
          en el desarrollo cognitivo. Continúa monitoreando el progreso para identificar fortalezas y áreas de mejora.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * CognitivoView.vue
 * 
 * Propósito:
 * Panel de visualización centralizado para toda la información relacionada 
 * con el desarrollo cognitivo de un niño específico.
 * 
 * Características:
 * - Carga hitos de desarrollo de categoría 'cognitive' desde el backend
 * - Usa componentes compartidos (LoadingState, EmptyState)
 * - Integrado con notificationStore para feedback
 * - Diseño responsivo con Tailwind CSS
 * - Animaciones suaves con las clases personalizadas del proyecto
 */

// === IMPORTS ===
import { ref, onMounted, watch, computed } from 'vue'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

// Componentes compartidos
import LoadingState from '@/components/gestion/rutinas/shared/LoadingState.vue'
import EmptyState from '@/components/gestion/rutinas/shared/EmptyState.vue'

// Iconos
import { 
  CheckBadgeIcon, 
  MapPinIcon, 
  UserGroupIcon, 
  CalendarDaysIcon, 
  AcademicCapIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'

// Services y Stores
import http from '@/services/http'
import { parseApiError } from '@/exceptions/apiError'
import { useNotificationStore } from '@/store/notificationStore'
import { useNinoActivoStore } from '@/store/ninoActivoStore'

// === INTERFACES ===
interface DevelopmentMilestone {
  id: number
  child: number
  date: string
  age_at_milestone?: string
  category: string
  category_display: string
  description: string
  observations?: string
  proficiency_level: string
  proficiency_level_display: string
  context: string
  context_display: string
  support_level: string
  support_level_display: string
  functional_impact?: string
  previous_records_count: number
  registered_by: number
  registered_by_name?: string
  created_at: string
}

// === PROPS ===
const props = defineProps<{
  id: string // ID del niño desde la ruta
}>()

// === STORES ===
const ninoStore = useNinoActivoStore()
const notificationStore = useNotificationStore()

// === STATE ===
const cognitiveMilestones = ref<DevelopmentMilestone[]>([])
const isLoading = ref(true)

// === COMPUTED ===
const childId = computed(() => Number(props.id))
const childName = computed(() => ninoStore.nombreNino || 'el niño')

// === METHODS ===

/**
 * Carga los hitos de desarrollo cognitivo desde el backend
 */
async function fetchCognitiveMilestones() {
  if (!childId.value) return

  isLoading.value = true
  try {
    const response = await http.get(`/seguimiento/ninos/${childId.value}/hitos-desarrollo/`, {
      params: {
        category: 'cognitive' // Filtro por categoría cognitiva
      }
    })
    
    cognitiveMilestones.value = response.data
    
    console.log(`✅ ${cognitiveMilestones.value.length} hitos cognitivos cargados`)
    
  } catch (error: any) {
    const apiError = parseApiError(error)
    
    notificationStore.error(
      apiError.message,
      '❌ Error al Cargar Hitos'
    )
    
    console.error('Error fetching cognitive milestones:', apiError)
  } finally {
    isLoading.value = false
  }
}

/**
 * Formatea la fecha del hito en español
 */
function formatHitoDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "d 'de' MMMM 'de' yyyy", { locale: es })
  } catch {
    return dateStr
  }
}

/**
 * Handler para agregar nuevo hito (placeholder)
 */
function handleAddMilestone() {
  notificationStore.info(
    'Esta funcionalidad estará disponible próximamente',
    'ℹ️ Próximamente',
    3000
  )
}

/**
 * Handler para editar hito existente (placeholder)
 */
function handleEditMilestone(hito: DevelopmentMilestone) {
  notificationStore.info(
    `Edición de "${hito.description}" próximamente`,
    'ℹ️ Próximamente',
    3000
  )
}

// === LIFECYCLE HOOKS ===

onMounted(() => {
  fetchCognitiveMilestones()
})

watch(childId, (newId) => {
  if (newId) {
    fetchCognitiveMilestones()
  }
})
</script>

<style scoped>
/* Botones personalizados */
.btn-primary {
  @apply inline-flex items-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95;
}

.btn-secondary-sm {
  @apply inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200;
}

/* Animaciones personalizadas ya definidas en tailwind.config.js */
/* .animate-fade-in está disponible globalmente */
</style>