<!-- src/components/ninos/SubComponentes/TablaDesktopRow.vue -->
<!-- ✅ VERSIÓN ACTUALIZADA - Navegación directa a /resumen -->
<template>
  <tr class="data-row">
    <td class="name-cell">
      <div class="name-wrapper">
        <!-- Avatar con imagen o fallback a iniciales -->
        <div class="avatar" :key="avatarKey">
          <img
            v-if="photoUrl"
            :src="photoUrl"
            :alt="`Foto de ${nna.first_name || 'niño'} ${nna.last_name || ''}`"
            class="avatar-image"
            @error="handleImageError"
            @load="handleImageLoad"
          />
          <span v-else class="avatar-initials">
            {{ getInitials(nna.first_name, nna.last_name) }}
          </span>
        </div>
        <div class="name-details">
          <!-- 🆕 NOMBRE CLICKABLE PARA NAVEGAR AL PERFIL CON RESUMEN -->
          <span 
            class="name clickable-name" 
            @click="verPerfilNino"
            :title="`Ver perfil de ${nna.first_name || 'niño'} ${nna.last_name || ''}`"
          >
            {{ nna.first_name }} {{ nna.last_name }}
          </span>
          <span class="rut" v-if="nna.rut">{{ nna.rut }}</span>
        </div>
      </div>
    </td>
    <td>
      <div class="commune-info">
        <span>{{ nna.commune_name || 'Sin comuna' }}</span>
        <span class="autism-level" v-if="nna.autism_level">{{ nna.autism_level }}</span>
      </div>
    </td>
    <td>
      <span class="age-badge">{{ calculateAge(nna.birth_date) }} años</span>
    </td>
    <td>
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
        {{ nna.pie_status_display || (nna.status === 'active' ? 'Activo' : 'Suspendido') }}
      </span>
    </td>
    <td>
      <span class="session-date">{{ formatLastSession(nna.last_session) }}</span>
    </td>
    <td class="actions-cell">
      <div class="actions-buttons">
        <!-- 🆕 BOTÓN VIEW ACTUALIZADO PARA NAVEGAR AL PERFIL CON RESUMEN -->
        <button 
          @click="verPerfilNino" 
          class="action-btn view-btn"
          :title="`Ver perfil completo de ${nna.first_name || 'niño'}`"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
        </button>
        <button 
          @click="handleEdit" 
          class="action-btn edit-btn"
          title="Editar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
/**
 * TablaDesktopRow.vue - VERSIÓN ACTUALIZADA
 * ✨ Navegación directa a la ruta /resumen del perfil del niño
 */

import { useRouter } from 'vue-router'
import { computed, ref, watch } from 'vue'

// Inicializar router para la navegación
const router = useRouter()

// ============================================================================
// INTERFACE
// ============================================================================

interface NnaData {
  id: number | string
  first_name: string
  last_name: string
  birth_date: string
  current_grade: string
  status: 'active' | 'suspended'
  last_session: string
  rut?: string
  full_name?: string
  commune_name?: string
  region_name?: string
  address?: string
  autism_level?: string
  school_journey?: string
  created_at?: string
  pie_status_display?: string
  attended_where_name?: string
  usuarios_count?: number
  autism_level_value?: string
  photo_url?: string
  has_photo?: boolean
}

// ============================================================================
// PROPS & EMITS
// ============================================================================

const props = defineProps<{
  nna: NnaData
}>()

const emit = defineEmits<{
  view: [nna: NnaData]
  edit: [nna: NnaData]
  toggle: [nna: NnaData, newStatus: 'active' | 'suspended']
}>()

// ============================================================================
// STATE
// ============================================================================

const avatarKey = ref(0)
const imageLoaded = ref(false)

// ============================================================================
// COMPUTED
// ============================================================================

/**
 * ✅ Construir URL absoluta de la foto con timestamp anti-caché
 */
const photoUrl = computed(() => {
  if (!props.nna?.photo_url) return null

  try {
    let fullUrl = props.nna.photo_url

    // Convertir URL relativa a absoluta si es necesario
    if (!fullUrl.startsWith('http')) {
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
      fullUrl = `${baseURL.replace('/api', '')}${fullUrl}`
    }

    // Agregar timestamp para forzar la actualización de la imagen en el navegador
    return `${fullUrl}?t=${Date.now()}`
  } catch (error) {
    console.error('[TablaDesktopRow] Error construyendo URL:', error)
    return null
  }
})

// ============================================================================
// METHODS
// ============================================================================

/**
 * ✅ Navegar directamente a /resumen del perfil del niño
 * Cambiado de 'perfil-nino' a 'perfil-nino-resumen'
 */
const verPerfilNino = () => {
  console.log(`[TablaDesktopRow] Navegando al resumen del perfil del niño ID: ${props.nna.id}`)
  
  // Redirige directamente a la ruta /resumen
  router.push({ 
    name: 'perfil-nino-resumen',
    params: { id: props.nna.id.toString() }
  })
  
  emit('view', props.nna)
}

const handleImageError = () => {
  imageLoaded.value = false
}

const handleImageLoad = () => {
  imageLoaded.value = true
}

/**
 * ✅ Obtener iniciales con validación defensiva
 */
const getInitials = (firstName: string | undefined, lastName: string | undefined): string => {
  if (!firstName && !lastName) return '?'
  if (firstName && !lastName) return firstName.charAt(0).toUpperCase()
  if (!firstName && lastName) return lastName.charAt(0).toUpperCase()
  
  return `${firstName!.charAt(0)}${lastName!.charAt(0)}`.toUpperCase()
}

/**
 * ✅ Calcular edad validando la integridad de la fecha
 */
const calculateAge = (birthDate: string | undefined): number => {
  if (!birthDate) return 0
  
  const birth = new Date(birthDate)
  if (isNaN(birth.getTime())) return 0
  
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

/**
 * ✅ Formatear fecha de última sesión de forma amigable
 */
const formatLastSession = (date: string): string => {
  if (!date) return 'Nunca'
  
  const sessionDate = new Date(date)
  if (isNaN(sessionDate.getTime())) return 'Fecha inválida'
  
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (sessionDate.toDateString() === today.toDateString()) return 'Hoy'
  if (sessionDate.toDateString() === yesterday.toDateString()) return 'Ayer'
  
  return sessionDate.toLocaleDateString('es-CL', { 
    day: '2-digit', month: '2-digit', year: 'numeric' 
  })
}

const handleToggleStatus = () => {
  const newStatus = props.nna.status === 'active' ? 'suspended' : 'active'
  emit('toggle', props.nna, newStatus)
}

const handleEdit = () => {
  emit('edit', props.nna)
}

// ============================================================================
// WATCHERS (Actualización de Avatar)
// ============================================================================

watch(
  [() => props.nna?.photo_url, () => props.nna?.id],
  () => {
    avatarKey.value++
    imageLoaded.value = false
  }
)
</script>

<style scoped>
/* ========================================================================== */
/* LAYOUT PRINCIPAL                                                          */
/* ========================================================================== */

.data-row {
  transition: background 0.2s;
}

.data-row:hover {
  background: #f9fafb;
}

.name-cell {
  font-weight: 500;
}

.name-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* ========================================================================== */
/* AVATAR CON IMAGEN                                                         */
/* ========================================================================== */

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
  overflow: hidden;
  border: 2px solid #e2e8f0;
  transition: all 0.2s ease;
}

.avatar:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-initials {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

/* ========================================================================== */
/* DETALLES DEL NOMBRE                                                       */
/* ========================================================================== */

.name-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.name {
  font-weight: 500;
  color: #1f2937;
}

.clickable-name {
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.125rem 0.25rem;
  border-radius: 4px;
  display: inline-block;
}

.clickable-name:hover {
  color: #3b82f6;
  background-color: #f0f9ff;
  text-decoration: underline;
  transform: translateY(-1px);
}

.clickable-name:active {
  transform: translateY(0);
}

.rut {
  font-size: 0.75rem;
  color: #6b7280;
}

/* ========================================================================== */
/* INFORMACIÓN ADICIONAL                                                     */
/* ========================================================================== */

.commune-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.autism-level {
  font-size: 0.75rem;
  color: #7c3aed;
  background: #f3f4f6;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
  max-width: fit-content;
}

.age-badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  background: #e0e7ff;
  color: #3730a3;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* ========================================================================== */
/* TOGGLE SWITCH                                                             */
/* ========================================================================== */

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

/* ========================================================================== */
/* SESIÓN                                                                    */
/* ========================================================================== */

.session-date {
  font-size: 0.875rem;
  color: #6b7280;
}

/* ========================================================================== */
/* ACCIONES                                                                  */
/* ========================================================================== */

.actions-cell {
  text-align: center;
}

.actions-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.action-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  transform: translateY(-1px);
}

.view-btn {
  background: #dbeafe;
  color: #1e40af;
}

.view-btn:hover {
  background: #bfdbfe;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.edit-btn {
  background: #fef3c7;
  color: #d97706;
}

.edit-btn:hover {
  background: #fde68a;
  box-shadow: 0 2px 4px rgba(217, 119, 6, 0.3);
}

/* ========================================================================== */
/* ACCESIBILIDAD                                                             */
/* ========================================================================== */

.clickable-name:focus-visible,
.action-btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* ========================================================================== */
/* RESPONSIVE                                                                */
/* ========================================================================== */

@media (max-width: 768px) {
  .clickable-name {
    padding: 0.25rem 0.5rem;
  }
  
  .name-wrapper {
    gap: 0.5rem;
  }
  
  .avatar {
    width: 32px;
    height: 32px;
    font-size: 0.7rem;
  }
}
</style>