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
      <div class="form-section">
        <h4>➕ Crear Nuevo Padre/Tutor</h4>
        
        <button
          type="button"
          class="btn btn-outline"
          @click="toggleCreateForm"
        >
          {{ showCreateForm ? '❌ Cancelar Creación' : '👤 Crear Nuevo Padre' }}
        </button>

        <!-- Formulario de creación de padre (expandible) -->
        <div v-if="showCreateForm" class="create-parent-form">
          <div class="form-grid">
            <!-- Información Personal -->
            <FormKit
              type="text"
              name="new_parent_first_name"
              label="Nombres *"
              placeholder="Ej: María José"
              validation="required|length:2,50"
              validation-visibility="live"
              :validation-messages="{
                required: 'Los nombres son requeridos',
                length: 'Debe tener entre 2 y 50 caracteres'
              }"
              help="Nombres del padre/tutor"
            />

            <FormKit
              type="text"
              name="new_parent_last_name"
              label="Apellidos *"
              placeholder="Ej: González Pérez"
              validation="required|length:2,50"
              validation-visibility="live"
              :validation-messages="{
                required: 'Los apellidos son requeridos',
                length: 'Debe tener entre 2 y 50 caracteres'
              }"
              help="Apellidos del padre/tutor"
            />

            <FormKit
              type="text"
              name="new_parent_rut"
              label="RUT *"
              placeholder="12.345.678-9"
              validation="required|matches:/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/"
              validation-visibility="live"
              :validation-messages="{
                required: 'El RUT es requerido',
                matches: 'Formato de RUT inválido (ej: 12.345.678-9)'
              }"
              help="RUT del padre/tutor"
            />

            <FormKit
              type="email"
              name="new_parent_email"
              label="Email *"
              placeholder="padre@email.com"
              validation="required|email"
              validation-visibility="live"
              :validation-messages="{
                required: 'El email es requerido',
                email: 'Formato de email inválido'
              }"
              help="Email del padre/tutor"
            />

            <FormKit
              type="tel"
              name="new_parent_phone"
              label="Teléfono"
              placeholder="+56912345678"
              validation="matches:/^(\+?\d{7,15})?$/"
              validation-visibility="live"
              :validation-messages="{
                matches: 'Formato de teléfono inválido'
              }"
              help="Teléfono de contacto (opcional)"
            />
          </div>

          <div class="create-actions">
            <button
              type="button"
              class="btn btn-success"
              :disabled="!canCreateParent || isCreating"
              @click="createNewParent"
            >
              <span v-if="isCreating">Creando...</span>
              <span v-else>✅ Crear y Agregar Padre</span>
            </button>
          </div>
        </div>
      </div>

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
import { createParentApi } from '@/services/nneService'
import { NneFormData, ParentUser } from '@/type/nne'
import BusquedaPadre from './components/BusquedaPadre.vue'
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

// Estado interno
const internalFormData = reactive<any>({
  new_parent_first_name: '',
  new_parent_last_name: '',
  new_parent_rut: '',
  new_parent_email: '',
  new_parent_phone: '',
  usuarios: props.formData.usuarios || []
})

const showCreateForm = ref(false)
const selectedParents = ref<ParentUser[]>([])
const isCreating = ref(false)

// Validaciones
const isValid = computed(() => selectedParents.value.length > 0)
const canCreateParent = computed(() =>
  internalFormData.new_parent_first_name &&
  internalFormData.new_parent_last_name &&
  internalFormData.new_parent_rut &&
  internalFormData.new_parent_email
)

// Métodos auxiliares
const toggleCreateForm = () => {
  showCreateForm.value = !showCreateForm.value
  if (!showCreateForm.value) clearCreateForm()
}

const clearCreateForm = () => {
  internalFormData.new_parent_first_name = ''
  internalFormData.new_parent_last_name = ''
  internalFormData.new_parent_rut = ''
  internalFormData.new_parent_email = ''
  internalFormData.new_parent_phone = ''
}

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

const handleSearchComplete = (results: ParentUser[]) => {
  console.log('🔍 Búsqueda completada:', results.length, 'resultados')
}

const handleSearchError = (error: string) => {
  console.error('❌ Error en búsqueda:', error)
  // No mostramos alerta aquí porque ya se maneja en el componente hijo
}

// Crear padre nuevo con manejo de alertas modales
const createNewParent = async () => {
  if (!canCreateParent.value) return
  
  isCreating.value = true
  try {
    const newParent = await createParentApi({
      first_name: internalFormData.new_parent_first_name,
      last_name: internalFormData.new_parent_last_name,
      rut: internalFormData.new_parent_rut,
      email: internalFormData.new_parent_email,
      phone: internalFormData.new_parent_phone,
      username: internalFormData.new_parent_email,
      role: 'Padres'
    })
    
    // Agregar el nuevo padre a la lista
    handleParentSelected(newParent)
    clearCreateForm()
    showCreateForm.value = false
    
    alertModal.success(
      'Padre creado', 
      'El padre ha sido creado y agregado exitosamente al niño'
    )
  } catch (error) {
    console.error('❌ Error al crear padre:', error)
    
    let errorMessage = 'Error al crear el padre. Intente nuevamente.'
    if (error instanceof Error) {
      if (error.message.includes('RUT ya existe')) {
        errorMessage = 'El RUT ingresado ya está registrado en el sistema'
      } else if (error.message.includes('Email ya existe')) {
        errorMessage = 'El email ingresado ya está registrado en el sistema'
      }
    }
    
    alertModal.error('Error al crear padre', errorMessage)
  } finally {
    isCreating.value = false
  }
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

<!-- Los estilos se mantienen igual -->
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

.create-parent-form {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  border-left: 4px solid #10b981;
  animation: slideDown 0.3s ease-out;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.create-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
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

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #059669;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.btn-outline {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-outline:hover:not(:disabled) {
  background: #f9fafb;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

/* Animaciones */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .parent-card,
  .selected-parent-card {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .parent-details {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .create-actions {
    justify-content: stretch;
  }
  
  .create-actions .btn {
    flex: 1;
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