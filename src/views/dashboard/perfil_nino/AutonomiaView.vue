<template>
  <div class="autonomia-view">

    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600 ml-4">Cargando datos de autonomía...</p>
    </div>

    <!-- ✅ Estado de Error -->
    <div v-else-if="!ninoStore.hasData" class="flex flex-col items-center justify-center py-20">
      <div class="text-6xl mb-4">⚠️</div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">No hay niño seleccionado</h3>
      <p class="text-gray-600 mb-4">Por favor, selecciona un niño para continuar.</p>
      <button 
        @click="$router.push({ name: 'parent-mis-hijos' })"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Seleccionar niño
      </button>
    </div>

    <form v-else @submit.prevent="handleSubmit">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">
        Seguimiento de Habilidades de Autonomía
      </h2>
      
      <div class="space-y-6">
        
        <div 
          v-for="skill in skillsData" 
          :key="skill.id" 
          class="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <h3 class="text-lg font-medium text-gray-900 mb-4">{{ skill.name }}</h3>

          <fieldset>
            <legend class="sr-only">Nivel de Apoyo para {{ skill.name }}</legend>
            <div class="flex flex-wrap gap-3">
              <label 
                v-for="level in supportLevels" 
                :key="level.value"
                :for="`skill-${skill.id}-${level.value}`"
                class="relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium cursor-pointer focus:outline-none transition-all duration-150 ease-in-out"
                :class="{
                  'bg-blue-600 border-blue-600 text-white shadow-md': skill.currentLevel === level.value,
                  'bg-white border-gray-300 text-gray-900 hover:bg-gray-50': skill.currentLevel !== level.value
                }"
              >
                <input 
                  type="radio"
                  :id="`skill-${skill.id}-${level.value}`"
                  :name="`skill-level-${skill.id}`"
                  :value="level.value"
                  v-model="skill.currentLevel"
                  class="sr-only"
                  :aria-labelledby="`skill-label-${skill.id}-${level.value}`"
                >
                <span :id="`skill-label-${skill.id}-${level.value}`">{{ level.label }}</span>
              </label>
            </div>
          </fieldset>

          <div class="mt-5">
            <label :for="`notes-${skill.id}`" class="block text-sm font-medium text-gray-700 mb-2">
              Notas Rápidas (Opcional)
            </label>
            <textarea
              :id="`notes-${skill.id}`"
              v-model="skill.notes"
              rows="2"
              class="w-full max-w-lg px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Logró ponerse los calcetines solo, pero necesitó apoyo verbal para la cremallera."
            ></textarea>
          </div>
        </div>
        
      </div>

      <div class="mt-8 pt-6 border-t border-gray-200 text-right">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSubmitting ? 'Guardando...' : 'Guardar Progreso de Autonomía' }}
        </button>
      </div>
    </form>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNinoActivoStore } from '@/store/ninoActivoStore'
import { useAlertModalStore } from '@/store/alertModalStore' // Para notificaciones

// --- TIPOS Y ESTRUCTURAS DE DATOS ---

// Definición de la escala de apoyo (ideal para ML)
interface SupportLevel {
  value: number
  label: string
}

// Definición de la habilidad de autonomía
interface AutonomySkill {
  id: string // ID único de la habilidad (ej: 'higiene_manos')
  name: string // Nombre legible (ej: 'Higiene: Lavado de Manos')
  currentLevel: number | null // Valor actual de la escala (ej: 3)
  notes: string // Contexto cualitativo
}

// --- CONSTANTES ---

// Define la escala de medición.
// Esta escala es la clave para la ciencia de datos.
const supportLevels: SupportLevel[] = [
  { value: 1, label: 'Apoyo Físico Total' },
  { value: 2, label: 'Apoyo Físico Parcial' },
  { value: 3, label: 'Apoyo Verbal / Gestual' },
  { value: 4, label: 'Supervisión' },
  { value: 5, label: 'Independiente' },
]

// --- ESTADO ---

const router = useRouter()
const isLoading = ref(true)
const isSubmitting = ref(false)
const skillsData = ref<AutonomySkill[]>([])

// Stores
const ninoStore = useNinoActivoStore()
const alertModal = useAlertModalStore()

// --- CICLO DE VIDA ---

onMounted(async () => {
  // ✅ Inicializar niño activo si no hay datos
  if (!ninoStore.hasData) {
    console.log('📂 Inicializando niño activo desde localStorage...')
    try {
      await ninoStore.initializeFromStorage()
      
      if (!ninoStore.hasData) {
        console.warn('⚠️ No hay niño activo, redirigiendo...')
        router.push({ name: 'parent-mis-hijos' })
        isLoading.value = false
        return
      }
    } catch (error) {
      console.error('❌ Error al inicializar niño activo:', error)
      isLoading.value = false
      return
    }
  }
  
  await fetchAutonomyData()
})

// --- MÉTODOS ---

/**
 * Simula la carga de datos de autonomía del niño desde el backend.
 */
async function fetchAutonomyData() {
  isLoading.value = true
  
  // ✅ CORREGIDO: Usa ninoActivoId en lugar de ninoId
  const childId = ninoStore.ninoActivoId
  
  if (!childId) {
    alertModal.error('Error', 'No se pudo identificar al niño activo.')
    isLoading.value = false
    return
  }

  console.log(`🔍 Buscando datos de autonomía para el niño ID: ${childId}...`)
  
  // --- INICIO DE SIMULACIÓN DE API ---
  // Reemplaza esto con tu llamada real:
  // const response = await api.get(`/ninos/${childId}/autonomia`)
  // skillsData.value = response.data
  
  await new Promise(resolve => setTimeout(resolve, 800)) // Simula espera
  
  // Datos de ejemplo (el backend debería devolver esto)
  const mockData: AutonomySkill[] = [
    {
      id: 'autonomia_1',
      name: 'Alimentación: Uso de Cubiertos (cuchara/tenedor)',
      currentLevel: 2, // Apoyo Físico Parcial
      notes: 'Requiere guía en la mano para pinchar la comida.',
    },
    {
      id: 'autonomia_2',
      name: 'Vestimenta: Ponerse y quitarse la chaqueta',
      currentLevel: 3, // Apoyo Verbal
      notes: 'Necesita recordatorio verbal para iniciar y ayuda con la cremallera.',
    },
    {
      id: 'autonomia_3',
      name: 'Higiene: Lavado de Manos',
      currentLevel: 4, // Supervisión
      notes: 'Lo hace solo, pero hay que supervisar que use jabón.',
    },
    {
      id: 'autonomia_4',
      name: 'Control de Esfínteres: Avisar para ir al baño',
      currentLevel: 5, // Independiente
      notes: 'Avisa consistentemente sin accidentes.',
    },
  ]
  
  skillsData.value = mockData
  // --- FIN DE SIMULACIÓN DE API ---
  
  console.log(`✅ Datos de autonomía cargados para ${ninoStore.nombreCompleto}`)
  isLoading.value = false
}

/**
 * Simula el envío de los datos actualizados al backend.
 */
async function handleSubmit() {
  isSubmitting.value = true
  
  // ✅ CORREGIDO: Usa ninoActivoId en lugar de ninoId
  const childId = ninoStore.ninoActivoId
  
  if (!childId) {
    alertModal.error('Error', 'No se pudo identificar al niño activo.')
    isSubmitting.value = false
    return
  }
  
  console.log(`💾 Guardando datos de autonomía para el niño ID: ${childId}:`, skillsData.value)

  // --- INICIO DE SIMULACIÓN DE API ---
  // Reemplaza esto con tu llamada real:
  // try {
  //   await api.post(`/ninos/${childId}/autonomia`, { skills: skillsData.value })
  //   alertModal.success('Éxito', 'El progreso de autonomía ha sido guardado.')
  // } catch (error) {
  //   alertModal.error('Error', 'No se pudo guardar el progreso.')
  // }
  
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simula espera
  
  alertModal.success('Progreso Guardado', 'Los datos de autonomía se actualizaron correctamente.')
  console.log('✅ Datos de autonomía guardados exitosamente')
  // --- FIN DE SIMULACIÓN DE API ---

  isSubmitting.value = false
}
</script>

<style scoped>
/* Pequeño truco para asegurar que el label estilizado
  muestre el anillo de foco cuando el input (sr-only) lo reciba.
*/
input[type="radio"]:focus-visible + label {
  outline: 2px solid theme('colors.blue.500');
  outline-offset: 2px;
}
</style>