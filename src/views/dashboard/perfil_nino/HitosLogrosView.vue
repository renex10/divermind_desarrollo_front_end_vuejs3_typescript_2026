<template>
  <div class="hitos-logros-view max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <div class="mb-8 flex justify-between items-end">
      <div>
        <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          Registro de Hitos del Desarrollo
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Documenta los logros y avances del desarrollo del niño
        </p>
      </div>
      <button
        @click="toggleFormVisibility"
        :disabled="isLoading || isSubmitting"
        :class="[
          'inline-flex items-center justify-center border border-transparent rounded-lg shadow-lg font-semibold text-white transition-all duration-300',
          'px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base md:px-6 md:py-3 md:text-lg',
          editingMilestoneId 
            ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500' 
            : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500',
          (isLoading || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
        ]"
      >
        <svg v-if="editingMilestoneId" class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <svg v-else-if="showForm" class="w-4 h-4 sm:w-5 sm:h-5 mr-2 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M5 15l7-7 7 7" />
        </svg>
        <svg v-else class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 4v16m8-8H4" />
        </svg>
        {{ buttonToggleText }}
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <svg
        class="animate-spin h-8 w-8 text-primary-500 mr-3"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <p class="text-gray-600 font-medium">Cargando...</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <div 
        :class="[
          'lg:col-span-2', // Tamaño por defecto en pantallas grandes
          // Si el formulario NO está visible Y hay datos para graficar, ocupa 3/3
          !showForm && milestones.length > 0 ? 'lg:col-span-2' : 
          // Si el formulario NO está visible Y NO hay datos para graficar, ocupa 3/3
          !showForm && milestones.length === 0 ? 'lg:col-span-3' : 
          // Si el formulario SÍ está visible, ocupa 2/3
          'col-span-1'
        ]"
      >
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="transform opacity-0 max-h-0"
          enter-to-class="transform opacity-100 max-h-screen"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="transform opacity-100 max-h-screen"
          leave-to-class="transform opacity-0 max-h-0"
        >
          <MilestoneForm
            v-if="showForm"
            :initial-data="formData"
            :editing-milestone-id="editingMilestoneId"
            :is-submitting="isSubmitting"
            @submitForm="handleSubmit"
            @cancelEdit="cancelEdit"
            class="mb-6 transition-all duration-300"
          />
        </transition>

        <section :class="{'mt-4': showForm, 'mt-0': !showForm}">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h3 class="text-2xl font-bold text-gray-900">Historial de Hitos</h3>
              <p class="mt-1 text-sm text-gray-600">Registro cronológico de logros y avances</p>
            </div>
            <button @click="loadMilestones()" :disabled="isLoadingHistory" class="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <svg :class="['w-4 h-4 mr-2', { 'animate-spin': isLoadingHistory }]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {{ isLoadingHistory ? 'Cargando...' : 'Refrescar' }}
            </button>
          </div>

          <MilestoneHistoryList
            :milestones="milestones"
            :is-loading="isLoadingHistory"
            @edit="handleEdit"
            @delete="handleDeleteRequest"
          />
        </section>
      </div>
      
      <div v-if="!isLoadingHistory && milestones.length > 0" class="lg:col-span-1">
          <MilestonesMetrics 
              :milestones="milestones" 
              class="lg:sticky lg:top-8" 
          />
      </div>
      <div v-else-if="!isLoadingHistory && milestones.length === 0" class="lg:col-span-3 p-8 bg-white rounded-xl border border-gray-100 shadow-sm mt-6">
          <p class="text-center text-gray-500 italic font-medium">
            ¡Comienza a registrar! No hay hitos para este niño. Usa el botón "Registrar Nuevo Hito" para empezar a generar las métricas de progreso.
          </p>
      </div>
    </div>
    
    <ConfirmModal
      v-if="showConfirmDeleteModal"
      :show="showConfirmDeleteModal"
      @update:show="(value: boolean) => { if (!value) cancelDelete() }"
      title="Confirmar Eliminación"
      message="¿Estás seguro de que deseas eliminar este hito? Esta acción no se puede deshacer."
      confirm-text="Sí, Eliminar"
      cancel-text="Cancelar"
      type="warning"
      @confirm="confirmDelete"
      @close="cancelDelete"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed} from 'vue'
import { useRouter } from 'vue-router'
import { useNinoActivoStore } from '@/store/ninoActivoStore'
import { useAlertModalStore } from '@/store/alertModalStore'
import MilestoneHistoryList from '@/components/gestion/hitosLogros/MilestoneHistoryList.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import MilestoneForm from '@/components/gestion/hitosLogros/MilestoneForm.vue'
import MilestonesMetrics from '@/components/gestion/hitosLogros/MilestonesMetrics.vue'
import { reset } from '@formkit/core'

// --- Importar Servicio e Interfaces ---
import { hitosService } from '@/services/hitosService'
import type { Milestone, MilestoneFormData } from '@/type/hitoServiceInterface'

// --- Stores ---
const router = useRouter()
const ninoStore = useNinoActivoStore()
const alertModal = useAlertModalStore()

// --- Estado del Componente ---
const isLoading = ref(true)
const isSubmitting = ref(false)
const isLoadingHistory = ref(false)
const milestones = ref<Milestone[]>([])
const editingMilestoneId = ref<number | string | null>(null)
const showConfirmDeleteModal = ref(false)
const milestoneToDeleteId = ref<number | string | null>(null)
const showForm = ref(false)

// --- Datos del Formulario ---
const initialFormData: MilestoneFormData = {
  date: new Date().toISOString().split('T')[0],
  category: 'communication',
  description: '',
  observations: '',
  proficiency_level: 'emerging',
  context: 'therapy',
  support_level: 'verbal_cue',
  functional_impact: '',
}
const formData = ref<MilestoneFormData>({ ...initialFormData })

// --- Propiedades Computadas ---
const buttonToggleText = computed(() => {
  if (editingMilestoneId.value) {
    return 'Modo Edición'
  }
  return showForm.value ? 'Ocultar Formulario' : 'Registrar Nuevo Hito'
})

// --- Ciclo de Vida ---
onMounted(async () => {
  // ✅ CORREGIDO: Usa ninoActivoId en lugar de ninoId
  if (!ninoStore.ninoActivoId) {
    console.log('📂 Intentando cargar niño activo desde localStorage...')
    
    try {
      await ninoStore.initializeFromStorage()
      
      if (!ninoStore.ninoActivoId) {
        console.warn('⚠️ No hay niño activo, redirigiendo...')
        router.push({ name: 'parent-mis-hijos' })
        isLoading.value = false
        return
      }
    } catch (error) {
      console.error('❌ Error al inicializar niño activo:', error)
      isLoading.value = false
      return
    }
  }
  
  await initializeComponent(ninoStore.ninoActivoId)
})

async function initializeComponent(childId: number | null) {
  if (!childId) {
    console.warn('⚠️ initializeComponent: No se proporcionó ID de niño')
    isLoading.value = false
    return
  }
  
  isLoading.value = true
  await loadMilestones(childId)
  isLoading.value = false
}

// --- Funciones de Interacción con API ---

/**
 * ✅ CORREGIDO: Acepta number | null y usa ninoActivoId por defecto
 */
async function loadMilestones(childId: number | null = ninoStore.ninoActivoId) {
  if (!childId) {
    console.warn('⚠️ loadMilestones: No se proporcionó ID de niño')
    milestones.value = []
    return
  }
  
  isLoadingHistory.value = true
  try {
    console.log(`🔍 Cargando hitos para niño ID: ${childId}`)
    milestones.value = await hitosService.getMilestones(childId)
    console.log(`✅ ${milestones.value.length} hitos cargados`)
  } catch (error) {
    console.error('❌ Error al cargar hitos:', error)
    alertModal.error('Error de Carga', 'No se pudo cargar el historial de hitos.')
    milestones.value = []
  } finally {
    isLoadingHistory.value = false
  }
}

// Maneja el evento @submitForm del componente hijo
async function handleSubmit(submittedData: MilestoneFormData) {
  // ✅ CORREGIDO: Usa ninoActivoId en lugar de ninoId
  if (!ninoStore.ninoActivoId) {
    alertModal.warning('Error', 'ID de niño no encontrado.')
    return
  }

  isSubmitting.value = true
  const childId = ninoStore.ninoActivoId

  const payload: MilestoneFormData = {
    ...submittedData,
    observations: submittedData.observations?.trim() || null,
    functional_impact: submittedData.functional_impact?.trim() || null,
  }

  try {
    let savedMilestone: Milestone
    if (editingMilestoneId.value) { // --- ACTUALIZAR ---
      savedMilestone = await hitosService.updateMilestone(childId, editingMilestoneId.value, payload)
      alertModal.success('Hito Actualizado', 'Cambios guardados correctamente.')
      const index = milestones.value.findIndex(m => m.id === editingMilestoneId.value)
      if (index !== -1) milestones.value[index] = savedMilestone
      else await loadMilestones(childId)
      
    } else { // --- CREAR ---
      savedMilestone = await hitosService.createMilestone(childId, payload)
      alertModal.success('Hito Guardado', 'Nuevo hito registrado.')
      milestones.value.unshift(savedMilestone)
    }
    
    // Reordenar para que el nuevo/editado aparezca correctamente
    milestones.value.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    resetForm()
    showForm.value = false // Ocultar formulario al guardar uno nuevo

  } catch (error: any) { // --- MANEJO DE ERRORES ---
    let errorMessage = editingMilestoneId.value ? 'Error al actualizar.' : 'Error al guardar.'
    if (error.response?.data) {
      const errors = error.response.data
      const fieldErrors = Object.entries(errors)
        .map(([field, messages]) => `${field}: ${(Array.isArray(messages) ? messages.join(', ') : messages)}`)
        .join('; ')
      if (fieldErrors) errorMessage = `Error de validación: ${fieldErrors}`
      else if (errors.detail) errorMessage = errors.detail
    }
    alertModal.error('Error', errorMessage)
  } finally {
    isSubmitting.value = false
  }
}

// --- Funciones para Borrado (usando ConfirmModal.vue) ---

function handleDeleteRequest(milestoneId: number | string) {
  milestoneToDeleteId.value = milestoneId
  showConfirmDeleteModal.value = true
}

async function confirmDelete() {
  // ✅ CORREGIDO: Usa ninoActivoId en lugar de ninoId
  if (!ninoStore.ninoActivoId || milestoneToDeleteId.value === null) {
    showConfirmDeleteModal.value = false
    milestoneToDeleteId.value = null
    return
  }
  
  const childId = ninoStore.ninoActivoId
  const idToDelete = milestoneToDeleteId.value

  showConfirmDeleteModal.value = false

  try {
    await hitosService.deleteMilestone(childId, idToDelete)
    alertModal.success('Hito Eliminado', 'El hito se eliminó correctamente.')
    milestones.value = milestones.value.filter(m => m.id !== idToDelete)
  } catch (error) {
    alertModal.error('Error al Eliminar', 'No se pudo eliminar el hito.')
  } finally {
    milestoneToDeleteId.value = null
    if (editingMilestoneId.value === idToDelete) {
      resetForm()
      showForm.value = false
    }
  }
}

function cancelDelete() {
  showConfirmDeleteModal.value = false
  milestoneToDeleteId.value = null
}

// --- Funciones de UI y Formulario ---

function handleEdit(milestoneToEdit: Milestone) {
  const dataToEdit = milestones.value.find(m => m.id === milestoneToEdit.id)
  if (dataToEdit) {
    // 1. Poblar el ref() formData.value con los datos
    formData.value = {
      date: dataToEdit.date.includes('T') ? dataToEdit.date.split('T')[0] : dataToEdit.date, // Asegurar YYYY-MM-DD
      category: dataToEdit.category,
      description: dataToEdit.description,
      observations: dataToEdit.observations ?? '', // Convertir null a ''
      proficiency_level: dataToEdit.proficiency_level,
      context: dataToEdit.context,
      support_level: dataToEdit.support_level,
      functional_impact: dataToEdit.functional_impact ?? '' // Convertir null a ''
    }

    editingMilestoneId.value = dataToEdit.id
    showForm.value = true // Desplegar formulario
    window.scrollTo({ top: 0, behavior: 'smooth' })
    alertModal.info('Modo Edición', 'Modifica los campos necesarios y presione "Actualizar Hito".')
  } else {
    alertModal.error('Error', 'No se encontró el hito para editar.')
  }
}

// Resetea el formulario y sale del modo edición
function resetForm() {
  editingMilestoneId.value = null // Salir modo edición
  formData.value = { ...initialFormData }
  // reset('hitoForm') limpia el estado *interno* de FormKit
  reset('hitoForm')
}

// Se llama al presionar "Cancelar Edición" o después de guardar
function cancelEdit() {
  resetForm()
  showForm.value = false // Ocultar formulario al cancelar
}

// Alternar visibilidad
function toggleFormVisibility() {
  if (editingMilestoneId.value) {
    // Si estamos editando, al presionar el botón cancelamos edición y lo ocultamos
    cancelEdit()
  } else {
    // Si no estamos editando, simplemente alternamos visibilidad
    showForm.value = !showForm.value
    // Si se abre para un nuevo registro, asegurarse de que el formulario esté limpio
    if (showForm.value) {
      resetForm()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}
</script>

<style scoped>
/* Estilos específicos del componente */
.shadow-soft {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
}
/* Asegúrate de que los estilos básicos de FormKit no se pierdan */
</style>