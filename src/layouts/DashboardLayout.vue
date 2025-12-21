<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar :isOpen="isSidebarOpen" @toggle="toggleSidebar" />
    
    <div class="flex-1 flex flex-col overflow-hidden">
      <TopNavbar :isSidebarOpen="isSidebarOpen" @toggle-sidebar="toggleSidebar" />
      
      <main
        class="flex-1 overflow-y-auto p-4"
        :class="{'ml-64': isSidebarOpen, 'ml-16': !isSidebarOpen}"
      >
        <div class="container mx-auto px-4 py-6">
        
       
          <router-view />
           <!--   <Breadcrumbs class="mb-4" /> -->
        </div>
      </main>
    </div>

    <SessionWarningModal
      :visible="showWarningModal"
      :onKeepAlive="keepSessionAlive"
    />
  </div>
    <ToastContainer />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '../components/dashboard/Sidebar.vue'
import TopNavbar from '../components/dashboard/TopNavbar.vue'
import SessionWarningModal from '@/components/modal/SessionWarningModal.vue'
import ToastContainer from '@/components/toastglobal/ToastContainer.vue'

// ===================================================================
// INICIO DE LA MODIFICACIÓN: IMPORTAR BREADCRUMBS
// 
// Importamos el nuevo componente Breadcrumbs que creamos.
// Asegúrate de que la ruta '@/components/layout/Breadcrumbs.vue' sea correcta.
// ===================================================================

// FIN DE LA MODIFICACIÓN

// 👇 Importamos el composable de inactividad
import { useInactivityLogout } from '@/composables/useInactivityLogout'

const isSidebarOpen = ref(true)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// 👇 Activamos el cierre de sesión por inactividad (20 minutos)
// y capturamos las propiedades que devuelve
const { showWarningModal, keepSessionAlive } = useInactivityLogout(20 * 60 * 1000)
</script>