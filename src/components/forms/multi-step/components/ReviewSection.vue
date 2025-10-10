<!-- src\components\forms\multi-step\components\ReviewSection.vue -->
<template>
  <div class="review-section" :class="{ 'is-open': isOpen, 'is-valid': isValid }">
    <button 
      @click="$emit('toggle')"
      class="section-header"
      type="button"
    >
      <div class="section-status">
        <div v-if="isValid" class="status-valid">✓</div>
        <div v-else class="status-invalid">⚠</div>
      </div>
      <div class="section-title">
        <h4 class="title-text">{{ title }}</h4>
      </div>
      <div class="section-toggle">
        <ChevronDownIcon class="h-5 w-5 transform transition-transform" :class="{ 'rotate-180': isOpen }" />
      </div>
    </button>
    
    <div v-if="isOpen" class="section-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

interface Props {
  title: string
  isValid: boolean
  isOpen: boolean
}

defineProps<Props>()
defineEmits<{
  toggle: []
}>()
</script>

<style scoped>
.review-section {
  @apply border border-gray-200 rounded-lg overflow-hidden;
}

.review-section.is-valid {
  @apply border-green-200;
}

.review-section:not(.is-valid) {
  @apply border-yellow-200;
}

.section-header {
  @apply w-full flex items-center space-x-4 p-4 bg-white hover:bg-gray-50 transition-colors duration-200;
}

.section-status {
  @apply flex-shrink-0;
}

.status-valid {
  @apply w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold;
}

.status-invalid {
  @apply w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-bold;
}

.section-title {
  @apply flex-1 text-left;
}

.title-text {
  @apply text-base font-semibold text-gray-900;
}

.section-toggle {
  @apply flex-shrink-0 text-gray-400;
}

.section-content {
  @apply border-t border-gray-200 bg-gray-50;
}
</style>