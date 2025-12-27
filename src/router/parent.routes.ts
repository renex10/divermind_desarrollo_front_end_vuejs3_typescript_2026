/**
 * RUTAS DEL PANEL DE PADRES/FAMILIA
 * Todas las rutas bajo /parent/
 * * Estructura para el Piloto de Ejecución:
 * - Dashboard: Resumen general y acceso rápido.
 * - Rutinas: Agenda diaria donde se listan las actividades.
 * - Ejecución (Modo Enfoque): Pantalla completa interactiva para el seguimiento.
 * - Registro: Historial de Logs y reportes clínicos.
 */

export default [
  // Dashboard principal padres
  {
    path: '',
    name: 'parent-dashboard',
    meta: { breadcrumb: 'Inicio' },
    component: () => import('@/views/dashboard/padres/DashboardView.vue')
  },

  // Mis hijos
  {
    path: 'mis-hijos',
    name: 'parent-mis-hijos',
    meta: { breadcrumb: 'Mis Hijos' },
    component: () => import('@/views/dashboard/padres/MisHijosView.vue')
  },

  // Detalle de un hijo
  {
    path: 'hijos/:id',
    name: 'parent-hijo-detalle',
    component: () => import('@/views/dashboard/padres/HijoDetalleView.vue'),
    props: true,
    meta: { breadcrumb: 'Detalle de mi Hijo' }
  },

  // Registro diario (Eventos aislados)
  {
    path: 'registro-diario',
    name: 'parent-registro-diario',
    meta: { breadcrumb: 'Registro Diario' },
    component: () => import('@/views/dashboard/padres/RegistroDiarioView.vue')
  },

  /**
   * 📅 RUTINAS Y AGENDA
   * Vista donde el padre consulta qué actividades corresponden al día.
   * En el Sidebar actualizado, tanto "Rutinas" como "Modo Enfoque" 
   * pueden apuntar aquí para seleccionar la rutina a iniciar.
   */
  {
    path: 'rutinas',
    name: 'parent-rutinas',
    meta: { breadcrumb: 'Agenda de Rutinas' },
    component: () => import('@/views/dashboard/padres/RutinasView.vue')
  },

  /**
   * ✅ RUTA DE EJECUCIÓN (MODO ENFOQUE) - CORE DEL PILOTO
   * Esta ruta es activada cuando el padre presiona "Iniciar" en una rutina.
   * Utiliza :routineId para cargar el motor lógico useRoutineExecution.
   */
  {
    path: 'rutinas/:routineId/ejecutar',
    name: 'parent-rutina-ejecutar',
    component: () => import('@/views/dashboard/padres/RutinaEjecucionView.vue'),
    props: true, // Pasa routineId como prop automáticamente
    meta: { 
      breadcrumb: 'Ejecutando Rutina',
      hideSidebar: true, // 🔥 Maximiza el espacio para el niño (Modo Enfoque)
      requiresAuth: true
    }
  },

  // Medicación
  {
    path: 'medicacion',
    name: 'parent-medicacion',
    meta: { breadcrumb: 'Medicación' },
    component: () => import('@/views/dashboard/padres/MedicacionView.vue')
  },

  // Mensajes/Feedback (Comunicación con Terapeuta)
  {
    path: 'mensajes',
    name: 'parent-mensajes',
    meta: { breadcrumb: 'Mensajes' },
    component: () => import('@/views/dashboard/padres/MensajesView.vue')
  },

  // Reportes (Historial de Logs y Cumplimiento)
  {
    path: 'reportes',
    name: 'parent-reportes',
    meta: { breadcrumb: 'Reportes de Progreso' },
    component: () => import('@/views/dashboard/padres/ReportesView.vue')
  },

  // Configuración (Perfil y Preferencias)
  {
    path: 'configuracion',
    name: 'parent-configuracion',
    meta: { breadcrumb: 'Configuración' },
    component: () => import('@/views/dashboard/padres/ConfiguracionView.vue')
  }
]