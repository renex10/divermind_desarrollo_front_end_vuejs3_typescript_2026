<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
    <!-- Header Section -->
    <div class="text-center mb-8 space-y-3">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-100 mb-4 animate-bounce-soft">
        <svg class="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
        Revisión Final
      </h3>
      <p class="text-base text-gray-600 max-w-2xl mx-auto">
        Verifica que toda la información esté correcta antes de guardar
      </p>
      <div class="flex items-center justify-center gap-2 text-sm text-gray-500">
        <span class="inline-block w-1.5 h-1.5 rounded-full bg-success-500"></span>
        <span>Paso 5 de 5 - ¡Último paso!</span>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Información Básica -->
      <section class="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-blue-200">
          <h4 class="text-base font-semibold text-blue-900 flex items-center gap-2">
            <InformationCircleIcon class="w-5 h-5" />
            Información Básica
          </h4>
        </div>
        <div class="p-6">
          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="review-item">
              <dt class="review-label">Nombre</dt>
              <dd class="review-value">{{ basicInfo.name }}</dd>
            </div>
            <div class="review-item">
              <dt class="review-label">Tipo</dt>
              <dd class="review-value">{{ getRoutineTypeLabel(basicInfo.routine_type) }}</dd>
            </div>
            <div class="review-item sm:col-span-2">
              <dt class="review-label">Descripción</dt>
              <dd class="review-value whitespace-pre-wrap">{{ basicInfo.description || 'Sin descripción' }}</dd>
            </div>
            <div class="review-item">
              <dt class="review-label">Estado Inicial</dt>
              <dd class="review-value">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                      :class="basicInfo.status === 'active' ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'">
                  {{ basicInfo.status === 'active' ? '✅ Activa' : '📝 Borrador' }}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <!-- Horarios -->
      <section class="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-primary-50 to-primary-100/50 border-b border-primary-200">
          <div class="flex items-center justify-between">
            <h4 class="text-base font-semibold text-primary-900 flex items-center gap-2">
              <ClockIcon class="w-5 h-5" />
              Horarios
            </h4>
            <span class="px-3 py-1 text-xs font-semibold bg-primary-600 text-white rounded-full">
              {{ schedules.length }}
            </span>
          </div>
        </div>
        <div class="p-6">
          <ul v-if="schedules.length > 0" class="space-y-3">
            <li v-for="(schedule, index) in schedules" :key="index" 
                class="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-primary-300 transition-colors">
              <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <ClockIcon class="w-5 h-5 text-primary-600" />
              </div>
              <div class="flex-1">
                <div class="flex items-baseline gap-2">
                  <span class="text-lg font-bold text-gray-900">{{ formatTime(schedule.start_time) }}</span>
                  <span v-if="schedule.estimated_duration_minutes" 
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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
            </li>
          </ul>
          <div v-else class="text-center py-8 text-gray-500">
            <ClockIcon class="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p class="text-sm">No se definieron horarios específicos</p>
          </div>
        </div>
      </section>

      <!-- Pasos -->
      <section class="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100/50 border-b border-purple-200">
          <div class="flex items-center justify-between">
            <h4 class="text-base font-semibold text-purple-900 flex items-center gap-2">
              <ClipboardDocumentListIcon class="w-5 h-5" />
              Pasos de la Rutina
            </h4>
            <span class="px-3 py-1 text-xs font-semibold bg-purple-600 text-white rounded-full">
              {{ steps.length }}
            </span>
          </div>
        </div>
        <div class="p-6">
          <ol v-if="steps.length > 0" class="space-y-3">
            <li v-for="(step, index) in steps" :key="index" 
                class="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <span class="text-sm font-bold text-purple-700">{{ index + 1 }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <h5 class="font-semibold text-gray-900 mb-1">{{ step.action }}</h5>
                <p v-if="step.description" class="text-sm text-gray-600 mb-2">{{ step.description }}</p>
                <div class="flex flex-wrap gap-2">
                  <span v-if="step.estimated_minutes" 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <ClockIcon class="w-3 h-3 mr-1" />
                    {{ step.estimated_minutes }} min
                  </span>
                  <span v-if="step.requires_supervision" 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    <UserGroupIcon class="w-3 h-3 mr-1" />
                    Supervisión
                  </span>
                  <span v-if="step.is_skippable" 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <ForwardIcon class="w-3 h-3 mr-1" />
                    Opcional
                  </span>
                  <span v-if="step.visual_support" 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <PhotoIcon class="w-3 h-3 mr-1" />
                    Visual
                  </span>
                </div>
              </div>
            </li>
          </ol>
          <div v-else class="text-center py-8">
            <svg class="w-12 h-12 mx-auto mb-2 text-error-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p class="text-sm text-error-600 font-semibold">¡No se han definido pasos para la rutina!</p>
            <p class="text-xs text-gray-500 mt-1">Necesitas al menos un paso para continuar</p>
          </div>
        </div>
      </section>

      <!-- Estrategias -->
      <section class="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-green-50 to-green-100/50 border-b border-green-200">
          <div class="flex items-center justify-between">
            <h4 class="text-base font-semibold text-green-900 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Estrategias de Apoyo
            </h4>
            <span class="px-3 py-1 text-xs font-semibold bg-green-600 text-white rounded-full">
              {{ strategies.length }}
            </span>
          </div>
        </div>
        <div class="p-6">
          <ul v-if="strategies.length > 0" class="space-y-3">
            <li v-for="(strategy, index) in strategies" :key="index" 
                class="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2 mb-1">
                  <h5 class="font-semibold text-gray-900">{{ getStrategyTypeLabel(strategy.strategy_type) }}</h5>
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {{ strategy.strategy_type }}
                  </span>
                </div>
                <p v-if="strategy.description" class="text-sm text-gray-600 mb-2">{{ strategy.description }}</p>
                <div v-if="strategy.related_step_order !== null" class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span class="text-xs text-gray-500">Vinculada al paso {{ strategy.related_step_order }}</span>
                </div>
              </div>
            </li>
          </ul>
          <div v-else class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p class="text-sm">No se definieron estrategias de apoyo</p>
          </div>
        </div>
      </section>

      <!-- Mensaje de Confirmación -->
      <div class="bg-gradient-to-r from-success-50 to-green-50 border-2 border-success-300 rounded-2xl p-6 flex gap-4 animate-slide-in">
        <div class="flex-shrink-0">
          <svg class="w-8 h-8 text-success-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="flex-1">
          <h4 class="text-base font-semibold text-success-900 mb-2">¿Todo está correcto?</h4>
          <p class="text-sm text-success-800 mb-3">
            Revisa cuidadosamente toda la información. Una vez guardada, podrás editarla desde el panel de rutinas.
          </p>
          <p class="text-xs text-success-700 italic">
            💡 Consejo: Asegúrate de que los pasos estén en el orden correcto y que las estrategias sean apropiadas.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoutineWizardStore } from '@/store/rutinas/routineWizardStore'
import { storeToRefs } from 'pinia'
import {
  InformationCircleIcon,
  ClockIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ForwardIcon,
  PhotoIcon
} from '@heroicons/vue/24/outline'

const emit = defineEmits<{
  (e: 'update:validity', isValid: boolean): void
}>()

const wizardStore = useRoutineWizardStore()
const { basicInfo, schedules, steps, strategies } = storeToRefs(wizardStore)

function formatTime(timeString: string | null | undefined): string {
  if (!timeString) return '-'
  try {
    const [hours, minutes] = timeString.split(':')
    return `${hours}:${minutes}`
  } catch { return timeString }
}

function formatDays(days: string[] | null | undefined): string {
  if (!days || days.length === 0) return 'Sin días asignados'
  const dayMap: Record<string, string> = {
    monday: 'Lun', tuesday: 'Mar', wednesday: 'Mié', thursday: 'Jue',
    friday: 'Vie', saturday: 'Sáb', sunday: 'Dom'
  }
  const orderedDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const sortedSelectedDays = orderedDays.filter(d => days.includes(d))

  if (sortedSelectedDays.length === 7) return 'Todos los días'
  if (sortedSelectedDays.length === 5 && !days.includes('saturday') && !days.includes('sunday')) return 'Lunes a Viernes'
  if (sortedSelectedDays.length === 2 && days.includes('saturday') && days.includes('sunday')) return 'Fines de semana'

  return sortedSelectedDays.map(day => dayMap[day] || day).join(', ')
}

function getRoutineTypeLabel(typeValue: string | null): string {
  const options = [
    { value: 'morning', label: '☀️ Mañana' },
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
  ]
  return options.find(opt => opt.value === typeValue)?.label || typeValue || '-'
}

function getStrategyTypeLabel(type: string): string {
  const options = [
    { value: 'positive_reinforcement', label: 'Refuerzo Positivo' },
    { value: 'visual_reminder', label: 'Recordatorio Visual' },
    { value: 'timer_alarm', label: 'Temporizador/Alarma' },
    { value: 'sensory_adaptation', label: 'Adaptación Sensorial' },
    { value: 'verbal_prompt', label: 'Indicación Verbal' },
    { value: 'physical_assistance', label: 'Asistencia Física' },
    { value: 'choice_offering', label: 'Ofrecimiento de Opciones' },
    { value: 'break_time', label: 'Tiempo de Descanso' },
    { value: 'social_story', label: 'Historia Social' },
    { value: 'token_economy', label: 'Economía de Fichas' },
    { value: 'other', label: 'Otra' },
  ]
  return options.find(opt => opt.value === type)?.label || type
}

onMounted(() => {
  const isOverallValid = wizardStore.isStep3Valid
  emit('update:validity', isOverallValid)
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

.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

.animate-slide-in {
  animation: slideIn 0.5s ease-out;
}

.animate-bounce-soft {
  animation: bounceSoft 3s ease-in-out infinite;
}

/* Review items */
.review-item {
  @apply space-y-1;
}

.review-label {
  @apply text-xs font-semibold text-gray-500 uppercase tracking-wide;
}

.review-value {
  @apply text-base text-gray-900 font-medium;
}

/* Responsive */
@media (max-width: 640px) {
  .review-value {
    @apply text-sm;
  }
}
</style>