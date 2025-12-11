<!-- src/components/dashboard/padres/PhotoPreview.vue -->
<template>
  <div class="grid grid-cols-2 gap-6">
    <div class="text-center">
      <p class="text-sm font-medium text-gray-700 mb-2">Antes</p>
      <div class="w-40 h-40 mx-auto rounded-full overflow-hidden bg-gray-200">
        <img v-if="originalUrl" :src="originalUrl" class="w-full h-full object-cover" />
      </div>
    </div>
    <div class="text-center">
      <p class="text-sm font-medium text-gray-700 mb-2">Después</p>
      <div class="w-40 h-40 mx-auto rounded-full overflow-hidden bg-gray-200">
        <img :src="newImageUrl" class="w-full h-full object-cover" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  originalUrl: string | null
  newImageBlob: Blob
  childName: string
}>()

const newImageUrl = computed(() => URL.createObjectURL(props.newImageBlob))
</script>