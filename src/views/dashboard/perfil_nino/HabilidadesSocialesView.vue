<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { 
  PlusIcon, UserGroupIcon, ClockIcon, 
  CheckCircleIcon, XCircleIcon 
} from '@heroicons/vue/24/outline';
import socialSkillService from '@/services/socialSkillService';
import type { SocialSkill } from '@/type/socialSkill';

const route = useRoute();
const childId = Number(route.params.id);

const loading = ref(true);
const history = ref<SocialSkill[]>([]);
const showModal = ref(false);
const submitting = ref(false);

// Configuración inicial que coincide con el Backend
const form = ref<SocialSkill>({
  date: new Date().toISOString().split('T')[0],
  skill_category: 'eye_contact',    // Valor por defecto válido
  level: 'beginner',                // Valor por defecto válido
  interaction_partner: 'therapist', // Valor por defecto válido
  initiated_by_child: false,
  needed_prompting: true,
  was_successful: true,
  description: '',
  social_context: '',
  duration_minutes: 0
});

// --- LÓGICA DE VALIDACIÓN VISUAL ---
const isPeerInteraction = computed(() => 
  ['peer', 'group'].includes(form.value.interaction_partner)
);

const requiresContext = computed(() => !form.value.was_successful);

const loadData = async () => {
  try {
    loading.value = true;
    history.value = await socialSkillService.getHistory(childId);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  // Validación simple antes de enviar
  if (!form.value.description) {
    alert('La descripción es obligatoria');
    return;
  }

  try {
    submitting.value = true;
    
    // Limpieza de datos según reglas de negocio
    const payload = { ...form.value };
    
    // Regla: Si es con pares, duration_minutes es obligatorio, si no, puede ser 0 o null
    if (!isPeerInteraction.value) {
       payload.duration_minutes = 0;
    }
    
    console.log("Enviando payload correcto:", payload); // Para depuración

    await socialSkillService.create(childId, payload);
    await loadData();
    showModal.value = false;
    
    // Reset form
    form.value.description = '';
    form.value.social_context = '';
    
  } catch (error: any) {
    console.error("Error al guardar:", error);
    // Mostrar error específico si viene del backend
    const msg = error.response?.data ? JSON.stringify(error.response.data) : 'Error al guardar';
    alert(`Error: ${msg}`);
  } finally {
    submitting.value = false;
  }
};

onMounted(loadData);

// --- OPCIONES PARA SELECTS (Valores exactos del Backend) ---
const CATEGORIES = [
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

const LEVELS = [
  { value: 'beginner', label: 'Inicial' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' }
];

const PARTNERS = [
  { value: 'therapist', label: 'Terapeuta' },
  { value: 'peer', label: 'Par (Otro niño)' }, // CRÍTICO para regla de duración
  { value: 'group', label: 'Grupo' },          // CRÍTICO para regla de duración
  { value: 'parent', label: 'Padres' },
  { value: 'teacher', label: 'Profesor' }
];
</script>

<template>
  <div class="space-y-6 p-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">Habilidades Sociales</h2>
      <button 
        @click="showModal = true"
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <PlusIcon class="w-5 h-5" />
        Nueva Habilidad
      </button>
    </div>

    <div class="grid gap-4">
      <div v-for="item in history" :key="item.id" class="bg-white p-4 rounded-xl border shadow-sm">
        <div class="flex justify-between">
          <h3 class="font-bold text-lg text-gray-800">
            {{ item.skill_category_display || item.skill_category }}
          </h3>
          <span 
            :class="item.was_successful ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            class="px-2 py-1 rounded text-xs font-bold"
          >
            {{ item.was_successful ? 'Exitosa' : 'No Exitosa' }}
          </span>
        </div>
        <p class="text-gray-600 mt-1">{{ item.description }}</p>
        <div class="mt-3 flex gap-4 text-sm text-gray-500">
          <span class="flex items-center gap-1">
            <UserGroupIcon class="w-4 h-4" />
            {{ item.interaction_partner_display || item.interaction_partner }}
          </span>
          <span>Nivel: {{ item.level_display || item.level }}</span>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-4">Registrar Interacción</h3>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Categoría</label>
              <select v-model="form.skill_category" class="w-full border rounded p-2">
                <option v-for="opt in CATEGORIES" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Nivel</label>
              <select v-model="form.level" class="w-full border rounded p-2">
                <option v-for="opt in LEVELS" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Descripción *</label>
            <textarea 
              v-model="form.description" 
              rows="2" 
              class="w-full border rounded p-2"
              placeholder="¿Qué ocurrió exactamente?"
              required
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Interactuó con</label>
              <select v-model="form.interaction_partner" class="w-full border rounded p-2">
                <option v-for="opt in PARTNERS" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>
            <div>
               <label class="block text-sm font-medium mb-1">Resultado</label>
               <div class="flex gap-2">
                 <button 
                   type="button"
                   @click="form.was_successful = true"
                   :class="form.was_successful ? 'bg-green-600 text-white' : 'bg-gray-100'"
                   class="flex-1 py-2 rounded transition"
                 >
                   Exitosa
                 </button>
                 <button 
                   type="button"
                   @click="form.was_successful = false"
                   :class="!form.was_successful ? 'bg-red-600 text-white' : 'bg-gray-100'"
                   class="flex-1 py-2 rounded transition"
                 >
                   No Exitosa
                 </button>
               </div>
            </div>
          </div>

          <div v-if="isPeerInteraction" class="bg-blue-50 p-3 rounded border border-blue-200">
            <label class="block text-sm font-medium text-blue-800 mb-1">
              Duración (Minutos) *
            </label>
            <input 
              type="number" 
              v-model.number="form.duration_minutes"
              class="w-full border rounded p-2"
              min="1"
            />
            <p class="text-xs text-blue-600 mt-1">Requerido para interacción con pares.</p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">
              Contexto Social {{ requiresContext ? '*' : '(Opcional)' }}
            </label>
            <textarea 
              v-model="form.social_context" 
              rows="2" 
              class="w-full border rounded p-2"
              :required="requiresContext"
              :placeholder="requiresContext ? 'Explica por qué no fue exitosa...' : 'Contexto adicional...'"
            ></textarea>
          </div>

          <div class="flex gap-4 p-4 bg-gray-50 rounded">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="form.initiated_by_child" />
              <span class="text-sm">Inició el niño</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="form.needed_prompting" />
              <span class="text-sm">Necesitó ayuda</span>
            </label>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              @click="showModal = false"
              class="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              :disabled="submitting"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {{ submitting ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>