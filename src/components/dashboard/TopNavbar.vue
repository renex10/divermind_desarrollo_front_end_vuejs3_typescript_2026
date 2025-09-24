<template>
  <!-- src\components\dashboard\TopNavbar.vue -->
  <header class="bg-white shadow-lg border-b border-gray-200/60 backdrop-blur-sm relative z-40">
    <div class="flex items-center justify-between px-4 py-3 sm:px-6">
      
      <!-- Lado izquierdo: Toggle sidebar y título -->
      <div class="flex items-center space-x-4">
        <button 
          @click="$emit('toggle-sidebar')" 
          class="group p-2 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transform hover:scale-105"
        >
          <Bars3Icon class="h-6 w-6 transition-transform duration-200 group-hover:rotate-180" />
        </button>
        
        <div class="hidden sm:block">
          <h1 class="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {{ currentRouteName }}
          </h1>
          <p class="text-sm text-gray-500 mt-0.5">{{ getRouteDescription }}</p>
        </div>
      </div>
      
      <!-- Lado derecho: Buscador, notificaciones y perfil -->
      <div class="flex items-center space-x-3">
        
        <!-- Buscador desktop -->
        <div class="hidden md:block relative">
          <div class="w-80 lg:w-96">
            <SearchBar />
          </div>
        </div>
        
        <!-- Botón de búsqueda móvil -->
        <button 
          @click="toggleMobileSearch"
          class="md:hidden p-2.5 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
        >
          <MagnifyingGlassIcon class="h-5 w-5" />
        </button>
        
        <!-- Separador visual -->
        <div class="hidden sm:block w-px h-6 bg-gray-200"></div>
        
        <!-- Notificaciones -->
        <div class="relative">
          <NotificationsBell />
        </div>
        
        <!-- Separador visual -->
        <div class="hidden sm:block w-px h-6 bg-gray-200"></div>
        
        <!-- Menú de perfil -->
        <div class="relative">
          <button 
            @click="toggleProfileMenu" 
            class="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 group"
            :class="{ 'bg-gray-50 ring-2 ring-blue-500/20': isProfileMenuOpen }"
          >
            <div class="relative">
              <img 
                :src="userImage" 
                class="h-9 w-9 rounded-full border-2 border-white shadow-md transition-all duration-300 group-hover:shadow-lg" 
                alt="User profile"
                @error="handleImageError"
              />
              <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
            </div>
            
            <div class="hidden md:block text-left">
              <span class="text-sm font-semibold text-gray-800">{{ userName }}</span>
              <div class="text-xs text-gray-500 flex items-center space-x-2">
                <span>{{ userRole }}</span>
                <span class="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span class="text-green-600">En línea</span>
              </div>
            </div>
            
            <ChevronDownIcon 
              class="h-4 w-4 text-gray-500 transition-all duration-300 group-hover:text-blue-600"
              :class="{ 'transform rotate-180 text-blue-600': isProfileMenuOpen }" 
            />
          </button>
          
          <!-- Menú desplegable de perfil -->
          <Transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 scale-95 translate-y-2"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-2"
          >
            <div 
              v-if="isProfileMenuOpen" 
              class="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 z-50 overflow-hidden"
            >
              <!-- Header del perfil -->
              <div class="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                <div class="flex items-center space-x-3">
                  <img 
                    :src="userImage" 
                    class="h-12 w-12 rounded-full border-3 border-white shadow-md" 
                    alt="User profile" 
                  />
                  <div>
                    <p class="text-base font-semibold text-gray-900">{{ userName }}</p>
                    <p class="text-sm text-gray-600">{{ userEmail }}</p>
                  </div>
                </div>
                
                <!-- Badges de estado y rol -->
                <div class="mt-3 flex items-center space-x-2">
                  <span 
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                    :class="userStatusClass"
                  >
                    <div class="w-1.5 h-1.5 bg-current rounded-full mr-2 animate-pulse"></div>
                    {{ userStatusText }}
                  </span>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ userRole }}
                  </span>
                </div>
              </div>
              
              <!-- Opciones del menú -->
              <div class="py-2">
                <a 
                  href="#" 
                  @click.prevent="handleProfileClick"
                  class="flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-all duration-200 group"
                >
                  <UserCircleIcon class="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                  <span>Mi Perfil</span>
                  <ChevronRightIcon class="h-4 w-4 ml-auto text-gray-300 group-hover:text-blue-400 transition-colors duration-200" />
                </a>
                
                <a 
                  href="#" 
                  @click.prevent="handleSettingsClick"
                  class="flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-all duration-200 group"
                >
                  <Cog6ToothIcon class="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                  <span>Configuración</span>
                  <ChevronRightIcon class="h-4 w-4 ml-auto text-gray-300 group-hover:text-blue-400 transition-colors duration-200" />
                </a>
                
                <a 
                  href="#" 
                  @click.prevent="handleHelpClick"
                  class="flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-all duration-200 group"
                >
                  <QuestionMarkCircleIcon class="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                  <span>Ayuda y Soporte</span>
                  <ChevronRightIcon class="h-4 w-4 ml-auto text-gray-300 group-hover:text-blue-400 transition-colors duration-200" />
                </a>
              </div>
              
              <!-- Separador -->
              <div class="border-t border-gray-100"></div>
              
              <!-- Cerrar sesión -->
              <div class="py-2">
                <button 
                  @click="handleLogout"
                  class="flex items-center w-full px-6 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
                >
                  <ArrowRightOnRectangleIcon class="h-5 w-5 mr-3 text-red-500 group-hover:text-red-600 transition-colors duration-200" />
                  <span class="font-medium">Cerrar sesión</span>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
    
    <!-- Buscador móvil expandible -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div 
        v-if="showMobileSearch" 
        class="md:hidden px-4 pb-4 border-t border-gray-200/60 bg-gradient-to-r from-gray-50 to-blue-50/30"
      >
        <div class="mt-3">
          <SearchBar />
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Bars3Icon, 
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'
import SearchBar from './SearchBar.vue'
import NotificationsBell from './NotificationsBell.vue'

// Importamos el composable de autenticación
import { useAuth } from '@/composables/useAuth'

// Props y emits
defineEmits(['toggle-sidebar'])

// Composables
const route = useRoute()
const router = useRouter()
const { logout } = useAuth()

// Estados reactivos
const isProfileMenuOpen = ref(false)
const showMobileSearch = ref(false)

// Datos del usuario autenticado
const userData = ref({
  name: '',
  email: '',
  role: '',
  status: 'online',
  image: ''
})

// Al montar, cargamos el usuario desde localStorage
onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser)
      userData.value = {
        name: parsedUser.name || 'Usuario',
        email: parsedUser.email || 'correo@ejemplo.com',
        // 👇 Aquí usamos roles[0] porque tu backend devuelve un array
        role: parsedUser.roles?.[0] || 'Rol no asignado',
        status: 'online',
        image: parsedUser.image || ''
      }
    } catch (e) {
      console.error('Error al parsear usuario:', e)
    }
  }
})

// Computed properties
const currentRouteName = computed(() => {
  const routeNames: Record<string, string> = {
    'dashboard': 'Dashboard',
    'ingreso-nna': 'Ingreso NNA',
    'histos': 'Historiales',
    'sessiones': 'Sesiones',
    'reportes': 'Reportes',
    'configuracion': 'Configuración',
    'establecimientos': 'Establecimientos'
  }
  return routeNames[route.name as string] || 'Sistema'
})

const getRouteDescription = computed(() => {
  const descriptions: Record<string, string> = {
    'dashboard': 'Panel principal del sistema',
    'ingreso-nna': 'Registro de nuevos casos',
    'histos': 'Gestión de historiales clínicos',
    'sessiones': 'Programación de sesiones',
    'reportes': 'Análisis y estadísticas',
    'configuracion': 'Ajustes del sistema',
    'establecimientos': 'Gestión de centros'
  }
  return descriptions[route.name as string] || 'Navegación del sistema'
})

const userName = computed(() => userData.value.name)
const userEmail = computed(() => userData.value.email)
const userRole = computed(() => userData.value.role) // 👈 rol dinámico
const userImage = computed(() => 
  userData.value.image || 
  `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.value.name || 'U')}&background=3B82F6&color=fff&size=128`
)

const userStatusClass = computed(() => {
  const statusClasses: Record<string, string> = {
    'online': 'bg-green-100 text-green-800',
    'away': 'bg-yellow-100 text-yellow-800',
    'busy': 'bg-red-100 text-red-800',
    'offline': 'bg-gray-100 text-gray-800'
  }
  return statusClasses[userData.value.status] || 'bg-gray-100 text-gray-800'
})

const userStatusText = computed(() => {
  const statusTexts: Record<string, string> = {
    'online': 'En línea',
    'away': 'Ausente',
    'busy': 'Ocupado',
    'offline': 'Desconectado'
  }
  return statusTexts[userData.value.status] || 'Desconocido'
})

// Métodos
const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value
}

const toggleMobileSearch = () => {
  showMobileSearch.value = !showMobileSearch.value
}

const handleImageError = () => {
  userData.value.image = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.value.name || 'U')}&background=3B82F6&color=fff&size=128`
}

const handleProfileClick = () => {
  isProfileMenuOpen.value = false
  router.push({ name: 'profile' })
}

const handleSettingsClick = () => {
  isProfileMenuOpen.value = false
  router.push({ name: 'configuracion' })
}

const handleHelpClick = () => {
  isProfileMenuOpen.value = false
  console.log('Abrir ayuda')
}

const handleLogout = async () => {
  isProfileMenuOpen.value = false
  await logout()
}

// Cerrar menús al hacer clic fuera
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (isProfileMenuOpen.value && !target.closest('.relative')) {
    isProfileMenuOpen.value = false
  }
  if (showMobileSearch.value && !target.closest('header')) {
    showMobileSearch.value = false
  }
}

// Cerrar menús con tecla Escape
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    isProfileMenuOpen.value = false
    showMobileSearch.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeyDown)
})
</script>



<style scoped>
/* Estilos adicionales para mejorar la apariencia */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Animaciones suaves para los elementos interactivos */
button {
  transform-origin: center;
}

/* Estilos para el scrollbar del menú de perfil */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}

/* Efectos de hover más suaves */
.group:hover .group-hover\:rotate-180 {
  transform: rotate(180deg);
}

.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Gradientes de texto */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Sombras personalizadas */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
</style>