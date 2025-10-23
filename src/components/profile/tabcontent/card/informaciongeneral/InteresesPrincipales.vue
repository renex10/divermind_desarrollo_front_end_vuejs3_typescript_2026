<template>
  <div class="info-card bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
    <!-- Encabezado de la tarjeta -->
    <div class="card-header bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <SparklesIcon class="icon-md text-blue-600" />
        <h3 class="text-lg font-semibold text-gray-800">Intereses Principales</h3>
      </div>
      <!-- Botón para abrir el modal de gestión -->
      <button
        @click="$emit('gestionarIntereses')"
        class="btn btn-sm btn-outline-primary flex items-center gap-1"
      >
        <PencilSquareIcon class="icon-xs" />
        Gestionar
      </button>
    </div>

    <!-- Cuerpo de la tarjeta -->
    <div class="card-body p-5">
      <!-- Estado de carga -->
      <div v-if="loading" class="text-center text-gray-500 py-4">
        <svg class="animate-spin h-5 w-5 text-blue-500 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Cargando intereses...
      </div>

      <!-- Estado de error -->
      <div v-else-if="error" class="text-center text-red-600 bg-red-50 p-3 rounded-md">
        <ExclamationTriangleIcon class="icon-md mx-auto mb-1" />
        Error al cargar intereses: {{ error }}
      </div>

      <!-- Estado vacío -->
      <div v-else-if="interests.length === 0" class="empty-state text-center text-gray-500 py-4">
        <InformationCircleIcon class="icon-lg mx-auto mb-2" />
        <p>No hay intereses principales registrados.</p>
        <button
          @click="$emit('gestionarIntereses')"
          class="text-blue-600 hover:text-blue-800 text-sm mt-1 underline"
        >
          Agregar el primer interés
        </button>
      </div>

      <!-- Lista de intereses -->
      <ul v-else class="space-y-3">
        <li v-for="interest in interests" :key="interest.id" class="interest-item border-b border-gray-100 pb-3 last:border-b-0">
          <div class="flex items-center justify-between mb-1">
            <span class="font-medium text-gray-800">{{ interest.description }}</span>
            <span :class="['intensity-badge', `intensity-${interest.intensity}`]">
              {{ getIntensityLabel(interest.intensity) }}
            </span>
          </div>
          <div class="text-sm text-gray-500 flex items-center gap-1">
             <TagIcon class="icon-xs" /> {{ getCategoryLabel(interest.category) }}
          </div>
          <p v-if="interest.therapeutic_utility" class="text-xs text-gray-600 mt-1 pl-1 border-l-2 border-blue-200">
             {{ interest.therapeutic_utility }}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import {
  SparklesIcon, // Icono para Intereses
  PencilSquareIcon, // Icono para Gestionar/Editar
  InformationCircleIcon, // Icono para estado vacío
  ExclamationTriangleIcon, // Icono para error
  TagIcon // Icono para categoría
} from '@heroicons/vue/24/outline';
// Importamos la función del servicio y el tipo
import { getInterestsForChild, type Interest } from '@/services/sessionService'; // O interestService si lo creaste

// --- Props ---
// Recibe el ID del niño para saber qué intereses cargar
const props = defineProps<{
  childId: number | string; // Puede ser string desde la ruta, lo convertimos a number
}>();

// --- Emits ---
// Emite 'gestionarIntereses' cuando se hace clic en el botón Gestionar
const emit = defineEmits<{
  (e: 'gestionarIntereses'): void;
}>();

// --- Estado del Componente ---
const loading = ref(false); // Indica si se están cargando los datos
const error = ref<string | null>(null); // Almacena mensajes de error
const interests = ref<Interest[]>([]); // Array para almacenar los intereses cargados

// --- Métodos ---

/**
 * Carga la lista de intereses desde la API.
 */
const loadInterests = async () => {
  // Asegurarse de que tenemos un ID numérico válido
  const id = Number(props.childId);
  if (isNaN(id) || id <= 0) {
    error.value = "ID de niño no válido.";
    return;
  }

  loading.value = true;
  error.value = null; // Limpiar errores previos
  try {
    console.log(`⏳ Cargando intereses para el niño ID: ${id}...`);
    interests.value = await getInterestsForChild(id);
    console.log(`✅ ${interests.value.length} intereses cargados.`);
  } catch (err: any) {
    console.error('❌ Error cargando intereses:', err);
    error.value = err.response?.data?.detail || err.message || 'Ocurrió un error desconocido.';
    interests.value = []; // Limpiar lista en caso de error
  } finally {
    loading.value = false;
  }
};

/**
 * Obtiene una etiqueta legible para la intensidad.
 * @param intensity El valor de la intensidad ('mild', 'moderate', etc.)
 */
const getIntensityLabel = (intensity: string) => {
  const labels: { [key: string]: string } = {
    mild: 'Leve',
    moderate: 'Moderado',
    strong: 'Fuerte',
    obsessive: 'Obsesivo',
  };
  return labels[intensity] || intensity; // Devuelve la etiqueta o el valor original si no se encuentra
};

/**
 * Obtiene una etiqueta legible para la categoría.
 * @param category El valor de la categoría ('food', 'games', etc.)
 */
const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
        food: 'Comida',
        games: 'Juegos',
        music: 'Música',
        movies: 'Películas',
        books: 'Libros',
        activities: 'Actividades',
        objects: 'Objetos',
        other: 'Otro',
    };
    return labels[category] || category;
}

// --- Lifecycle Hooks ---

// Carga los intereses cuando el componente se monta por primera vez
onMounted(() => {
  loadInterests();
});

// Vuelve a cargar los intereses si el childId cambia (útil si el perfil se reutiliza)
watch(() => props.childId, () => {
  loadInterests();
});

</script>

<style scoped>
/* Reutilizamos estilos similares a otras tarjetas si es posible */
.info-card {
  /* Estilos base de la tarjeta */
}

.card-header {
  /* Estilos del encabezado */
}

.card-body {
 /* Estilos del cuerpo */
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  transition: background-color 0.2s;
  text-decoration: none;
}
.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
}
.btn-outline-primary {
  border: 1px solid #3b82f6;
  color: #3b82f6;
  background-color: transparent;
}
.btn-outline-primary:hover {
  background-color: #eff6ff; /* Azul muy claro */
}

.empty-state {
 /* Estilos para cuando no hay datos */
}

.interest-item {
 /* Estilos para cada elemento de la lista */
}

.intensity-badge {
  display: inline-block;
  padding: 0.15rem 0.6rem;
  border-radius: 9999px; /* Píldora */
  font-size: 0.7rem; /* Más pequeño */
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Colores según intensidad (ajusta según tu paleta) */
.intensity-mild { background-color: #dbeafe; color: #1e40af; } /* Azul claro */
.intensity-moderate { background-color: #fef3c7; color: #92400e; } /* Amarillo claro */
.intensity-strong { background-color: #fee2e2; color: #991b1b; } /* Rojo claro */
.intensity-obsessive { background-color: #e0e7ff; color: #4338ca; } /* Indigo claro */

.icon-md {
  width: 1.5rem; height: 1.5rem;
}
.icon-lg {
  width: 2rem; height: 2rem;
}
.icon-xs {
 width: 0.875rem; height: 0.875rem; /* 14px */
}
</style>
