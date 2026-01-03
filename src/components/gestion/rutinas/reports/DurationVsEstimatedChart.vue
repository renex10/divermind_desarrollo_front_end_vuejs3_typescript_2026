<template>
  <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-lg font-black text-gray-900 leading-none">Eficiencia por Paso</h3>
        <p class="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wider">Desvío temporal real vs. planificación</p>
      </div>
      <div class="p-2 bg-amber-50 rounded-xl">
        <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>

    <div class="flex-1 relative min-h-[300px]">
      <div v-if="!timeData || timeData.length === 0" class="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
        <p class="text-gray-300 font-bold text-sm">No hay registros de granularidad para comparar tiempos.</p>
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
// ✅ Importamos la nueva interfaz desde el store
import type { TimeEfficiencyData } from '@/store/rutinas/routineReportsStore'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

/**
 * PROPS: Actualizadas para recibir la granularidad de pasos
 */
const props = defineProps<{
  timeData: TimeEfficiencyData[]
}>()

/**
 * ✅ Preparación de datos: Ahora el eje X son los Pasos/Acciones
 */
const chartData = computed<ChartData<'bar'>>(() => {
  return {
    // Usamos el nombre de la acción como etiqueta
    labels: props.timeData.map(item => item.step_action),
    datasets: [
      {
        label: 'Estimado (min)',
        backgroundColor: '#e2e8f0', // slate-200
        borderRadius: 6,
        // Convertimos segundos a minutos para legibilidad clínica
        data: props.timeData.map(item => Number((item.avg_estimated_seconds / 60).toFixed(1)))
      },
      {
        label: 'Real Promedio (min)',
        backgroundColor: '#f59e0b', // amber-500
        borderRadius: 6,
        data: props.timeData.map(item => Number((item.avg_real_seconds / 60).toFixed(1)))
      }
    ]
  }
})

/**
 * ✅ Configuración: Ajustada para análisis de eficiencia
 */
const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        font: { size: 10, weight: 'bold' },
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: '#1e293b',
      padding: 12,
      cornerRadius: 12,
      callbacks: {
        // Mostramos el porcentaje de desvío en el tooltip
        afterBody: (context) => {
          const index = context[0].dataIndex
          const deviation = props.timeData[index]?.deviation_percentage || 0
          const prefix = deviation > 0 ? '+' : ''
          return `\nDesvío: ${prefix}${deviation}%`
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
      },
      title: {
        display: true,
        text: 'Minutos',
        font: { size: 10, weight: 'bold' }
      }
    },
    x: {
      grid: { display: false },
      ticks: {
        color: '#64748b',
        font: { weight: 'bold', size: 9 },
        maxRotation: 45,
        minRotation: 45
      }
    }
  }
}
</script>