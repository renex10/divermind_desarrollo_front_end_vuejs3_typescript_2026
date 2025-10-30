<!-- ToastContainer.vue -->
<!-- Este componente debe ser agregado en DashboardLayout.vue o App.vue -->

<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast-list" tag="div" class="toast-list">
        <ToastNotification
          v-for="notification in notifications"
          :key="notification.id"
          v-bind="notification"
          @close="handleClose"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/store/notificationStore'
import ToastNotification from '@/components/gestion/rutinas/shared/ToastNotification.vue'

const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)

function handleClose(id: number | string) {
  notificationStore.removeNotification(Number(id))
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 9999;
  pointer-events: none;
  max-width: 420px;
}

.toast-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Animaciones de TransitionGroup */
.toast-list-move,
.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-list-leave-active {
  position: absolute;
  right: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .toast-container {
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    max-width: none;
  }
}
</style>