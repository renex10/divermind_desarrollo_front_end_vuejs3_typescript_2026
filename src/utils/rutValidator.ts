// src/utils/rutValidator.ts

/**
 * Utilidades para validación y formateo de RUT chileno en el frontend
 */

export interface RutValidationResult {
  isValid: boolean;
  message?: string;
  rutNormalized?: string;
  rutFormatted?: string;
  calculatedDv?: string;
  inputDv?: string;
  isPartial?: boolean; // Nuevo: indica si es un RUT parcial (en escritura)
}

/**
 * Calcula el dígito verificador de un RUT chileno
 */
export function calcularDigitoVerificador(rutSinDv: string): string {
  const rutLimpio = rutSinDv.replace(/\D/g, '');
  
  let suma = 0;
  let multiplicador = 2;
  
  for (let i = rutLimpio.length - 1; i >= 0; i--) {
    suma += parseInt(rutLimpio.charAt(i)) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  
  const resto = suma % 11;
  const dvCalculado = 11 - resto;
  
  if (dvCalculado === 11) return '0';
  if (dvCalculado === 10) return 'K';
  return dvCalculado.toString();
}

/**
 * Valida un RUT chileno con soporte para escritura progresiva
 */
export function validarRut(rut: string): RutValidationResult {
  if (!rut || typeof rut !== 'string') {
    return {
      isValid: false,
      message: 'El RUT no puede estar vacío',
      isPartial: false
    };
  }

  // Limpiar y normalizar el RUT
  const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase().trim();
  
  // Si está completamente vacío después de limpiar
  if (rutLimpio.length === 0) {
    return {
      isValid: false,
      message: 'El RUT no puede estar vacío',
      isPartial: false
    };
  }

  // ✅ NUEVO: Validación progresiva - permitir escritura incompleta
  // Solo números mientras se escribe (sin DV todavía)
  if (/^\d{1,8}$/.test(rutLimpio)) {
    return {
      isValid: false, // No es válido aún, pero es un RUT parcial
      message: 'Continué escribiendo el RUT...',
      rutNormalized: rutLimpio,
      isPartial: true // Importante: indica que está en proceso
    };
  }

  // ✅ NUEVO: RUT con guión pero sin DV completo (ej: "12345678-")
  if (/^\d{7,8}-$/.test(rutLimpio)) {
    return {
      isValid: false,
      message: 'Falta el dígito verificador',
      rutNormalized: rutLimpio,
      isPartial: true
    };
  }

  // ✅ NUEVO: RUT con formato parcial con puntos (ej: "12.345.678-")
  if (/^\d{1,2}\.?\d{0,3}\.?\d{0,3}-?$/.test(rut) && rutLimpio.length < 9) {
    return {
      isValid: false,
      message: 'Continué escribiendo el RUT...',
      rutNormalized: rutLimpio,
      isPartial: true
    };
  }

  // Validación de formato completo (RUT terminado)
  if (!/^(\d{7,8})([0-9K])$/.test(rutLimpio)) {
    return {
      isValid: false,
      message: 'Formato de RUT inválido. Debe ser "12345678-9"',
      isPartial: false
    };
  }

  // Separar número y dígito verificador
  const numero = rutLimpio.slice(0, -1);
  const dvIngresado = rutLimpio.slice(-1);

  // Calcular dígito verificador
  const dvCalculado = calcularDigitoVerificador(numero);

  // Comparar dígitos verificadores
  if (dvCalculado !== dvIngresado) {
    return {
      isValid: false,
      message: `Dígito verificador incorrecto. Esperado '${dvCalculado}', recibido '${dvIngresado}'`,
      rutNormalized: `${numero}-${dvIngresado}`,
      calculatedDv: dvCalculado,
      inputDv: dvIngresado,
      isPartial: false
    };
  }

  // RUT válido
  const rutNormalizado = `${numero}-${dvCalculado}`;
  const rutFormateado = formatearRut(rutNormalizado);

  return {
    isValid: true,
    rutNormalized: rutNormalizado,
    rutFormatted: rutFormateado,
    calculatedDv: dvCalculado,
    inputDv: dvIngresado,
    isPartial: false
  };
}

/**
 * Valida si un RUT tiene formato válido o está en proceso de escritura
 */
export function validarRutProgresivo(rut: string): RutValidationResult {
  const resultado = validarRut(rut);
  
  // Si es un RUT parcial, no lo consideramos como error para la UI
  // pero técnicamente no es válido para envío
  if (resultado.isPartial) {
    return {
      ...resultado,
      message: undefined // No mostrar mensaje de error para RUTs parciales
    };
  }
  
  return resultado;
}

/**
 * Formatea un RUT con puntos y guión
 */
export function formatearRut(rut: string): string {
  if (!rut) return '';
  
  // Limpiar el RUT pero mantener el guión si existe
  const rutLimpio = rut.replace(/\./g, '').toUpperCase().trim();
  
  // Si es un RUT parcial sin guión, no formatear con puntos aún
  if (!rutLimpio.includes('-') && rutLimpio.length <= 8) {
    return rutLimpio;
  }
  
  // Separar número y dígito verificador
  const partes = rutLimpio.split('-');
  const numero = partes[0];
  const dv = partes[1] || '';
  
  if (numero.length < 8) return rutLimpio;
  
  // Formatear el número con puntos
  let numeroFormateado = numero
    .split('')
    .reverse()
    .join('')
    .replace(/(\d{3})/g, '$1.')
    .split('')
    .reverse()
    .join('')
    .replace(/^\./, '');
  
  return dv ? `${numeroFormateado}-${dv}` : numeroFormateado;
}

/**
 * Limpia y normaliza un RUT (remueve puntos y espacios)
 */
export function limpiarRut(rut: string): string {
  if (!rut) return '';
  return rut.replace(/\./g, '').replace(/-/g, '').toUpperCase().trim();
}

/**
 * Valida si un RUT tiene formato válido (sin verificar dígito verificador)
 */
export function validarFormatoRut(rut: string): boolean {
  if (!rut) return false;
  const rutLimpio = limpiarRut(rut);
  return /^(\d{7,8})([0-9K])$/.test(rutLimpio);
}

/**
 * Hook/composable para usar en componentes Vue (alternativa al composable separado)
 */
export function useRutValidation() {
  return {
    validarRut,
    formatearRut,
    limpiarRut,
    validarFormatoRut,
    calcularDigitoVerificador
  };
}

export default {
  validarRut,
  formatearRut,
  limpiarRut,
  validarFormatoRut,
  calcularDigitoVerificador,
  useRutValidation
};