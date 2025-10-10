<!-- src/components/forms/multi-step/pasos/Paso2Location.vue -->
<template>
  <div class="step-location">
    <!-- Header del Paso -->
    <div class="step-header">
      <div class="step-number">2</div>
      <div class="step-title">
        <h2 class="text-2xl font-bold text-gray-900">Ubicación y Establecimiento</h2>
        <p class="text-gray-600 mt-1">Información de ubicación geográfica y establecimiento educacional</p>
      </div>
    </div>

    <!-- Formulario -->
    <FormKit
      type="form"
      id="location-form"
      :actions="false"
      v-model="formDataRaw"
      @input="handleFormInput"
    >
      <!-- Grid de Campos -->
      <div class="form-grid">
        <!-- Región -->
        <div class="form-group">
          <FormKit
            type="select"
            name="region"
            label="Región"
            placeholder="Selecciona una región"
            :options="regionOptions"
            validation="required"
            :validation-messages="{
              required: 'La región es obligatoria'
            }"
            @input="handleRegionChange"
            :disabled="loading.regions"
          />
          <div v-if="loading.regions" class="text-xs text-blue-500 mt-1">
            ⏳ Cargando regiones desde el servidor...
          </div>
          <div v-if="errors.regions" class="text-xs text-red-500 mt-1">
            ❌ {{ errors.regions }}
          </div>
        </div>

        <!-- Comuna -->
        <div class="form-group">
          <FormKit
            type="select"
            name="commune"
            label="Comuna"
            placeholder="Selecciona una comuna"
            :options="communeOptions"
            validation="required"
            :validation-messages="{
              required: 'La comuna es obligatoria'
            }"
            :disabled="!formDataLocal.region || loading.communes"
          />
          <div v-if="!formDataLocal.region" class="text-xs text-gray-500 mt-1">
            Primero selecciona una región
          </div>
          <div v-if="loading.communes" class="text-xs text-blue-500 mt-1">
            ⏳ Cargando comunas desde el servidor...
          </div>
          <div v-if="errors.communes" class="text-xs text-red-500 mt-1">
            ❌ {{ errors.communes }}
          </div>
        </div>

        <!-- Establecimiento Educacional - BÚSQUEDA SIMPLIFICADA -->
        <div class="form-group">
          <FormKit
            type="select"
            name="establishment"
            label="Establecimiento Educacional"
            placeholder="Escribe para buscar establecimientos..."
            :options="establishmentOptions"
            validation="required"
            :validation-messages="{
              required: 'El establecimiento es obligatorio'
            }"
            :disabled="loading.establishments"
            @focus="handleEstablishmentFocus"
          />
          <div class="search-instructions">
            <div v-if="loading.establishments" class="text-xs text-blue-500 mt-1">
              ⏳ Buscando establecimientos educativos...
            </div>
            <div v-if="errors.establishments" class="text-xs text-red-500 mt-1">
              ❌ {{ errors.establishments }}
            </div>
            <div v-if="!loading.establishments && establishmentOptions.length > 1" class="text-xs text-green-600 mt-1">
              ✅ {{ establishmentOptions.length - 1 }} establecimientos educativos encontrados
            </div>
            <div v-if="!loading.establishments && establishmentOptions.length === 1" class="text-xs text-yellow-600 mt-1">
              💡 Escribe el nombre o RBD del establecimiento para buscar
            </div>
          </div>
        </div>

        <!-- Calle -->
        <div class="form-group">
          <FormKit
            type="text"
            name="street"
            label="Calle"
            placeholder="Ingresa el nombre de la calle"
            validation="required|length:2,255"
            :validation-messages="{
              required: 'La calle es obligatoria',
              length: 'La calle debe tener entre 2 y 255 caracteres'
            }"
          />
        </div>

        <!-- Número -->
        <div class="form-group">
          <FormKit
            type="text"
            name="street_number"
            label="Número"
            placeholder="Ej: 123, 456-A, S/N"
            validation="required|length:1,20"
            :validation-messages="{
              required: 'El número es obligatorio',
              length: 'El número debe tener entre 1 y 20 caracteres'
            }"
          />
        </div>

        <!-- Dirección Completa (Preview) -->
        <div class="form-group col-span-full" v-if="fullAddress">
          <label class="formkit-label">Dirección Completa</label>
          <div class="address-preview">
            <MapPinIcon class="h-5 w-5 text-blue-500" />
            <span class="address-text">{{ fullAddress }}</span>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            Vista previa de la dirección generada automáticamente
          </p>
        </div>

        <!-- Información del Establecimiento Seleccionado -->
        <div class="form-group col-span-full" v-if="selectedEstablishmentInfo">
          <label class="formkit-label">Información del Establecimiento</label>
          <div class="establishment-info">
            <BuildingLibraryIcon class="h-5 w-5 text-green-500" />
            <div class="establishment-details">
              <strong>{{ selectedEstablishmentInfo.name }}</strong>
              <div class="establishment-meta">
                <span v-if="selectedEstablishmentInfo.rbd">RBD: {{ selectedEstablishmentInfo.rbd }}</span>
                <span v-if="selectedEstablishmentInfo.commune">• {{ selectedEstablishmentInfo.commune }}</span>
                <span v-if="selectedEstablishmentInfo.region">• {{ selectedEstablishmentInfo.region }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Información de Validación -->
      <div class="validation-info" :class="{ 'is-valid': isStepValid }">
        <div class="validation-icon">
          <CheckCircleIcon v-if="isStepValid" class="h-5 w-5" />
          <ExclamationCircleIcon v-else class="h-5 w-5" />
        </div>
        <div class="validation-text">
          <span v-if="isStepValid">✓ Todos los campos de ubicación están completos</span>
          <span v-else>⚠ Complete todos los campos obligatorios</span>
        </div>
      </div>

      <!-- Panel de Debug (solo desarrollo) -->
      <div v-if="showDebug" class="debug-panel mt-4 p-4 bg-gray-100 rounded-lg">
        <h4 class="font-bold mb-2">🐛 Debug Info:</h4>
        <p><strong>Región seleccionada:</strong> {{ formDataLocal.region }}</p>
        <p><strong>Comuna seleccionada:</strong> {{ formDataLocal.commune }}</p>
        <p><strong>Establecimiento:</strong> {{ formDataLocal.establishment }}</p>
        <p><strong>Regiones cargadas:</strong> {{ regionOptions.length }}</p>
        <p><strong>Comunas cargadas:</strong> {{ communeOptions.length }}</p>
        <p><strong>Establecimientos cargados:</strong> {{ establishmentOptions.length - 1 }}</p>
        <p><strong>Calle:</strong> {{ formDataLocal.street }}</p>
        <p><strong>Número:</strong> {{ formDataLocal.street_number }}</p>
      </div>
    </FormKit>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { CheckCircleIcon, ExclamationCircleIcon, MapPinIcon, BuildingLibraryIcon } from '@heroicons/vue/24/outline'
import nneService from '@/services/nneService'

// Interfaces
interface LocationData {
  establishment: number | null
  region: number | null
  commune: number | null
  street: string
  street_number: string
}

interface EstablishmentInfo {
  name: string
  rbd: string | null
  commune: string | null
  region: string | null
}

interface Props {
  formData: LocationData
}

interface Emits {
  (e: 'update:formData', data: LocationData): void
  (e: 'validate', isValid: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Estado local del formulario
const formDataLocal = ref<LocationData>({
  establishment: null,
  region: null,
  commune: null,
  street: '',
  street_number: ''
})

const formDataRaw = ref<any>({})
const showDebug = ref(import.meta.env.DEV) // Solo mostrar debug en desarrollo

// ✅ OPCIONES DINÁMICAS DESDE EL BACKEND
const regionOptions = ref<Array<{value: number | string, label: string, attrs?: any}>>([
  { value: '', label: 'Cargando regiones...', attrs: { disabled: true } }
])

const communeOptions = ref<Array<{value: number | string, label: string, attrs?: any}>>([
  { value: '', label: 'Primero selecciona una región', attrs: { disabled: true } }
])

const establishmentOptions = ref<Array<{value: number | string, label: string, attrs?: any}>>([
  { value: '', label: 'Escribe para buscar establecimientos educativos...', attrs: { disabled: true } }
])

// Información del establecimiento seleccionado
const selectedEstablishmentInfo = ref<EstablishmentInfo | null>(null)

// Estados de carga y errores
const loading = ref({
  regions: false,
  communes: false,
  establishments: false
})

const errors = ref({
  regions: '',
  communes: '',
  establishments: ''
})

// Dirección completa calculada
const fullAddress = computed(() => {
  const { street, street_number, commune } = formDataLocal.value
  if (!street || !street_number || !commune) return ''
  
  const communeOption = communeOptions.value.find(c => c.value === commune)
  const communeName = communeOption?.label || 'Comuna seleccionada'
  
  return `${street} #${street_number}, ${communeName}`
})

// Validación del paso
const isStepValid = computed(() => {
  const { establishment, region, commune, street, street_number } = formDataLocal.value
  
  const isValid = Boolean(
    establishment &&
    region && 
    commune &&
    street && street.trim().length >= 2 &&
    street_number && street_number.trim().length >= 1
  )
  
  console.log('🔍 Validación Paso 2 - Ubicación:', {
    establishment,
    region,
    commune,
    street: street?.length,
    street_number: street_number?.length,
    isValid
  })
  
  return isValid
})

// ✅ CARGAR DATOS DESDE EL BACKEND
const loadRegions = async () => {
  try {
    loading.value.regions = true
    errors.value.regions = ''
    
    console.log('🔄 Iniciando carga de regiones...')
    const regions = await nneService.getRegionsApi()
    
    regionOptions.value = [
      { value: '', label: 'Selecciona una región', attrs: { disabled: true } },
      ...regions
    ]
    
    console.log('✅ Regiones cargadas desde backend:', regions.length)
    
  } catch (error: any) {
    console.error('❌ Error cargando regiones:', error)
    errors.value.regions = error.message || 'Error al cargar regiones'
    regionOptions.value = [
      { value: '', label: 'Error al cargar regiones', attrs: { disabled: true } }
    ]
  } finally {
    loading.value.regions = false
  }
}

const loadCommunesByRegion = async (regionId: number) => {
  try {
    loading.value.communes = true
    errors.value.communes = ''
    
    console.log(`🔄 Cargando comunas para región ${regionId}...`)
    const communes = await nneService.getCommunesByRegionApi(regionId)
    
    communeOptions.value = [
      { value: '', label: 'Selecciona una comuna', attrs: { disabled: true } },
      ...communes
    ]
    
    console.log(`✅ ${communes.length} comunas cargadas para región ${regionId}`)
    
  } catch (error: any) {
    console.error(`❌ Error cargando comunas para región ${regionId}:`, error)
    errors.value.communes = error.message || 'Error al cargar comunas'
    communeOptions.value = [
      { value: '', label: 'Error al cargar comunas', attrs: { disabled: true } }
    ]
  } finally {
    loading.value.communes = false
  }
}

// ✅ NUEVA FUNCIÓN SIMPLIFICADA: Buscar establecimientos educativos
const searchEducationalEstablishments = async (query: string = '') => {
  try {
    loading.value.establishments = true
    errors.value.establishments = ''
    
    console.log(`🔍 Buscando establecimientos educativos: "${query}"`)
    
    if (!query || query.trim().length < 2) {
      // Si la búsqueda es muy corta, cargar todos los establecimientos educativos
      const allEstablishments = await nneService.getAllEducationalEstablishmentsApi()
      
      if (allEstablishments.length === 0) {
        establishmentOptions.value = [
          { value: '', label: 'No se encontraron establecimientos educativos', attrs: { disabled: true } }
        ]
      } else {
        establishmentOptions.value = [
          { value: '', label: 'Selecciona un establecimiento educativo', attrs: { disabled: true } },
          ...allEstablishments
        ]
      }
      
      console.log(`✅ ${allEstablishments.length} establecimientos educativos cargados`)
    } else {
      // Búsqueda por nombre o RBD
      const establishments = await nneService.searchEducationalEstablishmentsApi(query)
      
      if (establishments.length === 0) {
        establishmentOptions.value = [
          { value: '', label: 'No se encontraron establecimientos con esa búsqueda', attrs: { disabled: true } }
        ]
      } else {
        establishmentOptions.value = [
          { value: '', label: `Resultados para "${query}"`, attrs: { disabled: true } },
          ...establishments
        ]
      }
      
      console.log(`✅ ${establishments.length} establecimientos encontrados para "${query}"`)
    }
    
  } catch (error: any) {
    console.error('❌ Error buscando establecimientos:', error)
    errors.value.establishments = error.message || 'Error al buscar establecimientos'
    establishmentOptions.value = [
      { value: '', label: 'Error al buscar establecimientos', attrs: { disabled: true } }
    ]
  } finally {
    loading.value.establishments = false
  }
}

// ✅ Cargar detalle del establecimiento seleccionado
const loadEstablishmentDetail = async (establishmentId: number) => {
  try {
    console.log(`📋 Cargando detalle del establecimiento ${establishmentId}...`)
    const establishment = await nneService.getEstablishmentDetailApi(establishmentId)
    
    selectedEstablishmentInfo.value = {
      name: establishment.name,
      rbd: establishment.rbd,
      commune: establishment.commune_detail?.name || null,
      region: establishment.region_detail?.name || null
    }
    
    console.log('✅ Detalle del establecimiento cargado:', selectedEstablishmentInfo.value)
  } catch (error) {
    console.error(`❌ Error cargando detalle del establecimiento ${establishmentId}:`, error)
    selectedEstablishmentInfo.value = null
  }
}

// ✅ MANEJO DE CAMBIO DE REGIÓN
const handleRegionChange = async (value: any) => {
  console.log('🌎 Región seleccionada:', value, 'Tipo:', typeof value)
  
  // Convertir a número y actualizar
  const regionId = value ? Number(value) : null
  formDataLocal.value.region = regionId
  
  // Reset comuna cuando cambia región
  formDataLocal.value.commune = null
  
  // Reset opciones de comuna
  communeOptions.value = [
    { value: '', label: 'Cargando comunas...', attrs: { disabled: true } }
  ]
  
  // Cargar comunas de la región seleccionada
  if (regionId) {
    await loadCommunesByRegion(regionId)
  } else {
    communeOptions.value = [
      { value: '', label: 'Primero selecciona una región', attrs: { disabled: true } }
    ]
  }
  
  // Emitir validación actualizada
  const isValid = isStepValid.value
  emit('validate', isValid)
}

// ✅ MANEJO DE FOCO EN ESTABLECIMIENTO
const handleEstablishmentFocus = async () => {
  console.log('🎯 Foco en campo de establecimiento')
  
  // Si no hay establecimientos cargados, cargarlos todos
  if (establishmentOptions.value.length <= 1) {
    await searchEducationalEstablishments('')
  }
}

// ✅ MANEJO DE INPUT DEL FORMULARIO
const handleFormInput = async (rawData: any) => {
  console.log('📝 Input del formulario (raw):', rawData)
  
  // Conversión crítica: asegurar que los IDs sean números
  const processedData: LocationData = {
    establishment: rawData.establishment ? Number(rawData.establishment) : null,
    region: rawData.region ? Number(rawData.region) : null,
    commune: rawData.commune ? Number(rawData.commune) : null,
    street: rawData.street || '',
    street_number: rawData.street_number || ''
  }
  
  console.log('🔄 Datos procesados (con números):', processedData)
  
  // Actualizar datos locales
  formDataLocal.value = processedData
  
  // Si se seleccionó un establecimiento, cargar su detalle
  if (processedData.establishment && processedData.establishment !== formDataLocal.value.establishment) {
    await loadEstablishmentDetail(processedData.establishment)
  } else if (!processedData.establishment) {
    selectedEstablishmentInfo.value = null
  }
  
  // Emitir cambios al padre con tipos correctos
  emit('update:formData', processedData)
  
  // Emitir validación
  const isValid = isStepValid.value
  emit('validate', isValid)
}

// Método de validación para exponer
const validate = () => {
  const isValid = isStepValid.value
  console.log('🔍 Validación forzada Paso 2:', isValid)
  emit('validate', isValid)
  return isValid
}

// ✅ INICIALIZACIÓN MEJORADA
onMounted(async () => {
  console.log('🚀 Paso 2 - Ubicación montado con datos iniciales:', props.formData)
  
  // Cargar regiones asincrónicamente
  await loadRegions()
  
  // Cargar datos iniciales del formulario
  if (props.formData) {
    formDataLocal.value = {
      establishment: props.formData.establishment,
      region: props.formData.region,
      commune: props.formData.commune,
      street: props.formData.street || '',
      street_number: props.formData.street_number || ''
    }
    
    // Sincronizar datos crudos para FormKit
    formDataRaw.value = {
      establishment: props.formData.establishment,
      region: props.formData.region,
      commune: props.formData.commune,
      street: props.formData.street || '',
      street_number: props.formData.street_number || ''
    }
    
    // Si hay región, cargar sus comunas
    if (props.formData.region) {
      await loadCommunesByRegion(props.formData.region)
    }
    
    // Si hay establecimiento, cargar su detalle
    if (props.formData.establishment) {
      await loadEstablishmentDetail(props.formData.establishment)
    }
  }
  
  // Emitir validación inicial después de un pequeño delay
  setTimeout(() => {
    const isValid = isStepValid.value
    console.log('📢 Validación inicial Paso 2:', isValid)
    emit('validate', isValid)
  }, 500)
})

// Watch para cambios desde el padre
watch(() => props.formData, async (newData) => {
  if (newData) {
    const currentStr = JSON.stringify(formDataLocal.value)
    const newStr = JSON.stringify(newData)
    
    if (currentStr !== newStr) {
      console.log('📥 Actualización desde padre:', newData)
      
      // Actualizar con tipos correctos
      formDataLocal.value = {
        establishment: newData.establishment,
        region: newData.region,
        commune: newData.commune,
        street: newData.street || '',
        street_number: newData.street_number || ''
      }
      
      // Sincronizar datos crudos para FormKit
      formDataRaw.value = {
        establishment: newData.establishment,
        region: newData.region,
        commune: newData.commune,
        street: newData.street || '',
        street_number: newData.street_number || ''
      }
      
      // Si hay región, actualizar comunas
      if (newData.region) {
        await loadCommunesByRegion(newData.region)
      }
      
      // Si hay establecimiento, actualizar su detalle
      if (newData.establishment) {
        await loadEstablishmentDetail(newData.establishment)
      }
    }
  }
}, { deep: true })

// Exponer método validate
defineExpose({
  validate
})
</script>

<style scoped>
.step-location {
  @apply space-y-6;
}

.step-header {
  @apply flex items-start space-x-4 mb-8 pb-6 border-b border-gray-200;
}

.step-number {
  @apply flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold;
}

.step-title h2 {
  @apply text-2xl font-bold text-gray-900;
}

.step-title p {
  @apply text-gray-600 mt-1;
}

.form-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6;
}

.col-span-full {
  @apply md:col-span-2;
}

.form-group {
  @apply space-y-2;
}

.search-instructions {
  @apply space-y-1;
}

.address-preview {
  @apply p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center space-x-3;
}

.address-text {
  @apply text-blue-900 font-medium;
}

.establishment-info {
  @apply p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3;
}

.establishment-details {
  @apply flex-1;
}

.establishment-details strong {
  @apply text-green-900 font-medium block mb-1;
}

.establishment-meta {
  @apply text-sm text-green-700 space-x-2;
}

.validation-info {
  @apply mt-8 p-4 rounded-lg border flex items-center space-x-3 transition-colors duration-200;
}

.validation-info:not(.is-valid) {
  @apply bg-yellow-50 border-yellow-200 text-yellow-800;
}

.validation-info.is-valid {
  @apply bg-green-50 border-green-200 text-green-800;
}

.validation-icon {
  @apply flex-shrink-0;
}

.validation-text {
  @apply text-sm font-medium;
}

.debug-panel {
  @apply text-xs font-mono;
}

.debug-panel h4 {
  @apply text-sm font-bold text-gray-700;
}

.debug-panel p {
  @apply mb-1;
}
</style>

<style>
/* Estilos globales para FormKit */
#location-form .formkit-outer {
  @apply mb-0;
}

#location-form .formkit-label {
  @apply block text-sm font-medium text-gray-700 mb-2;
}

#location-form .formkit-input {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200 bg-white;
}

#location-form .formkit-input:focus {
  @apply ring-2 ring-blue-500 ring-opacity-20;
}

#location-form .formkit-message {
  @apply mt-1 text-sm text-red-600;
}

#location-form .formkit-help {
  @apply mt-1 text-sm text-gray-500;
}

#location-form select.formkit-input {
  @apply pr-10 appearance-none bg-white cursor-pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}

#location-form .formkit-input:disabled {
  @apply bg-gray-50 text-gray-500 cursor-not-allowed opacity-60;
}

#location-form .formkit-input[data-invalid="true"] {
  @apply border-red-300 focus:border-red-500 focus:ring-red-500;
}

#location-form .formkit-input[data-valid="true"] {
  @apply border-green-300 focus:border-green-500 focus:ring-green-500;
}

/* Responsive */
@media (max-width: 768px) {
  .form-grid {
    @apply grid-cols-1 gap-4;
  }
  
  .step-header {
    @apply flex-col space-x-0 space-y-4;
  }
  
  .step-number {
    @apply w-8 h-8 text-base;
  }
}
</style>