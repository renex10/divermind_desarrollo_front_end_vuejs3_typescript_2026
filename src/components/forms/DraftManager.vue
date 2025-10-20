<!-- src/components/forms/DraftManager.vue -->

<template>
  <div class="draft-manager">
    <!-- Indicador de estado de guardado -->
    <div v-if="showStatusIndicator" class="save-status-indicator" :class="statusClass">
      <div class="status-content">
        <span class="status-icon">
          <CheckCircleIcon v-if="lastSaveTime && !hasUnsavedChanges" class="h-4 w-4" />
          <ClockIcon v-else-if="hasUnsavedChanges" class="h-4 w-4 animate-pulse" />
          <ExclamationCircleIcon v-else class="h-4 w-4" />
        </span>
        <span class="status-text">
          <template v-if="lastSaveTime && !hasUnsavedChanges">
            Guardado {{ lastSavedText }}
          </template>
          <template v-else-if="hasUnsavedChanges">
            Guardando cambios...
          </template>
          <template v-else>
            No guardado
          </template>
        </span>
        <button
          v-if="hasUnsavedChanges"
          @click="forceSave"
          class="force-save-btn"
          title="Guardar ahora"
        >
          <ArrowDownTrayIcon class="h-3 w-3" />
        </button>
      </div>
    </div>

    <!-- Modal de recuperación de borrador -->
    <BaseModal
      v-if="showRecoveryModal"
      v-model:show="showRecoveryModal"
      title="Borrador encontrado"
      size="lg"
      @close="handleRecoveryClose"
    >
      <div class="recovery-modal-content">
        <div class="recovery-header">
          <div class="recovery-icon">
            <DocumentTextIcon class="h-12 w-12 text-blue-500" />
          </div>
          <div class="recovery-info">
            <h3 class="recovery-title">¿Continuar con el borrador anterior?</h3>
            <p class="recovery-description">
              Encontramos un borrador no guardado de este formulario.
            </p>
          </div>
        </div>

        <div class="draft-details">
          <div class="draft-detail">
            <strong>Paso:</strong> {{ latestDraft?.metadata?.step || 'N/A' }}
          </div>
          <div class="draft-detail">
            <strong>Última modificación:</strong> {{ formatDate(latestDraft?.metadata?.updatedAt) }}
          </div>
          <div v-if="draftPreview" class="draft-detail">
            <strong>Vista previa:</strong> {{ draftPreview }}
          </div>
        </div>

        <div class="recovery-actions">
          <button
            @click="handleRecover"
            class="btn btn-primary recovery-btn"
            :disabled="!latestDraft"
          >
            <ArrowPathIcon class="h-4 w-4 mr-2" />
            Continuar con borrador
          </button>
          <button
            @click="handleDiscard"
            class="btn btn-secondary discard-btn"
          >
            <TrashIcon class="h-4 w-4 mr-2" />
            Descartar borrador
          </button>
          <button
            @click="handleCompare"
            class="btn btn-outline compare-btn"
            :disabled="!latestDraft"
          >
            <EyeIcon class="h-4 w-4 mr-2" />
            Comparar cambios
          </button>
        </div>
      </div>
    </BaseModal>

    <!-- Modal de comparación de cambios -->
    <BaseModal
      v-if="showCompareModal"
      v-model:show="showCompareModal"
      title="Comparar cambios"
      size="xl"
    >
      <div class="compare-modal-content">
        <div class="compare-grid">
          <div class="compare-section">
            <h4 class="compare-title">Borrador guardado</h4>
            <div class="compare-data">
              <pre>{{ JSON.stringify(compareDraftData, null, 2) }}</pre>
            </div>
          </div>
          <div class="compare-section">
            <h4 class="compare-title">Formulario actual</h4>
            <div class="compare-data">
              <pre>{{ JSON.stringify(compareCurrentData, null, 2) }}</pre>
            </div>
          </div>
        </div>
        
        <div class="compare-actions">
          <button @click="useDraft" class="btn btn-primary">
            Usar borrador guardado
          </button>
          <button @click="useCurrent" class="btn btn-secondary">
            Usar formulario actual
          </button>
          <button @click="mergeChanges" class="btn btn-outline">
            Combinar cambios
          </button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useFormDraftStore } from '@/store/formDraftStore'
import BaseModal from '@/components/modal/BaseModal.vue'
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'

interface Props {
  formId: string
  showStatus?: boolean
  currentData?: any
  currentStep?: number
}

const props = withDefaults(defineProps<Props>(), {
  showStatus: true,
  currentData: () => ({}),
  currentStep: 1
})

const emit = defineEmits<{
  (e: 'recover', data: any, step: number): void
  (e: 'discard'): void
  (e: 'save'): void
}>()

const store = useFormDraftStore()
const showRecoveryModal = ref(false)
const showCompareModal = ref(false)
const compareDraftData = ref({})
const compareCurrentData = ref({})

// Computed
const latestDraft = computed(() => {
  const drafts = store.getDraftsByFormId(props.formId)
  return drafts.length > 0 ? drafts[0] : null
})

const hasDrafts = computed(() => store.hasDraftsForForm(props.formId))
const lastSavedText = computed(() => store.lastSavedText)
const lastSaveTime = computed(() => store.lastSavedAt)

// ✅ CORREGIDO: Acceso seguro a recoveryOptions
const recoveryOptions = computed(() => store.recoveryOptions || {
  allowRecovery: true,
  showRecoveryModal: true,
  autoRecover: false
})

const hasUnsavedChanges = computed(() => {
  // Esta lógica debería venir del composable useFormDraft
  return false // Placeholder
})

const showStatusIndicator = computed(() => props.showStatus)
const statusClass = computed(() => ({
  'status-saved': lastSaveTime.value && !hasUnsavedChanges.value,
  'status-saving': hasUnsavedChanges.value,
  'status-unsaved': !lastSaveTime.value && !hasUnsavedChanges.value
}))

const draftPreview = computed(() => {
  if (!latestDraft.value) return ''
  
  const data = latestDraft.value.data
  if (data.first_name && data.last_name) {
    return `${data.first_name} ${data.last_name}`
  }
  if (data.email) {
    return data.email
  }
  return 'Borrador sin título'
})

// Métodos
const formatDate = (date: Date | undefined) => {
  if (!date) return 'N/A'
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date)
}

const handleRecover = () => {
  if (latestDraft.value) {
    emit('recover', latestDraft.value.data, latestDraft.value.metadata.step)
    showRecoveryModal.value = false
  }
}

const handleDiscard = () => {
  store.clearFormDrafts(props.formId)
  emit('discard')
  showRecoveryModal.value = false
}

const handleCompare = () => {
  if (latestDraft.value) {
    compareDraftData.value = latestDraft.value.data
    compareCurrentData.value = props.currentData
    showRecoveryModal.value = false
    showCompareModal.value = true
  }
}

const handleRecoveryClose = () => {
  showRecoveryModal.value = false
}

const useDraft = () => {
  if (latestDraft.value) {
    emit('recover', latestDraft.value.data, latestDraft.value.metadata.step)
  }
  showCompareModal.value = false
}

const useCurrent = () => {
  store.clearFormDrafts(props.formId)
  showCompareModal.value = false
}

const mergeChanges = () => {
  // Lógica para combinar cambios (implementación básica)
  const merged = { ...compareCurrentData.value, ...compareDraftData.value }
  emit('recover', merged, latestDraft.value?.metadata.step || 1)
  showCompareModal.value = false
}

const forceSave = () => {
  emit('save')
}

// Lifecycle
onMounted(() => {
  // ✅ CORREGIDO: Acceso seguro con optional chaining
  if (hasDrafts.value && recoveryOptions.value?.showRecoveryModal) {
    setTimeout(() => {
      showRecoveryModal.value = true
    }, 500)
  }
})

// Watchers
watch(() => props.formId, (newFormId) => {
  // ✅ CORREGIDO: Acceso seguro con optional chaining
  if (store.hasDraftsForForm(newFormId) && recoveryOptions.value?.showRecoveryModal) {
    showRecoveryModal.value = true
  }
})
</script>

<style scoped>
.draft-manager {
  @apply relative;
}

.save-status-indicator {
  @apply fixed bottom-4 right-4 z-40 rounded-lg border px-3 py-2 text-sm shadow-lg transition-all duration-300;
}

.status-saved {
  @apply bg-green-50 border-green-200 text-green-800;
}

.status-saving {
  @apply bg-blue-50 border-blue-200 text-blue-800;
}

.status-unsaved {
  @apply bg-yellow-50 border-yellow-200 text-yellow-800;
}

.status-content {
  @apply flex items-center gap-2;
}

.status-icon {
  @apply flex-shrink-0;
}

.status-text {
  @apply font-medium;
}

.force-save-btn {
  @apply p-1 rounded hover:bg-white hover:bg-opacity-20 transition-colors;
}

.recovery-modal-content {
  @apply space-y-6;
}

.recovery-header {
  @apply flex items-start gap-4;
}

.recovery-icon {
  @apply flex-shrink-0;
}

.recovery-info {
  @apply flex-1;
}

.recovery-title {
  @apply text-lg font-semibold text-gray-900 mb-1;
}

.recovery-description {
  @apply text-gray-600;
}

.draft-details {
  @apply bg-gray-50 rounded-lg p-4 space-y-2;
}

.draft-detail {
  @apply text-sm text-gray-700;
}

.recovery-actions {
  @apply flex flex-col gap-3;
}

.recovery-btn {
  @apply bg-blue-600 hover:bg-blue-700 text-white;
}

.recovery-btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.discard-btn {
  @apply bg-red-600 hover:bg-red-700 text-white;
}

.compare-btn {
  @apply border-gray-300 text-gray-700 hover:bg-gray-50;
}

.compare-btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.compare-modal-content {
  @apply space-y-6;
}

.compare-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6;
}

.compare-section {
  @apply space-y-3;
}

.compare-title {
  @apply text-sm font-medium text-gray-900;
}

.compare-data {
  @apply bg-gray-50 rounded-lg p-4 max-h-60 overflow-auto;
}

.compare-data pre {
  @apply text-xs;
}

.compare-actions {
  @apply flex gap-3 justify-end;
}

.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
}

.btn-secondary {
  @apply bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500;
}

.btn-outline {
  @apply border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500;
}

@media (max-width: 768px) {
  .save-status-indicator {
    @apply bottom-2 right-2 left-2;
  }
  
  .recovery-actions {
    @apply grid grid-cols-1;
  }
  
  .compare-actions {
    @apply flex-col;
  }
  
  .compare-grid {
    @apply grid-cols-1;
  }
}
</style>