<template>
  <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-lg font-black text-gray-900 leading-none">Distribución de Apoyos</h3>
        <p class="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wider">Niveles de asistencia requeridos</p>
      </div>
      <div class="p-2 bg-indigo-50 rounded-xl">
        <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      </div>
    </div>

    <div class="flex-1 relative min-h-[300px] flex items-center justify-center">
      <div v-if="isDataEmpty" class="text-center p-4">
        <p class="text-gray-300 font-bold text-sm">No hay registros de apoyos para este periodo.</p>
      </div>
      
      <Doughnut 
        v-else
        :data="chartData" 
        :options="chartOptions" 
      />
    </div>

    <div v-if="!isDataEmpty" class="mt-6 grid grid-cols-2 gap-2">
      <div v-for="(val, key) in supportLabels" :key="key" class="flex items-center space-x-2">
        <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: supportColors[key] }"></span>
        <span class="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{{ val }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions
} from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import type { SupportDistribution } from '@/type/rutinas/reports'

// Registrar componentes necesarios para Doughnut
ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
  distribution: SupportDistribution | null
}>()

/**
 * Etiquetas legibles para los tipos de apoyo
 */
const supportLabels: Record<keyof SupportDistribution, string> = {
  independent: 'Independiente',
  verbal_cue: 'Apoyo Verbal',
  visual_cue: 'Apoyo Visual',
  gestural_cue: 'Apoyo Gestual',
  physical_prompt: 'Apoyo Físico',
  not_completed: 'No Realizado'
}

/**
 * Paleta de colores clínica (del más independiente al más dependiente)
 */
const supportColors: Record<keyof SupportDistribution, string> = {
  independent: '#10b981',     // emerald-500 (Éxito)
  verbal_cue: '#3b82f6',      // blue-500
  visual_cue: '#8b5cf6',      // violet-500
  gestural_cue: '#f59e0b',    // amber-500
  physical_prompt: '#ef4444', // red-500 (Máxima dependencia)
  not_completed: '#94a3b8'    // slate-400
}

const isDataEmpty = computed(() => {
  if (!props.distribution) return true
  return Object.values(props.distribution).every(val => val === 0)
})

/**
 * Transformación de datos para Chart.js
 */
const chartData = computed<ChartData<'doughnut'>>(() => {
  if (!props.distribution) return { labels: [], datasets: [] }

  const keys = Object.keys(supportLabels) as (keyof SupportDistribution)[]
  
  return {
    labels: keys.map(k => supportLabels[k]),
    datasets: [
      {
        data: keys.map(k => props.distribution![k]),
        backgroundColor: keys.map(k => supportColors[k]),
        hoverOffset: 15,
        borderWidth: 0,
        borderRadius: 8,
        spacing: 5
      }
    ]
  }
})

/**
 * Configuración de visualización
 */
const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%', // Grosor de la dona
  plugins: {
    legend: {
      display: false // Usamos nuestra propia leyenda para mayor control de diseño
    },
    tooltip: {
      backgroundColor: '#1e293b',
      padding: 12,
      cornerRadius: 12,
      titleFont: { size: 14, weight: 'bold' },
      usePointStyle: true,
      callbacks: {
        label: (context) => ` ${context.label}: ${context.raw} pasos`
      }
    }
  }
}
</script>

<style scoped>
/* Animación de entrada para el gráfico */
canvas {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>