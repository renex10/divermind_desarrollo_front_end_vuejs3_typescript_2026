// src/store/alertModalStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type AlertModalType = 'success' | 'error' | 'info' | 'warning'
export type AlertModalAction = {
  label: string
  handler: () => void
  variant?: 'primary' | 'secondary' | 'danger'
}

interface AlertModalState {
  isOpen: boolean
  type: AlertModalType
  title: string
  message: string
  actions: AlertModalAction[]
  showCloseButton: boolean
}

export const useAlertModalStore = defineStore('alertModal', () => {
  // Estado reactivo
  const state = ref<AlertModalState>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    actions: [],
    showCloseButton: true
  })

  // Métodos para mostrar diferentes tipos de alertas
  const show = (type: AlertModalType, title: string, message: string, actions: AlertModalAction[] = []) => {
    state.value = {
      isOpen: true,
      type,
      title,
      message,
      actions: actions.length > 0 ? actions : [{ label: 'Aceptar', handler: close, variant: 'primary' }],
      showCloseButton: actions.length === 0
    }
  }

  const success = (title: string, message: string, actions?: AlertModalAction[]) => {
    show('success', title, message, actions)
  }

  const error = (title: string, message: string, actions?: AlertModalAction[]) => {
    show('error', title, message, actions)
  }

  const warning = (title: string, message: string, actions?: AlertModalAction[]) => {
    show('warning', title, message, actions)
  }

  const info = (title: string, message: string, actions?: AlertModalAction[]) => {
    show('info', title, message, actions)
  }

  const close = () => {
    state.value.isOpen = false
    // Reset después de un pequeño delay para permitir la animación
    setTimeout(() => {
      state.value = {
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
        actions: [],
        showCloseButton: true
      }
    }, 300)
  }

  // Método para confirmaciones (sí/no)
  const confirm = (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => {
    show('warning', title, message, [
      {
        label: 'Cancelar',
        handler: () => {
          onCancel?.()
          close()
        },
        variant: 'secondary'
      },
      {
        label: 'Confirmar',
        handler: () => {
          onConfirm()
          close()
        },
        variant: 'primary'
      }
    ])
  }

  return {
    state: state as unknown as AlertModalState,
    show,
    success,
    error,
    warning,
    info,
    confirm,
    close
  }
})