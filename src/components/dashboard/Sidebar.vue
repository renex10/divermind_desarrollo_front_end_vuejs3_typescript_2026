<template>
  <!-- src/components/dashboard/Sidebar.vue -->
  <aside :class="sidebarClasses">
    <!-- Header del sidebar -->
    <div class="sidebar-header">
      <!-- Logo con animación -->
      <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 scale-90"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-90"
      >
        <img 
          v-if="isOpen" 
          :src="logo" 
          alt="Divermind" 
          class="sidebar-logo" 
        />
      </Transition>
      
      <!-- Toggle button (solo visible en desktop) -->
      <button 
        v-if="!isMobile"
        @click="toggleSidebar" 
        class="sidebar-toggle-btn"
        :aria-label="isOpen ? 'Colapsar sidebar' : 'Expandir sidebar'"
      >
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 rotate-90"
          enter-to-class="opacity-100 rotate-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 rotate-0"
          leave-to-class="opacity-0 -rotate-90"
          mode="out-in"
        >
          <ChevronDoubleLeftIcon v-if="isOpen" class="h-5 w-5" />
          <ChevronDoubleRightIcon v-else class="h-5 w-5" />
        </Transition>
      </button>

      <!-- Close button (solo móvil) -->
      <button 
        v-if="isMobile && isOpen"
        @click="closeSidebar" 
        class="sidebar-close-btn"
        aria-label="Cerrar menú"
      >
        <XMarkIcon class="h-6 w-6" />
      </button>
    </div>
    
    <!-- Navegación principal con scroll -->
    <nav class="sidebar-nav">
      <div class="sidebar-nav-content">
        <NavigationItem 
          v-for="item in navigation" 
          :key="item.name" 
          :item="item" 
          :isSidebarOpen="isOpen"
          :showTooltip="!isOpen && !isMobile"
          class="nav-item"
        />
      </div>
    </nav>
    
    <!-- Footer del sidebar -->
    <div class="sidebar-footer">
      <!-- User profile content goes here -->
    </div>
  </aside>

  <!-- Mobile overlay -->
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="isOpen && isMobile" 
      @click="closeSidebar"
      class="sidebar-overlay"
      aria-label="Cerrar menú"
    ></div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { 
  ChevronDoubleLeftIcon, 
  ChevronDoubleRightIcon,
  XMarkIcon 
} from '@heroicons/vue/24/outline'
import NavigationItem from './NavigationItem.vue'
import logo from '@/assets/dashboard/logo-horizontal-dashboard.png'

// ==========================
// PROPS & EMITS
// ==========================

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle'): void
  (e: 'update:isOpen', value: boolean): void
}>()

// ==========================
// STATE & AUTH
// ==========================

const isMobile = ref(false)
const isTablet = ref(false)

// ✅ Auth composable disponible si se necesita en el futuro
// const { user } = useAuth()

// ==========================
// NAVEGACIÓN CON BADGES
// ==========================

const navigation = ref([
  { 
    name: 'Dashboard', 
    to: { name: 'dashboard' }, 
    icon: 'HomeIcon',
    badge: null
  },
  { 
    name: 'Gestión NNA', 
    to: { name: 'lista-nna' }, 
    icon: 'SparklesIcon', 
    badge: null 
  },
  { 
    name: 'Histos', 
    to: { name: 'histos' }, 
    icon: 'DocumentTextIcon',
    badge: null
  },
  { 
    name: 'Sesiones', 
    to: { name: 'sesiones' }, 
    icon: 'ChatBubbleLeftRightIcon',
    badge: 3 
  },
  { 
    name: 'Reportes', 
    to: { name: 'reportes' }, 
    icon: 'ChartBarIcon',
    badge: null
  },
  { 
    name: 'Configuración', 
    to: { name: 'configuracion' }, 
    icon: 'Cog6ToothIcon',
    badge: null
  },
  { 
    name: 'Establecimientos', 
    to: { name: 'establecimientos' }, 
    icon: 'BuildingStorefrontIcon',
    badge: null
  },
])

// ==========================
// COMPUTED
// ==========================

const sidebarClasses = computed(() => {
  const baseClasses = 'sidebar'
  
  if (isMobile.value) {
    return [
      baseClasses,
      'sidebar-mobile',
      props.isOpen ? 'sidebar-mobile-open' : 'sidebar-mobile-closed'
    ]
  }
  
  if (isTablet.value) {
    return [
      baseClasses,
      'sidebar-tablet',
      props.isOpen ? 'sidebar-tablet-expanded' : 'sidebar-tablet-collapsed'
    ]
  }
  
  return [
    baseClasses,
    'sidebar-desktop',
    props.isOpen ? 'sidebar-desktop-expanded' : 'sidebar-desktop-collapsed'
  ]
})

// ==========================
// METHODS
// ==========================

const toggleSidebar = () => {
  emit('toggle')
  saveSidebarState(!props.isOpen)
}

const closeSidebar = () => {
  emit('update:isOpen', false)
}

// ✅ PERSISTENCIA EN LOCALSTORAGE
const saveSidebarState = (isOpen: boolean) => {
  if (!isMobile.value) {
    localStorage.setItem('sidebar-state', JSON.stringify({ isOpen }))
  }
}

const loadSidebarState = () => {
  try {
    const saved = localStorage.getItem('sidebar-state')
    if (saved) {
      const { isOpen } = JSON.parse(saved)
      return isOpen
    }
  } catch (error) {
    console.error('Error loading sidebar state:', error)
  }
  return true // Default: expandido en desktop
}

// ✅ DETECCIÓN DE TAMAÑO DE PANTALLA
const checkScreenSize = () => {
  const width = window.innerWidth
  
  isMobile.value = width < 768
  isTablet.value = width >= 768 && width < 1024
  
  if (isMobile.value) {
    emit('update:isOpen', false)
  } else if (isTablet.value) {
    emit('update:isOpen', false)
  } else {
    const savedState = loadSidebarState()
    emit('update:isOpen', savedState)
  }
}

// ✅ KEYBOARD NAVIGATION
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isMobile.value && props.isOpen) {
    closeSidebar()
  }
}

// ==========================
// WATCHERS
// ==========================

watch(() => props.isOpen, (newVal) => {
  if (!isMobile.value) {
    saveSidebarState(newVal)
  }
})

// ==========================
// LIFECYCLE
// ==========================

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
  window.removeEventListener('keydown', handleKeyPress)
})
</script>

<style scoped>
/* ==========================
   BASE STYLES
   ========================== */

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #132441 0%, #1a2951 100%);
  color: white;
  z-index: 50;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* ==========================
   HEADER
   ========================== */

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 64px;
}

.sidebar-logo {
  height: 2rem;
  transition: all 0.3s ease;
}

.sidebar-toggle-btn,
.sidebar-close-btn {
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sidebar-toggle-btn:hover,
.sidebar-close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar-toggle-btn:focus,
.sidebar-close-btn:focus {
  outline: 2px solid #60a5fa;
  outline-offset: 2px;
}

/* ==========================
   NAVIGATION
   ========================== */

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 1.5rem;
  padding-bottom: 1rem;
}

.sidebar-nav-content {
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

/* Scrollbar styling */
.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* ==========================
   FOOTER
   ========================== */

.sidebar-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* User Profile */
.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.user-profile:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-avatar,
.user-avatar-collapsed {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
}

.user-avatar-collapsed {
  margin: 0 auto;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: white;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  font-size: 0.875rem;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* System Version */
.system-version {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.version-badge,
.version-badge-collapsed {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.version-badge-collapsed {
  margin: 0 auto;
}

.version-text {
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
}

.version-info {
  flex: 1;
  min-width: 0;
}

.version-title {
  font-weight: 600;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
}

.version-status {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

/* ==========================
   OVERLAY (MOBILE)
   ========================== */

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 40;
  backdrop-filter: blur(2px);
}

/* ==========================
   RESPONSIVE: MOBILE
   ========================== */

@media (max-width: 767px) {
  .sidebar-mobile {
    width: 280px;
    transform: translateX(-100%);
  }

  .sidebar-mobile-open {
    transform: translateX(0);
  }

  .sidebar-mobile-closed {
    transform: translateX(-100%);
  }
}

/* ==========================
   RESPONSIVE: TABLET
   ========================== */

@media (min-width: 768px) and (max-width: 1023px) {
  .sidebar-tablet {
    width: 4rem; /* 64px - solo iconos */
  }

  .sidebar-tablet-expanded {
    width: 16rem; /* 256px - expandido temporalmente */
  }

  .sidebar-tablet-collapsed {
    width: 4rem;
  }
}

/* ==========================
   RESPONSIVE: DESKTOP
   ========================== */

@media (min-width: 1024px) {
  .sidebar-desktop-expanded {
    width: 16rem; /* 256px */
  }

  .sidebar-desktop-collapsed {
    width: 4rem; /* 64px */
  }
}

/* ==========================
   ANIMATIONS
   ========================== */

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}
</style>