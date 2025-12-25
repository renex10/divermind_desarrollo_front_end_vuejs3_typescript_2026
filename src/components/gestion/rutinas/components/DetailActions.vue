<template>
  <div class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-20">
    
    <div class="flex items-center gap-4">
      <button
        @click="$emit('close')"
        class="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        title="Cerrar detalle"
        type="button"
      >
        <XMarkIcon class="w-6 h-6" />
      </button>

      <div class="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>

      <div class="flex flex-col">
        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Gestión de Rutina</span>
        <div class="flex items-center gap-2 mt-1.5">
          <RoutineStatusBadge :status="status" />
          <span v-if="isLoading" class="flex items-center text-[10px] text-primary-600 font-bold animate-pulse uppercase">
            <ArrowPathIcon class="w-3 h-3 mr-1 animate-spin" />
            Sincronizando...
          </span>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2 sm:gap-3">
      
      <button
        @click="$emit('toggle-status')"
        :disabled="isLoading"
        :class="[
          'inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50',
          status === 'active'
            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
        ]"
      >
        <component :is="status === 'active' ? PauseIcon : PlayIcon" class="w-4 h-4 mr-2" />
        <span class="hidden sm:inline">{{ status === 'active' ? 'Pausar Rutina' : 'Activar Rutina' }}</span>
        <span class="sm:hidden">{{ status === 'active' ? 'Pausar' : 'Activar' }}</span>
      </button>

      <button
        @click="$emit('edit')"
        :disabled="isLoading"
        class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
      >
        <PencilIcon class="w-4 h-4 mr-2" />
        <span class="hidden sm:inline">Editar Rutina</span>
        <span class="sm:hidden">Editar</span>
      </button>

      <div class="h-8 w-px bg-gray-200 mx-1"></div>

      <button
        @click="$emit('delete')"
        :disabled="isLoading"
        class="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all group"
        title="Eliminar rutina"
        type="button"
      >
        <TrashIcon class="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  XMarkIcon, 
  PencilIcon, 
  PlayIcon, 
  PauseIcon, 
  TrashIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'

// Reutilizamos el badge de estado que ya tienes en el proyecto
import RoutineStatusBadge from '@/components/gestion/rutinas/core/RoutineStatusBadge.vue'

defineProps<{
  /** Estado actual de la rutina (active, paused, draft) */
  status: string
  /** Indica si se está realizando una operación asíncrona */
  isLoading: boolean
}>()

defineEmits<{
  (e: 'close'): void         // Cerrar el drawer o vista
  (e: 'edit'): void          // Disparar edición (Wizard)
  (e: 'toggle-status'): void // Alternar entre Activo y Pausado
  (e: 'delete'): void        // Eliminar rutina
}>()
</script>