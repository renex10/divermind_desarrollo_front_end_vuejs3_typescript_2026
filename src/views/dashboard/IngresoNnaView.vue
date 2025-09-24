<!-- src/views/dashboard/IngresoNnaView.vue -->
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Gestión de NNA</h1>
    
    <button
      @click="openMultiStep"
      class="bg-color3 hover:bg-color4 text-white px-4 py-2 rounded"
    >
      Agregar Nuevo NNA
    </button>
    
    <!-- El Modal se renderiza globalmente a través del store -->
  </div>
</template>

<script setup lang="ts">
import { useModal } from '../../composables/useModal'
import MultiStepFormModal from '../../components/forms/multi-step/MultiStepFormModal.vue'

const { open } = useModal()

function openMultiStep() {
  console.log('🔥 Abriendo modal multipaso...')
  open(MultiStepFormModal)
}
</script>