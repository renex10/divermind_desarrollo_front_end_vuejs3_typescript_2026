<!-- src/components/profile/tabcontent/card/ContactoEmergencia.vue -->
<template>
  <div class="info-card">
    <div class="card-header">
      <PhoneIcon class="icon-md" />
      <h3>Contactos de Emergencia</h3>
    </div>
    <div class="card-body">
      <div class="contactos-list">
        <div v-if="contactos.length === 0" class="empty-state">
          <ExclamationTriangleIcon class="icon-lg" />
          <p>No hay contactos registrados</p>
        </div>
        <div v-else class="contacto-item" v-for="contacto in contactos" :key="contacto.id">
          <div class="contacto-info">
            <strong>{{ contacto.name }}</strong>
            <span class="relationship">{{ contacto.relationship }}</span>
          </div>
          <div class="contacto-phone">{{ contacto.phone }}</div>
        </div>
      </div>
      <button class="btn btn-outline full-width" @click="$emit('gestionarContactos')">
        <PlusIcon class="icon-sm" />
        Gestionar Contactos
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  PhoneIcon, 
  PlusIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/vue/24/outline'

defineProps<{
  contactos: any[]
}>()

defineEmits<{
  gestionarContactos: []
}>()
</script>

<style scoped>
.info-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  background: #f8fafc;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1.125rem;
  color: #1f2937;
}

.card-body {
  padding: 1.5rem;
}

.contactos-list {
  margin-bottom: 1rem;
}

.contacto-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.contacto-item:last-child {
  border-bottom: none;
}

.contacto-info {
  display: flex;
  flex-direction: column;
}

.contacto-info strong {
  color: #1f2937;
}

.relationship {
  font-size: 0.875rem;
  color: #6b7280;
}

.contacto-phone {
  color: #3b82f6;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.btn-outline {
  background: transparent;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-outline:hover {
  background: #f9fafb;
}

.full-width {
  width: 100%;
  justify-content: center;
}

.icon-md {
  width: 1.5rem;
  height: 1.5rem;
}

.icon-sm {
  width: 1.25rem;
  height: 1.25rem;
}

.icon-lg {
  width: 2rem;
  height: 2rem;
}
</style>