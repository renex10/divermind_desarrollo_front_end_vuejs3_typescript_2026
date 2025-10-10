
<template>
  <div class="nna-card">
    <div class="card-header">
      <div class="card-avatar-section">
        <div class="avatar-large">{{ getInitials(nna.first_name, nna.last_name) }}</div>
        <div class="card-info">
          <h3 class="card-name">{{ nna.first_name }} {{ nna.last_name }}</h3>
          <p class="card-age">{{ calculateAge(nna.birth_date) }} años</p>
        </div>
      </div>
      <div class="card-status">
        <label
          :class="[
            'toggle-switch',
            nna.status === 'active' ? 'toggle-active' : 'toggle-inactive'
          ]"
        >
          <input 
            type="checkbox" 
            :checked="nna.status === 'active'"
            @change="handleToggleStatus"
            class="toggle-input"
          />
          <span class="toggle-slider"></span>
        </label>
        <span class="status-text" :class="nna.status">
          {{ nna.status === 'active' ? 'Activo' : 'Suspendido' }}
        </span>
      </div>
    </div>
    
    <div class="card-body">
      <div class="card-detail">
        <span class="detail-label">Última Sesión:</span>
        <span class="detail-value">{{ formatLastSession(nna.last_session) }}</span>
      </div>
      <div class="card-detail">
        <span class="detail-label">Grado:</span>
        <span class="detail-value">
          <span class="grade-badge">{{ nna.current_grade }}</span>
        </span>
      </div>
    </div>

    <div class="card-actions">
      <button @click="handleView" class="card-action-btn view">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>
        Ver
      </button>
      <button @click="handleEdit" class="card-action-btn edit">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
        Editar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface NnaData {
  id: number | string
  first_name: string
  last_name: string
  birth_date: string
  current_grade: string
  status: 'active' | 'suspended'
  last_session: string
}

const props = defineProps<{
  nna: NnaData
}>()

const emit = defineEmits<{
  view: [nna: NnaData]
  edit: [nna: NnaData]
  toggle: [nna: NnaData, newStatus: 'active' | 'suspended']
}>()

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

const calculateAge = (birthDate: string): number => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

const formatLastSession = (date: string): string => {
  if (!date) return 'Nunca'
  
  const sessionDate = new Date(date)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (sessionDate.toDateString() === today.toDateString()) {
    return 'Hoy'
  } else if (sessionDate.toDateString() === yesterday.toDateString()) {
    return 'Ayer'
  } else {
    return sessionDate.toLocaleDateString('es-CL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    })
  }
}

const handleToggleStatus = () => {
  const newStatus = props.nna.status === 'active' ? 'suspended' : 'active'
  emit('toggle', props.nna, newStatus)
}

const handleView = () => {
  emit('view', props.nna)
}

const handleEdit = () => {
  emit('edit', props.nna)
}
</script>

<style scoped>
.nna-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.card-avatar-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  flex-shrink: 0;
}

.card-info {
  display: flex;
  flex-direction: column;
}

.card-name {
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.card-age {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.card-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.card-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.detail-value {
  font-size: 0.875rem;
  color: #1f2937;
  font-weight: 500;
}

.grade-badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  background: #e0e7ff;
  color: #3730a3;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
}

.card-action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.card-action-btn:hover {
  transform: translateY(-1px);
}

.card-action-btn.view {
  background: #dbeafe;
  color: #1e40af;
}

.card-action-btn.edit {
  background: #fef3c7;
  color: #d97706;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 56px;
  height: 28px;
  margin-right: 0.75rem;
  vertical-align: middle;
}

.toggle-input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #d1d5db;
  transition: .4s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

.toggle-input:checked + .toggle-slider {
  background-color: #10b981;
}

.toggle-input:checked + .toggle-slider:before {
  transform: translateX(28px);
}

.toggle-active .toggle-slider {
  background-color: #10b981;
}

.toggle-inactive .toggle-slider {
  background-color: #d1d5db;
}

.status-text {
  font-size: 0.75rem;
  font-weight: 500;
}

.status-text.active {
  color: #10b981;
}

.status-text.suspended {
  color: #6b7280;
}
</style>