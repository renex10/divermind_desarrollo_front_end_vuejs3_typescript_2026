<template>
  <div class="space-y-6 animate-fade-in">
    
    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">
          Análisis de Progreso
        </h2>
        <p class="text-sm text-gray-500 mt-1">
          Métricas de efectividad, independencia y estado emocional.
        </p>
      </div>
      
      <div class="flex-shrink-0">
        <span class="relative z-0 inline-flex shadow-sm rounded-lg">
          <button
            v-for="p in periods"
            :key="p.id"
            @click="activePeriod = p.id"
            type="button"
            :class="[
              'relative inline-flex items-center px-4 py-2 text-sm font-medium focus:z-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-150',
              p.id === activePeriod
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-white text-gray-700 hover:bg-gray-50',
              p.position === 'first' ? 'rounded-l-lg' : '',
              p.position === 'last' ? 'rounded-r-lg' : '-ml-px'
            ]"
          >
            {{ p.label }}
          </button>
        </span>
      </div>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-20 bg-white rounded-2xl shadow-soft">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        <p class="mt-4 text-gray-600">Calculando métricas...</p>
      </div>
    </div>

    <div v-else-if="error" class="bg-error-50 p-6 rounded-2xl border border-error-200">
      <div class="flex items-center space-x-3">
        <ExclamationTriangleIcon class="h-10 w-10 text-error-500" />
        <div>
          <h3 class="text-lg font-semibold text-error-800">No se pudieron cargar las analíticas</h3>
          <p class="text-error-700 mt-1">{{ error }}</p>
        </div>
      </div>
    </div>

    <div v-else class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="lg:col-span-2">
          <ProgressAnalysisPanel 
            :data="analyticsData.progressAnalysis" 
            :child-name="childName" 
          />
        </div>
        
        <div class="lg:col-span-1">
          <RecommendationsPanel 
            :recommendations="analyticsData.recommendations" 
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <CompletionRateChart 
          :data="analyticsData.completionRate" 
        />
        
        <IndependenceTrendChart 
          :data="analyticsData.independenceTrend" 
        />
        
        <EmotionalStateChart 
          :data="analyticsData.emotionalState" 
        />
        
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

// Importar los componentes de analítica (se crearán a continuación)





// (Descomentar cuando los stores estén listos)
// import { useAnalyticsStore } from '@/stores/analyticsStore'
// import { storeToRefs } from 'pinia'

// Props (recibidos desde RutinasView.vue)
const props = defineProps({
  childId: {
    type: Number,
    required: true,
  },
  childName: {
    type: String,
    required: true,
  },
})

// Simulación del store de Pinia
// const analyticsStore = useAnalyticsStore()
// const { isLoading, error, analyticsData } = storeToRefs(analyticsStore)

// === INICIO: SIMULACIÓN DE DATOS (Reemplazar con store) ===
const isLoading = ref(true)
const error = ref(null)
const analyticsData = ref({})

// Datos simulados que coinciden con la API y los componentes
const MOCK_DATA = {
  progressAnalysis: {
    metrics: {
      completion_rate: 82,
      avg_independence: 3.8,
      crisis_rate: 15,
      total_logs: 45,
    },
    trend: [
      { date: '2025-10-01', completion: 70, independence: 3.2 },
      { date: '2025-10-08', completion: 75, independence: 3.5 },
      { date: '2025-10-15', completion: 80, independence: 3.7 },
      { date: '2025-10-22', completion: 82, independence: 3.8 },
    ],
    problematicSteps: [
      { step: '1. Lavarse los dientes', difficulty_count: 12 },
      { step: '3. Ponerse los zapatos', difficulty_count: 8 },
    ],
  },
  recommendations: [
    "El paso 'Lavarse los dientes' presenta dificultades recurrentes. Considera dividirlo en sub-pasos.",
    "La independencia está mejorando (3.8/5). Intenta reducir el nivel de apoyo verbal en 'Vestirse'.",
    "Se observa una alta tasa de crisis (15%) en rutinas matutinas. Revisa las estrategias de calma previas.",
  ],
  completionRate: {
    completed: 82,
    partial: 10,
    skipped: 8,
  },
  independenceTrend: [
    { date: 'Sem 1', level: 3.1 },
    { date: 'Sem 2', level: 3.4 },
    { date: 'Sem 3', level: 3.5 },
    { date: 'Sem 4', level: 3.8 },
  ],
  emotionalState: {
    happy: 55,
    neutral: 25,
    anxious: 15,
    sad: 5,
  },
}

const fetchData = async (period) => {
  isLoading.value = true
  error.value = null
  console.log(`Cargando analíticas para ${props.childId} (Período: ${period})`)
  
  try {
    // (Llamada real al store)
    // await analyticsStore.fetchAnalytics(props.childId, period)
    
    // (Simulación)
    await new Promise(res => setTimeout(res, 1000))
    // if (Math.random() > 0.9) throw new Error('Error simulado de red')
    analyticsData.value = MOCK_DATA
    
  } catch (e) {
    error.value = e.message || 'Ocurrió un error desconocido.'
  } finally {
    isLoading.value = false
  }
}
// === FIN: SIMULACIÓN DE DATOS ===


// Estado del componente
const activePeriod = ref('30d')
const periods = ref([
  { id: '7d', label: '7 Días', position: 'first' },
  { id: '30d', label: '30 Días', position: 'middle' },
  { id: '90d', label: '90 Días', position: 'last' },
])

// Carga inicial
onMounted(() => {
  fetchData(activePeriod.value)
})

// Recargar datos cuando el período cambia
watch(activePeriod, (newPeriod) => {
  fetchData(newPeriod)
})
</script>