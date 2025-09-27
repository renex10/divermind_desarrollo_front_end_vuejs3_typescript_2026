<!-- src/components/forms/multi-step/components/ParentSearch.vue -->
<template>
  <div class="parent-search">
    <label class="search-label">
      🔍 Buscar padre existente (por RUT, nombre o email)
    </label>
    
    <div class="search-container">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Ej: 16347892-7, Marcos, marcos@email.com"
        class="search-input"
        @input="handleSearchInput"
      />
      
      <button 
        class="search-btn"
        @click="performSearch"
        :disabled="!searchQuery.trim()"
      >
        Buscar
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isSearching" class="search-loading">
      🔍 Buscando...
    </div>

    <!-- Resultados -->
    <div v-if="searchResults.length > 0" class="search-results">
      <h4>Resultados encontrados ({{ searchResults.length }})</h4>
      
      <div 
        v-for="parent in searchResults" 
        :key="parent.id"
        class="parent-result"
        @click="selectParent(parent)"
      >
        <div class="parent-info">
          <strong>{{ parent.full_name }}</strong>
          <div class="parent-details">
            RUT: {{ parent.rut }} | Email: {{ parent.email }}
          </div>
        </div>
        <button class="select-btn">Seleccionar</button>
      </div>
    </div>

    <!-- Sin resultados -->
    <div v-if="searchPerformed && searchResults.length === 0 && !isSearching" class="no-results">
      ❌ No se encontraron padres con ese criterio de búsqueda
    </div>

    <!-- Error -->
    <div v-if="searchError" class="search-error">
      ⚠️ Error en la búsqueda: {{ searchError }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, debounce } from 'vue'
import type { ParentUser } from '@/types/nne'

interface Props {
  searchFunction: (query: string) => Promise<ParentUser[]>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'parentSelected', parent: ParentUser): void
}>()

const searchQuery = ref('')
const searchResults = ref<ParentUser[]>([])
const isSearching = ref(false)
const searchPerformed = ref(false)
const searchError = ref('')

// Búsqueda con debounce para no hacer muchas llamadas
const performSearch = async () => {
  if (!searchQuery.value.trim()) return

  isSearching.value = true
  searchError.value = ''
  
  try {
    const results = await props.searchFunction(searchQuery.value)
    searchResults.value = results
    searchPerformed.value = true
  } catch (error) {
    searchError.value = error.message
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

// Debounce para búsqueda automática al escribir
const handleSearchInput = debounce(performSearch, 500)

const selectParent = (parent: ParentUser) => {
  emit('parentSelected', parent)
  // Limpiar búsqueda después de seleccionar
  searchQuery.value = ''
  searchResults.value = []
  searchPerformed.value = false
}
</script>

<style scoped>
.search-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-btn {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.search-results {
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
}

.parent-result {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
}

.parent-result:hover {
  background: #f9fafb;
}

.parent-details {
  font-size: 0.875rem;
  color: #6b7280;
}

.select-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.no-results, .search-error, .search-loading {
  padding: 0.75rem;
  border-radius: 4px;
  margin-top: 0.5rem;
}

.no-results { background: #fef3cd; color: #92400e; }
.search-error { background: #fee2e2; color: #dc2626; }
.search-loading { background: #dbeafe; color: #1e40af; }
</style>