// cypress/e2e/multipasos/multipasos-simplified.cy.ts
// Ejemplo simplificado usando los comandos personalizados

/// <reference types="cypress" />

describe('Formulario Multipasos - Versión Simplificada', () => {
  let createdNnaId: number | null = null;

  const testNnaData = {
    first_name: 'María',
    last_name: 'González',
    rut: '12345678-5',
    birth_date: '2016-04-12',
    gender: 'female',
    street: 'Av. Las Flores',
    street_number: '1456',
    current_grade: '2° Básico',
    school_journey: 'afternoon',
    school_adaptation_notes: 'Se adapta bien',
    allergies: 'Alergia al maní',
    current_medication: 'Antihistamínicos',
    emergency_contact: 'Fernanda Espinoza',
    emergency_phone: '+56955556666',
    medical_notes: 'Controlada por alergólogo'
  };

  beforeEach(() => {
    // Login rápido via API
    cy.clearAuth()
    cy.loginViaAPI(Cypress.env('TEST_EMAIL'), Cypress.env('TEST_PASSWORD'))
    cy.visit('/ingreso-nna')
    cy.contains('h1', 'Gestión de NNA', { timeout: 10000 }).should('be.visible')
  });

  afterEach(() => {
    // Cleanup automático
    if (createdNnaId) {
      cy.request({
        method: 'DELETE',
        url: `${Cypress.env('API_BASE_URL')}/ingreso/${createdNnaId}/`,
        failOnStatusCode: false
      });
      createdNnaId = null;
    }
  });

  it('debería completar el registro usando comandos personalizados', () => {
    cy.interceptCommonAPIs()

    // Abrir modal
    cy.contains('button', 'Agregar Nuevo NNA').click()
    cy.waitForModal('Registro de Nuevo NNA')

    // PASO 1: Datos Personales (1 línea en vez de 10)
    cy.fillPersonalDataStep(testNnaData)
    cy.get('[data-testid="btn-next-step"]').click()

    // PASO 2: Ubicación (1 línea en vez de 30)
    cy.fillLocationStep(testNnaData)
    cy.get('[data-testid="btn-next-step"]').click()

    // PASO 3: Información Escolar (1 línea en vez de 5)
    cy.fillSchoolInfoStep(testNnaData)
    cy.get('[data-testid="btn-next-step"]').click()

    // PASO 4: Perfil Médico (1 línea en vez de 7)
    cy.fillMedicalProfileStep(testNnaData)
    cy.get('[data-testid="btn-next-step"]').click()

    // PASO 5: Necesidades Especiales
    cy.get('[data-testid="has-special-needs-no"]').click()
    cy.get('[data-testid="btn-next-step"]').click()

    // PASO 6: Historial de Terapias
    cy.get('[data-testid="has-previous-therapies-no"]').click()
    cy.get('[data-testid="btn-next-step"]').click()

    // PASO 7: Consentimiento
    cy.get('[data-testid="guardian-consent-yes"]').click()
    cy.get('[name="consent_date"]').type('2024-08-20')
    cy.get('[data-testid="btn-next-step"]').click()

    // PASO 8: Padres/Tutores (1 línea en vez de 15)
    cy.searchAndAddParent('Fernanda', 'Fernanda Espinoza')
    cy.get('[data-testid="btn-next-step"]').click()

    // PASO 9: Revisión y Envío
    cy.get('[data-testid="btn-submit-form"]').click()

    cy.wait('@createNna', { timeout: 30000 }).then((interception) => {
      expect(interception.response?.statusCode).to.equal(201)
      createdNnaId = interception.response?.body?.id
    })

    // Verificar éxito
    cy.waitForModal('¡Registro Exitoso!')
    cy.get('[data-testid="btn-close-success"]').click()
  });

  it('debería validar RUTs correctamente', () => {
    cy.contains('button', 'Agregar Nuevo NNA').click()
    
    // Test múltiples RUTs en 2 líneas
    cy.verifyRutValidation('11111111-1', false)  // Inválido
    cy.verifyRutValidation('12345678-5', true)   // Válido
  });

  it('debería permitir login via UI también', () => {
    // Ejemplo de uso del comando login via UI
    cy.clearAuth()
    cy.login(Cypress.env('TEST_EMAIL'), Cypress.env('TEST_PASSWORD'))
    cy.url().should('not.include', '/login')
    cy.verifyAuth()
  });

  it('debería manejar navegación entre pasos', () => {
    cy.contains('button', 'Agregar Nuevo NNA').click()

    // Llenar paso 1 y avanzar
    cy.fillPersonalDataStep(testNnaData)
    cy.get('[data-testid="btn-next-step"]').click()
    cy.get('[data-testid="step-indicator-2"]').should('have.class', 'active')

    // Retroceder
    cy.get('[data-testid="btn-prev-step"]').click()
    cy.get('[data-testid="step-indicator-1"]').should('have.class', 'active')

    // Verificar datos persistentes
    cy.get('[name="first_name"]').should('have.value', testNnaData.first_name)
    cy.get('[name="last_name"]').should('have.value', testNnaData.last_name)
  });
});