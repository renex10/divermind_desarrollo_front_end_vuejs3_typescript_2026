// src/data/pictograms.ts
// =====================================================
// Catálogo de Pictogramas para Rutinas
// =====================================================

import {
  // === HIGIENE Y CUIDADO PERSONAL ===
  HandRaisedIcon,
  SparklesIcon,
  ScissorsIcon,
  BeakerIcon,
  
  // === ALIMENTACIÓN ===
  CakeIcon,
  BeakerIcon as CupIcon,
  
  // === EDUCACIÓN Y APRENDIZAJE ===
  BookOpenIcon,
  PencilIcon,
  AcademicCapIcon,
  CalculatorIcon,
  PuzzlePieceIcon,
  
  // === TIEMPO Y RUTINAS ===
  ClockIcon,
  SunIcon,
  MoonIcon,
  CalendarIcon,
  
  // === EMOCIONES Y ESTADOS ===
  FaceSmileIcon,
  HeartIcon,
  BoltIcon,
  
  // === ACTIVIDADES Y OCIO ===
  MusicalNoteIcon,
  TvIcon,
  PaintBrushIcon,
  
  // === MOVIMIENTO Y EJERCICIO ===
  ArrowPathIcon,
  FireIcon,
  
  // === COMUNICACIÓN ===
  ChatBubbleLeftIcon,
  SpeakerWaveIcon,
  EyeIcon,
  SpeakerWaveIcon as EarIcon,
  
  // === UBICACIÓN Y ESPACIO ===
  HomeIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  
  // === OBJETOS COTIDIANOS ===
  ShoppingBagIcon,
  GiftIcon,
  KeyIcon,
  
  // === ACCIONES GENERALES ===
  CheckCircleIcon,
  XCircleIcon,
  PlusCircleIcon,
  ArrowRightIcon,
  PauseIcon,
  PlayIcon,
  
} from '@heroicons/vue/24/outline'

// =====================================================
// INTERFACES
// =====================================================

export interface Pictogram {
  id: string
  label: string
  category: string
  keywords: string[]
  component: any
  description?: string
}

export interface PictogramCategory {
  id: string
  label: string
  color: string
  icon?: any
}

// =====================================================
// CATEGORÍAS
// =====================================================

export const PICTOGRAM_CATEGORIES: PictogramCategory[] = [
  { 
    id: 'higiene', 
    label: 'Higiene', 
    color: 'blue',
    icon: SparklesIcon 
  },
  { 
    id: 'comida', 
    label: 'Alimentación', 
    color: 'green',
    icon: CakeIcon 
  },
  { 
    id: 'educacion', 
    label: 'Educación', 
    color: 'purple',
    icon: BookOpenIcon 
  },
  { 
    id: 'tiempo', 
    label: 'Tiempo', 
    color: 'amber',
    icon: ClockIcon 
  },
  { 
    id: 'emociones', 
    label: 'Emociones', 
    color: 'pink',
    icon: HeartIcon 
  },
  { 
    id: 'actividades', 
    label: 'Actividades', 
    color: 'indigo',
    icon: MusicalNoteIcon 
  },
  { 
    id: 'movimiento', 
    label: 'Movimiento', 
    color: 'orange',
    icon: FireIcon 
  },
  { 
    id: 'comunicacion', 
    label: 'Comunicación', 
    color: 'cyan',
    icon: ChatBubbleLeftIcon 
  },
  { 
    id: 'ubicacion', 
    label: 'Lugares', 
    color: 'teal',
    icon: HomeIcon 
  },
  { 
    id: 'objetos', 
    label: 'Objetos', 
    color: 'gray',
    icon: ShoppingBagIcon 
  },
  { 
    id: 'acciones', 
    label: 'Acciones', 
    color: 'emerald',
    icon: CheckCircleIcon 
  },
]

// =====================================================
// CATÁLOGO DE PICTOGRAMAS
// =====================================================

export const PICTOGRAMS_CATALOG: Pictogram[] = [
  
  // ==================== HIGIENE ====================
  {
    id: 'wash-hands',
    label: 'Lavarse las manos',
    category: 'higiene',
    keywords: ['lavar', 'manos', 'jabón', 'agua', 'higiene', 'limpio'],
    component: HandRaisedIcon,
    description: 'Lavarse las manos con agua y jabón'
  },
  {
    id: 'brush-teeth',
    label: 'Cepillarse los dientes',
    category: 'higiene',
    keywords: ['dientes', 'cepillo', 'pasta', 'dental', 'boca', 'limpiar'],
    component: SparklesIcon,
    description: 'Cepillar los dientes con pasta dental'
  },
  {
    id: 'take-shower',
    label: 'Ducharse',
    category: 'higiene',
    keywords: ['ducha', 'bañarse', 'baño', 'agua', 'limpiar', 'aseo'],
    component: BeakerIcon,
    description: 'Tomar una ducha o baño'
  },
  {
    id: 'comb-hair',
    label: 'Peinarse',
    category: 'higiene',
    keywords: ['peinar', 'cabello', 'pelo', 'peine', 'cepillo'],
    component: ScissorsIcon,
    description: 'Peinar o cepillar el cabello'
  },

  // ==================== ALIMENTACIÓN ====================
  {
    id: 'breakfast',
    label: 'Desayuno',
    category: 'comida',
    keywords: ['desayuno', 'comer', 'mañana', 'comida', 'alimento'],
    component: CakeIcon,
    description: 'Tomar el desayuno'
  },
  {
    id: 'lunch',
    label: 'Almuerzo',
    category: 'comida',
    keywords: ['almuerzo', 'comida', 'mediodía', 'comer'],
    component: CakeIcon,
    description: 'Almorzar al mediodía'
  },
  {
    id: 'dinner',
    label: 'Cena',
    category: 'comida',
    keywords: ['cena', 'noche', 'comida', 'comer'],
    component: CakeIcon,
    description: 'Cenar en la noche'
  },
  {
    id: 'drink-water',
    label: 'Beber agua',
    category: 'comida',
    keywords: ['agua', 'beber', 'tomar', 'vaso', 'hidratación', 'líquido'],
    component: CupIcon,
    description: 'Tomar agua o líquidos'
  },
  {
    id: 'snack',
    label: 'Colación/Merienda',
    category: 'comida',
    keywords: ['merienda', 'colación', 'snack', 'fruta', 'refrigerio'],
    component: GiftIcon,
    description: 'Tomar una colación o refrigerio'
  },

  // ==================== EDUCACIÓN ====================
  {
    id: 'read-book',
    label: 'Leer un libro',
    category: 'educacion',
    keywords: ['leer', 'libro', 'lectura', 'estudiar', 'aprender'],
    component: BookOpenIcon,
    description: 'Leer o revisar un libro'
  },
  {
    id: 'homework',
    label: 'Hacer tareas',
    category: 'educacion',
    keywords: ['tarea', 'deberes', 'escribir', 'estudiar', 'colegio'],
    component: PencilIcon,
    description: 'Realizar tareas escolares'
  },
  {
    id: 'go-to-school',
    label: 'Ir a la escuela',
    category: 'educacion',
    keywords: ['escuela', 'colegio', 'clase', 'ir', 'estudiar'],
    component: AcademicCapIcon,
    description: 'Ir al colegio o escuela'
  },
  {
    id: 'do-math',
    label: 'Hacer matemáticas',
    category: 'educacion',
    keywords: ['matemáticas', 'números', 'calcular', 'sumar', 'contar'],
    component: CalculatorIcon,
    description: 'Hacer ejercicios de matemáticas'
  },
  {
    id: 'solve-puzzle',
    label: 'Resolver rompecabezas',
    category: 'educacion',
    keywords: ['rompecabezas', 'puzzle', 'armar', 'pensar', 'juego'],
    component: PuzzlePieceIcon,
    description: 'Armar o resolver un rompecabezas'
  },

  // ==================== TIEMPO Y RUTINAS ====================
  {
    id: 'wake-up',
    label: 'Despertar',
    category: 'tiempo',
    keywords: ['despertar', 'levantarse', 'mañana', 'reloj', 'alarma'],
    component: SunIcon,
    description: 'Despertarse en la mañana'
  },
  {
    id: 'bedtime',
    label: 'Hora de dormir',
    category: 'tiempo',
    keywords: ['dormir', 'noche', 'cama', 'descansar', 'sueño'],
    component: MoonIcon,
    description: 'Ir a dormir en la noche'
  },
  {
    id: 'check-time',
    label: 'Ver la hora',
    category: 'tiempo',
    keywords: ['hora', 'reloj', 'tiempo', 'ver', 'revisar'],
    component: ClockIcon,
    description: 'Revisar qué hora es'
  },
  {
    id: 'check-calendar',
    label: 'Ver calendario',
    category: 'tiempo',
    keywords: ['calendario', 'fecha', 'día', 'mes', 'planificar'],
    component: CalendarIcon,
    description: 'Revisar el calendario'
  },

  // ==================== EMOCIONES ====================
  {
    id: 'feel-happy',
    label: 'Estar feliz',
    category: 'emociones',
    keywords: ['feliz', 'contento', 'alegre', 'sonrisa', 'bien'],
    component: FaceSmileIcon,
    description: 'Sentirse feliz o contento'
  },
  {
    id: 'show-love',
    label: 'Mostrar cariño',
    category: 'emociones',
    keywords: ['cariño', 'amor', 'abrazo', 'corazón', 'afecto'],
    component: HeartIcon,
    description: 'Dar o recibir afecto'
  },
  {
    id: 'feel-excited',
    label: 'Estar emocionado',
    category: 'emociones',
    keywords: ['emocionado', 'entusiasmado', 'energía', 'activo'],
    component: BoltIcon,
    description: 'Sentirse emocionado o entusiasmado'
  },

  // ==================== ACTIVIDADES ====================
  {
    id: 'listen-music',
    label: 'Escuchar música',
    category: 'actividades',
    keywords: ['música', 'escuchar', 'canción', 'sonido', 'audio'],
    component: MusicalNoteIcon,
    description: 'Escuchar música o canciones'
  },
  {
    id: 'watch-tv',
    label: 'Ver televisión',
    category: 'actividades',
    keywords: ['televisión', 'tv', 'ver', 'programa', 'pantalla'],
    component: TvIcon,
    description: 'Ver la televisión o videos'
  },
  {
    id: 'draw-paint',
    label: 'Dibujar/Pintar',
    category: 'actividades',
    keywords: ['dibujar', 'pintar', 'arte', 'colores', 'creatividad'],
    component: PaintBrushIcon,
    description: 'Dibujar o pintar'
  },
  {
    id: 'play',
    label: 'Jugar',
    category: 'actividades',
    keywords: ['jugar', 'juego', 'diversión', 'entretenimiento'],
    component: PuzzlePieceIcon,
    description: 'Tiempo de juego libre'
  },

  // ==================== MOVIMIENTO ====================
  {
    id: 'exercise',
    label: 'Hacer ejercicio',
    category: 'movimiento',
    keywords: ['ejercicio', 'deportes', 'correr', 'mover', 'actividad'],
    component: FireIcon,
    description: 'Realizar ejercicio físico'
  },
  {
    id: 'walk',
    label: 'Caminar',
    category: 'movimiento',
    keywords: ['caminar', 'pasear', 'andar', 'mover'],
    component: ArrowPathIcon,
    description: 'Salir a caminar o pasear'
  },

  // ==================== COMUNICACIÓN ====================
  {
    id: 'talk',
    label: 'Hablar',
    category: 'comunicacion',
    keywords: ['hablar', 'conversar', 'decir', 'comunicar', 'platicar'],
    component: ChatBubbleLeftIcon,
    description: 'Hablar o conversar'
  },
  {
    id: 'listen',
    label: 'Escuchar',
    category: 'comunicacion',
    keywords: ['escuchar', 'oír', 'atender', 'oído'],
    component: EarIcon,
    description: 'Escuchar con atención'
  },
  {
    id: 'look',
    label: 'Mirar',
    category: 'comunicacion',
    keywords: ['mirar', 'ver', 'observar', 'ojos', 'vista'],
    component: EyeIcon,
    description: 'Mirar u observar'
  },
  {
    id: 'make-sound',
    label: 'Hacer sonido',
    category: 'comunicacion',
    keywords: ['sonido', 'ruido', 'hablar', 'voz', 'audio'],
    component: SpeakerWaveIcon,
    description: 'Producir sonidos o ruidos'
  },

  // ==================== UBICACIÓN ====================
  {
    id: 'go-home',
    label: 'Ir a casa',
    category: 'ubicacion',
    keywords: ['casa', 'hogar', 'volver', 'regresar', 'ir'],
    component: HomeIcon,
    description: 'Ir o estar en casa'
  },
  {
    id: 'go-to-place',
    label: 'Ir a un lugar',
    category: 'ubicacion',
    keywords: ['lugar', 'ir', 'salir', 'destino', 'ubicación'],
    component: MapPinIcon,
    description: 'Ir a un lugar específico'
  },
  {
    id: 'go-to-office',
    label: 'Ir a la oficina/centro',
    category: 'ubicacion',
    keywords: ['oficina', 'centro', 'edificio', 'trabajo'],
    component: BuildingOfficeIcon,
    description: 'Ir a la oficina o centro de terapia'
  },

  // ==================== OBJETOS ====================
  {
    id: 'get-object',
    label: 'Buscar objeto',
    category: 'objetos',
    keywords: ['objeto', 'cosa', 'buscar', 'encontrar', 'recoger'],
    component: ShoppingBagIcon,
    description: 'Buscar o recoger un objeto'
  },
  {
    id: 'use-key',
    label: 'Usar llave',
    category: 'objetos',
    keywords: ['llave', 'abrir', 'cerrar', 'puerta'],
    component: KeyIcon,
    description: 'Usar una llave para abrir/cerrar'
  },
  {
    id: 'receive-gift',
    label: 'Recibir regalo',
    category: 'objetos',
    keywords: ['regalo', 'presente', 'sorpresa', 'recibir'],
    component: GiftIcon,
    description: 'Recibir o dar un regalo'
  },

  // ==================== ACCIONES GENERALES ====================
  {
    id: 'complete-task',
    label: 'Completar tarea',
    category: 'acciones',
    keywords: ['completar', 'terminar', 'finalizar', 'listo', 'hecho'],
    component: CheckCircleIcon,
    description: 'Completar o terminar una tarea'
  },
  {
    id: 'cancel-action',
    label: 'Cancelar',
    category: 'acciones',
    keywords: ['cancelar', 'detener', 'parar', 'no hacer'],
    component: XCircleIcon,
    description: 'Cancelar o detener una acción'
  },
  {
    id: 'add-something',
    label: 'Añadir/Agregar',
    category: 'acciones',
    keywords: ['añadir', 'agregar', 'más', 'sumar'],
    component: PlusCircleIcon,
    description: 'Añadir o agregar algo'
  },
  {
    id: 'move-forward',
    label: 'Continuar',
    category: 'acciones',
    keywords: ['continuar', 'seguir', 'adelante', 'próximo'],
    component: ArrowRightIcon,
    description: 'Continuar o seguir adelante'
  },
  {
    id: 'pause',
    label: 'Pausar/Descansar',
    category: 'acciones',
    keywords: ['pausar', 'parar', 'descanso', 'break', 'esperar'],
    component: PauseIcon,
    description: 'Tomar un descanso o pausa'
  },
  {
    id: 'start',
    label: 'Iniciar/Comenzar',
    category: 'acciones',
    keywords: ['iniciar', 'comenzar', 'empezar', 'arrancar', 'start'],
    component: PlayIcon,
    description: 'Iniciar o comenzar una actividad'
  },
]

// =====================================================
// FUNCIONES AUXILIARES
// =====================================================

/**
 * Busca pictogramas por palabra clave
 */
export function searchPictograms(query: string): Pictogram[] {
  if (!query) return PICTOGRAMS_CATALOG
  
  const normalized = query.toLowerCase().trim()
  
  return PICTOGRAMS_CATALOG.filter(pictogram =>
    pictogram.label.toLowerCase().includes(normalized) ||
    pictogram.keywords.some(keyword => keyword.includes(normalized)) ||
    pictogram.description?.toLowerCase().includes(normalized)
  )
}

/**
 * Filtra pictogramas por categoría
 */
export function getPictogramsByCategory(categoryId: string): Pictogram[] {
  return PICTOGRAMS_CATALOG.filter(p => p.category === categoryId)
}

/**
 * Obtiene un pictograma por su ID
 */
export function getPictogramById(id: string): Pictogram | undefined {
  return PICTOGRAMS_CATALOG.find(p => p.id === id)
}

/**
 * Obtiene información de una categoría
 */
export function getCategoryInfo(categoryId: string): PictogramCategory | undefined {
  return PICTOGRAM_CATEGORIES.find(c => c.id === categoryId)
}