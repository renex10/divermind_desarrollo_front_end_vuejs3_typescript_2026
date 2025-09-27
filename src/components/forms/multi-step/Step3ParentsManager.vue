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
      <div class="form-section">
        <h4>🔍 Buscar Padres Existentes</h4>
        
        <!-- Búsqueda por RUT -->
        <div class="search-container">
          <FormKit
            type="text"
            name="parent_search_rut"
            label="Buscar por RUT"
            placeholder="Ej: 12.345.678-9"
            validation="matches:/^(\d{1,2}\.\d{3}\.\d{3}-[\dkK])?$/"
            validation-visibility="live"
            :validation-messages="{
              matches: 'Formato de RUT inválido (ej: 12.345.678-9)'
            }"
            help="Ingrese el RUT para buscar un padre existente"
          />
          
          <button
            type="button"
            class="btn btn-primary"
            :disabled="!internalFormData.parent_search_rut || isSearching"
            @click="searchParentByRut"
          >
            <span v-if="isSearching">Buscando...</span>
            <span v-else>🔍 Buscar</span>
          </button>
        </div>

        <!-- Búsqueda por Email -->
        <div class="search-container">
          <FormKit
            type="email"
            name="parent_search_email"
            label="Buscar por Email"
            placeholder="Ej: padre@email.com"
            validation="email"
            validation-visibility="live"
            :validation-messages="{
              email: 'Formato de email inválido'
            }"
            help="Ingrese el email para buscar un padre existente"
          />
          
          <button
            type="button"
            class="btn btn-primary"
            :disabled="!internalFormData.parent_search_email || isSearching"
            @click="searchParentByEmail"
          >
            <span v-if="isSearching">Buscando...</span>
            <span v-else>🔍 Buscar</span>
          </button>
        </div>

        <!-- Resultados de búsqueda -->
        <div v-if="searchResults.length > 0" class="search-results">
          <h5>Resultados de Búsqueda:</h5>
          <div class="parent-cards">
            <div 
              v-for="parent in searchResults" 
              :key="parent.id"
              class="parent-card"
            >
              <div class="parent-info">
                <h6>{{ parent.first_name }} {{ parent.last_name }}</h6>
                <p>RUT: {{ parent.rut }}</p>
                <p>Email: {{ parent.email }}</p>
                <p v-if="parent.phone">Teléfono: {{ parent.phone }}</p>
              </div>
              <button
                type="button"
                class="btn btn-success btn-sm"
                :disabled="isParentSelected(parent.id)"
                @click="addParent(parent)"
              >
                {{ isParentSelected(parent.id) ? '✓ Seleccionado' : '+ Agregar' }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="searchMessage" class="search-message" :class="searchMessageType">
          {{ searchMessage }}
        </div>
      </div>

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
import type { NneFormData, ParentUser } from '../../../../type/nne'

interface Props {
  formData: Partial<NneFormData>
  showValidation?: boolean
}

interface Emits {
  (e: 'update:formData', data: Partial<NneFormData>): void
  (e: 'validate', isValid: boolean): void
}

// Props y Emits
const props = withDefaults(defineProps<Props>(), {
  showValidation: false
})

const emit = defineEmits<Emits>()

// Estado reactivo del formulario interno
const internalFormData = reactive<any>({
  parent_search_rut: '',
  parent_search_email: '',
  new_parent_first_name: '',
  new_parent_last_name: '',
  new_parent_rut: '',
  new_parent_email: '',
  new_parent_phone: '',
  usuarios: props.formData.usuarios || []
})

// Estados locales
const showCreateForm = ref(false)
const selectedParents = ref<ParentUser[]>([])
const searchResults = ref<ParentUser[]>([])
const searchMessage = ref('')
const searchMessageType = ref<'success' | 'error' | 'info'>('info')
const isSearching = ref(false)
const isCreating = ref(false)

// Validación del formulario
const isValid = computed(() => selectedParents.value.length > 0)

// Validación para crear nuevo padre
const canCreateParent = computed(() => {
  return internalFormData.new_parent_first_name &&
         internalFormData.new_parent_last_name &&
         internalFormData.new_parent_rut &&
         internalFormData.new_parent_email
})

// Métodos
const toggleCreateForm = () => {
  showCreateForm.value = !showCreateForm.value
  if (!showCreateForm.value) {
    clearCreateForm()
  }
}

const clearCreateForm = () => {
  internalFormData.new_parent_first_name = ''
  internalFormData.new_parent_last_name = ''
  internalFormData.new_parent_rut = ''
  internalFormData.new_parent_email = ''
  internalFormData.new_parent_phone = ''
}

const clearSearchForm = () => {
  internalFormData.parent_search_rut = ''
  internalFormData.parent_search_email = ''
  searchResults.value = []
  searchMessage.value = ''
}

const isParentSelected = (parentId: number): boolean => {
  return selectedParents.value.some(p => p.id === parentId)
}

// Simulación de búsqueda por RUT
const searchParentByRut = async () => {
  if (!internalFormData.parent_search_rut) return
  
  isSearching.value = true
  searchMessage.value = ''
  
  try {
    // Aquí iría la llamada real a la API
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay
    
    // Simulación de resultados
    const mockResults: ParentUser[] = [
      {
        id: Math.floor(Math.random() * 1000),
        username: `user_${Date.now()}`,
        email: 'padre.simulado@email.com',
        first_name: 'Juan Carlos',
        last_name: 'González Pérez',
        rut: internalFormData.parent_search_rut,
        phone: '+56912345678'
      }
    ]
    
    if (mockResults.length > 0) {
      searchResults.value = mockResults
      searchMessage.value = `Se encontraron ${mockResults.length} resultado(s)`
      searchMessageType.value = 'success'
    } else {
      searchResults.value = []
      searchMessage.value = 'No se encontraron padres con ese RUT'
      searchMessageType.value = 'info'
    }
    
  } catch (error) {
    searchResults.value = []
    searchMessage.value = 'Error al buscar. Intente nuevamente.'
    searchMessageType.value = 'error'
  } finally {
    isSearching.value = false
  }
}

// Simulación de búsqueda por Email
const searchParentByEmail = async () => {
  if (!internalFormData.parent_search_email) return
  
  isSearching.value = true
  searchMessage.value = ''
  
  try {
    // Aquí iría la llamada real a la API
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay
    
    // Simulación de resultados
    const mockResults: ParentUser[] = [
      {
        id: Math.floor(Math.random() * 1000),
        username: `user_${Date.now()}`,
        email: internalFormData.parent_search_email,
        first_name: 'María José',
        last_name: 'Rodríguez Silva',
        rut: '11.222.333-4',
        phone: '+56987654321'
      }
    ]
    
    if (mockResults.length > 0) {
      searchResults.value = mockResults
      searchMessage.value = `Se encontraron ${mockResults.length} resultado(s)`
      searchMessageType.value = 'success'
    } else {
      searchResults.value = []
      searchMessage.value = 'No se encontraron padres con ese email'
      searchMessageType.value = 'info'
    }
    
  } catch (error) {
    searchResults.value = []
    searchMessage.value = 'Error al buscar. Intente nuevamente.'
    searchMessageType.value = 'error'
  } finally {
    isSearching.value = false
  }
}

// Crear nuevo padre
const createNewParent = async () => {
  if (!canCreateParent.value) return
  
  isCreating.value = true
  
  try {
    // Aquí iría la llamada real a la API para crear el padre
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simular delay
    
    const newParent: ParentUser = {
      id: Math.floor(Math.random() * 10000), // En realidad vendría del backend
      username: internalFormData.new_parent_email,
      email: internalFormData.new_parent_email,
      first_name: internalFormData.new_parent_first_name,
      last_name: internalFormData.new_parent_last_name,
      rut: internalFormData.new_parent_rut,
      phone: internalFormData.new_parent_phone || undefined
    }
    
    addParent(newParent)
    clearCreateForm()
    showCreateForm.value = false
    
    searchMessage.value = 'Padre creado y agregado exitosamente'
    searchMessageType.value = 'success'
    
  } catch (error) {
    searchMessage.value = 'Error al crear el padre. Intente nuevamente.'
    searchMessageType.value = 'error'
  } finally {
    isCreating.value = false
  }
}

const addParent = (parent: ParentUser) => {
  if (!isParentSelected(parent.id)) {
    selectedParents.value.push(parent)
    updateFormData()
    clearSearchForm()
  }
}

const removeParent = (parentId: number) => {
  selectedParents.value = selectedParents.value.filter(p => p.id !== parentId)
  updateFormData()
}

const handleFormInput = () => {
  // FormKit maneja automáticamente los cambios
  updateFormData()
}

const updateFormData = () => {
  const formattedData: Partial<NneFormData> = {
    usuarios: selectedParents.value.map(p => p.id)
  }
  
  emit('update:formData', formattedData)
}

// Cargar padres existentes desde props
const loadExistingParents = async () => {
  if (props.formData.usuarios && props.formData.usuarios.length > 0) {
    // Aquí harías llamadas reales a la API para obtener los datos completos
    // Por ahora simulamos datos
    const mockParents: ParentUser[] = props.formData.usuarios.map(id => ({
      id,
      username: `user_${id}`,
      email: `padre${id}@email.com`,
      first_name: `Padre ${id}`,
      last_name: `Apellido ${id}`,
      rut: `${10000000 + id}-${Math.floor(Math.random() * 9)}`,
      phone: `+5691234567${id}`
    }))
    
    selectedParents.value = mockParents
  }
}

// Watch para cambios en la validación
watch(isValid, (newIsValid) => {
  emit('validate', newIsValid)
}, { immediate: true })

// Watch para cambios en los datos del padre
watch(() => props.formData, (newData) => {
  if (newData.usuarios) {
    internalFormData.usuarios = newData.usuarios
  }
}, { deep: true })

onMounted(() => {
  loadExistingParents()
})
</script>

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

.search-container {
  display: flex;
  gap: 1rem;
  align-items: end;
  margin-bottom: 1rem;
}

.search-container .formkit-outer {
  flex: 1;
}

.search-results {
  margin-top: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #d1d5db;
}

.search-results h5 {
  margin: 0 0 1rem 0;
  color: #374151;
  font-size: 1rem;
}

.parent-cards {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.parent-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.parent-info h6 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-size: 1rem;
  font-weight: 600;
}

.parent-info p {
  margin: 0.25rem 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.search-message {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
}

.search-message.success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.search-message.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.search-message.info {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #bfdbfe;
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

/* FormKit styles */
:deep(.formkit-outer) {
  margin-bottom: 0;
}

:deep(.formkit-label) {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  display: block;
}

:deep(.formkit-help) {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

:deep(.formkit-messages) {
  list-style: none;
  padding: 0;
  margin: 0.25rem 0 0 0;
}

:deep(.formkit-message) {
  font-size: 0.75rem;
  color: #dc2626;
}

:deep(.formkit-input) {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s;
}

:deep(.formkit-input:focus) {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

:deep(.formkit-input[data-invalid="true"]) {
  border-color: #dc2626;
}

:deep(.formkit-wrapper) {
  margin-bottom: 1rem;
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
  
  .search-container {
    flex-direction: column;
    align-items: stretch;
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

<style>
.formkit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.formkit-actions {
  display: none;
}
</style>