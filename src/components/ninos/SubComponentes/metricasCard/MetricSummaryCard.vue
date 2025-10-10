<!-- src/components/ninos/SubComponentes/metricasCard/MetricSummaryCard.vue -->
<template>
  <MetricCard
    titulo="Total NNA"
    :valor="totalNinos"
    subtitulo="Niños y adolescentes en el sistema"
    icono="👥"
    :tendencia="tendencia"
    :loading="loading"
  />
</template>

<script setup lang="ts">
import MetricCard from './MetricCard.vue';

interface Props {
  totalNinos: number;
  loading?: boolean;
  tendencia?: 'positiva' | 'negativa' | 'neutral';
}

withDefaults(defineProps<Props>(), {
  loading: false,
  tendencia: 'neutral'
});
</script>