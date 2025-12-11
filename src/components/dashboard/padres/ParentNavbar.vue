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
        
        <!-- 🔥 Indicador de rol con color personalizado -->
        <div class="hidden lg:flex items-center space-x-2">
          <div class="w-2 h-2 rounded-full bg-parent-500 animate-pulse-soft"></div>
          <span class="text-sm font-medium text-parent-700">Portal Familia</span>
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
          <!-- Badge -->
          <span class="absolute top-1 right-1 w-2 h-2 bg-parent-500 rounded-full animate-pulse-soft"></span>
        </button>

        <!-- 
          AQUÍ ESTÁ LA CORRECCIÓN:
          He eliminado el <div class="relative"> y el <button> duplicados.
          Ahora solo está el componente <UserDropdown>.
        -->
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
import { computed } from 'vue'
import { useRouter } from 'vue-router' // <-- Se importa useRouter
import { useAuth } from '@/composables/useAuth'
import UserDropdown from './UserDropdown.vue' // <-- Importa el nuevo componente

defineProps<{
  isSidebarOpen: boolean
}>()

defineEmits<{
  'toggle-sidebar': []
}>()

const { user , logout } = useAuth() // <-- Corregido
const router = useRouter() // <-- Se instancia el router

const userName = computed(() => user.value?.name || 'Usuario')
const userInitials = computed(() => {
  const name = userName.value
  const parts = name.split(' ')
  return parts.map(p => p[0]).join('').slice(0, 2).toUpperCase()
})

// 3. Crea la función que maneja el evento 'logout'
const handleLogout = async () => {
  try {
    await logout()
    router.push('/login') // Redirige al login
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}
</script>