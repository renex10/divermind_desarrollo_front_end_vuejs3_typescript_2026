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
     * Obtiene estadísticas rápidas (si tu backend tiene un endpoint para esto, 
     * si no, lo calcularemos en el frontend por ahora)
     */
    async getStats(childId: number): Promise<any> {
        // Asumiendo que podrías implementar un endpoint de metricas en el futuro
        // Por ahora retornamos el listado para calcular localmente
        return this.getHistory(childId);
    }
}

export default new SocialSkillService();