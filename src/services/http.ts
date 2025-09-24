// src/services/http.ts
// Paso 4: Configuración global de Axios

import axios from 'axios'
import { refreshTokenApi } from './authService.ts'


const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // URL definida en .env
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de request: añade el access token en cada petición
http.interceptors.request.use(config => {
  const token = localStorage.getItem('access')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor de response: maneja errores globales y refresh de token
http.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // Si el access token expiró y no hemos reintentado aún
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

    return Promise.reject(error)
  }
)

export default http
