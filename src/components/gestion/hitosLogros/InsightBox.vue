<template>
  <div
    class="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
    :class="[
      cardSizeClasses,
      colorVariantClasses.background,
      isHovering ? 'shadow-soft' : '',
      { 'animate-fade-in': animate }
    ]"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <!-- Indicador de color sutil -->
    <div
      v-if="showColorIndicator"
      class="absolute -left-1 top-1/4 h-1/2 w-1 rounded-full transition-all duration-300"
      :class="[
        colorVariantClasses.indicator,
        isHovering ? 'h-3/4' : ''
      ]"
      aria-hidden="true"
    />

    <!-- Encabezado con título y tendencia -->
    <div class="mb-3 flex items-start justify-between gap-2">
      <div class="min-w-0 flex-1">
        <h3
          class="truncate text-xs font-semibold uppercase tracking-wider"
          :class="colorVariantClasses.title"
        >
          {{ title }}
        </h3>
      </div>

      <!-- Indicador de tendencia -->
      <div
        v-if="trend"
        class="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-colors duration-200"
        :class="trendClasses"
        :aria-label="`Tendencia: ${trend}`"
      >
        <component
          :is="trendIcon"
          class="h-3 w-3"
          aria-hidden="true"
        />
        <span>{{ trend }}</span>
      </div>
    </div>

    <!-- Valor principal -->
    <div class="mb-2">
      <p
        class="font-bold text-gray-900 transition-colors duration-300 dark:text-gray-50"
        :class="valueSizeClasses"
      >
        {{ value }}
      </p>
    </div>

    <!-- Subtexto -->
    <p
      v-if="subText"
      class="text-sm text-gray-600 dark:text-gray-300"
    >
      {{ subText }}
    </p>

    <!-- Indicador decorativo inferior (solo en hover) -->
    <div
      v-if="showBottomIndicator"
      class="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-gradient-to-r transition-transform duration-300"
      :class="[
        colorVariantClasses.bottomIndicator,
        isHovering ? 'scale-x-100' : ''
      ]"
      aria-hidden="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/vue/24/solid'

// Tipos
type TrendType = 'positive' | 'negative' | 'neutral'
type CardSize = 'sm' | 'md' | 'lg'
type ColorVariant = 'parent' | 'therapist' | 'admin' | 'gray'

// Props
interface Props {
  title: string
  value: string | number
  trend?: string
  trendType?: TrendType
  trendIconVariant?: 'trend' | 'arrow'
  subText?: string
  size?: CardSize
  colorVariant?: ColorVariant
  showColorIndicator?: boolean
  showBottomIndicator?: boolean
  animate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  trendType: 'neutral',
  size: 'md',
  colorVariant: 'gray',
  trendIconVariant: 'trend',
  showColorIndicator: true,
  showBottomIndicator: false,
  animate: true
})

// Estado reactivo para hover
const isHovering = ref(false)

// Computed: Icono de tendencia según tipo
const trendIcon = computed(() => {
  if (props.trendIconVariant === 'arrow') {
    switch (props.trendType) {
      case 'positive': return ArrowUpIcon
      case 'negative': return ArrowDownIcon
      default: return MinusIcon
    }
  }
  
  switch (props.trendType) {
    case 'positive': return ArrowTrendingUpIcon
    case 'negative': return ArrowTrendingDownIcon
    default: return MinusIcon
  }
})

// Computed: Clases para la tendencia
const trendClasses = computed(() => {
  const base = 'ring-1 ring-opacity-10 dark:ring-opacity-20'
  
  switch (props.trendType) {
    case 'positive':
      return `${base} bg-success-50 text-success-700 ring-success-200 dark:bg-success-900/20 dark:text-success-400 dark:ring-success-800`
    case 'negative':
      return `${base} bg-error-50 text-error-700 ring-error-200 dark:bg-error-900/20 dark:text-error-400 dark:ring-error-800`
    default:
      return `${base} bg-gray-100 text-gray-600 ring-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:ring-gray-600`
  }
})

// Computed: Clases para variantes de color
const colorVariantClasses = computed(() => {
  switch (props.colorVariant) {
    case 'parent':
      return {
        background: '',
        title: 'text-parent-600 dark:text-parent-400',
        indicator: 'bg-parent-500',
        bottomIndicator: 'from-parent-400 to-parent-600'
      }
    case 'therapist':
      return {
        background: '',
        title: 'text-therapist-600 dark:text-therapist-400',
        indicator: 'bg-therapist-500',
        bottomIndicator: 'from-therapist-400 to-therapist-600'
      }
    case 'admin':
      return {
        background: '',
        title: 'text-admin-600 dark:text-admin-400',
        indicator: 'bg-admin-500',
        bottomIndicator: 'from-admin-400 to-admin-600'
      }
    default:
      return {
        background: '',
        title: 'text-gray-600 dark:text-gray-400',
        indicator: 'bg-gray-400',
        bottomIndicator: 'from-gray-400 to-gray-600'
      }
  }
})

// Computed: Clases de tamaño responsivas
const cardSizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'min-h-[100px] p-3'
    case 'lg':
      return 'min-h-[160px] p-6'
    default:
      return 'min-h-[130px] p-4'
  }
})

// Computed: Clases de tamaño para el valor
const valueSizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-2xl sm:text-3xl'
    case 'lg':
      return 'text-4xl sm:text-5xl'
    default:
      return 'text-3xl sm:text-4xl'
  }
})
</script>

<style scoped>
/* Animaciones suaves para la entrada */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mejora de rendimiento para animaciones */
* {
  @apply transition-colors duration-200;
}

/* Ajuste fino para dark mode */
@media (prefers-color-scheme: dark) {
  .dark\:ring-opacity-20 {
    --tw-ring-opacity: 0.2;
  }
}
</style>