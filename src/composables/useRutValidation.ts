// src/composables/useRutValidation.ts
// Composable para validación completa de RUT chileno

import { computed, readonly, ref } from 'vue'

export function useRutValidation() {
  
  /**
   * Formatea un RUT agregando puntos y guión
   * @param rut - RUT sin formato o parcialmente formateado
   * @returns RUT formateado o string vacío si es inválido
   */
  const formatRut = (rut: string): string => {
    if (!rut) return ''
    
    // Remover todo lo que no sea número o K/k
    const cleanRut = rut.replace(/[^0-9kK]/g, '').toUpperCase()
    
    if (cleanRut.length < 2) return cleanRut
    
    // Separar número del dígito verificador
    const rutNumber = cleanRut.slice(0, -1)
    const dv = cleanRut.slice(-1)
    
    // Formatear número con puntos
    let formattedNumber = ''
    for (let i = rutNumber.length - 1, j = 0; i >= 0; i--, j++) {
      if (j > 0 && j % 3 === 0) {
        formattedNumber = '.' + formattedNumber
      }
      formattedNumber = rutNumber[i] + formattedNumber
    }
    
    return `${formattedNumber}-${dv}`
  }

  /**
   * Calcula el dígito verificador de un RUT
   * @param rutNumber - Número del RUT sin dígito verificador
   * @returns Dígito verificador calculado
   */
  const calculateDV = (rutNumber: string): string => {
    const numbers = rutNumber.split('').reverse().map(Number)
    let sum = 0
    let multiplier = 2
    
    for (const num of numbers) {
      sum += num * multiplier
      multiplier = multiplier === 7 ? 2 : multiplier + 1
    }
    
    const remainder = sum % 11
    const dv = 11 - remainder
    
    if (dv === 11) return '0'
    if (dv === 10) return 'K'
    return dv.toString()
  }

  /**
   * Valida si un RUT es correcto
   * @param rut - RUT a validar (con o sin formato)
   * @returns true si el RUT es válido
   */
  const validateRut = (rut: string): boolean => {
    if (!rut || typeof rut !== 'string') return false
    
    // Limpiar el RUT
    const cleanRut = rut.replace(/[^0-9kK]/g, '').toUpperCase()
    
    // Validar longitud
    if (cleanRut.length < 2 || cleanRut.length > 9) return false
    
    // Separar número y dígito verificador
    const rutNumber = cleanRut.slice(0, -1)
    const dv = cleanRut.slice(-1)
    
    // Validar que el número sea numérico
    if (!/^\d+$/.test(rutNumber)) return false
    
    // Validar que el dígito verificador sea válido
    if (!/^[0-9K]$/.test(dv)) return false
    
    // Calcular y comparar dígito verificador
    const calculatedDV = calculateDV(rutNumber)
    
    return calculatedDV === dv
  }

  /**
   * Valida formato de RUT (solo estructura, no dígito verificador)
   * @param rut - RUT a validar formato
   * @returns true si el formato es correcto
   */
  const validateRutFormat = (rut: string): boolean => {
    if (!rut || typeof rut !== 'string') return false
    
    // Patrones aceptados:
    // 12345678-9, 12.345.678-9, 1234567-K, etc.
    const formatRegex = /^\d{1,2}(\.\d{3})*\.\d{3}-[\dkK]$|^\d{7,8}-[\dkK]$/i
    
    return formatRegex.test(rut.trim())
  }

  /**
   * Obtiene mensajes de error para validación de RUT
   * @param rut - RUT a validar
   * @returns Objeto con estado de validación y mensaje de error
   */
  const getRutValidationMessage = (rut: string) => {
    if (!rut || rut.trim() === '') {
      return {
        isValid: false,
        message: 'El RUT es requerido',
        type: 'required'
      }
    }

    if (!validateRutFormat(rut)) {
      return {
        isValid: false,
        message: 'Formato de RUT inválido (ej: 12.345.678-9)',
        type: 'format'
      }
    }

    if (!validateRut(rut)) {
      return {
        isValid: false,
        message: 'El RUT ingresado no es válido',
        type: 'invalid'
      }
    }

    return {
      isValid: true,
      message: '',
      type: 'valid'
    }
  }

  /**
   * Regex patterns para diferentes casos de uso
   */
  const rutPatterns = {
    // Para validación completa con FormKit
    complete: /^\d{1,2}(\.\d{3})*\.\d{3}-[\dkK]$/i,
    
    // Para búsqueda (permite RUT parcial o completo)
    search: /^(\d{1,2}(\.\d{3})*(\.\d{3})?(-[\dkK])?)?$/i,
    
    // Para limpieza (solo números y K)
    clean: /[^0-9kK]/gi
  }

  /**
   * Composable para validación reactiva de RUT
   * @param initialRut - RUT inicial (opcional)
   */
  const useRutField = (initialRut = '') => {
    const rut = ref(initialRut)
    const isDirty = ref(false)
    
    const validation = computed(() => {
      if (!isDirty.value && !rut.value) {
        return { isValid: true, message: '', type: 'pristine' }
      }
      return getRutValidationMessage(rut.value)
    })
    
    const formattedRut = computed(() => {
      if (!rut.value) return ''
      return formatRut(rut.value)
    })
    
    const setRut = (newRut: string) => {
      isDirty.value = true
      rut.value = newRut
    }
    
    const formatAndSet = (newRut: string) => {
      const formatted = formatRut(newRut)
      setRut(formatted)
    }
    
    return {
      rut: readonly(rut),
      setRut,
      formatAndSet,
      validation,
      formattedRut,
      isValid: computed(() => validation.value.isValid),
      errorMessage: computed(() => validation.value.message)
    }
  }

  return {
    formatRut,
    validateRut,
    validateRutFormat,
    getRutValidationMessage,
    rutPatterns,
    useRutField
  }
}