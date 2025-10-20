<!-- src/components/profile/header/PerfilHeader.vue -->
<template>
  <div class="perfil-header">
    <div class="breadcrumb">
      <router-link to="/ingreso-nna" class="breadcrumb-link">
        <ArrowLeftIcon class="icon-xs" />
        Volver a Gestión de NNA
      </router-link>
    </div>
    
    <div class="header-content">
      <div class="nna-info">
        <div class="avatar-section">
          <div class="avatar-placeholder">
            <UserIcon class="icon-md" />
          </div>
          <div class="nna-details">
            <h1 class="nna-name">{{ nnaData?.first_name }} {{ nnaData?.last_name }}</h1>
            <div class="nna-meta">
              <span v-if="nnaData?.rut" class="meta-item">
                <IdentificationIcon class="icon-xs" />
                {{ nnaData.rut }}
              </span>
              <span v-if="nnaData?.age" class="meta-item">
                <CalendarIcon class="icon-xs" />
                {{ nnaData.age }} años
              </span>
              <span v-if="nnaData?.grade" class="meta-item">
                <AcademicCapIcon class="icon-xs" />
                {{ nnaData.grade }}
              </span>
              <span v-if="nnaData?.autism_level" class="meta-item">
                <SparklesIcon class="icon-xs" />
                {{ nnaData.autism_level }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="header-actions">
        <button class="btn btn-secondary" @click="$emit('verDashboard')">
          <ChartBarIcon class="icon-xs" />
          Dashboard
        </button>
        <button class="btn btn-primary" @click="$emit('exportarDatos')">
          <DocumentArrowDownIcon class="icon-xs" />
          Exportar Datos
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeftIcon,
  UserIcon,
  IdentificationIcon,
  CalendarIcon,
  AcademicCapIcon,
  SparklesIcon,
  ChartBarIcon,
  DocumentArrowDownIcon
} from '@heroicons/vue/24/outline'

// Props
defineProps<{
  nnaData?: {
    first_name?: string
    last_name?: string
    rut?: string
    age?: number
    grade?: string
    autism_level?: string
  }
}>()

// Emits
defineEmits<{
  verDashboard: []
  exportarDatos: []
}>()
</script>

<style scoped>
.perfil-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 1.5rem;
}

.breadcrumb {
  margin-bottom: 0.75rem;
}

.breadcrumb-link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 500;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.avatar-placeholder {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
  border: 2px solid #e2e8f0;
  flex-shrink: 0;
}

.nna-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.375rem 0;
  line-height: 1.3;
}

.nna-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin: 0;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 500;
  background: #f8fafc;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #f1f5f9;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  padding: 0.5rem 0.875rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  white-space: nowrap;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: 1px solid #2563eb;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-secondary {
  background: white;
  color: #475569;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #f8fafc;
  border-color: #9ca3af;
}

/* Estilos de iconos */
.icon-xs {
  width: 0.875rem;
  height: 0.875rem;
}

.icon-sm {
  width: 1rem;
  height: 1rem;
}

.icon-md {
  width: 1.25rem;
  height: 1.25rem;
}

.icon-lg {
  width: 1.5rem;
  height: 1.5rem;
}

/* Estilos responsive */
@media (max-width: 768px) {
  .perfil-header {
    padding: 0.875rem 1rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
    justify-content: stretch;
  }
  
  .header-actions .btn {
    flex: 1;
    justify-content: center;
    padding: 0.625rem 0.75rem;
  }
  
  .nna-meta {
    gap: 0.5rem;
  }
  
  .avatar-section {
    gap: 0.75rem;
  }
  
  .avatar-placeholder {
    width: 48px;
    height: 48px;
  }
  
  .nna-name {
    font-size: 1.125rem;
  }
}

@media (max-width: 480px) {
  .nna-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.375rem;
  }
  
  .meta-item {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>