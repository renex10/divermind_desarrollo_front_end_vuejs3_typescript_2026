/**
 * COMPOSABLE: useRoutineExecution
 * --------------------------------------------------------------------------
 * Motor lógico sincronizado con RoutineCompletionLogCreateSerializer.
 * Maneja la ejecución táctil y la persistencia de datos clínicos.
 * --------------------------------------------------------------------------
 */

import { ref, computed, onUnmounted } from 'vue'
import { routinesApi } from '@/services/rutinas/routinesApi'
import type { 
  DailyRoutineDetail, 
  RoutineStep, 
  LogCreateData, 
  StepCompletionCreateData 
} from '@/type/rutinas/rutinas'

export function useRoutineExecution(childId: number, routineId: number) {
  // --- ESTADO REACCIONARIO ---
  const routine = ref<DailyRoutineDetail | null>(null)
  const steps = ref<RoutineStep[]>([])
  const currentStepIndex = ref(0)
  const loading = ref(true)
  const isExecuting = ref(false)
  const isFinished = ref(false)

  // --- LÓGICA DEL TIEMPO ---
  const startTime = ref<Date | null>(null)
  const endTime = ref<Date | null>(null)
  const totalElapsedSeconds = ref(0)
  const stepStartTime = ref<number>(0)
  let timerInterval: number | null = null

  // --- RECOLECCIÓN DE DATOS ---
  const stepCompletions = ref<StepCompletionCreateData[]>([])
  const emotionalStateStart = ref<string>('neutral')

  // --- PROPIEDADES COMPUTADAS ---
  const currentStep = computed(() => steps.value[currentStepIndex.value] || null)
  const progressPercentage = computed(() => {
    if (steps.value.length === 0) return 0
    return Math.round(((currentStepIndex.value) / steps.value.length) * 100)
  })

  // --- ACCIONES ---

  async function loadRoutine() {
    loading.value = true
    try {
      const response = await routinesApi.getRoutineDetail(childId, routineId)
      routine.value = response.data
      steps.value = [...(response.data.steps || [])].sort((a, b) => a.order - b.order)
    } catch (error) {
      console.error("Error al cargar motor de ejecución:", error)
    } finally {
      loading.value = false
    }
  }

  function startRoutine(initialMood: string = 'neutral') {
    startTime.value = new Date()
    stepStartTime.value = 0
    emotionalStateStart.value = initialMood
    isExecuting.value = true
    
    timerInterval = window.setInterval(() => {
      totalElapsedSeconds.value++
    }, 1000)
  }

  /**
   * Registro de un paso individual.
   * ✅ Sincronizado con StepCompletionCreateSerializer
   */
  function completeStep(data: { 
    completed: boolean, 
    had_difficulty: boolean, 
    support_needed: "none" | "verbal" | "visual" | "physical" | "full",
    notes?: string 
  }) {
    if (!currentStep.value) return

    const timeInThisStep = totalElapsedSeconds.value - stepStartTime.value

    stepCompletions.value.push({
      step_id: currentStep.value.id!, // Requerido por el Serializer
      completed: data.completed,
      had_difficulty: data.had_difficulty,
      support_needed: data.support_needed, // "none", "verbal", etc.
      time_taken_seconds: timeInThisStep,
      notes: data.notes || ''
    })

    stepStartTime.value = totalElapsedSeconds.value

    if (currentStepIndex.value < steps.value.length - 1) {
      currentStepIndex.value++
    } else {
      isFinished.value = true
      stopTimer()
    }
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
    endTime.value = new Date()
  }

  /**
   * ✅ FINALIZACIÓN Y SINCRONIZACIÓN (RoutineCompletionLogCreateSerializer)
   */
  async function saveExecutionReport(
    finalMood: string, 
    generalNotes: string,
    generalSupport: "none" | "low" | "medium" | "high"
  ) {
    if (!startTime.value || !endTime.value) return

    const allCompleted = stepCompletions.value.every(s => s.completed)
    const completionStatus = allCompleted ? 'completed' : 'partial'

    const logData: LogCreateData = {
      date: new Date().toISOString().split('T')[0],
      start_time: startTime.value.toTimeString().split(' ')[0], // Formato HH:MM:SS
      end_time: endTime.value.toTimeString().split(' ')[0],     // Formato HH:MM:SS
      
      // ✅ CAMBIO CLAVE: El serializer espera 'actual_duration_minutes'
      actual_duration_minutes: Math.ceil(totalElapsedSeconds.value / 60),
      
      emotional_state_start: emotionalStateStart.value,
      emotional_state_end: finalMood,
      notes: generalNotes,
      step_completions: stepCompletions.value,
      completion_status: completionStatus,
      support_level_needed: generalSupport,
      
      // Campos adicionales solicitados por el modelo de datos
      independence_rating: allCompleted ? 5 : 3,
      crisis_occurred: false
    }

    try {
      await routinesApi.createLog(childId, routineId, logData)
      return { success: true }
    } catch (error) {
      console.error("Error al sincronizar reporte final:", error)
      throw error
    }
  }

  onUnmounted(() => stopTimer())

  return {
    routine,
    currentStep,
    currentStepIndex,
    steps,
    loading,
    isExecuting,
    isFinished,
    totalElapsedSeconds,
    progressPercentage,
    loadRoutine,
    startRoutine,
    completeStep,
    saveExecutionReport
  }
}