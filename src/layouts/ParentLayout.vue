<!-- src/layouts/ParentLayout.vue -->
<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar para padres -->
    <ParentSidebar 
      :isOpen="isSidebarOpen" 
      @toggle="toggleSidebar" 
    />
    
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Navbar para padres -->
      <ParentNavbar 
        :isSidebarOpen="isSidebarOpen" 
        @toggle-sidebar="toggleSidebar" 
      />
      
      <main
        class="flex-1 overflow-y-auto p-4"
        :class="{'ml-64': isSidebarOpen, 'ml-16': !isSidebarOpen}"
      >
        <div class="container mx-auto px-4 py-6">
          <!-- Breadcrumbs (reutilizado, ya es dinámico) -->
          <Breadcrumbs class="mb-4" />
          
          <!-- Contenido dinámico de las vistas -->
          <router-view />
        </div>
      </main>
    </div>

    <!-- Componentes compartidos -->
    <SessionWarningModal
      :visible="showWarningModal"
      :onKeepAlive="keepSessionAlive"
    />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Componentes específicos de padres
import ParentSidebar from '@/components/dashboard/padres/ParentSidebar.vue'
import ParentNavbar from '@/components/dashboard/padres/ParentNavbar.vue'

// Componentes compartidos
import Breadcrumbs from '@/components/layout/Breadcrumbs.vue'
import SessionWarningModal from '@/components/modal/SessionWarningModal.vue'
import ToastContainer from '@/components/toastglobal/ToastContainer.vue'

// Composable de inactividad
import { useInactivityLogout } from '@/composables/useInactivityLogout'

const isSidebarOpen = ref(true)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// Cierre de sesión por inactividad (20 minutos)
const { showWarningModal, keepSessionAlive } = useInactivityLogout(20 * 60 * 1000)
</script>