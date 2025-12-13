<template>
  <div class="text-center p-6">
    <div v-if="iconComponent" class="flex justify-center mb-4">
      <component 
        :is="iconComponent" 
        class="h-12 w-12 text-gray-400" 
        aria-hidden="true" 
      />
    </div>
    
    <h3 class="mt-2 text-lg font-semibold text-gray-800">
      {{ title }}
    </h3>
    
    <p v-if="message" class="mt-1 text-sm text-gray-500">
      {{ message }}
    </p>
    
    <div v-if="$slots.default" class="mt-6">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from 'vue'
// Importa todos los iconos 'outline' de Heroicons
import * as HeroIconsOutline from '@heroicons/vue/24/outline' 

// === PROPS ===
const props = defineProps<{
  /**
   * Nombre del icono de Heroicons (outline) a mostrar (ej: 'DocumentMagnifyingGlassIcon').
   * Si se omite, no se muestra icono.
   */
  icon?: keyof typeof HeroIconsOutline 
  /**
   * Título principal del estado vacío. Es obligatorio.
   */
  title: string
  /**
   * Mensaje descriptivo opcional.
   */
  message?: string
}>()

// === COMPUTED ===

/**
 * Carga dinámicamente el componente del icono basado en el nombre de la prop.
 */
const iconComponent = computed<Component | null>(() => {
  if (props.icon && HeroIconsOutline[props.icon]) {
    // Carga asíncrona para no importar todos los iconos innecesariamente
    // aunque en este caso ya están importados arriba, pero es buena práctica
    return defineAsyncComponent(() => 
      Promise.resolve(HeroIconsOutline[props.icon!])
    )
  }
  return null // No renderiza icono si no se especifica o no se encuentra
})

</script>

<style scoped>
/* Estilos específicos si fueran necesarios, 
   pero Tailwind debería ser suficiente. 
*/
</style>