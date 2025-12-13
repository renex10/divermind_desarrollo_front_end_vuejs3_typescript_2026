<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton 
        class="flex items-center rounded-full bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        aria-label="Opciones de rutina"
      >
        <span class="sr-only">Abrir menú de opciones</span>
        <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div class="py-1">
          
          <MenuItem v-slot="{ active }">
            <button 
              @click="emitAction('edit')"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'group flex w-full items-center px-4 py-2 text-sm'
              ]"
            >
              <PencilSquareIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
              Editar Rutina
            </button>
          </MenuItem>

          <MenuItem v-slot="{ active }">
            <button 
              @click="emitAction('clone')"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'group flex w-full items-center px-4 py-2 text-sm'
              ]"
            >
              <DocumentDuplicateIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
              Clonar Rutina
            </button>
          </MenuItem>
          
          <MenuItem v-slot="{ active }">
            <button 
              v-if="routine.status === 'active' || routine.status === 'paused'"
              @click="emitAction('toggle-status')"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'group flex w-full items-center px-4 py-2 text-sm'
              ]"
            >
              <component 
                :is="toggleStatusIcon" 
                class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" 
                aria-hidden="true" 
              />
              {{ toggleStatusText }}
            </button>
          </MenuItem>

          <div class="my-1 border-t border-gray-100"></div>

          <MenuItem v-slot="{ active }">
            <button 
              @click="emitAction('archive')"
              :class="[
                active ? 'bg-error-50 text-error-700' : 'text-error-600',
                'group flex w-full items-center px-4 py-2 text-sm'
              ]"
            >
              <ArchiveBoxXMarkIcon class="mr-3 h-5 w-5 group-hover:text-error-500" :class="active ? 'text-error-500' : 'text-error-400'" aria-hidden="true" />
              Archivar Rutina
            </button>
          </MenuItem>
          
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import type { DailyRoutineList } from '@/type/rutinas/rutinas' // Importa la interfaz

// Componentes de Headless UI y Heroicons
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  DocumentDuplicateIcon,
  PauseCircleIcon, // Para Pausar
  PlayCircleIcon,  // Para Activar
  ArchiveBoxXMarkIcon,
} from '@heroicons/vue/20/solid' // Usamos 'solid' para iconos más llenos en el menú

// === PROPS ===
const props = defineProps({
  /**
   * El objeto de rutina para determinar las acciones disponibles.
   */
  routine: {
    type: Object as PropType<DailyRoutineList>,
    required: true
  }
})

// === EMITS ===
// Define los eventos que este componente puede emitir.
// El componente padre (ej. RoutineCard) escuchará estos eventos.
const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'clone'): void
  (e: 'toggle-status'): void
  (e: 'archive'): void
}>()

// === COMPUTED ===

/**
 * Determina el icono correcto para la acción de Pausar/Activar.
 */
const toggleStatusIcon = computed(() => {
  return props.routine.status === 'active' ? PauseCircleIcon : PlayCircleIcon
})

/**
 * Determina el texto correcto para la acción de Pausar/Activar.
 */
const toggleStatusText = computed(() => {
  return props.routine.status === 'active' ? 'Pausar Rutina' : 'Activar Rutina'
})

// === MÉTODOS ===

/**
 * Función genérica para emitir el evento correspondiente a la acción.
 */
function emitAction(actionName: 'edit' | 'clone' | 'toggle-status' | 'archive') {
  switch (actionName) {
    case 'edit':
      emit('edit')
      break
    case 'clone':
      emit('clone')
      break
    case 'toggle-status':
      emit('toggle-status')
      break
    case 'archive':
      emit('archive')
      break
  }
}

</script>