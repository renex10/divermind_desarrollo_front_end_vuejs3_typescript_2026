<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
    <div class="text-center mb-8 space-y-3">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4 animate-bounce-soft">
        <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
        Información Básica
      </h3>
      <p class="text-base text-gray-600 max-w-2xl mx-auto">
        Comencemos definiendo los detalles principales de tu rutina
      </p>
      <div class="flex items-center justify-center gap-2 text-sm text-gray-500">
        <span class="inline-block w-1.5 h-1.5 rounded-full bg-primary-500"></span>
        <span>Paso 1 de 5</span>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
      <div class="p-6 sm:p-8">
        <FormKit
          type="form"
          v-model="wizardStore.basicInfo"
          id="wizard-step-1-form"
          :actions="false"
          form-class="space-y-8"
          @input="checkValidity" >
          <div class="form-group">
            <FormKit
              type="text"
              name="name"
              label="Nombre de la Rutina"
              placeholder="Ej: Rutina de la mañana (ir al colegio)"
              validation="required|length:4,100"
              outer-class="form-field-wrapper"
              input-class="form-input-enhanced"
              label-class="form-label-enhanced"
              help-class="form-help-text"
              :validation-messages="{
                required: 'El nombre es obligatorio.',
                length: 'El nombre debe tener entre 4 y 100 caracteres.',
              }"
            >
              <template #prefix>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </template>
            </FormKit>
          </div>

          <div class="form-group">
            <FormKit
              type="select"
              name="routine_type"
              label="Tipo de Rutina"
              placeholder="Selecciona un tipo"
              validation="required"
              outer-class="form-field-wrapper"
              input-class="form-select-enhanced"
              label-class="form-label-enhanced"
              :options="routineTypeOptions"
              :validation-messages="{
                required: 'Debes seleccionar un tipo de rutina.',
              }"
            >
              <template #prefix>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </template>
            </FormKit>
          </div>

          <div class="form-group">
            <FormKit
              type="textarea"
              name="description"
              label="Descripción"
              placeholder="Describe el objetivo principal o los detalles clave de esta rutina..."
              :rows="4"
              validation="length:0,500"
              outer-class="form-field-wrapper"
              input-class="form-textarea-enhanced"
              label-class="form-label-enhanced"
              help-class="form-help-text"
              help="Opcional - Máximo 500 caracteres"
              :validation-messages="{
                length: 'La descripción no puede exceder los 500 caracteres.',
              }"
            />
            <div class="mt-2 text-right text-xs text-gray-500" v-if="wizardStore.basicInfo.description">
              {{ wizardStore.basicInfo.description?.length || 0 }} / 500 caracteres
            </div>
          </div>

          <div class="form-group">
            <FormKit
              type="select"
              name="status"
              label="Estado Inicial"
              help="Puedes comenzar como borrador y activarla cuando esté lista"
              outer-class="form-field-wrapper"
              input-class="form-select-enhanced"
              label-class="form-label-enhanced"
              help-class="form-help-text"
              :options="statusOptions"
              validation="required"
            >
              <template #prefix>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </template>
            </FormKit>
          </div>

          <div class="bg-primary-50 border border-primary-200 rounded-xl p-4 flex gap-3 animate-slide-in">
            <svg class="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <div class="flex-1">
              <h4 class="text-sm font-semibold text-primary-900 mb-1">Consejo</h4>
              <p class="text-sm text-primary-800">
                Te recomendamos usar nombres descriptivos y específicos para identificar fácilmente cada rutina.
              </p>
            </div>
          </div>
        </FormKit>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoutineWizardStore } from '@/store/rutinas/routineWizardStore'

// === EMITS ===
const emit = defineEmits<{
  (e: 'update:validity', isValid: boolean): void
}>()

// === STORE ===
const wizardStore = useRoutineWizardStore()

// === DATOS ===
const routineTypeOptions = ref([
  { value: 'morning', label: '☀️ Mañana', attrs: { 'data-icon': '☀️' } },
  { value: 'breakfast', label: '🍳 Desayuno' },
  { value: 'school_prep', label: '🎒 Preparación Escuela' },
  { value: 'after_school', label: '🏠 Después de Escuela' },
  { value: 'homework', label: '📚 Tareas' },
  { value: 'dinner', label: '🍽️ Cena' },
  { value: 'bath', label: '🛁 Baño' },
  { value: 'bedtime', label: '🌙 Dormir' },
  { value: 'therapy_session', label: '💆 Terapia' },
  { value: 'weekend', label: '🎉 Fin de Semana' },
  { value: 'transition', label: '🔄 Transición' },
  { value: 'other', label: '📋 Otro' },
])

const statusOptions = ref([
  { value: 'draft', label: '📝 Borrador (Draft)', help: 'Guarda tu progreso sin activar' },
  { value: 'active', label: '✅ Activa', help: 'La rutina estará disponible inmediatamente' },
])

// === VALIDACIÓN (Lógica Corregida) ===

/**
 * Función que se llama cada vez que hay un cambio en el formulario FormKit (@input).
 * Verifica la validez usando el getter del store y emite el resultado.
 */
function checkValidity() {
  const isValid = wizardStore.isStep1Valid // Usa el getter del store
  emit('update:validity', isValid)
}

// Emitir estado inicial al montar
onMounted(() => {
  // Esperar un tick por si acaso FormKit no ha actualizado el v-model inicial
  setTimeout(() => {
    checkValidity()
  }, 0)
})

</script>

<style scoped>
/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes bounceSoft {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

.animate-bounce-soft {
  animation: bounceSoft 2s ease-in-out infinite;
}

/* Estilos del formulario */
.form-group {
  margin-bottom: 1.5rem;
}

:deep(.form-input-enhanced),
:deep(.form-select-enhanced),
:deep(.form-textarea-enhanced) {
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  background-color: #ffffff;
}

:deep(.form-input-enhanced):focus,
:deep(.form-select-enhanced):focus,
:deep(.form-textarea-enhanced):focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

:deep(.form-label-enhanced) {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
  font-size: 0.9375rem;
  display: block;
}

:deep(.form-help-text) {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

:deep(.form-field-wrapper) {
  margin-bottom: 0;
}

:deep(.formkit-prefix) {
  display: flex;
  align-items: center;
  padding-left: 0.75rem;
  pointer-events: none;
}

:deep(.formkit-messages) {
  margin-top: 0.5rem;
  list-style: none;
  padding: 0;
}

:deep(.formkit-message) {
  color: #ef4444;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.25rem;
  animation: slideIn 0.2s ease-out;
}

:deep(.formkit-message)::before {
  content: "⚠️";
  font-size: 0.875rem;
}

:deep(.formkit-outer[data-invalid]) .form-input-enhanced,
:deep(.formkit-outer[data-invalid]) .form-select-enhanced,
:deep(.formkit-outer[data-invalid]) .form-textarea-enhanced {
  border-color: #ef4444;
  background-color: #fef2f2;
  animation: shake 0.3s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

:deep(.formkit-outer[data-complete]) .form-input-enhanced,
:deep(.formkit-outer[data-complete]) .form-select-enhanced {
  border-color: #10b981;
}

/* Responsive */
@media (max-width: 640px) {
  :deep(.form-input-enhanced),
  :deep(.form-select-enhanced),
  :deep(.form-textarea-enhanced) {
    font-size: 16px; /* Evita zoom en iOS */
  }
}
</style>