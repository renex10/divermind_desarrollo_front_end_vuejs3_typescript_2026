// src/types/parent.ts


export interface TimelineEvent {
  time_label: string;
  title: string;
  description: string;
  category: 'EMOCION' | 'LOGRO' | 'JUEGO' | 'DESAFIO' | string;
}

export interface LatestSessionUpdate {
  id: number;
  child_name: string;
  therapist_full_name: string;
  session_date: string;
  message: string;
  homework_assigned: string;
  next_session_focus: string;
  emotional_state_display: string;
  // ✅ AGREGAMOS ESTO: El array opcional de eventos
  timeline_events?: TimelineEvent[];
}