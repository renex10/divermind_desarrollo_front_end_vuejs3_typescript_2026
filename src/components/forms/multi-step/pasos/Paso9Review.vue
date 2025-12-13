<!-- src\components\forms\multi-step\pasos\Paso9Review.vue CORREGIDO -->
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
          <div class="data-grid">
            <DataField label="Establecimiento" :value="getEstablishmentName(formData.establishment)" />
            <DataField label="Región" :value="getRegionName(formData.region)" />
            <DataField label="Comuna" :value="getCommuneName(formData.commune)" />
            <DataField label="Dirección" :value="formatAddress(formData.street, formData.street_number)" />
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
              label="Observaciones de Adaptación" 
              :value="formData.adaptation_notes || 'No especificadas'" 
              :isLong="true"
            />
          </div>
        </div>
      </ReviewSection>

      <!-- Perfil Médico -->
      <ReviewSection
        title="Perfil Médico"
        :isValid="isMedicalDataValid"
        :isOpen="openSection === 'medical'"
        @toggle="toggleSection('medical')"
      >
        <div class="review-content">
          <div class="data-grid">
            <DataField label="Alergias" :value="formData.allergies || 'Ninguna registrada'" :isLong="true" />
            <DataField label="Medicación Actual" :value="formData.current_medication || 'Ninguna registrada'" :isLong="true" />
            <DataField label="Contacto de Emergencia" :value="formData.emergency_contact" />
            <DataField label="Teléfono de Emergencia" :value="formatPhone(formData.emergency_phone)" />
            <DataField label="Observaciones Médicas" :value="formData.medical_notes || 'No especificadas'" :isLong="true" />
          </div>
        </div>
      </ReviewSection>

      <!-- Necesidades Especiales -->
      <ReviewSection
        title="Necesidades Especiales"
        :isValid="isSpecialNeedsDataValid"
        :isOpen="openSection === 'special_needs'"
        @toggle="toggleSection('special_needs')"
      >
        <div class="review-content">
          <div class="data-grid">
            <DataField 
              label="¿Presenta NEE?" 
              :value="formatBoolean(formData.has_special_needs)" 
            />
            <DataField 
              v-if="formData.has_special_needs"
              label="Tipo de NEE" 
              :value="formatSpecialNeedsType(formData.special_needs_type)" 
            />
            <DataField 
              label="Nivel de Autismo" 
              :value="formatAutismLevel(formData.autism_level)" 
            />
          </div>
        </div>
      </ReviewSection>

      <!-- Historial de Terapias -->
      <ReviewSection
        title="Historial de Terapias"
        :isValid="isTherapyDataValid"
        :isOpen="openSection === 'therapy'"
        @toggle="toggleSection('therapy')"
      >
        <div class="review-content">
          <div class="data-grid">
            <DataField 
              label="¿Terapias Previas?" 
              :value="formatBoolean(formData.has_previous_therapies)" 
            />
            <DataField 
              v-if="formData.has_previous_therapies"
              label="Detalle de Terapias" 
              :value="formData.therapies_detail" 
              :isLong="true"
            />
            <DataField label="¿Quién derivó?" :value="formatReferredBy(formData.referred_by)" />
            <DataField 
              v-if="formData.referred_by_detail"
              label="Detalle de Derivación" 
              :value="formData.referred_by_detail" 
            />
            <DataField 
              label="Establecimiento Anterior" 
              :value="getEstablishmentName(formData.attended_where) || 'No especificado'" 
            />
          </div>
        </div>
      </ReviewSection>

      <!-- Consentimiento -->
      <ReviewSection
        title="Consentimiento del Apoderado"
        :isValid="isGuardianDataValid"
        :isOpen="openSection === 'guardian'"
        @toggle="toggleSection('guardian')"
      >
        <div class="review-content">
          <div class="data-grid">
            <DataField 
              label="Consentimiento Otorgado" 
              :value="formatBoolean(formData.guardian_consent)" 
            />
            <DataField 
              v-if="formData.guardian_consent"
              label="Fecha de Consentimiento" 
              :value="formatDate(formData.consent_date)" 
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
          <div class="parents-list">
            <div 
              v-for="parent in selectedParents" 
              :key="parent.id"
              class="parent-review-card"
            >
              <UserCircleIcon class="h-8 w-8 text-gray-400" />
              <div class="parent-info">
                <span class="parent-name">{{ parent.fullName }}</span>
                <span class="parent-details">{{ parent.rut }} • {{ parent.email }}</span>
                <span v-if="parent.phone" class="parent-phone">{{ parent.phone }}</span>
              </div>
            </div>
            <div v-if="selectedParents.length === 0" class="no-parents">
              <ExclamationTriangleIcon class="h-5 w-5 text-yellow-500" />
              <span>No se han seleccionado padres/tutores</span>
            </div>
          </div>
        </div>
      </ReviewSection>
    </div>

    <!-- Validación Final -->
    <div class="final-validation" :class="validationStatus.class">
      <div class="validation-header">
        <component :is="validationStatus.icon" class="h-6 w-6" />
        <h3 class="validation-title">{{ validationStatus.title }}</h3>
      </div>
      <p class="validation-message">{{ validationStatus.message }}</p>
      
      <div v-if="!isAllDataValid" class="validation-issues">
        <h4 class="issues-title">Problemas encontrados:</h4>
        <ul class="issues-list">
          <li v-if="!isPersonalDataValid">❌ Datos personales incompletos (nombre, apellido, fecha nacimiento)</li>
          <li v-if="!isLocationDataValid">❌ Información de ubicación incompleta (establecimiento, dirección)</li>
          <li v-if="!isSchoolDataValid">❌ Información escolar incompleta (curso/nivel actual)</li>
          <li v-if="!isMedicalDataValid">❌ Perfil médico incompleto (contacto y teléfono de emergencia)</li>
          <li v-if="!isSpecialNeedsDataValid">❌ Necesidades especiales incompletas (tipo de NEE requerido)</li>
          <li v-if="!isTherapyDataValid">❌ Historial de terapias incompleto (detalle de terapias requerido)</li>
          <li v-if="!isGuardianDataValid">❌ Consentimiento incompleto (fecha de consentimiento requerida)</li>
          <li v-if="!isParentsDataValid">❌ Padres/tutores no asignados (mínimo 1 requerido)</li>
        </ul>
      </div>
    </div>

    <!-- Información de Validación -->
    <div class="validation-info" :class="{ 'is-valid': isStepValid }">
      <div class="validation-icon">
        <CheckCircleIcon v-if="isStepValid" class="h-5 w-5" />
        <ExclamationCircleIcon v-else class="h-5 w-5" />
      </div>
      <div class="validation-text">
        <span v-if="isStepValid">✓ Todo listo para registrar al niño/niña</span>
        <span v-else>⚠ Corrija los problemas antes de continuar</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  DocumentCheckIcon,
  UserCircleIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentCheckIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

// Components
import ReviewSection from '../components/ReviewSection.vue'
import DataField from '../components/DataField.vue'

// Props y Emits
interface Parent {
  id: number
  fullName: string
  rut: string
  email: string
  phone?: string
}

interface Props {
  formData: {
    first_name: string
    last_name: string
    rut: string
    birth_date: string
    gender: string
    establishment: any
    region: any
    commune: any
    street: string
    street_number: string
    current_grade: string
    school_journey: string
    adaptation_notes: string
    allergies: string
    current_medication: string
    emergency_contact: string
    emergency_phone: string
    medical_notes: string
    has_special_needs: boolean  // ✅ CORREGIDO: boolean en lugar de string
    special_needs_type: string
    autism_level: string
    has_previous_therapies: boolean  // ✅ CORREGIDO: boolean en lugar de string
    therapies_detail: string
    referred_by: string
    referred_by_detail: string
    attended_where: any
    guardian_consent: boolean  // ✅ CORREGIDO: boolean en lugar de string
    consent_date: string
    usuarios: number[]
  }
}

interface Emits {
  (e: 'update:formData', data: Props['formData']): void
  (e: 'validate', isValid: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Estado local para secciones abiertas
const openSection = ref<string>('personal')

// Datos simulados de padres
const availableParents = ref<Parent[]>([
  {
    id: 10,
    fullName: 'Carlos Ramírez Torres',
    rut: '12.345.678-9',
    email: 'carlos.ramirez@email.com',
    phone: '+56 9 3333 4444'
  },
  {
    id: 11,
    fullName: 'María González López',
    rut: '23.456.789-0',
    email: 'maria.gonzalez@email.com',
    phone: '+56 9 5555 6666'
  }
])

// ✅ NUEVA FUNCIÓN: Formatear booleanos para display
const formatBoolean = (value: boolean | string): string => {
  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No'
  }
  // Backward compatibility con strings
  if (value === 'true') return 'Sí'
  if (value === 'false') return 'No'
  return 'No especificado'
}

// ✅ NUEVA FUNCIÓN: Convertir string a boolean para validación
const toBoolean = (value: boolean | string): boolean => {
  if (typeof value === 'boolean') return value
  return value === 'true'
}

// Funciones de formato (mantenidas)
const formatDate = (date: string) => {
  if (!date) return 'No especificada'
  return new Date(date).toLocaleDateString('es-CL')
}

const calculateAge = (birthDate: string) => {
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

const formatGender = (gender: string) => {
  const genders: Record<string, string> = {
    male: 'Masculino',
    female: 'Femenino',
    other: 'Otro',
    unspecified: 'No especifica'
  }
  return genders[gender] || 'No especificado'
}

const formatSchoolJourney = (journey: string) => {
  const journeys: Record<string, string> = {
    morning: 'Jornada Mañana',
    afternoon: 'Jornada Tarde',
    full_time: 'Jornada Completa',
    extended: 'Jornada Extendida'
  }
  return journeys[journey] || 'No especificada'
}

const formatSpecialNeedsType = (type: string) => {
  const types: Record<string, string> = {
    permanent: 'Permanente',
    temporary: 'Transitoria',
    none: 'No aplica'
  }
  return types[type] || 'No especificado'
}

const formatAutismLevel = (level: string) => {
  const levels: Record<string, string> = {
    no_review: 'Sin revisión',
    level_1: 'Nivel 1 - Requiere apoyo',
    level_2: 'Nivel 2 - Requiere apoyo sustancial',
    level_3: 'Nivel 3 - Requiere apoyo muy sustancial',
    not_applicable: 'No aplica',
    none: 'No aplica'
  }
  return levels[level] || 'No especificado'
}

const formatReferredBy = (referred: string) => {
  const referredBy: Record<string, string> = {
    school: 'Establecimiento Educacional',
    doctor: 'Médico',
    specialist: 'Especialista',
    family: 'Familia',
    other: 'Otro',
    none: 'No aplica'
  }
  return referredBy[referred] || 'No especificado'
}

const formatPhone = (phone: string) => {
  if (!phone) return 'No especificado'
  return phone
}

const formatAddress = (street: string, number: string) => {
  if (!street && !number) return 'No especificada'
  return `${street || ''} ${number ? '#' + number : ''}`.trim()
}

// Funciones para obtener nombres (simuladas)
const getEstablishmentName = (id: any) => {
  const establishments: Record<string, string> = {
    '4': 'Colegio Los Alerces',
    '3': 'Centro de Terapia Norte'
  }
  return establishments[id] || 'No especificado'
}

const getRegionName = (id: any) => {
  const regions: Record<string, string> = {
    '7': 'Región Metropolitana'
  }
  return regions[id] || 'No especificado'
}

const getCommuneName = (id: any) => {
  const communes: Record<string, string> = {
    '8': 'Santiago'
  }
  return communes[id] || 'No especificado'
}

// ✅ VALIDACIONES CORREGIDAS - ALINEADAS CON BACKEND
const isPersonalDataValid = computed((): boolean => {
  return !!(props.formData.first_name?.trim() && 
         props.formData.last_name?.trim() && 
         props.formData.birth_date)
})

const isLocationDataValid = computed((): boolean => {
  return !!(props.formData.establishment && 
         props.formData.region && 
         props.formData.commune && 
         props.formData.street?.trim() && 
         props.formData.street_number?.trim())
})

const isSchoolDataValid = computed((): boolean => {
  return !!props.formData.current_grade?.trim()
})

const isMedicalDataValid = computed((): boolean => {
  return !!(props.formData.emergency_contact?.trim() && 
         props.formData.emergency_phone?.trim())
})

const isSpecialNeedsDataValid = computed((): boolean => {
  const hasNeeds = toBoolean(props.formData.has_special_needs)
  if (hasNeeds) {
    return !!(props.formData.special_needs_type && 
             props.formData.special_needs_type !== 'none')
  }
  return true // Si no tiene NEE, es válido
})

const isTherapyDataValid = computed((): boolean => {
  const hasTherapies = toBoolean(props.formData.has_previous_therapies)
  if (hasTherapies) {
    return !!(props.formData.therapies_detail?.trim())
  }
  return true // Si no tiene terapias previas, es válido
})

const isGuardianDataValid = computed((): boolean => {
  const hasConsent = toBoolean(props.formData.guardian_consent)
  if (hasConsent) {
    return !!props.formData.consent_date
  }
  return true // Si no hay consentimiento, es válido (pero revisar requisitos legales)
})

const isParentsDataValid = computed(() => {
  return props.formData.usuarios && props.formData.usuarios.length > 0
})

// Validación general - ALINEADA CON BACKEND
const isAllDataValid = computed(() => {
  return isPersonalDataValid.value &&
         isLocationDataValid.value &&
         isSchoolDataValid.value &&
         isMedicalDataValid.value &&
         isSpecialNeedsDataValid.value &&
         isTherapyDataValid.value &&
         isGuardianDataValid.value &&
         isParentsDataValid.value
})

// Padres seleccionados
const selectedParents = computed(() => {
  return availableParents.value.filter(parent => 
    props.formData.usuarios?.includes(parent.id)
  )
})

// Estadísticas del resumen
const summaryStats = computed(() => [
  {
    icon: UserCircleIcon,
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
    label: 'Escolar',
    value: isSchoolDataValid.value ? '✓' : '✗',
    color: isSchoolDataValid.value ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
  },
  {
    icon: 'HeartIcon',
    label: 'Médico',
    value: isMedicalDataValid.value ? '✓' : '✗',
    color: isMedicalDataValid.value ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
  },
  {
    icon: 'ClipboardDocumentCheckIcon',
    label: 'Consentimiento',
    value: isGuardianDataValid.value ? '✓' : '✗',
    color: isGuardianDataValid.value ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
  }
])

// Estado de validación
const validationStatus = computed(() => {
  if (isAllDataValid.value) {
    return {
      icon: ClipboardDocumentCheckIcon,
      title: '¡Todo listo!',
      message: 'Todos los datos han sido completados correctamente. Puede proceder con el registro.',
      class: 'status-valid'
    }
  } else {
    return {
      icon: XCircleIcon,
      title: 'Revisión necesaria',
      message: 'Hay algunos problemas que deben ser corregidos antes de continuar.',
      class: 'status-invalid'
    }
  }
})

// Validez del paso
const isStepValid = computed(() => {
  return isAllDataValid.value
})

// Métodos
const toggleSection = (section: string) => {
  openSection.value = openSection.value === section ? '' : section
}

// Método para validación externa
const validate = () => {
  const isValid = isStepValid.value
  emit('validate', isValid)
  return isValid
}

// Inicialización
onMounted(() => {
  openSection.value = 'personal'
  setTimeout(() => {
    emit('validate', isStepValid.value)
  }, 100)
})

// Exponer el método validate al componente padre
defineExpose({
  validate
})
</script>

<!-- Los estilos se mantienen igual -->