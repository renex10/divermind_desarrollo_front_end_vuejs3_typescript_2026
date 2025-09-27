<template>
  <!-- src/layouts/DashboardLayout.vue -->
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <Sidebar :isOpen="isSidebarOpen" @toggle="toggleSidebar" />
    
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Navigation -->
      <TopNavbar :isSidebarOpen="isSidebarOpen" @toggle-sidebar="toggleSidebar" />
      
      <!-- Main content -->
      <main
        class="flex-1 overflow-y-auto p-4"
        :class="{'ml-64': isSidebarOpen, 'ml-16': !isSidebarOpen}"
      >
        <div class="container mx-auto px-4 py-6">
          <router-view />
        </div>
      </main>
    </div>

    <!-- Modal de advertencia de inactividad -->
    <SessionWarningModal
      :visible="showWarningModal"
      :onKeepAlive="keepSessionAlive"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '../components/dashboard/Sidebar.vue'
import TopNavbar from '../components/dashboard/TopNavbar.vue'
import SessionWarningModal from '@/components/modal/SessionWarningModal.vue'

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
