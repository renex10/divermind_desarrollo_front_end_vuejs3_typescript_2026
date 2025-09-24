<template>
  <div class="relative">
    <!-- Botón de notificaciones -->
    <button 
      @click="toggleNotifications"
      class="relative p-2 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      :class="{ 'animate-pulse': hasUnreadNotifications }"
    >
      <BellIcon class="h-6 w-6" />
      
      <!-- Badge de notificaciones no leídas -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="transform scale-0"
        enter-to-class="transform scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="transform scale-100"
        leave-to-class="transform scale-0"
      >
        <span v-if="unreadCount > 0" 
              class="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full animate-bounce">
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </span>
      </Transition>
    </button>

    <!-- Panel de notificaciones -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95 translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-1"
    >
      <div v-if="showNotifications" 
           class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
        
        <!-- Header -->
        <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Notificaciones</h3>
          <div class="flex items-center space-x-2">
            <button v-if="hasUnreadNotifications"
                    @click="markAllAsRead"
                    class="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-150">
              Marcar todas como leídas
            </button>
            <button @click="toggleNotifications" 
                    class="p-1 rounded-full hover:bg-gray-100 transition-colors duration-150">
              <XMarkIcon class="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        <!-- Lista de notificaciones -->
        <div class="max-h-80 overflow-y-auto">
          <div v-if="notifications.length === 0" 
               class="p-6 text-center text-gray-500">
            <BellIcon class="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <p>No hay notificaciones</p>
          </div>
          
          <div v-else class="divide-y divide-gray-100">
            <div v-for="notification in notifications" 
                 :key="notification.id"
                 @click="handleNotificationClick(notification)"
                 class="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                 :class="{ 'bg-blue-50': !notification.read }">
              
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-2 h-2 rounded-full mt-2"
                       :class="notification.read ? 'bg-gray-300' : 'bg-blue-500'"></div>
                </div>
                
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-gray-900 truncate"
                       :class="{ 'font-semibold': !notification.read }">
                      {{ notification.title }}
                    </p>
                    <span class="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {{ formatTime(notification.time) }}
                    </span>
                  </div>
                  
                  <p class="text-sm text-gray-600 mt-1">
                    {{ notification.message }}
                  </p>
                  
                  <div v-if="notification.type" 
                       class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2"
                       :class="getTypeStyles(notification.type)">
                    <component :is="getTypeIcon(notification.type)" 
                               class="h-3 w-3 mr-1" />
                    {{ getTypeLabel(notification.type) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <button class="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-150">
            Ver todas las notificaciones
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  BellIcon, 
  XMarkIcon,
  CalendarIcon,
  UserIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

interface Notification {
  id: string
  title: string
  message: string
  time: Date
  read: boolean
  type?: 'session' | 'user' | 'warning' | 'info'
  action?: () => void
}

const showNotifications = ref(false)
const notifications = ref<Notification[]>([
  {
    id: '1',
    title: 'Sesión programada',
    message: 'Sesión con Tomás Valenzuela TEA programada para las 15:00',
    time: new Date(Date.now() - 30 * 60 * 1000), // hace 30 minutos
    read: false,
    type: 'session'
  },
  {
    id: '2',
    title: 'Nueva derivación',
    message: 'Pedro Fuentes ha sido derivado a tu atención',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000), // hace 2 horas
    read: false,
    type: 'user'
  },
  {
    id: '3',
    title: 'Recordatorio importante',
    message: 'Actualizar informes pendientes antes del viernes',
    time: new Date(Date.now() - 24 * 60 * 60 * 1000), // hace 1 día
    read: true,
    type: 'warning'
  },
  {
    id: '4',
    title: 'Sistema actualizado',
    message: 'Nueva versión disponible con mejoras de rendimiento',
    time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // hace 3 días
    read: true,
    type: 'info'
  }
])

const unreadCount = computed(() => 
  notifications.value.filter(n => !n.read).length
)

const hasUnreadNotifications = computed(() => unreadCount.value > 0)

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true
  })
}

const handleNotificationClick = (notification: Notification) => {
  notification.read = true
  
  if (notification.action) {
    notification.action()
  }
  
  // Aquí podrías agregar lógica para navegar a una página específica
  // basada en el tipo de notificación
}

const formatTime = (time: Date) => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Ahora'
  if (diffInMinutes < 60) return `${diffInMinutes}m`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
  return `${Math.floor(diffInMinutes / 1440)}d`
}

const getTypeIcon = (type: string) => {
  const icons = {
    session: CalendarIcon,
    user: UserIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon
  }
  return icons[type as keyof typeof icons] || InformationCircleIcon
}

const getTypeStyles = (type: string) => {
  const styles = {
    session: 'bg-purple-100 text-purple-800',
    user: 'bg-blue-100 text-blue-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-gray-100 text-gray-800'
  }
  return styles[type as keyof typeof styles] || 'bg-gray-100 text-gray-800'
}

const getTypeLabel = (type: string) => {
  const labels = {
    session: 'Sesión',
    user: 'Usuario',
    warning: 'Importante',
    info: 'Información'
  }
  return labels[type as keyof typeof labels] || 'Notificación'
}

// Cerrar panel al hacer clic fuera
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.relative')) {
    showNotifications.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Simular nuevas notificaciones cada cierto tiempo (para demo)
setInterval(() => {
  if (Math.random() > 0.95) { // 5% de probabilidad cada segundo
    notifications.value.unshift({
      id: Date.now().toString(),
      title: 'Nueva notificación',
      message: 'Esta es una notificación de ejemplo',
      time: new Date(),
      read: false,
      type: 'info'
    })
  }
}, 10000) // cada 10 segundos
</script>