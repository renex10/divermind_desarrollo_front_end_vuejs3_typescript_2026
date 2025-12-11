<!-- src/views/dashboard/padres/DashboardView.vue -->
<template>
  <div class="space-y-6">
    
    <!-- LOADING -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      <p class="ml-4 text-gray-600">Cargando información...</p>
    </div>
    
    <!-- SIN HIJOS -->
    <div v-else-if="!currentChild" class="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
      <div class="flex items-start gap-4">
        <div class="text-4xl">⚠️</div>
        <div>
          <h3 class="text-lg font-semibold text-yellow-900">No tienes hijos registrados</h3>
          <p class="text-sm text-yellow-700 mt-1">
            Por favor contacta al administrador para registrar a tu hijo en el sistema.
          </p>
        </div>
      </div>
    </div>
    
    <!-- CON HIJO -->
    <div v-else class="bg-white rounded-xl shadow-soft p-6">
      <div class="flex items-start gap-6">
        
        <!-- FOTO DE PERFIL CON BOTÓN -->
        <div class="relative group" :key="photoKey">
          <!-- Avatar -->
          <div class="w-32 h-32 rounded-full overflow-hidden ring-4 ring-sky-100 shadow-md">
            <img
              v-if="childPhotoUrl"
              :src="childPhotoUrl"
              :alt="`Foto de ${childName}`"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <div
              v-else
              :class="[
                'w-full h-full flex items-center justify-center',
                'bg-gradient-to-br from-sky-400 to-blue-500 text-white',
                'text-4xl font-bold'
              ]"
            >
              {{ childInitials }}
            </div>
          </div>

          <!-- Overlay con botón (visible en hover) -->
          <div
            class="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
          >
            <PhotoUploadButton
              variant="icon"
              size="md"
              :loading="false"
              @click="openPhotoModal"
            />
          </div>
        </div>

        <!-- INFO DEL HIJO -->
        <div class="flex-1">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">
                👋 ¡Bienvenido/a, {{ parentName }}!
              </h1>
              <div class="mt-2 space-y-1">
                <p class="text-xl font-semibold text-gray-700">
                  {{ childName }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ childAge }} años
                </p>
              </div>
            </div>

            <!-- Botón cambiar foto (visible siempre en desktop) -->
            <PhotoUploadButton
              variant="secondary"
              size="sm"
              label="Cambiar foto"
              class="hidden md:flex"
              @click="openPhotoModal"
            />
          </div>

          <!-- Estado actual -->
          <div class="mt-4 flex items-center gap-4">
            <div class="flex items-center gap-2">
              <span class="text-2xl">💚</span>
              <span class="text-sm font-medium text-gray-700">
                Estado hoy: <span class="text-green-600">Tranquilo</span>
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-2xl">😊</span>
              <span class="text-sm font-medium text-gray-700">
                Ánimo: <span class="text-blue-600">Contento</span>
              </span>
            </div>
          </div>

          <!-- Próxima sesión -->
          <div class="mt-4 p-3 bg-sky-50 border border-sky-200 rounded-lg">
            <p class="text-sm font-medium text-sky-900">
              🏥 Próxima sesión: <span class="font-bold">Mañana 10:00 AM</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Mensaje del terapeuta -->
      <SessionUltimaNotificacion />


        <!-- finMensaje del terapeuta -->
    
    </div>

    <!-- RESTO DEL DASHBOARD -->
    <div v-if="currentChild" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Aquí puedes agregar más secciones -->
      <div class="bg-white rounded-xl shadow-soft p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Próximas actividades</h3>
        <p class="text-sm text-gray-600">No hay actividades programadas.</p>
      </div>
    </div>

  </div>

  <!-- MODAL DE SUBIDA DE FOTO -->
  <PhotoUploadModal
    v-if="currentChild"
    v-model:visible="showPhotoModal"
    :child-id="childId"
    :child-name="childName"
    :current-photo-url="childPhotoUrl"
    @success="handlePhotoSuccess"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import PhotoUploadButton from '@/components/common/PhotoUploadButton.vue'
import PhotoUploadModal from '@/components/dashboard/padres/PhotoUploadModal.vue'
import { useAuth } from '@/composables/useAuth'
import { useAlertStore } from '@/store/alertStore'
import { childService, type ChildInfo } from '@/services/childService'
import SessionUltimaNotificacion from '@/components/dashboard/padres/sesiones/SessionUltimaNotificacion.vue'

const { user } = useAuth()
const alert = useAlertStore()

// Estado
const showPhotoModal = ref(false)
const children = ref<ChildInfo[]>([])
const selectedChild = ref<ChildInfo | null>(null)
const isLoading = ref(true)
const photoKey = ref(0)  // 🔥 AGREGAR: Key para forzar re-render

// Datos del padre
const parentName = computed(() => {
  if (!user.value) return 'Usuario'
  const userName = user.value.name || user.value.username || 'Usuario'
  return userName.split(' ')[0]
})

// Datos del hijo seleccionado
const currentChild = computed(() => selectedChild.value || children.value[0] || null)

const childId = computed(() => currentChild.value?.id || 0)
const childName = computed(() => currentChild.value?.nombre_completo || 'Sin nombre')
const childAge = computed(() => currentChild.value?.edad || 0)

// URL de la foto con timestamp para evitar caché
const childPhotoUrl = computed(() => {
  const url = currentChild.value?.photo_url
  if (!url) return null
  
  // Construir URL absoluta
  let fullUrl = url
  if (!url.startsWith('http')) {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
    fullUrl = `${baseURL.replace('/api', '')}${url}`
  }
  
  // 🔥 AGREGAR: Timestamp para evitar caché del navegador
  const timestamp = Date.now()
  return `${fullUrl}?t=${timestamp}`
})

const childInitials = computed(() => {
  if (!currentChild.value) return '?'
  const parts = currentChild.value.nombre_completo.split(' ')
  return parts.map(p => p[0]).join('').slice(0, 2).toUpperCase()
})

// Métodos
const fetchChildren = async () => {
  try {
    isLoading.value = true
    console.log('[DashboardView] 🔍 Obteniendo hijos...')
    
    const response = await childService.getMyChildren()
    
    children.value = response.children
    
    console.log('[DashboardView] ✅ Hijos cargados:', response.count)
    
    if (children.value.length > 0) {
      selectedChild.value = children.value[0]
      console.log('[DashboardView] 👤 Hijo seleccionado:', selectedChild.value.nombre_completo)
      console.log('[DashboardView] 📷 Foto URL:', childPhotoUrl.value)
    } else {
      console.warn('[DashboardView] ⚠️ No hay hijos registrados')
      alert.info(
        'No tienes hijos registrados',
        'Por favor contacta al administrador para registrar a tu hijo.'
      )
    }
  } catch (error: any) {
    console.error('[DashboardView] ❌ Error cargando hijos:', error)
    alert.error(
      'Error',
      'No se pudieron cargar los datos de tu hijo. Intenta recargar la página.'
    )
  } finally {
    isLoading.value = false
  }
}

const openPhotoModal = () => {
  if (!currentChild.value) {
    alert.warning(
      'Sin hijo seleccionado',
      'No se puede subir foto sin un hijo asociado.'
    )
    return
  }
  
  console.log('[DashboardView] 📸 Abriendo modal de foto')
  showPhotoModal.value = true
}

const handlePhotoSuccess = (photoUrl: string) => {
  console.log('[DashboardView] ✅ Foto actualizada:', photoUrl)
  
  // 🔥 MÉTODO 1: Actualizar el objeto completo (forzar reactividad)
  if (currentChild.value) {
    const updatedChild = {
      ...currentChild.value,
      photo_url: photoUrl,
      has_photo: true
    }
    
    // Actualizar en el array de children
    const index = children.value.findIndex(c => c.id === currentChild.value!.id)
    if (index !== -1) {
      children.value[index] = updatedChild
    }
    
    // Actualizar selectedChild
    selectedChild.value = updatedChild
    
    // 🔥 MÉTODO 2: Incrementar key para forzar re-render
    photoKey.value++
    
    console.log('[DashboardView] 🔄 Foto actualizada en estado local, key:', photoKey.value)
  }
  
  showPhotoModal.value = false
}

// 🔥 AGREGAR: Handler para errores de carga de imagen
const handleImageError = (event: Event) => {
  console.error('[DashboardView] ❌ Error cargando imagen:', event)
  // Opcional: Mostrar placeholder o reintentar
}

// Lifecycle
onMounted(() => {
  console.log('[DashboardView] 🚀 Montando dashboard')
  fetchChildren()
})
</script>