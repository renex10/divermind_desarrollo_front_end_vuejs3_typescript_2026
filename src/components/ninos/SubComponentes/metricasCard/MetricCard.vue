<!-- src/components/ninos/SubComponentes/metricasCard/MetricCard.vue -->
<template>
  <div 
    class="metric-card" 
    :class="{
      'metric-card--loading': loading,
      'metric-card--positive': tendencia === 'positiva',
      'metric-card--negative': tendencia === 'negativa',
      'metric-card--neutral': tendencia === 'neutral'
    }"
  >
    <!-- Header con título e ícono -->
    <div class="metric-card__header">
      <h3 class="metric-card__title">{{ titulo }}</h3>
      <div v-if="icono" class="metric-card__icon">
        {{ icono }}
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="metric-card__content">
      <div v-if="loading" class="metric-card__loading">
        <div class="loading-skeleton"></div>
      </div>
      
      <template v-else>
        <div class="metric-card__value">{{ valorFormateado }}</div>
        <div v-if="subtitulo" class="metric-card__subtitle">{{ subtitulo }}</div>
        
        <!-- Indicador de tendencia -->
        <div v-if="tendencia" class="metric-card__trend">
          <span class="trend-icon">{{ tendenciaIcono }}</span>
          <span class="trend-text">{{ tendenciaTexto }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { MetricCardProps } from '@/type/metricas';

// Props con TypeScript
const props = withDefaults(defineProps<MetricCardProps>(), {
  tendencia: 'neutral',
  loading: false
});

// Computed para formatear valores
const valorFormateado = computed(() => {
  if (typeof props.valor === 'number') {
    return props.valor.toLocaleString('es-CL');
  }
  return props.valor;
});

// Ícono y texto de tendencia
const tendenciaIcono = computed(() => {
  switch (props.tendencia) {
    case 'positiva': return '↗';
    case 'negativa': return '↘';
    default: return '→';
  }
});

const tendenciaTexto = computed(() => {
  switch (props.tendencia) {
    case 'positiva': return 'Positiva';
    case 'negativa': return 'Negativa';
    default: return 'Estable';
  }
});
</script>

<style scoped>
.metric-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  height: fit-content;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.metric-card--loading {
  opacity: 0.7;
}

.metric-card--positive {
  border-left: 4px solid #10b981;
}

.metric-card--negative {
  border-left: 4px solid #ef4444;
}

.metric-card--neutral {
  border-left: 4px solid #6b7280;
}

.metric-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.metric-card__title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.metric-card__icon {
  font-size: 1.25rem;
  opacity: 0.7;
}

.metric-card__content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.metric-card__value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.metric-card__subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

.metric-card__trend {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  margin-top: 0.5rem;
}

.trend-icon {
  font-weight: bold;
}

.metric-card--positive .trend-icon {
  color: #10b981;
}

.metric-card--negative .trend-icon {
  color: #ef4444;
}

.metric-card--neutral .trend-icon {
  color: #6b7280;
}

.trend-text {
  color: #6b7280;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
}

/* Loading skeleton */
.loading-skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  height: 2rem;
  border-radius: 4px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .metric-card {
    padding: 1rem;
  }
  
  .metric-card__value {
    font-size: 1.5rem;
  }
}
</style>