<template>
  <div class="h-full bg-gray-50 flex flex-col overflow-hidden">
    <DetailActions 
      v-if="routine"
      :status="routine.status"
      :is-loading="isActionLoading"
      @close="handleClose"
      @edit="$emit('edit', routine)"
      @toggle-status="handleToggleStatus"
      @delete="handleDelete"
    />

    <div class="flex-1 overflow-y-auto custom-scrollbar p-6">
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        <p class="mt-4 text-gray-500 font-medium">Cargando detalles de la rutina...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-lg mx-auto">
        <p class="text-red-700 font-medium">{{ error }}</p>
        <button @click="loadRoutineDetail" class="mt-4 text-sm text-red-600 underline font-bold">Reintentar</button>
      </div>

      <div v-else-if="routine" class="max-w-4xl mx-auto space-y-8 animate-fade-in">
        
        <DetailHeader 
          :name="routine.name"
          :type="routine.routine_type"
          :description="routine.description"
          :created-at="routine.created_at"
        />

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="md:col-span-2 space-y-8">
            <DetailTimeline :steps="routine.steps || []" />
          </div>

          <div class="space-y-8">
            <DetailSchedules :schedules="routine.schedules || []" />

            <DetailStrategies 
              v-if="hasStrategies"
              :strategies="sanitizedStrategies" 
            />
            <div v-else class="p-6 bg-white rounded-2xl border border-dashed border-gray-200 text-center text-gray-400">
               <p class="text-xs italic">No hay estrategias de apoyo configuradas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { routinesApi } from '@/services/rutinas/routinesApi'
import type { DailyRoutineDetail } from '@/type/rutinas/rutinas'
import type { RoutineStrategy, FlexibilityLevel } from '@/type/rutinas/rutinas'

// Sub-componentes
import DetailHeader from '@/components/gestion/rutinas/components/DetailHeader.vue'
import DetailSchedules from '@/components/gestion/rutinas/components/DetailSchedules.vue'
import DetailTimeline from '@/components/gestion/rutinas/components/DetailTimeline.vue'
import DetailStrategies from '@/components/gestion/rutinas/components/DetailStrategies.vue'
import DetailActions from '@/components/gestion/rutinas/components/DetailActions.vue'

const props = defineProps<{
  id: number | string        // ID del niño
  routineId: number | string // ID de la rutina
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updated'): void
  (e: 'edit', routine: DailyRoutineDetail): void
}>()

const router = useRouter()
const routine = ref<DailyRoutineDetail | null>(null)
const loading = ref(true)
const isActionLoading = ref(false)
const error = ref<string | null>(null)

// === LÓGICA DE NORMALIZACIÓN PARA EVITAR ERRORES DE RENDERIZADO ===

/**
 * Verifica si existen datos de estrategias para mostrar la sección
 */
const hasStrategies = computed(() => {
  return !!(routine.value?.strategies_config || routine.value?.strategies)
})

/**
 * ✅ SOLUCIÓN AL TypeError: can't access property "container"
 * Normaliza el objeto de estrategias antes de enviarlo al componente hijo.
 * Convierte 'MEDIA' -> 'medium', 'BAJA' -> 'low', etc. para que coincida con los temas del hijo.
 */
const sanitizedStrategies = computed((): RoutineStrategy | null => {
  const data = routine.value?.strategies_config || routine.value?.strategies
  if (!data) return null
  
  // Normalizamos el nivel de flexibilidad a minúsculas y mapeamos términos de ser necesario
  let level = (data.flexibility_level || 'medium').toLowerCase()
  
  // Mapeo de seguridad para asegurar compatibilidad con el mapa de temas del hijo
  if (level.includes('med')) level = 'medium'
  if (level.includes('low') || level.includes('baj')) level = 'low'
  if (level.includes('hig') || level.includes('alt')) level = 'high'

  return {
    ...data,
    flexibility_level: level as FlexibilityLevel
  }
})

// === MÉTODOS DE DATOS ===

async function loadRoutineDetail() {
  const cId = Number(props.id)
  const rId = Number(props.routineId)

  if (isNaN(cId) || isNaN(rId)) {
    error.value = "Identificadores de rutina inválidos."
    loading.value = false
    return
  }

  loading.value = true
  error.value = null
  try {
    const response = await routinesApi.getRoutineDetail(cId, rId)
    // El backend puede enviar el objeto en strategies_config o strategies según el serializador
    routine.value = response.data
  } catch (err: any) {
    console.error("Error al cargar detalle:", err)
    error.value = "No se pudo obtener la información de la rutina."
  } finally {
    loading.value = false
  }
}

// === GESTIÓN DE ACCIONES ===

function handleClose() {
  router.push({ name: 'perfil-nino-rutinas', params: { id: props.id } })
  emit('close')
}

async function handleToggleStatus() {
  isActionLoading.value = true
  try {
    await routinesApi.toggleStatus(Number(props.id), Number(props.routineId))
    await loadRoutineDetail() 
    emit('updated')
  } catch (err) {
    console.error("Error al cambiar estado:", err)
  } finally {
    isActionLoading.value = false
  }
}

async function handleDelete() {
  if (!confirm('¿Estás seguro de que deseas eliminar esta rutina?')) return
  isActionLoading.value = true
  try {
    await routinesApi.deleteRoutine(Number(props.id), Number(props.routineId))
    emit('updated')
    handleClose()
  } catch (err) {
    console.error("Error al eliminar:", err)
  } finally {
    isActionLoading.value = false
  }
}

// === CICLO DE VIDA ===

onMounted(() => {
  loadRoutineDetail()
})

// Recargar si el ID cambia sin destruir el componente (navegación entre rutinas)
watch(() => props.routineId, () => {
  loadRoutineDetail()
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
</style>