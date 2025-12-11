// src/types/nne.ts

/**
 * Representa la estructura de datos que se envía al backend
 * cuando se crea un nuevo NEE (Niño, Niña o Estudiante).
 * * Está dividido en pasos (1 a 4) para reflejar el formulario multipasos.
 */
export interface NneFormData {
  // Paso 1: Datos básicos del niño
  first_name: string              // Nombres del niño
  last_name: string               // Apellidos del niño
  rut: string                     // RUT en formato chileno (ej: 12.345.678-9)
  birth_date: string              // Fecha de nacimiento (ISO string: YYYY-MM-DD)
  gender: string                  // Género (ej: "male", "female", "other")
  street: string                  // Calle de residencia
  street_number: string           // Número de la calle
  region: number | null           // ✅ CORRECCIÓN: Añadido para coincidir con nneService.ts
  commune: number | null            // ID de la comuna (relación con tabla de comunas)
  establishment: number | null    // ID del establecimiento (si aplica)
  current_grade: string           // Curso actual (ej: "1° Básico")
  school_journey: string          // Jornada escolar (ej: "morning", "afternoon")
  school_adaptation_notes?: string // Notas de adaptación escolar (opcional)

  // Paso 2: Información médica y diagnósticos
  special_needs: boolean          // Indica si tiene necesidades especiales
  special_needs_type?: string    // Tipo de necesidad especial (ej: "permanent", "temporary")
  autism_level_value?: string    // Nivel de autismo (ej: "level_1", "level_2", "no_review")
  pie_diagnosis?: string           // Diagnóstico PIE (opcional)
  pie_entry_date?: string | null   // Fecha de ingreso al PIE (puede ser null)
  pie_status?: string              // Estado en PIE (ej: "active", "inactive")
  allergies?: string               // Alergias conocidas
  current_medication?: string    // Medicación actual
  emergency_contact?: string       // Nombre del contacto de emergencia
  emergency_phone?: string         // Teléfono del contacto de emergencia
  medical_notes?: string           // Notas médicas adicionales

  // Paso 3: Padres/Tutores asociados
  usuarios: number[]              // IDs de usuarios con rol "Padres" asociados al niño

  // Paso 4: Consentimiento y antecedentes
  guardian_consent: boolean       // Consentimiento del apoderado (true/false)
  consent_date?: string | null     // Fecha del consentimiento (ISO string o null)
  previous_therapies: boolean     // Indica si tuvo terapias previas
  previous_therapies_detail?: string // Detalle de terapias previas (opcional)
  referred_by?: string             // Quién refirió al niño (ej: "school", "doctor")
  referred_by_detail?: string    // Detalle de la referencia (ej: "Orientadora escolar")
  attended_where?: string          // Lugar donde asistió previamente
}

/**
 * Representa un usuario con rol "Padre".
 * Este tipo corresponde a lo que devuelve el backend
 * cuando se consulta o se asocia un padre existente.
 */
export interface ParentUser {
  id: number                      // ID único del padre en la base de datos
  username: string                // Nombre de usuario (login)
  email: string                   // Correo electrónico
  first_name: string              // Nombres
  last_name: string               // Apellidos
  rut: string                     // RUT del padre
  phone?: string                  // Teléfono de contacto (opcional)
  role?: string                   // ✅ CORRECCIÓN: Añadido para coincidir con nneService.ts
}

/**
 * Representa el payload necesario para crear un nuevo padre/tutor.
 * Se separa de `ParentUser` porque aquí sí se requiere `password`,
 * mientras que en la respuesta del backend nunca se expone.
 */
export interface ParentUserCreate {
  first_name: string              // Nombres
  last_name: string               // Apellidos
  rut: string                     // RUT
  email: string                   // Correo electrónico
  phone?: string                  // Teléfono (opcional)
  username: string                // Nombre de usuario (login)
  password: string                // Contraseña (requerida al crear)
}