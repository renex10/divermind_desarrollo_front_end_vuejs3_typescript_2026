<template>
  <div class="space-y-8 animate-fade-in pb-12 max-w-full overflow-x-hidden">
    
    <div class="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
      <div class="space-y-1">
        <h2 class="text-3xl font-black text-gray-900 tracking-tight">Panel de Análisis Clínico</h2>
        <p class="text-gray-500 font-medium flex items-center gap-2 text-sm">
          <span class="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-200"></span>
          Evidencia estructurada de <span class="text-blue-600 font-bold">{{ childName }}</span>
        </p>
      </div>
      
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex bg-gray-100 p-1.5 rounded-2xl w-fit shadow-inner border border-gray-200/50">
          <button
            v-for="p in periods"
            :key="p.id"
            @click="activePeriod = p.id"
            :class="[
              'px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300',
              p.id === activePeriod 
                ? 'bg-white text-blue-600 shadow-sm transform scale-105' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            ]"
          >
            {{ p.label }}
          </button>
        </div>

        <button 
          @click="handleExport"
          :disabled="isExporting || isLoading"
          class="flex items-center gap-2 px-6 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:shadow-md hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
        >
          <template v-if="!isExporting">
            <DocumentArrowDownIcon class="w-5 h-5 text-blue-600" />
            <span>Exportar Informe</span>
          </template>
          <template v-else>
            <div class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Generando...</span>
          </template>
        </button>
      </div>
    </div>

    <div v-if="!isLoading && !error" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      <div v-for="(kpi, index) in kpiData" :key="index" 
            class="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 group-hover:text-blue-500 transition-colors">{{ kpi.title }}</p>
        <div class="flex items-end gap-2">
          <span class="text-4xl font-black tracking-tighter" :class="kpi.color">
            {{ kpi.value }}{{ kpi.unit }}
          </span>
          <span v-if="kpi.trend !== 0" 
                class="text-xs font-black mb-1.5 px-2 py-0.5 rounded-lg bg-opacity-10" 
                :class="kpi.trend > 0 ? 'text-emerald-600 bg-emerald-100' : 'text-red-600 bg-red-100'">
            {{ kpi.trend > 0 ? '▲' : '▼' }} {{ Math.abs(kpi.trend) }}%
          </span>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="py-40 flex flex-col items-center justify-center bg-white rounded-[3.5rem] border border-gray-100 shadow-sm">
      <div class="relative w-20 h-20 mb-6">
        <div class="absolute inset-0 border-4 border-blue-50 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p class="text-gray-400 font-bold text-xs uppercase tracking-[0.3em] animate-pulse">Analizando Registros Clínicos</p>
    </div>

    <div v-else-if="error" class="bg-red-50 p-16 rounded-[3.5rem] border border-red-100 text-center max-w-2xl mx-auto">
      <div class="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
        <ExclamationTriangleIcon class="h-8 w-8 text-red-600" />
      </div>
      <h3 class="text-2xl font-black text-red-900">Falla en Sincronización</h3>
      <p class="text-red-700/80 mt-2 font-medium">{{ error }}</p>
      <button @click="loadAllData(childId)" class="mt-8 px-10 py-4 bg-red-600 text-white rounded-2xl font-black transition-all hover:bg-red-700 shadow-lg uppercase tracking-widest text-xs">
        Reintentar Conexión
      </button>
    </div>

    <div v-else class="space-y-8">
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div class="lg:col-span-8 h-[480px] export-chart relative">
          <IndependenceEvolutionChart :evolution-data="reportsStore.evolution" />
        </div>
        
        <div class="lg:col-span-4 h-[480px] export-chart relative">
          <SupportDistributionDonut :distribution="reportsStore.supportDistribution" />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-4 bg-white p-8 rounded-[3.5rem] border border-gray-100 shadow-sm export-chart flex flex-col h-[450px]">
          <div class="mb-6">
            <h3 class="text-xl font-black text-gray-900 tracking-tight">Mapa de Calor</h3>
            <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest">Barreras en la rutina diaria</p>
          </div>
          
          <div class="space-y-5 overflow-y-auto pr-2 custom-scrollbar">
            <div v-for="step in reportsStore.heatMap" :key="step.step_id" class="group">
              <div class="flex justify-between items-center mb-1.5">
                <span class="text-xs font-black text-gray-700 truncate max-w-[150px]">{{ step.step_action }}</span>
                <span class="text-[10px] font-black" :class="step.friction_rate > 50 ? 'text-red-500' : 'text-gray-400'">
                  {{ step.friction_rate }}% Fricción
                </span>
              </div>
              <div class="w-full bg-gray-50 rounded-full h-3 border border-gray-100 overflow-hidden">
                <div 
                  class="h-full rounded-full transition-all duration-1000"
                  :class="step.friction_rate > 60 ? 'bg-red-500 shadow-sm' : 'bg-blue-600'"
                  :style="{ width: `${step.friction_rate}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-8">
          <AISummaryBox 
            :report="reportsStore.recentAIInsight" 
            :loading="isLoading"
            :child-name="childName"
          />
        </div>
      </div>

      <div class="bg-white p-8 rounded-[3.5rem] border border-gray-100 shadow-sm export-chart h-[450px] relative">
          <div class="mb-8 flex items-center justify-between">
            <div>
              <h3 class="text-xl font-black text-gray-900 tracking-tight">Análisis de Eficiencia Temporal</h3>
              <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest">Desvío Real vs Planificación Terapéutica</p>
            </div>
            <div class="p-3 bg-amber-50 rounded-2xl">
              <ClockIcon class="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div class="h-[300px]">
             <DurationVsEstimatedChart :time-data="reportsStore.timeEfficiency" />
          </div>
      </div>

      <div class="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          Consolidado clínico al: {{ new Date().toLocaleString() }}
        </p>
        <p class="text-[10px] text-gray-400 font-medium italic max-w-md text-center md:text-right">
          * Los análisis se basan en registros de ejecución y datos de granularidad de la app de seguimiento.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { 
  ExclamationTriangleIcon, 
  DocumentArrowDownIcon,
  ClockIcon 
} from '@heroicons/vue/24/outline'

import { useRoutineAnalytics } from '@/composables/useRoutineAnalytics'
import { exportService } from '@/services/rutinas/exportService'

import AISummaryBox from '@/components/gestion/rutinas/reports/AISummaryBox.vue'
import IndependenceEvolutionChart from '@/components/gestion/rutinas/reports/IndependenceEvolutionChart.vue'
import SupportDistributionDonut from '@/components/gestion/rutinas/reports/SupportDistributionDonut.vue'
import DurationVsEstimatedChart from '@/components/gestion/rutinas/reports/DurationVsEstimatedChart.vue'

const props = defineProps<{
  childId: number
  childName: string
}>()

const { 
  reportsStore, 
  isLoading, 
  error, 
  loadAllData,
  independenceGrowth,
  independenceStatusColor,
} = useRoutineAnalytics()

const activePeriod = ref('30d')
const isExporting = ref(false)

const periods = [
  { id: '7d', label: '7 Días' },
  { id: '30d', label: '30 Días' },
  { id: '90d', label: '90 Días' },
]

const kpiData = computed(() => [
  { 
    title: 'Independencia Actual', 
    value: reportsStore.summary?.independence_pct || 0, 
    unit: '%', 
    trend: independenceGrowth.value, 
    color: independenceStatusColor.value 
  },
  { 
    title: 'Pasos Críticos', 
    value: reportsStore.heatMap?.filter(h => h.friction_rate > 50).length || 0, 
    unit: ' pasos', 
    trend: 0, 
    color: 'text-red-600' 
  },
  { 
    title: 'Desvío Temporal', 
    value: reportsStore.summary?.avg_deviation_pct || 0, 
    unit: '%', 
    trend: 0, 
    color: 'text-amber-600' 
  },
  { 
    title: 'Registros Totales', 
    value: reportsStore.summary?.total_executions || 0, 
    unit: '', 
    trend: 0, 
    color: 'text-gray-900' 
  },
])

const handleExport = async () => {
  try {
    isExporting.value = true
    const chartElements = Array.from(document.querySelectorAll('.export-chart')) as HTMLElement[]
    await exportService.downloadRoutinePDF(
      { childName: props.childName, childId: props.childId, period: periods.find(p => p.id === activePeriod.value)?.label || activePeriod.value },
      chartElements,
      reportsStore.recentAIInsight?.generated_text || 'No hay observaciones clínicas registradas.',
      { ...reportsStore.summary, independence_pct: reportsStore.summary?.independence_pct || 0 }
    )
  } catch (err) {
    console.error("Error al exportar PDF:", err)
  } finally {
    isExporting.value = false
  }
}

onMounted(async () => {
  await loadAllData(props.childId)
})

watch(() => props.childId, async (newId) => { 
  if (newId) await loadAllData(newId)
})

watch(activePeriod, async () => {
  await loadAllData(props.childId)
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.export-chart {
  position: relative;
  overflow: hidden;
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

.transition-all { transition-duration: 1000ms; }
</style>