<!-- src/components/forms/multi-step/pasos/Paso2Location.vue -->
<!-- 
  ✅ VERSIÓN FINAL CORREGIDA
  
  CORRECCIONES:
  1. ✅ Evento 'validated' → 'validate' (para match con padre)
  2. ✅ Importar Establishment desde @/type/nne
  3. ✅ Usar Establishment en lugar de EstablishmentSearchResult
  4. ✅ Validación inmediata al seleccionar/crear
-->
<template>
  <div class="step-location">
    <!-- Header del Paso -->
    <div class="step-header">
      <div class="step-number">2</div>
      <div class="step-title">
        <h2 class="text-2xl font-bold text-gray-900">Ubicación y Establecimiento</h2>
        <p class="text-gray-600 mt-1">
          {{ isCreatingNew ? 'Registra un nuevo establecimiento educacional' : 'Busca el establecimiento educacional' }}
        </p>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- MODO BÚSQUEDA: Buscador Inteligente         -->
    <!-- ============================================ -->
    <div v-if="!isCreatingNew">
      <!-- Campo de Búsqueda -->
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Buscar Establecimiento
          <span class="text-red-500">*</span>
        </label>
        
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            @input="handleSearchInput"
            placeholder="Escribe el nombre o RBD del establecimiento..."
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :disabled="loading.search"
          />
          
          <!-- Icono de búsqueda -->
          <div class="absolute right-3 top-3">
            <svg v-if="loading.search" class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        <!-- Mensajes de estado -->
        <div class="mt-2 text-sm">
          <p v-if="loading.search" class="text-blue-600">
            🔍 Buscando establecimientos...
          </p>
          <p v-else-if="searchQuery && searchResults.length === 0" class="text-yellow-600">
            ⚠️ No se encontraron establecimientos con ese nombre o RBD
          </p>
          <p v-else-if="searchQuery && searchResults.length > 0" class="text-green-600">
            ✅ {{ searchResults.length }} establecimiento(s) encontrado(s)
          </p>
          <p v-else class="text-gray-500">
            💡 Escribe al menos 3 caracteres para buscar
          </p>
        </div>
      </div>

      <!-- Resultados de Búsqueda -->
      <div v-if="searchResults.length > 0" class="mt-4 space-y-2">
        <div
          v-for="establishment in searchResults"
          :key="establishment.id"
          @click="selectEstablishment(establishment)"
          class="establishment-card clickable"
          :class="{ 'selected': selectedEstablishmentId === establishment.id }"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h4 class="font-semibold text-gray-900">{{ establishment.name }}</h4>
              <p class="text-sm text-gray-600 mt-1">
                <span v-if="establishment.rbd">RBD: {{ establishment.rbd }} • </span>
                {{ establishment.establishment_type_detail?.name || 'Tipo no especificado' }}
              </p>
              <p class="text-sm text-gray-500 mt-1">
                📍 {{ establishment.address }}{{ establishment.street_number ? ' ' + establishment.street_number : '' }}, {{ establishment.commune_detail?.name }}, {{ establishment.region_detail?.name }}
              </p>
            </div>
            
            <!-- Checkmark si está seleccionado -->
            <div v-if="selectedEstablishmentId === establishment.id" class="ml-4">
              <svg class="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón para activar Modo Creación -->
      <div v-if="searchQuery && searchResults.length === 0 && !loading.search" class="mt-6">
        <button
          type="button"
          @click="enableCreationMode"
          class="w-full px-4 py-3 bg-blue-50 border-2 border-blue-300 border-dashed rounded-lg hover:bg-blue-100 transition-colors"
        >
          <div class="flex items-center justify-center space-x-2">
            <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span class="text-blue-600 font-medium">¿No aparece en la lista? Registrar nuevo establecimiento</span>
          </div>
        </button>
      </div>

      <!-- Información del establecimiento seleccionado -->
      <div class="mt-6" v-if="selectedEstablishmentInfo">
        <div class="establishment-info-card">
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">{{ selectedEstablishmentInfo.name }}</h3>
              <p class="text-sm text-gray-600 mt-1">
                {{ selectedEstablishmentInfo.address }}
              </p>
              <p v-if="selectedEstablishmentInfo.rbd" class="text-sm text-gray-500 mt-1">
                RBD: {{ selectedEstablishmentInfo.rbd }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- MODO CREACIÓN: Componente Separado          -->
    <!-- ============================================ -->
    <CrearEstablecimiento
      v-if="isCreatingNew"
      @created="handleEstablishmentCreated"
      @cancel="disableCreationMode"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { debounce } from 'lodash-es'
import * as nneService from '@/services/nneService'
import type { Establishment } from '@/type/nne'
import CrearEstablecimiento from '../components/CrearEstablecimiento.vue'

// ============================================================================
// INTERFACES
// ============================================================================

interface FormData {
  establishment?: number
}

// ============================================================================
// PROPS & EMITS
// ============================================================================

interface Props {
  formData: FormData
}

interface Emits {
  (e: 'update:formData', value: FormData): void
  (e: 'validate', isValid: boolean): void  // ✅ CAMBIADO: 'validated' → 'validate'
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// ============================================================================
// REACTIVE STATE
// ============================================================================

const formDataRaw = ref<FormData>({ ...props.formData })

// Modo de operación
const isCreatingNew = ref(false)

// Búsqueda
const searchQuery = ref('')
const searchResults = ref<Establishment[]>([])

// Loading states
const loading = ref({
  search: false
})

// Errors
const errors = ref({
  search: ''
})

// Establecimiento seleccionado
const selectedEstablishmentId = ref<number | undefined>(formDataRaw.value.establishment)
const selectedEstablishmentInfo = ref<{
  name: string
  address: string
  rbd?: string
} | null>(null)

// ============================================================================
// METHODS
// ============================================================================

/**
 * Búsqueda de establecimientos con debounce
 */
const handleSearchInput = debounce(async () => {
  const query = searchQuery.value.trim()
  
  // No buscar si el query es muy corto
  if (query.length < 3) {
    searchResults.value = []
    return
  }

  loading.value.search = true
  errors.value.search = ''

  try {
    console.log('[Paso2Location] 🔍 Buscando establecimientos:', query)
    
    const results = await nneService.searchEstablishmentsFullApi(query)
    searchResults.value = results
    
    console.log('[Paso2Location] ✅ Resultados:', results.length)
  } catch (error) {
    console.error('[Paso2Location] ❌ Error en búsqueda:', error)
    errors.value.search = 'Error al buscar establecimientos'
  } finally {
    loading.value.search = false
  }
}, 500)

/**
 * Seleccionar un establecimiento de los resultados
 */
const selectEstablishment = (establishment: Establishment) => {
  console.log('[Paso2Location] ✅ Establecimiento seleccionado:', establishment)
  
  selectedEstablishmentId.value = establishment.id
  formDataRaw.value.establishment = establishment.id
  
  // Guardar info para mostrar
  selectedEstablishmentInfo.value = {
    name: establishment.name,
    address: `${establishment.address}${establishment.street_number ? ' ' + establishment.street_number : ''}, ${establishment.commune_detail?.name}, ${establishment.region_detail?.name}`,
    rbd: establishment.rbd || undefined
  }
  
  emitFormData()
  validateForm()  // ✅ IMPORTANTE: Validar inmediatamente
}

/**
 * Activar modo creación
 */
const enableCreationMode = () => {
  console.log('[Paso2Location] 🆕 Activando modo creación')
  isCreatingNew.value = true
  
  // Limpiar selección anterior
  selectedEstablishmentId.value = undefined
  formDataRaw.value.establishment = undefined
  selectedEstablishmentInfo.value = null
  
  // ✅ Invalidar paso al entrar en modo creación
  validateForm()
}

/**
 * Desactivar modo creación
 */
const disableCreationMode = () => {
  console.log('[Paso2Location] 🔙 Volviendo a modo búsqueda')
  isCreatingNew.value = false
}

/**
 * Manejar establecimiento creado desde el componente hijo
 */
const handleEstablishmentCreated = (establishment: Establishment) => {
  console.log('[Paso2Location] 🎉 Establecimiento creado:', establishment)
  
  // Auto-seleccionar el establecimiento recién creado
  selectedEstablishmentId.value = establishment.id
  formDataRaw.value.establishment = establishment.id
  
  // Guardar info para mostrar
  selectedEstablishmentInfo.value = {
    name: establishment.name,
    address: establishment.full_address || `${establishment.address}${establishment.street_number ? ' ' + establishment.street_number : ''}, ${establishment.commune_detail?.name}`,
    rbd: establishment.rbd || undefined
  }
  
  // Salir del modo creación
  isCreatingNew.value = false
  
  // Emitir cambios
  emitFormData()
  validateForm()  // ✅ IMPORTANTE: Validar inmediatamente
}

/**
 * Emitir datos del formulario
 */
const emitFormData = () => {
  emit('update:formData', { ...formDataRaw.value })
}

/**
 * ✅ CORREGIDO: Validar formulario y emitir evento 'validate'
 */
const validateForm = () => {
  const isValid = !!formDataRaw.value.establishment
  
  console.log('[Paso2Location] 🔍 Validación:', { 
    isValid, 
    establishmentId: formDataRaw.value.establishment 
  })
  
  // ✅ CAMBIADO: 'validated' → 'validate'
  emit('validate', isValid)
}

/**
 * Cargar información del establecimiento seleccionado
 */
const loadEstablishmentInfo = async (establishmentId: number) => {
  try {
    const establishment = await nneService.getEstablishmentDetailApi(establishmentId)
    
    selectedEstablishmentInfo.value = {
      name: establishment.name,
      address: establishment.full_address || `${establishment.address}${establishment.street_number ? ' ' + establishment.street_number : ''}, ${establishment.commune_detail?.name}`,
      rbd: establishment.rbd || undefined
    }
  } catch (error) {
    console.error('[Paso2Location] Error cargando info del establecimiento:', error)
  }
}

// ============================================================================
// WATCHERS
// ============================================================================

watch(() => props.formData, (newVal) => {
  formDataRaw.value = { ...newVal }
  selectedEstablishmentId.value = newVal.establishment
}, { deep: true })

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  console.log('[Paso2Location] 🚀 Componente montado')
  
  // Si ya hay un establecimiento seleccionado, cargar su info
  if (formDataRaw.value.establishment) {
    loadEstablishmentInfo(formDataRaw.value.establishment)
  }
  
  // ✅ IMPORTANTE: Validar estado inicial
  validateForm()
})
</script>

<style scoped>
.step-location {
  @apply max-w-4xl mx-auto;
}

.step-header {
  @apply flex items-start space-x-4 mb-8;
}

.step-number {
  @apply flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg;
}

.form-group {
  @apply mb-6;
}

.establishment-card {
  @apply p-4 border border-gray-200 rounded-lg transition-all;
}

.establishment-card.clickable {
  @apply cursor-pointer hover:border-blue-400 hover:bg-blue-50;
}

.establishment-card.selected {
  @apply border-green-500 bg-green-50;
}

.establishment-info-card {
  @apply p-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg;
}
</style>