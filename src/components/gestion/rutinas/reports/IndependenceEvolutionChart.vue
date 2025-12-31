<template>
  <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm h-full flex flex-col overflow-hidden">
    <div class="flex items-center justify-between mb-6 flex-shrink-0">
      <div>
        <h3 class="text-lg font-black text-gray-900 leading-none">Evolución de Independencia</h3>
        <p class="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-widest">Histórico de los últimos 30 días</p>
      </div>
      <div class="p-2.5 bg-blue-50 rounded-2xl">
        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      </div>
    </div>

    <div class="relative h-[350px] w-full mt-auto">
      <div v-if="evolutionData.length === 0" class="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
        <div class="text-3xl mb-2">📈</div>
        <p class="text-gray-400 font-bold text-xs uppercase tracking-widest">Sin datos suficientes</p>
      </div>
      
      <Line 
        v-else
        :key="evolutionData.length"
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
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'
import type { IndependenceEvolution } from '@/type/rutinas/reports'

// Registrar componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Props
const props = defineProps<{
  evolutionData: IndependenceEvolution[]
}>()

/**
 * ✅ Transformar datos para Chart.js
 */
const chartData = computed(() => {
  const sortedData = [...props.evolutionData].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return {
    labels: sortedData.map(item => {
      const d = new Date(item.date)
      return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
    }),
    datasets: [
      {
        label: 'Independencia',
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(37, 99, 235, 0.15)');
          gradient.addColorStop(1, 'rgba(37, 99, 235, 0)');
          return gradient;
        },
        borderColor: '#2563eb',
        borderWidth: 3,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#2563eb',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
        data: sortedData.map(item => item.score)
      }
    ]
  }
})

/**
 * ✅ Configuración Estética (Ajustada para estabilidad)
 */
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false, // Crítico para evitar el bucle de resize
  animation: {
    duration: 750,
    easing: 'easeInOutQuart' as const
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0f172a',
      padding: 12,
      titleFont: { size: 12, weight: 'bold' as const },
      bodyFont: { size: 12 },
      cornerRadius: 12,
      displayColors: false,
      callbacks: {
        label: (context: any) => `Independencia: ${context.parsed.y}%`
      }
    }
  },
  scales: {
    y: {
      min: 0,
      max: 100,
      ticks: {
        stepSize: 25,
        callback: (value: any) => `${value}%`,
        color: '#94a3b8',
        font: { size: 10, weight: 'bold' as const }
      },
      grid: {
        color: '#f1f5f9',
        drawBorder: false
      }
    },
    x: {
      ticks: {
        color: '#94a3b8',
        font: { size: 10, weight: 'bold' as const },
        maxRotation: 0
      },
      grid: { display: false }
    }
  }
}
</script>

<style scoped>
/* Evitar que el canvas crezca fuera de su contenedor */
canvas {
  max-width: 100% !important;
  max-height: 100% !important;
}
</style>