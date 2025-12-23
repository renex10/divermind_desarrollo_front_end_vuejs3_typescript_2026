<template>
  <!-- src/components/dashboard/NotificationsBell.vue -->
  <div class="notification-bell-wrapper" ref="notificationWrapper">
    <!-- Botón de notificaciones -->
    <button 
      @click="toggleNotifications"
      class="notification-btn"
      :class="{ 'has-unread': hasUnreadNotifications }"
      aria-label="Notificaciones"
    >
      <BellIcon class="notification-icon" />
      
      <!-- Badge de notificaciones no leídas -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="transform scale-0"
        enter-to-class="transform scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="transform scale-100"
        leave-to-class="transform scale-0"
      >
        <span v-if="unreadCount > 0" class="notification-badge">
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </span>
      </Transition>
    </button>

    <!-- Panel de notificaciones - RESPONSIVE CON MARGEN SUPERIOR -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div 
        v-if="showNotifications" 
        class="notifications-panel"
        :class="notificationPanelClasses"
      >
        <!-- Header -->
        <div class="notifications-header">
          <h3 class="notifications-title">Notificaciones</h3>
          <div class="notifications-actions">
            <button 
              v-if="hasUnreadNotifications"
              @click="markAllAsRead"
              class="mark-read-btn"
            >
              {{ isMobile ? 'Marcar' : 'Marcar todas como leídas' }}
            </button>
            <button 
              @click="toggleNotifications" 
              class="close-btn"
              aria-label="Cerrar notificaciones"
            >
              <XMarkIcon class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- Lista de notificaciones con scroll -->
        <div class="notifications-list">
          <!-- Estado vacío -->
          <div v-if="notifications.length === 0" class="empty-state">
            <BellSlashIcon class="empty-icon" />
            <p class="empty-text">No hay notificaciones</p>
            <p class="empty-subtext">Te avisaremos cuando haya algo nuevo</p>
          </div>
          
          <!-- Notificaciones -->
          <div v-else class="notifications-items">
            <div 
              v-for="notification in notifications" 
              :key="notification.id"
              @click="handleNotificationClick(notification)"
              class="notification-item"
              :class="{ 'unread': !notification.read }"
            >
              <!-- Indicador de lectura -->
              <div class="read-indicator">
                <div 
                  class="indicator-dot"
                  :class="notification.read ? 'read' : 'unread'"
                ></div>
              </div>
              
              <!-- Contenido -->
              <div class="notification-content">
                <div class="notification-header">
                  <p class="notification-title" :class="{ 'font-bold': !notification.read }">
                    {{ notification.title }}
                  </p>
                  <span class="notification-time">
                    {{ formatTime(notification.time) }}
                  </span>
                </div>
                
                <p class="notification-message">
                  {{ notification.message }}
                </p>
                
                <!-- Badge de tipo -->
                <div v-if="notification.type" class="notification-type-badge" :class="getTypeStyles(notification.type)">
                  <component :is="getTypeIcon(notification.type)" class="type-icon" />
                  <span class="type-label">{{ getTypeLabel(notification.type) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="notifications-footer">
          <button 
            @click="viewAllNotifications"
            class="view-all-btn"
          >
            Ver todas las notificaciones
          </button>
        </div>
      </div>
    </Transition>

    <!-- Overlay para móvil -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="showNotifications && isMobile"
        @click="closeNotifications"
        class="notification-overlay"
      ></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  BellIcon,
  BellSlashIcon,
  XMarkIcon,
  CalendarIcon,
  UserIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

// ==========================
// INTERFACES
// ==========================

interface Notification {
  id: string
  title: string
  message: string
  time: Date
  read: boolean
  type?: 'session' | 'user' | 'warning' | 'info'
  action?: () => void
}

// ==========================
// STATE
// ==========================

const notificationWrapper = ref<HTMLElement | null>(null)
const showNotifications = ref(false)
const isMobile = ref(false)
const isTablet = ref(false)

// Mock de notificaciones (reemplazar con datos reales)
const notifications = ref<Notification[]>([
  {
    id: '1',
    title: 'Sesión programada',
    message: 'Sesión con Tomás Valenzuela TEA programada para las 15:00',
    time: new Date(Date.now() - 31 * 60 * 1000),
    read: false,
    type: 'session'
  },
  {
    id: '2',
    title: 'Nueva derivación',
    message: 'Pedro Fuentes ha sido derivado a tu atención',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    type: 'user'
  },
  {
    id: '3',
    title: 'Recordatorio importante',
    message: 'Actualizar informes pendientes antes del viernes',
    time: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    type: 'warning'
  },
  {
    id: '4',
    title: 'Sistema actualizado',
    message: 'Nueva versión disponible con mejoras de rendimiento',
    time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true,
    type: 'info'
  }
])

// ==========================
// COMPUTED
// ==========================

const unreadCount = computed(() => 
  notifications.value.filter(n => !n.read).length
)

const hasUnreadNotifications = computed(() => unreadCount.value > 0)

const notificationPanelClasses = computed(() => {
  if (isMobile.value) {
    return 'panel-mobile'
  } else if (isTablet.value) {
    return 'panel-tablet'
  } else {
    return 'panel-desktop'
  }
})

// ==========================
// METHODS
// ==========================

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const closeNotifications = () => {
  showNotifications.value = false
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
  
  // Cerrar panel en móvil después de click
  if (isMobile.value) {
    closeNotifications()
  }
}

const viewAllNotifications = () => {
  // Navegar a página de todas las notificaciones
  console.log('Ver todas las notificaciones')
  closeNotifications()
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
    session: 'badge-session',
    user: 'badge-user',
    warning: 'badge-warning',
    info: 'badge-info'
  }
  return styles[type as keyof typeof styles] || 'badge-info'
}

const getTypeLabel = (type: string) => {
  const labels = {
    session: 'Sesión',
    user: 'Usuario',
    warning: 'Importante',
    info: 'Info'
  }
  return labels[type as keyof typeof labels] || 'Notif.'
}

const checkScreenSize = () => {
  const width = window.innerWidth
  isMobile.value = width < 768
  isTablet.value = width >= 768 && width < 1024
}

const handleClickOutside = (event: MouseEvent) => {
  if (notificationWrapper.value && !notificationWrapper.value.contains(event.target as Node)) {
    closeNotifications()
  }
}

const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showNotifications.value) {
    closeNotifications()
  }
}

// ==========================
// LIFECYCLE
// ==========================

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', handleEscapeKey)
})
</script>

<style scoped>
/* ==========================
   WRAPPER & BUTTON
   ========================== */

.notification-bell-wrapper {
  position: relative;
}

.notification-btn {
  position: relative;
  padding: 0.5rem;
  border-radius: 0.75rem;
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.notification-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.notification-btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.notification-btn.has-unread {
  color: #3b82f6;
}

.notification-icon {
  width: 1.5rem;
  height: 1.5rem;
}

/* Badge de notificaciones */
.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 1.125rem;
  height: 1.125rem;
  padding: 0 0.25rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: 2px solid white;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 700;
  color: white;
  line-height: 1;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* ==========================
   PANEL BASE
   ========================== */

.notifications-panel {
  position: absolute;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  z-index: 1000;
}

/* ==========================
   PANEL DESKTOP
   ========================== */

.panel-desktop {
  right: 0;
  top: calc(100% + 0.75rem);  /* ✅ Aumentado de 0.5rem a 0.75rem */
  width: 400px;
  max-height: 600px;
}

/* ==========================
   PANEL TABLET
   ========================== */

.panel-tablet {
  right: 0;
  top: calc(100% + 0.75rem);  /* ✅ Aumentado de 0.5rem a 0.75rem */
  width: 380px;
  max-height: 500px;
}

/* ==========================
   PANEL MOBILE - MEJORADO
   ========================== */

.panel-mobile {
  position: fixed;
  top: auto;  /* ✅ Cambiado de 50% a auto */
  bottom: auto;
  left: 50%;
  transform: translateX(-50%);  /* ✅ Solo centrado horizontal */
  margin-top: 5rem;  /* ✅ NUEVO: Margen superior de 5rem (80px) */
  width: calc(100vw - 2rem);
  max-width: 480px;
  max-height: calc(100vh - 7rem);  /* ✅ Ajustado para el nuevo margen */
  z-index: 1001;
}

/* Alternativa: Si quieres que esté más cerca del botón en móvil */
@media (max-width: 767px) {
  .panel-mobile {
    top: 4.5rem;  /* ✅ Posición desde arriba */
    margin-top: 0;
    transform: translateX(-50%);
  }
}

/* ==========================
   HEADER
   ========================== */

.notifications-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.notifications-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.notifications-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mark-read-btn {
  font-size: 0.75rem;
  color: #3b82f6;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.mark-read-btn:hover {
  background: #eff6ff;
  color: #2563eb;
}

.close-btn {
  padding: 0.25rem;
  border-radius: 0.375rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

/* ==========================
   LISTA
   ========================== */

.notifications-list {
  overflow-y: auto;
  overflow-x: hidden;
}

/* Desktop */
.panel-desktop .notifications-list {
  max-height: 480px;
}

/* Tablet */
.panel-tablet .notifications-list {
  max-height: 400px;
}

/* Mobile - Ajustado */
.panel-mobile .notifications-list {
  max-height: calc(100vh - 14rem);  /* ✅ Ajustado para el nuevo posicionamiento */
}

/* Scrollbar styling */
.notifications-list::-webkit-scrollbar {
  width: 4px;
}

.notifications-list::-webkit-scrollbar-track {
  background: #f9fafb;
}

.notifications-list::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

.notifications-list::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* ==========================
   EMPTY STATE
   ========================== */

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.empty-subtext {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* ==========================
   ITEMS
   ========================== */

.notifications-items {
  display: flex;
  flex-direction: column;
}

.notification-item {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: all 0.2s ease;
}

.notification-item:hover {
  background: #f9fafb;
}

.notification-item.unread {
  background: #eff6ff;
}

.notification-item:last-child {
  border-bottom: none;
}

/* Read indicator */
.read-indicator {
  flex-shrink: 0;
  padding-top: 0.375rem;
}

.indicator-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
}

.indicator-dot.unread {
  background: #3b82f6;
}

.indicator-dot.read {
  background: #d1d5db;
}

/* Content */
.notification-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.notification-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
}

.notification-title {
  font-size: 0.875rem;
  color: #1f2937;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.notification-title.font-bold {
  font-weight: 600;
}

.notification-time {
  font-size: 0.75rem;
  color: #6b7280;
  white-space: nowrap;
  flex-shrink: 0;
}

.notification-message {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Type badge */
.notification-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  width: fit-content;
}

.type-icon {
  width: 0.75rem;
  height: 0.75rem;
}

.type-label {
  white-space: nowrap;
}

/* Badge colors */
.badge-session {
  background: #f3e8ff;
  color: #7c3aed;
}

.badge-user {
  background: #dbeafe;
  color: #2563eb;
}

.badge-warning {
  background: #fef3c7;
  color: #d97706;
}

.badge-info {
  background: #f3f4f6;
  color: #6b7280;
}

/* ==========================
   FOOTER
   ========================== */

.notifications-footer {
  padding: 0.75rem 1.25rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.view-all-btn {
  width: 100%;
  padding: 0.5rem;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: #3b82f6;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-all-btn:hover {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #2563eb;
}

/* ==========================
   OVERLAY (MOBILE)
   ========================== */

.notification-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  backdrop-filter: blur(2px);
}

/* ==========================
   RESPONSIVE ADJUSTMENTS
   ========================== */

/* Mobile specific */
@media (max-width: 767px) {
  .notification-title,
  .notification-message {
    font-size: 0.8125rem;
  }

  .notification-time {
    font-size: 0.6875rem;
  }

  .notification-type-badge {
    font-size: 0.6875rem;
    padding: 0.1875rem 0.375rem;
  }

  .notifications-header {
    padding: 0.875rem 1rem;
  }

  .notification-item {
    padding: 0.875rem 1rem;
  }
}

/* Tablet specific */
@media (min-width: 768px) and (max-width: 1023px) {
  .panel-tablet {
    right: 0;
  }
}

/* ==========================
   ACCESSIBILITY
   ========================== */

@media (prefers-reduced-motion: reduce) {
  .notification-badge,
  .notification-btn,
  .notification-item {
    animation: none;
    transition: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .notifications-panel {
    border: 2px solid #000;
  }

  .notification-item {
    border-bottom-width: 2px;
  }
}
</style>