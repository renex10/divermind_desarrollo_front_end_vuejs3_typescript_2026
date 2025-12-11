<template>
  <div class="perfil-header">
    <div class="breadcrumb">
      <router-link to="/ingreso-nna" class="breadcrumb-link">
        <ArrowLeftIcon class="icon-xs" />
        Volver a Gestión de NNA
      </router-link>
    </div>

    <EncabezadoConFoto
      :nnaData="props.nnaData"
      @verDashboard="$emit('verDashboard')"
      @exportarDatos="$emit('exportarDatos')"
      @photoUploaded="handlePhotoUpload"
    />
    </div>
</template>

<script setup lang="ts">
import {
  ArrowLeftIcon,
} from '@heroicons/vue/24/outline'

// ✅ --- AÑADIDO: Importar el nuevo componente --- ✅
import EncabezadoConFoto from './EncabezadoConFoto.vue'

// Props (Se mantienen para recibir los datos)
const props = defineProps<{
  nnaData?: {
    first_name?: string
    last_name?: string
    rut?: string
    age?: number
    grade?: string
    autism_level?: string
    photo_url?: string
    id?: number
  }
}>()

// Emits (Se mantienen para "burbujear" los eventos)
const emit = defineEmits<{
  verDashboard: []
  exportarDatos: []
  photoUploaded: [photoUrl: string]
}>()

// ✅ --- AÑADIDO: Handler para el evento del hijo --- ✅
const handlePhotoUpload = (photoUrl: string) => {
  // Notifica al componente padre (la vista) que la foto cambió
  emit('photoUploaded', photoUrl)
}

// ⛔️ --- LÓGICA ELIMINADA --- ⛔️
// Toda la lógica de avatarKey, imageLoaded, showPhotoModal,
// openPhotoModal, handlePhotoSuccess, childPhotoUrl,
// handleImageError, handleImageLoad, y los watchers
// han sido movidos a EncabezadoConFoto.vue
</script>

<style scoped>
/* Solo se quedan los estilos del "cascarón" */
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

/* Estilos de iconos (solo los usados aquí) */
.icon-xs {
  width: 0.875rem;
  height: 0.875rem;
}

/* Estilos responsive (solo los de las clases que se quedaron) */
@media (max-width: 768px) {
  .perfil-header {
    padding: 0.875rem 1rem;
  }
}
</style>