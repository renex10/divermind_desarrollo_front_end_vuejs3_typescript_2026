<!-- src/App.vue -->
<template>
  <RouterView />
  <Alert /> <!-- Componente de alertas global -->
</template>

<script setup lang="ts">
import Alert from '@/components/ui/alertas/Alert.vue'
</script>
