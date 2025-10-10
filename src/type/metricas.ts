// src/types/metricas.ts

/**
 * Interfaces TypeScript para las métricas del dashboard
 * 
 * Estas interfaces definen la estructura de datos que esperamos 
 * del backend, asegurando type safety en todo el frontend
 */

export interface ResumenGeneral {
  total_ninos: number;
  con_necesidades_especiales: number;
  porcentaje_con_nee: number;
  en_programa_pie: number;
  nuevos_este_mes: number;
}

export interface PerfilClinico {
  nivel_autismo_1: number;
  nivel_autismo_2: number;
  nivel_autismo_3: number;
  nee_permanentes: number;
  nee_transitorias: number;
}

export interface GestionOperativa {
  sin_consentimiento: number;
  en_evaluacion_pie: number;
  con_medicacion_activa: number;
  con_alergias_registradas: number;
  sin_establecimiento: number;
}

export interface DistribucionDemografica {
  por_genero: {
    masculino: number;
    femenino: number;
    otro: number;
  };
  rango_etario: {
    '0_5': number;
    '6_12': number;
    '13_18': number;
  };
}

export interface MetricasData {
  resumen_general: ResumenGeneral;
  perfil_clinico: PerfilClinico;
  gestion_operativa: GestionOperativa;
  distribucion_demografica: DistribucionDemografica;
  metadata?: {
    ultima_actualizacion: string;
    usuario: string;
    total_filtrado: number;
  };
}

// Props para componentes
export interface MetricCardProps {
  titulo: string;
  valor: string | number;
  subtitulo?: string;
  tendencia?: 'positiva' | 'negativa' | 'neutral';
  icono?: string;
  loading?: boolean;
  color?: string;
}

export interface MetricCardGridProps {
  metricas: MetricasData | null;
  loading: boolean;
  error: string | null;
}