<template>
  <BaseModal
    :show="show"
    :title="isEditing ? 'Editar Habilidad Social' : 'Registrar Habilidad Social'"
    size="lg"
    @update:show="closeModal"
  >
    <div class="p-1">
      <div v-if="isRecovered" class="mb-4 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm flex items-center justify-between border border-blue-100">
        <span class="flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Hemos recuperado tu avance no guardado.
        </span>
        <button @click="discardDraft" class="text-xs font-semibold hover:underline text-blue-800">
          Descartar y empezar de cero
        </button>
      </div>

      <FormKit
        type="form"
        id="socialSkillForm"
        v-model="formData"
        :actions="false"
        @submit="handleSubmit"
        :config="{ validationVisibility: 'dirty' }"
      >
        <div class="space-y-4">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="date"
              name="date"
              label="Fecha de Observación"
              validation="required"
              :validation-messages="{ required: 'La fecha es obligatoria' }"
              inner-class="border-gray-300 focus:ring-primary-500 focus:border-primary-500"
            />

            <FormKit
              type="select"
              name="skill_category"
              label="Habilidad / Categoría"
              placeholder="Selecciona una habilidad"
              :options="categoryOptions"
              validation="required"
              inner-class="border-gray-300 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="select"
              name="level"
              label="Nivel de Dominio"
              :options="levelOptions"
              validation="required"
            />
            
            <FormKit
              type="select"
              name="interaction_partner"
              label="Interactuó con"
              :options="partnerOptions"
              validation="required"
            />
          </div>

          <FormKit
            type="textarea"
            name="description"
            label="Descripción de la interacción"
            placeholder="Describe brevemente qué ocurrió..."
            validation="required|length:5,500"
            :validation-messages="{
              required: 'La descripción es obligatoria',
              length: 'Mínimo 5 caracteres'
            }"
            rows="3"
            inner-class="border-gray-300 focus:ring-primary-500"
          />

          <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="checkbox"
              name="initiated_by_child"
              label="¿El niño inició la interacción?"
              decorator-icon="check"
            />
            
            <FormKit
              type="checkbox"
              name="needed_prompting"
              label="¿Necesitó ayuda (prompting)?"
              decorator-icon="check"
            />

            <FormKit
              type="checkbox"
              name="was_successful"
              label="¿Fue exitosa?"
              decorator-icon="check"
            />
          </div>

          <div v-if="isPeerInteraction" class="bg-blue-50 p-4 rounded-lg border border-blue-200 transition-all">
            <FormKit
              type="number"
              name="duration_minutes"
              label="Duración (minutos)"
              help="Requerido para interacciones con pares"
              validation="required|min:1"
              min="1"
              inner-class="bg-white"
            />
          </div>

          <div v-if="formData.was_successful === false" class="bg-red-50 p-4 rounded-lg border border-red-200 transition-all">
             <FormKit
              type="textarea"
              name="social_context"
              label="Contexto / Motivo del fallo"
              validation="required"
              placeholder="Explica por qué no fue exitosa..."
              inner-class="bg-white border-red-300 focus:border-red-500 focus:ring-red-500"
              rows="2"
            />
          </div>
        </div>
      </FormKit>
    </div>

    <template #footer>
      <div class="flex items-center justify-between w-full">
        <div class="text-xs text-gray-400 flex items-center gap-1 italic">
          <template v-if="hasUnsavedChanges">
             <span class="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
             Guardando borrador...
          </template>
          <template v-else-if="lastSaveTime">
             <span class="w-2 h-2 bg-green-400 rounded-full"></span>
             Borrador guardado
          </template>
        </div>

        <div class="flex gap-3">
          <button 
            type="button" 
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            @click="closeModal"
          >
            Cancelar
          </button>
          
          <button 
            type="submit"
            form="socialSkillForm" 
            class="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"></svg>
              Guardando...
            </span>
            <span v-else>{{ isEditing ? 'Actualizar Registro' : 'Guardar Registro' }}</span>
          </button>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { reset } from '@formkit/core';
import BaseModal from '@/components/modal/BaseModal.vue';
import { useAlertStore } from '@/store/alertStore';
import socialSkillService from '@/services/socialSkillService';
import type { SocialSkill } from '@/type/socialSkill';
import { useFormDraft } from '@/composables/useFormDraft'; // Importar persistencia

// PROPS & EMITS
const props = defineProps<{
  show: boolean;
  childId: number;
  editData?: SocialSkill | null;
}>();

const emit = defineEmits(['update:show', 'success']);

// ESTADO
const isSubmitting = ref(false);
const isRecovered = ref(false);
const alertStore = useAlertStore();

// Generar ID único para el borrador
const draftFormId = computed(() => {
    // Diferente ID para crear vs editar (si editas ID 5, el borrador es específico para ese registro)
    const mode = props.editData?.id ? `edit-${props.editData.id}` : 'new';
    return `social-skill-${props.childId}-${mode}`;
});

// Configuración de persistencia
const { 
  formData, 
  recoverDraft, 
  clearAllDrafts, 
  hasUnsavedChanges, 
  lastSaveTime 
} = useFormDraft({
  formId: draftFormId.value,
  autoSave: true,       // Activar autoguardado
  autoSaveDelay: 1000,  // Guardar 1s después de escribir
  draftExpiryDays: 3    // Duración de 3 días
});

// DATA INICIAL POR DEFECTO
const defaultForm: Partial<SocialSkill> = {
  date: new Date().toISOString().split('T')[0],
  skill_category: 'eye_contact',
  level: 'beginner',
  interaction_partner: 'therapist',
  initiated_by_child: false,
  needed_prompting: true,
  was_successful: true,
  duration_minutes: 0,
  description: '',
  social_context: ''
};

// COMPUTED
const isEditing = computed(() => !!props.editData && !!props.editData.id);

const isPeerInteraction = computed(() => {
  return ['peer', 'group'].includes(formData.value.interaction_partner || '');
});

// WATCH: Lógica de carga inteligente y recuperación
watch(() => props.show, async (isOpen) => {
  if (isOpen) {
    await nextTick();
    isRecovered.value = false;

    if (props.editData) {
      // --- MODO EDICIÓN ---
      // Prioridad: Datos del servidor > Borrador local
      // (Podríamos priorizar borrador si es más reciente, pero en edición suele ser mejor ver lo real)
      
      const dataToLoad = { ...props.editData };
      if (dataToLoad.date && dataToLoad.date.includes('T')) {
        dataToLoad.date = dataToLoad.date.split('T')[0];
      }
      
      // Asignar al estado reactivo del composable
      Object.assign(formData.value, dataToLoad);
      reset('socialSkillForm', dataToLoad);

    } else {
      // --- MODO CREACIÓN ---
      // Intentar recuperar borrador
      const recovered = await recoverDraft();
      
      if (recovered) {
        console.log("📂 Borrador recuperado");
        isRecovered.value = true;
        // recoverDraft ya actualiza formData.value
        reset('socialSkillForm', formData.value);
      } else {
        // Si no hay borrador, cargar default
        const newData = { ...defaultForm, date: new Date().toISOString().split('T')[0] };
        Object.assign(formData.value, newData);
        reset('socialSkillForm', newData);
      }
    }
  }
}, { immediate: true });

// MÉTODOS
const discardDraft = () => {
    clearAllDrafts(); // Borrar del storage
    const newData = { ...defaultForm, date: new Date().toISOString().split('T')[0] };
    Object.assign(formData.value, newData); // Limpiar estado
    reset('socialSkillForm', newData); // Limpiar inputs
    isRecovered.value = false;
};

const closeModal = () => {
  emit('update:show', false);
};

const handleSubmit = async (data: any) => {
  isSubmitting.value = true;
  
  try {
    const payload = { ...data };
    payload.child = props.childId;
    
    if (!isPeerInteraction.value) {
      payload.duration_minutes = 0;
    }

    if (isEditing.value && props.editData?.id) {
        await socialSkillService.update(props.childId, props.editData.id, payload);
        alertStore.success('Actualizado', 'El registro se actualizó correctamente.');
    } else {
        await socialSkillService.create(props.childId, payload);
        alertStore.success('Creado', 'Registro guardado exitosamente.');
    }
    
    // ✅ Limpiar borrador al guardar exitosamente
    clearAllDrafts();
    
    emit('success');
    closeModal();
    
  } catch (error: any) {
    const msg = error.response?.data?.detail || 'Ocurrió un error al guardar.';
    alertStore.error('Error', msg);
  } finally {
    isSubmitting.value = false;
  }
};

// OPCIONES (Coinciden con Backend)
const categoryOptions = [
  { value: 'eye_contact', label: 'Contacto Visual' },
  { value: 'turn_taking', label: 'Toma de Turnos' },
  { value: 'sharing', label: 'Compartir' },
  { value: 'greeting', label: 'Saludar' },
  { value: 'requesting', label: 'Pedir ayuda/objetos' },
  { value: 'joint_attention', label: 'Atención Conjunta' },
  { value: 'emotion_recognition', label: 'Reconocer Emociones' },
  { value: 'empathy', label: 'Empatía' },
  { value: 'conversation', label: 'Conversación' },
  { value: 'play_cooperative', label: 'Juego Cooperativo' },
  { value: 'conflict_resolution', label: 'Resolución Conflictos' },
  { value: 'friendship', label: 'Mantener Amistad' },
  { value: 'other', label: 'Otro' }
];

const levelOptions = [
  { value: 'beginner', label: 'Inicial' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' }
];

const partnerOptions = [
  { value: 'therapist', label: 'Terapeuta' },
  { value: 'peer', label: 'Par (Otro niño)' },
  { value: 'group', label: 'Grupo' },
  { value: 'parent', label: 'Padres' },
  { value: 'teacher', label: 'Profesor' },
  { value: 'other_adult', label: 'Otro adulto' }
];
</script>