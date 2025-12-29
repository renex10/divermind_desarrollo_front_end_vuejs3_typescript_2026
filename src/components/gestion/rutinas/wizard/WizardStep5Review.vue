<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
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
        Verifica que toda la información esté correcta antes de guardar la rutina de <span class="font-bold text-primary-600">{{ childName }}</span>.
      </p>
      <div class="flex items-center justify-center gap-2 text-sm text-gray-500">
        <span class="inline-block w-1.5 h-1.5 rounded-full bg-success-500"></span>
        <span>Paso 5 de 5 - ¡Todo listo para comenzar!</span>
      </div>
    </div>

    <div class="space-y-6">
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
              <dt class="review-label">Nombre de la Rutina</dt>
              <dd class="review-value">{{ basicInfo.name }}</dd>
            </div>
            <div class="review-item">
              <dt class="review-label">Tipo</dt>
              <dd class="review-value">{{ getRoutineTypeLabel(basicInfo.routine_type) }}</dd>
            </div>
            <div class="review-item sm:col-span-2">
              <dt class="review-label">Descripción o Propósito</dt>
              <dd class="review-value whitespace-pre-wrap">{{ basicInfo.description || 'Sin descripción adicional' }}</dd>
            </div>
            <div class="review-item">
              <dt class="review-label">Estado al crear</dt>
              <dd class="review-value">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                      :class="basicInfo.status === 'active' ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'">
                  {{ basicInfo.status === 'active' ? '✅ Activa e Inmediata' : '📝 Guardar como Borrador' }}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section class="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-primary-50 to-primary-100/50 border-b border-primary-200">
          <div class="flex items-center justify-between">
            <h4 class="text-base font-semibold text-primary-900 flex items-center gap-2">
              <ClockIcon class="w-5 h-5" />
              Horarios Programados
            </h4>
            <span class="px-3 py-1 text-xs font-bold bg-primary-600 text-white rounded-full">
              {{ schedules.length }} {{ schedules.length === 1 ? 'Horario' : 'Horarios' }}
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
                  <span class="text-lg font-black text-gray-900">{{ formatTime(schedule.start_time) }}</span>
                  <span v-if="schedule.estimated_duration_minutes" 
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                    {{ schedule.estimated_duration_minutes }} min
                  </span>
                </div>
                <div class="flex items-center gap-2 mt-1">
                  <CalendarIcon class="w-4 h-4 text-gray-400" />
                  <span class="text-sm text-gray-600 font-medium">{{ formatDays(schedule.days_of_week) }}</span>
                </div>
              </div>
            </li>
          </ul>
          <div v-else class="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <ClockIcon class="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p class="text-sm font-medium">No se definieron horarios específicos</p>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100/50 border-b border-purple-200">
          <div class="flex items-center justify-between">
            <h4 class="text-base font-semibold text-purple-900 flex items-center gap-2">
              <ClipboardDocumentListIcon class="w-5 h-5" />
              Pasos de la Rutina
            </h4>
            <span class="px-3 py-1 text-xs font-bold bg-purple-600 text-white rounded-full">
              {{ steps.length }} Pasos
            </span>
          </div>
        </div>
        <div class="p-6">
          <ol v-if="steps.length > 0" class="space-y-4">
            <li v-for="(step, index) in steps" :key="index" 
                class="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold shadow-sm">
                {{ index + 1 }}
              </div>
              <div class="flex-1 min-w-0">
                <h5 class="font-bold text-gray-900 mb-0.5">{{ step.action }}</h5>
                <p v-if="step.description" class="text-sm text-gray-500 mb-2 leading-relaxed">{{ step.description }}</p>
                <div class="flex flex-wrap gap-2">
                  <span v-if="step.estimated_minutes" class="badge-review bg-blue-50 text-blue-700">
                    <ClockIcon class="w-3 h-3 mr-1" /> {{ step.estimated_minutes }} min
                  </span>
                  <span v-if="step.requires_supervision" class="badge-review bg-amber-50 text-amber-700">
                    <UserGroupIcon class="w-3 h-3 mr-1" /> Supervisión
                  </span>
                  <span v-if="step.visual_support || step.visual_support_description" class="badge-review bg-purple-50 text-purple-700">
                    <PhotoIcon class="w-3 h-3 mr-1" /> Apoyo Visual
                  </span>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section class="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-green-50 to-green-100/50 border-b border-green-200">
          <h4 class="text-base font-semibold text-green-900 flex items-center gap-2">
            <LightBulbIcon class="w-5 h-5" />
            Configuración de Estrategias
          </h4>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="review-item">
              <dt class="review-label">Nivel de Flexibilidad</dt>
              <dd class="review-value text-primary-700">
                {{ getFlexibilityLabel(strategiesConfig.flexibility_level) }}
              </dd>
            </div>
            <div class="review-item">
              <dt class="review-label">Método de Aviso</dt>
              <dd class="review-value">
                {{ getWarningMethodLabel(strategiesConfig.warning_method) }}
              </dd>
            </div>
            <div class="review-item" v-if="strategiesConfig.visual_supports_needed">
              <dt class="review-label">Tipo de Apoyo Visual</dt>
              <dd class="review-value">
                {{ getVisualTypeLabel(strategiesConfig.visual_support_type) }}
              </dd>
            </div>
            <div class="review-item sm:col-span-2" v-if="strategiesConfig.change_tolerance_notes">
              <dt class="review-label">Notas sobre Tolerancia al Cambio</dt>
              <dd class="review-value text-sm font-normal text-gray-600 bg-white p-3 rounded-lg border border-gray-100 italic">
                "{{ strategiesConfig.change_tolerance_notes }}"
              </dd>
            </div>
          </div>
        </div>
      </section>

      <div class="bg-gradient-to-r from-success-50 to-green-50 border-2 border-success-300 rounded-3xl p-6 flex gap-4 animate-slide-in shadow-lg shadow-success-100">
        <div class="flex-shrink-0">
          <CheckCircleIcon class="w-10 h-10 text-success-600" />
        </div>
        <div class="flex-1">
          <h4 class="text-lg font-black text-success-900 mb-1">¿Todo listo para guardar?</h4>
          <p class="text-sm text-success-800 font-medium mb-2">
            Al finalizar, la rutina se guardará en la nube y estará disponible inmediatamente en el panel de control de {{ childName }}.
          </p>
          <p class="text-xs text-success-700 italic flex items-center gap-1">
            <SparklesIcon class="w-3 h-3" /> Tip: Podrás editar cualquier detalle más tarde desde la biblioteca de rutinas.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoutineWizardStore } from '@/store/rutinas/routineWizardStore'
import { storeToRefs } from 'pinia'
import { useNinoActivoStore } from '@/store/ninoActivoStore'
import {
  InformationCircleIcon, ClockIcon, ClipboardDocumentListIcon,
  UserGroupIcon, PhotoIcon, LightBulbIcon,
  CalendarIcon, CheckCircleIcon, SparklesIcon
} from '@heroicons/vue/24/outline'

const emit = defineEmits<{
  (e: 'update:validity', isValid: boolean): void
}>()

const wizardStore = useRoutineWizardStore()
const ninoStore = useNinoActivoStore()

const { basicInfo, schedules, steps, strategiesConfig } = storeToRefs(wizardStore)
const childName = computed(() => {
  if (ninoStore.perfil?.header) {
    const { first_name, last_name } = ninoStore.perfil.header
    return `${first_name} ${last_name}`.trim() || 'el niño'
  }
  return 'el niño'
})

// FORMATEADORES DE DATOS
function formatTime(time: string | null): string {
  if (!time) return '-'
  return time.substring(0, 5) // Muestra HH:mm
}

function formatDays(days: string[]): string {
  if (!days || days.length === 0) return 'Días no definidos'
  const map: Record<string, string> = {
    monday: 'Lun', tuesday: 'Mar', wednesday: 'Mié', 
    thursday: 'Jue', friday: 'Vie', saturday: 'Sáb', sunday: 'Dom'
  }
  return days.map(d => map[d] || d).join(', ')
}

// TRADUCTORES PARA REVISIÓN AMIGABLE
function getFlexibilityLabel(val: string): string {
  const map: any = { 
    low: 'Baja (Estructurada)', 
    medium: 'Media (Flexible)', 
    high: 'Alta (Adaptable)',
    BAJA: 'Baja', MEDIA: 'Media', ALTA: 'Alta' // Soporte para mayúsculas
  }
  return map[val] || val
}

function getWarningMethodLabel(val: string): string {
  const map: any = { 
    verbal: '📢 Aviso Verbal', 
    visual: '🖼️ Apoyo Visual', 
    timer: '⏰ Temporizador', 
    none: 'Sin aviso previo' 
  }
  return map[val] || val
}

function getVisualTypeLabel(val: string): string {
  const map: any = { 
    pictograms: 'Pictogramas', 
    photos: 'Fotos Reales', 
    written_list: 'Lista Escrita' 
  }
  return map[val] || val
}

function getRoutineTypeLabel(val: string | null): string {
  const options: any = { 
    morning: '☀️ Mañana', 
    breakfast: '🍳 Desayuno',
    school_prep: '🎒 Preparación Escuela',
    after_school: '🏠 Después de Escuela',
    homework: '📚 Tareas',
    dinner: '🍽️ Cena',
    bath: '🛁 Baño',
    bedtime: '🌙 Dormir',
    therapy_session: '💆 Terapia',
    weekend: '🎉 Fin de Semana',
    transition: '🔄 Transición',
    other: '📋 Otro'
  }
  return options[val || ''] || val || 'Otro'
}

onMounted(() => {
  // ✅ Validación final sincronizada con el progreso del Wizard
  const isOverallValid = wizardStore.isStep1Valid && wizardStore.isStep2Valid && wizardStore.isStep3Valid
  emit('update:validity', isOverallValid)
})
</script>

<style scoped>
.review-item { @apply flex flex-col gap-1; }
.review-label { @apply text-xs font-black text-gray-400 uppercase tracking-widest; }
.review-value { @apply text-base font-bold text-gray-900; }
.badge-review { @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight; }

/* Animaciones de entrada */
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
.animate-fade-in { animation: fadeIn 0.5s ease-out; }
.animate-slide-in { animation: slideIn 0.4s ease-out forwards; }
.animate-bounce-soft { animation: bounce 3s infinite; }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
</style>