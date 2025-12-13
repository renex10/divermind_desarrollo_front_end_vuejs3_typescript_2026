<template>
    <!-- src\components\dashboard\perfil_nino\habilidadessociales\SocialSkillsMetrics.vue -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    
    <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col">
      <h3 class="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
        Autonomía vs. Dependencia
      </h3>
      <div class="flex-1 relative min-h-[200px]">
        <Doughnut v-if="hasData" :data="autonomyData" :options="doughnutOptions" />
        <p v-else class="text-xs text-gray-400 text-center mt-10">Faltan datos para graficar</p>
      </div>
    </div>

    <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col">
      <h3 class="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        Círculo Social (Generalización)
      </h3>
      <div class="flex-1 relative min-h-[200px]">
        <Pie v-if="hasData" :data="socialCircleData" :options="doughnutOptions" />
        <p v-else class="text-xs text-gray-400 text-center mt-10">Faltan datos para graficar</p>
      </div>
    </div>

    <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:col-span-2 lg:col-span-1">
      <h3 class="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-amber-500"></span>
        Duración con Pares (Minutos)
      </h3>
      <div class="flex-1 relative min-h-[200px]">
        <Line v-if="peerDurationData.datasets[0].data.length > 0" :data="peerDurationData" :options="lineOptions" />
        <div v-else class="h-full flex items-center justify-center">
            <p class="text-xs text-gray-400 italic">No hay interacciones con pares registradas aún.</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
} from 'chart.js';
import { Doughnut, Pie, Line } from 'vue-chartjs';
import type { SocialSkill } from '@/type/socialSkill';

// Registrar componentes de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const props = defineProps<{
  data: SocialSkill[]
}>();

const hasData = computed(() => props.data.length > 0);

// --- 1. DATOS AUTONOMÍA (Iniciativa vs Ayuda) ---
const autonomyData = computed(() => {
  // Nota: Un registro puede ser ambos o ninguno, aquí simplificamos para visualización
  const independent = props.data.filter(i => i.initiated_by_child && !i.needed_prompting).length;
  const dependent = props.data.length - independent;

  return {
    labels: ['Independiente', 'Con Ayuda'],
    datasets: [{
      backgroundColor: ['#6366f1', '#e0e7ff'], // Indigo-500, Indigo-100
      data: [independent, dependent]
    }]
  };
});

// --- 2. DATOS CÍRCULO SOCIAL (Partners) ---
const socialCircleData = computed(() => {
  const counts: Record<string, number> = {};
  
  props.data.forEach(item => {
    const partner = item.interaction_partner || 'Otros';
    counts[partner] = (counts[partner] || 0) + 1;
  });

  // Traducir labels (opcional)
  const labelsMap: Record<string, string> = {
    therapist: 'Terapeuta', peer: 'Par', group: 'Grupo', parent: 'Padres', teacher: 'Profe'
  };

  return {
    labels: Object.keys(counts).map(k => labelsMap[k] || k),
    datasets: [{
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#6b7280'],
      data: Object.values(counts)
    }]
  };
});

// --- 3. DATOS EVOLUCIÓN DURACIÓN (Solo Pares) ---
const peerDurationData = computed(() => {
  // Filtrar solo interacciones con pares/grupo y ordenarlas por fecha ascendente
  const peerInteractions = props.data
    .filter(i => ['peer', 'group'].includes(i.interaction_partner))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    labels: peerInteractions.map(i => new Date(i.date).toLocaleDateString(undefined, {day:'2-digit', month:'short'})),
    datasets: [{
      label: 'Minutos',
      borderColor: '#f59e0b', // Amber-500
      backgroundColor: '#fcd34d',
      data: peerInteractions.map(i => i.duration_minutes || 0),
      tension: 0.3
    }]
  };
});

// --- OPCIONES DE GRÁFICOS ---
const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' as const, labels: { boxWidth: 12, font: { size: 11 } } }
  }
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, title: { display: true, text: 'Minutos' } }
  }
};
</script>