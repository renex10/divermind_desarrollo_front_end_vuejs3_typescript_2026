<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  step: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['action']);

// --- ESTADO LOCAL ---
const showSupportOptions = ref(false);
const supportNeeded = ref('none');
const notes = ref('');

/**
 * Procesa la acción de marcado y emite los datos al motor de ejecución
 */
const handleMark = (isCompleted, hasDifficulty = false) => {
  const payload = {
    completed: isCompleted,
    had_difficulty: hasDifficulty,
    support_needed: supportNeeded.value,
    notes: notes.value
  };

  emit('action', payload);
  
  // Resetear estado interno para el siguiente paso
  showSupportOptions.value = false;
  supportNeeded.value = 'none';
  notes.value = '';
};

/**
 * Selecciona el nivel de apoyo y marca como completado con dificultad
 */
const selectSupport = (type) => {
  supportNeeded.value = type;
  handleMark(true, true);
};

// Computada para manejar la imagen del pictograma o fallback
const stepImage = computed(() => {
  return props.step.visual_support_image || '/img/placeholder-pictogram.png';
});
</script>

<template>
  <div class="step-card">
    <div class="step-header">
      <span class="step-number">Paso {{ step.order }}</span>
      <span v-if="step.requires_supervision" class="tag-supervision">Requiere Supervisión</span>
    </div>

    <div class="step-visual">
      <img :src="stepImage" :alt="step.action" class="pictogram-img" />
    </div>

    <div class="step-info">
      <h2 class="step-title">{{ step.action }}</h2>
      <p class="step-description">{{ step.description }}</p>
      <div v-if="step.estimated_minutes" class="step-time">
        ⏱️ Tiempo sugerido: {{ step.estimated_minutes }} min
      </div>
    </div>

    <div class="step-actions">
      <template v-if="!showSupportOptions">
        <button class="btn-action btn-success" @click="handleMark(true, false)">
          <span class="icon">✅</span> ¡Logrado solo!
        </button>

        <button class="btn-action btn-warning" @click="showSupportOptions = true">
          <span class="icon">⚠️</span> Necesitó apoyo
        </button>

        <button class="btn-action btn-danger" @click="handleMark(false, true)">
          <span class="icon">❌</span> No se pudo realizar
        </button>
      </template>

      <div v-else class="support-options-grid">
        <p class="support-title">¿Qué tipo de apoyo brindaste?</p>
        <button @click="selectSupport('verbal')">🗣️ Verbal</button>
        <button @click="selectSupport('visual')">🖼️ Visual</button>
        <button @click="selectSupport('physical')">🤝 Físico parcial</button>
        <button @click="selectSupport('full')">♿ Ayuda total</button>
        <button class="btn-back" @click="showSupportOptions = false">Atrás</button>
      </div>
    </div>

    <div class="step-footer">
      <textarea 
        v-model="notes" 
        placeholder="Nota rápida opcional (ej: Hoy se distrajo un poco...)"
        rows="2"
      ></textarea>
    </div>
  </div>
</template>

<style scoped>
.step-card {
  background: white;
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.step-number {
  font-weight: 800;
  color: #3b82f6;
  text-transform: uppercase;
  font-size: 0.875rem;
}

.tag-supervision {
  background: #fff7ed;
  color: #9a3412;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-weight: 600;
}

.step-visual {
  display: flex;
  justify-content: center;
  background: #f8fafc;
  border-radius: 1rem;
  padding: 1rem;
}

.pictogram-img {
  max-height: 180px;
  object-fit: contain;
}

.step-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
}

.step-description {
  color: #475569;
  line-height: 1.5;
  margin-bottom: 0.5rem;
}

.step-time {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.step-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-action {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 1rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: transform 0.1s;
}

.btn-action:active { transform: scale(0.98); }

.btn-success { background: #dcfce7; color: #166534; }
.btn-warning { background: #fef3c7; color: #92400e; }
.btn-danger { background: #fee2e2; color: #991b1b; }

.support-options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  text-align: center;
}

.support-title {
  grid-column: span 2;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.support-options-grid button {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  background: white;
  font-size: 0.875rem;
  cursor: pointer;
}

.btn-back {
  grid-column: span 2;
  margin-top: 0.5rem;
  background: #f1f5f9 !important;
  border: none !important;
}

textarea {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.75rem;
  font-family: inherit;
  resize: none;
}
</style>