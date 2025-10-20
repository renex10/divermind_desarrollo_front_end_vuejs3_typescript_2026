<!-- src/components/profile/tabcontent/card/informaciongeneral/InformacionPersonal.vue -->
<template>
  <div class="info-card">
    <div class="card-header">
      <UserCircleIcon class="icon-md" />
      <h3>Información Personal</h3>
    </div>
    <div class="card-body">
      <div class="info-list">
        <div class="info-item">
          <UserIcon class="icon-sm" />
          <div>
            <label>Nombre Completo</label>
            <span>{{ personalData?.full_name || 'No especificado' }}</span>
          </div>
        </div>
        <div class="info-item">
          <IdentificationIcon class="icon-sm" />
          <div>
            <label>RUT</label>
            <span>{{ personalData?.rut || 'No especificado' }}</span>
          </div>
        </div>
        <div class="info-item">
          <CalendarIcon class="icon-sm" />
          <div>
            <label>Fecha de Nacimiento</label>
            <span>{{ personalData?.birth_date || 'No especificada' }}</span>
          </div>
        </div>
        <div class="info-item">
          <CalendarDaysIcon class="icon-sm" />
          <div>
            <label>Edad</label>
            <span>{{ personalData?.age || '0' }} años</span>
          </div>
        </div>
        <div class="info-item">
          <UserGroupIcon class="icon-sm" />
          <div>
            <label>Género</label>
            <span>{{ personalData?.gender || 'No especificado' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  UserCircleIcon,
  UserIcon,
  IdentificationIcon,
  CalendarIcon,
  CalendarDaysIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'

defineProps<{
  personalData?: any
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

.info-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.info-item label {
  font-size: 0.875rem;
  color: #6b7280;
  display: block;
  margin-bottom: 0.25rem;
}

.info-item span {
  font-weight: 500;
  color: #1f2937;
}

.icon-md {
  width: 1.5rem;
  height: 1.5rem;
}

.icon-sm {
  width: 1.25rem;
  height: 1.25rem;
}
</style>