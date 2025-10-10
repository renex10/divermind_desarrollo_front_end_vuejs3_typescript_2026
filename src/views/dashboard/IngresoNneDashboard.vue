<!-- src/views/dashboard/IngresoNneDashboard.vue - CORREGIDO -->
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

    <!-- SECCIÓN: Métricas del Dashboard -->
    <MetricCardGrid 
      :metricas="metricasData"
      :loading="metricasLoading"
      :error="metricasError"
      @refresh="recargarMetricas"
    />

    <!-- Componente de tabla -->
    <TablaFiltro 
      :data="nnaList" 
      :loading="cargando" 
      @view="manejarView" 
      @edit="manejarEdit" 
      @delete="manejarDelete"
    />

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
          :editData="editingNnaData"
          @submit="handleNnaSubmit"
          @cancel="handleNnaCancel"
        />
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
            {{ successMessage.title }}
          </h3>
          <p class="text-gray-600 text-center">
            {{ successMessage.body }}
          </p>
          <div v-if="createdChildInfo" class="mt-4 p-3 bg-blue-50 rounded-lg">
            <p class="text-sm text-gray-700">
              <strong>Nombre:</strong> {{ createdChildInfo.nombre }}
            </p>
            <p class="text-sm text-gray-700">
              <strong>RUT:</strong> {{ createdChildInfo.rut }}
            </p>
            <div v-if="createdChildInfo.padres_asociados && createdChildInfo.padres_asociados.length > 0" class="mt-2">
              <p class="text-sm text-gray-700 font-semibold">Padres asociados:</p>
              <ul class="text-sm text-gray-600 ml-4">
                <li v-for="padre in createdChildInfo.padres_asociados" :key="padre.id">
                  • {{ padre.nombre_completo }} ({{ padre.email }})
                </li>
              </ul>
            </div>
          </div>
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
import { ref, onMounted, defineAsyncComponent } from 'vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import TablaFiltro from '@/components/ninos/TablaFiltro.vue'
import filtroService, { transformNnaListForTable } from '@/services/filtroService'
import MetricCardGrid from '@/components/ninos/SubComponentes/metricasCard/MetricCardGrid.vue'
import { useMetricas } from '@/composables/useMetricas'
import { useAlertModalStore } from '@/store/alertModalStore'

// ✅ IMPORTAR EL SERVICIO DE NNE
import { createNneApi } from '@/services/nneService'
import { parseApiError, getUserFriendlyErrorMessage } from '@/exceptions/apiError'

// Alert modal store
const alertModal = useAlertModalStore()

// Estado de métricas usando el composable
const { 
  metricas: metricasData, 
  loading: metricasLoading, 
  error: metricasError, 
  cargarMetricas, 
  recargarMetricas 
} = useMetricas()

// Estado principal
const nnaList = ref<any[]>([])
const cargando = ref(false)
const showNnaModal = ref(false)
const showSuccessModal = ref(false)
const editingNnaData = ref<any>(undefined)
const isSubmitting = ref(false)

// ✅ NUEVO: Estado para mensaje de éxito y datos del niño creado
const successMessage = ref({
  title: 'NNA registrado correctamente',
  body: 'El registro se ha completado exitosamente y está disponible en el sistema.'
})
const createdChildInfo = ref<any>(null)

// Estado de paginación y filtros
const pagination = ref({
  count: 0,
  total_pages: 0,
  current_page: 1,
  page_size: 10,
  has_next: false,
  has_previous: false
})

const selectedFilters = ref({
  search: '',
  grade: '',
  status: '',
  commune: '',
  region: '',
  autism_level: '',
  school_journey: ''
})

// Importación asíncrona del formulario
const NneMultiStepForm = defineAsyncComponent(() =>
  import('@/components/forms/multi-step/NneMultiStepForm.vue')
)

// Cargar datos al montar el componente
onMounted(async () => {
  await cargarNnaList()
})

// Función para cargar datos del backend
const cargarNnaList = async (page = 1) => {
  try {
    cargando.value = true
    console.log('🔄 Cargando lista de NNA desde el backend...')

    const response = await filtroService.getNnaListApi({
      page,
      page_size: pagination.value.page_size,
      ...selectedFilters.value
    })

    nnaList.value = transformNnaListForTable(response.results)
    pagination.value = response.pagination

    console.log(`✅ ${nnaList.value.length} NNA cargados en página ${pagination.value.current_page}`)
  } catch (error) {
    console.error('❌ Error al cargar lista de NNA:', error)
    alertModal.error(
      'Error al cargar datos',
      'No se pudo cargar la lista de NNA. Por favor, intente nuevamente.'
    )
  } finally {
    cargando.value = false
  }
}

// ✅ CORREGIDO: handleNnaSubmit ahora llama al servicio real
const handleNnaSubmit = async (formData: any) => {
  console.log('📥 ========== HANDLER SUBMIT RECIBIDO ==========')
  console.log('Datos del NNA recibidos en el handler:', JSON.stringify(formData, null, 2))
  console.log('================================================')
  
  try {
    isSubmitting.value = true
    
    // ✅ LLAMAR AL SERVICIO REAL DE CREACIÓN
    console.log('🚀 Llamando a createNneApi...')
    const response = await createNneApi(formData)
    
    console.log('✅ ========== RESPUESTA DEL BACKEND ==========')
    console.log('Respuesta completa:', response)
    console.log('============================================')
    
    // Extraer datos de la respuesta
    const responseData = response.data || response
    
    // Actualizar información para el modal de éxito
    createdChildInfo.value = responseData
    successMessage.value = {
      title: '¡Registro Exitoso!',
      body: `La ficha de ${responseData.nombre} ha sido creada correctamente.`
    }
    
    // Recargar lista y métricas
    await Promise.all([
      cargarNnaList(pagination.value.current_page),
      recargarMetricas()
    ])
    
    // Cerrar modal del formulario y mostrar modal de éxito
    showNnaModal.value = false
    showSuccessModal.value = true
    
    // Limpiar datos de edición
    setTimeout(() => {
      editingNnaData.value = undefined
    }, 300)
    
    // Mostrar alerta de éxito
    alertModal.success(
      '¡Éxito!',
      `La ficha de ${responseData.nombre} ha sido creada correctamente.`
    )
    
  } catch (error: any) {
    console.error('❌ ========== ERROR AL CREAR NNA ==========')
    console.error('Error completo:', error)
    console.error('Respuesta del servidor:', error.response?.data)
    console.error('Status:', error.response?.status)
    console.error('==========================================')
    
    // Parsear error
    const parsedError = parseApiError(error)
    const errorMessage = getUserFriendlyErrorMessage(parsedError)
    
    // Mostrar error al usuario
    alertModal.error(
      'Error al registrar NNA',
      errorMessage || 'No se pudo registrar el NNA. Por favor, verifique los datos e intente nuevamente.'
    )
    
  } finally {
    isSubmitting.value = false
    console.log('🏁 ========== FIN HANDLER SUBMIT ==========')
  }
}

// Función para abrir el modal de nuevo NNA
const openNnaModal = () => {
  editingNnaData.value = undefined
  createdChildInfo.value = null
  showNnaModal.value = true
}

// Función para abrir modal en modo edición
const editNna = (nnaData: any) => {
  editingNnaData.value = nnaData
  showNnaModal.value = true
}

// Manejar cierre del modal
const handleModalClose = () => {
  showNnaModal.value = false
  setTimeout(() => {
    editingNnaData.value = undefined
  }, 300)
}

// Manejar cancelación desde el formulario
const handleNnaCancel = () => {
  handleModalClose()
}

// Cerrar modal de éxito
const closeSuccessModal = () => {
  showSuccessModal.value = false
  createdChildInfo.value = null
}

// Agregar otro NNA después del éxito
const addAnotherNna = () => {
  showSuccessModal.value = false
  createdChildInfo.value = null
  setTimeout(() => {
    openNnaModal()
  }, 100)
}

// Manejadores para la tabla
const manejarView = (nna: any) => {
  console.log('👁️ Ver NNA:', nna)
}

const manejarEdit = (nna: any) => {
  console.log('✏️ Editar NNA:', nna)
  editNna(nna)
}

const manejarDelete = (nna: any) => {
  console.log('🗑️ Eliminar NNA:', nna)
  if (confirm(`¿Estás seguro de eliminar a ${nna.first_name} ${nna.last_name}?`)) {
    // Aquí deberías llamar al endpoint real de borrado
    nnaList.value = nnaList.value.filter(item => item.id !== nna.id)
  }
}

// Función para recargar datos
const recargarDatos = async () => {
  await cargarNnaList(pagination.value.current_page)
}

// Exponer funciones para uso en el template
defineExpose({
  openNnaModal,
  editNna,
  recargarDatos
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
  overflow-y: auto;
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
  width: 100%;
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

/* Animaciones */
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
.modal-overlay {
  backdrop-filter: blur(4px);
}

.bg-color3 {
  background-color: #3b82f6;
}

.bg-color4 {
  background-color: #2563eb;
}
</style>