<!-- src/App.vue -->
<template>
  <RouterView />
  <AlertModal /> <!-- Componente de modal de alertas -->  
  <Alert /> <!-- Componente de alertas global -->
</template>

<script setup lang="ts">
import Alert from '@/components/ui/alertas/Alert.vue'
import AlertModal from '@/components/ui/alertas/AlertModal.vue'
</script>
