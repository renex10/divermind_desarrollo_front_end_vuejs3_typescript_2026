<template>
  <div class="crear-establecimiento">
    <div class="mb-6 flex justify-between items-center">
      <button
        type="button"
        @click="handleCancel"
        class="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1 transition-colors"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        <span>Volver a búsqueda</span>
      </button>

      <div v-if="hasUnsavedChanges" class="text-xs text-amber-600 flex items-center gap-1 animate-pulse">
        <span>💾 Borrador técnico guardado</span>
      </div>
    </div>

    <FormKit
      type="form"
      id="create-establishment-form"
      :actions="false"
      v-model="formData"
      @submit="handleSubmit"
    >
      <div class="form-grid">
        
        <div class="col-span-full">
          <FormKit
            type="text"
            name="name"
            label="Nombre del Establecimiento"
            placeholder="Ej: Escuela Básica Santa María"
            validation="required|length:3,255"
            :validation-messages="{
              required: 'El nombre es obligatorio',
              length: 'Debe tener entre 3 y 255 caracteres'
            }"
          />
        </div>

        <div class="col-span-full">
          <FormKit
            type="select"
            name="establishment_type"
            label="Tipo de Establecimiento"
            :options="establishmentTypeOptions"
            validation="required"
            :validation-messages="{
              required: 'Selecciona el tipo de establecimiento'
            }"
            :disabled="loading.establishmentTypes"
          />
        </div>

        <div class="col-span-full">
          <FormKit
            type="text"
            name="rbd"
            :label="rbdFieldLabel"
            :placeholder="rbdFieldPlaceholder"
            :validation="rbdFieldValidation"
            :validation-messages="{
              required: rbdFieldRequired
            }"
            :help="rbdFieldHelp"
          />
          
          <div v-if="rbdExistsWarning" class="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div class="flex items-start space-x-2">
              <svg class="h-5 w-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              <p class="text-sm text-yellow-800">
                Ya existe un establecimiento con este {{ isEducationalType ? 'RBD' : 'RUT' }}. Verifica los datos.
              </p>
            </div>
          </div>
        </div>

        <div class="col-span-2">
          <FormKit
            type="text"
            name="address"
            label="Dirección (Calle)"
            placeholder="Ej: Av. Libertador Bernardo O'Higgins"
            validation="required|length:3,255"
            :validation-messages="{
              required: 'La dirección es obligatoria',
              length: 'Debe tener entre 3 y 255 caracteres'
            }"
          />
        </div>

        <div class="col-span-1">
          <FormKit
            type="text"
            name="street_number"
            label="Número"
            placeholder="Ej: 1234"
            validation="length:0,20"
          />
        </div>

        <div class="col-span-full md:col-span-1">
          <FormKit
            type="select"
            name="region"
            label="Región"
            :options="regionOptions"
            validation="required"
            :validation-messages="{
              required: 'La región es obligatoria'
            }"
            :disabled="loading.regions"
            @input="handleRegionChange"
          />
        </div>

        <div class="col-span-full md:col-span-1">
          <FormKit
            type="select"
            name="commune"
            label="Comuna"
            :options="communeOptions"
            validation="required"
            :validation-messages="{
              required: 'La comuna es obligatoria'
            }"
            :disabled="!formData.region || loading.communes"
          />
        </div>

        <div class="col-span-full md:col-span-1">
          <FormKit
            type="text"
            name="phone"
            label="Teléfono (Opcional)"
            placeholder="Ej: +56912345678"
          />
        </div>

        <div class="col-span-full md:col-span-1">
          <FormKit
            type="email"
            name="email"
            label="Email (Opcional)"
            placeholder="Ej: contacto@escuela.cl"
            validation="email"
          />
        </div>

        <div v-if="saveError" class="col-span-full">
          <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-start space-x-2">
              <svg class="h-5 w-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
              <div class="flex-1">
                <p class="text-sm font-medium text-red-800">Error al guardar</p>
                <p class="text-sm text-red-700 mt-1">{{ saveError }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-span-full mt-6">
          <button
            type="button"
            @click="handleSubmit"
            :disabled="isSaving || !isFormValid"
            class="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium transition-all hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <svg v-if="isSaving" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>{{ isSaving ? 'Guardando...' : 'Guardar Establecimiento' }}</span>
          </button>

          <p class="mt-2 text-xs text-gray-500 text-center">
            Al guardar, el establecimiento quedará disponible y será seleccionado automáticamente
          </p>
        </div>

      </div>
    </FormKit>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { debounce } from 'lodash-es'
import * as nneService from '@/services/nneService'
import type { SelectOption, Establishment } from '@/type/nne'
import { useFormDraft } from '@/composables/useFormDraft'
// ✅ IMPORTAR SWEETALERT2
import Swal from 'sweetalert2'

// ============================================================================
// INTERFACES
// ============================================================================

interface EstablishmentType {
  id: number
  name: string
  description?: string
}

interface EstablishmentFormData {
  name?: string
  establishment_type?: number
  rbd?: string
  address?: string
  street_number?: string
  region?: number
  commune?: number
  phone?: string
  email?: string
}

interface ApiResponse {
  id?: number
  data?: Establishment
  message?: string
  [key: string]: any
}

// ============================================================================
// EMITS
// ============================================================================

interface Emits {
  (e: 'created', establishment: Establishment): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

// ============================================================================
// REACTIVE STATE & DRAFTS
// ============================================================================

const formData = ref<EstablishmentFormData>({})

/**
 * ✅ SISTEMA DE BORRADOR INDEPENDIENTE
 * Mantiene los datos del nuevo colegio a salvo de recargas.
 */
const {
  formData: draftData,
  clearAllDrafts,
  isRecovering,
  hasUnsavedChanges
} = useFormDraft({
  formId: 'new-establishment-inline-draft',
  autoSave: true,
  autoSaveDelay: 1000
})

// Opciones de selects
const establishmentTypeOptions = ref<SelectOption[]>([
  { value: 0, label: 'Selecciona un tipo' }
])
const regionOptions = ref<SelectOption[]>([
  { value: 0, label: 'Selecciona una región' }
])
const communeOptions = ref<SelectOption[]>([
  { value: 0, label: 'Selecciona una comuna' }
])

// Loading states
const loading = ref({
  establishmentTypes: false,
  regions: false,
  communes: false
})

// Save state
const isSaving = ref(false)
const saveError = ref('')

// Warnings
const rbdExistsWarning = ref(false)

// ============================================================================
// COMPUTED
// ============================================================================

/**
 * Determina si el tipo es educacional (requiere RBD)
 */
const isEducationalType = computed(() => {
  if (!formData.value.establishment_type) return false
  
  const selectedType = establishmentTypeOptions.value.find(
    opt => opt.value === formData.value.establishment_type
  )
  
  if (!selectedType) return false
  
  const typeName = selectedType.label.toLowerCase()
  return typeName.includes('escuela') || 
         typeName.includes('liceo') || 
         typeName.includes('colegio') ||
         typeName.includes('jardín') ||
         typeName.includes('jardín infantil')
})

const rbdFieldLabel = computed(() => isEducationalType.value ? 'RBD (Rol Base de Datos)' : 'RUT de la Entidad')
const rbdFieldPlaceholder = computed(() => isEducationalType.value ? 'Ej: 12345-6' : 'Ej: 76.123.456-7')
const rbdFieldValidation = computed(() => isEducationalType.value ? 'required' : '')
const rbdFieldRequired = computed(() => isEducationalType.value ? 'El RBD es obligatorio para establecimientos educacionales' : 'El RUT es opcional')
const rbdFieldHelp = computed(() => isEducationalType.value 
  ? 'Código RBD único del establecimiento educacional (Ej: 12345-6)' 
  : 'RUT de la empresa, hospital, fundación o entidad (Ej: 76.123.456-7). Opcional.')

/**
 * Valida si el formulario está completo
 */
const isFormValid = computed(() => {
  const requiredFields = [
    formData.value.name,
    formData.value.establishment_type,
    formData.value.address,
    formData.value.region,
    formData.value.commune
  ]
  
  const allRequiredFilled = requiredFields.every(field => field)
  
  if (isEducationalType.value && !formData.value.rbd) {
    return false
  }
  
  return allRequiredFilled
})

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Obtiene el nombre del tipo de establecimiento
 */
const getEstablishmentTypeName = (typeId: number): string => {
  const type = establishmentTypeOptions.value.find(opt => opt.value === typeId)
  return type?.label || 'Establecimiento'
}

/**
 * Obtiene el nombre de la región
 */
const getRegionName = (regionId: number): string => {
  const region = regionOptions.value.find(opt => opt.value === regionId)
  return region?.label || ''
}

/**
 * Obtiene el nombre de la comuna
 */
const getCommuneName = (communeId: number): string => {
  const commune = communeOptions.value.find(opt => opt.value === communeId)
  return commune?.label || ''
}

// ============================================================================
// METHODS
// ============================================================================

const loadEstablishmentTypes = async () => {
  loading.value.establishmentTypes = true
  try {
    const types = await nneService.getEstablishmentTypesApi()
    establishmentTypeOptions.value = [
      { value: 0, label: 'Selecciona un tipo' },
      ...types.map((t: EstablishmentType) => ({ value: t.id, label: t.name }))
    ]
  } catch (error) {
    saveError.value = 'Error al cargar tipos de establecimiento'
  } finally {
    loading.value.establishmentTypes = false
  }
}

const loadRegions = async () => {
  loading.value.regions = true
  try {
    const regions = await nneService.getRegionsApi()
    regionOptions.value = [
      { value: 0, label: 'Selecciona una región' },
      ...regions
    ]
  } catch (error) {
    saveError.value = 'Error al cargar regiones'
  } finally {
    loading.value.regions = false
  }
}

const handleRegionChange = async (regionId: number | undefined) => {
  if (!regionId || regionId === 0) {
    communeOptions.value = [{ value: 0, label: 'Selecciona una comuna' }]
    formData.value.commune = undefined
    return
  }
  loading.value.communes = true
  try {
    const communes = await nneService.getCommunesByRegionApi(regionId)
    communeOptions.value = [{ value: 0, label: 'Selecciona una comuna' }, ...communes]
    formData.value.commune = undefined
  } catch (error) {
    communeOptions.value = [{ value: 0, label: 'Error al cargar comunas' }]
  } finally {
    loading.value.communes = false
  }
}

const checkRBDAvailability = debounce(async (rbd: string) => {
  if (!rbd || rbd.length < 4) {
    rbdExistsWarning.value = false
    return
  }
  try {
    const results = await nneService.searchEstablishmentsFullApi(rbd)
    rbdExistsWarning.value = results.some(e => e.rbd === rbd)
  } catch (error) {
    console.error('[CrearEstablecimiento] Error validando RBD:', error)
  }
}, 500)

/**
 * ✅✅✅ FUNCIÓN CORREGIDA - SOLUCIÓN AL ERROR DE ID TEMPORAL ✅✅✅
 * 
 * CAMBIO CRÍTICO: Ahora captura y usa el ID REAL del backend
 * en lugar de generar un ID temporal con Date.now()
 */
const handleSubmit = async () => {
  saveError.value = ''
  
  if (!isFormValid.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'Formulario Incompleto',
      text: 'Por favor completa todos los campos obligatorios antes de continuar.',
      confirmButtonColor: '#f59e0b'
    })
    return
  }
  
  isSaving.value = true
  
  try {
    const payload = {
      name: formData.value.name!,
      establishment_type: Number(formData.value.establishment_type!),
      rbd: formData.value.rbd || undefined,
      address: formData.value.address!,
      street_number: formData.value.street_number || undefined,
      region: Number(formData.value.region!),
      commune: Number(formData.value.commune!),
      phone: formData.value.phone || undefined,
      email: formData.value.email || undefined
    }
    
    console.log('📤 Enviando payload al backend:', payload)
    
    // ✅ CRÍTICO: Capturar la respuesta completa con el ID REAL
    const response = await nneService.createEstablishmentApi(payload) as ApiResponse
    
    console.log('✅ Respuesta completa del backend:', response)
    console.log('✅ Tipo de respuesta:', typeof response, Array.isArray(response) ? 'Array' : 'Object')
    
    // ✅ CRÍTICO: Extraer el ID REAL del backend
    // El backend puede retornar en diferentes formatos:
    // 1. { id: X, name: "...", ... }
    // 2. { message: "...", data: { id: X, ... } }
    let establishmentId: number
    
    if (response.data && response.data.id) {
      // Formato: { message: "...", data: { id: X, ... } }
      establishmentId = response.data.id
    } else if (response.id) {
      // Formato directo: { id: X, name: "...", ... }
      establishmentId = response.id
    } else {
      throw new Error('El backend no retornó un ID válido para el establecimiento')
    }
    
    console.log('🆔 ID REAL del establecimiento creado:', establishmentId)
    console.log('🆔 Tipo del ID:', typeof establishmentId)
    
    // ✅ Validar que el ID es un número válido
    if (!establishmentId || typeof establishmentId !== 'number' || establishmentId <= 0) {
      throw new Error(`ID inválido recibido del backend: ${establishmentId}`)
    }
    
    // ✅ LIMPIAR BORRADOR TÉCNICO AL TENER ÉXITO
    clearAllDrafts()
    
    // Construir dirección completa para mostrar
    const fullAddress = `${formData.value.address}${formData.value.street_number ? ' ' + formData.value.street_number : ''}, ${getCommuneName(formData.value.commune!)}, ${getRegionName(formData.value.region!)}`
    
    // ✅ SWEETALERT2: Notificación de éxito detallada
    await Swal.fire({
      icon: 'success',
      title: '¡Establecimiento Creado Exitosamente! 🎉',
      html: `
        <div style="text-align: left; padding: 1rem;">
          <p style="margin-bottom: 1rem;"><strong>El establecimiento ha sido registrado en el sistema:</strong></p>
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 0.5rem;">🆔 <strong>ID:</strong> ${establishmentId}</li>
            <li style="margin-bottom: 0.5rem;">🏫 <strong>Nombre:</strong> ${formData.value.name}</li>
            <li style="margin-bottom: 0.5rem;">📋 <strong>Tipo:</strong> ${getEstablishmentTypeName(formData.value.establishment_type!)}</li>
            ${formData.value.rbd ? `<li style="margin-bottom: 0.5rem;">🆔 <strong>${isEducationalType.value ? 'RBD' : 'RUT'}:</strong> ${formData.value.rbd}</li>` : ''}
            <li style="margin-bottom: 0.5rem;">📍 <strong>Dirección:</strong> ${fullAddress}</li>
            ${formData.value.phone ? `<li style="margin-bottom: 0.5rem;">📱 <strong>Teléfono:</strong> ${formData.value.phone}</li>` : ''}
            ${formData.value.email ? `<li style="margin-bottom: 0.5rem;">📧 <strong>Email:</strong> ${formData.value.email}</li>` : ''}
          </ul>
          <p style="margin-top: 1rem; color: #3b82f6; font-weight: 600; text-align: center; background: #dbeafe; padding: 0.75rem; border-radius: 6px;">
            ✅ El establecimiento ha sido seleccionado automáticamente
          </p>
        </div>
      `,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#3b82f6',
      timer: 6000,
      timerProgressBar: true,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      }
    })
    
    // ✅ CRÍTICO: Construir objeto con el ID REAL del backend, NO uno temporal
    const newEstablishment: Establishment = {
      id: establishmentId,  // ← ✅ ID REAL DEL BACKEND (no Date.now())
      name: payload.name,
      establishment_type: payload.establishment_type,
      rbd: payload.rbd || '',
      address: payload.address,
      street_number: payload.street_number || '',
      region: payload.region,
      commune: payload.commune,
      phone: payload.phone || '',
      email: payload.email || ''
    }
    
    console.log('✅ Establecimiento final con ID REAL:', newEstablishment)
    console.log('✅ Verificación final - ID:', newEstablishment.id, 'Tipo:', typeof newEstablishment.id)
    
    // ✅ CRÍTICO: Emitir evento con el establecimiento que contiene el ID REAL
    emit('created', newEstablishment)
    
    console.log('✅ Establecimiento emitido para asociación automática')
    
    // Limpiar formulario
    formData.value = {}
    
  } catch (error: any) {
    console.error('❌ Error al crear establecimiento:', error)
    console.error('❌ Error completo:', {
      message: error.message,
      response: error.response,
      stack: error.stack
    })
    
    const errorMessage = error.response?.data?.detail || 
                        error.response?.data?.message || 
                        error.message ||
                        'Error desconocido al guardar el establecimiento'
    
    // ✅ SWEETALERT2: Notificación de error
    await Swal.fire({
      icon: 'error',
      title: 'Error al Crear Establecimiento',
      html: `
        <div style="text-align: left;">
          <p style="margin-bottom: 1rem; color: #dc2626;">
            <strong>No se pudo completar la operación:</strong>
          </p>
          <p style="background: #fee2e2; padding: 1rem; border-radius: 6px; color: #991b1b;">
            ${errorMessage}
          </p>
        </div>
      `,
      confirmButtonColor: '#dc2626',
      footer: '<small>Si el problema persiste, contacte al administrador del sistema</small>'
    })
    
    saveError.value = errorMessage
    
  } finally {
    isSaving.value = false
  }
}

const handleCancel = () => {
  // ✅ OPCIONAL: Confirmar cancelación si hay cambios sin guardar
  if (hasUnsavedChanges.value) {
    Swal.fire({
      title: '¿Cancelar creación?',
      text: 'Tienes cambios sin guardar. ¿Estás seguro de que deseas volver?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Continuar editando'
    }).then((result) => {
      if (result.isConfirmed) {
        clearAllDrafts()
        emit('cancel')
      }
    })
  } else {
    emit('cancel')
  }
}

// ============================================================================
// WATCHERS & PERSISTENCE SYNC
// ============================================================================

// ✅ Sincronizar cambios locales hacia el borrador
watch(formData, (newVal) => {
  if (!isRecovering.value) {
    Object.assign(draftData.value, newVal)
  }
}, { deep: true })

watch(() => formData.value.rbd, (newRBD) => {
  if (newRBD) checkRBDAvailability(newRBD)
  else rbdExistsWarning.value = false
})

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  console.log('[CrearEstablecimiento] 🚀 Componente montado')
  
  // ✅ Recuperar datos del borrador si existen
  if (draftData.value && Object.keys(draftData.value).length > 0) {
    console.log('[CrearEstablecimiento] 🔄 Recuperando borrador técnico')
    Object.assign(formData.value, draftData.value)
    
    // Si había una región, cargar sus comunas
    if (formData.value.region) {
      handleRegionChange(formData.value.region)
    }
  }

  loadEstablishmentTypes()
  loadRegions()
})
</script>

<style scoped>
.crear-establecimiento { @apply w-full; }
.form-grid { @apply grid grid-cols-1 md:grid-cols-3 gap-6; }

/* ✅ ESTILOS PARA ANIMACIONES DE SWEETALERT2 */
:global(.swal2-popup) {
  font-family: inherit;
}

:global(.swal2-html-container ul) {
  text-align: left;
}

:global(.animate__animated) {
  animation-duration: 0.3s;
}
</style>