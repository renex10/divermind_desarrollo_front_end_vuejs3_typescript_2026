<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="shouldShow" class="w-full mb-3 sm:mb-4 lg:mb-6">
      <div class="card-responsive bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 shadow-mobile sm:shadow-soft relative overflow-hidden">
        
        <!-- Decorative circle (oculto en móvil muy pequeño) -->
        <div class="hidden xs:block absolute top-0 right-0 -mt-2 -mr-2 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 bg-orange-100 rounded-full opacity-50 blur-xl"></div>
        
        <!-- Botón cerrar (siempre visible, posición absoluta) -->
        <button 
          @click="dismissBanner" 
          class="absolute top-2 right-2 z-10 text-orange-400 hover:text-orange-600 transition-colors p-1 rounded-lg hover:bg-orange-100/50"
          aria-label="Cerrar recordatorio"
        >
          <XMarkIcon class="h-4 w-4 sm:h-5 sm:h-5" />
        </button>

        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pr-8 sm:pr-0">
          <!-- Icon -->
          <div class="flex-shrink-0 bg-orange-100 rounded-full p-2 sm:p-2.5">
            <ClockIcon class="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" aria-hidden="true" />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <h3 class="text-responsive-base font-bold text-orange-800 mb-1">
              ¡Recordatorio de hoy!
            </h3>
            <p class="text-responsive-sm text-orange-700">
              Aún tienes <span class="font-bold">{{ pendingCount }} {{ pendingCount === 1 ? 'rutina' : 'rutinas' }}</span> 
              {{ pendingCount === 1 ? 'pendiente' : 'pendientes' }} para completar con {{ childName }}.
            </p>
          </div>

          <!-- Action Button -->
          <div class="w-full sm:w-auto sm:flex-shrink-0 mt-2 sm:mt-0">
            <button
              @click="goToRoutines"
              class="btn-reminder w-full sm:w-auto"
            >
              <span class="text-xs sm:text-sm font-bold">Ver Pendientes</span>
              <ArrowRightIcon class="ml-1.5 sm:ml-2 -mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRoutinesStore } from '@/store/rutinas/routinesStore'
import { useNinoActivoStore } from '@/store/ninoActivoStore'
import { ClockIcon, ArrowRightIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const routinesStore = useRoutinesStore()
const ninoStore = useNinoActivoStore()

const dismissed = ref(false)

// Configuración: Hora mínima para mostrar (9 AM)
const MIN_HOUR_TO_SHOW = 9

const pendingCount = computed(() => routinesStore.pendingCount)
const childName = computed(() => ninoStore.nombreCompleto || 'tu hijo')

const shouldShow = computed(() => {
  // 1. Si el usuario lo cerró, no mostrar
  if (dismissed.value) return false
  
  // 2. Si no hay pendientes, no mostrar
  if (pendingCount.value === 0) return false
  
  // 3. Lógica de horario (opcional)
  const currentHour = new Date().getHours()
  if (MIN_HOUR_TO_SHOW !== null && currentHour < MIN_HOUR_TO_SHOW) {
    return false
  }
  
  return true
})

const goToRoutines = () => {
  router.push({ name: 'parent-rutinas' })
}

const dismissBanner = () => {
  dismissed.value = true
  
  // Opcional: Guardar en localStorage para no mostrar hoy
  const today = new Date().toDateString()
  localStorage.setItem('reminder_dismissed_date', today)
}

// Cargar datos al montar
onMounted(async () => {
  // Verificar si ya fue cerrado hoy
  const dismissedDate = localStorage.getItem('reminder_dismissed_date')
  const today = new Date().toDateString()
  
  if (dismissedDate === today) {
    dismissed.value = true
  }
  
  // Cargar rutinas pendientes
  if (ninoStore.ninoActivoId) {
    await routinesStore.fetchPendingRoutines(ninoStore.ninoActivoId)
  }
})
</script>

<style scoped>
.btn-reminder {
  @apply inline-flex items-center justify-center;
  @apply px-3 sm:px-4 py-2 sm:py-2.5;
  @apply border border-transparent rounded-lg sm:rounded-xl;
  @apply shadow-sm text-white bg-orange-600;
  @apply hover:bg-orange-700 active:bg-orange-800;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500;
  @apply transition-all duration-200;
  @apply hover:scale-105 active:scale-95;
}

/* Asegurar que en móvil el botón cerrar sea fácil de presionar */
@media (max-width: 640px) {
  .btn-reminder {
    min-height: 44px; /* Touch target mínimo iOS/Android */
  }
}
</style>