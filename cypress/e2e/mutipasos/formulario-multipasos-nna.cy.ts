// cypress/e2e/formulario-multipasos-nna.cy.ts
/// <reference types="cypress" />

describe('Formulario Multipasos - Registro de NNA', () => {
  const API_BASE = Cypress.env('API_BASE_URL')
  const TEST_EMAIL = Cypress.env('TEST_EMAIL')
  const TEST_PASSWORD = Cypress.env('TEST_PASSWORD')

  // Datos del NNA de prueba (basados en el ejemplo de Postman)
  const testNNA = {
    // Paso 1: Datos Personales
    first_name: 'Isabella',
    last_name: 'Espinoza Muñoz',
    rut: '20.999.888-2',
    birth_date: '2016-04-12',
    gender: 'female',

    // Paso 2: Ubicación
    establishment: 5,
    region: 13,
    commune: 21,
    street: 'Av. Las Flores',
    street_number: '1456',

    // Paso 3: Información Escolar
    current_grade: '2° Básico',
    school_journey: 'afternoon',
    adaptation_notes: 'Al principio tímida, pero se adapta bien con apoyo',

    // Paso 4: Perfil Médico
    allergies: 'Alergia al maní',
    current_medication: 'Antihistamínicos en caso de reacción',
    emergency_contact: 'Fernanda Espinoza (Madre)',
    emergency_phone: '+56955556666',
    medical_notes: 'Controlada por alergólogo, sin otras condiciones relevantes',

    // Paso 5: Necesidades Especiales
    has_special_needs: true,
    special_needs_type: 'temporary', // Trastorno específico del lenguaje
    autism_level: 'not_applicable',

    // Paso 6: Historial de Terapias
    has_previous_therapies: true,
    therapies_detail: 'Fonoaudiología semanal desde 2022',
    referred_by: 'specialist',
    referred_by_detail: 'Pediatra tratante',
    attended_where: 2,

    // Paso 7: Consentimiento
    guardian_consent: true,
    consent_date: '2024-08-20',

    // Paso 8: Padres (Fernanda Espinoza del listado)
    parent_id: 15
  }

  beforeEach(() => {
    // Limpiar estado antes de cada test
    cy.clearAuth()
    
    // Login via API para cada test
    cy.loginViaAPI(TEST_EMAIL, TEST_PASSWORD).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('access')
    })

    // Visitar el dashboard
    cy.visit('/')
    cy.waitForAppReady()
  })

  describe('Flujo Completo de Registro', () => {
    it('Debería completar exitosamente el registro de un NNA con todos los pasos', () => {
      // 1. Navegar a Ingreso NNA
      cy.contains('Ingreso NNA').click()
      cy.url().should('include', '/ingreso-nna')
      
      // 2. Abrir modal de registro
      cy.contains('button', 'Agregar Nuevo NNA').click()
      cy.get('.modal-container').should('be.visible')
      cy.contains('Registro de Nuevo NNA').should('be.visible')

      // ===== PASO 1: DATOS PERSONALES =====
      cy.log('📝 PASO 1: Completando Datos Personales')
      
      // Verificar que estamos en el paso 1
      cy.get('.step-indicator.active').should('contain', '1')
      
      // Completar nombres
      cy.get('[name="first_name"]')
        .clear()
        .type(testNNA.first_name)
        .should('have.value', testNNA.first_name)
      
      // Completar apellidos
      cy.get('[name="last_name"]')
        .clear()
        .type(testNNA.last_name)
        .should('have.value', testNNA.last_name)
      
      // Completar RUT
      cy.get('[name="rut"]')
        .clear()
        .type(testNNA.rut)
        .blur() // Activar validación
      
      // Esperar validación del RUT
      cy.contains('RUT válido y disponible', { timeout: 10000 })
        .should('be.visible')
      
      // Completar fecha de nacimiento
      cy.get('[name="birth_date"]')
        .clear()
        .type(testNNA.birth_date)
      
      // Seleccionar género
      cy.get('[name="gender"]').select(testNNA.gender)
      
      // Verificar que la validación del paso 1 esté correcta
      cy.contains('✓ Todos los campos requeridos están completos')
        .should('be.visible')
      
      // Avanzar al paso 2
      cy.contains('button', 'Siguiente →').click()
      
      // ===== PASO 2: UBICACIÓN =====
      cy.log('🗺️ PASO 2: Completando Ubicación y Establecimiento')
      
      // Verificar que estamos en el paso 2
      cy.get('.step-indicator.active').should('contain', '2')
      
      // Esperar a que se carguen las regiones
      cy.wait(1000)
      
      // Seleccionar región
      cy.get('[name="region"]').select(testNNA.region.toString())
      
      // Esperar a que se carguen las comunas
      cy.wait(1500)
      
      // Seleccionar comuna
      cy.get('[name="commune"]').select(testNNA.commune.toString())
      
      // Seleccionar establecimiento (dar click en el select para activar búsqueda)
      cy.get('[name="establishment"]').click()
      cy.wait(1500)
      cy.get('[name="establishment"]').select(testNNA.establishment.toString())
      
      // Completar calle
      cy.get('[name="street"]')
        .clear()
        .type(testNNA.street)
      
      // Completar número
      cy.get('[name="street_number"]')
        .clear()
        .type(testNNA.street_number)
      
      // Verificar validación del paso 2
      cy.contains('✓ Todos los campos de ubicación están completos', { timeout: 5000 })
        .should('be.visible')
      
      // Avanzar al paso 3
      cy.contains('button', 'Siguiente →').click()
      
      // ===== PASO 3: INFORMACIÓN ESCOLAR =====
      cy.log('🎓 PASO 3: Completando Información Escolar')
      
      cy.get('.step-indicator.active').should('contain', '3')
      
      // Seleccionar curso
      cy.get('[name="current_grade"]').select(testNNA.current_grade)
      
      // Seleccionar jornada
      cy.get('[name="school_journey"]').select(testNNA.school_journey)
      
      // Agregar notas de adaptación
      cy.get('[name="school_adaptation_notes"]')
        .clear()
        .type(testNNA.adaptation_notes)
      
      // Verificar validación
      cy.contains('✓ La información escolar está completa')
        .should('be.visible')
      
      cy.contains('button', 'Siguiente →').click()
      
      // ===== PASO 4: PERFIL MÉDICO =====
      cy.log('🏥 PASO 4: Completando Perfil Médico')
      
      cy.get('.step-indicator.active').should('contain', '4')
      
      // Alergias
      cy.get('[name="allergies"]')
        .clear()
        .type(testNNA.allergies)
      
      // Medicación actual
      cy.get('[name="current_medication"]')
        .clear()
        .type(testNNA.current_medication)
      
      // Contacto de emergencia
      cy.get('[name="emergency_contact"]')
        .clear()
        .type(testNNA.emergency_contact)
      
      // Teléfono de emergencia
      cy.get('[name="emergency_phone"]')
        .clear()
        .type(testNNA.emergency_phone)
      
      // Notas médicas
      cy.get('[name="medical_notes"]')
        .clear()
        .type(testNNA.medical_notes)
      
      // Verificar validación
      cy.contains('✓ Información médica completa')
        .should('be.visible')
      
      cy.contains('button', 'Siguiente →').click()
      
      // ===== PASO 5: NECESIDADES ESPECIALES =====
      cy.log('🧩 PASO 5: Completando Necesidades Especiales')
      
      cy.get('.step-indicator.active').should('contain', '5')
      
      // Seleccionar que SÍ presenta NEE
      cy.get('[name="special_needs"][value="true"]').click()
      
      // Esperar a que aparezca el campo de tipo de NEE
      cy.wait(500)
      
      // Seleccionar tipo de NEE
      cy.get('[name="special_needs_type"]').select(testNNA.special_needs_type)
      
      // Seleccionar nivel de autismo
      cy.get('[name="autism_level_value"]').select(testNNA.autism_level)
      
      // Verificar validación
      cy.contains('✓ Información de necesidades especiales completa')
        .should('be.visible')
      
      cy.contains('button', 'Siguiente →').click()
      
      // ===== PASO 6: HISTORIAL DE TERAPIAS =====
      cy.log('💊 PASO 6: Completando Historial de Terapias')
      
      cy.get('.step-indicator.active').should('contain', '6')
      
      // Seleccionar que SÍ ha recibido terapias
      cy.get('[name="has_previous_therapies"][value="true"]').click()
      
      // Esperar a que aparezca el campo de detalle
      cy.wait(500)
      
      // Completar detalle de terapias (mínimo 10 caracteres)
      cy.get('[name="therapies_detail"]')
        .clear()
        .type(testNNA.therapies_detail)
      
      // Seleccionar quién derivó
      cy.get('[name="referred_by"]').select(testNNA.referred_by)
      
      // Completar detalle de derivación
      cy.get('[name="referred_by_detail"]')
        .clear()
        .type(testNNA.referred_by_detail)
      
      // Seleccionar establecimiento anterior
      cy.get('[name="attended_where"]').select(testNNA.attended_where.toString())
      
      // Verificar validación
      cy.contains('✓ Información de historial completa', { timeout: 5000 })
        .should('be.visible')
      
      cy.contains('button', 'Siguiente →').click()
      
      // ===== PASO 7: CONSENTIMIENTO =====
      cy.log('📋 PASO 7: Completando Consentimiento del Apoderado')
      
      cy.get('.step-indicator.active').should('contain', '7')
      
      // Otorgar consentimiento
      cy.get('[name="guardian_consent"][value="true"]').click()
      
      // Esperar a que aparezca el campo de fecha
      cy.wait(500)
      
      // Completar fecha de consentimiento
      cy.get('[name="consent_date"]')
        .clear()
        .type(testNNA.consent_date)
      
      // Verificar validación
      cy.contains('✓ Consentimiento registrado correctamente')
        .should('be.visible')
      
      cy.contains('button', 'Siguiente →').click()
      
      // ===== PASO 8: PADRES/TUTORES =====
      cy.log('👨‍👩‍👧 PASO 8: Seleccionando Padres/Tutores')
      
      cy.get('.step-indicator.active').should('contain', '8')
      
      // Mostrar lista de padres existentes
      cy.contains('button', 'Mostrar Todos').click()
      
      // Esperar a que cargue la lista
      cy.wait(2000)
      
      // Buscar y seleccionar a Fernanda Espinoza (ID 15)
      // Podemos buscar por nombre
      cy.get('[name="filter_parents"]')
        .clear()
        .type('Fernanda Espinoza')
      
      // Esperar filtrado
      cy.wait(1000)
      
      // Click en el botón de agregar del padre correspondiente
      cy.contains('.parent-card', 'Fernanda')
        .find('button')
        .contains('Agregar')
        .click()
      
      // Verificar que se agregó
      cy.contains('Fernanda Espinoza')
        .should('be.visible')
      
      // Verificar validación del paso
      cy.wait(1000)
      
      cy.contains('button', 'Siguiente →').click()
      
      // ===== PASO 9: REVISIÓN FINAL =====
      cy.log('🔍 PASO 9: Revisión Final')
      
      cy.get('.step-indicator.active').should('contain', '9')
      
      // Verificar que se muestran los datos correctos
      cy.contains(testNNA.first_name).should('be.visible')
      cy.contains(testNNA.last_name).should('be.visible')
      cy.contains(testNNA.rut).should('be.visible')
      
      // Verificar validación final
      cy.contains('✓ Todo listo para registrar al niño/niña', { timeout: 5000 })
        .should('be.visible')
      
      // ===== ENVÍO FINAL =====
      cy.log('🚀 Enviando formulario...')
      
      // Interceptar la llamada al API
      cy.intercept('POST', `${API_BASE}/ingreso/crear/`).as('crearNNA')
      
      // Click en registrar
      cy.contains('button', '✅ Registrar Niño').click()
      
      // Esperar respuesta del servidor
      cy.wait('@crearNNA', { timeout: 15000 }).then((interception) => {
        // Verificar que la petición fue exitosa
        expect(interception.response?.statusCode).to.eq(201)
        
        // Verificar estructura de la respuesta
        const response = interception.response?.body
        expect(response).to.have.property('nombre')
        expect(response).to.have.property('rut')
        
        cy.log('✅ NNA creado exitosamente:', response)
      })
      
      // Verificar que se muestra el modal de éxito
      cy.contains('¡Registro Exitoso!', { timeout: 10000 })
        .should('be.visible')
      
      cy.contains('Isabella Espinoza Muñoz')
        .should('be.visible')
      
      // Verificar que se cerró el modal del formulario
      cy.get('.nna-form-container').should('not.exist')
      
      // Cerrar modal de éxito
      cy.contains('button', 'Cerrar').click()
      
      // Verificar que volvemos al dashboard
      cy.url().should('include', '/ingreso-nna')
      
      // Verificar que el nuevo NNA aparece en la tabla
      cy.contains('Isabella').should('be.visible')
      
      cy.log('✅ Test completado exitosamente')
    })
  })

  describe('Validaciones de Campos', () => {
    beforeEach(() => {
      cy.contains('Ingreso NNA').click()
      cy.contains('button', 'Agregar Nuevo NNA').click()
      cy.get('.modal-container').should('be.visible')
    })

    it('Debería validar campos obligatorios en Paso 1', () => {
      // Intentar avanzar sin completar campos
      cy.contains('button', 'Siguiente →').should('be.disabled')
      
      // Completar solo nombre
      cy.get('[name="first_name"]').type('Test')
      cy.contains('button', 'Siguiente →').should('be.disabled')
      
      // Completar apellido
      cy.get('[name="last_name"]').type('Usuario')
      cy.contains('button', 'Siguiente →').should('be.disabled')
      
      // RUT inválido
      cy.get('[name="rut"]').type('12345678-9').blur()
      cy.contains('RUT válido y disponible').should('not.exist')
    })

    it('Debería validar formato de RUT', () => {
      // RUT sin formato
      cy.get('[name="rut"]').type('209998882').blur()
      cy.wait(500)
      
      // Debería formatearse automáticamente
      cy.get('[name="rut"]').should('have.value', '20.999.888-2')
    })

    it('Debería validar fecha de nacimiento futura', () => {
      // Fecha futura
      const futureDate = new Date()
      futureDate.setFullYear(futureDate.getFullYear() + 1)
      const futureDateStr = futureDate.toISOString().split('T')[0]
      
      cy.get('[name="birth_date"]').type(futureDateStr)
      
      cy.contains('La fecha debe ser anterior a hoy')
        .should('be.visible')
    })
  })

  describe('Navegación entre Pasos', () => {
    beforeEach(() => {
      cy.contains('Ingreso NNA').click()
      cy.contains('button', 'Agregar Nuevo NNA').click()
      cy.get('.modal-container').should('be.visible')
    })

    it('Debería permitir navegar hacia atrás', () => {
      // Completar paso 1
      cy.get('[name="first_name"]').type('Test')
      cy.get('[name="last_name"]').type('Usuario')
      cy.get('[name="rut"]').type('20.999.888-2').blur()
      cy.wait(2000) // Esperar validación
      cy.get('[name="birth_date"]').type('2015-01-01')
      
      // Avanzar al paso 2
      cy.contains('button', 'Siguiente →').click()
      cy.get('.step-indicator.active').should('contain', '2')
      
      // Volver al paso 1
      cy.contains('button', '← Anterior').click()
      cy.get('.step-indicator.active').should('contain', '1')
      
      // Los datos deben persistir
      cy.get('[name="first_name"]').should('have.value', 'Test')
    })

    it('Debería permitir hacer click en pasos completados', () => {
      // Completar paso 1 rápidamente
      cy.get('[name="first_name"]').type('Test')
      cy.get('[name="last_name"]').type('Usuario')
      cy.get('[name="rut"]').type('20.999.888-2').blur()
      cy.wait(2000)
      cy.get('[name="birth_date"]').type('2015-01-01')
      
      cy.contains('button', 'Siguiente →').click()
      
      // Hacer click en el paso 1 desde el header
      cy.get('.step-indicator').contains('1').click()
      cy.get('.step-indicator.active').should('contain', '1')
    })
  })

  describe('Búsqueda de Padres', () => {
    beforeEach(() => {
      cy.contains('Ingreso NNA').click()
      cy.contains('button', 'Agregar Nuevo NNA').click()
      
      // Navegar rápidamente al paso 8
      // (en un test real deberías completar todos los pasos previos)
      cy.get('.step-indicator').contains('8').click()
    })

    it('Debería buscar padres por RUT', () => {
      // Buscar por RUT de Fernanda Espinoza
      cy.get('[name="parent_search_rut"]').type('15.234.567-8')
      cy.contains('button', '🔍 Buscar').click()
      
      cy.wait(2000)
      
      // Debería mostrar resultados
      cy.contains('.parent-card', 'Fernanda')
        .should('be.visible')
    })

    it('Debería buscar padres por nombre', () => {
      cy.get('[name="parent_search_name"]').type('Fernanda')
      cy.contains('button', '🔍 Buscar').click()
      
      cy.wait(2000)
      
      cy.contains('.parent-card', 'Fernanda')
        .should('be.visible')
    })

    it('Debería mostrar mensaje si no hay resultados', () => {
      cy.get('[name="parent_search_rut"]').type('99.999.999-9')
      cy.contains('button', '🔍 Buscar').click()
      
      cy.wait(2000)
      
      cy.contains('No se encontraron resultados')
        .should('be.visible')
    })
  })

  describe('Crear Nuevo Padre', () => {
    beforeEach(() => {
      cy.contains('Ingreso NNA').click()
      cy.contains('button', 'Agregar Nuevo NNA').click()
      cy.get('.step-indicator').contains('8').click()
    })

    it('Debería permitir crear un nuevo padre', () => {
      const newParent = {
        first_name: 'Nuevo',
        last_name: 'Padre Test',
        rut: '19.888.777-6',
        email: `padre.test.${Date.now()}@email.com`,
        phone: '+56988887777',
        username: `padre.test.${Date.now()}`,
        password: 'Password123!'
      }

      // Abrir formulario de creación
      cy.contains('button', '👤 Crear Nuevo Padre').click()
      
      // Completar formulario
      cy.get('[name="first_name"]').type(newParent.first_name)
      cy.get('[name="last_name"]').type(newParent.last_name)
      cy.get('[name="rut"]').type(newParent.rut).blur()
      
      cy.wait(2000) // Esperar validación de RUT
      
      cy.get('[name="email"]').type(newParent.email)
      cy.get('[name="username"]').clear().type(newParent.username)
      cy.get('[name="phone"]').type(newParent.phone)
      cy.get('[name="password"]').type(newParent.password)
      cy.get('[name="password_confirm"]').type(newParent.password)
      
      // Interceptar creación
      cy.intercept('POST', `${API_BASE}/user/create-parent/`).as('crearPadre')
      
      // Enviar
      cy.contains('button', '✅ Crear y Agregar Padre').click()
      
      // Esperar respuesta
      cy.wait('@crearPadre', { timeout: 10000 }).then((interception) => {
        expect(interception.response?.statusCode).to.eq(201)
      })
      
      // Verificar que se agregó a la lista
      cy.contains(newParent.first_name).should('be.visible')
    })
  })

  describe('Persistencia de Borradores', () => {
    it('Debería guardar borradores automáticamente', () => {
      cy.contains('Ingreso NNA').click()
      cy.contains('button', 'Agregar Nuevo NNA').click()
      
      // Completar parcialmente el paso 1
      cy.get('[name="first_name"]').type('Borrador')
      cy.get('[name="last_name"]').type('Test')
      
      // Esperar guardado automático
      cy.wait(4000)
      
      // Verificar indicador de guardado
      cy.contains('Guardando...').should('not.exist')
      
      // Cerrar modal
      cy.contains('button', 'Cancelar').click()
      
      // Reabrir modal
      cy.contains('button', 'Agregar Nuevo NNA').click()
      
      // Debería mostrar opción de recuperar borrador
      cy.contains('Recuperar borrador', { timeout: 5000 })
        .should('be.visible')
    })
  })

  afterEach(() => {
    // Limpiar después de cada test
    cy.clearAuth()
  })
})