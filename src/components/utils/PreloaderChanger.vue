<template>
  <div
    v-if="isLoading"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
  >
    <div class="relative">
      <!-- Círculos animados -->
      <div class="flex space-x-3">
        <div
          v-for="i in 3"
          :key="i"
          class="circle"
          :style="{ animationDelay: `${(i - 1) * 0.15}s` }"
        ></div>
      </div>

      <!-- Texto de carga (opcional) -->
      <p class="mt-8 text-center text-lg font-semibold text-white animate-pulse">
        Cargando...
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isLoading = ref(true);

// Props para controlar el preloader externamente
const props = withDefaults(
  defineProps<{
    duration?: number;
  }>(),
  {
    duration: 2000,
  }
);

// Emite un evento cuando termina de cargar
const emit = defineEmits<{
  (e: 'loaded'): void;
}>();

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
    emit('loaded');
  }, props.duration);
});

// Función para mostrar/ocultar manualmente
const show = () => {
  isLoading.value = true;
};

const hide = () => {
  isLoading.value = false;
  emit('loaded');
};

// Exponer funciones para uso externo
defineExpose({
  show,
  hide,
});
</script>

<style scoped>
.circle {
  width: 1rem;
  height: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  animation: bounce 0.6s infinite alternate;
  box-shadow: 0 4px 6px -1px rgba(102, 126, 234, 0.5),
              0 2px 4px -1px rgba(118, 75, 162, 0.3);
}

@keyframes bounce {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-1.5rem);
    opacity: 0.7;
  }
}

/* Animación de fade out cuando se oculta */
.fade-out {
  animation: fadeOut 0.5s ease-out forwards;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>