<!-- src/components/modal/BaseModal.vue -->
<!-- MODAL BASE REUTILIZABLE CON TRANSICIONES Y HEROICONS -->
<template>
  <!-- Teleport permite renderizar el modal directamente en <body> -->
  <Teleport to="body">
    <!-- Transición para el overlay (fondo oscuro) -->
    <Transition name="modal-overlay" appear>
      <div v-if="show" class="modal-overlay" @click.self="handleClose">
        <!-- Transición para el contenedor del modal -->
        <Transition name="modal" appear>
          <div class="modal-container" :class="`modal-${size}`">
            <!-- HEADER DEL MODAL -->
            <div class="modal-header">
              <!-- Título dinámico pasado por props -->
              <h2 class="modal-title">{{ title }}</h2>
              <!-- Botón de cierre con icono de Heroicons -->
              <button class="modal-close" @click="handleClose">
                <XMarkIcon class="modal-close-icon" />
              </button>
            </div>
            <!-- CONTENIDO PRINCIPAL DEL MODAL -->
            <div class="modal-content">
              <!-- Slot principal: aquí se inyecta el contenido del modal -->
              <slot></slot>
            </div>
            <!-- FOOTER OPCIONAL -->
            <div v-if="$slots.footer" class="modal-footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'

// INTERFAZ DE PROPIEDADES QUE RECIBE EL MODAL
interface Props {
  show: boolean              // Controla si el modal está visible
  title: string              // Título que se muestra en el header
  size?: 'sm' | 'md' | 'lg' | 'xl'  // Tamaño del modal (opcional)
}

// DEFINIMOS LAS PROPS CON VALORES POR DEFECTO
withDefaults(defineProps<Props>(), {
  size: 'md'                // Si no se especifica, el modal será tamaño medio
})

// DEFINIMOS LOS EVENTOS QUE EMITE EL MODAL
const emit = defineEmits<{
  (e: 'update:show', value: boolean): void  // Para v-model:show
  (e: 'close'): void                        // Evento personalizado para cerrar
}>()

// FUNCIÓN QUE CIERRA EL MODAL
const handleClose = () => {
  emit('update:show', false)  // Oculta el modal (v-model)
  emit('close')               // Permite al padre ejecutar lógica adicional
}
</script>

<style scoped>
/* TRANSICIONES DEL MODAL */
/* Transición del overlay (fondo oscuro) */
.modal-overlay-enter-active,
.modal-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.modal-overlay-enter-from,
.modal-overlay-leave-to {
  opacity: 0;
}

/* Transición del contenedor del modal */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}

/* FONDO OSCURO DETRÁS DEL MODAL */
.modal-overlay {
  position: fixed;
  top: 0; 
  left: 0;
  width: 100%; 
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px); /* Efecto de desenfoque sutil */
}

/* CONTENEDOR DEL MODAL */
.modal-container {
  background: white;
  border-radius: 12px; /* Bordes más redondeados */
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* Sombra más elegante */
}

/* TAMAÑOS DEL MODAL SEGÚN prop `size` */
.modal-sm { 
  width: 400px; 
  max-width: 90vw;
}
.modal-md { 
  width: 600px; 
  max-width: 90vw;
}
.modal-lg { 
  width: 800px; 
  max-width: 90vw;
}
.modal-xl { 
  width: 1000px; 
  max-width: 95vw;
}

/* ENCABEZADO DEL MODAL */
.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9fafb; /* Fondo ligeramente gris */
  border-radius: 12px 12px 0 0; /* Bordes redondeados solo arriba */
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

/* BOTÓN DE CIERRE MEJORADO */
.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #dc2626; /* Color rojo en hover */
  transform: scale(1.1); /* Crece ligeramente */
}

.modal-close:active {
  transform: scale(0.95);
}

/* ICONO DE CIERRE */
.modal-close-icon {
  width: 1.5rem;
  height: 1.5rem;
  transition: transform 0.2s ease;
}

.modal-close:hover .modal-close-icon {
  transform: rotate(90deg); /* Rotación en hover para efecto dinámico */
}

/* CONTENIDO PRINCIPAL DEL MODAL */
.modal-content {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

/* PIE DEL MODAL (OPCIONAL) */
.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 0 0 12px 12px;
}

/* RESPONSIVE DESIGN */
@media (max-width: 640px) {
  .modal-container {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
  
  .modal-sm,
  .modal-md,
  .modal-lg,
  .modal-xl {
    width: 100%;
    max-width: none;
  }
}
</style>