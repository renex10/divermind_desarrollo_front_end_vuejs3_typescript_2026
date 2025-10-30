<template>
  <div class="animate-fade-in space-y-6">
    
    <div class="bg-white p-6 rounded-2xl shadow-soft">
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">
            Comparar Rutinas
          </h2>
          <p class="text-sm text-gray-500 mt-1">
            Selecciona dos rutinas y un período para analizar su efectividad.
          </p>
        </div>
        
        <button
          @click="fetchComparisonData"
          :disabled="!canCompare || isLoading"
          class="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-primary-700 hover:to-primary-800 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
        >
          <ChartBarIcon v-if="!isLoading" class="w-5 h-5 mr-2" />
          <div v-else class="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          {{ isLoading ? 'Analizando...' : 'Comparar' }}
        </button>
      </div>

      <hr class="my-6 border-gray-200" />

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <RoutineSelector
          v-model="selectedRoutineA"
          :routines="routineOptions"
          :exclude-id="selectedRoutineB"
          label="Rutina A (Principal)"
          placeholder="Selecciona la primera rutina"
          :disabled="isLoading"
        />

        <RoutineSelector
          v-model="selectedRoutineB"
          :routines="routineOptions"
          :exclude-id="selectedRoutineA"
          label="Rutina B (A comparar)"
          placeholder="Selecciona la segunda rutina"
          :disabled="isLoading"
        />

        <FormKit
          type="select"
          label="Período de Análisis"
          v-model="activePeriod"
          :options="periodOptions"
          :disabled="isLoading"
        />
      </div>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-20 bg-white rounded-2xl shadow-soft">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        <p class="mt-4 text-gray-600">Calculando métricas...</p>
      </div>
    </div>

    <div v-if="error" class="bg-error-50 p-6 rounded-2xl border border-error-200">
      <div class="flex items-center space-x-3">
        <ExclamationTriangleIcon class="h-10 w-10 text-error-500" />
        <div>
          <h3 class="text-lg font-semibold text-error-800">No se pudo comparar</h3>
          <p class="text-error-700 mt-1">{{ error }}</p>
        </div>
      </div>
    </div>

    <div 
      v-if="!comparisonData && !isLoading && !error"
      class="text-center py-20 bg-white rounded-2xl shadow-soft"
    >
      <div class="inline-block p-4 bg-gray-100 rounded-full">
        <ChartBarIcon class="h-12 w-12 text-primary-600" />
      </div>
      <h3 class="mt-4 text-xl font-semibold text-gray-800">Compara para mejorar</h3>
      <p class="mt-1 text-gray-500">
        Selecciona dos rutinas y haz clic en "Comparar" para ver los resultados.
      </p>
    </div>

    <div v-if="comparisonData && !isLoading && !error" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="lg:col-span-2">
          <ComparisonMetricsGrid 
            :data-a="comparisonData.routine_a"
            :data-b="comparisonData.routine_b"
            :winner="comparisonData.winner"
          />
        </div>
        
        <div class="lg:col-span-1">
          <RecommendationCard 
            :recommendation-text="comparisonData.recommendation"
            :winner="comparisonData.winner"
          />
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-2xl shadow-soft">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Comparación de Métricas (%)
        </h3>
        <ComparisonChart 
          :data-a="comparisonData.routine_a"
          :data-b="comparisonData.routine_b"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ChartBarIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { useRoutinesStore } from '@/store/rutinas/routinesStore'
import { storeToRefs } from 'pinia'
// (Asumiendo que tienes un servicio de API para analíticas)
// import { analyticsApi } from '@/services/api/analyticsApi'

// Importar componentes hijos (se crearán a continuación)
import RoutineSelector from '@/components/gestion/rutinas/comparison/RoutineSelector.vue'
import ComparisonMetricsGrid from '@/components/gestion/rutinas/comparison/ComparisonMetricsGrid.vue'
import RecommendationCard from '@/components/gestion/rutinas/comparison/RecommendationCard.vue'
import ComparisonChart from '@/components/gestion/rutinas/comparison/ComparisonChart.vue'

const props = defineProps({
  childId: {
    type: Number,
    required: true,
  },
})

// === ESTADO ===
const routinesStore = useRoutinesStore()
const { activeRoutines } = storeToRefs(routinesStore)

const selectedRoutineA = ref(null)
const selectedRoutineB = ref(null)
const activePeriod = ref(30) // Default 30 días

const comparisonData = ref(null)
const isLoading = ref(false)
const error = ref(null)

const periodOptions = [
  { label: 'Últimos 7 días', value: 7 },
  { label: 'Últimos 30 días', value: 30 },
  { label: 'Últimos 90 días', value: 90 },
]

// === LÓGICA ===

// Formatear rutinas para el selector de FormKit
const routineOptions = computed(() => 
  activeRoutines.value.map(r => ({
    label: r.name,
    value: r.id,
  }))
)

// Habilitar el botón de comparar
const canCompare = computed(() => 
  selectedRoutineA.value && selectedRoutineB.value
)

// Llamada a la API (simulada)
const fetchComparisonData = async () => {
  // Resetear estados
  isLoading.value = true
  error.value = null
  comparisonData.value = null

  // Validación
  if (!canCompare.value) {
    error.value = "Debes seleccionar dos rutinas."
    isLoading.value = false
    return
  }
  if (selectedRoutineA.value === selectedRoutineB.value) {
    error.value = "Por favor, selecciona dos rutinas diferentes."
    isLoading.value = false
    return
  }
  
  try {
    // --- LLAMADA REAL A LA API ---
    // const response = await analyticsApi.getComparison(
    //   props.childId, 
    //   selectedRoutineA.value, 
    //   selectedRoutineB.value, 
    //   activePeriod.value
    // )
    // comparisonData.value = response.data

    // --- SIMULACIÓN DE API ---
    await new Promise(res => setTimeout(res, 1500))
    // Simular error de "datos insuficientes"
    if (Math.random() > 0.8) {
       throw new Error("Datos insuficientes para comparar")
    }
    // Simular éxito
    comparisonData.value = {
      period_days: activePeriod.value,
      routine_a: {
        name: routineOptions.value.find(r => r.value === selectedRoutineA.value).label,
        metrics: {
          total_logs: 28,
          completion_rate: 85.7,
          crisis_rate: 7.1,
          avg_independence: 4.1
        }
      },
      routine_b: {
        name: routineOptions.value.find(r => r.value === selectedRoutineB.value).label,
        metrics: {
          total_logs: 25,
          completion_rate: 72.0,
          crisis_rate: 16.0,
          avg_independence: 3.5
        }
      },
      winner: 'routine_a',
      recommendation: `'${routineOptions.value.find(r => r.value === selectedRoutineA.value).label}' muestra mejor desempeño`
    }
    // --- FIN SIMULACIÓN ---

  } catch (err) {
    error.value = err.response?.data?.error || err.message || "Ocurrió un error desconocido."
  } finally {
    isLoading.value = false
  }
}
</script>