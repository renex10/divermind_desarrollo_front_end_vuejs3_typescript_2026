<template>

 <!--  src\components\dashboard\Sidebar.vue -->
  <aside :class="sidebarClasses">
    <!-- Header del sidebar -->
    <div class="flex items-center justify-between p-4 border-b border-[#3c5690]">
      <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 scale-90"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-90"
      >
        <img v-if="isOpen" 
             :src="logo" 
             alt="Logo" 
             class="h-8 sidebar-logo transition-all duration-300" />
      </Transition>
      
      <button @click="$emit('toggle')" 
              class="p-2 rounded-lg hover:bg-[#3c5690] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400">
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 rotate-90"
          enter-to-class="opacity-100 rotate-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 rotate-0"
          leave-to-class="opacity-0 -rotate-90"
          mode="out-in"
        >
          <Bars3CenterLeftIcon v-if="!isOpen" class="h-6 w-6" />
          <XMarkIcon v-else class="h-6 w-6" />
        </Transition>
      </button>
    </div>
    
    <!-- Navegación principal -->
    <nav class="mt-6 flex-1">
      <div class="space-y-1 px-2">
        <NavigationItem 
          v-for="item in navigation" 
          :key="item.name" 
          :item="item" 
          :isSidebarOpen="isOpen"
          class="nav-item"
        />
      </div>
    </nav>
    
    <!-- Footer del sidebar -->
    <div class="border-t border-[#3c5690] p-4">
      <Transition
        enter-active-class="transition ease-out duration-300 delay-100"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div v-if="isOpen" class="sidebar-content">
          <div class="flex items-center space-x-3 text-gray-300">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span class="text-sm font-semibold text-white">v2</span>
            </div>
            <div class="text-sm">
              <p class="font-medium">Sistema v2.1</p>
              <p class="text-xs text-gray-400">Actualizado</p>
            </div>
          </div>
        </div>
      </Transition>
    </div>
    
    <!-- Overlay para móvil -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen && isMobile" 
           @click="$emit('toggle')"
           class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"></div>
    </Transition>
  </aside>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Bars3CenterLeftIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import NavigationItem from './NavigationItem.vue'
import logo from '@/assets/dashboard/logo-horizontal.png'

// Importar el CSS mejorado
import '@/assets/css/dashboard-enhanced.css'

const props = defineProps<{
  isOpen: boolean
}>()

defineEmits(['toggle'])

const isMobile = ref(false)

const navigation = [
  { name: 'Dashboard', to: { name: 'dashboard' }, icon: 'HomeIcon' },
  { name: 'Ingreso NNA', to: { name: 'ingreso-nna' }, icon: 'UserPlusIcon' },
  { name: 'Histos', to: { name: 'histos' }, icon: 'DocumentTextIcon' },
  { name: 'Sesiones', to: { name: 'sessiones' }, icon: 'ChatBubbleLeftRightIcon' },
  { name: 'Reportes', to: { name: 'reportes' }, icon: 'ChartBarIcon' },
  { name: 'Configuración', to: { name: 'configuracion' }, icon: 'Cog6ToothIcon' },
  { name: 'Establecimientos', to: { name: 'establecimientos' }, icon: 'BuildingStorefrontIcon' },
]

const sidebarClasses = computed(() => [
  'sidebar',
  'fixed inset-y-0 left-0 text-white transform transition-all duration-300 ease-out z-50 flex flex-col',
  {
    'sidebar-expanded': props.isOpen && !isMobile.value,
    'sidebar-collapsed': !props.isOpen && !isMobile.value,
    'sidebar-hidden': !props.isOpen && isMobile.value,
  }
])

// Detectar tamaño de pantalla
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped>
/* Añadir gradiente al fondo del sidebar */
.sidebar {
  background: linear-gradient(135deg, #132441 0%, #1a2951 100%);
}

/* Mejorar la sombra */
.sidebar {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>