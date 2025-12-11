// src/type/socialSkill.ts

export interface SocialSkill {
    id?: number;
    child?: number;
    
    // Campos obligatorios según Swagger
    date: string; // "YYYY-MM-DD"
    skill_category: 
        | 'eye_contact' 
        | 'turn_taking' 
        | 'sharing' 
        | 'greeting' 
        | 'requesting' 
        | 'joint_attention' 
        | 'emotion_recognition' 
        | 'empathy' 
        | 'conversation' 
        | 'play_cooperative' 
        | 'conflict_resolution' 
        | 'friendship' 
        | 'other';
        
    description: string;
    
    level: 'beginner' | 'intermediate' | 'advanced';
    
    initiated_by_child: boolean;
    
    interaction_partner: 
        | 'therapist' 
        | 'peer' 
        | 'group' 
        | 'parent' 
        | 'sibling' 
        | 'teacher' 
        | 'other_adult';
        
    needed_prompting: boolean;
    
    duration_minutes?: number | null; // Opcional, pero vital para pares
    
    was_successful: boolean;
    
    social_context?: string; // Opcional, pero vital si falla

    // Campos de solo lectura (respuesta del backend)
    skill_category_display?: string;
    level_display?: string;
    interaction_partner_display?: string;
    is_peer_interaction?: boolean;
    is_independent_interaction?: boolean;
}