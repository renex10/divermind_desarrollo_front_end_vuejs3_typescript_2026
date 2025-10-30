<template>
  <nav aria-label="Progreso del asistente">
    <ol
      role="list"
      class="flex items-center space-x-2 sm:space-x-4"
    >
      <li v-for="(step, stepIdx) in steps" :key="step" class="relative flex-1">
        <!-- Paso Completado -->
        <div v-if="stepIdx < currentStep - 1" class="group flex w-full items-center">
          <span 
            class="flex h-0.5 flex-1 bg-primary-600 transition-all duration-500 ease-out transform origin-left scale-x-100 animate-progress-line" 
            aria-hidden="true"
          ></span>
          <span class="relative ml-2 sm:ml-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 transition-all duration-500 ease-out transform hover:scale-110 hover:shadow-lg animate-check-appear">
            <CheckIcon class="h-5 w-5 text-white animate-check-pop" aria-hidden="true" />
            <span class="sr-only">{{ step }} - Completado</span>
            <!-- Efecto de pulso sutil -->
            <span class="absolute inset-0 rounded-full bg-primary-600 opacity-0 animate-pulse-ring"></span>
          </span>
          <span class="absolute top-full mt-2 hidden text-xs font-medium text-primary-700 sm:block transition-all duration-300 opacity-100">{{ step }}</span>
        </div>

        <!-- Paso Actual -->
        <div v-else-if="stepIdx === currentStep - 1" class="group flex w-full items-center" aria-current="step">
          <span 
            class="flex h-0.5 flex-1 transition-all duration-500 ease-out" 
            :class="stepIdx > 0 ? 'bg-primary-600 scale-x-100' : 'bg-transparent scale-x-0'" 
            aria-hidden="true"
          ></span>
          <span class="relative ml-2 sm:ml-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary-600 bg-white transition-all duration-500 ease-out hover:scale-110 animate-current-pulse">
            <span class="h-2.5 w-2.5 rounded-full bg-primary-600 animate-pulse-dot" aria-hidden="true"></span>
            <span class="sr-only">{{ step }} - Actual</span>
            <!-- Anillo animado alrededor del paso actual -->
            <span class="absolute inset-0 rounded-full border-2 border-primary-400 animate-ping-slow opacity-75"></span>
            <span class="absolute inset-0 rounded-full border-2 border-primary-300 animate-ping-slower opacity-50"></span>
          </span>
          <span class="absolute top-full mt-2 hidden text-xs font-semibold text-primary-600 sm:block transition-all duration-300 animate-fade-in">{{ step }}</span>
        </div>

        <!-- Paso Pendiente -->
        <div v-else class="group flex w-full items-center">
          <span 
            class="flex h-0.5 flex-1 bg-gray-200 transition-all duration-500 ease-out transform scale-x-100" 
            aria-hidden="true"
          ></span>
          <span class="relative ml-2 sm:ml-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white transition-all duration-300 ease-out group-hover:border-primary-400 group-hover:scale-105 group-hover:shadow-md">
            <span class="text-xs font-medium text-gray-500 transition-colors duration-300 group-hover:text-primary-600">{{ stepIdx + 1 }}</span>
            <span class="sr-only">{{ step }} - Próximo</span>
          </span>
          <span class="absolute top-full mt-2 hidden text-xs font-medium text-gray-500 sm:block transition-all duration-300 group-hover:text-gray-700">{{ step }}</span>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { CheckIcon } from '@heroicons/vue/24/solid'

defineProps<{
  steps: string[]
  currentStep: number
}>()
</script>

<style scoped>
/* Animación para la línea de progreso */
@keyframes progress-line {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

.animate-progress-line {
  animation: progress-line 0.6s ease-out forwards;
}

/* Animación para el check */
@keyframes check-appear {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-check-appear {
  animation: check-appear 0.5s ease-out forwards;
}

@keyframes check-pop {
  0% {
    transform: scale(0) rotate(-45deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.3) rotate(0deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.animate-check-pop {
  animation: check-pop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

/* Anillo de pulso para pasos completados */
@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.animate-pulse-ring {
  animation: pulse-ring 1.5s ease-out;
}

/* Pulso suave para el punto del paso actual */
@keyframes pulse-dot {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.8;
  }
}

.animate-pulse-dot {
  animation: pulse-dot 2s ease-in-out infinite;
}

/* Efecto de ping lento para el paso actual */
@keyframes ping-slow {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  75%, 100% {
    transform: scale(1.8);
    opacity: 0;
  }
}

.animate-ping-slow {
  animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping-slower {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  75%, 100% {
    transform: scale(2.2);
    opacity: 0;
  }
}

.animate-ping-slower {
  animation: ping-slower 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Pulso para el contenedor del paso actual */
@keyframes current-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(var(--primary-rgb, 79, 70, 229), 0.4);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(var(--primary-rgb, 79, 70, 229), 0);
  }
}

.animate-current-pulse {
  animation: current-pulse 2s ease-in-out infinite;
}

/* Fade in para labels */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.4s ease-out forwards;
}

/* Transiciones suaves globales */
* {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Efecto hover mejorado */
.group:hover span {
  transition: all 0.3s ease-out;
}
</style>