<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Fondo oscuro del modal -->
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="$emit('close')"></div>

      <!-- Espacio invisible para alineación -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <!-- Contenedor principal del modal -->
      <div class="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6" :class="modalClass">
        <!-- Icono y contenido -->
        <div class="sm:flex sm:items-start">
          <div class="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10" :class="iconContainerClass">
            <component :is="icon" class="w-6 h-6" :class="iconClass" />
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">
              {{ title }}
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">{{ message }}</p>
            </div>
          </div>
        </div>
        
        <!-- Botones de acción -->
        <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button type="button" class="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm" :class="buttonClass" @click="$emit('confirm')">
            {{ confirmText }}
          </button>
          <button type="button" class="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-color4 sm:mt-0 sm:w-auto sm:text-sm" @click="$emit('close')">
            {{ cancelText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  ExclamationCircleIcon, 
  InformationCircleIcon 
} from '@heroicons/vue/24/outline';

// Definición de props con valores por defecto y validación
const props = defineProps({
  // Tipo de modal que determina el color y el icono
  type: {
    type: String,
    default: 'info',
    validator: (value: string) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  // Título del modal
  title: {
    type: String,
    default: 'Confirmar acción'
  },
  // Mensaje descriptivo del modal
  message: {
    type: String,
    default: '¿Estás seguro de que quieres realizar esta acción?'
  },
  // Texto del botón de confirmación
  confirmText: {
    type: String,
    default: 'Confirmar'
  },
  // Texto del botón de cancelación
  cancelText: {
    type: String,
    default: 'Cancelar'
  }
});

// Emisión de eventos para cerrar y confirmar
defineEmits(['close', 'confirm']);

// Computed property para determinar el icono según el tipo de modal
const icon = computed(() => {
  switch (props.type) {
    case 'success': return CheckCircleIcon;
    case 'error': return ExclamationCircleIcon;
    case 'warning': return ExclamationTriangleIcon;
    default: return InformationCircleIcon;
  }
});

// Computed property para la clase del borde del modal según el tipo
const modalClass = computed(() => {
  switch (props.type) {
    case 'success': return 'border-green-500';
    case 'error': return 'border-red-500';
    case 'warning': return 'border-yellow-500';
    default: return 'border-blue-500';
  }
});

// Computed property para la clase del contenedor del icono según el tipo
const iconContainerClass = computed(() => {
  switch (props.type) {
    case 'success': return 'bg-green-100';
    case 'error': return 'bg-red-100';
    case 'warning': return 'bg-yellow-100';
    default: return 'bg-blue-100';
  }
});

// Computed property para la clase del icono según el tipo
const iconClass = computed(() => {
  switch (props.type) {
    case 'success': return 'text-green-600';
    case 'error': return 'text-red-600';
    case 'warning': return 'text-yellow-600';
    default: return 'text-blue-600';
  }
});

// Computed property para la clase del botón de confirmación según el tipo
const buttonClass = computed(() => {
  switch (props.type) {
    case 'success': return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
    case 'error': return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
    case 'warning': return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500';
    default: return 'bg-color4 hover:bg-color3 focus:ring-color5';
  }
});
</script>