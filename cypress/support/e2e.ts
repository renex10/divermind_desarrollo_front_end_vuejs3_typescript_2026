/// <reference types="cypress" />

import './commands'

// ============================================
// MANEJO DE ERRORES NO CAPTURADOS
// ============================================

Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignorar errores comunes en aplicaciones Vue/SPA
  const ignoredErrors = [
    'ResizeObserver',
    'hydration',
    'Avoided redundant navigation',
    'NavigationDuplicated',
    'Token expirado',
    'Loading',
    'fetch',
    'cancelled',
    'Network Error',
    'timeout',
    'AbortError'
  ]

  // Verificar si el error debe ser ignorado
  const shouldIgnore = ignoredErrors.some(errType => 
    err.message.includes(errType)
  )

  if (shouldIgnore) {
    cy.log(`⚠️  Error ignorado: ${err.message.substring(0, 50)}...`)
    return false // Prevenir que Cypress falle el test
  }

  // Registrar el error pero no fallar el test automáticamente
  cy.log('❌ Uncaught exception:', err.message)
  
  // Puedes decidir si quieres fallar el test o no
  // return false = no falla el test
  // return true = falla el test (comportamiento default)
  return true
})

// ============================================
// CONFIGURACIÓN GLOBAL DE WINDOW
// ============================================

Cypress.on('window:before:load', (win) => {
  // NO usar cy.log() aquí - causa conflictos con promesas
  // Usar console.log si necesitas debug
  console.log('🪟 Window cargado')
  
  // Configuraciones opcionales del window
  // Ejemplo: Deshabilitar logs de consola molestos
  const originalConsoleError = win.console.error
  win.console.error = (...args: any[]) => {
    // Filtrar errores específicos de Vue/React que no son relevantes
    const errorMessage = args[0]?.toString() || ''
    
    if (
      errorMessage.includes('Download the React DevTools') ||
      errorMessage.includes('Download the Vue Devtools')
    ) {
      return
    }
    
    originalConsoleError.apply(win.console, args)
  }
})

// ============================================
// LISTENERS OPCIONALES
// ============================================

// Log de todas las requests (útil para debugging)
// Descomenta si necesitas ver todas las peticiones
/*
Cypress.on('window:before:load', (win) => {
  cy.spy(win.console, 'log').as('consoleLog')
  cy.spy(win.console, 'error').as('consoleError')
})
*/

// Capturar screenshots automáticos en fallos
Cypress.on('fail', (error, runnable) => {
  cy.screenshot(`failure-${runnable.title}`, {
    capture: 'fullPage',
    overwrite: true
  })
  throw error
})

// ============================================
// TIPOS TYPESCRIPT GLOBALES
// ============================================

declare global {
  namespace Cypress {
    interface Chainable {
      // Autenticación
      login(email: string, password: string): Chainable<void>
      loginViaAPI(email: string, password: string): Chainable<any>
      clearAuth(): Chainable<void>
      verifyAuth(): Chainable<void>
      
      // Aplicación
      waitForAppReady(): Chainable<void>
      waitForVueApp(): Chainable<void>
      waitForApiReady(): Chainable<void>
      interceptCommonAPIs(): Chainable<void>
      
      // Modales
      waitForModal(modalTitle?: string): Chainable<void>
      closeModal(): Chainable<void>
      
      // Formulario multipasos
      fillFormUntilStep(stepNumber: number, formData?: any): Chainable<void>
      verifyRutValidation(rut: string, shouldBeValid: boolean): Chainable<void>
      selectLocation(): Chainable<void>
      searchAndAddParent(searchName: string, fullName?: string): Chainable<void>
      
      // Pasos específicos del formulario
      fillPersonalDataStep(data: {
        first_name: string
        last_name: string
        rut: string
        birth_date: string
        gender: string
      }): Chainable<void>
      
      fillLocationStep(data: {
        street: string
        street_number: string
      }): Chainable<void>
      
      fillSchoolInfoStep(data: {
        current_grade: string
        school_journey: string
        school_adaptation_notes: string
      }): Chainable<void>
      
      fillMedicalProfileStep(data: {
        allergies: string
        current_medication: string
        emergency_contact: string
        emergency_phone: string
        medical_notes: string
      }): Chainable<void>
    }
  }
}

export {}