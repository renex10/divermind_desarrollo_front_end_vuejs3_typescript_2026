// src/services/hitosService.ts

import http from './http'; // Adjust path to your configured HTTP client (e.g., axios instance)
import type { Milestone, MilestoneFormData } from '@/type/hitoServiceInterface'; // Import interfaces

const BASE_URL = '/seguimiento/ninos'; // Base URL part for children

/**
 * Fetches all milestones for a specific child.
 * GET /api/seguimiento/ninos/{childId}/hitos-desarrollo/
 */
async function getMilestones(childId: number | string): Promise<Milestone[]> {
  try {
    const response = await http.get<Milestone[]>(`${BASE_URL}/${childId}/hitos-desarrollo/`);
    // Sort by date descending before returning
    return response.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error(`Error fetching milestones for child ${childId}:`, error);
    throw error; // Re-throw to be handled by the component
  }
}

/**
 * Creates a new milestone for a specific child.
 * POST /api/seguimiento/ninos/{childId}/hitos-desarrollo/
 */
async function createMilestone(childId: number | string, data: MilestoneFormData): Promise<Milestone> {
  try {
    // Note: If handling file uploads (evidence_image), you'd need FormData
    // const formData = new FormData();
    // Object.entries(data).forEach(([key, value]) => {
    //   if (value !== null && value !== undefined) {
    //     if (key === 'evidence_image' && value instanceof File) {
    //       formData.append(key, value, value.name);
    //     } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    //       formData.append(key, String(value));
    //     }
    //   }
    // });
    // const response = await http.post<Milestone>(`${BASE_URL}/${childId}/hitos-desarrollo/`, formData, {
    //   headers: { 'Content-Type': 'multipart/form-data' },
    // });

    // Without file upload:
    const response = await http.post<Milestone>(`${BASE_URL}/${childId}/hitos-desarrollo/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error creating milestone for child ${childId}:`, error);
    throw error;
  }
}

/**
 * Updates an existing milestone.
 * PATCH /api/seguimiento/ninos/{childId}/hitos-desarrollo/{milestoneId}/
 */
async function updateMilestone(childId: number | string, milestoneId: number | string, data: Partial<MilestoneFormData>): Promise<Milestone> {
  try {
    // Similar logic for FormData if handling file uploads needed here too
    const response = await http.patch<Milestone>(`${BASE_URL}/${childId}/hitos-desarrollo/${milestoneId}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating milestone ${milestoneId} for child ${childId}:`, error);
    throw error;
  }
}

/**
 * Deletes a milestone.
 * DELETE /api/seguimiento/ninos/{childId}/hitos-desarrollo/{milestoneId}/
 */
async function deleteMilestone(childId: number | string, milestoneId: number | string): Promise<void> {
  try {
    await http.delete(`${BASE_URL}/${childId}/hitos-desarrollo/${milestoneId}/`);
  } catch (error) {
    console.error(`Error deleting milestone ${milestoneId} for child ${childId}:`, error);
    throw error;
  }
}

// Optional: Get a single milestone
/**
 * Fetches details for a single milestone.
 * GET /api/seguimiento/ninos/{childId}/hitos-desarrollo/{milestoneId}/
 */
async function getMilestoneById(childId: number | string, milestoneId: number | string): Promise<Milestone> {
  try {
    const response = await http.get<Milestone>(`${BASE_URL}/${childId}/hitos-desarrollo/${milestoneId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching milestone ${milestoneId} for child ${childId}:`, error);
    throw error;
  }
}


// Export all functions
export const hitosService = {
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  getMilestoneById, // optional
};