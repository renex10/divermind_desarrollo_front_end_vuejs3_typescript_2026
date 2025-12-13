<!-- src/components/forms/sesiones/NuevaSession.vue -->
<template>
  <BaseModal
    :show="props.show"
    @close="handleClose"
    title="Crear Nueva Sesión de Terapia"
    size="lg"
  >
    <div class="form-container">
      <p class="form-description">
        Completa los campos principales para programar la nueva sesión. Podrás
        añadir más detalles (observaciones, técnicas, etc.) después de que la
        sesión se realice.
      </p>

      <FormKit
        type="form"
        v-model="formData"
        @submit="handleSubmit"
        :actions="false"
      >
        <div class="form-grid">
          <!-- Fecha Programada -->
          <FormKit
            type="datetime-local"
            name="scheduled_date"
            label="Fecha y Hora Programada"
            validation="required"
            :min="getTodayString()"
          />

          <!-- Duración -->
          <FormKit
            type="number"
            name="duration_minutes"
            label="Duración (minutos)"
            validation="required|min:15|max:180"
            :value="'60'"
            help="Duración estimada en minutos. (Ej: 60)"
          />

          <!-- Tipo de Sesión -->
          <FormKit
            type="select"
            name="session_type"
            label="Tipo de Sesión"
            validation="required"
            :options="tiposSesion"
            placeholder="Selecciona un tipo"
          />

          <!-- Modalidad -->
          <FormKit
            type="select"
            name="modality"
            label="Modalidad"
            validation="required"
            :options="modalidades"
            placeholder="Selecciona una modalidad"
          />

          <!-- Objetivos (Campo principal) -->
          <div class="col-span-2">
            <FormKit
              type="textarea"
              name="objectives"
              label="Objetivos Planificados de la Sesión"
              placeholder="Describe los objetivos principales para esta sesión..."
              validation="required"
              rows="4"
            />
          </div>
        </div>

        <!-- Botones del Formulario -->
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="handleClose">
            Cancelar
          </button>
          <FormKit
            type="submit"
            :label="isLoading ? 'Creando...' : 'Crear Sesión'"
            :disabled="isLoading"
          />
        </div>
      </FormKit>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormKitNode } from '@formkit/core'
import BaseModal from '@/components/modal/BaseModal.vue'
import { useAlertModalStore } from '@/store/alertModalStore'
// ⚠️ DEBERÁS CREAR ESTE SERVICIO EN EL SIGUIENTE PASO
import { createTherapySession } from '@/services/sessionService'

// --- Props y Emits ---
const props = defineProps<{
  show: boolean
  childId: number // ID del niño, necesario para la API
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'sesionCreada'): void // Para refrescar la lista en el padre
}>()

// --- Estado del Formulario ---
const isLoading = ref(false)
const getDefaultFormData = () => ({
  scheduled_date: getTodayString(),
  duration_minutes: 60,
  session_type: 'individual',
  modality: 'presencial',
  objectives: ''
})
const formData = ref(getDefaultFormData())

// --- Opciones para los <select> basadas en tu modelo ---
const tiposSesion = [
  { value: 'individual', label: 'Individual' },
  { value: 'grupal', label: 'Grupal' },
  { value: 'familiar', label: 'Con familia' },
  { value: 'evaluacion', label: 'Evaluación' },
  { value: 'seguimiento', label: 'Seguimiento' },
  { value: 'intervencion_crisis', label: 'Intervención en Crisis' }
]

const modalidades = [
  { value: 'presencial', label: 'Presencial' },
  { value: 'online', label: 'Videollamada' },
  { value: 'domiciliaria', label: 'A domicilio' },
  { value: 'escolar', label: 'En escuela' },
  { value: 'comunitaria', label: 'En comunidad' }
]

const alertModal = useAlertModalStore()

// --- Métodos ---

/**
 * Obtiene la fecha y hora actual en formato YYYY-MM-DDTHH:mm para el input.
 */
function getTodayString() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

/**
 * Cierra el modal y resetea el formulario.
 */
function handleClose(node?: FormKitNode | Event) {
  emit('update:show', false)
  // Pequeño delay para que la animación de cierre termine
  setTimeout(() => {
    formData.value = getDefaultFormData()
    // Si es un nodo de FormKit, lo resetea
    if (node && 'reset' in node) {
      ;(node as FormKitNode).reset()
    }
  }, 300)
}

/**
 * Maneja el envío del formulario.
 */
async function handleSubmit(data: typeof formData.value, node: FormKitNode) {
  isLoading.value = true
  try {
    // Llama al servicio (que crearás en el siguiente paso)
    await createTherapySession(props.childId, data)

    alertModal.success(
      'Sesión Creada',
      'La nueva sesión ha sido programada exitosamente.'
    )
    emit('sesionCreada') // Avisa al padre que refresque la lista
    handleClose(node)
  } catch (error: any) {
    console.error('Error al crear la sesión:', error)

    // Si el backend devuelve errores de validación para FormKit
    if (error.response && error.response.status === 400) {
      node.setErrors(error.response.data)
    } else {
      alertModal.error(
        'Error Inesperado',
        'No se pudo crear la sesión. Por favor, revisa la conexión o inténtalo de nuevo.'
      )
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.form-container {
  padding: 0.5rem 1rem;
}

.form-description {
  font-size: 0.9rem;
  color: #4b5563; /* text-gray-600 */
  margin-bottom: 1.5rem;
  background-color: #f9fafb; /* bg-gray-50 */
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #f3f4f6; /* border-gray-100 */
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

/* Hace que un campo ocupe ambas columnas */
.col-span-2 {
  grid-column: span 2 / span 2;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb; /* border-gray-200 */
}

/* Estilos para botones (puedes reusar los de SesionesTerapia.vue si son globales) */
.btn {
  padding: 0.6rem 1.25rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.btn-secondary {
  background: #f3f4f6; /* bg-gray-100 */
  color: #374151; /* text-gray-700 */
  border: 1px solid #d1d5db; /* border-gray-300 */
}

.btn-secondary:hover {
  background: #e5e7eb; /* bg-gray-200 */
}

/* Responsividad para el grid */
@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .col-span-2 {
    grid-column: span 1 / span 1;
  }
}
</style>