<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
    <!-- Header Section -->
    <div class="text-center mb-8 space-y-3">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4 animate-bounce-soft">
        <ClockIcon class="w-8 h-8 text-primary-600" />
      </div>
      <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
        Horarios de la Rutina
      </h3>
      <p class="text-base text-gray-600 max-w-2xl mx-auto">
        Define cuándo se realizará esta rutina. Puedes añadir múltiples horarios.
      </p>
      <div class="flex items-center justify-center gap-2 text-sm text-gray-500">
        <span class="inline-block w-1.5 h-1.5 rounded-full bg-primary-500"></span>
        <span>Paso 2 de 5</span>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Lista de Horarios Añadidos -->
      <div v-if="schedules.length > 0" class="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-primary-50 to-primary-100/50 border-b border-primary-200">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-semibold text-primary-900 flex items-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              Horarios Configurados
            </h4>
            <span class="px-3 py-1 text-xs font-semibold bg-primary-600 text-white rounded-full">
              {{ schedules.length }}
            </span>
          </div>
        </div>
        
        <TransitionGroup name="list" tag="ul" class="divide-y divide-gray-100">
          <li
            v-for="(schedule, index) in schedules"
            :key="index"
            class="p-5 hover:bg-gray-50 transition-colors duration-200 group"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 mb-2">
                  <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <ClockIcon class="w-6 h-6 text-primary-600" />
                  </div>
                  <div class="flex-1">
                    <div class="flex items-baseline gap-2">
                      <span class="text-xl font-bold text-gray-900">{{ formatTime(schedule.start_time) }}</span>
                      <span v-if="schedule.estimated_duration_minutes" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                        </svg>
                        {{ schedule.estimated_duration_minutes }} min
                      </span>
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span class="text-sm text-gray-600">{{ formatDays(schedule.days_of_week) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                @click="removeSchedule(index)"
                type="button"
                class="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-error-600 hover:bg-error-50 transition-all duration-200 group/delete"
                title="Eliminar horario"
              >
                <TrashIcon class="w-5 h-5 group-hover/delete:scale-110 transition-transform" />
              </button>
            </div>
          </li>
        </TransitionGroup>
      </div>

      <!-- Estado Vacío -->
      <div v-else class="text-center py-12 px-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-2xl animate-pulse-slow">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
          <ClockIcon class="w-8 h-8 text-blue-600" />
        </div>
        <h5 class="text-base font-semibold text-blue-900 mb-2">Sin horarios configurados</h5>
        <p class="text-sm text-blue-700 max-w-md mx-auto">
          Aún no has añadido ningún horario. Puedes añadir uno a continuación o continuar sin horarios específicos.
        </p>
      </div>

      <!-- Formulario para Añadir Horario -->
      <div class="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
          <h4 class="text-base font-semibold text-gray-900 flex items-center gap-2">
            <PlusCircleIcon class="w-5 h-5 text-primary-600" />
            Añadir Nuevo Horario
          </h4>
        </div>

        <div class="p-6">
          <FormKit
            type="form"
            #default="{ state: { valid } }"
            v-model="newScheduleData"
            :actions="false"
            form-class="space-y-6"
            @submit="addSchedule"
            id="add-schedule-form"
          >
            <!-- Hora y Duración -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="form-group">
                <FormKit
                  type="time"
                  name="start_time"
                  label="Hora de Inicio"
                  validation="required"
                  outer-class="form-field-wrapper"
                  input-class="form-input-time"
                  label-class="form-label-enhanced"
                  :validation-messages="{ required: 'La hora es obligatoria.' }"
                >
                  <template #prefix>
                    <ClockIcon class="w-5 h-5 text-gray-400" />
                  </template>
                </FormKit>
              </div>

              <div class="form-group">
                <FormKit
                  type="number"
                  name="estimated_duration_minutes"
                  label="Duración Estimada (minutos)"
                  placeholder="Ej: 30"
                  min="1"
                  step="1"
                  outer-class="form-field-wrapper"
                  input-class="form-input-enhanced"
                  label-class="form-label-enhanced"
                  help-class="form-help-text"
                  help="Opcional - Tiempo aproximado de la rutina"
                  validation="number|min:1"
                  :validation-messages="{
                    number: 'Debe ser un número válido.',
                    min: 'Mínimo 1 minuto.'
                  }"
                >
                  <template #prefix>
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </template>
                </FormKit>
              </div>
            </div>

            <!-- Días de la Semana CON MEJORAS -->
            <div class="form-group">
              <label class="block text-sm font-semibold text-gray-700 mb-3">
                Días de la Semana
              </label>

              <!-- ✨ BOTONES DE SELECCIÓN RÁPIDA -->
              <div class="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-200">
                <button
                  type="button"
                  @click="selectAllDays"
                  class="px-3 py-1.5 text-xs font-medium rounded-lg border-2 border-gray-300 text-gray-700 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200"
                >
                  📅 Todos los días
                </button>
                <button
                  type="button"
                  @click="selectWeekdays"
                  class="px-3 py-1.5 text-xs font-medium rounded-lg border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                >
                  💼 Días Laborables
                </button>
                <button
                  type="button"
                  @click="selectWeekend"
                  class="px-3 py-1.5 text-xs font-medium rounded-lg border-2 border-gray-300 text-gray-700 hover:border-purple-500 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200"
                >
                  🎉 Fines de Semana
                </button>
                <button
                  type="button"
                  @click="clearDays"
                  class="px-3 py-1.5 text-xs font-medium rounded-lg border-2 border-gray-300 text-gray-700 hover:border-red-500 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                >
                  🚫 Ninguno
                </button>
              </div>

              <!-- ✨ LAYOUT HORIZONTAL ESTILO CALENDARIO -->
              <FormKit
                type="checkbox"
                name="days_of_week"
                :options="dayOptions"
                validation="required|min:1"
                :validation-messages="{
                  required: 'Debes seleccionar al menos un día.',
                  min: 'Debes seleccionar al menos un día.'
                }"
                outer-class="days-checkbox-wrapper"
                fieldset-class="grid grid-cols-7 gap-2"
                options-class="contents"
              />

              <!-- ✨ RESUMEN DINÁMICO EN TEXTO -->
              <div v-if="newScheduleData.days_of_week.length > 0" 
                   class="mt-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
                <div class="flex items-start gap-2">
                  <svg class="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-primary-900">
                      Selección actual:
                    </p>
                    <p class="text-sm text-primary-700 mt-1">
                      {{ currentSelectionSummary }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botón Añadir -->
            <div class="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="submit"
                :disabled="!valid"
                class="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl shadow-sm hover:bg-primary-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <PlusCircleIcon class="w-5 h-5 mr-2" />
                Añadir Horario
              </button>
            </div>
          </FormKit>
        </div>
      </div>

      <!-- Información Adicional -->
      <div class="bg-primary-50 border border-primary-200 rounded-xl p-4 flex gap-3 animate-slide-in">
        <svg class="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        <div class="flex-1">
          <h4 class="text-sm font-semibold text-primary-900 mb-1">Consejo</h4>
          <p class="text-sm text-primary-800">
            Usa los botones de selección rápida para configurar fácilmente patrones comunes. Puedes configurar diferentes horarios para distintos días.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoutineWizardStore } from '@/store/rutinas/routineWizardStore'
import { storeToRefs } from 'pinia'
import type { WizardSchedule } from '@/store/rutinas/routineWizardStore'
import { ClockIcon, TrashIcon, PlusCircleIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits<{
  (e: 'update:validity', isValid: boolean): void
}>()

const wizardStore = useRoutineWizardStore()
const { schedules } = storeToRefs(wizardStore)

const newScheduleData = ref<WizardSchedule>({
  start_time: '',
  estimated_duration_minutes: null,
  days_of_week: []
})

// ✨ Opciones mejoradas con emojis diferenciados
const dayOptions = ref([
  { value: 'monday', label: 'Lu' },
  { value: 'tuesday', label: 'Ma' },
  { value: 'wednesday', label: 'Mi' },
  { value: 'thursday', label: 'Ju' },
  { value: 'friday', label: 'Vi' },
  { value: 'saturday', label: 'Sá' },
  { value: 'sunday', label: 'Do' },
])

// ✨ COMPUTED: Resumen dinámico de la selección
const currentSelectionSummary = computed(() => {
  return formatDays(newScheduleData.value.days_of_week)
})

// ✨ FUNCIONES DE SELECCIÓN RÁPIDA
function selectAllDays() {
  newScheduleData.value.days_of_week = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ]
}

function selectWeekdays() {
  newScheduleData.value.days_of_week = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday'
  ]
}

function selectWeekend() {
  newScheduleData.value.days_of_week = ['saturday', 'sunday']
}

function clearDays() {
  newScheduleData.value.days_of_week = []
}

function addSchedule() {
  const scheduleToAdd = { ...newScheduleData.value }
  schedules.value.push(scheduleToAdd)
  
  newScheduleData.value = {
    start_time: '',
    estimated_duration_minutes: null,
    days_of_week: []
  }
  
  emitValidityStatus()
}

function removeSchedule(index: number) {
  if (index >= 0 && index < schedules.value.length) {
    schedules.value.splice(index, 1)
    emitValidityStatus()
  }
}

function emitValidityStatus() {
  emit('update:validity', true)
}

function formatTime(timeString: string): string {
  if (!timeString) return 'Hora no definida'
  try {
    const [hours, minutes] = timeString.split(':')
    return `${hours}:${minutes}`
  } catch {
    return timeString
  }
}

function formatDays(days: string[]): string {
  if (!days || days.length === 0) return 'Ningún día seleccionado'
  
  const dayMap: Record<string, string> = {
    monday: 'Lunes', tuesday: 'Martes', wednesday: 'Miércoles', thursday: 'Jueves', 
    friday: 'Viernes', saturday: 'Sábado', sunday: 'Domingo'
  }
  
  const orderedDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const sortedSelectedDays = orderedDays.filter(d => days.includes(d))

  // Casos especiales
  if (sortedSelectedDays.length === 7) return 'Todos los días'
  if (sortedSelectedDays.length === 5 && 
      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].every(d => days.includes(d))) {
    return 'Lunes a Viernes (Días laborables)'
  }
  if (sortedSelectedDays.length === 2 && days.includes('saturday') && days.includes('sunday')) {
    return 'Sábado y Domingo (Fin de semana)'
  }
  
  // Detectar rangos consecutivos
  if (sortedSelectedDays.length > 2) {
    const indices = sortedSelectedDays.map(d => orderedDays.indexOf(d))
    const isConsecutive = indices.every((val, i, arr) => i === 0 || val === arr[i - 1] + 1)
    
    if (isConsecutive) {
      const first = dayMap[sortedSelectedDays[0]]
      const last = dayMap[sortedSelectedDays[sortedSelectedDays.length - 1]]
      return `${first} a ${last}`
    }
  }
  
  // Lista normal
  return sortedSelectedDays.map(day => dayMap[day] || day).join(', ')
}

onMounted(() => {
  emitValidityStatus()
})
</script>

<style scoped>
/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes bounceSoft {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes pulseSlow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

.animate-slide-in {
  animation: slideIn 0.5s ease-out;
}

.animate-bounce-soft {
  animation: bounceSoft 3s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulseSlow 3s ease-in-out infinite;
}

/* Transiciones de lista */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

.list-leave-active {
  position: absolute;
  width: 100%;
}

/* Estilos FormKit mejorados */
:deep(.form-input-enhanced),
:deep(.form-input-time) {
  @apply w-full px-4 py-3 pl-11 rounded-lg border border-gray-300 
         focus:border-primary-500 focus:ring-2 focus:ring-primary-200 
         transition-all duration-300 text-gray-900 placeholder-gray-400
         hover:border-gray-400;
}

:deep(.form-label-enhanced) {
  @apply block text-sm font-semibold text-gray-700 mb-2;
}

:deep(.form-help-text) {
  @apply text-xs text-gray-500 mt-1.5 italic;
}

:deep(.formkit-prefix) {
  @apply absolute left-3 top-[2.6rem] pointer-events-none;
}

/* ✨ CHECKBOXES ESTILO BOTÓN MEJORADOS - Layout horizontal */
:deep(.days-checkbox-wrapper .formkit-option) {
  position: relative;
}

:deep(.days-checkbox-wrapper .formkit-wrapper) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 0.5rem;
  border: 2px solid #d1d5db; /* gray-300 */
  border-radius: 0.75rem;
  transition: all 0.2s;
  cursor: pointer;
  min-height: 3.5rem;
  background-color: #ffffff;
}

:deep(.days-checkbox-wrapper .formkit-wrapper:hover) {
  border-color: #60a5fa; /* primary-400 */
  background-color: #eff6ff; /* primary-50 */
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

:deep(.days-checkbox-wrapper input[type="checkbox"]) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* ✨ ESTADO CHECKED MUY EVIDENTE */
:deep(.days-checkbox-wrapper input[type="checkbox"]:checked + .formkit-decorator + .formkit-label) {
  color: #ffffff; /* Texto blanco */
  font-weight: 700;
}

:deep(.days-checkbox-wrapper input[type="checkbox"]:checked ~ .formkit-wrapper),
:deep(.days-checkbox-wrapper .formkit-option[data-checked] .formkit-wrapper) {
  border-color: #2563eb; /* primary-600 */
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); /* primary-600 gradient */
  box-shadow: 0 4px 6px -1px rgb(37 99 235 / 0.3);
  transform: translateY(-2px) scale(1.05);
}

:deep(.days-checkbox-wrapper .formkit-decorator) {
  display: none;
}

:deep(.days-checkbox-wrapper .formkit-label) {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151; /* gray-700 */
  text-align: center;
  width: 100%;
  transition: all 0.2s;
  user-select: none;
}

:deep(.days-checkbox-wrapper input[type="checkbox"]:checked ~ .formkit-wrapper .formkit-label) {
  color: #ffffff !important;
}

/* ✨ AGRUPACIÓN VISUAL: Separador entre viernes y sábado */
:deep(.days-checkbox-wrapper .formkit-fieldset .formkit-option:nth-child(6)) {
  margin-left: 0.5rem;
  position: relative;
}

:deep(.days-checkbox-wrapper .formkit-fieldset .formkit-option:nth-child(6)::before) {
  content: '';
  position: absolute;
  left: -0.375rem;
  top: 10%;
  bottom: 10%;
  width: 2px;
  background: linear-gradient(to bottom, transparent, #d1d5db 20%, #d1d5db 80%, transparent);
}

/* Animación de error */
:deep(.formkit-outer[data-invalid]) .form-input-enhanced,
:deep(.formkit-outer[data-invalid]) .form-input-time {
  @apply border-error-400 focus:border-error-500 focus:ring-error-200;
  animation: shake 0.4s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}

:deep(.formkit-message) {
  @apply text-sm text-error-600 flex items-center gap-1.5 mt-1;
}

/* Responsive: Ajustar grid en móviles */
@media (max-width: 640px) {
  :deep(.form-input-enhanced),
  :deep(.form-input-time) {
    @apply py-2.5 text-sm;
  }
  
  :deep(.days-checkbox-wrapper .formkit-fieldset) {
    grid-template-columns: repeat(4, 1fr) !important;
  }
  
  /* Mover separador en móvil */
  :deep(.days-checkbox-wrapper .formkit-fieldset .formkit-option:nth-child(6)::before) {
    display: none;
  }
  
  :deep(.days-checkbox-wrapper .formkit-fieldset .formkit-option:nth-child(5)) {
    position: relative;
  }
  
  :deep(.days-checkbox-wrapper .formkit-fieldset .formkit-option:nth-child(5)::after) {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -0.25rem;
    height: 2px;
    background: linear-gradient(to right, transparent, #d1d5db 20%, #d1d5db 80%, transparent);
  }
}
</style>