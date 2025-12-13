<!-- src/components/ninos/SubComponentes/metricasCard/MetricClinicalCard.vue -->
<template>
  <MetricCard
    titulo="Con NEE"
    :valor="conNecesidadesEspeciales"
    :subtitulo="`${porcentajeConNee}% del total`"
    icono="🏥"
    :tendencia="tendencia"
    :loading="loading"
  />
</template>

<script setup lang="ts">
import MetricCard from './MetricCard.vue';

interface Props {
  conNecesidadesEspeciales: number;
  porcentajeConNee: number;
  loading?: boolean;
  tendencia?: 'positiva' | 'negativa' | 'neutral';
}

withDefaults(defineProps<Props>(), {
  loading: false,
  tendencia: 'neutral'
});
</script>