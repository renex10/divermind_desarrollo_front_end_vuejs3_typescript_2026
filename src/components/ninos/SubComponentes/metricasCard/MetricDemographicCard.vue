<!-- src/components/ninos/SubComponentes/metricasCard/MetricDemographicCard.vue -->
<template>
  <MetricCard
    titulo="Distribución"
    :valor="totalPorGenero"
    subtitulo="Total por género"
    icono="👪"
    :loading="loading"
  />
</template>

<script setup lang="ts">
import MetricCard from './MetricCard.vue';

interface Props {
  totalPorGenero: number;
  loading?: boolean;
}

defineProps<Props>();
</script>