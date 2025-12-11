// src/type/parent.ts

/**
 * Define la estructura de datos que devuelve el endpoint
 * GET /api/seguimiento/parent/latest-update/
 * * Basado en ParentLatestUpdateSerializer de Django.
 */
export interface LatestSessionUpdate {
  child_name: string
  therapist_full_name: string
  message: string
  session_date: string // string en formato ISO (ej: "2025-11-10T09:00:00Z")
}