// src/services/http.ts
// -------------------------------------------------------------
// Configuración global de Axios para toda la aplicación.
// - Usa la URL base definida en .env (VITE_API_BASE_URL).
// - Añade automáticamente el token de acceso en cada request.
// - Maneja expiración de tokens con refresh automático.
// - Si el refresh falla, limpia la sesión y redirige al login.
// -------------------------------------------------------------

import axios from 'axios'
import { refreshTokenApi } from './authService'

// Crear instancia de Axios con configuración base
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // URL definida en .env
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// -------------------------------------------------------------
// Interceptor de REQUEST
// Se ejecuta antes de cada petición y añade el token de acceso
// -------------------------------------------------------------
http.interceptors.request.use(config => {
  const token = localStorage.getItem('access')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// -------------------------------------------------------------
// Interceptor de RESPONSE
// Maneja errores globales y lógica de refresh de token
// -------------------------------------------------------------
http.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // Caso: token expirado y aún no se intentó refrescar
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        // Intentar renovar el access token
        const { access } = await refreshTokenApi()
        localStorage.setItem('access', access)

        // Actualizar header y reintentar la petición original
        originalRequest.headers.Authorization = `Bearer ${access}`
        return http(originalRequest)
      } catch (refreshError) {
        // Si falla el refresh, limpiar sesión y redirigir al login
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }

    // Si no es un error 401 o ya falló el refresh, rechazar
    return Promise.reject(error)
  }
)

export default http