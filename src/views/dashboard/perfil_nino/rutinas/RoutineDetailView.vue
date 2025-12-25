<template>
  <div class="h-full bg-gray-50 flex flex-col overflow-hidden">
    <DetailActions 
      v-if="routine"
      :status="routine.status"
      :is-loading="isActionLoading"
      @close="$emit('close')"
      @edit="$emit('edit', routine)"
      @toggle-status="handleToggleStatus"
      @delete="handleDelete"
    />

    <div class="flex-1 overflow-y-auto custom-scrollbar p-6">
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        <p class="mt-4 text-gray-500 font-medium">Cargando detalles de la rutina...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p class="text-red-700 font-medium">{{ error }}</p>
        <button @click="loadRoutineDetail" class="mt-4 text-sm text-red-600 underline">Reintentar</button>
      </div>

      <div v-else-if="routine" class="max-w-3xl mx-auto space-y-8 animate-fade-in">
        
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

            <DetailStrategies :strategies="routine.strategies" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { routinesApi } from '@/services/rutinas/routinesApi'
import type { DailyRoutineDetail } from '@/type/rutinas/rutinas'

// Importación de sub-componentes (Los crearemos uno a uno)
import DetailHeader from '@/components/gestion/rutinas/components/DetailHeader.vue'
import DetailSchedules from '@/components/gestion/rutinas/components/DetailSchedules.vue'
import DetailTimeline from '@/components/gestion/rutinas/components/DetailTimeline.vue'
import DetailStrategies from '@/components/gestion/rutinas/components/DetailStrategies.vue'
import DetailActions from '@/components/gestion/rutinas/components/DetailActions.vue'


const props = defineProps<{
  routineId: number | string
  childId: number | string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updated'): void
  (e: 'edit', routine: DailyRoutineDetail): void
}>()

// Estados
const routine = ref<DailyRoutineDetail | null>(null)
const loading = ref(true)
const isActionLoading = ref(false)
const error = ref<string | null>(null)

/**
 * Carga el detalle completo de la rutina desde el servidor
 */
async function loadRoutineDetail() {
  loading.value = true
  error.value = null
  try {
    const response = await routinesApi.getRoutineDetail(
      Number(props.childId), 
      Number(props.routineId)
    )
    routine.value = response.data
  } catch (err: any) {
    error.value = "No se pudo cargar la información de la rutina."
    console.error(err)
  } finally {
    loading.value = false
  }
}

/**
 * Maneja el cambio de estado (Activo/Pausado)
 */
async function handleToggleStatus() {
  isActionLoading.value = true
  try {
    await routinesApi.toggleStatus(Number(props.childId), Number(props.routineId))
    await loadRoutineDetail() // Recargar datos
    emit('updated')
  } catch (err) {
    console.error("Error al cambiar estado:", err)
  } finally {
    isActionLoading.value = false
  }
}

/**
 * Maneja la eliminación de la rutina
 */
async function handleDelete() {
  if (!confirm('¿Estás seguro de que deseas eliminar esta rutina? Esta acción no se puede deshacer.')) return
  
  isActionLoading.value = true
  try {
    await routinesApi.deleteRoutine(Number(props.childId), Number(props.routineId))
    emit('updated')
    emit('close')
  } catch (err) {
    console.error("Error al eliminar:", err)
  } finally {
    isActionLoading.value = false
  }
}

onMounted(() => {
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