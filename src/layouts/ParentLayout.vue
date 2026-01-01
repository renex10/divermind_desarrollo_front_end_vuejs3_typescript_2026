<template>
  <!-- src\layouts\ParentLayout.vue -->
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <!-- Overlay para móvil cuando sidebar está abierto -->
    <transition name="fade">
      <div
        v-if="isSidebarOpen && isMobile"
        @click="toggleSidebar"
        class="fixed inset-0 bg-black/50 z-30 lg:hidden"
        aria-label="Cerrar menú"
      ></div>
    </transition>

    <!-- Sidebar -->
    <ParentSidebar 
      v-if="!shouldHideNavigation"
      :isOpen="isSidebarOpen"
      :isMobile="isMobile"
      :isTablet="isTablet"
      @toggle="toggleSidebar"
      @close="closeSidebar"
    />
    
    <!-- Contenedor principal -->
    <div 
      class="flex-1 flex flex-col min-w-0 transition-all duration-300"
      :class="getMainContainerClasses"
    >
      <!-- Navbar -->
      <ParentNavbar 
        v-if="!shouldHideNavigation"
        :isSidebarOpen="isSidebarOpen"
        :isMobile="isMobile"
        @toggle-sidebar="toggleSidebar" 
      />
      
      <!-- Contenido principal -->
      <main
        class="flex-1 overflow-y-auto"
        :class="shouldHideNavigation ? 'p-0' : 'p-2 sm:p-4 lg:p-6'"
      >
        <div 
          :class="[
            'mx-auto transition-all duration-300',
            shouldHideNavigation ? 'w-full' : 'max-w-7xl'
          ]"
        >
          <Breadcrumbs 
            v-if="!shouldHideNavigation" 
            class="mb-3 sm:mb-4" 
          />
          
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>

    <!-- Modales -->
    <SessionWarningModal
      :visible="showWarningModal"
      :onKeepAlive="keepSessionAlive"
    />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

// Componentes
import ParentSidebar from '@/components/dashboard/padres/ParentSidebar.vue'
import ParentNavbar from '@/components/dashboard/padres/ParentNavbar.vue'
import Breadcrumbs from '@/components/dashboard/SearchBar.vue'
import SessionWarningModal from '@/components/modal/SessionWarningModal.vue'
import ToastContainer from '@/components/toastglobal/ToastContainer.vue'

// Composables
import { useInactivityLogout } from '@/composables/useInactivityLogout'

const route = useRoute()
const windowWidth = ref(window.innerWidth)

// Estados
const isSidebarOpen = ref(false) // Cerrado por defecto en móvil

// Breakpoints responsivos
const isMobile = computed(() => windowWidth.value < 768) // < 768px
const isTablet = computed(() => windowWidth.value >= 768 && windowWidth.value < 1024) // 768px - 1024px
const isDesktop = computed(() => windowWidth.value >= 1024) // >= 1024px

// Ocultar navegación en modo enfoque
const shouldHideNavigation = computed(() => route.meta.hideSidebar === true)

// Clases dinámicas para el contenedor principal
const getMainContainerClasses = computed(() => {
  if (shouldHideNavigation.value) return 'ml-0'
  
  // Móvil: sin margen (sidebar overlay)
  if (isMobile.value) return 'ml-0'
  
  // Tablet: margen para iconos
  if (isTablet.value) {
    return isSidebarOpen.value ? 'ml-64' : 'ml-16'
  }
  
  // Desktop: margen completo
  return isSidebarOpen.value ? 'ml-64' : 'ml-20'
})

// Métodos
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  if (isMobile.value) {
    isSidebarOpen.value = false
  }
}

// Listener de resize
const handleResize = () => {
  windowWidth.value = window.innerWidth
  
  // Auto-abrir sidebar en desktop
  if (isDesktop.value && !isSidebarOpen.value) {
    isSidebarOpen.value = true
  }
  
  // Auto-cerrar sidebar en móvil
  if (isMobile.value && isSidebarOpen.value) {
    isSidebarOpen.value = false
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('resize', handleResize)
  
  // Estado inicial basado en tamaño de pantalla
  if (isDesktop.value) {
    isSidebarOpen.value = true
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Inactividad
const { showWarningModal, keepSessionAlive } = useInactivityLogout(20 * 60 * 1000)
</script>

<style scoped>
/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Asegurar que el contenido sea scrolleable */
main {
  -webkit-overflow-scrolling: touch;
}

/* Prevenir scroll horizontal en móvil */
@media (max-width: 768px) {
  body {
    overflow-x: hidden;
  }
}
</style>