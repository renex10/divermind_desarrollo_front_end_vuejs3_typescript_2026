<template>
  <div class="social-skills-list space-y-4">
    
    <div v-if="loading" class="py-12 flex justify-center">
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-10 w-10 border-4 border-primary-100 border-t-primary-600 mb-3"></div>
        <p class="text-sm text-gray-500 font-medium">Cargando historial clínico...</p>
      </div>
    </div>

    <div v-else-if="skills.length === 0" class="empty-state bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <UserGroupIcon class="h-8 w-8 text-gray-400" />
      </div>
      <h3 class="text-base font-semibold text-gray-900">No hay registros de habilidades</h3>
      <p class="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
        No se han documentado interacciones sociales para este niño. Comienza registrando la primera observación.
      </p>
    </div>

    <div v-else class="grid gap-4">
      <div 
        v-for="skill in skills" 
        :key="skill.id" 
        class="group bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all duration-200 relative overflow-hidden"
      >
        <div 
          class="absolute left-0 top-0 bottom-0 w-1.5"
          :class="skill.was_successful ? 'bg-green-500' : 'bg-red-400'"
        ></div>

        <div class="flex items-start gap-4 pl-3">
          
          <div 
            class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
            :class="getCategoryColor(skill.skill_category)"
          >
            <component :is="getCategoryIcon(skill.skill_category)" class="w-6 h-6" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="text-base font-bold text-gray-900 flex items-center gap-2">
                  {{ getCategoryLabel(skill.skill_category) }}
                </h4>
                
                <div class="flex items-center gap-2 mt-1 text-xs text-gray-500 font-medium">
                  <span class="flex items-center">
                    <CalendarIcon class="w-3.5 h-3.5 mr-1" />
                    {{ formatDate(skill.date) }}
                  </span>
                  <span>•</span>
                  <span class="uppercase tracking-wide text-primary-600">{{ getLevelLabel(skill.level) }}</span>
                </div>
              </div>

              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button 
                  @click="$emit('edit', skill)"
                  class="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Editar registro"
                >
                  <PencilSquareIcon class="w-5 h-5" />
                </button>
                <button 
                  @click="$emit('delete', skill.id)"
                  class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar registro"
                >
                  <TrashIcon class="w-5 h-5" />
                </button>
              </div>
            </div>

            <p class="mt-3 text-sm text-gray-700 leading-relaxed">{{ skill.description }}</p>

            <div class="mt-4 flex flex-wrap gap-2">
              
              <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                <UserIcon class="w-3 h-3 mr-1.5 text-gray-500" />
                {{ getPartnerLabel(skill.interaction_partner) }}
              </span>

              <span 
                v-if="skill.initiated_by_child" 
                class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100"
              >
                <SparklesIcon class="w-3 h-3 mr-1.5" />
                Inició Niño
              </span>

              <span 
                class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border"
                :class="!skill.needed_prompting 
                  ? 'bg-teal-50 text-teal-700 border-teal-100' 
                  : 'bg-amber-50 text-amber-700 border-amber-100'"
              >
                <BoltIcon class="w-3 h-3 mr-1.5" />
                {{ !skill.needed_prompting ? 'Sin Ayuda' : 'Con Ayuda' }}
              </span>

              <span v-if="skill.duration_minutes && skill.duration_minutes > 0" class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                <ClockIcon class="w-3 h-3 mr-1.5" />
                {{ skill.duration_minutes }} min
              </span>
            </div>

            <div v-if="skill.social_context && !skill.was_successful" class="mt-3 flex items-start gap-2 bg-red-50 p-3 rounded-lg border border-red-100">
              <ExclamationCircleIcon class="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div class="text-xs text-red-800">
                <span class="font-semibold block mb-0.5">Motivo del resultado no exitoso:</span>
                {{ skill.social_context }}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SocialSkill } from '@/type/socialSkill';
import { 
  EyeIcon, 
  ChatBubbleLeftRightIcon, 
  UserGroupIcon, 
  HandRaisedIcon, 
  HeartIcon, 
  PuzzlePieceIcon, 
  GlobeAmericasIcon, 
  UserIcon, 
  SparklesIcon, 
  BoltIcon, 
  ClockIcon,
  PencilSquareIcon,
  TrashIcon,
  CalendarIcon,
  ExclamationCircleIcon,
  MapPinIcon
} from '@heroicons/vue/24/outline';

// PROPS
defineProps<{
  skills: SocialSkill[],
  loading: boolean
}>();

// EMITS
defineEmits<{
  (e: 'edit', skill: SocialSkill): void
  (e: 'delete', id: number | undefined): void
}>();

// --- HELPERS DE FORMATO ---
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  // Usar formato local del navegador (es-CL por defecto en el proyecto)
  return new Date(dateString).toLocaleDateString(undefined, {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};

// --- DICCIONARIOS DE UI ---

// 1. Iconos por Categoría (Heroicons)
const getCategoryIcon = (category: string) => {
  const map: Record<string, any> = {
    eye_contact: EyeIcon,
    conversation: ChatBubbleLeftRightIcon,
    greeting: HandRaisedIcon,
    turn_taking: UserGroupIcon,
    sharing: HeartIcon,
    empathy: HeartIcon,
    play_cooperative: PuzzlePieceIcon,
    joint_attention: GlobeAmericasIcon,
    other: UserGroupIcon
  };
  return map[category] || UserGroupIcon;
};

// 2. Colores de Fondo por Categoría (Tailwind classes)
const getCategoryColor = (category: string) => {
  const map: Record<string, string> = {
    eye_contact: 'bg-blue-100 text-blue-600',
    conversation: 'bg-emerald-100 text-emerald-600',
    play_cooperative: 'bg-orange-100 text-orange-600',
    empathy: 'bg-pink-100 text-pink-600',
    conflict_resolution: 'bg-rose-100 text-rose-600',
    joint_attention: 'bg-violet-100 text-violet-600',
    // Default
    other: 'bg-gray-100 text-gray-600'
  };
  return map[category] || 'bg-indigo-100 text-indigo-600';
};

// 3. Etiquetas Legibles (Mapping)
const getCategoryLabel = (val: string) => {
  const labels: Record<string, string> = {
    eye_contact: 'Contacto Visual',
    turn_taking: 'Toma de Turnos',
    sharing: 'Compartir',
    greeting: 'Saludo Social',
    requesting: 'Peticiones',
    joint_attention: 'Atención Conjunta',
    emotion_recognition: 'Reconocer Emociones',
    empathy: 'Empatía',
    conversation: 'Conversación',
    play_cooperative: 'Juego Cooperativo',
    conflict_resolution: 'Resolución de Conflictos',
    friendship: 'Amistad',
    other: 'Otro'
  };
  return labels[val] || val;
};

const getLevelLabel = (val: string) => {
  const labels: Record<string, string> = {
    beginner: 'Inicial',
    intermediate: 'Intermedio',
    advanced: 'Avanzado'
  };
  return labels[val] || val;
};

const getPartnerLabel = (val: string) => {
  const labels: Record<string, string> = {
    therapist: 'Terapeuta',
    peer: 'Par (Niño)',
    group: 'Grupo de Pares',
    parent: 'Padres',
    teacher: 'Profesor',
    other_adult: 'Otro Adulto',
    sibling: 'Hermano/a'
  };
  return labels[val] || val;
};
</script>

<style scoped>
/* Transición suave para las acciones */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>