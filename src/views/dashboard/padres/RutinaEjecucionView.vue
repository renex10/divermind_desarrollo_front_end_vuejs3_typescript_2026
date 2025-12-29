<script setup>
/* src\views\dashboard\padres\RutinaEjecucionView.vue */
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useRoutineExecution } from '@/composables/padres/useRoutineExecution';
import { useNinoActivoStore } from '@/store/ninoActivoStore';
import Swal from 'sweetalert2';

// Componentes de la interfaz
import ExecutionHeader from '@/components/dashboard/padres/rutinas/ejecucion/ExecutionHeader.vue';
import StepExecutionCard from '@/components/dashboard/padres/rutinas/ejecucion/StepExecutionCard.vue';
import ExecutionStrategiesDrawer from '@/components/dashboard/padres/rutinas/ejecucion/ExecutionStrategiesDrawer.vue';
import ExecutionSummaryModal from '@/components/dashboard/padres/rutinas/ejecucion/ExecutionSummaryModal.vue';

const props = defineProps({
  routineId: {
    type: [String, Number],
    required: true
  }
});

const router = useRouter();
const ninoStore = useNinoActivoStore();

// ✅ CORREGIDO: Usar ninoActivoId en lugar de ninoId
const childId = computed(() => ninoStore.ninoActivoId);

// Referencias para controlar la visibilidad de modales
const showStrategies = ref(false);
const showSummary = ref(false);

// ✅ CORREGIDO: Usar computed childId que ya es reactivo
const {
  routine,
  currentStep,
  loading,
  isExecuting,
  isFinished,
  progressPercentage,
  totalElapsedSeconds,
  loadRoutine,
  startRoutine,
  completeStep,
  saveExecutionReport
} = useRoutineExecution(childId, Number(props.routineId));

onMounted(async () => {
  console.log("🔍 [Ejecución] Validando datos...");
  console.log("📊 Estado del store:", {
    hasData: ninoStore.hasData,
    ninoActivoId: ninoStore.ninoActivoId,
    nombreCompleto: ninoStore.nombreCompleto
  });

  // ✅ CORREGIDO: Verificar si ya hay datos cargados
  if (!ninoStore.hasData) {
    console.log("📂 [Ejecución] No hay datos, intentando cargar desde localStorage...");
    
    try {
      await ninoStore.initializeFromStorage();
      
      if (!ninoStore.hasData) {
        console.error("❌ [Ejecución] No se pudo cargar niño activo");
        
        await Swal.fire({
          icon: 'warning',
          title: 'No hay niño seleccionado',
          text: 'Por favor, selecciona un niño antes de ejecutar una rutina.',
          confirmButtonText: 'Ir a Mis Hijos',
          confirmButtonColor: '#3b82f6'
        });
        
        router.push({ name: 'parent-mis-hijos' });
        return;
      }
    } catch (error) {
      console.error("❌ [Ejecución] Error al cargar niño:", error);
      router.push({ name: 'parent-rutinas' });
      return;
    }
  }

  // ✅ Verificación final
  if (!childId.value) {
    console.error("❌ [Ejecución] childId es null después de cargar");
    router.push({ name: 'parent-rutinas' });
    return;
  }

  console.log("✅ [Ejecución] Niño activo:", {
    id: childId.value,
    nombre: ninoStore.nombreCompleto
  });
  
  console.log("🔄 [Ejecución] Cargando rutina ID:", props.routineId);
  await loadRoutine();
});

// --- ACCIONES DE LA INTERFAZ ---

const handleStart = (mood) => {
  startRoutine(mood);
};

const handleStepAction = (data) => {
  completeStep(data);
  if (isFinished.value) {
    showSummary.value = true;
  }
};

const handleFinalSubmit = async (finalData) => {
  try {
    Swal.fire({
      title: 'Guardando reporte...',
      html: 'Espera un momento mientras procesamos la información',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    await saveExecutionReport(
      finalData.mood,
      finalData.notes,
      finalData.supportLevel
    );

    await Swal.fire({
      icon: 'success',
      title: '¡Rutina Completada!',
      html: `
        <div style="text-align: left; margin-top: 1rem;">
          <p style="margin-bottom: 0.5rem;"><strong>✅ Reporte guardado exitosamente</strong></p>
          <p style="color: #64748b; font-size: 0.9rem;">
            ${routine.value?.name || 'Rutina'} completada con éxito
          </p>
        </div>
      `,
      confirmButtonText: 'Ver Rutinas',
      confirmButtonColor: '#3b82f6',
      timer: 3000,
      timerProgressBar: true,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });

    router.push({ name: 'parent-rutinas' });

  } catch (error) {
    console.error("❌ [Ejecución] Error al guardar reporte final:", error);
    
    Swal.fire({
      icon: 'error',
      title: 'Error al Guardar',
      html: `
        <div style="text-align: left; margin-top: 1rem;">
          <p style="margin-bottom: 0.5rem;"><strong>No se pudo guardar el reporte</strong></p>
          <p style="color: #64748b; font-size: 0.9rem;">
            ${error.response?.data?.detail || error.message || 'Error desconocido'}
          </p>
        </div>
      `,
      confirmButtonText: 'Reintentar',
      confirmButtonColor: '#3b82f6',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#64748b'
    }).then((result) => {
      if (result.isConfirmed) {
        showSummary.value = true;
      }
    });
  }
};
</script>

<template>
  <div class="execution-mode-container">
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <p class="mt-4 text-gray-500 font-bold">
        Cargando plan de {{ ninoStore.nombreCompleto || 'niño' }}...
      </p>
    </div>

    <template v-else-if="routine">
      <ExecutionHeader 
        :routine-name="routine.name"
        :progress="progressPercentage"
        :elapsed-seconds="totalElapsedSeconds"
        :is-active="isExecuting"
      />

      <main class="execution-content">
        <div v-if="!isExecuting && !isFinished" class="start-screen">
          <div class="welcome-card">
            <span class="child-tag">{{ ninoStore.nombreCompleto }}</span>
            <h1 class="text-2xl font-black text-gray-900 mt-4">¿Cómo está el ánimo de hoy?</h1>
            <p class="text-gray-500 mt-2">Selecciona un estado para iniciar el cronómetro.</p>
            
            <div class="mood-selector">
              <button @click="handleStart('happy')" class="mood-btn">😊 Feliz / Motivado</button>
              <button @click="handleStart('calm')" class="mood-btn">😌 Tranquilo / Estable</button>
              <button @click="handleStart('frustrated')" class="mood-btn">😫 Irritable / Sensible</button>
            </div>
          </div>
        </div>

        <div v-else-if="isExecuting && currentStep" class="active-step-container">
          <StepExecutionCard 
            :step="currentStep"
            @action="handleStepAction"
          />
          
          <button class="btn-help" @click="showStrategies = true">
            💡 Ver Consejos de Apoyo para este paso
          </button>
        </div>
      </main>

      <ExecutionStrategiesDrawer 
        v-if="showStrategies"
        :strategies="routine.strategies"
        @close="showStrategies = false"
      />

      <ExecutionSummaryModal 
        v-if="showSummary"
        @submit="handleFinalSubmit"
        @close="showSummary = false"
      />
    </template>
  </div>
</template>

<style scoped>
.execution-mode-container {
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
}

.execution-content {
  flex: 1;
  padding: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.welcome-card {
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.child-tag {
  background: #e0f2fe;
  color: #0369a1;
  padding: 0.5rem 1.25rem;
  border-radius: 2rem;
  font-weight: 800;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mood-selector {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 2rem;
}

.mood-btn {
  padding: 1.25rem;
  border: 2px solid #f1f5f9;
  border-radius: 1.25rem;
  background: white;
  font-size: 1.1rem;
  font-weight: 700;
  color: #475569;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
}

.mood-btn:hover {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #1e40af;
  transform: scale(1.02);
}

.btn-help {
  margin-top: 2rem;
  width: 100%;
  padding: 1.25rem;
  background: #fef3c7;
  color: #92400e;
  border: none;
  border-radius: 1.25rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>