import http from '@/services/http';
import type { SocialSkill } from '@/type/socialSkill';

// Interfaz para manejar la respuesta paginada de Django REST Framework
export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

class SocialSkillService {
    /**
     * Obtiene el historial de habilidades sociales de un niño con paginación.
     * * @param childId ID del niño
     * @param page Número de página actual (default: 1)
     * @param pageSize Cantidad de items por página (default: 5, ideal para tarjetas anchas)
     */
    async getHistory(childId: number, page: number = 1, pageSize: number = 5): Promise<PaginatedResponse<SocialSkill>> {
        const response = await http.get(`/seguimiento/ninos/${childId}/habilidades-sociales/`, {
            params: {
                page: page,
                page_size: pageSize
            }
        });
        
        // Manejo defensivo: Si por alguna razón el backend devuelve un array plano (sin paginación)
        if (Array.isArray(response.data)) {
            return {
                count: response.data.length,
                next: null,
                previous: null,
                results: response.data
            };
        }
        
        return response.data;
    }

    /**
     * Registra una nueva interacción social (CREATE)
     * POST /api/seguimiento/ninos/{child_pk}/habilidades-sociales/
     */
    async create(childId: number, data: Partial<SocialSkill>): Promise<SocialSkill> {
        const response = await http.post(`/seguimiento/ninos/${childId}/habilidades-sociales/`, data);
        return response.data;
    }

    /**
     * Actualiza un registro existente (UPDATE)
     * PATCH /api/seguimiento/ninos/{child_pk}/habilidades-sociales/{id}/
     */
    async update(childId: number, skillId: number, data: Partial<SocialSkill>): Promise<SocialSkill> {
        // Usamos PATCH para actualizar parcialmente solo los campos enviados
        const response = await http.patch(`/seguimiento/ninos/${childId}/habilidades-sociales/${skillId}/`, data);
        return response.data;
    }

    /**
     * Elimina un registro (DELETE)
     * DELETE /api/seguimiento/ninos/{child_pk}/habilidades-sociales/{id}/
     */
    async delete(childId: number, skillId: number): Promise<void> {
        await http.delete(`/seguimiento/ninos/${childId}/habilidades-sociales/${skillId}/`);
    }
}

export default new SocialSkillService();