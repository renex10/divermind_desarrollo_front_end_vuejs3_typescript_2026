// src/services/authService.ts
// Paso 3: Funciones para llamar al backend (autenticación)

import type { User } from '@/types/user'
import http from './http'

interface LoginResponse {
  access: string
  refresh: string
  user: User
  message: string
}

/**
 * Inicia sesión en el backend con email y contraseña
 */
export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  const { data } = await http.post('/user/login/', { email, password })
  return data
}

/**
 * Cierra sesión en el backend invalidando el refresh token
 */
export async function logoutApi(): Promise<void> {
  const refresh = localStorage.getItem('refresh')

  // Si no hay refresh token, devolvemos una promesa resuelta
  if (!refresh) return Promise.resolve()

  await http.post('/user/logout/', { refresh })
}

/**
 * Renueva el access token usando el refresh token
 */
export async function refreshTokenApi(): Promise<{ access: string }> {
  const refresh = localStorage.getItem('refresh')
  if (!refresh) throw new Error('No refresh token disponible')

  const { data } = await http.post('/user/refresh/', { refresh })
  return data // { access: 'nuevo_token' }
}
