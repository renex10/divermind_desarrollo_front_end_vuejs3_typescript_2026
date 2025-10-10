<!-- src/components/forms/multi-step/pasos/Paso8Parents.vue -->
<template>
  <div class="paso-container">
    <h3 class="paso-title">Paso 8: Asignación de Padres/Tutores</h3>
    
    <!-- Grid de Campos -->
    <div class="form-grid">
      <!-- Información sobre Responsables -->
      <div class="form-group col-span-full">
        <div class="info-box">
          <h4>📋 Información Importante</h4>
          <ul>
            <li>Puede buscar y seleccionar padres existentes en el sistema</li>
            <li>O crear nuevos padres si no existen</li>
            <li>Debe asignar al menos un padre/tutor responsable</li>
            <li>Puede asignar múltiples padres/tutores al estudiante</li>
          </ul>
        </div>
      </div>

      <!-- Búsqueda de Padres Existentes -->
      <div class="form-group col-span-full">
        <BusquedaPadre
          :selectedParents="selectedParents"
          @parent-selected="handleParentSelected"
          @search-complete="handleSearchComplete"
          @search-error="handleSearchError"
        />
      </div>

      <!-- Lista de Padres Existentes -->
      <div class="form-group col-span-full">
        <ListaPadresExistentes
          :selectedParents="selectedParents"
          @parent-selected="handleParentSelected"
          @parent-removed="handleParentRemoved"
        />
      </div>

      <!-- Crear Nuevo Padre -->
      <div class="form-group col-span-full">
        <CrearNuevoPadre
          @parent-created="handleParentCreated"
        />
      </div>

      <!-- Lista de Padres Seleccionados -->
      <div v-if="selectedParents.length > 0" class="form-group col-span-full">
        <div class="selected-parents-section">
          <h4>✅ Padres/Tutores Seleccionados ({{ selectedParents.length }})</h4>
          
          <div class="selected-parents-list">
            <div 
              v-for="parent in selectedParents" 
              :key="parent.id"
              class="selected-parent-card"
            >
              <div class="parent-avatar">
                {{ getInitials(parent.first_name, parent.last_name) }}
              </div>
              
              <div class="parent-details">
                <h5>{{ parent.first_name }} {{ parent.last_name }}</h5>
                <p><strong>RUT:</strong> {{ parent.rut }}</p>
                <p><strong>Email:</strong> {{ parent.email }}</p>
                <p v-if="parent.phone"><strong>Teléfono:</strong> {{ parent.phone }}</p>
                <p v-if="parent.username"><strong>Username:</strong> {{ parent.username }}</p>
              </div>
              
              <button
                type="button"
                class="btn btn-danger btn-sm"
                @click="removeParent(parent.id)"
              >
                ❌ Quitar
              </button>
            </div>
          </div>
          
          <!-- Información de asociación -->
          <div class="association-info">
            <p class="info-text">
              <strong>IDs que se asociarán al niño:</strong> 
              <code>{{ parentIds }}</code>
            </p>
          </div>
        </div>
      </div>

      <!-- Mensaje de validación -->
      <div v-if="selectedParents.length === 0" class="form-group col-span-full">
        <div class="warning-box">
          ⚠️ Debe seleccionar o crear al menos un padre/tutor responsable para continuar
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useAlertModalStore } from '@/store/alertModalStore'
import type { ParentUser } from '@/type/nne'
import BusquedaPadre from '../components/BusquedaPadre.vue'
import ListaPadresExistentes from '../components/ListaPadresExistentes.vue'
import CrearNuevoPadre from '../components/CrearNuevoPadre.vue'

interface Props {
  formData?: any
}

interface Emits {
  (e: 'update:formData', value: any): void
  (e: 'validate', isValid: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const alertModal = useAlertModalStore()

// Estado local
const selectedParents = ref<ParentUser[]>([])

// ✅ CRÍTICO: Computed que genera el array de IDs para el backend
const parentIds = computed(() => {
  return selectedParents.value.map((p) => p.id)
})

// ✅ CRÍTICO: Validación - al menos un padre debe estar seleccionado
const isValid = computed(() => {
  const valid = selectedParents.value.length > 0
  console.log(`🔍 Paso 8 - Validación: ${valid} (${selectedParents.value.length} padres seleccionados)`)
  return valid
})

// ✅ CRÍTICO: Watcher que actualiza formData y emite validación
watch(
  selectedParents,
  (newParents) => {
    console.log('🔄 Padres seleccionados cambiaron:', newParents.length)
    console.log('📤 IDs a enviar al backend:', parentIds.value)
    
    // Emitir datos actualizados al formulario padre
    emit('update:formData', { 
      usuarios: parentIds.value 
    })
    
    // Emitir estado de validación
    emit('validate', isValid.value)
  },
  { deep: true, immediate: true }
)

// ✅ CRÍTICO: Watcher de validación
watch(
  isValid,
  (newValue) => {
    console.log(`✅ Paso 8 - Estado de validación cambió a: ${newValue}`)
    emit('validate', newValue)
  },
  { immediate: true }
)

// Métodos de utilidad
const getInitials = (firstName: string, lastName: string): string => {
  const first = firstName?.charAt(0) || ''
  const last = lastName?.charAt(0) || ''
  return (first + last).toUpperCase()
}

// Seleccionar padre existente
const handleParentSelected = (parent: ParentUser) => {
  if (!selectedParents.value.some((p) => p.id === parent.id)) {
    selectedParents.value.push(parent)
    
    console.log('✅ Padre agregado:', parent)
    console.log('📋 Lista actual de IDs:', parentIds.value)
    
    alertModal.success(
      'Padre agregado',
      `${parent.first_name} ${parent.last_name} ha sido agregado correctamente`
    )
  } else {
    alertModal.info('Padre ya seleccionado', 'Este padre ya está en la lista de seleccionados')
  }
}

// Crear y agregar nuevo padre
const handleParentCreated = (parent: any) => {
  console.log('✅ Padre creado recibido:', parent)

  // Verificar que tenga los campos requeridos
  if (!parent.id || !parent.first_name || !parent.last_name || !parent.email || !parent.rut) {
    console.error('❌ Padre creado sin campos requeridos:', parent)
    alertModal.error(
      'Error al agregar padre',
      'El padre creado no tiene todos los campos requeridos'
    )
    return
  }

  // Normalizar el objeto padre
  const normalizedParent: ParentUser = {
    id: parent.id,
    first_name: parent.first_name,
    last_name: parent.last_name,
    email: parent.email,
    rut: parent.rut,
    username: parent.username || parent.email.split('@')[0],
    phone: parent.phone
  }

  if (!selectedParents.value.some((p) => p.id === normalizedParent.id)) {
    selectedParents.value.push(normalizedParent)
    
    console.log('✅ Nuevo padre agregado a la lista:', normalizedParent)
    console.log('📋 Lista actualizada de IDs:', parentIds.value)
    
    alertModal.success(
      'Padre creado y agregado',
      `${normalizedParent.first_name} ${normalizedParent.last_name} ha sido creado y agregado correctamente`
    )
  }
}

// Remover padre
const handleParentRemoved = (parentId: number) => {
  removeParent(parentId)
}

const removeParent = (parentId: number) => {
  const index = selectedParents.value.findIndex((p) => p.id === parentId)
  if (index !== -1) {
    const removedParent = selectedParents.value[index]
    selectedParents.value.splice(index, 1)
    
    console.log('🗑️ Padre removido:', removedParent)
    console.log('📋 Lista actualizada de IDs:', parentIds.value)
    
    alertModal.info(
      'Padre removido',
      `${removedParent.first_name} ${removedParent.last_name} ha sido removido de la lista`
    )
  }
}

// Callbacks de búsqueda
const handleSearchComplete = (results: ParentUser[]) => {
  console.log('🔍 Búsqueda completada:', results.length, 'resultados')
}

const handleSearchError = (error: string) => {
  console.error('❌ Error en búsqueda:', error)
}

// ✅ NUEVO: Método validate para llamada externa
const validate = (): boolean => {
  const valid = isValid.value
  console.log(`🔍 Paso 8 - validate() llamado: ${valid}`)
  emit('validate', valid)
  return valid
}

// ✅ NUEVO: Método para obtener los datos del paso
const getStepData = () => {
  return {
    usuarios: parentIds.value,
    selectedParents: selectedParents.value
  }
}

// Inicialización
onMounted(() => {
  console.log('🎬 Paso 8 montado')
  
  // Si ya hay datos en formData.usuarios, cargar padres
  if (props.formData?.usuarios && Array.isArray(props.formData.usuarios)) {
    console.log('📥 Cargando padres existentes desde formData:', props.formData.usuarios)
    // Aquí podrías cargar los padres desde el backend si es necesario
  }
  
  // Emitir validación inicial
  emit('validate', isValid.value)
})

// Exponer métodos y estado
defineExpose({
  selectedParents,
  parentIds,
  isValid,
  validate,
  getStepData
})
</script>

<style scoped>
.paso-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.paso-title {
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.col-span-full {
  grid-column: 1 / -1;
}

.info-box {
  background: #eff6ff;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  padding: 1.5rem;
}

.info-box h4 {
  margin: 0 0 1rem 0;
  color: #1e40af;
  font-size: 1.125rem;
}

.info-box ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #1e40af;
}

.info-box li {
  margin-bottom: 0.5rem;
}

.selected-parents-section {
  background: #f0fdf4;
  border: 2px solid #10b981;
  border-radius: 8px;
  padding: 1.5rem;
}

.selected-parents-section h4 {
  margin: 0 0 1.5rem 0;
  color: #065f46;
  font-size: 1.125rem;
}

.selected-parents-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.selected-parent-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid #d1fae5;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.selected-parent-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.parent-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #10b981;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
  flex-shrink: 0;
}

.parent-details {
  flex: 1;
  min-width: 0;
}

.parent-details h5 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-size: 1rem;
  font-weight: 600;
}

.parent-details p {
  margin: 0.25rem 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.association-info {
  margin-top: 1rem;
  padding: 1rem;
  background: #dcfce7;
  border: 1px solid #86efac;
  border-radius: 6px;
}

.info-text {
  margin: 0;
  color: #166534;
  font-size: 0.875rem;
}

.info-text code {
  background: #bbf7d0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
  color: #14532d;
}

.warning-box {
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 6px;
  padding: 1rem;
  color: #92400e;
  text-align: center;
  font-weight: 500;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
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
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .paso-container {
    padding: 1rem;
  }
  
  .selected-parents-list {
    grid-template-columns: 1fr;
  }
  
  .selected-parent-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>