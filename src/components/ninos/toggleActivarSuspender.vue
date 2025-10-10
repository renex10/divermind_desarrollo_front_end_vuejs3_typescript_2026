<template>
  <label
    :for="inputId"
    class="relative block h-8 w-14 rounded-full bg-gray-300 transition-colors [-webkit-tap-highlight-color:_transparent] cursor-pointer"
    :class="{ 'bg-green-500': modelValue, 'bg-red-400': !modelValue }"
  >
    <input 
      :id="inputId"
      type="checkbox" 
      class="peer sr-only"
      :checked="modelValue"
      @change="handleToggle"
      :disabled="disabled"
    />

    <span
      class="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-[inset-inline-start] peer-checked:start-6 shadow-md"
    ></span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: boolean
  disabled?: boolean
  ninoId?: string | number
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'toggle', value: boolean, ninoId?: string | number): void
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  modelValue: true
})

const emit = defineEmits<Emits>()

const inputId = computed(() => `toggle-${props.ninoId || Math.random().toString(36).substr(2, 9)}`)

const handleToggle = (event: Event) => {
  if (props.disabled) return
  
  const target = event.target as HTMLInputElement
  const newValue = target.checked
  
  emit('update:modelValue', newValue)
  emit('toggle', newValue, props.ninoId)
}
</script>

<style scoped>
label:has(input:disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>