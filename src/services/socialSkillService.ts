// src/services/socialSkillService.ts
import http from '@/services/http';
import type { SocialSkill } from '@/type/socialSkill';

class SocialSkillService {
    /**
     * Obtiene el historial de habilidades sociales de un niño
     */
    async getHistory(childId: number): Promise<SocialSkill[]> {
        const response = await http.get(`/seguimiento/ninos/${childId}/habilidades-sociales/`);
        return response.data;
    }

    /**
     * Registra una nueva interacción social
     */
    async create(childId: number, data: Partial<SocialSkill>): Promise<SocialSkill> {
        const response = await http.post(`/seguimiento/ninos/${childId}/habilidades-sociales/`, data);
        return response.data;
    }

    /**
     * ✅ NUEVO: Actualiza un registro existente
     * PUT/PATCH /api/seguimiento/ninos/{childId}/habilidades-sociales/{skillId}/
     */
    async update(childId: number, skillId: number, data: Partial<SocialSkill>): Promise<SocialSkill> {
        // Usamos PATCH para actualizar solo los campos que cambiaron (o todos los enviados)
        const response = await http.patch(`/seguimiento/ninos/${childId}/habilidades-sociales/${skillId}/`, data);
        return response.data;
    }

    /**
     * ✅ NUEVO: Elimina un registro (Ya que estamos aquí, completemos el CRUD)
     */
    async delete(childId: number, skillId: number): Promise<void> {
        await http.delete(`/seguimiento/ninos/${childId}/habilidades-sociales/${skillId}/`);
    }
}

export default new SocialSkillService();