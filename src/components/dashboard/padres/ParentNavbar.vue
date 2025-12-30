<template>
  <nav 
    :class="[
      'sticky top-0 z-30 transition-all duration-300',
      'bg-white border-b border-gray-200',
      'shadow-sm backdrop-blur-sm bg-white/95'
    ]"
  >
    <div class="flex items-center justify-between px-6 py-4">
      <!-- Left: Breadcrumbs -->
      <div class="flex items-center space-x-4 animate-slide-in-left">
        <button
          @click="$emit('toggle-sidebar')"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 lg:hidden"
        >
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <!-- Indicador de rol -->
        <div class="hidden lg:flex items-center space-x-2">
          <div class="w-2 h-2 rounded-full bg-parent-500 animate-pulse-soft"></div>
          <span class="text-sm font-medium text-parent-700">Portal Familia</span>
        </div>

        <!-- ✅ NUEVO: Selector de niño -->
        <div v-if="misNinos.length > 1" class="hidden md:flex items-center space-x-2 ml-4">
          <span class="text-sm text-gray-600">Niño activo:</span>
          <select 
            v-model="ninoSeleccionado"
            @change="cambiarNino"
            class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option v-for="nino in misNinos" :key="nino.id" :value="nino.id">
              {{ nino.nombre_completo }}
            </option>
          </select>
        </div>
        <div v-else-if="ninoActual" class="hidden md:flex items-center space-x-2 ml-4 px-3 py-1.5 bg-blue-50 rounded-lg">
          <span class="text-sm font-medium text-blue-700">{{ ninoActual }}</span>
        </div>
      </div>

      <!-- Right: Actions -->
      <div class="flex items-center space-x-4 animate-slide-in-right">
        <!-- Notificaciones -->
        <button
          class="relative p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-110"
        >
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span class="absolute top-1 right-1 w-2 h-2 bg-parent-500 rounded-full animate-pulse-soft"></span>
        </button>

        <UserDropdown
          :user-name="userName"
          :user-initials="userInitials"
          @logout="handleLogout"
        />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useNinoActivoStore } from '@/store/ninoActivoStore'
import { childService, type ChildInfo } from '@/services/childService'
import UserDropdown from './UserDropdown.vue'

defineProps<{
  isSidebarOpen: boolean
}>()

defineEmits<{
  'toggle-sidebar': []
}>()

const { user, logout } = useAuth()
const router = useRouter()
const ninoStore = useNinoActivoStore()

// Estado
const misNinos = ref<ChildInfo[]>([])
const ninoSeleccionado = ref<number | null>(null)

const userName = computed(() => user.value?.name || 'Usuario')
const userInitials = computed(() => {
  const name = userName.value
  const parts = name.split(' ')
  return parts.map(p => p[0]).join('').slice(0, 2).toUpperCase()
})

const ninoActual = computed(() => ninoStore.nombreCompleto !== 'Sin nombre' ? ninoStore.nombreCompleto : null)

// ✅ Cargar lista de niños
const cargarNinos = async () => {
  try {
    const response = await childService.getMyChildren()
    misNinos.value = response.children
    
    // Establecer el niño activo actual
    if (ninoStore.ninoActivoId) {
      ninoSeleccionado.value = ninoStore.ninoActivoId
    } else if (misNinos.value.length > 0) {
      ninoSeleccionado.value = misNinos.value[0].id
    }
  } catch (error) {
    console.error('❌ Error al cargar niños:', error)
  }
}

// ✅ Cambiar niño activo
const cambiarNino = async () => {
  if (!ninoSeleccionado.value) return
  
  try {
    console.log('🔄 Cambiando niño activo a:', ninoSeleccionado.value)
    await ninoStore.setNinoActivo(ninoSeleccionado.value)
    console.log('✅ Niño activo cambiado')
    
    // Recargar la página para actualizar todos los componentes
    location.reload()
  } catch (error) {
    console.error('❌ Error al cambiar niño:', error)
  }
}

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
  animation: slideInLeft 0.3s ease-out;
}

.animate-slide-in-right {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-pulse-soft {
  animation: pulseSoft 2s ease-in-out infinite;
}

@keyframes pulseSoft {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>