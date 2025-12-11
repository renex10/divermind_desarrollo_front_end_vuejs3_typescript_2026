<template>
  <div class="header-content">
    <div class="nna-info">
      <div class="avatar-section">
        
        <div class="avatar-placeholder relative group" :key="avatarKey">
          
          <img
            v-if="childPhotoUrl"
            :src="childPhotoUrl"
            :alt="`Foto de ${nnaData?.first_name} ${nnaData?.last_name}`"
            class="avatar-image"
            @error="handleImageError"
            @load="handleImageLoad"
          />
          <UserIcon v-else class="icon-xl" />

          <div
            class="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
            @click="openPhotoModal"
          >
            <PhotoUploadButton
              variant="icon"
              size="md"
              :loading="false"
              class="pointer-events-none" 
            />
          </div>
          </div>
        <div class="nna-details">
          <h1 class="nna-name">{{ nnaData?.first_name }} {{ nnaData?.last_name }}</h1>
          <div class="nna-meta">
            <span v-if="nnaData?.rut" class="meta-item">
              <IdentificationIcon class="icon-sm" />
              {{ nnaData.rut }}
            </span>
            <span v-if="nnaData?.age" class="meta-item">
              <CalendarIcon class="icon-sm" />
              {{ nnaData.age }} años
            </span>
            <span v-if="nnaData?.grade" class="meta-item">
              <AcademicCapIcon class="icon-sm" />
              {{ nnaData.grade }}
            </span>
            <span v-if="nnaData?.autism_level" class="meta-item">
              <SparklesIcon class="icon-sm" />
              {{ nnaData.autism_level }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="header-actions">
      <button class="btn btn-secondary" @click="$emit('verDashboard')">
        <ChartBarIcon class="icon-sm" />
        Dashboard
      </button>
      <button class="btn btn-primary" @click="$emit('exportarDatos')">
        <DocumentArrowDownIcon class="icon-sm" />
        Exportar Datos
      </button>
    </div>
  </div>

  <PhotoUploadModal
    v-if="nnaData"
    v-model:visible="showPhotoModal"
    :child-id="nnaData.id || 0"
    :child-name="`${nnaData.first_name || ''} ${nnaData.last_name || ''}`"
    :current-photo-url="childPhotoUrl"
    @success="handlePhotoSuccess"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  // ArrowLeftIcon (Se queda en el padre)
  UserIcon,
  IdentificationIcon,
  CalendarIcon,
  AcademicCapIcon,
  SparklesIcon,
  ChartBarIcon,
  DocumentArrowDownIcon
} from '@heroicons/vue/24/outline'

// Imports para el modal de foto
import PhotoUploadButton from '@/components/common/PhotoUploadButton.vue'
import PhotoUploadModal from '@/components/dashboard/padres/PhotoUploadModal.vue'

// Props (Los mismos que tenía el padre)
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

// Emits (Los mismos que tenía el padre)
const emit = defineEmits<{
  verDashboard: []
  exportarDatos: []
  photoUploaded: [photoUrl: string] // Evento para notificar al padre
}>()

// Estado (Toda la lógica se mueve aquí)
const avatarKey = ref(0)
const imageLoaded = ref(false)
const showPhotoModal = ref(false)

const openPhotoModal = () => {
  if (!props.nnaData?.id) {
    console.error('[EncabezadoConFoto] No se puede abrir el modal, falta ID del NNA.')
    return
  }
  showPhotoModal.value = true
}

const handlePhotoSuccess = (photoUrl: string) => {
  avatarKey.value++
  emit('photoUploaded', photoUrl)
  showPhotoModal.value = false
}

/**
 * Construir URL de la imagen con timestamp para evitar caché
 */
const childPhotoUrl = computed(() => {
  if (!props.nnaData?.photo_url) {
    console.log('[EncabezadoConFoto] 📷 Sin foto disponible para:', props.nnaData?.id)
    return null
  }

  let fullUrl = props.nnaData.photo_url
  
  // Convertir URL relativa a absoluta
  if (!fullUrl.startsWith('http')) {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
    fullUrl = `${baseURL.replace('/api', '')}${fullUrl}`
  }
  
  // Agregar timestamp para evitar caché
  const timestamp = Date.now()
  const finalUrl = `${fullUrl}?t=${timestamp}`
  
  console.log('[EncabezadoConFoto] 📷 URL de foto construida:', {
    nnaId: props.nnaData?.id,
    original: props.nnaData.photo_url,
    final: finalUrl,
    hasPhoto: !!fullUrl
  })
  
  return finalUrl
})

/**
 * Manejar error al cargar la imagen
 */
const handleImageError = (event: Event) => {
  console.error('[EncabezadoConFoto] ❌ Error cargando imagen para NNA:', props.nnaData?.id, event)
  imageLoaded.value = false
}

/**
 * Manejar carga exitosa de imagen
 */
const handleImageLoad = () => {
  console.log('[EncabezadoConFoto] ✅ Imagen cargada exitosamente para NNA:', props.nnaData?.id)
  imageLoaded.value = true
}

/**
 * Watchers para detectar cambios en los datos del NNA
 */
watch(
  () => props.nnaData?.id,
  (newId, oldId) => {
    if (newId !== oldId) {
      console.log('[EncabezadoConFoto] 🔄 NNA cambió:', { old: oldId, new: newId })
      avatarKey.value++
      imageLoaded.value = false
    }
  }
)

watch(
  () => props.nnaData?.photo_url,
  (newUrl, oldUrl) => {
    if (newUrl !== oldUrl) {
      console.log('[EncabezadoConFoto] 🔄 Foto cambió:', { old: oldUrl, new: newUrl })
      avatarKey.value++
      imageLoaded.value = false
    }
  }
)
</script>

<style scoped>
/* Todos los estilos se mueven aquí, EXCEPTO .perfil-header, .breadcrumb y .breadcrumb-link */
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 1.25rem; /* ✅ Aumentado de 0.875rem a 1.25rem (20px) */
}

.avatar-placeholder {
  width: 80px;   /* ✅ Aumentado de 56px a 80px */
  height: 80px;  /* ✅ Aumentado de 56px a 80px */
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
  border: 2px solid #e2e8f0;
  flex-shrink: 0;
  overflow: hidden;
  transition: all 0.2s ease;
  position: relative;
}

.avatar-placeholder:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.nna-name {
  font-size: 1.5rem; /* ✅ Aumentado de 1.25rem a 1.5rem (text-2xl) */
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.375rem 0;
  line-height: 1.3;
}

.nna-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  font-size: 0.875rem; /* ✅ Aumentado de 0.75rem a 0.875rem (text-sm) */
  font-weight: 500;
  background: #f8fafc;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #f1f5f9;
  transition: all 0.2s ease;
}

.meta-item:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
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
  font-size: 0.875rem; /* ✅ Aumentado de 0.75rem a 0.875rem (text-sm) */
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
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
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
  width: 1rem; /* ✅ Aumentado de 0.875rem */
  height: 1rem; /* (16px) */
}

.icon-md {
  width: 1.25rem;
  height: 1.25rem;
}

.icon-lg {
  width: 1.5rem;
  height: 1.5rem;
}

/* ✅ NUEVO: Icono extra grande para el avatar fallback */
.icon-xl {
  width: 2.5rem; /* (40px) */
  height: 2.5rem;
}

/* Estilos responsive */
@media (max-width: 768px) {
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
    /* Mantenemos el tamaño responsive original, que es más pequeño */
    width: 48px;
    height: 48px;
  }
  
  .nna-name {
    /* Mantenemos el tamaño responsive original */
    font-size: 1.125rem;
  }
  
  /* ✅ AÑADIDO: Ajustar el icono fallback en responsive */
  .icon-xl {
    width: 1.5rem;
    height: 1.5rem;
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