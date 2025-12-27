<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <ParentSidebar 
      v-if="!shouldHideNavigation"
      :isOpen="isSidebarOpen" 
      @toggle="toggleSidebar" 
    />
    
    <div 
      class="flex-1 flex flex-col min-w-0 transition-all duration-300"
      :class="[
        !shouldHideNavigation && (isSidebarOpen ? 'ml-64' : 'ml-16'),
        shouldHideNavigation ? 'ml-0' : ''
      ]"
    >
      <ParentNavbar 
        v-if="!shouldHideNavigation"
        :isSidebarOpen="isSidebarOpen" 
        @toggle-sidebar="toggleSidebar" 
      />
      
      <main
        class="flex-1 overflow-y-auto"
        :class="shouldHideNavigation ? 'p-0' : 'p-4'"
      >
        <div 
          :class="[
            'mx-auto transition-all duration-300',
            shouldHideNavigation ? 'w-full' : 'container px-4 py-6'
          ]"
        >
          <Breadcrumbs 
            v-if="!shouldHideNavigation" 
            class="mb-4" 
          />
          
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>

    <SessionWarningModal
      :visible="showWarningModal"
      :onKeepAlive="keepSessionAlive"
    />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

// Componentes específicos de padres
import ParentSidebar from '@/components/dashboard/padres/ParentSidebar.vue'
import ParentNavbar from '@/components/dashboard/padres/ParentNavbar.vue'

// ✅ IMPORTACIÓN CORREGIDA: Ajusta esta ruta si tu componente está en otra carpeta
// Por ejemplo: '@/components/dashboard/Breadcrumbs.vue'
import Breadcrumbs from '@/components/dashboard/SearchBar.vue' // Temporalmente usando SearchBar o tu componente real de Breadcrumbs

// Componentes compartidos
import SessionWarningModal from '@/components/modal/SessionWarningModal.vue'
import ToastContainer from '@/components/toastglobal/ToastContainer.vue'

// Composable de inactividad
import { useInactivityLogout } from '@/composables/useInactivityLogout'

const route = useRoute()
const isSidebarOpen = ref(true)

/**
 * ✅ LÓGICA DE MODO ENFOQUE
 * Determina si debemos ocultar Sidebar, Navbar y Breadcrumbs 
 * basándose en la propiedad 'hideSidebar' definida en parent.routes.ts
 */
const shouldHideNavigation = computed(() => {
  return route.meta.hideSidebar === true
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// Cierre de sesión por inactividad (20 minutos)
const { showWarningModal, keepSessionAlive } = useInactivityLogout(20 * 60 * 1000)
</script>

<style scoped>
/* Transición suave para el contenido al cambiar de ruta */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Asegura que en móviles el contenido ocupe todo el espacio si el sidebar está oculto */
@media (max-width: 768px) {
  .flex-1 {
    margin-left: 0 !important;
  }
}
</style>