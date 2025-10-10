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
import { computed } from 'vue';
import MetricCard from './MetricCard.vue';

interface Props {
  conNecesidadesEspeciales: number;
  porcentajeConNee: number;
  loading?: boolean;
  tendencia?: 'positiva' | 'negativa' | 'neutral';
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  tendencia: 'neutral'
});
</script>