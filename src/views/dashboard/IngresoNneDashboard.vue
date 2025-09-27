<!-- src/views/dashboard/IngresoNneDashboard.vue -->
<template>
  <div class="p-6">
    <div class="header-section">
      <h1 class="text-2xl font-bold mb-6">Gestión de NNA</h1>
      
      <button
        @click="openNnaModal"
        class="bg-color3 hover:bg-color4 text-white px-4 py-2 rounded transition-colors duration-200"
      >
        Agregar Nuevo NNA
      </button>
    </div>

    <!-- Lista de NNA existentes (placeholder para futuras funcionalidades) -->
    <div class="mt-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Lista de NNA Registrados</h2>
        <p class="text-gray-500">Aquí aparecerán los NNA registrados...</p>
      </div>
    </div>

    <!-- Modal para formulario de NNA -->
    <BaseModal 
      v-if="showNnaModal"
      v-model:show="showNnaModal"
      title="Registro de Nuevo NNA"
      size="xl"
      @close="handleModalClose"
    >
      <!-- Contenido del modal: Formulario multi-step -->
      <div class="nna-form-container">
        <NneMultiStepForm
          v-if="NneMultiStepForm"
          :editData="editingNnaData"
          @submit="handleNnaSubmit"
          @cancel="handleNnaCancel"
        />
        <div v-else class="loading-fallback">
          <p>Cargando formulario...</p>
        </div>
      </div>

      <!-- Footer del modal con información adicional -->
      <template #footer>
        <div class="modal-footer-content">
          <div class="footer-info">
            <p class="text-sm text-gray-600">
              Complete todos los pasos para registrar el nuevo NNA en el sistema.
            </p>
          </div>
          <div class="footer-actions">
            <button
              @click="handleNnaCancel"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </template>
    </BaseModal>

    <!-- Modal de confirmación para envío exitoso -->
    <BaseModal
      v-if="showSuccessModal"
      v-model:show="showSuccessModal"
      title="¡Registro Exitoso!"
      size="md"
      @close="closeSuccessModal"
    >
      <div class="success-content">
        <div class="success-icon">
          <svg class="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="success-text">
          <h3 class="text-lg font-semibold text-center mb-2">
            NNA registrado correctamente
          </h3>
          <p class="text-gray-600 text-center">
            El registro se ha completado exitosamente y está disponible en el sistema.
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-center space-x-4">
          <button
            @click="closeSuccessModal"
            class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition-colors"
          >
            Cerrar
          </button>
          <button
            @click="addAnotherNna"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
          >
            Agregar Otro NNA
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, type AsyncComponentLoader } from 'vue'

// Importaciones seguras con manejo de errores
import BaseModal from '@/components/modal/BaseModal.vue'

// Importación asíncrona con fallback
const NneMultiStepForm = defineAsyncComponent({
  loader: (() => import('@/components/forms/multi-step/NneMultiStepForm.vue')) as AsyncComponentLoader,
  loadingComponent: {
    template: '<div class="loading">Cargando formulario...</div>'
  },
  errorComponent: {
    template: '<div class="error">Error al cargar el formulario. Por favor, recarga la página.</div>'
  },
  delay: 200,
  timeout: 3000
})

// Definición del tipo NneFormData (temporal hasta que lo tengas en tu archivo de tipos)
interface NneFormData {
  first_name: string
  last_name: string
  rut: string
  birth_date: string
  gender: string
  street: string
  street_number: string
  current_grade: string
  [key: string]: any // Para propiedades adicionales
}

// Estado del modal principal
const showNnaModal = ref(false)
const showSuccessModal = ref(false)

// Datos para edición (en caso de editar un NNA existente)
const editingNnaData = ref<Partial<NneFormData> | undefined>(undefined)

// Estado de carga
const isSubmitting = ref(false)

// Función para abrir el modal de nuevo NNA
const openNnaModal = () => {
  editingNnaData.value = undefined // Resetear datos de edición
  showNnaModal.value = true
}

// Función para abrir modal en modo edición (para uso futuro)
const editNna = (nnaData: Partial<NneFormData>) => {
  editingNnaData.value = nnaData
  showNnaModal.value = true
}

// Manejar cierre del modal
const handleModalClose = () => {
  showNnaModal.value = false
  // Resetear datos después de un breve delay para evitar flickering
  setTimeout(() => {
    editingNnaData.value = undefined
  }, 300)
}

// Manejar cancelación desde el formulario
const handleNnaCancel = () => {
  handleModalClose()
}

// Manejar envío del formulario
const handleNnaSubmit = async (formData: NneFormData) => {
  console.log('Datos del NNA a enviar:', formData)
  
  try {
    isSubmitting.value = true
    
    // Aquí implementarías la llamada a tu API
    // Ejemplo:
    // const response = await nnaApi.create(formData)
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Cerrar modal principal y mostrar mensaje de éxito
    showNnaModal.value = false
    showSuccessModal.value = true
    
    // Resetear datos
    setTimeout(() => {
      editingNnaData.value = undefined
    }, 300)
    
  } catch (error) {
    console.error('Error al enviar los datos:', error)
    
    // Aquí podrías mostrar un modal de error o un toast
    alert('Error al registrar el NNA. Por favor, inténtelo nuevamente.')
    
  } finally {
    isSubmitting.value = false
  }
}

// Cerrar modal de éxito
const closeSuccessModal = () => {
  showSuccessModal.value = false
}

// Agregar otro NNA después del éxito
const addAnotherNna = () => {
  showSuccessModal.value = false
  // Abrir nuevamente el modal para un nuevo registro
  setTimeout(() => {
    openNnaModal()
  }, 100)
}

// Funciones de utilidad para desarrollo/testing
const logFormData = (data: any) => {
  console.log('Form Data Updated:', data)
}

// Función para testing rápido (puedes remover en producción)
const fillTestData = () => {
  editingNnaData.value = {
    first_name: 'Juan',
    last_name: 'Pérez',
    rut: '12345678-9',
    birth_date: '2015-05-15',
    gender: 'male',
    street: 'Av. Principal',
    street_number: '123',
    current_grade: '3° Básico'
  }
  showNnaModal.value = true
}

// Exponer funciones para uso en el template de desarrollo
defineExpose({
  openNnaModal,
  editNna,
  fillTestData
})
</script>

<style scoped>
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.nna-form-container {
  min-height: 600px;
  max-height: 80vh;
}

.loading-fallback {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  color: #666;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #666;
}

.error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #ef4444;
  text-align: center;
  padding: 1rem;
}

.modal-footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.footer-info {
  flex: 1;
}

.footer-actions {
  display: flex;
  gap: 0.5rem;
}

.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
}

.success-icon {
  margin-bottom: 1rem;
}

.success-text {
  text-align: center;
}

/* Responsive design */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .modal-footer-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .nna-form-container {
    min-height: 500px;
    max-height: 70vh;
  }
}

/* Estilos para mejorar la experiencia del modal */
:deep(.modal-container) {
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Estilos para botones */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button:not(:disabled):hover {
  transform: translateY(-1px);
}

.transition-colors {
  transition: all 0.2s ease;
}
</style>

<style>
/* Estilos globales para mejorar el modal */
.modal-overlay {
  backdrop-filter: blur(4px);
}

/* Clases CSS para los colores mencionados (asegúrate de definirlas en tu CSS global) */
.bg-color3 {
  background-color: #3b82f6; /* Azul por defecto, cámbialo por tu color */
}

.bg-color4 {
  background-color: #2563eb; /* Azul más oscuro para hover */
}
</style>