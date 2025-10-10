<template>
  <div
    class="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-amber-50 to-yellow-50"
    style="background-color: #fffaf2;"
  >
    <!-- Container principal con sombra sutil -->
    <div class="max-w-md w-full space-y-8">
      <!-- Card principal -->
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-yellow-100/50">
        
        <!-- Header con logo -->
        <div class="text-center mb-8">
          <div class="flex justify-center mb-6">
            <img 
              :src="logoUrl" 
              alt="Logo" 
              class="h-12 w-auto drop-shadow-sm"
            >
          </div>
          <h2 class="text-2xl font-bold text-amber-900" style="color: #311906;">
            Iniciar Sesión
          </h2>
          <p class="mt-2 text-sm text-stone-600" style="color: #8c8377;">
            Accede a tu cuenta para continuar
          </p>
        </div>

        <!-- Formulario -->
        <FormKit
          type="form"
          submit-label="Iniciar Sesión"
          @submit="handleLogin"
          :classes="{
            form: 'space-y-6',
            messages: 'text-red-500 text-sm mt-1',
            message: 'text-red-500 text-sm'
          }"
        >
          <!-- Campo Email -->
          <FormKit
            name="email"
            type="email"
            label="Correo Electrónico"
            placeholder="tu@ejemplo.com"
            validation="required|email"
            :classes="{
              outer: 'mb-6',
              label: 'block text-sm font-semibold mb-2 text-amber-900',
              input: 'w-full px-4 py-3 bg-amber-50 border-2 border-yellow-200 rounded-xl focus:border-yellow-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-200/50 transition-all duration-200 text-amber-900 placeholder-stone-400',
              messages: 'text-red-500 text-sm mt-1'
            }"
            :style="{
              '--fk-color-primary': '#ffe923'
            }"
          />

          <!-- Campo Password -->
          <FormKit
            name="password"
            type="password"
            label="Contraseña"
            placeholder="••••••••"
            validation="required"
            :classes="{
              outer: 'mb-8',
              label: 'block text-sm font-semibold mb-2 text-amber-900',
              input: 'w-full px-4 py-3 bg-amber-50 border-2 border-yellow-200 rounded-xl focus:border-yellow-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-200/50 transition-all duration-200 text-amber-900 placeholder-stone-400',
              messages: 'text-red-500 text-sm mt-1'
            }"
          />

          <!-- Botón Submit personalizado -->
          <template #submit="{ disabled, label }">
            <button
              type="submit"
              :disabled="Boolean(disabled)"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-amber-900 bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style="background: linear-gradient(135deg, #fffb5c 0%, #ffe923 100%); color: #311906;"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg 
                  class="h-5 w-5 text-amber-800 group-hover:text-amber-900 transition-colors" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
                </svg>
              </span>
              {{ label }}
            </button>
          </template>
        </FormKit>

        <!-- Enlaces adicionales -->
        <div class="mt-6 text-center">
          <a 
            href="#" 
            class="text-sm font-medium hover:underline transition-colors duration-200" 
            style="color: #8c8377;"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center">
        <p class="text-xs" style="color: #8c8377;">
          Protegido por medidas de seguridad avanzadas
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAuth } from '@/composables/useAuth'
import logoHorizontal from '../../assets/img/logo-horizontal.png'

const { login } = useAuth()

// URL del logo
const logoUrl = logoHorizontal

const handleLogin = (formData: { email: string; password: string }) => {
  login(formData.email, formData.password)
}
</script>

<style scoped>
:deep(.formkit-form) {
  --fk-color-primary: #ffe923;
  --fk-color-primary-contrast: #311906;
}

.group:hover .absolute {
  transform: translateX(1px);
}

:deep(.formkit-input:focus) {
  box-shadow: 0 0 0 3px rgba(255, 233, 35, 0.1);
}
</style>