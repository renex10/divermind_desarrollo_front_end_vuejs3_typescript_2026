<!-- src\components\forms\multi-step\components\DataField.vue -->
<template>
  <div class="data-field" :class="{ 'col-span-full': isLong }">
    <label class="field-label">{{ label }}</label>
    <div class="field-value" :class="{ 'long-text': isLong }">
      {{ value || 'No especificado' }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  value: string
  isLong?: boolean
}

defineProps<Props>()
</script>

<style scoped>
.data-field {
  @apply space-y-1;
}

.field-label {
  @apply block text-sm font-medium text-gray-700;
}

.field-value {
  @apply block text-sm text-gray-900 p-2 bg-white border border-gray-200 rounded;
}

.field-value.long-text {
  @apply whitespace-pre-wrap min-h-[60px] max-h-32 overflow-y-auto;
}

.col-span-full {
  @apply md:col-span-2;
}
</style>