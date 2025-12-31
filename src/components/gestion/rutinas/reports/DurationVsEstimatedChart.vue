<template>
  <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-lg font-black text-gray-900 leading-none">Tiempo Estimado vs. Real</h3>
        <p class="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wider">Eficiencia y cumplimiento de tiempos</p>
      </div>
      <div class="p-2 bg-amber-50 rounded-xl">
        <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>

    <div class="flex-1 relative min-h-[300px]">
      <div v-if="!chartData.labels || chartData.labels.length === 0" class="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
        <p class="text-gray-300 font-bold text-sm">No hay registros suficientes para comparar tiempos.</p>
      </div>
      
      <Bar 
        v-else
        :data="chartData" 
        :options="chartOptions" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartData,
  type ChartOptions
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import type { TimeComparison } from '@/type/rutinas/reports'

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps<{
  timeData: TimeComparison[]
}>()

/**
 * Diccionario de emojis para el impacto emocional registrado al final de la rutina
 */
const emotionalEmojis: Record<string, string> = {
  happy: '😊',
  calm: '😌',
  irritable: '😠',
  anxious: '😰'
}

/**
 * ✅ Preparación de datos para el gráfico
 */
const chartData = computed<ChartData<'bar'>>(() => {
  // Ordenamos cronológicamente
  const sortedData = [...props.timeData].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return {
    labels: sortedData.map(item => {
      const d = new Date(item.date)
      return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
    }),
    datasets: [
      {
        label: 'Estimado (min)',
        backgroundColor: '#e2e8f0', // slate-200
        borderRadius: 6,
        data: sortedData.map(item => item.estimated_minutes)
      },
      {
        label: 'Real (min)',
        backgroundColor: '#f59e0b', // amber-500
        borderRadius: 6,
        data: sortedData.map(item => item.actual_minutes)
      }
    ]
  }
})

/**
 * ✅ Configuración y Tooltips con contexto clínico
 */
const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        font: { size: 11, weight: 'bold' },
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: '#1e293b',
      padding: 12,
      cornerRadius: 12,
      callbacks: {
        // Añadimos el emoji emocional al final del tooltip
        afterBody: (context) => {
          const index = context[0].dataIndex
          const emotion = props.timeData[index]?.emotional_impact || 'calm'
          return `\nÁnimo final: ${emotionalEmojis[emotion] || 'Neutral'}`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: '#f8fafc' },
      ticks: {
        color: '#94a3b8',
        font: { weight: 'bold' },
        callback: (val) => `${val}m`
      }
    },
    x: {
      grid: { display: false },
      ticks: {
        color: '#94a3b8',
        font: { weight: 'bold', size: 10 }
      }
    }
  }
}
</script>

<style scoped>
/* Estilos para el estado de hover de las barras */
canvas {
  transition: opacity 0.3s ease;
}
</style>