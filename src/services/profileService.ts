// src/services/profileService.ts
// ==================================================
// SERVICIO EXPANDIDO PARA TODOS LOS DATOS DEL PERFIL
// ==================================================
// OBJETIVO: Transformar todos los datos del API para las nuevas tarjetas
// ESTRUCTURA: API normalizada → Transformación completa → Componentes
// ==================================================

// src/services/profileService.ts
// src/services/profileService.ts
import http from './http';

export class ProfileService {
  
  async getChildProfile(id: string) {
    try {
      const response = await http.get(`/ingreso/ver/${id}/`);
      const apiData = response.data;
      
      console.log('📦 Datos completos del API:', apiData);
      
      return this.transformCompleteData(apiData);
      
    } catch (error) {
      console.error('❌ Error en ProfileService:', error);
      throw error;
    }
  }
  
  private transformCompleteData(apiData: any) {
    return {
      // 🎯 DATOS PARA EL HEADER
      header: {
        first_name: apiData.personal_profile?.first_name || '',
        last_name: apiData.personal_profile?.last_name || '',  
        rut: apiData.personal_profile?.rut || '',
        age: apiData.personal_profile?.age || 0,
        grade: apiData.school_info?.current_grade || '',
        autism_level: apiData.special_needs_info?.autism_level_display || 'Sin revisión'
      },

      // 🃏 DATOS PARA TODAS LAS TARJETAS
      cards: {
        // 📋 Información Personal
        personal: {
          full_name: apiData.personal_profile?.full_name,
          rut: apiData.personal_profile?.rut,
          birth_date: this.formatDate(apiData.personal_profile?.birth_date),
          age: apiData.personal_profile?.age,
          gender: this.formatGender(apiData.personal_profile?.gender),
          created_at: this.formatDateTime(apiData.personal_profile?.created_at)
        },

        // 🧩 Necesidades Especiales
        special_needs: {
          has_special_needs: apiData.special_needs_info?.has_special_needs,
          special_needs_type: apiData.special_needs_info?.special_needs_type_display,
          autism_level: apiData.special_needs_info?.autism_level_display,
          created_at: this.formatDateTime(apiData.special_needs_info?.created_at)
        },

        // 📝 Registro PIE
        pie: {
          diagnosis: apiData.pie_record?.diagnosis,
          entry_date: this.formatDate(apiData.pie_record?.entry_date),
          status: apiData.pie_record?.status_display,
          created_at: this.formatDateTime(apiData.pie_record?.created_at)
        },

        // 🏥 Información Médica
        medical: {
          allergies: apiData.medical_profile?.allergies || 'No registra',
          current_medication: apiData.medical_profile?.current_medication || 'No registra',
          emergency_contact: apiData.medical_profile?.emergency_contact,
          emergency_phone: apiData.medical_profile?.emergency_phone,
          medical_notes: apiData.medical_profile?.medical_notes,
          has_allergies: apiData.medical_profile?.has_allergies,
          has_medication: apiData.medical_profile?.has_medication,
          created_at: this.formatDateTime(apiData.medical_profile?.created_at)
        },

        // 🏫 Información Escolar
        school: {
          current_grade: apiData.school_info?.current_grade,
          school_journey: apiData.school_info?.school_journey_display,
          adaptation_notes: apiData.school_info?.adaptation_notes,
          created_at: this.formatDateTime(apiData.school_info?.created_at)
        },

        // 👨‍👩‍👧‍👦 Información del Tutor
        guardian: {
          guardian_consent: apiData.guardian_info?.guardian_consent ? 'Sí' : 'No',
          consent_date: this.formatDate(apiData.guardian_info?.consent_date),
          usuarios_info: apiData.usuarios_info || [],
          created_at: this.formatDateTime(apiData.guardian_info?.created_at)
        },

        // 🧪 Historial de Terapias
        therapy: {
          has_previous_therapies: apiData.therapy_history?.has_previous_therapies ? 'Sí' : 'No',
          therapies_detail: apiData.therapy_history?.therapies_detail,
          referred_by: apiData.therapy_history?.referred_by_display,
          referred_by_detail: apiData.therapy_history?.referred_by_detail,
          attended_where: apiData.therapy_history?.attended_where_name,
          created_at: this.formatDateTime(apiData.therapy_history?.created_at)
        },

        // 📍 Información de Ubicación
        location: {
          establishment: apiData.establishment_detail?.name,
          street: apiData.street,
          street_number: apiData.street_number,
          full_address: apiData.full_address,
          commune: apiData.commune_detail?.name,
          region: apiData.region_detail?.name
        }
      },

      // 📞 CONTACTOS DE EMERGENCIA (nuevo)
      emergencyContacts: this.extractEmergencyContacts(apiData)
    };
  }

  /**
   * 🆕 Extraer contactos de emergencia del perfil médico
   */
  private extractEmergencyContacts(apiData: any): any[] {
    const contacts: any[] = [];
    
    // Contacto desde medical_profile
    if (apiData.medical_profile?.emergency_contact) {
      contacts.push({
        id: 1,
        name: apiData.medical_profile.emergency_contact,
        relationship: 'Contacto de Emergencia',
        phone: apiData.medical_profile.emergency_phone || 'No especificado'
      });
    }

    // Contactos desde usuarios_info (tutores/apoderados)
    if (apiData.usuarios_info && Array.isArray(apiData.usuarios_info)) {
      apiData.usuarios_info.forEach((usuario: any, index: number) => {
        contacts.push({
          id: index + 2,
          name: usuario.full_name,
          relationship: 'Apoderado',
          phone: usuario.phone || usuario.email || 'No especificado',
          email: usuario.email
        });
      });
    }

    console.log('📞 Contactos de emergencia extraídos:', contacts);
    return contacts;
  }

  private formatDate(dateString: string): string {
    if (!dateString) return 'No especificada';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-CL');
    } catch {
      return dateString;
    }
  }

  private formatDateTime(dateTimeString: string): string {
    if (!dateTimeString) return 'No especificada';
    
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString('es-CL');
    } catch {
      return dateTimeString;
    }
  }

  private formatGender(gender: string): string {
    const genderMap: { [key: string]: string } = {
      'male': 'Masculino',
      'female': 'Femenino', 
      'other': 'Otro',
      'unspecified': 'No especificado'
    };
    
    return genderMap[gender] || 'No especificado';
  }
}

export const profileService = new ProfileService();