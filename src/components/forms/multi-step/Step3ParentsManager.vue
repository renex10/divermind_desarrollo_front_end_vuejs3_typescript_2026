<!-- src/components/forms/multi-step/steps/Step3ParentsManager.vue -->
<template>
  <div class="step3-parents-manager">
    <div class="step-header">
      <h3>👥 Asignación de Padres/Tutores</h3>
      <p>Busque y asigne los padres o tutores responsables del niño</p>
    </div>

    <!-- Formulario principal con FormKit -->
    <FormKit
      type="form"
      id="parentsForm"
      v-model="internalFormData"
      :actions="false"
      @input="handleFormInput"
      :config="{
        validationVisibility: 'live'
      }"
    >
      <!-- Sección: Búsqueda de Padres Existentes -->
      <BusquedaPadre 
        :selected-parents="selectedParents"
        @parent-selected="handleParentSelected"
        @search-complete="handleSearchComplete"
        @search-error="handleSearchError"
      />

      <!-- Sección: Crear Nuevo Padre -->
      <CrearNuevoPadre @parent-created="handleParentCreated" />

      <!-- Sección: Padres Seleccionados -->
      <div class="form-section">
        <h4>👨‍👩‍👧‍👦 Padres/Tutores Asignados</h4>
        
        <div v-if="selectedParents.length === 0" class="no-parents">
          <p>No hay padres/tutores asignados aún.</p>
          <p class="help-text">Use la búsqueda o cree un nuevo padre para asignar al niño.</p>
        </div>

        <div v-else class="selected-parents">
          <div 
            v-for="parent in selectedParents" 
            :key="parent.id"
            class="selected-parent-card"
          >
            <div class="parent-info">
              <h6>{{ parent.first_name }} {{ parent.last_name }}</h6>
              <div class="parent-details">
                <span class="detail-item">📧 {{ parent.email }}</span>
                <span class="detail-item">🆔 {{ parent.rut }}</span>
                <span v-if="parent.phone" class="detail-item">📞 {{ parent.phone }}</span>
              </div>
            </div>
            <button
              type="button"
              class="btn btn-danger btn-sm"
              @click="removeParent(parent.id)"
              title="Remover padre/tutor"
            >
              🗑️ Remover
            </button>
          </div>
        </div>
      </div>

      <!-- Campo oculto para almacenar IDs -->
      <FormKit
        type="hidden"
        name="usuarios"
        :value="selectedParents.map(p => p.id)"
      />
    </FormKit>

    <!-- Indicador de Validación -->
    <div v-if="showValidation" class="validation-status">
      <div v-if="isValid" class="status-valid">
        ✅ Al menos un padre/tutor asignado
      </div>
      <div v-else class="status-invalid">
        ⚠️ Debe asignar al menos un padre/tutor al niño
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { NneFormData, ParentUser } from '@/types/nne'
import BusquedaPadre from './components/BusquedaPadre.vue'
import CrearNuevoPadre from './components/CrearNuevoPadre.vue'
import { useAlertModalStore } from '@/store/alertModalStore'

interface Props {
  formData: Partial<NneFormData>
  showValidation?: boolean
}

interface Emits {
  (e: 'update:formData', data: Partial<NneFormData>): void
  (e: 'validate', isValid: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  showValidation: false
})
const emit = defineEmits<Emits>()
const alertModal = useAlertModalStore()

// Estado interno - SIMPLIFICADO: ya no necesita los campos de creación de padre
const internalFormData = reactive<any>({
  usuarios: props.formData.usuarios || []
})

const selectedParents = ref<ParentUser[]>([])

// Validaciones
const isValid = computed(() => selectedParents.value.length > 0)

const isParentSelected = (parentId: number) =>
  selectedParents.value.some(p => p.id === parentId)

// Manejar eventos del componente BusquedaPadre
const handleParentSelected = (parent: ParentUser) => {
  if (!isParentSelected(parent.id)) {
    selectedParents.value.push(parent)
    updateFormData()
    
    alertModal.success(
      'Padre agregado', 
      `${parent.first_name} ${parent.last_name} ha sido asignado al niño`
    )
  }
}

// Manejar eventos del componente CrearNuevoPadre
const handleParentCreated = (parent: ParentUser) => {
  if (!isParentSelected(parent.id)) {
    selectedParents.value.push(parent)
    updateFormData()
    
    alertModal.success(
      'Padre creado y agregado', 
      `${parent.first_name} ${parent.last_name} ha sido creado y asignado al niño`
    )
  }
}

const handleSearchComplete = (results: ParentUser[]) => {
  console.log('🔍 Búsqueda completada:', results.length, 'resultados')
}

const handleSearchError = (error: string) => {
  console.error('❌ Error en búsqueda:', error)
  // No mostramos alerta aquí porque ya se maneja en el componente hijo
}

// Remover padre con confirmación modal
const removeParent = (parentId: number) => {
  const parent = selectedParents.value.find(p => p.id === parentId)
  if (parent) {
    alertModal.confirm(
      '¿Remover padre?',
      `¿Está seguro de que desea remover a ${parent.first_name} ${parent.last_name} de la lista?`,
      () => {
        selectedParents.value = selectedParents.value.filter(p => p.id !== parentId)
        updateFormData()
        
        alertModal.info(
          'Padre removido', 
          `${parent.first_name} ${parent.last_name} ha sido removido de la lista`
        )
      }
    )
  }
}

// Sincronización con multipasos
const updateFormData = () => {
  const formattedData: Partial<NneFormData> = {
    usuarios: selectedParents.value.map(p => p.id)
  }
  emit('update:formData', formattedData)
}

// Manejar cambios del formulario
const handleFormInput = () => {
  updateFormData()
}

// Cargar padres existentes si vienen en props
const loadExistingParents = async () => {
  if (props.formData.usuarios && props.formData.usuarios.length > 0) {
    // Aquí podrías llamar a la API para obtener datos completos de cada padre
    // Por ahora simulamos con datos básicos
    selectedParents.value = props.formData.usuarios.map(id => ({
      id,
      username: `user_${id}`,
      email: `padre${id}@email.com`,
      first_name: `Padre ${id}`,
      last_name: `Apellido ${id}`,
      rut: `${10000000 + id}-X`,
      phone: `+5691234567${id}`,
      role: 'Padres'
    }))
    
    alertModal.info(
      'Padres cargados', 
      `Se cargaron ${selectedParents.value.length} padre(s) existente(s)`
    )
  }
}

// Watchers
watch(isValid, newIsValid => emit('validate', newIsValid), { immediate: true })

watch(() => props.formData, newData => {
  if (newData.usuarios) {
    internalFormData.usuarios = newData.usuarios
  }
}, { deep: true })

onMounted(() => {
  loadExistingParents()
})
</script>

<!-- Los estilos se mantienen igual, pero eliminamos los específicos de create-parent-form -->
<style scoped>
.step3-parents-manager {
  max-height: 600px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.step-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.step-header h3 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-size: 1.5rem;
}

.step-header p {
  margin: 0;
  color: #6b7280;
  font-size: 1rem;
}

.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.form-section h4 {
  margin: 0 0 1.5rem 0;
  color: #374151;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.no-parents {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.no-parents p {
  margin: 0.5rem 0;
}

.help-text {
  font-size: 0.875rem;
  font-style: italic;
}

.selected-parents {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.selected-parent-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.selected-parent-card .parent-info h6 {
  margin: 0 0 0.75rem 0;
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 600;
}

.parent-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.detail-item {
  color: #6b7280;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.validation-status {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 6px;
  font-weight: 500;
}

.status-valid {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.status-invalid {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

/* Botones */
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 768px) {
  .selected-parent-card {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .parent-details {
    flex-direction: column;
    gap: 0.5rem;
  }
}

/* Scrollbar */
.step3-parents-manager::-webkit-scrollbar {
  width: 6px;
}

.step3-parents-manager::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.step3-parents-manager::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.step3-parents-manager::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>