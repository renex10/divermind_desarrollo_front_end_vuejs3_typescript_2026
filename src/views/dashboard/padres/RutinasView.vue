<script setup lang="ts">
/* src\views\dashboard\padres\RutinasView.vue */
/**
 * VISTA: RutinasView (Padres)
 * Lista de rutinas diarias del niño activo
 */
import { ref, computed, onMounted, defineAsyncComponent, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useNinoActivoStore } from '@/store/ninoActivoStore'
import { useRoutinesStore } from '@/store/rutinas/routinesStore'

// --- COMPONENTES ---
const RutinasAgendaView = defineAsyncComponent(() => import('./rutinas/RutinasAgendaView.vue'))
const RutinasListView = defineAsyncComponent(() => import('./rutinas/RutinasListView.vue'))

// --- STORES ---
const router = useRouter()
const ninoStore = useNinoActivoStore()
const routinesStore = useRoutinesStore()

// --- ESTADO LOCAL ---
const activeTab = ref('agenda')
const tabs = [
  { n: 'agenda', l: 'Agenda Hoy', icon: '📅' },
  { n: 'list', l: 'Mis Rutinas', icon: '📋' }
]

// --- PROPIEDADES COMPUTADAS ---

const childId = computed(() => {
  return ninoStore.ninoActivoId
})

const childName = computed(() => {
  return ninoStore.nombreCompleto || 'Selecciona un niño'
})

const currentTabComponent = computed(() => {
  return activeTab.value === 'agenda' ? RutinasAgendaView : RutinasListView
})

// --- MÉTODOS DE CARGA ---

const loadData = async () => {
  if (!childId.value) {
    console.warn('[RutinasView] No hay niño activo seleccionado')
    return
  }

  console.log(`[RutinasView] Cargando rutinas para ${childName.value} (ID: ${childId.value})`)
  
  try {
    await routinesStore.fetchRoutines(childId.value, { status: 'active' })
    console.log(`✅ Rutinas cargadas:`, routinesStore.routines.length)
  } catch (err) {
    console.error("❌ Error al cargar rutinas:", err)
  }
}

// --- OBSERVADORES ---

watch(() => childId.value, (newId, oldId) => {
  if (newId && newId !== oldId) {
    console.log(`🔄 Niño activo cambió a ID: ${newId}`)
    loadData()
  }
}, { immediate: true })

// --- LIFECYCLE HOOKS ---

onMounted(async () => {
  console.log('🎬 RutinasView montada')
  console.log('📊 Estado inicial del store:', {
    hasData: ninoStore.hasData,
    ninoActivoId: ninoStore.ninoActivoId,
    nombreCompleto: ninoStore.nombreCompleto
  })
  
  /**
   * ✅ MEJORADO: Solo intenta cargar desde localStorage si NO hay datos
   * Si ya hay datos cargados, los usa directamente
   */
  if (!ninoStore.hasData) {
    console.log('📂 No hay datos, intentando cargar desde localStorage...')
    
    try {
      await ninoStore.initializeFromStorage()
      
      // Verificar nuevamente después de intentar cargar
      if (!ninoStore.hasData) {
        console.warn('⚠️ No se pudo cargar niño activo, redirigiendo a Mis Hijos...')
        router.push({ name: 'parent-mis-hijos' })
        return
      }
      
      console.log('✅ Niño activo cargado desde localStorage:', {
        id: ninoStore.ninoActivoId,
        nombre: ninoStore.nombreCompleto
      })
    } catch (error) {
      console.error('❌ Error al inicializar niño activo:', error)
      // El store ya maneja el error y redirige si es necesario
      return
    }
  } else {
    console.log('✅ Ya hay datos del niño cargados, usando datos existentes')
  }
  
  // Cargar rutinas
  await loadData()
})
</script>

<template>
  <div class="rutinas-container min-h-screen bg-gray-50 flex flex-col">
    
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 p-6 flex-shrink-0">
      <div class="max-w-7xl mx-auto w-full flex flex-col">
        <h1 class="text-3xl font-black text-gray-900 tracking-tight leading-none">
          Rutinas Diarias
        </h1>
        <p class="text-sm text-gray-500 font-medium mt-2">
          Agenda de actividades para 
          <span 
            :class="{
              'text-blue-600 font-bold': ninoStore.hasData, 
              'animate-pulse text-gray-400': !ninoStore.hasData
            }"
          >
            {{ childName }}
          </span>
        </p>
      </div>
    </header>

    <!-- Tabs -->
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

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar">
      
      <!-- Loading State -->
      <div 
        v-if="routinesStore.loading || ninoStore.isLoadingData" 
        class="flex flex-col items-center justify-center py-20"
      >
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p class="mt-6 text-gray-400 font-bold text-xs uppercase tracking-widest animate-pulse text-center">
          Sincronizando con Divermind...<br>
          <span class="text-[10px] font-normal tracking-normal normal-case">
            Buscando agenda de {{ childName }}
          </span>
        </p>
      </div>
      
      <!-- Error State -->
      <div 
        v-else-if="ninoStore.errorMessage" 
        class="flex flex-col items-center justify-center py-20"
      >
        <div class="text-6xl mb-4">⚠️</div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Error al cargar datos</h3>
        <p class="text-gray-600 mb-4">{{ ninoStore.errorMessage }}</p>
        <button 
          @click="router.push({ name: 'parent-dashboard' })"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Volver al inicio
        </button>
      </div>
      
      <!-- Content Tabs -->
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
.fade-slide-enter-active, 
.fade-slide-leave-active { 
  transition: all 0.3s ease-out; 
}

.fade-slide-enter-from { 
  opacity: 0; 
  transform: translateY(10px); 
}

.fade-slide-leave-to { 
  opacity: 0; 
  transform: translateY(-10px); 
}

.custom-scrollbar::-webkit-scrollbar { 
  width: 6px; 
}

.custom-scrollbar::-webkit-scrollbar-thumb { 
  background: #cbd5e1; 
  border-radius: 10px; 
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover { 
  background: #94a3b8; 
}
</style>