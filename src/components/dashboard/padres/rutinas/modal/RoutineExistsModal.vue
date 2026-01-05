<template>
    <!-- src\components\dashboard\padres\rutinas\modal\RoutineExistsModal.vue -->
  <BaseModal 
    :show="show" 
    title="Registro Existente" 
    size="sm"
    @close="handleCancel"
    @update:show="$emit('update:show', $event)"
  >
    <div class="p-4 text-center">
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
        <InformationCircleIcon class="h-6 w-6 text-blue-600" aria-hidden="true" />
      </div>
      
      <h3 class="text-lg font-medium text-gray-900 mb-2">¡Rutina ya realizada hoy!</h3>
      
      <p class="text-sm text-gray-500 mb-6">
        Ya existe un registro para esta rutina con fecha de hoy. 
        <br><br>
        ¿Deseas <strong>actualizar</strong> la información existente o <strong>cancelar</strong>?
      </p>

      <div class="flex justify-center gap-3">
        <button 
          @click="handleCancel"
          class="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button 
          @click="handleConfirm"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        >
          Sí, Actualizar
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/modal/BaseModal.vue'
import { InformationCircleIcon } from '@heroicons/vue/24/outline'

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const handleConfirm = () => {
  emit('confirm')
  emit('update:show', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:show', false)
}
</script>