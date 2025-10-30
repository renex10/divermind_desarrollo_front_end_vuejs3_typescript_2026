// src/store/notificationStore.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Notification {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
  showProgress?: boolean
}

export const useNotificationStore = defineStore('notifications', () => {
  // Estado
  const notifications = ref<Notification[]>([])
  let notificationIdCounter = 0

  // Acción: Agregar notificación
  function addNotification(options: Omit<Notification, 'id'>) {
    const id = Date.now() + (notificationIdCounter++)
    
    const notification: Notification = {
      id,
      type: options.type || 'info',
      title: options.title,
      message: options.message,
      duration: options.duration ?? 5000,
      showProgress: options.showProgress ?? true
    }

    notifications.value.push(notification)

    console.log('📢 Notificación añadida:', { id, type: notification.type, message: notification.message })

    // Auto-eliminar después de la duración (fallback por si el componente falla)
    const duration = notification.duration ?? 0
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration + 500) // +500ms para dar tiempo a la animación
    }

    return id
  }

  // Acción: Eliminar notificación
  function removeNotification(id: number) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
      console.log('🗑️ Notificación eliminada:', id)
    }
  }

  // Acción: Limpiar todas las notificaciones
  function clearAll() {
    notifications.value = []
    console.log('🧹 Todas las notificaciones eliminadas')
  }

  // Métodos de conveniencia
  function success(message: string, title?: string, duration?: number) {
    return addNotification({ type: 'success', message, title, duration })
  }

  function error(message: string, title?: string, duration?: number) {
    return addNotification({ type: 'error', message, title, duration })
  }

  function warning(message: string, title?: string, duration?: number) {
    return addNotification({ type: 'warning', message, title, duration })
  }

  function info(message: string, title?: string, duration?: number) {
    return addNotification({ type: 'info', message, title, duration })
  }

  return {
    // Estado
    notifications,
    
    // Acciones
    addNotification,
    removeNotification,
    clearAll,
    
    // Métodos de conveniencia
    success,
    error,
    warning,
    info
  }
})