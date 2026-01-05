<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="shouldShow" class="w-full mb-6">
      <div class="rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 p-4 shadow-sm relative overflow-hidden">
        
        <div class="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 bg-orange-100 rounded-full opacity-50 blur-xl"></div>

        <div class="flex items-start sm:items-center">
          <div class="flex-shrink-0 bg-orange-100 rounded-full p-2">
            <ClockIcon class="h-6 w-6 text-orange-600" aria-hidden="true" />
          </div>

          <div class="ml-4 flex-1">
            <h3 class="text-sm font-bold text-orange-800">
              ¡Recordatorio de hoy!
            </h3>
            <div class="mt-1 text-sm text-orange-700">
              <p>
                Aún tienes <span class="font-bold">{{ pendingCount }} rutinas</span> pendientes para completar con {{ childName }}.
              </p>
            </div>
          </div>

          <div class="mt-4 sm:mt-0 sm:ml-6 flex-shrink-0">
            <button
              @click="goToRoutines"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              Ver Pendientes
              <ArrowRightIcon class="ml-2 -mr-1 h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          
          <button @click="dismissBanner" class="absolute top-2 right-2 text-orange-300 hover:text-orange-500">
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRoutinesStore } from '@/store/rutinas/routinesStore'; // Asegúrate que la ruta sea correcta
import { useNinoActivoStore } from '@/store/ninoActivoStore';
import { ClockIcon, ArrowRightIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const routinesStore = useRoutinesStore();
const ninoStore = useNinoActivoStore();

const dismissed = ref(false);

// Configuración: Hora mínima para empezar a mostrar el banner (ej: 9 AM)
// Si es null, se muestra siempre que haya pendientes.
const MIN_HOUR_TO_SHOW = 9; 

const pendingCount = computed(() => routinesStore.pendingCount);
const childName = computed(() => ninoStore.nombreCompleto || 'tu hijo');

const shouldShow = computed(() => {
  // 1. Si el usuario lo cerró manualmente, no mostrar
  if (dismissed.value) return false;

  // 2. Si no hay pendientes, no mostrar
  if (pendingCount.value === 0) return false;

  // 3. Lógica de Horario (Opcional)
  const currentHour = new Date().getHours();
  if (MIN_HOUR_TO_SHOW !== null && currentHour < MIN_HOUR_TO_SHOW) {
    return false; // Es muy temprano todavía
  }

  return true;
});

const goToRoutines = () => {
  router.push({ name: 'parent-rutinas' }); // Asegúrate que este sea el nombre de tu ruta
};

const dismissBanner = () => {
  dismissed.value = true;
};

// Cargar datos al montar (por si el dashboard no lo ha hecho)
onMounted(async () => {
  if (ninoStore.ninoActivoId) {
    await routinesStore.fetchPendingRoutines(ninoStore.ninoActivoId);
  }
});
</script>