<!-- src/components/modal/BaseModal.vue -->
<!-- MODAL BASE REUTILIZABLE -->

<template>
  <!-- Teleport permite renderizar el modal directamente en <body>,
       evitando problemas de z-index o layout dentro de componentes padres -->
  <Teleport to="body">
    <!-- El modal se muestra solo si `show` es true -->
    <div v-if="show" class="modal-overlay" @click.self="handleClose">
      <!-- El contenedor principal del modal, con tamaño dinámico según `size` -->
      <div class="modal-container" :class="`modal-${size}`">

        <!-- HEADER DEL MODAL -->
        <div class="modal-header">
          <!-- Título dinámico pasado por props -->
          <h2>{{ title }}</h2>
          <!-- Botón de cierre manual del modal -->
          <button class="modal-close" @click="handleClose">×</button>
        </div>

        <!-- CONTENIDO PRINCIPAL DEL MODAL -->
        <div class="modal-content">
          <!-- Slot principal: aquí se inyecta el contenido del modal -->
          <slot></slot>
        </div>

        <!-- FOOTER OPCIONAL -->
        <!-- Se muestra solo si el padre define un slot llamado "footer" -->
        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer"></slot>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
// INTERFAZ DE PROPIEDADES QUE RECIBE EL MODAL
interface Props {
  show: boolean              // Controla si el modal está visible
  title: string              // Título que se muestra en el header
  size?: 'sm' | 'md' | 'lg' | 'xl'  // Tamaño del modal (opcional)
}

// DEFINIMOS LAS PROPS CON VALORES POR DEFECTO
const props = withDefaults(defineProps<Props>(), {
  size: 'md'                // Si no se especifica, el modal será tamaño medio
})

// DEFINIMOS LOS EVENTOS QUE EMITE EL MODAL
const emit = defineEmits<{
  (e: 'update:show', value: boolean): void  // Para v-model:show
  (e: 'close'): void                        // Evento personalizado para cerrar
}>()

// FUNCIÓN QUE CIERRA EL MODAL
// Se llama al hacer clic en el fondo oscuro o en el botón "×"
const handleClose = () => {
  emit('update:show', false)  // Oculta el modal (v-model)
  emit('close')               // Permite al padre ejecutar lógica adicional
}
</script>

<style scoped>
/* FONDO OSCURO DETRÁS DEL MODAL */
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);  /* semi-transparente */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;  /* asegura que esté por encima de todo */
}

/* CONTENEDOR DEL MODAL */
.modal-container {
  background: white;
  border-radius: 8px;
  max-height: 90vh;  /* evita que el modal se desborde verticalmente */
  display: flex;
  flex-direction: column;
}

/* TAMAÑOS DEL MODAL SEGÚN prop `size` */
.modal-sm { width: 400px; }
.modal-md { width: 600px; }
.modal-lg { width: 800px; }
.modal-xl { width: 1000px; }

/* ENCABEZADO DEL MODAL */
.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* CONTENIDO PRINCIPAL DEL MODAL */
.modal-content {
  padding: 1.5rem;
  overflow-y: auto;  /* permite scroll si el contenido es largo */
  flex: 1;           /* ocupa el espacio restante del modal */
}

/* PIE DEL MODAL (OPCIONAL) */
.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
}
</style>
