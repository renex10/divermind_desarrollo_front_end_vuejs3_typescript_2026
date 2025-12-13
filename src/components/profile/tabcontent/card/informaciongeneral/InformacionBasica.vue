<!-- src/components/profile/tabcontent/card/informaciongeneral/InformacionBasica.vue -->
<template>
  <div class="info-card">
    <div class="card-header">
      <BuildingLibraryIcon class="icon-md" />
      <h3>Información de Ubicación</h3>
    </div>
    <div class="card-body">
      <div v-if="loading" class="loading-state">
        Cargando información...
      </div>
      <div v-else class="info-list">
        <div class="info-item">
          <BuildingLibraryIcon class="icon-sm" />
          <div>
            <label>Establecimiento</label>
            <span>{{ locationData?.establishment || 'No asignado' }}</span>
          </div>
        </div>
        <div class="info-item">
          <MapPinIcon class="icon-sm" />
          <div>
            <label>Dirección</label>
            <span>{{ locationData?.full_address || 'No especificada' }}</span>
          </div>
        </div>
        <div class="info-item">
          <MapPinIcon class="icon-sm" />
          <div>
            <label>Calle y Número</label>
            <span>{{ formatStreetAddress() }}</span>
          </div>
        </div>
        <div class="info-item">
          <MapIcon class="icon-sm" />
          <div>
            <label>Comuna</label>
            <span>{{ locationData?.commune || 'No especificada' }}</span>
          </div>
        </div>
        <div class="info-item">
          <GlobeAmericasIcon class="icon-sm" />
          <div>
            <label>Región</label>
            <span>{{ locationData?.region || 'No especificada' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  BuildingLibraryIcon, 
  MapPinIcon, 
  MapIcon,
  GlobeAmericasIcon
} from '@heroicons/vue/24/outline'


const props = defineProps<{
  locationData?: any
  loading: boolean
}>()

const formatStreetAddress = () => {
  if (props.locationData?.street && props.locationData?.street_number) {
    return `${props.locationData.street} #${props.locationData.street_number}`
  }
  return 'No especificada'
}
</script>

<style scoped>
/* Estilos mantienen igual que antes */
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

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #6b7280;
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