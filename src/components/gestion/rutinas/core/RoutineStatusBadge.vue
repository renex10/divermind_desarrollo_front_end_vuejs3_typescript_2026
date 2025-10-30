<template>
  <span 
    :class="badgeClasses"
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
  >
    {{ statusText }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'

// Defines the possible status values the badge can receive
type RoutineStatus = 'active' | 'paused' | 'archived' | 'draft' | string;

// === PROPS ===
const props = defineProps({
  /**
   * The status of the routine. Determines the color and text.
   * Expected values: 'active', 'paused', 'archived', 'draft'.
   */
  status: {
    type: String as PropType<RoutineStatus>,
    required: true,
    // Validator to ensure only expected statuses are passed (optional but good practice)
    validator: (value: string) => ['active', 'paused', 'archived', 'draft'].includes(value)
  }
})

// === COMPUTED ===

/**
 * Determines the Tailwind CSS classes for the badge based on the status prop.
 * Uses the color palette defined in your tailwind.config.js.
 */
const badgeClasses = computed(() => {
  switch (props.status) {
    case 'active':
      // Uses 'success' colors for active state
      return 'bg-success-100 text-success-800'; 
    case 'paused':
      // Uses 'warning' colors for paused state
      return 'bg-warning-100 text-warning-800'; 
    case 'archived':
      // Uses 'error' or neutral 'gray' colors for archived state
      return 'bg-gray-100 text-gray-600'; // Example using gray
      // return 'bg-error-100 text-error-800'; // Alternative using error
    case 'draft':
      // Uses neutral 'gray' colors for draft state
      return 'bg-gray-200 text-gray-700'; 
    default:
      // Fallback style for unexpected status values
      return 'bg-gray-100 text-gray-800';
  }
})

/**
 * Determines the display text for the badge based on the status prop.
 */
const statusText = computed(() => {
  // Directly returns the status prop, relying on the 'capitalize' Tailwind class
  // You could also map values here if needed:
  // const map = { active: 'Activa', paused: 'Pausada', ... }
  // return map[props.status] || props.status;
  return props.status;
})

</script>