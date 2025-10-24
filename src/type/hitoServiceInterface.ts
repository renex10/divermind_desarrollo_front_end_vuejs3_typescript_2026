// src/type/hitoServiceInterface.ts

/**
 * Interface representing the data structure of a Milestone
 * as received from the backend API (matching DevelopmentMilestoneSerializer).
 */
export interface Milestone {
  id: number | string;
  child: number | string; // ID of the child
  date: string; // YYYY-MM-DD format
  age_at_milestone: string | null; // e.g., "7a 5m" or null
  category: string; // e.g., 'communication', 'motor'
  category_display: string; // e.g., 'Comunicación', 'Motor'
  description: string;
  observations: string | null;
  proficiency_level: string; // e.g., 'emerging', 'mastered'
  proficiency_level_display: string; // e.g., 'Emergente', 'Dominado'
  context: string; // e.g., 'therapy', 'home'
  context_display: string; // e.g., 'En terapia', 'En casa'
  support_level: string; // e.g., 'independent', 'verbal_cue'
  support_level_display: string; // e.g., 'Independiente', 'Indicación verbal'
  functional_impact: string | null;
  previous_records_count: number;
  registered_by: number | null; // ID of the user who registered
  registered_by_name: string | null; // Full name of the user
  created_at: string; // ISO 8601 date-time string
  // Add evidence_image: string | null; if you re-enable it later
}

/**
 * Interface representing the data structure for creating or updating
 * a Milestone (matching the fields the API expects in POST/PATCH).
 */
export interface MilestoneFormData {
  date: string; // YYYY-MM-DD format
  category: string;
  description: string;
  observations?: string | null; // Optional
  proficiency_level: string;
  context: string;
  support_level: string;
  functional_impact?: string | null; // Optional
  // Add evidence_image?: File | null; if you re-enable it later
}