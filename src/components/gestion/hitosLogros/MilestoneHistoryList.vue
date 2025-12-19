<template>
  <div class="milestone-history-list">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>

        <p class="mt-1 text-sm text-gray-600 ml-9">
          Registro cronológico de {{ milestones?.length || 0 }} {{ milestones?.length === 1 ? 'logro' : 'logros' }}
        </p>
      </div>

    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div class="text-center">
        <ArrowPathIcon class="animate-spin h-10 w-10 text-primary-500 mx-auto mb-4" />
        <p class="text-gray-600 font-medium">Cargando historial de hitos...</p>
        <p class="text-sm text-gray-500 mt-1">Por favor espera un momento</p>
      </div>
    </div>

    <div v-else-if="!milestones || milestones.length === 0" class="text-center py-20 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border-2 border-dashed border-gray-300">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-5">
        <DocumentTextIcon class="w-10 h-10 text-gray-400" />
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">Aún no hay hitos registrados</h3>
      <p class="text-gray-600 mb-6 max-w-md mx-auto">
        Los hitos que registres aparecerán aquí. Comienza documentando los logros y avances del niño.
      </p>
      <div class="flex items-center justify-center gap-2 text-sm text-gray-500">
        <SparklesIcon class="w-5 h-5" />
        <span>Registra tu primer hito usando el formulario arriba</span>
      </div>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="(milestone, index) in milestones"
        :key="milestone.id || index" class="bg-white rounded-xl border border-gray-200 shadow-soft hover:shadow-medium transition-all duration-200 overflow-hidden group relative"
      >
        <div class="absolute top-4 right-4 bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full">
          #{{ milestones.length - index }}
        </div>

        <div class="p-6">
          <div class="flex items-start gap-4 mb-5">
            <div class="flex-shrink-0">
              <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
                <component :is="getCategoryHeroIcon(milestone.category)" class="w-8 h-8 text-white" />
              </div>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <span class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-primary-100 text-primary-800 border border-primary-200">
                  {{ getCategoryIcon(milestone.category) }} {{ milestone.category_display }}
                </span>
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border',
                    getProficiencyColor(milestone.proficiency_level)
                  ]"
                >
                  {{ getProficiencyIcon(milestone.proficiency_level) }} {{ milestone.proficiency_level_display }}
                </span>
              </div>

              <div class="flex items-center gap-2 text-sm text-gray-600">
                <CalendarIcon class="w-4 h-4" />
                <span class="font-medium">{{ formatDateShort(milestone.date) }}</span>
                <span class="text-gray-400">•</span>
                <UserCircleIcon class="w-4 h-4" />
                <span>Edad: {{ milestone.age_at_milestone || 'N/A' }}</span>
              </div>
            </div>

            <div class="flex items-center gap-1 flex-shrink-0">
              <button
                @click="$emit('edit', milestone)"
                class="p-2.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors group/btn"
                title="Editar hito"
              >
                <PencilSquareIcon class="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
              </button>
              <button
                @click="$emit('delete', milestone.id)"
                class="p-2.5 text-error-600 hover:bg-error-50 rounded-lg transition-colors group/btn"
                title="Eliminar hito"
              >
                <TrashIcon class="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          <div class="mb-4 pl-[72px]">
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div class="flex items-start gap-2 mb-2">
                <ChatBubbleLeftEllipsisIcon class="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Descripción del Logro</h4>
              </div>
              <p class="text-base text-gray-900 leading-relaxed">{{ milestone.description }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 pl-[72px]">
            <div class="bg-blue-50 rounded-lg p-3.5 border border-blue-100">
              <div class="flex items-center gap-2 mb-1.5">
                <MapPinIcon class="w-4 h-4 text-blue-600" />
                <p class="text-xs font-bold text-blue-900 uppercase tracking-wide">Contexto</p>
              </div>
              <p class="text-sm text-blue-800 font-medium">{{ milestone.context_display }}</p>
            </div>

            <div class="bg-purple-50 rounded-lg p-3.5 border border-purple-100">
              <div class="flex items-center gap-2 mb-1.5">
                <HandRaisedIcon class="w-4 h-4 text-purple-600" />
                <p class="text-xs font-bold text-purple-900 uppercase tracking-wide">Nivel de Apoyo</p>
              </div>
              <p class="text-sm text-purple-800 font-medium">{{ milestone.support_level_display }}</p>
            </div>

            <div v-if="milestone.functional_impact" class="bg-green-50 rounded-lg p-3.5 border border-green-100 sm:col-span-2 lg:col-span-1">
              <div class="flex items-center gap-2 mb-1.5">
                <SparklesIcon class="w-4 h-4 text-green-600" />
                <p class="text-xs font-bold text-green-900 uppercase tracking-wide">Impacto Funcional</p>
              </div>
              <p class="text-sm text-green-800 font-medium">{{ milestone.functional_impact }}</p>
            </div>
          </div>

          <div v-if="milestone.observations" class="pl-[72px] mb-4">
            <div class="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <div class="flex items-start gap-2 mb-2">
                <LightBulbIcon class="w-4 h-4 text-amber-600 mt-0.5" />
                <h4 class="text-xs font-bold text-amber-900 uppercase tracking-wide">Observaciones Adicionales</h4>
              </div>
              <p class="text-sm text-amber-900 italic leading-relaxed">{{ milestone.observations }}</p>
            </div>
          </div>

          <div class="pt-4 border-t border-gray-200 pl-[72px]">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <div class="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
                  <UserIcon class="w-4 h-4" />
                  <span class="font-semibold text-gray-700">{{ milestone.registered_by_name || 'Sistema' }}</span>
                </div>
                <span class="text-gray-400">•</span>
                <div class="flex items-center gap-1.5">
                  <ClockIcon class="w-4 h-4" />
                  <span>{{ formatDate(milestone.created_at) }}</span>
                </div>
              </div>

              </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="milestones && milestones.length > 0" class="mt-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-5 border border-primary-200">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
            <ChartBarIcon class="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900">Total de hitos registrados</p>
            <p class="text-xs text-gray-600">Progreso documentado del desarrollo</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-3xl font-bold text-primary-600">{{ milestones.length }}</p>
          <p class="text-xs text-gray-600">{{ milestones.length === 1 ? 'Hito' : 'Hitos' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ClockIcon, ArrowPathIcon, DocumentTextIcon, SparklesIcon,
  CheckCircleIcon, CalendarIcon, UserCircleIcon, PencilSquareIcon, TrashIcon,
  ChatBubbleLeftEllipsisIcon, MapPinIcon, HandRaisedIcon, LightBulbIcon,
  UserIcon, ChartBarIcon,
  // Specific category icons (optional but nice)
  ChatBubbleBottomCenterTextIcon, UserGroupIcon, AcademicCapIcon,
  CogIcon, HeartIcon, BeakerIcon, StarIcon // StarIcon as fallback
} from '@heroicons/vue/24/outline'
import type { Milestone } from '@/type/hitoServiceInterface'; // Import the interface

interface Props {
  milestones: Milestone[] | null; // Allow null for initial state
  isLoading?: boolean;
}

// Define props with defaults (sin asignar a variable)
withDefaults(defineProps<Props>(), {
  milestones: () => [], // Default to empty array
  isLoading: false,
});

defineEmits<{
  (e: 'refresh'): void
  (e: 'edit', milestone: Milestone): void
  (e: 'delete', id: number | string): void
}>()

function getProficiencyColor(level: string): string {
  const colors: Record<string, string> = {
    emerging: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    developing: 'bg-blue-50 text-blue-800 border-blue-200',
    proficient: 'bg-green-50 text-green-800 border-green-200',
    mastered: 'bg-purple-50 text-purple-800 border-purple-200'
  }
  return colors[level] || 'bg-gray-50 text-gray-800 border-gray-200'
}

function getProficiencyIcon(level: string): string {
  const icons: Record<string, string> = {
    emerging: '🌱',
    developing: '🌿',
    proficient: '🌳',
    mastered: '⭐'
  }
  return icons[level] || '📍'
}

// Simple text icons for categories
function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    communication: '📢',
    social: '👥',
    academic: '📚',
    motor: '🏃',
    cognitive: '🧠',
    emotional: '💝',
    therapeutic: '⚕️'
  }
  return icons[category] || '📋'
}

// Map category keys to Heroicons components for the main card icon
function getCategoryHeroIcon(category: string) {
    const iconMap: Record<string, any> = {
        communication: ChatBubbleBottomCenterTextIcon,
        social: UserGroupIcon,
        academic: AcademicCapIcon,
        motor: CogIcon, // Using Cog as a placeholder for Motor skills
        cognitive: BeakerIcon, // Using Beaker as a placeholder for Cognitive
        emotional: HeartIcon,
        therapeutic: CheckCircleIcon, // Or a specific therapy icon if available
    };
    return iconMap[category] || StarIcon; // Fallback icon
}


function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Fecha desconocida';
   try {
        return new Date(dateString).toLocaleString('es-CL', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    } catch (e) {
        return dateString;
    }
}

function formatDateShort(dateString: string | null | undefined): string {
  if (!dateString) return 'Fecha desconocida';
   try {
        return new Date(dateString).toLocaleDateString('es-CL', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
}
</script>

<style scoped>
/* Add any specific styles if needed */
.shadow-soft {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
}
.shadow-medium {
   box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.07);
}

/* Custom error color */
.text-error-600 { color: #DC2626; } /* Tailwind red-600 */
.hover\:bg-error-50:hover { background-color: #FEF2F2; } /* Tailwind red-50 */
</style>