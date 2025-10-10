<!-- src/components/forms/multi-step/components/CrearNuevoPadre.vue -->
<template>
  <div class="form-section">
    <h4>➕ Crear Nuevo Padre/Tutor</h4>
    
    <button
      type="button"
      class="btn btn-outline"
      @click="toggleCreateForm"
    >
      {{ showCreateForm ? '❌ Cancelar Creación' : '👤 Crear Nuevo Padre' }}
    </button>

    <div v-if="showCreateForm" class="create-parent-form">
      <FormKit
        type="form"
        id="createParentForm"
        v-model="formData"
        :actions="false"
        @submit="createNewParent"
      >
        <div class="form-grid">
          <FormKit
            type="text"
            name="first_name"
            label="Nombres *"
            placeholder="Ej: María José"
            validation="required|length:2,50"
            validation-visibility="live"
            :validation-messages="{
              required: 'Los nombres son requeridos',
              length: 'Debe tener entre 2 y 50 caracteres'
            }"
          />

          <FormKit
            type="text"
            name="last_name"
            label="Apellidos *"
            placeholder="Ej: González Pérez"
            validation="required|length:2,50"
            validation-visibility="live"
            :validation-messages="{
              required: 'Los apellidos son requeridos',
              length: 'Debe tener entre 2 y 50 caracteres'
            }"
          />

          <!-- Campo RUT Mejorado -->
          <div class="formkit-outer">
            <label class="formkit-label" for="rut">
              RUT * 
              <button 
                v-if="rutValue && rutValidation?.isValid && !isCheckingAvailability"
                type="button" 
                @click="forceRutRecheck"
                class="recheck-btn"
                title="Volver a verificar disponibilidad"
              >
                🔄
              </button>
            </label>
            
            <input
              :value="rutValue"
              type="text"
              name="rut"
              placeholder="Ej: 12.345.678-9"
              class="formkit-input"
              :class="{
                'formkit-input-checking': rutStatus === 'checking',
                'formkit-input-error': rutStatus === 'error',
                'formkit-input-success': rutStatus === 'valid',
                'formkit-input-warning': rutStatus === 'duplicate',
                'formkit-input-partial': rutStatus === 'partial'
              }"
              @blur="onRutBlur"
              @input="onRutInput"
            />
            
            <div v-if="rutStatus === 'checking'" class="formkit-help formkit-help-checking">
              <div class="loading-spinner"></div>
              🔍 Verificando disponibilidad del RUT...
            </div>
            
            <div v-else-if="rutStatus === 'error'" class="formkit-messages">
              <div class="formkit-message">{{ rutErrorMessage }}</div>
            </div>
            
            <div v-else-if="rutStatus === 'valid'" class="formkit-help formkit-help-success">
              ✅ RUT válido y disponible para registro
            </div>
            
            <div v-else-if="rutStatus === 'duplicate'" class="formkit-help formkit-help-warning">
              ⚠️ El RUT ya está registrado en el sistema
              <button type="button" @click="forceRutRecheck" class="text-link">
                ¿Corregiste el RUT? Volver a verificar
              </button>
            </div>
            
            <div v-else-if="rutStatus === 'partial'" class="formkit-help formkit-help-partial">
              ✏️ Continúe escribiendo el RUT...
            </div>
            
            <div v-else class="formkit-help">
              Ingrese RUT con formato: 12.345.678-9
            </div>
          </div>

          <FormKit
            type="email"
            name="email"
            label="Email *"
            placeholder="padre@email.com"
            validation="required|email"
            validation-visibility="live"
            :validation-messages="{
              required: 'El email es requerido',
              email: 'Formato de email inválido'
            }"
            @blur="handleEmailBlur"
          />

          <FormKit
            type="text"
            name="username"
            label="Nombre de Usuario *"
            placeholder="Ej: maria.gonzalez"
            validation="required|length:3,30"
            validation-visibility="live"
            :validation-messages="{
              required: 'El nombre de usuario es requerido',
              length: 'Debe tener entre 3 y 30 caracteres'
            }"
          />

<FormKit
  type="tel"
  name="phone"
  label="Teléfono"
  placeholder="+56912345678 o 912345678"
  validation="phoneValidation"
  validation-visibility="live"
  :validation-messages="{
    matches: 'Formato de teléfono inválido'
  }"
  @blur="formatearTelefono"
/>

         

          <FormKit
            type="password"
            name="password"
            label="Contraseña *"
            placeholder="Ingrese una contraseña segura"
            validation="required|length:8,100"
            validation-visibility="live"
            :validation-messages="{
              required: 'La contraseña es requerida',
              length: 'La contraseña debe tener al menos 8 caracteres'
            }"
          />

          <FormKit
            type="password"
            name="password_confirm"
            label="Confirmar Contraseña *"
            placeholder="Repita la contraseña"
            validation="required|confirm"
            validation-visibility="live"
            :validation-messages="{
              required: 'Debe confirmar la contraseña',
              confirm: 'Las contraseñas no coinciden'
            }"
          />
        </div>

        <div class="create-actions">
          <button
            type="submit"
            class="btn btn-success"
            :disabled="!canSubmit"
          >
            <span v-if="isCreating">Creando...</span>
            <span v-else-if="isCheckingAvailability">⏳ Verificando RUT...</span>
            <span v-else>✅ Crear y Agregar Padre</span>
          </button>
        </div>
      </FormKit>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, watch } from 'vue'
import { createParentApi } from '@/services/nneService'
import { useAlertModalStore } from '@/store/alertModalStore'
import type { ParentUser, ParentUserCreate } from '@/type/nne'
import { useRutValidation } from '@/composables/useRutValidation'
import { 
  parseApiError, 
  getUserFriendlyErrorMessage,
  type ApiError
} from '@/exceptions/apiError'

interface Emits {
  (e: 'parent-created', parent: ParentUser): void
}

const emit = defineEmits<Emits>()
const alertModal = useAlertModalStore()

const showCreateForm = ref(false)
const isCreating = ref(false)
const isDevelopment = ref(import.meta.env?.MODE === 'development')

// Timeout para verificación automática del RUT
let rutCheckTimeout: number | null = null

const {
  rutValue,
  rutValidation,
  isCheckingAvailability,
  availabilityError,
  isAvailable,
  validateRutSync,
  checkRutAvailability,
  recheckAvailability,
  formatCurrentRut,
  setRutValue,
  isValid: rutIsValid,
  isPartial: isPartialRut,
  errorMessage: rutErrorMessage
} = useRutValidation()

const formData = reactive({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  phone: '',
  username: '',
  password_confirm: ''
})

// ✅ CORREGIDO: Nueva lógica más clara para habilitar el botón

const canSubmit = computed(() => {
  const allFieldsFilled = Boolean(
    formData.first_name &&
    formData.last_name &&
    formData.email &&
    formData.password &&
    rutValue.value &&
    formData.username &&
    formData.password_confirm &&
    formData.password === formData.password_confirm
  )

  const rutValidAndAvailable = rutIsValid.value && isAvailable.value === true
  const notChecking = !isCheckingAvailability.value
  const notCreating = !isCreating.value

  console.log('🔍 Estado del botón:', {
    allFieldsFilled,
    rutValidAndAvailable,
    notChecking,
    notCreating,
    canSubmit: allFieldsFilled && rutValidAndAvailable && notChecking && notCreating
  })

  return allFieldsFilled && rutValidAndAvailable && notChecking && notCreating
})

const hasRutError = computed(() => {
  return (!rutValidation.value?.isValid && !isPartialRut.value) || 
         !!availabilityError.value
})

const rutStatus = computed(() => {
  if (isCheckingAvailability.value) return 'checking'
  if (hasRutError.value) return 'error'
  if (rutValidation.value?.isValid && isAvailable.value === true) return 'valid'
  if (rutValidation.value?.isValid && isAvailable.value === false) return 'duplicate'
  if (isPartialRut.value) return 'partial'
  return 'idle'
})

watch(() => formData.email, (newEmail) => {
  if (newEmail && !formData.username) {
    const usernameFromEmail = newEmail.split('@')[0]
    formData.username = usernameFromEmail.replace(/[^a-zA-Z0-9._-]/g, '')
  }
})

const handleEmailBlur = async () => {
  await nextTick()
  setTimeout(() => {
    const emailInput = document.querySelector('[name="email"]') as HTMLInputElement
    if (emailInput) {
      emailInput.dispatchEvent(new Event('input', { bubbles: true }))
    }
  }, 100)
}

// ✅ OPTIMIZADO: Evitar verificaciones múltiples
const onRutInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value
  
  setRutValue(value)
  
  // Limpiar timeout anterior
  if (rutCheckTimeout) {
    clearTimeout(rutCheckTimeout)
  }
  
  const validation = validateRutSync(value)
  
  // Solo verificar disponibilidad cuando el RUT esté completo y válido
  if (validation.isValid && !validation.isPartial && validation.rutNormalized) {
    console.log('⚡ RUT completo detectado, programando verificación...')
    rutCheckTimeout = window.setTimeout(() => {
      checkRutAvailability(value)
    }, 800) // 800ms de delay para evitar llamadas excesivas
  }
}

const onRutBlur = async (event: Event) => {
  const input = event.target as HTMLInputElement
  let rut = input.value.trim()
  
  if (!rut) return
  
  // Limpiar timeout si existe
  if (rutCheckTimeout) {
    clearTimeout(rutCheckTimeout)
    rutCheckTimeout = null
  }
  
  try {
    const rutFormateado = formatCurrentRut()
    if (rutFormateado !== rut) {
      input.value = rutFormateado
      setRutValue(rutFormateado)
      rut = rutFormateado
    }
    
    const validation = validateRutSync(rut)
    
    // Solo verificar si es válido y no está en proceso de escritura
    if (validation.isValid && validation.rutNormalized && !isPartialRut.value) {
      console.log('🔍 Verificando disponibilidad en blur...')
      await checkRutAvailability(rut)
    }
  } catch (error) {
    console.error('Error validando RUT:', error)
  }
}

const forceRutRecheck = async () => {
  if (rutValue.value && rutValidation.value?.isValid) {
    console.log('🔄 Re-verificando RUT manualmente...')
    await recheckAvailability()
  }
}

const formatearTelefono = (event: Event) => {
  const input = event.target as HTMLInputElement
  let telefono = input.value.trim()
  
  if (!telefono) return
  
  try {
    const soloNumeros = telefono.replace(/\D/g, '')
    
    if (soloNumeros.length < 8) return
    
    if (soloNumeros.startsWith('569') && soloNumeros.length === 11) {
      const numeroFormateado = `+${soloNumeros}`
      input.value = numeroFormateado
      formData.phone = numeroFormateado
    } else if (soloNumeros.startsWith('9') && soloNumeros.length === 9) {
      const numeroFormateado = `+56${soloNumeros}`
      input.value = numeroFormateado
      formData.phone = numeroFormateado
    } else if (soloNumeros.length === 8) {
      const numeroFormateado = `+56${soloNumeros}`
      input.value = numeroFormateado
      formData.phone = numeroFormateado
    } else if (isDevelopment.value && soloNumeros.length >= 8) {
      if (!telefono.startsWith('+')) {
        const numeroFormateado = `+${soloNumeros}`
        input.value = numeroFormateado
        formData.phone = numeroFormateado
      }
    }
  } catch (error) {
    console.error('Error formateando teléfono:', error)
  }
}

const getFieldDisplayName = (fieldName: string): string => {
  const fieldNames: Record<string, string> = {
    'first_name': 'Nombres',
    'last_name': 'Apellidos',
    'email': 'Email',
    'rut': 'RUT',
    'phone': 'Teléfono',
    'username': 'Nombre de usuario',
    'password': 'Contraseña',
    'password_confirm': 'Confirmar contraseña'
  }
  
  return fieldNames[fieldName] || fieldName
}

const getDetailedErrorInfo = (error: ApiError): { title: string; message: string } => {
  if (error.isValidationError && error.fieldErrors && error.fieldErrors.length > 0) {
    const fieldMessages = error.fieldErrors.map(fieldError => {
      const fieldName = getFieldDisplayName(fieldError.field)
      return `• ${fieldName}: ${fieldError.message}`
    }).join('\n')
    
    return {
      title: 'Errores de validación',
      message: `Por favor corrija los siguientes errores:\n\n${fieldMessages}`
    }
  }
  
  if (error.isConflictError) {
    return {
      title: 'Registro duplicado',
      message: `No se pudo crear el padre porque ya existe un registro con los mismos datos.\n\n${getUserFriendlyErrorMessage(error)}`
    }
  }
  
  if (error.hasFieldError('rut')) {
    const rutError = error.getFieldError('rut')
    return {
      title: 'Error en RUT',
      message: `Problema con el RUT ingresado:\n\n${rutError?.message || getUserFriendlyErrorMessage(error)}`
    }
  }
  
  return {
    title: 'Error',
    message: getUserFriendlyErrorMessage(error)
  }
}

const toggleCreateForm = () => {
  showCreateForm.value = !showCreateForm.value
  if (!showCreateForm.value) {
    clearForm()
  }
}

const clearForm = () => {
  formData.first_name = ''
  formData.last_name = ''
  formData.email = ''
  formData.password = ''
  formData.phone = ''
  formData.username = ''
  formData.password_confirm = ''
  setRutValue('')
  
  // Limpiar timeout si existe
  if (rutCheckTimeout) {
    clearTimeout(rutCheckTimeout)
    rutCheckTimeout = null
  }
}

const createNewParent = async () => {
  if (!rutIsValid.value) {
    alertModal.error(
      'Error en RUT',
      rutErrorMessage.value || 'El RUT ingresado no es válido.'
    )
    return
  }

  if (isAvailable.value !== true) {
    alertModal.error(
      'RUT no disponible',
      'El RUT ya está registrado o no ha sido verificado correctamente.'
    )
    return
  }
  
  isCreating.value = true
  
  try {
    const rutNormalizado = rutValidation.value?.rutNormalized!

    const payload: ParentUserCreate = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      rut: rutNormalizado,
      phone: formData.phone ? formData.phone.trim() : undefined,
      username: formData.username.trim()
    }

    console.log('📤 Enviando datos para crear padre...')
    const response = await createParentApi(payload)
    
    console.log('✅ Respuesta del servidor:', response)
    
    // Extraer el padre creado de la respuesta
    // La API puede devolver: response.data o response directamente
    const newParent = response.data || response
    
    // Emitir evento con el padre creado
    emit('parent-created', newParent)
    
    // Mostrar alerta de éxito
    alertModal.success(
      'Padre creado exitosamente', 
      `El padre ${newParent.first_name} ${newParent.last_name} (RUT: ${newParent.rut}) ha sido creado y agregado correctamente al sistema.`
    )
    
    // Limpiar formulario y cerrar
    clearForm()
    showCreateForm.value = false
    
  } catch (error: any) {
    console.error('❌ Error en createNewParent:', error)
    
    const parsedError = parseApiError(error)
    const errorInfo = getDetailedErrorInfo(parsedError)
    alertModal.error(errorInfo.title, errorInfo.message)
  } finally {
    isCreating.value = false
  }
}

defineExpose({
  toggleCreateForm,
  clearForm
})
</script>

<style scoped>
.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.form-section h4 {
  margin: 0 0 1.5rem 0;
  color: #374151;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.create-parent-form {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  border-left: 4px solid #10b981;
  animation: slideDown 0.3s ease-out;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.create-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
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
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-outline {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-outline:hover:not(:disabled) {
  background: #f9fafb;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #059669;
}

.recheck-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 0.5rem;
  font-size: 1rem;
}

.text-link {
  background: none;
  border: none;
  color: #3b82f6;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  margin-left: 0.5rem;
}

.loading-spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .create-actions {
    justify-content: stretch;
  }
  
  .create-actions .btn {
    flex: 1;
  }
}

:deep(.formkit-outer) {
  margin-bottom: 1rem;
}

:deep(.formkit-label) {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  display: block;
}

:deep(.formkit-help) {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

:deep(.formkit-help-success) {
  color: #10b981;
  font-weight: 500;
}

:deep(.formkit-help-checking) {
  color: #3b82f6;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

:deep(.formkit-help-warning) {
  color: #f59e0b;
}

:deep(.formkit-help-partial) {
  color: #6b7280;
  font-style: italic;
}

:deep(.formkit-messages) {
  list-style: none;
  padding: 0;
  margin: 0.25rem 0 0 0;
}

:deep(.formkit-message) {
  font-size: 0.75rem;
  color: #dc2626;
}

:deep(.formkit-input) {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s;
}

:deep(.formkit-input:focus) {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

:deep(.formkit-input-error) {
  border-color: #dc2626;
}

:deep(.formkit-input-success) {
  border-color: #10b981;
}

:deep(.formkit-input-warning) {
  border-color: #f59e0b;
}

:deep(.formkit-input-checking) {
  border-color: #3b82f6;
}

:deep(.formkit-input-partial) {
  border-color: #9ca3af;
}
</style>