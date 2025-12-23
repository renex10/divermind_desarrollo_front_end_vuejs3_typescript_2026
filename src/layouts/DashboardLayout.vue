<template>
  <!-- src/layouts/DashboardLayout.vue -->
  <div class="dashboard-layout">
    <!-- Sidebar con v-model para sincronización bidireccional -->
    <Sidebar 
      :isOpen="isSidebarOpen" 
      @toggle="toggleSidebar"
      @update:isOpen="handleSidebarUpdate"
    />
    
    <!-- Contenedor principal -->
    <div class="main-container" :class="mainContainerClasses">
      <!-- Top Navbar -->
      <TopNavbar 
        :isSidebarOpen="isSidebarOpen" 
        @toggle-sidebar="toggleSidebar" 
      />
      
      <!-- Main Content -->
      <main class="main-content">
        <div class="content-wrapper">
          <!-- Router View con transiciones -->
          <Transition
            :name="transitionName"
            mode="out-in"
            @before-enter="beforeEnter"
            @after-enter="afterEnter"
          >
            <router-view v-slot="{ Component }">
              <component :is="Component" :key="$route.fullPath" />
            </router-view>
          </Transition>
        </div>
      </main>
    </div>

    <!-- Modales globales -->
    <SessionWarningModal
      :visible="showWarningModal"
      :onKeepAlive="keepSessionAlive"
    />

    <!-- Toast Container -->
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '../components/dashboard/Sidebar.vue'
import TopNavbar from '../components/dashboard/TopNavbar.vue'
import SessionWarningModal from '@/components/modal/SessionWarningModal.vue'
import ToastContainer from '@/components/toastglobal/ToastContainer.vue'
import { useInactivityLogout } from '@/composables/useInactivityLogout'

// ==========================
// STATE
// ==========================

const route = useRoute()
const isSidebarOpen = ref(true)
const isMobile = ref(false)
const isTablet = ref(false)
const transitionName = ref('fade')
const isTransitioning = ref(false)

// ✅ Activar cierre de sesión por inactividad
const { showWarningModal, keepSessionAlive } = useInactivityLogout(20 * 60 * 1000)

// ==========================
// COMPUTED
// ==========================

const mainContainerClasses = computed(() => {
  const classes = ['main-container-base']
  
  if (isMobile.value) {
    classes.push('main-container-mobile')
  } else if (isTablet.value) {
    classes.push('main-container-tablet')
  } else {
    // Desktop
    classes.push(isSidebarOpen.value ? 'main-container-desktop-expanded' : 'main-container-desktop-collapsed')
  }
  
  return classes
})

// ==========================
// METHODS
// ==========================

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const handleSidebarUpdate = (value: boolean) => {
  isSidebarOpen.value = value
}

const checkScreenSize = () => {
  const width = window.innerWidth
  
  const wasMobile = isMobile.value
  const wasTablet = isTablet.value
  
  isMobile.value = width < 768
  isTablet.value = width >= 768 && width < 1024
  
  // Ajustar sidebar según el tamaño de pantalla
  if (isMobile.value || isTablet.value) {
    // En móvil y tablet, el sidebar se controla desde el componente Sidebar
    // No forzamos cambios aquí
  } else {
    // En desktop, cargar estado guardado si es la primera carga
    if (wasMobile || wasTablet) {
      const saved = loadSidebarState()
      if (saved !== null) {
        isSidebarOpen.value = saved
      } else {
        isSidebarOpen.value = true // Default en desktop
      }
    }
  }
}

const loadSidebarState = (): boolean | null => {
  try {
    const saved = localStorage.getItem('sidebar-state')
    if (saved) {
      const { isOpen } = JSON.parse(saved)
      return isOpen
    }
  } catch (error) {
    console.error('Error loading sidebar state:', error)
  }
  return null
}

const beforeEnter = () => {
  isTransitioning.value = true
}

const afterEnter = () => {
  isTransitioning.value = false
}

// ==========================
// WATCHERS
// ==========================

watch(() => route.path, (newPath, oldPath) => {
  // Determinar la dirección de la transición
  if (newPath.length > oldPath.length) {
    transitionName.value = 'slide-left'
  } else if (newPath.length < oldPath.length) {
    transitionName.value = 'slide-right'
  } else {
    transitionName.value = 'fade'
  }
})

// ==========================
// LIFECYCLE
// ==========================

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped>
/* ==========================
   LAYOUT BASE
   ========================== */

.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  overflow: hidden;
}

/* ==========================
   MAIN CONTAINER
   ========================== */

.main-container-base {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mobile: Sin margen (sidebar en overlay) */
.main-container-mobile {
  margin-left: 0;
}

/* Tablet: Margen para sidebar colapsado */
.main-container-tablet {
  margin-left: 4rem; /* 64px */
}

/* Desktop Expandido */
.main-container-desktop-expanded {
  margin-left: 16rem; /* 256px */
}

/* Desktop Colapsado */
.main-container-desktop-collapsed {
  margin-left: 4rem; /* 64px */
}

/* ==========================
   MAIN CONTENT
   ========================== */

.main-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: #f8fafc;
}

.content-wrapper {
  padding: 1.5rem;
  max-width: 1600px;
  margin: 0 auto;
}

/* ==========================
   SCROLLBAR
   ========================== */

.main-content {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.main-content::-webkit-scrollbar {
  width: 6px;
}

.main-content::-webkit-scrollbar-track {
  background: #f7fafc;
}

.main-content::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background-color: #a0aec0;
}

/* ==========================
   PAGE TRANSITIONS
   ========================== */

/* Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide Left */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Slide Right */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* ==========================
   RESPONSIVE
   ========================== */

/* Mobile optimizations */
@media (max-width: 767px) {
  .content-wrapper {
    padding: 1rem;
  }
}

/* Tablet optimizations */
@media (min-width: 768px) and (max-width: 1023px) {
  .content-wrapper {
    padding: 1.25rem;
  }
}

/* Large screens */
@media (min-width: 1920px) {
  .content-wrapper {
    max-width: 1800px;
  }
}

/* ==========================
   ACCESSIBILITY
   ========================== */

@media (prefers-reduced-motion: reduce) {
  .main-container-base,
  .fade-enter-active,
  .fade-leave-active,
  .slide-left-enter-active,
  .slide-left-leave-active,
  .slide-right-enter-active,
  .slide-right-leave-active {
    transition: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .main-content {
    background: white;
  }
}
</style>