<!-- src/components/forms/multi-step/components/BusquedaPadre.vue -->
<template>
  <div class="form-section">
    <h4>🔍 Buscar Padres Existentes</h4>
    
    <!-- Búsqueda por RUT -->
    <div class="search-container">
      <FormKit
        type="text"
        name="parent_search_rut"
        label="Buscar por RUT"
        placeholder="Ej: 12.345.678-9"
        v-model="searchRut"
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
        :disabled="!searchRut || isSearching"
        @click="searchByRut"
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
        v-model="searchEmail"
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
        :disabled="!searchEmail || isSearching"
        @click="searchByEmail"
      >
        <span v-if="isSearching">Buscando...</span>
        <span v-else>🔍 Buscar</span>
      </button>
    </div>

    <!-- Búsqueda por Nombre -->
    <div class="search-container">
      <FormKit
        type="text"
        name="parent_search_name"
        label="Buscar por Nombre"
        placeholder="Ej: María González"
        v-model="searchName"
        validation="length:2,50"
        validation-visibility="live"
        :validation-messages="{
          length: 'Debe tener entre 2 y 50 caracteres'
        }"
        help="Ingrese nombre o apellido para buscar"
      />
      
      <button
        type="button"
        class="btn btn-primary"
        :disabled="!searchName || isSearching"
        @click="searchByName"
      >
        <span v-if="isSearching">Buscando...</span>
        <span v-else>🔍 Buscar</span>
      </button>
    </div>

    <!-- Búsqueda por Username -->
    <div class="search-container">
      <FormKit
        type="text"
        name="parent_search_username"
        label="Buscar por Username"
        placeholder="Ej: mario.gonzalez"
        v-model="searchUsername"
        validation="length:3,30"
        validation-visibility="live"
        :validation-messages="{
          length: 'Debe tener entre 3 y 30 caracteres'
        }"
        help="Ingrese username para buscar"
      />
      
      <button
        type="button"
        class="btn btn-primary"
        :disabled="!searchUsername || isSearching"
        @click="searchByUsername"
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
            <p v-if="parent.username">Username: {{ parent.username }}</p>
            <p v-if="parent.phone">Teléfono: {{ parent.phone }}</p>
          </div>
          <button
            type="button"
            class="btn btn-success btn-sm"
            :disabled="isParentSelected(parent.id)"
            @click="selectParent(parent)"
          >
            {{ isParentSelected(parent.id) ? '✓ Seleccionado' : '+ Agregar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Mensaje de estado de búsqueda (solo para info visual) -->
    <div v-if="localSearchMessage" class="search-message" :class="localSearchMessageType">
      {{ localSearchMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { searchParentsApi } from '@/services/nneService'
import type { ParentUser } from '@/type/nne'
import { useAlertModalStore } from '@/store/alertModalStore'

interface Props {
  selectedParents: ParentUser[]
}

interface Emits {
  (e: 'parent-selected', parent: ParentUser): void
  (e: 'search-complete', results: ParentUser[]): void
  (e: 'search-error', error: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const alertModal = useAlertModalStore()

// Estado de búsqueda
const searchRut = ref('')
const searchEmail = ref('')
const searchName = ref('')
const searchUsername = ref('')
const searchResults = ref<ParentUser[]>([])
const isSearching = ref(false)

// Mensaje local solo para feedback visual en el componente
const localSearchMessage = ref('')
const localSearchMessageType = ref<'success' | 'error' | 'info'>('info')

// Computed para verificar si un padre está seleccionado
const isParentSelected = (parentId: number) => {
  return props.selectedParents.some(p => p.id === parentId)
}

// Método de búsqueda mejorado con manejo robusto de errores
const searchParent = async (query: string, searchType: string) => {
  if (!query.trim()) {
    alertModal.info('Búsqueda vacía', 'Por favor ingrese un término de búsqueda')
    localSearchMessage.value = 'Por favor ingrese un término de búsqueda'
    localSearchMessageType.value = 'info'
    return
  }

  isSearching.value = true
  localSearchMessage.value = ''
  searchResults.value = []
  
  try {
    console.log(`🔍 Buscando padres por ${searchType}:`, query)
    const results = await searchParentsApi(query)
    
    console.log(`📊 Resultados recibidos:`, results)
    
    if (!results || !Array.isArray(results)) {
      throw new Error('La API devolvió una respuesta inválida')
    }
    
    searchResults.value = results
    emit('search-complete', results)
    
    if (results.length > 0) {
      const message = `Se encontraron ${results.length} padre(s) con ${searchType}: "${query}"`
      alertModal.success('Búsqueda exitosa', message)
      localSearchMessage.value = `Encontrados: ${results.length} padre(s)`
      localSearchMessageType.value = 'success'
    } else {
      const message = `No se encontraron padres con ${searchType}: "${query}"`
      alertModal.info('Sin resultados', message)
      localSearchMessage.value = 'No se encontraron resultados'
      localSearchMessageType.value = 'info'
    }
  } catch (error) {
    console.error('❌ Error en búsqueda de padres:', error)
    
    // Determinar el mensaje de error específico
    let errorMessage = 'Error al buscar. Intente nuevamente.'
    let alertTitle = 'Error en búsqueda'
    
    if (error instanceof Error) {
      if (error.message.includes('conexión') || error.message.includes('internet')) {
        errorMessage = 'Error de conexión. Verifique su internet.'
        alertTitle = 'Error de conexión'
      } else if (error.message.includes('inválida')) {
        errorMessage = 'El servidor devolvió una respuesta inesperada.'
        alertTitle = 'Error del servidor'
      } else if (error.message.includes('Parámetros')) {
        errorMessage = 'Término de búsqueda inválido.'
        alertTitle = 'Búsqueda inválida'
      } else {
        errorMessage = error.message
      }
    }
    
    alertModal.error(alertTitle, errorMessage)
    localSearchMessage.value = errorMessage
    localSearchMessageType.value = 'error'
    searchResults.value = []
    emit('search-error', error instanceof Error ? error.message : 'Error desconocido')
  } finally {
    isSearching.value = false
  }
}

// Métodos específicos de búsqueda
const searchByRut = () => searchParent(searchRut.value, 'RUT')
const searchByEmail = () => searchParent(searchEmail.value, 'email')
const searchByName = () => searchParent(searchName.value, 'nombre')
const searchByUsername = () => searchParent(searchUsername.value, 'username')

// Seleccionar padre
const selectParent = (parent: ParentUser) => {
  if (!isParentSelected(parent.id)) {
    emit('parent-selected', parent)
    
    // Mostrar alerta modal de éxito
    alertModal.success(
      'Padre agregado', 
      `${parent.first_name} ${parent.last_name} ha sido agregado exitosamente`
    )
    
    // Limpiar resultados después de seleccionar
    searchResults.value = []
    localSearchMessage.value = 'Padre agregado exitosamente'
    localSearchMessageType.value = 'success'
    
    // Limpiar campos de búsqueda después de un delay
    setTimeout(() => {
      searchRut.value = ''
      searchEmail.value = ''
      searchName.value = ''
      searchUsername.value = ''
      localSearchMessage.value = ''
    }, 2000)
  } else {
    alertModal.info(
      'Padre ya seleccionado', 
      'Este padre ya se encuentra en la lista de seleccionados'
    )
  }
}

// Limpiar búsqueda
const clearSearch = () => {
  searchRut.value = ''
  searchEmail.value = ''
  searchName.value = ''
  searchUsername.value = ''
  searchResults.value = []
  localSearchMessage.value = ''
}

// Exponer métodos para uso externo si es necesario
defineExpose({
  clearSearch,
  searchByRut,
  searchByEmail,
  searchByName
})
</script>

<style scoped>
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
  transition: all 0.2s ease;
}

.parent-card:hover {
  background: #f3f4f6;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
  text-align: center;
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
  min-height: 44px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  min-height: 36px;
}

/* Responsive */
@media (max-width: 768px) {
  .search-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .parent-card {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    text-align: center;
  }
}
</style>