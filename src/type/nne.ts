// src/type/nne.ts

/**
 * ✅ VERSIÓN FINAL CORREGIDA
 * Tipos actualizados para evitar conflictos con {value, label}
 * ✅ Agregado tipo Establishment completo
 */

/**
 * Representa la estructura de datos que se maneja en el frontend
 * para el formulario multipasos de NEE.
 */
export interface NneFormData {
  // Paso 1: Datos básicos del niño
  first_name: string;
  last_name: string;
  rut: string;
  birth_date: string;
  gender: string;
  
  // ✅ Nota: Estos campos existen en el Formulario para compatibilidad, 
  // pero el Service enviará solo el 'establishment' al backend normalizado.
  street: string;
  street_number: string;
  region: number | null;
  commune: number | null;
  
  establishment: number | null; // ID del establecimiento seleccionado
  current_grade: string;
  school_journey: string;
  school_adaptation_notes?: string;

  // Paso 2: Información médica y diagnósticos
  special_needs: boolean;
  special_needs_type?: string;
  autism_level_value?: string;
  pie_diagnosis?: string;
  pie_entry_date?: string | null;
  pie_status?: string;
  allergies?: string;
  current_medication?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  medical_notes?: string;

  // Paso 3: Padres/Tutores asociados
  usuarios: number[]; // IDs de padres

  // Paso 4: Consentimiento y antecedentes
  guardian_consent: boolean;
  consent_date?: string | null;
  previous_therapies: boolean;
  previous_therapies_detail?: string;
  referred_by?: string;
  referred_by_detail?: string;
  attended_where?: string | number | null;
}

/**
 * ✅ Tipo para opciones de select (usado en servicios)
 * Este es el formato que devuelven las APIs y que usan los componentes
 */
export interface SelectOption {
  value: number;
  label: string;
}

/**
 * Interfaces adicionales necesarias para la coherencia del sistema
 * (Regiones, Comunas y Establecimientos)
 * 
 * ⚠️ IMPORTANTE: Estos tipos son para los datos RAW del backend,
 * NO para los selects del frontend (usa SelectOption para eso)
 */
export interface Region {
  id: number;
  name: string;
  code?: string;
}

export interface Commune {
  id: number;
  name: string;
  region_id: number;
}

/**
 * ✅ NUEVO: Tipo completo para Establishment desde el backend
 * Usado en searchEstablishmentsFullApi y getEstablishmentDetailApi
 */
export interface Establishment {
  id: number;
  name: string;
  rbd: string | null;
  address: string;
  street_number: string | null;  // ✅ AGREGADO
  commune: number;
  region: number;
  establishment_type: number;
  establishment_type_detail?: { 
    id: number; 
    name: string; 
    description?: string;
  };
  commune_detail?: { 
    id: number; 
    name: string;
  };
  region_detail?: { 
    id: number; 
    name: string;
  };
  phone?: string;
  email?: string;
  website?: string;
  is_active?: boolean;
  full_address?: string;  // ✅ Campo calculado del backend
  created_at?: string;
  updated_at?: string;
}

/**
 * ✅ DEPRECADO: Usar Establishment en su lugar
 * Mantenido por compatibilidad temporal
 */
export interface EstablishmentSearchResult {
  id: number;
  name: string;
  rbd: string | null;
  address: string;
  street_number: string | null;
  commune: number;
  region: number;
  commune_detail?: { id: number; name: string };
  region_detail?: { id: number; name: string };
  establishment_type_detail?: { id: number; name: string; description?: string };
}

/**
 * Representa un usuario con rol "Padre".
 */
export interface ParentUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  rut: string;
  phone?: string;
  role?: string;
}

/**
 * Payload para crear un nuevo padre/tutor.
 */
export interface ParentUserCreate {
  first_name: string;
  last_name: string;
  rut: string;
  email: string;
  phone?: string;
  username: string;
  password: string;
}