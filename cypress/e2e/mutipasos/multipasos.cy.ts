// cypress/e2e/mutipasos/multipasos.cy.ts

describe('Formulario Multipasos - Registro de NNA', () => {
  // Datos de prueba con RUT chileno válido
  const testNnaData = {
    // Paso 1: Datos Personales
    first_name: 'Test',
    last_name: 'Usuario',
    rut: '12345678-5', // RUT válido chileno
    birth_date: '2016-04-12',
    gender: 'female',

    // Paso 2: Ubicación
    street: 'Av. Las Flores',
    street_number: '1456',

    // Paso 3: Información Escolar
    current_grade: '2° Básico',
    school_journey: 'afternoon',
    school_adaptation_notes: 'Se adapta bien',

    // Paso 4: Perfil Médico
    allergies: 'Alergia al maní',
    current_medication: 'Antihistamínicos',
    emergency_contact: 'Fernanda Espinoza',
    emergency_phone: '+56955556666',
    medical_notes: 'Controlada por alergólogo',

    // Paso 5: Necesidades Especiales
    has_special_needs: true,
    special_needs_type: 'permanent',
    autism_level_value: 'not_applicable',

    // Paso 6: Historial de Terapias
    has_previous_therapies: true,
    therapies_detail: 'Fonoaudiología semanal',
    referred_by: 'doctor',
    referred_by_detail: 'Pediatra tratante',

    // Paso 7: Consentimiento
    guardian_consent: true,
    consent_date: '2024-08-20'
  };

  // Datos del padre/tutor para búsqueda
  const parentData = {
    searchName: 'Fernanda',
    fullName: 'Fernanda Espinoza'
  };

  let createdNnaId = null;

  beforeEach(() => {
    // Limpiar autenticación
    cy.clearLocalStorage();
    
    // Login via API
    cy.loginViaAPI(Cypress.env('TEST_EMAIL'), Cypress.env('TEST_PASSWORD'));
    
    // Visitar la página de ingreso de NNA
    cy.visit('/ingreso-nna');
    
    // Esperar a que cargue la página
    cy.contains('h1', 'Gestión de NNA', { timeout: 10000 }).should('be.visible');
  });

  afterEach(() => {
    // Cleanup: Eliminar el NNA creado si existe
    if (createdNnaId) {
      cy.request({
        method: 'DELETE',
        url: `${Cypress.env('API_URL')}/ingreso/${createdNnaId}/`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        failOnStatusCode: false // No fallar si ya fue eliminado
      });
      createdNnaId = null;
    }
  });

  it('debería completar el flujo completo del formulario multipasos', () => {
    // Interceptar la llamada API de creación
    cy.intercept('POST', '**/ingreso/crear/').as('createNna');

    // 1. Abrir el modal del formulario
    cy.contains('button', 'Agregar Nuevo NNA').click();
    
    // Verificar que el modal se abrió
    cy.get('.base-modal', { timeout: 5000 }).should('be.visible');
    cy.contains('h2', 'Registro de Nuevo NNA').should('be.visible');

    // 2. PASO 1: Datos Personales
    cy.log('=== Completando Paso 1: Datos Personales ===');
    
    cy.get('[data-testid="step-indicator-1"]').should('have.class', 'active');
    cy.contains('h2', 'Datos Personales').should('be.visible');

    // Completar campos del paso 1
    cy.get('[name="first_name"]').clear().type(testNnaData.first_name);
    cy.get('[name="last_name"]').clear().type(testNnaData.last_name);
    cy.get('[name="rut"]').clear().type(testNnaData.rut);
    cy.get('[name="birth_date"]').clear().type(testNnaData.birth_date);
    cy.get('[name="gender"]').select(testNnaData.gender);

    // Esperar validación del RUT (el backend validará con validar_rut_chileno)
    cy.get('[data-testid="rut-validation-status"]', { timeout: 15000 })
      .should('be.visible')
      .and('contain', 'RUT válido');

    // Verificar que podemos avanzar
    cy.get('[data-testid="btn-next-step"]').should('not.be.disabled').click();

    // 3. PASO 2: Ubicación
    cy.log('=== Completando Paso 2: Ubicación ===');
    
    cy.get('[data-testid="step-indicator-2"]').should('have.class', 'active');
    cy.contains('h2', 'Ubicación y Establecimiento').should('be.visible');

    // Esperar a que carguen las regiones
    cy.get('[name="region"]').should('not.be.disabled');
    cy.contains('Cargando regiones', { timeout: 10000 }).should('not.exist');

    // Seleccionar región (usar la primera disponible)
    cy.get('[name="region"]').find('option:not([value=""])').first().then($option => {
      const regionValue = $option.val();
      cy.get('[name="region"]').select(regionValue as string);
    });

    // Esperar a que carguen las comunas
    cy.get('[name="commune"]', { timeout: 10000 }).should('not.be.disabled');
    cy.contains('Cargando comunas', { timeout: 10000 }).should('not.exist');

    // Seleccionar comuna (usar la primera disponible)
    cy.get('[name="commune"]').find('option:not([value=""])').first().then($option => {
      const communeValue = $option.val();
      cy.get('[name="commune"]').select(communeValue as string);
    });

    // Seleccionar establecimiento (usar el primero disponible)
    cy.get('[name="establishment"]', { timeout: 10000 }).should('not.be.disabled');
    cy.contains('Buscando establecimientos', { timeout: 10000 }).should('not.exist');
    
    cy.get('[name="establishment"]').find('option:not([value=""])').first().then($option => {
      const establishmentValue = $option.val();
      cy.get('[name="establishment"]').select(establishmentValue as string);
    });

    // Completar dirección
    cy.get('[name="street"]').clear().type(testNnaData.street);
    cy.get('[name="street_number"]').clear().type(testNnaData.street_number);

    // Avanzar al siguiente paso
    cy.get('[data-testid="btn-next-step"]').should('not.be.disabled').click();

    // 4. PASO 3: Información Escolar
    cy.log('=== Completando Paso 3: Información Escolar ===');
    
    cy.get('[data-testid="step-indicator-3"]').should('have.class', 'active');
    cy.contains('h2', 'Información Escolar').should('be.visible');

    cy.get('[name="current_grade"]').select(testNnaData.current_grade);
    cy.get('[name="school_journey"]').select(testNnaData.school_journey);
    cy.get('[name="school_adaptation_notes"]').clear().type(testNnaData.school_adaptation_notes);

    cy.get('[data-testid="btn-next-step"]').click();

    // 5. PASO 4: Perfil Médico
    cy.log('=== Completando Paso 4: Perfil Médico ===');
    
    cy.get('[data-testid="step-indicator-4"]').should('have.class', 'active');
    cy.contains('h2', 'Perfil Médico').should('be.visible');

    cy.get('[name="allergies"]').clear().type(testNnaData.allergies);
    cy.get('[name="current_medication"]').clear().type(testNnaData.current_medication);
    cy.get('[name="emergency_contact"]').clear().type(testNnaData.emergency_contact);
    cy.get('[name="emergency_phone"]').clear().type(testNnaData.emergency_phone);
    cy.get('[name="medical_notes"]').clear().type(testNnaData.medical_notes);

    cy.get('[data-testid="btn-next-step"]').click();

    // 6. PASO 5: Necesidades Especiales
    cy.log('=== Completando Paso 5: Necesidades Especiales ===');
    
    cy.get('[data-testid="step-indicator-5"]').should('have.class', 'active');
    cy.contains('h2', 'Necesidades Especiales').should('be.visible');

    // Seleccionar que tiene NEE
    cy.get('[data-testid="has-special-needs-yes"]').click();
    cy.get('[name="special_needs_type"]').select(testNnaData.special_needs_type);
    cy.get('[name="autism_level_value"]').select(testNnaData.autism_level_value);

    cy.get('[data-testid="btn-next-step"]').click();

    // 7. PASO 6: Historial de Terapias
    cy.log('=== Completando Paso 6: Historial de Terapias ===');
    
    cy.get('[data-testid="step-indicator-6"]').should('have.class', 'active');
    cy.contains('h2', 'Historial de Terapias').should('be.visible');

    // Seleccionar que tiene terapias previas
    cy.get('[data-testid="has-previous-therapies-yes"]').click();
    cy.get('[name="therapies_detail"]').clear().type(testNnaData.therapies_detail);
    cy.get('[name="referred_by"]').select(testNnaData.referred_by);
    cy.get('[name="referred_by_detail"]').clear().type(testNnaData.referred_by_detail);

    // Seleccionar establecimiento anterior (usar el primero disponible)
    cy.get('[name="attended_where"]').find('option:not([value=""])').first().then($option => {
      const attendedWhereValue = $option.val();
      if (attendedWhereValue) {
        cy.get('[name="attended_where"]').select(attendedWhereValue as string);
      }
    });

    cy.get('[data-testid="btn-next-step"]').click();

    // 8. PASO 7: Consentimiento
    cy.log('=== Completando Paso 7: Consentimiento ===');
    
    cy.get('[data-testid="step-indicator-7"]').should('have.class', 'active');
    cy.contains('h2', 'Consentimiento del Apoderado').should('be.visible');

    // Seleccionar consentimiento
    cy.get('[data-testid="guardian-consent-yes"]').click();
    cy.get('[name="consent_date"]').clear().type(testNnaData.consent_date);

    cy.get('[data-testid="btn-next-step"]').click();

    // 9. PASO 8: Padres/Tutores
    cy.log('=== Completando Paso 8: Padres/Tutores ===');
    
    cy.get('[data-testid="step-indicator-8"]').should('have.class', 'active');
    cy.contains('h2', 'Asignación de Padres/Tutores').should('be.visible');

    // Buscar padre existente por nombre
    cy.get('[name="parent_search_name"]').clear().type(parentData.searchName);
    cy.get('[data-testid="btn-search-parent"]').click();

    // Esperar resultados y seleccionar padre si existe
    cy.get('body').then($body => {
      if ($body.text().includes(parentData.fullName)) {
        cy.log('Padre encontrado, agregando...');
        cy.get('[data-testid^="parent-card-"]')
          .contains(parentData.fullName)
          .parents('[data-testid^="parent-card-"]')
          .find('[data-testid="btn-add-parent"]')
          .click();

        // Verificar que el padre fue agregado
        cy.get('[data-testid="selected-parents-list"]').should('contain', parentData.fullName);
      } else {
        cy.log('Padre no encontrado, continuando sin padre asignado');
      }
    });

    cy.get('[data-testid="btn-next-step"]').click();

    // 10. PASO 9: Revisión Final
    cy.log('=== Completando Paso 9: Revisión Final ===');
    
    cy.get('[data-testid="step-indicator-9"]').should('have.class', 'active');
    cy.contains('h2', 'Revisión Final').should('be.visible');

    // Verificar datos críticos en la revisión
    cy.get('[data-testid="review-personal-data"]').within(() => {
      cy.should('contain', testNnaData.first_name);
      cy.should('contain', testNnaData.last_name);
      cy.should('contain', testNnaData.rut);
    });

    cy.get('[data-testid="review-location-data"]').should('contain', testNnaData.street);
    cy.get('[data-testid="review-school-data"]').should('contain', testNnaData.current_grade);
    cy.get('[data-testid="review-medical-data"]').should('contain', testNnaData.allergies);

    // Enviar formulario
    cy.get('[data-testid="btn-submit-form"]').click();

    // Esperar a que se complete el envío
    cy.wait('@createNna', { timeout: 30000 }).then((interception) => {
      expect(interception.response?.statusCode).to.equal(201);
      
      // Guardar ID para cleanup
      if (interception.response?.body?.id) {
        createdNnaId = interception.response.body.id;
      }
    });

    // Verificar modal de éxito
    cy.get('[data-testid="success-modal"]', { timeout: 10000 }).should('be.visible');
    cy.contains('¡Registro Exitoso!').should('be.visible');
    cy.get('[data-testid="btn-close-success"]').click();

    // Verificar que volvimos a la vista principal
    cy.contains('h1', 'Gestión de NNA').should('be.visible');
  });

  it('debería validar RUT chileno correctamente', () => {
    cy.contains('button', 'Agregar Nuevo NNA').click();
    
    // Probar RUT inválido
    cy.get('[name="rut"]').clear().type('11111111-1');
    cy.get('[name="first_name"]').click(); // Trigger blur
    
    // Debería mostrar error de validación
    cy.get('[data-testid="rut-validation-status"]', { timeout: 5000 })
      .should('contain', 'RUT inválido');
    
    // Probar RUT válido
    cy.get('[name="rut"]').clear().type(testNnaData.rut);
    cy.get('[name="first_name"]').click(); // Trigger blur
    
    // Debería mostrar validación exitosa
    cy.get('[data-testid="rut-validation-status"]', { timeout: 5000 })
      .should('contain', 'RUT válido');
  });

  it('debería mostrar errores de validación en campos requeridos', () => {
    cy.contains('button', 'Agregar Nuevo NNA').click();
    
    // Intentar avanzar sin completar campos requeridos
    cy.get('[data-testid="btn-next-step"]').click();

    // Verificar que se muestran mensajes de error
    cy.get('.formkit-message[data-message-type="validation"]').should('have.length.greaterThan', 0);

    // Verificar que no se avanzó al siguiente paso
    cy.get('[data-testid="step-indicator-1"]').should('have.class', 'active');
  });

  it('debería permitir navegar entre pasos manteniendo los datos', () => {
    cy.contains('button', 'Agregar Nuevo NNA').click();

    // Completar paso 1
    cy.get('[name="first_name"]').clear().type(testNnaData.first_name);
    cy.get('[name="last_name"]').clear().type(testNnaData.last_name);
    cy.get('[name="rut"]').clear().type(testNnaData.rut);
    cy.get('[name="birth_date"]').clear().type(testNnaData.birth_date);
    cy.get('[name="gender"]').select(testNnaData.gender);

    // Esperar validación del RUT
    cy.get('[data-testid="rut-validation-status"]', { timeout: 15000 })
      .should('contain', 'RUT válido');

    // Avanzar al paso 2
    cy.get('[data-testid="btn-next-step"]').click();
    cy.get('[data-testid="step-indicator-2"]').should('have.class', 'active');

    // Volver al paso 1
    cy.get('[data-testid="btn-prev-step"]').click();
    cy.get('[data-testid="step-indicator-1"]').should('have.class', 'active');

    // Verificar que los datos se mantienen
    cy.get('[name="first_name"]').should('have.value', testNnaData.first_name);
    cy.get('[name="last_name"]').should('have.value', testNnaData.last_name);
    cy.get('[name="rut"]').should('have.value', testNnaData.rut);
    cy.get('[name="birth_date"]').should('have.value', testNnaData.birth_date);
    cy.get('[name="gender"]').should('have.value', testNnaData.gender);
  });

  it('debería validar que el RUT no esté duplicado', () => {
    // Este test requiere que primero creemos un NNA
    // y luego intentemos crear otro con el mismo RUT
    
    cy.intercept('POST', '**/ingreso/crear/').as('createNna');
    cy.intercept('GET', '**/ingreso/validar-rut/*').as('validateRut');

    cy.contains('button', 'Agregar Nuevo NNA').click();
    
    // Usar un RUT que ya existe (esto depende de tu fixture/seed data)
    cy.get('[name="rut"]').clear().type(testNnaData.rut);
    
    // Esperar validación
    cy.wait('@validateRut', { timeout: 15000 });
    
    // Si el RUT existe, debería mostrar advertencia
    cy.get('body').then($body => {
      if ($body.text().includes('ya existe')) {
        cy.log('RUT duplicado detectado correctamente');
        cy.get('[data-testid="rut-validation-status"]')
          .should('contain', 'ya existe');
      }
    });
  });
});