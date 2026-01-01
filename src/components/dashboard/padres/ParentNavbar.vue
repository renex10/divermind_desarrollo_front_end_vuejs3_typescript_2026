<template>
  <nav 
    :class="[
      'sticky top-0 z-30 transition-all duration-300',
      'bg-white border-b border-gray-200',
      'shadow-sm backdrop-blur-sm bg-white/95'
    ]"
  >
    <div class="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
      <!-- Lado izquierdo -->
      <div class="flex items-center space-x-2 sm:space-x-4 animate-slide-in-left flex-1 min-w-0">
        <!-- Botón hamburguesa (solo móvil) -->
        <button
          v-if="isMobile"
          @click="$emit('toggle-sidebar')"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex-shrink-0"
          aria-label="Toggle menu"
        >
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <!-- Badge Portal (solo desktop) -->
        <div class="hidden lg:flex items-center space-x-2 border-r border-gray-200 pr-4 flex-shrink-0">
          <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse-soft"></div>
          <span class="text-sm font-bold text-gray-700 whitespace-nowrap">Portal Familia</span>
        </div>

        <!-- Selector de niño -->
        <div v-if="misNinos.length > 1" class="flex items-center space-x-2 flex-1 min-w-0">
          <span class="hidden md:inline text-xs font-black uppercase tracking-wider text-gray-400 flex-shrink-0">
            Niño activo:
          </span>
          <select 
            v-model="ninoSeleccionado"
            @change="handleCambioNino"
            class="flex-1 min-w-0 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold bg-gray-50 border-none rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer hover:bg-gray-100 truncate"
          >
            <option v-for="nino in misNinos" :key="nino.id" :value="nino.id" class="truncate">
              {{ nino.nombre_completo }}
            </option>
          </select>
        </div>
        
        <!-- Badge niño único -->
        <div v-else-if="ninoActual" class="flex items-center space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-blue-50 rounded-lg sm:rounded-xl flex-1 min-w-0">
          <div class="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0"></div>
          <span class="text-xs sm:text-sm font-bold text-blue-700 truncate">{{ ninoActual }}</span>
        </div>
      </div>

      <!-- Lado derecho -->
      <div class="flex items-center space-x-2 sm:space-x-4 animate-slide-in-right flex-shrink-0">
        <!-- Notificaciones -->
        <button
          class="relative p-2 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-110"
          aria-label="Notificaciones"
        >
          <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span class="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <!-- Dropdown de usuario -->
        <UserDropdown
          :user-name="userName"
          :user-initials="userInitials"
          :is-mobile="isMobile"
          @logout="handleLogout"
        />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useNinoActivoStore } from '@/store/ninoActivoStore'
import { childService, type ChildInfo } from '@/services/childService'
import UserDropdown from './UserDropdown.vue'

defineProps<{
  isSidebarOpen: boolean
  isMobile: boolean
}>()

defineEmits<{
  'toggle-sidebar': []
}>()

const { user, logout } = useAuth()
const router = useRouter()
const ninoStore = useNinoActivoStore()

const misNinos = ref<ChildInfo[]>([])
const ninoSeleccionado = ref<number | null>(null)

const userName = computed(() => user.value?.name || 'Usuario')
const userInitials = computed(() => {
  const name = userName.value
  const parts = name.split(' ')
  return parts.map(p => p[0]).join('').slice(0, 2).toUpperCase()
})

const ninoActual = computed(() => 
  ninoStore.nombreCompleto !== 'Sin nombre' ? ninoStore.nombreCompleto : null
)

const cargarNinos = async () => {
  try {
    const response = await childService.getMyChildren()
    misNinos.value = response.children
    
    if (ninoStore.ninoActivoId) {
      ninoSeleccionado.value = ninoStore.ninoActivoId
    } else if (misNinos.value.length > 0) {
      handleCambioNino(misNinos.value[0].id)
    }
  } catch (error) {
    console.error('❌ Error al cargar niños:', error)
  }
}

const handleCambioNino = async (val?: any) => {
  const id = typeof val === 'number' ? val : ninoSeleccionado.value
  if (!id) return
  
  try {
    await ninoStore.setNinoActivo(id)
  } catch (error) {
    console.error('❌ Error al cambiar niño:', error)
  }
}

watch(() => ninoStore.ninoActivoId, (newId) => {
  if (newId && newId !== ninoSeleccionado.value) {
    ninoSeleccionado.value = newId
  }
})

const handleLogout = async () => {
  try {
    await logout()
    router.push('/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}

onMounted(() => {
  cargarNinos()
})
</script>

<style scoped>
.animate-slide-in-left {
  animation: slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-slide-in-right {
  animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-15px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(15px); }
  to { opacity: 1; transform: translateX(0); }
}

.animate-pulse-soft {
  animation: pulseSoft 2.5s infinite;
}

@keyframes pulseSoft {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.9); }
}

/* Truncate en select */
select option {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>