<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="shouldShow" class="w-full mb-6 px-4 sm:px-0">
      <div class="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 shadow-sm">
        
        <div class="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 bg-orange-100 rounded-full opacity-50 blur-xl pointer-events-none"></div>

        <div class="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          
          <div class="flex items-start gap-4 flex-1 w-full">
            <div class="flex-shrink-0 bg-orange-100 rounded-full p-2 sm:p-3">
              <ClockIcon class="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" aria-hidden="true" />
            </div>

            <div class="flex-1 pt-1 sm:pt-0">
              <h3 class="text-base sm:text-lg font-bold text-orange-800 leading-tight">
                ¡Recordatorio de hoy!
              </h3>
              <div class="mt-1 text-sm sm:text-base text-orange-700">
                <p>
                  Tienes <span class="font-bold bg-orange-100 px-1 rounded text-orange-800">{{ pendingCount }} rutinas</span> pendientes con {{ childName }}.
                </p>
              </div>
            </div>
          </div>

          <div class="w-full sm:w-auto flex-shrink-0 pt-2 sm:pt-0">
            <button
              @click="goToRoutines"
              class="w-full sm:w-auto inline-flex justify-center items-center px-5 py-3 sm:py-2.5 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 transform active:scale-95"
            >
              <span>Ver Pendientes</span>
              <ArrowRightIcon class="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          
          <button 
            @click="dismissBanner" 
            class="absolute top-2 right-2 p-2 text-orange-300 hover:text-orange-500 hover:bg-orange-100/50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300"
            aria-label="Cerrar recordatorio"
          >
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
import { useRoutinesStore } from '@/store/rutinas/routinesStore';
import { useNinoActivoStore } from '@/store/ninoActivoStore';
import { ClockIcon, ArrowRightIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const routinesStore = useRoutinesStore();
const ninoStore = useNinoActivoStore();

const dismissed = ref(false);

// Configuración: Hora mínima para empezar a mostrar el banner (ej: 9 AM)
const MIN_HOUR_TO_SHOW = 9; 

const pendingCount = computed(() => routinesStore.pendingCount);
const childName = computed(() => ninoStore.nombreCompleto || 'tu hijo');

const shouldShow = computed(() => {
  if (dismissed.value) return false;
  if (pendingCount.value === 0) return false;

  const currentHour = new Date().getHours();
  if (MIN_HOUR_TO_SHOW !== null && currentHour < MIN_HOUR_TO_SHOW) {
    return false;
  }

  return true;
});

const goToRoutines = () => {
  router.push({ name: 'parent-rutinas' });
};

const dismissBanner = () => {
  dismissed.value = true;
};

onMounted(async () => {
  if (ninoStore.ninoActivoId) {
    await routinesStore.fetchPendingRoutines(ninoStore.ninoActivoId);
  }
});
</script>