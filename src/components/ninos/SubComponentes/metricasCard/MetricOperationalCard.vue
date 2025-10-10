<!-- src/components/ninos/SubComponentes/metricasCard/MetricOperationalCard.vue -->
<template>
  <MetricCard
    titulo="Sin Consentimiento"
    :valor="sinConsentimiento"
    subtitulo="Requieren atención"
    icono="⚠️"
    tendencia="negativa"
    :loading="loading"
  />
</template>

<script setup lang="ts">
import MetricCard from './MetricCard.vue';

interface Props {
  sinConsentimiento: number;
  loading?: boolean;
}

defineProps<Props>();
</script>