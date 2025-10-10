<!-- src/components/ninos/SubComponentes/BusquedaFiltros.vue -->
<template>
  <div class="filters-section">
    <div class="search-wrapper">
      <div class="search-input-group">
        <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input
          :value="searchQuery"
          type="text"
          placeholder="Buscar por nombre, apellido o estado..."
          class="search-input"
          @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        />
        <button 
          v-if="searchQuery" 
          @click="$emit('update:searchQuery', '')"
          class="clear-button"
          aria-label="Limpiar búsqueda"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <div class="filters-actions">
      <select :value="filterStatus" @change="$emit('update:filterStatus', ($event.target as HTMLSelectElement).value)" class="filter-select">
        <option value="">Todos los estados</option>
        <option value="active">Activo</option>
        <option value="suspended">Suspendido</option>
      </select>

      <select :value="filterGrade" @change="$emit('update:filterGrade', ($event.target as HTMLSelectElement).value)" class="filter-select">
        <option value="">Todos los grados</option>
        <option value="1° Básico">1° Básico</option>
        <option value="2° Básico">2° Básico</option>
        <option value="3° Básico">3° Básico</option>
        <option value="4° Básico">4° Básico</option>
        <option value="5° Básico">5° Básico</option>
        <option value="6° Básico">6° Básico</option>
        <option value="7° Básico">7° Básico</option>
        <option value="8° Básico">8° Básico</option>
      </select>

      <button 
        v-if="hasActiveFilters" 
        @click="$emit('clear-filters')"
        class="clear-filters-btn"
      >
        Limpiar filtros
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  searchQuery: string
  filterStatus: string
  filterGrade: string
  hasActiveFilters?: boolean
}>()

defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterStatus': [value: string]
  'update:filterGrade': [value: string]
  'clear-filters': []
}>()
</script>

<style scoped>
.filters-section {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.search-wrapper {
  flex: 1;
  min-width: 250px;
}

.search-input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  width: 20px;
  height: 20px;
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.625rem 2.5rem 0.625rem 2.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.clear-button {
  position: absolute;
  right: 8px;
  padding: 4px;
  color: #9ca3af;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.clear-button:hover {
  color: #ef4444;
  background: #fee;
}

.filters-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.625rem 2.5rem 0.625rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.25rem;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.clear-filters-btn {
  padding: 0.625rem 1rem;
  background: #fee;
  color: #dc2626;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-filters-btn:hover {
  background: #fecaca;
}
</style>