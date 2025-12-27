<script setup>
import { computed } from 'vue';

const props = defineProps({
  routineName: {
    type: String,
    default: 'Rutina en curso'
  },
  progress: {
    type: Number,
    default: 0
  },
  elapsedSeconds: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: false
  }
});

/**
 * Formatea los segundos transcurridos a formato MM:SS
 */
const formattedTime = computed(() => {
  const minutes = Math.floor(props.elapsedSeconds / 60);
  const seconds = props.elapsedSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

/**
 * Determina el color de la barra según el progreso
 */
const progressColor = computed(() => {
  if (props.progress < 30) return '#3b82f6'; // Azul
  if (props.progress < 70) return '#6366f1'; // Indigo
  return '#10b981'; // Verde al finalizar
});
</script>

<template>
  <header class="execution-header">
    <div class="header-top">
      <div class="routine-info">
        <span class="status-dot" :class="{ 'is-pulsing': isActive }"></span>
        <h2 class="routine-title">{{ routineName }}</h2>
      </div>
      
      <div class="timer-container">
        <span class="timer-label">Tiempo total</span>
        <span class="timer-value">{{ formattedTime }}</span>
      </div>
    </div>

    <div class="progress-section">
      <div class="progress-bar-container">
        <div 
          class="progress-fill" 
          :style="{ width: `${progress}%`, backgroundColor: progressColor }"
        ></div>
      </div>
      <span class="progress-text">{{ Math.round(progress) }}% completado</span>
    </div>
  </header>
</template>

<style scoped>
.execution-header {
  background: white;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.routine-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-dot {
  width: 10px;
  height: 10px;
  background-color: #94a3b8;
  border-radius: 50%;
}

.status-dot.is-pulsing {
  background-color: #ef4444;
  animation: pulse 1.5s infinite;
}

.routine-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.timer-container {
  text-align: right;
}

.timer-label {
  display: block;
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.timer-value {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-bar-container {
  flex: 1;
  height: 8px;
  background-color: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.5s ease-out, background-color 0.5s ease;
}

.progress-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  min-width: 110px;
  text-align: right;
}

@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}
</style>