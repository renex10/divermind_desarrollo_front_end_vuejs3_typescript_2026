<template>
  <div class="pictogram-selector">
    <!-- Búsqueda -->
    <div class="relative mb-6">
      <input 
        v-model="searchQuery"
        type="text"
        placeholder="Buscar pictograma... (ej: lavar, comer, dormir)"
        class="w-full px-4 py-3 pl-11 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
        @input="onSearchInput"
      />
      <MagnifyingGlassIcon class="w-5 h-5 absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
      
      <!-- Botón limpiar búsqueda -->
      <button
        v-if="searchQuery"
        @click="clearSearch"
        type="button"
        class="absolute right-3 top-3 p-1 rounded-full hover:bg-gray-100 transition"
      >
        <XMarkIcon class="w-5 h-5 text-gray-400 hover:text-gray-600" />
      </button>
    </div>

    <!-- Filtro por categorías -->
    <div class="mb-6">
      <h4 class="text-sm font-semibold text-gray-700 mb-3">Filtrar por categoría</h4>
      <div class="flex flex-wrap gap-2">
        <button
          @click="selectedCategory = null"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105',
            selectedCategory === null
              ? 'bg-gray-800 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
          type="button"
        >
          Todas
        </button>
        
        <button
          v-for="cat in PICTOGRAM_CATEGORIES"
          :key="cat.id"
          @click="toggleCategory(cat.id)"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 flex items-center gap-1.5',
            selectedCategory === cat.id
              ? getCategoryActiveClass(cat.color)
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
          type="button"
        >
          <component v-if="cat.icon" :is="cat.icon" class="w-4 h-4" />
          {{ cat.label }}
        </button>
      </div>
    </div>

    <!-- Contador de resultados -->
    <div class="mb-4 text-sm text-gray-600">
      <span class="font-semibold">{{ filteredIcons.length }}</span> 
      {{ filteredIcons.length === 1 ? 'pictograma encontrado' : 'pictogramas encontrados' }}
    </div>

    <!-- Grid de iconos -->
    <div 
      v-if="filteredIcons.length > 0"
      class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[500px] overflow-y-auto p-2 custom-scrollbar"
    >
      <button
        v-for="icon in filteredIcons"
        :key="icon.id"
        @click="selectIcon(icon)"
        :class="[
          'group flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1',
          selectedIcon?.id === icon.id
            ? 'border-primary-500 bg-primary-50 shadow-md ring-2 ring-primary-200'
            : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
        ]"
        type="button"
        :title="icon.description"
      >
        <component 
          :is="icon.component" 
          :class="[
            'w-10 h-10 transition-all duration-200',
            selectedIcon?.id === icon.id
              ? 'text-primary-600 scale-110'
              : 'text-gray-600 group-hover:text-primary-600 group-hover:scale-110'
          ]"
        />
        <span 
          :class="[
            'text-xs text-center line-clamp-2 transition-colors',
            selectedIcon?.id === icon.id
              ? 'text-primary-700 font-semibold'
              : 'text-gray-700 group-hover:text-primary-600'
          ]"
        >
          {{ icon.label }}
        </span>
        
        <!-- Badge de categoría -->
        <span 
          v-if="!selectedCategory"
          :class="[
            'text-[10px] px-2 py-0.5 rounded-full',
            getCategoryBadgeClass(icon.category)
          ]"
        >
          {{ getCategoryLabel(icon.category) }}
        </span>
      </button>
    </div>

    <!-- Mensaje cuando no hay resultados -->
    <div 
      v-else 
      class="text-center py-16 px-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-dashed border-yellow-300 rounded-2xl"
    >
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
        <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h5 class="text-lg font-semibold text-yellow-900 mb-2">No se encontraron pictogramas</h5>
      <p class="text-sm text-yellow-700 max-w-md mx-auto mb-4">
        No hay resultados para "{{ searchQuery }}"
        <span v-if="selectedCategory"> en la categoría "{{ getCategoryLabel(selectedCategory) }}"</span>
      </p>
      <button
        @click="clearFilters"
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
      >
        <ArrowPathIcon class="w-4 h-4" />
        Limpiar filtros
      </button>
    </div>

    <!-- Preview del pictograma seleccionado -->
    <div 
      v-if="selectedIcon" 
      class="mt-6 p-6 bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200 rounded-xl"
    >
      <div class="flex items-center gap-4">
        <div class="flex-shrink-0">
          <div class="w-20 h-20 rounded-xl bg-white shadow-md flex items-center justify-center">
            <component :is="selectedIcon.component" class="w-12 h-12 text-primary-600" />
          </div>
        </div>
        <div class="flex-1">
          <h5 class="text-lg font-bold text-primary-900 mb-1">{{ selectedIcon.label }}</h5>
          <p v-if="selectedIcon.description" class="text-sm text-primary-700 mb-2">
            {{ selectedIcon.description }}
          </p>
          <div class="flex items-center gap-2">
            <span :class="['text-xs px-3 py-1 rounded-full font-medium', getCategoryBadgeClass(selectedIcon.category)]">
              {{ getCategoryLabel(selectedIcon.category) }}
            </span>
            <CheckCircleIcon class="w-5 h-5 text-primary-600" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  MagnifyingGlassIcon, 
  XMarkIcon, 
  CheckCircleIcon,
  ArrowPathIcon 
} from '@heroicons/vue/24/outline'
import { 
  PICTOGRAMS_CATALOG, 
  PICTOGRAM_CATEGORIES, 
  type Pictogram 
} from '@/data/pictograms'

// =====================================================
// PROPS & EMITS
// =====================================================

defineProps<{
  modelValue?: Pictogram | null
}>()

const emit = defineEmits<{
  (e: 'select', pictogram: Pictogram): void
  (e: 'update:modelValue', pictogram: Pictogram | null): void
}>()

// =====================================================
// STATE
// =====================================================

const searchQuery = ref('')
const selectedCategory = ref<string | null>(null)
const selectedIcon = ref<Pictogram | null>(null)

// =====================================================
// COMPUTED
// =====================================================

const filteredIcons = computed(() => {
  let icons = PICTOGRAMS_CATALOG

  // Filtrar por categoría
  if (selectedCategory.value) {
    icons = icons.filter(i => i.category === selectedCategory.value)
  }

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim()
    icons = icons.filter(icon =>
      icon.label.toLowerCase().includes(query) ||
      icon.keywords.some(kw => kw.toLowerCase().includes(query)) ||
      icon.description?.toLowerCase().includes(query)
    )
  }

  return icons
})

// =====================================================
// METHODS
// =====================================================

function selectIcon(icon: Pictogram) {
  selectedIcon.value = icon
  emit('select', icon)
  emit('update:modelValue', icon)
}

function toggleCategory(categoryId: string) {
  selectedCategory.value = selectedCategory.value === categoryId ? null : categoryId
}

function clearSearch() {
  searchQuery.value = ''
}

function clearFilters() {
  searchQuery.value = ''
  selectedCategory.value = null
}

function onSearchInput() {
  // Opcional: lógica adicional cuando se escribe
}

function getCategoryLabel(categoryId: string): string {
  const category = PICTOGRAM_CATEGORIES.find(c => c.id === categoryId)
  return category?.label || categoryId
}

function getCategoryActiveClass(color: string): string {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700 ring-2 ring-blue-400 shadow-md',
    green: 'bg-green-100 text-green-700 ring-2 ring-green-400 shadow-md',
    purple: 'bg-purple-100 text-purple-700 ring-2 ring-purple-400 shadow-md',
    amber: 'bg-amber-100 text-amber-700 ring-2 ring-amber-400 shadow-md',
    pink: 'bg-pink-100 text-pink-700 ring-2 ring-pink-400 shadow-md',
    indigo: 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-400 shadow-md',
    orange: 'bg-orange-100 text-orange-700 ring-2 ring-orange-400 shadow-md',
    cyan: 'bg-cyan-100 text-cyan-700 ring-2 ring-cyan-400 shadow-md',
    teal: 'bg-teal-100 text-teal-700 ring-2 ring-teal-400 shadow-md',
    gray: 'bg-gray-200 text-gray-800 ring-2 ring-gray-400 shadow-md',
    emerald: 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-400 shadow-md',
  }
  return colorMap[color] || 'bg-gray-100 text-gray-700 ring-2 ring-gray-400'
}

function getCategoryBadgeClass(categoryId: string): string {
  const category = PICTOGRAM_CATEGORIES.find(c => c.id === categoryId)
  if (!category) return 'bg-gray-100 text-gray-600'
  
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    amber: 'bg-amber-100 text-amber-700',
    pink: 'bg-pink-100 text-pink-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    orange: 'bg-orange-100 text-orange-700',
    cyan: 'bg-cyan-100 text-cyan-700',
    teal: 'bg-teal-100 text-teal-700',
    gray: 'bg-gray-200 text-gray-700',
    emerald: 'bg-emerald-100 text-emerald-700',
  }
  return colorMap[category.color] || 'bg-gray-100 text-gray-600'
}
</script>

<style scoped>
/* Scrollbar personalizado */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Animación de entrada */
.pictogram-selector {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Line clamp para textos largos */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>