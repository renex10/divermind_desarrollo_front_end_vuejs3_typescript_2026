<script setup lang="ts">
    /* src\views\dashboard\padres\RutinasView.vue */
/**
 * VISTA: RutinasView (Padres)
 * Actualizada para el Piloto: Martin Araya (ID 22) -> Pangal Eluney (ID 13)
 */
import { ref, computed, onMounted, defineAsyncComponent, watch } from 'vue'
import { useNinoActivoStore } from '@/store/ninoActivoStore'
import { useRoutinesStore } from '@/store/rutinas/routinesStore'

// --- COMPONENTES ---
const RutinasAgendaView = defineAsyncComponent(() => import('./rutinas/RutinasAgendaView.vue'))
const RutinasListView = defineAsyncComponent(() => import('./rutinas/RutinasListView.vue'))

// --- STORES ---
const ninoStore = useNinoActivoStore()
const routinesStore = useRoutinesStore()

// --- ESTADO LOCAL ---
const activeTab = ref('agenda')
const tabs = [
  { n: 'agenda', l: 'Agenda Hoy', icon: '📅' },
  { n: 'list', l: 'Mis Rutinas', icon: '📋' }
]

// --- PROPIEDADES COMPUTADAS ---

/**
 * Obtiene el ID del niño.
 * Sincronizado con ninoId en ninoActivoStore.ts.
 */
const childId = computed(() => {
  const id = ninoStore.ninoId
  return id ? Number(id) : null
})

/**
 * Obtiene el nombre del niño.
 */
const childName = computed(() => ninoStore.nombreNino)

const currentTabComponent = computed(() => {
  return activeTab.value === 'agenda' ? RutinasAgendaView : RutinasListView
})

// --- MÉTODOS DE CARGA ---

const loadData = async () => {
  if (childId.value) {
    console.log(`[Rutinas] Cargando para ${childName.value} (ID: ${childId.value})`)
    try {
      // Busca rutinas activas (como 'Preparación Escolar')
      await routinesStore.fetchRoutines(childId.value, { status: 'active' })
    } catch (err) {
      console.error("Error al cargar rutinas:", err)
    }
  }
}

// --- OBSERVADORES ---

watch(() => childId.value, (newId) => {
  if (newId) loadData()
}, { immediate: true })

onMounted(async () => {
  /**
   * 🛠️ LÓGICA DE INICIALIZACIÓN PARA EL PILOTO:
   * Si el store está en "Cargando...", forzamos la obtención del perfil de Pangal (ID 13)
   * para que Martin Araya pueda ver la agenda de inmediato.
   */
  if (!ninoStore.hasData) {
    console.log("🚀 Inicializando perfil de Pangal (ID 13) para Martin Araya...");
    await ninoStore.fetchNinoActivo('13');
  }
  
  await loadData();
})
</script>

<template>
  <div class="rutinas-container min-h-screen bg-gray-50 flex flex-col">
    
    <header class="bg-white border-b border-gray-200 p-6 flex-shrink-0">
      <div class="max-w-7xl mx-auto w-full flex flex-col">
        <h1 class="text-3xl font-black text-gray-900 tracking-tight leading-none">
          Rutinas Diarias
        </h1>
        <p class="text-sm text-gray-500 font-medium mt-2">
          Agenda de actividades para 
          <span :class="{'text-blue-600 font-bold': ninoStore.hasData, 'animate-pulse': !ninoStore.hasData}">
            {{ childName }}
          </span>
        </p>
      </div>
    </header>

    <div class="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 flex space-x-2">
        <button 
          v-for="tab in tabs" 
          :key="tab.n"
          @click="activeTab = tab.n"
          :class="[
            'px-6 py-4 font-bold text-sm transition-all duration-300 flex items-center gap-2 border-b-4',
            activeTab === tab.n 
              ? 'border-blue-600 text-blue-700 bg-blue-50/30' 
              : 'border-transparent text-gray-400 hover:text-gray-900'
          ]"
        >
          <span>{{ tab.icon }}</span>
          <span>{{ tab.l }}</span>
        </button>
      </div>
    </div>

    <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar">
      
      <div v-if="routinesStore.loading || ninoStore.isLoading" class="flex flex-col items-center justify-center py-20">
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p class="mt-6 text-gray-400 font-bold text-xs uppercase tracking-widest animate-pulse text-center">
          Sincronizando con Divermind...<br>
          <span class="text-[10px] font-normal tracking-normal normal-case">Buscando agenda de Pangal</span>
        </p>
      </div>
      
      <Transition v-else name="fade-slide" mode="out-in">
        <component
          :is="currentTabComponent"
          :child-id="childId"
          :child-name="childName"
          :routines="routinesStore.routines"
          :loading="routinesStore.loading"
          @refresh="loadData"
        />
      </Transition>
    </main>
  </div>
</template>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease-out; }
.fade-slide-enter-from { opacity: 0; transform: translateY(10px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
</style>