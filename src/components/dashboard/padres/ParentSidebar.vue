<template>
  <aside
    :class="[
      'fixed top-0 left-0 h-screen transition-all duration-300 ease-smooth z-40',
      isOpen ? 'w-64' : 'w-16',
      'bg-gradient-to-b from-sky-500 to-blue-600',
      'shadow-xl'
    ]"
  >
    <div class="flex items-center justify-between p-4 border-b border-white/20">
      <div 
        v-if="isOpen"
        class="flex items-center space-x-3"
      >
        <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <div>
          <h1 class="text-white font-bold text-lg">Portal</h1>
          <p class="text-blue-100 text-xs">Familia</p>
        </div>
      </div>
      
      <button
        @click="$emit('toggle')"
        :class="[
          'p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white',
          'transition-all duration-200 hover:scale-110',
          !isOpen && 'mx-auto'
        ]"
        :title="isOpen ? 'Contraer menú' : 'Expandir menú'"
      >
        <ChevronDoubleLeftIcon 
          :class="['w-5 h-5 transition-transform duration-300', { 'rotate-180': !isOpen }]"
        />
      </button>
    </div>

    <nav class="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
      <router-link
        v-for="item in menuItems"
        :key="item.name"
        :to="item.route"
        v-slot="{ isActive }"
        class="block"
      >
        <div
          :class="[
            'flex items-center p-3 rounded-xl transition-all duration-200',
            item.name === 'ejecucion' ? 'bg-amber-400/20 border border-amber-400/30' : 'hover:bg-white/15 group',
            isActive 
              ? 'bg-white/25 text-white shadow-md backdrop-blur-sm' 
              : 'text-blue-50 hover:text-white',
            !isOpen && 'justify-center',
            isOpen && 'space-x-3'
          ]"
          :title="!isOpen ? item.label : ''"
        >
          <component
            :is="item.icon"
            :class="[
              'w-6 h-6 flex-shrink-0 transition-transform duration-200',
              item.name === 'ejecucion' ? 'text-amber-300' : '',
              isActive ? 'scale-110' : 'group-hover:scale-110'
            ]"
          />
          
          <span
            v-if="isOpen"
            :class="['font-medium text-sm flex-1', item.name === 'ejecucion' ? 'text-amber-100' : '']"
          >
            {{ item.label }}
          </span>
          
          <span
            v-if="isOpen && item.badge && item.badge > 0"
            class="ml-auto px-2 py-0.5 text-xs font-bold rounded-full bg-white text-blue-600 shadow-sm"
          >
            {{ item.badge }}
          </span>
        </div>
      </router-link>
    </nav>

    <div class="p-4 border-t border-white/20">
      <div 
        :class="[
          'flex items-center p-3 rounded-xl bg-white/15 backdrop-blur-sm',
          'transition-all duration-200 hover:bg-white/25 cursor-pointer group',
          !isOpen && 'justify-center',
          isOpen && 'space-x-3'
        ]"
        @click="toggleUserMenu"
      >
        <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold flex-shrink-0 shadow-md">
          {{ userInitials }}
        </div>
        
        <div v-if="isOpen" class="flex-1 min-w-0">
          <p class="text-white text-sm font-medium truncate">{{ userName }}</p>
          <p class="text-blue-100 text-xs">Padre/Apoderado</p>
        </div>
        
        <ChevronDownIcon
          v-if="isOpen"
          :class="[
            'w-4 h-4 text-blue-100 flex-shrink-0 transition-transform duration-200',
            showUserMenu && 'rotate-180'
          ]"
        />
      </div>
      
      <transition name="fade-scale">
        <div
          v-if="showUserMenu && isOpen"
          class="mt-2 p-2 rounded-xl bg-white/10 backdrop-blur-sm animate-slide-up"
        >
          <button
            @click="handleLogout"
            class="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-white/15 text-blue-50 hover:text-white transition-all duration-200 group"
          >
            <ArrowRightOnRectangleIcon class="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            <span class="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </transition>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

// IMPORTACIÓN DE HEROICONS V2
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  PlayCircleIcon, // ✅ NUEVO: Icono para Ejecución
  BeakerIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ChevronDoubleLeftIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

// Props
defineProps<{
  isOpen: boolean
}>()

// Emits
defineEmits<{
  toggle: []
}>()

const { user, logout } = useAuth()
const router = useRouter()
const showUserMenu = ref(false)

const userName = computed(() => user.value?.name || 'Usuario')
const userInitials = computed(() => {
  const name = userName.value
  const parts = name.split(' ')
  return parts.map(p => p[0]).join('').slice(0, 2).toUpperCase()
})

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleLogout = async () => {
  try {
    await logout()
    router.push({ name: 'login' })
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}

// CONFIGURACIÓN DE MENÚ ACTUALIZADA
const menuItems = [
  {
    name: 'dashboard',
    label: 'Inicio',
    route: { name: 'parent-dashboard' },
    icon: HomeIcon,
    badge: 0
  },
  {
    name: 'mis-hijos',
    label: 'Mis Hijos',
    route: { name: 'parent-mis-hijos' },
    icon: UsersIcon,
    badge: 0
  },
  {
    name: 'registro-diario',
    label: 'Registro Diario',
    route: { name: 'parent-registro-diario' },
    icon: ClipboardDocumentListIcon,
    badge: 0
  },
  {
    name: 'rutinas',
    label: 'Rutinas',
    route: { name: 'parent-rutinas' },
    icon: ClipboardDocumentCheckIcon,
    badge: 0
  },
  /**
   * ✅ NUEVO ELEMENTO: MODO ENFOQUE
   * Este acceso directo lleva al padre a la lista de rutinas para iniciar una ejecución.
   * Se le da un estilo visualmente distinto para resaltar la nueva funcionalidad.
   */
  {
    name: 'ejecucion',
    label: 'Modo Enfoque',
    route: { name: 'parent-rutinas' }, // Redirige a la agenda para seleccionar qué ejecutar
    icon: PlayCircleIcon,
    badge: 0
  },
  {
    name: 'medicacion',
    label: 'Medicación',
    route: { name: 'parent-medicacion' },
    icon: BeakerIcon,
    badge: 0
  },
  {
    name: 'mensajes',
    label: 'Mensajes',
    route: { name: 'parent-mensajes' },
    icon: ChatBubbleLeftRightIcon,
    badge: 3
  },
  {
    name: 'reportes',
    label: 'Reportes',
    route: { name: 'parent-reportes' },
    icon: DocumentTextIcon,
    badge: 0
  },
  {
    name: 'configuracion',
    label: 'Configuración',
    route: { name: 'parent-configuracion' },
    icon: Cog6ToothIcon,
    badge: 0
  }
]
</script>

<style scoped>
/* Scrollbar personalizado */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

/* Animaciones */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.2s ease;
}
.fade-scale-enter-from, .fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}
</style>