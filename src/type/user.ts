// Paso 5: Definición del tipo de usuario
export interface User {
  id: number
  email: string
  username: string
  rut: string
  name: string
  estado: string
  is_admin: boolean
  is_superuser: boolean
  roles: string[]
  permissions: string[]
  last_access: string
}
