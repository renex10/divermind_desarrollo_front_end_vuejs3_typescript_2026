<!-- src/components/forms/multi-step/components/ParentCreateForm.vue -->
<template>
  <div class="parent-create-form">
    <div class="form-header">
      <h4>📝 Crear Nuevo Padre/Tutor</h4>
      <p>Complete los datos del representante del niño</p>
    </div>

    <form @submit.prevent="handleSubmit" class="create-form">
      <!-- Datos Básicos -->
      <div class="form-section">
        <h5>Información Personal</h5>
        
        <div class="form-grid">
          <div class="form-group">
            <label for="username">Username *</label>
            <input
              id="username"
              v-model="formData.username"
              type="text"
              required
              placeholder="usuario.ejemplo"
              :class="{ 'error': errors.username }"
            />
            <span v-if="errors.username" class="error-text">{{ errors.username }}</span>
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              placeholder="ejemplo@email.com"
              :class="{ 'error': errors.email }"
            />
            <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label for="password">Contraseña *</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              required
              placeholder="Mínimo 8 caracteres"
              :class="{ 'error': errors.password }"
            />
            <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
          </div>

          <div class="form-group">
            <label for="rut">RUT</label>
            <input
              id="rut"
              v-model="formData.rut"
              type="text"
              placeholder="12345678-9"
              :class="{ 'error': errors.rut }"
            />
            <span v-if="errors.rut" class="error-text">{{ errors.rut }}</span>
          </div>

          <div class="form-group">
            <label for="first_name">Nombres *</label>
            <input
              id="first_name"
              v-model="formData.first_name"
              type="text"
              required
              placeholder="Marcos"
              :class="{ 'error': errors.first_name }"
            />
            <span v-if="errors.first_name" class="error-text">{{ errors.first_name }}</span>
          </div>

          <div class="form-group">
            <label for="last_name">Apellidos *</label>
            <input
              id="last_name"
              v-model="formData.last_name"
              type="text"
              required
              placeholder="Huincabal"
              :class="{ 'error': errors.last_name }"
            />
            <span v-if="errors.last_name" class="error-text">{{ errors.last_name }}</span>
          </div>

          <div class="form-group">
            <label for="phone">Teléfono</label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              placeholder="+56912345678"
              :class="{ 'error': errors.phone }"
            />
            <span v-if="errors.phone" class="error-text">{{ errors.phone }}</span>
          </div>
        </div>
      </div>

      <!-- Botones de Acción -->
      <div class="form-actions">
        <button
          type="button"
          class="btn btn-secondary"
          @click="$emit('cancel')"
          :disabled="isSubmitting"
        >
          Cancelar
        </button>
        
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="isSubmitting || !isFormValid"
        >
          <span v-if="isSubmitting">Creando...</span>
          <span v-else>✅ Crear Padre</span>
        </button>
      </div>

      <!-- Mensajes de Estado -->
      <div v-if="successMessage" class="success-message">
        ✅ {{ successMessage }}
      </div>
      
      <div v-if="errorMessage" class="error-message">
        ❌ {{ errorMessage }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useNneFacade } from '@/composables/useNneFacade'
import type { ParentUser } from '@/types/nne'

interface Emits {
  (e: 'parentCreated', parent: ParentUser): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

const { createParent, isLoading } = useNneFacade()

// Estado del formulario
const formData = reactive({
  username: '',
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  rut: '',
  phone: ''
})

const errors = reactive({
  username: '',
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  rut: '',
  phone: ''
})

const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Validación del formulario
const isFormValid = computed(() => {
  return formData.username.trim() !== '' &&
         formData.email.trim() !== '' &&
         formData.password.trim() !== '' &&
         formData.first_name.trim() !== '' &&
         formData.last_name.trim() !== '' &&
         validateEmail(formData.email) &&
         formData.password.length >= 8
})

// Validación de email
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Limpiar errores
const clearErrors = () => {
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}

// Limpiar mensajes
const clearMessages = () => {
  successMessage.value = ''
  errorMessage.value = ''
}

// Manejar envío del formulario
const handleSubmit = async () => {
  if (!isFormValid.value) return

  clearErrors()
  clearMessages()
  isSubmitting.value = true

  try {
    // Crear el padre usando el facade
    const newParent = await createParent(formData)
    
    successMessage.value = `Padre "${formData.first_name} ${formData.last_name}" creado exitosamente`
    
    // Emitir evento después de un breve delay para que se vea el mensaje
    setTimeout(() => {
      emit('parentCreated', newParent)
      
      // Limpiar formulario
      Object.keys(formData).forEach(key => {
        formData[key as keyof typeof formData] = ''
      })
    }, 1500)
    
  } catch (error: any) {
    console.error('Error creando padre:', error)
    
    // Manejar errores de validación del backend
    if (error.response?.data?.errors) {
      const backendErrors = error.response.data.errors
      Object.keys(backendErrors).forEach(key => {
        if (key in errors) {
          errors[key as keyof typeof errors] = backendErrors[key][0]
        }
      })
    } else {
      errorMessage.value = error.response?.data?.message || 'Error al crear el padre. Por favor, intente nuevamente.'
    }
  } finally {
    isSubmitting.value = false
  }
}

// Validación en tiempo real
const validateField = (field: string, value: string) => {
  clearMessages()
  
  switch (field) {
    case 'email':
      if (value && !validateEmail(value)) {
        errors.email = 'Formato de email inválido'
      } else {
        errors.email = ''
      }
      break
      
    case 'password':
      if (value && value.length < 8) {
        errors.password = 'La contraseña debe tener al menos 8 caracteres'
      } else {
        errors.password = ''
      }
      break
      
    case 'rut':
      if (value && !/^(\d{1,3}(?:\.\d{3})*-\d|)$/.test(value)) {
        errors.rut = 'Formato de RUT inválido'
      } else {
        errors.rut = ''
      }
      break
      
    default:
      if (value.trim() === '' && field !== 'rut' && field !== 'phone') {
        errors[field as keyof typeof errors] = 'Este campo es requerido'
      } else {
        errors[field as keyof typeof errors] = ''
      }
  }
}

// Watchers para validación en tiempo real
Object.keys(formData).forEach(key => {
  const field = key as keyof typeof formData
  // Usamos un watch o computed para cada campo, pero por simplicidad
  // podríamos usar @input en los campos del template
})
</script>

<style scoped>
.parent-create-form {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
  background: #f9fafb;
}

.form-header {
  margin-bottom: 1.5rem;
}

.form-header h4 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
}

.form-header p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.form-section {
  margin-bottom: 1.5rem;
}

.form-section h5 {
  margin: 0 0 1rem 0;
  color: #374151;
  font-size: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.form-group input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input.error {
  border-color: #ef4444;
}

.error-text {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.success-message {
  background: #d1fae5;
  color: #065f46;
  padding: 0.75rem;
  border-radius: 4px;
  margin-top: 1rem;
  font-size: 0.875rem;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 4px;
  margin-top: 1rem;
  font-size: 0.875rem;
}
</style>