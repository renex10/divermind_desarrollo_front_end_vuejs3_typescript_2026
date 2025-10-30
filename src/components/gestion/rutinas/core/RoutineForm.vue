<template>
  <FormKit
    type="form"
    v-model="formData"
    :form-class="formClass"
    :actions="false"
    @submit="handleSubmit"
    #default="{ value, state: { valid } }"
  >
    <div class="space-y-6">
      <FormKit
        type="text"
        name="name"
        label="Nombre de la Rutina"
        placeholder="Ej: Rutina de la mañana (ir al colegio)"
        validation="required|length:5,100"
        :validation-messages="{
          required: 'El nombre es obligatorio.',
          length: 'El nombre debe tener entre 5 y 100 caracteres.',
        }"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
        <FormKit
          type="select"
          name="routine_type"
          label="Tipo de Rutina"
          placeholder="Selecciona un tipo"
          validation="required"
          :options="routineTypeOptions"
          :validation-messages="{
            required: 'Debes seleccionar un tipo de rutina.',
          }"
        />
        
        <FormKit
          type="select"
          name="status"
          label="Estado"
          help="Activa, pausada, o borrador."
          :options="statusOptions"
          validation="required"
        />
      </div>

      <FormKit
        type="textarea"
        name="description"
        label="Descripción (Opcional)"
        placeholder="Describe el objetivo principal de esta rutina..."
        :rows="4"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
         <FormKit
           type="date"
           name="date_started"
           label="Fecha de Inicio"
           help="Cuándo comenzó o comenzará esta rutina."
           validation="date_before:2050-01-01" 
           :value="formData.date_started || undefined"
         />
         <FormKit
           type="date"
           name="date_ended"
           label="Fecha de Término (Opcional)"
           help="Cuándo finalizó o finalizará. Requerido si archivas."
           :validation="[['optional_date_after', formData.date_started]]" 
           :validation-messages="{
             optional_date_after: 'La fecha de término no puede ser anterior a la de inicio.'
           }"
           :value="formData.date_ended || undefined" 
         />
      </div>
      
       <FormKit
        type="checkbox"
        name="is_active"
        label="Rutina Activa"
        help="Desmarca para ocultarla temporalmente sin archivarla."
      />

      <div v-if="apiError" class="p-3 bg-error-50 text-error-700 border border-error-200 rounded-lg text-sm">
        {{ apiError }}
      </div>

      <div :class="actionsClass">
        <button
          type="button"
          @click="handleCancel"
          class="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          {{ cancelText }}
        </button>
        <button
          type="submit"
          :disabled="!valid || isLoading"
          class="inline-flex items-center justify-center rounded-lg border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
        >
          <span v-if="!isLoading">{{ saveText }}</span>
          <span v-else class="flex items-center">
            <div class="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Guardando...
          </span>
        </button>
      </div>
    </div>
  </FormKit>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { PropType } from 'vue'
// Importa la interfaz detallada para los datos iniciales y la interfaz de escritura para el payload
import type { DailyRoutineDetail, RoutineWriteData } from '@/type/rutinas/rutinas' 
// Importa tipos de FormKit si necesitas interactuar con nodos

// Importa reglas de validación personalizadas si las tienes
// import '@/utils/validationRules' // Asume que aquí defines 'optional_date_after'

// === PROPS ===
const props = defineProps({
  /**
   * Datos iniciales para rellenar el formulario (modo edición).
   * Si es null o undefined, el formulario estará vacío (modo creación).
   */
  initialData: {
    type: Object as PropType<DailyRoutineDetail | null>,
    default: null
  },
  /**
   * Indica si el formulario está en proceso de envío (ej. esperando respuesta API).
   */
  isLoading: {
    type: Boolean,
    default: false
  },
  /**
   * Mensaje de error recibido de la API tras un intento de guardado.
   */
  apiError: {
    type: String as PropType<string | null>,
    default: null
  },
  /**
   * Clase CSS para el contenedor del formulario.
   */
  formClass: {
    type: String,
    default: ''
  },
  /**
   * Clase CSS para el contenedor de los botones de acción.
   */
  actionsClass: {
    type: String,
    default: 'mt-8 flex justify-end space-x-3'
  },
  /**
   * Texto para el botón de guardar/crear.
   */
  saveText: {
    type: String,
    default: 'Guardar Cambios'
  },
  /**
   * Texto para el botón de cancelar.
   */
  cancelText: {
    type: String,
    default: 'Cancelar'
  }
})

// === EMITS ===
const emit = defineEmits<{
  /**
   * Se emite cuando el formulario se envía con éxito y es válido.
   * El payload contiene los datos del formulario limpios, listos para enviar a la API.
   */
  (e: 'save', data: RoutineWriteData): void
  /**
   * Se emite cuando el usuario hace clic en el botón Cancelar.
   */
  (e: 'cancel'): void
}>()

// === FORM STATE ===
// Ref reactiva que FormKit usará para el v-model del formulario
const formData = ref<RoutineWriteData>({
  name: '',
  routine_type: '',
  description: '',
  status: 'draft', // Valor por defecto
  is_active: true, // Valor por defecto
  date_started: null, // FormKit maneja bien null para fechas
  date_ended: null,
})

// === OPTIONS FOR SELECTS === (Deberían venir de constantes o API si son dinámicas)
const routineTypeOptions = ref([
  { value: 'morning', label: 'Mañana' },
  { value: 'afternoon', label: 'Tarde' },
  { value: 'evening', label: 'Noche' },
  { value: 'hygiene', label: 'Higiene' },
  { value: 'feeding', label: 'Alimentación' },
  { value: 'play', label: 'Juego' },
  { value: 'therapy', label: 'Terapia' },
  { value: 'other', label: 'Otro' },
])

const statusOptions = ref([
  { value: 'draft', label: 'Borrador' },
  { value: 'active', label: 'Activa' },
  { value: 'paused', label: 'Pausada' },
  { value: 'archived', label: 'Archivada' },
])

// === LOGIC ===

/**
 * Rellena el formulario con los datos iniciales cuando está en modo edición.
 */
function populateForm(data: DailyRoutineDetail | null) {
  if (data) {
    formData.value = {
      name: data.name || '',
      routine_type: data.routine_type || '',
      description: data.description || '',
      status: data.status || 'draft',
      is_active: data.is_active !== undefined ? data.is_active : true, // Asegura un booleano
      // FormKit espera YYYY-MM-DD para input date
      date_started: data.date_started || null,
      date_ended: data.date_ended || null,
    }
  } else {
    // Resetea a valores por defecto si no hay datos iniciales (modo creación)
     formData.value = {
      name: '',
      routine_type: '',
      description: '',
      status: 'draft',
      is_active: true,
      date_started: null,
      date_ended: null,
    }
  }
}

/**
 * Se ejecuta cuando el formulario de FormKit es válido y se envía.
 * Emite el evento 'save' con los datos limpios.
 */
function handleSubmit() {
  // Asegurarse de que las fechas vacías se envíen como null
  const dataToSend: RoutineWriteData = {
    ...formData.value,
    date_started: formData.value.date_started || null,
    date_ended: formData.value.date_ended || null,
  };
  emit('save', dataToSend)
}

/**
 * Se ejecuta al hacer clic en el botón Cancelar.
 * Emite el evento 'cancel'.
 */
function handleCancel() {
  emit('cancel')
}

// === LIFECYCLE & WATCHERS ===

// Rellena el formulario cuando el componente se monta (si hay initialData)
onMounted(() => {
  populateForm(props.initialData)
})

// Observa cambios en initialData (si el componente se reutiliza para editar otra rutina)
watch(() => props.initialData, (newData) => {
  populateForm(newData)
  // Podrías necesitar resetear la validación de FormKit aquí si cambias los datos programáticamente
  // const node = FormKit.get('id-del-formulario') // Necesitarías asignar un ID al FormKit type="form"
  // node?.reset()
}, { deep: true }) // deep watch por si acaso

// ----- Validación Personalizada para FormKit -----
// (Asegúrate de registrar esta regla globalmente o localmente)
// Esta regla verifica que si date_ended tiene valor, sea >= date_started
// function optional_date_after(node: FormKitNode, comparisonDate: string | null | undefined) {
//   const endDate = node.value as string | null | undefined;
//   if (!endDate || !comparisonDate) {
//     return true; // Es válido si alguna fecha no está definida
//   }
//   return new Date(endDate) >= new Date(comparisonDate);
// }

</script>

<style>
/* Estilos globales de FormKit (si usas @formkit/themes/tailwindcss, 
  la mayoría del estilo ya está aplicado).
  Puedes añadir overrides aquí si es necesario.
*/
</style>