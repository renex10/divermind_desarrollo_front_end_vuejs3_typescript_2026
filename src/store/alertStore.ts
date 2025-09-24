/* src\store\alertStore.ts */

import { defineStore } from 'pinia'

export type AlertType = 'success' | 'error' | 'info' | 'warning'

interface AlertState {
  show: boolean
  type: AlertType
  title: string
  message: string
}

export const useAlertStore = defineStore('alert', {
  state: (): AlertState => ({
    show: false,
    type: 'info',
    title: '',
    message: ''
  }),
  actions: {
    trigger(type: AlertType, title: string, message: string) {
      this.type = type
      this.title = title
      this.message = message
      this.show = true
    },
    close() {
      this.show = false
      // Resetear valores después de cerrar
      setTimeout(() => {
        this.type = 'info'
        this.title = ''
        this.message = ''
      }, 300) // Esperar a que termine la animación de salida
    },
    success(title: string, message: string) {
      this.trigger('success', title, message)
    },
    error(title: string, message: string) {
      this.trigger('error', title, message)
    },
    warning(title: string, message: string) {
      this.trigger('warning', title, message)
    },
    info(title: string, message: string) {
      this.trigger('info', title, message)
    }
  }
})