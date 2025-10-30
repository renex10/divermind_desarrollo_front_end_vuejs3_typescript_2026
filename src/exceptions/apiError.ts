// src/exceptions/apiError.ts

declare global {
  interface ErrorConstructor {
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
  }
}

/**
 * Tipos de errores de la API
 */
export enum ApiErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONFLICT_ERROR = 'CONFLICT_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  CLIENT_ERROR = 'CLIENT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Interfaz para errores de validación de campos
 */
export interface FieldValidationError {
  field: string
  message: string
  value?: any
}

/**
 * Clase personalizada para errores de API
 */
export class ApiError extends Error {
  constructor(
    public message: string,
    public type: ApiErrorType,
    public status?: number,
    public details?: any,
    public fieldErrors?: FieldValidationError[],
    public originalError?: any
  ) {
    super(message)
    this.name = 'ApiError'
    
    // Mantiene el stack trace adecuado
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }
  }

  /**
   * Verifica si es un error de validación
   */
  get isValidationError(): boolean {
    return this.type === ApiErrorType.VALIDATION_ERROR
  }

  /**
   * Verifica si es un error de conflicto (duplicados)
   */
  get isConflictError(): boolean {
    return this.type === ApiErrorType.CONFLICT_ERROR
  }

  /**
   * Verifica si es un error de red
   */
  get isNetworkError(): boolean {
    return this.type === ApiErrorType.NETWORK_ERROR
  }

  /**
   * Verifica si es un error de autenticación
   */
  get isAuthenticationError(): boolean {
    return this.type === ApiErrorType.AUTHENTICATION_ERROR
  }

  /**
   * Verifica si es un error de autorización
   */
  get isAuthorizationError(): boolean {
    return this.type === ApiErrorType.AUTHORIZATION_ERROR
  }

  /**
   * Obtiene errores de campo específicos
   */
  getFieldError(fieldName: string): FieldValidationError | undefined {
    return this.fieldErrors?.find(error => error.field === fieldName)
  }

  /**
   * Verifica si un campo específico tiene error
   */
  hasFieldError(fieldName: string): boolean {
    return this.fieldErrors?.some(error => error.field === fieldName) || false
  }

  /**
   * Convierte el error a un objeto plano para logging
   */
  toLogObject() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      status: this.status,
      fieldErrors: this.fieldErrors,
      stack: this.stack
    }
  }
}

/**
 * Función para parsear errores de Axios/API y convertirlos en ApiError
 */
export function parseApiError(error: any): ApiError {
  console.error('🔧 Parseando error original:', error)

  // Error de conexión/red
  if (error.code === 'NETWORK_ERROR' || !error.response) {
    return new ApiError(
      'Error de conexión. Verifique su conexión a internet e intente nuevamente.',
      ApiErrorType.NETWORK_ERROR,
      undefined,
      { originalError: error.message },
      undefined,
      error
    )
  }

  const status = error.response?.status
  const data = error.response?.data

  console.error(`📊 Error HTTP ${status}:`, data)

  // Errores de validación (400)
  if (status === 400 && data?.errors) {
    const fieldErrors: FieldValidationError[] = []
    
    // Procesar errores de campos específicos
    for (const field in data.errors) {
      const messages = Array.isArray(data.errors[field]) 
        ? data.errors[field] 
        : [data.errors[field]]
      
      messages.forEach(message => {
        fieldErrors.push({
          field,
          message: String(message),
          value: undefined
        })
      })
    }

    // Mensaje principal basado en los errores de campo
    let mainMessage = 'Errores de validación en los datos ingresados.'
    if (fieldErrors.length > 0) {
      const firstError = fieldErrors[0]
      mainMessage = `Error de validación: ${firstError.field} - ${firstError.message}`
    }

    return new ApiError(
      mainMessage,
      ApiErrorType.VALIDATION_ERROR,
      status,
      data,
      fieldErrors,
      error
    )
  }

  // Conflictos - recursos duplicados (409)
  if (status === 409) {
    let conflictMessage = 'El recurso ya existe en el sistema.'
    const fieldErrors: FieldValidationError[] = []

    // Procesar conflictos específicos por campo
    if (data?.errors) {
      for (const field in data.errors) {
        const messages = Array.isArray(data.errors[field]) 
          ? data.errors[field] 
          : [data.errors[field]]
        
        messages.forEach(message => {
          fieldErrors.push({
            field,
            message: String(message),
            value: undefined
          })
        })
      }

      if (fieldErrors.length > 0) {
        const firstError = fieldErrors[0]
        conflictMessage = `Conflicto: ${firstError.field} - ${firstError.message}`
      }
    } else if (data?.detail) {
      conflictMessage = data.detail
    } else if (data?.message) {
      conflictMessage = data.message
    }

    return new ApiError(
      conflictMessage,
      ApiErrorType.CONFLICT_ERROR,
      status,
      data,
      fieldErrors,
      error
    )
  }

  // No autorizado (401)
  if (status === 401) {
    return new ApiError(
      'No autorizado. Su sesión ha expirado o no tiene permisos para esta acción.',
      ApiErrorType.AUTHENTICATION_ERROR,
      status,
      data,
      undefined,
      error
    )
  }

  // Prohibido (403)
  if (status === 403) {
    return new ApiError(
      'Acceso prohibido. No tiene permisos para realizar esta acción.',
      ApiErrorType.AUTHORIZATION_ERROR,
      status,
      data,
      undefined,
      error
    )
  }

  // Error interno del servidor (500)
  if (status === 500) {
    return new ApiError(
      'Error interno del servidor. Por favor, intente más tarde.',
      ApiErrorType.SERVER_ERROR,
      status,
      data,
      undefined,
      error
    )
  }

  // Error del cliente (4xx)
  if (status >= 400 && status < 500) {
    const message = data?.detail || data?.message || `Error del cliente (${status})`
    return new ApiError(
      message,
      ApiErrorType.CLIENT_ERROR,
      status,
      data,
      undefined,
      error
    )
  }

  // Error del servidor (5xx)
  if (status >= 500) {
    return new ApiError(
      'Error del servidor. Por favor, intente más tarde.',
      ApiErrorType.SERVER_ERROR,
      status,
      data,
      undefined,
      error
    )
  }

  // Error desconocido
  const unknownMessage = data?.detail || data?.message || error.message || 'Error desconocido en la API'
  return new ApiError(
    unknownMessage,
    ApiErrorType.UNKNOWN_ERROR,
    status,
    data,
    undefined,
    error
  )
}

/**
 * Helper para crear errores de validación específicos
 */
export function createValidationError(
  message: string, 
  fieldErrors?: FieldValidationError[]
): ApiError {
  return new ApiError(
    message,
    ApiErrorType.VALIDATION_ERROR,
    400,
    undefined,
    fieldErrors
  )
}

/**
 * Helper para crear errores de conflicto específicos
 */
export function createConflictError(
  message: string,
  fieldErrors?: FieldValidationError[]
): ApiError {
  return new ApiError(
    message,
    ApiErrorType.CONFLICT_ERROR,
    409,
    undefined,
    fieldErrors
  )
}

/**
 * Helper para verificar si un error es de tipo ApiError
 */
export function isApiError(error: any): error is ApiError {
  return error instanceof ApiError
}

/**
 * Helper para obtener el mensaje de error más amigable para el usuario
 */
export function getUserFriendlyErrorMessage(error: any): string {
  if (isApiError(error)) {
    return error.message
  }

  if (error?.response?.data?.detail) {
    return error.response.data.detail
  }

  if (error?.response?.data?.message) {
    return error.response.data.message
  }

  if (error?.message) {
    return error.message
  }

  return 'Ha ocurrido un error inesperado. Por favor, intente nuevamente.'
}