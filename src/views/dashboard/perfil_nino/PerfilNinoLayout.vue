<template>
  <div class="perfil-nino-layout">

    <div v-if="ninoStore.isLoading" class="flex justify-center items-center py-20">
      <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600 ml-4">Cargando perfil del niño...</p>
    </div>

    <div v-else-if="ninoStore.error" class="bg-red-50 border-l-4 border-red-400 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error al cargar</h3>
          <p class="text-sm text-red-700 mt-1">{{ ninoStore.error }}</p>
        </div>
      </div>
    </div>

    <div v-else-if="ninoStore.hasData">
      
      <h1 class="text-3xl font-bold text-gray-900 mb-4">
        {{ ninoStore.nombreNino }}
      </h1>

      <nav class="flex flex-wrap space-x-2 sm:space-x-4 border-b border-gray-200 mb-6">
        <router-link
          v-for="tab in tabs"
          :key="tab.name"
          :to="{ name: tab.name, params: { id: props.id } }"
          class="py-3 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap"
          active-class="border-b-2 border-blue-500 text-blue-600"
          exact-active-class="border-b-2 border-blue-500 text-blue-600"
        >
          {{ tab.label }}
        </router-link>
      </nav>

      <router-view />

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import { useNinoActivoStore } from '@/store/ninoActivoStore'

// 1. Definimos las props que recibe este componente (el :id de la URL)
const props = defineProps<{
  id: string 
}>()

// 2. Inicializamos el store del niño activo
const ninoStore = useNinoActivoStore()

// 3. Definimos la lista de pestañas que se mostrarán
// Los 'name' deben coincidir EXACTAMENTE con los nombres de las rutas en router/index.ts
const tabs = [
  { name: 'perfil-nino-resumen', label: 'Resumen' }, // Esta es la ruta 'path: ""'
  { name: 'perfil-nino-hitos', label: 'Hitos y Logros' },
  { name: 'perfil-nino-rutinas', label: 'Rutinas' },
  { name: 'perfil-nino-cognitivo', label: 'P. Cognitivo' },
  { name: 'perfil-nino-habilidades', label: 'H. Sociales' }, // Asegúrate de que este 'name' coincida con tu router
  { name: 'perfil-nino-sensorial', label: 'Sensorial' },
  { name: 'perfil-nino-comunicacion', label: 'Comunicación' },
  { name: 'perfil-nino-autonomia', label: 'Autonomía' },
  { name: 'perfil-nino-regulacion', label: 'Regulación' },
  { name: 'perfil-nino-detonantes', label: 'Detonantes' },
  { name: 'perfil-nino-tareas', label: 'Tareas' },
  { name: 'perfil-nino-sesiones', label: 'Sesiones' },
]

// 4. Ciclo de vida: Al montar el componente
onMounted(async () => {
  // Le pedimos al store que cargue los datos usando el ID de la prop
  await ninoStore.fetchNinoActivo(props.id)
})

// 5. Ciclo de vida: Al desmontar el componente (cuando el usuario sale del perfil)
onUnmounted(() => {
  // Limpiamos el store para que no se muestren datos incorrectos
  // la próxima vez que se entre al perfil de otro niño.
  ninoStore.limpiarNinoActivo()
})
</script>

<style scoped>
/* Estilo de fallback para active-class.
  'active-class' a veces es quisquilloso con las rutas anidadas,
  este 'router-link-active' es más robusto.
*/
.router-link-active {
  color: #2563eb; /* text-blue-600 */
  border-bottom-width: 2px;
  border-color: #3b82f6; /* border-blue-500 */
}
</style>