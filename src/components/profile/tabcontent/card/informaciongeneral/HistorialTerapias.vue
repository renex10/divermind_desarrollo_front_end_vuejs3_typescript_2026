<!-- src/components/profile/tabcontent/card/informaciongeneral/HistorialTerapias.vue -->
<template>
  <div class="info-card">
    <div class="card-header">
      <ClockIcon class="icon-md" />
      <h3>Historial de Terapias</h3>
    </div>
    <div class="card-body">
      <div class="info-list">
        <div class="info-item">
          <CheckCircleIcon class="icon-sm" />
          <div>
            <label>¿Terapias Previas?</label>
            <span>{{ therapyData?.has_previous_therapies || 'No especificado' }}</span>
          </div>
        </div>
        
        <div v-if="therapyData?.therapies_detail" class="info-item">
          <DocumentTextIcon class="icon-sm" />
          <div>
            <label>Detalles de Terapias</label>
            <span class="therapy-details">{{ therapyData.therapies_detail }}</span>
          </div>
        </div>
        
        <div v-if="therapyData?.referred_by" class="info-item">
          <UserIcon class="icon-sm" />
          <div>
            <label>Referido por</label>
            <span>{{ therapyData.referred_by }}</span>
          </div>
        </div>
        
        <div v-if="therapyData?.referred_by_detail" class="info-item">
          <IdentificationIcon class="icon-sm" />
          <div>
            <label>Detalle de Referencia</label>
            <span>{{ therapyData.referred_by_detail }}</span>
          </div>
        </div>
        
        <div v-if="therapyData?.attended_where" class="info-item">
          <BuildingLibraryIcon class="icon-sm" />
          <div>
            <label>Atendido en</label>
            <span>{{ therapyData.attended_where }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  UserIcon,
  IdentificationIcon,
  BuildingLibraryIcon
} from '@heroicons/vue/24/outline'

defineProps<{
  therapyData?: any
}>()
</script>

<style scoped>
.therapy-details {
  line-height: 1.4;
  font-style: italic;
}

/* Mantener estilos base de la tarjeta */
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