<template>
  <FormKit
    type="select"
    :label="label"
    :placeholder="placeholder"
    :value="modelValue"
    @input="emit('update:modelValue', $event)"
    :options="routineTypeOptions"
    :validation="validation"
    :validation-messages="validationMessages"
    :help="help"
    :disabled="disabled"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

// === PROPS ===
// Defines the properties the component accepts for customization
const props = withDefaults(defineProps<{
  /**
   * The currently selected value (used with v-model).
   */
  modelValue: string | null
  /**
   * Text label displayed above the selector.
   */
  label?: string
  /**
   * Placeholder text shown when no option is selected.
   */
  placeholder?: string
  /**
   * FormKit validation rules (e.g., 'required').
   */
  validation?: string | Array<string | [string, ...any[]]>
  /**
   * Custom messages for validation errors.
   */
  validationMessages?: Record<string, string>
  /**
   * Helper text displayed below the selector.
   */
  help?: string
  /**
   * Disables the selector if true.
   */
  disabled?: boolean
}>(), {
  // Default values for optional props
  label: 'Tipo de Rutina',
  placeholder: 'Selecciona un tipo',
  validation: '',
  validationMessages: () => ({}), // Needs to be a factory function for objects/arrays
  help: '',
  disabled: false,
})

// === EMITS ===
// Defines the event emitted for v-model compatibility
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

// === OPTIONS ===
// Defines the available routine types. 
// These correspond to the keys ('morning', 'evening', etc.) expected by the backend.
// The 'label' is what the user sees.
const routineTypeOptions = ref([
  { value: 'morning', label: 'Mañana (Ej: Despertar, ir al colegio)' },
  { value: 'afternoon', label: 'Tarde (Ej: Después del colegio, tareas)' },
  { value: 'evening', label: 'Noche (Ej: Cena, ir a dormir)' },
  { value: 'hygiene', label: 'Higiene (Ej: Ducha, lavarse los dientes)' },
  { value: 'feeding', label: 'Alimentación (Ej: Comer en la mesa)' },
  { value: 'play', label: 'Juego (Ej: Tiempo de juego estructurado)' },
  { value: 'therapy', label: 'Terapia (Ej: Ejercicios específicos)' },
  { value: 'transition', label: 'Transición (Ej: Cambio entre actividades)' },
  { value: 'other', label: 'Otro' },
])

</script>