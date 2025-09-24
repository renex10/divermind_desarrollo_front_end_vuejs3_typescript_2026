<template>
  <div class="relative">
    <div class="relative">
      <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        v-model="searchQuery"
        @input="handleSearch"
        @focus="showResults = true"
        @blur="handleBlur"
        type="text"
        placeholder="Buscar en el sistema..."
        class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
      />
      <div v-if="isSearching" class="absolute right-3 top-1/2 transform -translate-y-1/2">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
      </div>
    </div>

    <!-- Resultados de búsqueda -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div v-if="showResults && (searchResults.length > 0 || searchQuery.length > 0)" 
           class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
        <div v-if="searchQuery.length === 0" class="p-4 text-gray-500 text-center">
          Ingresa al menos un carácter para buscar
        </div>
        
        <div v-else-if="searchResults.length === 0 && !isSearching" class="p-4 text-gray-500 text-center">
          No se encontraron resultados para "{{ searchQuery }}"
        </div>
        
        <div v-else class="divide-y divide-gray-100">
          <div v-for="result in searchResults" :key="result.id" 
               @mousedown="selectResult(result)"
               class="p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <component :is="getIcon(result.type)" class="h-5 w-5 text-gray-400" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ result.title }}</p>
                <p class="text-sm text-gray-500 truncate">{{ result.subtitle }}</p>
              </div>
              <div class="flex-shrink-0">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      :class="getTypeColor(result.type)">
                  {{ getTypeLabel(result.type) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  MagnifyingGlassIcon,
  UserIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  BuildingStorefrontIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'

interface SearchResult {
  id: string
  title: string
  subtitle: string
  type: 'user' | 'document' | 'session' | 'report' | 'establishment' | 'setting'
  route?: string
  action?: () => void
}

const router = useRouter()
const searchQuery = ref('')
const showResults = ref(false)
const isSearching = ref(false)
const searchTimeout = ref<number | undefined>()
// Mock data - en producción vendría de una API
const mockData: SearchResult[] = [
  { id: '1', title: 'Tomás Valenzuela', subtitle: 'Estudiante - 7° Básico', type: 'user', route: '/histos' },
  { id: '2', title: 'Pedro Fuentes', subtitle: 'Estudiante - 5° Básico - TEA', type: 'user', route: '/histos' },
  { id: '3', title: 'Sesión con María González', subtitle: 'Programada para hoy 15:00', type: 'session', route: '/sessiones' },
  { id: '4', title: 'Reporte Mensual Marzo', subtitle: 'Informe de seguimiento', type: 'report', route: '/reportes' },
  { id: '5', title: 'Escuela San Pedro', subtitle: 'Establecimiento educacional', type: 'establishment', route: '/establecimientos' },
  { id: '6', title: 'Configuración de notificaciones', subtitle: 'Ajustes del sistema', type: 'setting', route: '/configuracion' }
]

const searchResults = ref<SearchResult[]>([])

const handleSearch = () => {
  isSearching.value = true
  
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(() => {
    if (searchQuery.value.trim().length === 0) {
      searchResults.value = []
    } else {
      // Simular búsqueda
      searchResults.value = mockData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    }
    isSearching.value = false
  }, 300)
}

const handleBlur = () => {
  // Pequeño delay para permitir clicks en resultados
  setTimeout(() => {
    showResults.value = false
  }, 200)
}

const selectResult = (result: SearchResult) => {
  if (result.route) {
    router.push(result.route)
  } else if (result.action) {
    result.action()
  }
  
  searchQuery.value = result.title
  showResults.value = false
}

const getIcon = (type: string) => {
  const icons = {
    user: UserIcon,
    document: DocumentTextIcon,
    session: ChatBubbleLeftRightIcon,
    report: ChartBarIcon,
    establishment: BuildingStorefrontIcon,
    setting: Cog6ToothIcon
  }
  return icons[type as keyof typeof icons] || UserIcon
}

const getTypeColor = (type: string) => {
  const colors = {
    user: 'bg-blue-100 text-blue-800',
    document: 'bg-green-100 text-green-800',
    session: 'bg-purple-100 text-purple-800',
    report: 'bg-yellow-100 text-yellow-800',
    establishment: 'bg-indigo-100 text-indigo-800',
    setting: 'bg-gray-100 text-gray-800'
  }
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const getTypeLabel = (type: string) => {
  const labels = {
    user: 'Estudiante',
    document: 'Documento',
    session: 'Sesión',
    report: 'Reporte',
    establishment: 'Centro',
    setting: 'Configuración'
  }
  return labels[type as keyof typeof labels] || 'Desconocido'
}

onUnmounted(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})
</script>