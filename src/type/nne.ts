// src/types/nne.ts
export interface NneFormData {
  // Paso 1
  first_name: string
  last_name: string
  rut: string
  birth_date: string
  gender: string
  street: string
  street_number: string
  commune: number | null
  establishment: number | null
  current_grade: string
  school_journey: string
  school_adaptation_notes: string

  // Paso 2
  special_needs: boolean
  special_needs_type: string
  autism_level_value: string
  pie_diagnosis: string
  pie_entry_date: string
  pie_status: string
  allergies: string
  current_medication: string
  emergency_contact: string
  emergency_phone: string
  medical_notes: string

  // Paso 3
  usuarios: number[]

  // Paso 4
  guardian_consent: boolean
  consent_date: string
  previous_therapies: boolean
  previous_therapies_detail: string
  referred_by: string
  referred_by_detail: string
  attended_where: string
}

export interface ParentUser {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  rut: string
  phone?: string
}