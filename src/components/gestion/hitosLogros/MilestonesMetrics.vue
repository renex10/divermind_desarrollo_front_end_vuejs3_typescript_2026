<template>
    <div class="space-y-6">
        <h3 class="text-xl font-bold text-gray-900 border-b pb-2">
            Métricas de Logro Cognitivo
        </h3>

        <div v-if="!hasMilestones" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p class="text-center text-gray-500 py-8 italic">
                Aún no hay suficientes hitos registrados para generar las métricas de avance.
            </p>
        </div>

        <div v-else>
            <div class="grid grid-cols-3 gap-3 mb-6">
                <InsightBox
                    title="TOTAL HITOS"
                    :value="totalHitos.toString()"
                    sub-text="Registros acumulados"
                />
                <InsightBox
                    title="TASA DE DOMINIO"
                    :value="tasaDominio.toFixed(0) + '%'"
                    sub-text="Hitos marcados como 'Dominado'"
                    trend-type="positive"
                />
                <InsightBox
                    title="VS. 30 DÍAS ANTERIORES"
                    :value="trendVsPrevious.value"
                    :trend="trendVsPrevious.value"
                    :trend-type="trendVsPrevious.type"
                    :sub-text="`Diferencia de ${trendVsPrevious.count} hitos`"
                />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">

                <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                    <h4 class="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-primary-500"></span>
                        Perfil de Avance por Dominio (Total)
                    </h4>
                    <div class="bg-gray-50 p-3 rounded-md border border-gray-200 mb-4">
                        <p class="text-xs text-gray-700">
                            💡 **Análisis:** <span v-html="insightCategory"></span>
                        </p>
                    </div>
                    
                    <div class="flex-1 relative min-h-[250px] max-h-[350px]">
                        <Doughnut :data="categoryData" :options="doughnutOptions" />
                    </div>
                </div>

                <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                    <h4 class="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                        Consolidación de Logros (Ambiente)
                    </h4>
                    <div class="bg-gray-50 p-3 rounded-md border border-gray-200 mb-4">
                        <p class="text-xs text-gray-700">
                            💡 **Análisis:** <span v-html="insightContext"></span>
                        </p>
                    </div>

                    <div class="flex-1 relative min-h-[250px] max-h-[350px]">
                        <Pie :data="contextData" :options="doughnutOptions" />
                    </div>
                </div>

                <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:col-span-2 lg:col-span-1">
                    <h4 class="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Evolución del Nivel de Independencia
                    </h4>
                    <div class="bg-gray-50 p-3 rounded-md border border-gray-200 mb-4">
                        <p class="text-xs text-gray-700">
                            💡 **Análisis:** <span v-html="insightIndependence"></span>
                        </p>
                    </div>

                    <div class="flex-1 relative min-h-[250px] max-h-[350px]">
                        <Line :data="independenceTrendData" :options="lineOptions" />
                    </div>
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
    Title,
    ChartData,
    ChartOptions
} from 'chart.js';
import { Doughnut, Pie, Line } from 'vue-chartjs';
import InsightBox from './InsightBox.vue';
import type { Milestone } from '@/type/hitoServiceInterface'; 
import { format } from 'date-fns'; // Necesitarás date-fns o similar para el manejo de fechas

// 1. REGISTRAR COMPONENTES DE CHART.JS
ChartJS.register(
    ArcElement, Tooltip, Legend, CategoryScale, LinearScale, 
    PointElement, LineElement, Title
);

// 2. PROPIEDADES (PROPS)
const props = defineProps<{
    milestones: Milestone[];
}>();

// Estado de verificación de datos
const hasMilestones = computed(() => props.milestones && props.milestones.length > 0);

// --- UTILIDAD: Mapeo de Colores y Valores ---
const COLORS = {
    'communication': '#3b82f6', 
    'social': '#f97316',        
    'cognitive': '#8b5cf6',     
    'motor': '#10b981',         
    'academic': '#f59e0b',      
    'emotional': '#ef4444',     
    'therapeutic': '#ec4899',   
    'default': '#9ca3af'
};
const SUPPORT_MAP = {
    'independent': 5,
    'verbal_cue': 4,
    'visual_cue': 3,
    'physical_prompt': 2,
    'full_assistance': 1,
};
const SUPPORT_LEVEL_NAMES = {
    'independent': 'Independiente',
    'verbal_cue': 'Verbal',
    'visual_cue': 'Visual',
    'physical_prompt': 'Física',
    'full_assistance': 'Total',
};
const CONTEXT_NAMES = {
    'therapy': 'Terapia',
    'home': 'Casa',
    'school': 'Escuela',
    'community': 'Comunidad',
    'multiple': 'Múltiples',
};


// ----------------------------------------------------------
// --- Lógica de Cálculo de Métricas Clave (Para InsightBox) ---
// ----------------------------------------------------------

const date30DaysAgo = computed(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.getTime();
});

const currentPeriodMilestones = computed(() => {
    const now = Date.now();
    const thirtyDaysAgo = date30DaysAgo.value;
    return props.milestones.filter(m => {
        const milestoneTime = new Date(m.date).getTime();
        return milestoneTime >= thirtyDaysAgo && milestoneTime <= now;
    });
});

const previousPeriodMilestones = computed(() => {
    const thirtyDaysAgo = date30DaysAgo.value;
    const sixtyDaysAgo = new Date(date30DaysAgo.value);
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 30);
    const sixtyDaysAgoTime = sixtyDaysAgo.getTime();

    return props.milestones.filter(m => {
        const milestoneTime = new Date(m.date).getTime();
        return milestoneTime >= sixtyDaysAgoTime && milestoneTime < thirtyDaysAgo;
    });
});

const totalHitos = computed(() => props.milestones.length);

const tasaDominio = computed(() => {
    if (!hasMilestones.value) return 0;
    const masteredCount = props.milestones.filter(m => m.proficiency_level === 'mastered').length;
    return (masteredCount / totalHitos.value) * 100;
});

const trendVsPrevious = computed(() => {
    const currentCount = currentPeriodMilestones.value.length;
    const previousCount = previousPeriodMilestones.value.length;
    
    if (previousCount === 0) {
        if (currentCount > 0) {
            return { value: `+${currentCount} Hitos`, type: 'positive' as const, count: currentCount };
        }
        return { value: '0%', type: 'neutral' as const, count: 0 };
    }

    const percentageChange = ((currentCount - previousCount) / previousCount) * 100;
    const diffCount = currentCount - previousCount;
    
    const type: 'positive' | 'negative' | 'neutral' = percentageChange > 0 
        ? 'positive' : (percentageChange < 0 ? 'negative' : 'neutral');
        
    const sign = percentageChange > 0 ? '+' : '';
    
    return { 
        value: `${sign}${percentageChange.toFixed(0)}%`, 
        type,
        count: diffCount
    };
});

// ----------------------------------------------------------
// --- Lógica de Insights Individuales ---
// ----------------------------------------------------------

// INSIGHT 1: Perfil de Logro por Categoría
const insightCategory = computed(() => {
    if (!hasMilestones.value) return '';
    
    const categoryCounts = props.milestones.reduce((acc, item) => {
        acc[item.category_display] = (acc[item.category_display] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const sortedCategories = Object.entries(categoryCounts).sort(([, a], [, b]) => b - a);
    const strongestCategory = sortedCategories[0];
    const strongestCount = strongestCategory[1];
    
    // Calcular el total para obtener el porcentaje
    const totalCount = props.milestones.length;
    const strongestPercentage = (strongestCount / totalCount) * 100;

    let insight = `**${strongestCategory[0]}** es el dominio más avanzado, representando el **${strongestPercentage.toFixed(0)}%** de todos los logros (${strongestCount} hitos).`;
    
    if (sortedCategories.length > 1) {
        const weakestCategory = sortedCategories[sortedCategories.length - 1];
        if (weakestCategory[1] < (totalCount / sortedCategories.length) * 0.5) {
             insight += ` Se recomienda mayor atención a **${weakestCategory[0]}** (${weakestCategory[1]} hitos) para equilibrar el desarrollo.`;
        }
    }
    return insight;
});

// INSIGHT 2: Nivel de Consolidación (Contexto)
const insightContext = computed(() => {
    if (!hasMilestones.value) return '';

    const contextCounts = props.milestones.reduce((acc, item) => {
        const key = item.context_display || 'Otro';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const totalCount = props.milestones.length;
    
    const therapyCount = contextCounts[CONTEXT_NAMES.therapy] || 0;
    const therapyPercentage = (therapyCount / totalCount) * 100;

    // Calcular la consolidación (fuera de terapia: Casa, Escuela, Comunidad)
    const consolidationCount = Object.entries(contextCounts)
        .filter(([key]) => key !== CONTEXT_NAMES.therapy)
        .reduce((sum, [, count]) => sum + count, 0);
    const consolidationPercentage = (consolidationCount / totalCount) * 100;

    let insight = `El ${therapyPercentage.toFixed(0)}% de los logros se observaron **'En Terapia'**. `;

    if (consolidationPercentage > 50) {
        insight += `Esto es positivo, ya que el ${consolidationPercentage.toFixed(0)}% se está logrando en ambientes externos, lo que indica **buena generalización**.`;
    } else if (consolidationPercentage > 0) {
        insight += `Solo el ${consolidationPercentage.toFixed(0)}% se observa fuera de la terapia, sugiriendo que la generalización requiere **mayor enfoque en casa o escuela**.`;
    } else {
         insight += `**No hay registros fuera de Terapia**, la generalización es la prioridad clínica.`;
    }
    return insight;
});

// INSIGHT 3: Tendencia de Independencia
const insightIndependence = computed(() => {
    if (props.milestones.length < 5) {
        return 'Se necesitan más registros para establecer una tendencia clara de autonomía.';
    }

    const sortedMilestones = [...props.milestones].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Mapeo numérico
    const dataPoints = sortedMilestones.map(m => SUPPORT_MAP[m.support_level as keyof typeof SUPPORT_MAP] || 0);
    
    // Comparar la independencia promedio del último tercio vs el primer tercio
    const periodLength = Math.floor(dataPoints.length / 3);
    if (periodLength < 1) return 'Se necesitan más registros para establecer una tendencia clara de autonomía.';
    
    const initialAvg = dataPoints.slice(0, periodLength).reduce((sum, val) => sum + val, 0) / periodLength;
    const recentAvg = dataPoints.slice(-periodLength).reduce((sum, val) => sum + val, 0) / periodLength;
    
    const diff = recentAvg - initialAvg;
    const diffPercentage = (diff / initialAvg) * 100;
    
    let insight = `El nivel de independencia promedio ha pasado de **${initialAvg.toFixed(1)}** a **${recentAvg.toFixed(1)}**. `;

    if (diff > 0.5) {
        insight += `Esto representa una **mejora significativa** del ${diffPercentage.toFixed(0)}% en la autonomía con el tiempo.`;
    } else if (diff < -0.5) {
        insight += `Se observa una **regresión** o mayor necesidad de apoyo (${diffPercentage.toFixed(0)}% de disminución), sugiriendo revisar las estrategias.`;
    } else {
        insight += `La independencia se mantiene estable, lo que es un buen indicador de **consolidación de habilidades**.`;
    }

    // Identificar el soporte más frecuente recientemente
    const recentSupport = sortedMilestones.slice(-periodLength).map(m => m.support_level_display);
    const mostFrequentSupport = recentSupport.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    const mostUsed = Object.entries(mostFrequentSupport).sort(([, a], [, b]) => b - a)[0];
    insight += ` El tipo de apoyo más frecuente es **${mostUsed[0]}**.`;

    return insight;
});

// ----------------------------------------------------------
// --- Lógica de Gráficos y Opciones (Sin Cambios) ---
// ----------------------------------------------------------

const categoryData = computed<ChartData<'doughnut'>>(() => {
    // Lógica idéntica al código anterior
    const counts = props.milestones.reduce((acc, item) => {
        const key = item.category_display || 'Sin Categoría';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(counts);
    const data = Object.values(counts);

    return {
        labels: labels,
        datasets: [{
            data: data,
            backgroundColor: labels.map(label => {
                const key = props.milestones.find(m => m.category_display === label)?.category || 'default';
                return COLORS[key as keyof typeof COLORS];
            }),
            hoverBackgroundColor: labels.map(label => {
                const key = props.milestones.find(m => m.category_display === label)?.category || 'default';
                return COLORS[key as keyof typeof COLORS];
            }),
        }]
    };
});


const contextData = computed<ChartData<'pie'>>(() => {
    // Lógica idéntica al código anterior
    const counts = props.milestones.reduce((acc, item) => {
        const key = item.context_display || 'Otro';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(counts);
    const data = Object.values(counts);

    return {
        labels: labels,
        datasets: [{
            data: data,
            backgroundColor: ['#1c9e49', '#6366f1', '#f59e0b', '#ec4899', '#6b7280', '#e0e7ff'],
        }]
    };
});


const independenceTrendData = computed<ChartData<'line'>>(() => {
    // Lógica idéntica al código anterior
    const sortedMilestones = [...props.milestones].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const dataPoints = sortedMilestones.map(m => SUPPORT_MAP[m.support_level as keyof typeof SUPPORT_MAP] || 0);
    const labels = sortedMilestones.map(m => new Date(m.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' }));

    return {
        labels: labels,
        datasets: [{
            label: 'Independencia (5=Alto, 1=Bajo)',
            data: dataPoints,
            borderColor: COLORS.motor, 
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            tension: 0.4, 
            fill: true
        }]
    };
});


const doughnutOptions: ChartOptions<'doughnut' | 'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'bottom' as const, labels: { boxWidth: 12, font: { size: 12 } } },
        title: { display: false }
    }
};

const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true } },
    scales: {
        y: { 
            beginAtZero: true, 
            max: 5, 
            title: { display: true, text: 'Nivel de Soporte' } 
        },
        x: {
            ticks: { autoSkip: true, maxTicksLimit: 10 } 
        }
    }
};

</script>

<style scoped>
/* Estilos específicos para métricas, si es necesario */
.shadow-soft {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
}
</style>