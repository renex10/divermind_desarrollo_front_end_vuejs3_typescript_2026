import http from './http';

export interface HeatMapData {
  step_id: number;
  step_action: string;
  friction_count: number; // Veces que se marcó 'had_difficulty'
  total_attempts: number;
  friction_rate: number;
}

export interface TimeEfficiencyData {
  step_action: string;
  avg_estimated_seconds: number;
  avg_real_seconds: number;
  deviation_percentage: number; // Requerimiento 1: Eficiencia
}

export interface RoutineAnalytics {
  heat_map: HeatMapData[];
  time_efficiency: TimeEfficiencyData[];
  support_evolution: any[];
}

export async function getRoutineAnalytics(childId: number): Promise<RoutineAnalytics> {
  const { data } = await http.get(`/seguimiento/ninos/${childId}/analiticas/rutinas/`);
  return data;
}