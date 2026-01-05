<template>
  <div class="container-responsive">
    <div class="space-y-3 sm:space-y-4 lg:space-y-6">
      
      <Transition name="fade" mode="out-in">
        
        <div v-if="isLoading" key="loading" class="flex flex-col items-center justify-center py-8 sm:py-12">
          <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-sky-500"></div>
          <p class="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">Sincronizando información de la familia...</p>
        </div>
        
        <div v-else-if="!currentChild" key="empty" class="card-responsive bg-yellow-50 border border-yellow-200">
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
        
        <div v-else key="content" class="card-responsive">
          
          <div class="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
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

              <div class="hidden sm:flex absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 items-center justify-center">
                <PhotoUploadButton variant="icon" size="md" :loading="false" @click="openPhotoModal" />
              </div>
            </div>

            <div class="flex-1 w-full sm:w-auto min-w-0">
              <div class="flex flex-col sm:flex-row items-start sm:justify-between gap-2 sm:gap-4">
                <div class="w-full sm:flex-1 min-w-0 text-center sm:text-left">
                  <h1 class="text-responsive-2xl font-bold text-gray-900 truncate">
                    👋 ¡Bienvenido/a, {{ parentName }}!
                  </h1>
                  <div class="mt-1 sm:mt-2 space-y-0.5 sm:space-y-1">
                    <p class="text-responsive-lg font-semibold text-gray-700 truncate">{{ childName }}</p>
                    <p class="text-responsive-sm text-gray-500">{{ childAge }} años</p>
                  </div>
                </div>

                <PhotoUploadButton variant="secondary" size="sm" label="Cambiar foto" class="hidden lg:flex flex-shrink-0" @click="openPhotoModal" />
              </div>

              <button @click="openPhotoModal" class="mt-3 sm:hidden w-full px-4 py-2 bg-sky-100 text-sky-700 rounded-lg text-sm font-medium hover:bg-sky-200 transition-colors">
                📸 Cambiar foto
              </button>

              <div class="mt-3 sm:mt-4 flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-3 sm:gap-4">
                <div class="flex items-center gap-1.5 sm:gap-2">
                  <span class="text-lg sm:text-xl lg:text-2xl">💚</span>
                  <span class="text-responsive-sm font-medium text-gray-700">
                    Estado hoy: <span class="text-green-600 font-semibold">{{ reportsStore.latestUpdate?.emotional_state_display || 'Cargando...' }}</span>
                  </span>
                </div>
                <div class="flex items-center gap-1.5 sm:gap-2">
                  <span class="text-lg sm:text-xl lg:text-2xl">😊</span>
                  <span class="text-responsive-sm font-medium text-gray-700">
                    Ánimo: <span class="text-blue-600 font-semibold">Estable</span>
                  </span>
                </div>
              </div>

              <div class="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-sky-50 border border-sky-200 rounded-lg sm:rounded-xl">
                <p class="text-responsive-sm font-medium text-sky-900">
                  🏥 Próxima sesión: <span class="font-bold">Consultar con el centro terapéutico</span>
                </p>
              </div>
            </div>
          </div>

          <div class="mt-4 sm:mt-6">
            <SessionUltimaNotificacion />
          </div>
        </div>
      </Transition>

      <div v-if="currentChild && !isLoading" class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 animate-fade-in">
        
        <DailyMission 
          v-if="ninoStore.ninoActivoId"
          :mission-data="reportsStore.latestUpdate" 
        />

        <div class="flex flex-col gap-4">
           <SessionTimeline 
             v-if="reportsStore.timelineEvents && reportsStore.timelineEvents.length > 0"
             :events="reportsStore.timelineEvents" 
             :loading="reportsStore.isLoading" 
           />
           
           <div v-else class="card-responsive flex flex-col justify-center min-h-[200px]">
             <h3 class="text-responsive-lg font-semibold text-gray-900 mb-3 sm:mb-4">
               Calendario de Apoyo
             </h3>
             <p class="text-responsive-sm text-gray-600 italic">
               Enfócate en los objetivos de hoy. El progreso de {{ childName }} es constante.
             </p>
           </div>
        </div>
      </div>
    </div>

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
import { ref, onMounted, computed, watch } from 'vue'
import PhotoUploadButton from '@/components/common/PhotoUploadButton.vue'
import PhotoUploadModal from '@/components/dashboard/padres/PhotoUploadModal.vue'
import DailyMission from '@/components/gestion/rutinas/reports/DailyMission.vue'
import SessionUltimaNotificacion from '@/components/dashboard/padres/sesiones/SessionUltimaNotificacion.vue'
// ✅ IMPORTAR EL NUEVO TIMELINE
import SessionTimeline from '@/components/dashboard/padres/sesiones/SessionTimeline.vue'


// Stores y Composables
import { useAuth } from '@/composables/useAuth'
import { useAlertStore } from '@/store/alertStore'
import { useNinoActivoStore } from '@/store/ninoActivoStore'
import { useParentReportsStore } from '@/store/parentReportsStore'
import { childService, type ChildInfo } from '@/services/childService'

const { user } = useAuth()
const alert = useAlertStore()
const ninoStore = useNinoActivoStore()
const reportsStore = useParentReportsStore()

const showPhotoModal = ref(false)
const children = ref<ChildInfo[]>([])
const isLoading = ref(true)
const photoKey = ref(0) 

// --- COMPUTED ---

const parentName = computed(() => {
  if (!user.value) return 'Familia'
  const fullUserName = user.value.name || user.value.username || 'Usuario'
  return fullUserName.split(' ')[0]
})

const currentChild = computed(() => {
  if (children.value.length === 0) return null
  return children.value.find(c => c.id === ninoStore.ninoActivoId) || children.value[0]
})

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

// --- WATCHERS ---

watch(() => ninoStore.ninoActivoId, async (newId) => {
  if (newId && typeof newId === 'number') {
    console.log(`[Dashboard] 🔄 ID detectado: ${newId}. Sincronizando...`);
    await reportsStore.fetchLatestUpdate(newId);
  } else {
    reportsStore.clearStore();
  }
}, { immediate: true });

// --- METHODS ---

const syncActiveChild = async () => {
  if (ninoStore.hasData) return
  const storedId = localStorage.getItem('nino_activo_id')
  if (storedId) {
    await ninoStore.initializeFromStorage()
  } else if (children.value.length > 0) {
    await ninoStore.setNinoActivo(children.value[0].id)
  }
}

const fetchChildren = async () => {
  try {
    isLoading.value = true
    const response = await childService.getMyChildren()
    children.value = response.children
    
    if (children.value.length > 0) {
      await syncActiveChild()
    }
  } catch (error: any) {
    console.error('[Dashboard] ❌ Error:', error)
    alert.error('Error', 'No se pudieron cargar los datos.')
  } finally {
    isLoading.value = false
  }
}

const openPhotoModal = () => { if (currentChild.value) showPhotoModal.value = true }

const handlePhotoSuccess = (photoUrl: string) => {
  if (currentChild.value) {
    const updatedChild = { ...currentChild.value, photo_url: photoUrl, has_photo: true }
    const index = children.value.findIndex(c => c.id === currentChild.value!.id)
    if (index !== -1) children.value[index] = updatedChild
    photoKey.value++
  }
  showPhotoModal.value = false
}

const handleImageError = (event: Event) => console.error('[Dashboard] Error imagen:', event)

onMounted(() => fetchChildren())
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>