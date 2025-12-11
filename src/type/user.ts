// Paso 5: Definición del tipo de usuario
export interface User {
  id: number
  email: string
  username: string
  rut: string
  name: string
   first_name: string  // 🔥 AGREGAR
  last_name: string   // 🔥 AGREGAR
  estado: string
  is_admin: boolean
  is_superuser: boolean
  roles: string[]
  permissions: string[]
  last_access: string

  
  // 🔥 AGREGAR ESTE CAMPO CRÍTICO
  role: 'parent' | 'therapist' | 'admin'  // Rol principal del usuario
}


