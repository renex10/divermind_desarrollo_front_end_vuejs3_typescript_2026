<template>
  <!-- 
    Este div 'relative' es el contenedor principal. 
    Usamos ref="dropdown" para detectar clics fuera de él.
  -->
  <div class="relative" ref="dropdown">
    <!-- 
      Este es el BOTÓN PRINCIPAL que pasaste. 
      Ahora tiene un @click para mostrar/ocultar el menú.
    -->
    <button
      @click="toggleDropdown"
      class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105"
    >
      <div class="w-8 h-8 rounded-full bg-gradient-parent flex items-center justify-center text-white text-sm font-bold">
        {{ userInitials }}
      </div>
      <div class="hidden md:block text-left">
        <p class="text-sm font-medium text-gray-700">{{ userName }}</p>
        <p class="text-xs text-parent-600">Padre</p>
      </div>
      <!-- Icono de flecha (opcional) -->
      <svg class="w-4 h-4 text-gray-500 transition-transform duration-200" :class="{'rotate-180': isOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>

    <!-- 
      Este es el MENÚ DESPLEGABLE.
      Aparece y desaparece con una transición.
    -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="py-1">
          <!-- Item: Perfil -->
          <router-link
            to="/parent/profile"
            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            @click="isOpen = false"
          >
            <!-- Icono de Perfil (inline SVG) -->
            <svg class="w-5 h-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
            Mi Perfil
          </router-link>

          <!-- Item: Configuración -->
          <router-link
            to="/parent/settings"
            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            @click="isOpen = false"
          >
            <!-- Icono de Configuración (inline SVG) -->
            <svg class="w-5 h-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
            </svg>
            Configuración
          </router-link>

          <!-- Separador -->
          <div class="border-t border-gray-100"></div>

          <!-- Item: Salir -->
          <button
            @click="handleLogout"
            class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <!-- Icono de Salir (inline SVG) -->
            <svg class="w-5 h-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// --- PROPS ---
defineProps<{
  userName: string
  userInitials: string
}>()

// --- EMITS ---
// Este componente no maneja el logout, solo le avisa al padre (Navbar)
// que el usuario quiere salir.
const emit = defineEmits<{
  'logout': []
}>()

// --- ESTADO INTERNO ---
const isOpen = ref(false)
const dropdown = ref<HTMLElement | null>(null)

// --- FUNCIONES ---
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const handleLogout = () => {
  isOpen.value = false
  emit('logout')
}

// --- LÓGICA DE "CLICK-AWAY" ---
// Cierra el menú si el usuario hace clic fuera de él
const handleClickOutside = (event: MouseEvent) => {
  if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

// Agregamos el listener global cuando el componente se monta
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// Lo quitamos cuando se desmonta para evitar problemas de memoria
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>