// src/composables/useRutValidation.ts

import { ref, computed, watch } from 'vue';
import { validarRut, validarRutProgresivo, formatearRut, type RutValidationResult } from '@/utils/rutValidator';
import { validateChildRutApi } from '@/services/nneService';

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
// En useRutValidation.ts - MODIFICAR la función checkRutAvailability

const checkRutAvailability = async (rut: string = rutValue.value): Promise<boolean> => {
  // ✅ MEJORADO: Validación más estricta para RUT obligatorio
  if (!rut || rut.trim() === '') {
    availabilityError.value = 'El RUT es obligatorio para el registro de niños'
    isAvailable.value = false
    lastCheckedRut.value = ''
    return false
  }

  // ✅ NUEVO: Validación de formato más estricta
  const validation = validarRut(rut)
  if (!validation.isValid && !validation.isPartial) {
    availabilityError.value = validation.message || 'Formato de RUT inválido'
    isAvailable.value = false
    lastCheckedRut.value = ''
    return false
  }

  // No verificar disponibilidad para RUTs parciales
  if (validation.isPartial) {
    availabilityError.value = null
    isAvailable.value = null
    lastCheckedRut.value = ''
    return false
  }

  // ✅ VERIFICACIÓN: Usar el nuevo endpoint específico para niños
  if (rut === lastCheckedRut.value && isAvailable.value !== null) {
    console.log('⚡ RUT ya verificado recientemente, usando cache:', rut)
    return isAvailable.value
  }

  lastCheckedRut.value = rut
  isCheckingAvailability.value = true
  availabilityError.value = null

  try {
    console.log('🔍 Verificando disponibilidad del RUT para niño:', rut)
    
    // ✅ CAMBIO: Usar la nueva función específica para niños
    const validationResult = await validateChildRutApi(validation.rutNormalized!)
    
    console.log('✅ Resultado validación RUT niño:', validationResult)
    
    isAvailable.value = validationResult.isAvailable
    
    if (!validationResult.isValid) {
      availabilityError.value = validationResult.message || 'RUT inválido'
      isAvailable.value = false
    } else if (!validationResult.isAvailable) {
      availabilityError.value = 'El RUT ya está registrado para otro niño en el sistema'
    } else {
      availabilityError.value = null
    }
    
    return validationResult.isValid && validationResult.isAvailable
  } catch (error: any) {
    console.error('❌ Error verificando disponibilidad de RUT para niño:', error)
    
    // ✅ MEJORADO: Manejo específico de errores para ingreso_fichas
    if (error?.response?.status === 400) {
      // Error de validación del backend
      const errorData = error.response.data
      if (errorData.rut) {
        availabilityError.value = Array.isArray(errorData.rut) 
          ? errorData.rut[0] 
          : errorData.rut
      } else {
        availabilityError.value = 'Error validando el RUT'
      }
    } else if (error?.response?.status === 404) {
      // Endpoint no disponible, usar validación local
      availabilityError.value = null
      isAvailable.value = true // Asumir disponible temporalmente
      return true
    } else {
      availabilityError.value = 'Error al verificar disponibilidad del RUT'
      isAvailable.value = false
    }
    
    lastCheckedRut.value = ''
    return false
  } finally {
    isCheckingAvailability.value = false
  }
}

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