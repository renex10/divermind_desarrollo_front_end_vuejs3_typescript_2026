<template>
  <!-- src\layouts\DashboardLayout.vue -->
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <Sidebar :isOpen="isSidebarOpen" @toggle="toggleSidebar" />
    
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Navigation -->
      <TopNavbar :isSidebarOpen="isSidebarOpen" @toggle-sidebar="toggleSidebar" />
      
      <!-- Main content -->
      <main class="flex-1 overflow-y-auto p-4" :class="{'ml-64': isSidebarOpen, 'ml-16': !isSidebarOpen}">
        <div class="container mx-auto px-4 py-6">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '../components/dashboard/Sidebar.vue'

import TopNavbar from '../components/dashboard/TopNavbar.vue'

const isSidebarOpen = ref(true)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>