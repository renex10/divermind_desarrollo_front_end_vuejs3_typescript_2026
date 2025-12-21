<!-- src\components\forms\multi-step\pasos\Paso9Review.vue -->
<!--
  ✅ VERSIÓN CORREGIDA - Compatible con refactorización de Paso2
  
  CAMBIOS:
  1. ✅ Validación simplificada: solo requiere establishment
  2. ✅ Carga datos del establecimiento desde API
  3. ✅ Eliminados campos obsoletos (region, commune, street, street_number del formData)
  4. ✅ Muestra datos del establecimiento completo
-->
<template>
  <div class="step-review">
    <!-- Header del Paso -->
    <div class="step-header">
      <div class="step-number">9</div>
      <div class="step-title">
        <h2 class="text-2xl font-bold text-gray-900">Revisión Final</h2>
        <p class="text-gray-600 mt-1">Revise toda la información antes de registrar al niño/niña</p>
      </div>
    </div>

    <!-- Resumen General -->
    <div class="review-summary">
      <div class="summary-header">
        <DocumentCheckIcon class="h-6 w-6 text-blue-500" />
        <h3 class="summary-title">Resumen General del Registro</h3>
      </div>
      
      <div class="summary-stats">
        <div class="stat-card" v-for="stat in summaryStats" :key="stat.label">
          <div class="stat-icon" :class="stat.color">
            <component :is="stat.icon" class="h-5 w-5" />
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Secciones de Revisión -->
    <div class="review-sections">
      <!-- Datos Personales -->
      <ReviewSection
        title="Datos Personales"
        :isValid="isPersonalDataValid"
        :isOpen="openSection === 'personal'"
        @toggle="toggleSection('personal')"
      >
        <div class="review-content">
          <div class="data-grid">
            <DataField label="Nombres" :value="formData.first_name" />
            <DataField label="Apellidos" :value="formData.last_name" />
            <DataField label="RUT" :value="formData.rut || 'No especificado'" />
            <DataField label="Fecha de Nacimiento" :value="formatDate(formData.birth_date)" />
            <DataField label="Edad" :value="calculateAge(formData.birth_date) + ' años'" />
            <DataField label="Género" :value="formatGender(formData.gender)" />
          </div>
        </div>
      </ReviewSection>

      <!-- Ubicación -->
      <ReviewSection
        title="Ubicación y Establecimiento"
        :isValid="isLocationDataValid"
        :isOpen="openSection === 'location'"
        @toggle="toggleSection('location')"
      >
        <div class="review-content">
          <!-- ✅ Loading State -->
          <div v-if="loadingEstablishment" class="text-center py-4">
            <div class="inline-flex items-center space-x-2 text-gray-600">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Cargando datos del establecimiento...</span>
            </div>
          </div>
          
          <!-- ✅ Datos del Establecimiento -->
          <div v-else class="data-grid">
            <DataField 
              label="Establecimiento" 
              :value="establishmentData?.name || 'No especificado'" 
            />
            <DataField 
              label="Tipo" 
              :value="establishmentData?.establishment_type_detail?.name || 'No especificado'" 
            />
            <DataField 
              label="RBD" 
              :value="establishmentData?.rbd || 'No aplica'" 
            />
            <DataField 
              label="Dirección Completa" 
              :value="establishmentData?.full_address || formatEstablishmentAddress()" 
              class="col-span-2"
            />
            <DataField 
              label="Región" 
              :value="establishmentData?.region_detail?.name || 'No especificado'" 
            />
            <DataField 
              label="Comuna" 
              :value="establishmentData?.commune_detail?.name || 'No especificado'" 
            />
          </div>
        </div>
      </ReviewSection>

      <!-- Información Escolar -->
      <ReviewSection
        title="Información Escolar"
        :isValid="isSchoolDataValid"
        :isOpen="openSection === 'school'"
        @toggle="toggleSection('school')"
      >
        <div class="review-content">
          <div class="data-grid">
            <DataField label="Curso/Nivel Actual" :value="formData.current_grade" />
            <DataField label="Jornada Escolar" :value="formatSchoolJourney(formData.school_journey)" />
            <DataField 
              label="Notas de Adaptación" 
              :value="formData.adaptation_notes || 'Sin observaciones'" 
              class="col-span-2"
            />
          </div>
        </div>
      </ReviewSection>

      <!-- Perfil Médico -->
      <ReviewSection
        title="Perfil Médico y Diagnósticos"
        :isValid="isMedicalDataValid"
        :isOpen="openSection === 'medical'"
        @toggle="toggleSection('medical')"
      >
        <div class="review-content">
          <div class="data-grid">
            <DataField label="Necesidades Especiales" :value="formData.has_special_needs ? 'Sí' : 'No'" />
            <DataField 
              v-if="formData.has_special_needs" 
              label="Tipo" 
              :value="formatSpecialNeedsType(formData.special_needs_type)" 
            />
            <DataField label="Nivel de Autismo" :value="formatAutismLevel(formData.autism_level)" />
            <DataField label="Alergias" :value="formData.allergies || 'Ninguna'" />
            <DataField label="Medicación Actual" :value="formData.current_medication || 'Ninguna'" />
            <DataField label="Contacto de Emergencia" :value="formData.emergency_contact" />
            <DataField label="Teléfono de Emergencia" :value="formData.emergency_phone" />
            <DataField 
              label="Notas Médicas" 
              :value="formData.medical_notes || 'Sin observaciones'" 
              class="col-span-2"
            />
          </div>
        </div>
      </ReviewSection>

      <!-- Padres/Tutores -->
      <ReviewSection
        title="Padres y Tutores"
        :isValid="isParentsDataValid"
        :isOpen="openSection === 'parents'"
        @toggle="toggleSection('parents')"
      >
        <div class="review-content">
          <div v-if="formData.usuarios && formData.usuarios.length > 0" class="space-y-4">
            <div v-for="(parentId, index) in formData.usuarios" :key="parentId" class="parent-card">
              <div class="parent-header">
                <UserCircleIcon class="h-5 w-5 text-blue-500" />
                <span class="parent-label">Tutor {{ index + 1 }}</span>
              </div>
              <div class="parent-info">
                <span class="text-gray-700">ID: {{ parentId }}</span>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-6 text-gray-500">
            No se han agregado tutores
          </div>
        </div>
      </ReviewSection>

      <!-- Terapias Previas -->
      <ReviewSection
        title="Terapias y Antecedentes"
        :isValid="true"
        :isOpen="openSection === 'therapies'"
        @toggle="toggleSection('therapies')"
      >
        <div class="review-content">
          <div class="data-grid">
            <DataField label="Terapias Previas" :value="formData.has_previous_therapies ? 'Sí' : 'No'" />
            <DataField 
              v-if="formData.has_previous_therapies" 
              label="Detalle" 
              :value="formData.therapies_detail || 'Sin detalles'" 
              class="col-span-2"
            />
            <DataField label="Referido Por" :value="formData.referred_by || 'No especificado'" />
            <DataField 
              v-if="formData.referred_by" 
              label="Detalle de Referencia" 
              :value="formData.referred_by_detail || 'Sin detalles'" 
            />
            <DataField 
              label="Atención Previa En" 
              :value="formData.attended_where || 'No especificado'" 
            />
          </div>
        </div>
      </ReviewSection>

      <!-- Consentimiento -->
      <ReviewSection
        title="Consentimiento y Autorización"
        :isValid="isConsentDataValid"
        :isOpen="openSection === 'consent'"
        @toggle="toggleSection('consent')"
      >
        <div class="review-content">
          <div class="data-grid">
            <DataField 
              label="Consentimiento del Tutor" 
              :value="formData.guardian_consent ? '✓ Otorgado' : '✗ No otorgado'" 
            />
            <DataField 
              label="Fecha de Consentimiento" 
              :value="formatDate(formData.consent_date)" 
            />
          </div>
        </div>
      </ReviewSection>
    </div>

    <!-- Advertencias y Errores -->
    <div v-if="!isAllDataValid" class="validation-alert">
      <div class="alert-header">
        <ExclamationTriangleIcon class="h-6 w-6 text-red-500" />
        <span class="alert-title">Revisión necesaria</span>
      </div>
      <p class="alert-message">Hay algunos problemas que deben ser corregidos antes de continuar.</p>
      <div class="alert-details">
        <p class="font-medium text-gray-700 mb-2">Problemas encontrados:</p>
        <ul class="space-y-1 text-sm text-gray-600">
          <li v-if="!isPersonalDataValid">❌ Datos personales incompletos</li>
          <li v-if="!isLocationDataValid">❌ Información de ubicación incompleta (establecimiento)</li>
          <li v-if="!isSchoolDataValid">❌ Información escolar incompleta</li>
          <li v-if="!isMedicalDataValid">❌ Información médica incompleta</li>
          <li v-if="!isParentsDataValid">❌ Debe agregar al menos un tutor</li>
          <li v-if="!isConsentDataValid">❌ Falta consentimiento del tutor</li>
        </ul>
      </div>
      <p class="alert-footer">⚠ Corrija los problemas antes de continuar</p>
    </div>

    <!-- Confirmación -->
    <div v-else class="validation-success">
      <div class="success-content">
        <CheckCircleIcon class="h-8 w-8 text-green-500" />
        <div class="success-text">
          <p class="success-title">Todo está correcto</p>
          <p class="success-message">La información ha sido revisada y está completa</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { DocumentCheckIcon, CheckCircleIcon, ExclamationTriangleIcon, UserCircleIcon } from '@heroicons/vue/24/outline'
import ReviewSection from '../components/ReviewSection.vue'
import DataField from '../components/DataField.vue'
import * as nneService from '@/services/nneService'
import type { Establishment } from '@/type/nne'

// ============================================================================
// INTERFACES
// ============================================================================

interface FormDataProps {
  first_name: string
  last_name: string
  rut: string
  birth_date: string
  gender: string
  establishment: number  // ✅ Solo ID, no region/commune/street separados
  current_grade: string
  school_journey: string
  adaptation_notes: string
  allergies: string
  current_medication: string
  emergency_contact: string
  emergency_phone: string
  medical_notes: string
  has_special_needs: boolean
  special_needs_type: string
  autism_level: string
  has_previous_therapies: boolean
  therapies_detail: string
  referred_by: string
  referred_by_detail: string
  attended_where: any
  guardian_consent: boolean
  consent_date: string
  usuarios: number[]
  pie_diagnosis?: string
  pie_entry_date?: string | null
  pie_status?: string
}

interface Props {
  formData: FormDataProps
}

interface Emits {
  (e: 'validate', isValid: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// ============================================================================
// STATE
// ============================================================================

const openSection = ref<string>('personal')

// ✅ NUEVO: Estado para cargar datos del establecimiento
const loadingEstablishment = ref(false)
const establishmentData = ref<Establishment | null>(null)

// ============================================================================
// METHODS
// ============================================================================

/**
 * ✅ NUEVO: Cargar datos del establecimiento desde la API
 */
const loadEstablishmentData = async () => {
  if (!props.formData.establishment) {
    establishmentData.value = null
    return
  }

  loadingEstablishment.value = true
  
  try {
    const establishment = await nneService.getEstablishmentDetailApi(props.formData.establishment)
    establishmentData.value = establishment
    console.log('[Paso9Review] ✅ Establecimiento cargado:', establishment)
  } catch (error) {
    console.error('[Paso9Review] ❌ Error cargando establecimiento:', error)
    establishmentData.value = null
  } finally {
    loadingEstablishment.value = false
  }
}

/**
 * ✅ NUEVO: Formatear dirección del establecimiento
 */
const formatEstablishmentAddress = (): string => {
  if (!establishmentData.value) return 'No especificado'
  
  const est = establishmentData.value
  const parts = []
  
  if (est.address) parts.push(est.address)
  if (est.street_number) parts.push(est.street_number)
  if (est.commune_detail?.name) parts.push(est.commune_detail.name)
  if (est.region_detail?.name) parts.push(est.region_detail.name)
  
  return parts.length > 0 ? parts.join(', ') : 'No especificado'
}

const toggleSection = (section: string) => {
  openSection.value = openSection.value === section ? '' : section
}

const formatDate = (date: string): string => {
  if (!date) return 'No especificado'
  const d = new Date(date)
  return d.toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' })
}

const formatGender = (gender: string): string => {
  const genders: Record<string, string> = {
    'M': 'Masculino',
    'F': 'Femenino',
    'O': 'Otro',
    'male': 'Masculino',
    'female': 'Femenino',
    'other': 'Otro'
  }
  return genders[gender] || gender || 'No especificado'
}

const formatSchoolJourney = (journey: string): string => {
  const journeys: Record<string, string> = {
    'morning': 'Mañana',
    'afternoon': 'Tarde',
    'full': 'Completa'
  }
  return journeys[journey] || journey || 'No especificado'
}

const formatSpecialNeedsType = (type: string): string => {
  const types: Record<string, string> = {
    'autism': 'Autismo',
    'adhd': 'TDAH',
    'dyslexia': 'Dislexia',
    'other': 'Otro'
  }
  return types[type] || type || 'No especificado'
}

const formatAutismLevel = (level: string): string => {
  const levels: Record<string, string> = {
    'level_1': 'Nivel 1 (Apoyo)',
    'level_2': 'Nivel 2 (Apoyo Sustancial)',
    'level_3': 'Nivel 3 (Apoyo Muy Sustancial)',
    'no_review': 'Sin evaluación'
  }
  return levels[level] || 'Sin evaluación'
}

const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 0
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

// ============================================================================
// COMPUTED
// ============================================================================

const isPersonalDataValid = computed((): boolean => {
  return !!(props.formData.first_name?.trim() && 
         props.formData.last_name?.trim() && 
         props.formData.rut?.trim() && 
         props.formData.birth_date && 
         props.formData.gender)
})

/**
 * ✅ CORREGIDO: Validación simplificada
 * Solo requiere que exista establishment (ID)
 * Ya NO requiere region, commune, street, street_number
 */
const isLocationDataValid = computed((): boolean => {
  return !!props.formData.establishment
})

const isSchoolDataValid = computed((): boolean => {
  return !!(props.formData.current_grade && 
         props.formData.school_journey)
})

const isMedicalDataValid = computed((): boolean => {
  return !!(props.formData.emergency_contact?.trim() && 
         props.formData.emergency_phone?.trim())
})

const isParentsDataValid = computed((): boolean => {
  return !!(props.formData.usuarios && 
         Array.isArray(props.formData.usuarios) && 
         props.formData.usuarios.length > 0)
})

/**
 * ✅ CORREGIDO: Validación de consentimiento flexible
 * Acepta tanto booleano true como el string "true" del FormKit
 */
const isConsentDataValid = computed((): boolean => {
  const consent = props.formData.guardian_consent
  // Comprobamos si es el booleano true O si es el string "true"
  return consent === true || String(consent) === 'true'
})

const isAllDataValid = computed((): boolean => {
  return isPersonalDataValid.value &&
         isLocationDataValid.value &&
         isSchoolDataValid.value &&
         isMedicalDataValid.value &&
         isParentsDataValid.value &&
         isConsentDataValid.value
})

const summaryStats = computed(() => [
  {
    icon: 'UserCircleIcon',
    label: 'Datos Personales',
    value: isPersonalDataValid.value ? '✓' : '✗',
    color: isPersonalDataValid.value ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
  },
  {
    icon: 'MapPinIcon',
    label: 'Ubicación',
    value: isLocationDataValid.value ? '✓' : '✗',
    color: isLocationDataValid.value ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
  },
  {
    icon: 'AcademicCapIcon',
    label: 'Info. Escolar',
    value: isSchoolDataValid.value ? '✓' : '✗',
    color: isSchoolDataValid.value ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
  },
  {
    icon: 'HeartIcon',
    label: 'Salud',
    value: isMedicalDataValid.value ? '✓' : '✗',
    color: isMedicalDataValid.value ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
  },
  {
    icon: 'UsersIcon',
    label: 'Tutores',
    value: props.formData.usuarios?.length || 0,
    color: isParentsDataValid.value ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
  },
{
  icon: 'ShieldCheckIcon',
  label: 'Consentimiento',
  value: isConsentDataValid.value ? '✓' : '✗', // Usa la validación corregida
  color: isConsentDataValid.value ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
}
])

// ============================================================================
// WATCHERS
// ============================================================================

watch(() => isAllDataValid.value, (isValid) => {
  emit('validate', isValid)
}, { immediate: true })

// ✅ NUEVO: Cargar datos del establecimiento cuando cambia el ID
watch(() => props.formData.establishment, (newEstId) => {
  if (newEstId) {
    loadEstablishmentData()
  } else {
    establishmentData.value = null
  }
}, { immediate: true })

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  console.log('[Paso9Review] 🚀 Componente montado')
  console.log('[Paso9Review] 📊 FormData:', props.formData)
  
  // Cargar datos del establecimiento si existe
  if (props.formData.establishment) {
    loadEstablishmentData()
  }
})
</script>

<style scoped>
.step-review {
  @apply max-w-5xl mx-auto;
}

.step-header {
  @apply flex items-start space-x-4 mb-8;
}

.step-number {
  @apply flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg;
}

.review-summary {
  @apply bg-white rounded-lg shadow-md p-6 mb-6;
}

.summary-header {
  @apply flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200;
}

.summary-title {
  @apply text-lg font-semibold text-gray-900;
}

.summary-stats {
  @apply grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4;
}

.stat-card {
  @apply flex items-center space-x-3 p-3 bg-gray-50 rounded-lg;
}

.stat-icon {
  @apply w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0;
}

.stat-content {
  @apply flex flex-col;
}

.stat-value {
  @apply text-xl font-bold;
}

.stat-label {
  @apply text-xs text-gray-600;
}

.review-sections {
  @apply space-y-4;
}

.review-content {
  @apply p-6;
}

.data-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.parent-card {
  @apply border border-gray-200 rounded-lg p-4;
}

.parent-header {
  @apply flex items-center space-x-2 mb-2;
}

.parent-label {
  @apply font-medium text-gray-700;
}

.parent-info {
  @apply text-sm text-gray-600;
}

.validation-alert {
  @apply mt-6 bg-red-50 border-2 border-red-200 rounded-lg p-6;
}

.alert-header {
  @apply flex items-center space-x-2 mb-3;
}

.alert-title {
  @apply text-lg font-semibold text-red-900;
}

.alert-message {
  @apply text-red-700 mb-4;
}

.alert-details {
  @apply bg-white rounded-lg p-4 mb-4;
}

.alert-footer {
  @apply text-sm text-red-600 font-medium;
}

.validation-success {
  @apply mt-6 bg-green-50 border-2 border-green-200 rounded-lg p-6;
}

.success-content {
  @apply flex items-center space-x-4;
}

.success-text {
  @apply flex flex-col;
}

.success-title {
  @apply text-lg font-semibold text-green-900;
}

.success-message {
  @apply text-green-700;
}
</style>