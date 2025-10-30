<template>
  <div class="space-y-6 animate-fade-in">

    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">
          Agenda de Hoy <span class="text-primary-600">({{ formattedToday }})</span>
        </h2>
        <p class="text-sm text-gray-500 mt-1">
          Rutinas programadas para {{ childName }} hoy.
        </p>
      </div>
      
      <!-- Botón de recarga manual para debug -->
      <button
        @click="fetchAgenda"
        class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        🔄 Recargar Agenda
      </button>
    </div>

    <!-- Estado de Carga -->
    <div v-if="isLoading" class="flex items-center justify-center py-20 bg-white rounded-2xl shadow-soft">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        <p class="mt-4 text-gray-600">Cargando agenda...</p>
      </div>
    </div>

    <!-- Estado de Error -->
    <div v-else-if="error" class="bg-red-50 p-6 rounded-2xl border border-red-200">
      <div class="flex items-center gap-3 mb-2">
        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 class="text-lg font-semibold text-red-900">Error al cargar la agenda</h3>
      </div>
      <p class="text-red-700">{{ error }}</p>
      <button
        @click="fetchAgenda"
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Reintentar
      </button>
    </div>
    
    <!-- Estado Vacío -->
    <div v-else-if="todaysRoutines.length === 0" class="text-center py-20 bg-white rounded-2xl shadow-soft">
      <div class="flex flex-col items-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Sin rutinas programadas</h3>
        <p class="text-sm text-gray-500">No hay rutinas activas programadas para hoy.</p>
        
        <!-- Info de Debug -->
        <div class="mt-6 p-4 bg-blue-50 rounded-lg text-left text-xs text-gray-600 max-w-md">
          <p class="font-semibold mb-2">ℹ️ Información de Debug:</p>
          <ul class="space-y-1">
            <li>• Child ID: <code class="bg-white px-1 rounded">{{ childId }}</code></li>
            <li>• Endpoint: <code class="bg-white px-1 rounded break-all">/api/seguimiento/ninos/{{ childId }}/rutinas-diarias/agenda-hoy/</code></li>
            <li>• Rutinas recibidas: <code class="bg-white px-1 rounded">{{ todaysRoutines.length }}</code></li>
            <li>• Hora de carga: <code class="bg-white px-1 rounded">{{ loadTime }}</code></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Lista de Rutinas -->
    <div v-else class="space-y-4">
      <!-- Info Header -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p class="text-sm text-blue-800">
          📋 Mostrando <strong>{{ todaysRoutines.length }}</strong> rutina(s) programada(s) para hoy
        </p>
      </div>

      <!-- Tarjetas de Rutinas -->
      <RoutineCard 
        v-for="routine in todaysRoutines" 
        :key="routine.id" 
        :routine="routine"
        @view-detail="handleAction('view-detail', $event)"
        @edit="handleAction('edit', $event)"
        @clone="handleAction('clone', $event)"
        @toggle-status="handleAction('toggle-status', $event)"
        @archive="handleAction('archive', $event)"
      />
    </div>

    <!-- Debug Panel (Solo en desarrollo) -->
    <div v-if="isDevelopment" class="mt-8 p-6 bg-gray-100 rounded-lg">
      <details class="cursor-pointer">
        <summary class="font-semibold text-gray-700 mb-2">🔧 Panel de Debug</summary>
        <div class="mt-4 space-y-2 text-xs text-gray-600">
          <div><strong>Props recibidas:</strong></div>
          <pre class="bg-white p-3 rounded overflow-auto">{{ debugInfo }}</pre>
          
          <div class="mt-4"><strong>Datos cargados:</strong></div>
          <pre class="bg-white p-3 rounded overflow-auto max-h-64">{{ todaysRoutines }}</pre>
        </div>
      </details>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

// Importar tipos y API
import type { DailyRoutineList } from '@/type/rutinas/rutinas'
import { routinesApi } from '@/services/rutinas/routinesApi'

// Importar componente
import RoutineCard from '@/components/gestion/rutinas/core/RoutineCard.vue'

// === PROPS ===
const props = defineProps<{
  childId: number
  childName: string
}>()

// === EMITS ===
const emit = defineEmits<{
  (e: 'view-detail', id: number): void
  (e: 'edit', id: number): void
  (e: 'clone', id: number): void
  (e: 'toggle-status', id: number): void
  (e: 'archive', id: number): void
}>()

// === ESTADO ===
const todaysRoutines = ref<DailyRoutineList[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const loadTime = ref<string>('')

// Detectar si estamos en desarrollo
const isDevelopment = computed(() => import.meta.env.DEV)

// === COMPUTED ===
const formattedToday = computed(() => {
  try {
    return format(new Date(), 'EEEE, d \'de\' MMMM', { locale: es })
  } catch {
    return 'Hoy'
  }
})

const debugInfo = computed(() => ({
  childId: props.childId,
  childName: props.childName,
  routinesCount: todaysRoutines.value.length,
  isLoading: isLoading.value,
  hasError: !!error.value,
  loadTime: loadTime.value
}))

// === MÉTODOS ===
async function fetchAgenda() {
  console.group('🔄 FETCH AGENDA - INICIO')
  console.log('📋 Child ID:', props.childId)
  console.log('👤 Child Name:', props.childName)
  console.log('🕐 Timestamp:', new Date().toLocaleString())
  
  isLoading.value = true
  error.value = null
  
  try {
    console.log('🚀 Llamando a routinesApi.getDailyAgenda()...')
    const response = await routinesApi.getDailyAgenda(props.childId)
    
    console.log('✅ Respuesta recibida:', response)
    console.log('📦 response.data:', response.data)
    console.log('📊 Tipo de response.data:', Array.isArray(response.data) ? 'Array' : typeof response.data)
    console.log('📏 Longitud:', Array.isArray(response.data) ? response.data.length : 'N/A')
    
    todaysRoutines.value = response.data
    loadTime.value = new Date().toLocaleTimeString()
    
    if (todaysRoutines.value.length === 0) {
      console.warn('⚠️ El servidor devolvió un array vacío')
    } else {
      console.log(`✅ ${todaysRoutines.value.length} rutina(s) cargada(s)`)
    }
    
  } catch (err: any) {
    console.error('❌ ERROR al cargar agenda:', err)
    console.error('❌ Error completo:', {
      message: err.message,
      response: err.response,
      status: err.response?.status,
      data: err.response?.data
    })
    
    error.value = err.response?.data?.error 
      || err.response?.data?.detail
      || err.message 
      || "No se pudo cargar la agenda."
      
  } finally {
    isLoading.value = false
    console.groupEnd()
  }
}

// ✅ SOLUCIÓN: Usar switch case para type-safety
function handleAction(
  actionName: 'view-detail' | 'edit' | 'clone' | 'toggle-status' | 'archive', 
  id: number
) {
  console.log(`🎯 Acción solicitada: ${actionName} para rutina ID: ${id}`)
  
  switch (actionName) {
    case 'view-detail':
      emit('view-detail', id)
      break
    case 'edit':
      emit('edit', id)
      break
    case 'clone':
      emit('clone', id)
      break
    case 'toggle-status':
      emit('toggle-status', id)
      break
    case 'archive':
      emit('archive', id)
      break
  }
}

// === LIFECYCLE ===
onMounted(() => {
  console.log('🎬 RutinasAgendaView montado')
  fetchAgenda()
})

watch(() => props.childId, (newId, oldId) => {
  console.log(`👀 Child ID cambió de ${oldId} a ${newId}`)
  fetchAgenda()
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.shadow-soft {
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

code {
  font-family: 'Courier New', monospace;
  font-size: 0.875em;
}
</style>