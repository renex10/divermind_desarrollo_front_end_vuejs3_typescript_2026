<template>
  <BaseModal 
    :show="isOpen" 
    @update:show="closeDialog" 
    @close="closeDialog"
    title="Clonar Rutina" 
    size="md"
  >
    <p class="text-sm text-gray-500 mb-4">
      Crea una copia de <span class="font-medium text-primary-700">"{{ originalRoutineName }}"</span>.
    </p>

    <FormKit
      type="form"
      id="cloneRoutineForm" 
      v-model="formData"
      @submit="submitClone"
      :actions="false" 
      form-class="space-y-4"
    >
      <FormKit
        type="text"
        name="newName"
        label="Nuevo Nombre"
        placeholder="Ej: Rutina Matutina (Fin de semana)"
        validation="required|length:5,100"
        :validation-messages="{
          required: 'El nuevo nombre es obligatorio.',
          length: 'El nombre debe tener entre 5 y 100 caracteres.',
        }"
        help="Ingresa un nombre único para la copia."
      />

      <div class="space-y-2 pt-2">
         <FormKit
          type="checkbox"
          name="copySteps"
          label="Copiar todos los pasos"
          help="Incluye los pasos definidos en la rutina original."
        />
         <FormKit
          type="checkbox"
          name="copyStrategies"
          label="Copiar estrategias"
          help="Incluye la configuración de flexibilidad, avisos, etc."
        />
      </div>

      <div v-if="error" class="p-3 bg-error-50 text-error-700 border border-error-200 rounded-lg text-sm">
         {{ error }}
      </div>

    </FormKit> {# Cierre del FormKit #}

    <template #footer>
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="closeDialog"
          class="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Cancelar
        </button>
        <button
          type="submit" 
          form="cloneRoutineForm" 
          :disabled="isLoading"
          class="inline-flex items-center justify-center rounded-lg border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
        >
           <span v-if="!isLoading">Clonar Rutina</span>
           <span v-else class="flex items-center">
             <div class="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
             Clonando...
           </span>
        </button>
      </div>
    </template>
    
  </BaseModal> 
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

// Importamos el modal base
import BaseModal from '@/components/modal/BaseModal.vue' 
// Icono para el título (opcional, si quieres añadirlo junto al texto)
// import { DocumentDuplicateIcon } from '@heroicons/vue/24/outline' 
import { useRoutinesStore } from '@/store/rutinas/routinesStore'
import type { DailyRoutineList } from '@/type/rutinas/rutinas'

// === PROPS === (Sin cambios respecto a la versión anterior)
const props = defineProps({
  open: { type: Boolean, default: false },
  routineId: { type: Number, required: true },
  originalRoutineName: { type: String, required: true },
  childId: { type: Number, required: true }
})

// === EMITS === (Sin cambios)
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'cloned', payload: DailyRoutineList): void
}>()

// === STORE & STATE === (Sin cambios)
const routinesStore = useRoutinesStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const formData = ref({
  newName: `${props.originalRoutineName} (Copia)`,
  copySteps: true,
  copyStrategies: true
})

// === COMPUTED ===
// Sincroniza v-model:open con BaseModal
const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

// === METHODS ===

/**
 * Cierra el modal a través del v-model.
 * BaseModal emitirá @close, pero lo manejamos actualizando el v-model.
 */
function closeDialog() {
  isOpen.value = false 
}

/**
 * Maneja la sumisión del FormKit. (Sin cambios lógicos)
 */
async function submitClone() {
  isLoading.value = true
  error.value = null
  try {
    // La lógica de llamada al store sigue igual
    const clonedRoutine = await routinesStore.cloneRoutine(
      props.childId, 
      props.routineId, 
      formData.value.newName
    )
    emit('cloned', clonedRoutine) 
    closeDialog()
  } catch (err: any) {
    console.error("Error cloning routine:", err)
    error.value = err.message || "No se pudo clonar la rutina. Inténtalo de nuevo."
  } finally {
    isLoading.value = false
  }
}

/**
 * Resetea el formulario cuando se abre el modal. (Sin cambios)
 */
watch(() => props.open, (newVal) => {
  if (newVal) {
    formData.value.newName = `${props.originalRoutineName} (Copia)`
    formData.value.copySteps = true
    formData.value.copyStrategies = true
    error.value = null
  }
})
</script>