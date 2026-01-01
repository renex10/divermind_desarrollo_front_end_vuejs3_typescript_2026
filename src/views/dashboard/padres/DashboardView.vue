<template>
  <div class="container-responsive">
    <div class="space-y-3 sm:space-y-4 lg:space-y-6">
      
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-8 sm:py-12">
        <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-sky-500"></div>
        <p class="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">Cargando información...</p>
      </div>
      
      <!-- No Children State -->
      <div v-else-if="!currentChild" class="card-responsive bg-yellow-50 border border-yellow-200">
        <div class="flex items-start gap-3 sm:gap-4">
          <div class="text-2xl sm:text-3xl lg:text-4xl flex-shrink-0">⚠️</div>
          <div class="flex-1 min-w-0">
            <h3 class="text-responsive-lg font-semibold text-yellow-900">
              No tienes hijos registrados
            </h3>
            <p class="text-responsive-sm text-yellow-700 mt-1">
              Por favor contacta al administrador para registrar a tu hijo en el sistema.
            </p>
          </div>
        </div>
      </div>
      
      <!-- Main Content -->
      <div v-else class="card-responsive">
        <!-- Header with Photo -->
        <div class="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          
          <!-- Photo Container -->
          <div class="relative group mx-auto sm:mx-0" :key="photoKey">
            <div class="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden ring-2 sm:ring-4 ring-sky-100 shadow-md">
              <img
                v-if="childPhotoUrl"
                :src="childPhotoUrl"
                :alt="`Foto de ${childName}`"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-400 to-blue-500 text-white text-xl sm:text-2xl lg:text-4xl font-bold"
              >
                {{ childInitials }}
              </div>
            </div>

            <!-- Hover Overlay (solo desktop) -->
            <div
              class="hidden sm:flex absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 items-center justify-center"
            >
              <PhotoUploadButton
                variant="icon"
                size="md"
                :loading="false"
                @click="openPhotoModal"
              />
            </div>
          </div>

          <!-- Info Container -->
          <div class="flex-1 w-full sm:w-auto min-w-0">
            <div class="flex flex-col sm:flex-row items-start sm:justify-between gap-2 sm:gap-4">
              <!-- Text Info -->
              <div class="w-full sm:flex-1 min-w-0 text-center sm:text-left">
                <h1 class="text-responsive-2xl font-bold text-gray-900 truncate">
                  👋 ¡Bienvenido/a, {{ parentName }}!
                </h1>
                <div class="mt-1 sm:mt-2 space-y-0.5 sm:space-y-1">
                  <p class="text-responsive-lg font-semibold text-gray-700 truncate">
                    {{ childName }}
                  </p>
                  <p class="text-responsive-sm text-gray-500">
                    {{ childAge }} años
                  </p>
                </div>
              </div>

              <!-- Upload Button (desktop) -->
              <PhotoUploadButton
                variant="secondary"
                size="sm"
                label="Cambiar foto"
                class="hidden lg:flex flex-shrink-0"
                @click="openPhotoModal"
              />
            </div>

            <!-- Upload Button (mobile) -->
            <button
              @click="openPhotoModal"
              class="mt-3 sm:hidden w-full px-4 py-2 bg-sky-100 text-sky-700 rounded-lg text-sm font-medium hover:bg-sky-200 transition-colors"
            >
              📸 Cambiar foto
            </button>

            <!-- Status Pills -->
            <div class="mt-3 sm:mt-4 flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-3 sm:gap-4">
              <div class="flex items-center gap-1.5 sm:gap-2">
                <span class="text-lg sm:text-xl lg:text-2xl">💚</span>
                <span class="text-responsive-sm font-medium text-gray-700">
                  Estado hoy: <span class="text-green-600 font-semibold">Tranquilo</span>
                </span>
              </div>
              <div class="flex items-center gap-1.5 sm:gap-2">
                <span class="text-lg sm:text-xl lg:text-2xl">😊</span>
                <span class="text-responsive-sm font-medium text-gray-700">
                  Ánimo: <span class="text-blue-600 font-semibold">Contento</span>
                </span>
              </div>
            </div>

            <!-- Next Session -->
            <div class="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-sky-50 border border-sky-200 rounded-lg sm:rounded-xl">
              <p class="text-responsive-sm font-medium text-sky-900">
                🏥 Próxima sesión: 
                <span class="font-bold">Mañana 10:00 AM</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Last Notification -->
        <div class="mt-4 sm:mt-6">
          <SessionUltimaNotificacion />
        </div>
      </div>

      <!-- Activities Card -->
      <div v-if="currentChild" class="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <div class="card-responsive">
          <h3 class="text-responsive-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            Próximas actividades
          </h3>
          <p class="text-responsive-sm text-gray-600">
            No hay actividades programadas.
          </p>
        </div>
      </div>
    </div>

    <!-- Photo Upload Modal -->
    <PhotoUploadModal
      v-if="currentChild"
      v-model:visible="showPhotoModal"
      :child-id="childId"
      :child-name="childName"
      :current-photo-url="childPhotoUrl"
      @success="handlePhotoSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import PhotoUploadButton from '@/components/common/PhotoUploadButton.vue'
import PhotoUploadModal from '@/components/dashboard/padres/PhotoUploadModal.vue'
import { useAuth } from '@/composables/useAuth'
import { useAlertStore } from '@/store/alertStore'
import { useNinoActivoStore } from '@/store/ninoActivoStore'
import { childService, type ChildInfo } from '@/services/childService'
import SessionUltimaNotificacion from '@/components/dashboard/padres/sesiones/SessionUltimaNotificacion.vue'

const { user } = useAuth()
const alert = useAlertStore()
const ninoStore = useNinoActivoStore()

const showPhotoModal = ref(false)
const children = ref<ChildInfo[]>([])
const selectedChild = ref<ChildInfo | null>(null)
const isLoading = ref(true)
const photoKey = ref(0) 

const parentName = computed(() => {
  if (!user.value) return 'Usuario'
  const userName = user.value.name || user.value.username || 'Usuario'
  return userName.split(' ')[0]
})

const currentChild = computed(() => selectedChild.value || children.value[0] || null)
const childId = computed(() => currentChild.value?.id || 0)
const childName = computed(() => currentChild.value?.nombre_completo || 'Sin nombre')
const childAge = computed(() => currentChild.value?.edad || 0)

const childPhotoUrl = computed(() => {
  const url = currentChild.value?.photo_url
  if (!url) return null
  
  let fullUrl = url
  if (!url.startsWith('http')) {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
    fullUrl = `${baseURL.replace('/api', '')}${url}`
  }
  
  return `${fullUrl}?t=${Date.now()}`
})

const childInitials = computed(() => {
  if (!currentChild.value) return '?'
  const parts = currentChild.value.nombre_completo.split(' ')
  return parts.map(p => p[0]).join('').slice(0, 2).toUpperCase()
})

const autoSelectChild = async () => {
  if (ninoStore.hasData) return
  
  const storedId = localStorage.getItem('nino_activo_id')
  if (storedId) {
    try {
      await ninoStore.initializeFromStorage()
      if (ninoStore.hasData) return
    } catch (error) {
      console.error('❌ Error:', error)
    }
  }
  
  if (children.value.length > 0) {
    try {
      await ninoStore.setNinoActivo(children.value[0].id)
    } catch (error) {
      console.error('❌ Error:', error)
    }
  }
}

const fetchChildren = async () => {
  try {
    isLoading.value = true
    const response = await childService.getMyChildren()
    children.value = response.children
    
    if (children.value.length > 0) {
      selectedChild.value = children.value[0]
      await autoSelectChild()
    }
  } catch (error: any) {
    console.error('[DashboardView] ❌ Error:', error)
    alert.error('Error', 'No se pudieron cargar los datos de tu hijo.')
  } finally {
    isLoading.value = false
  }
}

const openPhotoModal = () => {
  if (!currentChild.value) {
    alert.warning('Sin hijo seleccionado', 'No se puede subir foto sin un hijo asociado.')
    return
  }
  showPhotoModal.value = true
}

const handlePhotoSuccess = (photoUrl: string) => {
  if (currentChild.value) {
    const updatedChild = {
      ...currentChild.value,
      photo_url: photoUrl,
      has_photo: true
    }
    
    const index = children.value.findIndex(c => c.id === currentChild.value!.id)
    if (index !== -1) {
      children.value[index] = updatedChild
    }
    
    selectedChild.value = updatedChild
    photoKey.value++
  }
  showPhotoModal.value = false
}

const handleImageError = (event: Event) => {
  console.error('[DashboardView] ❌ Error:', event)
}

onMounted(() => {
  fetchChildren()
})
</script>