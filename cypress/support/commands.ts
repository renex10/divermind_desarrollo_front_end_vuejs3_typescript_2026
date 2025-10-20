/// <reference types="cypress" />

// ============================================
// COMANDOS DE AUTENTICACIÓN
// ============================================

/**
 * Login via UI (interfaz gráfica)
 * Útil para tests que necesitan probar el flujo de login completo
 */
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.log(`🔐 Login via UI: ${email}`)
  
  cy.visit('/login')
  cy.waitForAppReady()
 
  cy.get('[name="email"]').type(email)
  cy.get('[name="password"]').type(password)
  cy.get('button[type="submit"]').click()
 
  // Esperar a que la redirección ocurra
  cy.url({ timeout: 15000 }).should('not.include', '/login')
  cy.log('✅ Login UI exitoso')
})

/**
 * Login via API (más rápido)
 * Recomendado para la mayoría de tests que solo necesitan estar autenticados
 */
Cypress.Commands.add('loginViaAPI', (email: string, password: string) => {
  cy.log(`🔐 Login via API: ${email}`)
  
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('API_BASE_URL')}/user/login/`,
    body: { email, password },
    failOnStatusCode: false
  }).then((response) => {
    if (response.status === 200 || response.status === 201) {
      // Establecer tokens en localStorage
      cy.window().then((win) => {
        // Soportar ambos formatos de tokens
        if (response.body.access) {
          win.localStorage.setItem('access', response.body.access)
          win.localStorage.setItem('refresh', response.body.refresh)
        }
        if (response.body.access_token) {
          win.localStorage.setItem('access_token', response.body.access_token)
          win.localStorage.setItem('refresh_token', response.body.refresh_token)
        }
        if (response.body.user) {
          win.localStorage.setItem('user', JSON.stringify(response.body.user))
        }
      })
      
      cy.log('✅ Login API exitoso')
      return cy.wrap(response.body)
    } else {
      cy.log(`❌ Login fallido: ${response.status}`)
      throw new Error(`Login failed with status ${response.status}`)
    }
  })
})

/**
 * Limpiar toda la autenticación
 * Elimina tokens de localStorage, cookies y sessionStorage
 */
Cypress.Commands.add('clearAuth', () => {
  cy.clearLocalStorage()
  cy.clearCookies()
  
  cy.window().then((win) => {
    // Limpiar diferentes formatos de tokens
    win.localStorage.removeItem('access')
    win.localStorage.removeItem('refresh')
    win.localStorage.removeItem('access_token')
    win.localStorage.removeItem('refresh_token')
    win.localStorage.removeItem('user')
    win.sessionStorage.clear()
  })
  
  cy.log('🧹 Autenticación limpiada')
})

/**
 * Verificar que el usuario está autenticado
 */
Cypress.Commands.add('verifyAuth', () => {
  cy.window().then((win) => {
    const hasAuth = 
      win.localStorage.getItem('access') ||
      win.localStorage.getItem('access_token')
    
    expect(hasAuth, 'Usuario debe estar autenticado').to.exist
    cy.log('✅ Usuario autenticado')
  })
})

// ============================================
// COMANDOS DE APLICACIÓN
// ============================================

/**
 * Esperar a que la aplicación esté completamente cargada
 */
Cypress.Commands.add('waitForAppReady', () => {
  cy.window().should('have.property', 'app')
  cy.document().its('readyState').should('equal', 'complete')
  cy.log('✅ App lista')
})

/**
 * Esperar a que la app Vue esté montada
 */
Cypress.Commands.add('waitForVueApp', () => {
  cy.get('#app', { timeout: 10000 }).should('exist')
  cy.waitForAppReady()
})

/**
 * Configurar intercepts para APIs comunes
 * Usar solo cuando sea necesario en tests específicos
 */
Cypress.Commands.add('interceptCommonAPIs', () => {
  cy.intercept('POST', '**/user/login/').as('loginRequest')
  cy.intercept('POST', '**/user/refresh/').as('refreshRequest')
  cy.intercept('GET', '**/api/**').as('apiRequests')
  cy.intercept('POST', '**/ingreso/crear/').as('createNna')
  cy.intercept('GET', '**/ingreso/validar-rut/*').as('validateRut')
  cy.log('📡 Intercepts configurados')
})

// ============================================
// COMANDOS DE MODAL
// ============================================

/**
 * Esperar a que un modal esté visible
 */
Cypress.Commands.add('waitForModal', (modalTitle?: string) => {
  cy.get('.base-modal', { timeout: 5000 }).should('be.visible')
  if (modalTitle) {
    cy.contains('.base-modal', modalTitle).should('be.visible')
  }
  cy.log(`📋 Modal visible${modalTitle ? `: ${modalTitle}` : ''}`)
})

/**
 * Cerrar cualquier modal abierto
 */
Cypress.Commands.add('closeModal', () => {
  cy.get('body').then(($body) => {
    if ($body.find('.base-modal').length > 0) {
      // Intentar cerrar con botón específico
      if ($body.find('[data-testid="btn-close-modal"]').length > 0) {
        cy.get('[data-testid="btn-close-modal"]').click()
      } else {
        // Fallback: buscar cualquier botón de cerrar
        cy.get('.base-modal').find('button').contains(/cerrar|close/i).click()
      }
      cy.get('.base-modal').should('not.exist')
      cy.log('✅ Modal cerrado')
    }
  })
})

// ============================================
// COMANDOS ESPECÍFICOS DE FORMULARIO NNA
// ============================================

/**
 * Llenar formulario multipasos hasta un paso específico
 */
Cypress.Commands.add('fillFormUntilStep', (stepNumber: number, formData?: any) => {
  for (let i = 1; i <= stepNumber; i++) {
    cy.log(`📝 Navegando al paso ${i}`)
    cy.get(`[data-testid="step-indicator-${i}"]`).should('have.class', 'active')
    
    if (i < stepNumber) {
      cy.get('[data-testid="btn-next-step"]').should('not.be.disabled').click()
    }
  }
})

/**
 * Verificar validación de RUT chileno
 */
Cypress.Commands.add('verifyRutValidation', (rut: string, shouldBeValid: boolean) => {
  cy.get('[name="rut"]').clear().type(rut)
  cy.get('[name="first_name"]').click() // Trigger blur
  
  if (shouldBeValid) {
    cy.get('[data-testid="rut-validation-status"]', { timeout: 15000 })
      .should('contain', 'RUT válido')
    cy.log(`✅ RUT ${rut} válido`)
  } else {
    cy.get('[data-testid="rut-validation-status"]', { timeout: 5000 })
      .should('match', /inválido|no válido/i)
    cy.log(`❌ RUT ${rut} inválido (esperado)`)
  }
})

/**
 * Seleccionar ubicación completa (región, comuna, establecimiento)
 */
Cypress.Commands.add('selectLocation', () => {
  cy.log('📍 Seleccionando ubicación...')
  
  // Esperar a que carguen las regiones
  cy.get('[name="region"]').should('not.be.disabled')
  cy.contains('Cargando regiones', { timeout: 10000 }).should('not.exist')

  // Seleccionar primera región disponible
  cy.get('[name="region"]').find('option:not([value=""])').first().then($option => {
    cy.get('[name="region"]').select($option.val() as string)
    cy.log(`  ✓ Región: ${$option.text()}`)
  })

  // Esperar y seleccionar primera comuna disponible
  cy.get('[name="commune"]', { timeout: 10000 }).should('not.be.disabled')
  cy.contains('Cargando comunas', { timeout: 10000 }).should('not.exist')
  
  cy.get('[name="commune"]').find('option:not([value=""])').first().then($option => {
    cy.get('[name="commune"]').select($option.val() as string)
    cy.log(`  ✓ Comuna: ${$option.text()}`)
  })

  // Esperar y seleccionar primer establecimiento disponible
  cy.get('[name="establishment"]', { timeout: 10000 }).should('not.be.disabled')
  cy.contains('Buscando establecimientos', { timeout: 10000 }).should('not.exist')
  
  cy.get('[name="establishment"]').find('option:not([value=""])').first().then($option => {
    cy.get('[name="establishment"]').select($option.val() as string)
    cy.log(`  ✓ Establecimiento: ${$option.text()}`)
  })
  
  cy.log('✅ Ubicación completa seleccionada')
})

/**
 * Buscar y agregar un padre/tutor
 */
Cypress.Commands.add('searchAndAddParent', (searchName: string, fullName?: string) => {
  cy.log(`👨‍👩‍👧 Buscando padre: ${searchName}`)
  
  cy.get('[name="parent_search_name"]').clear().type(searchName)
  cy.get('[data-testid="btn-search-parent"]').click()

  cy.get('body', { timeout: 10000 }).then(($body) => {
    const searchText = fullName || searchName
    
    if ($body.text().includes(searchText)) {
      cy.get('[data-testid^="parent-card-"]')
        .contains(searchText)
        .parents('[data-testid^="parent-card-"]')
        .find('[data-testid="btn-add-parent"]')
        .click()
      
      // Verificar que fue agregado
      cy.get('[data-testid="selected-parents-list"]').should('contain', searchText)
      cy.log(`✅ Padre "${searchText}" agregado`)
    } else {
      cy.log(`ℹ️  Padre "${searchText}" no encontrado, continuando...`)
    }
  })
})

/**
 * Completar paso de datos personales
 */
Cypress.Commands.add('fillPersonalDataStep', (data: {
  first_name: string
  last_name: string
  rut: string
  birth_date: string
  gender: string
}) => {
  cy.log('📝 Llenando datos personales...')
  
  cy.get('[name="first_name"]').clear().type(data.first_name)
  cy.get('[name="last_name"]').clear().type(data.last_name)
  cy.get('[name="rut"]').clear().type(data.rut)
  cy.get('[name="birth_date"]').clear().type(data.birth_date)
  cy.get('[name="gender"]').select(data.gender)
  
  // Esperar validación de RUT
  cy.get('[data-testid="rut-validation-status"]', { timeout: 15000 })
    .should('contain', 'RUT válido')
  
  cy.log('✅ Datos personales completados')
})

/**
 * Completar paso de ubicación
 */
Cypress.Commands.add('fillLocationStep', (data: {
  street: string
  street_number: string
}) => {
  cy.log('📝 Llenando ubicación...')
  
  cy.selectLocation()
  
  cy.get('[name="street"]').clear().type(data.street)
  cy.get('[name="street_number"]').clear().type(data.street_number)
  
  cy.log('✅ Ubicación completada')
})

/**
 * Completar paso de información escolar
 */
Cypress.Commands.add('fillSchoolInfoStep', (data: {
  current_grade: string
  school_journey: string
  school_adaptation_notes: string
}) => {
  cy.log('📝 Llenando información escolar...')
  
  cy.get('[name="current_grade"]').select(data.current_grade)
  cy.get('[name="school_journey"]').select(data.school_journey)
  cy.get('[name="school_adaptation_notes"]').clear().type(data.school_adaptation_notes)
  
  cy.log('✅ Información escolar completada')
})

/**
 * Completar paso de perfil médico
 */
Cypress.Commands.add('fillMedicalProfileStep', (data: {
  allergies: string
  current_medication: string
  emergency_contact: string
  emergency_phone: string
  medical_notes: string
}) => {
  cy.log('📝 Llenando perfil médico...')
  
  cy.get('[name="allergies"]').clear().type(data.allergies)
  cy.get('[name="current_medication"]').clear().type(data.current_medication)
  cy.get('[name="emergency_contact"]').clear().type(data.emergency_contact)
  cy.get('[name="emergency_phone"]').clear().type(data.emergency_phone)
  cy.get('[name="medical_notes"]').clear().type(data.medical_notes)
  
  cy.log('✅ Perfil médico completado')
})

// ============================================
// DECLARACIÓN DE TIPOS PARA TYPESCRIPT
// ============================================

declare global {
  namespace Cypress {
    interface Chainable {
      // Autenticación
      /**
       * Login via interfaz de usuario
       * @param email - Email del usuario
       * @param password - Contraseña del usuario
       */
      login(email: string, password: string): Chainable<void>
      
      /**
       * Login via API (más rápido, recomendado)
       * @param email - Email del usuario
       * @param password - Contraseña del usuario
       */
      loginViaAPI(email: string, password: string): Chainable<any>
      
      /**
       * Limpiar toda la autenticación (localStorage, cookies, sessionStorage)
       */
      clearAuth(): Chainable<void>
      
      /**
       * Verificar que el usuario está autenticado
       */
      verifyAuth(): Chainable<void>
      
      // Aplicación
      /**
       * Esperar a que la aplicación esté completamente lista
       */
      waitForAppReady(): Chainable<void>
      
      /**
       * Esperar a que la app Vue esté montada
       */
      waitForVueApp(): Chainable<void>
      
      /**
       * Configurar intercepts para APIs comunes
       */
      interceptCommonAPIs(): Chainable<void>
      
      // Modales
      /**
       * Esperar a que un modal esté visible
       * @param modalTitle - Título opcional del modal
       */
      waitForModal(modalTitle?: string): Chainable<void>
      
      /**
       * Cerrar cualquier modal abierto
       */
      closeModal(): Chainable<void>
      
      // Formulario multipasos
      /**
       * Navegar hasta un paso específico del formulario
       * @param stepNumber - Número del paso objetivo
       * @param formData - Datos opcionales del formulario
       */
      fillFormUntilStep(stepNumber: number, formData?: any): Chainable<void>
      
      /**
       * Verificar validación de RUT chileno
       * @param rut - RUT a validar
       * @param shouldBeValid - Si el RUT debería ser válido
       */
      verifyRutValidation(rut: string, shouldBeValid: boolean): Chainable<void>
      
      /**
       * Seleccionar ubicación completa (región, comuna, establecimiento)
       */
      selectLocation(): Chainable<void>
      
      /**
       * Buscar y agregar un padre/tutor
       * @param searchName - Nombre a buscar
       * @param fullName - Nombre completo opcional para verificación
       */
      searchAndAddParent(searchName: string, fullName?: string): Chainable<void>
      
      /**
       * Completar paso de datos personales
       */
      fillPersonalDataStep(data: {
        first_name: string
        last_name: string
        rut: string
        birth_date: string
        gender: string
      }): Chainable<void>
      
      /**
       * Completar paso de ubicación
       */
      fillLocationStep(data: {
        street: string
        street_number: string
      }): Chainable<void>
      
      /**
       * Completar paso de información escolar
       */
      fillSchoolInfoStep(data: {
        current_grade: string
        school_journey: string
        school_adaptation_notes: string
      }): Chainable<void>
      
      /**
       * Completar paso de perfil médico
       */
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



