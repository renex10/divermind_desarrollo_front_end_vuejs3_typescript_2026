// src/composables/useRutValidation.ts

import { ref, computed, watch } from 'vue';
import { validarRut, validarRutProgresivo, formatearRut, type RutValidationResult } from '@/utils/rutValidator';
import { checkRutAvailabilityApi } from '@/services/nneService';

/**
 * Composable para validación reactiva de RUT - VERSIÓN MEJORADA
 */
export function useRutValidation() {
  const rutValue = ref('');
  const rutValidation = ref<RutValidationResult | null>(null);
  const isCheckingAvailability = ref(false);
  const availabilityError = ref<string | null>(null);
  const isAvailable = ref<boolean | null>(null);
  const lastCheckedRut = ref<string>(''); // ✅ NUEVO: Track del último RUT verificado

  /**
   * Resetear estado de disponibilidad cuando el RUT cambia significativamente
   */
  watch(rutValue, (newRut, oldRut) => {
    // Si el RUT cambió completamente, resetear disponibilidad
    if (newRut !== oldRut && !isPartialRut(newRut)) {
      console.log('🔄 RUT cambiado, reseteando disponibilidad:', newRut);
      availabilityError.value = null;
      isAvailable.value = null;
      lastCheckedRut.value = '';
    }
  });

  /**
   * Determinar si un RUT es parcial (en proceso de escritura)
   */
  const isPartialRut = (rut: string): boolean => {
    const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '').trim();
    return rutLimpio.length > 0 && rutLimpio.length < 9;
  };

  /**
   * Validación sincrónica del RUT
   */
  const validateRutSync = (rut: string = rutValue.value): RutValidationResult => {
    console.log('🔄 Validando RUT:', rut || '<empty>');
    
    const result = validarRutProgresivo(rut);
    rutValidation.value = result;
    
    // ✅ MEJORADO: Resetear disponibilidad solo si el RUT cambió significativamente
    if ((!result.isPartial && !result.isValid) || rut !== rutValue.value) {
      availabilityError.value = null;
      isAvailable.value = null;
      lastCheckedRut.value = '';
    }
    
    return result;
  };

  /**
   * Validación asincrónica de disponibilidad del RUT - VERSIÓN MEJORADA
   */
  const checkRutAvailability = async (rut: string = rutValue.value): Promise<boolean> => {
    // ✅ NUEVO: Evitar verificaciones duplicadas del mismo RUT
    if (rut === lastCheckedRut.value && isAvailable.value !== null) {
      console.log('⚡ RUT ya verificado recientemente, usando cache:', rut);
      return isAvailable.value;
    }

    // Primero validar formato con validación estricta
    const validation = validarRut(rut);
    
    // No verificar disponibilidad para RUTs parciales
    if (validation.isPartial || !validation.isValid) {
      availabilityError.value = validation.isPartial ? null : (validation.message ?? null);
      isAvailable.value = false;
      lastCheckedRut.value = '';
      return false;
    }

    // ✅ NUEVO: Marcar que estamos verificando este RUT
    lastCheckedRut.value = rut;
    isCheckingAvailability.value = true;
    availabilityError.value = null;

    try {
      console.log('🔍 Verificando disponibilidad del RUT:', rut);
      const disponible = await checkRutAvailabilityApi(validation.rutNormalized!);
      
      console.log('✅ Resultado disponibilidad:', { rut, disponible });
      isAvailable.value = disponible;
      
      if (!disponible) {
        availabilityError.value = 'El RUT ya está registrado en el sistema';
      } else {
        availabilityError.value = null; // ✅ Limpiar error si ahora está disponible
      }
      
      return disponible;
    } catch (error: any) {
      console.error('❌ Error verificando disponibilidad de RUT:', error);
      
      // ✅ MEJORADO: Manejo específico de errores
      if (error?.response?.status === 404) {
        availabilityError.value = 'Servicio de verificación de RUT no disponible';
        isAvailable.value = null; // No marcar como no disponible
      } else if (error?.response?.status === 500) {
        availabilityError.value = 'Error del servidor al verificar RUT';
        isAvailable.value = null;
      } else {
        availabilityError.value = 'Error al verificar disponibilidad del RUT';
        isAvailable.value = false;
      }
      
      // ✅ En caso de error, resetear lastCheckedRut para permitir reintento
      lastCheckedRut.value = '';
      return false;
    } finally {
      isCheckingAvailability.value = false;
    }
  };

  /**
   * Forzar re-verificación de disponibilidad (ignorar cache)
   */
  const recheckAvailability = async (): Promise<boolean> => {
    console.log('🔄 Forzando re-verificación de RUT:', rutValue.value);
    lastCheckedRut.value = ''; // Resetear cache
    return await checkRutAvailability(rutValue.value);
  };

  /**
   * Formatear el RUT actual
   */
  const formatCurrentRut = (): string => {
    return formatearRut(rutValue.value);
  };

  /**
   * Actualizar valor del RUT
   */
  const setRutValue = (newValue: string) => {
    console.log('📝 Set RUT Value:', newValue || '<empty>');
    rutValue.value = newValue;
  };

  // Computed properties
  const isValid = computed(() => {
    return rutValidation.value?.isValid === true && 
           isAvailable.value !== false && 
           !availabilityError.value;
  });

  const isPartial = computed(() => {
    return rutValidation.value?.isPartial === true;
  });

  const hasSyncError = computed(() => {
    return rutValidation.value?.isValid === false && !rutValidation.value?.isPartial;
  });

  const hasAsyncError = computed(() => {
    return availabilityError.value !== null;
  });

  const errorMessage = computed(() => {
    if (rutValidation.value?.isPartial) return null;
    return rutValidation.value?.message || availabilityError.value;
  });

  const isLoading = computed(() => isCheckingAvailability.value);

  /**
   * Resetear el estado completamente
   */
  const reset = () => {
    rutValue.value = '';
    rutValidation.value = null;
    isCheckingAvailability.value = false;
    availabilityError.value = null;
    isAvailable.value = null;
    lastCheckedRut.value = '';
  };

  return {
    // Estado
    rutValue,
    rutValidation,
    isCheckingAvailability,
    availabilityError,
    isAvailable,
    
    // Métodos
    validateRutSync,
    checkRutAvailability,
    recheckAvailability, // ✅ NUEVO: Método para forzar re-verificación
    formatCurrentRut,
    setRutValue,
    reset,
    
    // Computados
    isValid,
    isPartial,
    hasSyncError,
    hasAsyncError,
    errorMessage,
    isLoading
  };
}

export default useRutValidation;